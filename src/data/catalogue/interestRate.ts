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
    depth: {
      sections: [
        {
          title: 'Pricing it from the curve',
          content:
            'The par swap rate is the fixed rate that makes the two legs worth the same today: the present value of the expected floating payments, divided by the annuity — the sum of the discounted accrual factors. Nothing about that is a forecast. It is arithmetic on a curve, and the curve is built from the most liquid instruments at each maturity: overnight index swaps at the front, futures and forward rate agreements through the middle years, and par swap quotes beyond them. The bootstrap is constrained so that every instrument used reprices exactly to the level it was quoted at.',
          callout:
            'The annuity is the same quantity as PV01. That is why a ten-year swap has roughly eight times the risk of a one-year swap on the same notional, and why the hedge ratio between them is not one to one.',
        },
        {
          title: 'Two curves, not one',
          content:
            'A collateralised swap is discounted at the rate paid on the collateral — the overnight risk-free rate of the currency the collateral is posted in — while its floating leg is projected off the curve of the index it actually references. Same trade, two curves, doing two different jobs. Before 2008 a single curve did both, because the gap between an interbank rate and an overnight one was small enough to ignore. It stopped being small, and the industry rebuilt its valuation around the distinction.',
          callout:
            'The collateral agreement therefore sets the discount rate, which means two otherwise identical swaps under different agreements are worth different amounts. That observation is where CSA discounting, collateral optionality and much of the XVA literature begin.',
        },
        {
          title: 'Carry, roll-down and the swap spread',
          content:
            'Holding a swap earns or costs two things beyond any move in rates. Carry is the difference between the fixed rate and the floating rate actually setting over the period. Roll-down is what the position is worth as it ages into a different point on the curve, which on an upward-sloping curve favours the receiver. Separately, the swap spread — the swap rate less the government bond yield of the same maturity — can and does go negative: a swap is a collateralised exposure requiring no balance sheet, while holding the bond requires funding it and carrying it on one.',
          callout:
            'Long-dated dollar swap spreads went negative in 2015 and stayed there, which is only a puzzle if you assume a swap and a bond are two ways of holding the same risk.',
        },
      ],
      quiz: [
        {
          id: 'irs-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is the par swap rate?',
          options: [
            'The forecast of the average floating rate over the swap',
            'The fixed rate that makes the two legs worth the same today',
            'The rate at which the swap can be unwound at no cost',
            'The highest rate a dealer will quote for that maturity',
          ],
          correctIndex: 1,
          explanation:
            'It is arithmetic on a curve, not a forecast: the present value of the expected floating payments divided by the annuity.',
        },
        {
          id: 'irs-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'A curve bootstrap is constrained so that every instrument used reprices to the level it was quoted at.',
          correctAnswer: true,
          explanation:
            'Otherwise the curve would disagree with the market it was built from, and every valuation drawn off it would inherit that disagreement.',
        },
        {
          id: 'irs-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Which instruments typically anchor the front of a modern swap curve?',
          options: [
            'Overnight index swaps',
            'Ten-year par swaps',
            'Corporate bond yields',
            'Inflation swaps',
          ],
          correctIndex: 0,
          explanation:
            'Futures and forward rate agreements carry the middle years, and par swap quotes take over further out.',
        },
        {
          id: 'irs-d4',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A collateralised swap is discounted using the rate paid on its collateral.',
          correctAnswer: true,
          explanation:
            'The collateral is what funds the position, so the rate paid on it is the relevant discount rate.',
        },
        {
          id: 'irs-d5',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Why does a swap need two curves rather than one?',
          options: [
            'Because the two legs settle on different dates',
            'Because projection follows the index referenced and discounting follows the collateral',
            'Because one curve is used for pricing and one for risk',
            'Because regulators require a second curve for validation',
          ],
          correctIndex: 1,
          explanation:
            'One curve did both jobs before 2008, on the assumption that the difference between them was noise. It was not.',
        },
        {
          id: 'irs-d6',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Two identical swaps under different collateral agreements are worth the same amount.',
          correctAnswer: false,
          explanation:
            'The agreement sets the discount rate, so they are not. That is the observation the whole XVA literature is built on.',
        },
        {
          id: 'irs-d7',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What is carry on a swap position?',
          options: [
            'The bid-offer paid on entering it',
            'The difference between the fixed rate and the floating rate setting over the period',
            'The change in value from the curve shifting',
            'The collateral posted against it',
          ],
          correctIndex: 1,
          explanation:
            'It accrues whether or not the curve moves, which is why a position can be right on direction and still lose.',
        },
        {
          id: 'irs-d8',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'On an upward-sloping curve, roll-down favours the receiver of fixed.',
          correctAnswer: true,
          explanation:
            'As the position ages it occupies a shorter, lower point on the curve, and the fixed rate it receives was set higher up.',
        },
        {
          id: 'irs-d9',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'Why can a swap spread be negative?',
          options: [
            'Because swaps are riskier than government bonds',
            'Because a collateralised swap needs no balance sheet while holding the bond does',
            'Because swap rates are quoted net of fees',
            'Because government bonds pay no coupon',
          ],
          correctIndex: 1,
          explanation:
            'It is only a puzzle if you assume a swap and a bond are two ways of holding the same risk. They are not.',
        },
        {
          id: 'irs-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Long-dated dollar swap spreads have traded persistently negative.',
          correctAnswer: true,
          explanation:
            'They went negative in 2015 and stayed there, for the funding and balance sheet reasons above.',
        },
        {
          id: 'irs-d11',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'The annuity used to price a swap is the same quantity as which risk measure?',
          options: ['Gamma', 'PV01', 'Vega', 'Jump to default'],
          correctIndex: 1,
          explanation:
            'Which is why swap risk grows with maturity and why the hedge ratio between two maturities is the ratio of their annuities.',
        },
        {
          id: 'irs-d12',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'Pricing a swap requires forecasting where interest rates will actually go.',
          correctAnswer: false,
          explanation:
            'It requires a curve. The forward rates are read off it, and whether they turn out to be right is a different question entirely.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'Reading the grid',
          content:
            'Swaptions are quoted on a grid with two maturities, and confusing them is the standard beginner’s error. "Five year into ten year" — written 5y10y — means an option expiring in five years on a swap that then runs for ten. The first number is the option; the second is the swap it delivers. Both matter and they matter differently: the expiry drives the option’s time value, and the tenor drives how much interest rate risk arrives if it is exercised. A 1y10y and a 10y1y sit at opposite corners of the same grid and behave nothing alike.',
          callout:
            'Vega concentrates in long expiries; the delta that arrives on exercise concentrates in long tenors. A desk reads the grid in both directions for that reason.',
        },
        {
          title: 'Black, and then Bachelier',
          content:
            'Rate options were quoted for decades in lognormal volatility, which assumes the underlying rate cannot go below zero — a harmless assumption until several major currencies had negative rates and the formula stopped returning a number. The market moved to normal, or Bachelier, volatility, which describes moves in absolute terms and stays defined through and below zero. It is a change of quoting language rather than of economics, but it changes every number on the screen, and comparing a normal volatility with a lognormal one without converting is a real and expensive mistake.',
          callout:
            'Normal volatility is quoted in basis points a year rather than as a percentage. A quote of 80 means roughly 80 basis points of annual standard deviation, not 80%.',
        },
        {
          title: 'Cash settlement and its annuity',
          content:
            'A physically settled swaption delivers the actual swap. A cash settled one pays the value of that swap instead — and to do that, the parties must agree what the swap is worth without either of them holding it. The convention discounts the payoff using an annuity computed from the swap rate itself rather than from the full curve, which is simple, unambiguous and slightly wrong. The difference between the two conventions is small, well understood, and has its own adjustment, which is a good example of how a market handles a known approximation: not by fixing it, but by pricing it.',
        },
      ],
      quiz: [
        {
          id: 'swaption-d1',
          kind: 'choice',
          step: 1,
          difficulty: 'intermediate',
          prompt: 'What does a 5y10y swaption mean?',
          options: [
            'An option expiring in ten years on a five-year swap',
            'An option expiring in five years on a ten-year swap',
            'A five-year option on a swap of any tenor',
            'A swap with an option to extend by ten years',
          ],
          correctIndex: 1,
          explanation:
            'First number the option, second the swap it delivers. Reversing them is the standard beginner’s error.',
        },
        {
          id: 'swaption-d2',
          kind: 'boolean',
          step: 1,
          difficulty: 'intermediate',
          prompt: 'A 1y10y and a 10y1y swaption behave similarly.',
          correctAnswer: false,
          explanation:
            'They sit at opposite corners of the grid: one is a short option on a long swap, the other a long option on a short one.',
        },
        {
          id: 'swaption-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Which part of the grid carries the most vega?',
          options: [
            'Long expiries',
            'Long tenors',
            'Short expiries',
            'At-the-money strikes only',
          ],
          correctIndex: 0,
          explanation:
            'Expiry drives time value and therefore volatility exposure; tenor drives the delta that arrives on exercise.',
        },
        {
          id: 'swaption-d4',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'The tenor of the underlying swap determines how much interest rate risk arrives if the option is exercised.',
          correctAnswer: true,
          explanation:
            'A ten-year swap delivered into a book is roughly eight times the DV01 of a one-year one on the same notional.',
        },
        {
          id: 'swaption-d5',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Why did the market move from lognormal to normal volatility?',
          options: [
            'Normal volatility produces smaller numbers',
            'Lognormal volatility assumes rates cannot go below zero, and they did',
            'Clearing houses require normal volatility',
            'Normal volatility removes the need for a strike',
          ],
          correctIndex: 1,
          explanation:
            'The formula stopped returning a number for several major currencies, which is a decisive kind of model failure.',
        },
        {
          id: 'swaption-d6',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Normal volatility is quoted in basis points a year rather than as a percentage.',
          correctAnswer: true,
          explanation:
            'A quote of 80 means roughly 80 basis points of annual standard deviation — not 80 percent.',
        },
        {
          id: 'swaption-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'A normal volatility and a lognormal volatility can be compared directly.',
          correctAnswer: false,
          explanation:
            'They are different quoting languages for the same option, and comparing them unconverted is an expensive mistake.',
        },
        {
          id: 'swaption-d8',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What does a physically settled swaption deliver on exercise?',
          options: [
            'The cash value of the swap',
            'The actual swap',
            'The underlying bond',
            'A forward starting swap one period later',
          ],
          correctIndex: 1,
          explanation:
            'Cash settlement pays the value instead, which requires the parties to agree what that value is.',
        },
        {
          id: 'swaption-d9',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'How does the cash settlement convention compute the payoff?',
          options: [
            'Using an annuity derived from the swap rate itself',
            'Using the full discount curve at the time of exercise',
            'Using the average of dealer quotes',
            'Using the notional multiplied by the strike',
          ],
          correctIndex: 0,
          explanation:
            'Simple and unambiguous, and slightly wrong — which the market handles by pricing the difference rather than fixing it.',
        },
        {
          id: 'swaption-d10',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'The cash and physical settlement conventions give exactly the same value.',
          correctAnswer: false,
          explanation:
            'They differ by a small, well-understood amount that carries its own adjustment.',
        },
        {
          id: 'swaption-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why does a desk read the swaption grid in both directions?',
          options: [
            'Because expiry and tenor carry different risks',
            'Because the grid is quoted twice, once per counterparty',
            'Because strikes are only available diagonally',
            'Because settlement conventions vary by row',
          ],
          correctIndex: 0,
          explanation:
            'Vega lives in the expiries and delivered delta lives in the tenors.',
        },
        {
          id: 'swaption-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A change of volatility quoting convention changes the economics of the option.',
          correctAnswer: false,
          explanation:
            'It changes every number on the screen and none of the payoffs. The option is the same; the language for it is not.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'Against a futures contract',
          content:
            'A short-term interest rate future and a forward rate agreement cover the same exposure and settle differently, and that difference has a price. The future is margined daily, so its profit and loss is realised as the rate moves; the agreement settles once. Daily settlement works in the holder’s favour in a way that is systematic rather than lucky: a short future receives margin as rates rise, and rates rising is exactly when that cash can be reinvested at a better return. The compensation for it is the convexity adjustment, which is why the futures rate sits slightly above the equivalent forward rate.',
          callout:
            'Inside a year the adjustment is a fraction of a basis point and can be waved away. By five years it is not, which is why a curve is built from futures at the front and from swaps beyond them.',
        },
        {
          title: 'Settled at the start, discounted',
          content:
            'The interest period an agreement covers begins on its settlement date, not on its trade date, so the payment is made before the interest it represents would have accrued. It is therefore discounted: the difference between the reference rate and the contract rate, applied over the period, divided by one plus the reference rate over that same period. The consequence is quiet but real — the payoff is not quite linear in the rate, because the discount factor moves with the very rate that determines the payment.',
          callout:
            'Two agreements with equal and opposite rate exposure do not net to exactly zero once discounting is applied. On a large book that residual is a position.',
        },
        {
          title: 'A strip is a curve',
          content:
            'Consecutive agreements covering successive periods make a strip, and a strip of rates is the front of a curve stated as instruments. That is how the near years of a curve are built, which makes the marks on those contracts load-bearing: every discount factor beyond that segment is derived through it, so a single badly marked agreement moves the valuation of everything longer, in the same direction, every day.',
        },
      ],
      quiz: [
        {
          id: 'fra-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Why does a futures rate sit above the equivalent forward rate?',
          options: [
            'Futures carry credit risk that forwards do not',
            'Daily margin works systematically in the holder’s favour, and the adjustment compensates for it',
            'Futures are quoted net of exchange fees',
            'Forwards settle at the end of the interest period',
          ],
          correctIndex: 1,
          explanation:
            'The convexity adjustment is the price of the difference between settling daily and settling once.',
        },
        {
          id: 'fra-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'The convexity adjustment grows with maturity and with volatility.',
          correctAnswer: true,
          explanation:
            'Which is why it can be ignored inside a year and cannot be at five, and why curves switch instruments as they extend.',
        },
        {
          id: 'fra-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'A short futures position receives margin when rates rise.',
          correctAnswer: true,
          explanation:
            'And that is precisely when the cash received can be reinvested at a higher rate — the systematic advantage the adjustment prices.',
        },
        {
          id: 'fra-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'When is a forward rate agreement settled?',
          options: [
            'At the end of the interest period it covers',
            'At the start of the interest period it covers',
            'On the trade date',
            'On the same date as the underlying loan matures',
          ],
          correctIndex: 1,
          explanation:
            'The payment is made before the interest would have accrued, which is why it is discounted.',
        },
        {
          id: 'fra-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'How is the settlement amount discounted?',
          options: [
            'At a fixed rate agreed at trade date',
            'At the overnight rate on the settlement date',
            'By dividing by one plus the reference rate over the period',
            'It is not discounted',
          ],
          correctIndex: 2,
          explanation:
            'The same rate both determines the payment and discounts it, which is what makes the payoff slightly non-linear.',
        },
        {
          id: 'fra-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Two agreements with equal and opposite rate exposure net to exactly zero.',
          correctAnswer: false,
          explanation:
            'Not once discounting is applied. The residual is small per trade and a position across a book.',
        },
        {
          id: 'fra-d7',
          kind: 'boolean',
          step: 3,
          difficulty: 'foundational',
          prompt:
            'The payoff of a forward rate agreement is exactly linear in the reference rate.',
          correctAnswer: false,
          explanation:
            'The discount factor moves with the same rate that sets the payment, so there is a small curvature in it.',
        },
        {
          id: 'fra-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is a strip of forward rate agreements?',
          options: [
            'Several agreements on the same period with different counterparties',
            'Consecutive agreements covering successive periods',
            'An agreement combined with an option',
            'A pair of offsetting agreements',
          ],
          correctIndex: 1,
          explanation:
            'It is the front of a curve expressed as instruments, which is how the near years get built.',
        },
        {
          id: 'fra-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A single badly marked agreement in a strip affects the valuation of longer-dated positions.',
          correctAnswer: true,
          explanation:
            'Every discount factor beyond that segment is derived through it, so the error propagates in one direction, daily.',
        },
        {
          id: 'fra-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Why is a curve typically built from futures at the front and swaps further out?',
          options: [
            'Futures are cheaper to trade at every maturity',
            'The convexity adjustment is negligible at the front and material further out',
            'Swaps do not exist at short maturities',
            'Regulators require it',
          ],
          correctIndex: 1,
          explanation:
            'Liquidity and the size of the adjustment point the same way, which is convenient rather than coincidental.',
        },
        {
          id: 'fra-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'A desk hedges an agreement with the equivalent futures position and treats the two as identical. What has it kept?',
          options: [
            'The convexity difference between them',
            'The credit risk of the counterparty',
            'The full directional exposure',
            'Nothing — the hedge is exact',
          ],
          correctIndex: 0,
          explanation:
            'Small on one trade and a real book-level exposure once the maturities are long and the position is large.',
        },
        {
          id: 'fra-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Marks on front-end instruments matter more than their size suggests.',
          correctAnswer: true,
          explanation:
            'They are load-bearing: the rest of the curve is derived through them.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'A cap is a strip of caplets',
          content:
            'A cap is not one option. It is a series of them — one per interest period, each an option on the forward rate for that period, each expiring on its own fixing date. The cap’s price is the sum of those caplet prices, and nothing about the structure requires them to share a volatility. That matters the moment you hedge: the exposure is spread across a series of forward rates, not concentrated on one, so a hedge sized against a single rate covers only the part of the strip that references it.',
          callout:
            'The first period is usually excluded, because its rate has already fixed and an option on a known number is not an option.',
        },
        {
          title: 'Flat volatility and stripped volatility',
          content:
            'The market quotes a cap with one volatility number — the flat volatility that, applied to every caplet at once, reprices the whole strip. It is a quoting convention, not a description of any single caplet. Extracting the individual caplet volatilities from a sequence of cap quotes is called stripping, and the stripped numbers differ from the flat ones and from each other. A desk pricing a cap can work in flat terms; a desk hedging one period of it cannot.',
          callout:
            'Since rates can be negative, these options are normally quoted in normal — Bachelier — volatility rather than lognormal, which stays defined at and below zero.',
        },
        {
          title: 'Cap minus floor is a swap',
          content:
            'Buying a cap and selling a floor at the same strike, on the same schedule, gives exactly the payoff of a payer swap struck at that rate: you pay fixed and receive floating in every state of the world. That identity is the arbitrage anchor of the market. It fixes the relationship between three quoted things — the cap, the floor and the swap — so a surface that violates it is wrong, and it gives a desk a way to check a price without a model.',
          callout:
            'It also means a collar (long cap, short floor at a lower strike) is a swap with the gap between the two strikes left unhedged.',
        },
      ],
      quiz: [
        {
          id: 'capfloor-d1',
          kind: 'boolean',
          step: 1,
          difficulty: 'foundational',
          prompt: 'A cap is a single option on an interest rate.',
          correctAnswer: false,
          explanation:
            'It is a strip of caplets, one per interest period, each expiring on its own fixing date.',
        },
        {
          id: 'capfloor-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is the price of a cap?',
          options: [
            'The price of the longest-dated caplet',
            'The sum of the prices of its caplets',
            'The average caplet price times the number of periods',
            'The price of a swaption with the same maturity',
          ],
          correctIndex: 1,
          explanation:
            'And nothing requires those caplets to share a volatility, which is where flat quoting becomes a convention rather than a fact.',
        },
        {
          id: 'capfloor-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'The first period of a cap is usually excluded from the strip.',
          correctAnswer: true,
          explanation:
            'Its rate has already fixed, and an option on a known number has no optionality left in it.',
        },
        {
          id: 'capfloor-d4',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What is a flat cap volatility?',
          options: [
            'The volatility of the underlying swap rate',
            'The single number that, applied to every caplet, reprices the whole strip',
            'The average of the caplet volatilities',
            'The volatility observed over the past year',
          ],
          correctIndex: 1,
          explanation:
            'It is a quoting convention. No individual caplet necessarily trades at it.',
        },
        {
          id: 'capfloor-d5',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Stripped caplet volatilities generally differ from the flat volatility quoted for the cap.',
          correctAnswer: true,
          explanation:
            'They differ from it and from each other, which is why hedging a single period needs the stripped numbers.',
        },
        {
          id: 'capfloor-d6',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Why are rate options commonly quoted in normal volatility?',
          options: [
            'It produces smaller numbers',
            'It remains defined when rates are at or below zero',
            'It is required by clearing houses',
            'It removes the need for a strike',
          ],
          correctIndex: 1,
          explanation:
            'Lognormal volatility assumes a rate cannot go negative, which stopped being a safe assumption.',
        },
        {
          id: 'capfloor-d7',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'Long a cap and short a floor at the same strike and schedule is equivalent to what?',
          options: [
            'A receiver swap at that strike',
            'A payer swap at that strike',
            'A straddle on the swap rate',
            'A zero-cost collar',
          ],
          correctIndex: 1,
          explanation:
            'You pay fixed and receive floating in every state of the world — that is a payer swap.',
        },
        {
          id: 'capfloor-d8',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'The cap-floor-swap identity lets a desk check a quote without a model.',
          correctAnswer: true,
          explanation:
            'It ties three quoted instruments together, so a surface that violates it is wrong regardless of what model produced it.',
        },
        {
          id: 'capfloor-d9',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What is a collar, in these terms?',
          options: [
            'A swap with the gap between two strikes left unhedged',
            'A cap and a floor at the same strike',
            'Two caps at different maturities',
            'A cap financed by selling a swaption',
          ],
          correctIndex: 0,
          explanation:
            'Long cap, short floor at a lower strike: a payer swap everywhere except between the strikes.',
        },
        {
          id: 'capfloor-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A hedge sized against a single forward rate covers the whole cap.',
          correctAnswer: false,
          explanation:
            'The exposure is spread across the strip, so such a hedge covers only the period that references that rate.',
        },
        {
          id: 'capfloor-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Two caps with the same flat volatility can imply different caplet volatilities for the same period.',
          correctAnswer: true,
          explanation:
            'Different maturities strip differently, which is exactly why the flat number cannot be used to hedge a single period.',
        },
        {
          id: 'capfloor-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What is the practical use of the strip view of a cap?',
          options: [
            'It reduces the premium payable',
            'It shows where the exposure actually sits, period by period',
            'It removes the need for a volatility input',
            'It converts the cap into a swaption',
          ],
          correctIndex: 1,
          explanation:
            'One number in a quote, a series of exposures underneath it — and the hedge follows the series.',
        },
      ],
    },
  },
  {
    id: 'infswap',
    categoryId: 'ir',
    name: 'Inflation Swap',
    hook: 'Swap a fixed rate for realised inflation',
    summary:
      'The one product here whose underlying is a government statistic rather than a market price. One party pays a fixed rate agreed today, the other pays whatever a published price index — UK RPI, euro HICP excluding tobacco, US CPI — actually turns out to have done. That fixed rate is therefore a price for inflation itself, and the standard version settles the whole thing in a single payment at maturity rather than netting period by period, which makes it behave quite unlike the swaps that come before it.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One party pays a fixed rate and the other pays the realised change in a published price index, on a notional that is never exchanged. The index is the underlying: UK RPI, euro HICP excluding tobacco, or US CPI. Nothing in the contract references a borrowing rate at all, so an inflation swap prices something no other swap in this catalogue touches.',
        callout:
          'The index is a statistic, not a quote. The Office for National Statistics compiles UK RPI once a month and publishes it a few weeks after the month it measures, and it is that published figure — not a dealer price — that decides what the swap pays.',
      },
      {
        step: 2,
        title: 'How it settles',
        content:
          'The standard form is zero-coupon: nothing changes hands until maturity, when a single netted payment is made. The inflation leg owes the notional times the index ratio less one, or I(T) ÷ I(0) − 1; the fixed leg owes the notional times (1 + r)^T − 1, the fixed rate compounded over the same years. A year-on-year inflation swap does pay on a schedule, exchanging each year’s change in the index against a fixed rate, but the zero-coupon version is the one that trades in size.',
        callout:
          'The fixed leg compounds — it is not the rate multiplied by the years. Ten years at 3.20% is (1.032)^10 − 1 = 37.02% of notional, against 32.0% if the rate were simply added up.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A defined benefit pension scheme owes payments that rise with an inflation index, so it receives inflation and pays fixed, turning an unknown liability into a known one. That trade is the core of liability-driven investment and the reason a large share of pension flow reaches a rates desk at all. Natural payers are scarcer: utilities and infrastructure operators whose regulated revenues are index-linked, and governments issuing index-linked bonds. The fixed rate is worth reading in its own right, because it is the breakeven — the average annual inflation that would make both legs settle at the same number. Anyone who thinks inflation will beat it can receive inflation as a view rather than as a hedge.',
        callout:
          'The same breakeven can be read off the bond market, as the gap between a nominal gilt yield and the real yield on an index-linked gilt of the same maturity. It is not a pure forecast: it also carries an inflation risk premium, and in the UK a persistent demand from pension schemes to receive inflation with few natural payers opposite them.',
      },
      {
        step: 4,
        title: 'Lag and seasonality',
        content:
          'A swap cannot reference the index for the month it matures in, because that figure does not exist yet. Convention applies a lag — two months on a standard UK RPI swap — so a trade maturing in November settles on the September index, which the ONS published in October. Part of the payoff is already a public number before the trade ends. Seasonality is the second wrinkle: prices follow a repeating pattern within the calendar year, so the level of the index depends on which month is being read. Where a swap starts and matures in the same calendar month the seasonal component largely cancels, because both ends of the index ratio sit at the same point of the cycle; on a short-dated or broken-dated trade it does not, and the curve has to be fitted with an explicit seasonal adjustment.',
        callout:
          'UK pension increases are usually capped and floored rather than uncapped — "LPI (0,5)" rises with RPI but by no more than 5% and no less than 0% in a year. A plain inflation swap does not reproduce that shape; matching it needs inflation caps and floors on top.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The swap hedges one named index, and a liability linked to a different one leaves basis risk: a scheme paying CPI-linked benefits while receiving RPI on its swaps is exposed to the wedge between the two, and that wedge is not fixed — from February 2030 UK RPI is to be calculated on the CPIH methodology, which is expected to close most of it. A zero-coupon swap also pays nothing for years while being marked to market throughout, so a hedge with no cash flow until 2040 still consumes collateral today. And the lag cuts both ways: in the closing months of a trade there is very little inflation risk left to hedge, because the figure that settles it has already been published.',
        callout:
          'In autumn 2022 UK schemes running leveraged liability hedges faced collateral calls large enough that the Bank of England intervened in the gilt market. Nothing about the hedges had failed; they simply needed cash long before they were due to pay anything.',
      },
    ],
    keyTerms: [
      {
        term: 'Zero-coupon inflation swap',
        definition:
          'The standard form, which exchanges nothing until maturity and then settles the whole compounded difference in one payment.',
      },
      {
        term: 'Index ratio',
        definition:
          'The final reference index divided by the initial one, which less one is what the inflation leg pays.',
      },
      {
        term: 'Breakeven inflation',
        definition:
          'The fixed rate that makes both legs settle at the same amount, and so the market’s implied average inflation for that maturity.',
      },
      {
        term: 'Publication lag',
        definition:
          'The fixed number of months between the index month a payment references and the payment date itself — two months on a standard UK RPI swap.',
      },
      {
        term: 'Seasonality',
        definition:
          'The repeating within-year pattern in a price index, which largely cancels over whole years but must be modelled on short-dated and broken-dated trades.',
      },
      {
        term: 'Year-on-year inflation swap',
        definition:
          'The periodic alternative, exchanging each year’s change in the index against a fixed rate on every payment date.',
      },
    ],
    example: {
      title: 'A pension scheme hedges ten years of RPI',
      lines: [
        'A scheme has £50m of liabilities that rise with RPI over the next ten years.',
        'It enters a ten-year zero-coupon RPI swap on £50m, receiving inflation and paying 3.20% fixed.',
        'Nothing changes hands for ten years. At maturity the reference index has gone from 400.0 to 570.0.',
        'The inflation leg owes 570 ÷ 400 − 1 = 42.5% of £50m, or £21.25m.',
        'The fixed leg owes (1.032)^10 − 1 = 37.02% of £50m, or £18.51m, so the scheme receives the £2.74m difference.',
      ],
      takeaway:
        'Realised inflation ran at about 3.6% a year against the 3.20% breakeven the market priced at the outset, and the swap paid the scheme the gap. Had it run at exactly 3.20% the index would have finished at 548.1 and the two legs would have cancelled — one payment, at the very end, or none at all.',
    },
    inPractice:
      'UK defined benefit schemes and the liability-driven investment managers who run their hedges are the dominant receivers of inflation, because the benefits they owe are indexed by statute or by scheme rules. Opposite them sit utilities, rail and social housing operators whose revenues are index-linked by regulation or contract, and dealers warehousing what is left of the imbalance. Macro funds trade breakevens outright when they think the market’s implied inflation is wrong.',
    relatedProductIds: ['irs', 'capfloor', 'cmswap'],
    quiz: [
      {
        id: 'infswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The notional of an inflation swap is exchanged at maturity alongside the inflation payment.',
        correctAnswer: false,
        explanation:
          'As in any swap the notional is only a reference amount. What settles at maturity is the difference between the two legs.',
      },
      {
        id: 'infswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does the floating leg of an inflation swap pay?',
        options: [
          'An overnight benchmark such as SONIA, compounded over the period',
          'The realised change in a published price index',
          'The central bank’s inflation target for the period',
          'The real yield on an index-linked government bond',
        ],
        correctIndex: 1,
        explanation:
          'The underlying is a published statistic — RPI, HICP or CPI — rather than a market rate, which is what sets this product apart from every other swap here.',
      },
      {
        id: 'infswap-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'The index an inflation swap references is published monthly, a few weeks after the month it measures.',
        correctAnswer: true,
        explanation:
          'The ONS compiles and releases UK RPI on that schedule, which is precisely why the swap market needs a lag convention at all.',
      },
      {
        id: 'infswap-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'A zero-coupon inflation swap makes a single netted payment, at maturity.',
        correctAnswer: true,
        explanation:
          'Nothing is exchanged in the meantime. The year-on-year form is the version that pays on a schedule.',
      },
      {
        id: 'infswap-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A ten-year zero-coupon inflation swap on £50m is struck at 3.20% fixed, and the reference index runs from 400.0 to 570.0. What settles at maturity?',
        options: [
          '£21.25m paid to the inflation receiver',
          '£18.51m paid to the inflation payer',
          '£2.74m paid to the inflation receiver',
          '£2.74m paid to the inflation payer',
        ],
        correctIndex: 2,
        explanation:
          'The inflation leg owes 42.5% of £50m, or £21.25m; the fixed leg owes (1.032)^10 − 1 = 37.02%, or £18.51m. Only the £2.74m difference changes hands, and only at maturity.',
      },
      {
        id: 'infswap-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The fixed leg of a ten-year zero-coupon swap struck at 3.20% owes 32.0% of notional.',
        correctAnswer: false,
        explanation:
          'The rate compounds rather than adding up: (1.032)^10 − 1 is 37.02% of notional.',
      },
      {
        id: 'infswap-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A pension scheme owes benefits that rise with RPI. What does it do on an inflation swap?',
        options: [
          'Pay inflation and receive fixed',
          'Pay fixed on a nominal interest rate swap instead',
          'Sell an inflation floor struck at its expected rate',
          'Receive inflation and pay fixed',
        ],
        correctIndex: 3,
        explanation:
          'Its liabilities grow with the index, so it needs a receipt that grows with the index too. Paying a known fixed rate in exchange turns an unknown liability into a known one.',
      },
      {
        id: 'infswap-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'The fixed rate quoted on an inflation swap is the market’s breakeven inflation rate for that maturity.',
        correctAnswer: true,
        explanation:
          'It is the average annual inflation that would make the two legs settle at the same number, which is why it can be traded as a view and not only used as a hedge.',
      },
      {
        id: 'infswap-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Why is part of a UK RPI swap’s final payment already known before it matures?',
        options: [
          'The swap references an index month a set number of months before the payment date',
          'The ONS publishes a forecast of the index a year ahead',
          'The fixed leg is reset against the realised index each year',
          'RPI is revised only once a year, in April',
        ],
        correctIndex: 0,
        explanation:
          'A two-month lag is the UK convention, and each month’s index is published a few weeks after that month ends, so the settling figure is public before the trade is over.',
      },
      {
        id: 'infswap-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'On a zero-coupon swap that starts and matures in the same calendar month, the seasonal component of the index largely cancels.',
        correctAnswer: true,
        explanation:
          'Both ends of the index ratio sit at the same point of the seasonal cycle. It is short-dated and broken-dated trades, where they do not, that need an explicit seasonal adjustment.',
      },
      {
        id: 'infswap-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A scheme’s benefits rise with CPI but it hedges with RPI swaps. What has it kept?',
        options: [
          'Publication lag risk, because CPI is released later than RPI',
          'Basis risk between two indices that need not move together',
          'Reinvestment risk on the fixed leg, which pays every year',
          'Seasonality risk, because CPI has no seasonal pattern',
        ],
        correctIndex: 1,
        explanation:
          'The hedge pays on RPI while the liability grows with CPI, and the wedge between them is not fixed — from February 2030 RPI is to be calculated on the CPIH methodology, which is expected to close most of it.',
      },
      {
        id: 'infswap-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Because a zero-coupon swap pays nothing until maturity, it cannot generate collateral calls before then.',
        correctAnswer: false,
        explanation:
          'It is marked to market throughout its life, so a hedge that pays nothing for a decade can still demand cash within months of being struck — as UK schemes found in autumn 2022.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Breakeven and the risk premium',
          content:
            'The fixed rate on an inflation swap is the breakeven: the level of inflation at which both sides come out even. It is tempting to read it as the market’s forecast, and it is not quite that. It is the forecast plus what buyers of protection will pay to be rid of the risk, less any premium demanded for holding an instrument that is harder to trade. Those adjustments are not observable separately, which is why breakevens and survey expectations disagree persistently rather than converging.',
          callout:
            'A rising breakeven can mean expected inflation has risen, or that the price of insuring against it has. The two have different implications and the quote cannot tell them apart.',
        },
        {
          title: 'Lags and seasonality',
          content:
            'Inflation is published with a lag and referenced with one: a swap fixing in March typically settles against an index published for January, and often on an interpolation between two monthly prints. That is why an inflation position has exposure to prints that are already known but not yet referenced — the carry over the next few months is arithmetic, not a view. Seasonality compounds it, because consumer price indices have a repeatable shape within a year, so a short-dated position is dominated by a pattern that says nothing about the trend.',
          callout:
            'The lag means the first months of any inflation trade are already determined. Whether the trade is a view or a carry position depends on how much of its life those months represent.',
        },
        {
          title: 'Zero-coupon against year-on-year',
          content:
            'A zero-coupon swap exchanges one payment at maturity based on cumulative inflation over the whole term. A year-on-year swap exchanges a payment each year based on that year’s rate. They are not the same instrument with different schedules: the second is a strip of one-year exposures, and the difference between it and the compounding of the first is a convexity term that depends on how volatile inflation is expected to be. Desks quote both, and the spread between them is a position in that volatility.',
        },
      ],
      quiz: [
        {
          id: 'infswap-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is the fixed rate on an inflation swap called?',
          options: [
            'The breakeven',
            'The carry rate',
            'The par rate',
            'The index ratio',
          ],
          correctIndex: 0,
          explanation:
            'It is the level of inflation at which both sides come out even.',
        },
        {
          id: 'infswap-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt: 'A breakeven rate is the market’s forecast of inflation.',
          correctAnswer: false,
          explanation:
            'It is the forecast plus an insurance premium and less a liquidity premium, and the three cannot be separated from the quote.',
        },
        {
          id: 'infswap-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What can a rising breakeven mean?',
          options: [
            'Only that expected inflation has risen',
            'Either that expected inflation has risen or that protection has become more expensive',
            'That the index methodology has changed',
            'That real yields have risen',
          ],
          correctIndex: 1,
          explanation:
            'Two different stories with different implications, and one number that cannot distinguish them.',
        },
        {
          id: 'infswap-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'An inflation swap fixing in March typically references an index published for an earlier month.',
          correctAnswer: true,
          explanation:
            'The publication lag is written into the contract, usually with interpolation between two monthly prints.',
        },
        {
          id: 'infswap-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What follows from the indexation lag?',
          options: [
            'The trade has exposure to prints that are already known',
            'The trade cannot be valued until maturity',
            'Seasonality is removed from the payoff',
            'The swap becomes a forward on the index level',
          ],
          correctIndex: 0,
          explanation:
            'The first months of the position are arithmetic rather than a view, which is carry rather than opinion.',
        },
        {
          id: 'infswap-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt: 'Seasonality dominates short-dated inflation positions.',
          correctAnswer: true,
          explanation:
            'Consumer price indices have a repeatable within-year shape that says nothing about the trend.',
        },
        {
          id: 'infswap-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What does a zero-coupon inflation swap exchange?',
          options: [
            'A payment each year based on that year’s inflation',
            'One payment at maturity based on cumulative inflation',
            'A payment whenever the index is published',
            'A floating rate against an inflation-linked bond',
          ],
          correctIndex: 1,
          explanation:
            'The year-on-year version is the one that pays annually, and it is a different instrument rather than the same one rescheduled.',
        },
        {
          id: 'infswap-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A year-on-year swap is exactly equivalent to the compounding of a zero-coupon swap.',
          correctAnswer: false,
          explanation:
            'The difference is a convexity term that depends on expected inflation volatility, and the spread between them trades on it.',
        },
        {
          id: 'infswap-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'What does the spread between year-on-year and zero-coupon quotes express?',
          options: [
            'A view on inflation volatility',
            'A view on the direction of inflation',
            'A difference in credit risk',
            'A difference in day count',
          ],
          correctIndex: 0,
          explanation:
            'It is the convexity between a strip of annual exposures and one cumulative one.',
        },
        {
          id: 'infswap-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Breakevens and survey measures of expected inflation disagree persistently.',
          correctAnswer: true,
          explanation:
            'Because a breakeven contains risk and liquidity premia that a survey does not.',
        },
        {
          id: 'infswap-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A pension scheme hedging inflation-linked liabilities cares most about which feature?',
          options: [
            'That the reference index matches the one its liabilities are linked to',
            'That the swap is quoted zero-coupon',
            'That the counterparty is a bank rather than an insurer',
            'That the trade is short-dated',
          ],
          correctIndex: 0,
          explanation:
            'A mismatch between the hedge’s index and the liability’s index is basis risk over decades.',
        },
        {
          id: 'infswap-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Whether an inflation trade is a view or a carry position depends partly on its maturity.',
          correctAnswer: true,
          explanation:
            'The lagged prints are already determined, so the shorter the trade, the more of it is arithmetic.',
        },
      ],
    },
  },
  {
    id: 'basisswap',
    categoryId: 'ir',
    name: 'Basis Swap',
    hook: 'Swap one floating index for another',
    summary:
      'The first swap here with no fixed leg at all. Both sides pay a floating index on the same notional in the same currency — SOFR against the effective federal funds rate, or compounded SOFR against three-month Term SOFR — and the price is not a rate but a spread in basis points added to one of the legs. The structure carries the lesson: "the floating rate" is plural, the curves for different indices do not move together, and the gap between them is itself something that trades.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A basis swap exchanges one floating index for another on the same notional, in the same currency, for an agreed term. Neither leg is fixed. Because both legs rise and fall with the level of rates, the trade expresses almost no view on where rates go; what it isolates is the difference between two indices that are often treated as interchangeable and are not.',
        callout:
          'Every other swap in this catalogue has a fixed side to quote. A basis swap is quoted as a spread in basis points, and that spread is the price — a position struck at three basis points can be closed out at seven.',
      },
      {
        step: 2,
        title: 'How it’s quoted',
        content:
          'The spread goes on whichever leg would otherwise be worth less, sized so that the two legs are worth the same on the trade date: a basis swap starts at zero value, like any other swap. A quote of the form "SOFR flat against fed funds plus four" means one party pays compounded SOFR and receives the effective federal funds rate plus four basis points on the same notional. The two legs need not share a schedule — a daily compounded leg against a quarterly term leg has to be aligned in the confirmation before anything can be netted. Duration is close to nil, so a 50 basis point shift in the whole curve barely moves the trade while a one basis point move in the spread moves it directly.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Banks and lenders are the natural users, because their assets and their funding rarely reference the same index. A US bank whose loan book pays three-month Term SOFR but whose notes cost compounded SOFR earns a margin that widens and narrows with the gap between the two — a risk it never chose to run. A basis swap fixes that margin without taking any position on the level of rates. Dealers also use basis swaps to shift a legacy book from one benchmark onto another, which is how a great deal of the LIBOR transition was actually executed.',
        callout:
          'The ARRC’s best practice recommendation limits Term SOFR derivatives to end users hedging cash exposures that already reference Term SOFR, so this particular basis is not traded between dealers as freely as an ordinary SOFR swap.',
      },
      {
        step: 4,
        title: 'What moves the spread',
        content:
          'Two indices differ because they measure different things. SOFR is secured on US Treasuries, so it answers to the supply of collateral and cash; the effective federal funds rate is unsecured, so it carries a view on the institutions doing the borrowing. Tenor is the other axis: a forward-looking term rate prices what the market expects overnight rates to do, while a compounded overnight rate records what they actually did, so the two agree only if the path turns out as expected. The clearest historical case is the LIBOR–OIS spread, which measured the cost of unsecured bank funding and widened sharply in 2008 and again in March 2020 while the overnight rate itself barely moved.',
        callout:
          'A repo rate can spike over a quarter-end or a year-end when dealer balance sheets are constrained, with no change in the policy rate at all. That is a move in the basis rather than in rates, and it is exactly what this product is exposed to.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The spread is small but it is not stable, and it tends to move most under funding stress, which is when a bank can least afford the mark. A hedge also only works where the schedules match: a basis swap resetting quarterly against a loan book that resets monthly leaves a residual on every date the two disagree. The idea reaches further than the product does. Exchanging floating legs in two different currencies gives the cross-currency basis, priced in the FX swap market; and within a single currency, the recognition that the curve used to project a floating leg is not the curve used to discount its cash flows — projection follows the index, discounting follows the collateral agreement — is the same observation written into the valuation, a separation the market made after 2008 and has kept.',
      },
    ],
    keyTerms: [
      {
        term: 'Basis spread',
        definition:
          'The basis points added to one floating leg so both legs are worth the same at inception, and the price at which the swap trades.',
      },
      {
        term: 'SOFR',
        definition:
          'The Secured Overnight Financing Rate, an overnight rate derived from US Treasury repo transactions and published by the New York Fed.',
      },
      {
        term: 'Effective federal funds rate',
        definition:
          'The volume-weighted median rate on overnight unsecured borrowing in the US federal funds market, also published by the New York Fed.',
      },
      {
        term: 'Term SOFR',
        definition:
          'A forward-looking rate for a period such as three months, derived from SOFR derivatives and therefore known at the start of the period.',
      },
      {
        term: 'Tenor basis',
        definition:
          'The spread between two floating legs referencing the same benchmark over different periods, such as one month against three months.',
      },
      {
        term: 'Projection curve',
        definition:
          'The curve used to forecast a floating leg’s future settings, kept separate from the discount curve applied to the resulting cash flows.',
      },
    ],
    example: {
      title: 'A bank locks its lending margin',
      lines: [
        'A bank holds $500m of corporate loans paying three-month Term SOFR + 2.00%, reset quarterly.',
        'It funds them with notes paying daily compounded SOFR + 0.60%, so the 1.40% gap between the two margins is not actually locked.',
        'It enters a three-year basis swap on $500m: it pays three-month Term SOFR and receives compounded SOFR plus 2 basis points.',
        'In one 92-day quarter Term SOFR sets at 4.10% while compounded SOFR realises 4.02%, so the swap costs 6 basis points — $76,667 on ACT/360.',
        'The margin is 6.10% earned less 4.62% paid less that 6 basis points: 1.42%, and 1.42% again in a quarter where the two indices differ by 3 basis points instead of 8.',
      ],
      takeaway:
        'Neither leg is fixed and nothing here turns on the level of rates — all the swap locks is the 2 basis point spread between two indices. Without it the bank’s margin would drift, in either direction, with a basis it never chose to take a view on.',
    },
    inPractice:
      'US regional banks are the archetypal user: their loan documentation references Term SOFR while their bonds and hedges reference compounded SOFR, and a basis swap is what keeps the margin between them intact. Bank treasuries and short-end rates desks trade the SOFR against fed funds basis to line a portfolio up with the index their own liabilities actually pay, and dealers run a basis book because every index needs a curve of its own.',
    relatedProductIds: ['irs', 'fra', 'fxswap'],
    quiz: [
      {
        id: 'basisswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A basis swap has no fixed leg — both sides pay a floating index.',
        correctAnswer: true,
        explanation:
          'That is what makes it different: the price is a spread between two floating indices rather than a rate.',
      },
      {
        id: 'basisswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'How is a basis swap quoted?',
        options: [
          'As a fixed rate, like any other swap',
          'As a spread in basis points added to one of the two floating legs',
          'As an upfront premium paid on the trade date',
          'As the ratio between the two indices',
        ],
        correctIndex: 1,
        explanation:
          'There is no fixed side to quote. The spread is the price, and it moves — a trade struck at three basis points can be closed out at seven.',
      },
      {
        id: 'basisswap-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A basis swap expresses almost no view on the level of interest rates.',
        correctAnswer: true,
        explanation:
          'Both legs float, so a parallel shift in the curve moves them together. What is left is the gap between the two indices.',
      },
      {
        id: 'basisswap-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'What does a quote of "SOFR flat against fed funds plus four" mean?',
        options: [
          'Both legs pay four basis points over their own index',
          'The fixed rate on the swap is four basis points',
          'One party pays compounded SOFR and receives the fed funds rate plus four basis points',
          'The swap pays out only once the two indices differ by more than four basis points',
        ],
        correctIndex: 2,
        explanation:
          'One leg is quoted flat and the spread sits on the other. Nothing about the trade is fixed, and nothing is conditional on a threshold.',
      },
      {
        id: 'basisswap-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The spread is added to whichever leg would otherwise be worth more, so the trade starts with a positive value.',
        correctAnswer: false,
        explanation:
          'It goes on the leg worth less, and is sized so the two match. A basis swap starts at zero value, like any other swap.',
      },
      {
        id: 'basisswap-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A bank’s loans pay Term SOFR while its funding costs compounded SOFR. What does a basis swap do for it?',
        options: [
          'It fixes the margin between the two without taking a view on rates',
          'It converts the loan book to a fixed rate',
          'It removes the credit risk on the loan book',
          'It shortens the maturity of the funding',
        ],
        correctIndex: 0,
        explanation:
          'Both legs still float with the level of rates. What the swap removes is the drift between the two indices, which is the part of the margin the bank never chose to run.',
      },
      {
        id: 'basisswap-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Basis swaps were used to move legacy books from one benchmark onto another during the LIBOR transition.',
        correctAnswer: true,
        explanation:
          'Exchanging one floating index for another is exactly the operation a transition requires, which is why so much of it ran through this product.',
      },
      {
        id: 'basisswap-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Why can SOFR and the effective federal funds rate diverge?',
        options: [
          'One is a monthly average and the other is observed daily',
          'They are published by different administrators on different days',
          'SOFR is secured on Treasuries while fed funds is unsecured',
          'SOFR is a forward-looking term rate and fed funds is not',
        ],
        correctIndex: 2,
        explanation:
          'One answers to the supply of collateral and cash, the other to the standing of the institutions borrowing. Both are overnight rates published by the New York Fed.',
      },
      {
        id: 'basisswap-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'A forward-looking term rate and an overnight rate compounded over the same period settle at the same number.',
        correctAnswer: false,
        explanation:
          'The term rate prices what the market expected overnight rates to do; the compounded rate records what they did. They agree only if the path turns out as expected.',
      },
      {
        id: 'basisswap-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'The LIBOR–OIS spread widened sharply in 2008 while the overnight rate barely moved. What was it measuring?',
        options: [
          'A change in the Federal Reserve’s policy target',
          'The difference between a monthly and a quarterly reset',
          'The scarcity of Treasury collateral in the repo market',
          'The perceived credit and liquidity risk of unsecured lending to banks',
        ],
        correctIndex: 3,
        explanation:
          'LIBOR was an unsecured bank funding rate while OIS sat close to risk free, so the gap between them priced how safe lending to banks was thought to be.',
      },
      {
        id: 'basisswap-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A basis swap resetting quarterly fully hedges a loan book that resets monthly.',
        correctAnswer: false,
        explanation:
          'A schedule mismatch leaves a residual on every date the two disagree. The hedge only neutralises the basis it actually matches.',
      },
      {
        id: 'basisswap-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What does the split between a projection curve and a discount curve recognise?',
        options: [
          'That one curve can no longer be assumed to both forecast a floating leg and discount its cash flows',
          'That fixed legs are discounted but floating legs are not',
          'That cleared swaps are discounted and bilateral swaps are not',
          'That the notional has to be discounted as well as the interest',
        ],
        correctIndex: 0,
        explanation:
          'Projection follows the index the leg references; discounting follows the collateral agreement. It is the same insight a basis swap trades, written into the valuation.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'What a tenor basis prices',
          content:
            'Exchanging three-month payments for six-month payments on the same index and currency should, in a frictionless world, be worth nothing — the two schedules are the same money at different frequencies. It is not worth nothing, and the spread that makes it fair is the tenor basis. What it prices is the difference in what each frequency implies about funding and credit: a six-month exposure to a bank is a longer exposure than a three-month one, and rolling shorter is not free either. Under risk-free rates the credit component largely disappears and the basis narrows, without going away.',
          callout:
            'A tenor basis is one of the few places where a spread that "should" be zero is quoted, traded and hedged. Its existence is the market saying that two ways of paying the same interest are not the same claim.',
        },
        {
          title: 'The cross-currency version',
          content:
            'Swap floating in one currency for floating in another and the same question appears with a much larger answer. Textbook covered interest parity says the forward exchange rate should make the two legs equivalent; the persistent spread on cross-currency basis swaps says it does not. The reasons are structural: demand for dollar funding outside the United States, the balance sheet cost to banks of supplying it, and regulation that makes that supply more expensive at quarter and year ends, which is visible as a predictable widening at those dates.',
          callout:
            'The euro-dollar basis blew out in 2008 and has never returned to zero. Treating covered interest parity as an identity rather than an approximation is how a funding position gets mistaken for an arbitrage.',
        },
        {
          title: 'After LIBOR',
          content:
            'The transition to overnight risk-free rates changed the composition of these spreads without removing them. A term rate carried bank credit and a term premium; a compounded overnight rate carries neither, so the basis between a legacy term index and a compounded rate is largely a credit and liquidity spread, and the basis between two currencies’ risk-free rates is almost purely a funding one. The instruments outlived the index they were built on, which is worth noticing: the trade was never really about the index.',
        },
      ],
      quiz: [
        {
          id: 'basisswap-d1',
          kind: 'boolean',
          step: 1,
          difficulty: 'intermediate',
          prompt:
            'Exchanging three-month for six-month payments on the same index trades at a spread rather than flat.',
          correctAnswer: true,
          explanation:
            'That spread is the tenor basis, and it prices the difference in funding and credit between the two frequencies.',
        },
        {
          id: 'basisswap-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What does a tenor basis principally price?',
          options: [
            'The difference in day count conventions',
            'The credit and funding difference between exposures of different length',
            'The expected direction of interest rates',
            'The cost of clearing the trade',
          ],
          correctIndex: 1,
          explanation:
            'A six-month exposure is a longer claim on a bank than a three-month one, and rolling shorter is not free either.',
        },
        {
          id: 'basisswap-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Moving to risk-free rates removed the tenor basis entirely.',
          correctAnswer: false,
          explanation:
            'It narrowed it by removing most of the credit component. The remainder is liquidity and term preference.',
        },
        {
          id: 'basisswap-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does a persistent cross-currency basis tell you?',
          options: [
            'That covered interest parity is an approximation, not an identity',
            'That one currency is expected to depreciate',
            'That the two currencies have different inflation rates',
            'That the swap is mispriced and can be arbitraged',
          ],
          correctIndex: 0,
          explanation:
            'The gap is structural — funding demand, balance sheet cost and regulation — not a free trade waiting to be taken.',
        },
        {
          id: 'basisswap-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'Cross-currency basis tends to widen predictably at quarter and year ends.',
          correctAnswer: true,
          explanation:
            'Balance sheet is measured on those dates, so supplying funding across them costs more.',
        },
        {
          id: 'basisswap-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'foundational',
          prompt:
            'The euro-dollar cross-currency basis returned to zero after the 2008 crisis.',
          correctAnswer: false,
          explanation:
            'It has not. Persistent, structural and quoted every day — which is what makes it a market rather than an anomaly.',
        },
        {
          id: 'basisswap-d7',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'Why is dollar funding at the centre of most basis discussion?',
          options: [
            'Because the dollar has the highest interest rate',
            'Because demand for it outside the United States exceeds what local banks can supply cheaply',
            'Because dollar swaps are cleared and others are not',
            'Because the dollar is the only reserve currency',
          ],
          correctIndex: 1,
          explanation:
            'Someone has to intermediate that demand, and the price of doing so is the basis.',
        },
        {
          id: 'basisswap-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'What does the basis between a legacy term index and a compounded overnight rate mostly represent?',
          options: [
            'A credit and liquidity spread',
            'An expectation of central bank policy',
            'A difference in settlement convention',
            'A tax adjustment',
          ],
          correctIndex: 0,
          explanation:
            'The term rate carried bank credit and a term premium; the compounded rate carries neither.',
        },
        {
          id: 'basisswap-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Basis swaps survived the retirement of the index they were originally built around.',
          correctAnswer: true,
          explanation:
            'Which is the clue that the trade was never really about the index — it was about funding.',
        },
        {
          id: 'basisswap-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'A treasury funds in one currency and lends in another, hedged with a cross-currency swap. What has it taken on?',
          options: [
            'Outright currency risk',
            'Exposure to the basis when the hedge is rolled',
            'Credit risk to the borrower only',
            'Nothing — the hedge is complete',
          ],
          correctIndex: 1,
          explanation:
            'The basis at each roll is a real cost, and it moves with conditions that have nothing to do with the loan.',
        },
        {
          id: 'basisswap-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Treating covered interest parity as an identity can turn a funding position into what looks like an arbitrage.',
          correctAnswer: true,
          explanation:
            'The spread is compensation for balance sheet and funding. Reading it as free money is how the position gets sized wrongly.',
        },
        {
          id: 'basisswap-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why does a basis widen when balance sheet becomes expensive?',
          options: [
            'Because clearing houses raise margin',
            'Because the intermediaries who supply the funding charge more for using their balance sheet',
            'Because volatility rises',
            'Because the underlying index changes',
          ],
          correctIndex: 1,
          explanation:
            'The basis is the price of intermediation, so it moves with the cost of intermediating.',
        },
      ],
    },
  },
];
