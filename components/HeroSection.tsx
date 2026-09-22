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

      // Animasi foto background: efek zoom-in halus & fade in
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.08, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: 1.5 }
        );
      }

      // Animasi teks masuk secara berurutan (stagger/timeline)
      tl.fromTo(
        titleRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=1.0"
      ).fromTo(
        descRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.7"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
<section id="beranda" ref={containerRef} className="relative w-full overflow-hidden bg-forest">
       {/* Foto FULL tanpa potongan — tinggi section mengikuti foto */}
       <img
         ref={imageRef}
         src="/LUP.png"
         alt="Lembur Udjo Parahyangan Landscape"
         className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover block will-change-transform"
         style={{ objectPosition: "50% 0%" }}
       />

      {/* Gradient overlay agar teks putih terbaca jelas */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-forest/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-black/30" />

      {/* Konten di atas foto */}
      <div className="absolute inset-0 flex items-center">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <div className="max-w-md sm:max-w-lg space-y-2 sm:space-y-3">
<h1
               ref={titleRef}
               className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-md"
             >
               Lembur Udjo Parahyangan
             </h1>

             {/* Deskripsi: Font putih */}
             <p
               ref={descRef}
               className="text-sm sm:text-base text-white/95 leading-relaxed font-normal max-w-lg drop-shadow-md"
             >
               Destinasi wisata budaya Sunda di Kawasan Bale Pare, Kota Baru Parahyangan — tempat angklung, tradisi, dan alam menyatu dalam satu pengalaman yang hidup dan penuh makna.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

