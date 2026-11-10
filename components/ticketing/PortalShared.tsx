import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { RESERVATION_URL, WEBSITE_URL } from "@/lib/site-domains";

export function PortalFooter() {
  return <footer className="mt-auto bg-forest text-white">
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
      <div><p className="font-playfair text-2xl">Lembur Udjo<br /><span className="italic">Parahyangan.</span></p><p className="mt-4 max-w-xs text-xs leading-6 text-white/65">Budaya, alam, dan kebersamaan. Rencanakan kunjungan dan simpan cerita yang ingin kamu bawa pulang.</p><a href={WEBSITE_URL} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs underline">Website Lembur Udjo <ArrowRight size={14} /></a></div>
      <div><h2 className="text-sm font-semibold">Bantuan Pemesanan Tiket</h2><ul className="mt-4 space-y-1 text-sm text-white/75">{[["/order-tickets", "Pesan Tiket"], ["/bantuan", "Bantuan"], ["/faq", "FAQ"], ["/pesanan", "Status Pesanan"], ["/tiket-saya", "Tiket Saya"]].map(([href, name]) => <li key={href}><Link href={href} className="inline-block min-h-9 py-2 hover:text-white">{name}</Link></li>)}</ul></div>
      <div><h2 className="text-sm font-semibold">Mitra Pembayaran</h2><p className="mt-4 text-xs leading-6 text-white/65">Integrasi Midtrans sedang disiapkan. Pembayaran belum diaktifkan; metode dan mitra pembayaran aktif akan diumumkan setelah siap.</p><div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-[11px]"><ShieldCheck size={14} />Pembayaran nonaktif</div></div>
      <div><h2 className="text-sm font-semibold">Tetap Terhubung</h2><a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block min-h-10 text-sm underline">WhatsApp Reservasi</a><p className="mt-2 text-xs leading-6 text-white/65">Informasi jam layanan masih menunggu konfirmasi tim.</p><Link href="/bantuan#media-sosial" className="mt-3 inline-block min-h-10 text-xs underline">Media sosial resmi</Link><Link href="/pemesanan-lama" className="block min-h-9 text-xs text-white/65 underline">Halaman pemesanan sebelumnya</Link></div>
    </div>
    <div className="border-t border-white/15 px-5 py-5 text-center text-[11px] leading-6 text-white/55">© {new Date().getFullYear()} Lembur Udjo Parahyangan. Seluruh hak cipta dilindungi. · Bahasa Indonesia</div>
  </footer>;
}
export function PortalTitle({ eyebrow = "TIKET LEMBUR UDJO", title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="mb-9"><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-forest/55">{eyebrow}</p><h1 className="mt-3 font-playfair text-3xl leading-tight sm:text-4xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">{description}</p></div>;
}
export function PreviewNotice() {
  return <div className="mb-8 rounded-xl border border-amber-900/10 bg-[#fff5df] px-4 py-3 text-xs leading-6 text-amber-950"><strong>Pratinjau portal.</strong> Kategori bertanda contoh belum resmi. Harga dan jadwal belum diumumkan; pembayaran tetap nonaktif.</div>;
}
export function LoginPrompt({ next, title = "Masuk untuk melanjutkan" }: { next: string; title?: string }) {
  return <section className="rounded-2xl border border-forest/10 bg-white p-7 sm:p-10"><h2 className="font-playfair text-2xl">{title}</h2><p className="mt-3 max-w-lg text-sm leading-7 text-stone-600">Akun pengunjung menjaga pesanan dan tiket tetap terhubung dengan pemiliknya. Silakan masuk atau buat akun terlebih dahulu.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link href={`/masuk?lanjut=${encodeURIComponent(next)}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Masuk</Link><Link href={`/daftar?lanjut=${encodeURIComponent(next)}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold">Daftar Akun</Link></div></section>;
}
