"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import Gallery from "./Gallery";
import type { WebsiteImage } from "@/lib/website/content";
import { safeArticleLink } from "@/lib/website/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function GalleryStoriesSection({
  images,
  stories,
}: {
  images: WebsiteImage[];
  stories: WebsiteImage[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-gallery-image]", section).forEach((image, index) => {
          gsap.fromTo(
            image,
            { yPercent: index % 2 === 0 ? -6 : 6 },
            {
              yPercent: index % 2 === 0 ? 6 : -6,
              ease: "none",
              scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  const entries = stories.filter((story) => safeArticleLink(story.linkUrl)).slice(0, 4);

  return (
    <section id="galeri" ref={sectionRef} className="bg-forest py-20 text-white sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery & Stories"
          title={
            <>
              Halaman-halaman
              <br />
              <em className="font-normal italic">yang masih ditulis.</em>
            </>
          }
          description="Foto kegiatan, potret budaya, dan kabar terbaru dari perjalanan Lembur Udjo Parahyangan."
          accent="#ECCE68"
          tone="light"
        />

        <div className="mt-12 sm:mt-16">
          <Gallery images={images} />
        </div>

        {entries.length ? (
          <div id="cerita" className="mt-16 scroll-mt-24 border-t border-white/15 pt-10 sm:mt-24">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                Cerita terbaru
              </p>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60 transition-colors hover:text-lup-yellow"
              >
                Ikuti di Instagram ↗
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2">
              {entries.map((story) => {
                const href = safeArticleLink(story.linkUrl) || "#kunjungan";
                const external = href.startsWith("http");
                return (
                  <li key={story.key} className="bg-forest">
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors duration-300 hover:bg-forest-light sm:p-8"
                    >
                      <div>
                        <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-lup-orange"
                          />
                          {story.category || "Cerita"}
                        </span>
                        <h3 className="mt-4 max-w-[24ch] font-playfair text-xl font-normal leading-snug tracking-[-0.01em] text-white sm:text-2xl">
                          {story.title}
                        </h3>
                        {story.description ? (
                          <p className="mt-3 max-w-[46ch] text-sm leading-[1.7] text-white/60">
                            {story.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-colors group-hover:border-lup-yellow group-hover:text-lup-yellow">
                        Baca ceritanya <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
