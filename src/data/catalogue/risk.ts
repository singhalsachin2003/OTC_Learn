import type { Product } from '../types';

/**
 * Risk and the Greeks — the second paid asset class, and the one that is not
 * an asset class at all. Ids are stable: saved progress is keyed by them.
 *
 * The other six teach what a product is; this one teaches what a desk does with
 * it once it is on the book. The path runs from the single number a rates desk
 * quotes its risk in, through the option Greeks, to the two things a risk
 * function actually reports upwards — yesterday's P&L, explained, and tomorrow's
 * loss, estimated.
 */
export const riskProducts: Product[] = [
  {
    id: 'dv01',
    categoryId: 'risk',
    name: 'DV01 and Rate Risk',
    hook: 'What one basis point is worth',
    summary:
      'DV01 is the change in the value of a position for a one basis point move in rates. It is how a rates desk states its risk, sets its limits and sizes its hedges, because it converts every instrument — a bond, a swap, a future, a whole book — into the same unit: money per basis point. Everything else in rates risk is a refinement of it.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'DV01 — the dollar value of a basis point — is the profit or loss from a 0.01% parallel move in the relevant rate. A position with a DV01 of $50,000 makes or loses $50,000 for every basis point. The sign says which way: a receiver of fixed on a swap gains when rates fall, so its DV01 is quoted against a fall. Because the unit is money, positions in different instruments and different currencies can be added, netted and compared, which is the entire reason the measure exists.',
        callout:
          'PV01 is often used interchangeably, but strictly it is the value of a basis point on the par rate — the annuity — rather than on the yield. On a par swap the two are close; on a deep off-market position they are not.',
      },
      {
        step: 2,
        title: 'How it is computed',
        content:
          'Two ways, and desks use both. Analytically, DV01 is approximately modified duration multiplied by price and by 0.0001, which is a clean closed form for a bond. Numerically, it is a bump-and-revalue: shift the whole curve up a basis point, reprice the book, take the difference. The bump is the honest method for anything with optionality, because it picks up effects a duration formula assumes away — and it is what a risk system actually runs overnight.',
        callout:
          'On a swap, DV01 is close to notional × annuity × 0.0001, where the annuity is the sum of the discounted accrual factors. That is why a ten-year swap has roughly eight times the risk of a one-year swap on the same notional.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It is the unit of the trading limit, the unit of the hedge ratio and the unit of the risk report. A trader told to run no more than $250,000 of DV01 knows exactly what that permits in every instrument on the desk. Hedging works the same way: to neutralise a position, trade the offsetting instrument in whatever size makes the two DV01s equal and opposite. The measure is what makes a bond, a swap and a future substitutable for one another as risk.',
      },
      {
        step: 4,
        title: 'Key rate risk',
        content:
          'A single DV01 assumes the curve moves in parallel, and it never does. Key rate DV01 — bucketed risk — reports the sensitivity to each part of the curve separately: two years, five, ten, thirty. A book can show a total DV01 of zero and still be heavily exposed to the curve steepening, because a long position at the front is offsetting a short at the back. The bucketed report is the one a desk head reads; the single number is the one the limit is set in.',
        callout:
          'Cross-currency and basis positions need their own buckets again: a book hedged in dollars against a euro exposure has no rate risk in the total and every kind of basis risk underneath it.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'DV01 is a first derivative, so it is only true for small moves. Convexity — the second derivative — means the measure understates gains and overstates losses on a long bond position as the move gets larger, and a book with options in it can see its DV01 change sign as rates move. It also says nothing about credit, liquidity or the funding of the hedge. It is a local, linear description of one risk, which is exactly why it is reported alongside stress scenarios rather than instead of them.',
        callout:
          'A convexity check is cheap: bump the curve up and down by 50bp rather than one, and see whether the two answers are symmetric. If they are not, the DV01 alone is not describing the position.',
      },
    ],
    keyTerms: [
      {
        term: 'DV01',
        definition:
          'The change in a position’s value for a one basis point parallel move in rates.',
      },
      {
        term: 'PV01',
        definition:
          'The value of a basis point on the par rate — the discounted annuity — rather than on the yield.',
      },
      {
        term: 'Modified duration',
        definition:
          'The percentage change in price per unit change in yield, from which DV01 is derived.',
      },
      {
        term: 'Key rate DV01',
        definition:
          'Risk reported bucket by bucket along the curve, rather than as one parallel-shift number.',
      },
      {
        term: 'Bump and revalue',
        definition:
          'Computing sensitivity by shifting an input, repricing the book and taking the difference.',
      },
      {
        term: 'Convexity',
        definition:
          'The second-order effect that makes DV01 inaccurate for large moves in either direction.',
      },
    ],
    example: {
      title: 'The DV01 of a ten-year swap',
      lines: [
        'A desk receives fixed on a $100m ten-year swap, annual payments, with the curve flat at 4%.',
        'The annuity is the sum of the ten discount factors: (1 − 1.04⁻¹⁰) ÷ 0.04 = 8.111.',
        'DV01 ≈ $100m × 8.111 × 0.0001 = $81,110 per basis point.',
        'Rates fall 5bp: the receiver gains roughly 5 × $81,110 = $405,550.',
        'To hedge it with a five-year swap, whose annuity is 4.452 and whose DV01 is therefore $44,520 per $100m, a first guess doubles the notional: ten years is twice five, so $200m.',
        'Check it: $200m × 4.452 × 0.0001 = $89,040, which is more risk than the position has. The right size is $100m × 81,110 ÷ 44,520 = $182m.',
      ],
      takeaway:
        'The hedge ratio is the ratio of the DV01s, and it is not the ratio of the notionals. Matching notionals here would have left the desk with almost half its risk still on.',
    },
    inPractice:
      'Every rates desk runs a DV01 report by currency and by curve bucket, and the limit framework is written in it. The measure crosses into other desks too: a credit trader thinks in CS01, an FX forwards trader in the DV01 of the two currency legs, and a treasury function in the DV01 of the whole balance sheet.',
    relatedProductIds: ['irs', 'fra', 'cs01'],
    quiz: [
      {
        id: 'dv01-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'DV01 measures the change in a position’s value for a one basis point move in rates.',
        correctAnswer: true,
        explanation:
          'It converts rate risk into money per basis point, which is what makes different instruments comparable.',
      },
      {
        id: 'dv01-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Why is risk quoted in DV01 rather than in notional?',
        options: [
          'Because notional is confidential and DV01 is not',
          'Because equal notionals in different instruments carry very different risk',
          'Because DV01 includes credit risk and notional does not',
          'Because regulators require positions to be reported in basis points',
        ],
        correctIndex: 1,
        explanation:
          'A one-year and a ten-year swap on the same notional are nothing like the same position.',
      },
      {
        id: 'dv01-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'PV01 and DV01 are defined identically.',
        correctAnswer: false,
        explanation:
          'PV01 is the value of a basis point on the par rate; DV01 is on the yield. They are close on a par swap and not on an off-market one.',
      },
      {
        id: 'dv01-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does a bump-and-revalue calculation do?',
        options: [
          'Applies a duration formula to each instrument in turn',
          'Shifts an input, reprices the whole book and takes the difference',
          'Averages the sensitivity across the last 250 trading days',
          'Solves for the yield that sets the position’s value to zero',
        ],
        correctIndex: 1,
        explanation:
          'It is slower than a formula and it captures optionality a duration approximation assumes away.',
      },
      {
        id: 'dv01-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A swap’s DV01 is roughly its notional multiplied by the discounted annuity and by 0.0001.',
        correctAnswer: true,
        explanation:
          'Which is why the risk grows with maturity: the annuity is the sum of the discounted accrual factors.',
      },
      {
        id: 'dv01-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A desk hedges a position with a DV01 of $80,000 using an instrument with a DV01 of $40,000 per $100m. What size does it trade?',
        options: [
          '$40m',
          '$80m',
          '$200m',
          'The same notional as the original position',
        ],
        correctIndex: 2,
        explanation:
          '$200m × $40,000 ÷ $100m = $80,000 — the hedge ratio is the ratio of the DV01s, not of the notionals.',
      },
      {
        id: 'dv01-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'Trading limits on a rates desk are commonly expressed in DV01.',
        correctAnswer: true,
        explanation:
          'One number bounds the position in every instrument the desk can trade, which is what a limit needs to do.',
      },
      {
        id: 'dv01-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What can a book with a total DV01 of zero still be exposed to?',
        options: [
          'Nothing — it is fully hedged by definition',
          'Only credit risk, since rate risk has been removed',
          'A change in the shape of the curve, if its buckets offset each other',
          'Only the funding cost of the hedge',
        ],
        correctIndex: 2,
        explanation:
          'Long the front and short the back nets to zero in parallel and is a large position in the steepening.',
      },
      {
        id: 'dv01-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'Key rate DV01 reports sensitivity to each part of the curve separately.',
        correctAnswer: true,
        explanation:
          'It is the report a desk head reads, because the parallel assumption behind a single number never holds.',
      },
      {
        id: 'dv01-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why does DV01 become unreliable for large moves?',
        options: [
          'Because it is a first derivative and ignores convexity',
          'Because discount factors are only published to four decimal places',
          'Because the annuity is recalculated only at each reset',
          'Because it assumes the position will be held to maturity',
        ],
        correctIndex: 0,
        explanation:
          'The second-order term matters once the move is large, and on a book with options the DV01 itself can change sign.',
      },
      {
        id: 'dv01-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A DV01 figure tells you about the credit and liquidity risk of a position as well as its rate risk.',
        correctAnswer: false,
        explanation:
          'It is a local, linear description of one risk. That is why it is reported alongside stress scenarios, not instead of them.',
      },
      {
        id: 'dv01-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'How can a desk check cheaply whether DV01 alone describes a position?',
        options: [
          'Recompute it with a different day count convention',
          'Bump the curve up and down by 50bp and see whether the answers are symmetric',
          'Compare it against the position’s notional',
          'Run it against the previous day’s closing curve',
        ],
        correctIndex: 1,
        explanation:
          'Asymmetry is convexity, and convexity is precisely what the single number leaves out.',
      },
    ],
  },
  {
    id: 'delta',
    categoryId: 'risk',
    name: 'Delta and Gamma',
    hook: 'The hedge, and how fast the hedge goes stale',
    summary:
      'Delta is how much an option’s value moves for a one-unit move in the underlying, and it is therefore the size of the hedge. Gamma is how fast the delta itself changes, and it is therefore how often that hedge has to be redone. A delta-hedged option position is not a position in the underlying at all: it is a position in gamma against theta, which is the trade an options desk is actually running.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What delta is',
        content:
          'Delta is the first derivative of the option’s value with respect to the underlying, quoted between 0 and 1 for a call and 0 and −1 for a put. A call struck at the money has a delta near 0.5; deep in the money it approaches 1 and behaves like the underlying itself; far out of the money it approaches zero. Multiply the delta by the contract size and you have the equivalent position in the underlying, which is the number the desk hedges with.',
        callout:
          'Delta doubles as a rough probability of finishing in the money — close enough that traders use it as one, and different enough from the true probability that a pricing model does not.',
      },
      {
        step: 2,
        title: 'What gamma is',
        content:
          'Gamma is the rate of change of delta. A long option position, call or put, has positive gamma: the delta rises as the underlying rises and falls as it falls, so re-hedging always means selling into strength and buying into weakness. That is a profitable rule, and it is what the option premium paid for. A short option position has negative gamma and the opposite instruction — buy high, sell low — which is why a short gamma book loses more the more the market moves.',
        callout:
          'Gamma is largest at the money and close to expiry. An option one day from expiry has almost no time value left and almost all of the gamma in the book.',
      },
      {
        step: 3,
        title: 'Gamma against theta',
        content:
          'Theta is the value the option loses each day simply because a day has passed, and it is the rent paid for the gamma. Over a day, the profit from re-hedging a long gamma position is approximately half the gamma multiplied by the square of the move; the loss from theta is fixed and known. The position makes money if the underlying actually moves more than the option’s implied volatility said it would, and loses if it sits still. Buying an option is a bet on realised volatility exceeding implied, and delta hedging is how that bet is collected.',
        callout:
          'This is why a trader talks about a “break-even move”: the daily move at which gamma profit exactly pays the theta.',
      },
      {
        step: 4,
        title: 'Hedging in practice',
        content:
          'Nobody re-hedges continuously. A desk re-hedges on a band — when delta drifts beyond a threshold — or on a clock, and the choice is a trade-off between transaction costs and hedge error. Hedging too often eats the gamma profit in bid-offer; too rarely leaves the position exposed to the move between hedges. Gaps make it worse: an underlying that jumps rather than diffuses gives no opportunity to re-hedge at all, which is a loss for a short gamma book and a windfall for a long one.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Gamma is not stable: it concentrates at the strike as expiry approaches, so a book that looked balanced a week ago can be almost entirely gamma at one level. Barrier and digital payoffs make it worse, because their gamma is unbounded near the trigger. And a hedge in the underlying deals with delta alone — it leaves vega, and it introduces its own funding, borrow and settlement costs that the option’s theoretical value did not include.',
        callout:
          'A short gamma book is short exactly when it hurts: the position needs to trade most heavily in the direction the market is already moving, at the moment liquidity is worst.',
      },
    ],
    keyTerms: [
      {
        term: 'Delta',
        definition:
          'The change in an option’s value per unit change in the underlying, and so the size of the hedge.',
      },
      {
        term: 'Gamma',
        definition:
          'The rate of change of delta, and so how fast an existing hedge becomes wrong.',
      },
      {
        term: 'Theta',
        definition:
          'The value lost per day from the passage of time, which is what pays for gamma.',
      },
      {
        term: 'Delta hedging',
        definition:
          'Holding an offsetting position in the underlying so the option position has no directional exposure.',
      },
      {
        term: 'Break-even move',
        definition:
          'The daily move at which re-hedging profit exactly covers the position’s theta.',
      },
      {
        term: 'Gap risk',
        definition:
          'The exposure left when the underlying jumps rather than moves smoothly, giving no chance to re-hedge.',
      },
    ],
    example: {
      title: 'Re-hedging a long call, and what it earns',
      lines: [
        'A desk is long a call on 10,000 shares. The stock is $50, the delta is 0.50 and the gamma is 0.02 per $1.',
        'It hedges by shorting 0.50 × 10,000 = 5,000 shares, leaving no directional exposure.',
        'The stock rises $2. The delta rises by 0.02 × 2 = 0.04, to 0.54.',
        'The position is now long 5,400 delta against a 5,000 share short: net long 400 shares.',
        'Selling those 400 shares restores the hedge and banks the drift — approximately ½ × 0.02 × 10,000 × 2² = $400.',
        'If the option’s theta is $250 a day, that move paid the rent with $150 to spare; a $1 move would have earned only $100 and lost $150 on the day.',
      ],
      takeaway:
        'Gamma profit grows with the square of the move while theta is a straight line, so the position is a bet on realised volatility. The break-even here is a move of about $1.58 a day.',
    },
    inPractice:
      'Every options market maker runs this trade whether it wants to or not: quoting two-way prices leaves the desk long or short gamma, and the hedging programme is what turns that into P&L. The same arithmetic drives the “gamma squeeze” stories in equity markets, where dealers short a heavily traded strike have to buy into a rally to stay hedged.',
    relatedProductIds: ['fxopt', 'eqopt', 'vega'],
    quiz: [
      {
        id: 'delta-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A call option struck at the money has a delta of roughly 0.5.',
        correctAnswer: true,
        explanation:
          'It moves about half as much as the underlying, and the hedge is sized accordingly.',
      },
      {
        id: 'delta-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does delta tell a desk directly?',
        options: [
          'How much premium the option cost',
          'How much of the underlying to trade to remove the directional risk',
          'How much the option’s value falls each day',
          'How much implied volatility is priced into the option',
        ],
        correctIndex: 1,
        explanation:
          'Delta times contract size is the equivalent position in the underlying, which is what gets hedged.',
      },
      {
        id: 'delta-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt: 'A long option position, call or put, has positive gamma.',
        correctAnswer: true,
        explanation:
          'Delta rises with the underlying and falls with it, so re-hedging sells strength and buys weakness.',
      },
      {
        id: 'delta-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does re-hedging a short gamma position require?',
        options: [
          'Selling into a rally and buying into a fall',
          'Buying into a rally and selling into a fall',
          'Holding the hedge unchanged until expiry',
          'Trading the option itself rather than the underlying',
        ],
        correctIndex: 1,
        explanation:
          'Chasing the market is what makes a short gamma book lose more the more the market moves.',
      },
      {
        id: 'delta-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Gamma is largest for options far out of the money.',
        correctAnswer: false,
        explanation:
          'It is largest at the money, and it concentrates there as expiry approaches.',
      },
      {
        id: 'delta-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Approximately what does a long gamma position earn from a move of size ΔS?',
        options: [
          'Gamma × ΔS',
          'Half of gamma × ΔS²',
          'Delta × ΔS, less theta',
          'Vega × ΔS',
        ],
        correctIndex: 1,
        explanation:
          'The profit grows with the square of the move, which is why a quiet market cannot pay the theta.',
      },
      {
        id: 'delta-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Buying an option and delta hedging it is a bet that realised volatility exceeds implied volatility.',
        correctAnswer: true,
        explanation:
          'The hedging programme collects realised movement; the premium paid for it was priced off implied.',
      },
      {
        id: 'delta-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is theta, in the context of a delta-hedged option book?',
        options: [
          'The cost of borrowing the shares used in the hedge',
          'The rent paid each day for holding gamma',
          'The bid-offer spread charged on each re-hedge',
          'The sensitivity of the option to the dividend assumption',
        ],
        correctIndex: 1,
        explanation:
          'Time decay is the fixed daily cost the gamma profit has to cover.',
      },
      {
        id: 'delta-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Re-hedging as frequently as possible maximises the profit of a long gamma position.',
        correctAnswer: false,
        explanation:
          'Each re-hedge crosses a bid-offer spread, and hedging too often gives the gamma profit away in costs.',
      },
      {
        id: 'delta-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'Why is a gap in the underlying bad news for a short gamma book?',
        options: [
          'Because the option is automatically exercised at the gap',
          'Because there is no opportunity to re-hedge through the move',
          'Because implied volatility always falls after a gap',
          'Because the exchange cancels trades printed during a gap',
        ],
        correctIndex: 1,
        explanation:
          'Continuous hedging assumes a continuous path; a jump delivers the whole loss with no chance to trade through it.',
      },
      {
        id: 'delta-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Hedging delta in the underlying leaves the position exposed to a change in implied volatility.',
        correctAnswer: true,
        explanation:
          'A delta hedge deals with one Greek. Vega is untouched by it, and is the subject of its own hedge.',
      },
      {
        id: 'delta-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why do barrier and digital payoffs complicate a gamma book?',
        options: [
          'Their gamma is unbounded near the trigger',
          'They have no delta at all until the barrier is reached',
          'They cannot be hedged with the underlying, only with other options',
          'Their theta is positive rather than negative',
        ],
        correctIndex: 0,
        explanation:
          'A discontinuous payoff means the hedge itself is discontinuous, which is the problem the barrier shift exists to manage.',
      },
    ],
  },
  {
    id: 'vega',
    categoryId: 'risk',
    name: 'Vega and the Volatility Surface',
    hook: 'What a book loses when volatility reprices',
    summary:
      'Vega is the change in an option’s value for a one point move in implied volatility. Unlike delta it cannot be hedged in the underlying — only with other options — and unlike delta there is no single volatility to hedge against: every strike and every expiry has its own, and the shape they make is the volatility surface. Most of what an options desk argues about is a point on that surface.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Vega is the sensitivity of an option’s price to implied volatility, quoted per volatility point — the money made or lost if implied moves from 20% to 21%. It is positive for any long option, call or put, because more expected movement is worth more to the holder either way. A rough rule for an at-the-money option is that vega is about 0.4% of notional per year of maturity’s square root, so a one-year option carries roughly 0.4% and a four-year option roughly 0.8%.',
        callout:
          'Vega is not a Greek letter. The other sensitivities are named after real ones; this one was named later and by traders, which is a fair summary of how the volatility market developed.',
      },
      {
        step: 2,
        title: 'Where vega lives',
        content:
          'Vega is largest at the money and grows with the square root of time, so a long-dated at-the-money option carries far more of it than a short-dated one, while gamma does the opposite. A desk therefore thinks of its book in two halves: the front end, where gamma and theta dominate and volatility is realised, and the back end, where vega dominates and volatility is priced. Hedging one does very little for the other.',
        callout:
          'Vega is reported by expiry bucket for exactly this reason. A book flat in total vega can be long the front and short the back, which is a position in the term structure of volatility.',
      },
      {
        step: 3,
        title: 'The surface',
        content:
          'Implied volatility is not one number. Plot it against strike and it slopes — equity index puts trade at higher implied volatility than calls, because the demand for crash protection is one-sided and because markets fall faster than they rise. Plot it against maturity and it curves. The whole object is the volatility surface, and it is quoted in the market by its features: the at-the-money level, the risk reversal that prices the skew, and the butterfly that prices the wings.',
        callout:
          'Equity skew is a persistent downward slope; FX skew is more symmetric and flips sign with the market’s view of which currency is risky. The same instrument, two different surfaces.',
      },
      {
        step: 4,
        title: 'Second-order vega',
        content:
          'Two further sensitivities matter once a book is large. Volga — vega convexity — is how vega itself changes as volatility moves, and it is what makes a position in the wings behave very differently from one at the money. Vanna is the cross term: how vega changes as the underlying moves, or equivalently how delta changes as volatility moves. A delta and vega hedged book can still lose money when spot and volatility move together, which in a sell-off is exactly what they do.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Vega can only be hedged with other options, so the hedge carries its own gamma, theta and skew exposure, and it costs bid-offer in a market far less liquid than the underlying. The surface can also move in ways a single vega number does not capture — the level rising while the skew flattens is a common one, and it can turn a hedged-looking book into a losing day. And volatility is mean-reverting and spiky: it can double in a session, which makes vega risk more fat-tailed than the delta risk sitting beside it.',
        callout:
          'The standard sell-off pattern is all three at once: spot falls, the level of volatility rises, and the skew steepens. Books are usually hedged for one of the three.',
      },
    ],
    keyTerms: [
      {
        term: 'Vega',
        definition:
          'The change in an option’s value for a one point move in implied volatility.',
      },
      {
        term: 'Implied volatility',
        definition:
          'The volatility input that makes a model’s price equal the option’s market price.',
      },
      {
        term: 'Volatility surface',
        definition:
          'Implied volatility mapped across every strike and every maturity for one underlying.',
      },
      {
        term: 'Skew',
        definition:
          'The slope of implied volatility across strikes, quoted in the market as a risk reversal.',
      },
      {
        term: 'Volga',
        definition:
          'The sensitivity of vega to volatility itself — the convexity of the volatility exposure.',
      },
      {
        term: 'Vanna',
        definition:
          'The cross sensitivity: how vega moves with the underlying, or delta with volatility.',
      },
    ],
    example: {
      title: 'A volatility repricing on a hedged book',
      lines: [
        'A desk is long a one-year at-the-money option on $10m of notional. Vega is about 0.4% of notional per point, so roughly $40,000.',
        'Implied volatility rises from 20% to 22%: the position gains about 2 × $40,000 = $80,000.',
        'The desk is delta hedged, so none of that came from the underlying’s direction.',
        'Now suppose it had hedged the vega by selling a three-month option — vega about 0.2% of notional, so $20,000 per point — in $20m size, for $40,000 of vega.',
        'If the front-end implied rises 6 points while the one-year rises only 2, the hedge loses 6 × $40,000 = $240,000 against a $80,000 gain.',
        'The book was flat in total vega and short the term structure, which is a different position entirely.',
      ],
      takeaway:
        'Netting vega across maturities hides a position rather than removing one. The bucketed report is the one that describes the risk.',
    },
    inPractice:
      'Volatility is quoted, traded and risk-managed as its own asset on every options desk: the market makes prices in the at-the-money level, the risk reversal and the butterfly rather than in individual option premiums. Variance swaps exist because they give exposure to the whole surface at once without a delta hedging programme attached.',
    relatedProductIds: ['varswap', 'delta', 'cliquet'],
    quiz: [
      {
        id: 'vega-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Vega measures how much an option’s value changes for a one point move in implied volatility.',
        correctAnswer: true,
        explanation:
          'It is the position’s exposure to volatility being repriced, quoted in money per volatility point.',
      },
      {
        id: 'vega-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Which positions have positive vega?',
        options: [
          'Long calls only',
          'Long puts only',
          'Any long option position, call or put',
          'Any position that is delta hedged',
        ],
        correctIndex: 2,
        explanation:
          'More expected movement is worth more to a holder in either direction.',
      },
      {
        id: 'vega-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A long-dated at-the-money option carries more vega than a short-dated one of the same notional.',
        correctAnswer: true,
        explanation:
          'Vega grows roughly with the square root of maturity, while gamma does the opposite.',
      },
      {
        id: 'vega-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Why is vega reported by expiry bucket rather than as one total?',
        options: [
          'Because regulators require a maturity breakdown',
          'Because a book flat in total vega can be long the front and short the back',
          'Because long-dated options are settled differently',
          'Because implied volatility is only published for benchmark tenors',
        ],
        correctIndex: 1,
        explanation:
          'Netting across maturities hides a position in the term structure of volatility rather than removing it.',
      },
      {
        id: 'vega-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Every strike on the same underlying trades at the same implied volatility.',
        correctAnswer: false,
        explanation:
          'They slope and curve across strike and maturity — that shape is the volatility surface.',
      },
      {
        id: 'vega-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What does the equity index skew describe?',
        options: [
          'Puts trading at higher implied volatility than calls',
          'Calls trading at higher implied volatility than puts',
          'Implied volatility rising with maturity',
          'The difference between implied and realised volatility',
        ],
        correctIndex: 0,
        explanation:
          'Demand for crash protection is one-sided, and index markets fall faster than they rise.',
      },
      {
        id: 'vega-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'The market quotes the surface through the at-the-money level, the risk reversal and the butterfly.',
        correctAnswer: true,
        explanation:
          'Level, slope and wings — three quotes that describe the shape without pricing every strike separately.',
      },
      {
        id: 'vega-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What does vanna measure?',
        options: [
          'How vega changes as volatility changes',
          'How vega changes as the underlying moves',
          'How gamma changes as time passes',
          'How theta changes as volatility rises',
        ],
        correctIndex: 1,
        explanation:
          'Equivalently, how delta changes as volatility moves — the cross term between the two hedges.',
      },
      {
        id: 'vega-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt: 'Volga is the sensitivity of vega to volatility itself.',
        correctAnswer: true,
        explanation:
          'It is why a position in the wings behaves quite differently from one at the money as volatility moves.',
      },
      {
        id: 'vega-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'Why can vega not be hedged in the underlying?',
        options: [
          'Because the underlying has no volatility exposure of its own',
          'Because exchanges prohibit hedging volatility with stock',
          'Because the underlying’s volatility is fixed by the model',
          'Because a delta hedge is rebalanced too infrequently',
        ],
        correctIndex: 0,
        explanation:
          'Only another option carries implied volatility, so a vega hedge brings its own gamma, theta and skew with it.',
      },
      {
        id: 'vega-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'In a sell-off, spot, the level of volatility and the skew typically all move at once.',
        correctAnswer: true,
        explanation:
          'Books are usually hedged for one of the three, which is what makes a crisis day expensive.',
      },
      {
        id: 'vega-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A book is delta and vega hedged. What can still cost it money in a sharp fall?',
        options: [
          'Nothing — both first-order risks are removed',
          'The cross terms, as spot and volatility move together',
          'The dividend assumption, which only affects settlement',
          'The day count convention on the option premium',
        ],
        correctIndex: 1,
        explanation:
          'Vanna and volga are second order and they are precisely what a correlated move in spot and volatility picks up.',
      },
    ],
  },
  {
    id: 'cs01',
    categoryId: 'risk',
    name: 'CS01 and Jump to Default',
    hook: 'Spread risk and default risk are not the same number',
    summary:
      'CS01 is the change in value for a one basis point move in credit spread — the credit market’s answer to DV01. Jump-to-default is what the position loses or gains if the name defaults tomorrow, with no widening in between. A credit book has to report both, because a position can be small in one and enormous in the other, and it is the second that ends careers.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What CS01 is',
        content:
          'CS01 — sometimes CR01 — is the profit or loss from a one basis point widening of the credit spread, holding everything else still. For a CDS it is approximately notional multiplied by the risky annuity multiplied by 0.0001, where the risky annuity is the sum of the discounted survival-weighted accrual factors. A protection buyer gains as spreads widen, so their CS01 has the opposite sign to a bondholder’s, which is the whole point of the hedge.',
        callout:
          'The risky annuity shrinks as spreads widen, because default becomes more likely and the expected premium stream shortens. CS01 is therefore smaller for a distressed name than for an investment grade one on the same notional.',
      },
      {
        step: 2,
        title: 'What jump to default is',
        content:
          'Jump-to-default — JTD, or default exposure — is the immediate P&L if the reference entity defaults now. For a protection buyer it is the notional multiplied by one minus the recovery rate, less the mark-to-market already recognised; for a bondholder it is the loss of everything above recovery. It is a cliff, not a slope: no amount of spread sensitivity describes it, because it is the payoff of an event rather than the derivative of a price.',
        callout:
          'A single-name position can be trivial in CS01 and huge in JTD — a five-year CDS on $10m has a CS01 near $4,500 and a jump to default of $6m at a 40% recovery.',
      },
      {
        step: 3,
        title: 'Why both are reported',
        content:
          'Because they can be hedged against each other and are not the same risk. An index hedge against a single-name position can be sized to net the CS01 to zero and leave the full jump-to-default on the book, since the index loses only its own weight when one constituent defaults. Risk limits are therefore set on both, and the pair is what makes a report readable: one describes the market moving, the other describes a name failing.',
        callout:
          'This is the shape of the 2012 losses on a synthetic credit portfolio at JPMorgan: index positions offsetting single-name risk, netting to something that looked balanced on the measures being watched.',
      },
      {
        step: 4,
        title: 'Curves and correlation',
        content:
          'Spread risk is not one number either. A credit curve has buckets like a rates curve, and a position can be long protection at five years and short at ten — flat in total CS01 and long the curve steepening. For index and tranche positions there is a further exposure: correlation. A tranche’s value depends on how likely defaults are to arrive together, and a book hedged for spread and default can still be long or short correlation without anyone naming it.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Recovery is an assumption, not an observation — a JTD figure computed at 40% recovery is wrong by whatever the auction actually settles at, and recovery for a financial issuer in a systemic event has historically been far below the convention. Spread and default risk also stop being independent in a crisis, when everything widens together and the index hedge that netted the CS01 fails to cover a single name that gaps. And the position that looks flat almost always has something unhedged in it; the point of reporting several measures is that no single one hides everything.',
        callout:
          'CDS settlement runs through an auction that fixes the recovery rate for everybody. Until it happens, every JTD number in the market is an estimate.',
      },
    ],
    keyTerms: [
      {
        term: 'CS01',
        definition:
          'The change in value for a one basis point widening in the credit spread.',
      },
      {
        term: 'Risky annuity',
        definition:
          'The discounted, survival-weighted premium stream that scales a CDS position’s spread sensitivity.',
      },
      {
        term: 'Jump to default',
        definition:
          'The immediate profit or loss if the reference entity defaults now, rather than widens.',
      },
      {
        term: 'Recovery rate',
        definition:
          'The assumed proportion of face value a defaulted claim is worth, fixed in the market by auction.',
      },
      {
        term: 'Index basis',
        definition:
          'The difference between an index and the sum of its constituents, which is what an index hedge leaves behind.',
      },
      {
        term: 'Correlation risk',
        definition:
          'Exposure to how likely defaults are to arrive together, carried by index tranche positions.',
      },
    ],
    example: {
      title: 'A hedge that nets the spread risk and keeps the default risk',
      lines: [
        'A desk buys protection on $10m of a five-year single-name CDS. The risky annuity is 4.5, so CS01 ≈ $10m × 4.5 × 0.0001 = $4,500 per basis point.',
        'It sells protection on an index to fund it, sized to the same $4,500 of CS01 — say $12m at an annuity of 3.75.',
        'Check: $12m × 3.75 × 0.0001 = $4,500. Net CS01 is zero, and the report shows a flat book.',
        'The single name defaults. At a 40% recovery the protection bought pays $10m × 0.60 = $6m.',
        'The index leg loses only its own weight in that name — at 1/125 of $12m, about $96,000 × 0.60 = $57,600.',
        'The position was flat on spreads and long roughly $5.9m of jump-to-default the whole time.',
      ],
      takeaway:
        'Netting CS01 says nothing about what happens if a name actually fails. The two measures answer different questions and a limit framework needs both.',
    },
    inPractice:
      'Credit desks report CS01 by name and by curve bucket, and JTD by name, with limits on each. The pairing is also written into capital rules: the standardised market risk framework charges default risk separately from spread risk for exactly the reason this lesson gives.',
    relatedProductIds: ['cds', 'cdx', 'dv01'],
    quiz: [
      {
        id: 'cs01-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'CS01 is the change in a position’s value for a one basis point move in credit spread.',
        correctAnswer: true,
        explanation:
          'It is the credit market’s DV01, and it is reported per name and per curve bucket.',
      },
      {
        id: 'cs01-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What scales a CDS position’s CS01?',
        options: [
          'The coupon on the reference bond',
          'The risky annuity — the discounted, survival-weighted premium stream',
          'The recovery rate assumption alone',
          'The notional, and nothing else',
        ],
        correctIndex: 1,
        explanation:
          'CS01 ≈ notional × risky annuity × 0.0001, which is why a distressed name has a smaller CS01 than a tight one.',
      },
      {
        id: 'cs01-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'advanced',
        prompt:
          'A name’s CS01 grows as its spread widens, because the position is becoming riskier.',
        correctAnswer: false,
        explanation:
          'It shrinks: default becomes more likely, the expected premium stream shortens and the risky annuity falls.',
      },
      {
        id: 'cs01-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What does jump to default measure?',
        options: [
          'The profit or loss if the reference entity defaults immediately',
          'The spread level at which a name is considered distressed',
          'The number of basis points a spread moves on default news',
          'The time between a credit event and the settlement auction',
        ],
        correctIndex: 0,
        explanation:
          'It is the payoff of an event, which is why no spread sensitivity describes it.',
      },
      {
        id: 'cs01-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A protection buyer’s jump to default is the notional multiplied by one minus the recovery rate, less the mark already taken.',
        correctAnswer: true,
        explanation:
          'The contract pays par against recovery, and whatever the position has already been marked up is not earned twice.',
      },
      {
        id: 'cs01-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A five-year CDS on $10m has a CS01 of about $4,500. What is its jump to default at a 40% recovery?',
        options: ['$45,000', '$450,000', '$4m', '$6m'],
        correctIndex: 3,
        explanation:
          '$10m × (1 − 0.40) = $6m — more than a thousand times the CS01, on the same position.',
      },
      {
        id: 'cs01-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'An index hedge sized to net a single name’s CS01 also removes its jump-to-default risk.',
        correctAnswer: false,
        explanation:
          'The index loses only its own weight in that name, so almost the entire default exposure stays on the book.',
      },
      {
        id: 'cs01-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'Why does a credit limit framework set limits on both measures?',
        options: [
          'Because regulators require two numbers rather than one',
          'Because a position can be flat on one and very large on the other',
          'Because CS01 cannot be calculated for index positions',
          'Because jump to default is only relevant to bondholders',
        ],
        correctIndex: 1,
        explanation:
          'One describes the market moving and the other a name failing; netting either alone hides the other.',
      },
      {
        id: 'cs01-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A book long protection at five years and short at ten can be flat in total CS01 and still be a position on the credit curve.',
        correctAnswer: true,
        explanation:
          'Spread risk buckets like rate risk does, and the total hides the shape.',
      },
      {
        id: 'cs01-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What additional exposure does an index tranche position carry?',
        options: [
          'Correlation — how likely defaults are to arrive together',
          'Inflation, through the index’s coupon',
          'Currency risk, even when all names share a currency',
          'Prepayment risk on the underlying loans',
        ],
        correctIndex: 0,
        explanation:
          'A tranche’s value depends on the clustering of defaults, not only on how many are expected.',
      },
      {
        id: 'cs01-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'The recovery rate used in a jump-to-default calculation is an assumption until the settlement auction fixes it.',
        correctAnswer: true,
        explanation:
          'Conventional assumptions such as 40% are a convenience, and financial issuers have historically recovered far less.',
      },
      {
        id: 'cs01-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why does an index hedge tend to fail in a crisis?',
        options: [
          'Because index trading is suspended when spreads gap',
          'Because the index and the single name stop moving together just when it matters',
          'Because the recovery rate is fixed at 40% by the index rules',
          'Because CS01 cannot be recalculated intraday',
        ],
        correctIndex: 1,
        explanation:
          'The basis between an index and its constituents is exactly the risk the hedge leaves behind, and it widens under stress.',
      },
    ],
  },
  {
    id: 'pnlexplain',
    categoryId: 'risk',
    name: 'P&L Attribution',
    hook: 'Yesterday’s profit, accounted for line by line',
    summary:
      'P&L attribution — the explain — decomposes a day’s profit or loss into the risk factors that produced it: so much from the market direction, so much from gamma, so much from volatility, so much from time. What is left over is the unexplained, and it is the most closely watched number on the report, because an explain that does not tie out means a mark, a model or a risk figure is wrong and nobody yet knows which.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Every desk’s daily P&L is reproduced from its risk: take yesterday’s sensitivities, apply today’s market moves, and see how much of the day the Greeks account for. A clean explain is a statement that the desk understands its own book. It is produced by the risk function rather than the trader, it is reviewed daily, and it is one of the few controls that catches a bad mark before the position is closed rather than after.',
        callout:
          'The explain is a reconciliation, not a report of profit. The profit is known; what the explain establishes is whether the risk system agrees with it.',
      },
      {
        step: 2,
        title: 'The lines',
        content:
          'Delta P&L is the sensitivity multiplied by the market move. Gamma P&L is approximately half the gamma multiplied by the square of that move, and it is what makes a delta-hedged book profitable in a volatile session. Vega P&L is the vega multiplied by the change in implied volatility, bucketed by expiry. Theta is the fixed daily decay, and carry covers funding, borrow and the roll down the curve. New trades are shown separately, because the profit booked on the day a trade is done is a different thing from the profit on a position held.',
        callout:
          'Order matters when moves are large: the same market can be attributed differently depending on whether the delta line is computed before or after the gamma line. Any consistent convention works; changing it mid-quarter does not.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Three audiences read it. The trader uses it to check the position behaved as intended. Risk control uses the unexplained line as an early warning: an unexplained figure that is large, or small but persistently one-signed, points at a stale mark, a missing risk factor or a model that is wrong in a direction. And the finance function uses it to sign off the day, because a P&L nobody can decompose is a P&L nobody can defend.',
      },
      {
        step: 4,
        title: 'Three definitions of P&L',
        content:
          'Regulation makes the comparison precise. Actual P&L is what the books recorded, including intraday trading, fees and reserves. Hypothetical P&L revalues yesterday’s end-of-day portfolio with today’s market data, holding the positions still. Risk-theoretical P&L is what the risk model predicts from its own risk factors. Basel’s market risk framework compares the last two for each desk with a rank correlation and a distributional test; a desk that fails drifts into an amber zone and pays a capital add-on, and one that fails badly loses internal model approval and is capitalised under the standardised approach instead.',
        callout:
          'The thresholds are set in the Basel standard — currently a Spearman correlation above 0.80 and a Kolmogorov-Smirnov statistic below 0.09 for the green zone, with red below 0.70 or above 0.12.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A tolerance set too loosely explains nothing and passes everything, which is worse than no control because it is documented. A large "new trades" line can hide day-one profit taken on a model price nobody has tested against a market. And the explain is only as granular as the risk factors behind it: a book with a risk factor missing entirely will show that risk in the unexplained line every day, with no indication of what it is. The unexplained is a question, not an answer.',
        callout:
          'A persistently one-signed unexplained is more informative than a large random one. Noise averages out; bias does not, and bias means something is being computed wrongly the same way every day.',
      },
    ],
    keyTerms: [
      {
        term: 'Explain',
        definition:
          'The decomposition of a day’s P&L into the risk factors that produced it.',
      },
      {
        term: 'Unexplained P&L',
        definition:
          'The residual between actual profit and what the risk factors account for.',
      },
      {
        term: 'Hypothetical P&L',
        definition:
          'Yesterday’s portfolio revalued on today’s market data, with no intraday trading or fees.',
      },
      {
        term: 'Risk-theoretical P&L',
        definition:
          'The profit the risk model predicts from its own risk factors and sensitivities.',
      },
      {
        term: 'Carry',
        definition:
          'The funding, borrow and roll-down component of a day’s P&L, separate from market moves.',
      },
      {
        term: 'Day-one P&L',
        definition:
          'Profit recognised when a trade is booked, on a model price rather than an observed one.',
      },
    ],
    example: {
      title: 'A day that nearly ties out',
      lines: [
        'A book reports $79,000 of actual P&L for the day. The explain is built from yesterday’s risk.',
        'Delta: the underlying rose and the position was long — +$120,000.',
        'Gamma: the move was large enough for the convexity to pay — +$18,000.',
        'Vega: implied volatility fell three points against a long vega position — −$45,000.',
        'Theta: −$12,000. Carry: +$3,000.',
        'Explained: 120 + 18 − 45 − 12 + 3 = +$84,000, against $79,000 actual.',
        'Unexplained: −$5,000, about 6% of the day’s explained total — small, and worth a question if it appears with the same sign tomorrow.',
      ],
      takeaway:
        'The explain did not produce the $79,000; it tested it. Five thousand dollars of residual on a six-figure day is noise once and a defect if it repeats.',
    },
    inPractice:
      'Every bank trading desk produces an explain daily, and under the Basel market risk framework the comparison between hypothetical and risk-theoretical P&L decides whether a desk may use its own model for capital at all. It is one of the few places where a risk-management practice and a capital rule are the same exercise.',
    relatedProductIds: ['delta', 'vega', 'valueatrisk'],
    quiz: [
      {
        id: 'pnlexplain-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'P&L attribution decomposes a day’s profit into the risk factors that produced it.',
        correctAnswer: true,
        explanation:
          'It reproduces the day from yesterday’s sensitivities and today’s market moves.',
      },
      {
        id: 'pnlexplain-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What does the explain establish?',
        options: [
          'How much profit the desk made',
          'Whether the risk system agrees with the profit the desk made',
          'Whether the desk stayed within its limits',
          'What the desk should trade tomorrow',
        ],
        correctIndex: 1,
        explanation:
          'The profit is already known. The explain is a reconciliation against the risk.',
      },
      {
        id: 'pnlexplain-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Which line captures the profit from convexity in a large move?',
        options: ['Delta', 'Gamma', 'Vega', 'Carry'],
        correctIndex: 1,
        explanation:
          'Approximately half the gamma times the square of the move — the term that makes a delta-hedged book pay in a volatile session.',
      },
      {
        id: 'pnlexplain-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Profit from trades done during the day is shown separately from profit on positions held.',
        correctAnswer: true,
        explanation:
          'Day-one profit on a new trade is a different question from how an existing position behaved.',
      },
      {
        id: 'pnlexplain-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'The order in which the delta and gamma lines are computed can change how a large move is attributed.',
        correctAnswer: true,
        explanation:
          'Any consistent convention is defensible; changing it mid-period is what makes the series unreadable.',
      },
      {
        id: 'pnlexplain-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What does a persistently one-signed unexplained P&L suggest?',
        options: [
          'Ordinary noise in the attribution',
          'A systematic error — a stale mark, a missing risk factor or a wrong model',
          'That the desk is trading too little',
          'That the confidence level of the risk model is too high',
        ],
        correctIndex: 1,
        explanation:
          'Noise averages out. Bias means something is being computed wrongly the same way every day.',
      },
      {
        id: 'pnlexplain-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The explain is produced by the trader who ran the position, so that it reflects their intent.',
        correctAnswer: false,
        explanation:
          'It is produced by the risk function. Independence is what makes it a control rather than a commentary.',
      },
      {
        id: 'pnlexplain-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What is hypothetical P&L?',
        options: [
          'The profit the risk model predicts from its risk factors',
          'Yesterday’s end-of-day portfolio revalued on today’s market data',
          'The profit the desk would have made under a stress scenario',
          'Actual P&L excluding losses',
        ],
        correctIndex: 1,
        explanation:
          'Positions held still, no intraday trading, no fees — which is what makes it comparable to a model prediction.',
      },
      {
        id: 'pnlexplain-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'Under the Basel market risk framework, a desk that fails the attribution test can lose the use of its internal model for capital.',
        correctAnswer: true,
        explanation:
          'Failure moves a desk to an amber zone with a capital add-on, and persistent failure to the standardised approach.',
      },
      {
        id: 'pnlexplain-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does actual P&L include that hypothetical P&L does not?',
        options: [
          'Intraday trading, fees and reserves',
          'The effect of overnight market moves',
          'The desk’s vega exposure',
          'Positions held by other desks',
        ],
        correctIndex: 0,
        explanation:
          'Those are exactly the components stripped out so a model prediction can be compared like for like.',
      },
      {
        id: 'pnlexplain-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A tolerance set loosely enough that every day passes is safer than having no attribution control at all.',
        correctAnswer: false,
        explanation:
          'It is worse: it produces documented assurance that nothing was checked.',
      },
      {
        id: 'pnlexplain-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A book carries a risk the model has no factor for. Where does it appear?',
        options: [
          'In the delta line, at the wrong sign',
          'In the carry line',
          'In the unexplained line, every day, unlabelled',
          'Nowhere, until the position is closed',
        ],
        correctIndex: 2,
        explanation:
          'The explain is only as granular as its risk factors, which is why the residual is a question rather than an answer.',
      },
    ],
  },
  {
    id: 'valueatrisk',
    categoryId: 'risk',
    name: 'Value at Risk',
    hook: 'One number for tomorrow’s loss, and what it leaves out',
    summary:
      'Value at risk states the loss a portfolio is not expected to exceed over a given horizon at a given confidence — a 99% one-day VaR of $1.4m says that on 99 days in 100 the loss should be smaller than that. It is the standard aggregate risk measure across every asset class, the basis of firm-wide limits, and it says nothing whatsoever about the size of the loss on the hundredth day. Everything difficult about it follows from that last sentence.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'VaR is a quantile of the distribution of profit and loss. Three parameters define it: the horizon, usually one or ten days; the confidence level, usually 97.5% or 99%; and the historical window the distribution is drawn from. Quoted without all three the number means nothing, and comparisons between firms are usually comparisons between conventions rather than between risks.',
        callout:
          'Longer horizons are often produced by scaling a one-day figure by the square root of time. That assumes returns are independent day to day, which is precisely what stops being true in a crisis.',
      },
      {
        step: 2,
        title: 'How it is computed',
        content:
          'Historical simulation is the most common method: take the last one to four years of daily market moves, apply each one to today’s portfolio, and read the loss at the chosen quantile. It needs no distributional assumption and inherits whatever fat tails the sample contains. The variance-covariance approach instead assumes normality and computes the quantile from volatilities and correlations, which is fast and wrong in the tails. Monte Carlo simulates paths from a specified model, and is the only workable approach for a book full of optionality.',
        callout:
          'Historical simulation carries a hidden calendar: a window that no longer contains a crash reports a smaller number every day until the crash comes back into it.',
      },
      {
        step: 3,
        title: 'Expected shortfall',
        content:
          'Expected shortfall answers the question VaR refuses: given that the loss exceeds the threshold, how large is it on average? It is the mean of the tail rather than its edge. It is also coherent in a way VaR is not — combining two portfolios can raise VaR above the sum of the parts, which makes it a poor measure to allocate limits with. Basel’s market risk framework moved from 99% VaR to 97.5% expected shortfall for exactly these reasons; under a normal distribution the two are numerically close, and the difference is entirely in what happens when the distribution is not normal.',
      },
      {
        step: 4,
        title: 'Backtesting',
        content:
          'A VaR model earns trust by being counted. Over 250 trading days, a 99% model should be exceeded around two or three times; supervisors run a traffic light with a green zone up to four exceptions, an amber zone from five to nine that raises the capital multiplier, and a red zone at ten or more. Too many exceptions means the model understates risk; almost none means it overstates it, which is expensive rather than dangerous and therefore gets challenged far less often.',
        callout:
          'An exception is compared against a clean P&L that excludes fees and intraday trading, for the same reason the attribution test does: otherwise a model is judged on things it never claimed to predict.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'VaR is not a worst case and was never meant to be read as one. It assumes positions can be exited within the horizon, which is false for anything illiquid, and it assumes the correlations in its window hold — the assumption that fails hardest in a crisis, when everything falls together and diversification disappears. It is also procyclical: when volatility rises, every firm’s VaR rises at once, limits bind at the same moment and everyone reduces the same positions into the same market. That is why VaR is reported alongside stress tests and scenario analysis rather than trusted alone.',
        callout:
          'The useful question about a VaR number is not whether it is right but what it assumed: which window, which horizon, which liquidity, and which correlations.',
      },
    ],
    keyTerms: [
      {
        term: 'Value at risk',
        definition:
          'The loss not expected to be exceeded over a stated horizon at a stated confidence level.',
      },
      {
        term: 'Confidence level',
        definition: 'The quantile the measure is read at, commonly 97.5% or 99%.',
      },
      {
        term: 'Historical simulation',
        definition:
          'Computing VaR by applying a window of past market moves to today’s portfolio.',
      },
      {
        term: 'Expected shortfall',
        definition:
          'The average loss given that the threshold is breached — the mean of the tail rather than its edge.',
      },
      {
        term: 'Backtesting exception',
        definition:
          'A day whose clean P&L loss exceeded the VaR the model predicted for it.',
      },
      {
        term: 'Procyclicality',
        definition:
          'The tendency of risk measures to rise together in a sell-off, forcing simultaneous deleveraging.',
      },
    ],
    example: {
      title: 'The same portfolio, three numbers',
      lines: [
        'A $50m portfolio has a daily volatility of 1.2%, so one standard deviation is $600,000.',
        'Assuming normality, the 99% one-day VaR is 2.33 × $600,000 = $1.40m.',
        'Expected shortfall at 97.5% is about 2.34 standard deviations under the same assumption: $1.40m — almost identical.',
        'Historical simulation over 250 days instead reads the third-worst day directly, and returns $2.10m.',
        'The gap is the fat tail: the real sample contains days a normal distribution says should not happen.',
        'Scaling the normal figure to ten days by √10 gives $4.43m, which assumes ten independent days in a row.',
      ],
      takeaway:
        'Under a normal distribution the choice of measure barely matters. It is when the distribution is not normal that expected shortfall and historical data start to disagree with the formula, and that is the case the number exists for.',
    },
    inPractice:
      'VaR sits at the top of the risk report at every bank and most funds, aggregating across desks and asset classes into one figure the board sees. Its limits are as well known as the measure, which is why it is always paired with stress scenarios — and why the interesting question in a risk meeting is usually about the assumptions rather than the number.',
    relatedProductIds: ['pnlexplain', 'dv01', 'xva'],
    quiz: [
      {
        id: 'valueatrisk-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A 99% one-day VaR of $1.4m means losses should exceed $1.4m on about one day in a hundred.',
        correctAnswer: true,
        explanation: 'It is a quantile of the loss distribution, not a maximum.',
      },
      {
        id: 'valueatrisk-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What must be stated for a VaR figure to mean anything?',
        options: [
          'The horizon, the confidence level and the window it is drawn from',
          'The notional of the largest position',
          'The desk’s limit and its current utilisation',
          'The correlation matrix in full',
        ],
        correctIndex: 0,
        explanation:
          'Without all three, comparisons between firms compare conventions rather than risk.',
      },
      {
        id: 'valueatrisk-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'advanced',
        prompt:
          'Scaling a one-day VaR to ten days by the square root of time assumes daily returns are independent.',
        correctAnswer: true,
        explanation:
          'Which is exactly the assumption that fails in a crisis, when losses arrive on consecutive days.',
      },
      {
        id: 'valueatrisk-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'How does historical simulation compute VaR?',
        options: [
          'By assuming a normal distribution and scaling the volatility',
          'By applying a window of past market moves to today’s portfolio',
          'By simulating paths from a stochastic volatility model',
          'By averaging the last year’s realised losses',
        ],
        correctIndex: 1,
        explanation:
          'It needs no distributional assumption and inherits whatever tails the sample happens to contain.',
      },
      {
        id: 'valueatrisk-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A historical simulation window that no longer contains a crash will report a lower VaR until one happens again.',
        correctAnswer: true,
        explanation:
          'The measure has a calendar hidden in it, and it is at its most reassuring after a long quiet period.',
      },
      {
        id: 'valueatrisk-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Which method is the practical choice for a book full of optionality?',
        options: [
          'Variance-covariance',
          'Monte Carlo simulation',
          'A duration approximation',
          'Scaling the previous day’s figure',
        ],
        correctIndex: 1,
        explanation:
          'Non-linear payoffs are not described by volatilities and correlations alone.',
      },
      {
        id: 'valueatrisk-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Expected shortfall is the average loss given that the VaR threshold has been breached.',
        correctAnswer: true,
        explanation:
          'It measures the tail rather than its edge, which is the question VaR declines to answer.',
      },
      {
        id: 'valueatrisk-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'Why is VaR a poor measure to allocate limits with?',
        options: [
          'It cannot be computed for individual desks',
          'Combining two portfolios can produce a VaR larger than the sum of the parts',
          'It is only defined at the 99% level',
          'It requires a normal distribution',
        ],
        correctIndex: 1,
        explanation:
          'It is not subadditive, so it can penalise diversification. Expected shortfall is coherent in this sense.',
      },
      {
        id: 'valueatrisk-q9',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Basel’s market risk framework replaced 99% VaR with 97.5% expected shortfall.',
        correctAnswer: true,
        explanation:
          'Close to the same number under normality, and quite different once the tail is fat.',
      },
      {
        id: 'valueatrisk-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'How many exceptions in 250 days keep a 99% VaR model in the supervisory green zone?',
        options: ['Zero', 'Up to four', 'Up to nine', 'Up to twenty'],
        correctIndex: 1,
        explanation:
          'Five to nine is amber and raises the capital multiplier; ten or more is red.',
      },
      {
        id: 'valueatrisk-q11',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A model producing almost no exceptions is challenged as hard as one producing too many.',
        correctAnswer: false,
        explanation:
          'Overstating risk is expensive rather than dangerous, so it attracts far less scrutiny than understating it.',
      },
      {
        id: 'valueatrisk-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What makes VaR procyclical?',
        options: [
          'It is recalculated only once a quarter',
          'Rising volatility raises every firm’s figure at once, so limits bind together',
          'It ignores positions held for less than a day',
          'It is reported net of hedges',
        ],
        correctIndex: 1,
        explanation:
          'Everyone reduces the same positions into the same market, which is a feedback loop rather than a measurement error.',
      },
    ],
  },
];
