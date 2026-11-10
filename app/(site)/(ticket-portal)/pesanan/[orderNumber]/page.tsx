import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { OrderStatus } from "@/components/ticketing/PortalFlow";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { ticketingDb } from "@/lib/ticketing/db";
import { ownedOrder } from "@/lib/ticketing/visitor-auth";
import { orderNumberSchema } from "@/lib/ticketing/validation";
import { receipt } from "@/lib/ticketing/orders";
import { BookingError } from "@/lib/ticketing/security";
export const metadata = { title: "Status Pesanan" };
export default async function StatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  if (orderNumber === "contoh") return <><PortalTitle title="Contoh status pesanan" description="Ilustrasi halaman setelah pemesanan dibuka. Ini bukan pesanan nyata dan tidak dapat dibayar." /><section className="max-w-3xl rounded-2xl border border-dashed border-amber-800/25 bg-white p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Contoh — bukan pesanan</p><h2 className="mt-4 font-playfair text-2xl">Menunggu pembayaran</h2><p className="mt-5 text-sm leading-7 text-stone-600">Nomor pesanan, total harga resmi, tanggal kunjungan, sesi, dan batas waktu akan muncul di sini setelah pesanan dibuat.</p><dl className="mt-6 space-y-4 border-y border-forest/10 py-6 text-sm"><div className="flex justify-between gap-4"><dt>Nomor pesanan</dt><dd>Belum dibuat</dd></div><div className="flex justify-between gap-4"><dt>Batas pembayaran</dt><dd>15 menit saat dibuka</dd></div><div className="flex justify-between gap-4"><dt>Total pembayaran</dt><dd>Menunggu harga resmi</dd></div></dl><p className="mt-5 text-xs leading-6 text-stone-500">Tiket hanya diterbitkan setelah konfirmasi pembayaran dari server. Halaman contoh ini tidak menerbitkan tiket.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/checkout" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm text-white">Kembali ke checkout</Link><Link href="/tiket-saya" className="inline-flex min-h-11 items-center text-sm underline">Tiket saya</Link><Link href="/bantuan" className="inline-flex min-h-11 items-center text-sm underline">Bantuan</Link></div></section></>;
  if (!orderNumberSchema.safeParse(orderNumber).success) notFound();
  const visitor = await currentVisitor();
  if (!visitor) return <><PortalTitle title="Status pesanan" description="Masuk dengan akun pemilik pesanan untuk melanjutkan." /><LoginPrompt next={`/pesanan/${orderNumber}`} /></>;
  try { await ownedOrder(ticketingDb(), visitor.id, orderNumber); }
  catch (error) { if (error instanceof BookingError && error.code === "NOT_FOUND") notFound(); throw error; }
  return <><PortalTitle title="Status pesanan" description="Periksa konfirmasi dan batas pembayaran pesananmu di sini." /><OrderStatus initial={await receipt(ticketingDb(), orderNumber)} /></>;
}
