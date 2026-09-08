import type { Product } from '../types';

/** FX products. Ids are stable — saved progress is keyed by them. */
export const fxProducts: Product[] = [
  {
    id: 'fxfwd',
    categoryId: 'fx',
    name: 'FX Forward',
    hook: 'Lock in a future exchange rate',
    summary:
      'The simplest way to remove currency uncertainty from a future cash flow. Two parties agree today to exchange one currency for another on a fixed date at a fixed rate, and both are obliged to go through with it whatever spot does in the meantime. The rate is not a forecast: it is today’s spot adjusted by the interest rate gap between the two currencies, because anything else would let someone borrow in one currency, lend in the other and pocket the difference risk-free.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX forward is a customised OTC agreement to exchange two currencies at a fixed rate on a specified future date. Both currencies are actually delivered on that date, and neither side can walk away — that firm obligation is what separates a forward from an option.',
        callout:
          'Spot in most currency pairs settles two business days after the trade date. Anything dated beyond that spot date is a forward; USD/CAD is the main exception, settling one business day after trade.',
      },
      {
        step: 2,
        title: 'How the rate is set',
        content:
          'The forward rate is the spot rate adjusted by forward points, which come from the interest rate differential between the two currencies. The currency with the higher interest rate trades at a forward discount — otherwise borrowing in one and lending in the other would be a free profit. Quote convention decides the direction of the adjustment: in EUR/USD the euro is the base currency and the dollar the quote currency, so the rate reads as dollars per euro, and when dollar rates sit above euro rates the forward rate is above spot.',
        callout:
          'Forward points are quoted in pips — the fourth decimal place in most pairs, but the second in yen pairs, where USD/JPY moves in units of 0.01.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Companies use forwards to lock in an exchange rate for future receivables or payables, removing uncertainty from currency moves. An importer with a known foreign-currency bill buys that currency forward; an exporter expecting foreign-currency revenue sells it forward. In both cases the domestic-currency value of the cash flow is fixed on the day the hedge is done, not on the day the money arrives.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Spot rate, forward points, value date and notional define the trade. The value date is the day the two currencies actually change hands. An outright forward is a single exchange on one date, while a window forward lets the company settle at any point across a range of dates.',
        callout:
          'A window forward is priced conservatively, because the dealer has to assume the client will pick whichever date in the window suits the client rather than the dealer.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A forward is a firm obligation, so if the underlying exposure disappears — an expected sale falls through — the company is left holding an unwanted currency position that can only be removed by trading out of it at the market rate, crystallising a gain or a loss. Locking the rate also gives up any benefit if spot moves favourably, and the contract carries counterparty risk until settlement.',
      },
    ],
    keyTerms: [
      {
        term: 'Spot rate',
        definition:
          'The rate for an exchange settling on the standard spot date, normally two business days after the trade.',
      },
      {
        term: 'Forward points',
        definition:
          'The adjustment added to or subtracted from spot to give the forward rate, driven by the interest rate differential.',
      },
      {
        term: 'Value date',
        definition:
          'The date on which the two currencies are actually delivered to each other.',
      },
      {
        term: 'Base currency',
        definition:
          'The first currency in a pair — the one whose price is being quoted, so EUR/USD is dollars per euro.',
      },
      {
        term: 'Outright forward',
        definition:
          'A single exchange of two currencies on one future date, with no offsetting near leg.',
      },
      {
        term: 'Window forward',
        definition:
          'A forward the client may settle on any date within an agreed range rather than one fixed date.',
      },
    ],
    example: {
      title: 'A US importer fixes a euro payable',
      lines: [
        'A US company owes €10,000,000 in six months. In EUR/USD the euro is the base currency, so the rate is dollars per euro.',
        'Spot is 1.0800, six-month dollar rates are 4% and six-month euro rates 2%.',
        'The forward rate is 1.0800 × 1.0200 ÷ 1.0100 = 1.0907, so the forward points are +107.',
        'Buying €10,000,000 forward at 1.0907 fixes the cost at $10,907,000.',
        'If spot is 1.1500 on the value date, buying at market would have cost $11,500,000 — the forward saved $593,000.',
        'If spot is 1.0500 instead, the market cost would have been $10,500,000 and the forward is $407,000 worse.',
      ],
      takeaway:
        'The dollar pays more interest, so it is worth fewer euros forward and EUR/USD rises with tenor. The 107 points are that interest gap, not a view on the euro — and because a forward binds both ways, the company gives up the good outcome along with the bad one.',
    },
    inPractice:
      'A UK importer paying dollar invoices ninety days after shipment uses forwards so the margin priced into the sale survives to the accounts, and an exporter selling into Europe does the mirror trade on its receivables. Fund managers run the same hedge at portfolio level, selling the currency of overseas holdings forward against the fund’s base currency and rolling the hedge as each contract matures.',
    relatedProductIds: ['fxswap', 'ndf', 'fra'],
    quiz: [
      {
        id: 'fxfwd-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'FX forwards are standardised contracts traded on an exchange.',
        correctAnswer: false,
        explanation:
          'They are bespoke bilateral OTC contracts, negotiated on amount and date, unlike listed futures.',
      },
      {
        id: 'fxfwd-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An FX forward settles at whatever spot rate prevails on the value date.',
        correctAnswer: false,
        explanation:
          'It settles at the rate agreed at inception, regardless of where spot ends up.',
      },
      {
        id: 'fxfwd-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does an FX forward commit the two parties to do?',
        options: [
          'Exchange two currencies at a fixed rate on an agreed future date',
          'Exchange two currencies at spot on an agreed future date',
          'Exchange interest payments in two currencies over an agreed term',
          'Give one party the right, but not the duty, to exchange currencies',
        ],
        correctIndex: 0,
        explanation:
          'Both the rate and the date are fixed today, and both sides must deliver. The right without the duty describes an option.',
      },
      {
        id: 'fxfwd-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Forward points reflect the interest rate differential between the two currencies.',
        correctAnswer: true,
        explanation:
          'If they did not, borrowing in the low-rate currency and lending in the high-rate one would be a risk-free profit.',
      },
      {
        id: 'fxfwd-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The currency with the higher interest rate typically trades at a forward premium.',
        correctAnswer: false,
        explanation:
          'It trades at a forward discount. The extra interest it earns is given back through the forward rate.',
      },
      {
        id: 'fxfwd-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Spot EUR/USD is 1.0800, six-month dollar rates are 4% and euro rates 2%. Roughly where is the six-month forward?',
        options: [
          'Below 1.0800, because the dollar pays the higher interest rate',
          'At 1.0800, because the forward is the market’s forecast of spot',
          'Above 1.0800, at about 1.0907',
          'Above 1.0800, at about 1.1012',
        ],
        correctIndex: 2,
        explanation:
          '1.0800 × 1.0200 ÷ 1.0100 = 1.0907. The figure 1.1012 is the one-year forward — applying a full year of the differential to a six-month trade.',
      },
      {
        id: 'fxfwd-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A US importer owes €10m in six months. Which trade fixes the dollar cost today?',
        options: [
          'Sell €10m forward against dollars',
          'Buy €10m forward against dollars',
          'Buy $10m forward against euros',
          'Buy a six-month euro put on €10m',
        ],
        correctIndex: 1,
        explanation:
          'It needs euros later, so it buys euros forward. Selling euros is the wrong direction, and a euro put is a right to sell euros.',
      },
      {
        id: 'fxfwd-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A forward fixes the domestic-currency value of a future cash flow on the day the hedge is done.',
        correctAnswer: true,
        explanation:
          'That is the point of it — the rate is set at inception, not when the money arrives.',
      },
      {
        id: 'fxfwd-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What distinguishes a window forward from an outright forward?',
        options: [
          'It is cash-settled rather than delivered',
          'It is traded on an exchange rather than bilaterally',
          'It can be settled on any date within an agreed range',
          'Its rate is not fixed until the day of settlement',
        ],
        correctIndex: 2,
        explanation:
          'The rate is still agreed at inception; only the timing is flexible, which is why the dealer prices it conservatively.',
      },
      {
        id: 'fxfwd-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The value date is the date on which the two currencies actually change hands.',
        correctAnswer: true,
        explanation:
          'It is the delivery date of the contract, distinct from the trade date on which the rate was agreed.',
      },
      {
        id: 'fxfwd-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'If the exposure a forward was hedging disappears, the forward can be cancelled at no cost.',
        correctAnswer: false,
        explanation:
          'It is a firm obligation. Removing it means trading an offsetting forward at the current market rate, which locks in whatever gain or loss has built up.',
      },
      {
        id: 'fxfwd-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A company hedged an export sale with a forward, and the sale then fell through. What is it left with?',
        options: [
          'No position, because the hedge lapses with the exposure',
          'An outright currency position it never wanted',
          'A right to exchange currency that it can simply abandon',
          'A claim against the counterparty for the premium it paid',
        ],
        correctIndex: 1,
        explanation:
          'The hedge no longer offsets anything, so it becomes a speculative position. No premium was ever paid on a forward.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Where forward points come from',
          content:
            'A forward rate is not a forecast. It is spot adjusted by the interest rate differential between the two currencies, because any other level would let someone borrow in one, convert, lend in the other and hedge the return at a profit. The adjustment is quoted as forward points added to or subtracted from spot, and its sign follows the differential: the higher-yielding currency trades at a discount forward. A trader who thinks a forward looks cheap is usually looking at a rate differential without realising it.',
          callout:
            'The relationship is covered interest parity, and it holds tightly for major currencies because the arbitrage is easy. Where it does not hold, the gap is the cross-currency basis and it is a funding price rather than free money.',
        },
        {
          title: 'Dates, and why they are half the trade',
          content:
            'Spot for most pairs settles two business days out, in both currencies’ calendars, which means a holiday in either shifts the date. A forward for a standard tenor runs from that spot date to the same day of the month later; a broken date lands between two standard ones and is priced by interpolating the points. None of this is decorative — a hedge dated a day away from the exposure it covers leaves a day of unhedged spot risk, and on a large corporate flow that is a real number.',
          callout:
            'End-end convention: a forward starting on the last business day of a month matures on the last business day of the later month, not on the same numbered day.',
        },
        {
          title: 'Rolling and pre-delivering',
          content:
            'Exposures move, and forwards are routinely adjusted rather than left to mature. Extending one is a swap — buy the near date back and sell a later one — priced off the points for that period, so a roll is a funding transaction and not a new view. Taking delivery early works the same way in reverse. The cost of each roll is the differential over the period, which means a hedge repeatedly rolled through a wide differential accumulates a cost nobody decided to take.',
        },
      ],
      quiz: [
        {
          id: 'fxfwd-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What determines the forward points on a currency pair?',
          options: [
            'The market’s expected future spot rate',
            'The interest rate differential between the two currencies',
            'The relative inflation rates of the two economies',
            'The volatility of the pair',
          ],
          correctIndex: 1,
          explanation:
            'Any other level would be arbitrageable by borrowing in one currency, lending in the other and hedging the return.',
        },
        {
          id: 'fxfwd-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'The higher-yielding currency of a pair trades at a discount in the forward market.',
          correctAnswer: true,
          explanation:
            'Otherwise the carry could be earned and hedged at the same time, which is the arbitrage the points remove.',
        },
        {
          id: 'fxfwd-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A forward rate is the market’s best forecast of where spot will be.',
          correctAnswer: false,
          explanation:
            'It is spot plus a rate differential. Whether that turns out to resemble the future is a separate — and much argued — question.',
        },
        {
          id: 'fxfwd-d4',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A forward looks mispriced against your view of the currency. What are you most likely looking at?',
          options: [
            'A rate differential you have not accounted for',
            'A dealer error',
            'An illiquid settlement date',
            'A change in the spot convention',
          ],
          correctIndex: 0,
          explanation:
            'The points are arithmetic. A forward that looks cheap is usually a rates view wearing an FX costume.',
        },
        {
          id: 'fxfwd-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'When does spot settle for most major currency pairs?',
          options: [
            'Same day',
            'One business day out',
            'Two business days out, in both currencies’ calendars',
            'On the last business day of the month',
          ],
          correctIndex: 2,
          explanation:
            'A holiday in either currency moves the date, and everything dated off spot moves with it.',
        },
        {
          id: 'fxfwd-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'A broken-date forward is priced by interpolating between the standard tenors around it.',
          correctAnswer: true,
          explanation:
            'The points curve is quoted at standard dates; anything between them is interpolated.',
        },
        {
          id: 'fxfwd-d7',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A forward starting on the last business day of a month matures on the same numbered day of the later month.',
          correctAnswer: false,
          explanation:
            'End-end convention takes it to the last business day of the later month instead.',
        },
        {
          id: 'fxfwd-d8',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A hedge is dated one day away from the exposure it covers. What is left?',
          options: [
            'Nothing material',
            'A day of unhedged spot exposure',
            'A change in the credit terms',
            'A different settlement currency',
          ],
          correctIndex: 1,
          explanation:
            'Small per trade, and a real position across a corporate flow book.',
        },
        {
          id: 'fxfwd-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'How is a forward extended to a later date?',
          options: [
            'By cancelling it and dealing a new one at market',
            'With an FX swap: buying the near date back and selling a later one',
            'By paying a fee to the dealer',
            'By novating it to another counterparty',
          ],
          correctIndex: 1,
          explanation:
            'A roll is a funding transaction priced off the points, not a new directional decision.',
        },
        {
          id: 'fxfwd-d10',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Rolling a hedge repeatedly through a wide interest rate differential accumulates a cost.',
          correctAnswer: true,
          explanation:
            'Each roll pays the differential over its period, and nobody explicitly decides to take that cost.',
        },
        {
          id: 'fxfwd-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt: 'Taking delivery of a forward early is also priced with a swap.',
          correctAnswer: true,
          explanation:
            'Pre-delivery is the same mechanism in reverse, and it is priced off the same points.',
        },
        {
          id: 'fxfwd-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'Where covered interest parity does not hold, what is the gap?',
          options: [
            'An arbitrage available to anyone',
            'The cross-currency basis, which is a funding price',
            'A quoting error',
            'The expected depreciation of the weaker currency',
          ],
          correctIndex: 1,
          explanation:
            'It is compensation for balance sheet and funding. Reading it as free money is how positions get sized wrongly.',
        },
      ],
    },
  },
  {
    id: 'fxopt',
    categoryId: 'fx',
    name: 'FX Option',
    hook: 'The right to exchange currency at a strike',
    summary:
      'A forward with an escape hatch, bought for a fee. The holder may exchange two currencies at an agreed strike rate but is never forced to, so a hedger keeps protection against an adverse move while retaining the benefit of a favourable one. That asymmetry is paid for upfront in premium, which makes an option a more expensive hedge than a forward at the moment it is put on and a better one only if spot travels far enough in the hedger’s favour.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX option gives the holder the right, not the obligation, to buy or sell one currency for another at a set strike rate on or before expiry. The seller has the mirror position: an obligation to deliver if the holder exercises, in exchange for the premium received.',
      },
      {
        step: 2,
        title: 'Call vs put',
        content:
          'A call gives the right to buy the base currency; a put gives the right to sell it. The buyer pays a premium for this flexibility. Because every FX trade has two sides, an option is always a call on one currency and simultaneously a put on the other — the right to sell euros for dollars at 1.0800 is the same contract as the right to buy dollars with euros at that rate.',
        callout:
          'This is why FX confirmations name both legs. “A EUR put / USD call, strike 1.0800, €10m” is unambiguous; “a euro put” on its own does not say what the euro is being sold against.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Firms hedge currency exposure while retaining upside if rates move favourably — unlike a forward, which locks in the rate either way. Options also suit exposures that may not happen: a company bidding for a foreign contract would be left with an unwanted forward if the bid failed, whereas an option is simply left to lapse.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, premium, expiry, notional and exercise style (European on one date, American any time before expiry). Implied volatility drives the price, and dealers hedge their delta — the option’s sensitivity to the spot rate.',
        callout:
          'The FX options market quotes in volatility rather than cash: dealers agree a vol number and the premium falls out of an agreed model, which is why the standard reference points are at-the-money vol, 25-delta risk reversals and butterflies.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium is a real cost, making options a more expensive hedge upfront than a forward, and it is lost if the option expires worthless. Sellers face large open-ended losses, and exotic features such as knock-out barriers can cancel a hedge exactly when it is needed most.',
        callout:
          'Premium on a vanilla FX option is normally paid two business days after the trade date — the same settlement convention as an FX spot trade.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike',
        definition:
          'The exchange rate at which the holder may buy or sell if the option is exercised.',
      },
      {
        term: 'Premium',
        definition:
          'The price paid upfront for the option, kept by the seller whether or not the option is exercised.',
      },
      {
        term: 'Exercise style',
        definition:
          'Whether the option may be exercised only at expiry (European) or at any time up to it (American).',
      },
      {
        term: 'Implied volatility',
        definition:
          'The volatility the market is pricing into the option — the main determinant of its premium.',
      },
      {
        term: 'Delta',
        definition:
          'How much the option’s value changes for a small move in the spot rate.',
      },
      {
        term: 'Knock-out barrier',
        definition:
          'A rate level that, if spot touches it, cancels the option before expiry.',
      },
    ],
    example: {
      title: 'An exporter puts a floor under a euro receivable',
      lines: [
        'A US exporter expects €20,000,000 in three months. In EUR/USD the euro is the base currency, so a falling rate means fewer dollars.',
        'It buys a three-month EUR put / USD call struck at 1.0800 on €20,000,000, paying 150 pips — 0.0150 dollars per euro, or $300,000.',
        'If spot fixes at 1.0200 it exercises, selling €20m at 1.0800 for $21,600,000, or $21,300,000 after premium, against $20,400,000 at market.',
        'If spot fixes at 1.1500 it lets the option lapse and sells at market for $23,000,000, keeping $22,700,000 after premium.',
        'The three-month forward was 1.0900, which would have fixed the proceeds at $21,800,000 in both cases.',
      ],
      takeaway:
        'The option floors the exporter at $21,300,000 — an effective 1.0650 — while leaving the upside open. It only beats the forward above 1.1050, the forward rate plus the 150-pip premium; anywhere below that the forward produces more dollars, and the difference is what the upside costs.',
    },
    inPractice:
      'Corporates reach for options when the exposure itself is uncertain, such as a bidder for an overseas contract that would be stuck with a live forward if it lost the tender. Asset managers and hedge funds buy them for asymmetric positions around elections and central bank meetings, and dealer desks run large books of them, hedging delta continuously in the spot market and managing what is left over in volatility.',
    relatedProductIds: ['fxfwd', 'swaption', 'eqopt'],
    quiz: [
      {
        id: 'fxopt-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The buyer of an FX option pays a premium upfront.',
        correctAnswer: true,
        explanation:
          'The premium is the price of the optionality, and the seller keeps it whether or not the option is exercised.',
      },
      {
        id: 'fxopt-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The buyer of an FX option must exercise it at expiry.',
        correctAnswer: false,
        explanation:
          'Exercise is a right, not a duty. If the strike is worse than the market, the buyer lets the option lapse.',
      },
      {
        id: 'fxopt-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does an FX option give its buyer?',
        options: [
          'An obligation to exchange currencies at the strike',
          'The right, but not the obligation, to exchange currencies at the strike',
          'A daily cash payment equal to the gap between strike and spot',
          'A loan in one currency secured against another',
        ],
        correctIndex: 1,
        explanation:
          'The obligation sits only with the seller. The buyer chooses whether to use the strike.',
      },
      {
        id: 'fxopt-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'Every FX option is a call on one currency and a put on the other at the same time.',
        correctAnswer: true,
        explanation:
          'Buying one currency always means selling the other, so both descriptions fit the same contract.',
      },
      {
        id: 'fxopt-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A US exporter expecting €20m wants protection if the euro falls against the dollar. Which option does it buy?',
        options: [
          'A EUR call, which is the same contract as a USD put',
          'A EUR put, which is the same contract as a USD call',
          'A EUR call, which is the same contract as a USD call',
          'A EUR put, which is the same contract as a USD put',
        ],
        correctIndex: 1,
        explanation:
          'It needs the right to sell euros, so it buys a EUR put — and selling euros means buying dollars, so the same contract is a USD call.',
      },
      {
        id: 'fxopt-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Unlike a forward, an option lets the hedger keep the benefit if spot moves in their favour.',
        correctAnswer: true,
        explanation:
          'The hedger abandons the option and trades at the better market rate. A forward binds them either way.',
      },
      {
        id: 'fxopt-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'An exporter buys a EUR put struck at 1.0800 for 150 pips (0.0150 per euro) when the forward is 1.0900. Above roughly what spot does the option beat the forward?',
        options: ['1.0800', '1.0900', '1.1050', '1.1200'],
        correctIndex: 2,
        explanation:
          'Letting the option lapse nets spot minus 0.0150 per euro, which matches the 1.0900 forward at 1.1050. Ignoring financing on the premium, the forward wins below that.',
      },
      {
        id: 'fxopt-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A European-style FX option can be exercised at any point before expiry.',
        correctAnswer: false,
        explanation:
          'A European option is exercisable only on the expiry date. American style allows exercise at any time up to it.',
      },
      {
        id: 'fxopt-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which input drives an FX option’s price but has no bearing on a forward’s rate?',
        options: [
          'The spot rate',
          'The notional amount',
          'The interest rate differential',
          'Implied volatility',
        ],
        correctIndex: 3,
        explanation:
          'Spot and the rate differential are exactly what set a forward rate, and notional only scales it. Volatility is what the option adds.',
      },
      {
        id: 'fxopt-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Delta measures how much an option’s value moves when the spot rate moves.',
        correctAnswer: true,
        explanation:
          'It is the option’s sensitivity to spot, and it is what dealers hedge in the spot market.',
      },
      {
        id: 'fxopt-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'An FX option costs nothing upfront, whereas a forward requires a premium.',
        correctAnswer: false,
        explanation:
          'It is the other way round. The forward has no premium; the option’s premium is the price of being able to walk away.',
      },
      {
        id: 'fxopt-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why can a knock-out barrier make a hedge unreliable?',
        options: [
          'The option can cease to exist just as the move it protects against grows large',
          'The barrier turns the option into a firm obligation to deliver',
          'The barrier makes the option more expensive than a vanilla one',
          'The barrier resets the strike to spot on the day it is touched',
        ],
        correctIndex: 0,
        explanation:
          'Touching the barrier cancels the option, so the protection can vanish in exactly the market the hedger bought it for. Barriers make options cheaper, not dearer.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Quoted in deltas, not strikes',
          content:
            'FX options are quoted by delta rather than by strike, and in volatility rather than in price. A "25 delta risk reversal" is the difference in implied volatility between the 25-delta call and the 25-delta put; a "25 delta butterfly" is how much the average of those two sits above the at-the-money level. Three numbers — at-the-money, risk reversal, butterfly — describe the smile at each maturity, and a strike is recovered from a delta only once a volatility is chosen, which makes the convention slightly circular and entirely standard.',
          callout:
            'The convention travels: a strike quoted in deltas stays meaningful as spot moves, which is why an interdealer market that trades all day prefers it to a fixed number.',
        },
        {
          title: 'Which currency the premium is in',
          content:
            'Every FX option has two currencies, so every quantity in it has to say which one it is measured in. Premium can be paid in either, and if it is paid in the currency the delta is measured against, the hedge has to account for the premium itself — the premium-adjusted delta. There are also two defensible answers to what "at the money" means: the forward rate, or the strike at which a straddle is delta-neutral. Neither is wrong, and a desk that assumes the other convention has mispriced the trade before it starts.',
          callout:
            'This is the most common source of a genuine disagreement about the price of a vanilla FX option. Not the model — the conventions around it.',
        },
        {
          title: 'Pricing away from the quoted points',
          content:
            'The market gives three volatilities per maturity and a trade may need a strike between them. The standard approach, vanna-volga, prices a vanilla at the required strike and then adds the cost of hedging its second-order exposures — vanna and volga — using the three quoted instruments. It is a market-convention construction rather than a model of how the rate behaves, which is exactly what makes it useful for interpolation and unsuitable as a description of anything.',
        },
      ],
      quiz: [
        {
          id: 'fxopt-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'How are FX options conventionally quoted?',
          options: [
            'By strike, in premium terms',
            'By delta, in volatility terms',
            'By moneyness, in basis points',
            'By notional, in forward points',
          ],
          correctIndex: 1,
          explanation:
            'A delta-based strike keeps its meaning as spot moves, which suits a market that trades continuously.',
        },
        {
          id: 'fxopt-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does a 25-delta risk reversal measure?',
          options: [
            'The average volatility of the call and the put',
            'The difference in implied volatility between the 25-delta call and put',
            'The premium difference between two strikes',
            'The probability of finishing in the money',
          ],
          correctIndex: 1,
          explanation:
            'It is the market’s price of skew, expressed as a volatility difference rather than a price one.',
        },
        {
          id: 'fxopt-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A butterfly quote describes how far the wings sit above the at-the-money volatility.',
          correctAnswer: true,
          explanation:
            'Level, skew and wings: three numbers per maturity, and the smile is reconstructed from them.',
        },
        {
          id: 'fxopt-d4',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A strike can be recovered from a delta without first choosing a volatility.',
          correctAnswer: false,
          explanation:
            'Delta depends on volatility, so the convention is mildly circular — and universally used anyway.',
        },
        {
          id: 'fxopt-d5',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What is a premium-adjusted delta?',
          options: [
            'A delta calculated after the option has been exercised',
            'A delta that accounts for premium paid in the currency the delta is measured against',
            'A delta adjusted for the forward points',
            'A delta net of the dealer’s spread',
          ],
          correctIndex: 1,
          explanation:
            'Every quantity in an FX option has to name its currency, and the premium is no exception.',
        },
        {
          id: 'fxopt-d6',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'There is more than one defensible definition of "at the money" in FX options.',
          correctAnswer: true,
          explanation:
            'The forward, or the delta-neutral straddle strike. Assuming the wrong one misprices the trade before the model runs.',
        },
        {
          id: 'fxopt-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Two desks disagree on the price of a vanilla FX option. What is the most likely cause?',
          options: [
            'A convention difference, such as premium currency or the at-the-money definition',
            'A difference in the pricing model’s numerical method',
            'A different view on the future spot rate',
            'One of them is using the wrong spot rate',
          ],
          correctIndex: 0,
          explanation:
            'Vanilla FX options are among the most standardised instruments there are; the disagreements live in the conventions.',
        },
        {
          id: 'fxopt-d8',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does vanna-volga pricing do?',
          options: [
            'Models the dynamics of the exchange rate directly',
            'Prices a strike between the quoted ones by adding the cost of hedging its vanna and volga',
            'Removes the need for a volatility surface',
            'Converts an FX option into a forward',
          ],
          correctIndex: 1,
          explanation:
            'It is an interpolation built from market conventions, useful for exactly that and not a description of the world.',
        },
        {
          id: 'fxopt-d9',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'The three quoted instruments per maturity are the at-the-money, the risk reversal and the butterfly.',
          correctAnswer: true,
          explanation:
            'Everything else at that maturity is interpolated from them.',
        },
        {
          id: 'fxopt-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Vanna-volga is a description of how the exchange rate actually behaves.',
          correctAnswer: false,
          explanation:
            'It is a hedging-cost construction. Treating it as a model of the underlying is a category error.',
        },
        {
          id: 'fxopt-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why does the delta convention suit the interdealer market?',
          options: [
            'It produces smaller premiums',
            'A delta-based strike keeps its meaning as spot moves',
            'It removes the need to agree a maturity',
            'It is required by clearing houses',
          ],
          correctIndex: 1,
          explanation:
            'A fixed strike quoted this morning describes a different option this afternoon; a delta does not.',
        },
        {
          id: 'fxopt-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'Every quantity in an FX option has to specify which of the two currencies it is measured in.',
          correctAnswer: true,
          explanation:
            'Notional, premium and delta all have two possible answers, and the confirmation says which.',
        },
      ],
    },
  },
  {
    id: 'fxswap',
    categoryId: 'fx',
    name: 'FX Swap',
    hook: 'Exchange currencies now and reverse it later',
    summary:
      'Two exchanges bundled into a single trade: currencies swap one way today and back the other way on an agreed future date, both rates fixed at inception. Because the second leg undoes the first, the trade takes almost no view on where the exchange rate goes — what it does is move cash from one currency to another for a defined period, which makes it a funding and liquidity tool rather than a directional one. It is the busiest instrument in the FX market.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An FX swap packages two exchanges into one contract: currencies are swapped at today’s rate (the near leg) and swapped back at an agreed forward rate on a future date (the far leg). Both rates are agreed at the outset, and both legs are with the same counterparty under one confirmation.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The near and far rates differ only by the forward points. A firm holding dollars that needs euros for three months sells dollars for euros today and contracts to reverse the trade in three months — the economic effect is borrowing one currency while lending the other, and the points are the interest differential between them.',
        callout:
          'Because both legs move together, the swap is priced as a single number — the points. The absolute spot level used is largely a matter of convention, provided both legs are struck off the same base.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'FX swaps manage short-term liquidity across currencies, roll a maturing forward hedge out to a later date, and move cash where it is needed without taking an outright currency position. By turnover they are the largest single instrument in the FX market.',
        callout:
          'In the BIS triennial survey FX swaps account for roughly half of all FX turnover — more than spot and outright forwards put together.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Near leg, far leg, forward points (which are the swap’s price), and the two value dates. Very short tenors are common, including overnight and “tom-next” trades that shift settlement by a single day.',
        callout:
          'With spot settling two business days out, a tom-next swap moves a position from tomorrow’s date to the spot date — the standard way to keep rolling a position that would otherwise have to be delivered.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Because both legs are fixed at inception, outright FX risk largely cancels out — but the position is still exposed to moves in interest rate differentials, and the far leg carries counterparty and settlement risk until it completes.',
        callout:
          'Settlement risk is real when principal moves in two currencies in different time zones. CLS settles a large share of FX turnover on a payment-versus-payment basis so that neither leg pays unless both do.',
      },
    ],
    keyTerms: [
      {
        term: 'Near leg',
        definition:
          'The first exchange, usually at or close to the spot rate and the spot date.',
      },
      {
        term: 'Far leg',
        definition:
          'The reversing exchange on the later value date, struck at the forward rate agreed at inception.',
      },
      {
        term: 'Swap points',
        definition:
          'The difference between the far and near rates, which is the price of the swap and reflects the interest differential.',
      },
      {
        term: 'Tom-next',
        definition:
          'A one-day swap rolling a position from tomorrow’s value date to the next business day.',
      },
      {
        term: 'Value date',
        definition:
          'A date on which one of the two legs delivers; every FX swap has two of them.',
      },
      {
        term: 'Cross-currency swap',
        definition:
          'A longer-dated relative that also exchanges interest payments over its life, which an FX swap does not.',
      },
    ],
    example: {
      title: 'Funding a euro bond purchase for three months',
      lines: [
        'A US asset manager buys €50,000,000 of German government bonds but holds only dollars. In EUR/USD the euro is the base currency, so the rate is dollars per euro.',
        'On the near leg it buys €50,000,000 at spot 1.0800, paying $54,000,000.',
        'Three-month dollar rates are 4% and euro rates 2%, so the three-month forward is 1.0800 × 1.0100 ÷ 1.0050 = 1.0854 — 54 points above spot.',
        'On the far leg it sells the same €50,000,000 back at 1.0854, receiving $54,270,000.',
        'It ends with $270,000 more dollars than it started with, having held euros throughout and taken no view on EUR/USD.',
      ],
      takeaway:
        'The 54 points are the interest gap, not a forecast. The manager lent dollars at the higher rate and borrowed euros at the lower one, and $270,000 on $54,000,000 is 0.5% over three months — the 2% annual differential.',
    },
    inPractice:
      'Banks use FX swaps continuously to fund balance sheets that borrow in one currency and lend in another, and corporate treasuries and money-market funds use them to push cash to whichever currency needs it that week. Fund managers use them to roll currency hedges: when a forward hedging an overseas portfolio matures, a single FX swap closes the old leg and opens the next one.',
    relatedProductIds: ['fxfwd', 'ndf', 'irs'],
    quiz: [
      {
        id: 'fxswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An FX swap has two legs — an exchange now and a reversal at a future date.',
        correctAnswer: true,
        explanation:
          'The near leg and the far leg together make up a single contract, with both rates agreed at inception.',
      },
      {
        id: 'fxswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What are the two legs of an FX swap called?',
        options: [
          'Fixed leg and floating leg',
          'Near leg and far leg',
          'Spot leg and option leg',
          'Long leg and short leg',
        ],
        correctIndex: 1,
        explanation:
          'Fixed and floating legs belong to an interest rate swap; an FX swap has a near leg and a far leg.',
      },
      {
        id: 'fxswap-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'FX swaps exchange interest payments throughout their life.',
        correctAnswer: false,
        explanation:
          'That describes a cross-currency swap. An FX swap has only the two exchange legs, with the interest differential built into the points.',
      },
      {
        id: 'fxswap-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The near and far rates of an FX swap differ only by the forward points.',
        correctAnswer: true,
        explanation:
          'That difference is the swap’s entire price, and it comes from the interest rate differential.',
      },
      {
        id: 'fxswap-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A fund pays $54,000,000 to receive €50,000,000 at 1.0800 and agrees to reverse at 1.0854 in three months. What does it receive on the far leg?',
        options: ['$54,000,000', '$53,730,000', '$50,000,000', '$54,270,000'],
        correctIndex: 3,
        explanation:
          '€50,000,000 × 1.0854 = $54,270,000, which is $270,000 more than it paid — the interest differential over three months.',
      },
      {
        id: 'fxswap-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A firm sells dollars for euros on the near leg and buys them back on the far leg. Economically, what has it done?',
        options: [
          'Borrowed dollars and lent euros for the period',
          'Taken an outright long euro position',
          'Lent dollars and borrowed euros for the period',
          'Bought protection against a fall in the euro',
        ],
        correctIndex: 2,
        explanation:
          'The counterparty holds its dollars for the period, so the firm has lent dollars, and it holds euros it must give back, so it has borrowed euros.',
      },
      {
        id: 'fxswap-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'FX swaps are commonly used to roll a maturing forward hedge to a later date.',
        correctAnswer: true,
        explanation:
          'One trade settles the maturing leg and opens the new one, which is why hedge rolling is among their most frequent uses.',
      },
      {
        id: 'fxswap-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Why do FX swaps dominate turnover in the FX market?',
        options: [
          'They are used constantly for short-term funding and hedge rolling, often at very short tenors',
          'They are the cheapest way to take a directional view on a currency',
          'They are the only FX instrument that can be centrally cleared',
          'They settle on an exchange, so no counterparty is needed',
        ],
        correctIndex: 0,
        explanation:
          'Their volume comes from repetition — overnight and one-week funding trades done again and again — not from directional positioning.',
      },
      {
        id: 'fxswap-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'An FX swap is priced as an annualised percentage interest rate.',
        correctAnswer: false,
        explanation:
          'It is quoted in forward points, which are added to or subtracted from the near-leg rate to give the far-leg rate.',
      },
      {
        id: 'fxswap-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does a tom-next FX swap do?',
        options: [
          'Rolls a position’s settlement from tomorrow to the next business day',
          'Fixes tomorrow’s spot rate today',
          'Settles both legs on the same day',
          'Converts an FX swap into a cross-currency swap overnight',
        ],
        correctIndex: 0,
        explanation:
          'It shifts settlement by a single day, which with a two-day spot convention moves a position from tomorrow onto the spot date.',
      },
      {
        id: 'fxswap-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'An FX swap leaves the firm with a large outright currency exposure.',
        correctAnswer: false,
        explanation:
          'Both legs are agreed at the start and point in opposite directions, so the directional FX risk largely offsets.',
      },
      {
        id: 'fxswap-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'If outright FX risk largely cancels, what is an FX swap position still exposed to?',
        options: [
          'The level of the spot rate on the far-leg value date',
          'Implied volatility in the FX options market',
          'Moves in the interest rate differential, plus counterparty and settlement risk',
          'Nothing, because both rates are fixed at inception',
        ],
        correctIndex: 2,
        explanation:
          'The points move with the rate differential, and the far leg is an unsettled obligation until it delivers.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Funding, wearing an FX label',
          content:
            'An FX swap exchanges two currencies now and reverses the exchange later at an agreed rate. Strip away the labels and it is a secured loan in two directions: each side has lent one currency and borrowed another, with the other currency as collateral. That is why the pricing is a rate differential rather than a view on the exchange rate, why the instrument is the largest by turnover in the FX market, and why bank treasuries rather than macro traders are its heaviest users.',
          callout:
            'Because each leg collateralises the other, the credit exposure is only the change in the exchange rate over the term — far smaller than the notional exchanged, and the reason the instrument is used for funding at all.',
        },
        {
          title: 'Rolling overnight',
          content:
            'A position held past its settlement date is rolled with the shortest of these swaps — tom-next, from tomorrow to the next day — which is how an unsettled spot position is carried indefinitely. The cost or gain on each roll is the overnight rate differential, so a leveraged position in a high-yielding currency earns carry every night and one in a low-yielding currency pays it. That daily accrual is the entire economics of the carry trade, and it is quoted in a market most people never look at.',
        },
        {
          title: 'When the funding market tightens',
          content:
            'The price of these swaps moves with how badly someone needs a currency, and demand for dollars outside the United States is chronic and uneven. Points widen predictably at quarter and year ends, when balance sheet is measured, and violently in a crisis, when banks stop supplying funding to each other. Central bank swap lines exist precisely to cap that: they let one central bank supply another with its currency for onward lending, which puts a ceiling on how far the market price can run.',
          callout:
            'A crisis in funding looks like an FX chart to anyone reading the wrong screen. The dislocation shows up in the points long before it shows up in spot.',
        },
      ],
      quiz: [
        {
          id: 'fxswap-d1',
          kind: 'choice',
          step: 1,
          difficulty: 'intermediate',
          prompt: 'Economically, what is an FX swap?',
          options: [
            'A directional bet on the exchange rate',
            'A secured loan in two directions, each currency collateralising the other',
            'An option to exchange currencies later',
            'A forward with the near leg removed',
          ],
          correctIndex: 1,
          explanation:
            'Which is why it prices off rate differentials and why treasuries, not macro desks, are its main users.',
        },
        {
          id: 'fxswap-d2',
          kind: 'boolean',
          step: 1,
          difficulty: 'advanced',
          prompt:
            'The credit exposure on an FX swap is much smaller than the notional exchanged.',
          correctAnswer: true,
          explanation:
            'Each leg collateralises the other, so the exposure is the move in the rate over the term.',
        },
        {
          id: 'fxswap-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'FX swaps are among the largest instruments by turnover in the FX market.',
          correctAnswer: true,
          explanation:
            'Because they are the plumbing of short-term currency funding rather than a way of taking a view.',
        },
        {
          id: 'fxswap-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What is a tom-next swap used for?',
          options: [
            'Hedging a long-dated exposure',
            'Rolling an unsettled position from tomorrow to the next day',
            'Converting a swap into a forward',
            'Settling an option premium',
          ],
          correctIndex: 1,
          explanation:
            'It is how a spot position is carried indefinitely without ever settling.',
        },
        {
          id: 'fxswap-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does the daily roll cost or earn?',
          options: [
            'The overnight interest rate differential',
            'The change in spot over the day',
            'The implied volatility of the pair',
            'A fixed fee set by the broker',
          ],
          correctIndex: 0,
          explanation:
            'That accrual is the entire economics of the carry trade, quoted in a market most people never see.',
        },
        {
          id: 'fxswap-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'A leveraged long position in a high-yielding currency earns carry every night it is held.',
          correctAnswer: true,
          explanation:
            'And the mirror position pays it, which is why the trade is popular until the exchange rate moves.',
        },
        {
          id: 'fxswap-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Swap points widen predictably around quarter and year ends.',
          correctAnswer: true,
          explanation:
            'Balance sheet is measured on those dates, so supplying funding across them costs more.',
        },
        {
          id: 'fxswap-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What do central bank swap lines do?',
          options: [
            'Fix the exchange rate between two currencies',
            'Let one central bank supply another with its currency for onward lending',
            'Guarantee commercial bank deposits',
            'Replace the interbank market permanently',
          ],
          correctIndex: 1,
          explanation:
            'They put a ceiling on how far the market price of funding can run in a crisis.',
        },
        {
          id: 'fxswap-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'foundational',
          prompt:
            'Demand for dollar funding outside the United States is a persistent feature of this market.',
          correctAnswer: true,
          explanation:
            'Someone has to intermediate it, and the price of doing so is what the points reflect.',
        },
        {
          id: 'fxswap-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'A funding dislocation typically appears first in which market?',
          options: [
            'Spot exchange rates',
            'Swap points and the basis',
            'Equity indices',
            'Government bond yields',
          ],
          correctIndex: 1,
          explanation:
            'Spot can look calm while the cost of borrowing a currency for three months has doubled.',
        },
        {
          id: 'fxswap-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'An FX swap is priced off a view of where the exchange rate will go.',
          correctAnswer: false,
          explanation:
            'It is priced off the interest rate differential. The exchange rate view lives in an outright forward or a spot position.',
        },
        {
          id: 'fxswap-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Who are the heaviest users of FX swaps?',
          options: [
            'Retail traders',
            'Bank treasuries and other managers of short-term currency funding',
            'Pension schemes hedging liabilities',
            'Commodity producers',
          ],
          correctIndex: 1,
          explanation:
            'It is a funding instrument, and its volume reflects the size of the funding problem rather than of the FX view.',
        },
      ],
    },
  },
  {
    id: 'ndf',
    categoryId: 'fx',
    name: 'Non-Deliverable Forward',
    hook: 'A cash-settled forward for restricted currencies',
    summary:
      'A forward on a currency that cannot leave its own borders. The economics are those of an ordinary forward — a rate agreed today for a date in the future — but nothing is ever delivered in the restricted currency. Instead the two sides compare their agreed rate with an official fixing on the fixing date and settle the difference as a single payment in a convertible currency, almost always US dollars. That one design change is what lets an offshore investor take a position in a currency it is not permitted to hold.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A non-deliverable forward is an FX forward that never delivers the underlying currency. At maturity the parties settle the difference between the agreed rate and an official fixing, paid in a convertible currency such as US dollars.',
        callout:
          'The deepest NDF markets are in the Korean won, Indian rupee, Brazilian real and Taiwan dollar, and the overwhelming majority settle in US dollars.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Two parties agree a rate on a notional amount. On the fixing date an official reference rate is published; whichever side is out of the money pays the difference in dollars. Where the notional is a dollar amount and the pair is quoted as units of the restricted currency per dollar, the payment is notional × (fixing − contract rate) ÷ fixing — the gain arises in the restricted currency and is converted to dollars at the same fixing that produced it. The restricted currency itself never moves.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Many emerging-market currencies sit behind capital controls that block delivery offshore. NDFs let companies and investors hedge or take positions in those currencies without local bank accounts or regulatory approval.',
        callout:
          'The market shrinks as controls ease. Renminbi NDF volumes fell away once a deliverable offshore renminbi market (CNH) developed and gave participants a way to settle physically.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The fixing rate and its source (often a central bank or an industry benchmark), the settlement currency, the notional, and the gap between the fixing date and the settlement date a day or two later. That gap exists so the payment can be calculated once the fixing has printed.',
        callout:
          'Fixing sources are named in the confirmation rather than invented per trade — USD/BRL settles against PTAX, published by the Banco Central do Brasil, and the market works from standard EMTA template terms.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The official fixing can differ from the rate a firm actually achieves onshore, leaving basis risk in the hedge. Fixings can also be suspended or redefined during a currency crisis, at which point documented fallbacks decide what the trade pays, and liquidity in these markets thins out quickly under stress.',
      },
    ],
    keyTerms: [
      {
        term: 'Fixing rate',
        definition:
          'The official reference rate published on the fixing date, against which the contract rate is compared.',
      },
      {
        term: 'Fixing source',
        definition:
          'The named publisher of that rate, such as a central bank or an industry benchmark administrator.',
      },
      {
        term: 'Settlement currency',
        definition:
          'The convertible currency the net difference is paid in, most often US dollars.',
      },
      {
        term: 'Fixing date',
        definition:
          'The date the reference rate is observed, normally a day or two before the cash actually settles.',
      },
      {
        term: 'Restricted currency',
        definition:
          'The currency the contract references but never delivers, because capital controls block offshore settlement.',
      },
      {
        term: 'Basis risk',
        definition:
          'The residual exposure left when the fixing differs from the rate the hedger transacts at onshore.',
      },
    ],
    example: {
      title: 'Hedging a Brazilian bond position',
      lines: [
        'A fund holds BRL 52,000,000 of Brazilian local bonds. In USD/BRL the dollar is the base currency, so the rate is reais per dollar.',
        'Spot is 5.2000, so the position is worth $10,000,000. The fund buys $10,000,000 of a one-month USD/BRL NDF at 5.2000 — long dollars, short reais. The contract rate is simplified to spot to keep the arithmetic clear; a real one-month NDF prints above spot, because Brazilian interest rates sit well above dollar rates.',
        'At the fixing the rate is 5.4000, so the bonds are now worth BRL 52,000,000 ÷ 5.4000 = $9,629,630.',
        'The NDF pays $10,000,000 × (5.4000 − 5.2000) ÷ 5.4000 = $370,370, settled in dollars.',
        'The hedged position is worth $9,629,630 + $370,370 = $10,000,000, unchanged in dollar terms.',
      ],
      takeaway:
        'No reais ever change hands. The profit arises as BRL 2,000,000 and is converted into dollars at the same 5.4000 fixing that created it, which is why the payment is $370,370 and not the $384,615 that BRL 2,000,000 would have been worth at the original 5.2000 rate.',
    },
    inPractice:
      'Exporters and importers dealing with Brazil, India, Korea or Taiwan use NDFs to hedge invoices they cannot settle offshore, and emerging-market bond funds use them to strip currency risk out of local-currency debt they already hold. Macro funds are heavy users too, because for an offshore account an NDF is often the only practical way to take a position in a currency it is not allowed to own.',
    relatedProductIds: ['fxfwd', 'fxswap', 'fra'],
    quiz: [
      {
        id: 'ndf-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'An NDF settles without ever delivering the restricted currency.',
        correctAnswer: true,
        explanation:
          'Only a net cash difference changes hands — which is what “non-deliverable” means.',
      },
      {
        id: 'ndf-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'An NDF is settled in the restricted local currency.',
        correctAnswer: false,
        explanation:
          'Settlement is in a convertible currency, most often US dollars. The restricted currency is only a reference.',
      },
      {
        id: 'ndf-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What changes hands when an NDF settles?',
        options: [
          'The full notional in both currencies, as in a deliverable forward',
          'The notional in the restricted currency only',
          'A net cash difference, paid in a convertible currency such as US dollars',
          'Nothing — the contract simply expires',
        ],
        correctIndex: 2,
        explanation:
          'One payment, in the settlement currency, equal to the difference between the contract rate and the fixing.',
      },
      {
        id: 'ndf-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The settlement amount depends on an official fixing rate published on the fixing date.',
        correctAnswer: true,
        explanation:
          'The fixing is compared with the contract rate to decide who pays and how much.',
      },
      {
        id: 'ndf-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A fund is long $10,000,000 of a USD/BRL NDF struck at 5.2000 and the fixing prints 5.4000. What does it receive?',
        options: [
          'BRL 2,000,000, paid in reais',
          '$384,615 — BRL 2,000,000 converted at 5.2000',
          '$370,370 — BRL 2,000,000 converted at 5.4000',
          '$200,000',
        ],
        correctIndex: 2,
        explanation:
          '$10,000,000 × (5.4000 − 5.2000) ÷ 5.4000 = $370,370. The gain is a real amount, converted at the fixing, and it is never paid in reais.',
      },
      {
        id: 'ndf-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'In notional × (fixing − contract rate) ÷ fixing, why divide by the fixing?',
        options: [
          'Because the gain arises in the restricted currency and is converted at that same fixing',
          'Because the notional is always quoted in the restricted currency',
          'Because settlement falls a day or two after the fixing date',
          'Because the fixing blends onshore and offshore rates',
        ],
        correctIndex: 0,
        explanation:
          'The difference between the two rates is an amount of the restricted currency; dividing by the fixing turns it into the settlement currency.',
      },
      {
        id: 'ndf-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'NDFs are typically used for currencies subject to capital controls.',
        correctAnswer: true,
        explanation:
          'They give exposure where delivery offshore is restricted, without needing local accounts or approvals.',
      },
      {
        id: 'ndf-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why would an offshore investor use an NDF rather than a deliverable forward?',
        options: [
          'NDFs are cheaper because they carry no counterparty risk',
          'Local rules restrict delivery of the currency offshore, so it cannot be settled physically',
          'NDFs are exchange-traded and therefore more liquid',
          'Deliverable forwards cannot be written beyond one month',
        ],
        correctIndex: 1,
        explanation:
          'The constraint is regulatory, not commercial. An NDF still carries counterparty risk like any other OTC trade.',
      },
      {
        id: 'ndf-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The fixing date and the settlement date of an NDF are the same day.',
        correctAnswer: false,
        explanation:
          'Settlement normally follows the fixing by a day or two, so the payment can be calculated once the rate has printed.',
      },
      {
        id: 'ndf-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which detail must an NDF confirmation specify that a deliverable forward does not?',
        options: [
          'The notional amount',
          'The value date',
          'The contract rate',
          'The fixing source and the settlement currency',
        ],
        correctIndex: 3,
        explanation:
          'Notional, value date and rate appear in any forward. Only a cash-settled trade needs to name the rate it fixes against and the currency it pays in.',
      },
      {
        id: 'ndf-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'An NDF removes all basis risk for a company hedging local-currency cash flows.',
        correctAnswer: false,
        explanation:
          'The official fixing can differ from the rate the firm actually transacts at onshore, and that gap is basis risk.',
      },
      {
        id: 'ndf-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What happens to an NDF hedge if the official fixing is suspended during a currency crisis?',
        options: [
          'The trade settles automatically at the original contract rate',
          'The trade converts into a deliverable forward',
          'Documented fallbacks decide the outcome, which may not be what the hedger expected',
          'A clearing house guarantees a replacement fixing',
        ],
        correctIndex: 2,
        explanation:
          'Disruption provisions in the confirmation take over — postponing valuation or naming an alternative rate — and the result can differ from the onshore rate the firm was hedging.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'The fixing is the contract',
          content:
            'A deliverable forward settles by exchanging currencies, so the rate at maturity matters only as a comparison. A non-deliverable forward settles in cash against a published fixing, which makes that fixing the entire payoff. The contract therefore names its source precisely — which page, published by whom, at what time, and what happens if it is not published that day. Disruption fallbacks matter here in a way they never do for a deliverable trade: a fixing that fails to appear is not an inconvenience, it is an unpriceable contract until the fallback resolves it.',
          callout:
            'Two otherwise identical trades referencing different fixings for the same currency are different instruments, and the basis between them is real.',
        },
        {
          title: 'Onshore, offshore, and the gap between them',
          content:
            'These contracts exist because a currency cannot be freely moved across a border, which means there are effectively two markets: the onshore rate, subject to local rules and access, and the offshore rate implied by these contracts. They usually track each other and they need not. When capital controls tighten or local liquidity dries up, the gap widens — and a hedge referencing the offshore fixing does not protect a business whose costs settle onshore. That divergence is the residual risk of the whole instrument.',
        },
        {
          title: 'Settlement currency and its own exposure',
          content:
            'Because settlement is in a hard currency, usually dollars, the payoff is a dollar amount computed from a rate. That introduces a second-order effect: the size of the dollar payment depends on the same rate that determines whether there is a payment at all, so the payoff is not linear in the fixing. Small at ordinary levels and material when a currency moves a long way — which is exactly when these contracts are called on.',
          callout:
            'It is the same shape as the FRA’s discounting non-linearity: a payoff divided by the thing that created it is never quite a straight line.',
        },
      ],
      quiz: [
        {
          id: 'ndf-d1',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'The published fixing is the entire payoff of a non-deliverable forward.',
          correctAnswer: true,
          explanation:
            'Nothing is exchanged, so the contract turns entirely on the rate the named source publishes.',
        },
        {
          id: 'ndf-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What must the contract specify about the fixing?',
          options: [
            'Only the currency pair',
            'The source, the time, and what happens if it is not published',
            'The counterparty’s internal rate',
            'The average of the trading day',
          ],
          correctIndex: 1,
          explanation:
            'A fixing that fails to appear leaves an unpriceable contract until the fallback resolves it.',
        },
        {
          id: 'ndf-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Two trades on the same currency referencing different fixings are effectively the same instrument.',
          correctAnswer: false,
          explanation:
            'They are different instruments, and the basis between the fixings is a real exposure.',
        },
        {
          id: 'ndf-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Why do non-deliverable forwards exist at all?',
          options: [
            'Because the currencies are too volatile to deliver',
            'Because the currency cannot be freely moved across the border',
            'Because they are cheaper to clear',
            'Because they avoid the need for a forward curve',
          ],
          correctIndex: 1,
          explanation:
            'Restricted convertibility creates an offshore market that settles in cash instead.',
        },
        {
          id: 'ndf-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'The onshore and offshore rates for a restricted currency always track each other closely.',
          correctAnswer: false,
          explanation:
            'They usually do and need not. Tightening controls or thin local liquidity widen the gap.',
        },
        {
          id: 'ndf-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A company’s costs settle onshore and its hedge references the offshore fixing. What has it kept?',
          options: [
            'Nothing — the hedge is complete',
            'The gap between the onshore and offshore rates',
            'Only counterparty risk',
            'The interest rate differential',
          ],
          correctIndex: 1,
          explanation:
            'That divergence is the residual risk of the entire instrument, and it widens precisely under stress.',
        },
        {
          id: 'ndf-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The payoff of a non-deliverable forward is exactly linear in the fixing rate.',
          correctAnswer: false,
          explanation:
            'The settlement amount is computed in a hard currency using the same rate that decides the payment, which bends it slightly.',
        },
        {
          id: 'ndf-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'When does that non-linearity become material?',
          options: [
            'When the currency moves a long way',
            'When interest rates are negative',
            'When the contract is cleared',
            'When settlement is in the restricted currency',
          ],
          correctIndex: 0,
          explanation:
            'Which is exactly the scenario these contracts are bought for.',
        },
        {
          id: 'ndf-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Settlement is normally made in a freely convertible currency such as the dollar.',
          correctAnswer: true,
          explanation:
            'That is what makes the contract deliverable at all when the referenced currency is not.',
        },
        {
          id: 'ndf-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What is a disruption fallback for?',
          options: [
            'Reducing the credit exposure of the trade',
            'Deciding the rate when the named fixing is not published',
            'Allowing early termination for convenience',
            'Converting the trade to a deliverable forward',
          ],
          correctIndex: 1,
          explanation:
            'It converts an unpriceable contract into a priced one, which is why the clause is negotiated rather than assumed.',
        },
        {
          id: 'ndf-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'A deliverable forward depends on its fixing as much as a non-deliverable one does.',
          correctAnswer: false,
          explanation:
            'It settles by exchanging currencies, so the fixing is a comparison rather than the payoff.',
        },
        {
          id: 'ndf-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What should a treasurer check first when hedging a restricted currency?',
          options: [
            'Whether the fixing referenced matches where their exposure actually settles',
            'Whether the dealer is a local bank',
            'Whether the contract is quoted in points or outright',
            'Whether the tenor is standard',
          ],
          correctIndex: 0,
          explanation:
            'Everything else is priceable. A mismatched fixing is a hedge that can fail exactly when it is needed.',
        },
      ],
    },
  },
  {
    id: 'xccy',
    categoryId: 'fx',
    name: 'Cross-Currency Swap',
    hook: 'Exchange principal and interest across two currencies',
    summary:
      'The longer-dated relative an FX swap’s own glossary already points to. An FX swap exchanges principal now and reverses it later and nothing else; a cross-currency swap does the same two exchanges of principal but adds interest, paid on each side’s notional in its own currency, for every period in between. It is the standard way a genuine multi-year currency funding need is hedged, and the market for it prices something covered interest rate parity says should not exist at all: the cross-currency basis.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A cross-currency swap exchanges principal in two currencies at inception and exchanges it back at maturity, and pays interest on each side’s notional in its own currency for every period in between. An FX swap does the first and last part — two exchanges of principal — but never touches the interest in the middle; a cross-currency swap adds that interest, which is what makes it the natural instrument for a funding need lasting years rather than months.',
        callout:
          'In the plain structure, notional is exchanged at the rate agreed at inception, not at spot on the day it is exchanged back — a five-year swap struck at 1.2500 returns exactly $1.2500 per euro at maturity, however far spot has actually moved by then.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Each side pays interest on its own notional in its own currency — fixed or floating on either leg, so a swap can be fixed-for-fixed, fixed-for-floating or floating-for-floating. The floating-for-floating version is what the market usually calls a cross-currency basis swap, and its price is not a rate but a spread added to one of the two floating legs — the cross-currency basis. Because the principal exchanged at inception is fixed at that day’s rate, a long-dated trade can see the two sides’ dollar value drift a long way apart as spot moves, building up exposure on the eventual re-exchange that a same-currency interest rate swap never carries at all.',
        callout:
          'The market’s most heavily traded interdealer structure, common on USD/JPY, controls that drift with mark-to-market resets: part of the notional is refreshed to the current spot rate at each period end, so the outstanding exchange never gets too far from today’s rate.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A cross-currency swap turns a bond raised in the “wrong” currency into cash flows in the currency actually needed. A US company that can borrow more cheaply in euros — because euro credit spreads are simply tighter that week, or its name is better known there — issues a euro bond and swaps the proceeds and the coupons back into dollars: a reverse Yankee, the mirror of a foreign issuer borrowing dollars directly in the US market. Whether that route beats borrowing dollars outright depends entirely on the basis: a favourable one makes the swap-adjusted euro cost cheaper than a straight dollar bond, and when it does not, the arbitrage closes and reverse Yankee issuance dries up. Insurers and pension funds run a parallel trade for portfolio reasons rather than funding cost: a Japanese life insurer buying US Treasuries for yield swaps the dollar coupons and principal back into yen, leaving a hedged, yen-funded asset that still earns the higher dollar yield — one of the largest and steadiest sources of demand behind the USD/JPY basis.',
        callout:
          'Research by Wenxin Du, Alexander Tepper and Adrien Verdelhan, published in the Journal of Finance in 2018, found the post-2008 dollar basis could not be explained by credit risk or transaction costs, and that it was strongest exactly around quarter-ends — when the trades sit heaviest on banks’ balance sheets for regulatory reporting — pointing to the cost of the leverage ratio itself as the reason the arbitrage stays open.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Notional exchange, the cross-currency basis, and covered interest rate parity — the no-arbitrage relationship the basis persistently violates — sit at the centre of it. Around them are the mark-to-market reset that manages long-dated credit exposure, and the reverse Yankee trade that is one of the clearest reasons the basis exists at all. Fixed-for-fixed, fixed-for-floating and floating-for-floating variants all trade under the same broad name; only the floating-for-floating version is, strictly, the basis swap.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The principal re-exchange at maturity carries real credit exposure precisely because the rate was fixed years earlier: if spot has moved a long way and a counterparty defaults, replacing its side of that exchange can cost a great deal. The basis itself is not fixed either — it can move against an open position long before either principal exchange is due — and both legs still carry the interest rate risk of their own currency throughout the trade’s life.',
        callout:
          'The EUR/USD three-month basis fell to roughly −130 to −150bp at the worst of the 2008 crisis, from levels close to zero before it — dollar funding through the swap market became extremely expensive exactly when banks needed dollars most. The Federal Reserve’s dollar swap lines with other major central banks, first opened that year, exist to relieve exactly that stress by supplying dollars outside the market that was failing.',
      },
    ],
    keyTerms: [
      {
        term: 'Notional exchange',
        definition:
          'The exchange of principal in both currencies at inception, and back again at maturity — the feature that separates a cross-currency swap from a same-currency interest rate swap.',
      },
      {
        term: 'Cross-currency basis',
        definition:
          'The spread added to one floating leg of a floating-for-floating cross-currency swap, which covered interest rate parity implies should be zero and, for the dollar since 2008, persistently is not.',
      },
      {
        term: 'Covered interest rate parity',
        definition:
          'The no-arbitrage relationship implying that the interest rate differential between two currencies should already be fully reflected in forward points, leaving no room for an extra spread.',
      },
      {
        term: 'Mark-to-market reset',
        definition:
          'A periodic true-up of part of the notional to the current spot rate, used on longer-dated swaps to stop the eventual re-exchange from building up outsized credit exposure.',
      },
      {
        term: 'Reverse Yankee',
        definition:
          'A bond issued by a US company in a foreign currency, most often euros, and swapped back into dollars — the mirror of a Yankee bond, in which a foreign issuer borrows dollars in the US market.',
      },
      {
        term: 'Cross-currency basis swap',
        definition:
          'The floating-for-floating structure specifically, as distinct from the fixed-for-fixed and fixed-for-floating variants that also trade under the broader cross-currency swap name.',
      },
    ],
    example: {
      title: 'A German company reaches for dollars through euros',
      lines: [
        'A German company needs $500,000,000 to fund a US acquisition. EUR/USD spot is 1.2500.',
        'Rather than borrow dollars directly, it issues a five-year €400,000,000 bond at its own euro credit spread of 3.00%.',
        'It enters a five-year cross-currency swap, paying away the €400,000,000 bond proceeds at inception and receiving the $500,000,000 it actually needs — €400,000,000 × 1.2500 = $500,000,000.',
        'Each year it receives €12,000,000 fixed from the swap, exactly the coupon it owes its euro bondholders, and pays $24,000,000 fixed in return — a 4.80% all-in dollar rate.',
        'A straight five-year dollar bond, at the company’s wider dollar credit spread, would have cost 5.00%, or $25,000,000 a year.',
        'At maturity the swap reverses: the company pays back $500,000,000 and receives back €400,000,000, which it uses to redeem the euro bond.',
      ],
      takeaway:
        'The swap turns a 3.00% euro coupon into a 4.80% all-in dollar cost, still 20 basis points cheaper than borrowing dollars outright — $1,000,000 a year, or $5,000,000 across the life of the bond before discounting. Nothing about the acquisition, the euro bond or the dollars raised needed the company to have any natural dollar income at all.',
    },
    inPractice:
      'Corporates issuing bonds in whichever currency offers the tightest spread, then swapping the proceeds home, are the routine end-user flow — reverse Yankees from US issuers alongside the equivalent trade run by European and Asian companies borrowing dollars. Life insurers and pension funds, particularly in Japan and Taiwan, run some of the largest positions, hedging foreign-currency bond portfolios back into their own currency for years at a time. Dealers run a basis book because supply and demand for each pair’s long-dated funding rarely balance, and that imbalance is what the basis is actually pricing.',
    relatedProductIds: ['fxswap', 'irs', 'basisswap'],
    quiz: [
      {
        id: 'xccy-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A cross-currency swap exchanges principal in both currencies, at inception and again at maturity.',
        correctAnswer: true,
        explanation:
          'That two-way exchange of principal is what separates it from a same-currency interest rate swap, where notional is only a reference amount.',
      },
      {
        id: 'xccy-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An FX swap and a cross-currency swap are the same instrument under two names.',
        correctAnswer: false,
        explanation:
          'An FX swap exchanges principal twice and nothing in between; a cross-currency swap adds interest payments on each side’s notional for the whole life of the trade.',
      },
      {
        id: 'xccy-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'Which two dates see principal actually exchanged in a plain cross-currency swap?',
        options: [
          'Only at maturity',
          'Only at inception',
          'At inception and at maturity',
          'On every interest payment date',
        ],
        correctIndex: 2,
        explanation:
          'Principal moves twice — out and back — with only interest changing hands on the dates in between.',
      },
      {
        id: 'xccy-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The exchange rate used to reverse the principal at maturity is the spot rate prevailing on that day.',
        correctAnswer: false,
        explanation:
          'It is the same rate agreed at inception on both occasions, which is exactly why a large FX move before maturity can build up significant credit exposure on the final exchange.',
      },
      {
        id: 'xccy-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'What is priced by a floating-for-floating cross-currency swap?',
        options: [
          'An outright view on which currency will appreciate',
          'A spread added to one floating leg — the cross-currency basis',
          'The forward points, exactly as in an FX swap',
          'A fixed coupon on the smaller of the two notionals',
        ],
        correctIndex: 1,
        explanation:
          'Both legs still float with their own currency’s rates; what is quoted, and what moves, is the spread on top.',
      },
      {
        id: 'xccy-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'What does a mark-to-market reset do on a long-dated cross-currency swap?',
        options: [
          'It cancels the swap if the exchange rate moves beyond an agreed barrier',
          'It resets the fixed rate on the swap to the prevailing market rate each quarter',
          'It periodically refreshes part of the notional to the current spot rate, limiting the credit exposure that would otherwise build up',
          'It converts a floating-floating swap into a fixed-fixed one at each reset date',
        ],
        correctIndex: 2,
        explanation:
          'Without it, a notional fixed at the inception rate can drift a long way from its current FX value over a multi-year trade.',
      },
      {
        id: 'xccy-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A reverse Yankee is a bond issued by a US company in a foreign currency, swapped back into dollars.',
        correctAnswer: true,
        explanation:
          'It is the mirror of an ordinary Yankee bond, in which a foreign issuer borrows dollars directly in the US market.',
      },
      {
        id: 'xccy-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why do Japanese life insurers run large cross-currency swap positions against US Treasury holdings?',
        options: [
          'To speculate on a stronger yen',
          'To avoid Japanese withholding tax on the coupons',
          'Because Japanese regulation prohibits holding unhedged foreign bonds outright',
          'To hedge the dollar coupons and principal back into yen, leaving a yen-funded, hedged dollar-yield asset',
        ],
        correctIndex: 3,
        explanation:
          'It is a portfolio hedge, not a currency view — one of the largest and steadiest sources of demand behind the USD/JPY basis.',
      },
      {
        id: 'xccy-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Covered interest rate parity says the cross-currency basis should be zero.',
        correctAnswer: true,
        explanation:
          'In frictionless markets the interest differential and the forward points would already account for everything, leaving no room for an extra spread. Since 2008 they persistently have not.',
      },
      {
        id: 'xccy-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'What did research into the post-2008 dollar basis find?',
        options: [
          'That it is strongest around quarter-ends, pointing to the cost of bank balance sheet regulation as the reason it persists',
          'That it disappears once credit risk and transaction costs are properly accounted for',
          'That it only affects emerging-market currency pairs',
          'That it was fully closed by the introduction of central clearing',
        ],
        correctIndex: 0,
        explanation:
          'The deviation showed up hardest exactly when the trades sat heaviest on banks’ balance sheets for regulatory reporting.',
      },
      {
        id: 'xccy-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'The principal re-exchange at maturity carries no credit exposure, because both sides agreed the rate at inception.',
        correctAnswer: false,
        explanation:
          'Agreeing the rate in advance is exactly what creates the exposure — if spot has moved a long way, replacing a defaulted counterparty’s side of that exchange can cost a great deal.',
      },
      {
        id: 'xccy-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What happened to the EUR/USD basis at the worst of the 2008 crisis?',
        options: [
          'It stayed close to zero throughout',
          'It turned positive, making dollars cheap to borrow via the swap market',
          'It fell to roughly −130 to −150bp, before central bank dollar swap lines helped compress it back',
          'It was suspended by regulators until 2009',
        ],
        correctIndex: 2,
        explanation:
          'Dollar funding through the swap market became extremely expensive exactly when banks needed dollars most, which is why the Federal Reserve opened swap lines with other central banks to supply dollars outside that market.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Notionals really are exchanged',
          content:
            'Unlike a single-currency swap, a cross-currency swap usually exchanges principal at the start and returns it at maturity. That changes the risk profile completely: the exposure is not just a stream of interest differences but the full notional at the final exchange, valued at whatever the exchange rate has become. A ten-year swap on a hundred million is a hundred million of currency risk sitting at the end of it, which is why these trades dominate the counterparty exposure of a cross-border funding book.',
          callout:
            'The initial exchange is what makes it a funding instrument. The final exchange is what makes it a credit problem.',
        },
        {
          title: 'Resetting the mark to market',
          content:
            'To manage that, the market developed a version where one notional is re-fixed periodically to the prevailing exchange rate, with the difference settled in cash. Exposure is reset to near zero at each period rather than accumulating over ten years. The trade-off is operational and it changes who bears what: the resetting leg’s notional now varies, which suits a bank managing counterparty exposure and complicates life for a borrower who wanted a fixed liability in its own currency.',
        },
        {
          title: 'Why a borrower uses one',
          content:
            'The typical user is an issuer who can raise debt cheaply in a currency it does not need. It issues where the demand is and swaps the proceeds into the currency it actually spends, matching both the principal and the coupons. The whole trade is a funding arbitrage: raise where you are wanted, spend where you operate, and let the swap carry the currency. The residual is the basis, which is the price of that convenience and the reason the arbitrage is smaller than the headline coupon suggests.',
          callout:
            'The "reverse Yankee" pattern — US companies issuing in euros and swapping back — is this trade run at scale, and it moves with the basis rather than with anyone’s currency view.',
        },
      ],
      quiz: [
        {
          id: 'xccy-d1',
          kind: 'boolean',
          step: 1,
          difficulty: 'foundational',
          prompt:
            'A cross-currency swap normally exchanges principal at the start and again at maturity.',
          correctAnswer: true,
          explanation:
            'Which is what distinguishes it from a single-currency swap, where notional is only a reference.',
        },
        {
          id: 'xccy-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does the final exchange of principal create?',
          options: [
            'A large currency exposure at maturity',
            'An interest rate exposure only',
            'A reduction in counterparty risk',
            'An obligation to deliver physically',
          ],
          correctIndex: 0,
          explanation:
            'The full notional, valued at whatever the rate has become — which dominates the counterparty exposure of these books.',
        },
        {
          id: 'xccy-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'The exposure on a cross-currency swap is limited to the interest differences exchanged.',
          correctAnswer: false,
          explanation:
            'The final principal exchange is the larger part, and it grows with how far the rate has travelled.',
        },
        {
          id: 'xccy-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does a mark-to-market cross-currency swap do?',
          options: [
            'Fixes both notionals for the whole term',
            'Re-fixes one notional periodically and settles the difference in cash',
            'Removes the interest legs entirely',
            'Converts the trade into two separate loans',
          ],
          correctIndex: 1,
          explanation:
            'Exposure resets to near zero each period instead of accumulating over the life of the trade.',
        },
        {
          id: 'xccy-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt: 'The resetting version is unambiguously better for both parties.',
          correctAnswer: false,
          explanation:
            'It suits a bank managing counterparty exposure and complicates life for a borrower who wanted a fixed liability.',
        },
        {
          id: 'xccy-d6',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'Why does an issuer typically enter one of these?',
          options: [
            'To speculate on the exchange rate',
            'To raise debt where demand is strongest and convert it into the currency it spends',
            'To avoid paying a coupon',
            'To shorten the maturity of its debt',
          ],
          correctIndex: 1,
          explanation:
            'Issue where you are wanted, spend where you operate, and let the swap carry the currency.',
        },
        {
          id: 'xccy-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'The swap is arranged to match both the principal and the coupons of the debt it converts.',
          correctAnswer: true,
          explanation:
            'Otherwise the issuer has converted its funding and kept a currency exposure on the payments.',
        },
        {
          id: 'xccy-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What determines how attractive that funding arbitrage is?',
          options: [
            'The cross-currency basis',
            'The credit rating of the issuer alone',
            'The volatility of the currency pair',
            'The maturity of the swap',
          ],
          correctIndex: 0,
          explanation:
            'The basis is the price of the convenience, and it is why the saving is smaller than the coupon difference suggests.',
        },
        {
          id: 'xccy-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Issuance patterns such as US companies borrowing in euros move with the basis rather than with a currency view.',
          correctAnswer: true,
          explanation:
            'It is a funding decision. When the basis moves, the flow moves with it.',
        },
        {
          id: 'xccy-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Why do these trades dominate counterparty exposure in a cross-border book?',
          options: [
            'Because they are rarely collateralised',
            'Because the final principal exchange is a large, long-dated currency exposure',
            'Because they cannot be netted',
            'Because they are always uncleared',
          ],
          correctIndex: 1,
          explanation:
            'Ten years of drift in an exchange rate applied to a full notional is a much larger number than the coupons.',
        },
        {
          id: 'xccy-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Resetting the notional periodically reduces counterparty exposure.',
          correctAnswer: true,
          explanation:
            'It is settled in cash at each reset instead of being allowed to accumulate.',
        },
        {
          id: 'xccy-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What makes the initial exchange significant?',
          options: [
            'It is what turns the trade into a funding instrument',
            'It removes the need for collateral',
            'It fixes the exchange rate for the coupons only',
            'It determines the credit rating of the swap',
          ],
          correctIndex: 0,
          explanation:
            'Money actually changes hands, which is what the issuer needed in the first place.',
        },
      ],
    },
  },
  {
    id: 'fxrr',
    categoryId: 'fx',
    name: 'Risk Reversal',
    hook: 'Sell an option to fund the one you actually want',
    summary:
      'Every option in this catalogue has so far been priced as if volatility were one flat number. A risk reversal is where that stops being true. It is both a trading structure — buy one option and sell another, opposite type, same expiry, most often sized so the premiums roughly cancel — and the market’s standard way of quoting how lopsided volatility actually is: the implied vol of a call minus the implied vol of a put at the same delta. One instrument, two jobs, and both come from the same asymmetry.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A risk reversal combines buying one option and selling another of the opposite type — a call against a put — on the same underlying and the same expiry, usually at strikes equidistant from the money in delta terms. As a hedge it is most often built so the premium received on the sold leg roughly offsets the premium paid on the bought one: a zero-cost collar. As a market quote, the same two-legged structure is how dealers state the shape of the volatility smile in a single number.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'A risk reversal trades in two forms that share one mechanism. As a hedge, a corporate buys an option in the direction it needs protecting and sells one in the direction it is prepared to give up. As a quote, the risk reversal for a given delta and tenor is stated as the vol of the call minus the vol of the put at that delta: a positive 25-delta EUR/USD risk reversal means 25-delta EUR calls trade at a higher implied volatility than 25-delta EUR puts, and that single number is the market’s shorthand for which side of the distribution carries the fatter tail.',
        callout:
          'Buying a risk reversal conventionally means buying the call and selling the put on the base currency — a bullish structure, financed in whole or in part by the premium received on the put.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Corporate treasurers use a zero-cost collar to remove the premium cost of a vanilla option hedge, at the price of capping the upside a plain forward would already have given up in full. A risk reversal skewed the other way is a cheap way to buy convexity, giving up little premium for exposure to a large move. Desks and macro funds trade risk reversals as a pure view on skew, buying the side of the smile they think is underpriced without taking on a large outright directional position, and the quote itself is read as a barometer of hedging flow and positioning — a market persistently paying up for downside protection is signalling where the crowd’s fear actually sits.',
        callout:
          'The same idea is familiar from equity markets, which trade with a persistent put skew reflecting demand for crash protection. FX skew is not fixed in one direction the way equity skew usually is — it can sit on either side, and which side depends on the pair and what is being hedged.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The risk reversal quote, the zero-cost collar it funds, and the volatility skew it measures are the core of it. The 25-delta convention names a strike by its delta rather than its rate, so quotes stay comparable as spot moves, and premium financing is simply the mechanism — the premium collected on one leg pays for the other.',
        callout:
          'The vol surface’s third standard point, alongside at-the-money vol and the risk reversal, is the butterfly — the average of the call and put vol at a given delta relative to the at-the-money level, which prices convexity rather than skew. Together the three let a whole smile be reconstructed from a handful of quoted points.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium collected on the sold leg is not free money: it is compensation for an obligation that can turn deeply against the seller, and a corporate that sold a call to fund its put gives up every dollar of upside beyond the cap, not just the premium a vanilla option would have cost. “Zero-cost” describes the premium, not the risk — the position still carries the full open-ended exposure of the leg that was sold. And the skew itself moves: an event that suddenly raises demand for downside protection can shift the risk reversal sharply, marking an existing position long before either strike is ever tested.',
      },
    ],
    keyTerms: [
      {
        term: 'Risk reversal (quote)',
        definition:
          'The implied volatility of a call minus the implied volatility of a put at the same delta and tenor — the market’s standard shorthand for which side of the distribution carries the fatter tail.',
      },
      {
        term: 'Zero-cost collar',
        definition:
          'A risk reversal sized so the premium received on the sold option roughly offsets the premium paid on the bought one, for no net premium.',
      },
      {
        term: 'Volatility skew',
        definition:
          'The pattern of implied volatility across different strikes, which a flat single-number vol does not capture and a risk reversal is the standard way to measure.',
      },
      {
        term: '25-delta',
        definition:
          'The market’s usual reference point away from at-the-money, naming a strike by its delta rather than its rate so quotes stay comparable as spot moves.',
      },
      {
        term: 'Premium financing',
        definition:
          'Using the premium collected on the leg sold to fund some or all of the premium owed on the leg bought.',
      },
      {
        term: 'Delta',
        definition:
          'How much an option’s value changes for a small move in the spot rate, and the number the market uses to pick which strike a quoted risk reversal refers to.',
      },
    ],
    example: {
      title: 'An exporter collars a euro receivable at no premium',
      lines: [
        'A US exporter expects €20,000,000 in three months and wants downside protection without paying premium.',
        'It buys a three-month EUR put / USD call struck at 1.0600 and sells a three-month EUR call / USD put struck at 1.1200, each priced at 130 pips on €20,000,000 — $260,000 either way, so the net premium is zero.',
        'If spot fixes at 1.0300, it exercises its put and sells €20m at 1.0600 for $21,200,000, against $20,600,000 at market — the floor is worth $600,000.',
        'If spot fixes at 1.0900, neither option is in the money and it simply sells €20m at market for $21,800,000.',
        'If spot fixes at 1.1500, the call it sold is exercised against it: it must sell €20m at 1.1200 for $21,840,000, against the $23,000,000 it would have received unhedged — the cap costs $1,160,000.',
      ],
      takeaway:
        'The collar cost nothing upfront, but “zero-cost” describes the premium, not the risk: above 1.1200 the exporter hands back every dollar of upside beyond the cap. The floor and the cap were bought and sold in the same trade, and the price of one was exactly the price of the other.',
    },
    inPractice:
      'Corporate treasuries are the largest natural users, collaring receivables and payables to strip the premium cost out of a hedging programme without a cash outlay. Hedge funds and real-money managers trade risk reversals outright to express a skew view or as a capital-efficient way to buy convexity around an event, and every FX options desk quotes and risk-manages the 25-delta risk reversal as one of the three standard points — alongside at-the-money vol and the butterfly — that define its volatility surface for a given tenor.',
    relatedProductIds: ['fxopt', 'fxfwd', 'eqopt'],
    quiz: [
      {
        id: 'fxrr-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A risk reversal combines buying one option and selling another of the opposite type, on the same underlying and expiry.',
        correctAnswer: true,
        explanation:
          'One leg is a call and the other a put — that pairing across the two option types is what the name refers to.',
      },
      {
        id: 'fxrr-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A risk reversal always costs zero premium.',
        correctAnswer: false,
        explanation:
          'It can be structured at zero net premium — a zero-cost collar — but that is a choice of strikes, not a rule; a risk reversal can just as easily carry a net premium either way.',
      },
      {
        id: 'fxrr-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'In its most common corporate use, what does a risk reversal give a hedger?',
        options: [
          'Protection beyond one level, funded by giving up the benefit of a favourable move beyond another',
          'A right to exchange currency with no obligation on either side',
          'A fixed exchange rate, like a forward, with no premium either way',
          'A cash payment equal to the realised volatility over the period',
        ],
        correctIndex: 0,
        explanation:
          'One strike sets the floor, or cap, it is protected against; the other sets the level beyond which it has sold away the benefit.',
      },
      {
        id: 'fxrr-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'As a market quote, the risk reversal is the implied volatility of a call minus the implied volatility of a put at the same delta.',
        correctAnswer: true,
        explanation:
          'That single number is the standard way the market states which side of the smile — calls or puts — is bid up relative to the other.',
      },
      {
        id: 'fxrr-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A EUR/USD 25-delta risk reversal is quoted at a positive number. What does that mean?',
        options: [
          '25-delta EUR calls trade at a lower implied vol than 25-delta EUR puts',
          '25-delta EUR calls trade at a higher implied vol than 25-delta EUR puts',
          'The forward points are positive at the 25-delta tenor',
          'EUR/USD spot is above its 25-delta strike',
        ],
        correctIndex: 1,
        explanation:
          'The quote is call vol minus put vol at that delta; a positive number means the market pays up more for the calls.',
      },
      {
        id: 'fxrr-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Why does the FX market quote strikes by delta — a 25-delta put, say — rather than by the exchange rate itself?',
        options: [
          'Because delta is easier to convert to pips than a strike',
          'Because regulators require FX options to be quoted in delta',
          'Because a delta-referenced strike stays a comparable distance from at-the-money as spot moves, unlike a fixed rate',
          'Because delta is the only Greek that applies to a risk reversal',
        ],
        correctIndex: 2,
        explanation:
          'A strike quoted in rate terms goes stale as spot moves; a delta-referenced strike automatically stays a consistent distance from the money.',
      },
      {
        id: 'fxrr-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A zero-cost collar removes the premium cost of hedging by giving up part of the potential upside.',
        correctAnswer: true,
        explanation:
          'The premium on the sold leg pays for the premium on the bought leg — what is given up instead is the benefit beyond the sold strike.',
      },
      {
        id: 'fxrr-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'What does a persistently negative EUR/USD risk reversal — puts bid over calls — usually signal?',
        options: [
          'That EUR/USD spot is trending upward',
          'That euro interest rates exceed dollar interest rates',
          'That the pair has stopped trading options altogether',
          'That the market is paying up more for downside protection on the euro than for upside participation',
        ],
        correctIndex: 3,
        explanation:
          'It reads the same way whatever is driving it — more demand, or more nervousness, is sitting on the put side of the smile.',
      },
      {
        id: 'fxrr-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The 25-delta convention lets a strike stay a consistent distance from at-the-money as spot moves.',
        correctAnswer: true,
        explanation:
          'A fixed exchange-rate strike goes stale as spot drifts; a delta-referenced one does not.',
      },
      {
        id: 'fxrr-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'What does “premium financing” mean in the context of a risk reversal?',
        options: [
          'Borrowing the premium from the option seller and repaying it at expiry',
          'Using the premium collected on the sold leg to fund some or all of the premium owed on the bought leg',
          'Paying the premium in instalments across the life of the option',
          'Discounting the premium back to its present value using the funding curve',
        ],
        correctIndex: 1,
        explanation:
          'It is the mechanism that makes a zero-cost collar possible — one leg pays for the other.',
      },
      {
        id: 'fxrr-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Because a zero-cost collar has no net premium, the corporate that bought one carries no risk from the trade.',
        correctAnswer: false,
        explanation:
          'It carries the full open-ended exposure of the leg it sold — “zero-cost” describes the premium, not the risk.',
      },
      {
        id: 'fxrr-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A corporate sold a EUR call at 1.1200 to fund a EUR put it bought at 1.0600. Spot finishes at 1.1500. What has it given up?',
        options: [
          'Nothing — the collar guarantees the better of the two strikes',
          'The premium it originally paid for the put',
          'Every dollar of upside on its euro receivable beyond 1.1200',
          'The right to exercise the put it bought',
        ],
        correctIndex: 2,
        explanation:
          'The sold call is exercised against it at 1.1200, so it never participates in the move from there up to 1.1500.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Building a smile from three numbers',
          content:
            'The market quotes three things per maturity: the at-the-money volatility, the risk reversal and the butterfly. From those, a desk reconstructs volatilities at the 25-delta call and put — the call is the at-the-money plus the butterfly plus half the risk reversal, the put is the at-the-money plus the butterfly minus half of it — and interpolates the rest. That is the entire surface for a currency pair at that maturity: a level, a tilt and a curvature, from which every strike is derived.',
          callout:
            'The arithmetic runs both ways. Given three volatilities you can produce the quotes, which is how a desk checks whether a broker’s market is internally consistent.',
        },
        {
          title: 'What the skew is telling you, and what it is not',
          content:
            'A risk reversal is commonly read as positioning: a large negative number in a pair means the market is paying up for downside protection. That reading is not wrong and it is incomplete, because the same quote also reflects the cost of hedging the skew, the flow a dealer happens to be carrying, and the structural demand of hedgers who are not expressing a view at all. Currencies with persistent one-way hedging demand carry a persistent skew that says nothing about what anyone expects next week.',
        },
        {
          title: 'Term structure of the tilt',
          content:
            'Skew is quoted at each maturity, and the shape across maturities carries its own information. A short-dated risk reversal that spikes while the one-year barely moves is an event being priced — a vote, a decision, a deadline — rather than a change of view about the currency. Desks watch the difference between the two for that reason, and structures are built to sell the part that is expensive and keep the part that is not.',
          callout:
            'The 2015 Swiss franc episode is the cautionary tale: a suppressed spot rate kept every one of these numbers small, right up to the morning they meant nothing.',
        },
      ],
      quiz: [
        {
          id: 'fxrr-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Which three quotes describe an FX volatility surface at one maturity?',
          options: [
            'Spot, forward and volatility',
            'At-the-money, risk reversal and butterfly',
            'Delta, gamma and vega',
            'Call, put and straddle',
          ],
          correctIndex: 1,
          explanation:
            'A level, a tilt and a curvature — everything else at that maturity is derived from them.',
        },
        {
          id: 'fxrr-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'The 25-delta call volatility can be reconstructed from the at-the-money, butterfly and risk reversal quotes.',
          correctAnswer: true,
          explanation:
            'At-the-money plus butterfly plus half the risk reversal, with the put taking the other half.',
        },
        {
          id: 'fxrr-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'The arithmetic only runs one way: quotes to volatilities, never back.',
          correctAnswer: false,
          explanation:
            'It runs both ways, which is how a desk checks whether a broker’s market is internally consistent.',
        },
        {
          id: 'fxrr-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'What does a large negative risk reversal indicate most directly?',
          options: [
            'That downside protection is expensive relative to upside',
            'That the currency will fall',
            'That volatility is about to rise',
            'That the forward is in backwardation',
          ],
          correctIndex: 0,
          explanation:
            'It is a price. Reading it as a forecast skips several steps.',
        },
        {
          id: 'fxrr-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A persistent skew in a currency can reflect structural hedging demand rather than a market view.',
          correctAnswer: true,
          explanation:
            'One-way demand from hedgers who are not expressing an opinion still has to be priced by someone.',
        },
        {
          id: 'fxrr-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What else is embedded in a risk reversal besides positioning?',
          options: [
            'The cost of hedging the skew and the flow a dealer is carrying',
            'The interest rate differential',
            'The spot bid-offer spread',
            'The settlement convention',
          ],
          correctIndex: 0,
          explanation: 'Which is why it is a useful indicator and a poor forecast.',
        },
        {
          id: 'fxrr-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'A spike in short-dated skew with little change further out usually indicates a dated event being priced.',
          correctAnswer: true,
          explanation:
            'A vote or a decision moves the maturity that spans it and leaves the rest of the curve alone.',
        },
        {
          id: 'fxrr-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Why do desks watch the difference between short and long-dated skew?',
          options: [
            'To separate an event from a change of view',
            'To calculate the forward points',
            'To determine the premium currency',
            'To set the delta convention',
          ],
          correctIndex: 0,
          explanation:
            'And structures are then built to sell the expensive part and keep the rest.',
        },
        {
          id: 'fxrr-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'foundational',
          prompt: 'Skew is quoted separately at each maturity.',
          correctAnswer: true,
          explanation:
            'And the shape across maturities is itself information a desk trades on.',
        },
        {
          id: 'fxrr-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What did the 2015 Swiss franc episode demonstrate about these measures?',
          options: [
            'A suppressed spot rate keeps every volatility measure small until it does not',
            'Risk reversals are the most reliable predictor of a break',
            'Butterflies always widen before a policy change',
            'Skew is irrelevant to pegged currencies',
          ],
          correctIndex: 0,
          explanation:
            'Every number on the screen described a market that had been managed, not one that was safe.',
        },
        {
          id: 'fxrr-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A risk reversal quote is a forecast of the direction of the currency.',
          correctAnswer: false,
          explanation:
            'It is the relative price of two options. What it says about direction is inference, not content.',
        },
        {
          id: 'fxrr-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What does the butterfly quote add to the surface?',
          options: [
            'Curvature — how far the wings sit above the middle',
            'The level of at-the-money volatility',
            'The tilt between calls and puts',
            'The forward rate',
          ],
          correctIndex: 0,
          explanation:
            'Level from the at-the-money, tilt from the risk reversal, curvature from the butterfly.',
        },
      ],
    },
  },
];
