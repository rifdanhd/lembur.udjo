export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="rounded-lg overflow-hidden">
              <img src="/founder.jpg" alt="Udjo Ngalagena" className="w-full aspect-[3/4] sm:aspect-[3/4] object-cover" loading="lazy" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Warisan Udjo Ngalagena</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight">
              Preserving the Roots. Creating the Future.
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda.
            </p>
            <p className="text-stone-600 text-base leading-relaxed">
              Dirancang seperti sebuah lembur Sunda yang hidup. Sawah, bambu, seni pertunjukan, musik, permainan tradisional, kerajinan, kuliner, hingga kehidupan alam menjadi bagian dari satu perjalanan.
            </p>
            <p className="text-stone-600 text-base leading-relaxed">
              Pengunjung tidak hanya datang ke sebuah tempat. Mereka datang untuk melihat, mendengar, memainkan, merasakan, dan memahami budaya secara langsung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
