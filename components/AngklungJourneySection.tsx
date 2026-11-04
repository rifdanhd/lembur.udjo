import Image from "next/image";
import Link from "next/link";

type Chapter = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  note: string;
  transition: string;
};

const chapters: readonly Chapter[] = [
  {
    number: "01",
    eyebrow: "SEBELUM NADA, ADA CERITA",
    title: "Ritual & Tradisi",
    description:
      "Jauh sebelum hadir di panggung dunia, bunyi bambu tumbuh di tengah kehidupan masyarakat. Ia mengiringi perjumpaan, syukur, dan tradisi yang diwariskan lintas generasi.",
    image: "/facilities/konservasi-bambu.png",
    alt: "Rumpun bambu sebagai sumber kehidupan dan kebudayaan",
    note: "Alam & kebersamaan",
    transition:
      "Dari rumpun bambu, tangan manusia merawat suara. Bunyi yang sederhana bersiap menemukan bahasa baru.",
  },
  {
    number: "02",
    eyebrow: "KETIKA BAMBU MENEMUKAN BAHASA BARU",
    title: "Daeng Soetigna",
    description:
      "Pada 1938, Daeng Soetigna memperkenalkan angklung dengan tangga nada diatonis. Inovasi ini membuka ruang yang lebih luas bagi pembelajaran dan berbagai repertoar musik—tanpa memutus semangat kebersamaan.",
    image: "/gallery/workshop-merakit-bambu.png",
    alt: "Proses merakit angklung dari bambu",
    note: "Inovasi & pendidikan",
    transition:
      "Ketika cakrawala bunyinya meluas, angklung semakin dekat dengan ruang belajar dan kehidupan banyak orang.",
  },
  {
    number: "03",
    eyebrow: "DARI PADASUKA, UNTUK DUNIA",
    title: "Udjo Ngalagena",
    description:
      "Pada 1966, Udjo Ngalagena bersama Uum Sumiati mendirikan Saung Angklung Udjo di Padasuka, Bandung. Angklung tidak hanya dipertunjukkan, tetapi diajarkan, dicoba, dan dimainkan bersama.",
    image: "/arsip%20Abah%20Udjo/abah-udjo-legend.webp",
    alt: "Arsip dokumentasi Udjo Ngalagena",
    note: "Warisan & edutainment",
    transition:
      "Dari Padasuka, perjalanan itu tidak berhenti sebagai kenangan. Suara angklung terus mencari ruang untuk tumbuh.",
  },
  {
    number: "04",
    eyebrow: "WARISAN YANG TERUS BERTUMBUH",
    title: "Lembur Udjo Parahyangan",
    description:
      "Lembur Udjo Parahyangan melanjutkan perjalanan itu dengan menjaga akar sekaligus membuka pengalaman baru: sawah, leuweung awi, karya perajin, pertunjukan, workshop, dan kebersamaan.",
    image: "/LUP.png",
    alt: "Visualisasi rencana kawasan Lembur Udjo Parahyangan",
    note: "Visualisasi kawasan",
    transition: "Keep the Old, Create the New.",
  },
] as const;

export default function AngklungJourneySection() {
  return (
    <section
      id="angklung-journey"
      aria-labelledby="angklung-journey-title"
      className="relative overflow-hidden bg-forest py-16 text-white sm:py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b7a476]/60 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#dcc99b]">
              The Living Journey of Angklung
            </p>
            <h2
              id="angklung-journey-title"
              className="mt-4 font-tan text-3xl leading-[1.36] tracking-tight sm:text-4xl"
            >
              Angklung Journey
            </h2>
            <blockquote className="mt-6 border-l-2 border-[#b7a476] pl-4 font-playfair text-xl italic leading-relaxed text-[#f2e8d6] sm:text-2xl">
              Sebelum menjadi musik, angklung adalah doa.
            </blockquote>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
              Ikuti perjalanan angklung dari akar tradisi, pembaruan bunyi,
              pendidikan dan pertunjukan, hingga babak baru di Lembur Udjo
              Parahyangan.
            </p>
            <Link
              href="/the-story-of-angklung"
              className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[#dcc99b] py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#f2e8d6] transition-colors hover:border-white hover:text-white focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Telusuri Kisah Angklung
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:gap-x-5 lg:gap-y-10">
          {chapters.map((chapter, index) => (
            <li
              key={chapter.number}
              className={index % 2 === 1 ? "sm:pt-12" : ""}
            >
              <article className="group h-full">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest-light">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 26vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                      {chapter.note}
                    </span>
                    <span className="font-playfair text-3xl text-white/90" aria-hidden="true">
                      {chapter.number}
                    </span>
                  </div>
                </div>
                <div className="pt-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#dcc99b]">
                    {chapter.eyebrow}
                  </span>
                  <h3 className="mt-2 font-playfair text-2xl font-semibold leading-snug text-white">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {chapter.description}
                  </p>
                  <p className="mt-4 border-l border-[#b7a476]/70 pl-3 text-xs leading-6 text-[#f2e8d6]/80">
                    {chapter.transition}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
