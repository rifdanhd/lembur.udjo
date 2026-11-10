import Image from "next/image";
import type { WebsiteImage } from "@/lib/website/content";

/**
 * Tata letak foto editorial: satu gambar utama di kiri, deretan gambar
 * sekunder di kanan dengan tinggi berbeda agar ritmenya seperti halaman majalah.
 */
export default function Gallery({ images }: { images: WebsiteImage[] }) {
  const entries = images.slice(0, 5);
  if (!entries.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-white/60">
        Foto galeri belum tersedia.
      </p>
    );
  }

  const [feature, ...secondary] = entries;

  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-6 sm:gap-x-5">
      <figure className="relative col-span-12 overflow-hidden rounded-2xl bg-white/5 lg:col-span-7">
        <div className="relative aspect-[4/5] sm:aspect-[16/10]">
          <Image
            src={feature.image}
            alt={feature.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
        <figcaption className="absolute inset-x-4 bottom-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85">
          {feature.category || "Lembur Udjo"}
        </figcaption>
      </figure>

      <div className="col-span-12 grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-5">
        {secondary.map((image, index) => (
          <figure
            key={image.key}
            className={`relative overflow-hidden rounded-2xl bg-white/5 ${index % 2 === 0 ? "sm:mt-8" : ""}`}
          >
            <div className="relative aspect-[3/4]">
              <Image
                data-gallery-image
                src={image.image}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 24vw"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-3 bottom-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85">
              {image.category || "Lembur Udjo"}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
