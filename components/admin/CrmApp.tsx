"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, RefreshCw, X } from "lucide-react";
import { SOURCES, STATUSES, type Lead, type LeadStatus } from "@/lib/crm/types";
import {
  DASHBOARD_FILTER_LABELS,
  isFollowUpDue,
  jakartaDate,
  matchesDashboardFilter,
  type DashboardFilter,
} from "@/lib/crm/dashboard";
import CrmDashboard from "./CrmDashboard";
import CrmFollowUps from "./CrmFollowUps";
import CrmShell, { type CrmView } from "./CrmShell";
import LeadDrawer from "./LeadDrawer";
import WebsiteImages from "./WebsiteImages";

function rupiah(v: number | null) {
  if (!v) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function CrmApp({
  initialLeads,
  initialError,
  initialToday,
}: {
  initialLeads: Lead[];
  initialError?: string;
  initialToday: string;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [error, setError] = useState(initialError || "");
  const [hasLoaded, setHasLoaded] = useState(!initialError);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<CrmView>("ringkasan");
  const [loggingOut, setLoggingOut] = useState(false);
  const [today, setToday] = useState(initialToday);
  const [dashboardFilter, setDashboardFilter] =
    useState<DashboardFilter>("all");
  const requestId = useRef(0);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dropStatus, setDropStatus] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(jakartaDate()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  async function load() {
    const currentRequest = ++requestId.current;
    setRefreshing(true);
    setNotice("");
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (currentRequest !== requestId.current) return;
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (currentRequest !== requestId.current) return;
      if (!res.ok) throw new Error(data.error || "Gagal memuat data");
      setLeads(data.leads as Lead[]);
      setHasLoaded(true);
      setToday(jakartaDate());
      setError("");
      setNotice("Data berhasil diperbarui.");
    } catch {
      if (currentRequest === requestId.current) {
        setError(
          "Data belum berhasil diperbarui. Periksa koneksi Anda, lalu coba lagi. Jika sebelumnya sudah dimuat, data terakhir tetap ditampilkan.",
        );
      }
    } finally {
      if (currentRequest === requestId.current) setRefreshing(false);
    }
  }

  function viewLeads(filter: DashboardFilter) {
    setView(filter === "reservasi" ? "reservasi" : "kontak");
    setDashboardFilter(filter);
    setSearch("");
    setSourceFilter("");
    window.requestAnimationFrame(() => {
      const section = document.getElementById("daftar-kontak");
      section?.focus({ preventScroll: true });
      section?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
  }

  function navigate(next: CrmView) {
    setView(next);
    setDashboardFilter(next === "reservasi" ? "reservasi" : "all");
    setSearch("");
    setSourceFilter("");
    window.requestAnimationFrame(() => {
      document.getElementById("crm-workspace")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  const navigationCounts = useMemo(
    () => ({
      kontak: leads.length,
      reservasi: leads.filter((lead) => lead.status === "reservasi").length,
      "tindak-lanjut": leads.reduce(
        (sum, lead) => sum + lead.followups.filter((task) => !task.done).length,
        0,
      ),
    }),
    [leads],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (!matchesDashboardFilter(l, dashboardFilter, today)) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      if (!q) return true;
      return [l.name, l.phone, l.email, l.org].some((f) =>
        (f || "").toLowerCase().includes(q),
      );
    });
  }, [leads, search, sourceFilter, dashboardFilter, today]);

  const topSource = useMemo(() => {
    const bySource: Record<string, number> = {};
    leads.forEach((l) => {
      bySource[l.source] = (bySource[l.source] || 0) + 1;
    });
    const top = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : "—";
  }, [leads]);

  async function moveLead(id: number, status: LeadStatus) {
    const previousStatus = leads.find((lead) => lead.id === id)?.status;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setNotice("");
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      setNotice("Status kontak berhasil diperbarui.");
    } catch {
      if (previousStatus)
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id ? { ...lead, status: previousStatus } : lead,
          ),
        );
      setError("Status kontak belum berhasil disimpan. Silakan coba lagi.");
    }
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Gagal keluar");
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
      setError("Belum berhasil keluar dari CRM. Silakan coba lagi.");
    }
  }

  const selected = leads.find((l) => l.id === selectedId) || null;

  return (
    <CrmShell
      view={view}
      counts={hasLoaded ? navigationCounts : {}}
      onNavigate={navigate}
      onAdd={() => setShowNew(true)}
      onLogout={logout}
      loggingOut={loggingOut}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {view === "gambar-beranda" && <WebsiteImages />}
        {view !== "gambar-beranda" && error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {error}
          </div>
        )}

        <p
          role="status"
          aria-live="polite"
          className={
            view !== "gambar-beranda" && (refreshing || notice) ? "mb-4 text-sm text-forest" : "sr-only"
          }
        >
          {refreshing ? "Memuat data terbaru…" : notice}
        </p>

        {view === "ringkasan" && (
          <CrmDashboard
            leads={leads}
            today={today}
            refreshing={refreshing}
            unavailable={!hasLoaded}
            onRefresh={load}
            onAdd={() => setShowNew(true)}
            onSelect={setSelectedId}
            onViewLeads={viewLeads}
          />
        )}

        {view !== "ringkasan" && view !== "gambar-beranda" && !hasLoaded && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h1 className="text-xl font-semibold text-forest">
              Data belum tersedia
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Data belum berhasil dimuat. Coba perbarui data untuk melanjutkan.
            </p>
            <button
              onClick={load}
              disabled={refreshing}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-4 text-sm font-semibold text-forest disabled:opacity-50"
            >
              <RefreshCw size={16} aria-hidden="true" />
              {refreshing ? "Memperbarui…" : "Perbarui data"}
            </button>
          </div>
        )}

        {view === "tindak-lanjut" && hasLoaded && (
          <CrmFollowUps
            leads={leads}
            today={today}
            refreshing={refreshing}
            onRefresh={load}
            onSelect={setSelectedId}
          />
        )}

        {hasLoaded && (view === "kontak" || view === "reservasi") && (
          <section
            id="daftar-kontak"
            tabIndex={-1}
            aria-labelledby="contacts-title"
            className="outline-none"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1
                  id="contacts-title"
                  className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
                >
                  {view === "reservasi"
                    ? "Reservasi"
                    : "Kontak & calon pelanggan"}
                </h1>
                <p className="mt-1 text-sm text-stone-600">
                  Pilih kontak untuk melihat detail dan mengatur tindak lanjut.
                </p>
              </div>
              <button
                onClick={() => viewLeads("all")}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-forest hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <ArrowDown size={16} aria-hidden="true" />
                Semua kontak
              </button>
            </div>
            {dashboardFilter !== "all" && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-forest/5 px-3 py-2 font-medium text-forest">
                  {DASHBOARD_FILTER_LABELS[dashboardFilter]} · {filtered.length}{" "}
                  kontak
                </span>
                <button
                  onClick={() => {
                    setDashboardFilter("all");
                    setView("kontak");
                  }}
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-stone-600 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                >
                  <X size={16} aria-hidden="true" />
                  Hapus filter ringkasan
                </button>
              </div>
            )}

            {/* Filter */}
            <section className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari kontak berdasarkan nama, telepon, email, atau instansi"
                placeholder="Cari nama, telepon, email…"
                className="min-h-11 min-w-0 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-base outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 sm:col-span-2 sm:text-sm xl:col-span-1"
              />
              <select
                value={sourceFilter}
                aria-label="Filter sumber kontak"
                onChange={(e) => setSourceFilter(e.target.value)}
                className="min-h-11 min-w-0 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base outline-none focus:border-forest sm:text-sm"
              >
                <option value="">Semua sumber</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="min-w-0 break-words rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Sumber terbanyak:{" "}
                <span className="text-stone-950">{topSource}</span>
              </div>
            </section>

            {/* Kanban */}
            <section aria-label="Kontak berdasarkan status, geser untuk melihat kolom lainnya" className="mt-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 no-scrollbar pb-4">
              <div className="flex gap-3 sm:gap-4 min-w-max">
                {STATUSES.map((col) => {
                  const items = filtered.filter((l) => l.status === col.id);
                  return (
                    <div
                      key={col.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropStatus(col.id);
                      }}
                      onDragLeave={() =>
                        setDropStatus((s) => (s === col.id ? null : s))
                      }
                      onDrop={(e) => {
                        e.preventDefault();
                        setDropStatus(null);
                        if (dragId != null) moveLead(dragId, col.id);
                        setDragId(null);
                      }}
                      className={`w-[78vw] sm:w-[300px] shrink-0 snap-start rounded-xl border p-2.5 transition-colors ${
                        dropStatus === col.id
                          ? "border-forest bg-forest/5"
                          : "border-stone-200 bg-white/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-stone-700">
                          {col.label}
                        </h2>
                        <span className="ml-auto text-[11px] font-bold text-stone-400">
                          {items.length}
                        </span>
                      </div>

                      <div className="space-y-2 mt-1.5">
                        {items.map((lead) => {
                          const due = lead.followups.filter((f) =>
                            isFollowUpDue(f, today),
                          ).length;
                          return (
                            <article
                              key={lead.id}
                              draggable
                              onDragStart={() => setDragId(lead.id)}
                              onDragEnd={() => setDragId(null)}
                              onClick={() => setSelectedId(lead.id)}
                              className="rounded-lg bg-white border border-stone-200 p-3 cursor-pointer hover:border-stone-950 hover:shadow-sm transition-all"
                            >
                              <p className="break-words text-sm font-bold text-stone-950 leading-snug">
                                {lead.name}
                              </p>
                              {lead.org && (
                                <p className="break-words text-[11px] text-stone-500 mt-0.5">
                                  {lead.org}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stone-500">
                                  {lead.source}
                                </span>
                                {lead.value ? (
                                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                                    {rupiah(lead.value)}
                                  </span>
                                ) : null}
                                {due > 0 && (
                                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                                    {due} tugas jatuh tempo
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-[10px] text-stone-400">
                                {new Date(lead.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </article>
                          );
                        })}

                        {items.length === 0 && (
                          <p className="rounded-lg border border-dashed border-stone-200 px-3 py-5 text-center text-[11px] font-semibold text-stone-400">
                            Belum ada lead
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        )}
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelectedId(null)}
          onChange={load}
        />
      )}

      {showNew && (
        <NewLeadModal
          onClose={() => setShowNew(false)}
          onCreated={async (id) => {
            setShowNew(false);
            await load();
            setSelectedId(id);
          }}
        />
      )}
    </CrmShell>
  );
}

function NewLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: number) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    org: "",
    source: SOURCES[0] as string,
    value: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: form.value ? Number(form.value) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      onCreated(data.id as number);
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  const input =
    "min-h-11 min-w-0 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base sm:text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white border border-stone-200 shadow-xl p-5 sm:p-6 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-stone-950">
            Lead Baru
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="h-11 w-11 shrink-0 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Nama *
            </label>
            <input
              autoFocus
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`mt-1 ${input}`}
              placeholder="Nama kontak / rombongan"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                WhatsApp
              </label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={`mt-1 ${input}`}
                placeholder="0812…"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={`mt-1 ${input}`}
                placeholder="nama@email.com"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Instansi / Perusahaan
            </label>
            <input
              value={form.org}
              onChange={(e) => set("org", e.target.value)}
              className={`mt-1 ${input}`}
              placeholder="Opsional"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Sumber
              </label>
              <select
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                className={`mt-1 ${input}`}
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Nilai (Rp)
              </label>
              <input
                inputMode="numeric"
                value={form.value}
                onChange={(e) =>
                  set("value", e.target.value.replace(/\D/g, ""))
                }
                className={`mt-1 ${input}`}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-stone-300 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-forest py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-stone-950 disabled:opacity-50"
          >
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
