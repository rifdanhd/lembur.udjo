"use client";

import { useState } from "react";
import MaskText from "./anim/MaskText";

const faqs = [
  {
    q: "Di mana lokasi Lembur Udjo Parahyangan?",
    a: "Kami berada di Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kabupaten Bandung Barat. Peta lengkapnya bisa dilihat pada bagian Lokasi di halaman ini.",
  },
  {
    q: "Kapan pertunjukan angklung berlangsung?",
    a: "Pertunjukan Angklung & Seni Jawa Barat berlangsung setiap hari pukul 15.30 – 17.30 WIB di Bale Karesmen, sudah termasuk sesi bermain angklung bersama penonton.",
  },
  {
    q: "Apa saja pengalaman yang bisa dicoba pengunjung?",
    a: "Pertunjukan angklung interaktif, wayang golek, tari tradisional, workshop pembuatan angklung, Agrowalk lima titik edukasi keberlanjutan, serta konservasi rumpun bambu.",
  },
  {
    q: "Bagaimana jadwal Agrowalk dan Helaran?",
    a: "Agrowalk berlangsung Selasa – Minggu pukul 08.00 – 14.00 WIB dengan lima titik kunjungan dan pemandu lokal. Helaran Tradisi berlangsung pukul 10.00 – 12.00 WIB dan memerlukan reservasi terlebih dahulu.",
  },
  {
    q: "Apakah melayani kunjungan rombongan sekolah atau komunitas?",
    a: "Ya. Kunjungan rombongan sekolah, komunitas, maupun acara khitanan (helaran) dapat diatur terlebih dahulu agar jadwal pertunjukan dan pemandu disiapkan.",
  },
  {
    q: "Bagaimana cara melakukan reservasi atau bertanya?",
    a: "Hubungi kami lewat tombol WhatsApp, telepon (022) 7279765, atau email corsec.lemburudjo@gmail.com. Tim kami akan membantu jadwal, kapasitas, dan kebutuhan kunjungan Anda.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-stone-50 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Pertanyaan Umum
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              <MaskText text="FAQ Kunjungan Anda" scrub />
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Informasi lokasi, jadwal pertunjukan, dan cara reservasi sebelum berkunjung ke Lembur Udjo Parahyangan.
            </p>
            <div className="pt-4 sm:pt-5">
              <a
                href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-forest hover:border-forest transition-colors"
              >
                Masih Ada Pertanyaan? &rarr;
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-stone-200 border-t border-b border-stone-200 bg-white rounded-xl sm:rounded-2xl overflow-hidden">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="w-full flex items-start justify-between gap-4 text-left px-4 sm:px-6 py-4 sm:py-5 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-extrabold tracking-tight text-stone-950 leading-snug">
                        {faq.q}
                      </span>
                      <span
                        className={`shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-stone-950 border-stone-950 text-white" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      hidden={!isOpen}
                      className="px-4 sm:px-6 pb-4 sm:pb-5 -mt-1"
                    >
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
