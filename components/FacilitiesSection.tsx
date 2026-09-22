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
    <section id="fasilitas" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Program & Fasilitas</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">Program & Pengalaman Kami</h2>
          <p className="text-stone-600 text-base mt-4">Lembur Udjo Parahyangan menghadirkan beragam pengalaman budaya, edukasi, dan alam dalam satu kesatuan perjalanan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {facilities.map((fac) => (
            <div key={fac.title} className="p-4 sm:p-6 rounded-lg border border-stone-200 bg-stone-50 hover:border-emerald-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">{fac.tag}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-forest mb-2">{fac.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{fac.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
