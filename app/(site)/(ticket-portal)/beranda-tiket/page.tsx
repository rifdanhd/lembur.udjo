import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Music2, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Rencanakan Kunjungan ke Lembur Udjo",
  description: "Awali rencana kunjunganmu ke Lembur Udjo Parahyangan. Temukan suasana alam, budaya, dan kebersamaan sebelum memilih tiket.",
  alternates: { canonical: "https://ticket.lemburudjoparahyangan.com/" },
};

const stories = [
  { icon: Leaf, title: "Dekat dengan alam", text: "Ambil jeda dari keseharian dan temukan suasana hijau Lembur Udjo." },
  { icon: Music2, title: "Berjumpa dengan budaya", text: "Kenali angklung dan cerita budaya yang tumbuh bersama masyarakat Sunda." },
  { icon: Users, title: "Berbagi kebersamaan", text: "Rencanakan waktu bersama keluarga, sahabat, atau rombonganmu." },
];
const steps = [
  ["01", "Temukan pilihanmu", "Lihat kategori dan pilihan pengalaman yang ingin kamu rencanakan."],
  ["02", "Susun kunjungan", "Pilih tanggal, sesi, dan jumlah pengunjung, lalu periksa keranjang."],
  ["03", "Simpan di akunmu", "Saat penjualan dibuka, pesanan dan tiket terbit dapat dilihat melalui akunmu."],
];

export default function BookingLandingPage() {
  return <>
    <section aria-labelledby="booking-welcome" className="relative isolate overflow-hidden rounded-3xl bg-forest text-white">
      <Image src="/Hero.ecoland.jpg" alt="Suasana hijau kawasan Lembur Udjo Parahyangan" fill priority sizes="(min-width:1152px) 1088px, 100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/15" />
      <div className="flex min-h-[520px] flex-col justify-end px-6 py-10 sm:min-h-[590px] sm:px-12 sm:py-14 lg:px-16">
        <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-white/80">Selamat datang di Lembur Udjo Parahyangan</p>
        <h1 id="booking-welcome" className="mt-5 max-w-2xl font-playfair text-4xl leading-[1.12] sm:text-6xl">Satu kunjungan,<br /><span className="italic">banyak cerita.</span></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-white/85 sm:text-base">Alam yang menyambut, budaya yang mendekatkan. Awali rencana waktumu bersama orang-orang tersayang di sini.</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link href="/order-tickets" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-forest">Pesan Tiket <ArrowRight size={17} aria-hidden="true" /></Link>
          <a href="#tentang-kunjungan" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-7 py-3 text-sm font-medium text-white">Kenali pengalaman kami</a>
        </div>
        <p className="mt-5 max-w-lg text-xs leading-6 text-white/80">Portal masih dalam persiapan. Harga dan jadwal resmi belum diumumkan; pembayaran belum dibuka.</p>
      </div>
    </section>

    <section id="tentang-kunjungan" aria-labelledby="experience-title" className="scroll-mt-28 py-14 sm:py-20">
      <div className="grid items-center gap-9 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[5/4] overflow-hidden rounded-3xl"><Image src="/Pertunjukanluar.webp" alt="Suasana pertunjukan angklung di Lembur Udjo" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></div>
        <div><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-forest/60">Ruang untuk berjumpa</p><h2 id="experience-title" className="mt-4 font-playfair text-3xl leading-tight sm:text-4xl">Datang bersama.<br /><span className="italic">Pulang membawa cerita.</span></h2><p className="mt-5 text-sm leading-7 text-stone-600">Lembur Udjo mempertemukan alam, angklung, dan kebersamaan. Mulai dari mengenal suasananya, lalu susun rencana kunjungan yang sesuai dengan kebutuhanmu.</p><Link href="/bantuan" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Bicarakan rencana kunjungan <ArrowRight size={16} aria-hidden="true" /></Link></div>
      </div>
      <div className="mt-10 grid gap-7 sm:grid-cols-3">{stories.map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-forest/15 pt-6"><Icon size={24} strokeWidth={1.4} aria-hidden="true" /><h3 className="mt-4 font-playfair text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-stone-600">{text}</p></article>)}</div>
    </section>

    <section aria-labelledby="planning-title" className="rounded-3xl bg-[#eeeee5] p-6 sm:p-10 lg:p-12">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:flex-wrap sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-forest/60">Mulai dari sini</p><h2 id="planning-title" className="mt-3 font-playfair text-3xl sm:text-4xl">Rencanakan kunjunganmu</h2></div><Link href="/order-tickets" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white">Lihat pilihan tiket <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <ol className="mt-9 grid gap-8 sm:grid-cols-3">{steps.map(([number, title, text]) => <li key={number}><span className="font-playfair text-3xl italic text-forest/40">{number}</span><h3 className="mt-3 text-base font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-stone-600">{text}</p></li>)}</ol>
      <p className="mt-8 border-t border-forest/15 pt-5 text-xs leading-6 text-stone-600">Pilihan yang bertanda contoh belum resmi dan tidak menahan kuota. Pemesanan serta pembayaran akan tersedia setelah harga dan jadwal resmi siap. <Link href="/faq" className="font-semibold underline">Baca pertanyaan umum</Link>.</p>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-4 py-10"><p className="font-playfair text-xl">Sudah punya akun pengunjung?</p><div className="flex flex-wrap gap-5 text-sm font-semibold"><Link href="/masuk" className="inline-flex min-h-11 items-center underline underline-offset-4">Masuk ke akun</Link><Link href="/tiket-saya" className="inline-flex min-h-11 items-center gap-2">Lihat tiket saya <ArrowRight size={16} aria-hidden="true" /></Link></div></div>
  </>;
}
