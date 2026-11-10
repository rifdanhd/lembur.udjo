import Link from "next/link";
import { PortalTitle } from "@/components/ticketing/PortalShared";
import { VisitorAuthForm } from "@/components/ticketing/VisitorAuthForm";
import { safeContinue } from "@/lib/ticketing/portal-data";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
export const metadata = { title: "Masuk" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ lanjut?: string }> }) {
  const next = safeContinue((await searchParams).lanjut);
  return <><PortalTitle title="Selamat datang kembali" description="Masuk untuk melihat pesanan dan tiket yang terhubung dengan akunmu." />{await currentVisitor() ? <p className="rounded-2xl border border-forest/10 bg-white p-7">Kamu sudah masuk. <Link href={next} className="font-semibold underline">Lanjutkan ke akun atau pesanan</Link>.</p> : <VisitorAuthForm register={false} next={next} />}</>;
}
