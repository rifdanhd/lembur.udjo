"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  img: string;
  title: React.ReactNode;
  desc: string;
  alt: string;
};

const slides: Slide[] = [
  {
    img: "/Pertunjukan_luar.png",
    title: "Menanam Budaya, Memanen Masa Depan",
    desc: "Pusat seni, tradisi, dan kebudayaan Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan.",
    alt: "Pertunjukan seni di Lembur Udjo Parahyangan",
  },
  {
    img: "/LUP.png",
    title: "Harmoni Tradisi, Ruang & Keberlanjutan",
    desc: "Hamparan sawah, rumpun bambu, dan seni pertunjukan dalam satu perjalanan budaya yang hidup.",
    alt: "Suasana lanskap kawasan Lembur Udjo Parahyangan",
  },
];

const AUTOPLAY_MS = 7000;
const PROGRESS_TICK_MS = 50;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

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

  // Touch swipe support for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartRef.current = null;
    setPaused(false);
  };

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
      className="relative w-full overflow-hidden bg-stone-950 flex flex-col justify-end touch-pan-y hero-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <img
            key={slide.img}
            src={slide.img}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${
              i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ objectPosition: 'center center' }}
          />
        ))}

        {/* Gradien atas kuat untuk navbar tanpa backdrop-blur */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

        {/* Gradien bawah untuk keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Konten Hero */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 sm:pb-12 md:pb-16 flex flex-col justify-end">
        <div key={current} className="max-w-2xl animate-[fadeInUp_0.6s_ease-out_both]">
          {/* Heading Title */}
          <h1 className="text-white text-2xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.14] sm:leading-[1.05] drop-shadow-md">
            {slides[current].title}
          </h1>

          {/* Deskripsi */}
          <p className="text-white/85 text-xs sm:text-sm md:text-base mt-2 sm:mt-3 leading-relaxed drop-shadow-sm max-w-xl">
            {slides[current].desc}
          </p>
        </div>

        {/* Navigasi Slide: Dots Bar & Panah Navigasi */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 pt-2">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1 sm:h-1.5 rounded-full overflow-hidden bg-white/30 transition-all duration-300 cursor-pointer hover:bg-white/50 ${
                  i === current ? "w-10 sm:w-14" : "w-4 sm:w-5"
                }`}
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

          {/* Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide sebelumnya"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide berikutnya"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 cursor-pointer"
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
