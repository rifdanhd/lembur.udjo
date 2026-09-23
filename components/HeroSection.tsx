"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (imageRef.current) {
        tl.fromTo(imageRef.current, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 });
      }
      tl.fromTo(titleRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.7")
        .fromTo(descRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="beranda"
      ref={containerRef}
      className="relative w-full h-[78vh] sm:h-[85vh] min-h-[460px] max-h-[760px] overflow-hidden bg-forest flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src="/placeholders/hero.jpg"
          alt="Lembur Udjo Parahyangan"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 via-black/35 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 flex flex-col justify-end h-full">
        <div className="max-w-lg">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-widest mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Wisata Budaya Sunda Terpadu
          </div>

          <h1
            ref={titleRef}
            className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-[1.2] drop-shadow-lg"
          >
            Lembur Udjo{" "}
            <span className="text-amber-400 font-normal">Parahyangan</span>
          </h1>

          <p
            ref={descRef}
            className="text-xs sm:text-sm text-white/80 leading-relaxed mt-3 font-normal max-w-md drop-shadow-md"
          >
            Destinasi wisata budaya Sunda terkemuka di Kawasan Bale Pare, Kota Baru Parahyangan.
            Merajut harmoni musik angklung, seni pertunjukan, dan kelestarian alam.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <a
              href="#pertunjukan"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-900 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <span>Jelajahi Pengalaman</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#jadwal"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs uppercase tracking-wider border border-white/30 backdrop-blur-xs transition-all"
            >
              <span>Jadwal &amp; Reservasi</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#pertunjukan"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll ke konten pertunjukan"
      >
        <span className="text-[9px] uppercase tracking-widest font-semibold group-hover:text-amber-400 transition-colors">Jelajahi</span>
        <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center animate-bounce group-hover:border-amber-400 group-hover:text-amber-400 transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </a>
    </section>
  );
}
