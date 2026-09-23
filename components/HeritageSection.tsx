export default function HeritageSection() {
  return (
    <section id="warisan" className="py-12 sm:py-16 md:py-20 bg-[#f6f7f9] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">
            Warisan Budaya UNESCO
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight">
            Tradisi yang Terus Berkembang
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
            Angklung Indonesia diakui UNESCO sebagai Karya Agung Warisan Budaya Lisan dan Nonbendawi Manusia (Intangible Cultural Heritage of Humanity).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { num: "01", title: "Budaya yang Hidup", desc: "Lembur Udjo Parahyangan dirancang seperti lembur Sunda yang hidup, menyatukan sawah, bambu, seni, musik, dan kehidupan alam." },
            { num: "02", title: "Warisan Udjo Ngalagena", desc: "Perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda." },
            { num: "03", title: "Inovasi Tradisi", desc: "Angklung dan musik bambu berpadu dengan musik modern dan teknologi, tanpa meninggalkan akar budaya Sunda." },
            { num: "04", title: "Pengalaman Langsung", desc: "Bukan sekadar menyaksikan, tetapi melihat, mendengar, memainkan, merasakan, dan memahami budaya secara langsung." },
          ].map((item) => (
            <div key={item.title} className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-cinzel text-xl font-bold text-amber-500/80 group-hover:text-amber-600 transition-colors block mb-1.5">{item.num}</span>
                <h3 className="font-cinzel font-bold text-forest text-sm sm:text-base mb-1.5 group-hover:text-amber-700 transition-colors">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
