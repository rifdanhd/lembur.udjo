"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, ShoppingBag, Trash2, Clock3, CheckCircle2 } from "lucide-react";
import { categories, catalogCategories, categoryProducts, categoryBySlug, cartSchema, type CartLine } from "@/lib/ticketing/portal-data";
import { type Catalog, type Receipt, rupiah } from "@/lib/ticketing/types";
import { CART_KEY, CART_EVENT } from "./PortalChrome";
import { DateBookingSelector } from "./DateBookingSelector";
import { bookingDates, jakartaDate, pricedSessions, selectedPrice } from "@/lib/ticketing/availability";

const field = "mt-2 min-h-12 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:bg-stone-100";
const primary = "inline-flex min-h-12 items-center justify-center gap-2 text-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40";
function subscribe(callback: () => void) { window.addEventListener(CART_EVENT, callback); window.addEventListener("storage", callback); return () => { window.removeEventListener(CART_EVENT, callback); window.removeEventListener("storage", callback); }; }
function snapshot() { try { return localStorage.getItem(CART_KEY) || "[]"; } catch { return "[]"; } }
function useCart() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => { try { const parsed = cartSchema.safeParse(JSON.parse(raw)); return parsed.success ? parsed.data : []; } catch { return []; } }, [raw]);
}
function storeCart(lines: CartLine[]) {
  const parsed = cartSchema.safeParse(lines);
  if (!parsed.success) throw new Error("Maksimal 20 pengunjung dan 10 pilihan per keranjang.");
  try { localStorage.setItem(CART_KEY, JSON.stringify(parsed.data)); window.dispatchEvent(new Event(CART_EVENT)); }
  catch { throw new Error("Penyimpanan browser belum tersedia. Aktifkan penyimpanan untuk menggunakan keranjang."); }
}
const dateLabel = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(`${value}T00:00:00+07:00`));

