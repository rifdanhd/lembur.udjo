import Image from "next/image";
import Link from "next/link";
import { FOOTER_NAV_LINKS, SOCIAL_LINKS } from "@/lib/website/navigation";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="kontak" className="relative overflow-hidden bg-forest text-[#F7F5F0]">
      {/* Aksen gradasi LUP */}
      <div aria-hidden="true" className="lup-rule h-[3px] w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(123,188,232,.18)_0%,rgba(123,188,232,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,90,74,.16)_0%,rgba(201,90,74,0)_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid grid-cols-12 gap-y-12 gap-x-6 border-b border-white/12 pb-14 sm:gap-x-8">
          {/* Brand */}
          <div className="col-span-12 lg:col-span-5">
            <span className="inline-block rounded-2xl bg-[#F7F5F0] p-3">
              <Image
                src="/LOGO_Lembur.udjo.png"
                alt="Logo Lembur Udjo Parahyangan"
                width={2716}
                height={3000}
                className="h-14 w-auto"
              />
            </span>
            <p className="mt-6 max-w-[36ch] text-[15px] leading-[1.75] text-white/65">
              Pusat seni, tradisi, dan kebudayaan Sunda terintegrasi di Kawasan Bale Pare, Kota Baru
              Parahyangan.
            </p>
            <p className="mt-8 font-tan text-xl leading-snug text-white sm:text-2xl">
              Keep the Old, Create the New
            </p>
          </div>

          {/* Navigasi */}
          <nav
            aria-label="Navigasi footer"
            className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7"
          >
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Jelajahi
            </h2>
            <ul className="mt-5 space-y-1">
              {FOOTER_NAV_LINKS.slice(0, 6).map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-[36px] items-center py-1 text-[13px] leading-snug text-white/70 transition-colors hover:text-lup-yellow"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Informasi */}
          <nav
            aria-label="Informasi footer"
            className="col-span-6 sm:col-span-4 lg:col-span-2"
          >
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Informasi
            </h2>
            <ul className="mt-5 space-y-1">
              {FOOTER_NAV_LINKS.slice(6).map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-[36px] items-center py-1 text-[13px] leading-snug text-white/70 transition-colors hover:text-lup-yellow"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div className="col-span-12 sm:col-span-4 lg:col-span-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Kunjungi Kami
            </h2>
            <address className="mt-5 space-y-3 text-[13px] not-italic leading-[1.7] text-white/70">
              <p>Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat</p>
              <p>
                <a href="tel:0227279765" className="transition-colors hover:text-lup-yellow">
                  (022) 7279765
                </a>
              </p>
              <p>
                <a
                  href="mailto:corsec.lemburudjo@gmail.com"
                  className="break-all transition-colors hover:text-lup-yellow"
                >
                  corsec.lemburudjo@gmail.com
                </a>
              </p>
            </address>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-lup-yellow"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/45 sm:flex-row sm:items-center">
          <p>&copy; {year} Lembur Udjo Parahyangan. Dilindungi Hak Cipta.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/#faq" className="transition-colors hover:text-white">
              FAQ
            </Link>
            <Link href="/#lokasi" className="transition-colors hover:text-white">
              Lokasi
            </Link>
            <Link href="/#beranda" className="transition-colors hover:text-white">
              Kembali ke Atas &uarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
