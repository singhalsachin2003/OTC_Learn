import type { Product } from '../types';

/** Commodity products. Ids are stable — saved progress is keyed by them. */
export const commodityProducts: Product[] = [
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
        title: 'How it works',
        content:
          'The floating leg is usually the average of a published reference price over each settlement period, so a monthly swap settles against the month’s average rather than a single day’s close. Only the net difference between the two legs is paid.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Producers and consumers hedge price risk: an airline might fix its fuel costs, or a miner might lock in a selling price for gold.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference price or index, fixed price, settlement periods, notional volume, and the averaging convention that determines how the floating leg is calculated.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Basis risk appears when the published index does not match the grade or delivery location actually traded. Fixing the price also means giving up gains if the market rallies, and a hedge sized to expected volumes leaves exposure if actual output differs.',
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
      {
        id: 'cmswap-q4',
        question:
          'Commodity swaps often settle against an average price over the period.',
        correctAnswer: true,
        explanation:
          'Averaging smooths out single-day spikes in the reference price.',
      },
      {
        id: 'cmswap-q5',
        question:
          'A producer who hedges with a swap still benefits fully if prices rise.',
        correctAnswer: false,
        explanation:
          'The swap fixes the price, so gains above the fixed level are given up.',
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
        title: 'How it works',
        content:
          'At expiry the reference price is compared with the strike, and if the option is in the money the seller pays the difference on the contract volume. Many commodity options are Asian-style, settling against an average price over a period instead of a single date.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A call caps a consumer’s purchase cost; a put protects a producer’s selling price — both while preserving upside if prices move favorably.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, premium, underlying reference price, and expiry — the buyer’s maximum loss is always the premium paid. Contract volume sets how much the payoff is multiplied by.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Premiums can be steep for volatile commodities, and the whole premium is lost if the option expires worthless. Basis risk remains between the reference index and the physical grade actually bought or sold, and sellers face heavy losses if prices gap sharply.',
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
      {
        id: 'cmopt-q4',
        question:
          'Many commodity options settle against an average price over a period.',
        correctAnswer: true,
        explanation:
          'These Asian-style options reduce the impact of a single day’s price.',
      },
      {
        id: 'cmopt-q5',
        question:
          'A consumer who buys a call gives up the benefit of prices falling.',
        correctAnswer: false,
        explanation:
          'A call caps the purchase cost while leaving the benefit of lower prices intact.',
      },
    ],
  },
  {
    id: 'cmfwd',
    categoryId: 'commodity',
    name: 'Commodity Forward',
    hook: 'Agree a price today for delivery later',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A commodity forward is a bilateral agreement to buy or sell a set quantity of a commodity at an agreed price on a future date. Unlike a commodity swap, it usually contemplates delivery of the physical goods.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Price, quantity, grade, delivery point and date are all negotiated between the two parties. No money changes hands at inception — the whole transaction happens at maturity, when the buyer pays the agreed price and takes delivery.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It suits parties that genuinely want the physical commodity — a refiner securing crude, or a food producer locking in wheat — because it combines price certainty with guaranteed supply on terms an exchange-traded future cannot match.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Contract price, quantity, the grade or quality specification, the delivery point, the delivery date, and physical settlement at maturity.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'It is a firm obligation, so a buyer must take delivery even if demand has evaporated. Being bilateral and uncleared, it carries counterparty risk for the full term, and its bespoke terms make the position difficult to exit early.',
      },
    ],
    quiz: [
      {
        id: 'cmfwd-q1',
        question: 'A commodity forward typically contemplates physical delivery.',
        correctAnswer: true,
        explanation:
          'That physical settlement is what separates it from a cash-settled swap.',
      },
      {
        id: 'cmfwd-q2',
        question:
          'Grade and delivery point are negotiated terms in a commodity forward.',
        correctAnswer: true,
        explanation:
          'Bespoke specifications are the main advantage over standardized futures.',
      },
      {
        id: 'cmfwd-q3',
        question: 'Money changes hands when a commodity forward is agreed.',
        correctAnswer: false,
        explanation:
          'No payment is made at inception — settlement happens at maturity.',
      },
      {
        id: 'cmfwd-q4',
        question:
          'A commodity forward lets the buyer walk away at maturity if prices move against them.',
        correctAnswer: false,
        explanation:
          'It is a firm obligation, not an option — both sides must perform.',
      },
      {
        id: 'cmfwd-q5',
        question:
          'Commodity forwards can be tailored more freely than exchange-traded futures.',
        correctAnswer: true,
        explanation:
          'Every term is negotiable, which is precisely why firms use them.',
      },
    ],
  },
  {
    id: 'crackspread',
    categoryId: 'commodity',
    name: 'Crack Spread Swap',
    hook: 'Hedge the margin between crude and its products',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A refiner’s profit comes from the gap between the crude oil it buys and the refined products it sells — the crack spread. A crack spread swap fixes that margin rather than either price on its own.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The swap settles on the difference between product prices and crude. The most common structure is 3-2-1: three barrels of crude against two of gasoline and one of distillate, roughly matching a typical refinery’s output mix.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Hedging crude and products separately takes two trades and still leaves the margin exposed if the two move apart. A single crack spread swap hedges the economics the refiner actually cares about.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The crack spread itself, the 3-2-1 ratio, the reference price index for each leg, the settlement period, and the notional expressed in barrels.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The standard ratio rarely matches a specific refinery’s real yield, leaving residual exposure. Fixing the margin also forgoes the gains when spreads widen, and each leg carries its own basis risk against the grades actually processed.',
      },
    ],
    quiz: [
      {
        id: 'crackspread-q1',
        question:
          'A crack spread swap hedges the margin between crude and refined products.',
        correctAnswer: true,
        explanation:
          'That margin, not the outright oil price, is what drives refining profits.',
      },
      {
        id: 'crackspread-q2',
        question:
          'A 3-2-1 crack spread represents three barrels of crude against two of gasoline and one of distillate.',
        correctAnswer: true,
        explanation: 'The ratio approximates the output mix of a typical refinery.',
      },
      {
        id: 'crackspread-q3',
        question:
          'Hedging the crack spread requires no view on the absolute level of oil prices.',
        correctAnswer: true,
        explanation:
          'The trade isolates the spread, so the outright price level largely cancels out.',
      },
      {
        id: 'crackspread-q4',
        question:
          'A crack spread swap exactly matches every refinery’s actual product yield.',
        correctAnswer: false,
        explanation:
          'The standard ratio is an approximation, so residual exposure remains.',
      },
      {
        id: 'crackspread-q5',
        question:
          'A refiner who locks in the crack spread still captures the full benefit if margins widen.',
        correctAnswer: false,
        explanation:
          'Fixing the margin gives up that upside, just as it protects against a squeeze.',
      },
    ],
  },
];
