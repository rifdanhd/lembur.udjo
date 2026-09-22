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
    <section id="jadwal" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Program & Jadwal</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">Pilih Pengalaman Anda</h2>
          <p className="text-stone-600 text-base mt-4">Setiap pengalaman dirancang untuk memberikan pemahaman dan kenangan yang mendalam.</p>
        </div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
           <div className="lg:col-span-7 space-y-3">
             {schedules.map((item) => {
               const isSelected = item.id === selectedId;
               return (
                 <div key={item.id} onClick={() => setSelectedId(item.id)} className={`p-4 sm:p-5 rounded-lg cursor-pointer border-2 transition-all ${isSelected ? "bg-white border-emerald-500 shadow-sm" : "bg-white border-stone-200 hover:border-emerald-400"}`}>
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase ${item.badgeColor}`}>{item.badge}</span>
                     </div>
                     {isSelected && <span className="text-xs font-bold text-emerald-700">✓ Terpilih</span>}
                   </div>
                   <h3 className="font-serif text-lg sm:text-xl font-bold text-forest mb-1">{item.title}</h3>
                   <p className="text-sm text-stone-600 leading-relaxed mb-2">{item.desc}</p>
                   <div className="flex items-center gap-2 sm:gap-4 text-xs text-stone-700 flex-wrap">
                     <span className="font-bold text-emerald-800">{item.time}</span>
                     <span>{item.days}</span>
                   </div>
                 </div>
               );
             })}
           </div>

           <div className="lg:col-span-5">
             <div className="rounded-lg bg-forest text-white p-5 sm:p-7 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800 mb-5">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">Pengalaman Terpilih</span>
                  <h4 className="font-serif text-lg font-bold text-white mt-0.5">{currentSchedule.title}</h4>
                </div>
              </div>
              <div className="space-y-2 mb-5 text-sm text-emerald-100/90 bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between"><span className="text-white/60">Waktu:</span><span className="font-semibold">{currentSchedule.time}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Lokasi:</span><span className="font-semibold text-amber-300">Bale Karesmen, Lembur Udjo</span></div>
              </div>
              <div className="pb-5 border-b border-emerald-800/50">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Termasuk:</p>
                <div className="space-y-1">
                  {currentSchedule.includes.map((inc) => (
                    <div key={inc} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/50 text-center">Untuk informasi lebih lanjut, silakan hubungi kontak di bawah.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
