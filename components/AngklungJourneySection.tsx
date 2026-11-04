import Image from "next/image";
import Link from "next/link";

/**
 * Editorial story section: the journey from bamboo to a living cultural
 * experience. Assets are drawn from the current repository and should be
 * reviewed for provenance before the full public launch.
 */
const chapters = [
  {
    number: "01",
    eyebrow: "AKAR PERJALANAN",
    title: "Dari Alam",
    description:
      "Perjalanan bermula di antara rumpun bambu. Di sinilah kita mengenal bahan, lingkungan, dan hubungan manusia dengan alam.",
    image: "/facilities/konservasi-bambu.png",
    alt: "Visual pendukung tentang rumpun dan konservasi bambu",
    note: "Bambu & alam",
  },
  {
    number: "02",
    eyebrow: "TANGAN DAN KETEKUNAN",
    title: "Menemukan Nada",
    description:
      "Bambu dipilih, dibentuk, dan diselaraskan. Ketelitian para perajin mengubah sebatang bambu menjadi angklung yang bernada.",
    image: "/gallery/workshop-merakit-bambu.png",
    alt: "Visual pendukung kegiatan merakit angklung dari bambu",
    note: "Proses & keterampilan",
  },
  {
    number: "03",
    eyebrow: "WARISAN SEJAK 1966",
    title: "Jejak Abah Udjo",
    description:
      "Udjo Ngalagena menjadikan angklung ruang belajar, bermain, dan bertemu. Semangat itu terus hidup dalam setiap generasi.",
    image: "/arsip%20Abah%20Udjo/abah-udjo-legend.webp",
    alt: "Dokumentasi arsip Abah Udjo",
    note: "Warisan & pendidikan",
  },
  {
    number: "04",
    eyebrow: "BABAK BARU",
    title: "Lembur yang Hidup",
    description:
      "Di Lembur Udjo Parahyangan, cerita berlanjut melalui pertunjukan interaktif, Agrowalk, workshop, dan kebersamaan.",
    image: "/LUP.png",
    alt: "Visualisasi rencana kawasan Lembur Udjo Parahyangan",
    note: "Visualisasi kawasan",
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
              Bukan sekadar menyaksikan pertunjukan. Ikuti perjalanan
              angklung—dari tumbuhnya bambu, proses berkarya, warisan Abah
              Udjo, hingga pengalaman budaya yang terus hidup.
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

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8 lg:gap-x-5 lg:gap-y-8">
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
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
