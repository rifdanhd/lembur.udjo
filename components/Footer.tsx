export default function Footer() {
  const quickLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#pertunjukan", label: "Pertunjukan" },
    { href: "#fasilitas", label: "Fasilitas" },
    { href: "#galeri", label: "Galeri" },
    { href: "#kontak", label: "Kontak" },
  ];

  return (
    <footer id="kontak" className="bg-white text-stone-950 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-8 sm:pb-10 border-b border-stone-200">
          <div className="lg:col-span-5 space-y-3.5">
            <a href="#beranda" className="inline-block group">
              <img
                src="/LOGO_Lembur.udjo.png"
                alt="Logo Lembur Udjo Parahyangan"
                width={48}
                height={48}
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              Pusat kebudayaan dan seni Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-stone-950 mb-3 sm:mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-0.5 text-stone-600 hover:text-stone-950 text-xs font-bold uppercase tracking-wider underline-offset-4 hover:underline transition-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-stone-950 mb-3 sm:mb-4">
              Kontak &amp; Lokasi
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <p className="leading-relaxed">
                Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat
              </p>
              <p className="font-bold text-stone-950">
                <a href="tel:0227279765" className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors py-0.5">
                  📞 (022) 7279765
                </a>
              </p>
              <p className="font-bold text-stone-950">
                <a href="mailto:corsec.lemburudjo@gmail.com" className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors py-0.5 break-all">
                  ✉️ corsec.lemburudjo@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Lembur Udjo Parahyangan. Dilindungi Hak Cipta.</p>
          <a
            href="#beranda"
            className="inline-flex items-center gap-1.5 text-stone-600 font-bold uppercase tracking-wider underline-offset-4 hover:text-stone-950 hover:underline transition-all"
          >
            Kembali ke Atas ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
