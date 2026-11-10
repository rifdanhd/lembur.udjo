import { PortalTitle, PreviewNotice } from "@/components/ticketing/PortalShared";
import { CartContents } from "@/components/ticketing/PortalFlow";
export const metadata = { title: "Keranjang" };
export default function CartPage() { return <><PortalTitle title="Keranjang kunjungan" description="Periksa pilihan, tanggal rencana, dan jumlah pengunjung sebelum melanjutkan." /><PreviewNotice /><div className="mx-auto max-w-3xl"><CartContents /></div></>; }
