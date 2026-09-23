"use client";

import { useState } from "react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  desc: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, title: "Harmoni Angklung Kolosal", category: "Pertunjukan", image: "/placeholders/angklung.jpg", desc: "Momen ratusan penonton memainkan angklung serempak di panggung Bale Karesemen." },
  { id: 2, title: "Workshop Merakit Bambu", category: "Edukasi", image: "/placeholders/workshop.jpg", desc: "Belajar tangga nada Sunda Da-Mi-Na-Ti-La langsung dari perajin bambu handal." },
  { id: 3, title: "Wayang Golek Parahyangan", category: "Pentas Boneka", image: "/placeholders/wayang.jpg", desc: "Keelokan pahatan kayu dan ekspresi khas wayang golek klasik Sunda." },
  { id: 4, title: "Sosok Inspiratif Mang Udjo", category: "Sejarah", image: "/placeholders/founder.jpg", desc: "Menelusuri jejak dedikasi pendiri Saung Angklung Udjo sejak 1966." },
  { id: 5, title: "Keceriaan Belajar Anak", category: "Edukasi", image: "/placeholders/education.jpg", desc: "Pendidikan karakter berbasis gotong royong bagi tunas generasi penerus." },
];

const categories = ["Semua", "Pertunjukan", "Edukasi", "Pentas Boneka", "Sejarah"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === "Semua" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="galeri" className="py-12 sm:py-16 md:py-20 bg-[#fcfaf6] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* InJourney section-head with left title and right CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">
              Galeri Visual
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight">
              Dokumentasi Budaya
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Saksikan momen autentik dan kehangatan tradisi Sunda yang hidup melalui rekaman visual pengunjung dan seniman kami.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => setActiveCategory("Semua")}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-stone-300 hover:border-forest hover:bg-forest hover:text-white active:scale-95 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all min-h-[40px] cursor-pointer"
            >
              <span>Semua Galeri</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Scrollable horizontal tabs (InJourney pill tabs) */}
        <div className="relative mb-6 sm:mb-8">
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-4 sm:px-0 -mx-4 sm:mx-0 flex-nowrap scrollbar-hide sm:justify-start touch-pan-x"
            style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap active:scale-95 min-h-[38px] flex items-center justify-center ${
                  activeCategory === cat 
                    ? "bg-forest text-white border-forest shadow-xs" 
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* InJourney Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <article 
              key={item.id} 
              onClick={() => setSelectedPhoto(item)} 
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-stone-900 shadow-xs">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-forest text-sm sm:text-base group-hover:text-amber-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                  <span>Lihat Foto</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Lightbox Popup */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white flex items-center justify-center min-w-[44px] min-h-[44px] transition-colors cursor-pointer" 
                aria-label="Tutup preview galeri"
              >
                ✕
              </button>
              <div className="relative aspect-[16/10] w-full bg-stone-900 shrink-0">
                <img src={selectedPhoto.image} alt={selectedPhoto.title} className="w-full h-full object-contain" />
              </div>
              <div className="p-6 text-stone-800 overflow-y-auto">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-emerald-100 text-emerald-800">
                  {selectedPhoto.category}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-forest mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
