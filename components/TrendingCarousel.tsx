"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Card = {
  img: string;
  category: string;
  title: string;
  cta: string;
  href: string;
};

const cards: Card[] = [
  {
    img: "/placeholders/helaran.jpg",
    category: "Pertunjukan",
    title: "Helaran Angklung Minggu Pagi",
    cta: "Lihat Jadwal",
    href: "#pertunjukan",
  },
  {
    img: "/placeholders/workshop.jpg",
    category: "Edukasi",
    title: "Workshop Angklung & Arumba",
    cta: "Ikut Workshop",
    href: "#fasilitas",
  },
  {
    img: "/placeholders/agrowalk.jpg",
    category: "Alam",
    title: "Agrowalk & Konservasi Bambu",
    cta: "Jelajah Sekarang",
    href: "#fasilitas",
  },
  {
    img: "/placeholders/wayang.jpg",
    category: "Warisan",
    title: "Wayang Golek & Seni Tradisi",
    cta: "Selengkapnya",
    href: "#warisan",
  },
  {
    img: "/placeholders/bale-karesmen.jpg",
    category: "Venue",
    title: "Bale Karesmen Ruang Utama",
    cta: "Lihat Fasilitas",
    href: "#fasilitas",
  },
];

const SCROLL_AMOUNT = 0.9; // 90% lebar viewport slider

export default function TrendingCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-amber-600 uppercase block mb-1">
              Aktivitas Pilihan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-tight">
              Trending
            </h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              disabled={atStart}
              aria-label="Geser ke kiri"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              disabled={atEnd}
              aria-label="Geser ke kanan"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="flex gap-3.5 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
        >
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group relative block w-[78%] sm:w-[48%] lg:w-[calc((100%-2.5rem)/3)] shrink-0 snap-start"
            >
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/5] sm:aspect-[3/4] bg-stone-100 shadow-md">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient agar teks overlay terbaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Overlay text */}
                <div className="absolute left-5 top-5 right-5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80">{card.category}</span>
                  <h3 className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug drop-shadow-sm">{card.title}</h3>
                </div>

                {/* CTA pill putih */}
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-stone-950 shadow-md transition-all duration-300 group-hover:bg-stone-950 group-hover:text-white">
                  {card.cta}
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
