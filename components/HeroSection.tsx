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
        tl.fromTo(
          imageRef.current,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2 }
        );
      }

      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      ).fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="beranda" ref={containerRef} className="relative w-full overflow-hidden bg-forest">
      <div className="relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[440px]">
        <img
          ref={imageRef}
          src="/LUP.png"
          alt="Lembur Udjo Parahyangan"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
          sizes="(max-width: 768px) 100vw, 100vw"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/85 via-forest/55 to-transparent" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex items-end pb-4 sm:pb-6 md:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm sm:max-w-md">
            <h1
              ref={titleRef}
              className="font-serif text-[clamp(1.5rem,5vw,2rem)] sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-lg whitespace-normal"
            >
              Lembur Udjo <span className="text-amber-400">Parahyangan</span>
            </h1>
            <p
              ref={descRef}
              className="text-[clamp(0.75rem,2.5vw,0.875rem)] text-white/90 leading-relaxed mt-1 sm:mt-2 font-medium"
            >
              Destinasi wisata budaya Sunda di Kawasan Bale Pare, Kota Baru
              Parahyangan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
