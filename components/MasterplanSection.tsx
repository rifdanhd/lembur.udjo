"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MaskText from "./anim/MaskText";
import { DEFAULT_WEBSITE_IMAGES, sectionImages, type WebsiteImage } from "@/lib/website/content";

export default function MasterplanSection({
  items = sectionImages(DEFAULT_WEBSITE_IMAGES, "masterplan"),
}: { items?: WebsiteImage[] }) {
  const zones = items;
  const dotCount = Math.min(3, zones.length);
  const dotIndexFor = (index: number) => Math.min(dotCount - 1, Math.floor(index * dotCount / zones.length));
  const slideForDot = (dot: number) => Math.min(zones.length - 1, Math.floor(dot * zones.length / dotCount));
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = zones.length ? currentIndex % (zones.length || 1) : 0;
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrentIndex(i);
    elapsedRef.current = 0;
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % (zones.length || 1));
    elapsedRef.current = 0;
  }, [zones.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + zones.length) % (zones.length || 1));
    elapsedRef.current = 0;
  }, [zones.length]);

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
    if (zones.length < 2) return;
    const interval = setInterval(() => {
      if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      elapsedRef.current += 50;
      if (elapsedRef.current >= 8000) {
        elapsedRef.current = 0;
        setCurrentIndex((p) => (p + 1) % (zones.length || 1));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [paused, zones.length]);

  if (!zones.length) return null;

  return (
    <section
      id="masterplan"
      className="relative w-full bg-cream text-forest py-12 sm:py-16 md:py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="w-full mx-auto px-4 mb-8 sm:mb-12 text-center">
        <h2 className="font-tan text-2xl sm:text-3xl md:text-5xl mt-2 text-forest tracking-tight">
          <MaskText text="Visualisasi Kawasan" scrub />
        </h2>
      </div>

      {/* Wrapper Carousel Full-Width dengan Overflow Terbuka & Touch Handler */}
      <div
        className="relative w-full overflow-hidden touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-out items-center [--card-width:88%] [--step:88%] [--offset:44%] md:[--card-width:72%] md:[--step:72%] md:[--offset:36%]"
          style={{
            transform: `translateX(calc(50% - (${activeIndex} * var(--step)) - var(--offset)))`,
          }}
        >
          {zones.map((zone, i) => {
            const active = i === activeIndex;
            return (
              <div
                key={zone.key}
                className={`w-[var(--card-width)] shrink-0 px-1.5 sm:px-2 transition-all duration-500 ${
                  active ? "scale-100 z-20" : "scale-95 z-10 opacity-70 sm:opacity-90"
                }`}
              >
                <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.12)] bg-forest">
                  <img
                    src={zone.image}
                    alt={zone.alt}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-3xl px-4 text-center" aria-live="off">
        {zones[activeIndex].category ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            {zones[activeIndex].category}
          </p>
        ) : null}
        <h3 className="mt-1 text-base font-semibold text-forest">{zones[activeIndex].title}</h3>
        {zones[activeIndex].description && <p className="mt-2 text-sm text-muted">{zones[activeIndex].description}</p>}
      </div>
      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between max-w-xs mx-auto mt-6 sm:mt-10 px-4">
        <button
          type="button"
          onClick={prevSlide}
          disabled={zones.length < 2}
          aria-label="Slide sebelumnya"
          className="w-11 h-11 rounded-full bg-surface hover:bg-surface-alt flex items-center justify-center text-forest transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center">
          {Array.from({ length: dotCount }, (_, i) => {
            const isActive = dotIndexFor(activeIndex) === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(slideForDot(i))}
                aria-label={`Kelompok slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-forest" : "w-2 bg-border"}`} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={zones.length < 2}
          aria-label="Slide berikutnya"
          className="w-11 h-11 rounded-full bg-surface hover:bg-surface-alt flex items-center justify-center text-forest transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
