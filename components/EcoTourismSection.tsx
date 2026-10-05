import MaskText from "./anim/MaskText";
const ecoPoints = [
  { num: "01", title: "Agrowalk 5 Titik Edukasi", desc: "Peternakan, sampah organik, bibit pepaya, arboretum bambu, dan sentra perajin dalam satu perjalanan berpemandu." },
  { num: "02", title: "Konservasi Bambu", desc: "Pelestarian rumpun bambu sebagai sumber utama seni angklung dan seluruh musik bambu Sunda." },
  { num: "03", title: "Peternakan Edukasi", desc: "Sarana belajar mengenal kehidupan agraris secara langsung, dari kandang hingga hasilnya." },
  { num: "04", title: "Ruang Hijau Berkelanjutan", desc: "Sawah, kebun bambu, dan kolam yang menjaga keseimbangan kawasan tetap hijau dan sejuk." },
];

export default function EcoTourismSection() {
  return (
    <section id="eco-tourism" className="py-12 sm:py-16 md:py-20 bg-stone-50 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Eco Tourism
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              <MaskText text="Wisata Ramah Lingkungan" scrub />
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Kunjungan ke Lembur Udjo Parahyangan tidak berhenti di panggung. Seluruh kawasan diajak belajar tentang
              keberlanjutan: air, bambu, tanah, dan kehidupan warga yang tumbuh bersama alam Bale Pare.
            </p>
            <div className="pt-4 sm:pt-5">
              <a
                href="#fasilitas"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-forest hover:border-forest transition-colors"
              >
                Lihat Fasilitas &rarr;
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {ecoPoints.map((point) => (
                <div
                  key={point.num}
                  className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-300 group-hover:text-forest transition-colors">
                    {point.num}
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest mt-2 sm:mt-3 mb-1.5 sm:mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
