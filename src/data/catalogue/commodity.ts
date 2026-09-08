import type { Product } from '../types';

/** Commodity products. Ids are stable — saved progress is keyed by them. */
export const commodityProducts: Product[] = [
  {
    id: 'cmswap',
    categoryId: 'commodity',
    name: 'Commodity Swap',
    hook: 'Fixed price for floating market price',
    summary:
      'A commodity swap exchanges a fixed price for a floating one on an agreed volume — barrels of crude, tonnes of wheat, ounces of gold — without either side buying or selling the physical goods. The floating leg is a published price index, usually averaged over each settlement period, and only the net difference changes hands. That separation is the point: a producer or consumer carries on buying and selling physically on its own terms, and lays the price risk off in a separate financial contract that never touches its supply chain.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One party pays a fixed price, the other pays a floating market price for a commodity like oil or gold, on a notional volume — cash-settled with no physical delivery. Neither side is obliged to produce, take or store anything; the swap only moves cash based on where the published price ends up.',
        callout:
          'Notional is quoted in volume rather than currency — barrels, therms, troy ounces, tonnes. The money at stake is whatever that volume happens to be worth.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The floating leg is usually the average of a published reference price over each settlement period, so a monthly swap settles against the month’s average rather than a single day’s close. Only the net difference between the two legs is paid: if the average sits above the fixed price, the floating payer sends the difference on the full notional volume, and if it sits below, the cash flows the other way.',
        callout:
          'Monthly averaging is the dominant convention in oil swaps: the floating leg is the mean of every publication of the index on the business days in the calendar month.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Producers and consumers hedge price risk: an airline might fix its fuel costs, or a miner might lock in a selling price for gold. A consumer pays fixed and receives floating, so a rise in the index is refunded by the swap; a producer does the reverse, receiving fixed and paying floating, so a fall in the index is made good. Banks and trading firms take the other side and manage the resulting position in the futures market.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference price or index, fixed price, settlement periods, notional volume, and the averaging convention that determines how the floating leg is calculated. The fixed price is agreed at inception and never changes; everything uncertain about the trade sits in the floating leg.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Basis risk appears when the published index does not match the grade or delivery location actually traded. Fixing the price also means giving up gains if the market rallies, and a hedge sized to expected volumes leaves exposure if actual output differs — hedging more than you produce turns the surplus into an outright speculative position.',
        callout:
          'Commodity swaps sit outside the clearing mandates that cover standard interest rate and credit index swaps, so most stay bilateral, documented under an ISDA Master Agreement with a Credit Support Annex governing collateral.',
      },
    ],
    keyTerms: [
      {
        term: 'Fixed price',
        definition:
          'The price agreed at inception for the whole life of the swap, quoted per unit of the commodity.',
      },
      {
        term: 'Floating leg',
        definition:
          'The side that pays a published market price, observed and averaged over each settlement period.',
      },
      {
        term: 'Reference index',
        definition:
          'The named published price the floating leg settles against, such as a dated Brent or gold benchmark assessment.',
      },
      {
        term: 'Notional volume',
        definition:
          'The quantity of the commodity the swap is calculated on — barrels, tonnes or ounces — never actually delivered.',
      },
      {
        term: 'Averaging convention',
        definition:
          'The rule turning a series of daily published prices into the single floating price for a period.',
      },
      {
        term: 'Basis risk',
        definition:
          'The residual exposure left when the hedged index differs from the grade or location actually bought or sold.',
      },
    ],
    example: {
      title: 'An airline fixes a month of jet fuel',
      lines: [
        'An airline burns 50,000 barrels of jet fuel a month and buys it physically at the market price.',
        'It enters a swap paying $95.00 a barrel fixed and receiving the jet fuel index on 50,000 barrels.',
        'Over the month the index averages $102.00 a barrel, so the physical fuel costs 50,000 × $102 = $5,100,000.',
        'The swap settles in the airline’s favour by $7.00 a barrel: 50,000 × $7 = $350,000 received.',
        'Net cash out is $5,100,000 − $350,000 = $4,750,000, which is exactly $95.00 a barrel.',
      ],
      takeaway:
        'The swap did not buy a single barrel. It simply refunded the airline the amount by which the index exceeded $95, leaving the fixed price as the effective cost — and it would have clawed back the saving had the index averaged below $95.',
    },
    inPractice:
      'Airlines and shipping lines pay fixed to budget fuel, gold and copper miners receive fixed to underwrite a mine plan, and utilities swap gas to fix the input cost behind a regulated tariff. The dealer on the other side is usually a bank commodity desk or a merchant trading house, which hedges its own book in exchange-traded futures.',
    relatedProductIds: ['cmopt', 'crackspread', 'irs'],
    quiz: [
      {
        id: 'cmswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Commodity swaps typically involve physical delivery of the commodity.',
        correctAnswer: false,
        explanation:
          'They are cash-settled against a reference price — no physical delivery occurs.',
      },
      {
        id: 'cmswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'How is the notional of a commodity swap normally expressed?',
        options: [
          'A currency amount, as in an interest rate swap',
          'A volume of the commodity, such as barrels or ounces',
          'The number of exchange-traded futures the swap replaces',
          'The number of physical cargoes scheduled for the period',
        ],
        correctIndex: 1,
        explanation:
          'The size is a quantity of the commodity. Its cash value is whatever that volume is worth at the prevailing price.',
      },
      {
        id: 'cmswap-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'The floating leg of a monthly commodity swap is often the average of a published index over the month.',
        correctAnswer: true,
        explanation:
          'Averaging is the standard convention, and it stops a single day’s print deciding the settlement.',
      },
      {
        id: 'cmswap-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'An airline pays $95 a barrel fixed and receives the index on 50,000 barrels. The index averages $102. What settles?',
        options: [
          'The airline pays $350,000',
          'The airline receives $350,000',
          'The airline receives $5,100,000',
          'Both sides pay gross: $4,750,000 and $5,100,000',
        ],
        correctIndex: 1,
        explanation:
          'The index is $7 above the fixed price, and 50,000 × $7 = $350,000 flows to the fixed payer. Only the difference moves.',
      },
      {
        id: 'cmswap-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'On each settlement date both legs are paid gross, so two payments change hands.',
        correctAnswer: false,
        explanation:
          'The legs are netted. One party pays the difference between the fixed price and the averaged floating price.',
      },
      {
        id: 'cmswap-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'An airline might use a commodity swap to hedge fuel costs.',
        correctAnswer: true,
        explanation:
          'Paying fixed and receiving the fuel index refunds the airline whenever the market price rises above the fixed level.',
      },
      {
        id: 'cmswap-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A gold miner wants certainty over the price it will realise. What should it do on a swap?',
        options: [
          'Receive the fixed price and pay the floating index',
          'Pay the fixed price and receive the floating index',
          'Pay the floating index on both legs',
          'Buy the index outright for the same volume',
        ],
        correctIndex: 0,
        explanation:
          'A producer receives fixed. If the gold price falls, the swap pays it the shortfall against the fixed level.',
      },
      {
        id: 'cmswap-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which term decides how a series of daily published prices becomes the single floating price for a period?',
        options: [
          'The notional volume',
          'The fixed price',
          'The averaging convention',
          'The reference index',
        ],
        correctIndex: 2,
        explanation:
          'The index names which price is used; the averaging convention says how those observations are combined.',
      },
      {
        id: 'cmswap-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The fixed price is agreed at inception and does not change over the life of the swap.',
        correctAnswer: true,
        explanation:
          'All the uncertainty in the trade sits on the floating leg; the fixed price is set once and stands.',
      },
      {
        id: 'cmswap-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A producer who hedges with a swap still benefits fully if prices rise.',
        correctAnswer: false,
        explanation:
          'The swap fixes the price, so gains above the fixed level are handed back on the floating leg.',
      },
      {
        id: 'cmswap-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'An airline hedges jet fuel using a swap on a crude oil index. What exposure remains?',
        options: [
          'Basis risk between the crude index and the jet fuel it actually buys',
          'None — a crude hedge fully covers a refined product',
          'Delivery risk on the physical barrels referenced by the swap',
          'The credit risk of the exchange that publishes the index',
        ],
        correctIndex: 0,
        explanation:
          'Crude and jet fuel are correlated but not identical. The gap between them can move against the hedge.',
      },
      {
        id: 'cmswap-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Hedging a volume larger than the output actually produced turns part of the position into a speculative one.',
        correctAnswer: true,
        explanation:
          'Only the hedged volume that matches real production offsets anything. The surplus is a naked bet on the price.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'The pricing window is the contract',
          content:
            'These settle against an average of published prices over a stated window, and the window is negotiated rather than standard: every business day of the month, the five days around a delivery date, a weighted set of prints. Two swaps on the same commodity for the same month can settle at materially different levels because one averaged the whole month and the other averaged four days of it. The window is chosen to match how the physical exposure actually accrues, and a mismatch between the two is a basis position created by a paperwork decision.',
          callout:
            'An averaged settlement is also an averaged hedge. A physical cargo priced on three days cannot be hedged perfectly with a swap priced on twenty-two.',
        },
        {
          title: 'Whose price, published where',
          content:
            'Most commodities have no exchange price for the grade and location that matters, so the reference is an assessment published by a price reporting agency, built from reported transactions and broker submissions. That makes the methodology part of the contract: what the agency includes, how it treats outliers, what it does on a day with no trades. Those methodologies are revised from time to time, and a revision changes what an existing contract settles against — which is why the documentation names the publication and specifies what happens if it changes or ceases.',
        },
        {
          title: 'Grade and location basis',
          content:
            'A hedge references a benchmark; a business produces or consumes something specific, somewhere specific. The difference between them — a heavier crude, an inland delivery point, a different sulphur content — is basis, and it moves for reasons the benchmark never sees: a pipeline outage, a refinery turnaround, a shipping bottleneck. Basis is often the larger part of the risk for a physical business, and it is the part a liquid benchmark hedge is structurally unable to cover.',
          callout:
            'The recurring shape across this whole app, one more time: what is hedgeable and what is held are two different things, and the gap is where the risk lives.',
        },
      ],
      quiz: [
        {
          id: 'cmswap-d1',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'The pricing window used for settlement is negotiated rather than standard.',
          correctAnswer: true,
          explanation:
            'A whole month, five days around a delivery date, or a weighted set — and it changes the settlement level.',
        },
        {
          id: 'cmswap-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Why can two swaps on the same commodity and month settle differently?',
          options: [
            'Because they used different pricing windows',
            'Because one was cleared and one was not',
            'Because of differing counterparty credit',
            'Because of the day count convention',
          ],
          correctIndex: 0,
          explanation:
            'Averaging twenty-two prints and averaging four is not the same measurement.',
        },
        {
          id: 'cmswap-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A cargo priced over three days can be hedged exactly with a swap priced over the whole month.',
          correctAnswer: false,
          explanation:
            'The mismatch between windows is a basis position created by a documentation choice.',
        },
        {
          id: 'cmswap-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Where does the reference price usually come from?',
          options: [
            'An exchange settlement',
            'An assessment published by a price reporting agency',
            'The counterparty’s internal marks',
            'A central bank publication',
          ],
          correctIndex: 1,
          explanation:
            'Most grades and locations have no exchange price, so an assessed one carries the contract.',
        },
        {
          id: 'cmswap-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt: 'The agency’s methodology is effectively part of the contract.',
          correctAnswer: true,
          explanation:
            'What it includes, how it handles outliers and what it does on a day with no trades all decide the settlement.',
        },
        {
          id: 'cmswap-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'Why does the documentation name the publication explicitly?',
          options: [
            'Because methodologies are revised, and a revision changes what an existing contract settles against',
            'Because the agency charges a licence fee',
            'Because exchanges require attribution',
            'Because the price is otherwise confidential',
          ],
          correctIndex: 0,
          explanation:
            'And it specifies what happens if the publication changes or ceases, which is the same problem as a fixing fallback.',
        },
        {
          id: 'cmswap-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'For a physical business, basis is often the larger part of the risk.',
          correctAnswer: true,
          explanation:
            'The benchmark moves with the market; the basis moves with pipelines, turnarounds and freight.',
        },
        {
          id: 'cmswap-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What creates grade and location basis?',
          options: [
            'The difference between the benchmark and the specific product at a specific place',
            'The credit rating of the counterparty',
            'The choice of settlement currency',
            'The clearing house’s margin model',
          ],
          correctIndex: 0,
          explanation:
            'A heavier crude, an inland delivery point, a different specification — none of which the benchmark sees.',
        },
        {
          id: 'cmswap-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A liquid benchmark hedge can be structured to cover location basis as well.',
          correctAnswer: false,
          explanation:
            'It is structurally unable to. Covering basis needs a separate instrument, where one exists at all.',
        },
        {
          id: 'cmswap-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'What moves basis that does not move the benchmark?',
          options: [
            'A pipeline outage or a refinery turnaround',
            'A change in global demand',
            'A move in interest rates',
            'A change in the exchange rate',
          ],
          correctIndex: 0,
          explanation:
            'Local, physical and largely invisible to a screen showing the headline price.',
        },
        {
          id: 'cmswap-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Choosing the pricing window is part of designing the hedge, not an administrative detail.',
          correctAnswer: true,
          explanation:
            'It decides how closely the settlement tracks the exposure it is meant to offset.',
        },
        {
          id: 'cmswap-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What is the recurring lesson here?',
          options: [
            'What is hedgeable and what is held are different things',
            'Averaging removes all risk',
            'Assessed prices are unreliable',
            'Physical businesses should not hedge',
          ],
          correctIndex: 0,
          explanation:
            'The same shape as every basis lesson in the app, expressed in barrels and tonnes.',
        },
      ],
    },
  },
  {
    id: 'cmopt',
    categoryId: 'commodity',
    name: 'Commodity Option',
    hook: 'Cap or floor a commodity price',
    summary:
      'A commodity option gives its buyer the right, but never the obligation, to transact at a fixed strike price — a call to buy, a put to sell. That asymmetry is what a hedger pays for: unlike a swap or a forward, an option protects against the move that hurts while leaving the move that helps intact. The price of that one-sidedness is the premium, paid up front and gone whether or not the option is ever exercised.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A right to buy (call) or sell (put) a commodity at a strike price by expiry, often cash-settled against a reference price rather than physically delivered. The buyer chooses whether to use it; the seller has no choice and must perform if it is exercised.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'At expiry the reference price is compared with the strike, and if the option is in the money the seller pays the difference on the contract volume. Many commodity options are Asian-style, settling against an average price over a period instead of a single date, which matches a hedger that buys or sells its physical commodity steadily through the month.',
        callout:
          'Averaging reduces the volatility of the settlement price, so an Asian option is normally cheaper than an otherwise identical option settling on a single date.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A call caps a consumer’s purchase cost; a put protects a producer’s selling price — both while preserving upside if prices move favourably. Because the premium can be uncomfortable, hedgers often fund it: a consumer buys the call it wants and sells a put below the market, so the two premiums roughly offset. That zero-cost collar keeps the cap but gives back the benefit of a large fall.',
        callout:
          'A collar is not free. The premium is paid in optionality rather than cash — the consumer that sells a put has agreed to buy at that floor no matter how far the market drops below it.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, premium, underlying reference price, and expiry — the buyer’s maximum loss is always the premium paid. Contract volume sets how much the payoff is multiplied by.',
        callout:
          'Premium is quoted per unit of volume and paid up front: $2.50 a barrel on 100,000 barrels is $250,000, payable whether or not the option ever pays out.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Premiums can be steep for volatile commodities, and the whole premium is lost if the option expires worthless. Basis risk remains between the reference index and the physical grade actually bought or sold, and sellers face heavy losses if prices gap sharply — a sold call has no ceiling on what it can cost.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike',
        definition:
          'The price at which the option may be exercised, fixed when the trade is agreed.',
      },
      {
        term: 'Premium',
        definition:
          'The up-front price of the option, quoted per unit of volume and kept by the seller whatever happens.',
      },
      {
        term: 'Call',
        definition:
          'The right to buy at the strike, which caps what a consumer effectively pays for the commodity.',
      },
      {
        term: 'Put',
        definition:
          'The right to sell at the strike, which puts a floor under what a producer effectively receives.',
      },
      {
        term: 'Asian settlement',
        definition:
          'Settlement against the average of the reference price over a period rather than its level on one date.',
      },
      {
        term: 'Contract volume',
        definition:
          'The quantity the per-unit payoff is multiplied by to give the cash amount actually paid.',
      },
    ],
    example: {
      title: 'A haulier caps its diesel cost',
      lines: [
        'A haulage firm buys 20,000 barrels of diesel a month and wants protection above $100 a barrel.',
        'It buys an Asian call struck at $100.00 for a premium of $4.00 a barrel: 20,000 × $4 = $80,000 paid up front.',
        'The index averages $112.00, so the option pays (112 − 100) × 20,000 = $240,000.',
        'The physical diesel costs 20,000 × $112 = $2,240,000, less the $240,000 payout, less nothing else: $2,000,000.',
        'Adding the premium already spent gives $2,080,000 in total, or $104.00 a barrel.',
      ],
      takeaway:
        'The effective cost is capped at the strike plus the premium — $104 — no matter how high the index goes. Had the average come in at $95 the option would have expired worthless, and the firm would have paid $95 + $4 = $99, still better than the cap.',
    },
    inPractice:
      'Airlines and hauliers buy calls when they want a budget ceiling without forfeiting the windfall of a price collapse, and oil producers buy puts to guarantee a minimum realised price to lenders financing a field. Banks and trading houses write the other side and hedge the resulting exposure dynamically in futures.',
    relatedProductIds: ['cmswap', 'capfloor', 'eqopt'],
    quiz: [
      {
        id: 'cmopt-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A commodity call gives its buyer the right, but not the obligation, to buy at the strike.',
        correctAnswer: true,
        explanation:
          'That optionality is the defining feature. The seller, by contrast, must perform if the buyer exercises.',
      },
      {
        id: 'cmopt-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Which statement describes a commodity put?',
        options: [
          'An obligation to sell at the strike price',
          'A right to sell at the strike price',
          'A right to buy at the strike price',
          'An obligation to buy at the prevailing market price',
        ],
        correctIndex: 1,
        explanation:
          'A put is a right to sell. It sets a floor under the price a producer can realise.',
      },
      {
        id: 'cmopt-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A call struck at $100 on 20,000 barrels cost $4 a barrel. The settlement average is $112. What does the option pay?',
        options: [
          '$80,000',
          '$160,000',
          '$240,000',
          'Nothing — it expires worthless',
        ],
        correctIndex: 2,
        explanation:
          'It is $12 in the money: 20,000 × $12 = $240,000. The $80,000 premium was a separate, earlier payment.',
      },
      {
        id: 'cmopt-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'An Asian-style commodity option settles against an average price rather than one day’s price.',
        correctAnswer: true,
        explanation:
          'Averaging matches a hedger that buys or sells physically throughout the period rather than on a single date.',
      },
      {
        id: 'cmopt-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'An average-price option costs more than an otherwise identical option settling on a single date.',
        correctAnswer: false,
        explanation:
          'It costs less. Averaging damps the volatility of the settlement price, and less volatility means less option value.',
      },
      {
        id: 'cmopt-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A consumer wants a ceiling on its purchase cost but wants to keep the benefit if prices fall. What should it buy?',
        options: [
          'A put',
          'A call',
          'A swap on which it pays fixed',
          'A forward purchase at today’s price',
        ],
        correctIndex: 1,
        explanation:
          'A call caps the cost. A swap or a forward would fix it in both directions and surrender the fall.',
      },
      {
        id: 'cmopt-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'A producer that buys a put gives up the benefit of higher prices.',
        correctAnswer: false,
        explanation:
          'The put only sets a floor. If prices rise the producer simply lets it lapse and sells at the higher market price.',
      },
      {
        id: 'cmopt-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'How does a consumer construct a zero-cost collar?',
        options: [
          'Buy a call and sell a put so the two premiums roughly offset',
          'Buy a call and buy a put at the same strike',
          'Sell a call and sell a put to collect two premiums',
          'Buy two calls at different strikes and the same expiry',
        ],
        correctIndex: 0,
        explanation:
          'The sold put funds the bought call. The cap survives, but the consumer must buy at the floor however far the market falls.',
      },
      {
        id: 'cmopt-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt: 'The option buyer’s maximum loss is the premium paid.',
        correctAnswer: true,
        explanation:
          'Losses are capped at the premium — unlike a swap or a forward, which can owe without limit.',
      },
      {
        id: 'cmopt-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A premium is quoted at $2.50 a barrel on a contract volume of 100,000 barrels. What is paid up front?',
        options: [
          '$25,000',
          '$250,000',
          '$2,500,000',
          'Nothing until the option settles in the money',
        ],
        correctIndex: 1,
        explanation:
          '100,000 × $2.50 = $250,000, payable at the start regardless of how the option ends up.',
      },
      {
        id: 'cmopt-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'If the option expires out of the money the buyer gets the premium back.',
        correctAnswer: false,
        explanation:
          'The premium is spent. That is the cost of the protection, whether or not it was ever needed.',
      },
      {
        id: 'cmopt-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The seller of a commodity call has a loss capped at the premium received.',
        correctAnswer: false,
        explanation:
          'The buyer’s loss is capped; the seller’s is not. A sold call owes more the further the price rises, without limit.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Average price options are the default',
          content:
            'In most commodity markets the standard option is Asian — it settles against the average price over a period rather than a single closing print. That is not a refinement; it is what the exposure looks like. A refiner buying crude every day of the month is exposed to the average, and an option on a single day would hedge one day of it. Averaging also makes the payoff far less sensitive to a single print, which matters in markets where one thin session can produce a number nobody would trade at.',
          callout:
            'An average is less volatile than the thing being averaged, so an Asian option is cheaper than the equivalent European one. The discount is arithmetic, not a concession.',
        },
        {
          title: 'Options on what, exactly',
          content:
            'A commodity option can reference a futures contract, a swap, or an assessed physical price, and the three behave differently even at the same strike. An option on a future delivers a futures position with its own margin and its own expiry; an option on a swap delivers a cash-settled averaging contract; an option on an assessed price settles against a publication. The underlying also has a curve rather than a level, so an option struck on the December contract is not an option on the commodity — it is an option on that month.',
        },
        {
          title: 'Volatility with a season in it',
          content:
            'Commodity volatility is structured by the calendar in a way financial volatility is not. Weather-sensitive markets show recurring shape — implied volatility for winter delivery is systematically higher in gas and power — and expiries clustered around inventory reports or crop assessments carry event premium. A term structure that looks inverted is often not a signal at all, it is a season. Reading it as one is how a spread trade turns out to be a bet on the calendar.',
        },
      ],
      quiz: [
        {
          id: 'cmopt-d1',
          kind: 'boolean',
          step: 1,
          difficulty: 'intermediate',
          prompt:
            'The standard commodity option settles against an average price rather than a single print.',
          correctAnswer: true,
          explanation:
            'Which matches how a producer or consumer is actually exposed, day after day.',
        },
        {
          id: 'cmopt-d2',
          kind: 'choice',
          step: 1,
          difficulty: 'intermediate',
          prompt:
            'Why is an Asian option cheaper than the equivalent European one?',
          options: [
            'It has a shorter maturity',
            'An average is less volatile than the underlying being averaged',
            'It cannot be exercised early',
            'It is always out of the money',
          ],
          correctIndex: 1,
          explanation:
            'The discount is arithmetic rather than a concession by the seller.',
        },
        {
          id: 'cmopt-d3',
          kind: 'boolean',
          step: 1,
          difficulty: 'advanced',
          prompt:
            'Averaging makes the payoff less sensitive to a single unrepresentative print.',
          correctAnswer: true,
          explanation:
            'Which matters in markets where one thin session can produce a level nobody would trade at.',
        },
        {
          id: 'cmopt-d4',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What does an option on a futures contract deliver?',
          options: [
            'A futures position, with its own margin and expiry',
            'The physical commodity',
            'A cash-settled swap',
            'An assessed price settlement',
          ],
          correctIndex: 0,
          explanation:
            'Three different underlyings — future, swap and assessed price — behave differently at the same strike.',
        },
        {
          id: 'cmopt-d5',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'An option struck on the December contract is an option on the commodity generally.',
          correctAnswer: false,
          explanation:
            'It is an option on that month. The underlying has a curve, not a level.',
        },
        {
          id: 'cmopt-d6',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Why does it matter which of the three underlyings an option references?',
          options: [
            'They settle differently and carry different obligations on exercise',
            'They have different strike conventions only',
            'One of them cannot be hedged',
            'Only one of them is legal in most jurisdictions',
          ],
          correctIndex: 0,
          explanation:
            'Delivering a margined futures position is a different outcome from a cash settlement against a publication.',
        },
        {
          id: 'cmopt-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Implied volatility for winter delivery is systematically higher in gas and power.',
          correctAnswer: true,
          explanation:
            'Weather-sensitive demand produces recurring calendar shape rather than a signal.',
        },
        {
          id: 'cmopt-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A commodity volatility term structure looks inverted. What should be checked first?',
          options: [
            'Whether it is a seasonal pattern rather than a signal',
            'Whether the exchange has changed its margin',
            'Whether the options are American',
            'Whether the contract is cleared',
          ],
          correctIndex: 0,
          explanation:
            'Reading a season as a signal is how a spread trade becomes a bet on the calendar.',
        },
        {
          id: 'cmopt-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Expiries near inventory reports or crop assessments carry event premium.',
          correctAnswer: true,
          explanation:
            'A dated release moves the maturity that spans it, exactly as an election does in FX.',
        },
        {
          id: 'cmopt-d10',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Why does a refiner prefer an averaging option?',
          options: [
            'Because it buys crude throughout the month and is exposed to the average',
            'Because it is always in the money',
            'Because it avoids margin',
            'Because it can be exercised early',
          ],
          correctIndex: 0,
          explanation:
            'An option on a single day would hedge a single day of a continuous exposure.',
        },
        {
          id: 'cmopt-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'Commodity volatility has more calendar structure than most financial volatility.',
          correctAnswer: true,
          explanation:
            'Storage, weather and harvests all impose shape that repeats each year.',
        },
        {
          id: 'cmopt-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What is the practical consequence of the underlying having a curve?',
          options: [
            'Each expiry is effectively a different underlying',
            'Options cannot be compared across strikes',
            'Volatility is constant across maturities',
            'The option must be physically settled',
          ],
          correctIndex: 0,
          explanation:
            'Which is why a commodity option book is organised by contract month before it is organised by strike.',
        },
      ],
    },
  },
  {
    id: 'cmfwd',
    categoryId: 'commodity',
    name: 'Commodity Forward',
    hook: 'Agree a price today for delivery later',
    summary:
      'A commodity forward is a private agreement to buy or sell a specific quantity of a specific grade, at a specific place and time, for a price agreed now. It is the oldest derivative there is, and it is still the contract of choice for anyone whose problem is not just price but supply. Unlike a cash-settled swap, it ends with goods moving, which makes the grade, the delivery point and the delivery date as negotiated as the price itself.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A commodity forward is a bilateral agreement to buy or sell a set quantity of a commodity at an agreed price on a future date. Unlike a commodity swap, it usually contemplates delivery of the physical goods, so it settles a supply problem and a price problem in one contract.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Price, quantity, grade, delivery point and date are all negotiated between the two parties. No money changes hands at inception — the whole transaction happens at maturity, when the buyer pays the agreed price and takes delivery. The forward price itself is not a forecast: it starts from today’s spot price and adds the cost of holding the commodity until the delivery date.',
        callout:
          'Forward price is broadly spot plus storage and financing, less any convenience yield from holding the physical. That is why forward curves can sit above spot (contango) or below it (backwardation).',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It suits parties that genuinely want the physical commodity — a refiner securing crude, or a food producer locking in wheat — because it combines price certainty with guaranteed supply on terms an exchange-traded future cannot match. A cash-settled swap would fix the price but leave the buyer still hunting for barrels or tonnes.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Contract price, quantity, the grade or quality specification, the delivery point, the delivery date, and physical settlement at maturity. Each of these is priced: a tighter specification or a more convenient delivery point costs the buyer more.',
        callout:
          'Delivery terms follow standard trade shorthand — FOB, CIF, DAP — and they decide who pays freight and insurance, and at what point risk passes from seller to buyer.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'It is a firm obligation, so a buyer must take delivery even if demand has evaporated. Being bilateral and uncleared, it carries counterparty risk for the full term, and its bespoke terms make the position difficult to exit early — there is no liquid market in that exact contract, so unwinding usually means negotiating with the same counterparty.',
        callout:
          'Unlike an exchange-traded future, a bilateral forward has no daily settlement against a clearing house, so the whole gain or loss accumulates until delivery unless the parties have agreed to post collateral.',
      },
    ],
    keyTerms: [
      {
        term: 'Contract price',
        definition:
          'The price agreed today that the buyer will pay per unit on the delivery date.',
      },
      {
        term: 'Grade specification',
        definition:
          'The quality standard the delivered commodity must meet for the seller to have performed.',
      },
      {
        term: 'Delivery point',
        definition:
          'The named place where the goods change hands, which fixes who bears freight and where risk passes.',
      },
      {
        term: 'Delivery date',
        definition:
          'The agreed date, or window, on which payment is made and the commodity is handed over.',
      },
      {
        term: 'Physical settlement',
        definition:
          'Settlement by delivering the actual goods rather than paying a cash difference.',
      },
      {
        term: 'Cost of carry',
        definition:
          'The storage, insurance and financing cost of holding a commodity until delivery, which shapes the forward price.',
      },
    ],
    example: {
      title: 'A miller locks in wheat for March',
      lines: [
        'A flour miller needs 5,000 tonnes of milling wheat delivered to its mill in March.',
        'In October it agrees a forward with a grain merchant at £210.00 a tonne for March delivery.',
        'Nothing is paid in October — the contract simply sits until the delivery window opens.',
        'By March the spot price has risen to £235.00 a tonne, but the miller still pays 5,000 × £210 = £1,050,000.',
        'Buying the same wheat in the spot market would have cost 5,000 × £235 = £1,175,000, so the forward saved £125,000.',
      ],
      takeaway:
        'The forward fixed both the price and the supply. Note the obligation cuts both ways: had spot fallen to £190, the miller would still have paid £1,050,000, or £100,000 more than the market.',
    },
    inPractice:
      'Refiners buy crude forward to keep a plant fed at a known cost, millers and brewers buy grain forward so a year’s recipe costs are set before the season, and mining companies sell metal forward to bank the price behind a shipment already scheduled. The counterparty is typically a producer, a merchant trading house or a bank with a physical commodity arm.',
    relatedProductIds: ['cmswap', 'cmopt', 'fxfwd'],
    quiz: [
      {
        id: 'cmfwd-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A commodity forward typically contemplates physical delivery.',
        correctAnswer: true,
        explanation:
          'That physical settlement is what separates it from a cash-settled swap.',
      },
      {
        id: 'cmfwd-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What most clearly distinguishes a commodity forward from a swap?',
        options: [
          'The forward is exchange-traded while the swap is not',
          'The forward normally settles by delivering the goods; the swap settles in cash',
          'The forward has a floating leg while the swap has two fixed legs',
          'The forward requires a premium to be paid at inception',
        ],
        correctIndex: 1,
        explanation:
          'Both are bilateral OTC contracts. The forward ends in delivery; the swap only ever moves a cash difference.',
      },
      {
        id: 'cmfwd-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt: 'Money changes hands when a commodity forward is agreed.',
        correctAnswer: false,
        explanation:
          'No payment is made at inception — settlement happens at maturity, when the goods are delivered.',
      },
      {
        id: 'cmfwd-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Which of these is negotiated freely in a forward but standardised by the exchange in a future?',
        options: [
          'The market price of the commodity',
          'The direction of the trade',
          'The grade, delivery point and delivery date',
          'Whether the contract is legally binding',
        ],
        correctIndex: 2,
        explanation:
          'A future has fixed contract specifications. A forward lets both sides write the specification they actually need.',
      },
      {
        id: 'cmfwd-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Storage and financing costs rise while the spot price is unchanged. All else equal, what happens to the forward price?',
        options: [
          'It falls, because carrying the commodity is less attractive',
          'It rises, because the cost of carrying to the delivery date is higher',
          'It is unaffected, because it depends only on the spot price',
          'It converges to the spot price immediately',
        ],
        correctIndex: 1,
        explanation:
          'The forward price is broadly spot plus carry. Higher carry pushes the forward further above spot.',
      },
      {
        id: 'cmfwd-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A miller that genuinely needs wheat may prefer a forward to a cash-settled swap.',
        correctAnswer: true,
        explanation:
          'The swap fixes the price but delivers nothing. The forward fixes the price and secures the grain.',
      },
      {
        id: 'cmfwd-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A miller buys 5,000 tonnes forward at £210 a tonne. At delivery spot is £235. What does it pay under the contract?',
        options: ['£1,050,000', '£1,175,000', '£125,000', '£2,225,000'],
        correctIndex: 0,
        explanation:
          '5,000 × £210 = £1,050,000. The £125,000 difference from the spot cost is the benefit of having hedged.',
      },
      {
        id: 'cmfwd-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The delivery point is an administrative detail with no bearing on the contract price.',
        correctAnswer: false,
        explanation:
          'It decides who pays freight and insurance and where risk passes, so it is priced into the contract.',
      },
      {
        id: 'cmfwd-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does the grade specification in a forward do?',
        options: [
          'Sets the credit rating the counterparty must hold',
          'Defines the quality of commodity that will satisfy delivery',
          'Fixes the daily margin the buyer must post',
          'Determines the averaging convention for settlement',
        ],
        correctIndex: 1,
        explanation:
          'It is the quality standard. Goods outside the specification do not discharge the seller’s obligation.',
      },
      {
        id: 'cmfwd-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'A commodity forward lets the buyer walk away at maturity if prices move against them.',
        correctAnswer: false,
        explanation:
          'It is a firm obligation, not an option — both sides must perform whatever the market has done.',
      },
      {
        id: 'cmfwd-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Because a forward is bilateral and typically uncleared, each side carries the other’s credit risk until delivery.',
        correctAnswer: true,
        explanation:
          'There is no clearing house in between, so a counterparty default before delivery is the buyer’s or seller’s problem.',
      },
      {
        id: 'cmfwd-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why is a bespoke commodity forward hard to exit early?',
        options: [
          'Regulators prohibit terminating a physical contract before delivery',
          'There is no liquid market in those exact terms, so exit means negotiating with the same counterparty or offsetting imperfectly elsewhere',
          'The contract has no economic value until the delivery date',
          'An exchange must approve the transfer of any physical contract',
        ],
        correctIndex: 1,
        explanation:
          'Bespoke terms are the advantage and the trap: nobody else has an identical contract to trade against.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'The theory of storage',
          content:
            'A forward price for a storable commodity should equal spot plus the cost of carrying it — financing, storage, insurance — less the benefit of actually having it to hand. That last term is the convenience yield, and it is what makes commodities different from financial assets: a refinery with no crude cannot run, so physical possession has a value that a bond does not offer. When inventories are tight, convenience yield rises and can exceed the cost of carry, which is what puts the market into backwardation.',
          callout:
            'Convenience yield is not observable. It is the residual that makes the arithmetic balance, which is a polite way of saying it absorbs everything the model left out.',
        },
        {
          title: 'Roll yield, and why it dominates returns',
          content:
            'Nobody holding a futures position for the long term takes delivery: they sell the expiring contract and buy the next one. In backwardation that roll buys lower and earns; in contango it buys higher and costs. Over years, that accumulated roll can exceed the change in the spot price entirely — a commodity index can lose money in a market where the commodity itself has risen. Anyone quoting a commodity return without saying whether it is spot or rolled is quoting the wrong number.',
        },
        {
          title: 'Delivery, and the options inside it',
          content:
            'A physically settled contract gives the seller choices: which grade to deliver within the permitted specification, from which location, on which day of the delivery window. Every one of those is an option held by the short, and options held by someone else are worth something to them and cost something to you. That is why a physical forward’s price is not simply the financial forward plus a spread, and why the last days before expiry in a delivery-settled market are where the sharpest disagreements happen.',
          callout:
            'The cheapest-to-deliver logic that governs bond futures is the same idea. The seller delivers what suits the seller, and the price accounts for that in advance.',
        },
      ],
      quiz: [
        {
          id: 'cmfwd-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What should a forward price equal for a storable commodity?',
          options: [
            'Spot plus the cost of carry, less the convenience yield',
            'The market’s forecast of the future spot price',
            'Spot plus expected inflation',
            'The average of the last year’s prices',
          ],
          correctIndex: 0,
          explanation:
            'Financing, storage and insurance on one side, and the value of having the physical to hand on the other.',
        },
        {
          id: 'cmfwd-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Convenience yield is directly observable in the market.',
          correctAnswer: false,
          explanation:
            'It is the residual that makes the arithmetic balance, and it absorbs whatever the model left out.',
        },
        {
          id: 'cmfwd-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What puts a market into backwardation?',
          options: [
            'Convenience yield exceeding the cost of carry, typically when inventories are tight',
            'High interest rates',
            'Abundant storage capacity',
            'A weak currency',
          ],
          correctIndex: 0,
          explanation:
            'Having the physical now is worth more than the cost of holding it, so nearby prices exceed distant ones.',
        },
        {
          id: 'cmfwd-d4',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'A refinery with no crude cannot run, which is why physical possession carries a value a financial asset does not.',
          correctAnswer: true,
          explanation: 'That value is exactly what convenience yield describes.',
        },
        {
          id: 'cmfwd-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What is roll yield?',
          options: [
            'The interest earned on posted margin',
            'The gain or loss from replacing an expiring contract with a later one',
            'The dividend equivalent on a commodity',
            'The storage cost charged by a warehouse',
          ],
          correctIndex: 1,
          explanation:
            'Earned in backwardation, paid in contango, and accumulated at every roll.',
        },
        {
          id: 'cmfwd-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A commodity index can lose money over a period in which the commodity itself rose.',
          correctAnswer: true,
          explanation:
            'Sustained contango means every roll costs, and over years that can exceed the spot move.',
        },
        {
          id: 'cmfwd-d7',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Someone quotes "the return on oil" over five years. What is missing?',
          options: [
            'The currency of quotation',
            'The grade referenced',
            'Whether it is a spot return or a rolled futures return',
            'The exchange used',
          ],
          correctIndex: 2,
          explanation:
            'The two can differ by more than the entire price move, which makes the distinction the whole answer.',
        },
        {
          id: 'cmfwd-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'In a physically settled contract, the seller chooses the grade, location and day within the permitted terms.',
          correctAnswer: true,
          explanation: 'Every one of those choices is an option held by the short.',
        },
        {
          id: 'cmfwd-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What follows from the seller holding those delivery choices?',
          options: [
            'The buyer pays for them in the price',
            'The contract is worth more to the buyer',
            'Delivery becomes optional for both parties',
            'The contract cannot be cleared',
          ],
          correctIndex: 0,
          explanation:
            'Options held by someone else cost you something, which is why a physical forward is not the financial one plus a spread.',
        },
        {
          id: 'cmfwd-d10',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The cheapest-to-deliver logic in bond futures is the same idea as the delivery options here.',
          correctAnswer: true,
          explanation:
            'The seller delivers what suits the seller, and the price accounts for it in advance.',
        },
        {
          id: 'cmfwd-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'The days before expiry in a delivery-settled market are where disagreements concentrate.',
          correctAnswer: true,
          explanation:
            'Everything the delivery options were worth becomes concrete in that window.',
        },
        {
          id: 'cmfwd-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Why do commodities behave differently from financial assets in the forward market?',
          options: [
            'Because they are more volatile',
            'Because they are quoted in dollars',
            'Because they cannot be shorted',
            'Because physical possession has a use value that a security does not',
          ],
          correctIndex: 3,
          explanation:
            'Everything else in the theory of storage follows from that one difference.',
        },
      ],
    },
  },
  {
    id: 'crackspread',
    categoryId: 'commodity',
    name: 'Crack Spread Swap',
    hook: 'Hedge the margin between crude and its products',
    summary:
      'A refiner does not really trade oil — it buys crude, converts it and sells products, and lives on the difference. That difference is the crack spread, and it can be squeezed even when the outright oil price is flat. A crack spread swap fixes the spread rather than either price on its own, which is why it is the hedge that matches how a refinery actually earns money.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A refiner’s profit comes from the gap between the crude oil it buys and the refined products it sells — the crack spread. A crack spread swap fixes that margin rather than either price on its own. Because a refiner is short crude and long products, it is naturally long the spread: it gains when the spread widens and suffers when it narrows, so hedging means selling the spread.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The swap settles on the difference between product prices and crude. The most common structure is 3-2-1: three barrels of crude against two of gasoline and one of distillate, roughly matching a typical refinery’s output mix. The spread is expressed per barrel of crude, so the three-barrel bundle is divided by three to give a single figure the two sides can trade.',
        callout:
          'One barrel is 42 US gallons, and NYMEX gasoline and distillate futures are quoted in dollars per gallon. A 10-cent move in gasoline is $4.20 a barrel.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Hedging crude and products separately takes two trades and two bid-offer spreads, and any mismatch in volume or timing between the legs leaves the margin exposed. A single crack spread swap hedges the economics the refiner actually cares about, in one transaction, at one quoted spread — and it needs no view at all on where oil is heading.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The crack spread itself, the 3-2-1 ratio, the reference price index for each leg, the settlement period, and the notional expressed in barrels of crude. The product volumes follow from the ratio: 300,000 barrels of crude implies 200,000 of gasoline and 100,000 of distillate.',
        callout:
          '3-2-1 is the common shorthand, but 5-3-2 is used where the yield is more distillate-heavy, and a single crack trades one product against crude one-for-one.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The standard ratio rarely matches a specific refinery’s real yield, leaving residual exposure. Fixing the margin also forgoes the gains when spreads widen, and each leg carries its own basis risk against the grades actually processed — a plant running a heavier, sourer crude than the index will not see its own margin track the swap exactly.',
        callout:
          'The crack spread is a gross margin. It says nothing about the energy a refinery burns, its labour, or a maintenance turnaround that can take a unit offline for weeks.',
      },
    ],
    keyTerms: [
      {
        term: 'Crack spread',
        definition:
          'The difference between the value of refined products and the cost of the crude used to make them.',
      },
      {
        term: '3-2-1 ratio',
        definition:
          'The standard bundle of three barrels of crude against two of gasoline and one of distillate.',
      },
      {
        term: 'Distillate',
        definition:
          'The middle-distillate product group covering diesel and heating oil, the third leg of the 3-2-1.',
      },
      {
        term: 'Reference index',
        definition:
          'The published price each leg settles against, one for crude and one for each refined product.',
      },
      {
        term: 'Settlement period',
        definition:
          'The month or other window over which each leg’s index is observed and the spread is calculated.',
      },
      {
        term: 'Quality basis',
        definition:
          'The gap between the index grade and the crude or products a particular refinery actually handles.',
      },
    ],
    example: {
      title: 'A refiner fixes a 3-2-1 margin',
      lines: [
        'Crude is $80.00, gasoline $101.00 and distillate $104.00, all per barrel.',
        'Three barrels of crude cost $240.00 and yield 2 × $101 + 1 × $104 = $306.00 of product.',
        'The bundle margin is $66.00 over three barrels, so the 3-2-1 crack spread is $22.00 a barrel.',
        'The refiner sells the spread at $22.00 on 300,000 barrels of crude a month, receiving fixed and paying floating.',
        'By settlement crude is $86, gasoline $101 and distillate $104, so the spread is (202 + 104 − 258) ÷ 3 = $16.00.',
        'Its physical margin falls to 300,000 × $16 = $4,800,000, but the swap pays 300,000 × $6 = $1,800,000.',
      ],
      takeaway:
        'Total margin is $4,800,000 + $1,800,000 = $6,600,000, or the $22.00 a barrel the refiner fixed. The crude price rose by $6 and the swap gave that back — but had the spread widened instead, the refiner would have paid the difference away.',
    },
    inPractice:
      'Independent refiners without an integrated crude supply use crack spread swaps to protect the margin a lender or a board has been promised, particularly before a maintenance turnaround when volumes are known. Trading houses and bank commodity desks quote the spread and warehouse the risk, often laying it off in the listed crack futures at NYMEX or ICE.',
    relatedProductIds: ['cmswap', 'cmopt', 'eqswap'],
    quiz: [
      {
        id: 'crackspread-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A refiner is naturally long the crack spread.',
        correctAnswer: true,
        explanation:
          'It buys crude and sells products, so it profits when the gap between them widens.',
      },
      {
        id: 'crackspread-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does the crack spread measure?',
        options: [
          'The absolute price level of crude oil',
          'The gap between the cost of crude and the value of the products made from it',
          'The cost of transporting crude from the field to the refinery',
          'The price difference between two grades of crude oil',
        ],
        correctIndex: 1,
        explanation:
          'It is the refining margin. The outright price of oil can move a long way without changing it.',
      },
      {
        id: 'crackspread-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'A refiner hedges its margin by buying the crack spread.',
        correctAnswer: false,
        explanation:
          'It is already long the spread through its physical business, so the hedge is to sell it.',
      },
      {
        id: 'crackspread-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What does the 3-2-1 structure refer to?',
        options: [
          'Three barrels of crude against two of gasoline and one of distillate',
          'Three barrels of gasoline against two of crude and one of distillate',
          'A three-month, two-week, one-day settlement lag',
          'Three refineries pooling two crude grades into one index',
        ],
        correctIndex: 0,
        explanation:
          'Three in, two gasoline and one distillate out — an approximation of a typical refinery’s yield.',
      },
      {
        id: 'crackspread-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Crude is $80, gasoline $101 and distillate $104 per barrel. What is the 3-2-1 crack spread per barrel?',
        options: [
          '$66.00 a barrel',
          '$25.00 a barrel',
          '$22.00 a barrel',
          '$11.00 a barrel',
        ],
        correctIndex: 2,
        explanation:
          'Products are 2 × 101 + 104 = $306, crude is 3 × 80 = $240, and the $66 bundle margin over three barrels is $22.',
      },
      {
        id: 'crackspread-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A gasoline price quoted in dollars per gallon must be multiplied by 42 before it can be compared with crude in dollars per barrel.',
        correctAnswer: true,
        explanation:
          'A barrel is 42 US gallons, so a 10-cent per gallon move is $4.20 a barrel.',
      },
      {
        id: 'crackspread-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A refiner that has fixed the crack spread still captures the full gain if margins widen.',
        correctAnswer: false,
        explanation:
          'Fixing the margin gives up that upside, just as it protects against a squeeze. The swap works both ways.',
      },
      {
        id: 'crackspread-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'What is the main drawback of hedging crude and products with two separate outright swaps?',
        options: [
          'Refined products cannot be hedged with a swap at all',
          'It costs two bid-offer spreads, and any mismatch in volume or timing leaves the margin exposed',
          'It eliminates the refiner’s exposure to the absolute level of oil prices',
          'It obliges the refiner to take physical delivery on both legs',
        ],
        correctIndex: 1,
        explanation:
          'Two trades can replicate the margin hedge only if the volumes and dates line up exactly. The spread swap does it in one.',
      },
      {
        id: 'crackspread-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'How is the notional of a crack spread swap normally expressed?',
        options: [
          'As a dollar amount of margin to be protected',
          'As the number of refineries the hedge covers',
          'As a volume of crude in barrels',
          'As the number of gallons of gasoline expected to be sold',
        ],
        correctIndex: 2,
        explanation:
          'The spread is quoted per barrel of crude, so the notional is a crude volume and the product legs follow from the ratio.',
      },
      {
        id: 'crackspread-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'In a 3-2-1 structure, 300,000 barrels of crude corresponds to 150,000 barrels of gasoline and 150,000 of distillate.',
        correctAnswer: false,
        explanation:
          'The product split is two to one, so it is 200,000 barrels of gasoline and 100,000 of distillate.',
      },
      {
        id: 'crackspread-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The crack spread is a gross margin and takes no account of a refinery’s energy, labour and maintenance costs.',
        correctAnswer: true,
        explanation:
          'A positive crack spread is not the same as a profitable refinery. Operating costs sit below it.',
      },
      {
        id: 'crackspread-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A refiner runs a heavier, sourer crude than the grade in the swap’s index. What does that create?',
        options: [
          'A quality basis risk between the index crude and the barrels actually processed',
          'A credit exposure to the agency that publishes the index',
          'An obligation to deliver physical crude at settlement',
          'A currency mismatch between the crude and product legs',
        ],
        correctIndex: 0,
        explanation:
          'The hedge tracks the index grade. A different crude slate means the plant’s own margin can drift away from it.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Why three, two and one',
          content:
            'The conventional refining hedge buys three barrels of crude against two of gasoline and one of distillate, because that ratio approximates what a typical refinery actually yields. It is a convention rather than a fact: a refinery configured for heavier crude or maximum distillate has a different yield, and hedging its economics with the standard ratio leaves a residual proportional to how far its configuration sits from the average. The right ratio is the refinery’s own, and the standard one is what the market quotes.',
          callout:
            'Barrels of crude in, barrels of product out — the ratio is a physical statement about a plant, dressed as a trading convention.',
        },
        {
          title: 'The spread has a time dimension',
          content:
            'Crude is bought before it is refined and products are sold after, so the two legs of the economics do not occur at the same moment. A refiner hedging with same-month contracts on both legs has hedged a spread it does not have — the real exposure is this month’s crude against next month’s products. That timing mismatch is small in a stable market and material when the curve moves, and it is the reason refining hedges are structured across months rather than within one.',
        },
        {
          title: 'What the spread does not cover',
          content:
            'A refinery’s margin is the spread less everything it costs to run: energy, catalysts, maintenance, and the price of the compliance obligations that come with operating. Those costs move, and they are not in the hedge. Nor is the biggest operational risk — an unplanned outage, when the refinery is short products it has sold forward and no longer processing the crude it bought. That is the moment a paper hedge and a physical business come apart, and it is why a spread position is sized against expected throughput rather than nameplate capacity.',
        },
      ],
      quiz: [
        {
          id: 'crackspread-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'foundational',
          prompt: 'What does the conventional 3-2-1 ratio represent?',
          options: [
            'Three months of crude against two of products',
            'A three-to-one leverage ratio',
            'Three grades of crude blended in fixed proportions',
            'Three barrels of crude against two of gasoline and one of distillate',
          ],
          correctIndex: 3,
          explanation:
            'It approximates a typical refinery yield, which makes it a physical statement dressed as a convention.',
        },
        {
          id: 'crackspread-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'The standard ratio is the right hedge ratio for every refinery.',
          correctAnswer: false,
          explanation:
            'The right ratio is the refinery’s own yield. The standard one is what the market happens to quote.',
        },
        {
          id: 'crackspread-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A refinery configured for maximum distillate hedges with the standard ratio. What is left?',
          options: [
            'Only the timing difference',
            'A position in crude alone',
            'A residual proportional to how far its yield differs from the convention',
            'Nothing, since the ratio is standardised',
          ],
          correctIndex: 2,
          explanation:
            'The convention hedges the average plant, and no plant is the average one.',
        },
        {
          id: 'crackspread-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Crude is purchased before the products made from it are sold.',
          correctAnswer: true,
          explanation:
            'So the two legs of the economics do not occur in the same month, and a same-month hedge misses that.',
        },
        {
          id: 'crackspread-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does a refiner actually need to hedge, in timing terms?',
          options: [
            'The annual average of both',
            'This month’s crude against next month’s products',
            'Both legs in the same month',
            'Products only, since crude is bought at spot',
          ],
          correctIndex: 1,
          explanation:
            'Hedging both legs in one month hedges a spread the business does not have.',
        },
        {
          id: 'crackspread-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt: 'The timing mismatch matters most when the forward curve moves.',
          correctAnswer: true,
          explanation:
            'In a stable curve it is small; when the shape changes it is the whole difference.',
        },
        {
          id: 'crackspread-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is not covered by a crack spread hedge?',
          options: [
            'Energy, catalysts, maintenance and compliance costs',
            'The price of crude',
            'The price of gasoline',
            'The price of distillate',
          ],
          correctIndex: 0,
          explanation:
            'The spread hedges the revenue-less-feedstock line, not the cost of running the plant.',
        },
        {
          id: 'crackspread-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'An unplanned outage leaves a hedged refiner short products it has sold forward.',
          correctAnswer: true,
          explanation:
            'And no longer processing the crude it bought — the moment a paper hedge and a physical business come apart.',
        },
        {
          id: 'crackspread-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Why size a spread position against expected throughput?',
          options: [
            'Because exchanges limit position size',
            'Because products are quoted per tonne',
            'Because crude is bought monthly',
            'Because nameplate capacity assumes the plant never stops',
          ],
          correctIndex: 3,
          explanation:
            'Hedging capacity you do not actually run turns an outage into a speculative short.',
        },
        {
          id: 'crackspread-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'A refinery’s margin equals the crack spread.',
          correctAnswer: false,
          explanation:
            'It is the spread less operating costs, which move independently and are not in the hedge.',
        },
        {
          id: 'crackspread-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'What makes the crack spread a useful instrument despite its imperfections?',
          options: [
            'It guarantees a minimum margin',
            'It is physically settled',
            'It hedges the largest and most volatile part of a refiner’s economics',
            'It removes operational risk',
          ],
          correctIndex: 2,
          explanation:
            'Covering most of the volatility is the realistic aim; covering all of it is not on offer.',
        },
        {
          id: 'crackspread-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'The ratio in a crack spread is a statement about physical refining yields.',
          correctAnswer: true,
          explanation:
            'Which is why a plant with a different configuration needs a different ratio.',
        },
      ],
    },
  },
  {
    id: 'weather',
    categoryId: 'commodity',
    name: 'Weather Swap',
    hook: 'A payout driven by temperature, not price',
    summary:
      'A weather swap settles against the weather itself — a count of heating or cooling degree days accumulated at a named weather station over a season, compared with an agreed strike. There is nothing to buy, sell short, store or deliver, so no cost of carry links its price to anything and no portfolio replicates its payout. It exists because a great deal of commercial risk is about how much you sell rather than what you sell it for: a mild winter costs a gas utility volume, not price, and nothing else in this catalogue addresses that.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A weather swap pays against a measured weather index rather than a price. For temperature the index is a count of degree days — a running total of how far the daily average temperature at one named station sits below a base temperature (heating degree days) or above it (cooling degree days), added up across a month or a season. Nothing underlies it in the usual sense: temperature cannot be bought, sold short, stored or delivered, so the contract is simply an agreement to exchange cash on a number the weather will produce.',
        callout:
          'In the United States the base is 65°F and the day’s average is the midpoint of its high and low, so a day averaging 40°F contributes 25 heating degree days and a day averaging 70°F contributes none. European contracts commonly use an 18°C base.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The two sides agree a strike in degree days, a tick value in currency per degree day, and which way round they sit. At the end of the accumulation period the index is compared with the strike and the difference is multiplied by the tick, so a swap struck at 3,800 that settles at 3,460 pays 340 ticks to whichever side was protected against mild weather. Almost every contract carries a cap on the total payout, which means both sides know their worst case on the day they trade. The same index is also traded in option form, where only one side can ever be paid and a premium is paid up front.',
        callout:
          'Contracts name the station, the meteorological service that publishes the data and often a settlement agent that calculates the index. Because observations are sometimes corrected weeks after publication, the terms have to say whether the original or the restated figure governs, and which back-up station applies if the named one stops reporting.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'An energy utility’s problem in a mild winter is not that gas is cheap. It is that it sells less of it — the customers are still there, but the boilers run for fewer hours, and margin on volume never burned cannot be recovered. That is volumetric risk: quantity rather than price. A hedge on the gas price does nothing about it and can make the picture worse, because mild weather tends to depress the price as well, so a firm hedged only on price watches both halves of its margin fall together. The same shape appears outside energy, in a brewer’s cool summer or a ski operator’s warm January. A weather swap sits close to insurance, with one difference that matters: the payout is triggered by the index alone, with no claim to file and no damage to prove — which is also why the payout may not match the loss.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Five things define the contract — the reference station, the accumulation period, the degree day index, the strike and the tick value that turns each degree day into money — with a payout cap to bound it. None of them follows from an arbitrage. There is no tradable portfolio that reproduces the payout, so the replication argument that prices a forward or a swap is simply unavailable here, and what sets the price instead is a distribution: the seller forms a view of the mean and spread of the index at that station and charges the expected payout plus a margin for risk it cannot hedge away.',
        callout:
          'Pricing usually starts with a burn analysis — replaying the proposed contract over twenty to forty years of cleaned station history and averaging what it would have paid. The series is detrended first for warming and urban growth, which for a winter contract normally pulls the expected index below the raw historical mean.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The cover is only ever a proxy. The station is not the service area and degree days are not demand: wind, humidity, the timing of a cold snap and the customers gained or lost since the tick value was estimated all drive a wedge between the payout and the actual loss. The cap means a genuinely extreme season is only partly covered. The contract also does nothing about price, so a firm that has hedged volume still needs a separate hedge for what it pays. Liquidity is thin outside the standard city indices and seasons, with few dealers quoting, so a position is usually carried to settlement rather than traded out.',
      },
    ],
    keyTerms: [
      {
        term: 'Heating degree day',
        definition:
          'One unit for each degree the day’s average temperature falls below the base, and none at all for a day above it.',
      },
      {
        term: 'Cooling degree day',
        definition:
          'The mirror image, counting degrees above the base, used for contracts written on summer cooling demand.',
      },
      {
        term: 'Reference station',
        definition:
          'The named weather station whose published observations settle the contract, standing in for a whole region.',
      },
      {
        term: 'Tick value',
        definition:
          'The cash amount attached to each degree day of difference between the settlement index and the strike.',
      },
      {
        term: 'Payout cap',
        definition:
          'The agreed limit on the total either side can be asked to pay, fixed when the contract is written.',
      },
      {
        term: 'Volumetric risk',
        definition:
          'Exposure to how much you sell rather than the price you sell it for, which a price hedge leaves untouched.',
      },
    ],
    example: {
      title: 'A gas utility hedges a mild winter',
      lines: [
        'A gas utility budgets on a normal winter of 3,800 heating degree days at the station named in its contract.',
        'Its own records show it sells about 50,000 therms for each degree day at a delivery margin of $0.30 a therm — roughly $15,000 of margin per degree day.',
        'It buys a winter swap struck at 3,800 with a tick of $15,000 a degree day, capped at $9,000,000.',
        'The winter is mild and the station accumulates 3,460 degree days, 340 below the strike.',
        'Volumes fall by 340 × 50,000 = 17,000,000 therms, costing 17,000,000 × $0.30 = $5,100,000 of margin.',
        'The swap pays 340 × $15,000 = $5,100,000, comfortably inside the cap.',
      ],
      takeaway:
        'Not one line of that arithmetic involved the price of gas. The utility’s loss was quantity, and the only contract that could refund it was one written on the temperature. Had the winter been cold the utility would have sold more gas and paid the swap instead, up to the $9,000,000 cap — 600 degree days at $15,000 — which is the most either side can lose.',
    },
    inPractice:
      'Gas and power utilities and energy retailers are the natural buyers, hedging the volume they will sell rather than the price they will pay, while brewers, agricultural processors, ski operators and event promoters buy smaller and more bespoke structures. Reinsurers, specialist weather funds and a few energy trading houses take the other side, precisely because temperature risk has almost no correlation with equity or credit markets. The market began in the US power sector in the late 1990s, and although the CME lists standardised heating and cooling degree day futures on a set of cities, most weather risk still changes hands over-the-counter in bespoke periods and sizes.',
    relatedProductIds: ['cmswap', 'swing', 'varswap'],
    quiz: [
      {
        id: 'weather-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A weather swap settles against the price of energy over the contract period.',
        correctAnswer: false,
        explanation:
          'It settles against a measured weather index — degree days at a named station. No price enters the calculation.',
      },
      {
        id: 'weather-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does a winter weather swap settle against?',
        options: [
          'The price of natural gas averaged over the winter',
          'The volume of gas the hedger actually sold',
          'Heating degree days accumulated at a named weather station',
          'The average of the forecasts published before the winter began',
        ],
        correctIndex: 2,
        explanation:
          'The index is measured temperature at one station. What the hedger sold, and at what price, has no bearing on the payout.',
      },
      {
        id: 'weather-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A day whose average temperature is above the base contributes no heating degree days.',
        correctAnswer: true,
        explanation:
          'Heating degree days count only the shortfall below the base. A warm day adds zero rather than a negative number.',
      },
      {
        id: 'weather-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A swap struck at 3,800 degree days with a tick of $15,000 settles at 3,460. What does the side protected against mild weather receive?',
        options: [
          '$340,000',
          '$5,100,000',
          '$51,900,000',
          'Nothing — the index finished below the strike',
        ],
        correctIndex: 1,
        explanation:
          'The index is 340 degree days below the strike, and 340 × $15,000 = $5,100,000. Only the difference from the strike is ticked, not the whole index.',
      },
      {
        id: 'weather-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A weather swap normally carries a cap on the total that can be paid out.',
        correctAnswer: true,
        explanation:
          'Almost every contract is capped, so both sides know their worst case on the day they trade.',
      },
      {
        id: 'weather-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A mild winter hurts a gas utility mainly because it sells fewer units, not because gas is cheap.',
        correctAnswer: true,
        explanation:
          'The customers are still there, but they burn less. That lost margin on volume is what the swap refunds.',
      },
      {
        id: 'weather-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Which exposure does a weather swap address that a commodity price swap cannot?',
        options: [
          'The credit risk of the utility’s gas supplier',
          'The cost of the gas the utility buys from producers',
          'The basis between two delivery hubs',
          'The quantity the utility sells when the weather is mild',
        ],
        correctIndex: 3,
        explanation:
          'A price swap fixes what a unit costs. It says nothing about how many units the weather lets you sell.',
      },
      {
        id: 'weather-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Hedging the gas price protects a utility against the effect of a mild winter.',
        correctAnswer: false,
        explanation:
          'It leaves volumetric risk untouched, and mild weather tends to depress the price too, so both halves of the margin can fall together.',
      },
      {
        id: 'weather-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does the tick value do in a weather swap?',
        options: [
          'Converts each degree day of difference from the strike into cash',
          'Sets the base temperature from which degree days are counted',
          'Limits the total the seller can be asked to pay',
          'Fixes the price of the energy the hedger buys',
        ],
        correctIndex: 0,
        explanation:
          'The base temperature defines the index and the cap bounds the payout; the tick is what turns degree days into money.',
      },
      {
        id: 'weather-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'Because temperature cannot be bought, stored or sold short, a weather swap cannot be priced by a replication or cost-of-carry argument.',
        correctAnswer: true,
        explanation:
          'There is no hedging portfolio to cost, so the price is an actuarial view of the index distribution plus a margin for unhedgeable risk.',
      },
      {
        id: 'weather-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A utility hedges with a swap on a single airport station. What exposure remains?',
        options: [
          'None, because the payout follows the index rather than a proven loss',
          'Basis risk: the station may not represent the whole service area, and degree days are only a proxy for demand',
          'The risk that the counterparty demands physical delivery of gas',
          'Cost-of-carry risk, because the index has to be financed until settlement',
        ],
        correctIndex: 1,
        explanation:
          'Paying on an index rather than a proven loss is what creates the gap: the weather at one station, and the demand it stands for, can diverge.',
      },
      {
        id: 'weather-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A utility that has bought a weather swap no longer needs to hedge the price of the gas it buys.',
        correctAnswer: false,
        explanation:
          'The swap covers volume only. Price risk is a separate exposure and needs a separate hedge.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Degree days, and how they are counted',
          content:
            'The standard underlying is a degree day: for each day, the difference between a base temperature and the day’s average, counted only when it falls the right side of the base. Heating degree days accumulate when the day is colder than the base, cooling degree days when it is warmer, and the contract settles on the sum over a season. Everything hangs on the definitions — which base temperature, which station, how the daily average is computed, and what happens when the station reports nothing.',
          callout:
            'The measurement is deliberately mechanical. A contract that settled on "a cold winter" would be unsettleable; one that settles on a published station’s arithmetic is not.',
        },
        {
          title: 'Station basis',
          content:
            'Contracts reference a specific weather station, and a business is exposed to the weather where its customers are. Those differ. A utility serving a region hedged on a single airport station carries the difference between that station and its actual service area, which is small most years and largest in the unusual weather the hedge was bought for. Multi-station structures exist and cost more, and the choice between them is the same trade-off as every basis decision in this app: liquidity against precision.',
        },
        {
          title: 'Pricing from history, not from a model of the sky',
          content:
            'Weather derivatives are priced mainly by burn analysis: apply the contract’s terms to the last few decades of recorded temperatures and read off the distribution of outcomes. It is an actuarial approach rather than a no-arbitrage one, because there is no underlying to hold and no replication available — you cannot buy a cold winter and store it. That makes the choice of history the pricing decision: how many years, whether to detrend for a warming climate, and how much weight to give the recent past.',
          callout:
            'No replication means no arbitrage bound. The price is whatever the two sides agree the distribution is worth, which puts the historical window at the centre of the negotiation.',
        },
      ],
      quiz: [
        {
          id: 'weather-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'foundational',
          prompt: 'What does a heating degree day measure?',
          options: [
            'The number of hours below freezing',
            'The energy consumed by heating that day',
            'The difference between the day’s high and low',
            'How much colder than a base temperature the day’s average was',
          ],
          correctIndex: 3,
          explanation:
            'Counted only in that direction, and summed over the season to settle the contract.',
        },
        {
          id: 'weather-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'The contract specifies the station, the base temperature and how the daily average is computed.',
          correctAnswer: true,
          explanation:
            'A contract on "a cold winter" would be unsettleable; one on a published station’s arithmetic is not.',
        },
        {
          id: 'weather-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'When do cooling degree days accumulate?',
          options: [
            'Only in summer months',
            'When the station reports no data',
            'When the day’s average is above the base temperature',
            'When the day’s average is below the base temperature',
          ],
          correctIndex: 2,
          explanation:
            'The mirror of heating degree days, counted from the other side of the same base.',
        },
        {
          id: 'weather-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'A utility hedged on one airport station is fully hedged for its whole service area.',
          correctAnswer: false,
          explanation:
            'Station basis is the difference, and it is largest in the unusual weather the hedge was bought for.',
        },
        {
          id: 'weather-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What is the trade-off in choosing a multi-station structure?',
          options: [
            'Better tax treatment, with more documentation',
            'More precision, at a higher cost and with less liquidity',
            'Lower cost, with more basis',
            'Faster settlement, with more credit risk',
          ],
          correctIndex: 1,
          explanation:
            'The same trade-off as every basis decision: liquidity against how closely the hedge fits.',
        },
        {
          id: 'weather-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Station basis matters least in an ordinary year and most in an extreme one.',
          correctAnswer: true,
          explanation:
            'Which is the general shape of basis risk, and the reason it is so easy to under-price.',
        },
        {
          id: 'weather-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is burn analysis?',
          options: [
            'Applying the contract’s terms to decades of recorded temperatures to build a distribution',
            'Modelling the atmosphere to forecast the season',
            'Pricing from the implied volatility of energy options',
            'Averaging the last three years of settlements',
          ],
          correctIndex: 0,
          explanation:
            'Actuarial rather than no-arbitrage, because there is nothing to hold and nothing to replicate.',
        },
        {
          id: 'weather-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt: 'A weather derivative can be hedged by holding the underlying.',
          correctAnswer: false,
          explanation:
            'You cannot buy a cold winter and store it, which is why there is no arbitrage bound on the price.',
        },
        {
          id: 'weather-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What becomes the central pricing decision as a result?',
          options: [
            'The choice of discount curve',
            'The counterparty’s credit rating',
            'The settlement currency',
            'The choice of historical window, and whether to detrend it',
          ],
          correctIndex: 3,
          explanation:
            'How many years, how to treat a warming trend, and how much weight the recent past deserves.',
        },
        {
          id: 'weather-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Two counterparties can price the same contract very differently without either being wrong.',
          correctAnswer: true,
          explanation:
            'With no replication there is no arbitrage bound, so the historical assumption is the price.',
        },
        {
          id: 'weather-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why is the measurement defined so mechanically?',
          options: [
            'Because regulators specify the formula',
            'To allow physical delivery',
            'So that settlement is unambiguous and cannot be argued about',
            'To reduce the cost of the contract',
          ],
          correctIndex: 2,
          explanation:
            'The whole instrument depends on both sides agreeing what happened, without a negotiation.',
        },
        {
          id: 'weather-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'The contract needs a rule for what happens if the station reports no data.',
          correctAnswer: true,
          explanation:
            'Exactly like a fixing fallback: a missing observation must not leave the payoff undefined.',
        },
      ],
    },
  },
  {
    id: 'swing',
    categoryId: 'commodity',
    name: 'Swing Option',
    hook: 'The right to choose how much you take',
    summary:
      'Every option so far has been a right to transact a fixed amount: the buyer chooses whether to deal, and the strike fixes the price. A swing option turns that around. The price is agreed at the outset and the quantity is what gets chosen, day by day, between a daily minimum and maximum and within overall limits for the year. Those overall limits are the whole lesson — the daily rights share one budget, so flexibility spent today is gone tomorrow, and the annual minimum is not a right at all but an obligation to pay.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A swing option — the market usually says swing contract, or take-or-pay contract — gives its buyer the right to vary how much it takes each day at a price fixed in advance. Everywhere else in this catalogue an option is a right to transact a set amount, with the strike deciding the price. Here the price is settled first and the quantity is the thing being chosen, within a minimum and a maximum on each day and further totals across the contract year. It is the standard shape of long-term gas supply in Europe, and the same structure runs through power supply contracts.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Each day the buyer nominates a volume, by a deadline set in the contract, between a daily minimum and a daily maximum. Two more limits apply across the year: a total it must take at least, and a total it may not exceed. The annual maximum is what makes this hard. Without it the contract would be a strip of independent daily options, each exercised on its own merits; with it, the daily rights compete for one allowance, and taking the maximum on a mild November day can mean giving up a far more valuable January one. The buyer’s real question is therefore not whether today’s payoff is positive but whether it beats the continuation value of the flexibility that using it would consume.',
        callout:
          'That structure has no closed-form price. A swing contract is worth at least its intrinsic value — the best schedule available on today’s forward curve — and at most the strip of independent daily options it would be if the annual limits never bound. Desks value the gap between the two by dynamic programming or least-squares Monte Carlo.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'The buyer’s demand is not a choice, it is the weather. A supplier serving households cannot know in August how much gas its customers will burn on 14 January, and a fixed strip of forwards would leave it short on the coldest days and long on the mildest. The cold miss is the expensive one: demand peaks exactly when the spot price does, so the volume it has to buy in the market is the volume it buys at the worst price. A swing contract hands that flexibility to the buyer. The seller — a producer that can turn a field up and down, a storage operator, or a portfolio trader who can net one buyer’s cold day against another’s mild one — is being paid to absorb it, and that payment is usually built into the contract price rather than charged as an up-front premium.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The daily contract quantity is the reference volume the daily limits are expressed against, often as percentages of it. The annual contract quantity plays the same role for the year, with a minimum — the take-or-pay level — and a maximum set around it. Nomination is the act of telling the seller tomorrow’s volume. The swing factor summarises how much flexibility has been bought: the maximum daily nomination divided by the average daily volume the annual quantity implies. Many contracts add make-up rights, letting a buyer that has paid for volume it did not take draw that gas in a later period rather than lose it outright.',
        callout:
          'An annual quantity of 100,000 MWh over a 180-day winter averages about 556 MWh a day. A 1,000 MWh daily maximum is therefore a swing factor of roughly 1.8, and the annual limit is exhausted after 100 days at full rate.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Take-or-pay is a liability, not an option: a buyer whose demand collapses still pays for the annual minimum, and if the market has fallen below the contract price it is paying over the odds for volume it does not want. Valuation is model-dependent in a way little else in this catalogue is — the number on the page assumes nominations are timed well, and a desk that exercises less than optimally realises less than the model promised. The seller carries the mirror image and must be able to deliver the maximum on any day it is asked, which is a physical commitment as much as a financial one. Terms run for years, so each side carries the other’s credit for a long time.',
        callout:
          'Take-or-pay was tested in Europe after 2009, when hub prices fell well below the oil-indexed prices in long-term supply contracts and buyers found themselves paying for gas they could have bought more cheaply on the market. A long run of renegotiations and arbitrations followed, and hub indexation displaced much of the oil linkage.',
      },
    ],
    keyTerms: [
      {
        term: 'Nomination',
        definition:
          'The buyer’s notice, given by a deadline in the contract, of the volume it will take on the coming day.',
      },
      {
        term: 'Daily contract quantity',
        definition:
          'The reference daily volume that the minimum and maximum daily nominations are expressed against.',
      },
      {
        term: 'Annual contract quantity',
        definition:
          'The reference volume for the contract year, around which the overall minimum and maximum takes are set.',
      },
      {
        term: 'Take-or-pay',
        definition:
          'The obligation to pay for the annual minimum volume whether or not the buyer actually takes it.',
      },
      {
        term: 'Swing factor',
        definition:
          'The maximum daily nomination divided by the average daily volume, measuring how much flexibility the contract carries.',
      },
      {
        term: 'Continuation value',
        definition:
          'What the remaining allowance is worth if today’s is left unused — the figure a nomination decision is really judged against.',
      },
    ],
    example: {
      title: 'A supplier weighs one day against the winter',
      lines: [
        'A supplier holds a 180-day winter swing contract at €30 a MWh, nominating between 0 and 1,000 MWh on any day.',
        'Across the winter it must take at least 60,000 MWh and may take no more than 100,000 MWh.',
        'Nominating the maximum every day would be 180 × 1,000 = 180,000 MWh, so the annual limit allows full nominations on only 100 of the 180 days.',
        'On a day when the spot price is €34, nominating the maximum earns (€34 − €30) × 1,000 = €4,000.',
        'A colder day later in the winter is expected to reach €45, where the same allowance would earn (€45 − €30) × 1,000 = €15,000.',
        'The winter turns mild and the supplier takes only 52,000 MWh, so it still pays for the 8,000 MWh shortfall: 8,000 × €30 = €240,000.',
      ],
      takeaway:
        'The €34 day is in the money and may still be the wrong day to use, because the allowance it consumes is worth €15,000 elsewhere — an option inside a swing contract is only worth exercising if it is the best use of a budget every other day is also bidding for. And the €240,000 is not an option expiring worthless; it is a bill for gas the supplier never received.',
    },
    inPractice:
      'The buyers are utilities, energy retailers and industrial users whose load follows the weather or a production schedule they cannot fix a year ahead. The sellers are producers, storage operators and the large portfolio traders who can net one buyer’s cold day against another’s mild one. Long-term European gas supply has been written this way for decades, and the same flexibility trades in its own right whenever a desk leases storage capacity and runs it as a swing contract against the hub price.',
    relatedProductIds: ['cmopt', 'weather', 'capfloor'],
    quiz: [
      {
        id: 'swing-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'In a swing option the buyer chooses the quantity it takes, while the price is fixed in advance.',
        correctAnswer: true,
        explanation:
          'That inversion is the whole point: elsewhere the strike fixes the price and the amount is set, here the price is set and the amount is chosen.',
      },
      {
        id: 'swing-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'What most clearly separates a swing option from a standard commodity call?',
        options: [
          'The right is over how much to take, not over whether to buy a fixed amount',
          'The right is over the price paid rather than the quantity taken',
          'It settles in cash where a call settles by delivery',
          'It can only be exercised on the final day of the contract',
        ],
        correctIndex: 0,
        explanation:
          'A call is optionality on price for a set volume. A swing contract is optionality on volume at a set price.',
      },
      {
        id: 'swing-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A swing contract obliges the buyer to take the same volume every day.',
        correctAnswer: false,
        explanation:
          'It may nominate anywhere between the daily minimum and maximum. A fixed daily volume would be a forward strip, not a swing contract.',
      },
      {
        id: 'swing-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A 180-day contract allows up to 1,000 MWh a day and no more than 100,000 MWh over the winter. On how many days can the buyer take the daily maximum?',
        options: ['All 180 days', '100 days', '80 days', '60 days'],
        correctIndex: 1,
        explanation:
          '100,000 ÷ 1,000 = 100. The daily limit alone would allow 180,000 MWh, so it is the annual limit that binds.',
      },
      {
        id: 'swing-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A swing contract is worth at most the strip of independent daily options it contains.',
        correctAnswer: true,
        explanation:
          'Constraints can only subtract value. Without the annual limits the contract would be exactly that strip, so the strip is its upper bound.',
      },
      {
        id: 'swing-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Spot is €34 against a €30 contract price, and a colder day later in the winter is expected near €45. Why might the buyer still nominate less than the maximum today?',
        options: [
          'Because the contract is out of the money at €34',
          'Because the contract price rises once the annual minimum is met',
          'Because the annual limit is fixed, so volume taken today is volume unavailable on the more valuable day',
          'Because a nomination cannot be changed once the winter has started',
        ],
        correctIndex: 2,
        explanation:
          'A full nomination today earns €4,000, while the same 1,000 MWh earns €15,000 on the cold day. Being in the money is not enough when the allowance is scarce.',
      },
      {
        id: 'swing-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A supplier serving households knows in advance how much gas it will need on each day of the winter.',
        correctAnswer: false,
        explanation:
          'Its demand is set by the weather. That uncertainty is exactly what the flexibility is bought to cover.',
      },
      {
        id: 'swing-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why does a fixed strip of forwards suit a household gas supplier badly?',
        options: [
          'Forwards cannot be traded for winter delivery',
          'A forward strip costs more than a swing contract for the same total volume',
          'A forward fixes the price but leaves the counterparty’s credit unhedged',
          'Its volume is fixed, so cold days send the supplier into the spot market exactly when prices are highest',
        ],
        correctIndex: 3,
        explanation:
          'Demand and price peak together, so the volume left unhedged is bought at the worst moment. The flexibility is what prevents that.',
      },
      {
        id: 'swing-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does the swing factor measure?',
        options: [
          'The share of the annual contract quantity that must be taken',
          'How far the maximum daily nomination exceeds the average daily volume',
          'The rate charged on volume taken below the annual minimum',
          'The number of days on which the buyer is allowed to nominate',
        ],
        correctIndex: 1,
        explanation:
          'It is the ratio of the daily maximum to the average day implied by the annual quantity — a measure of how much flexibility was bought.',
      },
      {
        id: 'swing-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A nomination is the buyer’s notice of the volume it will take, given by a deadline set in the contract.',
        correctAnswer: true,
        explanation:
          'The seller has to schedule delivery, so the flexibility is exercised through a notice rather than after the fact.',
      },
      {
        id: 'swing-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Under a take-or-pay clause a buyer that takes less than the annual minimum still pays for the shortfall.',
        correctAnswer: true,
        explanation:
          'That part of the contract is an obligation, not an option — which is why an unused swing contract can still generate a bill.',
      },
      {
        id: 'swing-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why might a swing contract be worth less to its holder than the value a model puts on it?',
        options: [
          'Because take-or-pay volumes are refunded at the end of the year',
          'Because the seller may revise the daily maximum during the winter',
          'Because the model assumes nominations are timed well, and a real desk decides each day without knowing what the rest of the winter will do',
          'Because the contract price is reset daily against the spot market',
        ],
        correctIndex: 2,
        explanation:
          'The model value is what optimal exercise would realise. Suboptimal nominations leave part of it on the table.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'A bundle of constraints, not one option',
          content:
            'A swing contract gives the buyer the right to take a variable quantity within limits: a minimum and maximum on any single day, and a minimum and maximum across the whole contract period. The value is in the flexibility, and the constraints are what make it finite. Taking more today reduces what can be taken later, so each exercise decision changes every future one — which means the contract cannot be valued by pricing a series of independent options and adding them up.',
          callout:
            'The daily limits shape the payoff and the annual limits couple the days together. Remove the annual constraint and it really is a strip of independent options; keep it and it is not.',
        },
        {
          title: 'Valuing a decision that depends on the future',
          content:
            'Because today’s choice affects tomorrow’s opportunity set, valuation is a dynamic programming problem: what is this quantity worth now, against what it would be worth if kept for a better day. In practice these are valued by simulation, stepping backwards through the possible price paths and estimating the continuation value at each point. The output is not just a price but an exercise policy — a rule for how much to take at each level — which is the part the operating business actually uses.',
        },
        {
          title: 'Take-or-pay, and the obligation half',
          content:
            'The buyer’s minimum is an obligation, not a right: quantity not taken must usually be paid for anyway. That converts the contract from pure optionality into an option with a short position attached, and it is why the annual minimum is negotiated harder than the maximum. Make-up rights soften it by letting unused volume be carried into a later period, which is itself an option — a small one, granted by the seller, and priced accordingly.',
          callout:
            'The general shape once more: a contract described as flexibility for the buyer contains an obligation, and reading only the rights half misprices it.',
        },
      ],
      quiz: [
        {
          id: 'swing-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'Which constraints define a swing contract?',
          options: [
            'A single strike and expiry',
            'A barrier and a rebate',
            'A fixed quantity at a fixed price',
            'Daily minimum and maximum, and period minimum and maximum',
          ],
          correctIndex: 3,
          explanation:
            'The flexibility is the value and the constraints are what make it finite.',
        },
        {
          id: 'swing-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A swing contract can be valued as a strip of independent daily options added together.',
          correctAnswer: false,
          explanation:
            'The period constraint couples the days: taking more today reduces what can be taken later.',
        },
        {
          id: 'swing-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Removing the annual constraint would make it a strip of independent options.',
          correctAnswer: true,
          explanation:
            'Which is a useful way to see exactly what the annual limit is doing to the valuation.',
        },
        {
          id: 'swing-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What kind of problem is valuing one of these?',
          options: [
            'A linear interpolation between two forwards',
            'A credit valuation problem',
            'A dynamic programming problem, solved backwards through possible price paths',
            'A closed-form option pricing problem',
          ],
          correctIndex: 2,
          explanation:
            'Each decision changes the opportunity set, so the value today depends on the policy tomorrow.',
        },
        {
          id: 'swing-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt: 'The valuation produces an exercise policy as well as a price.',
          correctAnswer: true,
          explanation:
            'And the policy — how much to take at each price level — is what the operating business actually uses.',
        },
        {
          id: 'swing-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What is a continuation value?',
          options: [
            'The cost of extending the contract',
            'What the remaining flexibility is worth if today’s quantity is not taken',
            'The value of the contract at expiry',
            'The premium paid at inception',
          ],
          correctIndex: 1,
          explanation:
            'Comparing it against today’s payoff is the exercise decision, one step at a time.',
        },
        {
          id: 'swing-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'foundational',
          prompt: 'The period minimum is an obligation rather than a right.',
          correctAnswer: true,
          explanation:
            'Volume not taken must generally be paid for anyway — the take-or-pay half of the contract.',
        },
        {
          id: 'swing-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What does the take-or-pay obligation do to the contract’s risk?',
          options: [
            'It attaches a short position to what looks like pure optionality',
            'It caps the buyer’s upside',
            'It removes the seller’s credit exposure',
            'It converts the contract to a forward',
          ],
          correctIndex: 0,
          explanation:
            'Which is why the annual minimum is negotiated harder than the maximum.',
        },
        {
          id: 'swing-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is a make-up right?',
          options: [
            'The right to renegotiate the price annually',
            'The seller’s right to reduce delivery',
            'A rebate paid when the maximum is reached',
            'The right to carry unused volume into a later period',
          ],
          correctIndex: 3,
          explanation:
            'A small option granted by the seller to soften the obligation, and priced as one.',
        },
        {
          id: 'swing-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A contract described as flexibility for the buyer can contain a meaningful obligation.',
          correctAnswer: true,
          explanation:
            'Reading only the rights half misprices it, which is the general shape this app keeps returning to.',
        },
        {
          id: 'swing-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Simulation is used because a closed-form solution exists but is slow to compute.',
          correctAnswer: false,
          explanation:
            'There is no closed form for a path-dependent, constrained exercise problem of this shape.',
        },
        {
          id: 'swing-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'Which term should a buyer scrutinise most closely?',
          options: [
            'The settlement currency',
            'The publication used for the price',
            'The period minimum, because it is the obligation',
            'The daily maximum, because it caps upside',
          ],
          correctIndex: 2,
          explanation:
            'The maximum limits a benefit; the minimum creates a liability, and only one of those can surprise you.',
        },
      ],
    },
  },
];
