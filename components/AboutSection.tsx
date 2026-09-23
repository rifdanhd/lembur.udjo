export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-100">
              <img
                src="/pak-udjo-vector.png"
                alt="Ilustrasi vektor Pak Udjo"
                className="w-full h-auto max-h-[320px] sm:max-h-[420px] aspect-[4/3] sm:aspect-[4/5] object-contain p-4 sm:p-6 bg-cream mx-auto"
                loading="lazy"
              />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-amber-600 uppercase block">
              Warisan Budaya &amp; Nilai Tradisi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05]">
              Preserving the Roots. <span className="text-amber-500">Creating the Future.</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda kepada dunia sejak tahun 1966.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Dirancang seperti sebuah lembur Sunda yang hidup. Hamparan sawah, rumpun bambu, seni pertunjukan, musik tradisi, permainan rakyat, hingga kelestarian alam menjadi bagian terintegrasi dalam satu perjalanan.
            </p>
            <div className="pt-1">
              <a
                href="#warisan"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
              >
                Pelajari Warisan Budaya &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
