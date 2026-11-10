import type { ReactNode } from "react";

export type CTAVariant = "solid" | "light" | "outline" | "outline-light";

type CTAProps = {
  href: string;
  children: ReactNode;
  variant?: CTAVariant;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

const styles: Record<CTAVariant, string> = {
  solid: "bg-forest text-[#F7F5F0] hover:bg-forest-light focus-visible:ring-forest",
  light: "bg-[#F7F5F0] text-forest hover:bg-white focus-visible:ring-white",
  outline: "border border-border text-forest hover:bg-surface focus-visible:ring-forest",
  "outline-light": "border border-white/45 text-white hover:bg-white/10 focus-visible:ring-white",
};

/**
 * Tombol utama LUP. Semua varian memakai tinggi sentuh minimal 48px
 * dan huruf kapital ber-tracking agar konsisten dengan navigasi.
 */
export default function CTA({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
  ariaLabel,
}: CTAProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
