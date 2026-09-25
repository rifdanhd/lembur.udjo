"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const facilities = [
  { title: "Bale Karesmen", desc: "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas bertemu.", tag: "Ruang Utama", img: "/placeholders/bale-karesmen.jpg" },
  { title: "Workshop Angklung", desc: "Belajar langsung proses pembuatan angklung dari para pengrajin.", tag: "Edukasi", img: "/placeholders/workshop.jpg" },
  { title: "Agrowalk", desc: "Perjalanan berpandu ke berbagai spot edukasi budaya dan sustainability.", tag: "Unggulan", img: "/placeholders/agrowalk.jpg" },
  { title: "Konservasi Bambu", desc: "Program pelestarian bambu sebagai sumber utama seni angklung.", tag: "Lingkungan", img: "/placeholders/konservasi-bambu.svg" },
  { title: "Peternakan Edukasi", desc: "Sarana edukasi bagi pengunjung untuk mengenal kehidupan agraris.", tag: "Edukasi", img: "/placeholders/peternakan-edukasi.svg" },
  { title: "Area Hijau", desc: "Ruang hijau dan keberlanjutan. Sawah, kebun bambu, kolam.", tag: "Alam", img: "/placeholders/area-hijau.svg" },
];

const SCROLL_AMOUNT = 0.85;

export default function FacilitiesSection() {
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
    <section id="fasilitas" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Fasilitas &amp; Ekosistem
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05] mt-2">
              Program &amp; Pengalaman Kami
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Lembur Udjo Parahyangan menghadirkan beragam fasilitas edukasi, agrowalk, konservasi rumpun bambu, dan ruang seni pertunjukan dalam satu kesatuan perjalanan yang berkelanjutan.
            </p>
            <div className="pt-4 sm:pt-5">
              <a
                href="#kontak"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-forest hover:border-forest transition-colors"
              >
                Informasi Kunjungan &rarr;
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-3.5 sm:mb-4">
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

            <div
              ref={trackRef}
              onScroll={updateArrows}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
            >
              {facilities.map((fac) => (
                <div
                  key={fac.title}
                  className="w-[80%] sm:w-[calc((100%-1rem)/2)] shrink-0 snap-start rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-stone-950 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={fac.img}
                      alt={fac.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-stone-500 mb-1.5 inline-block">{fac.tag}</span>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-stone-950 mb-1">{fac.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
