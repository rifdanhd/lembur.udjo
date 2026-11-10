"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import ExperienceCard from "./ExperienceCard";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: "karesmen",
    index: "01",
    title: "Karesmen Udjo",
    description:
      "Ruang pertunjukan utama Lembur Udjo: angklung, arumba, tari, dan wayang golek dipentaskan dekat dengan penonton — sering kali berakhir dengan penonton ikut bermain.",
    image: "/facilities/bale-karesmen.png",
    alt: "Pertunjukan angklung di Karesmen Udjo",
    accent: "#C95A4A",
    tag: "Pertunjukan",
    href: "#kunjungan",
  },
  {
    id: "agrowalk",
    index: "02",
    title: "Agrowalk",
    description:
      "Perjalanan berpemandu ke lima titik edukasi: peternakan, pengolahan sampah organik, bibit pepaya, arboretum bambu, dan sentra perajin.",
    image: "/facilities/agrowalk.png",
    alt: "Agrowalk di antara kebun bambu dan persawahan",
    accent: "#86C95A",
    tag: "Alam",
    href: "#kunjungan",
  },
  {
    id: "workshop",
    index: "03",
    title: "Workshop Angklung",
    description:
      "Belajar langsung dari pengrajin: mengenal bambu, merangkai tabung, dan membawa pulang nada pertama yang kamu mainkan sendiri.",
    image: "/facilities/workshop-angklung.png",
    alt: "Workshop pembuatan angklung bersama pengrajin",
    accent: "#ECCE68",
    tag: "Edukasi",
    href: "#kunjungan",
  },
];

export default function ExploreExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-experience-card]",
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="pengalaman" ref={sectionRef} className="bg-surface-alt py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Explore Experiences"
            title={
              <>
                Tiga cara memulai
                <br />
                <em className="font-normal italic">perjalananmu.</em>
              </>
            }
            description="Pilih panggungnya, jalurnya, atau tangannya — ketiganya bertemu di satu lembur."
            accent="#E59A62"
          />
          <a
            href="#kunjungan"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start text-[11px] font-bold uppercase tracking-[0.2em] text-forest transition-colors hover:text-lup-red lg:self-auto"
          >
            Rencanakan kunjungan
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 sm:mt-16">
          {experiences.map((experience) => (
            <div key={experience.id} data-experience-card>
              <ExperienceCard {...experience} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
