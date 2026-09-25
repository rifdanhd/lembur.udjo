export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-[#14532d] uppercase block">
              Warisan Budaya &amp; Nilai Tradisi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05]">
              Preserving the Roots. <span className="text-[#14532d]">Creating the Future.</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda kepada dunia sejak tahun 1966.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Dirancang seperti sebuah lembur Sunda yang hidup. Hamparan sawah, rumpun bambu, seni pertunjukan, musik tradisi, permainan rakyat, hingga kelestarian alam menjadi bagian terintegrasi dalam satu perjalanan.
            </p>
            <div className="pt-1">
              <a
                href="/#warisan"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-[#14532d] hover:border-[#14532d] transition-colors"
              >
                Pelajari Warisan Budaya &rarr;
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="/arsip%20Abah%20Udjo/Untitled-8.jpg"
              alt="Warisan Budaya & Nilai Tradisi Lembur Udjo"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
