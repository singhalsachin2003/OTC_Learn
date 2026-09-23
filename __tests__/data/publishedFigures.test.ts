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

/**
 * The third assertion tracks the free product count, which is the number most
 * likely to drift and the one the other two sentences do not carry. It used to
 * match the release notes, which recited the catalogue; those were rewritten to
 * describe the update instead, so it now matches the full description's own
 * account of what a subscription adds to the free products. Anchor it to prose
 * that earns its place, not to whichever sentence happens to hold a number.
 */
it('quotes the real figures in the store listing', () => {
  const listing = read('STORE_LISTING.md');
  expect(listing).toContain(FREE_SENTENCE);
  expect(listing).toContain(PAID_SENTENCE);
  expect(listing).toContain(`${free.products} free products`);
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

/**
 * Depth is the paid half of a free product, so the site may name it and must
 * not print it. This is the same guard as the teaser test above, applied to the
 * other way content can become paid.
 */
it('never publishes the body of a paid depth section', () => {
  const withDepth = products.filter((product) => product.depth !== undefined);
  expect(withDepth.length).toBeGreaterThan(0);

  for (const product of withDepth) {
    const page = read(`docs/product/${product.id}.md`);
    for (const section of product.depth!.sections) {
      // The titles are named as a list of what a subscription adds.
      expect(page).toContain(section.title);
      expect(page).not.toContain(section.content);
      if (section.callout !== undefined) {
        expect(page).not.toContain(section.callout);
      }
    }
  }
});

/**
 * Structured data is only worth having if it describes what is on the page, so
 * these read it back off the generated pages rather than trusting the
 * generator. Each product page carries a `TechArticle`, its key terms as a
 * `DefinedTermSet` and a `BreadcrumbList`; each category page a `CollectionPage`
 * and a `BreadcrumbList`.
 */
function structuredData(file: string): Record<string, unknown>[] {
  const blocks = [
    ...read(file).matchAll(
      /<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/g,
    ),
  ];
  return blocks.flatMap((match) => {
    const parsed: unknown = JSON.parse(match[1]);
    return (Array.isArray(parsed) ? parsed : [parsed]) as Record<string, unknown>[];
  });
}

it('carries valid structured data on every published page', () => {
  for (const product of products) {
    const types = structuredData(`docs/product/${product.id}.md`).map(
      (b) => b['@type'],
    );
    expect(types).toEqual(['TechArticle', 'DefinedTermSet', 'BreadcrumbList']);
  }
  for (const category of categories) {
    const types = structuredData(`docs/category/${category.id}.md`).map(
      (b) => b['@type'],
    );
    expect(types).toEqual(['CollectionPage', 'BreadcrumbList']);
  }
});

/**
 * The same rule as the teaser test above, applied to the half of the page a
 * reader cannot see. Describing paid content in JSON-LD would publish it just
 * as surely as printing it, and Google treats markup that does not match the
 * visible page as a manual-action matter rather than an oversight.
 */
it('never describes paid content in structured data', () => {
  const paidProducts = products.filter((p) => paidIds.has(p.categoryId));
  expect(paidProducts.length).toBeGreaterThan(0);

  for (const product of paidProducts) {
    const serialised = JSON.stringify(
      structuredData(`docs/product/${product.id}.md`),
    );
    for (const lesson of product.lessons) {
      expect(serialised).not.toContain(lesson.content);
    }
    for (const line of product.example.lines) {
      expect(serialised).not.toContain(line);
    }
  }

  for (const product of products.filter((p) => p.depth !== undefined)) {
    const serialised = JSON.stringify(
      structuredData(`docs/product/${product.id}.md`),
    );
    for (const section of product.depth!.sections) {
      expect(serialised).not.toContain(section.content);
    }
  }
});

/** What it does describe has to be on the page, so it is read from the page. */
it('describes the key terms the page actually prints', () => {
  for (const product of products) {
    const page = read(`docs/product/${product.id}.md`);
    const terms = structuredData(`docs/product/${product.id}.md`).find(
      (b) => b['@type'] === 'DefinedTermSet',
    ) as { hasDefinedTerm: { name: string; description: string }[] };

    expect(terms.hasDefinedTerm).toHaveLength(product.keyTerms.length);
    for (const term of terms.hasDefinedTerm) {
      expect(page).toContain(term.name);
      expect(page).toContain(term.description);
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
