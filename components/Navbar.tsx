"use client";

import { useState } from "react";

const navLinks = [
   { href: "#beranda", label: "Beranda" },
   { href: "#about", label: "Tentang" },
   { href: "#pertunjukan", label: "Pertunj." },
   { href: "#warisan", label: "Warisan" },
   { href: "#fasilitas", label: "Fasilitas" },
   { href: "#galeri", label: "Galeri" },
   { href: "#jadwal", label: "Jadwal" },
   { href: "#kontak", label: "Kontak" },
 ];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
<header className="bg-white/75 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-50 transition-all">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-14 sm:h-16">
           <a href="#beranda" className="flex items-center gap-2">
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden">
               <img src="/LOGO_Lembur.udjo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
             </div>
             <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-amber-600 tracking-widest uppercase">Parahyangan</span>
           </a>

           <nav className="hidden md:flex items-center gap-4 sm:gap-7">
             {navLinks.map((link) => (
               <a key={link.href} href={link.href} className="text-xs sm:text-sm text-stone-700 hover:text-forest transition-colors font-medium">
                 {link.label}
               </a>
             ))}
           </nav>

          <div className="flex items-center">
<button
               type="button"
               onClick={() => setMenuOpen(!menuOpen)}
               className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-lg active:scale-95"
               aria-label="Menu"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {menuOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 )}
               </svg>
             </button>
          </div>
        </div>

        {menuOpen && (
<div className="md:hidden pb-4 border-t border-stone-200/50 bg-white/80 backdrop-blur-md -mx-4 px-4">
             <nav className="flex flex-col gap-1 pt-2">
               {navLinks.map((link) => (
                 <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 px-4 text-sm text-stone-600 hover:text-forest hover:bg-stone-50 rounded-lg transition-colors active:scale-95">
                   {link.label}
                 </a>
               ))}
             </nav>
           </div>
        )}
      </div>
    </header>
  );
}
