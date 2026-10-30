import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, FileText, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Info | Dapoer Angklung Coffee & Resto",
  description: "Menu, lokasi, dan kontak WhatsApp Dapoer Angklung Coffee & Resto.",
  alternates: { canonical: "/info-dapoerangklung" },
};

const links = [
  {
    label: "Lihat Menu (PDF)",
    description: "Buka koleksi menu di Google Drive",
    icon: FileText,
    href: "https://drive.google.com/drive/folders/1Zqx9QAxbSBqrd_Nyf3gK-U9iGjxiGIL2?usp=sharing&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacqfyC52yActmRTBBmi1wveSR7VCuMA2gTgnn7617TI9vzoaMQANnRnkKWyfg_aem_5Fa6432BQD_cnH7WRFqjxg",
    featured: true,
  },
  {
    label: "Lokasi & Rute Google Maps",
    description: "Temukan lokasi Dapoer Angklung",
    icon: MapPin,
    href: "https://maps.app.goo.gl/SQtKcPQc4hdadpSGA",
    featured: false,
  },
  {
    label: "Hubungi Kami di WhatsApp",
    description: "+62 878-9597-2371",
    icon: MessageCircle,
    href: "https://wa.me/6287895972371",
    featured: false,
  },
];

export default function DapoerAngklungInfoPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-x-hidden bg-[#faf7f2] px-5 pt-10 pb-[calc(3rem+env(safe-area-inset-bottom))] text-[#493023] sm:px-6 sm:pt-14">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#bd9b67]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#624240]/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center">
        <header className="flex flex-col items-center text-center">
          <div className="rounded-3xl border border-[#bd9b67]/20 bg-white p-5 shadow-[0_12px_30px_rgba(73,48,35,0.06)]">
            <Image
              src="/LOGODAPOERANGKLUNG.png"
              alt="Logo Dapoer Angklung Coffee & Resto"
              width={977}
              height={1142}
              sizes="(min-width: 640px) 160px, 144px"
              className="h-auto w-36 object-contain sm:w-40"
              priority
            />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-[1.7rem]">Dapoer Angklung</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#846b4d] uppercase">Coffee & Resto</p>
          <p className="mt-4 max-w-xs text-[0.9375rem] leading-6 text-stone-600">Temukan menu favorit, lokasi, dan informasi reservasi di sini.</p>
        </header>

        <nav aria-label="Menu, lokasi, dan kontak Dapoer Angklung" className="mt-8 flex w-full flex-col gap-3.5">
          {links.map(({ label, description, icon: Icon, href, featured }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex min-h-20 w-full items-center gap-3 rounded-2xl border px-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#846b4d] focus-visible:ring-offset-4 sm:px-5 ${featured ? "border-[#624240] bg-[#624240] text-white shadow-[0_8px_20px_rgba(98,66,64,0.15)] hover:bg-[#513634]" : "border-[#e7dfd3] bg-white text-[#493023] shadow-[0_5px_16px_rgba(73,48,35,0.04)] hover:border-[#bd9b67] hover:bg-[#fffdf9]"}`}
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${featured ? "bg-white/10" : "bg-[#f4eee4]"}`}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-5 font-semibold">{label}</span>
                <span className={`mt-1 block text-xs leading-5 ${featured ? "text-white/80" : "text-stone-500"}`}>{description}</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 opacity-60" />
              <span className="sr-only"> (buka di tab baru)</span>
            </a>
          ))}
        </nav>

        <footer className="mt-auto pt-12 text-center text-xs text-stone-500">© 2026 Dapoer Angklung Coffee & Resto.</footer>
      </div>
    </main>
  );
}
