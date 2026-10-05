"use client";

import { useEffect, useRef, useState } from "react";

const WA_URL =
  "https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi";

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  // Muncul hanya setelah pengunjung menggulir melewati ±80% layar pertama (≈ lewat hero),
  // dan kembali tersembunyi bila digulir ke puncak halaman.
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    let openTimer: ReturnType<typeof setTimeout> | undefined;

    const getThreshold = () => Math.max(320, Math.round(window.innerHeight * 0.8));

    const onScroll = () => {
      const past = window.scrollY > getThreshold();
      if (past === shownRef.current) return;
      shownRef.current = past;
      setVisible(past);

      if (past) {
        openTimer = setTimeout(() => setOpen(true), isMobile ? 2500 : 1500);
      } else {
        clearTimeout(openTimer);
        setOpen(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(openTimer);
    };
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 sm:right-8 sm:bottom-8 z-30 flex flex-col items-end gap-3 sm:gap-4 transition-all duration-500 pb-[env(safe-area-inset-bottom)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      {open && (
        <div className="w-[min(24rem,calc(100vw-2rem))] sm:w-80 md:w-[23rem] rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 bg-[#25D366]">
            <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-widest text-white leading-tight">
              Layanan Informasi &amp; Reservasi
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="shrink-0 text-white/80 hover:text-white p-2.5 -m-1 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-sm sm:text-base font-extrabold text-stone-950 leading-snug">
              Butuh bantuan? Kami siap membantu.
            </p>
            <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
              Konsultasikan jadwal kunjungan bersama tim kami.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white text-xs sm:text-[13px] font-extrabold uppercase tracking-wider hover:bg-[#1eb857] transition-colors min-h-[48px]"
            >
              Chat via WhatsApp &rarr;
            </a>
          </div>
        </div>
      )}

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1eb857] shadow-xl shadow-black/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
