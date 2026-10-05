"use client";

import { useState } from "react";
import { SOURCES, STATUSES, statusMeta, type FollowUp, type Lead, type Note } from "@/lib/crm/types";

function fmtDate(d: string | null) {
  if (!d) return "Tanpa tanggal";
  return new Date(d + (d.length === 10 ? "T00:00:00" : "")).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LeadDrawer({
  lead,
  onClose,
  onChange,
}: {
  lead: Lead;
  onClose: () => void;
  onChange: () => Promise<void> | void;
}) {
  const [form, setForm] = useState({
    name: lead.name,
    phone: lead.phone || "",
    email: lead.email || "",
    org: lead.org || "",
    source: lead.source,
    status: lead.status,
    value: lead.value ? String(lead.value) : "",
  });
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const input =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

  async function api(path: string, method: string, body?: unknown) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal memproses");
      await onChange();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const meta = statusMeta(lead.status);
  const dirty =
    form.name !== lead.name ||
    form.phone !== (lead.phone || "") ||
    form.email !== (lead.email || "") ||
    form.org !== (lead.org || "") ||
    form.source !== lead.source ||
    form.status !== lead.status ||
    form.value !== (lead.value ? String(lead.value) : "");

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative w-full sm:w-[440px] h-full bg-white border-l border-stone-200 shadow-2xl flex flex-col">
        <header className="flex items-start gap-3 px-4 sm:px-5 py-4 border-b border-stone-200">
          <div className="min-w-0 flex-1">
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${meta.badge}`}
            >
              {meta.label}
            </span>
            <h2 className="mt-1.5 text-lg font-extrabold tracking-tight text-stone-950 leading-tight break-words">
              {lead.name}
            </h2>
            <p className="text-[11px] text-stone-500">
              Masuk {fmtDate(lead.created_at)} · Sumber {lead.source}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="h-9 w-9 shrink-0 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-6">
          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </p>
          )}

          {/* Kontak cepat */}
          <div className="flex flex-wrap gap-2">
            {lead.phone && (
              <a
                href={`https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-[#25D366] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white hover:brightness-95"
              >
                Chat WhatsApp
              </a>
            )}
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="rounded-lg border border-stone-300 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50"
              >
                Telepon
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="rounded-lg border border-stone-300 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50"
              >
                Email
              </a>
            )}
          </div>

          {/* Detail */}
          <section>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">
              Detail Lead
            </h3>
            <div className="mt-2.5 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Nama
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={`mt-1 ${input}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    WhatsApp
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={`mt-1 ${input}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={`mt-1 ${input}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Instansi
                </label>
                <input
                  value={form.org}
                  onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
                  className={`mt-1 ${input}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Sumber
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
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
                      setForm((f) => ({ ...f, value: e.target.value.replace(/\D/g, "") }))
                    }
                    className={`mt-1 ${input}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Tahap
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s.id }))}
                      className={`rounded-full border px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                        form.status === s.id
                          ? s.badge
                          : "border-stone-200 text-stone-400 hover:border-stone-400"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {dirty && (
                <button
                  disabled={busy || !form.name.trim()}
                  onClick={() =>
                    api(`/api/leads/${lead.id}`, "PATCH", {
                      ...form,
                      value: form.value ? Number(form.value) : null,
                    })
                  }
                  className="w-full rounded-lg bg-forest py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-stone-950 disabled:opacity-50"
                >
                  {busy ? "Menyimpan…" : "Simpan Perubahan"}
                </button>
              )}
            </div>
          </section>

          {/* Catatan */}
          <section>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">
              Catatan
            </h3>
            <div className="mt-2.5 flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && note.trim()) {
                    const ok = await api(`/api/leads/${lead.id}/notes`, "POST", { body: note });
                    if (ok) setNote("");
                  }
                }}
                placeholder="Tambah catatan…"
                className={input}
              />
              <button
                disabled={busy || !note.trim()}
                onClick={async () => {
                  const ok = await api(`/api/leads/${lead.id}/notes`, "POST", { body: note });
                  if (ok) setNote("");
                }}
                className="shrink-0 rounded-lg border border-stone-300 px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 disabled:opacity-50"
              >
                Tambah
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {lead.notes.map((n: Note) => (
                <li
                  key={n.id}
                  className="group rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5"
                >
                  <p className="text-xs text-stone-700 whitespace-pre-wrap break-words">
                    {n.body}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="text-[10px] text-stone-400">{fmtDate(n.created_at)}</span>
                    <button
                      onClick={() => api(`/api/leads/${lead.id}/notes`, "DELETE", { id: n.id })}
                      className="ml-auto text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-rose-600"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
              {lead.notes.length === 0 && (
                <li className="text-[11px] font-semibold text-stone-400">Belum ada catatan.</li>
              )}
            </ul>
          </section>

          {/* Follow-up */}
          <section>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">
              Follow-up &amp; Tugas
            </h3>
            <div className="mt-2.5 flex gap-2">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Mis. Hubungi lagi H-2"
                className={input}
              />
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="rounded-lg border border-stone-300 px-2 py-2 text-xs outline-none focus:border-forest"
              />
              <button
                disabled={busy || !task.trim()}
                onClick={async () => {
                  const ok = await api(`/api/leads/${lead.id}/followups`, "POST", {
                    task,
                    due_at: taskDate || null,
                  });
                  if (ok) {
                    setTask("");
                    setTaskDate("");
                  }
                }}
                className="shrink-0 rounded-lg border border-stone-300 px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 disabled:opacity-50"
              >
                Tambah
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {lead.followups.map((f: FollowUp) => {
                const overdue = !f.done && f.due_at && f.due_at <= new Date().toISOString().slice(0, 10);
                return (
                  <li
                    key={f.id}
                    className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${
                      f.done ? "border-stone-200 bg-stone-50" : "border-stone-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={f.done}
                      onChange={() => api(`/api/leads/${lead.id}/followups`, "PATCH", { id: f.id, done: !f.done })}
                      className="mt-0.5 h-4 w-4 accent-[#14532d]"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold break-words ${
                          f.done ? "text-stone-400 line-through" : "text-stone-800"
                        }`}
                      >
                        {f.task}
                      </p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          overdue ? "font-bold text-rose-600" : "text-stone-400"
                        }`}
                      >
                        {fmtDate(f.due_at)}
                        {overdue ? " · jatuh tempo" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => api(`/api/leads/${lead.id}/followups`, "DELETE", { id: f.id })}
                      className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-rose-600"
                    >
                      Hapus
                    </button>
                  </li>
                );
              })}
              {lead.followups.length === 0 && (
                <li className="text-[11px] font-semibold text-stone-400">Belum ada tugas.</li>
              )}
            </ul>
          </section>

          <section className="pt-2 border-t border-stone-200">
            <button
              disabled={busy}
              onClick={async () => {
                if (!confirm(`Hapus lead "${lead.name}" beserta catatannya?`)) return;
                const ok = await api(`/api/leads/${lead.id}`, "DELETE");
                if (ok) onClose();
              }}
              className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 hover:underline"
            >
              Hapus Lead
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}
