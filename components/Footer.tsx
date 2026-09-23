export default function Footer() {
  const quickLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#pertunjukan", label: "Destinasi Pertunjukan" },
    { href: "#fasilitas", label: "Fasilitas & Program" },
    { href: "#jadwal", label: "Jadwal & Agenda" },
    { href: "#galeri", label: "Galeri Foto" },
    { href: "#about", label: "Tentang Kami" },
    { href: "#warisan", label: "Warisan Budaya" },
    { href: "#kontak", label: "Reservasi & Kontak" },
  ];

  const experienceLinks = [
    { label: "Pertunjukan Angklung Massal", href: "#pertunjukan" },
    { label: "Arumba & Musik Bambu", href: "#pertunjukan" },
    { label: "Teater Wayang Golek", href: "#pertunjukan" },
    { label: "Workshop Kerajinan Bambu", href: "#fasilitas" },
    { label: "Bale Pinton & Panggung Budaya", href: "#fasilitas" },
    { label: "Wisata Edukasi Alam", href: "#fasilitas" },
  ];

  return (
    <footer className="bg-white border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* InJourney 4-column footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-stone-200">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-forest/5 p-1 border border-forest/10 shrink-0">
                <img src="/LOGO_Lembur.udjo.png" alt="Logo Lembur Udjo" width={44} height={44} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-forest">Lembur Udjo</h3>
                <p className="font-serif text-[11px] text-amber-600 font-semibold tracking-widest uppercase">Parahyangan</p>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Pusat kebudayaan dan seni Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan. Melestarikan, memperkenalkan, dan mengedukasi masyarakat dunia melalui seni angklung warisan UNESCO.
            </p>
            <div className="flex gap-2.5 pt-1">
              {[
                { label: "Instagram", href: "https://instagram.com/lemburudjo", icon: "instagram" },
                { label: "Website", href: "https://www.lemburudjo.com", icon: "web" },
                { label: "WhatsApp", href: "https://wa.me/6281219279765", icon: "wa" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-forest hover:border-forest hover:text-white transition-all min-w-[40px] min-h-[40px]"
                >
                  {s.icon === "instagram" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  )}
                  {s.icon === "web" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  )}
                  {s.icon === "wa" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigasi Cepat (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Navigasi</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-stone-500 hover:text-amber-600 text-sm transition-colors py-0.5 inline-block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Pengalaman Budaya (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Destinasi & Budaya</h4>
            <ul className="space-y-2.5">
              {experienceLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-stone-500 hover:text-amber-600 text-sm transition-colors py-0.5 inline-block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Informasi Kontak & Lokasi (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-forest tracking-wider uppercase">Kontak & Lokasi</h4>
            <div className="space-y-3 text-sm text-stone-500">
              <div className="flex items-start gap-2.5">
                <span className="text-amber-600 shrink-0 text-base">📍</span>
                <span className="text-xs leading-relaxed">
                  Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat, Jawa Barat
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-amber-600 shrink-0 text-base">📞</span>
                <span className="text-xs font-medium text-stone-700">(022) 7279765</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-amber-600 shrink-0 text-base">💬</span>
                <span className="text-xs font-medium text-stone-700">+62 812-1927-9765</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-amber-600 shrink-0 text-base">✉️</span>
                <span className="text-xs font-medium text-stone-700">corsec.lemburudjo@gmail.com</span>
              </div>
              <div className="pt-2 border-t border-stone-100">
                <p className="text-[11px] text-stone-400">Jam Operasional:</p>
                <p className="text-xs font-medium text-forest">Setiap Hari: 08.00 - 17.00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Lembur Udjo Parahyangan. Dilindungi Hak Cipta.</p>
          <div className="flex items-center gap-4">
            <a href="#beranda" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-forest hover:border-forest hover:text-white transition-all text-xs font-semibold">
              <span>Kembali ke Atas</span>
              <span>↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
