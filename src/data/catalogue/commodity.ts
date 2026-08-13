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
  },
];
