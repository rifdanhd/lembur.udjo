import MaskText from "./anim/MaskText";
export default function HeritageSection() {
  return (
    <section id="warisan" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            { num: "01", title: "Budaya yang Hidup", desc: "Lembur Udjo Parahyangan dirancang seperti lembur Sunda yang hidup, menyatukan sawah, bambu, seni, musik, dan kehidupan alam." },
            { num: "02", title: "Warisan Udjo Ngalagena", desc: "Perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda." },
            { num: "03", title: "Inovasi Tradisi", desc: "Angklung dan musik bambu berpadu dengan musik modern dan teknologi, tanpa meninggalkan akar budaya Sunda." },
            { num: "04", title: "Pengalaman Langsung", desc: "Bukan sekadar menyaksikan, tetapi melihat, mendengar, memainkan, merasakan, dan memahami budaya secara langsung." },
          ].map((item) => (
            <div key={item.title} className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-300 group-hover:text-forest transition-colors">{item.num}</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest mt-2 sm:mt-3 mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8 sm:mt-10 overflow-hidden rounded-xl sm:rounded-2xl bg-forest text-white">
          <div className="relative">
            <img
              src="/Pertunjukanluar.webp"
              alt="Pertunjukan angklung Lembur Udjo di berbagai negara"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/45" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/30 to-forest/95 sm:via-forest/15"
              aria-hidden="true"
            />

            <div className="relative max-w-3xl mx-auto text-center p-6 sm:p-10 md:p-12">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] sm:tracking-[0.25em] text-emerald-400 uppercase block">
                Visi Abah Udjo &middot; Sejak 1966
              </span>

              <h2 className="font-tan text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl mt-2.5 sm:mt-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                <MaskText text="Angklung to the World" scrub />
              </h2>

              <p className="text-stone-100 text-sm sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-3 sm:mt-4 drop-shadow-sm">
                Dari Bale Pare, Kota Baru Parahyangan, angklung terus diperkenalkan kepada dunia lewat pertunjukan
                interaktif, workshop, dan pertemuan budaya yang diwariskan dari generasi ke generasi.
              </p>

              <figure className="max-w-xl mx-auto mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/20">
                <blockquote className="text-base sm:text-lg md:text-xl font-extrabold leading-snug text-white drop-shadow-sm">
                  &ldquo;Dengan pertunjukan sederhana, suatu waktu angklung akan mendunia.&rdquo;
                </blockquote>
                <figcaption className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-emerald-400">
                  Udjo Ngalagena &middot; Abah Udjo
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
