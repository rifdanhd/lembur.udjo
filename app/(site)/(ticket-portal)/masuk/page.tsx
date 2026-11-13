import Link from "next/link";
import { googleEnabled } from "@/lib/ticketing/google-auth";
import { PortalTitle } from "@/components/ticketing/PortalShared";
import { VisitorAuthForm } from "@/components/ticketing/VisitorAuthForm";
import { safeContinue } from "@/lib/ticketing/portal-data";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
export const metadata = { title: "Masuk" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ lanjut?: string; oauth?: string }> }) {
  const query = await searchParams;
  const next = safeContinue(query.lanjut);
  return <>{query.oauth === "gagal" && <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm">Google belum dapat digunakan. Jika email sudah memiliki akun lokal, masuk dengan kata sandi; akun tidak ditautkan otomatis.</p>}<PortalTitle title="Selamat datang kembali" description="Masuk untuk melihat pesanan dan tiket yang terhubung dengan akunmu." />{await currentVisitor() ? <p className="rounded-2xl border border-forest/10 bg-white p-7">Kamu sudah masuk. <Link href={next} className="font-semibold underline">Lanjutkan ke akun atau pesanan</Link>.</p> : <VisitorAuthForm google={googleEnabled()} register={false} next={next} />}</>;
}
