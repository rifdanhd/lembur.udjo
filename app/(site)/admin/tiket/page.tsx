import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/crm/auth";
import { ticketingDb } from "@/lib/ticketing/db";
import { staffOrders, staffSummary, type StaffOrder, type StaffSummary } from "@/lib/ticketing/staff";
import TicketApp from "@/components/admin/TicketApp";

export const metadata: Metadata = {
  title: "Tiket — Lembur Udjo Parahyangan",
  robots: { index: false, follow: false },
};

export default async function TicketAdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  let orders: StaffOrder[] = [];
  let summary: StaffSummary | null = null;
  let error = "";
  try {
    const db = ticketingDb();
    const [loaded, counted] = await Promise.all([staffOrders(db, {}), staffSummary(db)]);
    orders = loaded;
    summary = counted;
  } catch (err) {
    console.error("Gagal memuat panel tiket", err);
    error = "Data pesanan belum berhasil dimuat. Silakan coba muat ulang data.";
  }

  return <TicketApp initialOrders={orders} initialSummary={summary} initialError={error} />;
}
