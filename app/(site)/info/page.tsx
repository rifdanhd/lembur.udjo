import Image from "next/image";
import {
  ArrowUpRight,
  Camera,
  Globe2,
  MapPin,
  MessageCircle,
  Ticket,
} from "lucide-react";

const links = [
  { label: "Pesan Tiket / Reservasi — Coming Soon", icon: Ticket, href: "#coming-soon", featured: true },
  { label: "Rute Google Maps", icon: MapPin, href: "https://maps.app.goo.gl/P2KePjoJKrPCzHP69" },
  { label: "Hubungi Admin (WhatsApp)", icon: MessageCircle, href: "https://wa.me/628211054248" },
  { label: "Instagram Resmi", icon: Camera, href: "https://www.instagram.com/lembur.udjo/" },
  { label: "Kunjungi Website Utama", icon: Globe2, href: "/" },
];

export const metadata = {
  title: "Info | Lembur Udjo Parahyangan",
  description: "Pusat informasi, reservasi tiket, dan layanan resmi Lembur Udjo Parahyangan.",
};

export default function InfoPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f5ef] px-5 py-10 text-stone-900 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#dce6d4]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#eadcc9]/65 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center">
        <header className="flex flex-col items-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white p-4 shadow-[0_12px_30px_rgba(46,73,48,0.12)] ring-1 ring-[#d9e2d4] sm:h-32 sm:w-32">
            <Image src="/LOGO_Lembur.udjo.png" alt="Logo Lembur Udjo Parahyangan" fill sizes="128px" className="object-contain p-3" priority />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#263e2c] sm:text-[1.7rem]">Lembur Udjo Parahyangan</h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">Pusat informasi, reservasi tiket, dan layanan resmi.</p>
        </header>

        <nav aria-label="Tautan Lembur Udjo" className="mt-8 flex w-full flex-col gap-3">
          {links.map(({ label, icon: Icon, href, featured }) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className={`group flex min-h-14 w-full items-center gap-3 rounded-full border px-5 py-3.5 text-sm font-semibold transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55765a] focus-visible:ring-offset-2 ${featured ? "border-[#304f37] bg-[#304f37] text-white shadow-[0_8px_20px_rgba(48,79,55,0.2)] hover:bg-[#3d6346]" : "border-[#e4e1d9] bg-white/80 text-[#304433] shadow-[0_5px_16px_rgba(70,67,54,0.06)] backdrop-blur hover:border-[#cbd8c8] hover:bg-[#f3f7f0]"}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${featured ? "bg-white/12" : "bg-[#edf3ea]"}`}><Icon size={18} strokeWidth={2} aria-hidden="true" /></span>
              <span className="flex-1 text-center">{label}</span>
              <ArrowUpRight size={17} className="shrink-0 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <footer className="mt-auto pt-12 text-center text-xs text-stone-400">© 2026 Lembur Udjo Parahyangan.</footer>
      </div>
    </main>
  );
}
