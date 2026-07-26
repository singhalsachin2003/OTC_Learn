import type { Product } from './types';

/**
 * The ten OTC products, two per asset class.
 *
 * All lesson and quiz content is transcribed verbatim from the design
 * prototype (`OTC Derivatives Learning App.dc.html`), which is the source of
 * truth for wording.
 */
export const products: Product[] = [
  // ---------------------------------------------------------------- Interest Rate
  {
    id: 'irs',
    categoryId: 'ir',
    name: 'Interest Rate Swap',
    hook: 'Trade fixed for floating payments',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Two parties exchange interest payments on a notional principal — one pays a fixed rate, the other a floating rate (e.g. SOFR). The notional itself is never exchanged, only the interest.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'Firms use swaps to convert floating-rate debt into fixed (or vice versa), hedging against rate moves, or to speculate on the direction of rates without borrowing directly.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Notional, fixed rate, floating reference rate, tenor, and payment/reset frequency define every swap contract.',
      },
    ],
    quiz: [
      {
        id: 'irs-q1',
        question: 'The notional principal is exchanged between counterparties.',
        correctAnswer: false,
        explanation:
          'Only the interest payments are exchanged — the notional is just a reference amount.',
      },
      {
        id: 'irs-q2',
        question:
          'An interest rate swap can convert floating-rate debt into fixed-rate debt.',
        correctAnswer: true,
        explanation:
          'Paying fixed and receiving floating effectively fixes a borrower’s rate.',
      },
      {
        id: 'irs-q3',
        question: 'Interest rate swaps trade on a centralized public exchange.',
        correctAnswer: false,
        explanation:
          'They are negotiated bilaterally over-the-counter, though many are now centrally cleared.',
      },
    ],
  },
  {
    id: 'swaption',
    categoryId: 'ir',
    name: 'Swaption',
    hook: 'An option on an interest rate swap',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A swaption gives the holder the right, but not the obligation, to enter into an interest rate swap at a preset rate on or by a future date.',
      },
      {
        step: 2,
        title: 'Payer vs receiver',
        content:
          'A payer swaption gives the right to pay the fixed rate (benefits if rates rise); a receiver swaption gives the right to receive fixed (benefits if rates fall).',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Swaptions hedge against future rate moves while keeping upside if rates move favorably. The buyer pays an upfront premium for that optionality.',
      },
    ],
    quiz: [
      {
        id: 'swaption-q1',
        question: 'A payer swaption gives the right to pay the fixed rate.',
        correctAnswer: true,
        explanation:
          'That’s the definition — it benefits the holder if rates rise.',
      },
      {
        id: 'swaption-q2',
        question: 'The swaption buyer is obligated to exercise at expiry.',
        correctAnswer: false,
        explanation:
          'It’s an option — exercise is optional, unlike a forward swap.',
      },
      {
        id: 'swaption-q3',
        question:
          'The premium is paid regardless of whether the swaption is exercised.',
        correctAnswer: true,
        explanation:
          'Like any option, the premium is the non-refundable cost of the right.',
      },
    ],
  },

  // ------------------------------------------------------------------------- FX
  {
    id: 'fxfwd',
    categoryId: 'fx',
    name: 'FX Forward',
    hook: 'Lock in a future exchange rate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX forward is a customized OTC agreement to exchange two currencies at a fixed rate on a specified future date.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'Companies use forwards to lock in an exchange rate for future receivables or payables, removing uncertainty from currency moves.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'The forward rate reflects the spot rate adjusted by forward points, which capture the interest rate differential between the two currencies.',
      },
    ],
    quiz: [
      {
        id: 'fxfwd-q1',
        question:
          'FX forwards settle at the prevailing spot rate on the settlement date.',
        correctAnswer: false,
        explanation:
          'They settle at the pre-agreed forward rate, regardless of where spot ends up.',
      },
      {
        id: 'fxfwd-q2',
        question: 'FX forwards are standardized contracts traded on an exchange.',
        correctAnswer: false,
        explanation:
          'They are bespoke bilateral OTC contracts, unlike listed futures.',
      },
      {
        id: 'fxfwd-q3',
        question:
          'Forward points reflect the interest rate differential between the two currencies.',
        correctAnswer: true,
        explanation:
          'Covered interest rate parity links forward points to rate differentials.',
      },
    ],
  },
  {
    id: 'fxopt',
    categoryId: 'fx',
    name: 'FX Option',
    hook: 'The right to exchange currency at a strike',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX option gives the holder the right, not the obligation, to buy or sell one currency for another at a set strike rate on or before expiry.',
      },
      {
        step: 2,
        title: 'Call vs put',
        content:
          'A call gives the right to buy the base currency; a put gives the right to sell it. The buyer pays a premium for this flexibility.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Firms hedge currency exposure while retaining upside if rates move favorably — unlike a forward, which locks in the rate either way.',
      },
    ],
    quiz: [
      {
        id: 'fxopt-q1',
        question: 'The buyer of an FX option pays a premium upfront.',
        correctAnswer: true,
        explanation:
          'The premium is the price of the optionality, paid regardless of exercise.',
      },
      {
        id: 'fxopt-q2',
        question: 'The FX option buyer must exercise the option at expiry.',
        correctAnswer: false,
        explanation:
          'Exercise is optional — the buyer lets it lapse if unfavorable.',
      },
      {
        id: 'fxopt-q3',
        question: 'A call option benefits the holder if the currency appreciates.',
        correctAnswer: true,
        explanation:
          'A call locks in a purchase rate, valuable if the currency rises above the strike.',
      },
    ],
  },

  // --------------------------------------------------------------------- Credit
  {
    id: 'cds',
    categoryId: 'credit',
    name: 'Credit Default Swap',
    hook: 'Insurance against a borrower defaulting',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'In a CDS, the protection buyer pays a periodic premium (the spread) to the protection seller, who pays out if a defined credit event occurs on a reference entity.',
      },
      {
        step: 2,
        title: 'Key terms',
        content:
          'Reference entity, spread, notional, credit event definition, and settlement method (cash or physical delivery of the defaulted bond).',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'CDS let investors hedge credit risk on bonds or loans they hold, or take a view on a company’s creditworthiness without owning its debt.',
      },
    ],
    quiz: [
      {
        id: 'cds-q1',
        question: 'The protection buyer pays a periodic premium called the spread.',
        correctAnswer: true,
        explanation:
          'That premium compensates the seller for taking on default risk.',
      },
      {
        id: 'cds-q2',
        question: 'A CDS payout is triggered by a rise in interest rates.',
        correctAnswer: false,
        explanation:
          'CDS pay out on a defined credit event, such as default or restructuring — not rate moves.',
      },
      {
        id: 'cds-q3',
        question: 'You must own the underlying bond to buy CDS protection.',
        correctAnswer: false,
        explanation:
          '"Naked" CDS positions, without owning the reference debt, are common.',
      },
    ],
  },
  {
    id: 'cdx',
    categoryId: 'credit',
    name: 'CDX Index',
    hook: 'A basket of CDS in one tradable index',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A CDX is a tradable index built from a basket of single-name CDS (e.g. CDX.NA.IG), giving broad exposure to a segment of the credit market in one trade.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'It’s a far more efficient way to hedge or gain exposure to overall credit risk than trading dozens of single-name CDS individually.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Index series roll periodically to refresh constituents; tranches let investors take exposure to specific loss layers of the basket.',
      },
    ],
    quiz: [
      {
        id: 'cdx-q1',
        question: 'A CDX index references a single company.',
        correctAnswer: false,
        explanation: 'It references a basket of many reference entities.',
      },
      {
        id: 'cdx-q2',
        question:
          'New index series roll periodically, refreshing the constituents.',
        correctAnswer: true,
        explanation: 'Rolls keep the index representative of the current market.',
      },
      {
        id: 'cdx-q3',
        question:
          'Tranches let investors take exposure to specific loss layers of the basket.',
        correctAnswer: true,
        explanation:
          'Tranching splits the basket’s losses into ordered risk layers.',
      },
    ],
  },

  // --------------------------------------------------------------------- Equity
  {
    id: 'eqswap',
    categoryId: 'equity',
    name: 'Equity Swap',
    hook: 'Swap equity returns for a funding rate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One leg pays the equity return (price change plus dividends) on a notional; the other leg pays a fixed or floating interest rate. No shares change hands.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'Investors gain equity exposure without owning shares — avoiding voting rights and getting different funding, tax, or balance-sheet treatment. Also used to hedge existing positions.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Total return swaps include dividends; price return swaps do not. The financing leg is typically a benchmark rate plus a spread.',
      },
    ],
    quiz: [
      {
        id: 'eqswap-q1',
        question:
          'Equity swap holders receive voting rights on the underlying shares.',
        correctAnswer: false,
        explanation: 'Swaps are synthetic — no shares are actually owned or voted.',
      },
      {
        id: 'eqswap-q2',
        question:
          'A total return equity swap includes dividends paid on the underlying.',
        correctAnswer: true,
        explanation:
          'That’s what distinguishes "total return" from "price return".',
      },
      {
        id: 'eqswap-q3',
        question:
          'The financing leg typically pays a rate like SOFR plus a spread.',
        correctAnswer: true,
        explanation: 'The equity-return receiver usually pays this financing cost.',
      },
    ],
  },
  {
    id: 'eqopt',
    categoryId: 'equity',
    name: 'OTC Equity Option',
    hook: 'A custom, bilaterally negotiated option',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A right to buy or sell a stock, basket, or index at a strike price, negotiated bilaterally rather than traded on a listed exchange.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'OTC options allow tailored strikes, expiries, notionals, and exotic features (like barriers) for hedging concentrated positions or bespoke payoffs.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Strike, expiry, underlying, premium — plus exotic features like knock-in/knock-out barriers or basket underlyings not available on listed markets.',
      },
    ],
    quiz: [
      {
        id: 'eqopt-q1',
        question:
          'OTC equity options can be customized on strike, notional, and expiry.',
        correctAnswer: true,
        explanation:
          'That flexibility is the main reason firms use OTC over listed options.',
      },
      {
        id: 'eqopt-q2',
        question: 'OTC equity options trade on public stock exchanges.',
        correctAnswer: false,
        explanation: 'They are privately negotiated between two counterparties.',
      },
      {
        id: 'eqopt-q3',
        question:
          'The premium is what the option buyer pays upfront for the right.',
        correctAnswer: true,
        explanation: 'It’s the maximum the buyer can lose on the position.',
      },
    ],
  },

  // ------------------------------------------------------------------ Commodity
  {
    id: 'cmswap',
    categoryId: 'commodity',
    name: 'Commodity Swap',
    hook: 'Fixed price for floating market price',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One party pays a fixed price, the other pays a floating market price for a commodity like oil or gold, on a notional volume — cash-settled with no physical delivery.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'Producers and consumers hedge price risk: an airline might fix its fuel costs, or a miner might lock in a selling price for gold.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Reference price/index, fixed price, settlement periods, and notional volume define the contract.',
      },
    ],
    quiz: [
      {
        id: 'cmswap-q1',
        question:
          'Commodity swaps typically involve physical delivery of the commodity.',
        correctAnswer: false,
        explanation:
          'They’re cash-settled against a reference price — no physical delivery occurs.',
      },
      {
        id: 'cmswap-q2',
        question: 'An airline might use a commodity swap to hedge fuel costs.',
        correctAnswer: true,
        explanation: 'Fixing the fuel price protects against rising oil prices.',
      },
      {
        id: 'cmswap-q3',
        question: 'The floating leg is tied to a market reference price or index.',
        correctAnswer: true,
        explanation:
          'That reference price determines the floating payment each period.',
      },
    ],
  },
  {
    id: 'cmopt',
    categoryId: 'commodity',
    name: 'Commodity Option',
    hook: 'Cap or floor a commodity price',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A right to buy (call) or sell (put) a commodity at a strike price by expiry, often cash-settled against a reference price rather than physically delivered.',
      },
      {
        step: 2,
        title: 'Why it’s used',
        content:
          'A call caps a consumer’s purchase cost; a put protects a producer’s selling price — both while preserving upside if prices move favorably.',
      },
      {
        step: 3,
        title: 'Key terms',
        content:
          'Strike, premium, underlying reference price, and expiry — the buyer’s maximum loss is always the premium paid.',
      },
    ],
    quiz: [
      {
        id: 'cmopt-q1',
        question:
          'A producer might buy a put option to protect against falling prices.',
        correctAnswer: true,
        explanation:
          'A put sets a floor selling price while keeping upside if prices rise.',
      },
      {
        id: 'cmopt-q2',
        question: 'The option buyer’s maximum loss is the premium paid.',
        correctAnswer: true,
        explanation: 'Losses are capped at the premium — unlike a swap or forward.',
      },
      {
        id: 'cmopt-q3',
        question: 'Commodity options guarantee physical delivery of the commodity.',
        correctAnswer: false,
        explanation: 'Most are cash-settled against a reference price index.',
      },
    ],
  },
];

/** Total number of products in the catalogue — drives the progress bar. */
export const TOTAL_PRODUCTS = products.length;

const productsById = new Map(products.map((p) => [p.id, p]));

export function getProductById(id: string | null): Product | undefined {
  return id === null ? undefined : productsById.get(id);
}

export function getProductsByCategory(categoryId: string | null): Product[] {
  return categoryId === null
    ? []
    : products.filter((p) => p.categoryId === categoryId);
}
