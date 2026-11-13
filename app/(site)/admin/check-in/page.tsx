import { cookies } from "next/headers";
import { ticketingDb } from "@/lib/ticketing/db";
import { staffSession, STAFF_COOKIE } from "@/lib/ticketing/staff-auth";
import { CheckInDesk } from "@/components/ticketing/CheckInDesk";
export const dynamic = "force-dynamic";
export const metadata = { title: "Check-in Sandbox", robots: { index: false, follow: false } };
export default async function CheckInPage() {
  const token = (await cookies()).get(STAFF_COOKIE)?.value;
  const staff = token ? await staffSession(ticketingDb(), token) : null;
  return <main className="mx-auto max-w-2xl px-5 py-12"><h1 className="text-3xl font-semibold">Check-in tiket</h1><p className="mt-3 text-sm text-amber-900">Simulasi Sandbox · bukan validasi tiket masuk kawasan.</p><CheckInDesk staff={staff} /></main>;
}
