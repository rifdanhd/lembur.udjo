import Link from "next/link";
import { PortalTitle } from "@/components/ticketing/PortalShared";
import { VisitorAuthForm } from "@/components/ticketing/VisitorAuthForm";
import { safeContinue } from "@/lib/ticketing/portal-data";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
export const metadata = { title: "Daftar Akun" };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ lanjut?: string }> }) {
  const next = safeContinue((await searchParams).lanjut);
  return <><PortalTitle title="Buat akun pengunjung" description="Satu akun untuk mengelola rencana, mengakses pesanan, dan menemukan tiketmu saat penjualan dibuka." />{await currentVisitor() ? <p className="rounded-2xl border border-forest/10 bg-white p-7">Kamu sudah memiliki sesi aktif. <Link href={next} className="font-semibold underline">Lanjutkan</Link>.</p> : <VisitorAuthForm register next={next} />}</>;
}
