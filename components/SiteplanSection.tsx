"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MaskText from "./anim/MaskText";

type Zone = {
  num: string;
  name: string;
  en: string;
  desc: string;
  img?: string;
};

const zones: Zone[] = [
  { num: "01", name: "Lawang Kori", en: "Gate", desc: "Gerbang masuk kawasan dengan nuansa gerbang Sunda tradisional." },
  { num: "02", name: "Balandongan", en: "Reception", desc: "Pusat sambutan dan penerimaan pengunjung." },
  { num: "03", name: "Balé", en: "Management Office", desc: "Kantor pengelolaan kawasan Lembur Udjo Parahyangan." },
  { num: "04", name: "Balé Nyungcung", en: "Mushola", desc: "Ruang ibadah yang tenang di tengah kawasan." },
  { num: "05", name: "Alun-Alun", en: "Plaza", desc: "Alun-alun sebagai titik kumpul dan ruang bermain interaktif." },
  { num: "06", name: "Warung", en: "Merch. Kiosk", desc: "Kios merchandise dan cinderamata khas Lembur Udjo." },
  { num: "07", name: "Balé Ageung", en: "Restaurant", desc: "Restoran dengan sajian kuliner Sunda." },
  { num: "08", name: "Balé Pinton", en: "Amphitheater", desc: "Panggung pertunjukan terbuka berbentuk amfiteater." },
  { num: "09", name: "Kebon", en: "Mini Garden", desc: "Kebun mini koleksi tanaman dan edukasi hijau." },
  { num: "10", name: "Maripi", en: "Open Performance", desc: "Area pertunjukan terbuka untuk pagelaran seni." },
  { num: "11", name: "Balong", en: "Natural Ponds", desc: "Kolam-kolam alami sebagai elemen lanskap air." },
  { num: "12", name: "Glamping", en: "Glamping", desc: "Area glamping untuk menginap merasakan alam Parahyangan." },
];

const SCROLL_AMOUNT = 0.85;

export default function SiteplanSection() {
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
    <section id="siteplan" className="py-12 sm:py-16 md:py-20 bg-stone-50 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-forest block">
            Siteplan Kawasan
          </span>
          <h2 className="font-tan text-2xl sm:text-3xl md:text-5xl mt-2 text-forest tracking-tight">
            <MaskText text="Zona & Titik Kawasan" scrub />
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
            Sebaran 12 zona utama dalam siteplan Lembur Udjo Parahyangan — dari gerbang, ruang publik, pertunjukan, hingga area menginap.
          </p>
        </div>

        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
        >
          {zones.map((zone) => (
            <div
              key={zone.num}
              className="group snap-start shrink-0 w-[80%] sm:w-[47%] lg:w-[calc((100%-2rem)/3)] p-4 sm:p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4 overflow-hidden rounded-lg bg-stone-100 aspect-[4/3] flex items-center justify-center">
                {zone.img ? (
                  <img
                    src={zone.img}
                    alt={zone.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-stone-500 transition-colors">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]">Foto Zona {zone.num}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-100 group-hover:bg-forest group-hover:text-white text-stone-500 flex items-center justify-center text-xs font-extrabold transition-colors">
                  {zone.num}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest">
                    {zone.name}
                  </h3>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-forest mb-1.5">
                    {zone.en}
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">{zone.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
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
    </section>
  );
}
