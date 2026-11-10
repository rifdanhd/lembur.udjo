"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Check, Clock3, LoaderCircle, MessageCircle, Minus, Plus, RefreshCw, Ticket } from "lucide-react";
import { RESERVATION_URL } from "@/lib/site-domains";
import { rupiah, type Catalog, type Receipt } from "@/lib/ticketing/types";

const dateLabel = (date: string) => new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Jakarta" }).format(new Date(`${date}T00:00:00+07:00`));
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-stone-100";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Layanan belum dapat dihubungi. Silakan coba lagi.");
  return data;
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-7">
    <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold"><span className="flex size-8 items-center justify-center rounded-full bg-forest/5 text-xs font-semibold text-forest">{number}</span>{title}</h2>
    {children}
  </section>;
}

export default function BookingForm({ initialCatalog }: { initialCatalog: Catalog }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [scheduleId, setScheduleId] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<Receipt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState("");
  const key = useRef<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const number = new URLSearchParams(window.location.search).get("pesanan") || sessionStorage.getItem("lembur-ticket-order");
    if (!number || !/^LU-[a-f0-9]{24}$/.test(number)) return;
    let active = true;
    requestJson<Receipt>(`/api/ticketing/orders/${number}`).then((data) => { if (active) setOrder(data); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!order || order.status !== "PENDING") return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((Date.parse(order.expiresAt) - Date.now()) / 1000));
      setRemaining(`${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`);
    };
    const interval = window.setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const quantity = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const total = catalog.products.reduce((sum, product) => sum + product.price * (quantities[product.id] || 0), 0);
  const selectedSchedule = catalog.schedules.find((schedule) => schedule.id === scheduleId);
  const canBook = catalog.state === "available" && catalog.checkoutEnabled;

  async function refreshCatalog() {
    setBusy(true); setError("");
    try { setCatalog(await requestJson<Catalog>("/api/ticketing/catalog")); }
    catch (err) { setError(err instanceof Error ? err.message : "Daftar tiket belum dapat dimuat."); }
    finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canBook || busy) return;
    const form = new FormData(event.currentTarget);
    key.current ||= crypto.randomUUID();
    setBusy(true); setError("");
    try {
      const result = await requestJson<Receipt>("/api/ticketing/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestKey: key.current, scheduleId,
          items: catalog.products.filter((product) => quantities[product.id] > 0).map((product) => ({ productId: product.id, quantity: quantities[product.id] })),
          customer: { name: form.get("name"), email: form.get("email"), whatsapp: form.get("whatsapp") }, consent: form.get("consent") === "on" }),
      });
      setOrder(result); setRemaining(""); sessionStorage.setItem("lembur-ticket-order", result.orderNumber);
      formRef.current?.reset();
      window.setTimeout(() => statusRef.current?.focus(), 0);
    } catch (err) { setError(err instanceof Error ? err.message : "Pesanan belum dapat diproses."); }
    finally { setBusy(false); }
  }

  async function refreshOrder() {
    if (!order) return;
    setBusy(true); setError("");
    try { setOrder(await requestJson<Receipt>(`/api/ticketing/orders/${order.orderNumber}`, { method: "POST" })); }
    catch (err) { setError(err instanceof Error ? err.message : "Status belum dapat diperbarui."); }
    finally { setBusy(false); }
  }

  function startOver() {
    setOrder(null); key.current = null; setError(""); setQuantities({}); setScheduleId(""); setRemaining("");
    sessionStorage.removeItem("lembur-ticket-order");
    window.history.replaceState(null, "", window.location.pathname);
    void refreshCatalog();
  }

  const notice = <div className="mb-6 flex gap-3 rounded-xl border border-amber-800/15 bg-[#fff7e7] p-4 text-sm leading-relaxed text-amber-950">
    <Clock3 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
    <p><strong>Mode uji coba.</strong> Pembayaran di halaman ini merupakan simulasi dan belum berlaku untuk kunjungan.</p>
  </div>;

  if (order) {
    const paid = order.status === "PAID";
    const pending = order.status === "PENDING";
    const review = order.status === "PAYMENT_REVIEW";
    return <div ref={statusRef} tabIndex={-1} className="outline-none">
      {notice}
      <div className="rounded-2xl border border-forest/15 bg-white p-5 sm:p-8">
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-forest/5 text-forest">{paid ? <Check aria-hidden="true" /> : <Ticket aria-hidden="true" />}</div>
        <h2 className="font-playfair text-3xl">{paid ? "Pembayaran uji berhasil." : pending ? "Pesananmu sudah tercatat." : review ? "Pembayaran sedang ditinjau." : "Pesanan telah ditutup."}</h2>
        <p className="mt-3 break-all text-xs tracking-wide text-stone-500">{order.orderNumber}</p>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">{paid ? "Simpan kode tiket uji berikut. Tiket simulasi ini tidak dapat digunakan untuk masuk kawasan." : pending ? "Selesaikan pembayaran sebelum batas waktu. Kuota akan dilepas kembali jika pesanan kedaluwarsa." : review ? "Dana terdeteksi, tetapi pesanan memerlukan pemeriksaan tim. Jangan melakukan pembayaran ulang; hubungi tim reservasi dengan nomor pesanan ini." : order.status === "REFUNDED" ? "Pengembalian dana telah tercatat dan tiket dinonaktifkan." : "Pembayaran tidak selesai atau batas waktunya habis. Silakan buat pesanan baru."}</p>
        <dl className="mt-6 divide-y divide-forest/10 border-y border-forest/10">
          {order.items.map((item, index) => <div key={index} className="py-4"><dt className="text-sm font-semibold">{item.name} × {item.quantity}</dt><dd className="mt-1 text-sm text-stone-500">{dateLabel(item.date)}, {item.session} WIB · {rupiah(item.total)}</dd></div>)}
          <div className="flex items-center justify-between py-5"><dt className="text-sm">Total pembayaran</dt><dd className="text-xl font-semibold">{rupiah(order.totalAmount)}</dd></div>
        </dl>
        {pending && <p className="mt-5 flex items-center gap-2 text-sm"><Clock3 size={16} aria-hidden="true" /> Sisa waktu: <strong aria-live="off">{remaining || "—"}</strong></p>}
        {pending && remaining === "00:00" && <p className="mt-3 text-sm text-stone-600">Batas waktu sudah habis. Perbarui status sebelum melanjutkan.</p>}
        {pending && !order.checkoutUrl && <p className="mt-4 text-sm leading-relaxed text-stone-600">Halaman pembayaran belum tersedia. Perbarui status atau hubungi tim reservasi. Pesanan ini akan berakhir otomatis; jangan membuat pembayaran lain untuk nomor yang sama.</p>}
        {order.tickets.length > 0 && <div className="mt-6 space-y-3">{order.tickets.map((ticket) => <div key={ticket.code} className="rounded-xl border border-dashed border-forest/25 bg-cream p-4"><p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Tiket simulasi · {ticket.status === "ISSUED" ? "Terbit" : ticket.status === "USED" ? "Sudah digunakan" : "Tidak berlaku"}</p><p className="mt-2 break-all font-mono text-sm">{ticket.code}</p></div>)}</div>}
        {error && <p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
        <div className="mt-7 grid gap-3">
          {pending && order.checkoutUrl && remaining !== "00:00" && <a href={order.checkoutUrl} rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white">Lanjutkan pembayaran uji <ArrowRight size={16} aria-hidden="true" /></a>}
          {(pending || review) && <button type="button" onClick={refreshOrder} disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-forest/20 px-5 py-3 text-sm font-semibold disabled:opacity-50"><RefreshCw size={16} className={busy ? "animate-spin" : ""} aria-hidden="true" />Perbarui status pembayaran</button>}
          {review && <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="text-center text-sm underline">Hubungi tim reservasi</a>}
          <button type="button" onClick={startOver} className="min-h-11 text-sm underline underline-offset-4">Kembali ke pilihan tiket</button>
        </div>
      </div>
    </div>;
  }

  return <form ref={formRef} onSubmit={submit} className="space-y-5">
    {notice}
    {!canBook && <div role="status" className="rounded-2xl border border-forest/15 bg-white p-5 sm:p-7">
      <p className="font-semibold">{catalog.state === "unavailable" ? "Daftar tiket sedang tidak tersedia." : "Pemesanan online sedang dipersiapkan."}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{catalog.state === "unavailable" ? "Silakan muat ulang daftar tiket atau hubungi tim reservasi." : "Jadwal dan tiket akan muncul setelah penjualan dibuka. Untuk rencana kunjungan sekarang, tim kami siap membantu lewat WhatsApp."}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3"><a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white"><MessageCircle size={16} aria-hidden="true" />Hubungi tim reservasi</a><button type="button" onClick={refreshCatalog} disabled={busy} className="min-h-11 px-2 text-sm underline disabled:opacity-50">Muat ulang tiket</button></div>
    </div>}
    <Step number="01" title="Pilih waktu berkunjung">
      {catalog.schedules.length ? <label className="block text-sm font-medium" htmlFor="visit-session">Tanggal & sesi
        <select id="visit-session" name="schedule" value={scheduleId} onChange={(event) => setScheduleId(event.target.value)} disabled={!canBook || busy} required className={inputClass}>
          <option value="">Pilih jadwal kunjungan</option>
          {catalog.schedules.map((schedule) => <option key={schedule.id} value={schedule.id} disabled={schedule.available === 0}>{dateLabel(schedule.date)} · {schedule.session} WIB {schedule.available === 0 ? "— Penuh" : `— ${schedule.available} tersedia`}</option>)}
        </select>
      </label> : <p className="flex items-center gap-3 text-sm text-stone-500"><CalendarDays size={19} aria-hidden="true" /> Jadwal kunjungan akan segera tersedia.</p>}
      <p className="mt-3 text-xs leading-relaxed text-stone-500">Seluruh jadwal menggunakan Waktu Indonesia Barat (WIB).</p>
    </Step>
    <Step number="02" title="Siapa yang ikut berkunjung?">
      {catalog.products.length ? <div className="divide-y divide-forest/10">{catalog.products.map((product) => {
        const count = quantities[product.id] || 0;
        return <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{product.name}</h3>{product.description && <p className="mt-1 text-xs leading-relaxed text-stone-500">{product.description}</p>}<p className="mt-2 text-sm font-medium">{rupiah(product.price)} <span className="font-normal text-stone-400">/ orang</span></p></div>
          <div className="flex items-center rounded-xl border border-forest/15"><button type="button" aria-label={`Kurangi ${product.name}`} disabled={!canBook || busy || count === 0} onClick={() => setQuantities((current) => ({ ...current, [product.id]: Math.max(0, count - 1) }))} className="flex size-11 items-center justify-center disabled:opacity-25"><Minus size={15} aria-hidden="true" /></button><output aria-label={`Jumlah ${product.name}`} className="min-w-6 text-center text-sm font-semibold">{count}</output><button type="button" aria-label={`Tambah ${product.name}`} disabled={!canBook || busy || quantity >= 20} onClick={() => setQuantities((current) => ({ ...current, [product.id]: count + 1 }))} className="flex size-11 items-center justify-center disabled:opacity-25"><Plus size={15} aria-hidden="true" /></button></div>
        </div>;
      })}</div> : <p className="text-sm text-stone-500">Kategori dan harga tiket akan diumumkan saat penjualan dibuka.</p>}
      <p className="mt-5 border-t border-forest/10 pt-4 text-xs leading-relaxed text-stone-500">Berkunjung lebih dari 20 orang? <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-forest underline">Bicarakan rencana rombongan dengan kami.</a></p>
    </Step>
    <Step number="03" title="Data pemesan">
      <fieldset disabled={!canBook || busy} className="space-y-4">
        <label className="block text-sm font-medium" htmlFor="buyer-name">Nama lengkap<input id="buyer-name" name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Nama sesuai pemesan" className={inputClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium" htmlFor="buyer-email">Email<input id="buyer-email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="nama@email.com" className={inputClass} /></label><label className="block text-sm font-medium" htmlFor="buyer-whatsapp">Nomor WhatsApp<input id="buyer-whatsapp" name="whatsapp" type="tel" autoComplete="tel" pattern="(\+62|62|0)8[0-9]{7,12}" maxLength={17} required placeholder="08xxxxxxxxxx" className={inputClass} /></label></div>
        <p className="text-xs leading-relaxed text-stone-500">Data ini digunakan untuk memproses dan membantu pengecekan pesananmu.</p>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 pt-1 text-xs leading-relaxed text-stone-600"><input name="consent" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-forest" /><span>Saya menyetujui penggunaan data pemesan untuk pemrosesan pesanan dan memahami bahwa transaksi ini merupakan simulasi.</span></label>
      </fieldset>
    </Step>
    <div className="rounded-2xl bg-forest p-5 text-white sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-white/60">Total pesanan</p><p className="mt-2 text-3xl font-semibold">{rupiah(total)}</p></div><p className="text-sm text-white/70">{quantity} tiket</p></div>
      <p className="mt-4 text-xs leading-relaxed text-white/70">Kuota ditahan selama 15 menit setelah pesanan dibuat. Jumlah akhir dan ketersediaan diperiksa kembali saat melanjutkan.</p>
      {selectedSchedule && quantity > selectedSchedule.available && <p className="mt-3 text-sm text-amber-200">Jumlah tiket melebihi kuota sesi yang tersedia.</p>}
      <button type="submit" disabled={!canBook || busy || !scheduleId || quantity === 0 || quantity > (selectedSchedule?.available || 0)} className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-semibold text-forest transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : null}{busy ? "Memproses pesanan…" : "Buat pesanan uji"}<ArrowRight size={17} aria-hidden="true" /></button>
    </div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"><p>{error}</p><button type="button" onClick={() => { key.current = null; setError(""); }} className="mt-2 min-h-11 underline">Mulai ulang permintaan</button></div>}
  </form>;
}
