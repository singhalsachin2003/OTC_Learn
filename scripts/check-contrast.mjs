/**
 * Walks the app in both themes and reports any text whose contrast against its
 * own background falls below WCAG AA.
 *
 * Dark mode is why this exists. A palette can be derived carefully — every
 * token in `theme/colors.ts` carries the ratio it was checked at — and still
 * come out wrong on screen, because what a reader sees is the composite of a
 * colour, its opacity, and whatever stack of translucent surfaces sits behind
 * it. Only a browser knows that. This asks one.
 *
 *   npx expo export --platform web --output-dir .expo-web
 *   npm run check:contrast
 *
 * Deliberately not part of `npm run verify`: it needs a web export, which takes
 * about a minute, and the gate is meant to stay fast. Run it after touching the
 * palette, the type scale, or any screen's colours.
 *
 * Navigation is Redux state rather than a URL, so screens are reached by
 * clicking through the app the way a reader would. Clicks are dispatched at
 * coordinates rather than through element handles: React Native Web renders a
 * `Pressable` as a plain div with no role, and a synthetic element click does
 * not reliably fire its press handler.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB_DIR = process.env.WEB_DIR
  ? resolve(process.env.WEB_DIR)
  : join(ROOT, '.expo-web');
const SHOT_DIR = process.env.SHOT_DIR ? resolve(process.env.SHOT_DIR) : null;
const PORT = 8802;

if (!existsSync(WEB_DIR)) {
  console.error(
    `No web export at ${WEB_DIR}\n` +
      `Run:  npx expo export --platform web --output-dir ${WEB_DIR}`,
  );
  process.exit(1);
}

/**
 * Known, and not a regression — every entry is a *light* palette value that
 * shipped before dark mode existed. The dark counterparts were derived against
 * all three dark grounds and clear AA, so this list exists to stop the light
 * inheritance from masking a new dark failure, not to bless it.
 *
 *  - `#A19E98` (chevron) draws the "›" on every row at 2.18:1. It is an
 *    affordance rather than prose, so 3:1 is the applicable bar — and it misses
 *    that too. The dark chevron was set at 5.0:1 on a card.
 *  - `#2A75BA` and its siblings are `categoryColors.<id>.accent` used as small
 *    text. `colors.ts` already documents this exact mistake and already carries
 *    a `.text` variant for it; these are the call sites that never moved over.
 *  - `#696761` (text.tertiary) reaches 4.45:1 on `track` — the one surface the
 *    original check did not include, and a 0.05 miss.
 *  - `#CECAC0` (line.strong) is the week strip's future-day initials, faded on
 *    purpose so a Monday does not open the week reporting six failures.
 *
 * See ACTION-ITEMS.md: raising any of them changes the shipped light theme, so
 * they are a decision rather than a fix to be made in passing.
 */
const EXPECTED_LIGHT = [
  'rgb(161, 158, 152)',
  'rgb(206, 202, 192)',
  'rgb(105, 103, 97)',
  'rgb(42, 117, 186)',
  'rgb(0, 136, 86)',
  'rgb(177, 77, 81)',
  'rgb(126, 93, 177)',
  'rgb(153, 103, 0)',
  'rgb(162, 80, 137)',
  'rgb(0, 134, 149)',
  'rgb(104, 124, 2)',
  'rgb(174, 85, 40)',
];

/** The dark counterpart: the faded week-strip initials, and nothing else. */
const EXPECTED_DARK = ['rgb(80, 77, 69)'];

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = join(WEB_DIR, path);
  if (!existsSync(file) || statSync(file).isDirectory())
    file = join(WEB_DIR, 'index.html');
  res.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

/**
 * Runs in the page. For every element owning a text node: resolve its colour
 * and the background actually behind it — compositing every translucent layer
 * up the tree onto white — and compare. AA is 4.5:1, or 3:1 for large text.
 */
const MEASURE = `(() => {
  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const WHITE = { r: 255, g: 255, b: 255, a: 1 };
  const bgOf = (el) => {
    let acc = null;
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (!c || c.a === 0) continue;
      acc = acc ? over(acc, c) : c;
      if (c.a >= 1) return acc;
    }
    return acc ? over(acc, WHITE) : WHITE;
  };
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.15) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const declared = parse(st.color);
    if (!declared) continue;
    const bg = bgOf(el);
    const fg = over({ ...declared, a: declared.a * parseFloat(st.opacity || '1') }, bg);
    const ratio = (Math.max(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05)
                / (Math.min(lum(fg.r, fg.g, fg.b), lum(bg.r, bg.g, bg.b)) + 0.05);
    const size = parseFloat(st.fontSize);
    const large = size >= 24 || (size >= 18.66 && parseInt(st.fontWeight, 10) >= 600);
    if (ratio < (large ? 3 : 4.5)) {
      out.push({
        text: el.textContent.trim().slice(0, 40),
        ratio: +ratio.toFixed(2),
        size,
        color: st.color,
        bg: 'rgb(' + [bg.r, bg.g, bg.b].map(Math.round).join(', ') + ')',
      });
    }
  }
  return out;
})()`;

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
if (SHOT_DIR) mkdirSync(SHOT_DIR, { recursive: true });
let unexpected = 0;
let accepted = 0;

