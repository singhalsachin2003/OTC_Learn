/**
 * Generates the public pages under `docs/` from the catalogue: one page per
 * product and one per asset class.
 *
 *   node scripts/generate-site.js
 *
 * These pages exist because of Android App Links. `app.json` claims
 * `/OTC_Learn/category/…` and `/OTC_Learn/product/…` with `autoVerify`, so a
 * link posted anywhere opens the app for someone who has it — and has to open
 * something real for everyone else. A claimed address that 404s is worse than
 * no link at all, so these are generated from the same catalogue the app reads
 * rather than written by hand, and regenerating is how they stay true.
 *
 * For a free asset class the lesson text and worked example are published in
 * full and the question bank is not: the content is free in the app, and a page
 * that only teased it would rank for nothing. The quiz is the part you open the
 * app for.
 *
 * A premium asset class gets a teaser instead — summary, the lesson's step
 * titles and the key terms, which are the part the app leaves open in its
 * glossary anyway. Publishing its lesson body in full would hand the paid
 * content to anyone with the link and leave the subscription selling the quiz
 * alone. The page still exists, because `app.json` claims the address either
 * way and a claimed address that 404s is the failure this script exists to
 * prevent.
 *
 * The catalogue is TypeScript, so it is compiled to a scratch directory first —
 * the data modules are pure and import nothing but types, which is what makes
 * that safe.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

function loadCatalogue() {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'otc-site-'));
  execFileSync(
    'npx',
    [
      'tsc',
      'src/data/products.ts',
      'src/data/categories.ts',
      '--ignoreConfig',
      '--outDir',
      out,
      '--module',
      'commonjs',
      '--target',
      'es2020',
      '--skipLibCheck',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  );
  const { products } = require(path.join(out, 'products.js'));
  const { categories } = require(path.join(out, 'categories.js'));
  return { products, categories, tempDir: out };
}

/**
 * How many products are free, quoted in prose on the paid pages. Derived at
 * generation time rather than written down, for the same reason every other
 * count in this repo is.
 */
let FREE_PRODUCT_COUNT = 0;

/** Jekyll front matter is YAML, and a title with a colon in it breaks it. */
function yamlString(value) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

/** Where these pages are published. Structured data needs absolute URLs. */
const SITE = 'https://singhalsachin2003.github.io/OTC_Learn';
const PUBLISHER = { '@type': 'Person', name: 'Sachin Singhal' };

/**
 * A JSON-LD block, to be appended to a page body.
 *
 * In the body rather than the document head because this site is built by
 * GitHub Pages with a stock theme and has no layout to edit; JSON-LD is read
 * the same way in either place.
 *
 * **Everything described below has to be visible on the page that carries it.**
 * Structured data that describes content a reader cannot see is a manual-action
 * risk, not an SEO win — which is why the lesson body never appears here for a
 * paid product, and why `isAccessibleForFree` is true on every page including
 * the teasers: the *page* is free to read in full, whatever the app charges for.
 */
function jsonLd(...blocks) {
  return [
    '<script type="application/ld+json">',
    JSON.stringify(blocks.length === 1 ? blocks[0] : blocks, null, 2),
    '</script>',
    '',
  ];
}

/** Home → asset class → product, which is how the site is actually organised. */
function breadcrumbs(category, product) {
  const trail = [
    { name: 'OTC Learn', item: `${SITE}/` },
    { name: category.name, item: `${SITE}/category/${category.id}/` },
  ];
  if (product) trail.push({ name: product.name, item: `${SITE}/product/${product.id}/` });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

/**
 * The page itself. `TechArticle` rather than `Article` because that is what it
 * is — an explainer about one instrument, written for people studying it.
 *
 * `about` carries the product as a `DefinedTerm`, which is the honest shape for
 * a page whose subject is a named thing in a vocabulary rather than an event or
 * a product for sale. Nothing on these pages is for sale; the app is.
 */
function articleBlock(product, category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: product.name,
    description: product.hook,
    abstract: product.summary,
    articleSection: category.name,
    inLanguage: 'en',
    isAccessibleForFree: true,
    mainEntityOfPage: `${SITE}/product/${product.id}/`,
    url: `${SITE}/product/${product.id}/`,
    author: PUBLISHER,
    publisher: PUBLISHER,
    about: {
      '@type': 'DefinedTerm',
      name: product.name,
      description: product.hook,
      inDefinedTermSet: `${SITE}/category/${category.id}/`,
    },
    proficiencyLevel: product.difficulty,
  };
}

