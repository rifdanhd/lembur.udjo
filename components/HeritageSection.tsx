export default function HeritageSection() {
  return (
    <section id="warisan" className="py-16 sm:py-24 md:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Warisan Budaya</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">
            Tradisi yang Terus Berkembang
          </h2>
          <p className="text-stone-600 text-base mt-4">Angklung Indonesia diakui UNESCO sebagai Karya Agung Warisan Budaya Lisan dan Nonbendawi Manusia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Budaya yang Hidup", desc: "Lembur Udjo Parahyangan dirancang seperti lembur Sunda yang hidup, menyatukan sawah, bambu, seni, musik, dan kehidupan alam." },
            { title: "Warisan Udjo Ngalagena", desc: "Perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda." },
            { title: "Inovasi Tradisi", desc: "Angklung dan musik bambu berpadu dengan musik modern dan teknologi, tanpa meninggalkan akar budaya Sunda." },
            { title: "Pengalaman Langsung", desc: "Bukan sekadar menyaksikan, tetapi melihat, mendengar, memainkan, merasakan, dan memahami budaya secara langsung." },
          ].map((item) => (
            <div key={item.title} className="p-6 bg-white rounded-lg border border-stone-200">
              <h3 className="font-serif font-bold text-forest mb-2">{item.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
