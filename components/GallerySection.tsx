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
  { id: 1, title: "Harmoni Angklung Kolosal", category: "Pertunjukan", image: "/hero_background.jpg", desc: "Momen ratusan penonton memainkan angklung serempak di panggung Bale Karesemen." },
  { id: 2, title: "Workshop Merakit Bambu", category: "Edukasi", image: "/workshop.jpg", desc: "Belajar tangga nada Sunda Da-Mi-Na-Ti-La langsung dari perajin bambu handal." },
  { id: 3, title: "Wayang Golek Parahyangan", category: "Pentas Boneka", image: "/wayang.jpg", desc: "Keelokan pahatan kayu dan ekspresi khas wayang golek klasik Sunda." },
  { id: 4, title: "Sosok Inspiratif Mang Udjo", category: "Sejarah", image: "/founder.jpg", desc: "Menelusuri jejak dedikasi pendiri Saung Angklung Udjo sejak 1966." },
  { id: 5, title: "Keceriaan Belajar Anak", category: "Edukasi", image: "/workshop.jpg", desc: "Pendidikan karakter berbasis gotong royong bagi tunas generasi penerus." },
];

const categories = ["Semua", "Pertunjukan", "Edukasi", "Pentas Boneka", "Sejarah"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === "Semua" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="galeri" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Galeri</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">Dokumentasi Visual</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${activeCategory === cat ? "bg-forest text-white border-forest" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} onClick={() => setSelectedPhoto(item)} className="group rounded-lg overflow-hidden border border-stone-200 cursor-pointer hover:shadow-sm transition-all">
              <div className="relative aspect-[4/3] bg-stone-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">{item.category}</span>
                <h3 className="font-serif font-bold text-forest mt-1 group-hover:text-amber-700 transition-colors">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden border border-stone-200 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center">✕</button>
              <div className="relative aspect-[16/10] bg-stone-100">
                <img src={selectedPhoto.image} alt={selectedPhoto.title} className="w-full h-full object-contain" />
              </div>
              <div className="p-6 text-stone-800">
                <span className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase mb-2">{selectedPhoto.category}</span>
                <h3 className="font-serif text-xl font-bold">{selectedPhoto.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
