import type { Product } from '../types';

/**
 * Market case studies — six failures, each one a mechanism from the free
 * catalogue taken to its conclusion. Ids are stable: saved progress is keyed
 * by them.
 *
 * The arc is deliberately not the product arc. A case runs what happened, the
 * position, why it broke, what it cost and what it teaches, because the useful
 * part of a blow-up is the step where a reasonable-looking trade stopped being
 * one. Every figure here is from the public record — regulatory reports,
 * commissioned reviews, court judgments — and the ones that are estimates say
 * so.
 */
export const casesProducts: Product[] = [
  {
    id: 'archegos',
    categoryId: 'cases',
    name: 'Archegos, 2021',
    hook: 'Five banks, one position, and none of them could see it',
    summary:
      'Archegos Capital Management held concentrated bets on a handful of shares through total return swaps at several prime brokers at once. Because the dealers held the stock and the fund held the return, no disclosure was triggered and no bank saw more than its own slice. When the largest holding fell, the margin calls went unmet, the dealers raced each other to sell the same shares, and the banks lost roughly $10bn between them in a matter of days.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'In late March 2021 shares in ViacomCBS fell sharply after the company announced an equity raise. Archegos, a family office running a highly concentrated long book in that and a small number of other US and Chinese media and technology names, could not meet the resulting margin calls. Its prime brokers began liquidating the underlying shares. Two of them got out early; the rest sold into a market that already knew what was coming.',
        callout:
          'A family office manages one family’s money and is not required to register as an investment adviser in the US, so far less of its activity is visible to anyone outside its brokers.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'The exposure was built with total return swaps rather than shares. The fund received the return on a notional amount and paid a financing rate; the dealer on the other side bought the actual stock as its hedge. That structure has a consequence beyond leverage: the dealer is the registered holder, so the fund crosses no shareholding disclosure threshold, and the position is invisible in the filings anyone else would read. Running the same trade at five prime brokers meant each one saw a position it considered large but survivable.',
        callout:
          'The same instrument is in the free catalogue as an equity swap. Nothing exotic was used here — the failure was in how much of it there was and who could see it.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Margin was the binding failure. Initial margin was set at levels that did not scale with how concentrated the book was, or with how long it would take to sell the shares in a falling market — a position worth several days of a stock’s entire trading volume cannot be exited at the price used to mark it. Credit Suisse’s own commissioned review afterwards described risk limits repeatedly exceeded, margin terms softened to retain the relationship, and warnings from within the risk function that were not acted on.',
        callout:
          'Concentration and liquidity are the two adjustments that turn a margin number into a real one. Neither was applied at a level that mattered.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'Credit Suisse lost about $5.5bn, Nomura about $2.9bn, Morgan Stanley about $900m and UBS about $774m. Goldman Sachs and Morgan Stanley moved first and took far less damage than the banks that waited — in a disorderly unwind the order of exit is most of the outcome. The episode was one of a series of losses in the years before Credit Suisse’s takeover by UBS in 2023, and it prompted supervisory reviews of prime brokerage margining on both sides of the Atlantic.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Three things, and none of them requires an exotic instrument. Gross exposure matters when the positions are correlated, because netting across names that fall together nets nothing. A derivative can move the disclosure obligation to whoever holds the hedge, so what is filed publicly is not the same as what is held. And a hedge that consists of owning a large fraction of a company’s tradable shares is only a hedge for as long as those shares can be sold.',
        callout:
          'The counterparty question this leaves is simple to ask and hard to answer: how much of this client’s total book am I looking at?',
      },
    ],
    keyTerms: [
      {
        term: 'Family office',
        definition:
          'A firm managing a single family’s wealth, subject to lighter registration and disclosure than a fund.',
      },
      {
        term: 'Prime brokerage',
        definition:
          'The bank service providing financing, execution and custody to a fund, and the margin terms that go with it.',
      },
      {
        term: 'Gross exposure',
        definition:
          'The total size of positions before offsetting longs against shorts — the number that matters when they move together.',
      },
      {
        term: 'Days to liquidate',
        definition:
          'How long a position would take to sell at normal volumes, and so how stale the price used to margin it is.',
      },
      {
        term: 'Beneficial ownership',
        definition:
          'Who is treated as holding a share for disclosure purposes — the dealer hedging a swap, not the fund receiving its return.',
      },
      {
        term: 'Disorderly unwind',
        definition:
          'A forced liquidation in which sellers compete, so the price achieved is far below the marked value.',
      },
    ],
    example: {
      title: 'How far a 20% fall goes through 15% margin',
      lines: [
        'A fund takes $10bn of exposure to one share through swaps, at 15% initial margin: it has posted $1.5bn.',
        'The share falls 20%. The mark-to-market loss is $10bn × 0.20 = $2bn.',
        'That is $500m more than everything posted, so the dealer calls for the shortfall and the fund has nothing left to send.',
        'The dealer now owns the hedge — $8bn of shares it must sell — while four other dealers hold the same trade on the same name.',
        'At 15% margin the position tolerates a 15% fall before the collateral is gone; a concentrated single share can do that in a session.',
        'Margin of 40% would have absorbed the same move with $2bn still posted, and made the trade far less attractive to put on.',
      ],
      takeaway:
        'Initial margin is a statement about how far the price can move before the loss becomes the dealer’s. Setting it by relationship rather than by concentration and liquidity is how five firms priced the same risk at a fifth of what it was.',
    },
    inPractice:
      'Prime brokers now ask for portfolio-level margin that scales with concentration and liquidation horizon, and supervisors have pressed banks on whether they can see a client’s exposure across the street rather than only on their own book. The disclosure gap the trade exploited has been narrowed but not closed.',
    relatedProductIds: ['trs', 'eqswap', 'cfd'],
    quiz: [
      {
        id: 'archegos-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Archegos built its exposure by buying the shares outright in its own name.',
        correctAnswer: false,
        explanation:
          'It held total return swaps. The dealers bought the shares as their hedge, which is why the position was not visible in filings.',
      },
      {
        id: 'archegos-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What triggered the unwind in March 2021?',
        options: [
          'A regulator ordering the positions to be closed',
          'A sharp fall in the largest holding after an equity raise',
          'The expiry of the swaps on a single date',
          'A downgrade of the fund’s credit rating',
        ],
        correctIndex: 1,
        explanation:
          'The fall produced margin calls the fund could not meet, and the prime brokers began selling the hedges.',
      },
      {
        id: 'archegos-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Running the same trade at several prime brokers meant no single bank saw the full size of the position.',
        correctAnswer: true,
        explanation:
          'Each saw a large but survivable book, and none could see that the same shares were financed four more times elsewhere.',
      },
      {
        id: 'archegos-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why did holding the exposure through swaps avoid shareholding disclosure in the US?',
        options: [
          'Swaps are exempt from all reporting requirements',
          'The dealer holding the hedge is the registered holder, not the fund',
          'Family offices are exempt from every securities rule',
          'The positions were held offshore',
        ],
        correctIndex: 1,
        explanation:
          'The disclosure obligation follows who holds the shares, which the derivative moves to the dealer.',
      },
      {
        id: 'archegos-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Initial margin at these banks was scaled to how concentrated and illiquid the positions were.',
        correctAnswer: false,
        explanation:
          'That was the failure. Margin did not reflect that the book was a few correlated names worth days of trading volume each.',
      },
      {
        id: 'archegos-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Why does "days to liquidate" matter to a margin calculation?',
        options: [
          'It sets the interest charged on the financing leg',
          'It decides which regulator supervises the trade',
          'A position needing days to sell cannot be exited at the price it is marked at',
          'It determines the dividend adjustment on the swap',
        ],
        correctIndex: 2,
        explanation:
          'Margin covers the move between default and liquidation, so a longer horizon needs more of it.',
      },
      {
        id: 'archegos-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Credit Suisse’s commissioned review found risk limits had been exceeded repeatedly before the losses.',
        correctAnswer: true,
        explanation:
          'It described breaches left unaddressed and margin terms softened to keep the relationship, alongside internal warnings not acted on.',
      },
      {
        id: 'archegos-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Which bank took the largest single loss?',
        options: ['Nomura', 'Credit Suisse', 'UBS', 'Morgan Stanley'],
        correctIndex: 1,
        explanation:
          'About $5.5bn, against roughly $2.9bn at Nomura and smaller losses elsewhere.',
      },
      {
        id: 'archegos-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The banks that sold their hedges first lost considerably less than those that waited.',
        correctAnswer: true,
        explanation:
          'In a disorderly unwind the order of exit is most of the outcome, which is also why nobody has an incentive to coordinate.',
      },
      {
        id: 'archegos-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why does netting longs against shorts overstate safety in a book like this one?',
        options: [
          'Because short positions cannot be margined',
          'Because the names were correlated and fell together, so the offsets were not offsets',
          'Because swaps cannot be netted under an ISDA master agreement',
          'Because the shorts were held at a different broker',
        ],
        correctIndex: 1,
        explanation:
          'Netting assumes the two sides move apart. In a concentrated, correlated book they move together and gross is the real number.',
      },
      {
        id: 'archegos-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'The instruments involved were exotic derivatives unavailable to ordinary institutions.',
        correctAnswer: false,
        explanation:
          'Total return swaps are a standard prime brokerage product. The size, the concentration and the margin were the failure.',
      },
      {
        id: 'archegos-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the question a prime broker took away from this episode?',
        options: [
          'How much of this client’s total book am I looking at?',
          'Which exchange should the hedge be cleared on?',
          'What is the dividend treatment on the swap?',
          'How long is the financing leg fixed for?',
        ],
        correctIndex: 0,
        explanation:
          'Every bank could answer questions about its own exposure. None could answer that one.',
      },
    ],
  },
  {
    id: 'amaranth',
    categoryId: 'cases',
    name: 'Amaranth, 2006',
    hook: 'A spread trade too large to leave',
    summary:
      'Amaranth Advisors, a multi-strategy hedge fund, ran enormous positions in natural gas calendar spreads — long one delivery month against short another. The trade was not directional in the obvious sense and the margin on it was small. What it was, was most of the open interest. When the spread moved against the fund it could not exit without trading against itself, and roughly $6.6bn went in a matter of weeks.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'Through 2006 Amaranth’s energy book, run by a single trader, grew to dominate natural gas futures and swaps on both the NYMEX exchange and the then-unregulated ICE platform. In September the spreads it held collapsed. The fund lost about $6.6bn — at the time the largest hedge fund loss on record — and wound down, transferring what was left of the book to JPMorgan and Citadel at a substantial discount.',
        callout:
          'The fund had returned strongly the year before on the same kind of position, after hurricanes Katrina and Rita disrupted supply. The trade was not new; the size was.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'The core trade was a calendar spread: long a winter delivery month, short a spring one, betting the gap between them would widen. March against April is the well-known version — the last month of the withdrawal season against the first month of injection — and it is volatile enough that traders call it the widow-maker. A spread is two offsetting legs, so exchanges margin it far more lightly than either leg alone, which is what allows a position of that size to be carried at all.',
        callout:
          'Margin on a spread reflects the assumption that the two legs move together. Every large spread loss is that assumption failing.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Size relative to the market, not size relative to capital, is what made the position unexitable. Amaranth held a large fraction of the open interest in the contracts it traded, so there was no counterparty for an exit of that scale except at prices that would move the market against it — the fund was the market it needed to sell into. Position accountability levels applied on NYMEX; moving positions to ICE, which was not then subject to the same oversight, avoided them. That gap was closed by later US legislation.',
        callout:
          'The distinction that matters: a position is liquid if you can leave it, not if it is quoted.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'Investors lost about 65% of the fund’s value in a month, and the fund closed. Some of the loss was other market participants’ gain — the portfolio was taken on at a discount by firms with the balance sheet to hold it, and Citadel and JPMorgan profited from doing so. Regulators subsequently brought market manipulation cases arising from the trading around settlement periods, which ran for years afterwards. San Diego’s county pension fund, an investor, was among the public losers.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'A hedged-looking position is not a small position. Spreads carry low margin because the legs are assumed to move together, so the same capital buys a far larger notional — and the loss when the assumption fails is scaled by that same notional. Liquidity has to be measured against the market’s depth rather than the fund’s size, and a mark is only a price if somebody would trade there for the whole position.',
        callout:
          'Ask of any spread book: what fraction of the open interest is this, and who is on the other side when I want out?',
      },
    ],
    keyTerms: [
      {
        term: 'Calendar spread',
        definition:
          'Long one delivery month and short another in the same commodity, trading the gap rather than the level.',
      },
      {
        term: 'Open interest',
        definition:
          'The total number of contracts outstanding, and so the measure a position’s size should be read against.',
      },
      {
        term: 'Spread margin',
        definition:
          'The reduced margin charged on offsetting legs, on the assumption that they move together.',
      },
      {
        term: 'Widow-maker',
        definition:
          'The March–April natural gas spread, across the end of the withdrawal season, and its reputation for violence.',
      },
      {
        term: 'Position limits',
        definition:
          'Caps on how much of a contract one participant may hold, applied on a regulated exchange.',
      },
      {
        term: 'Liquidation discount',
        definition:
          'The gap between a portfolio’s marked value and what a buyer will pay to take it on whole.',
      },
    ],
    example: {
      title: 'Why a spread that "cannot lose much" lost billions',
      lines: [
        'A natural gas futures contract is 10,000 MMBtu, so 100,000 contracts is one billion MMBtu of exposure.',
        'A fund is long March and short April on that size, with the spread at $2.50 per MMBtu.',
        'Spread margin on the pair is a fraction of what either leg alone would cost, so the position is carried on relatively little capital.',
        'The spread collapses to $0.75. The move is $1.75 per MMBtu.',
        'Loss: 1,000,000,000 MMBtu × $1.75 = $1.75bn, on a position whose margin implied it could barely move.',
        'And the exit is the problem: selling one billion MMBtu of March into a falling spread is what makes the spread fall further.',
      ],
      takeaway:
        'The notional is the loss multiplier, and light spread margin is what allowed the notional to get that large. The market did not have to move much; there was simply an enormous amount of it.',
    },
    inPractice:
      'Exchanges and clearing houses now scrutinise concentration in spread positions rather than only net risk, and the reporting gap between regulated exchanges and other venues has largely closed. The trade itself is unremarkable and still runs on every energy desk — at sizes the market can absorb.',
    relatedProductIds: ['cmswap', 'crackspread', 'swing'],
    quiz: [
      {
        id: 'amaranth-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Amaranth’s losses came from natural gas positions held largely as calendar spreads.',
        correctAnswer: true,
        explanation:
          'Long one delivery month against short another — a trade on the gap between them rather than on the level of gas.',
      },
      {
        id: 'amaranth-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What happened to the book when the fund failed?',
        options: [
          'It was cancelled by the exchange',
          'It was transferred to other firms at a discount',
          'It was held to expiry by the fund’s administrator',
          'It was auctioned to retail investors',
        ],
        correctIndex: 1,
        explanation:
          'JPMorgan and Citadel took it on below its marked value — that gap is the liquidation discount.',
      },
      {
        id: 'amaranth-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What is a calendar spread?',
        options: [
          'Two positions in different commodities for the same month',
          'A long and a short position in different delivery months of the same commodity',
          'An option strategy with two strikes and one expiry',
          'A forward and a swap on the same underlying',
        ],
        correctIndex: 1,
        explanation:
          'It trades the shape of the forward curve rather than its level.',
      },
      {
        id: 'amaranth-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Exchanges charge less margin on a spread than on either leg held alone.',
        correctAnswer: true,
        explanation:
          'The offset is assumed, which is what lets the same capital carry a far larger notional — and scales the loss when the assumption fails.',
      },
      {
        id: 'amaranth-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'The March–April natural gas spread is nicknamed the widow-maker because it straddles the end of the withdrawal season.',
        correctAnswer: true,
        explanation:
          'The last month of drawing gas out of storage against the first month of putting it back — a boundary where the two months can decouple violently.',
      },
      {
        id: 'amaranth-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'What made the position impossible to exit at anything near its marked value?',
        options: [
          'The contracts had already expired',
          'The fund held a large fraction of the open interest, so it was the market it needed to sell into',
          'The exchange suspended trading in natural gas',
          'The positions were physically settled and could not be closed',
        ],
        correctIndex: 1,
        explanation:
          'Liquidity is measured against the depth of the market, not against the size of the fund.',
      },
      {
        id: 'amaranth-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Position accountability levels on the regulated exchange applied equally to the fund’s positions on other venues at the time.',
        correctAnswer: false,
        explanation:
          'They did not, and moving positions to the then-unregulated platform avoided them. Later US legislation closed that gap.',
      },
      {
        id: 'amaranth-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What does "liquid" mean for a position of this size?',
        options: [
          'That a price is quoted continuously',
          'That the contract is exchange traded',
          'That the whole position can actually be left without moving the price against you',
          'That the margin requirement is low',
        ],
        correctIndex: 2,
        explanation:
          'A quoted price for a normal clip says nothing about a position that is a large share of the open interest.',
      },
      {
        id: 'amaranth-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'Amaranth’s loss of roughly $6.6bn was, at the time, the largest hedge fund loss on record.',
        correctAnswer: true,
        explanation:
          'The fund lost around 65% of its value in weeks and wound down.',
      },
      {
        id: 'amaranth-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Who benefited from the collapse?',
        options: [
          'The exchange, through cancelled trades',
          'The firms that took the portfolio on at a discount',
          'The fund’s own investors, through a clawback',
          'Nobody — the positions were written off',
        ],
        correctIndex: 1,
        explanation:
          'A forced seller’s discount is somebody else’s return for having the balance sheet to wait.',
      },
      {
        id: 'amaranth-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the general lesson about hedged-looking positions?',
        options: [
          'They cannot lose money if both legs are held to expiry',
          'Light margin lets the notional grow, and the notional is what multiplies the loss',
          'They are always more liquid than outright positions',
          'They are exempt from position limits by design',
        ],
        correctIndex: 1,
        explanation:
          'The market never had to move far. There was simply an enormous amount of position for it to move against.',
      },
      {
        id: 'amaranth-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A mark-to-market value is a reliable exit price for a position of any size.',
        correctAnswer: false,
        explanation:
          'It is a price for a normal clip. For a position that is a large share of the market, the exit price is materially worse.',
      },
    ],
  },
  {
    id: 'nickel',
    categoryId: 'cases',
    name: 'The LME nickel squeeze, 2022',
    hook: 'A hedge that could not be delivered into',
    summary:
      'In March 2022 the price of nickel on the London Metal Exchange rose from around $29,000 a tonne to over $100,000 intraday, driven by margin calls on a very large short position held by a producer as a hedge against its own output. The exchange suspended trading and then cancelled the trades already done that morning. The episode is the clearest recent lesson in three things: that a hedge with the wrong deliverable is not a hedge, that margin is symmetric and physical gains are not, and that a market can close.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'Nickel prices had been rising through early 2022, and Russia’s invasion of Ukraine added a supply shock to a market where Russia was a major producer. On 7 and 8 March the price roughly quadrupled, at one point exceeding $100,000 a tonne, as short positions were forced to buy back into a thin market. The LME halted trading on the morning of 8 March, cancelled the trades executed that day — around $3.9bn of them — and did not reopen the contract until 16 March.',
        callout:
          'A short squeeze does not need a view. It needs shorts who must buy, and not enough offer at any nearby price.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'The largest short was held by a Chinese producer, Tsingshan, across exchange contracts and bilateral positions with banks. On its face this is the most orthodox hedge there is: a producer sells forward against future output, so a falling price costs it on the physical and gains on the hedge. The problem is what it produced. Nickel pig iron and matte are not deliverable against the LME contract, which requires refined grades. The hedge tracked a price the company could not settle by delivering, so a squeeze in the deliverable grade could not be answered with its own metal.',
        callout:
          'Basis risk in one sentence: your hedge references something you do not have, and the difference is only visible when it matters.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Margin is paid in cash, daily, on the derivative. The offsetting gain on unsold physical inventory is not — nobody sends money because the metal in a warehouse is worth more. So a producer whose economics are flat can face billions in cash calls it has no cash flow to meet, which forces buying back into the squeeze and drives the price further. The exchange, meanwhile, faced defaults that would have run through its own clearing house, which is the context for the decision to cancel trades.',
        callout:
          'The asymmetry to remember: a hedge converts price risk into liquidity risk, and liquidity risk arrives faster.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'The producer agreed a standstill with its banks rather than closing the position at the peak. Firms that had bought during the cancelled session lost gains they believed they had realised, and two of them brought a judicial review against the exchange; the High Court dismissed the challenge in 2023, holding the cancellation lawful. The exchange commissioned an independent review of its handling, and its regulators examined the controls that had allowed a market to reach that state.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Check what the contract delivers, not only what it references — a hedge on a grade you do not produce is a basis position wearing a hedge’s clothes. Size the cash, not just the risk: the question is not whether the hedge works at maturity but whether you can fund it daily until then. And understand that trading venue rules include the power to halt and, in extremis, to unwind — a market being open is an assumption, not a certainty.',
        callout:
          'Every risk model in the market that week assumed a price series. For two sessions there wasn’t one.',
      },
    ],
    keyTerms: [
      {
        term: 'Short squeeze',
        definition:
          'A rise driven by shorts being forced to buy back into a market with too little offer to absorb them.',
      },
      {
        term: 'Deliverable grade',
        definition:
          'The specification a contract can be settled with physically — and the thing a producer hedge must match.',
      },
      {
        term: 'Basis risk',
        definition:
          'The exposure left when a hedge references something other than the asset actually held.',
      },
      {
        term: 'Variation margin',
        definition:
          'The daily cash settlement of a derivative’s mark-to-market, owed whatever the physical position is worth.',
      },
      {
        term: 'Trade cancellation',
        definition:
          'An exchange’s power to void executed trades, used here for a whole session’s nickel business.',
      },
      {
        term: 'Liquidity risk',
        definition:
          'The risk of being unable to fund a position that is economically sound, which is what closes most of them.',
      },
    ],
    example: {
      title: 'The cash call on a hedge that was working',
      lines: [
        'A producer is short 150,000 tonnes at an average of $25,000, hedging output it expects to sell.',
        'Initial margin at roughly $2,000 a tonne means about $300m posted at the outset.',
        'The price reaches $80,000. The mark-to-market loss is 150,000 × ($80,000 − $25,000) = $8.25bn.',
        'That is owed in cash, in days, as variation margin.',
        'The physical nickel the company will produce is worth far more than before — and not one dollar of that arrives as cash today.',
        'Buying back even a third of the short, 50,000 tonnes, means bidding for metal in the market that is squeezing it.',
      ],
      takeaway:
        'The hedge did what a hedge does: it offset the economics. What it could not do was pay its own margin, and that is the risk that closes a position.',
    },
    inPractice:
      'Commodity producers hedge in exactly this way every day, and the fix is unglamorous: match the deliverable grade where possible, price the basis where it is not, and hold a funding facility sized for a move nobody expects. Exchanges and clearing houses have since paid closer attention to concentration in a single participant’s position.',
    relatedProductIds: ['cmfwd', 'cmswap', 'clearing'],
    quiz: [
      {
        id: 'nickel-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The LME suspended nickel trading and cancelled trades already executed that morning.',
        correctAnswer: true,
        explanation:
          'Around $3.9bn of trades were voided, and the contract did not reopen for several days.',
      },
      {
        id: 'nickel-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What drove the price up so violently?',
        options: [
          'A sudden collapse in demand for stainless steel',
          'Shorts being forced to buy back into a market with little offer',
          'A change in the exchange’s pricing formula',
          'A downgrade of the exchange’s clearing house',
        ],
        correctIndex: 1,
        explanation:
          'A squeeze needs forced buyers, not a view — and there was not enough metal offered at any nearby price.',
      },
      {
        id: 'nickel-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The producer holding the large short could have settled it by delivering its own output.',
        correctAnswer: false,
        explanation:
          'Its nickel pig iron and matte were not deliverable grades against the contract, which is the basis risk at the centre of the case.',
      },
      {
        id: 'nickel-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What is basis risk?',
        options: [
          'The risk that a counterparty defaults before settlement',
          'The risk that a hedge references something other than the asset actually held',
          'The risk that margin rates change during the trade',
          'The risk of a contract being cash rather than physically settled',
        ],
        correctIndex: 1,
        explanation:
          'It is invisible while the two prices track each other, and it is the whole exposure when they stop.',
      },
      {
        id: 'nickel-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Gains on unsold physical inventory arrive as cash that can meet margin calls on the hedge.',
        correctAnswer: false,
        explanation:
          'They do not. The derivative settles daily in cash; the inventory settles when it is sold.',
      },
      {
        id: 'nickel-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What does a hedge convert price risk into?',
        options: [
          'Credit risk on the exchange',
          'Liquidity risk, through the obligation to fund margin',
          'Operational risk in settlement',
          'Nothing — a hedge removes risk entirely',
        ],
        correctIndex: 1,
        explanation:
          'And liquidity risk arrives first, which is why an economically sound hedge can still close a company.',
      },
      {
        id: 'nickel-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'The exchange’s concern during the squeeze included defaults running through its own clearing house.',
        correctAnswer: true,
        explanation:
          'That is the context for the cancellation decision — a clearing house is the counterparty to every cleared trade.',
      },
      {
        id: 'nickel-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'What happened to the firms that challenged the trade cancellation in court?',
        options: [
          'The High Court dismissed the challenge',
          'The exchange settled and reinstated the trades',
          'The case was withdrawn before a hearing',
          'The court ordered the market to reopen immediately',
        ],
        correctIndex: 0,
        explanation:
          'The 2023 judgment held the cancellation lawful, which left the losses with those who had bought that morning.',
      },
      {
        id: 'nickel-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'The producer closed its entire short position at the peak of the squeeze.',
        correctAnswer: false,
        explanation:
          'It agreed a standstill with its banks instead, which is what avoided crystallising the loss at the high.',
      },
      {
        id: 'nickel-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What should a producer check before treating a contract as a hedge?',
        options: [
          'That the contract is cleared rather than bilateral',
          'That the deliverable specification matches what it actually produces',
          'That the exchange offers position limits',
          'That the contract has daily rather than monthly settlement',
        ],
        correctIndex: 1,
        explanation:
          'Referencing the right commodity is not enough if the grade you make cannot settle the contract.',
      },
      {
        id: 'nickel-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A hedging programme should be sized against the cash it may need to post, not only the risk it removes.',
        correctAnswer: true,
        explanation:
          'The funding line is the part that fails first, and it fails in days rather than at maturity.',
      },
      {
        id: 'nickel-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What assumption did every risk model in that market rely on and briefly lose?',
        options: [
          'That margin rates stay constant',
          'That there is a continuous, tradable price series',
          'That the clearing house is default-free',
          'That volatility is normally distributed',
        ],
        correctIndex: 1,
        explanation:
          'For two sessions there was no market to mark against, and a halted market is a risk in its own right.',
      },
    ],
  },
  {
    id: 'whale',
    categoryId: 'cases',
    name: 'The London Whale, 2012',
    hook: 'A hedge that grew into the market it was hedging',
    summary:
      'JPMorgan’s Chief Investment Office ran a synthetic credit portfolio that was described as a hedge against a downturn. By early 2012 it had grown to a notional in the hundreds of billions, spread across credit indices and their tranches, and it was large enough that the market could see it and trade against it. The bank lost at least $6.2bn, restated a quarter’s results, and paid around $920m in fines. The mechanism is CS01 netted to nothing while the real exposure sat in the basis.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'In the first months of 2012, a portfolio run out of the bank’s London-based Chief Investment Office built very large positions in credit default swap indices — most famously a 2007 vintage investment grade index — selling protection on some series and tranches while buying it on others. Hedge funds noticed prices in those instruments diverging from where the constituents implied they should be, and took the other side. Losses emerged through April and May and eventually exceeded $6bn.',
        callout:
          'The nickname came from the market, not the bank: a position that moves prices by its own size is visible to everyone trading against it.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'The book was a lattice of offsetting index and tranche positions rather than one directional bet. On the risk report the spread sensitivities largely cancelled, which is what let it be described as a hedge and what kept it inside limits for as long as it did. What did not cancel was the basis: an index does not have to trade in line with the sum of its constituents, and a tranche’s value depends on default correlation as well as on spread. Those exposures grew as the offsetting notional grew.',
        callout:
          'This is the CS01-versus-jump-to-default lesson in the Risk path, one level up: netting sensitivities is not the same as removing risk.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Three failures compounded. The position was too large for the market it traded in, so exiting moved prices against the bank and its counterparties knew it. A new value-at-risk model introduced in January 2012 roughly halved the reported VaR of the unit, which turned a breach into headroom and allowed the book to keep growing. And the positions were marked at favourable points within the bid-offer spread, which delayed recognition of the loss until the bank restated its first-quarter results.',
        callout:
          'A model change that reduces measured risk without reducing risk is the most dangerous kind of model change, because it looks like progress.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'The bank reported losses of at least $6.2bn on the portfolio and restated its results for the first quarter of 2012. It paid roughly $920m to US and UK regulators in 2013 and made a rare admission of wrongdoing in settling with the SEC. A US Senate subcommittee published a detailed report on the episode, and it became a central example in the debate over proprietary trading inside deposit-taking banks.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'A hedge is defined by what it offsets, not by what it is called; a book whose sensitivities net to zero can still hold enormous basis and correlation risk. Size relative to the market is a risk measure in its own right, and once a position is visible it is also a target. And when a risk number falls sharply because the model changed rather than because the book did, that is a finding, not an improvement — the questions to ask are what the old model would say today, and who chose the moment.',
        callout:
          'The controls that failed here were not exotic. They were limits, marks and a model, which is what every desk runs on.',
      },
    ],
    keyTerms: [
      {
        term: 'Synthetic credit portfolio',
        definition:
          'A book of credit derivatives held for hedging or positioning rather than lending — here, indices and tranches.',
      },
      {
        term: 'Index basis',
        definition:
          'The gap between a credit index and the sum of its constituents, and what an index hedge leaves behind.',
      },
      {
        term: 'Tranche',
        definition:
          'A slice of an index’s loss distribution, whose value depends on default correlation as well as spread.',
      },
      {
        term: 'Marking within the spread',
        definition:
          'Valuing a position at a favourable point between bid and offer, which delays recognition of a loss.',
      },
      {
        term: 'VaR model change',
        definition:
          'A revision to the risk model itself, which can reduce measured risk while the position is unchanged.',
      },
      {
        term: 'Restatement',
        definition:
          'A correction of previously published financial results, here for the quarter in which the marks were wrong.',
      },
    ],
    example: {
      title: 'What a netted book still moves on',
      lines: [
        'Suppose a book sells protection on $100bn of a credit index and buys protection on $100bn of the single names in it.',
        'With a risky annuity near 4, each side has a CS01 of $100bn × 4 × 0.0001 = $40m per basis point.',
        'The report shows a net CS01 of zero: the two sensitivities cancel exactly.',
        'Now the basis moves. The index widens 5bp more than the constituents, which nets to a 5bp exposure on $100bn.',
        'That is 5 × $40m = $200m, from a book the risk report described as flat.',
        'Ten basis points of basis, on a position several times that size, is how a hedge becomes a loss measured in billions.',
      ],
      takeaway:
        'Netting removes the risk the model measures, not the risk the position holds. The basis is what is left, and it is largest exactly when the position is too big to exit.',
    },
    inPractice:
      'Every credit desk reports CS01 by name and by curve bucket, jump-to-default by issuer, and index basis separately, because this episode is the standard argument for why one net number is not a control. Risk model changes now carry their own governance, with the old and new measures run in parallel.',
    relatedProductIds: ['cdx', 'cds', 'cs01'],
    quiz: [
      {
        id: 'whale-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The losses came from a portfolio of credit default swap indices and tranches.',
        correctAnswer: true,
        explanation:
          'It was a synthetic credit book, described internally as a hedge against a downturn.',
      },
      {
        id: 'whale-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'How did other market participants find the position?',
        options: [
          'It was disclosed in the bank’s quarterly filings',
          'Prices in those instruments diverged from what the constituents implied',
          'A regulator published the positions',
          'The bank announced it in advance to source liquidity',
        ],
        correctIndex: 1,
        explanation:
          'A position large enough to move prices by its own size announces itself, and invites the other side.',
      },
      {
        id: 'whale-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The book’s spread sensitivities largely cancelled out on the risk report.',
        correctAnswer: true,
        explanation:
          'Which is what let it be described as a hedge — and what hid the basis and correlation risk underneath.',
      },
      {
        id: 'whale-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'What exposure survives when index and single-name CS01 net to zero?',
        options: [
          'None — the book is genuinely flat',
          'The index basis, and for tranches, default correlation',
          'Only interest rate risk',
          'Only the funding cost of the position',
        ],
        correctIndex: 1,
        explanation:
          'An index need not trade in line with the sum of its constituents, and that gap is the whole position.',
      },
      {
        id: 'whale-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A tranche’s value depends only on the level of spreads, not on how defaults are correlated.',
        correctAnswer: false,
        explanation:
          'Correlation decides how losses fall across the slices, which is why tranche risk is not captured by spread sensitivity alone.',
      },
      {
        id: 'whale-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What did the new value-at-risk model do in January 2012?',
        options: [
          'Roughly halved the reported VaR of the unit',
          'Doubled the capital held against the book',
          'Replaced VaR with expected shortfall',
          'Extended the horizon from one day to ten',
        ],
        correctIndex: 0,
        explanation:
          'A breach became headroom without the position changing, and the book grew into the space the model created.',
      },
      {
        id: 'whale-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Marking positions at favourable points within the bid-offer spread delayed recognition of the losses.',
        correctAnswer: true,
        explanation:
          'The bank later restated its first-quarter results, which is what a mark that is not a price eventually forces.',
      },
      {
        id: 'whale-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Why did the size of the position make exiting worse?',
        options: [
          'Clearing houses refuse to novate large trades',
          'Selling it moved prices against the bank, and counterparties knew it had to trade',
          'The contracts could not be unwound before maturity',
          'Regulators had frozen the positions',
        ],
        correctIndex: 1,
        explanation:
          'Being the market and needing to leave it are the two halves of the same problem.',
      },
      {
        id: 'whale-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The bank restated a quarter’s results as a consequence of the episode.',
        correctAnswer: true,
        explanation:
          'The first quarter of 2012 was restated once the marks were corrected.',
      },
      {
        id: 'whale-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Roughly what did the bank pay in regulatory fines?',
        options: ['$92m', '$920m', '$9.2bn', 'Nothing — no penalty followed'],
        correctIndex: 1,
        explanation:
          'About $920m across US and UK regulators in 2013, alongside a rare admission of wrongdoing.',
      },
      {
        id: 'whale-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the general lesson about a book that nets to flat?',
        options: [
          'It is safe by construction',
          'It has removed the risk the model measures, not necessarily the risk it holds',
          'It cannot breach a limit',
          'It needs no independent valuation',
        ],
        correctIndex: 1,
        explanation:
          'Basis and correlation survive netting, and they are largest when the position is too big to exit.',
      },
      {
        id: 'whale-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A sharp fall in a risk number caused by a model change rather than a position change is a finding to investigate.',
        correctAnswer: true,
        explanation:
          'The questions are what the old model would say today and who chose the moment — which is why model changes now carry their own governance.',
      },
    ],
  },
  {
    id: 'ldi',
    categoryId: 'cases',
    name: 'The gilt LDI crisis, 2022',
    hook: 'Pension hedges that worked, and could not be funded',
    summary:
      'UK pension schemes hedge the interest rate and inflation sensitivity of their liabilities using gilts, gilt repo and swaps, often with leverage so that a small pool of collateral supports a much larger hedge. When gilt yields rose sharply after the September 2022 fiscal statement, those hedges lost value and generated collateral calls; meeting them meant selling gilts, which pushed yields higher still. The Bank of England intervened to stop the loop. Nothing about the hedges was wrong — the schemes were better funded at the end than at the start.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'On 23 September 2022 the UK government announced a large package of unfunded tax cuts. Gilt yields, already rising, moved violently: long-dated yields rose by more than a percentage point over the following days, a scale of move that would ordinarily take months. Leveraged liability-driven investment funds faced collateral calls they had to meet within days, and the only asset many of them could sell quickly was gilts. On 28 September the Bank of England announced temporary purchases of long-dated gilts to restore orderly conditions; the operation ran until 14 October and was later extended to index-linked gilts.',
        callout:
          'The Bank was explicit that this was a financial stability operation, time-limited and separate from monetary policy — it was buying to stop a spiral, not to loosen policy.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'A defined benefit scheme owes payments decades away, so its liabilities behave like a very long-dated bond: when yields fall, what it owes rises. Hedging that means holding long-dated gilts or receiving fixed on long-dated swaps. Few schemes can hold enough gilts outright and still invest in anything that grows, so the hedge is leveraged — a pool of collateral supports several times its own value in exposure through repo or swaps. That is the design, and it was working as designed.',
        callout:
          'Leverage here was not a return-seeking choice. It was how a scheme could hedge liabilities and still hold growth assets with the same money.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Rising yields make the hedge lose money — which is the point, because the liabilities are falling by more. But the hedge settles in cash, daily, and the liability does not. Each collateral call had to be met from the collateral pool, and when the pool ran low, gilts were sold to refill it. Those sales pushed yields higher, which produced the next call. The loop was self-reinforcing and fast: it turned a solvency improvement into a liquidity emergency in about three working days.',
        callout:
          'The same shape as the nickel squeeze, in a different market: a working hedge whose funding requirement arrives before its benefit does.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'The Bank bought around £19bn of gilts under the emergency programme — far less than the announced envelope, because the announcement itself did much of the work. Schemes that sold assets at the bottom crystallised losses and some ended the episode with less hedging than they started with, leaving them exposed if yields fell back. Funding levels, though, generally improved: yields up means liabilities down. Regulators then required LDI arrangements to hold much larger collateral buffers, sized to withstand a yield move of around 250 basis points.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'A hedge and the thing it hedges rarely settle on the same schedule, and the gap between them is a funding requirement nobody quotes. Leverage does not have to be speculative to be dangerous; it just has to be leverage. And when many holders of the same position face the same rule, their individual responses aggregate into a market move — the correlation that matters is not between assets but between the people who own them.',
        callout:
          'A buffer sized for a move you have never seen is expensive right up until the day it is the only thing that works.',
      },
    ],
    keyTerms: [
      {
        term: 'Liability-driven investment',
        definition:
          'Investing to match the interest rate and inflation sensitivity of a scheme’s liabilities rather than to beat an index.',
      },
      {
        term: 'Gilt repo',
        definition:
          'Borrowing cash against gilts, the usual way an LDI fund obtains leveraged exposure.',
      },
      {
        term: 'Collateral buffer',
        definition:
          'The headroom a leveraged hedge holds so that a yield move produces a call it can meet without selling.',
      },
      {
        term: 'Funding level',
        definition:
          'A scheme’s assets against its liabilities — which improved through the crisis, even as its liquidity failed.',
      },
      {
        term: 'Doom loop',
        definition:
          'A self-reinforcing spiral where meeting a call requires selling the asset whose fall caused the call.',
      },
      {
        term: 'Financial stability operation',
        definition:
          'A central bank intervention aimed at restoring orderly markets rather than at setting monetary policy.',
      },
    ],
    example: {
      title: 'How much of the buffer a one percent move takes',
      lines: [
        'A fund holds £100m of collateral supporting £300m of long-dated gilt exposure — three times leverage.',
        'A twenty-year gilt has a duration of roughly 18, so a 1% rise in yields costs about 18% of its value.',
        'On £300m of exposure that is about £54m, which is 54% of the entire collateral pool, from a one percent move.',
        'A 2.5% move, on the same duration approximation, is about £135m — more than the pool holds.',
        'The fund must post cash it does not have, so it sells gilts, into the same market that just fell.',
        'Convexity makes the real loss a little smaller than the duration figure, and three working days makes it a great deal worse.',
      ],
      takeaway:
        'The leverage multiple is also the multiple on how fast the buffer disappears. The post-crisis requirement to survive roughly 250 basis points is exactly this arithmetic, run backwards.',
    },
    inPractice:
      'LDI is still how UK schemes hedge, and it is meant to be — the alternative is an unhedged liability. What changed is the buffer, the governance around topping it up, and the operational speed of moving collateral, which for several schemes in 2022 was slower than the market moved.',
    relatedProductIds: ['irs', 'collateral', 'nickel'],
    quiz: [
      {
        id: 'ldi-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The Bank of England bought long-dated gilts in autumn 2022 to restore orderly market conditions.',
        correctAnswer: true,
        explanation:
          'It was a time-limited financial stability operation, explicitly separate from monetary policy.',
      },
      {
        id: 'ldi-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What made the September 2022 move so damaging?',
        options: [
          'Yields fell faster than schemes could unwind their hedges',
          'Long-dated yields rose by more than a percentage point in days',
          'Gilt trading was suspended by the exchange',
          'Inflation swaps stopped being quoted',
        ],
        correctIndex: 1,
        explanation:
          'A move that would normally take months arrived in days, and the collateral cycle could not keep up.',
      },
      {
        id: 'ldi-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A pension scheme’s liabilities behave like a very long-dated bond, rising in value when yields fall.',
        correctAnswer: true,
        explanation:
          'Which is why the hedge receives fixed or holds long gilts — it has to gain when the liability does.',
      },
      {
        id: 'ldi-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'Why were the hedges leveraged in the first place?',
        options: [
          'To speculate on the direction of gilt yields',
          'To hedge the liabilities and still hold growth assets with the same money',
          'Because regulators required a minimum leverage ratio',
          'To reduce the scheme’s exposure to inflation',
        ],
        correctIndex: 1,
        explanation:
          'Unleveraged hedging would consume nearly all the assets, leaving nothing invested for growth.',
      },
      {
        id: 'ldi-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'Rising yields left the schemes worse off in funding terms.',
        correctAnswer: false,
        explanation:
          'Funding levels generally improved — liabilities fell by more than assets. The failure was liquidity, not solvency.',
      },
      {
        id: 'ldi-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What made the spiral self-reinforcing?',
        options: [
          'Meeting a collateral call required selling the asset whose fall caused the call',
          'The Bank of England was selling gilts at the same time',
          'Schemes were forced to buy gilts as yields rose',
          'Clearing houses raised initial margin on equities',
        ],
        correctIndex: 0,
        explanation:
          'Each sale pushed yields higher, producing the next call — a doom loop rather than a one-off shock.',
      },
      {
        id: 'ldi-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'The hedge settles in cash daily while the liability it hedges does not settle for decades.',
        correctAnswer: true,
        explanation:
          'That mismatch in timing is the funding requirement nobody quotes when the hedge is put on.',
      },
      {
        id: 'ldi-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What did regulators require of LDI arrangements afterwards?',
        options: [
          'That leverage be banned entirely',
          'That hedges be centrally cleared',
          'That collateral buffers withstand a yield move of around 250 basis points',
          'That schemes hold only index-linked gilts',
        ],
        correctIndex: 2,
        explanation:
          'The buffer, not the strategy, was what failed — so the buffer is what was resized.',
      },
      {
        id: 'ldi-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'Some schemes ended the episode with less hedging than they started with.',
        correctAnswer: true,
        explanation:
          'Selling into the fall to raise cash reduced the hedge, leaving them exposed if yields came back down.',
      },
      {
        id: 'ldi-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What kind of correlation mattered most in this episode?',
        options: [
          'Correlation between gilts and equities',
          'Correlation between inflation and rates',
          'Correlation between the responses of everyone holding the same position under the same rule',
          'Correlation between sterling and gilt yields',
        ],
        correctIndex: 2,
        explanation:
          'Individually rational responses aggregated into the move that caused them — a crowd, not a market.',
      },
      {
        id: 'ldi-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'Leverage has to be speculative in intent to be dangerous.',
        correctAnswer: false,
        explanation:
          'These were hedges, prudently motivated. Leverage is dangerous because of what it does to funding, not because of why it was taken on.',
      },
      {
        id: 'ldi-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What is the general lesson about a hedge and the thing it hedges?',
        options: [
          'They must be in the same currency',
          'They rarely settle on the same schedule, and the gap is a funding requirement',
          'They should always be held with the same counterparty',
          'They must be documented under separate agreements',
        ],
        correctIndex: 1,
        explanation:
          'Nickel and LDI are the same lesson in different markets: the cash comes due long before the benefit does.',
      },
    ],
  },
  {
    id: 'ltcm',
    categoryId: 'cases',
    name: 'Long-Term Capital Management, 1998',
    hook: 'Convergence trades, twenty-five times over',
    summary:
      'LTCM ran relative value trades — positions that make money as two closely related prices converge — at very high leverage, on the reasoning that each spread was small, well understood and diversified against the others. In August 1998 Russia defaulted, investors everywhere moved into the safest and most liquid assets, and every one of those spreads widened at once. The fund lost around $4.6bn in four months and was recapitalised by fourteen banks convened by the Federal Reserve Bank of New York.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'Founded in 1994 and staffed with celebrated traders and academics, LTCM produced exceptional returns for four years on trades that individually earned very little. By early 1998 it held roughly $125bn of assets against about $4.7bn of capital, with derivative notional exposure far larger again. Losses began in the spring; Russia’s default and devaluation in August turned them into a rout. By late September its capital had fallen to a few hundred million dollars and it could no longer meet its obligations.',
        callout:
          'Twenty-five to one on the balance sheet, before the derivatives. At that leverage a 4% move in the wrong direction is the whole fund.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'The strategies were convergence trades: buy the cheaper of two near-identical instruments, sell the dearer, and wait for the gap to close. Off-the-run Treasuries against freshly issued ones, swap spreads, European sovereign convergence ahead of the euro, and short positions in long-dated equity volatility. Each was a small, mean-reverting spread, and each was supposed to be independent of the others. What they had in common was invisible on that description: every one of them earned a premium for holding the less liquid side.',
        callout:
          'A convergence trade is short liquidity and short volatility whatever its label. That is where the return comes from.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'When Russia defaulted, investors moved into whatever was safest and most tradable. That is a single factor, and it moved every one of the fund’s positions the same way at once — the diversification was in the instruments, not in the risk. Leverage did the rest: spreads that widened by tens of basis points, on positions measured in tens of billions, exhausted the capital. And because the book was large and its shape well known to the dealers financing it, the market could position ahead of the unwind it knew had to come.',
        callout:
          'The two model failures worth naming: correlations estimated in calm markets, and a funding assumption that the fund could always hold on.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'The fund lost about $4.6bn. On 23 September 1998 the Federal Reserve Bank of New York convened its major creditors, and fourteen firms put in roughly $3.6bn for almost all of the equity, taking over the portfolio and winding it down over the following year. No public money was used, but the episode became the reference point for arguments about hedge fund leverage, disclosure and the reach of a private failure into the banking system.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Diversification across strategies is not diversification if the strategies share a hidden factor, and for relative value that factor is liquidity. Leverage sets how long you can be wrong, which matters more than whether you are right — the spreads did eventually converge, long after the fund had been wound up. And a position the market knows about is a position the market can trade against, which turns an orderly exit into a race.',
        callout:
          'The trades were not the mistake. Holding them at a size that removed the option to wait was.',
      },
    ],
    keyTerms: [
      {
        term: 'Convergence trade',
        definition:
          'Buying the cheaper and selling the dearer of two near-identical instruments, expecting the gap to close.',
      },
      {
        term: 'On-the-run',
        definition:
          'The most recently issued and most liquid government bond of a maturity, which trades richer than older issues.',
      },
      {
        term: 'Flight to quality',
        definition:
          'A rush into the safest, most liquid assets, which widens every spread that pays for illiquidity at once.',
      },
      {
        term: 'Leverage ratio',
        definition:
          'Assets against capital, and so how far a position can move before the capital is gone.',
      },
      {
        term: 'Funding liquidity',
        definition:
          'The ability to keep financing a position — the thing that decides whether you can wait for convergence.',
      },
      {
        term: 'Crowded position',
        definition:
          'One whose size and holder are known to the market, so an unwind can be anticipated and traded against.',
      },
    ],
    example: {
      title: 'What twenty-five times leverage does to fifteen basis points',
      lines: [
        'Take $100m of capital run at 25 times: $2.5bn of a ten-year convergence position, long one bond and short another.',
        'The interest rate risk of the two legs offsets, so the exposure is to the spread between them.',
        'A ten-year swap has a DV01 near $81,000 per $100m, so $2.5bn carries roughly $2.03m per basis point of spread.',
        'The spread is expected to narrow by 10bp. Instead it widens by 15bp.',
        'Loss: 15 × $2.03m = $30.4m — over 30% of the capital, on a move of fifteen basis points.',
        'Widen by 50bp, as spreads did across the board in autumn 1998, and the position has lost the fund.',
      ],
      takeaway:
        'Nothing here required the trade to be wrong. Convergence eventually happened; leverage decided that the fund would not be there to see it.',
    },
    inPractice:
      'Relative value trading is a large and respectable part of the market, and the arithmetic above is why it is run with leverage limits, liquidity horizons and stress scenarios in which every spread widens together. The lesson is quoted in risk committees more often than any other, usually in the form: what happens if we cannot wait?',
    relatedProductIds: ['irs', 'valueatrisk', 'assetswap'],
    quiz: [
      {
        id: 'ltcm-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'LTCM was recapitalised by a group of banks convened by the Federal Reserve Bank of New York.',
        correctAnswer: true,
        explanation:
          'Fourteen firms put in roughly $3.6bn in September 1998 and wound the portfolio down. No public money was used.',
      },
      {
        id: 'ltcm-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'Roughly what was the fund’s balance sheet leverage in early 1998?',
        options: [
          'About 3 to 1',
          'About 10 to 1',
          'About 25 to 1',
          'About 100 to 1',
        ],
        correctIndex: 2,
        explanation:
          'Around $125bn of assets on $4.7bn of capital, before derivative exposure is counted at all.',
      },
      {
        id: 'ltcm-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt: 'What is a convergence trade?',
        options: [
          'A bet that a market will trend in one direction',
          'Buying the cheaper and selling the dearer of two near-identical instruments',
          'An option strategy profiting from rising volatility',
          'A hedge against a single issuer defaulting',
        ],
        correctIndex: 1,
        explanation:
          'The return comes from the gap closing, not from the level of the market moving.',
      },
      {
        id: 'ltcm-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt: 'The fund’s strategies were genuinely independent of one another.',
        correctAnswer: false,
        explanation:
          'Each earned a premium for holding the less liquid side, so all of them were the same trade in different instruments.',
      },
      {
        id: 'ltcm-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Why does an off-the-run Treasury yield more than a freshly issued one of similar maturity?',
        options: [
          'It carries more credit risk',
          'It is less liquid, and the market pays for liquidity',
          'It has a longer maturity',
          'Its coupons are taxed differently',
        ],
        correctIndex: 1,
        explanation:
          'The gap is a liquidity premium, and harvesting it is what a convergence book does.',
      },
      {
        id: 'ltcm-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Russia’s default in August 1998 moved all of the fund’s positions in the same direction.',
        correctAnswer: true,
        explanation:
          'A flight to quality is one factor, and it widened every spread that paid for illiquidity at once.',
      },
      {
        id: 'ltcm-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What was wrong with the correlations the models used?',
        options: [
          'They were estimated in calm markets and did not hold in a crisis',
          'They were measured over too short a window to be meaningful',
          'They ignored interest rate risk entirely',
          'They were set to one by regulation',
        ],
        correctIndex: 0,
        explanation:
          'Diversification measured in normal conditions disappears exactly when it is needed.',
      },
      {
        id: 'ltcm-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'The market’s knowledge of the fund’s positions made the unwind worse.',
        correctAnswer: true,
        explanation:
          'Dealers financing the book could see its shape and position ahead of the exit they knew was coming.',
      },
      {
        id: 'ltcm-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Roughly how much did the fund lose?',
        options: ['$460m', '$4.6bn', '$46bn', '$125bn'],
        correctIndex: 1,
        explanation:
          'About $4.6bn in four months, taking capital from $4.7bn to a few hundred million.',
      },
      {
        id: 'ltcm-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt: 'Public money was used to rescue the fund.',
        correctAnswer: false,
        explanation:
          'The Federal Reserve Bank of New York convened the creditors; the money was theirs.',
      },
      {
        id: 'ltcm-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What does leverage actually determine in a convergence strategy?',
        options: [
          'Whether the spread converges',
          'How long you can afford to be wrong before you are closed out',
          'The tax treatment of the position',
          'The credit rating of the fund',
        ],
        correctIndex: 1,
        explanation:
          'The spreads did converge eventually. The fund was not there for it.',
      },
      {
        id: 'ltcm-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Holding many different instruments is enough to diversify a relative value book.',
        correctAnswer: false,
        explanation:
          'If every position is short liquidity, the instruments differ and the risk does not.',
      },
    ],
  },
];
