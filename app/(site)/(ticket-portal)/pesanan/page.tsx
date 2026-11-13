import Link from "next/link";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { ticketingDb } from "@/lib/ticketing/db";
import { rupiah } from "@/lib/ticketing/types";
export const metadata = { title: "Pesanan Saya" };
export default async function OrdersPage() {
  const visitor = await currentVisitor();
  if (!visitor) return <><PortalTitle title="Pesanan saya" description="Periksa batas pembayaran dan konfirmasi pesanan yang terhubung ke akunmu." /><LoginPrompt next="/pesanan" /></>;
  const orders = await ticketingDb().order.findMany({ where: { visitorId: visitor.id }, orderBy: { createdAt: "desc" }, take: 50, select: { orderNumber: true, status: true, totalAmount: true } });
  const labels: Record<string,string> = { PENDING: "Menunggu pembayaran", PAID: "Terkonfirmasi", EXPIRED: "Kedaluwarsa", CANCELLED: "Dibatalkan", REFUNDED: "Dana dikembalikan", PAYMENT_REVIEW: "Ditinjau tim" };
  return <><PortalTitle title="Pesanan saya" description="Nomor pesanan, konfirmasi, dan batas pembayaran hanya dapat dilihat melalui akun pemiliknya." />{orders.length ? <div className="grid gap-4 sm:grid-cols-2">{orders.map(order => <Link href={`/pesanan/${order.orderNumber}`} key={order.orderNumber} className="rounded-2xl border border-forest/10 bg-white p-6"><p className="break-all text-xs text-stone-500">{order.orderNumber}</p><p className="mt-3 font-semibold">{labels[order.status]}</p><p className="mt-3 text-sm">{rupiah(order.totalAmount)}</p><p className="mt-4 text-xs underline">Lihat status →</p></Link>)}</div> : <section className="rounded-2xl border border-forest/10 bg-white p-8"><h2 className="font-playfair text-2xl">Belum ada pesanan</h2><p className="mt-3 text-sm leading-7 text-stone-500">Pilihan dalam keranjang belum menjadi reservasi sampai checkout berhasil. Pesanan yang dibuat akan tampil di sini.</p><Link href="/order-tickets" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline">Jelajahi kategori</Link></section>}<Link href="/pesanan/contoh" className="mt-5 inline-flex min-h-11 items-center text-xs underline">Lihat contoh halaman status</Link></>;
}
