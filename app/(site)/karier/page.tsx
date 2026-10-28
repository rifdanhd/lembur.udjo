import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
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
  {
    icon: HeartHandshake,
    title: "Bekerja dengan hati",
    text: "Kami hadir untuk melayani, belajar, dan membuat setiap orang merasa diterima di Lembur Udjo.",
  },
  {
    icon: Leaf,
    title: "Merawat yang bernilai",
    text: "Setiap pekerjaan ikut menjaga tradisi, lingkungan, dan cerita yang diwariskan lintas generasi.",
  },
  {
    icon: Sparkles,
    title: "Berani bertumbuh",
    text: "Kami membuka ruang untuk ide baru selama tetap berakar pada nilai dan budaya Sunda.",
  },
];

const roles = [
  {
    number: "01",
    title: "Program & Edukasi",
    text: "Merancang pengalaman belajar angklung, budaya Sunda, dan aktivitas yang meninggalkan kesan.",
  },
  {
    number: "02",
    title: "Hospitality & Guest Experience",
    text: "Menjadi wajah hangat Lembur Udjo sejak pengunjung datang hingga pulang membawa cerita.",
  },
  {
    number: "03",
    title: "Kreatif & Komunikasi",
    text: "Menerjemahkan kekayaan budaya menjadi cerita, visual, dan komunikasi yang dekat dengan zaman.",
  },
  {
    number: "04",
    title: "Operasional Kawasan",
    text: "Menjaga agar ruang, pertunjukan, dan seluruh perjalanan pengunjung berjalan dengan baik.",
  },
];

const steps = [
  ["01", "Kirim cerita Anda", "Perkenalkan diri, pengalaman, dan alasan Anda ingin bertumbuh bersama kami."],
  ["02", "Kami berkenalan", "Tim kami akan meninjau profil Anda dan menghubungi kandidat yang sesuai."],
  ["03", "Temukan peran yang tepat", "Kita ngobrol lebih jauh tentang kontribusi yang bisa Anda bawa ke Lembur Udjo."],
];

export default function KarierPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-cream text-stone-900">
      <Navbar />

      <section className="relative isolate flex min-h-[680px] items-end overflow-hidden bg-forest pt-24 text-white sm:min-h-[760px]">
        <Image
          src="/Hero.ecoland.jpg"
          alt="Tim Lembur Udjo memainkan alat musik tradisional bersama pengunjung"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07170d]/95 via-[#0d2317]/65 to-[#0d2317]/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07170d] via-transparent to-[#07170d]/35" />

        <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#e8bf69]">
              <span className="h-px w-10 bg-[#e8bf69]" />
              Karier di Lembur Udjo
            </p>
            <h1 className="max-w-3xl font-tan text-5xl leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              Mari rawat budaya, bersama.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Di sini, pekerjaan bukan hanya tentang apa yang kita lakukan hari ini. Ini tentang cerita dan pengalaman yang akan dibawa pulang oleh generasi berikutnya.
            </p>
            <a
              href="#peluang"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e8bf69] px-6 py-3 text-sm font-extrabold text-[#17331f] transition hover:-translate-y-0.5 hover:bg-[#f2d18f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              Lihat peluang berkarya <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f4efe5] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-bamboo">Mengapa Lembur Udjo</p>
            <h2 className="mt-4 max-w-md font-tan text-4xl leading-tight text-forest sm:text-5xl">Tempat kerja yang punya makna.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            Lembur Udjo adalah ruang bertemunya seni, alam, dan manusia. Kami bekerja lintas peran untuk menghadirkan pengalaman budaya yang hangat—dari panggung pertunjukan hingga sapaan pertama di gerbang.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[1.75rem] border border-stone-200/80 bg-white/70 p-7 shadow-[0_18px_50px_rgba(69,56,33,0.05)] sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4eddf] text-forest"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span>
              <h3 className="mt-7 text-lg font-extrabold text-forest">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="peluang" className="scroll-mt-20 bg-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-bamboo">Peluang berkarya</p>
              <h2 className="mt-4 font-tan text-4xl leading-tight text-forest sm:text-5xl">Temukan tempatmu di sini.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-stone-500">Belum yakin peran mana yang sesuai? Ceritakan saja keahlian dan minat Anda. Kami senang mendengar perspektif baru.</p>
          </div>
          <div className="divide-y divide-stone-200">
            {roles.map((role) => (
              <article key={role.number} className="group grid gap-4 py-7 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-8">
                <span className="font-mono text-sm text-stone-400">{role.number}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-forest transition-colors group-hover:text-bamboo">{role.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">{role.text}</p>
                </div>
                <ArrowRight className="hidden text-bamboo transition-transform group-hover:translate-x-1 sm:block" size={21} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e8bf69]">Cara bergabung</p>
            <h2 className="mt-4 max-w-md font-tan text-4xl leading-tight sm:text-5xl">Satu langkah kecil untuk cerita yang panjang.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">Kami menerima perkenalan terbuka dari orang-orang yang ingin ikut merawat perjalanan Lembur Udjo.</p>
          </div>
          <div className="space-y-8">
            {steps.map(([number, title, text]) => (
              <div key={number} className="flex gap-5 border-b border-white/15 pb-8 last:border-0 last:pb-0 sm:gap-7">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8bf69]/60 font-mono text-xs text-[#e8bf69]">{number}</span>
                <div>
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e4eddf] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-forest"><MapPin size={14} aria-hidden="true" /> Padalarang, Bandung Barat</p>
            <h2 className="mt-5 max-w-2xl font-tan text-4xl leading-tight text-forest sm:text-6xl">Punya cerita yang ingin dibawa ke Lembur Udjo?</h2>
          </div>
          <div className="shrink-0">
            <a href="mailto:corsec.lemburudjo@gmail.com?subject=Perkenalan%20Karier%20-%20Lembur%20Udjo" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-forest px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-forest-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-[#e4eddf]">
              <Mail size={18} aria-hidden="true" /> Kirim perkenalan Anda <ArrowRight size={17} aria-hidden="true" />
            </a>
            <p className="mt-3 text-center text-xs text-stone-500">corsec.lemburudjo@gmail.com</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
