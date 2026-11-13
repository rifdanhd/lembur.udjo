import Link from "next/link";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { ticketingDb } from "@/lib/ticketing/db";
import { Ticket, Download, ArrowRight } from "lucide-react";
export const metadata = { title: "Tiket Saya — Lembur Udjo" };
export default async function MyTicketsPage() {
  const visitor = await currentVisitor();
  if (!visitor) return <><PortalTitle title="Tiket saya" description="Tiket yang sudah diterbitkan tersimpan bersama akun pemiliknya." /><LoginPrompt next="/tiket-saya" /></>;
  const tickets = await ticketingDb().ticket.findMany({ where: { order: { visitorId: visitor.id } }, orderBy: { issuedAt: "desc" }, take: 100, select: { code: true, status: true, issuedAt: true, order: { select: { orderNumber: true, items: { select: { productName: true, schedule: { select: { date: true, session: true } } } } } } } });
  const labels: Record<string,string> = { ISSUED: "Tiket aktif", USED: "Sudah digunakan", CANCELLED: "Tidak berlaku" };
  const badgeTone: Record<string,string> = { ISSUED: "border-emerald-100 bg-emerald-50 text-emerald-800", USED: "border-stone-100 bg-stone-50 text-stone-600", CANCELLED: "border-rose-100 bg-rose-50 text-rose-700" };
  return <><PortalTitle title="Tiket saya" description="Simpan kode tiket dan periksa informasi kunjungan. Hanya tiket milik akunmu yang ditampilkan." />{tickets.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tickets.map(ticket => <article key={ticket.code} className="relative overflow-hidden rounded-2xl border border-bamboo/20 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-bamboo/40 transition-all">
    <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-bamboo/10 bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest"><span className={`inline-block size-1.5 rounded-full ${badgeTone[ticket.status] === "border-emerald-100 bg-emerald-50 text-emerald-800" ? "bg-emerald-500" : badgeTone[ticket.status] === "border-stone-100 bg-stone-50 text-stone-600" ? "bg-stone-400" : "bg-rose-400"}`} aria-hidden="true" /><span>{labels[ticket.status]}</span></div>
    <h2 className="mt-6 break-all font-mono text-sm font-semibold text-forest">{ticket.code}</h2>
    <p className="mt-3 text-xs leading-6 text-stone-600">{ticket.order.items.map(item => item.productName).join(", ")}</p>
    <p className="mt-3 text-xs text-stone-500">{ticket.order.items.map(item => `${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(item.schedule.date)} · ${item.schedule.session} WIB`).join(", ")}</p>
    <div className="mt-6 pt-6 border-t border-bamboo/10 flex items-center justify-between">
      <div className="flex items-center gap-2"><Download size={16} className="text-bamboo" aria-hidden="true" /><a href={`/api/ticketing/orders/${ticket.order.orderNumber}/tickets`} className="text-sm font-semibold text-bamboo underline underline-offset-4">Unduh PDF & QR</a></div>
      <Link href={`/pesanan/${ticket.order.orderNumber}`} className="text-sm font-semibold text-stone-500 underline underline-offset-4 hover:text-forest">Lihat pesanan</Link>
    </div>
  </article>)}</div> : <section className="rounded-2xl border border-bamboo/20 bg-surface p-10 text-center sm:p-16">
    <Ticket size={32} className="mx-auto text-bamboo/30 mb-4" aria-hidden="true" />
    <h2 className="font-playfair text-2xl">Belum ada tiket yang terbit</h2>
    <p className="mt-3 max-w-lg mx-auto text-sm leading-7 text-stone-600">Tiket akan muncul setelah pesananmu mendapat konfirmasi pembayaran. Tiket Sandbox merupakan simulasi pengujian.</p>
    <Link href="/order-tickets" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white">Jelajahi kategori tiket <ArrowRight size={17} /></Link>
  </section>}</>;
}
