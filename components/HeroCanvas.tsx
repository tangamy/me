'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let alive = true;

    const W = canvas.offsetWidth  || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Determine orientation — use portrait scene on narrow viewports
    const portrait = H > W;
    const sceneW = portrait ? Math.round(W * dpr) : Math.round(W * dpr);
    const sceneH = portrait ? Math.round(H * dpr) : Math.round(H * dpr);

    (async () => {
      // Variable path: TS types this as `any` (no module resolution), webpack can't bundle it
      const url = '/clip/heroScene.js';
      const mod = await import(/* webpackIgnore: true */ url);
      const createScene = mod.createScene as (opts: {
        canvas: HTMLCanvasElement;
        width: number;
        height: number;
        variant: string;
        config?: Record<string, unknown>;
        fps?: number;
      }) => Promise<{ draw: (t: number) => void; duration: number; fps: number }>;

      if (!alive) return;

      // --- Intro ---
      const isMobile = window.innerWidth < 768;
      const intro = await createScene({ canvas, width: sceneW, height: sceneH, variant: 'intro', config: { splitName: isMobile } });
      if (!alive) return;
      let t0: number | null = null;

      function tickIntro(ts: number) {
        if (!alive) return;
        if (t0 === null) t0 = ts;
        const t = (ts - t0) / 1000;
        if (t >= intro.duration) {
          intro.draw(intro.duration); // hold final frame
          return;
        }
        intro.draw(t);
        raf = requestAnimationFrame(tickIntro);
      }

      raf = requestAnimationFrame(tickIntro);
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
