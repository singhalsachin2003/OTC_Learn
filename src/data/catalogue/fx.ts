import type { Product } from '../types';

/** FX products. Ids are stable — saved progress is keyed by them. */
export const fxProducts: Product[] = [
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
        title: 'How the rate is set',
        content:
          'The forward rate is the spot rate adjusted by forward points, which come from the interest rate differential between the two currencies. The currency with the higher interest rate trades at a forward discount — otherwise borrowing in one and lending in the other would be a free profit.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Companies use forwards to lock in an exchange rate for future receivables or payables, removing uncertainty from currency moves.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Spot rate, forward points, value date and notional define the trade. An outright forward is a single exchange on one date, while a window forward lets the company settle at any point across a range of dates.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A forward is a firm obligation, so if the underlying exposure disappears — an expected sale falls through — the company is left holding an unwanted currency position. Locking the rate also gives up any benefit if spot moves favorably, and the contract carries counterparty risk until settlement.',
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
      {
        id: 'fxfwd-q4',
        question:
          'A forward obliges both parties to transact, with no option to walk away.',
        correctAnswer: true,
        explanation:
          'That firm commitment is the key difference from an FX option.',
      },
      {
        id: 'fxfwd-q5',
        question:
          'The currency with the higher interest rate typically trades at a forward premium.',
        correctAnswer: false,
        explanation:
          'It trades at a forward discount — otherwise the rate gap would be an arbitrage.',
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
          'A call gives the right to buy the base currency; a put gives the right to sell it. The buyer pays a premium for this flexibility. Because every FX trade has two sides, an option is always a call on one currency and simultaneously a put on the other.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Firms hedge currency exposure while retaining upside if rates move favorably — unlike a forward, which locks in the rate either way.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, premium, expiry, notional and exercise style (European on one date, American any time before expiry). Implied volatility drives the price, and dealers hedge their delta — the option’s sensitivity to the spot rate.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium is a real cost, making options a more expensive hedge upfront than a forward, and it is lost if the option expires worthless. Sellers face large open-ended losses, and exotic features such as knock-out barriers can cancel a hedge exactly when it is needed most.',
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
      {
        id: 'fxopt-q4',
        question:
          'Every FX option is a call on one currency and a put on the other at the same time.',
        correctAnswer: true,
        explanation:
          'Buying one currency always means selling the other, so both descriptions fit.',
      },
      {
        id: 'fxopt-q5',
        question:
          'An FX option costs nothing upfront, whereas a forward requires a premium.',
        correctAnswer: false,
        explanation:
          'It is the other way round — the forward costs nothing upfront, the option needs a premium.',
      },
    ],
  },
  {
    id: 'fxswap',
    categoryId: 'fx',
    name: 'FX Swap',
    hook: 'Exchange currencies now and reverse it later',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX swap packages two exchanges into one contract: currencies are swapped at today’s rate (the near leg) and swapped back at an agreed forward rate on a future date (the far leg).',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The near and far rates differ only by the forward points. A firm holding dollars that needs euros for three months sells dollars for euros today and contracts to reverse the trade in three months — the economic effect is borrowing one currency while lending the other.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'FX swaps manage short-term liquidity across currencies, roll a maturing forward hedge out to a later date, and move cash where it is needed without taking an outright currency position. By turnover they are the largest single instrument in the FX market.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Near leg, far leg, forward points (which are the swap’s price), and the two value dates. Very short tenors are common, including overnight and "tom-next" trades that shift settlement by a single day.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Because both legs are fixed at inception, outright FX risk largely cancels out — but the position is still exposed to moves in interest rate differentials, and the far leg carries counterparty and settlement risk until it completes.',
      },
    ],
    quiz: [
      {
        id: 'fxswap-q1',
        question:
          'An FX swap has two legs — an exchange now and a reversal at a future date.',
        correctAnswer: true,
        explanation: 'The near leg and far leg together make up the contract.',
      },
      {
        id: 'fxswap-q2',
        question:
          'An FX swap leaves the firm with a large outright currency exposure.',
        correctAnswer: false,
        explanation:
          'Both legs are agreed at the start, so the directional FX risk largely offsets.',
      },
      {
        id: 'fxswap-q3',
        question: 'The price of an FX swap is quoted in forward points.',
        correctAnswer: true,
        explanation:
          'Forward points are the only difference between the near and far rates.',
      },
      {
        id: 'fxswap-q4',
        question: 'FX swaps exchange interest payments throughout their life.',
        correctAnswer: false,
        explanation:
          'That describes a cross-currency swap — an FX swap has only the two exchange legs.',
      },
      {
        id: 'fxswap-q5',
        question: 'FX swaps are commonly used to roll a maturing forward hedge.',
        correctAnswer: true,
        explanation:
          'Rolling the hedge forward is one of their most frequent uses.',
      },
    ],
  },
  {
    id: 'ndf',
    categoryId: 'fx',
    name: 'Non-Deliverable Forward',
    hook: 'A cash-settled forward for restricted currencies',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A non-deliverable forward is an FX forward that never delivers the underlying currency. At maturity the parties settle the difference between the agreed rate and an official fixing, paid in a convertible currency such as US dollars.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Two parties agree a rate on a notional amount of a restricted currency. On the fixing date an official reference rate is published; whichever side is out of the money pays the difference in dollars. The restricted currency itself never moves.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Many emerging-market currencies sit behind capital controls that block delivery offshore. NDFs let companies and investors hedge or take positions in those currencies without local bank accounts or regulatory approval.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The fixing rate and its source (often a central bank or an industry benchmark), the settlement currency, the notional, and the gap between the fixing date and the settlement date a day or two later.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The official fixing can differ from the rate a firm actually achieves onshore, leaving basis risk in the hedge. Fixings can also be suspended or redefined during a currency crisis, and liquidity in these markets thins out quickly under stress.',
      },
    ],
    quiz: [
      {
        id: 'ndf-q1',
        question: 'An NDF settles without ever delivering the underlying currency.',
        correctAnswer: true,
        explanation:
          'Only the cash difference changes hands — hence "non-deliverable".',
      },
      {
        id: 'ndf-q2',
        question:
          'NDFs are typically used for currencies subject to capital controls.',
        correctAnswer: true,
        explanation:
          'They provide exposure where delivery offshore is restricted or impossible.',
      },
      {
        id: 'ndf-q3',
        question: 'An NDF is settled in the restricted local currency.',
        correctAnswer: false,
        explanation:
          'Settlement is in a convertible currency, most often US dollars.',
      },
      {
        id: 'ndf-q4',
        question:
          'The settlement amount depends on an official fixing rate published at maturity.',
        correctAnswer: true,
        explanation:
          'The fixing is compared with the contract rate to determine who pays.',
      },
      {
        id: 'ndf-q5',
        question:
          'An NDF removes all basis risk for a company hedging local-currency cash flows.',
        correctAnswer: false,
        explanation:
          'The fixing may differ from the onshore rate actually achieved, leaving basis risk.',
      },
    ],
  },
];
