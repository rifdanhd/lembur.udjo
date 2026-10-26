"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RefreshCw,
} from "lucide-react";
import type { Lead } from "@/lib/crm/types";

export default function CrmFollowUps({
  leads,
  today,
  refreshing,
  onRefresh,
  onSelect,
}: {
  leads: Lead[];
  today: string;
  refreshing: boolean;
  onRefresh: () => void;
  onSelect: (id: number) => void;
}) {
  const [showCompleted, setShowCompleted] = useState(false);
  const tasks = useMemo(
    () =>
      leads
        .flatMap((lead) => lead.followups.map((task) => ({ lead, task })))
        .sort(
          (a, b) =>
            (a.task.due_at ?? "9999").localeCompare(b.task.due_at ?? "9999") ||
            a.task.id - b.task.id,
        ),
    [leads],
  );
  const visible = tasks.filter(({ task }) => task.done === showCompleted);

  return (
    <section aria-labelledby="followups-title" aria-busy={refreshing}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-bamboo">Ruang layanan</p>
          <h1
            id="followups-title"
            className="mt-2 text-2xl font-bold tracking-tight text-forest sm:text-3xl"
          >
            Tindak lanjut
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Lihat tugas tim dan buka kontak untuk memperbarui perkembangannya.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
            className={refreshing ? "motion-safe:animate-spin" : ""}
          />
          {refreshing ? "Memperbarui…" : "Perbarui data"}
        </button>
      </div>
      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Status tugas"
      >
        {[false, true].map((done) => (
          <button
            key={String(done)}
            aria-pressed={showCompleted === done}
            onClick={() => setShowCompleted(done)}
            className={`min-h-11 rounded-xl border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${showCompleted === done ? "border-forest bg-forest text-white" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"}`}
          >
            {done ? "Selesai" : "Belum selesai"} ·{" "}
            {tasks.filter(({ task }) => task.done === done).length}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {visible.length ? (
          <ul className="divide-y divide-stone-100">
            {visible.map(({ lead, task }) => {
              const overdue =
                !task.done && task.due_at !== null && task.due_at < today;
              const dueToday = !task.done && task.due_at === today;
              const label = task.done
                ? "Selesai"
                : overdue
                  ? "Terlambat"
                  : dueToday
                    ? "Hari ini"
                    : task.due_at
                      ? "Mendatang"
                      : "Tanpa tanggal";
              const Icon = task.done ? CheckCircle2 : Clock3;
              return (
                <li key={task.id}>
                  <button
                    onClick={() => onSelect(lead.id)}
                    className="flex w-full items-start gap-3 p-4 text-left hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest sm:gap-4 sm:p-5"
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${overdue ? "bg-rose-50 text-rose-700" : "bg-forest/5 text-forest"}`}
                    >
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-stone-900">
                        {task.task}
                      </p>
                      <p className="mt-1 break-words text-sm text-stone-600">
                        {lead.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${overdue ? "bg-rose-50 text-rose-700" : dueToday ? "bg-amber-50 text-amber-800" : "bg-stone-100 text-stone-700"}`}
                        >
                          {label}
                        </span>
                        {task.due_at && (
                          <time
                            dateTime={task.due_at}
                            className="text-xs text-stone-600"
                          >
                            {new Date(
                              `${task.due_at}T00:00:00+07:00`,
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              timeZone: "Asia/Jakarta",
                            })}
                          </time>
                        )}
                      </div>
                    </div>
                    <span className="mt-1 flex shrink-0 items-center gap-1 text-xs font-medium text-forest">
                      <span className="hidden sm:inline">Buka kontak</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <ClipboardList
              size={30}
              className="mx-auto text-forest"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-semibold text-forest">
              {showCompleted
                ? "Belum ada tugas yang selesai"
                : "Tidak ada tugas tertunda"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              {showCompleted
                ? "Tugas yang ditandai selesai akan tampil di sini."
                : "Buka detail kontak untuk menambahkan tugas tindak lanjut baru."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
