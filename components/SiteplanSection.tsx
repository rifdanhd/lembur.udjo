const zones = [
  { num: "01", name: "Lawang Kori", en: "Gate", desc: "Gerbang masuk kawasan dengan nuansa gerbang Sunda tradisional." },
  { num: "02", name: "Balandongan", en: "Reception", desc: "Pusat sambutan dan penerimaan pengunjung." },
  { num: "03", name: "Balé", en: "Management Office", desc: "Kantor pengelolaan kawasan Lembur Udjo Parahyangan." },
  { num: "04", name: "Balé Nyungcung", en: "Mushola", desc: "Ruang ibadah yang tenang di tengah kawasan." },
  { num: "05", name: "Alun-Alun", en: "Plaza", desc: "Alun-alun sebagai titik kumpul dan ruang bermain interaktif." },
  { num: "06", name: "Warung", en: "Merch. Kiosk", desc: "Kios merchandise dan cinderamata khas Lembur Udjo." },
  { num: "07", name: "Balé Ageung", en: "Restaurant", desc: "Restoran dengan sajian kuliner Sunda." },
  { num: "08", name: "Balé Pinton", en: "Amphitheater", desc: "Panggung pertunjukan terbuka berbentuk amfiteater." },
  { num: "09", name: "Kebon", en: "Mini Garden", desc: "Kebun mini koleksi tanaman dan edukasi hijau." },
  { num: "10", name: "Maripi", en: "Open Performance", desc: "Area pertunjukan terbuka untuk pagelaran seni." },
  { num: "11", name: "Balong", en: "Natural Ponds", desc: "Kolam-kolam alami sebagai elemen lanskap air." },
  { num: "12", name: "Glamping", en: "Glamping", desc: "Area glamping untuk menginap merasakan alam Parahyangan." },
];

export default function SiteplanSection() {
  return (
    <section id="siteplan" className="py-12 sm:py-16 md:py-20 bg-stone-50 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-forest block">
            Siteplan Kawasan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mt-2 text-stone-950 tracking-tight">
            Zona &amp; Titik Kawasan
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
            Sebaran 12 zona utama dalam siteplan Lembur Udjo Parahyangan — dari gerbang, ruang publik, pertunjukan, hingga area menginap.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {zones.map((zone) => (
            <div
              key={zone.num}
              className="group p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-100 group-hover:bg-forest group-hover:text-white text-stone-500 flex items-center justify-center text-xs font-extrabold transition-colors">
                  {zone.num}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-950">
                    {zone.name}
                  </h3>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-forest mb-1.5">
                    {zone.en}
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">{zone.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
