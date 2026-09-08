export default function Future() {
  return (
    <main className="min-h-screen flex flex-col items-start px-10 md:px-20 pt-32 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Running keycard */}
        <div className="border border-site-border rounded-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: '#1E6BA8' }}>
              Running Goal
            </span>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" style={{ color: '#1E6BA8', opacity: 0.6 }} aria-hidden="true">
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-site-subtle mb-1">Target</p>
            <p className="font-display font-bold text-2xl text-site-text leading-tight">4 Hour Marathon</p>
          </div>
        </div>
      </div>
    </main>
  );
}
