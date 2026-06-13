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
          className="font-display font-light leading-[0.88] tracking-tight text-site-muted"
          style={{ fontSize: 'clamp(5rem, 20vw, 22rem)' }}
        >
          AMY
        </h1>
        <p className="mt-8 text-sm tracking-[0.25em] text-site-muted">
          {bio.blurb}
        </p>
        <p className="mt-3 text-xs tracking-wide text-site-subtle">
          📍 San Francisco Bay Area, California
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
