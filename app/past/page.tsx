'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type Category = 'photo' | 'running' | 'career';

const CATEGORY_COLORS: Record<Category, string> = {
  photo:   '#4A9FD0',
  running: '#1E6BA8',
  career:  '#0F3D6E',
};

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function toDecimalYear(label: string): number {
  const [year, mon] = label.split('-');
  return parseInt(year) + MONTH_INDEX[mon] / 12;
}

const TIMELINE: { id: string; label: string; name: string; category: Category }[] = [
  { id: '2026-aug', label: '2026-Aug', name: 'Cabo, MX',      category: 'photo' },
  { id: '2026-may', label: '2026-May', name: 'Beijing, CN',   category: 'photo' },
  { id: '2024-may', label: '2024-May', name: 'Switzerland',   category: 'photo' },
  { id: '2023-jul', label: '2023-Jul', name: 'Marathon',      category: 'running' },
  { id: '2020-sep', label: '2020-Sep', name: 'Unity',         category: 'career' },
  { id: '2019-feb', label: '2019-Feb', name: 'Half Marathon', category: 'running' },
  { id: '2016-oct', label: '2016-Oct', name: 'EA',            category: 'career' },
  { id: '2015-may', label: '2015-May', name: 'Caesars',       category: 'career' },
  { id: '2013-may', label: '2013-May', name: 'UC Berkeley',   category: 'career' },
];

const allTimes = TIMELINE.map((e) => toDecimalYear(e.label));
const DATA_MAX = Math.max(...allTimes);
const DATA_MIN = Math.min(...allTimes);
const INSET = 6; // % breathing room at top/bottom of the view

export default function Past() {
  const [selected, setSelected] = useState<string>(TIMELINE[0].id);
  const [viewStart, setViewStart] = useState(DATA_MIN - 0.5);
  const [viewEnd,   setViewEnd]   = useState(DATA_MAX + 0.5);

  const timelineRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; vsStart: number; veStart: number } | null>(null);

  const active = TIMELINE.find((e) => e.id === selected)!;
  const activeColor = CATEGORY_COLORS[active.category];

  // Map a decimal year to a % position (top=newest, bottom=oldest)
  const toPct = useCallback(
    (t: number) => {
      const raw = (viewEnd - t) / (viewEnd - viewStart);
      return INSET + raw * (100 - INSET * 2);
    },
    [viewStart, viewEnd],
  );

  // Non-passive wheel listener (must be added via useEffect for passive:false)
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height; // 0=top, 1=bottom
      const timeAtCursor = viewEnd - ratio * (viewEnd - viewStart);
      const factor = e.deltaY > 0 ? 1.25 : 0.8;
      const newRange = Math.max(0.5, Math.min(DATA_MAX - DATA_MIN + 2, (viewEnd - viewStart) * factor));
      setViewEnd(timeAtCursor + ratio * newRange);
      setViewStart(timeAtCursor - (1 - ratio) * newRange);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [viewStart, viewEnd]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    drag.current = { startY: e.clientY, vsStart: viewStart, veStart: viewEnd };
  }, [viewStart, viewEnd]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const dyRatio = (e.clientY - drag.current.startY) / rect.height;
    const range = drag.current.veStart - drag.current.vsStart;
    const dt = dyRatio * range;
    setViewStart(drag.current.vsStart - dt);
    setViewEnd(drag.current.veStart - dt);
  }, []);

  const onMouseUp = useCallback(() => { drag.current = null; }, []);

  // Minimap: maps the full data range to 0–100%
  const MINI_PAD = 0.3;
  const miniMin = DATA_MIN - MINI_PAD;
  const miniMax = DATA_MAX + MINI_PAD;
  const miniRange = miniMax - miniMin;
  const miniTop    = Math.max(0, (miniMax - Math.min(viewEnd,   miniMax)) / miniRange * 100);
  const miniBottom = Math.max(0, (Math.max(viewStart, miniMin) - miniMin) / miniRange * 100);

  return (
    <main className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-40 md:w-52 shrink-0 sticky top-0 h-screen flex flex-col border-r border-site-border">

        {/* Zoomable / pannable timeline */}
        <div
          ref={timelineRef}
          className="relative flex-1 overflow-hidden select-none pl-10 md:pl-14 pt-32"
          style={{ cursor: drag.current ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Connecting line */}
          <div className="absolute left-[1.35rem] md:left-[1.85rem] top-0 bottom-0 w-px bg-site-border" />

          {TIMELINE.map((entry) => {
            const t = toDecimalYear(entry.label);
            const pct = toPct(t);
            const inView = pct >= 0 && pct <= 100;
            const isActive = entry.id === selected;
            const color = CATEGORY_COLORS[entry.category];
            return (
              <button
                key={entry.id}
                onClick={() => setSelected(entry.id)}
                className="absolute flex items-center gap-3 group text-left transition-opacity duration-150"
                style={{
                  top: `${pct}%`,
                  transform: 'translateY(-50%)',
                  opacity: inView ? 1 : 0,
                  pointerEvents: inView ? 'auto' : 'none',
                }}
              >
                <span
                  className="absolute -left-[1.65rem] md:-left-[2.15rem] w-2.5 h-2.5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: color,
                    opacity: isActive ? 1 : 0.6,
                    boxShadow: isActive ? `0 0 0 2px #D3D8DA, 0 0 0 3.5px ${color}` : 'none',
                  }}
                />
                <span
                  className={`text-xs tracking-[0.1em] transition-colors duration-200 whitespace-nowrap ${isActive ? 'font-medium' : 'text-site-subtle group-hover:text-site-muted'}`}
                  style={isActive ? { color } : undefined}
                >
                  {entry.name}
                </span>
              </button>
            );
          })}

          {/* Minimap strip — right inner edge */}
          <div className="absolute right-2 top-8 bottom-4 w-1 rounded-full bg-site-border">
            <div
              className="absolute inset-x-0 rounded-full transition-all duration-100"
              style={{
                top:    `${miniTop}%`,
                bottom: `${miniBottom}%`,
                backgroundColor: '#8099A6',
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="pl-10 md:pl-14 py-5 border-t border-site-border flex flex-col gap-2">
          {(Object.entries(CATEGORY_COLORS) as [Category, string][]).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] tracking-[0.2em] uppercase text-site-subtle">{cat}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Content panel */}
      <section className="flex-1 pt-32 pb-16 px-10 md:px-20 max-w-3xl">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: activeColor }}>
          {active.label}
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight" style={{ color: activeColor }}>
          {active.name}
        </h2>
      </section>
    </main>
  );
}
