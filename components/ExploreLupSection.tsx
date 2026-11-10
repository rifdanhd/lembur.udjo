"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import CTA from "./CTA";
import type { WebsiteImage } from "@/lib/website/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const accents = ["#7BBCE8", "#86C95A", "#ECCE68", "#E59A62", "#C95A4A", "#7BBCE8"];

export default function ExploreLupSection({ images }: { images: WebsiteImage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const facilities = images.slice(0, 6);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-facility-row]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 68%", once: true },
          },
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="fasilitas" ref={sectionRef} className="bg-background py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-y-12 gap-x-6 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              eyebrow="Explore LUP"
              title={
                <>
                  Satu lembur,
                  <br />
                  <em className="font-normal italic">banyak ruang bertemu.</em>
                </>
              }
              description="Lembur Udjo Parahyangan dirancang seperti lembur Sunda yang hidup di tengah kawasan modern: panggung, sanggar, kebun bambu, sawah, dan ruang berkumpul saling terhubung dalam satu kunjungan."
              accent="#86C95A"
            />

            <div className="mt-8">
              <CTA href="#kunjungan" variant="outline">
                Rencanakan Kunjungan
              </CTA>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Fasilitas &amp; Ekosistem
            </p>
            <ul className="mt-5 border-t border-border">
              {facilities.map((facility, index) => (
                <li
                  key={facility.key}
                  data-facility-row
                  className="flex gap-4 border-b border-border py-5 sm:gap-5"
                >
                  <span
                    className="w-7 shrink-0 font-tan text-lg leading-tight"
                    style={{ color: accents[index % accents.length] }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-playfair text-lg font-normal leading-snug tracking-[-0.01em] text-forest sm:text-xl">
                        {facility.title}
                      </h3>
                      {facility.category ? (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
                          {facility.category}
                        </span>
                      ) : null}
                    </div>
                    {facility.description ? (
                      <p className="mt-1.5 text-sm leading-[1.7] text-muted">{facility.description}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            {!facilities.length ? (
              <p className="py-6 text-sm text-muted">Daftar fasilitas sedang diperbarui.</p>
            ) : null}
          </div>
        </div>

        {/* Pita foto tunggal sebagai jeda visual */}
        <figure data-facility-row className="relative mt-14 overflow-hidden rounded-2xl sm:mt-20">
          <div className="relative aspect-[16/10] bg-surface-alt sm:aspect-[21/9]">
            <Image
              src="/facilities/area-hijau.png"
              alt="Ruang hijau, sawah, dan kebun bambu di kawasan Lembur Udjo Parahyangan"
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,35,23,.68)_0%,rgba(13,35,23,.15)_55%,rgba(13,35,23,0)_100%)]"
            />
            <figcaption className="absolute inset-y-0 left-0 flex max-w-[26rem] flex-col justify-center p-6 sm:p-10">
              <span className="lup-rule mb-5 h-[2px] w-16" aria-hidden="true" />
              <p className="font-playfair text-xl italic leading-snug text-white sm:text-2xl">
                Sawah, rumpun bambu, dan ruang pertunjukan berjalan dalam satu langkah.
              </p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
