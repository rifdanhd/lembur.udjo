import { PortalTitle, PreviewNotice, LoginPrompt } from "@/components/ticketing/PortalShared";
import { PortalCheckout } from "@/components/ticketing/PortalFlow";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
import { portalCatalog } from "@/lib/ticketing/portal-catalog";
export const metadata = { title: "Checkout" };
export default async function CheckoutPage() {
  const visitor = await currentVisitor();
  return <><PortalTitle title="Checkout" description="Lengkapi data pemesan dan periksa ringkasan. Pesanan yang nantinya dibuat akan terhubung ke akunmu." /><PreviewNotice />{visitor ? <PortalCheckout visitor={visitor} catalog={await portalCatalog()} /> : <LoginPrompt next="/checkout" />}</>;
}
