"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Jarak geser awal dalam px */
  y?: number;
  x?: number;
  scale?: number;
  /** Kalau diisi, anak-anak langsung ditampilkan berurutan (stagger) */
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  /** Parallax vertikal (persen dari tinggi elemen) saat di-scroll */
  parallax?: number;
  /** Blur awal dalam px, menyusut ke 0 saat muncul */
  blur?: number;
  /** Sembunyikan awal dengan clip-path lalu tersingkap seperti tirai */
  wipe?: boolean;
  /** CSS selector anak yang TIDAK dianimasikan saat pakai stagger */
  exclude?: string;
};

export default function Reveal({
  children,
  className,
  y = 32,
  x = 0,
  scale = 1,
  stagger,
  delay = 0,
  duration = 0.85,
  start = "top 85%",
  once = true,
  parallax,
  blur,
  wipe,
  exclude,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let targets: HTMLElement[] = [el];
      if (stagger) {
        targets = Array.from(el.children) as HTMLElement[];
        if (exclude) targets = targets.filter((child) => !child.matches(exclude));
      }
      if (!targets.length) return;

      const from: gsap.TweenVars = { autoAlpha: 0, y, x, scale: wipe ? 1.15 : scale };
      const to: gsap.TweenVars = {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once },
      };

      if (blur) {
        from.filter = `blur(${blur}px)`;
        to.filter = "blur(0px)";
      }
      if (wipe) {
        from.clipPath = "inset(100% 0% 0% 0%)";
        to.clipPath = "inset(0% 0% 0% 0%)";
      }

      gsap.fromTo(targets, from, to);

      if (parallax) {
        gsap.fromTo(
          el,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [y, x, scale, stagger, delay, duration, start, once, parallax, blur, wipe, exclude]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
