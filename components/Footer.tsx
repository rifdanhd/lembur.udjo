export default function Footer() {
  const quickLinks = [
    { href: "/#about", label: "Tentang Kami" },
    { href: "/#warisan", label: "Warisan" },
    { href: "/inovasi", label: "Inovasi" },
    { href: "/#fasilitas", label: "Fasilitas" },
    { href: "/#masterplan", label: "Masterplan" },
    { href: "/#siteplan", label: "Siteplan" },
    { href: "/#galeri", label: "Galeri" },
    { href: "/#lokasi", label: "Lokasi" },
  ];

  return (
    <footer id="kontak" className="bg-white text-stone-950 border-t border-stone-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-3.5">
            <a href="/#beranda" className="inline-block group" aria-label="Lembur Udjo Parahyangan">
              <img
                src="/LOGO_Lembur.udjo.png"
                alt="Logo Lembur Udjo Parahyangan"
                width={48}
                height={48}
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              Pusat seni, tradisi, dan kebudayaan Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan.
            </p>
          </div>

          {/* Navigasi */}
          <nav className="lg:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-stone-400 mb-3.5 sm:mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-stone-400 mb-3.5 sm:mb-4">
              Kontak &amp; Lokasi
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <p className="leading-relaxed">
                Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat
              </p>
              <p>
                <a href="tel:0227279765" className="font-bold text-stone-950 hover:text-forest transition-colors">
                  (022) 7279765
                </a>
              </p>
              <p>
                <a
                  href="mailto:corsec.lemburudjo@gmail.com"
                  className="font-bold text-stone-950 hover:text-forest transition-colors break-all"
                >
                  corsec.lemburudjo@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Lembur Udjo Parahyangan. Dilindungi Hak Cipta.</p>
          <a
            href="/#beranda"
            className="font-bold uppercase tracking-wider text-stone-500 hover:text-stone-950 transition-colors"
          >
            Kembali ke Atas &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
