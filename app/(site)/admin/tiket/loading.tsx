export default function TicketAdminLoading() {
  return (
    <div className="min-h-svh bg-cream p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-4" aria-hidden="true">
        <div className="h-16 rounded-2xl bg-forest/5 motion-safe:animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 rounded-2xl bg-forest/5 motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="h-12 rounded-xl bg-forest/5 motion-safe:animate-pulse" />
        <div className="h-64 rounded-2xl bg-forest/5 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
