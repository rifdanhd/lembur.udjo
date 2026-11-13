import { StaffUsers } from "@/components/ticketing/StaffUsers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isTicketAdmin } from "@/lib/ticketing/admin-access";
import { CatalogAdmin } from "@/components/ticketing/CatalogAdmin";
export const metadata = { title: "Kelola katalog booking", robots: { index: false, follow: false } };
export default async function CatalogPage() {
  if (!(await isTicketAdmin())) redirect("/admin/login");
  return <main className="mx-auto max-w-6xl px-5 py-12"><Link href="/admin/tiket" className="text-sm underline">Kembali ke pesanan</Link><h1 className="mt-6 text-3xl font-semibold">Katalog & jadwal kunjungan</h1><p className="mt-3 text-sm text-stone-600">Harga dalam rupiah. Perubahan hanya untuk pemesanan baru; pesanan yang sudah dibuat menyimpan harga transaksi.</p><CatalogAdmin /><StaffUsers /></main>;
}
