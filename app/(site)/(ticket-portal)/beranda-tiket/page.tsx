import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Ticket, Users, Star } from "lucide-react";
import { catalogCategories, categoryProducts } from "@/lib/ticketing/portal-data";
import { PortalTitle, PreviewNotice } from "@/components/ticketing/PortalShared";
import { portalCatalog } from "@/lib/ticketing/portal-catalog";
import { bookingOrigin } from "@/lib/ticketing/booking-origin";
import { pricedSessions } from "@/lib/ticketing/availability";
import { rupiah } from "@/lib/ticketing/types";

export const metadata: Metadata = {
  title: "Pesan Tiket — Lembur Udjo Parahyangan",
  description: "Rencanakan kunjunganmu ke Lembur Udjo Parahyangan. Pilih pengalaman, tanggal, dan sesi yang tersedia.",
  alternates: { canonical: `${bookingOrigin()}/` },
};

const featureCards = [
  {
    icon: Ticket,
    title: "Pilih pengalaman",
    text: "Kunjungan kawasan, pertunjukan angklung, atau workshop yang tersedia.",
  },
  {
    icon: Calendar,
    title: "Pilih tanggal & sesi",
    text: "Pilih tanggal kunjungan dan sesi yang sesuai jadwalmu.",
  },
  {
    icon: Users,
    title: "Tentukan jumlah",
    text: "Atur banyaknya tiket sesuai kebutuhan keluarga atau rombongan.",
  },
];

export default async function BookingHomePage() {
  const catalog = await portalCatalog();
  const categories = catalogCategories(catalog);
  return <>
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden rounded-3xl bg-forest text-white min-h-[640px] flex flex-col justify-center">
      <Image src="/Hero.ecoland.jpg" alt="Suasana hijau kawasan Lembur Udjo Parahyangan" fill priority sizes="(min-width:1152px) 1088px, 100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#3d2a1f]/95 via-[#3d2a1f]/60 to-[#3d2a1f]/30" />
      <div className="relative z-10 flex min-h-[640px] flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
        <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-white/70">TIKET LEMBUR UDJO</p>
        <h1 id="hero-title" className="mt-4 max-w-2xl text-4xl font-playfair leading-[1.12] sm:text-6xl">Rencanakan kunjunganmu<br /><span className="italic text-white/95">ke Lembur Udjo Parahyangan.</span></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-white/85 sm:text-base">Pilih pengalaman, tanggal, dan sesi kunjungan yang tersedia. Kami menyiapkan perjalanan budaya yang tak terlupakan.</p>
        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link href="/order-tickets" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-forest shadow-lg hover:shadow-xl transition-shadow">Pesan Tiket <ArrowRight size={18} aria-hidden="true" /></Link>
          <a href="#pengalaman" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white hover:bg-white/10 transition-all">Lihat pengalaman</a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm">
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="text-white/70" />
              <h3 className="mt-4 font-playfair text-xl">{title}</h3>
              <p className="mt-3 text-xs leading-6 text-white/70">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="pengalaman" aria-labelledby="category-title" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-bamboo">Pengalaman yang tersedia</p>
            <h2 id="category-title" className="mt-3 font-playfair text-3xl sm:text-4xl">Temukan pilihan yang cocok untukmu</h2>
          </div>
          <Link href="/order-tickets" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/20 bg-white px-6 py-3 text-sm font-semibold text-forest hover:bg-forest/5 transition-colors">Lihat semua kategori <ArrowRight size={16} /></Link>
        </div>

        <nav aria-label="Kategori pengalaman" className="mt-10 flex gap-2 overflow-x-auto pb-4 scrollbar-hide sm:px-2">
          {categories.map((item, index) => (
            <Link key={item.slug} href={`/order-tickets?tab=${item.slug}`} className={`shrink-0 rounded-full border px-5 py-3 text-xs font-semibold transition-all hover:bg-forest/5 hover:border-forest/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${index === 0 ? "border-forest bg-forest text-white" : "border-border text-forest"}`}>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((item, index) => {
            const products = categoryProducts(catalog, item);
            const firstProduct = products[0];
            const startingPrice = () => {
              if (!firstProduct) return "Jadwal segera diumumkan";
              const sessions = pricedSessions(catalog, firstProduct.id).filter(s => s.available > 0);
              return sessions.length ? `Mulai ${rupiah(Math.min(...sessions.map(s => s.price)))}` : "Jadwal segera diumumkan";
            };
            return (
              <Link key={item.slug} href={`/order-tickets?tab=${item.slug}`} className="group relative overflow-hidden rounded-2xl border border-border transition-all hover:shadow-xl hover:border-bamboo/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" priority={index === 0} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d2a1f]/60 via-[#3d2a1f]/20 to-transparent" />
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-forest">{item.example ? "Contoh" : "Program kunjungan"}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-playfair text-xl">{item.name}</h2>
                    <ArrowRight size={18} className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600 line-clamp-2">{item.description}</p>
                  {firstProduct && (
                    <div className="mt-6 flex items-center gap-2">
                      <Ticket size={14} className="text-bamboo" aria-hidden="true" />
                      <span className="text-sm font-semibold text-forest">{startingPrice()}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-bamboo/20 bg-white p-8 sm:p-12 lg:p-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Star size={20} className="text-bamboo shrink-0" aria-hidden="true" />
              <h3 className="mt-3 font-playfair text-xl">Kunjungan siap pakai</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Pilih paket kunjungan yang sudah kami siapkan untukmu.</p>
            </div>
            <div>
              <Calendar size={20} className="text-bamboo shrink-0" aria-hidden="true" />
              <h3 className="mt-3 font-playfair text-xl">Pilih tanggal bebas</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Atur kunjungan sesuai jadwal dan kuota yang tersedia.</p>
            </div>
            <div>
              <Users size={20} className="text-bamboo shrink-0" aria-hidden="true" />
              <h3 className="mt-3 font-playfair text-xl">Untuk keluarga & rombongan</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Kunjungan bersama keluarga, sekolah, atau komunitas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <PreviewNotice />
  </>;
};
