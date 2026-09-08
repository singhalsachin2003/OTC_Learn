import type { Product } from '../types';

/**
 * Alternative underlyings — contracts defined by what they reference rather
 * than by the shape of their payoff. Ids are stable: saved progress is keyed
 * by them.
 *
 * The selection rule for this category is deliberately narrow, and it is the
 * owner's: only mechanisms that are stable enough to still be true in ten
 * years. That excludes anything whose substance is a rule someone can change —
 * capital treatment, national hedging regulation, carbon policy — because a
 * stale rule taught confidently is a wrong answer with a citation. What is left
 * is how a contract works: how a funding rate tethers a perpetual to spot, how
 * an index average settles a freight trade, how a trigger converts a hurricane
 * into a principal write-down. Those do not move.
 */
export const alternativesProducts: Product[] = [
  {
    id: 'perp',
    categoryId: 'alt',
    name: 'Perpetual Swap',
    hook: 'A future with no expiry, held to spot by a payment',
    summary:
      'A perpetual swap tracks the price of an underlying without ever expiring. Nothing settles it, so it needs another mechanism to stop it drifting away from spot: a funding payment exchanged periodically between longs and shorts, whose sign depends on which side the contract is trading. It is the clearest example in modern markets of a contract kept honest by an incentive rather than by a delivery date.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A perpetual swap is a cash-settled contract on an underlying — most commonly a digital asset — with no expiry date and no delivery. A position stays open until it is closed or liquidated. Because there is no maturity at which the contract must converge on the spot price, the design needs something else to anchor it, and that something is a payment made directly between the two sides at fixed intervals.',
        callout:
          'Every other derivative in this app converges because it settles. Take away the settlement date and convergence has to be manufactured.',
      },
      {
        step: 2,
        title: 'The funding rate',
        content:
          'At each funding interval — commonly every eight hours — one side pays the other a percentage of position value. When the contract trades above the underlying index, funding is positive and longs pay shorts; when it trades below, shorts pay longs. The payment goes between traders, not to the venue. Its effect is behavioural: being long becomes expensive exactly when everyone wants to be long, which is what pulls the contract back towards spot without anything being delivered.',
        callout:
          'Funding is a price for holding a view, charged continuously. A crowded long side is not merely a sentiment reading — it is a cash cost to the people in it.',
      },
      {
        step: 3,
        title: 'Mark price and liquidation',
        content:
          'Positions are margined, often at high leverage, so the price used to compute a loss matters enormously. Venues do not mark against the last trade on their own book, which a single large order could move; they mark against an index built from several external spot sources, adjusted for the prevailing basis. A position whose margin falls below the maintenance level is closed by the venue rather than being allowed to go negative, and an insurance fund absorbs the gap between the liquidation price and the bankruptcy price.',
        callout:
          'Marking against an outside index is what stops a liquidation cascade being profitable to trigger. It is the same reasoning behind a settlement price built from an average rather than a print.',
      },
      {
        step: 4,
        title: 'Why it’s used',
        content:
          'For a trader it is the simplest way to hold leveraged, continuous exposure without rolling a position from one expiry to the next — no roll dates, no calendar spread, no decision every quarter. For the market as a whole the funding rate is a visible, continuously updated price of leverage: a persistently positive rate says the long side is crowded and is paying for the privilege, which is information no dated future publishes so directly.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Funding compounds. A rate that looks trivial per interval is a large annualised cost to a position held for months, and it is charged whether or not the view is working. Leverage makes liquidation, not being wrong, the binding risk — a position can be closed out at a level the market visits briefly and leaves. And where the insurance fund is exhausted, some venues reduce profitable positions on the other side to balance the books, which is a form of counterparty risk that has no analogue in a cleared futures market.',
        callout:
          'Read the three numbers before the price: the funding interval, the maintenance margin, and what happens when the insurance fund runs out.',
      },
    ],
    keyTerms: [
      {
        term: 'Funding rate',
        definition:
          'The periodic payment between longs and shorts that keeps a perpetual contract close to the underlying index.',
      },
      {
        term: 'Funding interval',
        definition:
          'How often that payment is exchanged — commonly every eight hours, which compounds quickly.',
      },
      {
        term: 'Index price',
        definition:
          'A composite of external spot sources used as the reference, rather than the venue’s own last trade.',
      },
      {
        term: 'Mark price',
        definition:
          'The valuation used for margin and liquidation, built from the index so a single order cannot move it.',
      },
      {
        term: 'Maintenance margin',
        definition:
          'The equity level below which a position is closed out by the venue rather than allowed to go negative.',
      },
      {
        term: 'Insurance fund',
        definition:
          'A pool absorbing the shortfall when a liquidation cannot be completed at better than the bankruptcy price.',
      },
    ],
    example: {
      title: 'What a small funding rate costs over a year',
      lines: [
        'A trader holds a $100,000 long perpetual position. Funding is +0.01% per eight-hour interval, so longs pay.',
        'Each payment: $100,000 × 0.0001 = $10. There are three intervals a day, so $30 a day.',
        'Over 30 days that is $900, or 0.9% of the position — for holding it, before any price move.',
        'Annualised, 0.01% three times daily compounds to roughly 11% a year.',
        'At 10× leverage the trader posted $10,000 of margin, so that $900 is 9% of their own capital in a month.',
        'The mirror image: the short side received all of it, which is the return on a hedged basis position.',
      ],
      takeaway:
        'The number quoted per interval is not the number you pay. Funding is a carry cost measured in tenths of a basis point and felt in double digits a year, and it is the whole return of the trade on the other side.',
    },
    inPractice:
      'Perpetuals are the highest-volume derivative in digital asset markets, and the funding rate is watched as a positioning indicator in its own right. The design is now being borrowed elsewhere: the question it answers — how do you anchor a never-settling contract to a reference price — applies to anything continuously traded.',
    relatedProductIds: ['cryptobasis', 'cfd', 'fxswap'],
    quiz: [
      {
        id: 'perp-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A perpetual swap has no expiry date.',
        correctAnswer: true,
        explanation:
          'A position stays open until it is closed or liquidated, which is why convergence has to be engineered.',
      },
      {
        id: 'perp-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'Why does a dated future converge on spot without needing a funding mechanism?',
        options: [
          'Because exchanges cap the basis by rule',
          'Because it must settle against the underlying at a known date',
          'Because arbitrage is prohibited near expiry',
          'Because its margin requirement rises over time',
        ],
        correctIndex: 1,
        explanation:
          'Settlement is the anchor. Remove the date and something else has to do that job.',
      },
      {
        id: 'perp-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'When a perpetual trades above the index, longs pay funding to shorts.',
        correctAnswer: true,
        explanation:
          'Being long becomes expensive exactly when the long side is crowded, which pulls the contract back towards spot.',
      },
      {
        id: 'perp-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Who receives the funding payment?',
        options: [
          'The venue, as a fee',
          'The clearing house, as default fund contribution',
          'The other side of the trade',
          'It is split between the venue and an insurance pool',
        ],
        correctIndex: 2,
        explanation:
          'It is a transfer between traders. That is what makes it an incentive rather than a cost of access.',
      },
      {
        id: 'perp-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Liquidations are calculated against the venue’s own last traded price.',
        correctAnswer: false,
        explanation:
          'They are calculated against a mark price built from external sources, so one large order cannot trigger a cascade.',
      },
      {
        id: 'perp-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What does an insurance fund absorb?',
        options: [
          'The venue’s operating costs',
          'The gap between the liquidation price and the bankruptcy price',
          'The funding payments of defaulted accounts',
          'Losses from exchange outages',
        ],
        correctIndex: 1,
        explanation:
          'It is what stops a closed-out account leaving a shortfall for the counterparties to absorb.',
      },
      {
        id: 'perp-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'A position can be liquidated at a level the market touches briefly and then leaves.',
        correctAnswer: true,
        explanation:
          'Which is why leverage makes liquidation, rather than being wrong, the binding risk.',
      },
      {
        id: 'perp-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does a perpetual save a trader compared with dated futures?',
        options: [
          'The cost of margin',
          'The need to roll the position at each expiry',
          'Exposure to the underlying’s price',
          'The bid-offer spread',
        ],
        correctIndex: 1,
        explanation:
          'No roll dates and no calendar spread to manage — continuous exposure with one decision.',
      },
      {
        id: 'perp-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A persistently positive funding rate indicates the long side is crowded and paying for it.',
        correctAnswer: true,
        explanation:
          'It is a continuously updated price of leverage, which no dated contract publishes so directly.',
      },
      {
        id: 'perp-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Funding of 0.01% every eight hours is roughly what, annualised?',
        options: ['About 0.4%', 'About 3%', 'About 11%', 'About 40%'],
        correctIndex: 2,
        explanation:
          'Three payments a day, compounded across a year — a rate that looks negligible per interval is a real carry cost.',
      },
      {
        id: 'perp-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt: 'Funding is charged only when the position is profitable.',
        correctAnswer: false,
        explanation:
          'It is charged every interval regardless of whether the view is working.',
      },
      {
        id: 'perp-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What happens on some venues when the insurance fund cannot cover a shortfall?',
        options: [
          'Profitable positions on the other side are reduced to balance the books',
          'The venue borrows from a central counterparty',
          'Trading is suspended until the deficit is funded',
          'Losses are spread evenly across all funding payments',
        ],
        correctIndex: 0,
        explanation:
          'Auto-deleveraging is a form of counterparty risk with no analogue in a cleared futures market, and it is worth reading before trading.',
      },
    ],
  },
  {
    id: 'cryptobasis',
    categoryId: 'alt',
    name: 'Cash and Carry Basis',
    hook: 'Buy the asset, sell the future, collect the difference',
    summary:
      'When a dated future trades above spot, the gap can be captured by buying the asset and selling the future against it, then holding both to expiry. The trade is as old as futures markets and is arithmetically simple: the return is the basis, annualised. What makes it worth studying is everything that is not in the arithmetic — the margin on the short leg, the cost of holding the long leg, and the assumption that both legs survive to expiry.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'The basis is the difference between a future’s price and the spot price of what it references. Cash and carry means buying the underlying and simultaneously selling the future, locking the difference: at expiry the future converges on spot, the two legs offset, and what is left is the basis captured at the outset. The position has no directional exposure — it makes the same amount whether the underlying doubles or halves.',
        callout:
          'The mirror trade, selling spot and buying the future, is a reverse cash and carry. It needs the ability to borrow the underlying, which is often the harder half.',
      },
      {
        step: 2,
        title: 'What the basis is made of',
        content:
          'In an orthodox market the basis is a cost of carry: the interest on the money tied up in the spot leg, plus storage and insurance where the asset is physical, minus any income the asset pays. A future priced above that is a market where holders of cash are being paid to supply it, and a future priced below is one where holders of the asset are. In markets with constrained access or expensive borrowing, the basis reflects those frictions rather than pure interest, which is why the same trade earns very different returns in different places.',
        callout:
          'Annualise before comparing. A 3% basis on a three-month contract is roughly 12% a year; the same 3% on a one-year contract is 3%.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It converts a market’s structural imbalance into a yield. A holder of cash lends it into the market at whatever the basis implies, with no view on direction and a defined exit at expiry. On the other side, a participant who wants leveraged exposure buys the future rather than the asset, and pays the basis for it. The trade is the plumbing that links the two: the funding market and the derivatives market meeting in one price.',
      },
      {
        step: 4,
        title: 'The funding-rate version',
        content:
          'Where a perpetual swap exists instead of a dated future, the same trade is run against the funding rate: buy the underlying, sell the perpetual, and collect funding for as long as it is positive. The economics are the same and the shape is different — there is no expiry to converge at, so the return is a stream rather than a locked spread, and it can turn negative if funding flips. It is a carry trade with no defined end, which makes the exit a decision rather than a date.',
        callout:
          'A dated basis is a fixed return with a known maturity; a funding basis is a floating one with none. Do not quote them as if they were the same number.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The short future is margined and the long asset generally is not, so a sharp rally produces cash calls on one leg while the gain on the other stays unrealised — the same funding asymmetry as any hedged position. The basis can widen before it converges, marking the position down even though the outcome at expiry is unchanged. And the trade concentrates operational risk: two legs, often in two places, both of which must still be there at expiry for the arithmetic to hold.',
        callout:
          'The classic failure of a basis trade is not that the spread went the wrong way. It is being closed out of a converging position because the margin on one leg ran out.',
      },
    ],
    keyTerms: [
      {
        term: 'Basis',
        definition:
          'The difference between a future’s price and the spot price of the underlying it references.',
      },
      {
        term: 'Cash and carry',
        definition:
          'Buying the underlying and selling the future against it to capture the basis until expiry.',
      },
      {
        term: 'Cost of carry',
        definition:
          'Interest, storage and insurance less any income — what the basis should equal in an orthodox market.',
      },
      {
        term: 'Annualised basis',
        definition:
          'The spread scaled to a yearly rate, which is the only form in which two contracts are comparable.',
      },
      {
        term: 'Reverse cash and carry',
        definition:
          'The mirror trade — short the asset, long the future — which requires borrowing the underlying.',
      },
      {
        term: 'Convergence',
        definition:
          'The narrowing of the basis to zero at expiry, which is what makes the captured spread a return.',
      },
    ],
    example: {
      title: 'Turning a three-month spread into a yield',
      lines: [
        'Spot is 100. The future expiring in 91 days trades at 103.',
        'Buy the asset at 100 and sell the future at 103: the basis captured is 3, or 3% of the position.',
        'Annualised: 3% × 365 ÷ 91 = 12.0%. That is the number to compare against a deposit rate.',
        'At expiry the future settles at spot, wherever it is. If spot is 60, the long loses 40 and the short future gains 43.',
        'If spot is 200, the long gains 100 and the short future loses 97. Either way the net is 3.',
        'Subtract the cost of funding the 100 for three months. If that costs 8% annualised, the trade nets about 4%.',
      ],
      takeaway:
        'The gross basis is not the return. The return is the basis minus what it costs to carry the long leg, and the trade only makes sense while that difference is positive and financeable to expiry.',
    },
    inPractice:
      'Cash and carry is run in every futures market there is — commodities, equity index, government bonds, digital assets — usually by participants whose real business is lending cash or holding inventory. Where the basis is unusually wide, the first question is not "free money" but "what stops everyone doing this", and the answer is normally balance sheet, borrow, or access.',
    relatedProductIds: ['perp', 'fxswap', 'cmfwd'],
    quiz: [
      {
        id: 'cryptobasis-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A cash and carry position profits the same amount whether the underlying rises or falls.',
        correctAnswer: true,
        explanation:
          'The two legs offset. What is left is the basis captured when the trade was put on.',
      },
      {
        id: 'cryptobasis-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does a cash and carry trade consist of?',
        options: [
          'Buying the future and selling the underlying',
          'Buying the underlying and selling the future',
          'Buying both the underlying and the future',
          'Selling both, and holding the cash',
        ],
        correctIndex: 1,
        explanation:
          'The reverse — short asset, long future — is a different trade with a borrow requirement.',
      },
      {
        id: 'cryptobasis-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'In an orthodox market, what should the basis equal?',
        options: [
          'The expected price change of the underlying',
          'The volatility of the underlying',
          'The cost of carry: interest and storage, less income',
          'The exchange’s margin requirement',
        ],
        correctIndex: 2,
        explanation:
          'A future priced above that is a market paying holders of cash to supply it.',
      },
      {
        id: 'cryptobasis-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A 3% basis on a three-month contract and a 3% basis on a one-year contract are the same return.',
        correctAnswer: false,
        explanation:
          'Annualised, the first is about 12% and the second is 3%. Comparing them unannualised is the standard mistake.',
      },
      {
        id: 'cryptobasis-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A wide basis usually reflects a constraint on someone rather than a mistake by everyone.',
        correctAnswer: true,
        explanation:
          'Balance sheet, borrow and access are the usual answers to "what stops everyone doing this".',
      },
      {
        id: 'cryptobasis-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is the basis trade from the cash lender’s point of view?',
        options: [
          'A directional bet on the underlying',
          'A way to lend cash into the market at the rate the basis implies',
          'A hedge against the underlying falling',
          'A volatility position',
        ],
        correctIndex: 1,
        explanation:
          'No view, a defined exit at expiry, and a yield set by the derivatives market rather than a deposit desk.',
      },
      {
        id: 'cryptobasis-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'The buyer of the future is effectively paying the basis for leveraged exposure.',
        correctAnswer: true,
        explanation:
          'Which is the other half of the same trade — the funding market and the derivatives market meeting in one price.',
      },
      {
        id: 'cryptobasis-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'How does the trade differ when run against a perpetual rather than a dated future?',
        options: [
          'It carries no margin requirement',
          'The return is a stream from funding rather than a spread locked to expiry',
          'It becomes directional',
          'It cannot be hedged with the underlying',
        ],
        correctIndex: 1,
        explanation:
          'No expiry means no convergence date: the exit is a decision, and the return can turn negative if funding flips.',
      },
      {
        id: 'cryptobasis-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A dated basis and a funding-rate basis can be quoted as the same kind of number.',
        correctAnswer: false,
        explanation:
          'One is a fixed return to a known maturity; the other is floating with no end. Quoting them alike overstates the second.',
      },
      {
        id: 'cryptobasis-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What is the classic way a converging basis trade still loses money?',
        options: [
          'The underlying falls sharply',
          'The margin on the short leg runs out before expiry and the position is closed',
          'The future fails to settle',
          'The basis converges too quickly',
        ],
        correctIndex: 1,
        explanation:
          'The short future is margined and the long asset is not, so a rally produces cash calls against an unrealised gain.',
      },
      {
        id: 'cryptobasis-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'The basis can widen after the trade is put on, marking the position down before it converges.',
        correctAnswer: true,
        explanation:
          'The outcome at expiry is unchanged, but the mark-to-market on the way there is not, and margin follows the mark.',
      },
      {
        id: 'cryptobasis-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What is the return on the trade, properly measured?',
        options: [
          'The gross basis',
          'The basis less the cost of funding the long leg',
          'The basis plus the interest earned on margin',
          'The change in the underlying over the period',
        ],
        correctIndex: 1,
        explanation:
          'A 12% annualised basis against an 8% funding cost is a 4% trade, and only while that gap is financeable to expiry.',
      },
    ],
  },
  {
    id: 'ffa',
    categoryId: 'alt',
    name: 'Freight Forward Agreement',
    hook: 'Hedging the cost of moving cargo, not the cargo',
    summary:
      'A freight forward agreement is a cash-settled contract on the cost of shipping, referenced to a published freight index and settled against the average of that index over a month. Nothing is delivered and no ship is chartered. It lets an owner fix future earnings and a charterer fix a future cost, and it is the clearest example of a derivative on a service rather than on an asset.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'The underlying is a freight rate: what it costs to hire a vessel of a given class, or to move cargo along a defined route. Rates are assessed daily by an exchange that collects submissions from shipbrokers and publishes an index. A freight forward fixes a rate for a future period against that index, and settles in cash for the difference. Dry bulk contracts are usually quoted per day for a vessel class; voyage routes are quoted per tonne of cargo.',
        callout:
          'Freight is a service that cannot be stored. There is no cash and carry here — you cannot buy today’s voyage and keep it until next month.',
      },
      {
        step: 2,
        title: 'How it settles',
        content:
          'Settlement is against the arithmetic average of the index over the whole period, usually a calendar month, rather than a single closing print. Averaging is deliberate: it makes the settlement price expensive to influence, since moving one day’s assessment barely moves the mean of twenty-something, and it matches how the physical exposure actually accrues — a charterer does not hire a ship for one instant.',
        callout:
          'Averaged settlement appears wherever the underlying is consumed continuously. It is the same reasoning behind an Asian option and behind a monthly commodity swap.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A shipowner’s revenue is the freight market, and selling forward converts an uncertain earnings stream into a known one — the same logic as a producer hedge. A charterer, or a commodity trader with cargo to move, has the mirror exposure and buys. Both sides are hedging a physical position they already have, which is why the market exists at all: freight is a large, volatile input cost for anyone shipping bulk commodities, and it moves for reasons entirely unrelated to the commodity itself.',
      },
      {
        step: 4,
        title: 'Basis risk',
        content:
          'The index is an average across a basket of routes or a class of vessel; the exposure is one ship, on one route, at one time. Those differ. A vessel’s actual earnings depend on its speed, its fuel consumption, where it happens to be positioned and what it can find to carry next — none of which the index knows. The hedge removes the market-wide movement in freight and leaves the difference between one ship’s economics and the average, which is exactly the residual a producer hedge leaves between one mine and the metal price.',
        callout:
          'Timing is basis too: a voyage that straddles two months is hedged by two settlement periods, neither of which matches when the cargo actually moves.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Freight is among the most volatile markets there is — rates can multiply or collapse within a quarter as vessel supply is fixed in the short run and demand is not. That volatility applies to margin as much as to the hedge: a large adverse move produces cash calls against a physical benefit that arrives voyage by voyage. Liquidity concentrates in the nearest quarters and the main vessel classes, so a hedge for an unusual route or a distant year is either unavailable or a different exposure wearing the same name.',
      },
    ],
    keyTerms: [
      {
        term: 'Freight index',
        definition:
          'A daily published assessment of shipping rates, compiled from broker submissions, used as the settlement reference.',
      },
      {
        term: 'Time charter average',
        definition:
          'The average rate to hire a vessel class per day, the usual underlying for dry bulk contracts.',
      },
      {
        term: 'Settlement average',
        definition:
          'The mean of the index over the contract month, used instead of a single print so it cannot easily be moved.',
      },
      {
        term: 'Vessel class',
        definition:
          'A size category — Capesize, Panamax, Supramax — whose rates move together and define a contract.',
      },
      {
        term: 'Route basis',
        definition:
          'The gap between one ship’s actual economics and the index average the hedge references.',
      },
      {
        term: 'Voyage charter',
        definition:
          'Hiring a vessel for a specific cargo and route, priced per tonne, as opposed to per day.',
      },
    ],
    example: {
      title: 'A charterer fixing a month of shipping cost',
      lines: [
        'A trader will need a Capesize vessel for 30 days next quarter and wants the cost fixed.',
        'It buys 30 days of the time charter average at $25,000 a day: a notional of 30 × $25,000 = $750,000.',
        'The index averages $32,000 a day over the settlement month.',
        'The contract pays the buyer (32,000 − 25,000) × 30 = $210,000.',
        'In the physical market the trader now pays about $32,000 a day, or $960,000 — $210,000 more than budgeted.',
        'Net cost: $960,000 − $210,000 = $750,000, which is the rate it fixed.',
      ],
      takeaway:
        'The hedge does not make the shipping cheaper; it makes it knowable. What is left over is the difference between the ship actually hired and the index basket, which no freight contract can remove.',
    },
    inPractice:
      'Shipowners, commodity trading houses, mining companies and utilities all use freight forwards, most of them cleared. The market is small relative to the commodities it moves, which is why liquidity thins quickly outside the nearest contracts and the largest vessel classes.',
    relatedProductIds: ['cmswap', 'cmfwd', 'weather'],
    quiz: [
      {
        id: 'ffa-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A freight forward results in a vessel being chartered at settlement.',
        correctAnswer: false,
        explanation:
          'It is cash settled against an index. The physical charter is a separate transaction in the physical market.',
      },
      {
        id: 'ffa-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What is the underlying of a dry bulk freight forward?',
        options: [
          'The price of the cargo being carried',
          'The published rate to hire a class of vessel, per day',
          'The fuel consumed on the voyage',
          'The value of the ship itself',
        ],
        correctIndex: 1,
        explanation:
          'Voyage contracts are quoted per tonne instead, but either way the underlying is the cost of transport.',
      },
      {
        id: 'ffa-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'Freight can be bought today and stored for use next month.',
        correctAnswer: false,
        explanation:
          'It is a service consumed as it is produced, which is why there is no cash and carry in this market.',
      },
      {
        id: 'ffa-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'How is a freight forward settled?',
        options: [
          'Against the index price on the final day',
          'Against the arithmetic average of the index over the period',
          'Against the highest index print in the month',
          'By physical delivery of a charter',
        ],
        correctIndex: 1,
        explanation:
          'Averaging matches how the exposure accrues and makes the settlement expensive to influence.',
      },
      {
        id: 'ffa-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Averaged settlement is used in commodity swaps and Asian options for the same reason.',
        correctAnswer: true,
        explanation:
          'Wherever an underlying is consumed continuously, an average is both harder to manipulate and a better match for the exposure.',
      },
      {
        id: 'ffa-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Which participant is the natural seller of freight forwards?',
        options: [
          'A shipowner, whose revenue is the freight market',
          'A commodity trader with cargo to move',
          'A refinery buying crude',
          'A port operator',
        ],
        correctIndex: 0,
        explanation:
          'Selling forward converts uncertain earnings into known ones — the same logic as any producer hedge.',
      },
      {
        id: 'ffa-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Freight rates move for reasons largely unrelated to the price of the commodity being shipped.',
        correctAnswer: true,
        explanation:
          'Vessel supply, positioning and route demand drive them, which is why a separate hedge exists at all.',
      },
      {
        id: 'ffa-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What does route basis describe?',
        options: [
          'The difference between two settlement months',
          'The gap between one ship’s actual economics and the index average',
          'The cost of fuel on a given route',
          'The spread between vessel classes',
        ],
        correctIndex: 1,
        explanation:
          'Speed, consumption, positioning and next cargo are all specific to a vessel and invisible to an index.',
      },
      {
        id: 'ffa-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A voyage that straddles two calendar months creates a timing mismatch with the hedge.',
        correctAnswer: true,
        explanation:
          'Two settlement periods, neither of which lines up with when the cargo actually moves.',
      },
      {
        id: 'ffa-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'Why is freight among the most volatile markets?',
        options: [
          'Because contracts are always physically settled',
          'Because vessel supply is fixed in the short run while demand is not',
          'Because it is quoted in several currencies',
          'Because indices are published only monthly',
        ],
        correctIndex: 1,
        explanation:
          'A ship takes years to build and cannot be created in response to a busy quarter.',
      },
      {
        id: 'ffa-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A hedge for an unusual route or a distant year carries more basis risk than a standard one.',
        correctAnswer: true,
        explanation:
          'Liquidity concentrates in the main classes and nearest quarters; anything else is a different exposure with the same name.',
      },
      {
        id: 'ffa-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What does the hedge leave the charterer exposed to?',
        options: [
          'The direction of freight rates',
          'The difference between the ship actually hired and the index basket',
          'The price of the commodity being shipped',
          'The creditworthiness of the shipowner',
        ],
        correctIndex: 1,
        explanation:
          'Market-wide moves are removed; the residual is the specific vessel against the average, and it cannot be hedged away.',
      },
    ],
  },
  {
    id: 'power',
    categoryId: 'alt',
    name: 'Power Derivatives',
    hook: 'A commodity that cannot be stored, priced by the hour',
    summary:
      'Electricity has to be produced at the instant it is consumed, which changes everything about how it is traded. A power contract specifies not just a price and a quantity but a shape — which hours, over which period — and a hedge that matches the total but not the shape leaves a residual bought and sold at whatever the spot market does. It is the purest case of delivery profile as a risk in its own right.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A power forward is an agreement to deliver a constant number of megawatts over a defined period at a fixed price per megawatt hour. Because there is no storage, "a megawatt" means a rate of delivery rather than a quantity sitting somewhere: one megawatt delivered continuously through a 31-day month is 744 megawatt hours. Contracts trade in standard blocks — baseload for every hour of the period, and peak for a defined set of weekday daytime hours.',
        callout:
          'The unit is a rate multiplied by time. Getting that wrong by a factor of 24 is the classic first error in a power trade.',
      },
      {
        step: 2,
        title: 'Shape and profile risk',
        content:
          'Almost no real consumer or generator has a flat profile. A factory draws more during a shift, a household more in the evening, a wind farm produces when the wind blows. Hedging that with a flat block matches the total energy and not its distribution, so the difference is settled hour by hour at spot — bought when the profile is above the block and sold when it is below. Since spot is usually higher in exactly the hours when demand is higher, that residual has a systematically negative cost rather than an average of zero.',
        callout:
          'Shape risk is why a hedge that looks complete on the volume can still lose money in every single month.',
      },
      {
        step: 3,
        title: 'The spark spread',
        content:
          'A gas-fired generator’s margin is the power price less the cost of the fuel needed to make it, and the ratio between the two is the heat rate — the units of gas required per unit of electricity, which is the inverse of the plant’s efficiency. Trading that difference directly is a spark spread; the coal equivalent is a dark spread. Because a generator can choose not to run, its economics are those of an option on the spread rather than a position in it: worthless when the spread is negative, and worth the spread when it is positive.',
        callout:
          'The same structure as the crack spread in the free catalogue, with one important difference: a refinery can store its output and a power station cannot.',
      },
      {
        step: 4,
        title: 'Why prices behave differently',
        content:
          'Without storage, there is nothing to smooth a shortage or a glut. Prices spike when demand approaches available capacity and can go negative when inflexible generation would rather pay to keep running than shut down and restart. Volatility is an order of magnitude above other commodities, and it is concentrated: most of a year’s price risk lives in a handful of hours. Averages therefore hide almost everything, which is why the market trades granular blocks and settles half-hourly or hourly.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Volume and price are correlated in a way that defeats naive hedging: a cold snap raises both the amount consumed and the price paid for it, so a fixed-volume hedge under-covers exactly when it matters. Locational differences matter because power has to physically flow, and a constrained network can price the same hour differently in two places. And the extremes are where the money is — a hedge assessed on average outcomes is describing the quiet part of the year.',
        callout:
          'Volumetric risk is the reason weather derivatives and power hedges are usually held by the same desks: the correlation between them is the exposure.',
      },
    ],
    keyTerms: [
      {
        term: 'Baseload block',
        definition:
          'A constant delivery in every hour of the contract period — 1 MW for 31 days is 744 MWh.',
      },
      {
        term: 'Peak block',
        definition:
          'Delivery only in defined weekday daytime hours, when demand and prices are typically highest.',
      },
      {
        term: 'Shape risk',
        definition:
          'The residual left when a flat hedge covers the same total energy as a profile that is not flat.',
      },
      {
        term: 'Heat rate',
        definition:
          'The gas needed per unit of electricity produced, the inverse of a plant’s efficiency.',
      },
      {
        term: 'Spark spread',
        definition:
          'The power price less the fuel cost at a given heat rate — a gas generator’s gross margin.',
      },
      {
        term: 'Volumetric risk',
        definition:
          'Exposure to how much is consumed, which moves with price rather than independently of it.',
      },
    ],
    example: {
      title: 'A hedge that matches the volume and misses the cost',
      lines: [
        'A consumer draws 15 MW for the 12 peak hours and 5 MW for the 12 off-peak hours — an average of 10 MW.',
        'It hedges with a 10 MW baseload block at £80/MWh: 240 MWh a day, costing 240 × £80 = £19,200.',
        'Spot settles at £120/MWh in peak hours and £50/MWh off-peak.',
        'Physical cost: (12 × 15 × £120) + (12 × 5 × £50) = £21,600 + £3,000 = £24,600.',
        'The block settles against spot: its 240 MWh are worth (12 × 10 × 120) + (12 × 10 × 50) = £20,400, so the hedge pays £20,400 − £19,200 = £1,200.',
        'Net cost £24,600 − £1,200 = £23,400, against the £19,200 the hedge price implied. The shape cost £4,200 in a single day.',
      ],
      takeaway:
        'The hedge matched every megawatt hour consumed and still missed by 22%, because the hours that were bought at spot were the expensive ones. Volume is not the exposure; volume by hour is.',
    },
    inPractice:
      'Utilities, industrial consumers and generators trade blocks for the bulk of the exposure and manage the residual shape with more granular products and with spot. The structural features here — no storage, hourly granularity, volume correlated with price — apply to any market where the product is consumed at the instant it is made.',
    relatedProductIds: ['crackspread', 'cmswap', 'weather'],
    quiz: [
      {
        id: 'power-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'One megawatt delivered continuously through a 31-day month is 744 megawatt hours.',
        correctAnswer: true,
        explanation:
          '31 × 24 = 744. The contract quantity is a rate multiplied by the length of the delivery period.',
      },
      {
        id: 'power-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What does a baseload block cover?',
        options: [
          'Only weekday daytime hours',
          'Every hour of the contract period',
          'Only hours when demand exceeds a threshold',
          'A fixed total volume delivered at the buyer’s discretion',
        ],
        correctIndex: 1,
        explanation:
          'Peak blocks cover the defined weekday daytime hours; baseload is flat across the whole period.',
      },
      {
        id: 'power-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A flat hedge matching total consumption also removes the risk from an uneven consumption profile.',
        correctAnswer: false,
        explanation:
          'It leaves the hour-by-hour difference to be bought and sold at spot, which is shape risk.',
      },
      {
        id: 'power-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why is the shape residual systematically costly rather than averaging to zero?',
        options: [
          'Because spot prices are highest in the hours when the profile exceeds the block',
          'Because blocks are always priced above spot',
          'Because the residual must be settled monthly',
          'Because generators refuse to sell in peak hours',
        ],
        correctIndex: 0,
        explanation:
          'You buy the shortfall in expensive hours and sell the surplus in cheap ones — the correlation is the cost.',
      },
      {
        id: 'power-q5',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is the heat rate?',
        options: [
          'The temperature at which a plant operates',
          'The units of fuel needed per unit of electricity produced',
          'The rate at which demand rises with temperature',
          'The proportion of output sold in peak hours',
        ],
        correctIndex: 1,
        explanation:
          'It is the inverse of efficiency, and it converts a gas price into a cost per megawatt hour.',
      },
      {
        id: 'power-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'A generator’s economics resemble an option on the spark spread rather than a position in it.',
        correctAnswer: true,
        explanation:
          'It can choose not to run, so the payoff is floored at zero rather than going negative with the spread.',
      },
      {
        id: 'power-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is the coal equivalent of a spark spread called?',
        options: [
          'A dark spread',
          'A crack spread',
          'A calendar spread',
          'A shape spread',
        ],
        correctIndex: 0,
        explanation:
          'Same construction, different fuel — and the crack spread is the refining version in the free catalogue.',
      },
      {
        id: 'power-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt: 'Power prices can be negative.',
        correctAnswer: true,
        explanation:
          'Inflexible generation may prefer to pay to keep running rather than shut down and restart.',
      },
      {
        id: 'power-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'Why is there no storage-based smoothing in power prices?',
        options: [
          'Because regulation prohibits stockpiling',
          'Because electricity must be produced at the instant it is consumed',
          'Because transmission is instantaneous',
          'Because prices are set monthly in advance',
        ],
        correctIndex: 1,
        explanation:
          'Nothing can be carried from a cheap hour to an expensive one, so each hour clears on its own.',
      },
      {
        id: 'power-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A cold snap raises both the volume consumed and the price paid for it.',
        correctAnswer: true,
        explanation:
          'That correlation is volumetric risk: a fixed-volume hedge under-covers precisely when the price is worst.',
      },
      {
        id: 'power-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'Why can the same hour price differently in two locations?',
        options: [
          'Because currencies differ between regions',
          'Because power must physically flow and the network can be constrained',
          'Because contracts settle on different days',
          'Because heat rates vary between plants',
        ],
        correctIndex: 1,
        explanation:
          'A constrained network separates markets that would otherwise arbitrage together.',
      },
      {
        id: 'power-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Assessing a power hedge on average outcomes is a fair summary of its risk.',
        correctAnswer: false,
        explanation:
          'It describes the quiet part of the year. Most of the annual price risk lives in a handful of hours, which an average removes entirely.',
      },
    ],
  },
  {
    id: 'catbond',
    categoryId: 'alt',
    name: 'Catastrophe Bond',
    hook: 'A coupon that stops if the hurricane arrives',
    summary:
      'A catastrophe bond transfers the risk of a natural disaster from an insurer to capital markets. Investors buy notes, the money sits in a collateral account earning a money market return, and they are paid a spread on top. If a defined event occurs, the principal is written down and paid to the sponsor instead. It is a reinsurance contract in the shape of a bond, and its return has almost nothing to do with the economy.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An insurer facing concentrated exposure to one peril — a hurricane season, an earthquake zone — sets up a separate vehicle that issues notes to investors. The proceeds are held in a collateral account rather than being lent to anyone, so the vehicle can always pay. Investors receive the collateral’s return plus a risk spread for as long as no qualifying event happens. If one does, principal is reduced by the amount the sponsor is owed, and the investors lose it.',
        callout:
          'The structure exists to remove counterparty risk in both directions: the sponsor knows the money is there, and the investor knows the loss can only come from the peril.',
      },
      {
        step: 2,
        title: 'Triggers',
        content:
          'What counts as an event is the whole contract. An indemnity trigger pays on the sponsor’s own actual losses — the closest match to what it needs, and the slowest and most opaque to settle. An industry loss trigger pays when a published estimate of market-wide losses passes a threshold. A parametric trigger pays on physical measurements alone: wind speed and central pressure at defined coordinates, or the magnitude and depth of an earthquake. Parametric settles in days and can pay nothing at all when the sponsor has lost a great deal, which is the trade being made.',
        callout:
          'Speed and objectivity on one side, basis risk on the other. Every trigger design sits somewhere on that line, and the sponsor chooses where.',
      },
      {
        step: 3,
        title: 'The layer',
        content:
          'A bond covers a slice of the loss distribution, defined by an attachment point where it begins to pay and an exhaustion point where it is entirely gone. Below attachment the investor loses nothing; above exhaustion there is nothing left to lose. Between them the principal is written down in proportion. Modelling firms estimate the annual probability-weighted loss of that layer, which is quoted as the expected loss, and the ratio of the spread to that expected loss — the multiple — is how the market compares one deal with another.',
        callout:
          'A multiple of four means investors are paid four times the modelled expected loss. Whether that is generous depends entirely on whether you believe the model.',
      },
      {
        step: 4,
        title: 'Why it’s used',
        content:
          'For the sponsor it is capacity: reinsurance from a pool of money far larger than the traditional reinsurance market, fully collateralised and priced by investors rather than by an underwriting cycle. For the investor it is a return whose risk is a windstorm rather than a recession — the payoff depends on physical events that have no reason to correlate with equities, credit or rates. That independence is the reason the asset class exists, and it holds precisely because the underlying is not financial.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The loss is binary in character: years of collecting a spread and then most of the principal at once, which is the same shape as selling deep out-of-the-money options and deserves the same suspicion of smooth historical returns. Expected loss is a model output, and models are recalibrated after events that surprise them. Parametric triggers can miss — a storm that devastates a region while missing the measurement point pays nothing. And there is often a wait, sometimes years, before an indemnity deal’s final loss is known and the principal is released.',
        callout:
          'The honest description of the return is: paid to be short a rare, large, physically-determined loss. Everything else follows from that.',
      },
    ],
    keyTerms: [
      {
        term: 'Sponsor',
        definition:
          'The insurer or corporate transferring the risk, and the party the bond pays when an event occurs.',
      },
      {
        term: 'Collateral account',
        definition:
          'Where the note proceeds are held, so the vehicle can always pay and the investor takes no credit risk.',
      },
      {
        term: 'Parametric trigger',
        definition:
          'A payout condition based on physical measurements alone, settling quickly and matching losses imperfectly.',
      },
      {
        term: 'Attachment point',
        definition: 'The loss level at which the bond begins to lose principal.',
      },
      {
        term: 'Exhaustion point',
        definition:
          'The loss level at which the bond’s principal is entirely gone.',
      },
      {
        term: 'Multiple',
        definition:
          'The spread divided by the modelled expected loss — the market’s standard relative value measure.',
      },
    ],
    example: {
      title: 'What a single event does to the principal',
      lines: [
        'A $200m bond attaches at $2bn of industry losses and is exhausted at $3bn, so it covers a $1bn layer.',
        'The spread is 8% a year on top of the collateral return, and the modelled expected loss is 2%.',
        'The multiple is 8 ÷ 2 = 4: investors are paid four times the modelled loss for taking it.',
        'A hurricane produces $2.5bn of industry losses — halfway through the layer.',
        'Principal is written down by (2.5 − 2.0) ÷ (3.0 − 2.0) = 50%, so $100m goes to the sponsor.',
        'The investor keeps $100m plus the spread earned to date, and four years of that spread was $64m.',
      ],
      takeaway:
        'One event can take half the principal, and four uneventful years do not quite replace it. That asymmetry is the position, and a track record of quiet years does not describe it.',
    },
    inPractice:
      'Pension funds and specialist funds are the main investors, usually as a diversifying allocation rather than a core one. Sponsors are insurers, reinsurers and occasionally public bodies covering earthquake or storm exposure. The same structure has been extended to other rare, measurable events, and the design questions are always the same three: what triggers it, where does it attach, and who modelled the loss.',
    relatedProductIds: ['weather', 'cln', 'longevity'],
    quiz: [
      {
        id: 'catbond-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The proceeds of a catastrophe bond are held in a collateral account rather than lent out.',
        correctAnswer: true,
        explanation:
          'It removes credit risk in both directions: the sponsor knows the money is there, the investor knows the loss can only come from the peril.',
      },
      {
        id: 'catbond-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What does the investor receive while no event occurs?',
        options: [
          'The collateral return only',
          'The collateral return plus a risk spread',
          'A share of the sponsor’s premiums',
          'A fixed coupon set by the sponsor’s credit rating',
        ],
        correctIndex: 1,
        explanation:
          'The spread is the payment for taking the peril risk; the collateral return is just what the cash earns.',
      },
      {
        id: 'catbond-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does a parametric trigger pay on?',
        options: [
          'The sponsor’s actual claims',
          'A published estimate of industry-wide losses',
          'Physical measurements such as wind speed or earthquake magnitude',
          'The rating agency’s assessment of the event',
        ],
        correctIndex: 2,
        explanation:
          'It settles in days and it can pay nothing while the sponsor has lost a great deal — that is the trade.',
      },
      {
        id: 'catbond-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'An indemnity trigger matches the sponsor’s losses most closely but settles slowest.',
        correctAnswer: true,
        explanation:
          'Actual claims take time to develop, so the principal can be held for a long while before it is released.',
      },
      {
        id: 'catbond-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'A parametric trigger removes basis risk for the sponsor.',
        correctAnswer: false,
        explanation:
          'It creates it. A storm can devastate a region and miss the measurement point entirely.',
      },
      {
        id: 'catbond-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt: 'What is the attachment point?',
        options: [
          'The loss level at which the bond begins to lose principal',
          'The date the bond is issued',
          'The maximum coupon payable',
          'The level at which the principal is fully gone',
        ],
        correctIndex: 0,
        explanation:
          'The exhaustion point is where it is fully gone; between them the write-down is proportional.',
      },
      {
        id: 'catbond-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What does the multiple measure?',
        options: [
          'The leverage in the structure',
          'The spread divided by the modelled expected loss',
          'The number of perils covered',
          'The ratio of attachment to exhaustion',
        ],
        correctIndex: 1,
        explanation:
          'It is how the market compares deals — and it is only as meaningful as the model behind the expected loss.',
      },
      {
        id: 'catbond-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The return on a catastrophe bond depends on physical events rather than on financial markets.',
        correctAnswer: true,
        explanation:
          'That independence from equities, credit and rates is the reason the asset class exists.',
      },
      {
        id: 'catbond-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'What does the sponsor get that traditional reinsurance may not offer?',
        options: [
          'A lower price in every market condition',
          'Fully collateralised capacity, priced by investors rather than an underwriting cycle',
          'Protection against financial market losses',
          'An indemnity against all perils',
        ],
        correctIndex: 1,
        explanation:
          'The money is already in the account, and the pricing comes from a different pool of capital.',
      },
      {
        id: 'catbond-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt: 'The payoff shape resembles selling deep out-of-the-money options.',
        correctAnswer: true,
        explanation:
          'Years of spread and then a large loss at once — and a smooth history describes the quiet years, not the risk.',
      },
      {
        id: 'catbond-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why is the expected loss figure worth treating carefully?',
        options: [
          'It is set by the sponsor',
          'It is a model output, and models are recalibrated after events that surprise them',
          'It is published only after an event',
          'It excludes the collateral return',
        ],
        correctIndex: 1,
        explanation:
          'The multiple is a ratio to that number, so the comparison is only as good as the modelling behind it.',
      },
      {
        id: 'catbond-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'After an event, principal on an indemnity deal is released immediately once the storm passes.',
        correctAnswer: false,
        explanation:
          'Actual losses take time to develop, and the principal can be held for a year or more while they do.',
      },
    ],
  },
  {
    id: 'longevity',
    categoryId: 'alt',
    name: 'Longevity Swap',
    hook: 'Insuring against people living longer than planned',
    summary:
      'A pension scheme’s greatest uncertainty is not markets but mortality: it owes payments for as long as its members live, and nobody knows how long that is. A longevity swap exchanges a fixed schedule of payments, agreed today on assumed mortality, for the payments the scheme actually has to make. If members live longer than assumed, the swap pays the difference for as long as it lasts — which can be fifty years.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'The scheme pays a fixed leg — a schedule of amounts calculated today from an agreed mortality assumption, plus a margin for the counterparty — and receives a floating leg equal to the actual pension payments made to the members covered. No principal is exchanged and nothing is invested. If mortality turns out exactly as assumed the two legs cancel and the scheme has paid the margin for certainty. If members live longer, the floating leg exceeds the fixed one and the swap covers the excess.',
        callout:
          'The scheme is not betting on longevity. It already holds the exposure, unavoidably, from the day it promised a pension for life.',
      },
      {
        step: 2,
        title: 'Who takes the other side',
        content:
          'Insurers and reinsurers, and for a good structural reason: a life insurance book pays out when people die sooner than expected, and an annuity or pension book pays out when they live longer. The two exposures offset within the same balance sheet. That natural hedge is why the market exists at all — the risk is not being warehoused for a fee so much as being matched against its mirror image, which is one of the more elegant arrangements in finance.',
        callout:
          'Where no natural offset exists, the capacity has to be paid for, which is why longevity capacity is finite and priced accordingly.',
      },
      {
        step: 3,
        title: 'Indemnity and index',
        content:
          'An indemnity swap references the scheme’s own members: their ages, their pension amounts, their actual dates of death. It hedges exactly, and it requires disclosing detailed member data and takes months to arrange. An index-based hedge references published mortality rates for a national population, often through a q-forward — a forward on a mortality rate for one age cohort. It is quicker, cheaper and standardised, and it leaves basis risk: a scheme’s members are not a random sample of the country, and wealthier populations have systematically lighter mortality.',
      },
      {
        step: 4,
        title: 'Why it’s used',
        content:
          'It converts an open-ended liability into a known one without selling the scheme’s assets, which is what distinguishes it from a buy-in or buyout where an insurer takes both the assets and the obligations. The scheme keeps its investment strategy and hedges only the biological uncertainty. For a sponsor company it removes the risk that a decade of medical progress reopens a deficit that had been closed.',
        callout:
          'Small changes matter more than they look: as a rule of thumb, one additional year of life expectancy adds around 3 to 4% to a scheme’s liabilities.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The term is the problem. A swap running fifty years is a fifty-year credit exposure to a counterparty, which is why these are collateralised and often reinsured behind the scenes — and why the collateral schedule, not the price, is where the negotiation happens. Index hedges carry basis risk that only reveals itself over decades. And the fixed leg embeds an assumption: if mortality improvements slow rather than accelerate, the scheme has paid for protection against something that did not happen, which is what insurance is and is worth saying out loud before signing.',
        callout:
          'The same lesson as everywhere in this app, at the longest horizon available: the hedge settles on its own schedule, and here that schedule outlives most of the people who arranged it.',
      },
    ],
    keyTerms: [
      {
        term: 'Longevity risk',
        definition:
          'The risk that members live longer than assumed, so a scheme pays pensions for more years than it funded.',
      },
      {
        term: 'Fixed leg',
        definition:
          'The pre-agreed schedule of payments based on assumed mortality, plus the counterparty’s margin.',
      },
      {
        term: 'Floating leg',
        definition:
          'The actual pension payments made to the covered members, however long they live.',
      },
      {
        term: 'Indemnity swap',
        definition:
          'A hedge referencing the scheme’s own members, matching exactly but requiring detailed data.',
      },
      {
        term: 'q-forward',
        definition:
          'A forward on a published mortality rate for an age cohort — the standardised, index-based alternative.',
      },
      {
        term: 'Basis risk',
        definition:
          'The gap between a scheme’s own members and the national population an index hedge references.',
      },
    ],
    example: {
      title: 'One year of the fifty',
      lines: [
        'A scheme covers 10,000 pensioners and expects to pay £50m this year, declining as members die.',
        'The fixed leg for the year is set at £51m: the expected £50m plus £1m of margin for the counterparty.',
        'Mortality is lighter than assumed, so more pensioners are alive and actual payments are £53m.',
        'The floating leg pays the scheme £53m and it pays £51m: a net receipt of £2m, exactly covering the excess.',
        'Had mortality been heavier and payments only £48m, the scheme would have paid £3m net — and saved that much on its pensions.',
        'Repeat annually for four or five decades, on a liability where one extra year of life expectancy is worth 3 to 4% of the total.',
      ],
      takeaway:
        'Every year is small and the sequence is not. The swap converts an unbounded, compounding uncertainty into a known cost, which is the whole reason to pay the £1m.',
    },
    inPractice:
      'UK and Dutch pension schemes are the main users, with insurers and reinsurers on the other side and investment banks often intermediating. The transactions are large, slow to arrange and heavily negotiated on collateral rather than on price, because both sides know the price is the easy part of a fifty-year contract.',
    relatedProductIds: ['catbond', 'irs', 'ldi'],
    quiz: [
      {
        id: 'longevity-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A longevity swap exchanges a fixed schedule of payments for the payments a scheme actually makes.',
        correctAnswer: true,
        explanation:
          'Fixed leg on assumed mortality, floating leg on actual — and the difference is the exposure being hedged.',
      },
      {
        id: 'longevity-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What is exchanged at the start of a longevity swap?',
        options: [
          'The scheme’s assets',
          'A principal amount equal to the liabilities',
          'Nothing — no principal changes hands',
          'The members’ pension entitlements',
        ],
        correctIndex: 2,
        explanation:
          'It is a swap of payment streams. The scheme keeps its assets and its investment strategy.',
      },
      {
        id: 'longevity-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A scheme entering a longevity swap is taking on a new exposure to mortality.',
        correctAnswer: false,
        explanation:
          'It already had the exposure from the day it promised a pension for life. The swap transfers it.',
      },
      {
        id: 'longevity-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'Why are insurers and reinsurers natural counterparties?',
        options: [
          'They are required by regulation to provide the capacity',
          'A life insurance book pays out when people die sooner, offsetting an annuity book',
          'They can invest the swap’s principal at higher yields',
          'They are exempt from collateral requirements',
        ],
        correctIndex: 1,
        explanation:
          'The two exposures are mirror images, so the risk is matched rather than merely warehoused.',
      },
      {
        id: 'longevity-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Longevity capacity is effectively unlimited because the risk is uncorrelated with markets.',
        correctAnswer: false,
        explanation:
          'It is finite: beyond the natural offset in insurers’ books, someone has to be paid to hold it outright.',
      },
      {
        id: 'longevity-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What does an indemnity longevity swap reference?',
        options: [
          'A national mortality index',
          'The scheme’s own members and their actual pension payments',
          'The sponsor company’s workforce',
          'An insurer’s annuity book',
        ],
        correctIndex: 1,
        explanation:
          'It hedges exactly, at the cost of detailed member data and a slower transaction.',
      },
      {
        id: 'longevity-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What is a q-forward?',
        options: [
          'A forward on a published mortality rate for an age cohort',
          'A forward on a scheme’s funding level',
          'An option to extend a longevity swap',
          'A forward on annuity prices',
        ],
        correctIndex: 0,
        explanation:
          'It is the standardised, index-based building block — quicker and cheaper, and it leaves basis risk.',
      },
      {
        id: 'longevity-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'A scheme’s members are effectively a random sample of the national population.',
        correctAnswer: false,
        explanation:
          'They are not, and wealthier populations have systematically lighter mortality — which is the basis risk in an index hedge.',
      },
      {
        id: 'longevity-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'How does a longevity swap differ from a buyout?',
        options: [
          'It transfers the assets as well as the liabilities',
          'It hedges the mortality risk while the scheme keeps its assets and strategy',
          'It covers only members who have already retired',
          'It requires no counterparty',
        ],
        correctIndex: 1,
        explanation:
          'A buyout hands both sides to an insurer; the swap isolates the biological uncertainty.',
      },
      {
        id: 'longevity-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'As a rule of thumb, one additional year of life expectancy adds roughly 3 to 4% to a scheme’s liabilities.',
        correctAnswer: true,
        explanation:
          'Small per year, and it compounds across a liability measured over decades.',
      },
      {
        id: 'longevity-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Where does the negotiation on these transactions concentrate?',
        options: [
          'On the price of the fixed leg',
          'On the collateral schedule',
          'On the choice of index provider',
          'On the settlement currency',
        ],
        correctIndex: 1,
        explanation:
          'A fifty-year contract is a fifty-year credit exposure, and both sides know the price is the easy part.',
      },
      {
        id: 'longevity-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'If mortality improvements slow, the scheme will have paid for protection it did not need.',
        correctAnswer: true,
        explanation:
          'That is what insurance is, and it is worth saying plainly before signing rather than afterwards.',
      },
    ],
  },
];
