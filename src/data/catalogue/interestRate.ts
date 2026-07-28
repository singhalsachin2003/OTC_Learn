import type { Product } from '../types';

/** Interest rate products. Ids are stable — saved progress is keyed by them. */
export const interestRateProducts: Product[] = [
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
        title: 'How it works',
        content:
          'On each reset date the floating rate is observed, and on each payment date the two legs are netted so only the difference changes hands. On a $100m swap paying 4% fixed against a floating leg that sets at 4.5%, the fixed payer receives 0.5% on the notional for that period.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Firms use swaps to convert floating-rate debt into fixed (or vice versa), hedging against rate moves, or to speculate on the direction of rates without borrowing directly.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Notional, fixed rate, floating reference rate, tenor, and payment/reset frequency define every swap contract. The effective date sets when interest starts accruing, and the day count convention determines exactly how each payment is calculated.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The swap only hedges what it matches — a mismatch in dates or amounts leaves residual exposure. Value moves with rates, so an off-market swap creates mark-to-market swings and collateral calls, and each party carries credit risk on the other unless the trade is centrally cleared.',
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
      {
        id: 'irs-q4',
        question:
          'On a payment date the two legs are usually netted, so only the difference is paid.',
        correctAnswer: true,
        explanation:
          'Netting means a single payment moves between the parties each period.',
      },
      {
        id: 'irs-q5',
        question: 'The fixed rate is reset at every payment date.',
        correctAnswer: false,
        explanation:
          'The fixed leg stays fixed for the life of the swap — only the floating leg resets.',
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
        title: 'How it settles',
        content:
          'At expiry the holder either enters the actual swap (physical settlement) or takes its cash value instead (cash settlement). Most swaptions are European, exercisable on a single date, while a Bermudan swaption allows exercise on several dates.',
      },
      {
        step: 4,
        title: 'Why it’s used',
        content:
          'Swaptions hedge against future rate moves while keeping upside if rates move favorably. The buyer pays an upfront premium for that optionality.',
      },
      {
        step: 5,
        title: 'Key terms and risks',
        content:
          'Quoted as "1y into 5y" — one year to expiry, then a five-year swap. Value depends on rate levels and on volatility, so a swaption can lose money even when rates barely move. The buyer’s loss is capped at the premium; the seller’s exposure is open-ended.',
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
      {
        id: 'swaption-q4',
        question:
          'A "1y into 5y" swaption expires in one year into a five-year swap.',
        correctAnswer: true,
        explanation:
          'The first figure is the option expiry, the second the underlying swap’s tenor.',
      },
      {
        id: 'swaption-q5',
        question: 'The swaption seller’s maximum loss is the premium received.',
        correctAnswer: false,
        explanation:
          'The premium caps the buyer’s loss, not the seller’s — the seller’s exposure is open-ended.',
      },
    ],
  },
  {
    id: 'fra',
    categoryId: 'ir',
    name: 'Forward Rate Agreement',
    hook: 'Lock a rate for one future period',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A forward rate agreement fixes the interest rate on a notional deposit or loan for one specified future period. A "3x6" FRA covers a three-month period that begins three months from today.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'On the fixing date the reference rate is compared with the agreed FRA rate, and the difference on the notional is settled as a single cash payment. No money is actually lent, and because settlement happens at the start of the period the amount is discounted back.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Borrowers lock in a future funding cost, lenders lock in a future return, and traders take a view on one point of the rate curve. An FRA is effectively a swap with a single period.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The "3x6" style notation, notional, contract rate, reference rate, fixing date and settlement date define the trade. The buyer of an FRA is the notional borrower and gains when rates rise.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Only one period is covered, so hedging a rolling exposure needs a strip of FRAs or a swap instead. The payoff is linear, meaning a favorable rate move costs exactly as much as an adverse one saves, and the contract carries counterparty risk until settlement.',
      },
    ],
    quiz: [
      {
        id: 'fra-q1',
        question: 'An FRA fixes the interest rate for a single future period.',
        correctAnswer: true,
        explanation:
          'That single-period nature is what separates an FRA from a swap.',
      },
      {
        id: 'fra-q2',
        question: 'The notional amount is actually lent between the parties.',
        correctAnswer: false,
        explanation:
          'No principal changes hands — only the interest difference is settled in cash.',
      },
      {
        id: 'fra-q3',
        question:
          'A "3x6" FRA covers a three-month period beginning three months from today.',
        correctAnswer: true,
        explanation:
          'The two numbers are the months to the start and the end of the covered period.',
      },
      {
        id: 'fra-q4',
        question:
          'An FRA gives the buyer the right, but not the obligation, to borrow at the contract rate.',
        correctAnswer: false,
        explanation:
          'An FRA is a firm commitment, not an option — both sides are bound to settle.',
      },
      {
        id: 'fra-q5',
        question: 'Hedging a rolling exposure may require a strip of FRAs.',
        correctAnswer: true,
        explanation:
          'Each FRA covers one period, so several are needed to cover a longer horizon.',
      },
    ],
  },
  {
    id: 'capfloor',
    categoryId: 'ir',
    name: 'Cap and Floor',
    hook: 'Set a ceiling or floor on a floating rate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A cap is a series of options that pays out whenever a floating reference rate rises above a strike; a floor pays out when it falls below. Each individual option in the series is a caplet, or a floorlet.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'On every reset date the reference rate is compared with the strike. If a cap struck at 5% sees the rate set at 5.75%, the holder receives 0.75% on the notional for that period; if the rate sets below the strike, that caplet simply expires worthless.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A borrower on floating-rate debt buys a cap to limit the worst-case interest bill while still benefiting if rates fall — something a swap cannot offer. An investor receiving floating income buys a floor to protect a minimum yield.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, caplets and floorlets, notional, reset frequency, tenor and premium. Combining a bought cap with a sold floor creates a collar, which cuts the premium in exchange for giving up the benefit of rates falling below the floor.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium is paid upfront and is lost entirely if the rate never breaches the strike. Sellers of caps and floors face open-ended exposure, and a collar’s sold leg reintroduces downside once the rate passes through the floor.',
      },
    ],
    quiz: [
      {
        id: 'capfloor-q1',
        question: 'A cap pays out when the floating rate rises above the strike.',
        correctAnswer: true,
        explanation:
          'That payout is what limits the borrower’s effective interest cost.',
      },
      {
        id: 'capfloor-q2',
        question: 'Each individual option inside a cap is called a caplet.',
        correctAnswer: true,
        explanation:
          'A cap is simply a strip of caplets, one for each reset period.',
      },
      {
        id: 'capfloor-q3',
        question:
          'Buying a cap forces the borrower to give up the benefit of falling rates.',
        correctAnswer: false,
        explanation:
          'Unlike a swap, a cap keeps the downside benefit — that flexibility is what the premium buys.',
      },
      {
        id: 'capfloor-q4',
        question: 'A collar is created by buying a cap and selling a floor.',
        correctAnswer: true,
        explanation:
          'The premium received on the floor offsets the cost of the cap.',
      },
      {
        id: 'capfloor-q5',
        question: 'The buyer of a cap receives a premium upfront.',
        correctAnswer: false,
        explanation:
          'The buyer pays the premium; the seller receives it for taking on the risk.',
      },
    ],
  },
];
