import type { Metadata } from "next";
import { PortalFrame } from "@/components/ticketing/PortalFrame";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Portal Tiket — Lembur Udjo Parahyangan", template: "%s — Tiket Lembur Udjo" }, robots: { index: false, follow: false } };
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalFrame>{children}</PortalFrame>;
}
