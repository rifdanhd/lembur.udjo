import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  Compass,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Karier | Lembur Udjo Parahyangan",
  description:
    "Bergabung dengan Lembur Udjo Parahyangan untuk merawat budaya Sunda dan menciptakan pengalaman bermakna bagi setiap pengunjung.",
  alternates: { canonical: "/karier" },
};

const values = [
  { icon: HeartHandshake, title: "Bekerja dengan hati", text: "Membuat setiap orang merasa diterima, didengar, dan pulang membawa cerita." },
  { icon: Leaf, title: "Merawat yang bernilai", text: "Menjaga tradisi, ruang hidup, dan pengetahuan agar tetap tumbuh lintas generasi." },
  { icon: Sparkles, title: "Berani bertumbuh", text: "Membawa ide baru tanpa kehilangan akar dan rasa hormat pada budaya Sunda." },
];

const roles = [
  { number: "01", title: "Program & Edukasi", text: "Merancang pengalaman belajar angklung, budaya Sunda, dan aktivitas yang meninggalkan kesan.", tag: "Mencipta pengalaman" },
  { number: "02", title: "Hospitality & Guest Experience", text: "Menjadi wajah hangat Lembur Udjo sejak pengunjung datang hingga pulang membawa cerita.", tag: "Menyambut manusia" },
  { number: "03", title: "Kreatif & Komunikasi", text: "Menerjemahkan kekayaan budaya menjadi cerita, visual, dan komunikasi yang dekat dengan zaman.", tag: "Menyebarkan cerita" },
  { number: "04", title: "Operasional Kawasan", text: "Menjaga agar ruang, pertunjukan, dan seluruh perjalanan pengunjung berjalan dengan baik.", tag: "Menghidupkan ruang" },
];

const steps = [
  ["01", "Kirim cerita Anda", "Perkenalkan diri, pengalaman, dan alasan Anda ingin bertumbuh bersama kami."],
  ["02", "Kami berkenalan", "Tim kami akan meninjau profil Anda dan menghubungi kandidat yang sesuai."],
  ["03", "Temukan peran yang tepat", "Kita ngobrol tentang kontribusi yang bisa Anda bawa ke Lembur Udjo."],
];

