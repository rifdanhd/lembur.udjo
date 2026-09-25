export default function HeritageSection() {
  return (
    <section id="warisan" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            { num: "01", title: "Budaya yang Hidup", desc: "Lembur Udjo Parahyangan dirancang seperti lembur Sunda yang hidup, menyatukan sawah, bambu, seni, musik, dan kehidupan alam." },
            { num: "02", title: "Warisan Udjo Ngalagena", desc: "Perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda." },
            { num: "03", title: "Inovasi Tradisi", desc: "Angklung dan musik bambu berpadu dengan musik modern dan teknologi, tanpa meninggalkan akar budaya Sunda." },
            { num: "04", title: "Pengalaman Langsung", desc: "Bukan sekadar menyaksikan, tetapi melihat, mendengar, memainkan, merasakan, dan memahami budaya secara langsung." },
          ].map((item) => (
            <div key={item.title} className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-300 group-hover:text-forest transition-colors">{item.num}</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-950 mt-2 sm:mt-3 mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
