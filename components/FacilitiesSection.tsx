const facilities = [
  { title: "Bale Karesmen", desc: "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas bertemu.", tag: "Ruang Utama" },
  { title: "Workshop Angklung", desc: "Belajar langsung proses pembuatan angklung dari para pengrajin.", tag: "Edukasi" },
  { title: "Agrowalk", desc: "Perjalanan berpandu ke berbagai spot edukasi budaya dan sustainability.", tag: "Unggulan" },
  { title: "Konservasi Bambu", desc: "Program pelestarian bambu sebagai sumber utama seni angklung.", tag: "Lingkungan" },
  { title: "Peternakan Edukasi", desc: "Sarana edukasi bagi pengunjung untuk mengenal kehidupan agraris.", tag: "Edukasi" },
  { title: "Area Hijau", desc: "Ruang hijau dan keberlanjutan. Sawah, kebun bambu, kolam.", tag: "Alam" },
];

export default function FacilitiesSection() {
  return (
    <section id="fasilitas" className="py-12 sm:py-16 md:py-20 bg-[#f6f7f9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-amber-600 uppercase block">
              Fasilitas &amp; Ekosistem
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05] mt-2">
              Program &amp; Pengalaman Kami
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Lembur Udjo Parahyangan menghadirkan beragam fasilitas edukasi, agrowalk, konservasi rumpun bambu, dan ruang seni pertunjukan dalam satu kesatuan perjalanan yang berkelanjutan.
            </p>
            <div className="pt-4 sm:pt-5">
              <a
                href="#kontak"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
              >
                Informasi Kunjungan &rarr;
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {facilities.map((fac) => (
              <div key={fac.title} className="p-5 sm:p-6 rounded-xl border border-stone-200 bg-white hover:border-stone-950 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-stone-500 mb-1.5 inline-block">{fac.tag}</span>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-stone-950 mb-1">{fac.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
