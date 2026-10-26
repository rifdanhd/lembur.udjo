"use client";

import { useMemo } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MessageSquareText,
  RefreshCw,
  Sprout,
  UserPlus,
  Users,
} from "lucide-react";
import {
  buildDashboard,
  jakartaDate,
  type DashboardFilter,
} from "@/lib/crm/dashboard";
import type { Lead } from "@/lib/crm/types";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2";

function formatDay(day: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${day}T00:00:00+07:00`));
}

function activityTime(at: string, today: string) {
  const date = new Date(at);
  const day = jakartaDate(date);
  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day === today ? "Hari ini" : formatDay(day)} · ${time} WIB`;
}

export default function CrmDashboard({
  leads,
  today,
  refreshing,
  unavailable,
  onRefresh,
  onAdd,
  onSelect,
  onViewLeads,
}: {
  leads: Lead[];
  today: string;
  refreshing: boolean;
  unavailable: boolean;
  onRefresh: () => void;
  onAdd: () => void;
  onSelect: (id: number) => void;
  onViewLeads: (filter: DashboardFilter) => void;
}) {
  const data = useMemo(() => buildDashboard(leads, today), [leads, today]);
  const cards = [
    {
      label: "Calon pelanggan baru",
      value: data.baru,
      hint: "Siap disapa pertama kali",
      icon: UserPlus,
      filter: "baru" as const,
      tone: "bg-emerald-50 text-forest",
    },
    {
      label: "Tindak lanjut hari ini",
      value: data.today,
      hint: "Tugas yang perlu dikerjakan",
      icon: CalendarDays,
      filter: "today" as const,
      tone: "bg-amber-50 text-amber-800",
    },
    {
      label: "Tindak lanjut terlambat",
      value: data.overdue,
      hint: "Utamakan untuk ditindaklanjuti",
      icon: Clock3,
      filter: "overdue" as const,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "Reservasi aktif",
      value: data.reservations,
      hint: "Kontak dalam tahap reservasi",
      icon: ClipboardList,
      filter: "reservasi" as const,
      tone: "bg-stone-100 text-stone-700",
    },
  ];

  return (
    <section aria-labelledby="dashboard-title" aria-busy={refreshing}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-bamboo">
            Ruang layanan · {formatDay(today)}
          </p>
          <h1
            id="dashboard-title"
            className="mt-2 text-2xl font-bold tracking-tight text-forest sm:text-3xl"
          >
            Selamat datang, tim Udjo.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
            Sambut calon pengunjung dan lihat hal yang perlu ditangani hari ini.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60 ${focus}`}
        >
          <RefreshCw
            aria-hidden="true"
            size={16}
            className={refreshing ? "motion-safe:animate-spin" : ""}
          />
          {refreshing ? "Memperbarui…" : "Perbarui data"}
        </button>
      </div>

      {unavailable ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-white p-6">
          <h2 className="font-semibold text-stone-900">
            Ringkasan belum tersedia
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Data belum berhasil dimuat. Tekan “Perbarui data” untuk mencoba
            lagi.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ label, value, hint, icon: Icon, filter, tone }) => (
              <button
                key={filter}
                onClick={() => onViewLeads(filter)}
                className={`group min-w-0 rounded-2xl border border-stone-200 bg-white p-4 text-left transition-colors hover:border-forest/40 sm:p-5 ${focus}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-stone-500 transition-colors group-hover:text-forest"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-forest">
                  {value.toLocaleString("id-ID")}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-stone-800">
                  {label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-stone-600">
                  {hint}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-600">
            Angka tindak lanjut menghitung tugas, bukan jumlah kontak. Semua
            tanggal mengikuti WIB.
          </p>

          {leads.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-forest/5 text-forest">
                <Sprout size={24} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-forest">
                Mulai dari sapaan pertama.
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600">
                Tambahkan calon pelanggan pertama untuk mencatat kebutuhan
                kunjungan dan mengatur tindak lanjutnya.
              </p>
              <button
                onClick={onAdd}
                className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-light ${focus}`}
              >
                <UserPlus size={18} aria-hidden="true" />
                Tambah calon pelanggan
              </button>
            </div>
          ) : (
            <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
              <section
                className="min-w-0 rounded-2xl border border-stone-200 bg-white"
                aria-labelledby="priority-title"
              >
                <div className="border-b border-stone-100 p-5">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={18}
                      className="text-bamboo"
                      aria-hidden="true"
                    />
                    <h2
                      id="priority-title"
                      className="text-base font-semibold text-forest"
                    >
                      Prioritas tindak lanjut
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    {data.due.length
                      ? `${data.due.length} tugas perlu perhatian, yang terlambat ditampilkan lebih dulu.`
                      : "Tugas hari ini dan yang terlambat akan tampil di sini."}
                  </p>
                </div>
                {data.due.length ? (
                  <ul className="divide-y divide-stone-100">
                    {data.due.slice(0, 5).map(({ lead, task }) => {
                      const overdue = task.due_at! < today;
                      return (
                        <li key={task.id}>
                          <button
                            onClick={() => onSelect(lead.id)}
                            className={`flex min-h-20 w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-cream ${focus}`}
                            aria-label={`Buka ${lead.name}: ${task.task}`}
                          >
                            <span
                              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${overdue ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}
                            >
                              <Clock3 size={16} aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-semibold text-stone-900">
                                {lead.name}
                              </p>
                              <p className="mt-1 line-clamp-2 break-words text-sm text-stone-600">
                                {task.task}
                              </p>
                              <p
                                className={`mt-2 text-xs font-medium ${overdue ? "text-rose-700" : "text-amber-800"}`}
                              >
                                {overdue
                                  ? `Terlambat · ${formatDay(task.due_at!)}`
                                  : "Hari ini"}
                              </p>
                            </div>
                            <ArrowUpRight
                              size={16}
                              className="mt-1 shrink-0 text-stone-500"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-5 py-8">
                    <CheckCircle2
                      size={28}
                      className="text-forest"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-semibold text-stone-800">
                      Tidak ada tugas jatuh tempo.
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      Buka detail kontak untuk menjadwalkan tindak lanjut
                      berikutnya.
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-stone-100 px-5 py-3 text-xs text-stone-600">
                  <span>{data.pending} tugas belum selesai</span>
                  <span>{data.unscheduled} tanpa tanggal</span>
                </div>
                {data.due.length > 5 && (
                  <p className="px-5 pb-4 text-xs text-stone-600">
                    Menampilkan 5 dari {data.due.length} tugas. Buka kartu
                    ringkasan untuk melihat kontak terkait.
                  </p>
                )}
              </section>

              <section
                className="min-w-0 rounded-2xl border border-stone-200 bg-white"
                aria-labelledby="activity-title"
              >
                <div className="border-b border-stone-100 p-5">
                  <div className="flex items-center gap-2">
                    <MessageSquareText
                      size={18}
                      className="text-bamboo"
                      aria-hidden="true"
                    />
                    <h2
                      id="activity-title"
                      className="text-base font-semibold text-forest"
                    >
                      Aktivitas terbaru
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    Kontak, catatan, dan tugas yang baru ditambahkan.
                  </p>
                </div>
                {data.activities.length ? (
                  <ul className="divide-y divide-stone-100">
                    {data.activities.map((activity) => {
                      const Icon =
                        activity.kind === "contact"
                          ? UserPlus
                          : activity.kind === "note"
                            ? MessageSquareText
                            : CalendarDays;
                      return (
                        <li key={activity.id}>
                          <button
                            onClick={() => onSelect(activity.leadId)}
                            className={`flex min-h-20 w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-cream ${focus}`}
                          >
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-forest/5 text-forest">
                              <Icon size={16} aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-semibold text-stone-900">
                                {activity.name}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-stone-600">
                                {activity.label}
                              </p>
                              <p className="mt-1 line-clamp-1 break-words text-sm text-stone-600">
                                {activity.detail}
                              </p>
                              <time
                                dateTime={activity.at}
                                className="mt-2 block text-xs text-stone-600"
                              >
                                {activityTime(activity.at, today)}
                              </time>
                            </div>
                            <ArrowUpRight
                              size={16}
                              className="mt-1 shrink-0 text-stone-500"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="p-5 text-sm text-stone-600">
                    Belum ada aktivitas tercatat.
                  </p>
                )}
              </section>
            </div>
          )}

          <div className="mt-5 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm sm:grid-cols-3 sm:p-5">
            <button
              onClick={() => onViewLeads("all")}
              className={`flex min-h-11 items-center justify-between gap-3 rounded-lg text-left sm:justify-start ${focus}`}
            >
              <Users
                size={18}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
              <span className="flex-1 text-stone-600">
                Total kontak{" "}
                <strong className="ml-1 font-semibold text-forest">
                  {data.total.toLocaleString("id-ID")}
                </strong>
              </span>
              <ArrowDown size={16} aria-hidden="true" />
            </button>
            <p className="flex min-h-11 items-center gap-3">
              <CheckCheck
                size={18}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
              <span className="text-stone-600">
                Konversi{" "}
                <strong className="ml-1 font-semibold text-forest">
                  {data.conversion}%
                </strong>
                <span className="ml-1 text-xs">({data.completed} selesai)</span>
              </span>
            </p>
            <p className="flex min-h-11 items-center gap-3">
              <ClipboardList
                size={18}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
              <span className="min-w-0 text-stone-600">
                Nilai reservasi &amp; selesai{" "}
                <strong className="block break-words font-semibold text-forest">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(data.value)}
                </strong>
              </span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}
