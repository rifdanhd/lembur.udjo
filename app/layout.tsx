import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lembur Udjo Parahyangan — Wisata Budaya Sunda Bandung",
  description:
    "Lembur Udjo Parahyangan adalah destinasi wisata budaya Sunda terkemuka di Bandung. Nikmati pertunjukan angklung, wayang golek, tari tradisional, dan pengalaman budaya Sunda yang autentik.",
  keywords: ["Lembur Udjo", "Saung Angklung Udjo", "wisata budaya Bandung", "angklung", "wayang golek", "budaya Sunda", "Parahyangan"],
  openGraph: {
    title: "Lembur Udjo Parahyangan — Wisata Budaya Sunda Bandung",
    description: "Destinasi wisata budaya Sunda terkemuka di Bandung, warisan UNESCO.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${cinzel.variable}`}>
    <body className="font-sans text-stone-900 bg-[#fcfaf6]">
      {children}

      {/* InJourney Style Sticky Ticket Tab */}
      <a
        href="#jadwal"
        aria-label="Pesan Tiket & Jadwal"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-forest hover:bg-forest-light text-white py-3 px-2 sm:px-2.5 rounded-l-xl shadow-2xl flex flex-col items-center gap-1.5 transition-transform duration-300 hover:-translate-x-1 border border-r-0 border-white/20 group"
      >
        <svg className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 text-amber-100">
          TIKET
        </span>
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-xl hover:scale-105 transition-all mb-16 sm:mb-0"
      >
        <svg viewBox="0 0 448 512" fill="currentColor" className="w-7 h-7">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 107.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.3c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
    </body>
    </html>
  );
}
