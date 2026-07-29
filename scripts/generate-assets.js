/**
 * Generates the OTC Learn app icon, adaptive icon, splash, favicon and Play
 * feature graphic. Pure Node — no native image dependencies. PNGs are encoded
 * with zlib.
 *
 * The mark is the "OTC" wordmark drawn from geometry rather than from a bitmap
 * font: O is a ring, T is two bars, C is a ring with a wedge removed. Every
 * shape is tested analytically per sub-sample and the result is downsampled, so
 * curves come out smooth at any size instead of stair-stepping the way scaled
 * block glyphs do.
 *
 *   node scripts/generate-assets.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------------------------------------------------------------- PNG encoder
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/**
 * `alpha: false` emits colour type 2 (RGB, no alpha channel). The iOS store
 * icon must have no alpha at all — App Store Connect rejects it even when the
 * channel is fully opaque. Android's adaptive foreground needs the opposite.
 */
function encodePNG(width, height, rgba, alpha = true) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const bpp = alpha ? 4 : 3;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = alpha ? 6 : 2; // colour type: RGBA or RGB

  const raw = Buffer.alloc(height * (width * bpp + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * bpp + 1);
    raw[rowStart] = 0; // filter: None
    if (alpha) {
      rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
    } else {
      for (let x = 0; x < width; x++) {
        const src = (y * width + x) * 4;
        const dst = rowStart + 1 + x * 3;
        raw[dst] = rgba[src];
        raw[dst + 1] = rgba[src + 1];
        raw[dst + 2] = rgba[src + 2];
      }
    }
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --------------------------------------------------------------- palette
const DARK = '#181611';
const CREAM = '#FAF8F2';
const LIGHT = '#EAE8E0';
/** The five asset-class accents, in catalogue order. */
const ACCENTS = ['#2A75BA', '#008856', '#B14D51', '#7E5DB1', '#996700'];

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

// ------------------------------------------------------------------- shapes
// Each shape is a predicate over a point. Composing predicates rather than
// painting pixels is what lets the renderer anti-alias anything uniformly.

const circle = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

const rect = (x0, y0, w, h) => (x, y) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h;

const ring = (cx, cy, rOuter, rInner) => {
  const outer = circle(cx, cy, rOuter);
  const inner = circle(cx, cy, rInner);
  return (x, y) => outer(x, y) && !inner(x, y);
};

/** Ring with an angular wedge removed, opening towards `openDeg`. */
const arc = (cx, cy, rOuter, rInner, openDeg, spanDeg) => {
  const band = ring(cx, cy, rOuter, rInner);
  const half = (spanDeg * Math.PI) / 360;
  const open = (openDeg * Math.PI) / 180;
  return (x, y) => {
    if (!band(x, y)) return false;
    let d = Math.atan2(y - cy, x - cx) - open;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return Math.abs(d) > half;
  };
};

const union =
  (...shapes) =>
  (x, y) =>
    shapes.some((s) => s(x, y));

// --------------------------------------------------------------- wordmark
/**
 * "OTC" laid out on a baseline, centred at (cx, cy), `capHeight` tall.
 * Returns the shape plus the width it occupied, so callers can place an
 * underline without re-deriving the metrics.
 */
function wordmark(cx, cy, capHeight) {
  const r = capHeight / 2; // outer radius of O and C
  const stroke = capHeight * 0.19; // consistent stem weight across all three
  const rInner = r - stroke;
  const gap = capHeight * 0.2;

  // T is narrower than the round letters; its arm sets its advance width.
  const tWidth = capHeight * 0.62;
  const advance = [2 * r, tWidth, 2 * r];
  const total = advance.reduce((a, b) => a + b, 0) + 2 * gap;

  let x = cx - total / 2;

  const oCx = x + r;
  const o = ring(oCx, cy, r, rInner);
  x += advance[0] + gap;

  const tCx = x + tWidth / 2;
  const t = union(
    rect(x, cy - r, tWidth, stroke), // arm
    rect(tCx - stroke / 2, cy - r, stroke, 2 * r), // stem
  );
  x += advance[1] + gap;

  const cCx = x + r;
  // Opening towards 0° (right), the conventional terminal for a C.
  const c = arc(cCx, cy, r, rInner, 0, 78);

  return { shape: union(o, t, c), width: total, left: cx - total / 2 };
}

// -------------------------------------------------------------- renderer
const SS = 4; // sub-samples per axis; 16 coverage levels per pixel

/**
 * Renders layers onto a canvas with supersampled coverage.
 * Each layer is `{ shape, color }`, painted in order. A null background leaves
 * uncovered pixels fully transparent.
 */
function render(width, height, background, layers) {
  const buf = Buffer.alloc(width * height * 4);
  const bg = background === null ? null : hex(background);
  const cols = layers.map((l) => hex(l.color));
  const step = 1 / SS;
  const offset = step / 2;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Accumulate coverage per layer over the sub-sample grid.
      const cover = new Array(layers.length).fill(0);
      for (let sy = 0; sy < SS; sy++) {
        const y = py + sy * step + offset;
        for (let sx = 0; sx < SS; sx++) {
          const x = px + sx * step + offset;
          for (let li = 0; li < layers.length; li++) {
            if (layers[li].shape(x, y)) cover[li] += 1;
          }
        }
      }

      const total = SS * SS;
      let r = bg ? bg[0] : 0;
      let g = bg ? bg[1] : 0;
      let b = bg ? bg[2] : 0;
      let a = bg ? 1 : 0;

      for (let li = 0; li < layers.length; li++) {
        const cv = cover[li] / total;
        if (cv === 0) continue;
        const [lr, lg, lb] = cols[li];
        // Source-over compositing in straight (non-premultiplied) alpha.
        const outA = cv + a * (1 - cv);
        r = (lr * cv + r * a * (1 - cv)) / outA;
        g = (lg * cv + g * a * (1 - cv)) / outA;
        b = (lb * cv + b * a * (1 - cv)) / outA;
        a = outA;
      }

      const i = (py * width + px) * 4;
      buf[i] = Math.round(r);
      buf[i + 1] = Math.round(g);
      buf[i + 2] = Math.round(b);
      buf[i + 3] = Math.round(a * 255);
    }
  }

  return buf;
}

