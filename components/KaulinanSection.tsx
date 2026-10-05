import Link from "next/link";
import MaskText from "./anim/MaskText";

const games = [
  { num: "01", title: "Congklak", desc: "Biji-bijian berpindah antar lubang papan kayu, melatih kesabaran dan strategi menghitung." },
  { num: "02", title: "Kelereng", desc: "Satu lingkaran tanah, beberapa kelereng kaca — siapa paling jitu menembak dan merebut." },
  { num: "03", title: "Egrang", desc: "Berjalan di atas bambu bertingkat, uji keseimbangan, nafas, dan keberanian anak." },
  { num: "04", title: "Gobak Sodor", desc: "Permainan garis dan penjagaan: satu tim menyerbu, satu tim menjaga barisan." },
  { num: "05", title: "Layangan", desc: "Layang bambu dan kertas minyak diterbangkan saat angin kencang, adu tinggi dan potong utas." },
  { num: "06", title: "Benteng", desc: "Rebutan tiang markas di pepohonan — cepat, kuat, dan penuh strategi bersama." },
];

export default function KaulinanSection() {
  return (
    <section id="kaulinan" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-forest uppercase block">
              Kaulinan Budak Lembur
            </span>
            <h2 className="font-tan text-2xl sm:text-3xl md:text-4xl tracking-tight text-forest leading-[1.12] sm:leading-[1.05] mt-2">
              <MaskText text="Permainan Anak Halaman" scrub />
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm sm:text-base mt-2.5 sm:mt-3 leading-relaxed">
              Sebelum gawai dan layar, anak-anak lembur mengisi sore dengan permainan yang mengajarkan strategi,
              kerja sama, dan keberanian — dimainkan di halaman, sawah, dan lapangan kampung.
            </p>
            <div className="pt-4 sm:pt-5">
              <Link
                href="/the-story-of-angklung"
                className="inline-flex items-center gap-1.5 text-stone-950 text-xs font-extrabold uppercase tracking-wider border-b-2 border-stone-950 pb-1 hover:text-forest hover:border-forest transition-colors"
              >
                The Story of Angklung &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {games.map((game) => (
                <div
                  key={game.num}
                  className="p-5 sm:p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-950 hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-300 group-hover:text-forest transition-colors">
                    {game.num}
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-forest mt-2 sm:mt-3 mb-1.5 sm:mb-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{game.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
