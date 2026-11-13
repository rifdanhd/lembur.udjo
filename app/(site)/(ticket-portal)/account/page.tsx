import Link from "next/link";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { ticketingDb } from "@/lib/ticketing/db";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { jakartaDate } from "@/lib/ticketing/availability";
import { expireDueOrders } from "@/lib/ticketing/orders";
export const metadata = { title: "Akun Pengunjung" };
export default async function AccountHome() {
  const visitor = await currentVisitor();
  if (!visitor) return <LoginPrompt next="/account" />;
  const db = ticketingDb(); await expireDueOrders(db);
  const orders = await db.order.findMany({ where: { visitorId: visitor.id }, select: { orderNumber: true, status: true, items: { select: { productName: true, schedule: { select: { date: true, session: true } } } } }, orderBy: { createdAt: "desc" }, take: 100 });
  const today = jakartaDate();
  const upcoming = orders.filter(order => order.status === "PAID" && order.items.some(item => item.schedule.date.toISOString().slice(0, 10) >= today));
  const past = orders.filter(order => order.items.every(item => item.schedule.date.toISOString().slice(0, 10) < today));
  return <><PortalTitle title={`Halo, ${visitor.name}`} description="Kelola profil, reservasi, dan tiket kunjunganmu." /><nav className="mb-8 flex flex-wrap gap-3" aria-label="Akun pengunjung">{[["/account/profile", "Profil"], ["/account/bookings", "Riwayat reservasi"], ["/account/tickets", "E-ticket"]].map(([href, label]) => <Link key={href} href={href} className="flex min-h-12 items-center rounded-full border border-forest/20 bg-white px-5 text-sm">{label}</Link>)}</nav>{[["Kunjungan mendatang", upcoming], ["Kunjungan terdahulu", past]] .map(([label, list]) => <section key={String(label)} className="mb-6 rounded-2xl border border-forest/15 bg-white p-6"><h2 className="text-2xl font-semibold">{String(label)}</h2>{(list as typeof orders).length ? <ul className="mt-4 divide-y divide-forest/10">{(list as typeof orders).map(order => <li key={order.orderNumber} className="py-4"><Link href={`/account/bookings/${order.orderNumber}`} className="text-sm underline">{order.items.map(item => `${item.productName} · ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(item.schedule.date)} ${item.schedule.session} WIB`).join(", ")} · {order.status}</Link></li>)}</ul> : <p className="mt-4 text-sm text-stone-500">Belum ada kunjungan.</p>}</section>)}</>;
}