/**
 * The key terms, which every page publishes in full — free or paid — because
 * they are the part the app leaves open in its glossary anyway. Six per
 * product, each with the definition printed above it.
 */
function keyTermsBlock(product, category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `${product.name} — key terms`,
    url: `${SITE}/product/${product.id}/`,
    inLanguage: 'en',
    hasDefinedTerm: product.keyTerms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.term,
      description: term.definition,
      inDefinedTermSet: `${SITE}/category/${category.id}/`,
    })),
  };
}

/**
 * A premium product's page: enough to be worth landing on and to resolve the
 * App Link, and not the lesson itself.
 */
function teaserPage(product, category, products) {
  const related = product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const lines = [
    '---',
    `title: ${yamlString(product.name)}`,
    `description: ${yamlString(product.hook)}`,
    `permalink: /product/${product.id}/`,
    '---',
    '',
    `# ${product.name}`,
    '',
    `*${product.hook}*`,
    '',
    product.summary,
    '',
    `[Open in the app](/OTC_Learn/) · [${category.name}](/OTC_Learn/category/${category.id}/) · ${product.difficulty}`,
    '',
    `${category.name} is part of the OTC Learn subscription. Everything the app shipped with — ${FREE_PRODUCT_COUNT} products across six asset classes — stays free.`,
    '',
    '## What the lesson covers',
    '',
  ];

  for (const step of product.lessons) {
    lines.push(`${step.step}. ${step.title}`);
  }

  lines.push('', '## Key terms', '');
  for (const term of product.keyTerms) {
    lines.push(`- **${term.term}** — ${term.definition}`);
  }
  lines.push('', '## In practice', '', product.inPractice, '');

  if (related.length > 0) {
    lines.push('## Read next', '');
    for (const other of related) {
      lines.push(`- [${other.name}](/OTC_Learn/product/${other.id}/) — ${other.hook}`);
    }
    lines.push('');
  }

  lines.push(
    `In the app, ${product.name} carries a five-step lesson, a worked example and a bank of twelve questions drawn differently every sitting.`,
    '',
    '[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)',
    '',
    'Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.',
    '',
    // The teaser's structured data describes the teaser: the summary, the step
    // titles and the key terms, which is all that is on the page. The lesson
    // body is not here for the same reason it is not above it.
    ...jsonLd(
      articleBlock(product, category),
      keyTermsBlock(product, category),
      breadcrumbs(category, product),
    ),
  );

  return lines.join('\n');
}

