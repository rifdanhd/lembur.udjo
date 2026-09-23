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
  { id: "angklung", badge: "Utama", badgeColor: "bg-amber-500 text-white", title: "Pertunjukan Angklung & Seni Jawa Barat", desc: "Sajian pertunjukan seni angklung dan seni tradisi Jawa Barat yang autentik.", time: "15:30 – 17:30 WIB", days: "Setiap Hari", includes: ["Akses Bale Karesmen", "Pertunjukan Interaktif", "Sesi Bermain Angklung"] },
  { id: "helaran", badge: "Tradisi", badgeColor: "bg-emerald-600 text-white", title: "Helaran Tradisi", desc: "Tradisi arak-arakan dalam perayaan anak yang akan dikhitan.", time: "10:00 – 12:00 WIB", days: "Setiap Hari (Reservasi)", includes: ["Pertunjukan Helaran", "Iringan Angklung", "Tarian Tradisional"] },
  { id: "agrowalk", badge: "Edukasi", badgeColor: "bg-stone-700 text-white", title: "Agrowalk – Edukasi Keberlanjutan", desc: "Perjalanan berpandu ke 5 titik edukasi: Peternakan, Sampah Organik, Bibit Pepaya, Arboretum Bambu, Sentra Perajin.", time: "08:00 – 14:00 WIB", days: "Selasa – Minggu", includes: ["5 Titik Kunjungan", "Pemandu Lokal", "Kesadaran Keberlanjutan"] },
];

export default function ScheduleSection() {
  const [selectedId, setSelectedId] = useState("angklung");
  const currentSchedule = schedules.find((s) => s.id === selectedId) || schedules[0];

  return (
    <section id="jadwal" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">Jadwal & Agenda</span>
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-forest tracking-tight">Pilih Pengalaman Anda</h2>
          <p className="text-stone-600 text-sm mt-2.5 leading-relaxed">Ikuti jadwal pertunjukan angklung interaktif, tradisi helaran, dan workshop budaya Sunda setiap hari.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <article className="rounded-2xl bg-forest text-white overflow-hidden shadow-lg flex flex-col justify-between">
              <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden">
                <img src={selectedId === "helaran" ? "/placeholders/helaran.jpg" : selectedId === "agrowalk" ? "/placeholders/agrowalk.jpg" : "/placeholders/angklung.jpg"} alt={currentSchedule.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${currentSchedule.badgeColor}`}>{currentSchedule.badge}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">Pengalaman Terpilih</span>
                <h3 className="font-cinzel text-xl font-bold text-white mt-0.5 leading-snug">{currentSchedule.title}</h3>

                <div className="space-y-2 text-xs text-emerald-100 bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <div className="flex justify-between"><span className="text-white/60">Waktu:</span><span className="font-bold text-white">{currentSchedule.time}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Hari:</span><span className="font-semibold text-white/90">{currentSchedule.days}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Lokasi:</span><span className="font-semibold text-amber-300">Bale Karesmen</span></div>
                </div>

              </div>
            </article>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {schedules.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div key={item.id} onClick={() => setSelectedId(item.id)} className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${isSelected ? "bg-stone-50/80 border-emerald-600 shadow-sm" : "bg-white border-stone-200 hover:border-emerald-300 hover:shadow-sm"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.badgeColor}`}>{item.badge}</span>
                      <span className="text-xs text-stone-500">{item.days}</span>
                    </div>
                    {isSelected && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Terpilih</span>}
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-forest mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">{item.time}</span>
                    <span className="text-xs font-semibold text-forest">Pilih Jadwal &rarr;</span>
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
