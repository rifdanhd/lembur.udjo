const badges = [
  {
    label: "Founded",
    value: "Since 1966",
    sub: "Saung Angklung Udjo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
        <rect x="8" y="6" width="16" height="20" rx="2" />
        <path d="M8 12h16" />
        <path d="M16 18v8" />
        <circle cx="16" cy="9" r="1" fill="currentColor" stroke="none" />
        <circle cx="13" cy="9" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="19" cy="9" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Status",
    value: "UNESCO Heritage",
    sub: "Angklung 2010",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
        <path d="M4 12 16 5l12 7" />
        <path d="M6 12h20" />
        <path d="M8 12v10" />
        <path d="M13.5 12v10" />
        <path d="M18.5 12v10" />
        <path d="M24 12v10" />
        <path d="M5 26h22" />
        <path d="M7 22h18" />
      </svg>
    ),
  },
  {
    label: "Culture",
    value: "Angklung Heritage",
    sub: "Lembur Udjo 2027",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
        <path d="M8 5v22" />
        <path d="M13 5v22" />
        <path d="M18 5v22" />
        <path d="M23 5v22" />
        <path d="M6 9h19" />
        <path d="M6 15h19" />
        <path d="M6 21h19" />
      </svg>
    ),
  },
];

export default function HeritageBadges() {
  return (
    <section className="py-10 sm:py-12 bg-white border-t border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 sm:gap-x-14 gap-y-6">
          {badges.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="flex-shrink-0 text-[#14532d]">{item.icon}</span>
              <span className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  {item.label}
                </span>
                <span className="block text-xs sm:text-sm font-extrabold text-stone-950">
                  {item.value}
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-stone-500">
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
