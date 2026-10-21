// Deterministic motion scene: every frame is a pure function of time `t`,
// so the preview can scrub freely and the renderer can export frame-by-frame.
//
// Narrative: the whole is greater than the sum of its parts. The clip opens on
// your name, which dissolves into the hand-drawn data points it is made of.
// They break out into a combo bar + line chart, people and agents point in to
// discuss it, then the points flow back through Amy's tag and stabilize as
// the name before the name card resolves.

export const DEFAULTS = {
  name: "Amy Tang",
  role: "Strategy & Data Leader",
  tagline: "Transforming data into aligned decisions. Executing and learning from every plan",
  location: "San Francisco, CA",
  url: "Made with Opus 5.5",
  accent: "#1E6BA8",
  theme: "light",
  hud: false,
};

export const THEMES = {
  light: {
    bg: "#D3D8DA",
    ink: "15,61,110",
    inkGain: 1.15,
    onAccent: "255,255,255",
    outline: "#0F3D6E",
    vignette: "rgba(90,110,122,0.12)",
    grain: { alpha: 0.045, op: "multiply" },
    blobs: ["#B0BCC2", "#C6D1D7", "#A9C4D6", "#BFD3E2"],
    blobAlpha: 0.8,
    tone: "rgba(15,61,110,0.06)",
    nameGlow: 0,
  },
  dark: {
    bg: "#16132A",
    ink: "246,242,250",
    inkGain: 1,
    onAccent: "22,19,42",
    outline: "#241C33",
    vignette: "rgba(5,3,15,0.6)",
    grain: { alpha: 0.04, op: "overlay" },
    blobs: ["#4A2D5E", "#2D3A66", "#24474A", "#4D2C48"],
    blobAlpha: 0.7,
    tone: "rgba(255,240,250,0.06)",
    nameGlow: 0.35,
  },
};

// Intro timeline, in seconds.
const OPEN_FADE = 0.85;
const OPEN_BURST = 1.35;
const OPEN = 1.5;
const MORPH_START = 4.4 + OPEN;
const REVEAL_START = MORPH_START + 2.0;

export const VARIANTS = {
  intro: {
    duration: Math.round((REVEAL_START + 3.2) * 10) / 10,
    label: "Intro",
    description: "Opens on your name, which dissolves into the data points it is made of. They break out into a floating bar + line chart, people and agents point in to discuss it, then the points come back together and stabilize as your name. Plays once and holds on the final frame.",
  },
  loop: {
    duration: 10,
    label: "Loop",
    description: "The bar + line chart keeps updating live as its data points rise and fall, with people and agents hovering over it. Seamless and text-free, with room on the left for your own headline.",
  },
};

export const FORMATS = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
};

const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const range = (t, a, b) => clamp((t - a) / (b - a));
const frac = (x) => x - Math.floor(x);
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
const backOut = (k) => {
  const c = 2.4;
  return k >= 1 ? 1 : 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2);
};
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const pad = (n, l) => String(Math.max(0, Math.floor(n))).padStart(l, "0");
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEF";

