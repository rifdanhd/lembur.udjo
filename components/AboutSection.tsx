import MaskText from "./anim/MaskText";
export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-[#14532d] uppercase block">
              Warisan Budaya &amp; Nilai Tradisi
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05]">
              <MaskText text="Preserving the Roots. Creating the Future." scrub />
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda kepada dunia sejak tahun 1966.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Dirancang seperti sebuah lembur Sunda yang hidup. Hamparan sawah, rumpun bambu, seni pertunjukan, musik tradisi, permainan rakyat, hingga kelestarian alam menjadi bagian terintegrasi dalam satu perjalanan.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Angklung dan musik bambu berpadu dengan musik modern dan teknologi — tanpa meninggalkan akar budaya Sunda.
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

          <div className="relative">
            <img
              src="/arsip%20Abah%20Udjo/main%20di%20dpan%20rumah%20abah.jpg"
              alt="Warisan Budaya & Nilai Tradisi Lembur Udjo"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Visi Abah Udjo */}
        <div id="visi" className="relative mt-10 sm:mt-14 overflow-hidden rounded-xl sm:rounded-2xl bg-forest text-white">
          <div className="relative">
            <img
              src="/Pertunjukanluar.webp"
              alt="Pertunjukan angklung Lembur Udjo di berbagai negara"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/45" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/30 to-forest/95 sm:via-forest/15"
              aria-hidden="true"
            />

            <div className="relative max-w-3xl mx-auto text-center p-6 sm:p-10 md:p-12">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] sm:tracking-[0.25em] text-emerald-400 uppercase block">
                Visi Abah Udjo &middot; Sejak 1966
              </span>

              <h3 className="font-tan text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl mt-2.5 sm:mt-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                <MaskText text="Angklung to the World" scrub />
              </h3>

              <p className="text-stone-100 text-sm sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-3 sm:mt-4 drop-shadow-sm">
                Dari Bale Pare, Kota Baru Parahyangan, angklung terus diperkenalkan kepada dunia lewat pertunjukan
                interaktif, workshop, dan pertemuan budaya yang diwariskan dari generasi ke generasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