export default function KarierPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-cream text-stone-900">
      <Navbar />

      <section className="relative overflow-hidden bg-forest pt-28 text-white sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-end gap-12 px-4 pb-16 sm:px-6 sm:pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <div className="relative z-10 pb-2">
            <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#e8bf69]"><span className="h-px w-10 bg-[#e8bf69]" />Karier di Lembur Udjo</p>
            <h1 className="max-w-2xl font-tan text-[clamp(3.4rem,8vw,7.4rem)] leading-[0.94] tracking-tight">Bekerja untuk sesuatu yang berarti.</h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-white/75 sm:text-lg">Kami percaya budaya tidak hanya dirawat di atas panggung. Ia hidup dari orang-orang yang datang setiap hari dengan rasa ingin tahu, kepedulian, dan keberanian untuk membuatnya relevan.</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#ruang-berkarya" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e8bf69] px-6 py-3 text-sm font-extrabold text-[#17331f] transition hover:-translate-y-0.5 hover:bg-[#f2d18f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Temukan ruang berkarya <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#cara-bergabung" className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white">Cara bergabung <ArrowDownRight size={17} aria-hidden="true" /></a>
            </div>
          </div>

          <div className="relative min-h-[430px] sm:min-h-[570px]">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#6b8b57]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 z-10 w-[72%] -rotate-3 overflow-hidden rounded-[2rem] border-8 border-white/10 shadow-2xl shadow-black/30 sm:w-[64%]">
              <Image src="/Hero.ecoland.jpg" alt="Suasana kebersamaan di Lembur Udjo" width={1920} height={1706} priority sizes="(max-width: 768px) 70vw, 35vw" className="aspect-[4/5] object-cover" />
            </div>
            <div className="absolute right-0 top-8 w-[54%] rotate-6 overflow-hidden rounded-[1.5rem] border-8 border-[#e8bf69]/30 shadow-2xl shadow-black/30 sm:w-[48%]">
              <Image src="/Pertunjukanluar.webp" alt="Pertunjukan budaya di Lembur Udjo" width={1920} height={1491} sizes="(max-width: 768px) 50vw, 25vw" className="aspect-[3/4] object-cover" />
            </div>
            <div className="absolute bottom-8 right-3 z-20 rounded-2xl bg-[#f5ead6] px-4 py-3 text-[#17331f] shadow-xl sm:right-8 sm:px-5 sm:py-4"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8b6914]">Ruang untuk</p><p className="mt-1 text-sm font-extrabold">tumbuh bersama</p></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-white/15" />
      </section>

      <section className="bg-[#f4efe5] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-bamboo">01 — Mengapa di sini</p><h2 className="mt-5 max-w-md font-tan text-4xl leading-[1.08] text-forest sm:text-6xl">Bukan sekadar pekerjaan.</h2></div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">Lembur Udjo adalah ruang bertemunya seni, alam, dan manusia. Setiap peran punya bagian dalam membuat pengalaman budaya terasa hangat dan dekat.</p>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-stone-300 pt-5"><Icon size={23} strokeWidth={1.6} className="text-bamboo" aria-hidden="true" /><h3 className="mt-6 text-base font-extrabold text-forest">{title}</h3><p className="mt-3 text-sm leading-7 text-stone-500">{text}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="ruang-berkarya" className="scroll-mt-20 bg-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-bamboo">02 — Ruang berkarya</p><h2 className="mt-5 max-w-xl font-tan text-4xl leading-[1.08] text-forest sm:text-6xl">Cari bagianmu dalam perjalanan ini.</h2></div><div className="flex items-center gap-3 text-sm text-stone-500"><Compass size={18} className="text-bamboo" aria-hidden="true" /> Peran yang saling terhubung</div></div>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => <article key={role.number} className="group relative overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#f7f3eb] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c4d0bd] hover:bg-[#edf3e9] hover:shadow-[0_24px_60px_rgba(50,74,53,0.1)] sm:p-9"><div className="flex items-start justify-between gap-4"><span className="font-mono text-sm text-stone-400">{role.number}</span><ArrowDownRight size={21} className="text-bamboo transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></div><p className="mt-12 text-[10px] font-bold uppercase tracking-[0.22em] text-bamboo">{role.tag}</p><h3 className="mt-3 max-w-sm text-2xl font-extrabold tracking-tight text-forest">{role.title}</h3><p className="mt-4 max-w-md text-sm leading-7 text-stone-500">{role.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="cara-bergabung" className="scroll-mt-20 bg-forest px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-28"><div><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e8bf69]">03 — Cara bergabung</p><h2 className="mt-5 max-w-md font-tan text-4xl leading-[1.08] sm:text-6xl">Mulai dari satu cerita.</h2><p className="mt-7 max-w-md text-sm leading-7 text-white/65">Kami menerima perkenalan terbuka dari orang-orang yang ingin ikut merawat perjalanan Lembur Udjo.</p></div><div className="space-y-8">{steps.map(([number, title, text]) => <div key={number} className="grid grid-cols-[48px_1fr] gap-5 border-b border-white/15 pb-8 last:border-0 last:pb-0 sm:grid-cols-[58px_1fr] sm:gap-7"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8bf69]/60 font-mono text-xs text-[#e8bf69]">{number}</span><div><h3 className="text-xl font-extrabold">{title}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-white/65">{text}</p></div></div>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-[#e4eddf] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/45" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-forest"><MapPin size={14} aria-hidden="true" /> Padalarang, Bandung Barat</p><h2 className="mt-5 max-w-2xl font-tan text-4xl leading-[1.08] text-forest sm:text-6xl">Punya cerita yang ingin dibawa ke Lembur Udjo?</h2></div><div className="shrink-0"><a href="mailto:corsec.lemburudjo@gmail.com?subject=Perkenalan%20Karier%20-%20Lembur%20Udjo" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-forest px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-forest-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-[#e4eddf]"><Mail size={18} aria-hidden="true" /> Kirim perkenalan Anda <ArrowRight size={17} aria-hidden="true" /></a><p className="mt-3 text-center text-xs text-stone-500">corsec.lemburudjo@gmail.com</p></div></div>
      </section>

      <Footer />
    </main>
  );
}