function productPage(product, category, products) {
  const related = product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const lines = [
    '---',
    `title: ${yamlString(product.name)}`,
    `description: ${yamlString(product.hook)}`,
    `permalink: /product/${product.id}/`,
    '---',
    '',
    `# ${product.name}`,
    '',
    `*${product.hook}*`,
    '',
    product.summary,
    '',
    `[Open in the app](/OTC_Learn/) · [${category.name}](/OTC_Learn/category/${category.id}/) · ${product.difficulty}`,
    '',
    '## The lesson',
    '',
  ];

  for (const step of product.lessons) {
    lines.push(`### ${step.step}. ${step.title}`, '', step.content, '');
    if (step.callout) {
      lines.push(`> ${step.callout}`, '');
    }
  }

  lines.push(`## ${product.example.title}`, '');
  for (const line of product.example.lines) {
    lines.push(`- ${line}`);
  }
  lines.push('', `**${product.example.takeaway}**`, '');

  lines.push('## Key terms', '');
  for (const term of product.keyTerms) {
    lines.push(`- **${term.term}** — ${term.definition}`);
  }
  lines.push('', '## In practice', '', product.inPractice, '');

  if (related.length > 0) {
    lines.push('## Read next', '');
    for (const other of related) {
      lines.push(`- [${other.name}](/OTC_Learn/product/${other.id}/) — ${other.hook}`);
    }
    lines.push('');
  }

  lines.push(
    `The app adds a twelve-question bank for ${product.name}, drawn differently every sitting, and a review queue for whatever you miss.`,
    '',
  );

  // Depth is paid, so the page says it exists and does not publish it — the
  // same line the app draws on the product page, for the reader who arrived
  // here from a search instead.
  if (product.depth !== undefined) {
    lines.push(
      `A subscription adds ${product.depth.sections.length} further sections on ${product.name} — ${product.depth.sections.map((section) => section.title).join(', ')} — and ${product.depth.quiz.length} more questions to its bank.`,
      '',
    );
  }

  lines.push(
    '[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)',
    '',
    'Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.',
    '',
    ...jsonLd(
      articleBlock(product, category),
      keyTermsBlock(product, category),
      breadcrumbs(category, product),
    ),
  );

  return lines.join('\n');
}

function categoryPage(category, products) {
  const mine = products.filter((p) => p.categoryId === category.id);
  const lines = [
    '---',
    `title: ${yamlString(category.name)}`,
    `description: ${yamlString(category.description)}`,
    `permalink: /category/${category.id}/`,
    '---',
    '',
    `# ${category.name}`,
    '',
    category.description,
    '',
    `${mine.length} products, each with a five-step lesson, a worked example and a bank of twelve questions.`,
    '',
  ];
  if (category.premium) {
    lines.push(
      `${category.name} is part of the OTC Learn subscription; the ${FREE_PRODUCT_COUNT} products the app shipped with are free.`,
      '',
    );
  }
  for (const product of mine) {
    lines.push(`- [${product.name}](/OTC_Learn/product/${product.id}/) — ${product.hook}`);
  }
  lines.push(
    '',
    '[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)',
    '',
    // A list page, described as one: the products named on it, in the order
    // they are named, and nothing that is not.
    ...jsonLd(
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.name,
        description: category.description,
        url: `${SITE}/category/${category.id}/`,
        inLanguage: 'en',
        isAccessibleForFree: true,
        publisher: PUBLISHER,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: mine.length,
          itemListElement: mine.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            description: product.hook,
            url: `${SITE}/product/${product.id}/`,
          })),
        },
      },
      breadcrumbs(category),
    ),
  );
  return lines.join('\n');
}

function writeAll(dir, files) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, body] of files) {
    fs.writeFileSync(path.join(dir, name), body);
  }
}

function main() {
  const { products, categories, tempDir } = loadCatalogue();
  const free = new Set(
    categories.filter((c) => !c.premium).map((category) => category.id),
  );
  FREE_PRODUCT_COUNT = products.filter((p) => free.has(p.categoryId)).length;

  writeAll(
    path.join(DOCS, 'product'),
    products.map((product) => [
      `${product.id}.md`,
      (categories.find((c) => c.id === product.categoryId).premium
        ? teaserPage
        : productPage)(
        product,
        categories.find((c) => c.id === product.categoryId),
        products,
      ),
    ]),
  );

  writeAll(
    path.join(DOCS, 'category'),
    categories.map((category) => [
      `${category.id}.md`,
      categoryPage(category, products),
    ]),
  );

  fs.rmSync(tempDir, { recursive: true, force: true });
  const teasers = products.length - FREE_PRODUCT_COUNT;
  console.log(
    `Wrote ${products.length} product pages (${teasers} of them teasers for paid content) and ${categories.length} category pages under docs/.`,
  );
}

main();
