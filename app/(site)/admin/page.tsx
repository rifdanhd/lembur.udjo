import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/crm/auth";
import { getCrmLeads } from "@/lib/crm/payload";
import { jakartaDate } from "@/lib/crm/dashboard";
import type { Lead } from "@/lib/crm/types";
import CrmApp from "@/components/admin/CrmApp";

export const metadata: Metadata = {
  title: "CRM — Lembur Udjo Parahyangan",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  let leads: Lead[] = [];
  let error = "";
  try {
    leads = await getCrmLeads();
  } catch (err) {
    console.error("Gagal memuat CRM", err);
    error = "Data belum berhasil dimuat. Silakan coba perbarui data.";
  }

  return (
    <CrmApp
      initialLeads={leads}
      initialError={error}
      initialToday={jakartaDate()}
    />
  );
}
