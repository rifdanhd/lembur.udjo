"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { BookingDate } from "@/lib/ticketing/availability";
import { rupiah } from "@/lib/ticketing/types";

const localDate = (date: string) => new Date(`${date}T12:00:00+07:00`);
const format = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { ...options, timeZone: "Asia/Jakarta" }).format(localDate(date));
export function DateBookingSelector({ dates, value, onChange, loading = false, error, onRetry }: {
  dates: BookingDate[]; value: string; onChange: (date: string) => void; loading?: boolean; error?: string; onRetry?: () => void;
}) {
  const id = useId();
  const row = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [calendar, setCalendar] = useState(false);
  const [message, setMessage] = useState("");
  const selected = dates.find(day => day.date === value && day.status === "available");
  const month = value || dates[0]?.date;
  const visibleDates = dates;
  const [scrollable, setScrollable] = useState({ left: false, right: dates.length > 2 });
  useEffect(() => {
    const container = row.current;
    if (!container) return;
    const update = () => setScrollable({ left: container.scrollLeft > 2, right: container.scrollLeft + container.clientWidth < container.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(container);
    container.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); container.removeEventListener("scroll", update); };
  }, [dates.length, loading, error]);
  useEffect(() => {
    const container = row.current;
    const selectedEl = container?.querySelector<HTMLElement>(`[data-date="${value}"]`);
    if (container && selectedEl) {
      const rect = selectedEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      container.scrollTo({ left: container.scrollLeft + rect.left - containerRect.left - (containerRect.width - rect.width) / 2, behavior: "smooth" });
    }
  }, [value, loading, error]);
  function choose(date: string) {
    if (loading) return;
    if (!dates.some(day => day.date === date && day.status === "available")) { setMessage("Tanggal ini belum tersedia. Pilih tanggal lain."); return; }
    setMessage(""); onChange(date);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(row.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const target = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, current + (event.key === "ArrowRight" ? 1 : -1)));
    event.preventDefault(); buttons[target]?.focus({ preventScroll: true });
    const container = row.current; const button = buttons[target];
    if (container && button) container.scrollTo({ left: container.scrollLeft + button.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - button.clientWidth) / 2, behavior: "smooth" });
  }
  return <section aria-labelledby={`${id}-label`} aria-busy={loading} className="min-w-0 space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 id={`${id}-label`} className="text-sm font-semibold uppercase tracking-[.12em] text-stone-600">Pilih tanggal kunjungan</h3>
        <p className="mt-1 text-xs capitalize text-bamboo font-semibold">{month ? format(month, { month: "long", year: "numeric" }) : "Jadwal kunjungan"} <span className="text-[10px] text-stone-500">· WIB</span></p>
      </div>
      <div className="flex gap-2 sm:order-none">
        <button type="button" aria-label="Tanggal sebelumnya" onClick={() => row.current?.scrollBy({ left: -340, behavior: "smooth" })} disabled={!scrollable.left} className="flex size-11 items-center justify-center rounded-xl border border-bamboo/20 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo"><ChevronLeft size={18} className="text-bamboo" /></button>
        <button type="button" aria-label="Tanggal berikutnya" onClick={() => row.current?.scrollBy({ left: 340, behavior: "smooth" })} disabled={!scrollable.right} className="flex size-11 items-center justify-center rounded-xl border border-bamboo/20 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo"><ChevronRight size={18} className="text-bamboo" /></button>
        <button type="button" aria-label="Buka kalender" aria-expanded={calendar} aria-controls={`${id}-calendar`} onClick={() => { setCalendar(!calendar); }} className="flex size-11 items-center justify-center rounded-xl border border-bamboo/20 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo"><CalendarDays size={18} className="text-bamboo" /></button>
      </div>
    </div>
    {calendar && <div id={`${id}-calendar`} className="rounded-2xl border border-bamboo/20 bg-white p-5 sm:p-6">
      <label htmlFor={`${id}-picker`} className="block text-xs font-semibold uppercase tracking-[.12em] text-stone-600">Cari tanggal melalui kalender</label>
      <input ref={picker} id={`${id}-picker`} type="date" min={dates[0]?.date} max={dates.at(-1)?.date} value={value} onChange={event => choose(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-bamboo/20 bg-white px-3 text-sm focus:border-bamboo focus:ring-2 focus:ring-bamboo/10" />
      <p className="mt-2 text-xs text-stone-500">Tanggal tanpa jadwal dan tanggal habis tidak dapat dipilih.</p>
    </div>}
    {loading && <p role="status" className="rounded-2xl border border-bamboo/20 bg-white p-5 text-sm text-forest">Memuat harga dan ketersediaan…</p>}{error ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}{onRetry && <button type="button" onClick={onRetry} className="ml-3 min-h-11 underline">Coba lagi</button>}</div> : <>
      <div ref={row} onKeyDown={keyboard} role="group" aria-label="Tanggal kunjungan, gunakan tombol panah untuk berpindah" className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 py-3 [scrollbar-width:thin]">
        {visibleDates.map(day => <button key={day.date} type="button" data-date={day.date} disabled={day.status !== "available"} aria-pressed={day.date === selected?.date} onClick={() => choose(day.date)} className={`relative flex min-h-44 w-36 shrink-0 snap-start flex-col items-center justify-center rounded-2xl border px-2 py-4 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo ${day.date === selected?.date ? "border-bamboo bg-bamboo text-white shadow-lg" : day.status === "available" ? "border-bamboo/20 bg-white text-forest hover:bg-white/50 hover:border-bamboo/40" : day.status === "sold_out" ? "cursor-not-allowed border-amber-100 bg-amber-50 text-amber-800" : "cursor-not-allowed border-dashed border-stone-200 bg-stone-50 text-stone-500"}`}>
          {day.date === selected?.date && <Check aria-hidden="true" size={14} className="absolute right-2 top-2 text-white" />}
          <span className="text-[10px] uppercase tracking-wider font-semibold">{format(day.date, { weekday: "long" })}</span>
          <span className="mt-2 text-lg font-semibold tabular-nums">{format(day.date, { day: "numeric" })}</span>
          <span className={`mt-1 text-[10px] capitalize ${day.date === selected?.date ? "text-white/90" : "text-stone-500"}`}>{format(day.date, { month: "short" })}</span>
          <span className="mt-3 text-xs font-semibold">{day.price === null ? "—" : rupiah(day.price)}</span>
          <span className="mt-1 text-[10px]">{day.status === "available" ? "Tersedia" : day.status === "sold_out" ? "Habis" : "Tidak tersedia"}</span>
        </button>)}
      </div>
      {!dates.some(day => day.status === "available") && <p role="status" className="rounded-2xl border border-bamboo/20 bg-white p-4 text-sm text-stone-600">Belum ada tanggal yang dapat dipesan untuk program ini.</p>}
      <p className="text-xs leading-5 text-stone-500">Harga per pengunjung, mulai dari sesi yang tersedia. Harga akhir mengikuti sesi pilihanmu.</p>
    </>}
    <p role="status" aria-live="polite" className="text-xs text-forest">{message || (selected ? `Dipilih: ${format(selected.date, { dateStyle: "full" })}` : "")}</p>
  </section>;
};
