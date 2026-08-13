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
  },
];
