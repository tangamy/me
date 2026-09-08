import { bio, links, gear } from '@/components/data';

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

      {/* Bottom corners: gear (left) and connect (right) — shared row so labels align */}
      <div className="absolute bottom-14 left-8 right-8 md:left-16 md:right-16 flex justify-between items-start">
        {/* Gear */}
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-4">Gear</p>
          {gear.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-site-muted">
              {item.type === 'camera' ? (
                <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 2H8l-.96 3.73C5.19 7.19 4 9.46 4 12s1.19 4.81 3.04 6.27L8 22h8l.96-3.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z" />
                </svg>
              )}
              {item.label}
            </div>
          ))}
        </div>

        {/* Connect */}
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-site-subtle mb-4 text-right">Connect</p>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              className="flex items-center justify-end gap-2 text-xs tracking-[0.15em] uppercase text-site-muted hover:text-site-text transition-colors"
            >
              {l.label}
              {l.type === 'linkedin' && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>

    </main>
  );
}