/** The five accents as a segmented underline. */
function accentBar(cx, y, width, height) {
  const seg = width / ACCENTS.length;
  const x0 = cx - width / 2;
  return ACCENTS.map((color, i) => ({
    shape: rect(x0 + i * seg, y, seg, height),
    color,
  }));
}

// ------------------------------------------------------------------ outputs
const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

function write(name, w, h, buf, alpha = true) {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, encodePNG(w, h, buf, alpha));
  console.log(
    `${name.padEnd(22)} ${String(w).padStart(4)}x${String(h).padEnd(4)}  ` +
      `${alpha ? 'RGBA' : 'RGB '}  ${(fs.statSync(p).size / 1024).toFixed(1)} kB`,
  );
}

/**
 * Wordmark over the accent bar, the arrangement shared by every output.
 *
 * `cx, cy` is the centre of the whole lockup, not of the wordmark — the bar
 * hangs below the baseline, so centring the wordmark alone leaves the group
 * sitting visibly high.
 */
function lockup(cx, cy, capHeight, color) {
  const barGap = capHeight * 0.28;
  const barHeight = capHeight * 0.11;
  const groupHeight = capHeight + barGap + barHeight;

  const markCy = cy - groupHeight / 2 + capHeight / 2;
  const mark = wordmark(cx, markCy, capHeight);
  const barY = markCy + capHeight / 2 + barGap;

  return [
    { shape: mark.shape, color },
    ...accentBar(cx, barY, mark.width, barHeight),
  ];
}

/**
 * Cap height that makes the lockup `fraction` of the canvas width.
 * The wordmark is about 3.0 cap heights wide, so solving for it keeps every
 * output at a deliberate margin rather than a hand-tuned guess.
 */
const capFor = (width, fraction) => (width * fraction) / 3.02;

// icon.png — 1024x1024, no alpha. Launchers mask this to a circle or squircle,
// so the lockup takes 60% of the width and the corners stay expendable.
{
  const w = 1024;
  const h = 1024;
  write('icon.png', w, h, render(w, h, DARK, lockup(w / 2, h / 2, capFor(w, 0.6), CREAM)), false);
}

// icon-play-512.png — the Play store listing icon, which is a separate upload
// from the launcher icon compiled into the app. Play requires exactly 512x512.
{
  const w = 512;
  const h = 512;
  write('icon-play-512.png', w, h, render(w, h, DARK, lockup(w / 2, h / 2, capFor(w, 0.6), CREAM)));
}

// adaptive-icon.png — foreground only, transparent, art inside the centre 66%
// safe zone. Android composites this over adaptiveIcon.backgroundColor and can
// crop anything outside that zone, so this is drawn smaller than icon.png.
{
  const w = 1024;
  const h = 1024;
  write('adaptive-icon.png', w, h, render(w, h, null, lockup(w / 2, h / 2, capFor(w, 0.45), CREAM)));
}

// splash.png — shown on #EAE8E0 (see the expo-splash-screen plugin config), so
// the mark is drawn dark rather than cream.
{
  const w = 1284;
  const h = 2778;
  write('splash.png', w, h, render(w, h, LIGHT, lockup(w / 2, h / 2, capFor(w, 0.55), DARK)), false);
}

// favicon.png — 48x48 web build. Far too small for the accent bar to read, so
// the wordmark goes in on its own.
{
  const w = 48;
  const h = 48;
  const mark = wordmark(w / 2, h / 2, capFor(w, 0.78));
  write('favicon.png', w, h, render(w, h, DARK, [{ shape: mark.shape, color: CREAM }]));
}

// feature-graphic.png — 1024x500, required by Play for the store listing. Play
// crops and overlays this at several sizes, so the lockup stays central and
// small enough that nothing important sits near an edge.
{
  const w = 1024;
  const h = 500;
  write(
    'feature-graphic.png',
    w,
    h,
    render(w, h, DARK, lockup(w / 2, h / 2, capFor(w, 0.42), CREAM)),
    false,
  );
}
