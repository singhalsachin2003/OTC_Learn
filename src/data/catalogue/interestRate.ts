import type { Product } from '../types';

/** Interest rate products. Ids are stable — saved progress is keyed by them. */
export const interestRateProducts: Product[] = [
  {
    id: 'irs',
    categoryId: 'ir',
    name: 'Interest Rate Swap',
    hook: 'Trade fixed for floating payments',
    summary:
      'The workhorse of the OTC market. Two parties agree to exchange interest payments on an agreed notional amount — one leg fixed, the other floating — for an agreed term. Nothing is lent and nothing is borrowed; the swap simply changes the character of interest a party pays or receives, which is why a borrower with a floating loan can end up with the economics of a fixed one without renegotiating the loan.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Two parties exchange interest payments on a notional principal — one pays a fixed rate, the other a floating rate (e.g. SOFR). The notional itself is never exchanged, only the interest.',
        callout:
          'The interest rate swap market is the largest OTC derivatives market in the world, with hundreds of trillions of dollars in notional outstanding.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Each period has a floating rate that settles against the benchmark, and on each payment date the two legs are netted so only the difference changes hands. On a $100m swap paying 4% fixed against a floating leg that sets at 4.5%, the fixed payer receives 0.5% on the notional for that period.',
        callout:
          'The reset fixes which rate applies to a period, but an overnight benchmark such as SOFR is compounded across that period, so the rate itself is only known once the period has run. Payment then follows a few business days later.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Firms use swaps to convert floating-rate debt into fixed (or vice versa), hedging against rate moves, or to speculate on the direction of rates without borrowing directly. A treasurer who has borrowed floating but wants budget certainty pays fixed on a swap and keeps receiving floating, which offsets the loan.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Notional, fixed rate, floating reference rate, tenor, and payment/reset frequency define every swap contract. The effective date sets when interest starts accruing, and the day count convention determines exactly how each payment is calculated.',
        callout:
          'Day count matters more than it looks: 30/360 and ACT/360 on the same rate and notional produce different cash.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The swap only hedges what it matches — a mismatch in dates or amounts leaves residual exposure. Value moves with rates, so an off-market swap creates mark-to-market swings and collateral calls, and each party carries credit risk on the other unless the trade is centrally cleared.',
      },
    ],
    keyTerms: [
      {
        term: 'Notional',
        definition:
          'The reference amount interest is calculated on. It is never exchanged in a standard swap.',
      },
      {
        term: 'Fixed leg',
        definition:
          'The side paying a rate agreed at inception that does not change for the life of the trade.',
      },
      {
        term: 'Floating leg',
        definition:
          'The side paying a rate that resets periodically against a published benchmark such as SOFR.',
      },
      {
        term: 'Reset date',
        definition:
          'The date that starts a new calculation period and fixes which benchmark rate applies to it.',
      },
      {
        term: 'Tenor',
        definition:
          'The total life of the swap, from effective date to maturity — commonly 2, 5 or 10 years.',
      },
      {
        term: 'Day count convention',
        definition:
          'The rule converting an annual rate into the fraction actually owed for a period, such as ACT/360.',
      },
    ],
    example: {
      title: 'A treasurer fixes a floating loan',
      lines: [
        'A company has borrowed $200m at SOFR + 1%, paid annually.',
        'It enters a 5-year swap: it pays 3% fixed and receives SOFR on the same $200m.',
        'In year one SOFR sets at 3.8%, so the loan costs 4.8% — $9.6m.',
        'On the swap it pays $6m fixed and receives $7.6m floating, a net receipt of $1.6m.',
        'Total cash out is $9.6m − $1.6m = $8m, which is 4% of $200m.',
      ],
      takeaway:
        'Whatever SOFR does, the company pays 4% — the fixed swap rate plus its 1% credit spread. The floating leg of the swap cancels the floating cost of the loan.',
    },
    inPractice:
      'Corporate treasurers use these to turn a floating bank loan into a predictable budget line, and pension funds use long-dated swaps to match the fixed liabilities they owe retirees. Most standardised swaps now clear through a central counterparty rather than settling bilaterally.',
    relatedProductIds: ['swaption', 'fra', 'fxswap'],
    quiz: [
      {
        id: 'irs-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The notional principal is exchanged between counterparties.',
        correctAnswer: false,
        explanation:
          'Only the interest payments are exchanged — the notional is just a reference amount.',
      },
      {
        id: 'irs-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'In a plain vanilla interest rate swap, what actually changes hands?',
        options: [
          'The underlying bonds held by each party',
          'Interest payments calculated on a notional amount',
          'The notional principal, exchanged at maturity',
          'A share of the counterparty’s loan book',
        ],
        correctIndex: 1,
        explanation:
          'Only interest flows. The notional is a calculation reference that neither side pays.',
      },
      {
        id: 'irs-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Interest rate swaps trade on a centralised public exchange.',
        correctAnswer: false,
        explanation:
          'They are negotiated bilaterally over-the-counter, though many are now centrally cleared.',
      },
      {
        id: 'irs-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'On a payment date the two legs are usually netted, so only the difference is paid.',
        correctAnswer: true,
        explanation:
          'Netting means one party pays the difference rather than both paying gross amounts.',
      },
      {
        id: 'irs-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'On a $200m swap the fixed payer pays 3% and the floating leg sets at 3.8% for a full year. What happens on the payment date?',
        options: [
          'The floating payer pays $1.6m to the fixed payer',
          'The fixed payer pays $1.6m to the floating payer',
          'The fixed payer pays $6m and receives nothing',
          'Both parties pay gross: $6m and $7.6m',
        ],
        correctIndex: 0,
        explanation:
          'Floating owes $7.6m and fixed owes $6m. Netted, the floating payer sends the $1.6m difference.',
      },
      {
        id: 'irs-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What is the difference between a reset date and a payment date?',
        options: [
          'They are two names for the same date',
          'The reset date is when the swap matures; the payment date is when it starts',
          'The reset date fixes the floating rate; the payment date is when cash moves',
          'The reset date applies to the fixed leg, the payment date to the floating leg',
        ],
        correctIndex: 2,
        explanation:
          'The reset determines which rate applies to a period; on a SOFR leg that rate is compounded across the period, so it is known only once the period has run, and the cash moves on the payment date a few days after that.',
      },
      {
        id: 'irs-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'An interest rate swap can convert floating-rate debt into fixed-rate debt.',
        correctAnswer: true,
        explanation:
          'Paying fixed and receiving floating effectively fixes a borrower’s rate.',
      },
      {
        id: 'irs-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A borrower with a floating-rate loan fears rates will rise. What should they do on a swap?',
        options: [
          'Receive fixed and pay floating',
          'Pay fixed and receive floating',
          'Pay floating on both legs',
          'Sell the loan to the swap counterparty',
        ],
        correctIndex: 1,
        explanation:
          'Receiving floating offsets the loan’s floating cost, leaving the fixed rate as the net expense.',
      },
      {
        id: 'irs-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which term decides how an annual rate is converted into the amount owed for one period?',
        options: [
          'The tenor',
          'The notional',
          'The day count convention',
          'The reset frequency',
        ],
        correctIndex: 2,
        explanation:
          'ACT/360 and 30/360 produce different cash on the same rate and notional.',
      },
      {
        id: 'irs-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'The effective date is the date on which interest starts accruing.',
        correctAnswer: true,
        explanation:
          'It is the start of the first calculation period, which may be later than the trade date.',
      },
      {
        id: 'irs-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Clearing a swap through a central counterparty principally reduces which risk?',
        options: [
          'Interest rate risk',
          'Basis risk between the hedge and the loan',
          'Inflation risk on the notional',
          'Counterparty credit risk',
        ],
        correctIndex: 3,
        explanation:
          'The clearing house stands between the two sides, so neither carries the other’s default risk. The market risk of the swap is unchanged.',
      },
      {
        id: 'irs-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A swap whose rate is off-market can generate collateral calls before it matures.',
        correctAnswer: true,
        explanation:
          'Its mark-to-market value moves with rates, and a negative value has to be collateralised.',
      },
    ],
  },
  {
    id: 'swaption',
    categoryId: 'ir',
    name: 'Swaption',
    hook: 'An option on an interest rate swap',
    summary:
      'An option on a swap. The buyer pays a premium today for the right — never the obligation — to enter an agreed interest rate swap, at a rate agreed today, on a date agreed today. That asymmetry is the whole point: a forward-starting swap binds both sides whatever happens, whereas a swaption turns a future borrowing or investment rate into a worst case the holder can walk away from if the market offers something better.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A swaption gives the holder the right, but not the obligation, to enter into an interest rate swap at a preset rate on or by a future date. That preset rate is the strike, and the contract also fixes everything else about the swap that would follow: notional, tenor, floating index such as SOFR or €STR, and payment frequency.',
      },
      {
        step: 2,
        title: 'Payer vs receiver',
        content:
          'A payer swaption gives the right to pay the fixed rate (benefits if rates rise); a receiver swaption gives the right to receive fixed (benefits if rates fall). The labels always describe the fixed leg of the underlying swap, never the floating one, so there is no third variety to learn.',
        callout:
          'A payer swaption gains as rates rise and bond prices fall, which makes it economically a put on the underlying bond — the same exposure seen from the other side of the price/yield relationship.',
      },
      {
        step: 3,
        title: 'How it settles',
        content:
          'At expiry the holder either enters the actual swap (physical settlement) or takes its cash value instead (cash settlement). Most swaptions are European, exercisable on a single date, while a Bermudan swaption allows exercise on several dates. Cash settlement needs an agreed way of turning the swap into a single number, so the confirmation specifies the valuation method before the trade is done rather than leaving it to be argued at expiry.',
      },
      {
        step: 4,
        title: 'Why it’s used',
        content:
          'Swaptions hedge against future rate moves while keeping upside if rates move favourably. The buyer pays an upfront premium for that optionality. A treasurer who expects to issue fixed-rate debt next year can buy a payer swaption to cap the rate on that issue and still borrow at the market rate if rates have fallen — something a forward-starting swap cannot offer, because it commits both sides.',
        callout:
          'The premium is agreed on the trade date and paid within a couple of business days of it, not at expiry, so the cost is sunk long before the exercise decision is made.',
      },
      {
        step: 5,
        title: 'Key terms and risks',
        content:
          'Quoted as "1y into 5y" — one year to expiry, then a five-year swap. Value depends on rate levels and on volatility, so a swaption can lose money even when rates barely move. The buyer’s loss is capped at the premium; the seller’s exposure is open-ended.',
        callout:
          'Swaption volatility is usually quoted in basis points a year (normal volatility) rather than as a percentage of the rate, a convention that became standard once rates traded at and below zero.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike rate',
        definition:
          'The fixed rate on the swap the holder may enter, agreed when the swaption is traded.',
      },
      {
        term: 'Payer swaption',
        definition:
          'The right to enter a swap paying fixed and receiving floating, which gains value as rates rise.',
      },
      {
        term: 'Receiver swaption',
        definition:
          'The right to enter a swap receiving fixed and paying floating, which gains value as rates fall.',
      },
      {
        term: 'Premium',
        definition:
          'The upfront price of the option, paid whether or not the swaption is ever exercised.',
      },
      {
        term: 'Bermudan swaption',
        definition:
          'A swaption exercisable on any one of several agreed dates rather than on a single expiry date.',
      },
      {
        term: 'Implied volatility',
        definition:
          'The market’s expectation of how much the underlying swap rate will move, and the main driver of the premium besides the rate level.',
      },
    ],
    example: {
      title: 'Pre-hedging a bond issue',
      lines: [
        'A company plans to issue $100m of five-year fixed-rate debt in one year’s time.',
        'It buys a 1y into 5y payer swaption struck at 3.50% for a premium of $1.5m, or 1.5% of notional.',
        'A year later the five-year swap rate is 4.50%, so it exercises and pays 3.50% fixed.',
        'The saving is 1.00% of $100m — $1m a year for five years, or $5m before discounting.',
        'Net of the $1.5m premium the swaption has returned $3.5m against issuing unhedged.',
      ],
      takeaway:
        'The swaption turns next year’s rate into a worst case of 3.50% rather than a certainty. Had the five-year rate instead fallen to 2.50%, the company would have let the option lapse, lost the $1.5m premium and borrowed at the lower market rate.',
    },
    inPractice:
      'Corporate treasurers buy payer swaptions ahead of a planned bond issue to cap the coupon they will end up paying without committing to borrow at all, and insurers and pension funds buy receiver swaptions to protect against falling rates, which inflate the present value of the liabilities they owe. Dealers who sell them manage the resulting exposure on a volatility book, hedging the rate risk separately with swaps.',
    relatedProductIds: ['irs', 'capfloor', 'fxopt'],
    quiz: [
      {
        id: 'swaption-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The holder of a swaption must enter the underlying swap at expiry.',
        correctAnswer: false,
        explanation:
          'It is an option: the holder enters the swap only if it is worth doing, unlike a forward-starting swap.',
      },
      {
        id: 'swaption-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does a swaption give its holder?',
        options: [
          'The right to enter an agreed swap at a future date',
          'An obligation to enter an agreed swap at a future date',
          'The right to cancel a loan at a future date',
          'A fixed-rate loan starting at a future date',
        ],
        correctIndex: 0,
        explanation:
          'The strike, notional, tenor and index of the underlying swap are all set today; only the decision to use it is deferred.',
      },
      {
        id: 'swaption-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt: 'A payer swaption gives the right to pay the fixed rate.',
        correctAnswer: true,
        explanation:
          'The labels describe the fixed leg, so a payer pays fixed and receives floating — it benefits if rates rise.',
      },
      {
        id: 'swaption-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A fund expects swap rates to fall sharply. Which bought position gains most?',
        options: [
          'A bought payer swaption',
          'A sold receiver swaption',
          'A bought receiver swaption',
          'A swap paying fixed and receiving floating',
        ],
        correctIndex: 2,
        explanation:
          'The right to receive a fixed rate agreed today becomes valuable once the market rate is below it.',
      },
      {
        id: 'swaption-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Because a payer swaption gains as rates rise, it behaves economically like a put on the underlying bond.',
        correctAnswer: true,
        explanation:
          'Rising rates mean falling bond prices, so the exposure of a payer swaption is the same trade viewed from the price side.',
      },
      {
        id: 'swaption-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What separates physical settlement from cash settlement?',
        options: [
          'Physical settlement pays the option’s value in cash; cash settlement delivers the swap',
          'Physical settlement means the notional is exchanged at expiry',
          'Cash settlement is available only on Bermudan swaptions',
          'Physical settlement starts the actual swap; cash settlement pays its market value instead',
        ],
        correctIndex: 3,
        explanation:
          'Either way the holder captures the same value; only whether a live swap results differs.',
      },
      {
        id: 'swaption-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A European swaption can be exercised on any of several dates before expiry.',
        correctAnswer: false,
        explanation:
          'A European swaption has a single exercise date. The multi-date version is a Bermudan swaption.',
      },
      {
        id: 'swaption-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A company will issue fixed-rate debt in a year and fears rates will be higher by then, but may not issue at all. What fits?',
        options: [
          'Sell a payer swaption to earn the premium',
          'Buy a receiver swaption expiring in one year',
          'Enter a swap today receiving fixed for five years',
          'Buy a payer swaption expiring in one year',
        ],
        correctIndex: 3,
        explanation:
          'It caps the issue rate but leaves the company free to walk away, which a forward-starting swap would not.',
      },
      {
        id: 'swaption-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The premium is paid whether or not the swaption is ever exercised.',
        correctAnswer: true,
        explanation:
          'It is paid within days of the trade date and is sunk long before the exercise decision.',
      },
      {
        id: 'swaption-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What does "1y into 5y" describe?',
        options: [
          'A swap starting in five years and running for one year',
          'A one-year option on a five-year swap',
          'A five-year option on a one-year swap',
          'A swap with one year of fixed payments and five of floating',
        ],
        correctIndex: 1,
        explanation:
          'The first figure is the option expiry, the second the tenor of the swap it delivers.',
      },
      {
        id: 'swaption-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The seller of a swaption has a maximum loss equal to the premium received.',
        correctAnswer: false,
        explanation:
          'The premium caps the buyer’s loss, not the seller’s. The seller must enter the swap if exercised, so the exposure is open-ended.',
      },
      {
        id: 'swaption-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Over a month the forward swap rate barely moves but implied volatility falls sharply. What happens to a bought swaption?',
        options: [
          'It gains, because volatility does not affect swaption values',
          'It loses value, because the premium reflects volatility as well as the rate level',
          'It is unchanged, since the forward rate is unchanged',
          'It is unchanged until the expiry date arrives',
        ],
        correctIndex: 1,
        explanation:
          'A swaption can lose money even when rates stand still — volatility is a price driver in its own right.',
      },
    ],
  },
  {
    id: 'fra',
    categoryId: 'ir',
    name: 'Forward Rate Agreement',
    hook: 'Lock a rate for one future period',
    summary:
      'The simplest way to fix a rate for one future window. Two parties agree today what the interest rate will be on a notional amount over a period that starts later, and at fixing they settle the difference between that agreed rate and whatever the market rate turns out to be. Nothing is borrowed and nothing is lent — the FRA sits alongside a real loan or deposit and neutralises the rate on it for that one period.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A forward rate agreement fixes the interest rate on a notional deposit or loan for one specified future period. A "3x6" FRA covers a three-month period that begins three months from today. Both sides are committed from the moment the trade is struck: unlike an option, there is no choice to walk away at fixing.',
        callout:
          'The gap between the two figures is the length of the period covered: 6 − 3 = 3 months for a 3x6, and 7 − 1 = 6 months for a 1x7.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'On the fixing date the reference rate is compared with the agreed FRA rate, and the difference on the notional is settled as a single cash payment. No money is actually lent, and because settlement happens at the start of the period the amount is discounted back.',
        callout:
          'Settlement = (reference rate − contract rate) × notional × days/basis, divided by (1 + reference rate × days/basis). The discount factor uses the reference rate that has just fixed.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Borrowers lock in a future funding cost, lenders lock in a future return, and traders take a view on one point of the rate curve. An FRA is effectively a swap with a single period. The classic contract referenced a term rate published at the start of the period; since LIBOR was retired, much of that single-period risk is now expressed through short-term interest rate futures or a one-period overnight-index swap on SOFR, SONIA or €STR instead.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The "3x6" style notation, notional, contract rate, reference rate, fixing date and settlement date define the trade. The buyer of an FRA is the notional borrower and gains when rates rise; the seller is the notional lender and gains when they fall.',
        callout:
          'Day count follows the money market of the currency: ACT/360 for US dollars and euros, ACT/365 for sterling.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Only one period is covered, so hedging a rolling exposure needs a strip of FRAs or a swap instead. The payoff is linear, meaning a favourable rate move costs exactly as much as an adverse one saves, and the contract carries counterparty risk until settlement.',
      },
    ],
    keyTerms: [
      {
        term: 'FRA notation',
        definition:
          'The "3x6" form, giving the months from now to the start and to the end of the period covered.',
      },
      {
        term: 'Contract rate',
        definition:
          'The rate agreed on the trade date, against which the reference rate is compared at fixing.',
      },
      {
        term: 'Fixing date',
        definition:
          'The day the reference rate is observed and the settlement amount is calculated.',
      },
      {
        term: 'Buyer',
        definition:
          'The side that is the notional borrower, and so gains when the reference rate fixes above the contract rate.',
      },
      {
        term: 'Discounted settlement',
        definition:
          'The convention of paying the interest difference at the start of the period, reduced to its present value.',
      },
      {
        term: 'Strip of FRAs',
        definition:
          'A run of FRAs covering consecutive periods, used where a single contract would leave later periods unhedged.',
      },
    ],
    example: {
      title: 'A borrower locks a three-month rate',
      lines: [
        'A company knows it will borrow $50m for three months, starting three months from now.',
        'It buys a 3x6 FRA on $50m at 4.00%, making it the notional borrower.',
        'At fixing the reference rate sets at 4.60%, 0.60% above the contract rate.',
        'The interest difference over the 91-day period is $50m × 0.60% × 91/360 = $75,833.',
        'Settling at the start of the period discounts it: $75,833 ÷ (1 + 4.60% × 91/360) = $74,962.',
      ],
      takeaway:
        'The company still pays 4.60% on its actual loan, but the $74,962 received up front is worth $75,833 by the date that interest falls due if held at the same 4.60%. Net, it has borrowed at the 4.00% it fixed.',
    },
    inPractice:
      'Bank treasury and asset–liability desks use FRAs to square a known funding gap — a deposit maturing in three months against a loan that runs for six — and corporate treasurers use them when the date and size of a future drawdown are already fixed. Rate traders use them to take a view on a single point of the curve rather than on its whole shape.',
    relatedProductIds: ['irs', 'capfloor', 'fxfwd'],
    quiz: [
      {
        id: 'fra-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'An FRA fixes the interest rate for a single future period.',
        correctAnswer: true,
        explanation:
          'That single-period nature is what separates an FRA from a swap, which covers a run of periods.',
      },
      {
        id: 'fra-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What period does a 3x6 FRA cover?',
        options: [
          'Three months, starting three months from now',
          'Six months, starting three months from now',
          'Three months, starting six months from now',
          'Six months, starting today',
        ],
        correctIndex: 0,
        explanation:
          'The figures are the months to the start and to the end, so the period runs from month three to month six.',
      },
      {
        id: 'fra-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'How long is the period covered by a 1x7 FRA?',
        options: ['One month', 'Six months', 'Seven months', 'Eight months'],
        correctIndex: 1,
        explanation:
          'Subtract the two figures: 7 − 1 = 6, so it covers six months beginning one month from now.',
      },
      {
        id: 'fra-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt: 'The notional amount is actually lent between the parties.',
        correctAnswer: false,
        explanation:
          'No principal changes hands — only the interest difference is settled in cash.',
      },
      {
        id: 'fra-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'On a 3x6 FRA on $50m at 4.00%, the reference rate fixes at 4.60% for a 91-day period on ACT/360. What is the interest difference before discounting?',
        options: ['$300,000', '$75,833', '$151,667', '$18,958'],
        correctIndex: 1,
        explanation:
          '0.60% of $50m is $300,000 for a full year; scaled by 91/360 that is $75,833 for the period.',
      },
      {
        id: 'fra-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The settlement amount is discounted because it is paid at the start of the period it covers.',
        correctAnswer: true,
        explanation:
          'The interest it replaces would be paid at the end, so the payment is reduced to its present value using the rate that has just fixed.',
      },
      {
        id: 'fra-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A treasurer knows the company draws a loan in three months and fears rates will rise. What fits?',
        options: [
          'Sell an FRA covering that period',
          'Buy a ten-year cap on the loan',
          'Nothing — an FRA can only cover a period already under way',
          'Buy an FRA covering that period',
        ],
        correctIndex: 3,
        explanation:
          'The buyer is the notional borrower and receives the difference when the reference rate fixes above the contract rate.',
      },
      {
        id: 'fra-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'An FRA is most accurately described as which of these?',
        options: [
          'A swap with a single period',
          'An option on a swap',
          'A floating-rate loan with a fixed margin',
          'A cap struck at the contract rate',
        ],
        correctIndex: 0,
        explanation:
          'It has the same fixed-against-floating economics as a swap, applied to one period only.',
      },
      {
        id: 'fra-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The seller of an FRA gains when the reference rate fixes above the contract rate.',
        correctAnswer: false,
        explanation:
          'The seller is the notional lender and gains when rates fall. It is the buyer who gains when rates rise.',
      },
      {
        id: 'fra-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'Which day count applies to a US dollar or euro money market rate?',
        options: ['30/360', 'ACT/365', 'ACT/360', 'ACT/ACT'],
        correctIndex: 2,
        explanation:
          'Dollars and euros settle on ACT/360; sterling is the common exception, using ACT/365.',
      },
      {
        id: 'fra-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'An FRA gives the buyer the right, but not the obligation, to borrow at the contract rate.',
        correctAnswer: false,
        explanation:
          'An FRA is a firm commitment, not an option — both sides are bound to settle whichever way the rate moves.',
      },
      {
        id: 'fra-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Hedging a two-year rolling exposure needs a strip of FRAs rather than one contract.',
        correctAnswer: true,
        explanation:
          'Each FRA covers one period, so consecutive contracts — or a swap — are needed to cover a longer horizon.',
      },
    ],
  },
  {
    id: 'capfloor',
    categoryId: 'ir',
    name: 'Cap and Floor',
    hook: 'Set a ceiling or floor on a floating rate',
    summary:
      'Insurance on a floating rate. A cap is a strip of options that pays the holder whenever the reference rate sets above an agreed strike, so the reference rate a borrower effectively pays is capped at that level, with their credit margin still payable on top; a floor does the mirror image for someone receiving floating income. Unlike a swap, which fixes the rate in both directions, the buyer pays a premium up front and keeps the benefit if rates move their way.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A cap is a series of options that pays out whenever a floating reference rate rises above a strike; a floor pays out when it falls below. Each individual option in the series is a caplet, or a floorlet, and the price of the cap is simply the sum of its caplets.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'On every reset date the reference rate is compared with the strike. If a cap struck at 5% sees the rate set at 5.75%, the holder receives 0.75% on the notional for that period; if the rate sets below the strike, that caplet simply expires worthless.',
        callout:
          'A caplet is measured against the rate for its period but paid at the end of it, like the loan interest it offsets. On SOFR and SONIA caps the rate compared with the strike is the overnight rate compounded across the period, so it is only known once the period has run.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A borrower on floating-rate debt buys a cap to limit the worst-case interest bill while still benefiting if rates fall — something a swap cannot offer. An investor receiving floating income buys a floor to protect a minimum yield. The premium is the price of that asymmetry: a bought cap can only ever pay the holder, never cost them more than the premium.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, caplets and floorlets, notional, reset frequency, tenor and premium. Combining a bought cap with a sold floor creates a collar, which cuts the premium in exchange for giving up the benefit of rates falling below the floor.',
        callout:
          'A bought cap and a sold floor at the same strike, on the same schedule, together pay exactly what a swap paying that fixed rate pays. That identity is how dealers cross-check cap and swap pricing.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium is paid upfront and is lost entirely if the rate never breaches the strike. Sellers of caps and floors face open-ended exposure, and a collar’s sold leg reintroduces downside once the rate passes through the floor.',
        callout:
          'Floating-rate loan agreements often contain a clause holding the reference rate at no less than zero. A borrower on such a loan has effectively sold a floor struck at 0% as part of the loan itself.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike',
        definition:
          'The rate above which a cap begins to pay out, or below which a floor does.',
      },
      {
        term: 'Caplet',
        definition:
          'One option within a cap, covering a single reset period of the underlying schedule.',
      },
      {
        term: 'Floorlet',
        definition:
          'One option within a floor, covering a single reset period of the underlying schedule.',
      },
      {
        term: 'Collar',
        definition:
          'A bought cap combined with a sold floor, which cuts the net premium in exchange for giving up gains below the floor.',
      },
      {
        term: 'Premium',
        definition:
          'The upfront cost of the cap or floor, paid whether or not any caplet ever pays out.',
      },
      {
        term: 'Reset frequency',
        definition:
          'How often the reference rate is compared with the strike, which also sets how many caplets the strip contains.',
      },
    ],
    example: {
      title: 'Capping a floating-rate loan',
      lines: [
        'A company borrows £25m at SONIA + 1.50%, reset and paid quarterly.',
        'It buys a three-year cap on £25m struck at 4.50% for a premium of £450,000.',
        'In one 92-day quarter the reference rate sets at 5.30%, 0.80% above the strike.',
        'That caplet pays 0.80% × £25m × 92/365 = £50,411 on sterling ACT/365.',
        'Loan interest for the quarter is 6.80% × £25m × 92/365 = £428,493, so the net cost is £378,082.',
      ],
      takeaway:
        'That net £378,082 is exactly 6.00% for the quarter — the 4.50% strike plus the 1.50% margin. In any quarter where the rate sets below 4.50% the cap pays nothing and the loan simply costs less, but the £450,000 premium is spent either way.',
    },
    inPractice:
      'Property developers and leveraged borrowers are frequently required by their lenders to buy a cap as a condition of a floating-rate loan, so the interest bill can be stressed to a known maximum. Funds holding floating-rate notes buy floors to defend a minimum coupon, and treasurers who find the cap premium too expensive sell a floor against it to build a cheaper collar.',
    relatedProductIds: ['irs', 'swaption', 'eqopt'],
    quiz: [
      {
        id: 'capfloor-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A cap pays out when the floating rate rises above the strike.',
        correctAnswer: true,
        explanation:
          'That payout is what limits the borrower’s effective interest cost to the strike plus their margin.',
      },
      {
        id: 'capfloor-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What is a caplet?',
        options: [
          'One option in the series that makes up a cap',
          'The premium paid for a cap',
          'A cap written at an unusually low strike',
          'The maximum amount a cap can ever pay',
        ],
        correctIndex: 0,
        explanation:
          'A cap is a strip of caplets, one per reset period, and its price is the sum of them.',
      },
      {
        id: 'capfloor-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A cap on £25m struck at 4.50% sees the rate set at 5.30% for a 92-day quarter on ACT/365. What does that caplet pay?',
        options: ['£200,000', '£333,973', '£50,411', '£12,603'],
        correctIndex: 2,
        explanation:
          'Only the 0.80% excess over the strike is paid: 0.80% × £25m × 92/365 = £50,411.',
      },
      {
        id: 'capfloor-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'If the rate sets below the strike, the caplet still pays a reduced amount.',
        correctAnswer: false,
        explanation:
          'It expires worthless. A caplet pays only the excess of the rate over the strike, and never a negative amount.',
      },
      {
        id: 'capfloor-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'On a SONIA cap, what is compared with the strike for a given period?',
        options: [
          'The overnight rate observed on the first day of the period',
          'The overnight rate compounded across the period',
          'The borrower’s own funding rate for the period',
          'The average of the strike and the previous period’s rate',
        ],
        correctIndex: 1,
        explanation:
          'Overnight benchmarks compound in arrears, so the rate for the period is only known at its end.',
      },
      {
        id: 'capfloor-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Buying a cap forces the borrower to give up the benefit of falling rates.',
        correctAnswer: false,
        explanation:
          'Unlike a swap, a cap keeps the downside benefit — that asymmetry is exactly what the premium buys.',
      },
      {
        id: 'capfloor-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'An investor holding a floating-rate note wants to protect a minimum yield. What should they buy?',
        options: [
          'A cap',
          'A collar with the cap sold',
          'A swap paying fixed',
          'A floor',
        ],
        correctIndex: 3,
        explanation:
          'A floor pays the shortfall whenever the reference rate sets below the strike, defending the coupon.',
      },
      {
        id: 'capfloor-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'How is a collar built by a floating-rate borrower?',
        options: [
          'By buying a cap and buying a floor',
          'By selling a cap and selling a floor',
          'By buying a cap and selling a floor',
          'By buying two caps at different strikes',
        ],
        correctIndex: 2,
        explanation:
          'The premium received on the sold floor offsets the cost of the cap, at the price of giving up gains below the floor strike.',
      },
      {
        id: 'capfloor-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'A bought cap and a sold floor at the same strike, on the same schedule, together match paying fixed on a swap at that strike.',
        correctAnswer: true,
        explanation:
          'Above the strike the cap pays you; below it the floor pays away. Combined, they reproduce a fixed-rate payer swap.',
      },
      {
        id: 'capfloor-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A borrower buys a cap and the rate never rises above the strike. What has the cap cost them?',
        options: [
          'Nothing, since the premium is refunded when no caplet pays',
          'The premium paid upfront',
          'The notional amount of the cap',
          'The gap between the strike and the average rate over the period',
        ],
        correctIndex: 1,
        explanation:
          'The premium is sunk. Nothing more is owed, which is the point of buying rather than selling the option.',
      },
      {
        id: 'capfloor-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The seller of a cap has a known maximum loss, capped at the premium received.',
        correctAnswer: false,
        explanation:
          'The seller’s exposure is open-ended: the higher the rate sets above the strike, the more each caplet pays away.',
      },
      {
        id: 'capfloor-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Under a collar, the borrower stops benefiting from falling rates once the rate drops below the floor strike.',
        correctAnswer: true,
        explanation:
          'The sold floor starts paying away at that point, which is the cost of the cheaper premium.',
      },
    ],
  },
];
