import type { ElementType, ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Warna aksen LUP untuk titik eyebrow (hex). */
  accent?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: ElementType;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  accent = "#0D2317",
  tone = "dark",
  align = "left",
  as: Heading = "h2",
  className = "",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  const center = align === "center";

  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <span className={`inline-flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.32em] sm:text-[11px] ${
            isLight ? "text-white/70" : "text-muted"
          }`}
        >
          {eyebrow}
        </span>
      </span>

      <Heading
        className={`mt-5 font-playfair text-[clamp(2.1rem,4.6vw,4rem)] font-normal leading-[1.04] tracking-[-0.02em] ${
          isLight ? "text-white" : "text-forest"
        }`}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={`mt-5 max-w-[58ch] text-[15px] leading-[1.75] sm:text-base ${
            center ? "mx-auto" : ""
          } ${isLight ? "text-white/65" : "text-muted"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
