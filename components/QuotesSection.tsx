"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  photo: string;
  pos?: string;
  quote?: string;
  caption: string;
  alt: string;
};

const toSrc = (path: string) =>
  path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

const arsip = (file: string) => toSrc(`/arsip Abah Udjo/${file}`);

const allSlides: Slide[] = [
  {
    photo: arsip("bab v.jpg"),
    pos: "50% 22%",
    quote:
      "Saya mendirikan Saung Angklung Udjo bersama istri saya, dengan asa menghadirkan kebahagiaan bagi setiap orang melalui kemampuan yang saya miliki.",
    caption: "Perjalanan Abah Udjo",
    alt: "Foto arsip perjalanan Abah Udjo",
  },
  {
    photo: arsip("diantara orang bule.jpg"),
    quote: "Dengan pertunjukan sederhana, suatu waktu angklung akan mendunia.",
    caption: "Tamu Mancanegara",
    alt: "Abah Udjo bersama tamu mancanegara",
  },
  {
    photo: arsip("002.jpg"),
    quote:
      "Belajar budaya paling menyenangkan dilakukan melalui bermain — di situlah anak-anak menemukan cintanya pada tradisi.",
    caption: "Belajar Bermain",
    alt: "Anak-anak bermain alat musik bambu bersama Abah Udjo",
  },
  {
    photo: arsip("bbab 1 udjo diantara teman teman 2.jpg"),
    quote:
      "Angklung bukan untuk disimpan, melainkan untuk dimainkan bersama agar harmoni itu benar-benar nyata.",
    caption: "Di Antara Sahabat",
    alt: "Abah Udjo di antara teman-teman",
  },
  {
    photo: arsip("udjo di saung angklung.jpg"),
    caption: "Di Saung Angklung",
    alt: "Abah Udjo di Saung Angklung",
  },
  {
    photo: arsip("ngajar.jpg"),
    caption: "Mengajar",
    alt: "Abah Udjo sedang mengajar",
  },
  {
    photo: arsip("menikmati suara suling bambu.jpg"),
    caption: "Alunan Bambu",
    alt: "Menikmati suara suling bambu",
  },
  {
    photo: arsip("udjo dan kolega pemusik bambu.jpg"),
    caption: "Musisi Bambu",
    alt: "Abah Udjo bersama kolega musisi bambu",
  },
  {
    photo: arsip("habibie.jpg"),
    caption: "Tamu Istimewa",
    alt: "Abah Udjo bersama tamu istimewa",
  },
  {
    photo: arsip("putri thailand 1.jpg"),
    caption: "Jamuan Mancanegara",
    alt: "Abah Udjo menjamu putri Thailand",
  },
  {
    photo: arsip("semasa di sekolah.jpg"),
    caption: "Masa Kecil",
    alt: "Abah Udjo semasa di sekolah",
  },
  {
    photo: arsip("maen di pendopo dulu.jpg"),
    caption: "Bermain di Pendopo",
    alt: "Abah Udjo bermain di pendopo",
  },
  {
    photo: arsip("thn br 80an.jpg"),
    caption: "Akhir 80-an",
    alt: "Abah Udjo akhir tahun 80-an",
  },
  {
    photo: arsip("udjo dan para tamu.jpg"),
    caption: "Menyambut Tamu",
    alt: "Abah Udjo menyambut para tamu",
  },
  {
    photo: arsip("main di dpan rumah abah.jpg"),
    caption: "Suasana Rumah",
    alt: "Suasana di depan rumah Abah",
  },
  {
    photo: arsip("mama nari.jpg"),
    caption: "Bersama Keluarga",
    alt: "Abah Udjo bersama keluarga",
  },
];

// Hanya tampilkan 3 slide pertama, sisanya di-hide
const slides = allSlides.slice(0, 3);

const AUTOPLAY_MS = 6000;
const PROGRESS_TICK_MS = 50;

export default function QuotesSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    elapsedRef.current = 0;
  }, []);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
    elapsedRef.current = 0;
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
    elapsedRef.current = 0;
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      elapsedRef.current += PROGRESS_TICK_MS;
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        setCurrent((p) => (p + 1) % slides.length);
      }
    }, PROGRESS_TICK_MS);
    return () => clearInterval(interval);
  }, [paused]);

  const active = slides[current];

  return (
    <section
      id="kata"
      className="pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-white touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-green-900 uppercase block">
            Kata Abah Udjo
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05] mt-2">
            Kutipan yang Terus Menginspirasi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center">
          {/* Foto Slide — arsip Abah Udjo ikut di quotes */}
          <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
            {slides.map((item, i) => (
              <img
                key={item.photo}
                src={item.photo}
                alt={item.alt}
                loading="lazy"
                style={item.pos ? { objectPosition: item.pos } : undefined}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <span className="absolute left-3 bottom-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm">
              {active.caption}
            </span>
          </div>

          {/* Teks Quote */}
          <div key={current} className="animate-[fadeInUp_0.6s_ease-out_both]">
            <span
              className="block text-6xl sm:text-7xl font-extrabold text-green-900 leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-stone-950 leading-snug -mt-2">
              {active.quote ?? active.caption}
            </blockquote>
            <p className="mt-4 sm:mt-5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-green-900">
              Udjo Ngalagena &middot; Abah Udjo
            </p>

            {/* Kontrol: Dots + Panah */}
            <div className="flex items-center justify-between mt-6 sm:mt-8 pt-2">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => {
                  const isActive = current === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "w-8 bg-green-900"
                          : "w-3 bg-stone-300 hover:bg-stone-400"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Slide sebelumnya"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-stone-200/80 text-stone-950 hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 18 9 12l6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Slide berikutnya"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-stone-200/80 text-stone-950 hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
