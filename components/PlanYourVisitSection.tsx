"use client";

import { Clock, Mail, MapPin, Phone, Ticket, Users } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import CTA from "./CTA";
import { RESERVATION_URL, BOOKING_URL } from "@/lib/site-domains";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const info = [
  {
    icon: Clock,
    label: "Pertunjukan Harian",
    value: "15.30 – 17.30 WIB",
    detail: "Bale Karesmen, setiap hari — sudah termasuk sesi bermain angklung bersama.",
    accent: "#7BBCE8",
  },
  {
    icon: MapPin,
    label: "Agrowalk",
    value: "Selasa – Minggu",
    detail: "08.00 – 14.00 WIB, lima titik edukasi dengan pemandu lokal.",
    accent: "#86C95A",
  },
  {
    icon: Users,
    label: "Rombongan",
    value: "Dengan reservasi",
    detail: "Sekolah, komunitas, dan acara keluarga perlu dijadwalkan terlebih dahulu.",
    accent: "#ECCE68",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Kawasan Bale Pare",
    detail: "Kota Baru Parahyangan, Padalarang, Kabupaten Bandung Barat.",
    accent: "#E59A62",
  },
];

export default function PlanYourVisitSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-visit-card]",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="kunjungan" ref={sectionRef} className="border-t border-border bg-surface py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plan Your Visit"
          title={
            <>
              Datang dengan tenang,
              <br />
              <em className="font-normal italic">pulang dengan cerita.</em>
            </>
          }
          description="Semua yang perlu kamu tahu sebelum menuju Lembur Udjo Parahyangan — jadwal, lokasi, dan cara memesan."
          accent="#C95A4A"
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {info.map(({ icon: Icon, ...item }) => (
            <article
              key={item.label}
              data-visit-card
              className="flex flex-col rounded-2xl border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(13,35,23,.08)]"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${item.accent}26`, color: "#0D2317" }}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.26em] text-muted">
                {item.label}
              </p>
              <p className="mt-2 font-playfair text-xl leading-snug tracking-[-0.01em] text-forest">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-[1.7] text-muted">{item.detail}</p>
            </article>
          ))}
        </div>

        <div
          data-visit-card
          className="mt-10 flex flex-col gap-8 rounded-2xl border border-border bg-background p-6 sm:mt-14 sm:p-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-xl">
            <span className="lup-rule mb-5 block h-[2px] w-20" aria-hidden="true" />
            <h3 className="font-playfair text-2xl font-normal leading-snug tracking-[-0.01em] text-forest sm:text-3xl">
              Siap masuk ke cerita berikutnya?
            </h3>
            <p className="mt-3 text-[15px] leading-[1.75] text-muted">
              Pesan tiket pertunjukan secara online, atau hubungi kami untuk jadwal rombongan dan
              kebutuhan khusus.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <CTA href={BOOKING_URL} external variant="solid">
              <Ticket size={15} aria-hidden="true" strokeWidth={2.2} />
              Pesan Tiket
            </CTA>
            <CTA href={RESERVATION_URL} external variant="outline">
              <Phone size={15} aria-hidden="true" strokeWidth={2.2} />
              Tanya via WhatsApp
            </CTA>
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="inline-flex items-center gap-2">
            <Phone size={13} aria-hidden="true" /> (022) 7279765
          </span>
          <span className="inline-flex items-center gap-2 break-all">
            <Mail size={13} aria-hidden="true" /> corsec.lemburudjo@gmail.com
          </span>
        </p>
      </div>
    </section>
  );
}
