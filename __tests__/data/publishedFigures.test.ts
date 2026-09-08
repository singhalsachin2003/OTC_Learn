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
 *
 * Since Exotics there are two numbers to keep true rather than one, and the
 * split is the part that matters: the free figures are a promise to the people
 * who already installed the app, and the paid figures are what a subscription
 * actually adds. Quoting the combined total on its own would read as though all
 * of it were free, which is the misstatement the store listing cannot make.
 */
function figures(of: typeof products) {
  return {
    products: of.length,
    lessons: of.reduce((n, p) => n + p.lessons.length, 0),
    keyTerms: of.reduce((n, p) => n + p.keyTerms.length, 0),
    questions: of.reduce((n, p) => n + p.quiz.length, 0),
  };
}

const paidIds = new Set(
  categories.filter((category) => category.premium).map((category) => category.id),
);
const free = figures(products.filter((p) => !paidIds.has(p.categoryId)));
const paid = figures(products.filter((p) => paidIds.has(p.categoryId)));

function read(name: string): string {
  return readFileSync(join(__dirname, '..', '..', name), 'utf8');
}

/** What the free catalogue holds — unchanged since v1.1, and meant to stay so. */
const FREE_SENTENCE = `${free.lessons} lesson steps, ${free.keyTerms} key terms and ${free.questions}`;
/** What the subscription adds on top of it. */
const PAID_SENTENCE = `${paid.products} products, ${paid.lessons} lesson steps and ${paid.questions} questions`;

it('quotes the real figures in the README', () => {
  const readme = read('README.md');
  expect(readme).toContain(FREE_SENTENCE);
  expect(readme).toContain(PAID_SENTENCE);
});

it('quotes the real figures in the store listing', () => {
  const listing = read('STORE_LISTING.md');
  expect(listing).toContain(FREE_SENTENCE);
  expect(listing).toContain(PAID_SENTENCE);
  expect(listing).toContain(`${free.products} OTC derivative products`);
});

/**
 * `app.json` claims `/OTC_Learn/product/…` and `/OTC_Learn/category/…` as
 * verified App Links, so a product added without re-running
 * `scripts/generate-site.js` is a claimed address that 404s for everyone who
 * does not have the app — the one failure mode the claim itself creates. Paid
 * products are claimed too; they publish a teaser rather than the lesson.
 */
it('publishes a page for every address the app claims', () => {
  const missing = [
    ...products.map((p) => `docs/product/${p.id}.md`),
    ...categories.map((c) => `docs/category/${c.id}.md`),
  ].filter((file) => !existsSync(join(__dirname, '..', '..', file)));

  expect(missing).toEqual([]);
});

/**
 * The lesson body of a paid product must not be on the public site: publishing
 * it would hand the subscription's content to anyone with the link. The teaser
 * carries the summary, the step titles and the key terms, and stops there.
 */
it('publishes only a teaser for paid products', () => {
  const paidProducts = products.filter((p) => paidIds.has(p.categoryId));
  expect(paidProducts.length).toBeGreaterThan(0);

  for (const product of paidProducts) {
    const page = read(`docs/product/${product.id}.md`);
    expect(page).toContain(product.summary);
    for (const lesson of product.lessons) {
      expect(page).toContain(lesson.title);
      expect(page).not.toContain(lesson.content);
    }
    for (const line of product.example.lines) {
      expect(page).not.toContain(line);
    }
  }
});

/** And the free ones must still publish in full, which is what ranks. */
it('publishes free products in full', () => {
  const product = products.find((p) => !paidIds.has(p.categoryId));
  const page = read(`docs/product/${product!.id}.md`);
  for (const lesson of product!.lessons) {
    expect(page).toContain(lesson.content);
  }
});

// The site index says the figure in words, which no script generates. It is
// pinned here so a further asset class cannot leave "thirty-six" behind.
it('states the size of the free catalogue on the site', () => {
  expect(free.products).toBe(36);
  expect(read('docs/index.md')).toContain('thirty-six products');
});
