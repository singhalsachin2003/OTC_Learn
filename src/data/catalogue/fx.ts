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
  },
];
