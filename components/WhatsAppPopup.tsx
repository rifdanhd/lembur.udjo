"use client";

import { useEffect, useState } from "react";

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 1500);
    const t2 = setTimeout(() => setOpen(true), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 sm:gap-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {open && (
        <div className="w-[calc(100vw-2.5rem)] max-w-[280px] sm:w-72 rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
          <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#25D366]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">Layanan Informasi &amp; Reservasi</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="text-white/80 hover:text-white p-1 min-w-[24px] min-h-[24px] flex items-center justify-center transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-3.5 sm:p-4">
            <p className="text-xs font-extrabold text-stone-950">Butuh bantuan? Kami siap membantu.</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">Konsultasikan jadwal kunjungan bersama tim kami.</p>
            <a
              href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full bg-[#25D366] text-white text-[11px] font-extrabold uppercase tracking-wider hover:bg-[#1eb857] transition-colors"
            >
              Chat via WhatsApp &rarr;
            </a>
          </div>
        </div>
      )}

      <a
        href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1eb857] shadow-xl shadow-black/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
