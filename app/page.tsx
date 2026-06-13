import { bio, links } from '@/components/data';

export default function Me() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">

      {/* Center: TANG / AMY / subtitle / location */}
      <div className="text-center px-4">
        <h1
          className="font-display font-bold leading-[0.88] tracking-tight text-site-text"
          style={{ fontSize: 'clamp(5rem, 20vw, 22rem)' }}
        >
          TANG
        </h1>
        <h1
          className="font-display font-bold leading-[0.88] tracking-tight text-site-muted"
          style={{ fontSize: 'clamp(5rem, 20vw, 22rem)' }}
        >
          AMY
        </h1>
        <p className="mt-8 text-sm tracking-[0.25em] text-site-muted">
          {bio.blurb}
        </p>
        <p className="mt-3 text-xs tracking-wide text-site-subtle flex items-center justify-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          San Francisco Bay Area, California
        </p>
      </div>

      {/* Bottom-right: contact links */}
      <div className="absolute bottom-14 right-8 md:right-16 text-right space-y-2">
        <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-4">Connect</p>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            className="block text-xs tracking-[0.15em] uppercase text-site-muted hover:text-site-text transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>

    </main>
  );
}
