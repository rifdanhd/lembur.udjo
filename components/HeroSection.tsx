"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  img: string;
  eyebrow: string;
  title: React.ReactNode;
  genre: string;
  desc: string;
  cta: string;
  ctaHref: string;
  meta: string;
  alt: string;
};

const slides: Slide[] = [
  {
    img: "/Pertunjukan_luar.png",
    eyebrow: "Warisan Budaya UNESCO · Angklung",
    title: (
      <>
        Menanam Budaya, <span className="text-amber-400">Memanen Masa Depan</span>
      </>
    ),
    genre: "Pertunjukan · Angklung · Tradisi",
    desc: "Destinasi wisata budaya Sunda terkemuka di Kawasan Bale Pare, Kota Baru Parahyangan.",
    cta: "Jadwal Pertunjukan",
    ctaHref: "#pertunjukan",
    meta: "Helaran setiap Minggu pagi",
    alt: "Pertunjukan angklung di Lembur Udjo Parahyangan",
  },
  {
    img: "/LUP.png",
    eyebrow: "Kawasan Budaya · Bale Pare KBP",
    title: (
      <>
        Menanam Budaya, <span className="text-amber-400">Memanen Masa Depan</span>
      </>
    ),
    genre: "Edukasi · Agrowalk · Alam",
    desc: "Hamparan sawah, rumpun bambu, dan seni pertunjukan dalam satu perjalanan yang berkelanjutan.",
    cta: "Jelajahi Program",
    ctaHref: "#fasilitas",
    meta: "Workshop & Agrowalk setiap hari",
    alt: "Suasana kawasan Lembur Udjo Parahyangan",
  },
];

const AUTOPLAY_MS = 7000;
const PROGRESS_TICK_MS = 50;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      elapsedRef.current += PROGRESS_TICK_MS;
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        setProgress(0);
        setCurrent((prev) => (prev + 1) % slides.length);
      } else {
        setProgress(elapsedRef.current / AUTOPLAY_MS);
      }
    }, PROGRESS_TICK_MS);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      id="beranda"
      className="relative w-full h-[100svh] min-h-[580px] overflow-hidden bg-black flex items-end"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <img
            key={slide.img}
            src={slide.img}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1200ms] ease-out ${
              i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
        {/* Overlay kiri agar teks mudah dibaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      </div>

      {/* Konten slide */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-14 md:pb-20">
        <div key={current} className="animate-[fadeInUp_0.7s_ease-out_both]">
          <p className="text-white/80 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3">
            {slides[current].eyebrow}
          </p>
          <h1 className="text-white text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.02]">
            {slides[current].title}
          </h1>
          <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] mt-3 sm:mt-4">
            {slides[current].genre}
          </p>
          <p className="text-white/80 text-xs sm:text-sm md:text-base mt-2 sm:mt-2.5 max-w-xl leading-relaxed">
            {slides[current].desc}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-5 sm:mt-7">
            {/* CTA pill dengan ikon play */}
            <a
              href={slides[current].ctaHref}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-stone-950 text-xs font-extrabold uppercase tracking-wider hover:bg-white/85 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.74l-11-6.86a1 1 0 0 0-1.5.87Z" />
              </svg>
              {slides[current].cta}
            </a>
            {/* Info tambahan di samping CTA */}
            <span className="text-white/75 text-[11px] sm:text-xs font-semibold tracking-wide">
              {slides[current].meta}
            </span>
          </div>
        </div>

        {/* Navigasi: dots + prev/next */}
        <div className="flex items-center justify-between mt-6 sm:mt-9">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="h-1 rounded-full overflow-hidden bg-white/25 transition-all duration-300 cursor-pointer hover:bg-white/40"
                style={{ width: i === current ? 56 : 20 }}
              >
                {i === current && (
                  <span
                    className="block h-full bg-white rounded-full"
                    style={{ width: paused ? "100%" : `${progress * 100}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
