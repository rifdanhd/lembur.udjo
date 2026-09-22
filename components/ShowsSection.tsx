const shows = [
  {
    id: "angklung-interaktif",
    title: "Pertunjukan Angklung",
    subtitle: "Sajian autentik seni tradisional Jawa Barat",
    desc: "Pengunjung diajak langsung bermain angklung bersama secara interaktif. Pertunjukan dikemas secara menghibur sehingga penonton ikut menjadi bagian pengalaman.",
    image: "/workshop.jpg",
    badge: "Utama",
    duration: "45 Menit",
    highlights: ["Interaktif", "Seni Jawa Barat", "Panduan Ahli"],
  },
  {
    id: "helaran",
    title: "Helaran Tradisi",
    subtitle: "Tradisi Arak-Arakan Penuh Makna",
    desc: "Tradisi arak-arakan dalam perayaan anak yang akan dikhitan. Diiringi angklung dan tarian, Helaran membawa makna rasa syukur dan kebersamaan.",
    image: "/hero_background.jpg",
    badge: "Tradisi",
    duration: "30 Menit",
    highlights: ["Makna Syukur", "Kebersamaan", "Tarian Tradisional"],
  },
  {
    id: "arumba",
    title: "Arumba & Kolaborasi Bambu",
    subtitle: "Alunan Rumpun Bambu Harmonis",
    desc: "Ansambel musik modern berbahan dasar bambu: angklung, lodong bas, calung rantay, dan gambang. Membawakan aransemen musik pop, jazz, dan orkestra.",
    image: "/workshop.jpg",
    badge: "Kontemporer",
    duration: "30 Menit",
    highlights: ["Inovasi Bambu", "Aransemen Dunia", "Musisi Piawai"],
  },
  {
    id: "bale-karesmen",
    title: "Bale Karesmen",
    subtitle: "Ruang Utama Pertunjukan & Kreativitas",
    desc: "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas generasi baru bertemu. Kapasitas lebih dari 1.000 penonton.",
    image: "/wayang.jpg",
    badge: "Premium",
    duration: "45 Menit",
    highlights: ["Ruang Semi-Terbuka", "Kapasitas Besar", "Pengalaman Interaktif"],
  },
];

export default function ShowsSection() {
  return (
    <section id="pertunjukan" className="py-16 sm:py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Program & Pengalaman</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">
            Pertunjukan & Pengalaman Budaya
          </h2>
          <p className="text-stone-600 text-base mt-4">Setiap pengalaman dirancang untuk menghadirkan budaya Sunda yang hidup, interaktif, dan bermakna.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {shows.map((show) => (
            <div key={show.id} className="group rounded-lg overflow-hidden border border-stone-200 bg-white hover:shadow-sm transition-shadow">
              <div className="relative aspect-[16/9] bg-stone-100">
                <img src={show.image} alt={show.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-white">{show.badge}</span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">{show.duration}</span>
                <h3 className="font-serif text-xl font-bold text-forest mt-1 group-hover:text-amber-700 transition-colors">{show.title}</h3>
                <p className="text-sm text-stone-500 mt-1">{show.subtitle}</p>
                <p className="text-sm text-stone-600 leading-relaxed mt-3">{show.desc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {show.highlights.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-600">{tag}</span>
                  ))}
                </div>
                <a href="#jadwal" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-forest border-b border-forest hover:border-amber-600 hover:text-amber-700 transition-colors">
                  Detail <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