for (const theme of ['light', 'dark']) {
  const expected = theme === 'light' ? EXPECTED_LIGHT : EXPECTED_DARK;
  const ctx = await browser.newContext({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  /** Click an element by its testID — for controls whose label is content. */
  const tapId = async (id) => {
    const box = await page.evaluate((testId) => {
      const el = document.querySelector(`[data-testid="${testId}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
    }, id);
    if (!box) return false;
    await page.mouse.click(box.x, box.y);
    await page.waitForTimeout(900);
    return true;
  };

  /** Click the smallest visible element whose text matches, scrolling to find it. */
  const tap = async (pattern) => {
    const find = () =>
      page.evaluate((src) => {
        const re = new RegExp(src);
        let best = null;
        for (const el of document.querySelectorAll('div,span,a')) {
          if (!re.test((el.innerText || '').trim())) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 10 || r.height < 10 || r.bottom < 0 || r.top > innerHeight)
            continue;
          const area = r.width * r.height;
          if (!best || area < best.area)
            best = { x: r.x + r.width / 2, y: r.y + r.height / 2, area };
        }
        return best;
      }, pattern);

    let box = await find();
    for (let i = 0; i < 8 && !box; i++) {
      // The wheel goes to whatever is under the pointer, and after a tap the
      // pointer is usually still on the tab bar.
      await page.mouse.move(210, 450);
      await page.mouse.wheel(0, 420);
      await page.waitForTimeout(250);
      box = await find();
    }
    if (!box) throw new Error(`nothing matching /${pattern}/ to tap`);
    await page.mouse.click(box.x, box.y);
    await page.waitForTimeout(900);
  };

  // `app.currentScreen` is Redux state and is not persisted, so a reload is the
  // way back to Home from a screen that hides the tab bar.
  const home = async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2200);
  };

  const check = async (name) => {
    if (SHOT_DIR)
      await page.screenshot({ path: join(SHOT_DIR, `${theme}-${name}.png`) });
    const found = await page.evaluate(MEASURE);
    const bad = found.filter((f) => !expected.includes(f.color));
    accepted += found.length - bad.length;
    if (!bad.length) {
      console.log(`${theme}/${name}: ok`);
      return;
    }
    unexpected += bad.length;
    console.log(`${theme}/${name}: ${bad.length} below AA`);
    for (const b of bad.slice(0, 10)) {
      console.log(
        `   ${b.ratio}:1  ${b.size}px  ${b.color} on ${b.bg}   "${b.text}"`,
      );
    }
  };

  const step = async (name, run) => {
    try {
      await run();
      await check(name);
    } catch (error) {
      unexpected += 1;
      console.log(`${theme}/${name}: could not be reached — ${error.message}`);
    }
  };

  await check('home');
  await step('category', () => tap('^Interest Rate$'));
  await step('product', () => tap('^Interest Rate Swap$'));
  await step('lesson', () => tap('^Start the lesson$'));
  await step('lesson-end', async () => {
    for (let i = 0; i < 8; i++) {
      try {
        await tap('^(Next|Continue)$');
      } catch {
        break;
      }
    }
  });
  await step('quiz', async () => {
    await home();
    await tap('^Interest Rate Swap$');
    await tap('^Go straight to the quiz');
  });
  // A sitting draws its paper at random, so the first question may be either
  // kind. Both are answered by testID rather than by label, because a choice
  // option's label is the content itself.
  await step('quiz-feedback', async () => {
    if (await tapId('quiz-answer-true')) return;
    if (await tapId('quiz-option-0')) return;
    throw new Error('neither a boolean nor a choice question was on screen');
  });
  await home();
  for (const [label, name] of [
    ['^Products$', 'products'],
    ['^Review$', 'review'],
    ['^Profile$', 'profile'],
  ]) {
    await step(name, () => tap(label));
  }
  for (const [label, name] of [
    ['^Glossary$', 'glossary'],
    ['^Insights$', 'insights'],
    ['^Notes$', 'notes'],
    ['^Practice exam$', 'exam'],
    ['^Achievements$', 'achievements'],
    ['^Account$', 'account'],
    ['^Subscription$', 'paywall'],
  ]) {
    await step(name, async () => {
      await tap('^Profile$');
      await tap(label);
    });
  }
  await ctx.close();
}

await browser.close();
server.close();

console.log(`\n${accepted} known-and-accepted, ${unexpected} unexpected`);
if (unexpected) {
  console.error('Text below WCAG AA that is not on the accepted list.');
  process.exit(1);
}
