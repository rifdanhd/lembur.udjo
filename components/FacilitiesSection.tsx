"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import MaskText from "./anim/MaskText";
import {
  DEFAULT_WEBSITE_IMAGES,
  sectionImages,
  type WebsiteImage,
} from "@/lib/website/content";

const SCROLL_AMOUNT = 0.85;

export default function FacilitiesSection({
  items = sectionImages(DEFAULT_WEBSITE_IMAGES, "fasilitas"),
}: {
  items?: WebsiteImage[];
}) {
  const facilities = items;
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

  if (!facilities.length) return null;

  return (
    <section id="fasilitas" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Fasilitas &amp; Ekosistem
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              <MaskText text="Program & Pengalaman Kami" scrub />
            </h2>
            <p className="text-stone-600 text-sm md:text-base mt-2.5 sm:mt-3 leading-relaxed">
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

          <div className="min-w-0 lg:col-span-8">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-3.5 sm:mb-4">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={atStart}
                aria-label="Geser ke kiri"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
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
                className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div
              ref={trackRef}
              onScroll={updateArrows}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
            >
              {facilities.map((fac) => (
                <div
                  key={fac.key}
                  className="w-[80%] sm:w-[calc((100%-1rem)/2)] shrink-0 snap-start rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-stone-950 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src={fac.image}
                      alt={fac.alt}
                      fill
                      sizes="(max-width: 640px) 80vw, 40vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-stone-500 mb-1.5 inline-block">{fac.category}</span>
                    <h3 className="font-tan text-sm sm:text-base tracking-tight text-forest mb-1">{fac.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{fac.description}</p>
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
