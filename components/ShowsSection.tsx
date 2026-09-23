const shows = [
  {
    id: "angklung-interaktif",
    title: "Pertunjukan Angklung",
    subtitle: "Sajian autentik seni tradisional Jawa Barat",
    desc: "Pengunjung diajak langsung bermain angklung bersama secara interaktif. Pertunjukan dikemas secara menghibur sehingga penonton ikut menjadi bagian pengalaman.",
    image: "/placeholders/angklung.jpg",
    badge: "Utama",
    duration: "45 Menit",
    highlights: ["Interaktif", "Seni Jawa Barat", "Panduan Ahli"],
  },
  {
    id: "helaran",
    title: "Helaran Tradisi",
    subtitle: "Tradisi Arak-Arakan Penuh Makna",
    desc: "Tradisi arak-arakan dalam perayaan anak yang akan dikhitan. Diiringi angklung dan tarian, Helaran membawa makna rasa syukur dan kebersamaan.",
    image: "/placeholders/helaran.jpg",
    badge: "Tradisi",
    duration: "30 Menit",
    highlights: ["Makna Syukur", "Kebersamaan", "Tarian Tradisional"],
  },
  {
    id: "arumba",
    title: "Arumba & Kolaborasi Bambu",
    subtitle: "Alunan Rumpun Bambu Harmonis",
    desc: "Ansambel musik modern berbahan dasar bambu: angklung, lodong bas, calung rantay, dan gambang. Membawakan aransemen musik pop, jazz, dan orkestra.",
    image: "/placeholders/arumba.jpg",
    badge: "Kontemporer",
    duration: "30 Menit",
    highlights: ["Inovasi Bambu", "Aransemen Dunia", "Musisi Piawai"],
  },
  {
    id: "bale-karesmen",
    title: "Bale Karesmen",
    subtitle: "Ruang Utama Pertunjukan & Kreativitas",
    desc: "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas generasi baru bertemu. Kapasitas lebih dari 1.000 penonton.",
    image: "/placeholders/bale-karesmen.jpg",
    badge: "Premium",
    duration: "45 Menit",
    highlights: ["Ruang Semi-Terbuka", "Kapasitas Besar", "Pengalaman Interaktif"],
  },
];

export default function ShowsSection() {
  return (
    <section id="pertunjukan" className="py-12 sm:py-16 md:py-20 bg-[#fcfaf6] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* InJourney section-head */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">
            Destinasi & Pengalaman
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight">
            Jelajahi Pengalaman Budaya
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
            Empat sajian utama yang memadukan keindahan seni musik, tradisi, dan arsitektur Sunda dalam satu kesatuan perjalanan berkesan.
          </p>
        </div>

        {/* InJourney card-destination grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {shows.map((show) => (
            <article
              key={show.id}
              className="group relative rounded-2xl overflow-hidden min-h-[440px] sm:min-h-[460px] flex flex-col justify-between p-6 shadow-sm hover:shadow-xl transition-all duration-500 bg-stone-900 border border-stone-200/40"
            >
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 z-0">
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Dual Gradient Vignette (InJourney style) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25 group-hover:via-black/45 transition-colors" />
              </div>

              {/* Card Top: Badge & Duration */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs">
                  {show.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {show.duration}
                </span>
              </div>

              {/* Card Bottom: Content, Tags, and Pill Button */}
              <div className="relative z-10 pt-16 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-2">
                    {show.subtitle}
                  </p>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2.5">
                    {show.title}
                  </h3>
                  <p className="text-xs text-stone-200/90 leading-relaxed line-clamp-3 font-normal">
                    {show.desc}
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-2">
                  {show.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[9px] font-medium bg-white/15 backdrop-blur-xs text-white/90 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* InJourney White Pill Button */}
                <a
                  href="#jadwal"
                  className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all mt-1"
                >
                  <span>Selengkapnya</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}