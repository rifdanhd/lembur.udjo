const shows = [
  { id: "angklung-interaktif", title: "Pertunjukan Angklung", subtitle: "Sajian autentik seni tradisional Jawa Barat", desc: "Pengunjung diajak langsung bermain angklung bersama secara interaktif.", image: "/placeholders/angklung.jpg", badge: "Utama", duration: "45 Menit", highlights: ["Interaktif", "Seni Jawa Barat", "Panduan Ahli"] },
  { id: "helaran", title: "Helaran Tradisi", subtitle: "Tradisi Arak-Arakan Penuh Makna", desc: "Tradisi arak-arakan dalam perayaan anak yang akan dikhitan.", image: "/placeholders/helaran.jpg", badge: "Tradisi", duration: "30 Menit", highlights: ["Makna Syukur", "Kebersamaan", "Tarian Tradisional"] },
  { id: "arumba", title: "Arumba & Kolaborasi Bambu", subtitle: "Alunan Rumpun Bambu Harmonis", desc: "Ansambel musik modern berbahan dasar bambu: angklung, lodong bas, calung rantay.", image: "/placeholders/arumba.jpg", badge: "Kontemporer", duration: "30 Menit", highlights: ["Inovasi Bambu", "Aransemen Dunia", "Musisi Piawai"] },
  { id: "bale-karesmen", title: "Bale Karesmen", subtitle: "Ruang Utama Pertunjukan & Kreativitas", desc: "Ruang utama tempat musik, tari, angklung, arumba bertemu. Kapasitas lebih dari 1.000 penonton.", image: "/placeholders/bale-karesmen.jpg", badge: "Premium", duration: "45 Menit", highlights: ["Ruang Semi-Terbuka", "Kapasitas Besar", "Interaktif"] },
];

export default function ShowsSection() {
  return (
    <section id="pertunjukan" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-extrabold tracking-[0.25em] text-forest uppercase">Destinasi & Pengalaman</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.05] mt-2">Jelajahi Pengalaman Budaya</h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">Empat sajian utama yang memadukan keindahan seni musik, tradisi, dan arsitektur Sunda dalam satu kesatuan perjalanan berkesan.</p>
          </div>
          <a href="#jadwal" className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-forest transition-colors">
            Lihat Semua &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {shows.map((show) => (
            <article key={show.id} className="group relative rounded-lg overflow-hidden min-h-[440px] flex flex-col justify-between p-6 shadow-sm hover:shadow-2xl transition-all duration-300 bg-stone-950">
              <div className="absolute inset-0 z-0">
                <img src={show.image} alt={show.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-stone-950">{show.badge}</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/15 text-white border border-white/25">{show.duration}</span>
              </div>

              <div className="relative z-10 pt-20 space-y-2.5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-green-400">{show.subtitle}</p>
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-green-400 transition-colors leading-tight">{show.title}</h3>
                <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{show.desc}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {show.highlights.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-white/15 text-white/90 border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