export function SelectTicket({ category, catalog: initialCatalog, initialProductId }: { category: string; catalog: Catalog; initialProductId?: string }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  async function refreshCatalog(signal?: AbortSignal) {
    try {
      const response = await fetch("/api/ticketing/catalog", { cache: "no-store", signal });
      if (!response.ok) throw new Error("Harga dan jadwal belum dapat dimuat.");
      setCatalog(await response.json());
    } catch { if (!signal?.aborted) setLoadError("Harga dan jadwal belum dapat dimuat. Silakan coba lagi."); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/ticketing/catalog", { cache: "no-store", signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { if (!controller.signal.aborted) { setCatalog(data); setLoading(false); } })
      .catch(() => { if (!controller.signal.aborted) { setLoadError("Harga dan jadwal belum dapat dimuat. Silakan coba lagi."); setLoading(false); } });
    return () => controller.abort();
  }, []);
  const info = catalogCategories(catalog).find(item => item.slug === category) || categories[0];
  const officialProducts = categoryProducts(catalog, info);
  const [productChoice, setProductId] = useState(officialProducts.find(product => product.id === initialProductId)?.id || officialProducts[0]?.id || "");
  const productId = officialProducts.find(product => product.id === productChoice)?.id || officialProducts[0]?.id || "";
  const example = officialProducts.length === 0;
  const [date, setDate] = useState("");
  const [session, setSession] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const lines = useCart();
  const today = jakartaDate();
  const dates = bookingDates(catalog, productId, today);
  const selectedDate = dates.some(day => day.date === date && day.status === "available") ? date : dates.find(day => day.status === "available")?.date || "";
  const sessions = pricedSessions(catalog, productId, selectedDate).filter(item => item.date === selectedDate);
  const chosenSession = sessions.find(item => item.id === scheduleId && item.available > 0) || sessions.find(item => item.available > 0);
  const actualScheduleId = chosenSession?.id || "";
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setAdded(false);
    const schedule = chosenSession;
    if (!example && (loading || loadError)) { setError("Tunggu harga dan jadwal terbaru sebelum melanjutkan."); return; }
    if (!example && (!schedule || !productId)) { setError("Pilih tiket dan jadwal yang tersedia."); return; }
    if (!example && schedule && quantity > schedule.available) { setError("Jumlah pengunjung melebihi ketersediaan sesi ini."); return; }
    const selectedDate = example ? date : schedule!.date;
    const selectedSession = example ? session : schedule!.session;
    if (selectedDate < today) { setError("Pilih tanggal rencana hari ini atau setelahnya."); return; }
    const id = `${info.slug}:${productId || "contoh"}:${selectedDate}:${actualScheduleId || selectedSession}`;
    const existing = lines.find(line => line.id === id);
    if (!example && schedule && quantity + (existing?.quantity || 0) > schedule.available) { setError("Jumlah di keranjang melebihi kuota sesi."); return; }
    const line: CartLine = { id, category: info.slug, categoryName: info.name, date: selectedDate, session: selectedSession, quantity: quantity + (existing?.quantity || 0), example, ...(!example ? { productId, scheduleId: actualScheduleId } : {}) };
    try { storeCart([...lines.filter(item => item.id !== id), line]); setAdded(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Keranjang belum dapat diperbarui."); }
  }
  return <form onSubmit={add} className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)]">
    <div className="min-w-0 space-y-6 rounded-2xl border border-forest/10 bg-white p-6 sm:p-8">
      <div className="relative aspect-[16/7] overflow-hidden rounded-xl"><Image src={officialProducts.find(item => item.id === productId)?.imagePath || info.image} alt={officialProducts.find(item => item.id === productId)?.name || info.name} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" /></div><h2 className="font-playfair text-2xl">{officialProducts.find(item => item.id === productId)?.name || "Rencanakan kunjunganmu"}</h2>{!example && <><p className="text-sm leading-7 text-stone-600">{officialProducts.find(item => item.id === productId)?.description}</p>{officialProducts.find(item => item.id === productId)?.policy && <div className="rounded-xl bg-cream p-4 text-sm leading-6"><h3 className="font-semibold">Ketentuan kunjungan</h3><p className="mt-2 whitespace-pre-line">{officialProducts.find(item => item.id === productId)?.policy}</p></div>}</>}
      {example && <p className="rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-950"><strong>Contoh — belum resmi.</strong> Pilihan ini menyimpan rencana pribadi, bukan reservasi. Tanggal dan sesi masih harus dikonfirmasi tim.</p>}
      {!example && <label className="block text-sm font-medium">Jenis tiket<select value={productId} onChange={event => { setProductId(event.target.value); setDate(""); setScheduleId(""); setLoading(true); setLoadError(""); void refreshCatalog(); }} required className={field}>{officialProducts.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>}
      {example ? <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium" htmlFor="plan-date">Tanggal rencana<input id="plan-date" name="date" type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required className={field} /><span className="mt-2 block text-xs font-normal text-stone-500">Belum merupakan jadwal resmi.</span></label><label className="block text-sm font-medium" htmlFor="plan-session">Preferensi sesi<select id="plan-session" value={session} onChange={e => setSession(e.target.value)} required className={field}><option value="">Pilih preferensi</option><option value="pagi">Pagi — contoh preferensi</option><option value="siang">Siang — contoh preferensi</option></select><span className="mt-2 block text-xs font-normal text-stone-500">Jam resmi belum diumumkan.</span></label></div> : <><DateBookingSelector dates={dates} value={selectedDate} onChange={value => { setDate(value); setScheduleId(""); setAdded(false); setLoading(true); setLoadError(""); void refreshCatalog(); }} loading={loading} error={loadError || (catalog.state === "unavailable" ? "Jadwal belum dapat dimuat." : "")} onRetry={() => { setLoading(true); setLoadError(""); void refreshCatalog(); }} /><label className="block text-sm font-medium">Sesi kunjungan<select value={actualScheduleId} onChange={e => setScheduleId(e.target.value)} required disabled={loading || Boolean(loadError) || !chosenSession} className={field}>{!chosenSession && <option value="">Belum ada sesi tersedia</option>}{sessions.map(s => <option key={s.id} value={s.id} disabled={s.available === 0}>{s.session} WIB · {s.available ? `${s.available} tersedia` : "Habis"} · {rupiah(s.price)}</option>)}</select></label></>}
      <label className="block max-w-xs text-sm font-medium" htmlFor="visitor-count">Jumlah pengunjung<input id="visitor-count" name="quantity" type="number" min={1} max={20} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required className={field} /></label>
      <p className="text-xs leading-6 text-stone-500">Maksimal 20 pengunjung di keranjang. Untuk rombongan lebih besar, kunjungi <Link href="/bantuan" className="underline">halaman bantuan</Link>.</p>
    </div>
    <aside className="h-fit rounded-2xl border border-forest/10 bg-[#eeeee5] p-6 sm:p-8"><p className="text-[10px] uppercase tracking-widest text-stone-500">Pilihan kamu</p><h2 className="mt-3 font-playfair text-2xl">{info.name}</h2><p className="mt-4 text-sm leading-7 text-stone-600">{info.description}</p><p className="mt-5 border-t border-forest/10 pt-5 text-sm font-semibold">{example ? "Harga menunggu konfirmasi" : chosenSession ? rupiah(chosenSession.price * quantity) : "Pilih jadwal tersedia"}</p><button type="submit" disabled={!example && (loading || Boolean(loadError) || !chosenSession)} className={`${primary} mt-6 w-full`}><ShoppingBag size={17} />Tambahkan ke keranjang</button>
      {added && <div role="status" className="mt-5 text-sm"><p className="flex gap-2"><CheckCircle2 size={18} />Rencana ditambahkan.</p><Link href="/keranjang" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold underline">Lihat keranjang <ArrowRight size={16} /></Link></div>}{error && <p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
    </aside>
  </form>;
}

export function CartContents({ summary = false }: { summary?: boolean }) {
  const lines = useCart(); const [error, setError] = useState("");
  function update(id: string, quantity: number) { try { storeCart(quantity ? lines.map(line => line.id === id ? { ...line, quantity } : line) : lines.filter(line => line.id !== id)); setError(""); } catch (err) { setError(err instanceof Error ? err.message : "Perubahan belum tersimpan."); } }
  if (!lines.length) return <div className="rounded-2xl border border-forest/10 bg-white p-8 text-center sm:p-12"><ShoppingBag className="mx-auto text-forest/40" size={36} /><h2 className="mt-5 font-playfair text-2xl">Keranjang masih kosong</h2><p className="mt-3 text-sm leading-7 text-stone-500">Jelajahi kategori dan susun rencana kunjungan terlebih dahulu.</p><Link href="/order-tickets" className={`${primary} mt-6`}>Pilih kategori tiket <ArrowRight size={16} /></Link></div>;
  return <div className="space-y-5"><div className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white px-5 sm:px-7">{lines.map(line => <article key={line.id} className="py-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-widest text-amber-800">{line.example ? "Contoh — belum resmi" : "Pilihan tiket"}</p><h2 className="mt-2 font-semibold">{line.categoryName || categoryBySlug(line.category)?.name || line.category}</h2><p className="mt-2 text-xs leading-6 text-stone-500">{dateLabel(line.date)} · {line.session}{line.example ? " (preferensi)" : " WIB"}</p></div>{!summary && <button type="button" onClick={() => update(line.id, 0)} aria-label={`Hapus ${line.categoryName || categoryBySlug(line.category)?.name || line.category}`} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-forest/10"><Trash2 size={16} /></button>}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3">{summary ? <p className="text-sm">{line.quantity} pengunjung</p> : <label className="flex items-center gap-3 text-xs">Pengunjung<input type="number" min={1} max={20} value={line.quantity} aria-label={`Jumlah ${line.categoryName || categoryBySlug(line.category)?.name || line.category}`} onChange={e => { const value = Number(e.target.value); if (Number.isInteger(value) && value >= 1) update(line.id, value); }} className="min-h-11 w-20 rounded-lg border border-forest/20 px-3" /></label>}<p className="text-xs font-medium text-stone-500">{line.example ? "Harga belum diumumkan" : "Harga dihitung di checkout"}</p></div></article>)}</div>
      <div className="rounded-2xl bg-forest p-6 text-white"><p className="text-sm font-semibold">{lines.reduce((sum, line) => sum + line.quantity, 0)} pengunjung dalam rencana</p><p className="mt-3 text-xs leading-6 text-white/70">Keranjang belum menahan kuota. Data contoh tidak dapat dibayar dan belum menjadi pesanan.</p>{!summary && <Link href="/checkout" className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest">Lanjut ke checkout <ArrowRight size={16} /></Link>}</div>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}{!summary && <Link href="/order-tickets" className="inline-flex min-h-11 items-center text-sm underline">Tambahkan pilihan lain</Link>}
    </div>;
}

export function PortalCheckout({ visitor, catalog }: { visitor: { name: string; email: string }; catalog: Catalog }) {
  const router = useRouter();
  const lines = useCart(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const key = useRef<string | null>(null);
  const hasExample = lines.some(line => line.example);
  const stale = lines.some(line => !line.example && !pricedSessions(catalog, line.productId || "", line.date).some(schedule => schedule.id === line.scheduleId && schedule.session === line.session && schedule.available >= lines.filter(item => item.scheduleId === line.scheduleId).reduce((sum, item) => sum + item.quantity, 0)));
  const official = lines.length > 0 && !hasExample && !stale;
  const oneSession = new Set(lines.map(line => line.scheduleId)).size === 1;
  const canPay = official && oneSession && catalog.checkoutEnabled;
  const blockers = [
    ...(catalog.checkoutEnabled ? [] : ["Pembayaran belum diaktifkan tim."]),
    ...(hasExample ? ["Keranjang memuat rencana contoh (belum resmi). Data contoh tidak dapat dibayar — hapus baris bertanda “Contoh — belum resmi” di keranjang."] : []),
    ...(stale ? ["Sesi pada keranjang sudah tidak tersedia atau kuotanya habis. Hapus baris itu, lalu pilih jadwal yang masih dibuka."] : []),
    ...(!oneSession && official ? ["Satu pesanan hanya dapat berisi satu sesi. Pisahkan rencana kunjungan yang berbeda."] : []),
    ...(lines.length > 0 && !hasExample && !stale && catalog.state !== "available" ? ["Penjualan tiket sedang ditutup. Belum ada jadwal resmi yang dibuka."] : []),
  ];
  const total = official ? lines.reduce((sum, line) => sum + (selectedPrice(catalog, line.productId || "", line.scheduleId || "") || 0) * line.quantity, 0) : null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!canPay || busy) return;
    const form = new FormData(event.currentTarget); setBusy(true); setError(""); key.current ||= crypto.randomUUID();
    const quantities = new Map<string, number>(); for (const line of lines) quantities.set(line.productId!, (quantities.get(line.productId!) || 0) + line.quantity);
    try {
      const response = await fetch("/api/ticketing/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestKey: key.current, scheduleId: lines[0].scheduleId, items: [...quantities].map(([productId, quantity]) => ({ productId, quantity })), customer: { name: form.get("name"), email: visitor.email, whatsapp: form.get("whatsapp") }, consent: form.get("consent") === "on" }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Pesanan belum dapat dibuat.");
      storeCart([]); router.push(`/pesanan/${data.orderNumber}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Layanan belum dapat dihubungi."); }
    finally { setBusy(false); }
  }
  return <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_.9fr]"><form onSubmit={submit} className="space-y-5 rounded-2xl border border-forest/10 bg-white p-6 sm:p-8"><h2 className="font-playfair text-2xl text-forest">Data pemesan</h2><label className="block text-sm font-medium text-forest">Nama lengkap<input name="name" defaultValue={visitor.name} minLength={2} maxLength={100} required className={field} /></label><label className="block text-sm font-medium text-forest">Email akun<input name="email" type="email" value={visitor.email} readOnly className={`${field} bg-white`} /></label><label className="block text-sm font-medium text-forest">Nomor WhatsApp<input name="whatsapp" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" pattern="(\+62|62|0)8[0-9]{7,12}" maxLength={17} required className={field} /></label><label className="flex items-start gap-3 text-xs leading-6 text-stone-600"><input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-bamboo" />Saya menyetujui penggunaan data pemesan untuk memproses pesanan ini.</label>
      {blockers.length > 0 && <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-6 text-amber-900"><strong>Pesanan belum dapat dibuat.</strong><ul className="mt-2 list-disc space-y-1 pl-4">{blockers.map(blocker => <li key={blocker}>{blocker}</li>)}</ul>{lines.length > 0 && <Link href="/keranjang" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-bamboo underline underline-offset-4">Kelola keranjang <ArrowRight size={15} /></Link>}</div>}<p className="text-sm font-semibold text-forest flex justify-between"><span>Total pembayaran</span><span className="text-xl font-bold text-forest">{total === null ? "belum dihitung" : rupiah(total)}</span></p><button type="submit" disabled={!canPay || busy} className={`${primary} w-full`}>{busy ? "Memproses…" : "Buat pesanan & lanjut pembayaran"}</button>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}<Link href="/pesanan/contoh" className="inline-flex min-h-11 items-center gap-2 text-xs underline">Lihat contoh halaman status <ArrowRight size={15} /></Link></form><aside className="space-y-4"><h2 className="text-sm font-semibold text-forest uppercase tracking-[.12em]">Ringkasan rencana</h2><CartContents summary /></aside></div>;
}

export function OrderStatus({ initial }: { initial: Receipt }) {
  const [order, setOrder] = useState(initial); const [remaining, setRemaining] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (order.status !== "PENDING") return; const timer = setInterval(() => { const seconds = Math.max(0, Math.ceil((Date.parse(order.expiresAt) - Date.now()) / 1000)); setRemaining(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`); }, 1000); return () => clearInterval(timer); }, [order]);
  async function refresh() { setBusy(true); setError(""); try { const response = await fetch(`/api/ticketing/orders/${order.orderNumber}`, { method: "POST" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setOrder(data); } catch (err) { setError(err instanceof Error ? err.message : "Status belum dapat diperbarui."); } finally { setBusy(false); } }
  const labels: Record<string,string> = { PENDING: "Menunggu pembayaran", PAID: "Pembayaran terkonfirmasi", EXPIRED: "Batas pembayaran habis", CANCELLED: "Pesanan dibatalkan", REFUNDED: "Dana dikembalikan", PAYMENT_REVIEW: "Perlu pemeriksaan tim" };
  return <div className="max-w-3xl rounded-2xl border border-forest/10 bg-white p-6 sm:p-9"><p className="break-all text-xs text-stone-500">{order.orderNumber}</p><h2 className="mt-4 font-playfair text-2xl">{labels[order.status] || "Status pesanan"}</h2>{order.status === "PENDING" && <p className="mt-5 flex items-center gap-2 text-sm"><Clock3 size={18} />Sisa pembayaran: <strong>{remaining || "—"}</strong></p>}<div className="mt-6 divide-y divide-forest/10">{order.items.map((item, i) => <div key={i} className="py-4 text-sm"><p className="font-semibold">{item.name} × {item.quantity}</p><p className="mt-2 text-xs text-stone-500">{dateLabel(item.date)} · {item.session} WIB</p></div>)}</div><p className="mt-4 border-t border-forest/10 pt-5 font-semibold">Total {rupiah(order.totalAmount)}</p>{order.status === "PAYMENT_REVIEW" && <p className="mt-4 text-sm leading-7">Hubungi bantuan dengan nomor pesanan ini. Jangan melakukan pembayaran ulang.</p>}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{order.checkoutUrl && order.status === "PENDING" && remaining !== "0:00" && <a href={order.checkoutUrl} rel="noreferrer" className={primary}>Lanjut pembayaran uji</a>}<button type="button" onClick={refresh} disabled={busy} className="min-h-12 rounded-full border border-forest/20 px-5 text-sm">{busy ? "Memeriksa…" : "Perbarui status"}</button>{order.status === "PAID" && <a href={`/api/ticketing/orders/${order.orderNumber}/tickets`} className={primary}>Unduh e-ticket PDF</a>}<Link href="/tiket-saya" className={primary}>Lihat tiket saya</Link></div>{error && <p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}</div>;
}
