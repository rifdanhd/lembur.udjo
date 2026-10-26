export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-cream" aria-busy="true">
      <div
        aria-hidden="true"
        className="fixed inset-y-0 left-0 hidden w-64 bg-forest p-5 lg:block"
      >
        <div className="mt-2 h-11 w-40 rounded-xl bg-white/15" />
        <div className="mt-12 space-y-4 motion-safe:animate-pulse">
          {[0, 1, 2, 3].map((id) => (
            <div key={id} className="h-12 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p role="status" className="text-sm font-semibold text-forest">
            Memuat ruang layanan Lembur Udjo…
          </p>
          <div aria-hidden="true" className="mt-8 motion-safe:animate-pulse">
            <div className="h-8 w-3/4 max-w-sm rounded-lg bg-stone-200" />
            <div className="mt-3 h-4 w-2/3 max-w-md rounded-lg bg-stone-200" />
            <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="h-44 rounded-2xl border border-stone-200 bg-white"
                />
              ))}
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {[0, 1].map((id) => (
                <div
                  key={id}
                  className="h-72 rounded-2xl border border-stone-200 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
