export default function Footer() {
  const navLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#about", label: "Tentang" },
    { href: "#pertunjukan", label: "Pertunjukan" },
    { href: "#warisan", label: "Warisan" },
    { href: "#fasilitas", label: "Fasilitas" },
    { href: "#galeri", label: "Galeri" },
    { href: "#jadwal", label: "Jadwal" },
    { href: "#kontak", label: "Kontak" },
  ];

  return (
    <footer className="bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {/* Stack: 1 col on mobile, 3 col on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-8 border-b border-stone-200">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded overflow-hidden">
                <img src="/LOGO_Lembur.udjo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-forest">Lembur Udjo</h3>
                <p className="text-[10px] sm:text-xs text-amber-600 tracking-widest uppercase">Parahyangan</p>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Pusat budaya dan seni Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan.
              Melestarikan, memperkenalkan, dan mengedukasi masyarakat melalui seni angklung dan budaya Sunda.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com/lemburudjo" },
                { label: "Website", href: "https://www.lemburudjo.com" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors min-w-[44px] min-h-[44px]">
                  {s.label === "Instagram" ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-serif font-bold text-forest mb-4">Navigasi</h4>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-stone-500 hover:text-amber-600 text-sm transition-colors min-h-[44px] flex items-center py-1">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-serif font-bold text-forest mb-4">Informasi</h4>
            <div className="space-y-3 text-sm text-stone-500">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 shrink-0">📍</span>
                <span>Kawasan Bale Pare, Kota Baru Parahyangan<br/>Padalarang, Kab. Bandung Barat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 shrink-0">📞</span>
                <span>(022) 7279765</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 shrink-0">💬</span>
                <span>WA: +62 812-1927-9765</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 shrink-0">✉️</span>
                <span>corsec.lemburudjo@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Lembur Udjo Parahyangan</p>
          <a href="#beranda" className="inline-flex items-center gap-1 px-3 py-2 rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors min-h-[44px]">Kembali ke Atas ↑</a>
        </div>
      </div>
    </footer>
  );
}
