import type { Metadata } from "next";
import { Inter, Playfair_Display, Lobster, Plus_Jakarta_Sans } from "next/font/google";
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

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster-src",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-src",
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
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${lobster.variable} ${jakarta.variable}`}>
    <body className="font-sans text-stone-900 bg-white">
      {children}
    </body>
    </html>
  );
}
