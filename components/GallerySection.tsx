"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const filteredItems = activeCategory === "Semua" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory);

  const markMoving = useCallback(() => {
    setIsMoving(true);
    if (moveTimer.current) clearTimeout(moveTimer.current);
    moveTimer.current = setTimeout(() => setIsMoving(false), 450);
  }, []);

  const getCardPositions = useCallback(() => {
    const el = trackRef.current;
    if (!el) return [] as { el: HTMLElement; pos: number }[];
    const viewportLeft = el.getBoundingClientRect().left;
    return Array.from(el.querySelectorAll<HTMLElement>("[data-card]")).map((card) => ({
      el: card,
      pos: card.getBoundingClientRect().left - viewportLeft + el.scrollLeft,
    }));
  }, []);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    const positions = getCardPositions();
    if (!positions.length) return;
    let nearest = 0;
    let best = Infinity;
    positions.forEach((p, i) => {
      const d = Math.abs(p.pos - el.scrollLeft);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActiveIndex(nearest);
  }, [getCardPositions]);

  const snapToNearest = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const positions = getCardPositions();
    if (!positions.length) return;
    let nearest = positions[0];
    let best = Infinity;
    positions.forEach((p) => {
      const d = Math.abs(p.pos - el.scrollLeft);
      if (d < best) {
        best = d;
        nearest = p;
      }
    });
    el.scrollTo({ left: nearest.pos, behavior: "smooth" });
  }, [getCardPositions]);

  const handleScroll = useCallback(() => {
    markMoving();
    updateState();
    if (draggingRef.current) return;
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => snapToNearest(), 140);
  }, [markMoving, updateState, snapToNearest]);

  // Reset ke awal saat kategori berubah
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: 0 });
    setActiveIndex(0);
    updateState();
  }, [activeCategory, updateState]);

  useEffect(() => {
    return () => {
      if (moveTimer.current) clearTimeout(moveTimer.current);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, []);

  const scrollToIndex = (i: number) => {
    const positions = getCardPositions();
    const target = positions[i];
    if (target && trackRef.current) trackRef.current.scrollTo({ left: target.pos, behavior: "smooth" });
  };

  const scrollByCard = (dir: 1 | -1) => {
    const positions = getCardPositions();
    const el = trackRef.current;
    if (!el || !positions.length) return;
    let nearest = 0;
    let best = Infinity;
    positions.forEach((p, i) => {
      const d = Math.abs(p.pos - el.scrollLeft);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    const nextIndex = Math.min(Math.max(nearest + dir, 0), positions.length - 1);
    scrollToIndex(nextIndex);
  };

  // Drag dengan mouse (swipe di sentuh perangkat tetap native scroll)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.style.scrollBehavior = "auto";
    if (snapTimer.current) clearTimeout(snapTimer.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
    markMoving();
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const el = trackRef.current;
    if (el) el.style.scrollBehavior = "";
    updateState();
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => snapToNearest(), 60);
  };

  return (
    <section id="galeri" className="py-12 sm:py-16 md:py-20 bg-[#f6f7f9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="max-w-2xl">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-amber-600 uppercase block">
              Galeri Visual
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05] mt-2">
              Dokumentasi Budaya
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Geser untuk menjelajahi momen autentik dan kehangatan tradisi Sunda yang hidup melalui rekaman visual pengunjung dan seniman kami.
            </p>
          </div>
          <button
            onClick={() => setActiveCategory("Semua")}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-stone-950 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-forest transition-colors shadow-sm"
          >
            Semua Galeri &rarr;
          </button>
        </div>

        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-2 no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-stone-950 text-white border-stone-950 shadow-sm"
                  : "bg-white text-stone-600 border-stone-300 hover:border-stone-950 hover:text-stone-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          {/* Tombol panah — tersembunyi saat slide bergerak */}
          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-xl border border-stone-200 items-center justify-center text-stone-950 transition-all duration-300 hover:bg-stone-950 hover:text-white disabled:opacity-0 disabled:pointer-events-none hidden sm:flex ${
              isMoving || isDragging ? "opacity-0 -translate-x-1.5 pointer-events-none" : "opacity-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-xl border border-stone-200 items-center justify-center text-stone-950 transition-all duration-300 hover:bg-stone-950 hover:text-white disabled:opacity-0 disabled:pointer-events-none hidden sm:flex ${
              isMoving || isDragging ? "opacity-0 translate-x-1.5 pointer-events-none" : "opacity-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className={`no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {filteredItems.map((item) => (
              <article
                key={item.id}
                data-card
                className="group shrink-0 w-[82%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.34px)] rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/95 text-stone-950 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-950 group-hover:text-amber-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-stone-100 text-[11px] font-extrabold uppercase tracking-wider text-stone-950 underline-offset-4 group-hover:underline">
                    Lihat Foto &rarr;
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Indikator slide */}
          <div className="flex justify-center gap-1.5 mt-5">
            {filteredItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ke slide ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "w-8 bg-stone-950" : "w-2.5 bg-stone-300 hover:bg-stone-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
