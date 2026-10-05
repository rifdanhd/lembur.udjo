import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/crm/auth";
import { getPayloadClient, toLead, type LeadDoc } from "@/lib/crm/payload";
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
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "leads",
      depth: 1,
      limit: 1000,
      sort: "-createdAt",
    });
    leads = res.docs.map((d) => toLead(d as unknown as LeadDoc));
  } catch (err) {
    error = (err as Error).message;
  }

  return <CrmApp initialLeads={leads} initialError={error} />;
}
