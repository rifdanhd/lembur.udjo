import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isTicketAdmin } from '@/lib/ticketing/admin-access';
import { CheckInHistory } from '@/components/ticketing/CheckInHistory';
export const metadata = { title: 'Riwayat Check-in Sandbox', robots: { index: false, follow: false } };
export default async function HistoryPage() {
  if (!(await isTicketAdmin())) redirect('/admin/check-in');
  return <main className="mx-auto max-w-6xl px-5 py-12"><Link href="/admin/tiket" className="inline-flex min-h-11 items-center text-sm underline">Kembali ke pesanan</Link><h1 className="mt-5 text-3xl font-semibold">Riwayat check-in</h1><CheckInHistory /></main>;
}
