export default function MapSection() {
  return (
    <section id="lokasi" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
            Kontak &amp; Lokasi
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.12] sm:leading-[1.05] mt-2">
            Temui Kami di Bale Pare
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
            Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg border border-stone-200">
          <iframe
            src="https://maps.google.com/maps?q=Bale%20Pare%20Kota%20Baru%20Parahyangan%20Padalarang&t=&z=16&ie=UTF8&iwloc=&output=embed"
            title="Peta Lokasi Lembur Udjo Parahyangan"
            className="w-full h-[260px] sm:h-[360px] md:h-[420px] block"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
