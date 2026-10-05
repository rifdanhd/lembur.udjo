"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type MaskTextProps = {
  text: string;
  /** Jeda sebelum animasi mulai (detik) */
  delay?: number;
  /** Jeda antar kata (detik) */
  stagger?: number;
  /** Geser naik pelan mengikuti scroll setelah muncul */
  scrub?: boolean;
};

/**
 * Judul dengan reveal "mask": tiap kata keluar dari balik kotak tersembunyi,
 * lalu (opsional) sedikit bergeser mengikuti scroll.
 */
export default function MaskText({ text, delay = 0, stagger = 0.05, scrub = false }: MaskTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
      if (words.length > 0) {
        gsap.fromTo(
          words,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            delay,
            ease: "power4.out",
            stagger,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }

      if (scrub) {
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: -36,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 12%", end: "+=160", scrub: true },
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
  }, [delay, stagger, scrub]);

  const words = text.split(" ");

  return (
    <span ref={ref} className="inline-block">
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden leading-[1.36] -mb-[0.19em]">
            <span data-word="true" className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