const PASTELS = ["#9CC9E8", "#B5D8EE", "#8099A6", "#A9C4D6", "#6FB4DD", "#C6D1D7"];
const BAR_COLORS = ["#9CC9E8", "#B5D8EE", "#8DC7F7"];
const PEAK_COLORS = ["#4A9FD0", "#1E6BA8", "#6FB4DD"];
const AXIS_COLOR = "#B0BCC2";
const LINE_COLOR = "#4A9FD0";
const LINE_INK = "#1E6BA8";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return { r: 47, g: 91, b: 255 };
  const v = parseInt(m[1], 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function mixHex(a, b, k) {
  const x = hexToRgb(a), y = hexToRgb(b);
  const c = (p, q) => Math.round(lerp(p, q, k)).toString(16).padStart(2, "0");
  return `#${c(x.r, y.r)}${c(x.g, y.g)}${c(x.b, y.b)}`;
}

let fontsPromise;
export function loadFonts() {
  if (fontsPromise) return fontsPromise;
  const faces = [
    ["Inter Clip", "Inter-Regular.ttf", "400"],
    ["Inter Clip", "Inter-Medium.ttf", "500"],
    ["Inter Clip", "Inter-SemiBold.ttf", "600"],
    ["Inter Clip", "Inter-Bold.ttf", "700"],
    ["JB Clip", "JetBrainsMono-Regular.ttf", "400"],
    ["JB Clip", "JetBrainsMono-Medium.ttf", "500"],
  ];
  fontsPromise = Promise.all(
    faces.map(async ([family, file, weight]) => {
      const face = new FontFace(family, `url(/fonts/${file})`, { weight });
      await face.load();
      document.fonts.add(face);
    }),
  );
  return fontsPromise;
}

const SANS = '"Inter Clip", Inter, system-ui, sans-serif';
const MONO = '"JB Clip", "JetBrains Mono", ui-monospace, monospace';

function scramble(text, p, t, seed = 0) {
  const n = text.length;
  const shown = Math.floor(clamp(p) * n);
  if (shown >= n) return text;
  const tail = Math.min(n - shown, 6);
  let out = text.slice(0, shown);
  for (let i = 0; i < tail; i++) {
    const ch = text[shown + i];
    out += ch === " " ? " " : GLYPHS[Math.floor(hash(seed + i * 7.3 + Math.floor(t * 24) * 1.7) * GLYPHS.length)];
  }
  return out;
}

// A hand-drawn data point: pastel fill, ink outline, cel-style highlight.
function makeDot(color, outline, px) {
  const size = Math.ceil(px * 2.2);
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const c = cv.getContext("2d");
  c.translate(size / 2, size / 2);
  const r = px * 0.82;
  c.beginPath();
  c.arc(0, 0, r, 0, TAU);
  c.fillStyle = color;
  c.fill();
  c.strokeStyle = outline;
  c.lineWidth = Math.max(1, px * 0.12);
  c.stroke();
  c.fillStyle = "rgba(255,255,255,0.85)";
  c.beginPath();
  c.ellipse(-r * 0.36, -r * 0.38, r * 0.27, r * 0.17, -0.6, 0, TAU);
  c.fill();
  return cv;
}

export async function createScene({ canvas, width, height, variant = "intro", config = {}, fps = 30 }) {
  await loadFonts();
  const cfg = { ...DEFAULTS, ...config };

  const W = Math.round(width);
  const H = Math.round(height);
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const loop = variant === "loop";
  const duration = VARIANTS[variant]?.duration ?? VARIANTS.intro.duration;
  const s = Math.min(W, H) / 1080;
  const portrait = H > W;
  const acc = hexToRgb(cfg.accent);
  const T = THEMES[cfg.theme] || THEMES.light;
  const A = (a) => `rgba(${acc.r},${acc.g},${acc.b},${a})`;
  const L = (a) => `rgba(${T.ink},${a * T.inkGain})`;
  const ON = (a) => `rgba(${T.onAccent},${a})`;
  const CARD = (a) => (cfg.theme === "dark" ? `rgba(22,19,42,${a})` : `rgba(255,255,255,${a})`);
  const inset = Math.round((portrait ? 44 : 52) * s);
  const w = TAU / duration;
  const cx = W * 0.5;
  const cy = H * 0.5;

  // ---- name layout (shared by particle sampling and crisp overlay) ----
  const name = String(cfg.name || " ").trim() || " ";
  // The name is set in small caps; the flag is only on while measuring and drawing it.
  ctx.font = `600 100px ${SANS}`;
  ctx.fontVariantCaps = "small-caps";
  ctx.letterSpacing = "-3px";
  const w100 = Math.max(1, ctx.measureText(name).width);
  const fs = Math.min(((portrait ? 0.76 : 0.7) * W) / w100 * 100, (portrait ? 190 : 230) * s);
  const nameFont = `600 ${fs}px ${SANS}`;
  const nameTracking = `${-0.03 * fs}px`;
  const nameY = cy;
  ctx.font = nameFont;
  ctx.letterSpacing = nameTracking;
  const nameW = ctx.measureText(name).width;
  ctx.letterSpacing = "0px";
  ctx.fontVariantCaps = "normal";
  const openFade = (t) => easeInOut(range(t, OPEN_FADE, OPEN_FADE + 0.55));

  // ---- sprites ----
  const SPR_PX = Math.max(8, Math.round(16 * s));
  const DOT_R = SPR_PX * 0.82;
  const spriteCache = new Map();
  const dot = (color, outline = T.outline) => {
    const key = `${color}|${outline}`;
    if (!spriteCache.has(key)) spriteCache.set(key, makeDot(color, outline, SPR_PX));
    return spriteCache.get(key);
  };

  // ---- the chart canvas ----
  const card = loop
    ? portrait ? { cx: W * 0.5, cy: H * 0.6, w: W * 0.84, h: H * 0.3 } : { cx: W * 0.72, cy: H * 0.52, w: W * 0.42, h: H * 0.56 }
    : portrait ? { cx: W * 0.5, cy: H * 0.5, w: W * 0.9, h: H * 0.34 } : { cx: W * 0.5, cy: H * 0.52, w: W * 0.6, h: H * 0.62 };
  card.x0 = card.cx - card.w / 2;
  card.y0 = card.cy - card.h / 2;
  const plot = { x0: card.x0 + card.w * 0.08, x1: card.x0 + card.w * 0.92, y0: card.y0 + card.h * 0.17, y1: card.y0 + card.h * 0.86 };
  plot.w = plot.x1 - plot.x0;
  plot.h = plot.y1 - plot.y0;
  const BARS = [0.42, 0.58, 0.5, 0.72, 0.64, 0.88, 0.78];
  const LINE = [0.26, 0.4, 0.34, 0.54, 0.5, 0.7, 0.86];
  const NB = BARS.length;
  const PEAK = BARS.indexOf(Math.max(...BARS));
  const slotW = plot.w / NB;
  const barCx = (b) => plot.x0 + slotW * (b + 0.5);
  const barH = (b, t) => Math.min(0.97, BARS[b] * (loop ? 1 + 0.14 * Math.sin(t * w * (1 + (b % 3)) + b * 1.7) : 1));
  const lineV = (j, t) => Math.min(0.97, LINE[j] * (loop ? 1 + 0.12 * Math.sin(t * w * (1 + (j % 2)) + j * 2.1) : 1));
  const lineAt = (u, t) => {
    const f = clamp(u) * (NB - 1);
    const j = Math.min(NB - 2, Math.floor(f));
    const k = f - j;
    const p0 = lineV(Math.max(0, j - 1), t), p1 = lineV(j, t), p2 = lineV(j + 1, t), p3 = lineV(Math.min(NB - 1, j + 2), t);
    return 0.5 * (2 * p1 + (-p0 + p2) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (-p0 + 3 * p1 - 3 * p2 + p3) * k * k * k);
  };
  const lineX = (u) => lerp(barCx(0), barCx(NB - 1), u);

  // ---- particles ----
  const rng = mulberry32(0xc0ffee);
  const N = Math.round(1500 * Math.max(0.7, Math.min(1.15, (W * H) / (1920 * 1080))));
  const F = () => new Float32Array(N);
  const scX = F(), scY = F(), d1 = F(), d2 = F(), ph = F(), ox = F(), oy = F(), tx = F(), ty = F(), fr = F();
  const chartSc = F(), lineU = F();
  const role = new Uint8Array(N), bar = new Uint8Array(N), col = new Uint16Array(N), row = new Uint16Array(N);
  const spr = new Array(N);
  for (let i = 0; i < N; i++) {
    scX[i] = rng() * W;
    scY[i] = rng() * H;
    d1[i] = rng();
    d2[i] = rng();
    ph[i] = rng() * TAU;
    const a = rng() * TAU;
    ox[i] = Math.cos(a);
    oy[i] = Math.sin(a);
    fr[i] = rng();
  }

  // Bars are filled with a grid of dots; size the grid so ~72% of the points fit.
  const maxH = BARS.map((v) => Math.min(0.97, v * (loop ? 1.14 : 1)));
  const barW0 = slotW * 0.62;
  const g = Math.sqrt((maxH.reduce((a, v) => a + v, 0) * barW0 * plot.h) / (N * 0.72));
  const cols = Math.max(1, Math.round(barW0 / g));
  const rowsMax = maxH.map((v) => Math.max(1, Math.floor((v * plot.h) / g)));
  const slots = [];
  for (let b = 0; b < NB; b++) for (let r = 0; r < rowsMax[b]; r++) for (let c = 0; c < cols; c++) slots.push([b, c, r]);
  const perm = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const nBase = Math.round(plot.w / (g * 1.1));
  const nBar = Math.min(slots.length, N - nBase - NB - Math.round(N * 0.16));
  const nLine = Math.round(N * 0.11);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  perm.forEach((i, k) => {
    if (k < nBar) {
      role[i] = 0;
      [bar[i], col[i], row[i]] = slots[k];
      spr[i] = dot(pick(bar[i] === PEAK ? PEAK_COLORS : BAR_COLORS));
      chartSc[i] = (g * 0.46) / DOT_R;
    } else if (k < nBar + NB) {
      role[i] = 3;
      lineU[i] = (k - nBar) / (NB - 1);
      spr[i] = dot("#FFFFFF", LINE_INK);
      chartSc[i] = ((g * 0.85) / DOT_R) * (k - nBar === NB - 1 ? 1.25 : 1);
    } else if (k < nBar + NB + nBase) {
      role[i] = 4;
      lineU[i] = (k - nBar - NB + 0.5) / nBase;
      spr[i] = dot(AXIS_COLOR, AXIS_COLOR);
      chartSc[i] = (g * 0.2) / DOT_R;
    } else if (k < nBar + NB + nBase + nLine) {
      role[i] = 1;
      lineU[i] = (k - nBar - NB - nBase + 0.5) / nLine;
      spr[i] = dot(LINE_COLOR);
      chartSc[i] = (g * 0.4) / DOT_R;
    } else {
      role[i] = 2;
      spr[i] = dot(PASTELS[Math.floor(rng() * PASTELS.length)]);
      chartSc[i] = ((g * 0.3) / DOT_R) * (0.7 + rng() * 0.9);
    }
  });

  const S = { x: 0, y: 0, a: 0, k: 0 };
  // The chart floats freely instead of sitting at a fixed spot.
  const floatX = (t) => (loop ? Math.sin(t * w) * W * 0.02 : Math.sin(t * 0.55) * 22 * s - t * 6 * s);
  const floatY = (t) => (loop ? Math.sin(t * w * 2 + 1) * H * 0.018 : Math.cos(t * 0.7) * 14 * s);
  function chartPos(i, t) {
    const r = role[i];
    if (r === 0) {
      const b = bar[i];
      S.x = barCx(b) - (cols * g) / 2 + (col[i] + 0.5) * g;
      S.y = plot.y1 - (row[i] + 0.5) * g;
      S.k = clamp((barH(b, t) * plot.h) / g - row[i]);
    } else if (r === 4) {
      S.x = lerp(plot.x0, plot.x1, lineU[i]);
      S.y = plot.y1 + g * 0.7;
      S.k = 1;
    } else {
      S.x = lineX(lineU[i]);
      S.y = plot.y1 - lineAt(lineU[i], t) * plot.h;
      S.k = 1;
    }
    S.x += floatX(t) + Math.sin(t * 1.7 + ph[i]) * g * 0.1;
    S.y += floatY(t) + Math.cos(t * 1.3 + ph[i]) * g * 0.1;
  }

  function basePos(i, t) {
    const driftX = scX[i] + Math.sin(t * (loop ? w * 2 : 0.9) + ph[i]) * 26 * s + (loop ? 0 : t * 14 * s);
    const driftY = scY[i] + Math.cos(t * (loop ? w : 0.7) + ph[i]) * 20 * s + (loop ? 0 : t * 8 * s);
    if (loop && role[i] === 2) {
      S.x = driftX; S.y = driftY; S.a = 0.55; S.k = 1;
      return S;
    }
    if (loop) {
      chartPos(i, t);
      S.a = 0.95;
      return S;
    }
    // every point starts inside the opening name, then breaks out in the wipe's wake
    const nx = tx[i] + Math.sin(t * 2.4 + ph[i]) * 1.2 * s;
    const ny = ty[i] + Math.cos(t * 2.1 + ph[i]) * 1.2 * s;
    const b0 = OPEN_BURST + d1[i] * 0.5;
    const k0 = easeInOut(range(t, b0, b0 + 0.7));
    const arc0 = Math.sin(k0 * Math.PI) * 30 * s;
    const sx = lerp(nx, driftX, k0) + ox[i] * arc0;
    const sy = lerp(ny, driftY, k0) + oy[i] * arc0;
    const shown = openFade(t);
    const inName = nameSc / chartSc[i];
    const r = role[i];
    if (r === 2) {
      S.x = sx; S.y = sy;
      S.a = lerp(0.95, 0.55, k0) * shown;
      S.k = lerp(inName, 1, k0);
      return S;
    }
    const t0 = OPEN + (r === 0 ? 0.45 + (row[i] / rowsMax[bar[i]]) * 0.55 + bar[i] * 0.04 + d1[i] * 0.15
      : r === 4 ? 0.3 + lineU[i] * 0.35 + d1[i] * 0.1
      : r === 3 ? 1.5 + lineU[i] * 0.45
      : 1.35 + lineU[i] * 0.45 + d1[i] * 0.1);
    const k1 = easeInOut(range(t, t0, t0 + 0.6));
    chartPos(i, t);
    const arc = Math.sin(k1 * Math.PI) * 40 * s;
    S.x = lerp(sx, S.x, k1) + ox[i] * arc;
    S.y = lerp(sy, S.y, k1) + oy[i] * arc;
    S.a = 0.95 * shown;
    S.k = lerp(lerp(inName, 0.7, k0), 1, k1);
    return S;
  }

  // Name targets: sampled glyph pixels, assigned left-to-right against where
  // each particle is when the morph starts, so the name assembles cleanly.
  // The opening name uses the same targets, so every point returns to its spot.
  let nameSc = 1;
  if (!loop) {
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const o = off.getContext("2d", { willReadFrequently: true });
    o.font = nameFont;
    o.letterSpacing = nameTracking;
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    o.fontVariantCaps = "small-caps";
    o.fillText(name, W / 2, nameY);
    o.fontVariantCaps = "normal";
    const data = o.getImageData(0, 0, W, H).data;
    let count = 0;
    for (let k = 3; k < data.length; k += 16) if (data[k] > 140) count++;
    const step = Math.max(2, Math.round(Math.sqrt((count * 4) / N)));
    nameSc = (step * 0.5) / DOT_R;
    const pts = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 140) pts.push([x + (rng() - 0.5) * step * 0.4, y + (rng() - 0.5) * step * 0.4]);
      }
    }
    if (!pts.length) pts.push([W / 2, nameY]);
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    const targets = Array.from({ length: N }, (_, i) => {
      const p = pts[i % pts.length];
      return i < pts.length ? p : [p[0] + (rng() - 0.5) * step, p[1] + (rng() - 0.5) * step];
    });
    targets.sort((a, b) => a[0] - b[0]);
    const order = Array.from({ length: N }, (_, i) => [i, basePos(i, MORPH_START).x]).sort((a, b) => a[1] - b[1]);
    order.forEach(([i], rank) => {
      tx[i] = targets[rank][0];
      ty[i] = targets[rank][1];
    });
  }

  // A few larger, soft data points drifting across the frame the whole time.
  const DRIFT = Math.round(18 * Math.sqrt((W * H) / (1920 * 1080)));
  const drifters = Array.from({ length: DRIFT }, (_, k) => ({
    spr: dot(PASTELS[k % PASTELS.length]),
    x0: rng(), y0: rng(),
    m: 1 + (k % 2),
    sc: ((g * 0.55) / DOT_R) * (0.8 + rng() * 0.8),
    p: rng() * TAU, a: 0.35 + rng() * 0.3,
  }));

  // ---- static layers ----
  const vignette = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.hypot(W, H) * 0.6);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, T.vignette);

  const noise = document.createElement("canvas");
  noise.width = noise.height = 256;
  const nctx = noise.getContext("2d");
  const nimg = nctx.createImageData(256, 256);
  const nrng = mulberry32(42);
  for (let i = 0; i < nimg.data.length; i += 4) {
    const v = nrng() * 255;
    nimg.data[i] = nimg.data[i + 1] = nimg.data[i + 2] = v;
    nimg.data[i + 3] = 255;
  }
  nctx.putImageData(nimg, 0, 0);
  const grain = ctx.createPattern(noise, "repeat");

  // Manga screentone: halftone dots that fade in from two corners.
  const tone = document.createElement("canvas");
  tone.width = W;
  tone.height = H;
  {
    const tc = tone.getContext("2d");
    tc.fillStyle = T.tone;
    const g = Math.round(14 * s);
    const corners = [[0, 0], [W, H]];
    const reach = Math.hypot(W, H) * 0.34;
    for (let y = g / 2; y < H; y += g) {
      for (let x = g / 2 + ((y / g) % 2 ? g / 2 : 0); x < W; x += g) {
        let k = 0;
        for (const [qx, qy] of corners) k = Math.max(k, 1 - Math.hypot(x - qx, y - qy) / reach);
        if (k <= 0) continue;
        tc.beginPath();
        tc.arc(x, y, g * 0.42 * Math.pow(k, 0.8), 0, TAU);
        tc.fill();
      }
    }
  }

  // ---- drawing helpers ----
  function mono(size, weight = 500) {
    ctx.font = `${weight} ${size * s}px ${MONO}`;
  }

  function brackets(x, y, bw, bh, len, color, lw = 1.5) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw * s;
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + bw - len, y); ctx.lineTo(x + bw, y); ctx.lineTo(x + bw, y + len);
    ctx.moveTo(x + bw, y + bh - len); ctx.lineTo(x + bw, y + bh); ctx.lineTo(x + bw - len, y + bh);
    ctx.moveTo(x + len, y + bh); ctx.lineTo(x, y + bh); ctx.lineTo(x, y + bh - len);
    ctx.stroke();
  }

  function tag(x, y, label, value, alpha, align = "left") {
    mono(13, 500);
    ctx.letterSpacing = `${1.5 * s}px`;
    const padX = 8 * s, hgt = 22 * s;
    const lw = ctx.measureText(label).width + padX * 2;
    const vw = value ? ctx.measureText(value).width + padX * 2 : 0;
    if (align === "center") x -= (lw + vw) / 2;
    if (align === "right") x -= lw + vw;
    ctx.fillStyle = A(alpha);
    ctx.fillRect(x, y - hgt, lw, hgt);
    ctx.fillStyle = ON(alpha);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + padX, y - hgt / 2 + 0.5 * s);
    if (value) {
      ctx.fillStyle = CARD(0.85 * alpha);
      ctx.fillRect(x + lw, y - hgt, vw, hgt);
      ctx.strokeStyle = A(alpha * 0.9);
      ctx.lineWidth = 1 * s;
      ctx.strokeRect(x + lw + 0.5, y - hgt + 0.5, vw - 1, hgt - 1);
      ctx.fillStyle = A(alpha);
      ctx.fillText(value, x + lw + padX, y - hgt / 2 + 0.5 * s);
    }
    ctx.letterSpacing = "0px";
    return lw + vw;
  }

  function blit(img, x, y, scale, rot, alpha) {
    if (alpha <= 0.005 || scale <= 0.01) return;
    const c = Math.cos(rot) * scale, sn = Math.sin(rot) * scale;
    ctx.setTransform(c, sn, -sn, c, x, y);
    ctx.globalAlpha = Math.min(1, alpha);
    const h = img.width / 2;
    ctx.drawImage(img, -h, -h);
  }

  const BLOBS = [
    { x: 0.16, y: 0.2, ax: 0.08, ay: 0.07, r: 0.5, p: 0.0 },
    { x: 0.86, y: 0.18, ax: 0.07, ay: 0.09, r: 0.46, p: 1.7 },
    { x: 0.8, y: 0.88, ax: 0.1, ay: 0.05, r: 0.52, p: 3.1 },
    { x: 0.2, y: 0.86, ax: 0.08, ay: 0.07, r: 0.44, p: 4.4 },
  ];

  function drawBackdrop(t) {
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, W, H);
    const fade = T.blobAlpha * (loop ? 1 : lerp(0.5, 1, easeOut(range(t, 0, 1.6))));
    const big = Math.max(W, H);
    BLOBS.forEach((b, i) => {
      const x = (b.x + Math.sin(t * w + b.p) * b.ax) * W;
      const y = (b.y + Math.cos(t * w + b.p * 1.3) * b.ay) * H;
      const r = b.r * big * (1 + 0.06 * Math.sin(t * w * 2 + b.p));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const { r: cr, g: cg, b: cb } = hexToRgb(i === 0 ? mixHex(T.blobs[0], cfg.accent, 0.12) : T.blobs[i]);
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${fade})`);
      g.addColorStop(0.6, `rgba(${cr},${cg},${cb},${fade * 0.35})`);
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.globalAlpha = loop ? 1 : easeOut(range(t, 0.1, 1.2));
    ctx.drawImage(tone, 0, 0);
    ctx.globalAlpha = 1;
  }

  function drawDrifters(t) {
    const fadeIn = loop ? 1 : range(t, 0.2, 1.4);
    for (const d of drifters) {
      const u = frac(d.x0 + (t / duration) * d.m * (loop ? 1 : 0.6));
      const x = (u * 1.2 - 0.1) * W;
      const y = (frac(d.y0 + u * 0.35) * 1.2 - 0.1) * H + Math.sin(t * w * 2 + d.p) * 30 * s;
      const edge = Math.min(range(u, 0, 0.08), 1 - range(u, 0.92, 1));
      blit(d.spr, x, y, d.sc, 0, d.a * fadeIn * edge);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  const drawOrder = Array.from({ length: N }, (_, i) => i).sort((a, b) => (role[a] === 3) - (role[b] === 3) || (role[a] === 1) - (role[b] === 1));

  function drawParticles(t) {
    const lift = loop ? 0 : easeOut(range(t, REVEAL_START + 0.6, duration));
    for (const i of drawOrder) {
      const q = basePos(i, t);
      let x = q.x, y = q.y, a = q.a, scale = chartSc[i] * q.k;
      if (!loop) {
        // the chart's points gather into the hero's tag, then burst out of it into the name
        const gk = easeInOut(range(t, MORPH_START + d2[i] * 0.25, MORPH_START + 0.45 + d2[i] * 0.25));
        if (gk > 0) {
          const hp = heroGather(t);
          const rr = Math.sqrt(fr[i]);
          const gx = hp.x + ox[i] * rr * hp.rx, gy = hp.y + oy[i] * rr * hp.ry;
          const arc = Math.sin(gk * Math.PI) * 50 * s;
          x = lerp(x, gx, gk) + ox[i] * arc;
          y = lerp(y, gy, gk) + oy[i] * arc;
          scale = lerp(scale, nameSc * 0.45, gk);
          a *= 1 - range(gk, 0.75, 1);
          const ek = easeOut(range(t, MORPH_START + 0.75 + d2[i] * 0.45, MORPH_START + 1.55 + d2[i] * 0.45));
          if (ek > 0) {
            // once the crisp name is in, the points drift off gently
            const fx = ox[i] * 110 * s + 30 * s * d2[i];
            const fy = oy[i] * 70 * s + 50 * s * fr[i];
            const txx = tx[i] + Math.sin(t * 2.2 + ph[i]) * 1.2 * s + fx * lift * (0.5 + d2[i]);
            const tyy = ty[i] + Math.cos(t * 1.9 + ph[i]) * 1.2 * s + fy * lift * (0.5 + d2[i]);
            x = lerp(x, txx, ek);
            y = lerp(y, tyy, ek);
            a = lerp(0, lerp(0.95, 0.3, lift), Math.min(1, ek * 3));
            scale = lerp(scale, nameSc, ek);
          }
        }
      }
      blit(spr[i], x, y, scale, 0, a);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  function drawHud(t, frame, alpha) {
    if (!cfg.hud || alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    brackets(inset, inset, W - inset * 2, H - inset * 2, 44 * s, L(0.55), 2.5);

    mono(portrait ? 19 : 18);
    ctx.letterSpacing = `${2.5 * s}px`;
    ctx.textBaseline = "top";
    const tx0 = inset + 34 * s, ty0 = inset + 30 * s;
    ctx.fillStyle = A(1);
    ctx.fillRect(tx0, ty0 + 4 * s, 11 * s, 11 * s);
    ctx.fillStyle = L(0.85);
    ctx.textAlign = "left";
    ctx.fillText(String(cfg.url || cfg.name).toUpperCase(), tx0 + 26 * s, ty0);

    ctx.textAlign = "right";
    const rx = W - inset - 34 * s;
    ctx.fillText(String(cfg.location).toUpperCase(), rx, ty0);

    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    const by0 = H - inset - 30 * s;
    ctx.fillStyle = L(0.4);
    ctx.fillText(loop ? "♡ ✿ ☆" : `T+${pad(t / 60, 2)}:${pad(t % 60, 2)}.${pad((t % 1) * 100, 2)}`, tx0, by0);
    ctx.textAlign = "right";
    ctx.fillText(`FRAME ${pad(frame, 4)}`, rx, by0);
    ctx.restore();
  }

  function crispName(alpha) {
    ctx.font = nameFont;
    ctx.letterSpacing = nameTracking;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = A(T.nameGlow);
    ctx.shadowBlur = T.nameGlow ? 40 * s : 0;
    ctx.fillStyle = L((0.97 / T.inkGain) * alpha);
    ctx.fontVariantCaps = "small-caps";
    ctx.fillText(name, W / 2, nameY);
    ctx.fontVariantCaps = "normal";
    ctx.shadowBlur = 0;
    ctx.letterSpacing = "0px";
  }

  // The name opens the clip, then fades away to the points it is made of.
  function drawOpening(t) {
    const a = easeOut(range(t, 0.05, 0.6)) * (1 - openFade(t));
    if (a <= 0.005) return;
    ctx.save();
    crispName(a);
    ctx.restore();
  }

  function drawReveal(tAbs) {
    const t = tAbs - REVEAL_START;
    if (t < -0.1) return;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const p = easeInOut(range(t, 0, 0.8));
    const left = W / 2 - nameW / 2 - 10 * s;
    const edge = left + (nameW + 20 * s) * p;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, edge, H);
    ctx.clip();
    crispName(1);
    ctx.restore();
    if (p > 0 && p < 1) {
      ctx.fillStyle = A(1);
      ctx.fillRect(edge, nameY - fs * 0.5, 3 * s, fs);
    }

    const roleY = nameY - fs * 0.78;
    const rp = range(t, 0.3, 1.1);
    if (rp > 0) {
      mono(portrait ? 20 : 19);
      ctx.letterSpacing = `${5 * s}px`;
      ctx.fillStyle = A(0.95);
      ctx.fillText(`[ ${scramble(String(cfg.role).toUpperCase(), rp, t, 3)} ]`, W / 2, roleY);
    }

    const tagY = nameY + fs * 0.72;
    const tp = range(t, 0.7, 2.0);
    if (tp > 0) {
      ctx.letterSpacing = "0px";
      // Shrink the tagline to fit the frame width so long taglines stay inside it.
      const maxTagW = W - inset * 2 - (portrait ? 130 : 100) * s;
      ctx.font = `400 100px ${SANS}`;
      const tagW = Math.max(1, ctx.measureText(String(cfg.tagline)).width);
      const tagFs = Math.min((portrait ? 34 : 32) * s, (maxTagW / tagW) * 100);
      ctx.font = `400 ${tagFs}px ${SANS}`;
      ctx.fillStyle = L(0.62);
      ctx.fillText(scramble(String(cfg.tagline), tp, t, 17), W / 2, tagY);
    }

    const bp = easeOut(range(t, 1.2, 2.0));
    if (bp > 0) {
      const padX = 56 * s;
      const fullW = Math.min(W - inset * 2 - (portrait ? 90 : 40) * s, Math.max(nameW, 700 * s) + padX * 2);
      const top = roleY - 44 * s, bottom = tagY + 44 * s;
      const bw = fullW * lerp(0.6, 1, bp), bh = (bottom - top) * lerp(0.6, 1, bp);
      const bx = W / 2 - bw / 2, by = (top + bottom) / 2 - bh / 2;
      brackets(bx, by, bw, bh, 22 * s, A(0.9 * bp), 2);
      const flick = t < 1.45 ? (hash(Math.floor(t * 40)) > 0.4 ? 1 : 0.2) : 1;
      tag(bx, by - 6 * s, "ALIGNED", "DATA → PLAN → SHIPPED", bp * flick);
      mono(11, 400);
      ctx.letterSpacing = `${1.5 * s}px`;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = L(0.45 * bp);
      ctx.fillText(String(cfg.url).toUpperCase(), bx + bw, by + bh + 8 * s);
    }
    ctx.restore();
  }

  // ---- humans + agents discussing the chart ----
  const peakTop = (b, t) => ({ x: barCx(b), y: plot.y1 - barH(b, t) * plot.h - g * 0.6 });
  const markerAt = (j, t) => ({ x: lineX(j / (NB - 1)), y: plot.y1 - lineV(j, t) * plot.h });
  const PEOPLE = [
    { name: "Leadership", agent: false, color: "#FF6F9C", at: (t) => peakTop(PEAK, t), from: [-0.1, -0.15], side: -1, up: true, say: [168, 96] },
    { name: "Analyst agent", agent: true, color: "#7C6CFF", at: (t) => markerAt(3, t), from: [-0.15, 0.7], side: 1, up: false, say: [150, 118] },
    { name: "Amy", agent: false, color: "#2FB98A", at: (t) => markerAt(NB - 1, t), from: [1.1, -0.1], side: 1, up: true, say: [142] },
    { name: "Planner agent", agent: true, color: "#F2A93B", at: (t) => peakTop(1, t), from: [1.15, 1.1], side: 1, up: true, say: [124, 72] },
  ];

  // Amy's pointer carries the insight to centre stage; the name expands out of her tag.
  const HERO = 2;
  const heroMove = (t) => (loop ? 0 : easeInOut(range(t, MORPH_START - 0.3, MORPH_START + 0.4)));
  const heroBurst = (t) => (loop ? 0 : range(t, MORPH_START + 0.72, MORPH_START + 1.05));

  function personXY(k, t) {
    const p = PEOPLE[k];
    const t0 = (loop ? 2.2 : 2.0 + OPEN) + k * 0.2;
    const arrive = loop ? 1 : easeInOut(range(t, t0, t0 + 0.65));
    const tg = p.at(t);
    const hx = floatX(t) + Math.sin(t * (loop ? w * 2 : 2.1) + k * 1.9) * (loop ? 26 : 5) * s;
    const hy = floatY(t) + Math.cos(t * (loop ? w * 3 : 1.7) + k * 2.3) * (loop ? 18 : 4) * s;
    const fx = p.from[0] * W, fy = p.from[1] * H;
    const bend = Math.sin(arrive * Math.PI) * 80 * s * (k % 2 ? 1 : -1);
    let x = lerp(fx, tg.x + hx, arrive) + bend * 0.4;
    let y = lerp(fy, tg.y + hy, arrive) + bend;
    if (k === HERO) {
      const mv = heroMove(t);
      x = lerp(x, W / 2 - 40 * s, mv);
      y = lerp(y, nameY + 20 * s, mv);
    }
    return { x, y, arrive, t0, fx, fy };
  }

  let heroTagW = 0;
  const heroGather = (t) => {
    if (!heroTagW) {
      ctx.font = `600 ${17 * s}px ${SANS}`;
      heroTagW = ctx.measureText(PEOPLE[HERO].name).width + 20 * s;
    }
    const q = personXY(HERO, t);
    return { x: q.x + 20 * s + heroTagW / 2, y: q.y - 26 * s, rx: heroTagW * 0.32, ry: 8 * s };
  };

  function cursorPath(x, y, k) {
    const pts = [[0, 0], [0, 23], [6, 17.5], [10.5, 27], [15, 25], [10.5, 15.5], [17.5, 15.5]];
    ctx.beginPath();
    pts.forEach(([px, py], j) => (j ? ctx.lineTo(x + px * k, y + py * k) : ctx.moveTo(x + px * k, y + py * k)));
    ctx.closePath();
  }

  // a loopy handwriting-like squiggle standing in for a line of chat
  function scribble(x, y, len, seed, prog) {
    const steps = Math.max(2, Math.round(len / (1.5 * s)));
    const n = Math.round(steps * prog);
    if (n < 1) return;
    ctx.beginPath();
    for (let j = 0; j <= n; j++) {
      const u = j / steps;
      const ph = u * len / (17 * s) * Math.PI * 2 + seed;
      const amp = (3.2 + 2.4 * Math.sin(u * 9.1 + seed * 2.1) * Math.sin(u * 4.3 + seed)) * s;
      const px = x + u * len - Math.sin(ph) * 4.5 * s;
      const py = y - Math.abs(Math.cos(ph * 0.5)) * amp * 1.6 + amp * 0.8 + Math.sin(u * 3.1 + seed) * 1.2 * s;
      j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  }

  function sparklePath(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x + r * 0.18, y - r * 0.18, x + r, y);
    ctx.quadraticCurveTo(x + r * 0.18, y + r * 0.18, x, y + r);
    ctx.quadraticCurveTo(x - r * 0.18, y + r * 0.18, x - r, y);
    ctx.quadraticCurveTo(x - r * 0.18, y - r * 0.18, x, y - r);
  }

  function drawPeople(t) {
    const othersOut = loop ? 0 : easeInOut(range(t, MORPH_START - 0.35, MORPH_START + 0.1));
    if (heroBurst(t) >= 1) return;
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    PEOPLE.forEach((p, k) => {
      const hero = k === HERO;
      const out = hero ? heroBurst(t) : othersOut;
      if (out >= 1) return;
      let { x, y, arrive, t0, fx, fy } = personXY(k, t);
      if (arrive <= 0) return;
      if (!hero) {
        x += (fx - x) * out * 0.25;
        y += (fy - y) * out * 0.25;
      }
      ctx.globalAlpha = 1 - out;

      const ck = 1.25 * s;
      ctx.shadowColor = "rgba(60,40,80,0.18)";
      ctx.shadowBlur = 8 * s;
      ctx.shadowOffsetY = 3 * s;
      cursorPath(x, y, ck);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = T.outline;
      ctx.lineWidth = 2.4 * s;
      ctx.stroke();

      // name tag + comment, stacked beside the pointer
      ctx.font = `600 ${17 * s}px ${SANS}`;
      const tagPad = 10 * s, icon = p.agent ? 18 * s : 0;
      const tagW = ctx.measureText(p.name).width + tagPad * 2 + icon, tagH = 28 * s;
      const showSay = loop ? null : p.say;
      const lineGap = 18 * s;
      const sayW = showSay ? Math.max(...showSay) * s + 32 * s : 0;
      const sayH = showSay ? 24 * s + lineGap * showSay.length : 0;
      const sayFade = k === HERO && !loop ? 1 - range(t, MORPH_START - 0.45, MORPH_START - 0.2) : 1;
      const boxW = Math.max(tagW, sayW), boxH = tagH + (showSay ? (sayH + 6 * s) * easeInOut(sayFade) : 0);
      let bx = p.side > 0 ? x + 20 * s : x - 8 * s - boxW;
      let by = p.up ? y - 12 * s - boxH : y + 34 * s;
      bx = clamp(bx, 16 * s, W - 16 * s - boxW);
      let pop = loop ? 1 : backOut(range(t, t0 + 0.5, t0 + 0.8));
      if (hero && !loop) {
        // the tag swells as the points pour in, then bursts open into the name
        const fill = range(t, MORPH_START, MORPH_START + 0.75);
        pop *= 1 + 0.18 * Math.sin(fill * Math.PI) + easeOut(out) * 1.8;
        ctx.globalAlpha = 1 - easeOut(out);
      }
      if (pop > 0) {
        ctx.save();
        ctx.translate(bx, by + (p.up ? boxH : 0));
        ctx.scale(pop, pop);
        ctx.translate(-bx, -(by + (p.up ? boxH : 0)));
        ctx.beginPath();
        ctx.roundRect(bx, by, tagW, tagH, 10 * s);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.lineWidth = 2 * s;
        ctx.stroke();
        if (p.agent) {
          sparklePath(bx + tagPad + 6 * s, by + tagH / 2, 7 * s);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        }
        ctx.font = `600 ${17 * s}px ${SANS}`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText(p.name, bx + tagPad + icon, by + tagH / 2 + 1 * s);
        if (showSay && sayFade > 0) {
          ctx.globalAlpha *= sayFade;
          const sy = by + tagH + 6 * s;
          const typed = range(t, t0 + 0.7, t0 + 1.2);
          ctx.beginPath();
          ctx.roundRect(bx, sy, sayW, sayH, 14 * s);
          ctx.fillStyle = CARD(0.96);
          ctx.fill();
          ctx.strokeStyle = T.outline;
          ctx.stroke();
          ctx.strokeStyle = L(0.55);
          ctx.lineWidth = 2.2 * s;
          const total = showSay.reduce((a2, b2) => a2 + b2, 0);
          let done = 0;
          showSay.forEach((len, li) => {
            const lp = clamp((typed * total - done) / len, 0, 1);
            done += len;
            scribble(bx + 16 * s, sy + 12 * s + lineGap * (li + 0.5), len * s, k * 3.7 + li * 1.3, lp);
          });
        }
        ctx.restore();
      }
    });
    ctx.restore();
  }

  function draw(t) {
    t = clamp(t, 0, duration);
    const frame = Math.round(t * fps);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.letterSpacing = "0px";
    ctx.setLineDash([]);

    drawBackdrop(t);
    drawDrifters(t);
    drawParticles(t);

    ctx.globalAlpha = 1;
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    drawPeople(t);

    if (!loop) {
      drawOpening(t);
      drawReveal(t);
    }
    drawHud(t, frame, loop ? 1 : easeOut(range(t, 0.6, 1.6)));

    ctx.globalAlpha = T.grain.alpha * (loop ? 0.55 : 1);
    ctx.globalCompositeOperation = T.grain.op;
    ctx.fillStyle = grain;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  return { draw, duration, fps, width: W, height: H, variant };
}
