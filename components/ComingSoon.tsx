"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { siteForHost } from "@/lib/site-domains";

const subscribe = () => () => {};
const isPublicWebsite = () => !["app", "ticket"].includes(siteForHost(window.location.host));

// Dikontrol per-environment: hanya nyala bila di-set di .env server build
// (mis. di VPS). Lokal dibiarkan kosong supaya tidak ikut tampil.
const SHOW_COMING_SOON =
  process.env.NEXT_PUBLIC_SHOW_COMING_SOON === "1" ||
  process.env.NEXT_PUBLIC_SHOW_COMING_SOON === "true";

// Rute back-office tetap terbuka agar tim bisa masuk CRM.
const OPEN_ROUTES = ["/admin", "/api"];

// Turunan 2560x1440 dari public/Gemini_Generated_Image_j7jqibj7jqibj7jq.jpeg
// (sudah dipadatkan ke WebP agar tidak mengirim 3,5 MB di halaman Coming Soon).
const BACKGROUND_IMAGE = "/coming-soon.webp";

export default function ComingSoon() {
  const pathname = usePathname();
  const publicWebsite = useSyncExternalStore(subscribe, isPublicWebsite, () => false);

  if (!SHOW_COMING_SOON || !publicWebsite) return null;

  // The public information page must remain available while the homepage is gated.
  if (pathname !== "/") return null;

  if (pathname && OPEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-cream px-6 select-none animate-[fadeInUp_0.4s_ease-out] motion-reduce:animate-none"
      role="status"
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" />
      <p className="relative z-10 font-tan text-white text-center uppercase tracking-[0.18em] sm:tracking-[0.28em] leading-[1.36] text-[clamp(2rem,9vw,5.5rem)]">
        COMING SOON
      </p>
    </div>
  );
}
