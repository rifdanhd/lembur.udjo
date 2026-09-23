const facilities = [
  { title: "Bale Karesmen", desc: "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas generasi baru bertemu.", tag: "Ruang Utama" },
  { title: "Workshop Angklung", desc: "Belajar langsung proses pembuatan angklung dari para pengrajin, dari bahan mentah hingga alat musik jadi.", tag: "Edukasi" },
  { title: "Agrowalk", desc: "Perjalanan berpandu ke berbagai spot edukasi budaya dan sustainability. Dari peternakan hingga sentra perajin.", tag: "Unggulan" },
  { title: "Konservasi Bambu", desc: "Program pelestarian bambu sebagai sumber utama seni angklung. Arboretum bambu dan penjagaan rumpun lestari.", tag: "Lingkungan" },
  { title: "Peternakan Edukasi", desc: "Sarana edukasi bagi pengunjung untuk mengenal kehidupan agraris dan siklus hidup hewan ternak.", tag: "Edukasi" },
  { title: "Area Hijau", desc: "Bagian dari kawasan yang mengedepankan ruang hijau dan keberlanjutan. Sawah, kebun bambu, kolam.", tag: "Alam" },
];

export default function FacilitiesSection() {
  return (
    <section id="fasilitas" className="py-12 sm:py-16 md:py-20 bg-[#f6f7f9] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (InJourney section-head) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3.5 sm:space-y-4">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/70 px-3 py-1 rounded-full inline-block">
              Fasilitas & Ekosistem
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight leading-tight">
              Program & Pengalaman Kami
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Lembur Udjo Parahyangan menghadirkan beragam fasilitas edukasi, agrowalk, konservasi rumpun bambu, dan ruang seni pertunjukan dalam satu kesatuan perjalanan yang berkelanjutan.
            </p>
            <div className="pt-1.5">
              <a
                href="#kontak"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-forest hover:bg-forest-light active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all min-h-[40px]"
              >
                <span>Informasi Kunjungan</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Grid of Facilities (InJourney card-promo style) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {facilities.map((fac) => (
              <div 
                key={fac.title} 
                className="p-5 rounded-2xl border border-stone-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {fac.tag}
                    </span>
                    <span className="text-stone-300 group-hover:text-amber-500 transition-colors text-xs font-bold">&nearr;</span>
                  </div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-forest group-hover:text-amber-700 transition-colors mb-1.5">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
