"use client";

import { useState } from "react";

interface ScheduleItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  time: string;
  days: string;
  includes: string[];
}

const schedules: ScheduleItem[] = [
  { id: "angklung", badge: "Utama", badgeColor: "bg-amber-500 text-white", title: "Pertunjukan Angklung & Seni Jawa Barat", desc: "Sajian pertunjukan seni angklung dan seni tradisi Jawa Barat yang autentik. Pengunjung diajak langsung bermain angklung bersama secara interaktif.", time: "15:30 – 17:30 WIB", days: "Setiap Hari (Senin – Minggu)", includes: ["Akses Bale Karesmen", "Pertunjukan Interaktif", "Sesi Bermain Angklung", "Sesi Foto"] },
  { id: "helaran", badge: "Tradisi", badgeColor: "bg-emerald-600 text-white", title: "Helaran Tradisi", desc: "Tradisi arak-arakan dalam perayaan anak yang akan dikhitan. Diiringi angklung dan tarian, Helaran membawa makna rasa syukur, kebersamaan, dan dukungan masyarakat.", time: "10:00 – 12:00 WIB", days: "Setiap Hari (Reservasi)", includes: ["Pertunjukan Helaran", "Iringan Angklung", "Tarian Tradisional", "Makna Budaya"] },
  { id: "agrowalk", badge: "Edukasi", badgeColor: "bg-stone-700 text-white", title: "Agrowalk – Edukasi Keberlanjutan", desc: "Perjalanan berpandu ke 5 titik edukasi: Peternakan Domba & Ayam, Pengelolaan Sampah Organik, Pembibitan Pepaya & Pisang, Arboretum Bambu, dan Sentra Perajin Angklung.", time: "08:00 – 14:00 WIB", days: "Selasa – Minggu (Min. 10 Orang)", includes: ["5 Titik Kunjungan", "Pemandu Lokal", "Pemanduan Proses Hulu-Hilir", "Kesadaran Keberlanjutan"] },
];

export default function ScheduleSection() {
  const [selectedId, setSelectedId] = useState("angklung");
  const currentSchedule = schedules.find((s) => s.id === selectedId) || schedules[0];

  return (
    <section id="jadwal" className="py-12 sm:py-16 md:py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* InJourney section-head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">
              Jadwal & Agenda
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight">
              Pilih Pengalaman Anda
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Ikuti jadwal pertunjukan angklung interaktif, tradisi helaran, dan workshop budaya Sunda setiap hari.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20reservasi%20tiket"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xs transition-all"
            >
              <span>Reservasi via WhatsApp</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* InJourney upcoming event grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Featured Card (InJourney card-event-featured) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <article className="rounded-2xl bg-forest text-white overflow-hidden shadow-lg border border-emerald-800/60 flex flex-col justify-between">
              {/* Featured Image */}
              <div className="relative aspect-[16/10] w-full bg-stone-900 overflow-hidden">
                <img 
                  src={
                    selectedId === "helaran" 
                      ? "/placeholders/helaran.jpg" 
                      : selectedId === "agrowalk" 
                      ? "/placeholders/agrowalk.jpg" 
                      : "/placeholders/angklung.jpg"
                  } 
                  alt={currentSchedule.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${currentSchedule.badgeColor}`}>
                    {currentSchedule.badge}
                  </span>
                </div>
              </div>

              {/* Featured Body */}
              <div className="p-5 sm:p-6 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">Pengalaman Terpilih</span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-0.5 leading-snug">
                    {currentSchedule.title}
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-emerald-100 bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Waktu:</span>
                    <span className="font-bold text-white">{currentSchedule.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Hari:</span>
                    <span className="font-semibold text-white/90">{currentSchedule.days}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Lokasi:</span>
                    <span className="font-semibold text-amber-300">Bale Karesmen, Lembur Udjo</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5">Termasuk Pengalaman:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentSchedule.includes.map((inc) => (
                      <div key={inc} className="flex items-center gap-1.5 text-xs text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-800/60">
                  <a
                    href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20pesan%20tiket%20untuk%20jadwal%20pertunjukan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                  >
                    <span>Pesan Tiket Sekarang</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Agenda List (InJourney card-event style) */}
          <div className="lg:col-span-7 space-y-3.5">
            {schedules.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedId(item.id)} 
                  className={`p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                    isSelected 
                      ? "bg-stone-50/80 border-emerald-600 shadow-sm ring-1 ring-emerald-500/20" 
                      : "bg-white border-stone-200/90 hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {item.days}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>✓</span> Terpilih
                      </span>
                    )}
                  </div>

                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-forest mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.time}</span>
                    </div>
                    <span className="text-xs font-semibold text-forest group-hover:text-amber-600 inline-flex items-center gap-1">
                      <span>Pilih Jadwal</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
