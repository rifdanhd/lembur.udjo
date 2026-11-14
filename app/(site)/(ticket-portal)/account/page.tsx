import Link from "next/link";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { ticketingDb } from "@/lib/ticketing/db";
import { LoginPrompt } from "@/components/ticketing/PortalShared";
import { jakartaDate } from "@/lib/ticketing/availability";
import { expireDueOrders } from "@/lib/ticketing/orders";
import { rupiah } from "@/lib/ticketing/types";
import { Calendar, Ticket, CheckCircle2, Clock, ArrowRight } from "lucide-react";
export const metadata = { title: "Akun Pengunjung — Lembur Udjo" };
export default async function AccountHome() {
  const visitor = await currentVisitor();
  if (!visitor) return <LoginPrompt next="/account" />;
  const db = ticketingDb(); await expireDueOrders(db);
  const orders = await db.order.findMany({ where: { visitorId: visitor.id }, select: { orderNumber: true, status: true, totalAmount: true, createdAt: true, items: { select: { productName: true, schedule: { select: { date: true, session: true } } } } }, orderBy: { createdAt: "desc" }, take: 100 });
  const today = jakartaDate();
  const upcoming = orders.filter(order => order.status === "PAID" && order.items.some(item => item.schedule.date.toISOString().slice(0, 10) >= today));
  const past = orders.filter(order => order.items.every(item => item.schedule.date.toISOString().slice(0, 10) < today));
  const pending = orders.filter(order => order.status === "PENDING");
  const labels: Record<string,string> = { PENDING: "Menunggu pembayaran", PAID: "Terkonfirmasi", EXPIRED: "Kedaluwarsa", CANCELLED: "Dibatalkan", REFUNDED: "Dana dikembalikan", PAYMENT_REVIEW: "Ditinjau tim" };
  return <div className="space-y-10">
    <div className="rounded-2xl border border-bamboo/20 bg-white p-8 sm:p-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-stone-600">Selamat kembali,</p>
          <h1 className="mt-2 font-playfair text-3xl sm:text-4xl">{visitor.name}</h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">Kelola profil, reservasi, dan tiket kunjunganmu di sini.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/account/profile" className="min-h-11 flex items-center gap-2 rounded-xl border border-bamboo/20 bg-white px-5 py-3 text-sm font-semibold text-forest hover:bg-white/50 transition-colors"><UsersIcon size={16} />Profil</Link>
          <Link href="/account/bookings" className="min-h-11 flex items-center gap-2 rounded-xl border border-bamboo/20 bg-white px-5 py-3 text-sm font-semibold text-forest hover:bg-white/50 transition-colors"><Calendar size={16} />Reservasi</Link>
          <Link href="/account/tickets" className="min-h-11 flex items-center gap-2 rounded-xl border border-bamboo/20 bg-white px-5 py-3 text-sm font-semibold text-forest hover:bg-white/50 transition-colors"><Ticket size={16} />E-ticket</Link>
        </div>
      </div>
    </div>

    <div className="grid gap-6 sm:grid-cols-3">
      <StatCard icon={<Ticket className="text-bamboo" />} title="Tiket aktif" value={upcoming.length} subtitle={upcoming.length > 0 ? "Kunjungan mendatang" : "Belum ada"} tone="bg-emerald-50 text-emerald-800 border-emerald-200" />
      <StatCard icon={<Clock className="text-amber-600" />} title="Menunggu pembayaran" value={pending.length} subtitle={pending.length > 0 ? "Selesaikan checkout" : "Semua lunas"} tone="bg-amber-50 text-amber-800 border-amber-200" />
      <StatCard icon={<CheckCircle2 className="text-forest" />} title="Riwayat kunjungan" value={past.length} subtitle={past.length > 0 ? "Terkonfirmasi" : "Belum ada"} tone="bg-forest/10 text-forest border-forest/20" />
    </div>

    {upcoming.length > 0 && (
      <section className="rounded-2xl border border-bamboo/20 bg-white p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-playfair text-2xl">Kunjungan mendatang</h2>
          <Link href="/account/tickets" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bamboo underline underline-offset-4">Lihat semua e-ticket <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(order => (
            <article key={order.orderNumber} className="rounded-xl border border-bamboo/10 p-5 sm:p-6 hover:border-bamboo/30 transition-colors">
              <p className="break-all text-xs font-mono text-stone-500">{order.orderNumber}</p>
              <h3 className="mt-3 font-semibold text-forest">{order.items.map(i => i.productName).join(", ")}</h3>
              <p className="mt-2 text-sm text-stone-600">{order.items.map(i => `${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(i.schedule.date)} · ${i.schedule.session} WIB`).join(", ")}</p>
              <span className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">{labels.PAID}</span>
            </article>
          ))}
        </div>
      </section>
    )}

    {past.length > 0 && (
      <section className="rounded-2xl border border-bamboo/20 bg-white p-8 sm:p-10">
        <h2 className="font-playfair text-2xl mb-6">Riwayat kunjungan</h2>
        <ul className="divide-y divide-bamboo/10">
          {past.map(order => (
            <li key={order.orderNumber} className="py-5 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-stone-500">{order.orderNumber}</p>
                  <h3 className="mt-1 font-semibold text-forest">{order.items.map(i => i.productName).join(", ")}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-stone-900">{rupiah(order.totalAmount)}</span>
                  <span className="inline-flex min-h-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-700">{labels[order.status]}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    )}

    {!upcoming.length && !past.length && (
      <section className="rounded-2xl border border-bamboo/20 bg-white p-10 text-center sm:p-16">
        <Ticket size={32} className="mx-auto text-bamboo/30 mb-4" aria-hidden="true" />
        <h2 className="font-playfair text-2xl">Belum ada kunjungan</h2>
        <p className="mt-3 max-w-lg mx-auto text-sm leading-7 text-stone-600">Tiket akan muncul setelah pesananmu mendapat konfirmasi pembayaran. Mulai rencana kunjungan pertamamu.</p>
        <Link href="/order-tickets" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white">Jelajahi kategori tiket <ArrowRight size={17} /></Link>
      </section>
    )}
  </div>;
};

function StatCard({ icon, title, value, subtitle, tone }: { icon: React.ReactNode; title: string; value: number | string; subtitle: string; tone: string }) {
  return <div className={`rounded-2xl border p-6 ${tone}`}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/60">{icon}</div>
      <span className="text-2xl font-bold tabular-nums text-stone-900">{value.toLocaleString("id-ID")}</span>
    </div>
    <p className="mt-3 font-semibold text-stone-900">{title}</p>
    <p className="mt-1 text-xs text-stone-500">{subtitle}</p>
  </div>;
}

function UsersIcon({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
