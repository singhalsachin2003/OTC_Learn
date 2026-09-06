/// <reference types="node" />
// `tsconfig.json` lists only the jest and react-native type packages, so that
// app code cannot reach for a Node API by accident. This file genuinely needs
// one — it reads the published prose off disk — and opts itself in rather than
// widening the setting for `src/`.
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { categories } from '../../src/data/categories';
import { products } from '../../src/data/products';

/**
 * The catalogue's size is quoted in prose in two places that are read by people
 * deciding whether to install: the README, which is a discovery surface in its
 * own right after a launch post, and the store listing copy. Both were wrong
 * for three waves of content — the README still said 100 lesson steps when
 * there were 180 — because nothing connects a number in a sentence to the data
 * it describes. This does.
 */
const totals = {
  products: products.length,
  categories: categories.length,
  lessons: products.reduce((n, p) => n + p.lessons.length, 0),
  keyTerms: products.reduce((n, p) => n + p.keyTerms.length, 0),
  questions: products.reduce((n, p) => n + p.quiz.length, 0),
};

function read(name: string): string {
  return readFileSync(join(__dirname, '..', '..', name), 'utf8');
}

const SENTENCE = `${totals.lessons} lesson steps, ${totals.keyTerms} key terms and ${totals.questions}`;

it('quotes the real figures in the README', () => {
  expect(read('README.md')).toContain(SENTENCE);
});

it('quotes the real figures in the store listing', () => {
  const listing = read('STORE_LISTING.md');
  expect(listing).toContain(SENTENCE);
  expect(listing).toContain(`${totals.products} OTC derivative products`);
});

/**
 * `app.json` claims `/OTC_Learn/product/…` and `/OTC_Learn/category/…` as
 * verified App Links, so a product added without re-running
 * `scripts/generate-site.js` is a claimed address that 404s for everyone who
 * does not have the app — the one failure mode the claim itself creates.
 */
it('publishes a page for every address the app claims', () => {
  const missing = [
    ...products.map((p) => `docs/product/${p.id}.md`),
    ...categories.map((c) => `docs/category/${c.id}.md`),
  ].filter((file) => !existsSync(join(__dirname, '..', '..', file)));

  expect(missing).toEqual([]);
});

// The site index says the figure in words, which no script generates. It is
// pinned here so a seventh asset class cannot leave "thirty-six" behind.
it('states the size of the catalogue on the site', () => {
  expect(totals.products).toBe(36);
  expect(read('docs/index.md')).toContain('thirty-six products');
});
