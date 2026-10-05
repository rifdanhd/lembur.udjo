import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

export const metadata: Metadata = {
  title: "The Story of Angklung — Lembur Udjo Parahyangan",
  description:
    "Kisah angklung: asal-usul instrumen bambu Sunda, sejarah dari tatar Sunda hingga ditetapkan UNESCO pada 2010, cara memainkannya, hingga peran Saung Angklung Udjo sejak 1966.",
  openGraph: {
    title: "The Story of Angklung — Lembur Udjo Parahyangan",
    description: "Kisah angklung, warisan budaya takbenda dunia dari tanah Sunda.",
    locale: "id_ID",
    type: "article",
  },
};

const timeline = [
  {
    year: "Abad ke-17",
    title: "Angklung di Tatar Sunda",
    desc: "Angklung lahir dan berkembang di masyarakat Sunda — dari Baduy hingga pesisir Banten — sebagai alat ritual penghormatan kepada Dewi Sri dan penenang hati saat bertani.",
  },
  {
    year: "1930-an",
    title: "Nada Diatonik Daeng Soetigna",
    desc: "Daeng Soetigna menyusun ulang nada angklung mengikuti tangga nada diatonik, sehingga angklung dapat berpadu dengan alat musik modern dalam ansambel.",
  },
  {
    year: "1966",
    title: "Berdirinya Saung Angklung Udjo",
    desc: "Abah Udjo Ngalagena dan Enuk Neneng mendirikan Saung Angklung Udjo di Bandung: panggung, sanggar, dan rumah bagi seniman serta pengrajin angklung.",
  },
  {
    year: "2010",
    title: "Warisan Dunia UNESCO",
    desc: "UNESCO menetapkan angklung sebagai Masterpiece of Oral and Intangible Heritage of Humanity — pengakuan dunia atas warisan budaya Sunda.",
  },
];

const jenis = [
  { name: "Angklung Indung", desc: "Angklung besar sebagai pemegang nada dasar, bunyinya paling dalam dan menjadi tumpuan melodi." },
  { name: "Angklung Kecrek", desc: "Bunyinya kecil dan ritmis, berfungsi mengatur tempo sekaligus menghidupkan irama pertunjukan." },
  { name: "Angklung Badé", desc: "Angklung nada melodi yang paling banyak dipakai dalam permainan masal dan lagu-lagu populer." },
  { name: "Angklung Modern", desc: "Angklung mini dan ansambel bambu — arumba, calung, lodong — memperluas peran angklung di panggung dunia." },
];

export default function StoryOfAngklungPage() {
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      <Navbar />

      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
            Warisan Budaya Sunda
          </span>
          <h1 className="font-tan text-[2.25rem] sm:text-5xl md:text-7xl leading-[1.08] text-forest mt-3 sm:mt-4">
            The Story of Angklung
          </h1>
          <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mt-4 sm:mt-5">
            Dua sampai lima tabung bambu, satu bunyi untuk setiap orang, dan satu harmoni yang dimainkan bersama.
            Beginilah kisah angklung — dari sawah di tatar Sunda hingga panggung dunia.
          </p>

          <div className="mt-7 sm:mt-10 rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
            <img
              src="/placeholders/angklung.jpg"
              alt="Pertunjukan angklung di Lembur Udjo Parahyangan"
              className="w-full aspect-[16/9] sm:aspect-[2/1] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Apa Itu Angklung
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              Instrumen Bambu yang Dimainkan Bersama
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            <p>
              Angklung adalah alat musik tradisional yang terbuat dari bambu. Setiap tabungnya ditali pada sebuah
              rangka, lalu digoyang untuk membangkitkan bunyi. Satu angklung hanya menghasilkan satu nada — karena itu
              angklung benar-benar dirancang untuk dimainkan bersama.
            </p>
            <p>
              Dalam permainan masal, setiap pemain memegang satu nada. Ketika seluruh nada dipukul dan digoyang pada
              waktunya, lahirlah melodi utuh yang tidak mungkin dihasilkan oleh satu orang. Di sinilah angklung
              mengajarkan gotong royong: harmoni hanya terjadi bila semua peran dijalankan bersama.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-7 sm:mb-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Jejak Waktu
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              Perjalanan Angklung
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {timeline.map((item) => (
              <li
                key={item.year}
                className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300"
              >
                <span className="block font-playfair text-lg sm:text-xl font-semibold text-forest">{item.year}</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest mt-2.5 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
            <img
              src="/placeholders/workshop.jpg"
              alt="Proses memainkan dan merawat angklung"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Cara Memainkan
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              Da Mi Na Ti La
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-3">
              Nada angklung diatur dengan tangga nada <strong className="text-stone-950">Da Mi Na Ti La</strong>.
              Cukup goyangkan tabung bambu dengan lembut — getaran bambu tua yang dikeringkan sempurna akan
              menghasilkan bunyi yang jernih dan bertahan puluhan tahun.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Pilih bambu petung atau wulung yang tua dan sudah dikeringkan.",
                "Setiap tabung digamplong sesuai nada, lalu digantung pada rangka.",
                "Goyangkan dengan pergelangan tangan, jangan dipukul.",
                "Satu nada per pemain — lalu mainkan lagu bersama-sama.",
              ].map((step) => (
                <li key={step} className="flex gap-3 items-start text-sm text-stone-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" aria-hidden="true" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-7 sm:mb-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Ragam Angklung
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              Jenis &amp; Peran Angklung
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {jenis.map((item, i) => (
              <div
                key={item.name}
                className="p-5 sm:p-6 rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300"
              >
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest mt-2.5 mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14 sm:py-20 bg-forest text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="font-playfair italic font-medium text-xl sm:text-2xl md:text-3xl leading-snug drop-shadow-sm">
            &ldquo;Dengan pertunjukan sederhana, suatu waktu angklung akan mendunia.&rdquo;
          </blockquote>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-400">
            Udjo Ngalagena &middot; Abah Udjo
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/#fasilitas"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-stone-950 text-xs font-extrabold uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Lihat Fasilitas &rarr;
            </Link>
            <a
              href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20tentang%20angklung"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppPopup />
    </main>
  );
}
