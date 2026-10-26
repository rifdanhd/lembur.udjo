const badges = [
  {
    label: "Culture",
    value: "Angklung Heritage",
    sub: "Warisan Budaya Sunda",
    icon: (
      <img
        src="/angklung.webp"
        alt=""
        aria-hidden="true"
        className="h-6 sm:h-7 w-auto object-contain"
      />
    ),
  },
  {
    label: "Ecoland",
    value: "Udjo Ecoland",
    sub: "Nurturing Future",
    icon: (
      <img
        src="/UDJO_ECOLAND.png"
        alt=""
        aria-hidden="true"
        className="h-6 sm:h-7 w-auto object-contain"
      />
    ),
  },
  {
    label: "Status",
    value: "UNESCO Heritage",
    sub: "Angklung 2010",
    icon: (
      <img
        src="/LOGOUNESCO.png"
        alt=""
        aria-hidden="true"
        className="h-6 sm:h-7 w-auto object-contain"
      />
    ),
  },
  {
    label: "Next Chapter",
    value: "Lembur Udjo Parahyangan",
    sub: "Hadir 2027",
    icon: (
      <img
        src="/LOGO_Lembur.udjo.png"
        alt=""
        aria-hidden="true"
        className="h-6 sm:h-7 w-auto object-contain"
      />
    ),
  },
];

export default function HeritageBadges() {
  return (
    <section id="penghargaan" className="py-12 sm:py-14 md:py-16 bg-cream border-t border-stone-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:gap-x-8 md:grid-cols-4 md:gap-x-6 lg:gap-x-10">
          {badges.map((item) => (
            <div
              key={item.label}
              className="flex w-full flex-col items-center text-center gap-3 sm:gap-3.5"
            >
              <span className="flex-shrink-0 text-[#14532d] badge-icon-filter">{item.icon}</span>
              <span className="leading-tight">
                <span className="block text-[11px] sm:text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
                  {item.label}
                </span>
                <span className="block font-playfair text-lg sm:text-xl font-semibold text-stone-950 mt-1.5">
                  {item.value}
                </span>
                <span className="block text-[11px] sm:text-xs font-medium text-stone-500 mt-1">
                  {item.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
