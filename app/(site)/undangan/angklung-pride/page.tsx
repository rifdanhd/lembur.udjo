import { Bricolage_Grotesque } from "next/font/google";
import ClientInvitation from "./ClientInvitation";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata = {
  title: "Undangan Angklung Pride 2026",
  description:
    "Undangan Angklung Pride 2026. Jumat, 27 November 2026, pukul 19.00 WIB di Saung Angklung Udjo, Bandung.",
  alternates: { canonical: "/undangan/angklung-pride/" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Undangan Angklung Pride 2026",
    description: "One Sound, a Symphony for the World · 27 November 2026 · Saung Angklung Udjo",
    type: "website",
    url: "/undangan/angklung-pride/",
    images: [{ url: "/undangan/angklung-pride/flyer.webp" }, { url: "/undangan/angklung-pride/flyer.jpg" }],
  },
  twitter: { card: "summary_large_image", title: "Undangan Angklung Pride 2026" },
};

export default function AngklungPridePage() {
  return (
    <div className={`${bricolage.variable} ${bricolage.className} font-['Bricolage_Grotesque',sans-serif]`}>
      <ClientInvitation />
    </div>
  );
}
