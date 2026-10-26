import Image from "next/image";
import MaskText from "./anim/MaskText";

export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-[#14532d] uppercase block">
              Warisan Budaya &amp; Nilai Tradisi
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05]">
              <MaskText text="Preserving the Roots. Creating the Future." scrub />
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Berangkat dari visi Udjo Ngalagena sejak 1966, Lembur Udjo Parahyangan menghadirkan angklung sebagai ruang belajar, ruang bertemu, dan jembatan budaya Sunda menuju dunia.
            </p>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Dirancang seperti lembur Sunda yang hidup di tengah kawasan modern, tempat hamparan sawah, rumpun bambu, seni pertunjukan, permainan rakyat, dan kelestarian alam hadir dalam satu perjalanan yang saling terhubung.
            </p>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Di sini, tradisi tidak berhenti sebagai tontonan. Angklung dan musik bambu dipelajari, dimainkan, dan dikembangkan bersama—berdialog dengan musik modern dan teknologi tanpa kehilangan akar budaya Sunda.
            </p>
            <div className="pt-1">
              <a
                href="/the-story-of-angklung"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-[#14532d] hover:border-[#14532d] transition-colors"
              >
                Pelajari Warisan Budaya &rarr;
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <Image
              src="/arsip%20Abah%20Udjo/abah-udjo-legend.webp"
              alt="Foto arsip Abah Udjo dan Uum Sumiati"
              width={1880}
              height={1734}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
