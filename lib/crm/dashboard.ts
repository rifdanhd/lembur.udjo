import type { FollowUp, Lead } from "./types";

export type DashboardFilter =
  "all" | "baru" | "today" | "overdue" | "reservasi";

export const DASHBOARD_FILTER_LABELS: Record<DashboardFilter, string> = {
  all: "Semua kontak",
  baru: "Calon pelanggan baru",
  today: "Tindak lanjut hari ini",
  overdue: "Tindak lanjut terlambat",
  reservasi: "Reservasi aktif",
};

export function jakartaDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isFollowUpDue(task: FollowUp, today: string) {
  return !task.done && task.due_at !== null && task.due_at <= today;
}

export function matchesDashboardFilter(
  lead: Lead,
  filter: DashboardFilter,
  today: string,
) {
  if (filter === "baru" || filter === "reservasi")
    return lead.status === filter;
  if (filter === "today")
    return lead.followups.some((task) => !task.done && task.due_at === today);
  if (filter === "overdue") {
    return lead.followups.some(
      (task) => isFollowUpDue(task, today) && task.due_at! < today,
    );
  }
  return true;
}

export interface DashboardActivity {
  id: string;
  leadId: number;
  name: string;
  kind: "contact" | "note" | "task";
  label: string;
  detail: string;
  at: string;
}

export function buildDashboard(leads: Lead[], today: string) {
  const tasks = leads.flatMap((lead) =>
    lead.followups.map((task) => ({ task, lead })),
  );
  const pending = tasks.filter(({ task }) => !task.done);
  const due = pending
    .filter(({ task }) => isFollowUpDue(task, today))
    .sort(
      (a, b) =>
        a.task.due_at!.localeCompare(b.task.due_at!) || a.task.id - b.task.id,
    );
  const activities: DashboardActivity[] = leads.flatMap((lead) => [
    {
      id: `contact-${lead.id}`,
      leadId: lead.id,
      name: lead.name,
      kind: "contact" as const,
      label: "Kontak ditambahkan",
      detail: `Sumber: ${lead.source}`,
      at: lead.created_at,
    },
    ...lead.notes.map((note) => ({
      id: `note-${note.id}`,
      leadId: lead.id,
      name: lead.name,
      kind: "note" as const,
      label: "Catatan ditambahkan",
      detail: note.body,
      at: note.created_at,
    })),
    ...lead.followups.map((task) => ({
      id: `task-${task.id}`,
      leadId: lead.id,
      name: lead.name,
      kind: "task" as const,
      label: "Tindak lanjut ditambahkan",
      detail: task.task,
      at: task.created_at,
    })),
  ]);
  const completed = leads.filter((lead) => lead.status === "selesai").length;

  return {
    total: leads.length,
    baru: leads.filter((lead) => lead.status === "baru").length,
    today: due.filter(({ task }) => task.due_at === today).length,
    overdue: due.filter(({ task }) => task.due_at! < today).length,
    reservations: leads.filter((lead) => lead.status === "reservasi").length,
    pending: pending.length,
    unscheduled: pending.filter(({ task }) => !task.due_at).length,
    completed,
    conversion: leads.length ? Math.round((completed / leads.length) * 100) : 0,
    value: leads
      .filter(
        (lead) => lead.status === "reservasi" || lead.status === "selesai",
      )
      .reduce((sum, lead) => sum + (lead.value ?? 0), 0),
    due,
    activities: activities
      .filter((activity) => Number.isFinite(Date.parse(activity.at)))
      .sort(
        (a, b) =>
          Date.parse(b.at) - Date.parse(a.at) || a.id.localeCompare(b.id),
      )
      .slice(0, 6),
  };
}
