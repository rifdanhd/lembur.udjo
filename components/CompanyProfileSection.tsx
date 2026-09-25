export default function CompanyProfileSection() {
  return (
    <section id="profile" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-extrabold tracking-[0.25em] text-forest uppercase">Tentang Kami</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.05] mt-2">Profil Perusahaan</h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">Lembur Udjo Parahyangan adalah destinasi wisata budaya Sunda terkemuka yang menjaga dan mengembangkan warisan budaya leluhur sejak 1966.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div className="flex justify-center">
            <img src="/Kang_Opick.png" alt="Kang Opick - Pendiri Lembur Udjo" className="w-full max-w-xs sm:max-w-sm h-auto object-contain" loading="lazy" />
          </div>

          <div className="space-y-7">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-stone-950 mb-2">Visi & Misi</h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Lembur Udjo Parahyangan lahir dari perjalanan panjang keluarga Udjo dalam menjaga, memperkenalkan, dan mengembangkan angklung serta kebudayaan Sunda kepada dunia.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-white border border-stone-200">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-950 mb-1.5">Visi</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Menjadi pusat pelestarian budaya Sunda yang diakui dunia.</p>
              </div>
              <div className="p-5 rounded-lg bg-white border border-stone-200">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-950 mb-1.5">Misi</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Menghadirkan pengalaman budaya autentik melalui seni, edukasi, dan keberlanjutan.</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-950 mb-2">Tentang Lembur Udjo</h4>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Dirancang seperti sebuah lembur Sunda yang hidup. Hamparan sawah, rumpun bambu, seni pertunjukan, musik tradisi, permainan rakyat, hingga kelestarian alam menjadi bagian terintegrasi dalam satu perjalanan.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white border border-stone-200 p-6 sm:p-8">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-stone-950 mb-5 text-center">Nilai-Nilai Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3h12l4 6-10 13L2 9Z" />
                    <path d="M11 3 8 9l4 13 4-13-3-6" />
                    <path d="M2 9h20" />
                  </svg>
                ),
                title: "Keaslian",
                desc: "Menghadirkan budaya Sunda dalam bentuk paling autentik dan asli.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                ),
                title: "Keberlanjutan",
                desc: "Konservasi bambu, alam, dan tradisi untuk generasi mendatang.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Kearifan Lokal",
                desc: "Memberdayakan masyarakat sekitar dan pengrajin lokal.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                    <path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
                  </svg>
                ),
                title: "Edukasi",
                desc: "Menyediakan pengalaman belajar yang mendalam dan interaktif.",
              },
            ].map((val) => (
              <div key={val.title} className="flex items-start gap-4 p-5 rounded-lg bg-white border border-stone-100">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-stone-200 text-forest">{val.icon}</span>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-950">{val.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
