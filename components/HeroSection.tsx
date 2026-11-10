"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroVideo from "./HeroVideo";
import CTA from "./CTA";
import { DEFAULT_WEBSITE_IMAGES, sectionImages, type WebsiteImage } from "@/lib/website/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_MS = 7000;

export default function HeroSection({
  items = sectionImages(DEFAULT_WEBSITE_IMAGES, "banner"),
}: {
  items?: WebsiteImage[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hero = items[activeIndex % Math.max(items.length, 1)];

  useEffect(() => {
    if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % items.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [items.length]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    if (!section || !media || !copy) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", copy);
        const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", copy);
        const scrollCue = section.querySelector<HTMLElement>("[data-hero-scroll]");

        gsap.set(media, { scale: 1.1 });
        gsap.set(lines, { yPercent: 118 });
        gsap.set(rest, { autoAlpha: 0, y: 16 });
        if (scrollCue) gsap.set(scrollCue, { autoAlpha: 0 });

        const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        entrance
          .to(media, { scale: 1, duration: 2.4, ease: "power2.out" })
          .to(rest.slice(0, 1), { autoAlpha: 1, y: 0, duration: 0.7 }, "-=1.7")
          .to(lines, { yPercent: 0, duration: 1, stagger: 0.1 }, "-=1.35")
          .to(rest.slice(1), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.55")
          .to(scrollCue, { autoAlpha: 1, duration: 0.6 }, "-=0.3");

        gsap.to(media, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(copy, {
          y: -60,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom 45%", scrub: true },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  if (!hero) return null;

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="hero-section relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-forest text-white"
    >
      {/* Latar sinematik */}
      <div ref={mediaRef} className="absolute inset-0 -z-10 origin-center will-change-transform">
        {items.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 transition-all duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] ${
              index === activeIndex ? "scale-100 opacity-100" : "pointer-events-none scale-[1.04] opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            {slide.video && index === activeIndex ? (
              <HeroVideo src={slide.video} poster={slide.image} paused={false} />
            ) : (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        ))}
        {/* Overlay gelap agar tipografi tetap kontras (WCAG AA) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,35,23,.78)_0%,rgba(13,35,23,.46)_34%,rgba(13,35,23,.52)_66%,rgba(13,35,23,.92)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(13,35,23,.12)_0%,rgba(13,35,23,.62)_100%)]"
        />
      </div>

      {/* Komposisi pusat */}
      <div
        ref={copyRef}
        className="relative z-10 flex w-full flex-col items-center px-6 pb-32 pt-28 text-center sm:pb-36 sm:pt-32"
      >
        {/* Logo resmi LUP — warna asli dipertahankan, diletakkan di atas pelat terang */}
        <div data-hero-fade className="rounded-2xl bg-[#F7F5F0] px-5 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,.32)] sm:px-7 sm:py-4">
          <Image
            src="/LOGO_Lembur.udjo.png"
            alt="Logo Lembur Udjo Parahyangan"
            width={2716}
            height={3000}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </div>

        <p
          data-hero-fade
          className="mt-7 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/75 sm:text-[11px] sm:tracking-[0.5em]"
        >
          The Living Journey of Angklung
        </p>

        <h1 className="mt-5 font-tan text-[clamp(2.05rem,7.4vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.005em] text-white">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              Lembur Udjo
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              Parahyangan
            </span>
          </span>
        </h1>

        <span data-hero-fade aria-hidden="true" className="lup-rule mt-6 h-[2px] w-20 sm:w-28" />

        <p
          data-hero-fade
          className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 sm:text-xs sm:tracking-[0.34em]"
        >
          Keep the Old, Create the New
        </p>

        <div data-hero-fade className="mt-8 sm:mt-10">
          <CTA href="#perjalanan" variant="outline-light" ariaLabel="Mulai perjalanan Angklung Journey">
            Mulai Perjalanan
            <span aria-hidden="true" className="text-sm leading-none">
              ↓
            </span>
          </CTA>
        </div>
      </div>

      {/* Penunjuk gulir */}
      <div
        data-hero-scroll
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-white/25">
          <span className="absolute inset-x-0 top-0 block h-4 animate-[fadeInUp_1.6s_ease-in-out_infinite] bg-white/85" />
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/55">Scroll</span>
      </div>

      {/* Pemilih slide */}
      {items.length > 1 ? (
        <div className="absolute bottom-7 right-5 z-10 flex flex-col items-end gap-3 sm:right-8">
          <div className="flex items-center gap-2" aria-label="Pilih foto hero">
            {items.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                aria-label={`Tampilkan foto ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span
                  className={`block h-[2px] rounded-full transition-all duration-500 ${
                    index === activeIndex ? "w-7 bg-white" : "w-3 bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-white/55 sm:block">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </section>
  );
}
