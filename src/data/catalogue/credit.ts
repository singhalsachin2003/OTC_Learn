import type { Product } from '../types';

/** Credit products. Ids are stable — saved progress is keyed by them. */
export const creditProducts: Product[] = [
  {
    id: 'cds',
    categoryId: 'credit',
    name: 'Credit Default Swap',
    hook: 'Insurance against a borrower defaulting',
    summary:
      'A bilateral contract that pays out if a named borrower fails. One side buys protection on a reference entity and pays a premium for it; the other side sells that protection and pockets the premium until something goes wrong. It behaves like insurance, but neither party need own the underlying debt, and the buyer of protection is short credit risk — the position gains value as the market grows more worried about the name and loses value as that worry recedes.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'In a CDS, the protection buyer pays a periodic premium — quoted as a spread in basis points — to the protection seller, who pays out if a defined credit event occurs on a reference entity. The buyer is short credit risk: the contract gains value when the reference entity’s spread widens and loses value when it tightens. Nothing needs to be owned for this to work, and no bond changes hands at inception.',
        callout:
          'Buying protection behaves like shorting the reference entity’s bond, while selling protection is economically close to owning that bond on borrowed money.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The premium is paid quarterly on the notional for as long as nothing goes wrong. Since the market standardised in 2009, contracts do not pay the traded spread as their coupon: they carry a fixed coupon of 100 or 500 basis points, and the gap between that coupon and where the name actually trades is settled as a single upfront payment when the trade is struck. If a credit event occurs the contract terminates and the seller compensates the buyer for the loss — the notional multiplied by one minus the recovery rate, which is set by an industry-wide auction rather than negotiated between the two parties.',
        callout:
          'Coupons fall on 20 March, June, September and December and accrue ACT/360. Because the first coupon is paid in full, the seller rebates the buyer the amount accrued since the last of those dates when the trade settles.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'CDS let investors hedge credit risk on bonds or loans they hold, or take a view on a company’s creditworthiness without owning its debt. A bank can shrink its exposure to a borrower without selling the loan and damaging the relationship, and a fund can express a negative view on a company whose bonds are almost impossible to borrow and sell short. The contract is unfunded, so the position costs the upfront payment and margin rather than the price of a bond.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference entity, spread in basis points, notional, and the credit event definition — typically bankruptcy, failure to pay, or restructuring. Most contracts written today are governed by the 2014 ISDA Credit Derivatives Definitions, which added governmental intervention as a credit event for financial reference entities after bail-ins wrote down subordinated bank debt without a conventional default. An ISDA Determinations Committee rules on whether an event has actually occurred, and its decision binds every contract on that name.',
        callout:
          'Restructuring is not a trigger everywhere: North American corporate contracts normally trade without it, while European corporate contracts include it in a modified form.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Protection is only as good as the seller, and wrong-way risk arises when the seller’s own health is correlated with the reference entity. Disputes over what counts as a credit event have gone to court, and spreads move constantly, creating mark-to-market swings and margin calls long before any default happens. A hedge can also fail on the fine print — protection written on a holding company does not automatically respond to the bonds of an operating subsidiary.',
      },
    ],
    keyTerms: [
      {
        term: 'Reference entity',
        definition:
          'The borrower whose default the contract is written on, identified together with the debt that qualifies for settlement.',
      },
      {
        term: 'Protection buyer',
        definition:
          'The side paying the coupon and receiving the payout, which leaves it short the credit.',
      },
      {
        term: 'Standard coupon',
        definition:
          'The fixed 100bp or 500bp running premium that standardised contracts pay instead of the traded spread.',
      },
      {
        term: 'Upfront payment',
        definition:
          'The lump sum exchanged at inception that reconciles the fixed coupon with the level the name actually trades at.',
      },
      {
        term: 'Credit event',
        definition:
          'The defined trigger — bankruptcy, failure to pay, restructuring and, for financials, governmental intervention — that terminates the contract.',
      },
      {
        term: 'Auction final price',
        definition:
          'The single recovery price set by the industry auction, which every contract on that name settles against.',
      },
    ],
    example: {
      title: 'Buying protection on a $10m bond holding',
      lines: [
        'A fund owns $10m of a company’s five-year senior bonds and buys five-year protection on the same notional.',
        'The contract carries the standard 100bp coupon, but the name trades at 250bp.',
        'The buyer pays that 150bp gap upfront: about 1.5% × 4.5 years of risk-adjusted premium = 6.75 points, or $675,000.',
        'It then pays 100bp a year on $10m — roughly $25,000 each quarter.',
        'Two years later the company defaults and the auction sets a final price of 40.',
        'The seller pays (100 − 40)% × $10m = $6m and the contract terminates.',
      ],
      takeaway:
        'The defaulted bonds are worth $4m, and the $6m from the swap brings the fund back to roughly par — less the $675,000 upfront and the two years of coupons it paid to carry the protection.',
    },
    inPractice:
      'A bank that has lent more to one borrower than its limits allow buys protection to free up the line without selling the loan and upsetting a client; a credit fund buys protection on a name it thinks is deteriorating and never touches the bonds at all; insurers and asset managers sell protection to earn spread on credits they would happily own. Standard index contracts are subject to mandatory clearing in both the US and the EU, and dealers run large offsetting single-name books behind the scenes.',
    relatedProductIds: ['cdx', 'cln', 'irs'],
    quiz: [
      {
        id: 'cds-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A protection buyer is short credit risk and gains value as the reference entity’s spread widens.',
        correctAnswer: true,
        explanation:
          'Buying protection is a bearish credit position: it appreciates as the market prices in more default risk.',
      },
      {
        id: 'cds-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Which position is economically closest to owning the reference entity’s bond on borrowed money?',
        options: [
          'Buying protection on the entity',
          'Selling protection on the entity',
          'Buying protection on an index that contains the entity',
          'Paying the fixed leg of an interest rate swap',
        ],
        correctIndex: 1,
        explanation:
          'The protection seller earns a spread and takes the default loss without funding a purchase — a levered long in the credit.',
      },
      {
        id: 'cds-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'You must own the reference entity’s debt to buy CDS protection.',
        correctAnswer: false,
        explanation:
          'Nothing changes hands at inception and neither side need hold the underlying debt.',
      },
      {
        id: 'cds-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A standardised CDS pays the name’s traded spread as its running coupon.',
        correctAnswer: false,
        explanation:
          'It runs at a fixed 100bp or 500bp coupon; the difference from the traded level is settled upfront.',
      },
      {
        id: 'cds-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A name trades at 250bp but the contract carries the standard 100bp coupon. How is the difference handled?',
        options: [
          'The coupon is reset to 250bp for the life of the trade',
          'The notional is scaled up until the coupons match',
          'The buyer pays an upfront amount at inception',
          'The seller rebates the difference at maturity',
        ],
        correctIndex: 2,
        explanation:
          'Standardised coupons plus an upfront payment are what make contracts on the same name fungible.',
      },
      {
        id: 'cds-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'How is the amount owed after a credit event determined?',
        options: [
          'The seller pays the full notional to the buyer',
          'The Determinations Committee fixes recovery at 40% by rule',
          'Each side values the defaulted debt itself and they split the difference',
          'An auction sets a final price and the seller pays par minus that price on the notional',
        ],
        correctIndex: 3,
        explanation:
          'One industry-wide auction produces a single recovery price that every contract on the name settles against.',
      },
      {
        id: 'cds-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A bank can cut its exposure to a borrower by buying protection rather than selling the loan.',
        correctAnswer: true,
        explanation:
          'The loan and the client relationship stay in place while the credit risk is transferred.',
      },
      {
        id: 'cds-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why might a fund buy CDS protection instead of shorting the company’s bonds?',
        options: [
          'The bonds may be impossible to borrow, whereas the swap needs no bond at all',
          'CDS protection cannot lose money',
          'Short selling corporate bonds is prohibited',
          'CDS positions are exempt from margin requirements',
        ],
        correctIndex: 0,
        explanation:
          'A short bond position depends on borrowing the paper; the swap expresses the same view without it.',
      },
      {
        id: 'cds-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'The 2014 ISDA definitions added governmental intervention as a credit event for financial reference entities.',
        correctAnswer: true,
        explanation:
          'It was the response to bail-ins that wrote down subordinated bank debt without a conventional default.',
      },
      {
        id: 'cds-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt: 'Who decides whether a credit event has occurred?',
        options: [
          'Each pair of counterparties, bilaterally',
          'The exchange the contract trades on',
          'An ISDA Determinations Committee, whose ruling binds every contract on the name',
          'The rating agency that covers the reference entity',
        ],
        correctIndex: 2,
        explanation:
          'A single committee decision applies market-wide, which is what keeps standardised contracts interchangeable.',
      },
      {
        id: 'cds-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Spread moves can generate mark-to-market swings and margin calls long before any default.',
        correctAnswer: true,
        explanation:
          'The contract is revalued continuously, so a widening or tightening name moves cash between the parties.',
      },
      {
        id: 'cds-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Protection bought on a holding company automatically covers the bonds of its operating subsidiaries.',
        correctAnswer: false,
        explanation:
          'The reference entity and its qualifying debt are defined precisely, and the wrong entity leaves the hedge exposed.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Fixed coupons and an upfront',
          content:
            'Contracts no longer pay whatever spread the market quotes. They pay a standardised coupon — commonly 100 basis points for investment grade names and 500 for high yield — and the difference between that coupon and the market’s view of fair value is settled as a single upfront payment at the start. The point of the convention is fungibility: two trades on the same name and maturity have identical cash flows whenever they were dealt, so they can be netted and cleared rather than sitting on a book as separate line items.',
          callout:
            'This is why a quote in spread terms has to be converted before it means anything in cash. The conversion uses a standard model that everyone agrees to use precisely so that everyone gets the same answer.',
        },
        {
          title: 'Who decides a credit event happened',
          content:
            'The determination is not made by the two parties. A regional committee of dealers and buy-side firms rules on whether an event has occurred, publishes the decision, and it binds every contract referencing that entity. The process exists because the alternative — thousands of bilateral disputes about the same corporate news — is unworkable, and because a contract whose trigger is arguable is not a hedge. The committee’s decisions become precedent, and the definitions get amended when a case exposes a gap.',
        },
        {
          title: 'The auction, and what recovery really is',
          content:
            'Once an event is determined, an auction sets a single recovery price used to settle every contract in cash. Dealers submit markets, physical settlement requests are netted, and the result is a number that becomes the recovery for everyone — regardless of what any individual bond eventually pays. That is worth stating plainly: the recovery in a credit derivative is an auction outcome, not a realised workout value, and the two can differ for reasons that have nothing to do with the borrower.',
          callout:
            'The 40% recovery assumption used in quoting is a convention for the model, not a forecast. The auction is the number that settles the contract.',
        },
      ],
      quiz: [
        {
          id: 'cds-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does a standardised coupon plus an upfront achieve?',
          options: [
            'A lower cost of protection',
            'Fungibility: identical cash flows regardless of when the trade was dealt',
            'Exemption from clearing',
            'Removal of counterparty risk',
          ],
          correctIndex: 1,
          explanation:
            'Which is what allows trades on the same name and maturity to be netted rather than kept as separate positions.',
        },
        {
          id: 'cds-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'A single-name contract pays whatever spread the market quotes on the day it is dealt.',
          correctAnswer: false,
          explanation:
            'It pays a standardised coupon, with the difference to fair value settled upfront.',
        },
        {
          id: 'cds-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Why does converting a spread quote into an upfront use a standard model?',
          options: [
            'Because regulators specify the model',
            'So that every participant converting the same quote gets the same cash amount',
            'Because the model is more accurate than the alternatives',
            'To account for the counterparty’s credit rating',
          ],
          correctIndex: 1,
          explanation:
            'Agreement matters more than realism here: the model is a shared language for turning a quote into money.',
        },
        {
          id: 'cds-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'Whether a credit event has occurred is decided by the two parties to the trade.',
          correctAnswer: false,
          explanation:
            'A regional committee rules on it, and the decision binds every contract on that entity.',
        },
        {
          id: 'cds-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Why does a committee decide credit events?',
          options: [
            'To reduce the cost of protection',
            'Because thousands of bilateral disputes about the same news would be unworkable',
            'Because regulators require a vote',
            'To determine which bonds are deliverable',
          ],
          correctIndex: 1,
          explanation:
            'A contract whose trigger is arguable is not a hedge, whatever else it is.',
        },
        {
          id: 'cds-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Committee decisions become precedent, and the definitions are amended when a case exposes a gap.',
          correctAnswer: true,
          explanation:
            'The documentation evolves case by case, which is why the definitions have been revised repeatedly.',
        },
        {
          id: 'cds-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What does the settlement auction produce?',
          options: [
            'A single recovery price used to settle every contract in cash',
            'A ranking of deliverable obligations',
            'The final workout value of the bonds',
            'A list of which contracts triggered',
          ],
          correctIndex: 0,
          explanation:
            'One number, applied to everyone, regardless of what any individual bond eventually pays.',
        },
        {
          id: 'cds-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The recovery used to settle a credit derivative is the realised workout value of the debt.',
          correctAnswer: false,
          explanation:
            'It is an auction outcome. The two can differ for reasons unconnected to the borrower.',
        },
        {
          id: 'cds-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'The 40% recovery figure commonly used in quoting is a convention rather than a forecast.',
          correctAnswer: true,
          explanation:
            'It feeds the standard model. The auction is what actually settles the contract.',
        },
        {
          id: 'cds-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'What does the auction net before setting the price?',
          options: [
            'Physical settlement requests',
            'Upfront payments',
            'Coupon accruals',
            'Counterparty exposures',
          ],
          correctIndex: 0,
          explanation:
            'Netting the physical requests is what leaves a manageable residual for the dealers’ markets to clear.',
        },
        {
          id: 'cds-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Standardisation was introduced to make contracts easier to net and clear.',
          correctAnswer: true,
          explanation:
            'Fungible cash flows are a precondition for both, and neither was practical before.',
        },
        {
          id: 'cds-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'A protection buyer wants to know their payout precisely in advance. What can they not know?',
          options: [
            'The coupon they will pay',
            'The notional protected',
            'The recovery the auction will set',
            'The maturity of the contract',
          ],
          correctIndex: 2,
          explanation:
            'Everything except the recovery is contractual. The recovery is decided after the fact, by the market.',
        },
      ],
    },
  },
  {
    id: 'cdx',
    categoryId: 'credit',
    name: 'CDX Index',
    hook: 'A basket of CDS in one tradable index',
    summary:
      'A single contract that behaves like a portfolio of credit default swaps on a fixed list of names. Rather than negotiating dozens of single-name trades, a buyer of index protection strikes one deal at one level and takes on an equally weighted slice of every constituent. Indices are the liquid end of the credit derivatives market — most days a position can be opened or closed in size in minutes, which is why they are the default instrument for a fast hedge or a macro view on credit.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A CDX is a tradable index built from a basket of single-name CDS (e.g. CDX.NA.IG), giving broad exposure to a segment of the credit market in one trade. CDX covers North American names; the European and Asian families are branded iTraxx. Buying protection on the index is one contract, not one contract per constituent.',
        callout:
          'CDX.NA.IG holds 125 equally weighted investment-grade names on a 100bp coupon; CDX.NA.HY holds 100 high-yield names on a 500bp coupon. iTraxx Europe Main is also 125 names at 100bp.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The index carries a fixed coupon and weights its constituents equally, and like a single-name CDS it trades against that coupon with an upfront payment settling the difference from the traded level. If one name suffers a credit event it is removed from the index, the protection buyer is compensated for that name’s share of the notional through the same auction that settles single-name contracts, and the remaining notional continues on the surviving names — the index factor falls below 1 to reflect what has dropped out.',
        callout:
          'Investment-grade indices are quoted in basis points of spread; high-yield indices are quoted as a price. CDX.NA.HY at 95 means the protection buyer pays five points upfront, because the index is trading wider than its 500bp coupon.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It’s a far more efficient way to hedge or gain exposure to overall credit risk than trading dozens of single-name CDS individually. The index is more liquid than almost any of its constituents, its bid-offer is a fraction of what assembling the same names would cost, and size can be added or removed quickly — which is why a portfolio manager who wants less credit risk for a fortnight buys index protection rather than selling bonds.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'A new series rolls out roughly every six months with refreshed constituents; the newest is the on-the-run series and carries the most liquidity. Rolls happen in March and September, and names that have been downgraded out of the eligible universe, upgraded out of it or taken over drop away. Tranches let investors take exposure to specific loss layers of the basket — the 0–3% equity tranche absorbs the first defaults, while a senior tranche is untouched until losses climb past its attachment point.',
        callout:
          'The index level is not the simple average of its constituents’ spreads. The gap between the two — the index basis, or skew — is itself a traded position.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'An index rarely matches a specific portfolio, so hedging with one leaves basis risk: the index can tighten in the same week the bonds actually held are widening. Older off-the-run series become hard to trade and expensive to exit. Tranche positions respond to default correlation as well as to spreads, so a tranche can lose money on a day when the index itself has barely moved.',
      },
    ],
    keyTerms: [
      {
        term: 'Series',
        definition:
          'One vintage of the index, with a fixed constituent list and coupon, replaced by a new series at each roll.',
      },
      {
        term: 'On-the-run',
        definition:
          'The most recently launched series, which concentrates almost all of the trading volume.',
      },
      {
        term: 'Index factor',
        definition:
          'The proportion of the original notional still running after defaulted names have been stripped out.',
      },
      {
        term: 'Index coupon',
        definition:
          'The fixed running premium the series pays — 100bp for investment-grade families, 500bp for high yield.',
      },
      {
        term: 'Tranche',
        definition:
          'A slice of the basket’s losses between an attachment and a detachment point, sold as a separate contract.',
      },
      {
        term: 'Index basis',
        definition:
          'The difference between the index level and the aggregate of its constituents’ single-name spreads.',
      },
    ],
    example: {
      title: 'One default inside a 125-name index',
      lines: [
        'An investor buys $100m of protection on an equally weighted 125-name investment-grade index.',
        'Each constituent therefore carries 1/125 = 0.8% of the notional, or $800,000.',
        'The index coupon is 100bp, so the premium starts at $1m a year, paid quarterly.',
        'One name defaults and its auction final price is 30.',
        'The seller pays (100 − 30)% × $800,000 = $560,000, and that name leaves the index.',
        'The factor drops to 124/125 = 0.992, so the premium is now 100bp on $99.2m = $992,000 a year.',
      ],
      takeaway:
        'A default settles like a small single-name CDS: only the defaulted constituent’s share pays out, and the contract carries on at a reduced notional rather than terminating.',
    },
    inPractice:
      'An insurer holding several hundred corporate bonds buys index protection to cut credit exposure ahead of a nervous few weeks, rather than selling paper it would struggle to buy back; macro funds trade the index outright as a view on the credit cycle; dealers use it to hedge the residual risk of bond inventory they cannot offset name by name. The main indices are cleared through a central counterparty and are among the few credit instruments with a continuous two-way market.',
    relatedProductIds: ['cds', 'trs', 'eqswap'],
    quiz: [
      {
        id: 'cdx-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'A CDX index references a single company.',
        correctAnswer: false,
        explanation:
          'It references a basket of names — 125 in the main investment-grade index.',
      },
      {
        id: 'cdx-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'How many names does CDX.NA.IG carry, and on what coupon?',
        options: [
          '100 names on a 500bp coupon',
          '125 names on a 100bp coupon',
          '75 names on a 100bp coupon',
          '125 names on a 500bp coupon',
        ],
        correctIndex: 1,
        explanation:
          '100 names on a 500bp coupon describes CDX.NA.HY, the high-yield family.',
      },
      {
        id: 'cdx-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The European and Asian equivalents of the CDX indices are branded iTraxx.',
        correctAnswer: true,
        explanation:
          'CDX covers North America; iTraxx covers Europe and Asia, on the same conventions.',
      },
      {
        id: 'cdx-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'When one constituent suffers a credit event, the whole index contract terminates.',
        correctAnswer: false,
        explanation:
          'Only that name is settled and removed; the rest of the index runs on at a lower factor.',
      },
      {
        id: 'cdx-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'On $100m of protection on an equally weighted 125-name index, one name defaults with an auction price of 30. What does the seller pay?',
        options: ['$800,000', '$240,000', '$560,000', '$70m'],
        correctIndex: 2,
        explanation:
          'That name is $800,000 of notional, and the loss is 70% of it — $560,000.',
      },
      {
        id: 'cdx-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Index trades settle the gap between the fixed coupon and the traded level as an upfront payment.',
        correctAnswer: true,
        explanation:
          'The index runs at its fixed coupon, exactly like a standardised single-name contract.',
      },
      {
        id: 'cdx-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt: 'Why is the index preferred to single names for a quick hedge?',
        options: [
          'It carries no basis risk against a bond portfolio',
          'Its constituents cannot default',
          'It is far more liquid and costs a fraction of the bid-offer of assembling the names',
          'Losses on it are capped by the exchange',
        ],
        correctIndex: 2,
        explanation:
          'Liquidity and transaction cost are the whole argument; basis risk against a real portfolio remains.',
      },
      {
        id: 'cdx-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Buying index protection lets a manager reduce credit exposure without selling bonds.',
        correctAnswer: true,
        explanation:
          'The bonds stay in the portfolio while the index position offsets part of their credit risk.',
      },
      {
        id: 'cdx-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does ‘on-the-run’ mean for a credit index?',
        options: [
          'The series with the widest spread',
          'The series whose constituents are all investment grade',
          'A series in which a constituent has already defaulted',
          'The most recently launched series, which carries the most liquidity',
        ],
        correctIndex: 3,
        explanation:
          'Each roll creates a new on-the-run series, and trading migrates to it almost immediately.',
      },
      {
        id: 'cdx-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'The index level is simply the average of its constituents’ single-name spreads.',
        correctAnswer: false,
        explanation:
          'The two differ, and that difference — the index basis or skew — is traded in its own right.',
      },
      {
        id: 'cdx-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Hedging a specific bond portfolio with an index leaves basis risk.',
        correctAnswer: true,
        explanation:
          'Constituents and weights rarely match the holdings, so the two can move apart.',
      },
      {
        id: 'cdx-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Which statement about index tranches is correct?',
        options: [
          'A tranche always moves one-for-one with the index',
          'The 0–3% equity tranche absorbs the first losses in the basket',
          'Senior tranches take the first default in the basket',
          'Tranches are sensitive only to interest rates',
        ],
        correctIndex: 1,
        explanation:
          'Losses hit the lowest layer first, and only reach a senior tranche past its attachment point.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'The roll, and what on-the-run means',
          content:
            'A credit index is republished on a fixed schedule with a refreshed constituent list, and the new series immediately becomes where the liquidity sits. The previous one keeps trading, thinner and wider, and a book that does not roll finds itself holding an instrument the market has moved on from. That is a real cost rather than an inconvenience: the bid-offer on an off-the-run series is materially worse, and hedges built on one series and rolled at different times drift apart.',
          callout:
            'The London Whale’s positions were concentrated in an off-the-run series, which is part of why they were both large relative to that market and visible to everyone in it.',
        },
        {
          title: 'Index against intrinsic',
          content:
            'An index has a price of its own, and the constituents have theirs. The two need not agree, and the gap — the index basis, or skew — is a tradable spread. It moves with flow: an index is the cheapest way to buy or sell broad credit risk in size, so hedging demand lands there first and pushes it away from the sum of its parts before arbitrage pulls it back. Trading the basis means holding the index against all of its single names, which is operationally heavy and is exactly the trade that leaves jump-to-default behind.',
        },
        {
          title: 'What happens when a constituent defaults',
          content:
            'The index does not disappear and it is not rewritten. The defaulted name is settled through the same auction as a single-name contract and removed, and the index continues with a reduced factor — a number below one recording how much of the original notional is still referenced. Every position scales by it. That mechanism is why an index hedge covers only the defaulting name’s weight, which is the arithmetic behind the whole CS01-versus-jump-to-default distinction.',
          callout:
            'A factor below one is a permanent record that something in the basket failed. It is also the thing people forget when they compare a series across time.',
        },
      ],
      quiz: [
        {
          id: 'cdx-d1',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'A credit index is republished periodically with a refreshed list of constituents.',
          correctAnswer: true,
          explanation:
            'And the new series is immediately where the liquidity moves to.',
        },
        {
          id: 'cdx-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What happens to the previous series after a roll?',
          options: [
            'It is cancelled and settled',
            'It keeps trading, thinner and at a wider spread',
            'It is merged into the new series',
            'It becomes physically settled only',
          ],
          correctIndex: 1,
          explanation:
            'A book that does not roll ends up holding an instrument the market has moved on from.',
        },
        {
          id: 'cdx-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Holding an off-the-run series has no cost as long as the position is held to maturity.',
          correctAnswer: false,
          explanation:
            'The bid-offer is materially worse, which matters at every adjustment and at any forced exit.',
        },
        {
          id: 'cdx-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What is the index basis?',
          options: [
            'The gap between the index price and the sum of its constituents',
            'The difference between two series of the same index',
            'The spread between investment grade and high yield',
            'The upfront payment on the index',
          ],
          correctIndex: 0,
          explanation:
            'Also called the skew, and it moves with flow because the index is where size trades first.',
        },
        {
          id: 'cdx-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'Hedging demand tends to hit the index before it reaches the single names.',
          correctAnswer: true,
          explanation:
            'It is the cheapest way to move broad credit risk in size, which is what pushes the basis around.',
        },
        {
          id: 'cdx-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does trading the index basis require operationally?',
          options: [
            'Holding the index against all of its single names',
            'A licence from the index provider',
            'Clearing through a specific venue',
            'Physical settlement of the constituents',
          ],
          correctIndex: 0,
          explanation:
            'Heavy, and the trade that leaves jump-to-default behind — which is the London Whale in one sentence.',
        },
        {
          id: 'cdx-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What happens to an index when one constituent defaults?',
          options: [
            'The whole index is settled',
            'The name is settled through the auction and removed, and the index continues with a reduced factor',
            'The index is republished immediately as a new series',
            'The remaining names are reweighted upwards',
          ],
          correctIndex: 1,
          explanation:
            'The factor records how much of the original notional is still referenced, and every position scales by it.',
        },
        {
          id: 'cdx-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A factor below one is a permanent record that a constituent has defaulted.',
          correctAnswer: true,
          explanation:
            'And it is the detail people forget when comparing a series across time.',
        },
        {
          id: 'cdx-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'An index hedge covers the full loss on a single constituent that defaults.',
          correctAnswer: false,
          explanation:
            'It covers that name’s weight only, which is the arithmetic behind CS01 against jump-to-default.',
        },
        {
          id: 'cdx-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Why were the London Whale positions unusually visible to the market?',
          options: [
            'They were disclosed in filings',
            'They were concentrated in an off-the-run series, and were large relative to that market',
            'The index provider published them',
            'They were cleared and therefore public',
          ],
          correctIndex: 1,
          explanation:
            'A large position in a thin instrument announces itself through the price.',
        },
        {
          id: 'cdx-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'The index and the sum of its constituents must trade at the same spread.',
          correctAnswer: false,
          explanation:
            'They frequently do not, and the gap is a tradable spread with its own drivers.',
        },
        {
          id: 'cdx-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why do desks roll into the new series?',
          options: [
            'Because the old series stops trading',
            'Because liquidity moves and the bid-offer on the old one widens',
            'Because the index provider requires it',
            'Because the coupon changes',
          ],
          correctIndex: 1,
          explanation:
            'Staying put is a decision to trade in a worse market for the rest of the position’s life.',
        },
      ],
    },
  },
  {
    id: 'trs',
    categoryId: 'credit',
    name: 'Total Return Swap',
    hook: 'Rent the full return of an asset',
    summary:
      'A financing trade dressed as a swap. One party hands over every economic consequence of holding an asset — coupons, dividends, price gains and price losses — and receives a floating financing rate in return. The receiver ends up with the exposure of an owner while committing only collateral, and the payer ends up with a funded position whose risk it has passed on. Title never moves, which makes the TRS a tool for leverage, for balance-sheet management and, occasionally, for exposure that does not show up in a public register.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'In a total return swap one party receives all the economics of a reference asset — its coupons or interest plus any change in price — and pays a financing rate in exchange. Legal ownership never moves: the payer remains the holder of record, and the receiver’s exposure exists only in the contract.',
        callout:
          'Because title stays put, the receiver never appears on a share register or bondholder list — which is why total return swaps have been used to build economic stakes that fall outside disclosure rules.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The total return receiver pays a financing leg, say SOFR plus 120 basis points, and receives the asset’s income and price gains. If the asset falls in value, the receiver pays that loss across as well — so both credit and market risk transfer synthetically. The asset is remarked on agreed valuation dates rather than only at maturity, so gains and losses move in cash along the way instead of accumulating to the end.',
        callout:
          'The financing spread is where the payer earns its money: it covers the cost of funding the asset on its own balance sheet plus a margin for the capital and counterparty risk the trade consumes.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It gives leveraged exposure to bonds or loans without funding the full purchase price, lets a holder shed the risk of an asset while keeping it on the balance sheet, and opens up assets an investor cannot buy directly. Because the receiver posts collateral rather than the purchase price, a $50m exposure can be carried on a few million of cash.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference asset, total return leg, financing leg and its spread, valuation and reset dates, plus the collateral posted and the haircut applied to it. The haircut sets the leverage: a 10% haircut on a $50m position means $5m of cash is supporting it, so a 10% fall in the asset wipes out the collateral entirely.',
        callout:
          'The collateral posted at the outset is the independent amount; variation margin is what moves afterwards as the asset is remarked.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Leverage magnifies losses, and a falling asset value triggers collateral calls that can force an exit at the worst time. The receiver carries both the asset’s risk and the counterparty’s, and unwinding a large position in an illiquid asset can be expensive. Each payer also sees only its own slice of a client’s book, so several dealers can finance the same investor without any of them knowing the total — a concentration that has produced very large losses when such positions were unwound at once.',
      },
    ],
    keyTerms: [
      {
        term: 'Reference asset',
        definition:
          'The bond, loan or portfolio whose economics the swap passes across, held throughout by the payer.',
      },
      {
        term: 'Total return receiver',
        definition:
          'The side taking the asset’s income, gains and losses in exchange for paying the financing leg.',
      },
      {
        term: 'Financing leg',
        definition:
          'The floating payment — typically SOFR or €STR plus a spread — that buys the exposure.',
      },
      {
        term: 'Valuation date',
        definition:
          'A scheduled date on which the asset is remarked so accrued gains or losses are settled in cash.',
      },
      {
        term: 'Haircut',
        definition:
          'The portion of the exposure that must be covered by collateral, which fixes how much leverage the trade carries.',
      },
      {
        term: 'Independent amount',
        definition:
          'The collateral posted at inception, before any variation margin starts moving with the mark.',
      },
    ],
    example: {
      title: 'Financing a $50m bond position',
      lines: [
        'A credit fund wants $50m of exposure to a corporate bond but does not want to fund it.',
        'It enters a one-year TRS as total return receiver, paying SOFR + 120bp and receiving the bond’s 5% coupon and any price move.',
        'A 10% haircut means it posts $5m of collateral rather than $50m of cash.',
        'Over the year the bond pays $2.5m of coupon and rises from 100 to 102, a $1m gain — $3.5m received.',
        'SOFR averages 4.3%, so the financing leg costs 5.5% of $50m = $2.75m.',
        'The fund nets $3.5m − $2.75m = $750,000 on the $5m it actually committed.',
      ],
      takeaway:
        'Owning the bond outright would have returned $3.5m on $50m, or 7%. The swap turns the same move into 15% on the cash committed — and a two-point fall instead of a two-point rise would have left the fund $1.25m down, a quarter of its collateral.',
    },
    inPractice:
      'Hedge funds use total return swaps through their prime brokers to hold bond and loan positions several times the size of the cash they have posted; banks act as payer to earn the financing spread on assets they were funding anyway; an insurer barred from holding a particular loan can take its return synthetically. The same structure lets a holder keep an asset on its books for accounting or client reasons while passing the risk to someone else.',
    relatedProductIds: ['cds', 'eqswap', 'cfd'],
    quiz: [
      {
        id: 'trs-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The total return receiver becomes the legal owner of the asset.',
        correctAnswer: false,
        explanation:
          'Ownership stays with the payer; the receiver’s exposure is purely contractual.',
      },
      {
        id: 'trs-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does the total return receiver actually get?',
        options: [
          'A registered holding in the reference asset',
          'The asset’s income and price changes, without title to it',
          'The asset’s coupons only, with no price exposure',
          'A loan secured against the reference asset',
        ],
        correctIndex: 1,
        explanation:
          'It is the full economics of ownership, delivered through the contract rather than the register.',
      },
      {
        id: 'trs-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A total return swap transfers both the income and the price risk of the reference asset.',
        correctAnswer: true,
        explanation:
          'The receiver takes coupons and gains and absorbs losses — the whole return, not part of it.',
      },
      {
        id: 'trs-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'If the reference asset falls in value, the total return receiver pays that loss to the payer.',
        correctAnswer: true,
        explanation:
          'The flow simply reverses: the swap passes losses across exactly as it passes gains.',
      },
      {
        id: 'trs-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The receiver pays SOFR + 120bp on $50m. Over a year SOFR averages 4.3% and the asset returns $3.5m in coupon and price gain. What is the net?',
        options: [
          '$750,000 to the receiver',
          '$2.75m to the receiver',
          '$750,000 to the payer',
          '$3.5m to the receiver',
        ],
        correctIndex: 0,
        explanation:
          'Financing costs 5.5% of $50m = $2.75m, so the receiver keeps $3.5m − $2.75m.',
      },
      {
        id: 'trs-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Gains and losses on the reference asset are settled only at maturity.',
        correctAnswer: false,
        explanation:
          'The asset is remarked on scheduled valuation dates and the difference moves in cash then.',
      },
      {
        id: 'trs-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Why would a fund use a TRS rather than buying the bond outright?',
        options: [
          'To become the registered holder of the bond',
          'To take the exposure without the asset’s credit risk',
          'To gain the exposure while committing collateral rather than the full price',
          'To remove the need for a counterparty',
        ],
        correctIndex: 2,
        explanation:
          'The unfunded structure is the point — and it is also what creates the leverage.',
      },
      {
        id: 'trs-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'A TRS lets a holder shed an asset’s risk while keeping it on its balance sheet.',
        correctAnswer: true,
        explanation:
          'The asset stays where it is and the economics are passed to the receiver.',
      },
      {
        id: 'trs-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A $50m position is supported by $5m of posted collateral. What haircut is that?',
        options: ['5%', '10%', '50%', '90%'],
        correctIndex: 1,
        explanation:
          '$5m of $50m is 10%, so a 10% fall in the asset would consume the collateral in full.',
      },
      {
        id: 'trs-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Variation margin is the collateral posted at the start of the trade.',
        correctAnswer: false,
        explanation:
          'That opening collateral is the independent amount; variation margin moves later with the mark.',
      },
      {
        id: 'trs-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Which risk is specific to holding an asset through a leveraged TRS?',
        options: [
          'Losing legal title to the asset',
          'Interest rate risk on the notional and nothing else',
          'Forgoing the asset’s coupons',
          'A falling asset value triggering collateral calls that force an exit at the worst time',
        ],
        correctIndex: 3,
        explanation:
          'Leverage turns a mark-to-market fall into a funding problem, which can crystallise the loss.',
      },
      {
        id: 'trs-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The receiver carries both the reference asset’s risk and the counterparty’s.',
        correctAnswer: true,
        explanation:
          'The asset can fall and the payer can fail — two exposures for one position.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'The financing leg is the product',
          content:
            'The return leg gets the attention and the financing leg is where the negotiation happens. The spread over the benchmark rate is set by what the asset costs the dealer to hold: its balance sheet weight, the capital against it, whether it can be pledged, and how easily it could be sold if the client walked away. Two clients receiving the same return on the same asset can pay materially different spreads, and the difference is not a discount for loyalty — it is a credit and liquidity assessment expressed as a rate.',
          callout:
            'When a dealer widens a financing spread on a name, that is a risk decision. Reading it as pricing noise is how a fund discovers its broker’s view of a position too late.',
        },
        {
          title: 'What the dealer actually holds',
          content:
            'A dealer hedges by buying the reference asset, so the trade converts client exposure into inventory. That has consequences on both sides: the client’s position is only as robust as the dealer’s willingness to keep holding it, and the dealer accumulates concentration in whatever its clients happen to want. Both were on display in 2021, when several banks discovered simultaneously that they held the same shares against the same client, and that unwinding meant competing to sell them.',
        },
        {
          title: 'Termination, and the value nobody agrees on',
          content:
            'These trades end early more often than they mature. A termination event, a margin failure or a client decision leaves the parties needing a value for the position — and the asset may be illiquid, the position large, and the two sides differently motivated. Documentation therefore specifies who determines the close-out amount and on what basis, which is the single most negotiated clause in the trade and the one that decides the outcome when the relationship has already broken down.',
        },
      ],
      quiz: [
        {
          id: 'trs-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What determines the spread on the financing leg?',
          options: [
            'The expected return of the reference asset',
            'What the asset costs the dealer to hold — balance sheet, capital, liquidity',
            'The volatility of the underlying',
            'The maturity of the trade alone',
          ],
          correctIndex: 1,
          explanation:
            'It is a credit and liquidity assessment expressed as a rate, not a negotiated discount.',
        },
        {
          id: 'trs-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Two clients on the same asset can be quoted materially different financing spreads.',
          correctAnswer: true,
          explanation: 'The dealer is pricing them, not only the asset.',
        },
        {
          id: 'trs-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A dealer widens the financing spread on a position. What is it most likely saying?',
          options: [
            'That funding markets have moved slightly',
            'That its assessment of the risk in that position has changed',
            'That the client has traded too little',
            'That the reference asset is about to pay a dividend',
          ],
          correctIndex: 1,
          explanation:
            'Reading it as noise is how a fund learns its broker’s view of a position later than it should.',
        },
        {
          id: 'trs-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'foundational',
          prompt:
            'The dealer typically hedges by holding the reference asset itself.',
          correctAnswer: true,
          explanation:
            'Which turns client exposure into dealer inventory, with consequences for both sides.',
        },
        {
          id: 'trs-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What does that hedging arrangement mean for the client?',
          options: [
            'Their position is only as robust as the dealer’s willingness to keep holding it',
            'They acquire voting rights in the asset',
            'They can demand physical delivery at any time',
            'Their exposure is cleared centrally',
          ],
          correctIndex: 0,
          explanation:
            'Synthetic exposure depends on someone else continuing to carry the real thing.',
        },
        {
          id: 'trs-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A dealer running this business accumulates concentration in whatever its clients want.',
          correctAnswer: true,
          explanation:
            'Several discovered in 2021 that they held the same shares against the same client.',
        },
        {
          id: 'trs-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'Which clause is the most negotiated in one of these trades?',
          options: [
            'The one governing who determines the close-out amount and on what basis',
            'The choice of benchmark rate',
            'The reset frequency',
            'The governing law',
          ],
          correctIndex: 0,
          explanation:
            'It decides the outcome at the point where the relationship has already failed.',
        },
        {
          id: 'trs-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'These trades more often end early than run to maturity.',
          correctAnswer: true,
          explanation:
            'A termination event, a margin failure or a client decision — and then someone has to value the position.',
        },
        {
          id: 'trs-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Valuing a position at termination is straightforward when the asset is liquid and the position is small.',
          correctAnswer: true,
          explanation:
            'The clause matters precisely because those two conditions often fail together.',
        },
        {
          id: 'trs-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Why is the financing leg described as the product?',
          options: [
            'Because it is larger than the return leg',
            'Because it is where the dealer expresses its view of the client and the asset',
            'Because it settles first',
            'Because it determines the maturity',
          ],
          correctIndex: 1,
          explanation: 'The return leg is mechanical. The spread is the judgement.',
        },
        {
          id: 'trs-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A client receiving the return on an asset can rely on the trade continuing regardless of the dealer’s position.',
          correctAnswer: false,
          explanation:
            'The dealer’s appetite is a live input, and it changes with its own inventory and capital.',
        },
        {
          id: 'trs-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'What made the 2021 unwind of a large swap client so damaging?',
          options: [
            'The contracts were unenforceable',
            'Several dealers held the same shares against the same client and had to compete to sell',
            'The reference assets had defaulted',
            'The financing legs reset simultaneously',
          ],
          correctIndex: 1,
          explanation:
            'Inventory built from client demand is concentrated in exactly the way nobody plans for.',
        },
      ],
    },
  },
  {
    id: 'cln',
    categoryId: 'credit',
    name: 'Credit-Linked Note',
    hook: 'A bond whose repayment depends on a credit event',
    summary:
      'A credit derivative wrapped in a security. The investor pays cash for a note, collects a coupon well above what the issuer’s ordinary debt pays, and accepts that principal comes back in full only if a reference entity or portfolio avoids a credit event. Because it is a bond rather than a swap, it reaches buyers whose mandates rule out derivatives — and because the cash is paid upfront, the protection the issuer has bought cannot fail for want of a solvent counterparty.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A credit-linked note is a debt security with a credit derivative built into it. Investors buy the note and earn an enhanced coupon; in return, repayment of their principal depends on no credit event occurring at a reference entity or reference portfolio. The investor is, in substance, a protection seller who has paid for the position in advance.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The issuer is effectively buying protection from the noteholders. Investors pay cash upfront, which is held as collateral. If nothing goes wrong they receive par at maturity plus coupons along the way; if a credit event occurs the note redeems early at the recovery value and investors absorb the shortfall. Where a special purpose vehicle issues the note, the proceeds buy high-quality collateral pledged to the deal; where a bank issues one directly off its own balance sheet there is no separate pool, and the investor ranks as an unsecured creditor of that bank.',
        callout:
          'Redemption after a credit event uses the same auction final price that settles CDS on the name, so a note linked to debt auctioned at 35 repays 35% of par.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It repackages a derivative into a funded security, so investors whose mandates prevent them from entering swaps — many funds and insurers — can still take credit exposure. For the issuer, holding the cash upfront removes counterparty risk on the protection. Banks also issue notes referencing a pool of their own loans to transfer that risk to investors and reduce the capital they must hold against it.',
        callout:
          'In a portfolio deal the note usually takes the first losses on the reference pool, so it can be written down while the pool as a whole is still performing.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference entity, the embedded CDS, the collateral backing the note, the enhanced coupon, and the contingent principal that may redeem early at recovery value. In a vehicle-issued structure there is also a swap counterparty — the bank that bought the protection — whose own failure would unwind the deal before maturity.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The investor is exposed three ways at once — to the reference entity, to the issuer of the note, and often to the collateral held against it. These notes are also frequently illiquid and difficult to sell before maturity. The enhanced coupon can look generous precisely because those exposures are correlated: the conditions that damage the reference entity are often the ones that damage the issuer and the collateral too.',
        callout:
          'A rating on a note speaks to credit risk alone. It says nothing about whether the note can be sold, and many trade so rarely that a valuation comes from a dealer model rather than an observable price.',
      },
    ],
    keyTerms: [
      {
        term: 'Special purpose vehicle',
        definition:
          'A standalone issuing entity created for one deal, holding the collateral and the swap that make the note work.',
      },
      {
        term: 'Embedded CDS',
        definition:
          'The credit default swap inside the note, on which the investor is the protection seller.',
      },
      {
        term: 'Collateral',
        definition:
          'The high-quality assets the note proceeds are invested in and pledged against, in a vehicle-issued structure.',
      },
      {
        term: 'Enhanced coupon',
        definition:
          'The above-market interest the note pays, made up of the collateral return plus the protection premium.',
      },
      {
        term: 'Contingent principal',
        definition:
          'Repayment that is due in full only if no credit event occurs, and falls to recovery value if one does.',
      },
      {
        term: 'Funded protection',
        definition:
          'Protection paid for in cash at the outset, so the buyer has nothing left to collect from the seller later.',
      },
    ],
    example: {
      title: 'A five-year note that defaults in year four',
      lines: [
        'An investor buys $10m of a five-year note linked to a single reference entity.',
        'The issuer’s own five-year senior bonds yield 4.5%; the note pays 7%.',
        'That extra 250bp is the premium on the protection the investor has effectively sold.',
        'Three years pass without incident: the investor collects 7% × $10m = $700,000 a year, $2.1m in total.',
        'In year four the reference entity defaults and the auction sets a final price of 35.',
        'The note redeems early at 35% of par — $3.5m — against the $10m invested.',
      ],
      takeaway:
        'The investor is $6.5m down on principal against $2.1m of coupons collected, a net loss of $4.4m. The extra 250bp a year was payment for exactly this contingency, not free yield.',
    },
    inPractice:
      'Banks issue credit-linked notes to move the risk of a loan book to investors and free up regulatory capital, and to place single-name credit risk with buyers who want a bond rather than a swap. On the other side, insurers, pension funds and credit funds whose mandates permit securities but not derivatives use them to earn spread on credits they have a view on — accepting illiquidity and issuer risk as the price of that access.',
    relatedProductIds: ['cds', 'cdx', 'irs'],
    quiz: [
      {
        id: 'cln-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A credit-linked note pays an enhanced coupon in exchange for the investor taking credit risk.',
        correctAnswer: true,
        explanation:
          'The extra yield is compensation for the protection the investor has effectively sold.',
      },
      {
        id: 'cln-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What is a credit-linked note?',
        options: [
          'A bond with an interest rate swap attached to its coupon',
          'A debt security with a credit derivative embedded, whose principal is contingent',
          'A CDS contract on which no premium is paid',
          'A direct loan to the reference entity',
        ],
        correctIndex: 1,
        explanation:
          'It is a security in form and a sold protection position in substance.',
      },
      {
        id: 'cln-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The noteholder is effectively selling credit protection.',
        correctAnswer: true,
        explanation:
          'The issuer buys the protection; the investor takes the other side and is paid for it.',
      },
      {
        id: 'cln-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Principal on a credit-linked note is repaid in full regardless of credit events.',
        correctAnswer: false,
        explanation:
          'Principal is contingent — a credit event can cut repayment to the recovery value.',
      },
      {
        id: 'cln-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A $10m note is linked to an entity whose debt is auctioned at 35 after it defaults. What does the investor receive?',
        options: [
          '$10m at maturity, as originally scheduled',
          '$6.5m on early redemption',
          '$3.5m on early redemption',
          'Nothing at all',
        ],
        correctIndex: 2,
        explanation:
          'The note redeems at the auction price, 35% of par; the $6.5m shortfall is the investor’s loss.',
      },
      {
        id: 'cln-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A note issued directly by a bank gives the investor a secured claim on a separate pool of collateral.',
        correctAnswer: false,
        explanation:
          'Only vehicle-issued notes hold pledged collateral; a direct issue leaves the investor unsecured.',
      },
      {
        id: 'cln-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why do some investors buy credit-linked notes rather than selling CDS protection?',
        options: [
          'Their mandates permit securities but not derivatives',
          'The note cannot lose principal',
          'The note pays a lower coupon for the same risk',
          'The note settles without reference to an auction',
        ],
        correctIndex: 0,
        explanation:
          'Wrapping the derivative in a bond is what makes the exposure reachable for those buyers.',
      },
      {
        id: 'cln-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Because investors pay cash upfront, the protection buyer has no counterparty risk on the protection.',
        correctAnswer: true,
        explanation:
          'The money is already in hand, which is the defining advantage of a funded structure.',
      },
      {
        id: 'cln-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'In a note issued through a special purpose vehicle, who is buying protection?',
        options: [
          'The noteholders',
          'The custodian holding the collateral',
          'The rating agency',
          'The bank that arranged the deal and faces the vehicle on the swap',
        ],
        correctIndex: 3,
        explanation:
          'The bank is the protection buyer; the vehicle passes that risk to the noteholders.',
      },
      {
        id: 'cln-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'A credit-linked note is a funded instrument, unlike a plain CDS.',
        correctAnswer: true,
        explanation:
          'Investors pay cash at the outset, which is what makes it accessible to bond buyers.',
      },
      {
        id: 'cln-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A credit-linked note exposes the investor only to the reference entity.',
        correctAnswer: false,
        explanation:
          'The issuer’s credit and, in a vehicle structure, the collateral are exposures too.',
      },
      {
        id: 'cln-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Which risk in a credit-linked note is easiest to overlook?',
        options: [
          'The reference entity’s risk of default',
          'The correlation between the reference entity, the issuer and the collateral',
          'The level of the coupon',
          'The stated maturity date',
        ],
        correctIndex: 1,
        explanation:
          'The three exposures tend to deteriorate together, which is part of why the coupon looks generous.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Funded, and what that changes',
          content:
            'A credit default swap is unfunded: no money moves at the start, and the protection seller’s obligation is a promise backed by collateral arrangements. A credit-linked note is funded — the investor pays cash up front, and that cash is what pays the sponsor if the credit event happens. From the sponsor’s point of view this removes counterparty risk entirely, because the money is already in hand. From the investor’s point of view it converts a contingent obligation into a purchase, which is what makes the instrument available to buyers whose mandates forbid selling protection outright.',
          callout:
            'The economics of selling protection and of buying a note referencing the same name are close to identical. What differs is who is exposed to whom, and which mandate permits it.',
        },
        {
          title: 'Two credits, not one',
          content:
            'The investor is exposed to the reference entity and to whatever holds the collateral. Where the note is issued by a bank directly, that is the bank’s own credit — so a note referencing one borrower can fail because a different institution did. Where a special purpose vehicle holds the proceeds in segregated collateral, the second exposure is to that collateral rather than to the arranger. The structure decides which, and reading the note as a pure view on the reference name is the most common misunderstanding of the instrument.',
        },
        {
          title: 'Settling when it goes wrong',
          content:
            'On a credit event, the note redeems early at a reduced amount determined by the same auction that settles derivative contracts on that name — so the investor’s loss is set by a market process rather than by a workout. Timing matters too: principal is repaid after the auction rather than at the original maturity, which is a reinvestment problem for anyone who bought the note to match a liability. And the coupon stops, which for a buyer treating the note as an income asset is the part that arrives first.',
        },
      ],
      quiz: [
        {
          id: 'cln-d1',
          kind: 'choice',
          step: 1,
          difficulty: 'intermediate',
          prompt: 'What does "funded" mean in this context?',
          options: [
            'The issuer has a credit facility behind the note',
            'The investor pays cash up front, and that cash pays the sponsor on a credit event',
            'The note is guaranteed by a third party',
            'The coupon is paid in advance',
          ],
          correctIndex: 1,
          explanation:
            'The money is in hand before anything happens, which removes the sponsor’s counterparty risk.',
        },
        {
          id: 'cln-d2',
          kind: 'boolean',
          step: 1,
          difficulty: 'foundational',
          prompt: 'A credit default swap is unfunded at inception.',
          correctAnswer: true,
          explanation:
            'No principal moves; the seller’s obligation is a promise supported by collateral arrangements.',
        },
        {
          id: 'cln-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Why does the funded form open the trade to more buyers?',
          options: [
            'It pays a higher coupon',
            'It is a purchase rather than a contingent obligation, which many mandates require',
            'It is exempt from credit analysis',
            'It settles physically',
          ],
          correctIndex: 1,
          explanation:
            'The economics resemble selling protection; the legal form is what the mandate reads.',
        },
        {
          id: 'cln-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'A credit-linked note exposes the investor to more than one credit.',
          correctAnswer: true,
          explanation:
            'The reference entity, and whatever holds the collateral — which may be the issuing bank itself.',
        },
        {
          id: 'cln-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A note is issued directly by a bank rather than through a vehicle. What is the second exposure?',
          options: [
            'The bank’s own credit',
            'The reference entity’s parent',
            'The clearing house',
            'There is no second exposure',
          ],
          correctIndex: 0,
          explanation:
            'A note referencing one borrower can then fail because a different institution did.',
        },
        {
          id: 'cln-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A special purpose vehicle holding segregated collateral removes the second credit exposure entirely.',
          correctAnswer: false,
          explanation:
            'It moves it: the exposure becomes the collateral itself rather than the arranger.',
        },
        {
          id: 'cln-d7',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'Reading the note as a pure view on the reference name is the most common misunderstanding of it.',
          correctAnswer: true,
          explanation:
            'The structure decides what else the investor owns, and the structure varies.',
        },
        {
          id: 'cln-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'How is the investor’s loss determined on a credit event?',
          options: [
            'By the eventual workout value of the debt',
            'By the same auction that settles derivative contracts on that name',
            'By the issuer’s own valuation',
            'By a fixed schedule in the terms',
          ],
          correctIndex: 1,
          explanation:
            'A market process rather than a recovery negotiation, and the two can differ.',
        },
        {
          id: 'cln-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'On a credit event the note redeems early rather than at its original maturity.',
          correctAnswer: true,
          explanation:
            'Which is a reinvestment problem for anyone who bought it to match a liability.',
        },
        {
          id: 'cln-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'What does an income-focused buyer notice first when the credit deteriorates?',
          options: [
            'The coupon stopping',
            'The change in the reference entity’s rating',
            'The collateral being substituted',
            'The auction date being announced',
          ],
          correctIndex: 0,
          explanation:
            'The write-down follows, but the income the note was bought for goes first.',
        },
        {
          id: 'cln-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'The economics of selling protection and of buying a note on the same name are broadly similar.',
          correctAnswer: true,
          explanation:
            'What differs is who is exposed to whom, and which mandate allows it.',
        },
        {
          id: 'cln-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What should an investor establish before treating a note as a view on one borrower?',
          options: [
            'Who holds the collateral and what happens to it',
            'The coupon frequency',
            'The governing law of the note',
            'Whether it is listed',
          ],
          correctIndex: 0,
          explanation: 'That answer determines whether they own one credit or two.',
        },
      ],
    },
  },
  {
    id: 'assetswap',
    categoryId: 'credit',
    name: 'Asset Swap',
    hook: 'Turn a fixed-rate bond into a floating one',
    summary:
      'A package rather than a single instrument: a fixed-rate bond bought together with an interest rate swap that pays its coupon away and returns a floating rate in its place. What the holder is left with is the issuer’s credit risk expressed as a spread over SOFR, with the interest rate risk stripped out. That number — the asset swap spread — is the cash market’s price for the same default risk a CDS covers, which is why the two can be set side by side, and why the gap between them says something neither figure says alone.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An asset swap combines a fixed-rate bond with an interest rate swap so that the holder ends up receiving a floating rate instead of a fixed coupon. The investor buys the bond and, in the same trade with the same dealer, pays the bond’s coupon away on the swap and receives SOFR plus a spread in return. The swap is struck to the bond’s own maturity and coupon dates, so each fixed payment received on the bond goes straight out on the swap the day it arrives. What remains is a floating-rate exposure to one issuer’s credit.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'In the standard par-par structure the investor pays par for the bond whatever it is actually worth, and the swap notional is par too. The asset swap spread then does two jobs at once. It carries the difference between the bond’s coupon and the market swap rate for that maturity, and it amortises the gap between par and the bond’s real price. A bond trading below par therefore asset-swaps at a wider spread, because the investor has overpaid at the outset and has to be compensated over the life of the trade. The alternative market-value structure sets the swap notional at the price actually paid, which avoids the over- or underpayment but leaves an untidy notional.',
        callout:
          'Two points of overpayment is not two points of spread. Spread over a five-year annuity of about 4.5, it adds roughly 44 basis points a year to the asset swap spread.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'A bank or fund that wants credit exposure without a view on rates can hold the bond and be largely indifferent to where the curve goes, which is why bond portfolios are routinely asset-swapped on the way in. The second use is comparison. The asset swap spread and the CDS spread on the same issuer and maturity are two prices for the same default risk, and the difference between them — the CDS-bond basis, defined as the CDS spread minus the asset swap spread — is usually negative for investment-grade names. The bond has to be funded and consumes balance sheet while the swap does not, so the cash buyer demands more spread than the protection buyer pays. Pushing the other way, the protection buyer holds a cheapest-to-deliver option over the qualifying obligations, and a restructuring can trigger the CDS on a bond that keeps paying; a bond that is special in repo funds cheaply, which lifts its price and tightens its spread; and covenants the CDS does not respond to, such as a change-of-control put, do the same.',
        callout:
          'The negative basis trade — buy the bond on asset swap, buy protection on the same issuer — is not free money. It only pays if the bond can be funded near the benchmark the spread is quoted over, and a repo rate 30bp above it outweighs a 24bp basis outright.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Asset swap spread, the par-par and market-value structures, the annuity factor that turns an upfront price difference into a running spread, and the Z-spread, which measures much the same credit compensation against a zero-coupon curve rather than through a swap. The two are close but not equal — the asset swap spread comes out of a par-notional swap and the Z-spread out of the bond’s own discounted cashflows, so they drift apart as the price moves away from par. The CDS-bond basis is positive when protection costs more than the bond pays and negative when it costs less.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The swap does not die with the bond. A plain asset swap has no credit termination, so an investor whose bond has defaulted is still paying fixed on a swap running to the original maturity and has to unwind it at whatever it is then worth — a loss if rates have fallen since the trade was struck. The dealer is a counterparty for that whole period, the swap leg generates margin calls while the bond does not, and the two legs are often documented separately, so selling the bond leaves a naked swap behind unless it is unwound at the same time.',
        callout:
          'A par-par package hedged with protection on the same notional comes back to par after a credit event: the bond recovers the auction price and the protection pays par minus it. The interest rate swap is the piece left over.',
      },
    ],
    keyTerms: [
      {
        term: 'Asset swap spread',
        definition:
          'The running spread over the floating benchmark the package pays, and the cash market’s measure of the issuer’s credit risk.',
      },
      {
        term: 'Par-par structure',
        definition:
          'The standard form, in which the investor pays par for the bond and the swap notional is par, whatever the bond is actually worth.',
      },
      {
        term: 'Annuity factor',
        definition:
          'The sum of the discount factors over the bond’s remaining life, which converts an upfront price difference into a running spread.',
      },
      {
        term: 'Z-spread',
        definition:
          'The constant spread over the zero-coupon curve that makes a bond’s discounted cashflows equal its market price.',
      },
      {
        term: 'CDS-bond basis',
        definition:
          'The CDS spread minus the asset swap spread on the same issuer and maturity, negative when the bond pays more than protection costs.',
      },
      {
        term: 'Repo specialness',
        definition:
          'The premium a particular bond commands in the repo market, which cheapens the cost of funding it and tightens its asset swap spread.',
      },
    ],
    example: {
      title: 'Asset-swapping a five-year bond, then comparing it with the CDS',
      lines: [
        'A fund buys $10m of a five-year corporate bond with a 5% annual coupon, trading in the market at 98.',
        'In a par-par asset swap the dealer delivers it at 100, so the fund pays $10m rather than $9.8m.',
        'On the swap the fund pays the 5% coupon away on $10m and receives SOFR plus a spread to the bond’s maturity.',
        'The five-year swap rate is 3.60%, so the coupon on its own is worth 140bp over it.',
        'The two points overpaid are recovered across five years: 2 points over an annuity of about 4.5 is 44bp a year.',
        'The asset swap spread is therefore about 140 + 44 = 184bp over SOFR.',
        'Five-year protection on the same issuer costs 160bp, so the basis is 160 − 184 = −24bp.',
      ],
      takeaway:
        'The bond pays 24bp a year more than protection on the same issuer costs — the same credit, two different prices. Capturing that gap means funding $10m of bond, and a repo rate of SOFR + 30bp turns the trade into a 6bp loss.',
    },
    inPractice:
      'Bank treasury and credit portfolios asset-swap most of the fixed-rate paper they buy, so the position earns a spread over SOFR and the book carries credit risk rather than duration — new corporate issues are often marketed in asset swap terms for exactly that audience. Relative-value desks at hedge funds trade the CDS-bond basis directly, buying the bond on asset swap and protection against it when the basis is negative enough to survive their funding cost. Dealers quote the bond and its swap as one package rather than two trades.',
    relatedProductIds: ['cds', 'irs', 'trs'],
    quiz: [
      {
        id: 'assetswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An asset swap turns a bond’s fixed coupon into a floating receipt without the investor selling the bond.',
        correctAnswer: true,
        explanation:
          'The bond stays in the portfolio; the swap pays its coupon away and returns SOFR plus a spread.',
      },
      {
        id: 'assetswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does an asset swap package together?',
        options: [
          'Two bonds from the same issuer with different maturities',
          'A fixed-rate bond and an interest rate swap that pays its coupon away',
          'A bond and a credit default swap on the same issuer',
          'A floating-rate note and a cross-currency swap',
        ],
        correctIndex: 1,
        explanation:
          'The bond supplies the credit exposure and the swap removes the fixed-rate exposure that came with it.',
      },
      {
        id: 'assetswap-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'In a par-par asset swap the investor pays the bond’s market price rather than par.',
        correctAnswer: false,
        explanation:
          'Par-par means par is paid and the swap notional is par; the price difference is carried in the spread.',
      },
      {
        id: 'assetswap-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A bond trades at 98 but is delivered at par in an asset swap. What does that do to the asset swap spread?',
        options: [
          'Nothing — the price the bond trades at is irrelevant to the spread',
          'It narrows the spread, because the bond was trading below par',
          'It widens the spread, because the investor has overpaid and is compensated over the life of the trade',
          'It is settled as a separate upfront payment from the dealer instead',
        ],
        correctIndex: 2,
        explanation:
          'The two points of overpayment are amortised into the running spread, which is why discount bonds asset-swap wider.',
      },
      {
        id: 'assetswap-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Two points of overpayment on a five-year bond, with an annuity factor of about 4.5, adds roughly how much to the asset swap spread?',
        options: ['9bp', '90bp', '200bp', '44bp'],
        correctIndex: 3,
        explanation:
          'Two points spread over an annuity of 4.5 is 0.44% a year, or 44bp. Skipping the amortisation and charging the full two points in year one gives 200bp instead.',
      },
      {
        id: 'assetswap-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'An asset swap leaves the investor holding the issuer’s credit risk while stripping out the interest rate risk.',
        correctAnswer: true,
        explanation:
          'That separation is the point: the package pays a spread for credit and is largely indifferent to the level of rates.',
      },
      {
        id: 'assetswap-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A bond asset-swaps at 184bp and five-year protection on the issuer costs 160bp. What is the CDS-bond basis?',
        options: ['+344bp', '−24bp', '+24bp', '−184bp'],
        correctIndex: 1,
        explanation:
          'The basis is the CDS spread minus the asset swap spread: 160 − 184 = −24bp, a negative basis.',
      },
      {
        id: 'assetswap-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Funding cost tends to push the CDS-bond basis negative, because the bondholder must finance the position while the protection seller need not.',
        correctAnswer: true,
        explanation:
          'The cash buyer demands extra spread for funding and balance sheet, so the bond spread sits above the CDS spread.',
      },
      {
        id: 'assetswap-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Which is the correct definition of the CDS-bond basis?',
        options: [
          'The CDS spread minus the asset swap spread on the same issuer and maturity',
          'The bond’s yield minus the government bond yield of the same maturity',
          'The asset swap spread minus the bond’s repo rate',
          'The difference between the on-the-run and the off-the-run index series',
        ],
        correctIndex: 0,
        explanation:
          'Both legs must be the same issuer and the same maturity, or the comparison is not measuring one credit.',
      },
      {
        id: 'assetswap-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'The asset swap spread and the Z-spread on the same bond are always identical.',
        correctAnswer: false,
        explanation:
          'One comes out of a par-notional swap and the other from the bond’s own discounted cashflows, so they diverge as the price leaves par.',
      },
      {
        id: 'assetswap-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The bond inside an asset swap defaults. What happens to the interest rate swap?',
        options: [
          'It terminates automatically alongside the bond',
          'Its notional falls to the bond’s recovery value',
          'It continues, leaving the investor paying fixed on a bond that no longer exists',
          'It converts into a credit default swap on the same issuer',
        ],
        correctIndex: 2,
        explanation:
          'A plain asset swap has no credit termination, so the swap has to be unwound at market value — a loss if rates have fallen.',
      },
      {
        id: 'assetswap-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Once a bond bought on asset swap is hedged with protection on the same issuer, the position is riskless.',
        correctAnswer: false,
        explanation:
          'Funding cost, the swap that survives a default and the dealer’s own credit all remain, and any of them can outweigh the basis.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Par-par, and where the money goes',
          content:
            'The standard structure trades the bond at par regardless of its market price, with the difference settled as an upfront payment, so the investor ends up holding a par-priced floating rate exposure to the issuer. The swap notional is the par amount, not the price paid, which matters when the bond is trading a long way from par — a deeply discounted bond swapped at par leaves the arranger financing the gap, and that financing is inside the spread being quoted. The market value alternative sets the notional to the actual price instead, and prices differently for exactly that reason.',
          callout:
            'Two asset swap spreads on the same bond can differ simply because one is par-par and the other is market value. The structure has to be stated before the number means anything.',
        },
        {
          title: 'What the spread measures',
          content:
            'An asset swap spread is a funding-adjusted credit measure: it says what this bond yields over the floating benchmark once its fixed coupon has been swapped away. It is not the same as a Z-spread, which discounts the bond’s cash flows on the curve without any swap, nor the same as a credit default swap spread, which references default alone. The three are related and they disagree, and the differences between them are traded — the gap to the default swap is the basis, and it moves with funding and with who is able to hold bonds.',
        },
        {
          title: 'The swap survives the bond',
          content:
            'The most important thing about the structure is what happens on default: the bond stops paying and the interest rate swap does not. The investor is left holding a defaulted asset and a live swap obligation, still paying and receiving on the original schedule, with a mark-to-market that has nothing to do with the credit event. Unwinding it costs whatever the curve has done since. That asymmetry is the reason asset swap packages are documented carefully and the reason a "credit trade" here has a rates position bolted to it.',
          callout:
            'This is the cleanest illustration in the catalogue of a package being two instruments rather than one, and of the second one outliving the first.',
        },
      ],
      quiz: [
        {
          id: 'assetswap-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'In a par-par asset swap, what is the swap notional?',
          options: [
            'The price actually paid for the bond',
            'The par amount of the bond',
            'The bond’s accrued interest',
            'The present value of the coupons',
          ],
          correctIndex: 1,
          explanation:
            'Which is what leaves the arranger financing the gap when the bond trades far from par.',
        },
        {
          id: 'assetswap-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A market value asset swap sets the notional to the price paid rather than to par.',
          correctAnswer: true,
          explanation:
            'And it therefore prices differently, which is why the structure has to be stated with the spread.',
        },
        {
          id: 'assetswap-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Two quoted asset swap spreads on the same bond are directly comparable.',
          correctAnswer: false,
          explanation:
            'Not unless both are the same structure. Par-par and market value answer different questions.',
        },
        {
          id: 'assetswap-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does an asset swap spread measure?',
          options: [
            'The probability of default',
            'What the bond yields over the floating benchmark once its coupon is swapped away',
            'The bond’s duration',
            'The cost of borrowing the bond',
          ],
          correctIndex: 1,
          explanation:
            'A funding-adjusted credit measure, related to but distinct from a Z-spread or a default swap spread.',
        },
        {
          id: 'assetswap-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'An asset swap spread and a credit default swap spread on the same issuer should be equal.',
          correctAnswer: false,
          explanation:
            'The gap between them is the basis, and it moves with funding and with who can hold bonds.',
        },
        {
          id: 'assetswap-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'How does a Z-spread differ from an asset swap spread?',
          options: [
            'It discounts the bond’s cash flows on the curve, with no swap involved',
            'It applies only to floating rate notes',
            'It ignores the bond’s coupon',
            'It is quoted in price rather than in spread',
          ],
          correctIndex: 0,
          explanation:
            'Three related measures that disagree, and the disagreements are themselves traded.',
        },
        {
          id: 'assetswap-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'foundational',
          prompt:
            'When the bond defaults, the interest rate swap terminates automatically.',
          correctAnswer: false,
          explanation:
            'It does not. The investor holds a defaulted asset and a live swap on the original schedule.',
        },
        {
          id: 'assetswap-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What is the investor left with after a default in this package?',
          options: [
            'Nothing — both legs settle together',
            'A defaulted bond and a live swap obligation with its own mark-to-market',
            'A cash settlement from the swap counterparty',
            'A claim on the swap counterparty for the bond’s value',
          ],
          correctIndex: 1,
          explanation:
            'And unwinding the swap costs whatever the curve has done since the trade was put on.',
        },
        {
          id: 'assetswap-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The swap’s mark-to-market at the point of default is related to the credit event.',
          correctAnswer: false,
          explanation:
            'It reflects interest rates. The two legs of the package have nothing to do with each other once the bond fails.',
        },
        {
          id: 'assetswap-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What does this structure illustrate most clearly?',
          options: [
            'That a package is two instruments, and the second can outlive the first',
            'That credit risk can be removed entirely',
            'That swaps are safer than bonds',
            'That par pricing eliminates market risk',
          ],
          correctIndex: 0,
          explanation:
            'Which is why the documentation of the package matters as much as the spread quoted on it.',
        },
        {
          id: 'assetswap-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A trade described as a credit trade here has an interest rate position attached to it.',
          correctAnswer: true,
          explanation:
            'The swap is a rates instrument, and it does not disappear because the credit did.',
        },
        {
          id: 'assetswap-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'Why does a deeply discounted bond complicate a par-par structure?',
          options: [
            'The coupon cannot be swapped',
            'The swap notional exceeds the money invested, and the gap has to be financed',
            'The bond cannot be delivered',
            'The spread becomes negative by construction',
          ],
          correctIndex: 1,
          explanation:
            'That financing is inside the quoted spread, which is one reason two quotes can differ so much.',
        },
      ],
    },
  },
  {
    id: 'cdxopt',
    categoryId: 'credit',
    name: 'Credit Index Option',
    hook: 'An option on a credit index spread',
    summary:
      'An option whose underlying is a credit index and whose strike is a spread rather than a price, a rate or an exchange rate. The buyer of a payer acquires the right to buy protection at an agreed spread on a fixed date; the buyer of a receiver acquires the right to sell it. The naming is borrowed from interest-rate swap options and runs against equity intuition — the payer is the bearish position — and the payoff carries a mechanism found nowhere else: if a name in the index defaults before expiry, the loss travels into the option rather than being lost with it. This is where credit volatility itself is bought and sold, and the standard way a large book buys a convex hedge against a credit selloff.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A credit index option is the right, but not the obligation, to enter a credit index swap at an agreed spread on a fixed future date. The strike is a spread level in basis points, and the option is European — the decision is made once, at expiry. A payer option is the right to buy protection at the strike, so it gains as spreads widen; a receiver option is the right to sell protection at the strike, so it gains as spreads tighten.',
        callout:
          'Payer and receiver are inherited from swaptions and describe the premium leg: the payer holder pays it, which makes the payer the bearish credit position. That is the opposite way round to a call in equity, and it is the most common mistake with these contracts.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The buyer pays a premium upfront, quoted in basis points of the notional, and at expiry compares the index spread with the strike. Exercise delivers a position in the underlying index swap struck at that spread rather than a cash difference. The payoff is not simply the spread gap: a basis point of spread is worth a basis point a year for the remaining life of the index, so the gap is multiplied by the index’s risky annuity before it becomes cash. Front-end protection is the piece with no analogue elsewhere in the market. If a constituent suffers a credit event between trade date and expiry, that name’s loss is carried into the payer’s payoff, collected by exercising, so the option does not simply become worthless because a name in the index has defaulted — and a payer can be worth exercising even when the index has finished inside the strike.',
        callout:
          'Forty basis points in the money on a five-year index is worth about 40 × 4.5 = 180 basis points of notional, not 40. The annuity is what converts a spread into cash, and it is the step most often skipped.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Options are how credit volatility is traded as a quantity in its own right, apart from the direction of spreads. The most common use is a macro tail hedge: buying payers on an investment-grade index is a cheap, convex way to be protected against a credit selloff, because the loss is capped at the premium while the payoff keeps growing as spreads gap — a payer gains more from a 60bp widening than twice what it gains from a 30bp one. Desks sell receivers to monetise a view that spreads will not tighten further, and buy payer spreads rather than outright payers to cheapen a hedge by giving up the far tail. Payers routinely trade at a higher implied volatility than receivers the same distance from the money, because spreads grind tighter and gap wider, and the skew prices that asymmetry.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike spread, payer and receiver, expiry, premium, front-end protection, and implied spread volatility. An option references one specific index series rather than whichever series happens to be on the run, so after a roll it still exercises into the series it was struck on, which by then can be materially less liquid. Delta is expressed as an equivalent index notional, and most trades are struck with a delta exchange so the buyer starts flat on direction and long volatility alone.',
        callout:
          'Expiries are monthly and almost all of the liquidity sits in the first three. Quoting is concentrated on the main indices — CDX.NA.IG, CDX.NA.HY, iTraxx Europe Main and Crossover — with single-name credit options traded far more thinly.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The premium on a payer is lost in full if spreads do not widen past the strike, and a hedge rolled every quarter bleeds a great deal across a calm year. Selling options hands that convexity away: the seller collects a capped premium and takes an open-ended loss in precisely the scenario the rest of the book is also suffering. Liquidity sits in a handful of strikes and expiries on a few indices, so an unusual strike or an off-the-run series can be expensive to unwind. And it remains an index hedge — it responds to the index, not to the particular bonds held, so the payoff can fall well short of the portfolio’s loss.',
      },
    ],
    keyTerms: [
      {
        term: 'Payer option',
        definition:
          'The right to buy protection on the index at the strike spread, which gains value as spreads widen.',
      },
      {
        term: 'Receiver option',
        definition:
          'The right to sell protection on the index at the strike spread, which gains value as spreads tighten.',
      },
      {
        term: 'Strike spread',
        definition:
          'The spread level, in basis points, at which the holder may enter the underlying index swap on exercise.',
      },
      {
        term: 'Front-end protection',
        definition:
          'Compensation carried into a payer’s payoff for credit events occurring between trade date and expiry.',
      },
      {
        term: 'Risky annuity',
        definition:
          'The duration-like factor that converts one basis point of index spread into an amount of cash.',
      },
      {
        term: 'Delta exchange',
        definition:
          'The offsetting index position traded alongside the option so the buyer starts without a directional view.',
      },
    ],
    example: {
      title: 'A payer that pays twice — once on spread, once on a default',
      lines: [
        'A fund buys $100m of a three-month payer on a 125-name investment-grade index, struck at 70bp.',
        'The premium is 20bp of notional, or $200,000, paid upfront.',
        'In the first scenario the index is at 110bp at expiry, 40bp through the strike.',
        'With a risky annuity of about 4.5, that is worth 40 × 4.5 = 180bp of notional, or $1.8m — a net $1.6m.',
        'In the second scenario the index finishes at 68bp, inside the strike, but one name has defaulted at an auction price of 20.',
        'That name is $800,000 of the notional, so front-end protection is 80% × $800,000 = $640,000.',
        'Exercising also enters the index at 70bp against a market of 68bp, costing about 9bp on the surviving $99.2m, or $89,000.',
      ],
      takeaway:
        'The second scenario still returns $640,000 − $89,000 = $551,000 against a $200,000 premium, even though the index finished inside the strike. Without front-end protection the option would have expired worthless, which is why a credit payer is not simply a put on the index level.',
    },
    inPractice:
      'Macro funds and multi-asset managers buy payers on CDX.NA.IG or iTraxx Europe Main as a tail hedge, because a few basis points of premium buys a payoff that grows as spreads gap — cheaper to carry through a long calm stretch than holding index protection outright. Pension funds and insurers with large corporate bond books do the same ahead of events they cannot trade around. On the other side, dealers and volatility funds sell options to earn the premium and hedge the delta with the underlying index, and relative-value desks trade the payer skew against realised spread volatility.',
    relatedProductIds: ['cdx', 'swaption', 'varswap'],
    quiz: [
      {
        id: 'cdxopt-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A payer option gives its holder the right to buy protection on the index at the strike spread.',
        correctAnswer: true,
        explanation:
          'The payer pays the premium leg of the index, which is what a protection buyer does.',
      },
      {
        id: 'cdxopt-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Which position gains value when credit spreads widen?',
        options: [
          'A receiver option on the index',
          'Selling protection on the index',
          'A payer option on the index',
          'A sold payer option',
        ],
        correctIndex: 2,
        explanation:
          'Widening spreads make protection more valuable, and the payer is the right to buy it at a fixed level.',
      },
      {
        id: 'cdxopt-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Buying a payer is the bullish credit position, in the same way buying a call is bullish in equity.',
        correctAnswer: false,
        explanation:
          'A payer buys protection, so it is the bearish position — the terminology cuts the opposite way to equity calls and puts.',
      },
      {
        id: 'cdxopt-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Credit index options are American-style and can be exercised at any point before expiry.',
        correctAnswer: false,
        explanation:
          'They are European: the exercise decision is made once, on the expiry date.',
      },
      {
        id: 'cdxopt-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A payer finishes 40bp through the strike on an index with a risky annuity of about 4.5. What is that worth as a percentage of notional?',
        options: ['0.40%', '1.80%', '0.09%', '4.50%'],
        correctIndex: 1,
        explanation:
          '40bp × 4.5 = 180bp of notional. Quoting 0.40% ignores the annuity; 0.09% divides by it instead of multiplying.',
      },
      {
        id: 'cdxopt-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A payer option becomes worthless if one of the index constituents defaults before expiry.',
        correctAnswer: false,
        explanation:
          'Front-end protection carries that name’s loss into the payoff, so exercising can pay even when the index finishes inside the strike.',
      },
      {
        id: 'cdxopt-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The buyer of a payer option can lose no more than the premium paid.',
        correctAnswer: true,
        explanation:
          'A capped loss against an uncapped payoff is the convexity a tail hedge is bought for.',
      },
      {
        id: 'cdxopt-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why buy index payers as a tail hedge rather than simply buying index protection outright?',
        options: [
          'Payer options cannot expire worthless',
          'Index protection cannot be traded in size',
          'The premium is capped while the payoff grows as spreads gap, which is cheaper to carry through a calm stretch',
          'Options settle without any reference to the index level',
        ],
        correctIndex: 2,
        explanation:
          'Running index protection costs the full coupon every quarter; the option costs a premium and keeps the convex payoff.',
      },
      {
        id: 'cdxopt-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'An option was struck on a series that has since gone off the run. What does it exercise into at expiry?',
        options: [
          'Whichever series is on the run at expiry',
          'A basket of the surviving single-name contracts',
          'Cash only, valued at the on-the-run level',
          'The series it was struck on, which by then may be far less liquid',
        ],
        correctIndex: 3,
        explanation:
          'The option references one series for its whole life, and the roll moves liquidity away from it.',
      },
      {
        id: 'cdxopt-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Most index option trades are struck with a delta exchange, so the buyer starts without a directional position.',
        correctAnswer: true,
        explanation:
          'The offsetting index trade leaves the buyer long volatility rather than long or short credit.',
      },
      {
        id: 'cdxopt-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What is the particular danger in selling payer options on a credit index?',
        options: [
          'The premium received is capped while the loss grows as spreads gap, in exactly the scenario the rest of the book is suffering',
          'The seller becomes the legal owner of the constituents’ bonds',
          'The seller must post the full index notional at inception',
          'The position cannot be hedged with the underlying index',
        ],
        correctIndex: 0,
        explanation:
          'Selling convexity pays a little most of the time and loses a great deal in the one state that matters.',
      },
      {
        id: 'cdxopt-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A manager hedges a specific corporate bond portfolio with index payers. What risk remains?',
        options: [
          'Interest rate risk on the premium paid',
          'The option responds to the index rather than the bonds held, so the payoff can fall short of the loss',
          'The option can be exercised against the manager before expiry',
          'Front-end protection can be reclaimed by the seller after expiry',
        ],
        correctIndex: 1,
        explanation:
          'It is the same basis risk that comes with any index hedge, carried through into the option.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'Exercising into an index position',
          content:
            'A payer option gives the right to buy protection on the index at a strike spread; a receiver gives the right to sell it. Exercise does not settle in cash and walk away — it delivers a position in the index itself, with all of that index’s conventions: the standard coupon, an upfront to reconcile the strike to the market, and the current factor. A buyer who has not thought past the payoff diagram can find themselves holding a live credit position on the Monday after expiry, which is the point of the instrument rather than a surprise in it.',
          callout:
            'The strike is quoted in spread and the delivered position pays a fixed coupon, so the difference between them arrives as cash on exercise. That reconciliation is where most of the confusion lives.',
        },
        {
          title: 'Front-end protection',
          content:
            'A defaulted constituent between trade and expiry raises a question the payoff diagram cannot answer: does the option holder benefit from a default that happened before they had the position? The convention says yes for a payer — the option includes protection against defaults in that window, so the buyer is compensated as if they had held the index all along. It is a small clause with a large consequence: without it, a payer option would be a hedge with a hole in exactly the period the buyer bought it for.',
        },
        {
          title: 'A volatility surface for credit',
          content:
            'These options are quoted in volatility, and the surface behaves like an equity one turned around: payers on wider strikes are bid up, because the demand is for protection against a sell-off, and the skew steepens when credit is stressed. The underlying is a spread rather than a price, and a spread is bounded below by zero and unbounded above, which shapes the distribution the market prices. That asymmetry is why credit volatility is quoted and hedged in its own terms rather than borrowed wholesale from equities.',
        },
      ],
      quiz: [
        {
          id: 'cdxopt-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does exercising a payer option deliver?',
          options: [
            'A cash settlement only',
            'A position buying protection on the index, with its coupon, upfront and factor',
            'The underlying bonds',
            'A position in the single names',
          ],
          correctIndex: 1,
          explanation:
            'You are left holding a live credit position, which is the instrument working rather than failing.',
        },
        {
          id: 'cdxopt-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'foundational',
          prompt:
            'A receiver option gives the right to sell protection on the index.',
          correctAnswer: true,
          explanation:
            'Payer buys protection, receiver sells it — named for which side of the coupon you end up on.',
        },
        {
          id: 'cdxopt-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Why does an upfront payment arise on exercise?',
          options: [
            'The strike is in spread terms while the delivered index pays a fixed coupon',
            'The clearing house charges a fee',
            'The factor has changed since the trade',
            'The option premium is deferred',
          ],
          correctIndex: 0,
          explanation:
            'Reconciling the two is where most of the confusion about these options lives.',
        },
        {
          id: 'cdxopt-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A payer option conventionally includes protection against defaults occurring before expiry.',
          correctAnswer: true,
          explanation:
            'Front-end protection. Without it, the option would be a hedge with a hole in the exact period it was bought for.',
        },
        {
          id: 'cdxopt-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What problem does front-end protection solve?',
          options: [
            'Whether the buyer benefits from a default that happens before they hold the position',
            'How the strike is set',
            'Which constituents are in the index',
            'When the premium is paid',
          ],
          correctIndex: 0,
          explanation:
            'The payoff diagram cannot answer it, so the documentation does.',
        },
        {
          id: 'cdxopt-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'intermediate',
          prompt:
            'A default between trade date and expiry is irrelevant to an index option.',
          correctAnswer: false,
          explanation: 'It is exactly what the front-end clause exists to address.',
        },
        {
          id: 'cdxopt-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'How are these options quoted?',
          options: [
            'In volatility',
            'In upfront cash only',
            'As a spread over the index',
            'In recovery terms',
          ],
          correctIndex: 0,
          explanation:
            'And the surface has its own shape, driven by the fact that the underlying is a spread.',
        },
        {
          id: 'cdxopt-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Demand concentrates in payers at wider strikes, which steepens the skew when credit is stressed.',
          correctAnswer: true,
          explanation:
            'Protection against a sell-off is what people buy, and the price reflects it.',
        },
        {
          id: 'cdxopt-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Why does credit volatility need its own treatment rather than borrowing from equities?',
          options: [
            'The underlying is a spread: bounded below by zero and unbounded above',
            'Credit markets are smaller',
            'Options on credit cannot be delta hedged',
            'Credit options are always American',
          ],
          correctIndex: 0,
          explanation:
            'The asymmetry of the underlying shapes the whole distribution being priced.',
        },
        {
          id: 'cdxopt-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'A buyer of these options should expect to manage a credit position after exercise.',
          correctAnswer: true,
          explanation:
            'The option delivers a position rather than a cheque, and the position has conventions of its own.',
        },
        {
          id: 'cdxopt-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What does the delivered index position carry with it?',
          options: [
            'The standard coupon, an upfront and the current factor',
            'Only the strike spread',
            'A fresh set of constituents',
            'A cash-settled cash flow schedule',
          ],
          correctIndex: 0,
          explanation:
            'All of the index’s conventions arrive with it, including the record of any constituent that has already defaulted.',
        },
        {
          id: 'cdxopt-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'The skew in credit index options tends to flatten when credit is under stress.',
          correctAnswer: false,
          explanation:
            'It steepens, because that is when demand for protection at wider strikes is strongest.',
        },
      ],
    },
  },
];
