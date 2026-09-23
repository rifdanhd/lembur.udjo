export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Founder Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100 relative group">
              <img 
                src="/placeholders/founder.jpg" 
                alt="Udjo Ngalagena" 
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Pendiri Saung Angklung Udjo</span>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-white mt-0.5">Udjo Ngalagena (1929–2001)</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block">
              Warisan Budaya & Nilai Tradisi
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest leading-tight">
              Preserving the Roots. <br />
              <span className="text-amber-600">Creating the Future.</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda kepada dunia sejak tahun 1966.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Dirancang seperti sebuah lembur Sunda yang hidup. Hamparan sawah, rumpun bambu, seni pertunjukan, musik tradisi, permainan rakyat, hingga kelestarian alam menjadi bagian terintegrasi dalam satu perjalanan.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Pengunjung tidak hanya datang ke sebuah tempat wisata. Mereka diajak untuk melihat, mendengar, memainkan alat musik bambu, dan merasakan langsung nilai gotong royong kebudayaan Sunda.
            </p>
            <div className="pt-2">
              <a
                href="#warisan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest hover:bg-forest-light active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Pelajari Warisan Budaya</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
