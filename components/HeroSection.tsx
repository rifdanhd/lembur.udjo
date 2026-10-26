"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play } from "lucide-react";
import HeroVideo from "./HeroVideo";
import {
  DEFAULT_WEBSITE_IMAGES,
  sectionImages,
  type WebsiteImage,
} from "@/lib/website/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AUTOPLAY_MS = 7000;
const PROGRESS_TICK_MS = 50;

export default function HeroSection({
  items = sectionImages(DEFAULT_WEBSITE_IMAGES, "banner"),
}: {
  items?: WebsiteImage[];
}) {
  const slides = items;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [paused, setPaused] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const activeIndex = slides.length ? current % slides.length : 0;
  const activeSlide = slides[activeIndex];

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, [slides.length]);

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
    // Video loops on its slide until the visitor selects another visual.
    if (slides.length < 2 || activeSlide?.video) return;
    const interval = setInterval(() => {
      if (paused || motionPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, [paused, motionPaused, slides.length, activeSlide?.video]);

  // Teks hero memudar & naik mengikuti scroll (scrub), hilang saat hero hampir selesai terlihat
  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(text, {
        y: -48,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  if (!activeSlide) return null;

  return (
    <section
      id="beranda"
      ref={sectionRef}
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
            key={slide.key}
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${
              i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ objectPosition: 'center center' }}
          />
        ))}
        {activeSlide.video && (
          <HeroVideo key={`${activeSlide.key}-${activeSlide.video}`} src={activeSlide.video} poster={activeSlide.image} paused={motionPaused} />
        )}

        {/* Gradien atas kuat untuk navbar tanpa backdrop-blur */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

        {/* Gradien bawah untuk keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Konten Hero */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-12 md:pb-16 flex flex-col justify-end">
        <div ref={textRef} className="max-w-2xl">
          <div key={activeSlide.key} className="animate-[fadeInUp_0.6s_ease-out_both]">
            {/* Heading Title */}
            <h1 className="text-white font-tan text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.14] sm:leading-[1.05] drop-shadow-md">
              {activeSlide.title}
            </h1>

            {/* Deskripsi */}
            <p className="text-white/85 text-sm md:text-base mt-3 leading-relaxed drop-shadow-sm max-w-xl">
              {activeSlide.description}
            </p>
          </div>
        </div>

        {/* Navigasi Slide: Dots Bar & Panah Navigasi */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 mt-4 sm:mt-8 pt-2">
          {/* Progress Indicators */}
          <div className="flex max-w-full min-w-0 items-center overflow-x-auto no-scrollbar">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => goTo(i)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg px-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-14"
              >
                <span className={`block h-1.5 overflow-hidden rounded-full bg-white/30 transition-all duration-300 ${i === activeIndex ? "w-full" : "w-4 sm:w-5"}`}>
                  {i === activeIndex && (
                    <span className="block h-full bg-white rounded-full" style={{ width: activeSlide.video || paused ? "100%" : `${progress * 100}%` }} />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            {(activeSlide.video || slides.length > 1) && (
              <button
                type="button"
                onClick={() => setMotionPaused((value) => !value)}
                aria-label={motionPaused ? "Lanjutkan animasi hero" : "Jeda animasi hero"}
                aria-pressed={motionPaused}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {motionPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            )}
            <button
              type="button"
              onClick={prev}
              aria-label="Slide sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 cursor-pointer"
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
