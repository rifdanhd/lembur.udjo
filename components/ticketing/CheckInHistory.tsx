'use client';
import { useEffect, useState, type FormEvent } from 'react';
type Row = { id: string; at: string; staff: string; code: string; status: string; orderNumber: string; source: string | null };
export function CheckInHistory() {
  const [rows, setRows] = useState<Row[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/staff/check-ins', { cache: 'no-store', signal: controller.signal }).then(async response => { if (!response.ok) throw new Error('Riwayat belum dapat dimuat.'); return response.json(); }).then(data => { if (!controller.signal.aborted) { setRows(data.checkIns); setBusy(false); } }).catch(() => { if (!controller.signal.aborted) { setError('Riwayat belum dapat dimuat.'); setBusy(false); } });
    return () => controller.abort();
  }, []);
  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/staff/check-ins?orderNumber=${encodeURIComponent(String(form.get('orderNumber') || '').trim())}`, { cache: 'no-store' });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Riwayat belum dapat dimuat.'); setRows(data.checkIns);
    } catch (err) { setError(err instanceof Error ? err.message : 'Layanan belum tersedia.'); } finally { setBusy(false); }
  }
  return <section className="mt-8 rounded-2xl border border-forest/15 bg-white p-5"><form onSubmit={search} className="flex flex-wrap items-end gap-4"><label className="min-w-0 flex-1 text-sm">Nomor reservasi (opsional)<input name="orderNumber" placeholder="LU-…" maxLength={27} className="mt-2 min-h-12 w-full rounded-xl border border-forest/20 px-4" /></label><button disabled={busy} className="min-h-12 rounded-full bg-forest px-6 text-white">{busy ? 'Memuat…' : 'Cari / muat ulang'}</button></form>{error && <p role="alert" className="mt-5 text-sm text-red-800">{error}</p>}<p role="status" className="mt-5 text-xs text-stone-500">Maksimal 100 check-in terbaru · simulasi Sandbox.</p><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Waktu WIB', 'Reservasi / tiket', 'Petugas', 'Sumber'].map(label => <th key={label} className="border-b border-forest/15 p-3">{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id}><td className="whitespace-nowrap border-b border-forest/10 p-3">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(row.at))}</td><td className="border-b border-forest/10 p-3"><span className="block font-mono text-xs">{row.orderNumber}</span><span className="mt-1 block font-mono text-xs">{row.code}</span></td><td className="border-b border-forest/10 p-3">{row.staff}</td><td className="border-b border-forest/10 p-3">{row.source}</td></tr>)}</tbody></table></div>{!busy && !rows.length && <p className="py-8 text-sm">Belum ada check-in untuk pencarian ini.</p>}</section>;
}
