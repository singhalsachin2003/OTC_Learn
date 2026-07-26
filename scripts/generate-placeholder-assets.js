/**
 * Generates placeholder app icon / splash / favicon PNGs for OTC Learn.
 * Pure Node — no native image deps. Encodes RGBA PNGs via zlib.
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
  // 10,11,12 = compression/filter/interlace = 0

  // Prefix each scanline with filter byte 0 (None).
  const raw = Buffer.alloc(height * (width * bpp + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * bpp + 1);
    raw[rowStart] = 0;
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

// ------------------------------------------------------------------- canvas
const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

function canvas(w, h, bg) {
  const buf = Buffer.alloc(w * h * 4);
  if (bg) {
    const [r, g, b] = hex(bg);
    for (let i = 0; i < w * h; i++) {
      buf[i * 4] = r;
      buf[i * 4 + 1] = g;
      buf[i * 4 + 2] = b;
      buf[i * 4 + 3] = 255;
    }
  }
  return buf;
}

function rect(buf, w, h, x0, y0, rw, rh, color) {
  const [r, g, b] = hex(color);
  for (let y = Math.max(0, y0); y < Math.min(h, y0 + rh); y++) {
    for (let x = Math.max(0, x0); x < Math.min(w, x0 + rw); x++) {
      const i = (y * w + x) * 4;
      buf[i] = r;
      buf[i + 1] = g;
      buf[i + 2] = b;
      buf[i + 3] = 255;
    }
  }
}

// --------------------------------------------------------------- letterforms
// 7 x 9 block glyphs, scaled up by an integer factor so edges stay crisp.
const GLYPHS = {
  O: ['.#####.', '##...##', '##...##', '##...##', '##...##', '##...##', '##...##', '##...##', '.#####.'],
  T: ['#######', '#######', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...'],
  C: ['.#####.', '##...##', '##.....', '##.....', '##.....', '##.....', '##.....', '##...##', '.#####.'],
};

const GLYPH_W = 7;
const GLYPH_H = 9;
const GAP = 2; // in glyph units

/** Draws "OTC" centred at (cx, cy) with the given unit scale. */
function drawWordmark(buf, w, h, cx, cy, scale, color) {
  const letters = ['O', 'T', 'C'];
  const totalUnits = letters.length * GLYPH_W + (letters.length - 1) * GAP;
  const startX = Math.round(cx - (totalUnits * scale) / 2);
  const startY = Math.round(cy - (GLYPH_H * scale) / 2);

  letters.forEach((ch, li) => {
    const ox = startX + li * (GLYPH_W + GAP) * scale;
    GLYPHS[ch].forEach((row, ry) => {
      for (let rx = 0; rx < GLYPH_W; rx++) {
        if (row[rx] === '#') {
          rect(buf, w, h, ox + rx * scale, startY + ry * scale, scale, scale, color);
        }
      }
    });
  });

  return { startX, startY, totalUnits };
}

/** The five asset-class accents, as an underline beneath the wordmark. */
const ACCENTS = ['#2A75BA', '#008856', '#B14D51', '#7E5DB1', '#996700'];

function drawAccentBar(buf, w, h, cx, y, barW, barH) {
  const seg = Math.floor(barW / ACCENTS.length);
  const x0 = Math.round(cx - (seg * ACCENTS.length) / 2);
  ACCENTS.forEach((c, i) => rect(buf, w, h, x0 + i * seg, y, seg, barH, c));
}

// ------------------------------------------------------------------ outputs
const DARK = '#181611';
const CREAM = '#FAF8F2';
const BG = '#EAE8E0';
const outDir = '/Users/sachin/otc-learning-app/assets';
fs.mkdirSync(outDir, { recursive: true });

function write(name, w, h, buf, alpha = true) {
  const p = path.join(outDir, name);
  fs.writeFileSync(p, encodePNG(w, h, buf, alpha));
  console.log(`${name.padEnd(20)} ${w}x${h}  ${(fs.statSync(p).size / 1024).toFixed(1)} kB`);
}

// icon.png — 1024x1024, fully opaque (iOS rejects alpha in the store icon).
{
  const w = 1024, h = 1024;
  const buf = canvas(w, h, DARK);
  const scale = 22; // 25 units * 22 = 550px wide wordmark
  drawWordmark(buf, w, h, w / 2, h / 2 - 40, scale, CREAM);
  drawAccentBar(buf, w, h, w / 2, h / 2 + 130, 550, 26);
  write('icon.png', w, h, buf, false);
}

// adaptive-icon.png — 1024x1024 foreground, transparent, art inside the
// centre 66% safe zone that Android's mask is guaranteed not to clip.
{
  const w = 1024, h = 1024;
  const buf = canvas(w, h, null); // transparent
  const scale = 16; // 25 units * 16 = 400px, well inside the 676px safe zone
  drawWordmark(buf, w, h, w / 2, h / 2 - 30, scale, CREAM);
  drawAccentBar(buf, w, h, w / 2, h / 2 + 95, 400, 20);
  write('adaptive-icon.png', w, h, buf);
}

// splash.png — portrait, brand background, centred mark.
{
  const w = 1284, h = 2778;
  const buf = canvas(w, h, BG);
  const scale = 20;
  drawWordmark(buf, w, h, w / 2, h / 2 - 30, scale, DARK);
  drawAccentBar(buf, w, h, w / 2, h / 2 + 120, 500, 24);
  write('splash.png', w, h, buf, false);
}

// favicon.png — 48x48 for the web build.
{
  const w = 48, h = 48;
  const buf = canvas(w, h, DARK);
  drawWordmark(buf, w, h, w / 2, h / 2 - 2, 1, CREAM);
  drawAccentBar(buf, w, h, w / 2, h - 10, 25, 4);
  write('favicon.png', w, h, buf);
}
