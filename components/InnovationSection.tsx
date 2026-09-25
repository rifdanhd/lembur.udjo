const features = [
  {
    title: "Suara Asli Abah Udjo",
    desc: "Dengarkan rekaman arsip suara Abah Udjo — wejangan, lagu, dan cerita yang jarang terdengar.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
  {
    title: "Arsip Musik Tradisi",
    desc: "Putar potongan angklung, karawitan, dan musik bambu dari koleksi arsip keluarga Udjo.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Cerita di Balik Rekaman",
    desc: "Setiap audio disertai konteks sejarah: kapan, di mana, dan bersama siapa rekaman dibuat.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    ),
  },
];

function QrPlaceholder() {
  const cells = [
    [0,0],[1,0],[2,0],[3,0],[4,0],[6,0],[8,0],[9,0],[10,0],[11,0],
    [0,1],[4,1],[6,1],[8,1],[11,1],
    [0,2],[2,2],[3,2],[4,2],[6,2],[8,2],[9,2],[10,2],[11,2],
    [0,3],[4,3],[6,3],[8,3],[11,3],
    [0,4],[1,4],[2,4],[3,4],[4,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
    [6,5],[0,6],[1,6],[3,6],[5,6],[7,6],[9,6],[11,6],
    [0,7],[2,7],[4,7],[6,7],[8,7],[10,7],
    [0,8],[1,8],[2,8],[3,8],[4,8],[6,8],[7,8],[9,8],[11,8],
    [0,9],[4,9],[6,9],[8,9],[9,9],[11,9],
    [0,10],[2,10],[3,10],[4,10],[6,10],[8,10],[10,10],[11,10],
    [0,11],[1,11],[2,11],[3,11],[4,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11],
  ];
  return (
    <svg viewBox="0 0 12 12" className="w-full h-full" role="img" aria-label="Placeholder QR code">
      <rect width="12" height="12" fill="white" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1c1917" />
      ))}
      <rect x="4.5" y="4.5" width="3" height="3" rx="0.4" fill="white" />
      <rect x="5" y="5" width="2" height="2" rx="0.3" fill="#14532d" />
    </svg>
  );
}

export default function InnovationSection() {
  return (
    <section id="inovasi" className="py-12 sm:py-16 md:py-20 bg-stone-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-emerald-400 uppercase block">
              Inovasi Digital
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.12] sm:leading-[1.05]">
              Pindai QR. <span className="text-emerald-400">Dengarkan Warisan Suara.</span>
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
              Hadir pengalaman baru: scan kode QR di kawasan untuk mendengar suara asli Abah Udjo, arsip musik tradisi, dan cerita di balik rekaman yang dilestarikan untuk generasi berikutnya.
            </p>

            <ul className="space-y-3 pt-2">
              {features.map((f) => (
                <li key={f.title} className="flex gap-3 items-start">
                  <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-emerald-400 flex items-center justify-center">
                    {f.icon}
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-white">{f.title}</span>
                    <span className="block text-xs text-stone-400 leading-relaxed mt-0.5">{f.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mockup QR + player */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 rounded-xl bg-white p-3 shadow-lg">
                  <QrPlaceholder />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                    Placeholder — QR menyusul
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white mb-1">
                    Suara Asli Abah Udjo
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Arahkan kamera ponsel ke QR untuk membuka pemutar arsip audio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
