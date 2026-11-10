"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Chapter = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  accent: string;
  paragraphs: string[];
  image: string;
  alt: string;
  caption: string;
  aspect: string;
};

/* Perjalanan Angklung — empat babak yang disetujui.
   Progresi warna berjalan dari biru ke merah: #7BBCE8 → #86C95A → #ECCE68 → #C95A4A,
   dengan #E59A62 sebagai jembatan antara warisan dan pengalaman baru. */
const chapters: Chapter[] = [
  {
    id: "bab-01",
    number: "01",
    kicker: "Akar budaya",
    title: "Ritual & Tradisi",
    accent: "#7BBCE8",
    paragraphs: [
      "Angklung lahir dari tanah Sunda sebagai alat ritual: penghormatan kepada Dewi Sri, penenang hati saat bertani, dan bunyi yang menemani upacara desa.",
      "Satu tabung bambu hanya menghasilkan satu nada. Karena itu angklung tidak pernah dimainkan sendirian — harmoni lahir ketika banyak orang memilih mendengar dan memberi ruang.",
    ],
    image: "/arsip Abah Udjo/mama nari.jpg",
    alt: "Arsip budaya Sunda: gerak dan doa dalam tradisi",
    caption: "Arsip tradisi Sunda",
    aspect: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]",
  },
  {
    id: "bab-02",
    number: "02",
    kicker: "1938 · Inovasi",
    title: "Daeng Soetigna",
    accent: "#86C95A",
    paragraphs: [
      "Pada 1938, Daeng Soetigna menyusun ulang nada angklung mengikuti tangga nada diatonik. Angklung keluar dari ruang ritual dan masuk ke ansambel — mampu berpadu dengan biola, gitar, dan alat musik modern.",
      "Inovasi itu membuat angklung tetap terdengar di zamannya tanpa kehilangan bunyi aslinya: cara baru memainkan warisan yang sama.",
    ],
    image: "/gallery/workshop-merakit-bambu.png",
    alt: "Proses merakit angklung dari bambu oleh pengrajin",
    caption: "Merakit angklung — dari bambu menjadi nada",
    aspect: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[5/4]",
  },
  {
    id: "bab-03",
    number: "03",
    kicker: "1966 · Pendidikan",
    title: "Udjo Ngalagena",
    accent: "#ECCE68",
    paragraphs: [
      "Abah Udjo Ngalagena dan Uum Sumiati mendirikan Saung Angklung Udjo pada 1966 — panggung, sanggar, dan rumah bagi seniman sekaligus pengrajin angklung.",
      "Sejak itu angklung menjadi pendidikan: pertunjukan interaktif yang mengajak penonton bermain, dan budaya yang diajarkan dengan cara yang menyenangkan.",
    ],
    image: "/arsip Abah Udjo/abah-udjo-legend.webp",
    alt: "Arsip Udjo Ngalagena bersama Uum Sumiati",
    caption: "Arsip Udjo Ngalagena & Uum Sumiati",
    aspect: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3]",
  },
  {
    id: "bab-04",
    number: "04",
    kicker: "Hari ini",
    title: "Lembur Udjo Parahyangan",
    accent: "#C95A4A",
    paragraphs: [
      "Keep the Old, Create the New. Warisan itu kini dibawa ke kawasan baru di Bale Pare: ruang pertunjukan, workshop angklung, agrowalk, dan konservasi bambu dalam satu perjalanan.",
      "Bunyi yang sama, ruang yang lebih luas — agar budaya Sunda tetap hidup di tengah masyarakatnya.",
    ],
    image: "/LUP.png",
    alt: "Visualisasi kawasan Lembur Udjo Parahyangan",
    caption: "Visualisasi kawasan — belum merupakan fasilitas yang telah selesai",
    aspect: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[3/2]",
  },
];

function JourneyChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const imageFirst = index % 2 === 0;

  return (
    <article id={chapter.id} className="scroll-mt-24 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-12 items-center gap-y-8 gap-x-6 lg:gap-x-12">
        {/* Gambar */}
        <div
          data-journey-media
          className={`col-span-12 lg:col-span-7 ${imageFirst ? "lg:col-start-1" : "lg:col-start-6"}`}
        >
          <figure className="relative">
            <div className={`relative overflow-hidden rounded-2xl bg-surface-alt ${chapter.aspect}`}>
              <Image
                src={chapter.image}
                alt={chapter.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                priority={index === 0}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1"
                style={{ backgroundColor: chapter.accent }}
              />
            </div>
            <figcaption className="mt-3 text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
              {chapter.caption}
            </figcaption>
          </figure>
        </div>

        {/* Naskah */}
        <div
          data-journey-copy
          className={`col-span-12 lg:col-span-4 ${imageFirst ? "lg:col-start-9" : "lg:col-start-1 lg:row-start-1"}`}
        >
          <div className="flex items-baseline gap-4">
            <span
              className="font-tan text-[clamp(3rem,7vw,5rem)] leading-[0.8]"
              style={{ color: chapter.accent }}
              aria-hidden="true"
            >
              {chapter.number}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Bab {chapter.number} · {chapter.kicker}
            </span>
          </div>

          <h3 className="mt-6 font-playfair text-[clamp(1.9rem,3.6vw,3.25rem)] font-normal leading-[1.06] tracking-[-0.02em] text-forest">
            {chapter.title}
          </h3>

          <span
            aria-hidden="true"
            className="mt-6 block h-[3px] w-16 rounded-full"
            style={{ backgroundColor: chapter.accent }}
          />

          <div className="mt-6 max-w-[54ch] space-y-4 text-[15px] leading-[1.8] text-muted sm:text-base">
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AngklungJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const progress = section.querySelector<HTMLElement>("[data-journey-progress]");
        if (progress) {
          gsap.fromTo(
            progress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 80%", scrub: 0.4 },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>("[data-journey-copy]", section).forEach((block) => {
          gsap.fromTo(
            block,
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: block, start: "top 82%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-journey-media]", section).forEach((block) => {
          gsap.fromTo(
            block,
            { autoAlpha: 0, y: 44, clipPath: "inset(8% 8% 8% 8%)" },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: block, start: "top 85%", once: true },
            },
          );
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="perjalanan" ref={sectionRef} className="relative bg-background py-20 sm:py-28 lg:py-32">
      {/* Rel progres warna LUP */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-border">
        <div data-journey-progress className="lup-gradient h-full w-full origin-left" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Angklung Journey"
          title={
            <>
              Empat babak dari
              <br />
              <em className="font-normal italic">satu perjalanan panjang.</em>
            </>
          }
          description="Dari ritual di sawah, inovasi nada 1938, berdirinya Saung Angklung Udjo 1966, hingga Lembur Udjo Parahyangan hari ini — satu cerita yang belum selesai."
          accent="#7BBCE8"
        />

        <div className="mt-4 divide-y divide-border border-t border-border sm:mt-8">
          {chapters.slice(0, 3).map((chapter, index) => (
            <JourneyChapter key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>

        {/* Jembatan oranye: warisan bertemu pengalaman baru */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 text-center sm:py-8">
          <span aria-hidden="true" className="hidden h-px flex-1 bg-border sm:block" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lup-orange" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            Warisan bertemu pengalaman baru
          </span>
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lup-red" />
          <span aria-hidden="true" className="hidden h-px flex-1 bg-border sm:block" />
        </div>

        <div className="divide-y divide-border border-t border-border">
          {chapters.slice(3).map((chapter, index) => (
            <JourneyChapter key={chapter.id} chapter={chapter} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
