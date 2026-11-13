import Link from "next/link";
import { PortalTitle, PreviewNotice } from "@/components/ticketing/PortalShared";
import { SelectTicket } from "@/components/ticketing/PortalFlow";
import { catalogCategories } from "@/lib/ticketing/portal-data";
import { portalCatalog } from "@/lib/ticketing/portal-catalog";
export const metadata = { title: "Pilih Tiket" };
export default async function SelectPage({ searchParams }: { searchParams: Promise<{ kategori?: string; produk?: string }> }) {
  const query = await searchParams;
  const catalog = await portalCatalog();
  const category = catalogCategories(catalog).find(item => item.slug === (query.kategori || "kunjungan"));
  if (!category) return <><PortalTitle title="Pilihan belum ditemukan" description="Pilih kategori yang tersedia untuk melanjutkan." /><Link href="/order-tickets" className="underline">Pilih kategori</Link></>;
  return <><Link href={`/order-tickets?tab=${category.slug}`} className="mb-6 inline-flex min-h-11 items-center text-xs underline">Kembali ke {category.name.toLowerCase()}</Link><PortalTitle title="Pilih waktu & pengunjung" description="Susun tanggal, preferensi sesi, dan jumlah pengunjung, lalu tambahkan ke keranjang." /><PreviewNotice /><SelectTicket category={category.slug} catalog={catalog} initialProductId={query.produk} /></>;
}
