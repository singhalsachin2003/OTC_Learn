import type { Product } from '../types';

/**
 * Exotics and structured products — the first asset class sold rather than
 * shipped free. Ids are stable: saved progress is keyed by them.
 *
 * Every product here is a rearrangement of something in the free catalogue, and
 * the order in `paths.ts` follows that construction: a digital is the simplest
 * discontinuous payoff, a barrier adds a trigger to a vanilla, a range accrual
 * is a strip of digitals, and the accumulator, TARF and cliquet are strips of
 * forwards and options with a termination rule bolted on. Each lesson names the
 * free product it is built from so the two halves of the catalogue read as one.
 */
export const exoticsProducts: Product[] = [
  {
    id: 'digital',
    categoryId: 'exotics',
    name: 'Digital Option',
    hook: 'All or nothing, decided at one level',
    summary:
      'A digital — or binary — option pays a fixed amount if the underlying finishes on the right side of a level, and nothing if it does not. There is no proportional payoff: finishing a pip beyond the strike pays the same as finishing a figure beyond it. That makes the price a clean statement of probability, and it makes the option almost impossible to hedge in the last hours of its life, because the payoff jumps rather than slopes.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A digital option pays a pre-agreed cash amount if the underlying is above (a digital call) or below (a digital put) the strike at expiry, and zero otherwise. The payoff is a step, not a ramp. The common variant is cash-or-nothing, which pays a fixed sum; an asset-or-nothing digital delivers the underlying itself on the same condition. Digitals trade most heavily in FX, where they are quoted as a percentage of the payout rather than of a notional.',
        callout:
          'Quoting convention: a one-month EUR/USD digital paying $1m “at 38%” costs $380,000. The price is the market’s discounted probability of the event, not a premium per unit of notional.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Under Black-Scholes the value of a cash-or-nothing call is the payout multiplied by N(d₂), discounted — and N(d₂) is precisely the risk-neutral probability of finishing above the strike. Dealers do not hedge it that way. A digital is replicated by a tight call spread: buy a call struck just below the trigger, sell one just above, and scale the size so the spread’s payoff climbs to the digital amount across that gap. The narrower the gap, the closer the replication and the larger the notional required to fund it.',
        callout:
          'Because a digital call is the limit of a narrowing call spread, its value is the negative slope of the vanilla call price against strike. Skew therefore prices it: where the curve is steep, the digital is cheap.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A digital expresses a view on an event rather than on a distance — a central bank holding a level, an index closing above a threshold, a currency peg surviving the month. The buyer knows the maximum loss at the outset and the exact payout, which makes it easy to size against a specific exposure. Structurers also use them as components: a range accrual note is a strip of daily digitals, and a barrier option’s rebate is a digital paid on touch.',
      },
      {
        step: 4,
        title: 'European and American',
        content:
          'A European digital tests the level once, at expiry. An American digital — a one-touch — pays if the level is reached at any point in the option’s life, and a no-touch pays only if it never is. Touch options are worth considerably more than their European equivalents on the same level, because a path that crosses and comes back still pays. With no drift and a symmetric distribution the reflection principle puts the probability of touching at roughly twice the probability of finishing beyond, which is why a one-touch is often quoted near double the European digital.',
        callout:
          'One-touch contracts settle either at touch or at expiry, and the difference matters for discounting on a long-dated trade. The confirmation says which; do not assume.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The whole risk of a digital is concentrated at the strike near expiry. As expiry approaches, the delta of the replicating spread explodes: hedging a $1m payout across a 50-pip gap needs €200m of vanilla notional, and across a 10-pip gap, a billion. A dealer who is short the digital may buy heavily into the strike to hedge, which moves the very spot the payoff depends on — the reason large digitals are often documented with a strike defined over an averaging window, or with a spread struck deliberately in the dealer’s favour.',
        callout:
          'The over-hedge is a real cost, not an accounting one: dealers price a digital off a call spread wide enough to be hedgeable, so the client pays more than N(d₂) and the difference is the discontinuity.',
      },
    ],
    keyTerms: [
      {
        term: 'Cash-or-nothing',
        definition:
          'A digital paying a fixed cash amount if the condition is met, and nothing if it is not.',
      },
      {
        term: 'Payout',
        definition:
          'The fixed sum a digital pays on exercise; the price is quoted as a percentage of it.',
      },
      {
        term: 'Call spread replication',
        definition:
          'Hedging a digital with a long and a short vanilla struck either side of the trigger.',
      },
      {
        term: 'One-touch',
        definition:
          'An American digital paying if the level is reached at any time before expiry, not only at it.',
      },
      {
        term: 'No-touch',
        definition:
          'The mirror contract, paying only if the level is never reached during the option’s life.',
      },
      {
        term: 'Pin risk',
        definition:
          'The unhedgeable exposure left when the underlying sits on the strike as the option expires.',
      },
    ],
    example: {
      title: 'Hedging a digital with a call spread',
      lines: [
        'A dealer sells a one-month EUR/USD digital call paying $1m if spot fixes above 1.1000.',
        'It hedges with a call spread: long 1.0975 strike, short 1.1025 — a gap of 0.0050.',
        'The spread must pay $1m across that gap, so the notional is $1,000,000 ÷ 0.0050 = €200m.',
        'Above 1.1025 the spread pays 0.0050 × €200m = $1m, exactly covering the digital.',
        'Between the strikes it pays less than $1m, and the dealer keeps the difference or wears the shortfall.',
        'Halving the gap to 0.0025 doubles the notional to €400m for the same $1m payout.',
      ],
      takeaway:
        'A digital is a call spread taken to the limit, and the limit is where the hedge notional runs away. The tighter the replication, the larger the position a dealer has to hold into the fixing.',
    },
    inPractice:
      'FX options desks quote digitals continuously and use them as the building block for touch structures and accrual notes. Buyers are typically hedgers with a threshold exposure — a payment triggered by a rate breaching a level — and macro funds expressing a dated view on an event rather than on the size of a move.',
    relatedProductIds: ['fxopt', 'barrier', 'rangeacc'],
    quiz: [
      {
        id: 'digital-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A digital option pays more the further the underlying finishes beyond its strike.',
        correctAnswer: false,
        explanation:
          'The payoff is a fixed amount. One pip beyond the strike pays the same as a figure beyond it.',
      },
      {
        id: 'digital-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'How is an FX digital normally quoted?',
        options: [
          'As a percentage of the fixed payout',
          'As a premium per unit of notional, like a vanilla',
          'As an annualised yield over the option’s life',
          'As a spread over the forward outright',
        ],
        correctIndex: 0,
        explanation:
          'A digital paying $1m quoted at 38% costs $380,000 — the price is a share of the payout.',
      },
      {
        id: 'digital-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Under Black-Scholes, what does the price of a cash-or-nothing call correspond to?',
        options: [
          'The expected size of the move, discounted',
          'The option’s vega multiplied by implied volatility',
          'The payout times the risk-neutral probability of finishing above the strike',
          'The intrinsic value plus half the time value of the vanilla',
        ],
        correctIndex: 2,
        explanation:
          'It is payout × N(d₂), discounted, and N(d₂) is that probability under the pricing measure.',
      },
      {
        id: 'digital-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'The value of a digital call depends on the slope of vanilla call prices across strikes, so the volatility skew affects its price.',
        correctAnswer: true,
        explanation:
          'A digital is the limit of a narrowing call spread, and that limit is the derivative of price with respect to strike.',
      },
      {
        id: 'digital-q5',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt: 'What kind of view does a digital express most directly?',
        options: [
          'That a level will or will not be breached',
          'That volatility will rise over the option’s life',
          'That the underlying will move a long way in one direction',
          'That the forward curve will steepen',
        ],
        correctIndex: 0,
        explanation:
          'The payoff turns on an event at a level, not on the distance travelled beyond it.',
      },
      {
        id: 'digital-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A range accrual note can be described as a strip of daily digital options.',
        correctAnswer: true,
        explanation:
          'Each day inside the range pays a fixed slice of coupon, which is exactly a digital payoff.',
      },
      {
        id: 'digital-q7',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What distinguishes a one-touch from a European digital?',
        options: [
          'It pays only if the level is reached exactly at expiry',
          'It pays if the level is reached at any point before expiry',
          'It pays a proportional amount rather than a fixed one',
          'It can only be written on interest rates, not on FX',
        ],
        correctIndex: 1,
        explanation:
          'A one-touch is an American digital: any touch during the life pays, whatever happens afterwards.',
      },
      {
        id: 'digital-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'On the same level and expiry, a one-touch is worth roughly the same as a European digital.',
        correctAnswer: false,
        explanation:
          'It is worth substantially more — with no drift, the chance of touching is about twice the chance of finishing beyond.',
      },
      {
        id: 'digital-q9',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why does hedging a digital become dangerous immediately before expiry?',
        options: [
          'Implied volatility is always highest on the expiry date',
          'The replicating spread needs a very large notional as its strikes narrow',
          'The option can be exercised early without notice',
          'Settlement moves from cash to physical delivery',
        ],
        correctIndex: 1,
        explanation:
          'A fixed payout across a shrinking gap means notional grows without limit as the gap closes.',
      },
      {
        id: 'digital-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Dealers commonly price a digital off a call spread wide enough to hedge, so the client pays more than the theoretical probability.',
        correctAnswer: true,
        explanation:
          'That over-hedge is the price of the discontinuity, and it is a real cost rather than a markup for its own sake.',
      },
      {
        id: 'digital-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A dealer is short a large digital call and spot is sitting on the strike an hour before the fix. What is the concern?',
        options: [
          'The option will convert into a forward at expiry',
          'The hedge cannot be delta-neutral, and trading it may move the fixing itself',
          'Volatility will be marked to zero, wiping out the option’s value',
          'The client can extend the expiry unilaterally',
        ],
        correctIndex: 1,
        explanation:
          'This is pin risk: the hedge is enormous and discontinuous, and buying into the strike pushes the very rate that decides the payoff.',
      },
      {
        id: 'digital-q12',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An asset-or-nothing digital delivers the underlying rather than a cash sum when it pays.',
        correctAnswer: true,
        explanation:
          'That is the distinction from the more common cash-or-nothing form, which settles a fixed amount.',
      },
    ],
  },
  {
    id: 'barrier',
    categoryId: 'exotics',
    name: 'Barrier Option',
    hook: 'A vanilla that switches on or off at a level',
    summary:
      'A barrier option is a vanilla call or put with a trigger attached: it either comes to life when the underlying reaches a level (knock-in) or dies when it does (knock-out). The trigger is what the buyer sells to cheapen the option — a knock-out call costs less than the vanilla because it pays nothing along the paths that go furthest in its favour. Barriers are the most heavily traded exotic in FX and sit inside most structured notes, where the knock-out is what funds the enhanced coupon.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Four shapes cover almost everything traded: up-and-out, up-and-in, down-and-out and down-and-in, each pairing a direction of travel with what happens on arrival. A knock-out is live until the barrier is touched and then extinguished; a knock-in is dormant until the barrier is touched and only then becomes an ordinary option. Everything else — strike, expiry, exercise style — is the vanilla it is built on.',
        callout:
          'In-out parity: a knock-in and a knock-out with the same strike, expiry, barrier and monitoring add up to the vanilla, because exactly one of them ends up alive on every path.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Monitoring is the detail that decides the contract. Continuous monitoring means any trade at the level during the observation period triggers the barrier; discrete monitoring tests only at stated times, typically a daily fix. A continuously monitored barrier is more likely to trigger than a daily-fixed one at the same level, so it is worth less if it knocks out and more if it knocks in. Some contracts pay a rebate when a knock-out triggers, which softens the cliff and is itself a digital.',
        callout:
          'FX barriers are usually monitored continuously across the global trading day and settled against the interbank market; equity and rates barriers are more often fixed on a closing print.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'The buyer gives up the states of the world it does not need. A treasurer hedging a budget rate does not care what happens beyond a level it never expects to reach, so paying for those paths is waste, and the knock-out returns that premium as a discount. Structurers use the same trick in reverse: selling the knock-out feature is what pays for a note’s headline coupon or its capital protection.',
        callout:
          'A reverse knock-out — one whose barrier sits in the money — is the cheapest of all, because it dies precisely when it is worth most. That is also why it is the hardest to hedge.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The barrier level is the trigger; the observation period states when it is watched, which need not be the whole life of the trade — a window barrier is only live between two dates. A rebate is a fixed sum paid if a knock-out triggers. Dealers manage the discontinuity by hedging to a barrier shift: they treat the trigger as slightly beyond the contractual level, so the hedge is unwound early and the residual risk is a known cost rather than a gap.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Near the barrier, close to expiry, a reverse knock-out’s delta can change sign and its gamma is unbounded — the position is long the option one moment and holding nothing the next. Hedging that means trading size into the level, and a dealer defending or attacking a barrier moves the market it is measured against. Disputes over whether a barrier traded at all are common enough that ISDA publishes barrier determination language, and the answer often turns on which venues count as the market.',
        callout:
          'The 2015 removal of the Swiss franc floor triggered a large population of EUR/CHF barriers in a market with almost no liquidity between levels — a reminder that a barrier assumes you can trade at it.',
      },
    ],
    keyTerms: [
      {
        term: 'Knock-out',
        definition:
          'A barrier option that ceases to exist if the underlying reaches the barrier level.',
      },
      {
        term: 'Knock-in',
        definition:
          'A barrier option that only becomes a live option once the barrier is reached.',
      },
      {
        term: 'In-out parity',
        definition:
          'The rule that a matching knock-in and knock-out together equal the plain vanilla option.',
      },
      {
        term: 'Rebate',
        definition:
          'A fixed amount paid to the holder when a knock-out barrier triggers, softening the loss.',
      },
      {
        term: 'Reverse knock-out',
        definition:
          'A barrier set in the money, so the option is extinguished exactly when it is most valuable.',
      },
      {
        term: 'Barrier shift',
        definition:
          'A dealer’s practice of hedging to a level slightly beyond the contractual barrier to make the risk tradable.',
      },
    ],
    example: {
      title: 'An up-and-out call, and the path that kills it',
      lines: [
        'A corporate buys a three-month EUR/USD call on €10m, strike 1.1000, with an up-and-out barrier at 1.1500.',
        'The vanilla is quoted at 1.45% of notional, or $145,000; the knock-out version costs 0.82%, or $82,000.',
        'Spot ends the period at 1.1450: the option is alive and pays (1.1450 − 1.1000) × €10m = $450,000.',
        'Now take a path that reaches 1.1502 in week six before falling back to that same 1.1450 close.',
        'The barrier traded, so the option was extinguished in week six and pays nothing at expiry.',
        'The €63,000 saved on premium bought exactly one thing: the right to lose every path above 1.1500.',
      ],
      takeaway:
        'A barrier option is priced on paths, not on the closing level. Two trades that finish identically can settle at $450,000 and at zero.',
    },
    inPractice:
      'Corporate treasurers buy knock-out forwards and calls to cut the cost of a hedge they only need within a band, and structured note desks embed knock-ins to manufacture the conditional downside that funds a coupon. On the dealer side, barrier books are where FX options desks concentrate their gamma risk, and where the trading day is organised around which levels are close.',
    relatedProductIds: ['fxopt', 'digital', 'autocall'],
    quiz: [
      {
        id: 'barrier-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A knock-out option is extinguished if the underlying reaches the barrier level.',
        correctAnswer: true,
        explanation:
          'That is the definition — the trigger ends the contract, whatever the underlying does afterwards.',
      },
      {
        id: 'barrier-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A knock-in and a knock-out share a strike, expiry, barrier and monitoring. What do they add up to?',
        options: [
          'Twice the vanilla, since both may pay',
          'The vanilla option on the same terms',
          'A digital paying at the barrier',
          'Nothing — the two payoffs always cancel',
        ],
        correctIndex: 1,
        explanation:
          'In-out parity: exactly one of the pair survives on every path, so together they replicate the vanilla.',
      },
      {
        id: 'barrier-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A continuously monitored barrier is less likely to trigger than one observed only at a daily fix.',
        correctAnswer: false,
        explanation:
          'It is more likely: an intraday spike counts, where a daily fix can miss it entirely.',
      },
      {
        id: 'barrier-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What is a rebate on a barrier option?',
        options: [
          'A refund of premium if the option expires out of the money',
          'A fixed sum paid to the holder when a knock-out triggers',
          'A discount for dealing on a fixed rather than continuous barrier',
          'The dealer’s commission, returned if the trade is novated',
        ],
        correctIndex: 1,
        explanation:
          'It is a payment on the trigger event — a digital in its own right, bolted onto the knock-out.',
      },
      {
        id: 'barrier-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'A knock-out call costs less than the equivalent vanilla call.',
        correctAnswer: true,
        explanation:
          'It pays nothing on the paths that breach the barrier, and the buyer is refunded that value in a lower premium.',
      },
      {
        id: 'barrier-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why might a treasurer accept a knock-out on a hedge rather than buy the vanilla?',
        options: [
          'The knock-out removes counterparty risk from the trade',
          'A knock-out cannot be exercised early, simplifying the accounting',
          'The barrier level guarantees a minimum payout',
          'It cuts the premium by giving up protection beyond a level the budget never assumed',
        ],
        correctIndex: 3,
        explanation:
          'Paying for states you do not need is waste; the knock-out returns that part of the premium.',
      },
      {
        id: 'barrier-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What makes a reverse knock-out the cheapest barrier structure?',
        options: [
          'Its barrier sits in the money, so it dies exactly when it is worth most',
          'It is monitored only on the final day of the trade',
          'It carries no premium at all, being funded by a sold option',
          'It knocks out only after the holder has been paid a rebate',
        ],
        correctIndex: 0,
        explanation:
          'The states with the largest intrinsic value are removed, which is also what makes it so hard to hedge.',
      },
      {
        id: 'barrier-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A window barrier is only monitored between two stated dates rather than for the whole life of the option.',
        correctAnswer: true,
        explanation:
          'Outside the window the level can be traded freely without any effect on the contract.',
      },
      {
        id: 'barrier-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What is a dealer doing when it hedges to a barrier shift?',
        options: [
          'Renegotiating the contractual barrier with the client mid-trade',
          'Treating the trigger as slightly beyond the contractual level so the risk can be unwound in a tradable way',
          'Moving the barrier each day to keep the option delta-neutral',
          'Buying a second barrier option to offset the first exactly',
        ],
        correctIndex: 1,
        explanation:
          'The shift converts an untradable discontinuity into a known, priced cost.',
      },
      {
        id: 'barrier-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Close to expiry and close to the barrier, a reverse knock-out’s delta can change sign.',
        correctAnswer: true,
        explanation:
          'A move towards the barrier adds intrinsic value and simultaneously raises the chance of losing everything, so the hedge flips.',
      },
      {
        id: 'barrier-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why do barrier trades generate disputes more often than vanillas?',
        options: [
          'Because they settle physically rather than in cash',
          'Because the premium is paid at expiry rather than up front',
          'Because whether the level actually traded, and where, has to be determined',
          'Because their strike is set retrospectively',
        ],
        correctIndex: 2,
        explanation:
          'A single print in a thin market can decide the whole payoff, which is why ISDA publishes barrier determination language.',
      },
      {
        id: 'barrier-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'Two barrier options that finish at the same level always settle for the same amount.',
        correctAnswer: false,
        explanation:
          'The path decides. One may have touched the barrier on the way and been extinguished, and it pays nothing.',
      },
    ],
  },
  {
    id: 'rangeacc',
    categoryId: 'exotics',
    name: 'Range Accrual Note',
    hook: 'A coupon that only earns on the days you are right',
    summary:
      'A range accrual note pays an above-market coupon, but only for the days its reference — a rate, a currency, a spread — sits inside an agreed range. Every day outside the range earns nothing. The investor is selling a strip of daily digital options and being paid for them in coupon, which makes the note a short volatility position dressed as a bond. It is the most common way a private client ends up short an option without ever having bought or sold one.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A note pays a headline coupon rate scaled by the fraction of days in the period on which the reference fixes inside the range: coupon × (days in range ÷ days in period). Fix inside on every day and the investor earns the headline rate, which is deliberately set well above what the same issuer pays on a plain note. Fix outside on every day and the coupon is zero, though the principal is usually still repaid at maturity.',
        callout:
          'The headline rate is not a yield. It is the maximum yield, achieved only on the path where the reference never leaves the range.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Each day is a separate digital: inside pays a slice of coupon, outside pays nothing. Selling that strip is what funds the enhancement, so the wider the range, the lower the coupon, and the narrower the range, the more the note pays for a smaller chance of collecting it. Days that are not business days take the previous fixing, and the last few days of a period are often frozen on an earlier fix so the coupon can be calculated and paid on time. Most issues are callable by the issuer, which truncates the note exactly when it has been performing.',
        callout:
          'Read the observation convention before the coupon. Whether a weekend inherits Friday’s fix, and how many days are frozen at the end, changes the payoff in a way the headline rate never shows.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'The buyer is expressing a view that a market will stay quiet, and being paid for it in a form that looks like income. It suits an investor who needs a yield target and believes the reference is range-bound — which is why range accruals sell heavily when rates have been stable for a while, and why so many of them were written just before they were not. The issuer, meanwhile, gets cheap funding: it buys the option strip back from the investor and hedges it in the market.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The reference is what gets observed — commonly a three-month benchmark such as SOFR or EURIBOR, an FX rate, or a CMS spread between two swap rates. The range may be fixed for the note’s life or step wider each year. The accrual factor is the fraction of days in range. A dual range accrual conditions the coupon on two references at once, and pays only on days when both are inside, which multiplies the chance of a zero coupon rather than adding to it.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The investor is short volatility and cannot stop being short it: a market that becomes turbulent both cuts the coupon and marks the note down, at the same time. The note is an unsecured claim on its issuer, so the credit risk sits alongside the market risk. Secondary liquidity is thin and the exit price is whatever the arranger quotes. And the call feature is asymmetric — the issuer calls when the structure is cheap to replace, which is when the investor was doing well.',
        callout:
          'A long-dated range accrual on a rate near the edge of its range is one of the most convex positions a retail investor can hold: coupon, mark-to-market and call probability all move against them together.',
      },
    ],
    keyTerms: [
      {
        term: 'Accrual factor',
        definition:
          'The fraction of days in the period on which the reference fixed inside the range.',
      },
      {
        term: 'Reference',
        definition:
          'The observed rate, currency or spread whose daily fixing decides whether coupon accrues.',
      },
      {
        term: 'Headline coupon',
        definition:
          'The maximum annual rate, earned only if the reference stays inside the range every day.',
      },
      {
        term: 'Issuer call',
        definition:
          'The issuer’s right to redeem the note early, typically exercised when the structure has performed.',
      },
      {
        term: 'Dual range accrual',
        definition:
          'A version conditioning the coupon on two references, paying only on days both are inside.',
      },
      {
        term: 'Frozen fixing',
        definition:
          'The convention of carrying the last observed fix over the final days of a period so the coupon can be settled.',
      },
    ],
    example: {
      title: 'What the headline coupon actually pays',
      lines: [
        'An investor buys $1m of a one-year note paying 6.5% for each day three-month SOFR fixes between 3.00% and 4.50%.',
        'The same issuer’s plain one-year note pays 4.00%, so the enhancement is 250bp.',
        'SOFR fixes inside the range on 232 of the 360 accrual days.',
        'The accrual factor is 232 ÷ 360 = 0.644, so the coupon is 6.5% × 0.644 = 4.19%.',
        'The investor receives $41,889 rather than the $65,000 the headline rate implies.',
        'Had SOFR been inside on only 200 days, the coupon would be 6.5% × 200 ÷ 360 = 3.61% — below the plain note.',
      ],
      takeaway:
        'The break-even is the number of days in range, not the direction of rates. Here it is 222 days: below that, the investor has sold a strip of options for less than the plain bond would have paid.',
    },
    inPractice:
      'Range accruals are a private banking and insurance staple, sold as yield enhancement to buyers who want income without an explicit derivatives mandate. Dealers run the other side as a short-dated digital book and hedge the skew; the note’s call feature is what lets the issuer keep the funding cheap when the hedge becomes expensive.',
    relatedProductIds: ['digital', 'capfloor', 'cliquet'],
    quiz: [
      {
        id: 'rangeacc-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A range accrual note pays its headline coupon regardless of where the reference fixes.',
        correctAnswer: false,
        explanation:
          'The coupon is scaled by the fraction of days inside the range; days outside earn nothing.',
      },
      {
        id: 'rangeacc-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'How is the coupon on a range accrual calculated?',
        options: [
          'The headline rate times the fraction of days the reference fixed inside the range',
          'The headline rate less the average distance from the range',
          'The reference rate itself, capped at the headline rate',
          'The headline rate, paid only if the reference ends the period inside the range',
        ],
        correctIndex: 0,
        explanation:
          'It is a daily count: each day inside pays its slice, each day outside pays none.',
      },
      {
        id: 'rangeacc-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'An investor in a range accrual note is effectively short a strip of daily digital options.',
        correctAnswer: true,
        explanation:
          'Selling those digitals is what funds the enhanced coupon, which makes the note a short volatility position.',
      },
      {
        id: 'rangeacc-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Two otherwise identical notes differ only in the width of their range. What follows?',
        options: [
          'The wider range carries the higher headline coupon',
          'The narrower range carries the higher headline coupon',
          'Both carry the same coupon, since the expected accrual is equal',
          'The wider range pays more only if the issuer cannot call',
        ],
        correctIndex: 1,
        explanation:
          'A narrower range sells more expensive optionality for a smaller chance of collecting it, so it must pay more.',
      },
      {
        id: 'rangeacc-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Most range accrual notes are callable by the investor rather than the issuer.',
        correctAnswer: false,
        explanation:
          'The call sits with the issuer, and it is exercised when the note has been performing — precisely when the investor would rather keep it.',
      },
      {
        id: 'rangeacc-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt: 'What view does a range accrual buyer take?',
        options: [
          'That the reference will rise steadily over the note’s life',
          'That volatility will increase sharply',
          'That the reference will stay range-bound',
          'That the issuer’s credit spread will tighten',
        ],
        correctIndex: 2,
        explanation:
          'The buyer is paid for quiet markets and loses the coupon when the reference travels.',
      },
      {
        id: 'rangeacc-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'From the issuer’s side, a range accrual is a way of raising funding more cheaply than a plain note.',
        correctAnswer: true,
        explanation:
          'It buys the option strip from the investor and hedges it, and the difference is what cheapens the funding.',
      },
      {
        id: 'rangeacc-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What does a dual range accrual condition the coupon on?',
        options: [
          'Two references at once, paying only on days both are inside their ranges',
          'Two ranges for the same reference, paying the wider of the two',
          'The reference and the issuer’s credit rating',
          'Two payment dates in each period rather than one',
        ],
        correctIndex: 0,
        explanation:
          'Requiring both conditions multiplies the chance of a zero coupon rather than diversifying it away.',
      },
      {
        id: 'rangeacc-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Weekends and holidays are normally treated as accruing at the previous business day’s fixing.',
        correctAnswer: true,
        explanation:
          'The convention matters: a Friday fix outside the range can cost three days of coupon rather than one.',
      },
      {
        id: 'rangeacc-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The reference moves sharply outside the range and stays there. What happens to the investor?',
        options: [
          'The coupon stops but the note’s market value is unaffected',
          'The coupon stops and the note marks down at the same time',
          'The principal is written down in proportion to the days missed',
          'The issuer is obliged to call the note at par',
        ],
        correctIndex: 1,
        explanation:
          'Both effects come from the same move, which is what makes the position more convex than it looks.',
      },
      {
        id: 'rangeacc-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'A range accrual note carries the credit risk of its issuer as well as its market risk.',
        correctAnswer: true,
        explanation:
          'It is an unsecured claim in note form; the structure sits on top of that, it does not replace it.',
      },
      {
        id: 'rangeacc-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Why is the secondary market price of a range accrual note hard to challenge?',
        options: [
          'Because the notes are cleared and prices are published daily',
          'Because they trade on exchange, where the closing price is binding',
          'Because liquidity is thin and the arranger is usually the only quote',
          'Because the price is fixed at par until maturity by the terms',
        ],
        correctIndex: 2,
        explanation:
          'An exit is a negotiation with the party that sold it, which is a reason to hold the note only if you can hold it to maturity.',
      },
    ],
  },
  {
    id: 'accum',
    categoryId: 'exotics',
    name: 'Accumulator',
    hook: 'Buy at a discount daily, until it goes wrong',
    summary:
      'An accumulator commits the buyer to purchase a fixed quantity of an asset at a discounted strike on every fixing date, for as long as the contract survives. It knocks out — ends — once the price rises above a level a little above spot, and it doubles the quantity bought on any day the price is below the strike. The upside is therefore capped by the knock-out and the downside is geared and runs to maturity, which is why the structure earned the nickname “I kill you later”.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Three numbers define it: the strike, set below spot so the buyer appears to be buying at a discount; the knock-out level, set above spot, which ends the contract early if reached; and the daily quantity. A twelve-month accumulator on a share might buy 1,000 shares a day at a 5% discount, knocking out 3% above spot. There is normally no premium — the buyer pays nothing at the outset, which is exactly what disguises the position being taken.',
        callout:
          'A decumulator is the mirror image: the client sells daily at a premium to spot, knocks out on a fall, and is geared into a rally.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'On each fixing, if the price is between the strike and the knock-out, the buyer takes the standard quantity at the strike. If it is below the strike, the buyer takes double — this is the gearing, and it is the feature that funds the discount. If it is at or above the knock-out, the contract terminates and no further quantity is delivered. Per fixing the buyer is long one knock-out call and short two knock-out puts struck at the same level, and the premium of those two sold puts is what pays for the discounted strike.',
        callout:
          'Zero premium never means zero cost. It means the cost was collected in options sold rather than in cash paid.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'The honest use is accumulation: an investor who genuinely wants a large holding, is happy to build it over a year, and will not mind owning twice as much if the price falls. Sold that way to someone with the balance sheet to finish the programme, it is a reasonable way to average into a position at below the running price. The structure is not dishonest; what makes it dangerous is selling it to a buyer who cannot fund the geared leg and has been shown only the discount.',
      },
      {
        step: 4,
        title: 'The asymmetry',
        content:
          'Look at what each side of the payoff earns. On the upside, the contract knocks out within days or weeks, and the total gain is the discount multiplied by the small quantity accumulated before it ended. On the downside there is no knock-out at all: the buyer keeps taking double quantity at a strike now far above the market, every day, for the full term. The best case is a few weeks of a modest discount; the worst case is a year of a doubling loss.',
        callout:
          'Rule of thumb for reading any zero-premium structure: find the leg with no termination clause on it. That is where the risk lives.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Losses are settled as they accrue, so the buyer needs cash or credit throughout, not only at maturity — banks post margin calls against these and force liquidation when they are unmet. The position is illiquid: unwinding early means asking the dealer to price a mark on its own structure. And the mis-selling record is long, because the discount is easy to explain and the gearing is not. Accumulators sold across Asian private banking in 2007 and 2008 produced very large client losses when equity markets fell, and litigation and regulatory action followed in several jurisdictions.',
        callout:
          'In October 2008 the Hong Kong conglomerate Citic Pacific disclosed losses of roughly HK$15bn on leveraged Australian dollar contracts from this family, taken on to hedge an iron ore project.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike',
        definition:
          'The discounted price at which the buyer takes delivery on each fixing date.',
      },
      {
        term: 'Knock-out level',
        definition:
          'The price above spot at which the contract terminates early, capping the buyer’s gain.',
      },
      {
        term: 'Gearing',
        definition:
          'The multiple — usually two — applied to the daily quantity on fixings below the strike.',
      },
      {
        term: 'Daily quantity',
        definition:
          'The standard amount purchased on each fixing when the price is between the strike and the knock-out.',
      },
      {
        term: 'Decumulator',
        definition:
          'The mirror structure, selling a daily quantity above spot and geared into a rally.',
      },
      {
        term: 'Zero premium',
        definition:
          'A structure with no up-front cost, funded by options the client has sold rather than bought.',
      },
    ],
    example: {
      title: 'The whole upside against one day of the downside',
      lines: [
        'A share trades at HK$100. The accumulator buys 1,000 shares a day at a strike of HK$95, knocking out at HK$103, for twelve months.',
        'The price rallies and touches HK$103 after ten fixings, so the contract terminates.',
        'The buyer accumulated 10,000 shares at a HK$5 discount: a gain of HK$50,000, and it is over.',
        'Take the other path instead: the price falls to HK$70 and stays there.',
        'Below the strike the quantity doubles, so the buyer takes 2,000 shares a day at HK$95 against a market at HK$70.',
        'That is 2,000 × HK$25 = HK$50,000 of loss per fixing, with no knock-out to stop it and eleven months to run.',
      ],
      takeaway:
        'One day on the wrong side costs what the entire good outcome pays. The discount is real, and it is the smallest number in the contract.',
    },
    inPractice:
      'Accumulators are a private banking product, written on single shares, indices and currencies for clients with margin facilities. Regulators in Hong Kong and Singapore tightened suitability and disclosure requirements after the 2008 losses, and the structure is now generally restricted to professional or accredited investors — which is a statement about who was sold it before.',
    relatedProductIds: ['tarf', 'barrier', 'eqopt'],
    quiz: [
      {
        id: 'accum-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An accumulator commits the buyer to purchase a set quantity at a discounted strike on each fixing date.',
        correctAnswer: true,
        explanation:
          'That daily obligation is the contract; the discount to spot is what makes it look attractive.',
      },
      {
        id: 'accum-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'Where are the strike and the knock-out set relative to spot?',
        options: [
          'Strike above spot, knock-out below it',
          'Strike below spot, knock-out above it',
          'Both above spot, at different distances',
          'Both below spot, bracketing the discount',
        ],
        correctIndex: 1,
        explanation:
          'Buying below the market is the inducement; the knock-out above it is what ends the good outcome early.',
      },
      {
        id: 'accum-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'On a fixing where the price is below the strike, the buyer takes the normal quantity.',
        correctAnswer: false,
        explanation:
          'The quantity doubles. That gearing on the losing side is what pays for the discount on the winning one.',
      },
      {
        id: 'accum-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Per fixing, what option position is the accumulator buyer holding?',
        options: [
          'Long two knock-out calls and short one knock-out put',
          'Long one knock-out call and short two knock-out puts',
          'Long a vanilla call spread with no barrier',
          'Short a one-touch digital at the knock-out level',
        ],
        correctIndex: 1,
        explanation:
          'Above the strike the buyer gains like a call; below it, they take double delivery, which is two short puts.',
      },
      {
        id: 'accum-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'An accumulator that costs nothing at inception carries no cost to the buyer.',
        correctAnswer: false,
        explanation:
          'The cost was paid in options sold rather than cash — zero premium describes the cash flow, not the risk.',
      },
      {
        id: 'accum-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'For which buyer is an accumulator a defensible trade?',
        options: [
          'One who wants a large holding, will build it over a year, and can fund twice the size',
          'One who wants short-term exposure to a sharp rally',
          'One who wants protection against a fall in the underlying',
          'One who needs a guaranteed return over a fixed horizon',
        ],
        correctIndex: 0,
        explanation:
          'Genuine accumulation at a discount is the honest use; every other buyer is exposed to the geared leg they did not want.',
      },
      {
        id: 'accum-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A decumulator is the mirror structure, selling a fixed quantity daily above spot.',
        correctAnswer: true,
        explanation:
          'It knocks out on a fall and is geared into a rally — the same asymmetry, pointed the other way.',
      },
      {
        id: 'accum-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What caps the buyer’s total gain on an accumulator?',
        options: [
          'A maximum profit written into the confirmation',
          'The knock-out, which usually ends the contract within weeks',
          'The dealer’s right to reset the strike upwards',
          'The requirement to sell back the accumulated shares at the strike',
        ],
        correctIndex: 1,
        explanation:
          'A rally triggers the knock-out, so the gain is the discount on however little was accumulated first.',
      },
      {
        id: 'accum-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The downside of an accumulator has its own knock-out, limiting how far losses can run.',
        correctAnswer: false,
        explanation:
          'There is no knock-out on the losing side. The geared purchases continue to the final fixing.',
      },
      {
        id: 'accum-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why can an accumulator force a buyer out of the position at the worst moment?',
        options: [
          'Because the contract must be novated once losses exceed the premium',
          'Because losses settle as they accrue and unmet margin calls trigger liquidation',
          'Because the knock-out reverses and the buyer becomes a seller',
          'Because the dealer can terminate at will after a fall',
        ],
        correctIndex: 1,
        explanation:
          'Funding the geared leg is a continuous cash requirement, and a buyer without the facility is closed out.',
      },
      {
        id: 'accum-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Accumulators sold to private clients in Asia in 2007 and 2008 produced large losses and subsequent regulatory action.',
        correctAnswer: true,
        explanation:
          'The discount was easy to explain and the gearing was not, which is the shape most mis-selling cases take.',
      },
      {
        id: 'accum-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A client wants to exit an accumulator six months in. What are they facing?',
        options: [
          'An exchange price, since accumulators are listed contracts',
          'A negotiated unwind priced by the same dealer that sold the structure',
          'An automatic termination at the original strike',
          'A transfer to the clearing house at the daily settlement price',
        ],
        correctIndex: 1,
        explanation:
          'These are bilateral OTC contracts with no secondary market, so the mark comes from the counterparty.',
      },
    ],
  },
  {
    id: 'tarf',
    categoryId: 'exotics',
    name: 'Target Redemption Forward',
    hook: 'A better rate that stops once you have won enough',
    summary:
      'A target redemption forward is a strip of forwards dealt at a rate better than the market, which terminates as soon as the client’s cumulative gain reaches an agreed target. On fixings that go the other way there is no target and no termination — instead the notional is usually doubled. It is sold as a zero-cost hedge, and its defining feature is that the protection ends when it is working while the obligation continues, at twice the size, when it is not.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A TARF is a series of monthly or quarterly fixings against a single strike, set at a visibly better rate than the outright forward for the same dates. Each fixing that lands on the client’s side of the strike produces a gain, and those gains are added up. When the running total reaches the target the whole structure redeems and every remaining fixing is cancelled. Each fixing on the wrong side settles at the strike on a geared notional, commonly twice the standard amount.',
        callout:
          'The target is quoted in the currency’s own units — 300 paise, 200 pips, three big figures — and it is a cap on the client’s total benefit, not on their loss.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Take an exporter selling dollars. The strike is above the forward, so every fixing below it is a gain, banked and counted towards the target. Every fixing above it is a loss, settled on double the notional and not counted towards anything. Two or three good fixings can exhaust the target and end the structure within a quarter, leaving the remaining exposure unhedged at whatever the market has become. A bad run has no equivalent stopping rule and continues to the final fixing.',
        callout:
          'Ask what happens to the fixing that breaches the target: some contracts pay the full amount, some only the part that reaches the target exactly, and some pay nothing at all on it. The three settle differently and all three are sold as the same product.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It is sold to corporates as a hedge that improves on the forward rate at no up-front cost, and to funds as a carry trade with a defined good outcome. The rate really is better, and in a range-bound market the structure really does redeem early with a gain. What is being sold to obtain that is the geared leg: the corporate is writing options to the bank, and the improvement on the forward is the premium, paid to it in the form of a nicer number.',
      },
      {
        step: 4,
        title: 'Why it is not a hedge',
        content:
          'Two features break the hedge. Gearing means that on the wrong side the client transacts twice its underlying exposure, so half of that leg is a naked position in a currency it does not have. And the target means the structure disappears exactly when it has been protecting the client, leaving the rest of the year unhedged. A hedge is supposed to be worth more when the exposure is worth less; a TARF is designed to stop as soon as it starts doing so.',
        callout:
          'Test any structure against this: if it cancels itself when it pays and doubles itself when it costs, what has been bought is not protection.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The loss is unbounded on the geared leg and settles fixing by fixing, so it consumes cash and credit lines through the life of the trade. Mark-to-market swings are violent because the target and the gearing are both path-dependent. And the record is well documented: Korean SMEs holding knock-in knock-out forwards and Brazilian corporates including Aracruz and Sadia took losses running into billions of dollars when their currencies moved sharply in 2008, and litigation ran for years afterwards. Several regulators, India’s among them, responded by requiring corporate hedges to be backed by a real underlying exposure and restricting leveraged structures.',
        callout:
          'The 2015 removal of the Swiss franc floor did the same thing again to a later generation of TARF holders, within minutes rather than months.',
      },
    ],
    keyTerms: [
      {
        term: 'Target',
        definition:
          'The cumulative gain that, once reached, redeems the structure and cancels all remaining fixings.',
      },
      {
        term: 'Gearing ratio',
        definition:
          'The multiple applied to the notional on fixings that settle against the client, usually two.',
      },
      {
        term: 'Enhanced strike',
        definition:
          'The better-than-forward rate the client deals at, funded by the options it has implicitly sold.',
      },
      {
        term: 'Redemption',
        definition:
          'Early termination of the whole strip once the target is reached, whatever fixings remain.',
      },
      {
        term: 'Knock-in knock-out forward',
        definition:
          'A close relative pairing a barrier that cancels protection with one that activates a geared obligation.',
      },
      {
        term: 'Pivot TARF',
        definition:
          'A variant with two strikes, paying inside a band and gearing outside it on either side.',
      },
    ],
    example: {
      title: 'An exporter’s twelve fixings, and the two that end them',
      lines: [
        'An Indian exporter receives $1m a month. The twelve-month USD/INR forward strip prices around ₹84.00.',
        'A TARF offers a strike of ₹85.50 on $1m per fixing, geared to $2m above the strike, with a 300 paise target.',
        'Month one fixes at ₹84.00: the exporter sells $1m at 85.50 and gains ₹1.50 per dollar — ₹1.5m, and 150 paise of the target.',
        'Month two fixes at ₹84.00 again: another ₹1.5m and another 150 paise. The target is met and the structure redeems.',
        'Total benefit: ₹3m, with ten months of receipts now unhedged.',
        'Now the other path. Month one fixes at ₹88.00: the exporter must sell $2m at 85.50, ₹2.50 below the market.',
        'That is ₹2.50 × 2,000,000 = ₹5m on one fixing, and nothing counts towards any target.',
      ],
      takeaway:
        'The best case is ₹3m and an early exit; a single bad fixing costs ₹5m and there are eleven more behind it. The exporter also sold $1m a month it does not receive.',
    },
    inPractice:
      'TARFs are quoted by bank FX structuring desks to corporate treasuries and to funds running carry strategies, most heavily in currencies with a wide forward premium — the rupee, the real, the lira, the won. Regulatory reporting requirements mean the volumes are now visible in trade repositories, which was not true in 2008.',
    relatedProductIds: ['accum', 'fxfwd', 'ndf'],
    quiz: [
      {
        id: 'tarf-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A target redemption forward terminates once the client’s cumulative gains reach an agreed target.',
        correctAnswer: true,
        explanation:
          'That is the redemption feature, and it caps the total benefit rather than the total loss.',
      },
      {
        id: 'tarf-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What is the target in a TARF a limit on?',
        options: [
          'The client’s cumulative gain',
          'The client’s cumulative loss',
          'The number of fixings in the strip',
          'The size of any single fixing’s notional',
        ],
        correctIndex: 0,
        explanation:
          'Reaching it ends the trade. Nothing in the structure counts or caps the losses.',
      },
      {
        id: 'tarf-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Fixings that go against the client also count towards the target, offsetting the gains.',
        correctAnswer: false,
        explanation:
          'Only gains accumulate. Losses settle on the geared notional and leave the target untouched.',
      },
      {
        id: 'tarf-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why does the settlement rule for the fixing that breaches the target matter?',
        options: [
          'It decides whether the strike is reset for later fixings',
          'It decides whether that fixing pays in full, pays only up to the target, or pays nothing',
          'It decides whether the trade is reported to a trade repository',
          'It decides whether the gearing applies to the earlier fixings retrospectively',
        ],
        correctIndex: 1,
        explanation:
          'Full, exact and no-settlement variants are all sold as the same structure and settle differently.',
      },
      {
        id: 'tarf-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'The better-than-forward strike in a TARF is effectively premium paid to the client for options it has written.',
        correctAnswer: true,
        explanation:
          'Nothing is free: the improvement on the forward is the price of the geared leg, delivered as a rate rather than as cash.',
      },
      {
        id: 'tarf-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'In which market conditions does a TARF work as advertised?',
        options: [
          'A sharp trend against the client’s exposure',
          'A range-bound market that drifts gently in the client’s favour',
          'A market with rising implied volatility',
          'A market where the forward premium collapses to zero',
        ],
        correctIndex: 1,
        explanation:
          'It redeems early with a gain — which is precisely the environment in which a hedge was least needed.',
      },
      {
        id: 'tarf-q7',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A geared TARF can leave a corporate transacting more currency than its underlying exposure.',
        correctAnswer: true,
        explanation:
          'At twice the notional, half the geared leg is a naked position in currency the company does not have.',
      },
      {
        id: 'tarf-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What is the central objection to describing a TARF as a hedge?',
        options: [
          'It is documented under an ISDA master rather than a loan agreement',
          'It settles in cash rather than by delivery',
          'It cancels itself when it is protecting the client and doubles when it is not',
          'It cannot be marked to market between fixings',
        ],
        correctIndex: 2,
        explanation:
          'A hedge should be worth more as the exposure is worth less; this one is designed to stop at that point.',
      },
      {
        id: 'tarf-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Once a TARF redeems, the client’s remaining underlying exposure is left unhedged.',
        correctAnswer: true,
        explanation:
          'Every remaining fixing is cancelled, at whatever level the market has by then reached.',
      },
      {
        id: 'tarf-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why does a TARF consume credit and cash through its life rather than only at maturity?',
        options: [
          'Because premium is paid in instalments over the term',
          'Because losses on the geared leg settle fixing by fixing',
          'Because the target must be collateralised in advance',
          'Because the strike is reset monthly against the spot rate',
        ],
        correctIndex: 1,
        explanation:
          'Each adverse fixing is a real payment, which is what turns a market loss into a funding problem.',
      },
      {
        id: 'tarf-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Corporates in Korea and Brazil took very large losses on this family of structures when their currencies moved sharply in 2008.',
        correctAnswer: true,
        explanation:
          'Knock-in knock-out forwards and leveraged target forwards produced losses running into billions of dollars, and years of litigation.',
      },
      {
        id: 'tarf-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'What did several regulators require of corporate hedging after those losses?',
        options: [
          'That every hedge be centrally cleared',
          'That hedges be backed by a real underlying exposure, with leveraged structures restricted',
          'That corporates hold options rather than forwards',
          'That banks guarantee a minimum outcome on any structured hedge',
        ],
        correctIndex: 1,
        explanation:
          'The rule attacks the gearing directly: you may not transact more than you actually have to hedge.',
      },
    ],
  },
  {
    id: 'cliquet',
    categoryId: 'exotics',
    name: 'Cliquet Option',
    hook: 'A chain of options, each struck where the last one ended',
    summary:
      'A cliquet — or ratchet — is a series of forward-starting options whose strike resets at each observation date to wherever the underlying then stands. The payoff is the sum of the period returns, each usually capped and floored. Because the strike follows the market, the buyer is never left holding an option struck somewhere the underlying has long since left, which is what makes cliquets the standard engine inside capital-protected notes.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Split the term into periods — usually years or quarters. At the start of each period the strike is set at the current level of the underlying, and at the end of it the return over that period is measured. The final payoff is the sum of those period returns, with a local cap and floor applied to each one and often a global cap and floor applied to the total. A local floor of zero is the common case, so a losing period contributes nothing rather than a negative.',
        callout:
          'The floor is what makes capital protection possible: if no period can contribute a loss, the worst outcome for the option is zero, and the note repays its principal.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Each period is a forward-starting option: its strike is unknown today and will be whatever the underlying is worth on the reset date. That makes the cliquet a position in forward volatility — the volatility the market expects between two future dates — rather than in volatility from today. It is also a position in forward skew, because the local cap and floor are struck relative to a level that has not yet been set. Neither is directly observable, which is why cliquets are priced with models that specify how volatility itself moves.',
        callout:
          'A cliquet cannot be hedged with a fixed strip of vanillas: no vanilla exists today with a strike that will be set in a year’s time.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'For the investor, the appeal is that gains already made cannot be given back — a good first year is banked whatever happens later, which a single long-dated option cannot promise. That suits the retail structured note market, where a capital-protected note paying the sum of capped annual index returns is easy to explain and easy to sell. For the issuer, the cliquet is the piece that turns a zero-coupon bond plus an option budget into a product with an upside story.',
      },
      {
        step: 4,
        title: 'Caps, floors and what they cost',
        content:
          'The local cap is what pays for the local floor: capping each period at, say, 8% is what funds the promise that no period can subtract. In a strongly trending market that trade is bad for the investor, because every year’s return is truncated while compounding is given up. A reverse cliquet inverts the structure — it pays a high fixed coupon reduced by the sum of the negative period returns — and it is the version that turns a series of small falls into a total loss of coupon.',
        callout:
          'The sum of capped period returns is not the same as the return on the underlying over the term. It can be higher or lower, and the difference is the whole product.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The buyer’s risk is the cap: a market that rises steadily pays far less than simply holding the index. The dealer’s risk is worse and less obvious — a cliquet book is short forward volatility and short forward skew, exposures that cannot be hedged with vanilla options and that move violently together in a crisis. Banks running large cliquet and reverse-cliquet books took heavy losses in the 2008 sell-off for exactly that reason, and the structures became markedly more expensive to buy afterwards.',
        callout:
          'Cliquets are also model risk in its purest form: two banks using different stochastic volatility models can price the same structure several points apart and both be defensible.',
      },
    ],
    keyTerms: [
      {
        term: 'Reset date',
        definition:
          'The date on which the strike for the next period is set to the underlying’s current level.',
      },
      {
        term: 'Forward-starting option',
        definition:
          'An option whose strike is fixed at a future date rather than today, the building block of a cliquet.',
      },
      {
        term: 'Local cap and floor',
        definition:
          'The limits applied to each period’s return before the periods are summed.',
      },
      {
        term: 'Global cap and floor',
        definition:
          'Limits applied to the total payoff after the individual period returns have been added together.',
      },
      {
        term: 'Forward volatility',
        definition:
          'The volatility expected between two future dates, which is what a cliquet is priced on.',
      },
      {
        term: 'Reverse cliquet',
        definition:
          'A variant paying a high fixed coupon reduced by the sum of the negative period returns.',
      },
    ],
    example: {
      title: 'Two paths through a three-year cliquet',
      lines: [
        'A note pays the sum of three annual index returns, each capped at 8% and floored at 0%, with principal protected.',
        'Path one: the index returns +12%, then −5%, then +6%.',
        'Capped and floored, the periods contribute 8% + 0% + 6% = 14%.',
        'Holding the index over the same three years would have returned 1.12 × 0.95 × 1.06 − 1 = 12.8%.',
        'Path two: the index returns +20% in each of the three years.',
        'The cliquet pays 8% + 8% + 8% = 24%, while holding the index returns 1.20³ − 1 = 72.8%.',
      ],
      takeaway:
        'The floor wins in a choppy market and the cap loses badly in a trending one. The investor has swapped compounding for a promise that no year can hurt them.',
    },
    inPractice:
      'Cliquets sit inside a large share of the capital-protected notes sold to retail and insurance investors in Europe and Asia, and the exposure they create is one of the structural risks equity derivatives desks manage rather than trade. The desk’s position is the mirror of the note book, and unwinding it is a matter of years rather than days.',
    relatedProductIds: ['eqopt', 'varswap', 'rangeacc'],
    quiz: [
      {
        id: 'cliquet-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A cliquet’s strike is reset at each observation date to the underlying’s current level.',
        correctAnswer: true,
        explanation:
          'That ratcheting strike is what the name describes, and it is why gains already made cannot be given back.',
      },
      {
        id: 'cliquet-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What is a cliquet’s payoff?',
        options: [
          'The best single period return over the term',
          'The sum of the period returns, each capped and floored',
          'The return of the underlying between the first and last dates',
          'A fixed coupon paid if the underlying never falls',
        ],
        correctIndex: 1,
        explanation:
          'Each period is measured separately and the results are added, which is what separates it from a vanilla.',
      },
      {
        id: 'cliquet-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A local floor of zero means a losing period subtracts nothing from the total payoff.',
        correctAnswer: true,
        explanation:
          'That is what makes the option’s worst case zero, and therefore what makes capital protection affordable.',
      },
      {
        id: 'cliquet-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'What kind of volatility exposure does a cliquet create?',
        options: [
          'Spot volatility, from today to maturity',
          'Forward volatility, between two future dates',
          'Realised volatility only, with no implied component',
          'No volatility exposure, since the strikes reset',
        ],
        correctIndex: 1,
        explanation:
          'Each period is a forward-starting option, so what matters is the volatility expected between its reset and its end.',
      },
      {
        id: 'cliquet-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A cliquet can be hedged exactly with a fixed strip of vanilla options bought today.',
        correctAnswer: false,
        explanation:
          'No vanilla exists with a strike that will only be set in a year’s time, which is the whole hedging difficulty.',
      },
      {
        id: 'cliquet-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is the investor’s stated attraction to a cliquet?',
        options: [
          'It guarantees a minimum positive return each period',
          'Gains from good periods are locked in rather than given back later',
          'It removes the issuer’s credit risk from the note',
          'It pays the maximum of the period returns rather than the sum',
        ],
        correctIndex: 1,
        explanation:
          'A single long-dated option can be handed back everything by a late fall; a ratcheting strike cannot.',
      },
      {
        id: 'cliquet-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Capital-protected notes are typically built from a zero-coupon bond plus an option budget.',
        correctAnswer: true,
        explanation:
          'The bond returns the principal and whatever is left over buys the cliquet that provides the upside.',
      },
      {
        id: 'cliquet-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does the local cap pay for?',
        options: [
          'The local floor, and with it the capital protection',
          'The issuer’s credit enhancement',
          'The right to redeem the note early',
          'The removal of the global cap',
        ],
        correctIndex: 0,
        explanation:
          'Truncating each good period is what funds the promise that no bad period can subtract.',
      },
      {
        id: 'cliquet-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'In a steadily rising market, a capped cliquet pays less than simply holding the underlying.',
        correctAnswer: true,
        explanation:
          'Each year is truncated at the cap and the compounding is lost, so a strong trend is the worst case for the buyer.',
      },
      {
        id: 'cliquet-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What does a reverse cliquet pay?',
        options: [
          'The sum of the positive period returns only',
          'A high fixed coupon reduced by the sum of the negative period returns',
          'The worst period return, multiplied by the number of periods',
          'The underlying’s return with the sign reversed',
        ],
        correctIndex: 1,
        explanation:
          'A run of small falls can therefore erase the entire coupon, which is what happened to these structures in 2008.',
      },
      {
        id: 'cliquet-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A dealer running a cliquet book is short forward volatility and short forward skew.',
        correctAnswer: true,
        explanation:
          'Both exposures move sharply together in a sell-off and neither can be closed out with vanilla options.',
      },
      {
        id: 'cliquet-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why can two banks quote materially different prices for the same cliquet?',
        options: [
          'Because they use different settlement calendars',
          'Because forward volatility is not directly observable and each model specifies its dynamics differently',
          'Because the underlying index is calculated differently for each',
          'Because one prices in cash and the other in shares',
        ],
        correctIndex: 1,
        explanation:
          'This is model risk in its purest form: the inputs that matter most cannot be read off a screen.',
      },
    ],
  },
];
