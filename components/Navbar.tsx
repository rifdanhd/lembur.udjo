"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "#about", label: "Tentang Kami" },
  { href: "#warisan", label: "Warisan" },
  { href: "#fasilitas", label: "Fasilitas" },
  { href: "#masterplan", label: "Masterplan" },
  { href: "#galeri", label: "Galeri" },
  { href: "#lokasi", label: "Lokasi" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // ScrollSpy untuk menentukan seksi yang sedang aktif
      const sections = navLinks.map((l) => l.href.substring(1));
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-stone-200/90 shadow-sm shadow-black/5"
          : "bg-black/30 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <a href="#beranda" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/LOGO_Lembur.udjo.png"
              alt="Logo Lembur Udjo Parahyangan"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden xs:block leading-tight">
              <span
                className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest block transition-colors duration-300 ${
                  scrolled ? "text-stone-950" : "text-white"
                }`}
              >
                Lembur Udjo
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-500 font-extrabold tracking-[0.25em] uppercase block">
                Parahyangan
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] lg:text-xs font-extrabold uppercase tracking-[0.16em] px-3.5 py-2 rounded-full transition-all duration-300 ${
                    scrolled
                      ? isActive
                        ? "text-amber-600 bg-stone-100 font-black"
                        : "text-stone-700 hover:text-stone-950 hover:bg-stone-100/80"
                      : isActive
                      ? "text-amber-400 bg-white/20 font-black"
                      : "text-white/85 hover:text-white hover:bg-white/15"
                  } after:absolute after:left-3.5 after:right-3.5 after:bottom-1 after:h-0.5 ${
                    scrolled ? "after:bg-amber-600" : "after:bg-amber-400"
                  } ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} after:origin-left after:transition-transform after:duration-300`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer ${
                scrolled
                  ? "text-stone-900 hover:bg-stone-100"
                  : "text-white hover:bg-white/15"
              }`}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[82vw] max-w-xs bg-white z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl flex flex-col justify-between border-l border-stone-200 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        <div>
          {/* Header Drawer */}
          <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <img
                src="/LOGO_Lembur.udjo.png"
                alt="Logo Lembur Udjo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <div className="leading-tight">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-950 block">
                  Lembur Udjo
                </span>
                <span className="text-[9px] text-amber-600 font-extrabold tracking-widest uppercase block">
                  Parahyangan
                </span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links List */}
          <nav className="flex flex-col p-3.5 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 px-4 text-xs font-extrabold uppercase tracking-widest rounded-xl min-h-[48px] flex items-center justify-between transition-all ${
                    isActive
                      ? "text-amber-600 bg-amber-50 font-black shadow-xs"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-2">
          <a
            href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1eb857] text-white text-center text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            Hubungi WhatsApp
          </a>
          <p className="text-[10px] text-stone-500 text-center font-medium">
            Kawasan Bale Pare, Kota Baru Parahyangan
          </p>
        </div>
      </div>
    </header>
  );
}
