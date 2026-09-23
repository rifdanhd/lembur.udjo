"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Zone = {
  img: string;
  category: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
};

const zones: Zone[] = [
  {
    img: "/Masterplan.jpg",
    category: "Masterplan 01",
    title: "Masterplan Kawasan",
    desc: "Denah lengkap kawasan Lembur Udjo Parahyangan — panggung, kriya bambu, dan kampung budaya dalam satu perjalanan.",
    cta: "Jelajahi Kawasan",
    href: "#fasilitas",
  },
  {
    img: "/Masterplan2.jpg",
    category: "Masterplan 02",
    title: "Zona & Fasilitas",
    desc: "Peta zona dan fasilitas kawasan: area pertunjukan, workshop, agrowalk, hingga galeri budaya.",
    cta: "Jelajahi Kawasan",
    href: "#fasilitas",
  },
  {
    img: "/Masterplan3.jpg",
    category: "Masterplan 03",
    title: "Denah Area Kawasan",
    desc: "Denah detail area kawasan beserta akses jalur penunjuk arah untuk memudahkan perjalanan berkunjung.",
    cta: "Jelajahi Kawasan",
    href: "#fasilitas",
  },
];

const AUTOPLAY_MS = 8000;

export default function MasterplanSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrentIndex(i);
    elapsedRef.current = 0;
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % zones.length);
    elapsedRef.current = 0;
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + zones.length) % zones.length);
    elapsedRef.current = 0;
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartRef.current = null;
    setPaused(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      elapsedRef.current += 50;
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        setCurrentIndex((p) => (p + 1) % zones.length);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      id="masterplan"
      className="relative w-full bg-white text-gray-900 py-12 sm:py-16 md:py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="w-full mx-auto px-4 mb-8 sm:mb-12 text-center">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-amber-600 block">
          Masterplan Kawasan
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mt-2 text-stone-950 tracking-tight">
          Eksplorasi Kawasan
        </h2>
      </div>

      {/* Wrapper Carousel Full-Width dengan Overflow Terbuka & Touch Handler */}
      <div
        className="relative w-full overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-out items-center [--card-width:88%] [--step:90%] [--offset:45%] md:[--card-width:72%] md:[--step:74%] md:[--offset:37%]"
          style={{
            transform: `translateX(calc(50% - (${currentIndex} * var(--step)) - var(--offset)))`,
          }}
        >
          {zones.map((zone, i) => {
            const active = i === currentIndex;
            return (
              <div
                key={zone.title}
                className={`w-[var(--card-width)] shrink-0 px-1.5 sm:px-2 transition-all duration-500 ${
                  active ? "scale-100 z-20" : "scale-95 z-10 opacity-70 sm:opacity-90"
                }`}
              >
                <div className="relative h-[240px] xs:h-[300px] sm:h-[420px] md:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.12)] bg-stone-950">
                  <img
                    src={zone.img}
                    alt={zone.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain sm:object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between max-w-xs mx-auto mt-6 sm:mt-10 px-4">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {zones.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i ? "w-8 bg-stone-950" : "w-2 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
