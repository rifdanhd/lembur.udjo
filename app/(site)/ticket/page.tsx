import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, MessageCircle, Ticket } from "lucide-react";
import { RESERVATION_URL, TICKET_URL, WEBSITE_URL } from "@/lib/site-domains";

export const metadata: Metadata = {
  title: "Tiket & Reservasi — Lembur Udjo Parahyangan",
  description: "Informasi tiket dan reservasi kunjungan ke Lembur Udjo Parahyangan.",
  alternates: { canonical: TICKET_URL },
  robots: { index: false, follow: false },
};

export default function TicketPage() {
  return (
    <main className="min-h-svh bg-cream px-5 py-6 text-forest sm:px-10 sm:py-8">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
        <a href={WEBSITE_URL} aria-label="Website Lembur Udjo Parahyangan" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4">
          <Image src="/UdjoFullColor.png" alt="Lembur Udjo Parahyangan" width={150} height={90} className="h-16 w-auto object-contain" />
        </a>
        <a href={WEBSITE_URL} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke website
        </a>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 px-4 py-2 text-xs font-semibold tracking-wide">
            <Ticket size={16} aria-hidden="true" /> TIKET & RESERVASI
          </span>
          <h1 className="mt-6 font-playfair text-4xl leading-tight sm:text-5xl">Rencanakan kunjungan,<br /><span className="italic">mulai cerita bersama.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">Temukan pengalaman budaya Sunda bersama Lembur Udjo Parahyangan. Hubungi tim kami untuk informasi tiket, jadwal, dan reservasi rombongan.</p>
          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Reservasi melalui tim kami</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">Pembelian tiket online belum tersedia. Untuk saat ini, pemesanan dan konfirmasi kunjungan dilayani melalui WhatsApp resmi.</p>
            <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-4 sm:w-auto">
              <MessageCircle size={18} aria-hidden="true" /> Hubungi tim reservasi <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:max-h-[620px]">
          <Image src="/Hero.ecoland.jpg" alt="Suasana kawasan Lembur Udjo Parahyangan" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
      <footer className="mx-auto max-w-6xl border-t border-forest/10 py-6 text-sm text-stone-500">Lembur Udjo Parahyangan · Budaya, alam, dan kebersamaan.</footer>
    </main>
  );
}
