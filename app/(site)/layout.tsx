import type { Metadata } from "next";
import { Inter, Playfair_Display, Lobster, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import ComingSoon from "@/components/ComingSoon";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair-src",
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

const tanMeringue = localFont({
  src: "./fonts/TAN-MERINGUE-Regular.otf",
  variable: "--font-tan-meringue",
  display: "swap",
});
const SITE_URL = "https://lemburudjoparahyangan.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lembur Udjo Parahyangan — Angklung Journey | Wisata Budaya Sunda Bandung",
  description:
    "Angklung Journey bersama Lembur Udjo Parahyangan, destinasi wisata budaya Sunda terkemuka di Bandung. Nikmati pertunjukan angklung, wayang golek, tari tradisional, dan pengalaman budaya Sunda yang autentik.",
  keywords: ["Angklung Journey", "Lembur Udjo", "Saung Angklung Udjo", "wisata budaya Bandung", "angklung", "wayang golek", "budaya Sunda", "Parahyangan"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Lembur Udjo Parahyangan — Angklung Journey | Wisata Budaya Sunda Bandung",
    description:
      "Angklung Journey bersama Lembur Udjo Parahyangan: destinasi wisata budaya Sunda, warisan UNESCO di Bandung.",
    url: "/",
    siteName: "Lembur Udjo Parahyangan",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/LUP.png",
        width: 1019,
        height: 677,
        alt: "Masterplan kawasan Lembur Udjo Parahyangan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lembur Udjo Parahyangan — Angklung Journey | Wisata Budaya Sunda Bandung",
    description:
      "Angklung Journey bersama Lembur Udjo Parahyangan: destinasi wisata budaya Sunda, warisan UNESCO di Bandung.",
    images: ["/LUP.png"],
  },
  verification: {
    google: "H733vGfxAC4yCL9qjZdnUJypTtJQbVvT_Ws9oEgu-wk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${lobster.variable} ${jakarta.variable} ${tanMeringue.variable}`}>
    <body className="font-sans text-stone-900 bg-cream">
      {children}
      <ComingSoon />
    </body>
    </html>
  );
}
