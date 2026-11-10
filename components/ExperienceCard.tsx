import Image from "next/image";

type ExperienceCardProps = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  accent: string;
  tag: string;
  href: string;
};

export default function ExperienceCard({
  id,
  index,
  title,
  description,
  image,
  alt,
  accent,
  tag,
  href,
}: ExperienceCardProps) {
  return (
    <article
      id={id}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(13,35,23,.10)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
        <span className="absolute left-4 top-4 rounded-full bg-surface/95 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-forest">
          {tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="font-tan text-2xl leading-none" style={{ color: accent }} aria-hidden="true">
            {index}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <h3 className="mt-4 font-playfair text-2xl font-normal leading-[1.15] tracking-[-0.01em] text-forest sm:text-[1.75rem]">
          {title}
        </h3>

        <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-muted">{description}</p>

        <a
          href={href}
          className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-forest pb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-forest transition-colors hover:border-lup-red hover:text-lup-red"
        >
          Lihat detail <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
