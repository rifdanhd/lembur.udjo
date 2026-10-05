"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SOURCES, STATUSES, type Lead, type LeadStatus } from "@/lib/crm/types";
import LeadDrawer from "./LeadDrawer";

function rupiah(v: number | null) {
  if (!v) return "—";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
}

function isDue(task: { due_at: string | null; done: boolean }) {
  if (task.done || !task.due_at) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.due_at <= today;
}

export default function CrmApp({
  initialLeads,
  initialError,
}: {
  initialLeads: Lead[];
  initialError?: string;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [error, setError] = useState(initialError || "");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dropStatus, setDropStatus] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/leads");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat data");
      setLeads(data.leads as Lead[]);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (sourceFilter && l.source !== sourceFilter) return false;
      if (!q) return true;
      return [l.name, l.phone, l.email, l.org].some((f) => (f || "").toLowerCase().includes(q));
    });
  }, [leads, search, sourceFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const baru = leads.filter((l) => l.status === "baru").length;
    const won = leads.filter((l) => l.status === "selesai").length;
    const due = leads.reduce(
      (acc, l) => acc + l.followups.filter((f) => isDue(f)).length,
      0
    );
    const bySource: Record<string, number> = {};
    leads.forEach((l) => {
      bySource[l.source] = (bySource[l.source] || 0) + 1;
    });
    const top = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
    const pipelineValue = leads
      .filter((l) => l.status === "reservasi" || l.status === "selesai")
      .reduce((acc, l) => acc + (l.value || 0), 0);
    return {
      total,
      baru,
      konversi: total ? Math.round((won / total) * 100) : 0,
      due,
      top: top ? `${top[0]} (${top[1]})` : "—",
      pipelineValue,
    };
  }, [leads]);

  async function moveLead(id: number, status: LeadStatus) {
    const before = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setLeads(before);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const selected = leads.find((l) => l.id === selectedId) || null;

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest">
              Lembur Udjo Parahyangan
            </p>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-stone-950 leading-tight">
              CRM — Lead &amp; Reservasi
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowNew(true)}
              className="rounded-lg bg-forest text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-2.5 hover:bg-stone-950 transition-colors"
            >
              + Lead Baru
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-stone-300 text-stone-600 text-[11px] font-bold uppercase tracking-wider px-3 py-2.5 hover:bg-stone-50 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Statistik */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Lead", value: String(stats.total) },
            { label: "Lead Baru", value: String(stats.baru) },
            { label: "Konversi", value: `${stats.konversi}%` },
            { label: "Follow-up Jatuh Tempo", value: String(stats.due) },
            { label: "Nilai Pipeline", value: rupiah(stats.pipelineValue) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border border-stone-200 p-3.5 sm:p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                {s.label}
              </p>
              <p className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-stone-950 break-words">
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {/* Filter */}
        <section className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, telepon, email…"
            className="flex-1 rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
          >
            <option value="">Semua sumber</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
            Sumber terbanyak: <span className="text-stone-950">{stats.top}</span>
          </div>
        </section>

        {/* Kanban */}
        <section className="mt-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto no-scrollbar pb-4">
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
                    onDragLeave={() => setDropStatus((s) => (s === col.id ? null : s))}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDropStatus(null);
                      if (dragId != null) moveLead(dragId, col.id);
                      setDragId(null);
                    }}
                    className={`w-[78vw] sm:w-[300px] shrink-0 rounded-xl border p-2.5 transition-colors ${
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
                        const due = lead.followups.filter((f) => isDue(f)).length;
                        return (
                          <article
                            key={lead.id}
                            draggable
                            onDragStart={() => setDragId(lead.id)}
                            onDragEnd={() => setDragId(null)}
                            onClick={() => setSelectedId(lead.id)}
                            className="rounded-lg bg-white border border-stone-200 p-3 cursor-pointer hover:border-stone-950 hover:shadow-sm transition-all"
                          >
                            <p className="text-sm font-bold text-stone-950 leading-snug">
                              {lead.name}
                            </p>
                            {lead.org && (
                              <p className="text-[11px] text-stone-500 mt-0.5">{lead.org}</p>
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
                              {new Date(lead.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
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
    </main>
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
        body: JSON.stringify({ ...form, value: form.value ? Number(form.value) : null }),
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
    "w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white border border-stone-200 shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold tracking-tight text-stone-950">Lead Baru</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="h-9 w-9 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
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
                onChange={(e) => set("value", e.target.value.replace(/\D/g, ""))}
                className={`mt-1 ${input}`}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

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
