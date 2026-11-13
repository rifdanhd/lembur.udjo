import Link from "next/link";
import { PortalTitle, LoginPrompt } from "@/components/ticketing/PortalShared";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
export const metadata = { title: "Akun Saya" };
export default async function AccountPage() {
  const visitor = await currentVisitor();
  return <><PortalTitle title="Akun saya" description="Kelola akses ke pesanan dan tiket kunjunganmu." />{visitor ? <div className="grid gap-6 md:grid-cols-2"><section className="rounded-2xl border border-forest/10 bg-white p-7"><h2 className="font-playfair text-2xl">Halo, {visitor.name}</h2><p className="mt-4 break-words text-sm text-stone-600">{visitor.email}</p><p className="mt-4 text-xs leading-6 text-stone-500">{visitor.emailVerifiedAt ? "Email akun sudah diverifikasi." : "Email akun belum melalui verifikasi email."} Jangan bagikan kata sandi. Untuk bantuan akses, hubungi tim reservasi.</p><Link href="/bantuan#akun" className="mt-4 inline-flex min-h-11 items-center text-sm underline">Bantuan akun</Link></section><section className="grid gap-3">{[["/pesanan", "Pesanan saya"], ["/tiket-saya", "Tiket saya"], ["/keranjang", "Keranjang kunjungan"]].map(([href,label]) => <Link href={href} key={href} className="flex min-h-16 items-center rounded-2xl border border-forest/10 bg-white px-6 text-sm font-semibold">{label} →</Link>)}</section></div> : <LoginPrompt next="/akun" />}</>;
}
