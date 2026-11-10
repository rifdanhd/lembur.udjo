import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Clock3, MapPin, Ticket } from "lucide-react";
import { RESERVATION_URL, TICKET_URL } from "@/lib/site-domains";
import { PortalFrame } from "@/components/ticketing/PortalFrame";
import BookingForm from "@/components/ticketing/BookingForm";
import { catalog } from "@/lib/ticketing/orders";
import { ticketingDb } from "@/lib/ticketing/db";
import { sandboxConfig } from "@/lib/ticketing/config";
import type { Catalog } from "@/lib/ticketing/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tiket & Reservasi — Lembur Udjo Parahyangan",
  description: "Rencanakan kunjungan budaya bersama Lembur Udjo Parahyangan. Pilih jadwal dan tiket kunjunganmu.",
  alternates: { canonical: `${TICKET_URL}/pemesanan-lama` }, robots: { index: false, follow: false },
};

export default async function TicketPage() {
  let data: Catalog;
  try { data = await catalog(ticketingDb(), Boolean(sandboxConfig())); }
  catch { data = { state: "unavailable", sandbox: true, checkoutEnabled: false, products: [], schedules: [] }; }
  return <PortalFrame>
    <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <aside className="lg:sticky lg:top-8">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-forest/65"><Ticket size={15} aria-hidden="true" /> Tiket & Reservasi</p>
        <h1 className="mt-5 max-w-md font-playfair text-4xl leading-[1.15] sm:text-5xl">Satu kunjungan,<br /><span className="italic">banyak cerita.</span></h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">Luangkan waktu untuk budaya, alam, dan kebersamaan. Rencanakan harimu bersama Lembur Udjo Parahyangan.</p>
        <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl lg:aspect-[4/3]"><Image src="/Hero.ecoland.jpg" alt="Suasana alam kawasan Lembur Udjo Parahyangan" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-white"><p className="flex items-center gap-2 text-xs"><MapPin size={14} aria-hidden="true" />Lembur Udjo Parahyangan</p></div></div>
        <div className="mt-6 flex gap-3 text-xs leading-6 text-stone-500"><Clock3 size={17} className="mt-1 shrink-0" aria-hidden="true" /><p>Pilih jadwal, tentukan jumlah tiket, lalu lengkapi data pemesan. Simpan nomor pesananmu untuk pengecekan.</p></div>
        <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Butuh bantuan merencanakan kunjungan?<ArrowUpRight size={15} aria-hidden="true" /></a>
      </aside>
      <BookingForm initialCatalog={data} />
    </div>
  </PortalFrame>;
}
