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
          'Where to mark within the bid-offer spread is a neutral choice with no effect on reported profit.',
        correctAnswer: false,
        explanation:
          'Marking favourably delayed recognition of the losses here, and the bank later restated its first-quarter results.',
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
  {
    id: 'barings',
    categoryId: 'cases',
    name: 'Barings, 1995',
    hook: 'One trader, both sides of his own desk',
    summary:
      'A single trader in Singapore ran both the trading and the settlement of his own book, which meant nothing he reported had to be true. What began as concealed errors became a very large bet that the Nikkei would stay in a range, funded by short options and by margin wired from head office against positions nobody had reconciled. The Kobe earthquake broke the range, the losses reached about £827m, and a 233-year-old bank was sold for one pound.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'Barings’ Singapore operation was supposed to be running low-risk arbitrage between Nikkei 225 futures listed in Singapore and in Osaka — buying in one and selling in the other for small, near-riskless differences. Instead the desk built a large one-way position and hid it. On 17 January 1995 an earthquake struck Kobe; the Nikkei fell hard over the following days; the concealed position was doubled rather than closed. By late February the losses exceeded the bank’s entire capital, and Barings was sold to ING for a nominal one pound.',
        callout:
          'The arbitrage the desk was believed to be running is genuinely low risk. Its reported profits were the cover story, because a strategy that should earn a little and appeared to earn a lot was never questioned.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'Two exposures sat underneath. The first was an outright long in Nikkei futures — a directional bet, not an arbitrage. The second was a short straddle: selling both calls and puts on the index, which collects premium and pays out if the market moves far in either direction. Together they were a bet that the index would stay near a level and that volatility would stay low, held at a size the bank did not know existed.',
        callout:
          'A short straddle is the purest form of "small gains, unbounded loss". It also produces steady reported profits right up until it does not.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'The control failure is the whole case. The same person ran the front office and the back office, so the records of what had been traded were produced by the person doing the trading. An error account was used to hold losses out of the reported book. Margin calls on the concealed position were met by requests to head office, funded without anyone reconciling what they were funding — hundreds of millions moved against positions that did not appear in the accounts they were checked against.',
        callout:
          'Segregation of duties is the oldest control in finance and the one this case is taught for: whoever books a trade must not be the person who confirms it.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'About £827m — more than the bank had. Barings collapsed in February 1995 and was bought by ING for £1 plus assumption of its liabilities. The Bank of England’s inquiry set out the supervisory and internal failures in detail, and the case became the standard teaching example for operational risk, later shaping how banks structured independent risk and settlement functions.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Returns that do not match the strategy are the signal, not the reward — a low-risk arbitrage that reports large profits is either not low risk or not an arbitrage. Funding is a control point: money leaving the firm to meet margin is a fact that can be reconciled against positions, and here nobody did. And an unexplained account is not an administrative untidiness; it is where the losses go.',
        callout:
          'Every subsequent rogue trading case has some version of the same three facts: an unreconciled record, an unexplained account, and a return nobody could account for.',
      },
    ],
    keyTerms: [
      {
        term: 'Segregation of duties',
        definition:
          'Keeping trading, confirmation and settlement in separate hands so no one person can both trade and record.',
      },
      {
        term: 'Error account',
        definition:
          'An account for correcting mistaken bookings, and here the place concealed losses were parked.',
      },
      {
        term: 'Short straddle',
        definition:
          'Selling a call and a put at the same strike: premium now, unbounded loss if the market moves far.',
      },
      {
        term: 'Index arbitrage',
        definition:
          'Trading the same index future on two exchanges for a small price difference, with little directional risk.',
      },
      {
        term: 'Reconciliation',
        definition:
          'Checking the firm’s records against the exchange’s and the cash actually paid — the control that was absent.',
      },
      {
        term: 'Operational risk',
        definition:
          'Loss from failed processes, people or systems, as distinct from market or credit risk.',
      },
    ],
    example: {
      title: 'What a short straddle earns, and then pays',
      lines: [
        'Sell 10,000 Nikkei straddles at a combined premium of 400 index points, on a contract worth ¥500 a point.',
        'Premium collected: 10,000 × 400 × ¥500 = ¥2bn, booked as profit while the index sits still.',
        'The index then falls 3,000 points. The puts are 3,000 points in the money.',
        'Loss on the puts: 10,000 × 3,000 × ¥500 = ¥15bn, against ¥2bn collected.',
        'The calls expire worthless, which changes nothing: one side of a straddle can only ever return the premium.',
        'Add a long futures position into the same fall and the two losses compound rather than offset.',
      ],
      takeaway:
        'The strategy pays a fixed amount for accepting an unbounded one. That is a legitimate trade at a size the firm has chosen — and a fatal one at a size the firm cannot see.',
    },
    inPractice:
      'The direct legacy is structural: independent middle and back offices, mandatory leave for traders, position reconciliation against exchange records, and limits monitored by people who do not report to the desk. Every one of those exists because they were all absent in one place at one time.',
    relatedProductIds: ['eqopt', 'socgen', 'execution'],
    quiz: [
      {
        id: 'barings-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The Singapore desk was believed to be running low-risk arbitrage between two exchanges.',
        correctAnswer: true,
        explanation:
          'The reported strategy was riskless in principle, which is why unusually large reported profits should have been the first question.',
      },
      {
        id: 'barings-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'What was the response to the market falling after the Kobe earthquake?',
        options: [
          'The position was doubled',
          'The position was closed at a loss',
          'The exchange suspended the contracts',
          'Head office hedged it in London',
        ],
        correctIndex: 0,
        explanation:
          'Adding to a losing concealed position is what turned a large loss into one bigger than the bank.',
      },
      {
        id: 'barings-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does a short straddle pay and what does it risk?',
        options: [
          'Unlimited gain for a fixed premium',
          'A fixed premium, with losses capped at the strike',
          'A fixed premium, against a loss that grows with any large move either way',
          'Nothing up front, with gains only if volatility rises',
        ],
        correctIndex: 2,
        explanation:
          'It is short volatility in the most direct form available, and it reports steady profits while the market is quiet.',
      },
      {
        id: 'barings-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'The concealed book combined a directional futures position with sold options.',
        correctAnswer: true,
        explanation:
          'A long futures position and a short straddle lose together in a fall, which is what happened after January 1995.',
      },
      {
        id: 'barings-q5',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The trader also controlled the settlement and record-keeping for his own trades.',
        correctAnswer: true,
        explanation:
          'Which meant no report about the book was independent of the person the report was about.',
      },
      {
        id: 'barings-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What was the error account used for?',
        options: [
          'Holding client money separately',
          'Settling trades across two exchanges',
          'Recording the firm’s hedging positions',
          'Parking concealed losses outside the reported book',
        ],
        correctIndex: 3,
        explanation:
          'An account that exists to correct mistakes is the natural place to hide them, unless someone reconciles it.',
      },
      {
        id: 'barings-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'Why were the margin payments a missed control point?',
        options: [
          'Margin is not a real cash flow',
          'Cash left the firm against positions nobody checked existed',
          'Margin was paid by the exchange, not the bank',
          'The payments were too small to notice',
        ],
        correctIndex: 1,
        explanation:
          'Funding is a fact that can be reconciled against a position. Here hundreds of millions moved and nothing was.',
      },
      {
        id: 'barings-q8',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The bank’s capital absorbed the losses, which is why it survived in reduced form.',
        correctAnswer: false,
        explanation:
          'The losses were larger than the whole bank — about £827m — and ended a 233-year-old institution in days.',
      },
      {
        id: 'barings-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What happened to the bank?',
        options: [
          'It was sold to ING for a nominal one pound',
          'It was recapitalised by the Bank of England',
          'It was merged with its Singapore subsidiary',
          'It continued trading under new management',
        ],
        correctIndex: 0,
        explanation:
          'Plus assumption of its liabilities — the price reflects a balance sheet with a hole in it.',
      },
      {
        id: 'barings-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Unusually high profits from a strategy that should earn very little are a control signal.',
        correctAnswer: true,
        explanation:
          'Either it is not the strategy being reported, or it is not as low risk as it is described. Both are findings.',
      },
      {
        id: 'barings-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Which control most directly addresses the failure in this case?',
        options: [
          'Value at risk reported daily',
          'Central clearing of index futures',
          'A limit on the number of contracts per trade',
          'Segregation of duties between trading and settlement',
        ],
        correctIndex: 3,
        explanation:
          'Whoever books a trade must not be the person who confirms it — the oldest control in the industry.',
      },
      {
        id: 'barings-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Mandatory leave for traders is a staff benefit with no bearing on control.',
        correctAnswer: false,
        explanation:
          'It is a control. A concealed position usually needs daily maintenance, so a fortnight in someone else’s hands is a test of the book.',
      },
    ],
  },
  {
    id: 'socgen',
    categoryId: 'cases',
    name: 'Société Générale, 2008',
    hook: 'Fictitious hedges, and a €4.9bn exit',
    summary:
      'A trader on an equity derivatives desk built directional positions of around €50bn in European index futures and concealed them with fictitious offsetting trades entered into the bank’s systems. When the positions were discovered in January 2008 the bank unwound them over three days into a falling market, crystallising a loss of €4.9bn. The case is about how a control that checks net exposure can be defeated by inventing the other side, and about how much of a loss can belong to the exit rather than the position.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'The desk was an arbitrage operation expected to run small, hedged positions. Over 2007 and into January 2008 one trader accumulated very large unhedged long positions in European equity index futures. Each real position was paired in the systems with an invented offsetting trade, so every net exposure report looked normal. The fabrications were discovered on 18 January 2008. The bank unwound the book between 21 and 23 January, days on which European equity markets fell sharply.',
        callout:
          'The concealed positions were profitable at one point in 2007. A control failure is not the same as a losing trade, and this one had already been both.',
      },
      {
        step: 2,
        title: 'How the concealment worked',
        content:
          'The fictitious trades were chosen to sit in the gaps of the control framework: counterparties whose confirmations were not chased in the same way, trade types with deferred settlement, positions cancelled and re-entered before the checks that would have caught them. None of it required breaking into a system. It required knowing which reconciliations ran, when they ran, and what they compared — knowledge the trader had from previously working in the middle office.',
        callout:
          'A control is only as good as the exception process behind it. Dozens of alerts were raised over the period and each was closed on the trader’s own explanation.',
      },
      {
        step: 3,
        title: 'The unwind',
        content:
          'Once found, a €50bn long position in index futures has to be sold. The bank chose to exit quickly and quietly rather than disclose first, spreading the sales over three sessions and staying within a share of daily volume. Markets fell heavily in those days — for reasons that had nothing to do with this book, though the size of the selling did not help — and a significant part of the €4.9bn was incurred during the exit rather than before it. That decision has been argued about since: disclosing first would have moved the market against the bank just as certainly.',
        callout:
          'When the position is a meaningful share of a market, there is no exit that does not cost. The only choice is which cost.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'A loss of €4.9bn, a capital raise to repair the balance sheet, and a €4m fine from the French banking commission for the control failures. Internal and independent reviews found weak supervision of the desk, alerts closed without escalation, and a middle office that reconciled positions but not the trades underlying them. The trader was convicted; the damages awarded against him were substantially reduced on appeal in 2016, on the finding that the bank’s own failings contributed.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Controls check what they are told to check. A framework built around net exposure is defeated by anything that fabricates the other leg, which is why confirmation with the counterparty — an outside party who either did or did not do this trade — matters more than internal consistency. Alerts that are closed by asking the subject of the alert are not controls. And the cost of an unwind belongs in the risk assessment: a position is only as safe as the market’s ability to absorb it on the day you must leave.',
        callout:
          'Read this one against Archegos: different decade, different instrument, same sentence — nobody could see the whole position, and the exit was most of the loss.',
      },
    ],
    keyTerms: [
      {
        term: 'Fictitious trade',
        definition:
          'An invented offsetting position booked to make a real exposure appear hedged.',
      },
      {
        term: 'Confirmation',
        definition:
          'Agreement of a trade’s terms with the counterparty — the check an invented trade cannot survive.',
      },
      {
        term: 'Exception handling',
        definition:
          'What happens after an alert fires, and the step that decides whether a control works at all.',
      },
      {
        term: 'Delta One',
        definition:
          'Desks trading instruments that track their underlying one-for-one, such as index futures and swaps.',
      },
      {
        term: 'Unwind cost',
        definition:
          'The loss incurred while exiting a position, distinct from the loss the position already carried.',
      },
      {
        term: 'Supervision',
        definition:
          'The obligation on a desk head to know what the desk holds, which no system replaces.',
      },
    ],
    example: {
      title: 'How much of the loss was the exit',
      lines: [
        'A concealed long position of €50bn in index futures is discovered on a Friday.',
        'European indices fall about 6% over the following three sessions.',
        'On €50bn, a 6% fall is €3bn — incurred after the discovery, on a position the bank was trying to leave.',
        'Selling into that fall as one of the larger sellers adds to it: even 10% of daily volume moves the price against you.',
        'Whatever the position had already lost is separate, and smaller than most people assume.',
        'Disclose first instead, and the market prices the forced sale before it happens — a different cost, not an avoided one.',
      ],
      takeaway:
        'The headline number is the position and the exit added together. Any risk framework that measures the first and ignores the second is describing half the loss.',
    },
    inPractice:
      'The direct legacy is confirmation discipline and exception governance: unconfirmed trades chased and escalated regardless of who raised them, alerts closed by someone independent of the desk, and periodic checks that a trader’s system permissions do not still reflect a previous role in operations.',
    relatedProductIds: ['barings', 'eqswap', 'archegos'],
    quiz: [
      {
        id: 'socgen-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The concealed positions were unhedged directional bets on European equity indices.',
        correctAnswer: true,
        explanation:
          'The desk was meant to run small hedged arbitrage; what it held was roughly €50bn of outright long.',
      },
      {
        id: 'socgen-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'How did the net exposure reports look normal?',
        options: [
          'The positions were held at a different subsidiary',
          'Each real trade was paired with an invented offsetting trade',
          'The reports were produced only monthly',
          'The futures were reported at cost rather than market',
        ],
        correctIndex: 1,
        explanation:
          'A framework that checks the net of two legs is defeated by fabricating one of them.',
      },
      {
        id: 'socgen-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Defeating the controls required breaking into systems the trader had no access to.',
        correctAnswer: false,
        explanation:
          'It required knowing which reconciliations ran and what they compared — knowledge from a previous middle office role.',
      },
      {
        id: 'socgen-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'Which check does a fictitious trade fail?',
        options: [
          'Internal net exposure reporting',
          'Confirmation with the counterparty',
          'Daily profit and loss reporting',
          'The firm’s value-at-risk calculation',
        ],
        correctIndex: 1,
        explanation:
          'An outside party either did or did not do the trade, which is why confirmation beats internal consistency.',
      },
      {
        id: 'socgen-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Alerts were raised over the period and closed on the trader’s own explanation.',
        correctAnswer: true,
        explanation:
          'A control whose exception process asks the subject of the exception is not a control.',
      },
      {
        id: 'socgen-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Why did the bank unwind before disclosing?',
        options: [
          'Disclosure would have let the market price the forced sale in advance',
          'Regulation required silence until the positions were closed',
          'The exchange refused to accept the trades otherwise',
          'The positions could not be valued until they were sold',
        ],
        correctIndex: 0,
        explanation:
          'Both routes cost money. The choice was which cost to take, not whether to take one.',
      },
      {
        id: 'socgen-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'A significant part of the €4.9bn was incurred during the three-day exit rather than before discovery.',
        correctAnswer: true,
        explanation:
          'Markets fell sharply in those sessions, and the bank was a large seller into them.',
      },
      {
        id: 'socgen-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'foundational',
        prompt: 'What was the total loss?',
        options: ['€490m', '€4.9bn', '€49bn', '€500m'],
        correctIndex: 1,
        explanation:
          'It required a capital raise, and drew a fine from the French banking commission for the control failures.',
      },
      {
        id: 'socgen-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Reviews found the middle office reconciled positions but not the trades underlying them.',
        correctAnswer: true,
        explanation:
          'Which is exactly the gap a fabricated offsetting leg lives in.',
      },
      {
        id: 'socgen-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the general lesson about internal controls?',
        options: [
          'They should be run more frequently',
          'They check what they are told to check, so an outside confirmation is worth more than internal consistency',
          'They are unnecessary where positions are cleared',
          'They should be designed by the trading desk that uses them',
        ],
        correctIndex: 1,
        explanation:
          'Internal consistency can be manufactured; a counterparty’s agreement cannot.',
      },
      {
        id: 'socgen-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'A position’s risk is fully described by what it has lost before anyone decides to exit.',
        correctAnswer: false,
        explanation:
          'The exit is part of the risk: a position is only as safe as the market’s ability to absorb it on the day you must leave.',
      },
      {
        id: 'socgen-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What does this case share with Archegos, thirteen years later?',
        options: [
          'Both involved commodity derivatives',
          'Both were losses where nobody could see the whole position and the exit was most of the cost',
          'Both were caused by a model change',
          'Both were resolved by a central bank',
        ],
        correctIndex: 1,
        explanation: 'Different decade, different instrument, same two sentences.',
      },
    ],
  },
  {
    id: 'orange',
    categoryId: 'cases',
    name: 'Orange County, 1994',
    hook: 'A conservative bond portfolio, borrowed three times over',
    summary:
      'A Californian county ran an investment pool for itself and around two hundred local public bodies. The securities in it were high grade — agency notes, not junk — but the pool borrowed against them through repo to hold nearly three times the money deposited, and much of what it bought had leverage built into the coupon as well. When US rates rose through 1994 the pool lost about $1.7bn and the county filed for bankruptcy, at the time the largest municipal failure in US history.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'By 1994 the county pool held around $20bn of securities against roughly $7.5bn actually deposited with it. The difference was borrowed under repurchase agreements — selling securities for cash with an agreement to buy them back — and reinvested. The portfolio was positioned for interest rates to stay low. The Federal Reserve raised rates through 1994, the securities fell in value, lenders demanded more collateral, and in December the county filed for Chapter 9 bankruptcy.',
        callout:
          'Nothing in the pool was speculative in the sense of being low quality. Every security was investment grade, and that is the point of the case.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'Two kinds of leverage stacked on each other. The first is balance sheet leverage: repo turned $7.5bn into $20bn of holdings, so every percentage move counted nearly three times. The second was inside the instruments. Structured notes such as inverse floaters pay a coupon that falls as short rates rise — 10% minus twice a benchmark, for example — which makes them behave like a bond several times their stated maturity. A portfolio of medium-term notes can carry the interest rate risk of very long ones without saying so anywhere on the ticket.',
        callout:
          'An inverse floater paying 10% − 2 × the benchmark yields 4% when the benchmark is 3% and nothing at all when it reaches 5%. The coupon is geared, and so is the price.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Rising rates hit both layers at once, and the repo lenders were the mechanism that turned a paper loss into a failure. As the collateral fell in value they called for more, which meant selling securities into the same falling market — the same collateral spiral that would appear in gilts nearly thirty years later. The pool had also been reporting at book value rather than market, so the participants whose money it was had no visible signal until the position had to be liquidated.',
        callout:
          'Marking to market is not an accounting preference. It is the difference between finding out early and finding out from a lender.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'About $1.7bn, roughly a fifth of everything deposited, and the bankruptcy of a large and wealthy county. Schools, cities and districts that had placed cash in the pool for safekeeping had it frozen. The investment bank that had sold much of the structure and provided the repo financing later settled for around $400m without admitting liability, and the episode reshaped how US public bodies are permitted to invest — position limits, mark-to-market reporting, and restrictions on leverage in public funds.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Credit quality and market risk are different questions, and a portfolio can be flawless on the first while failing on the second. Leverage applied to a low-risk asset produces a high-risk position — the arithmetic does not care that the underlying is a government agency note. And where the leverage is embedded in a coupon formula rather than in a borrowing, it will not appear in any measure that counts what was borrowed.',
        callout:
          'The question that would have caught it: what does this portfolio lose if rates rise two percent — not, what is it rated?',
      },
    ],
    keyTerms: [
      {
        term: 'Repurchase agreement',
        definition:
          'Selling a security for cash with an agreement to buy it back, the standard way to borrow against bonds.',
      },
      {
        term: 'Inverse floater',
        definition:
          'A note whose coupon falls as a benchmark rate rises, giving it far more interest rate risk than its maturity suggests.',
      },
      {
        term: 'Effective duration',
        definition:
          'The true price sensitivity of a structured note to rates, which can be several times its stated maturity.',
      },
      {
        term: 'Collateral call',
        definition:
          'A repo lender’s demand for more security as the collateral falls, met by selling into the same fall.',
      },
      {
        term: 'Book value reporting',
        definition:
          'Reporting holdings at cost rather than market, which conceals a loss until it must be realised.',
      },
      {
        term: 'Investment pool',
        definition:
          'A shared fund holding cash for several public bodies, whose participants here could not see the risk taken.',
      },
    ],
    example: {
      title: 'Where $1.7bn comes from without a single default',
      lines: [
        'Deposits of $7.5bn are levered through repo into a $20bn portfolio — 2.7 times.',
        'The holdings are medium-term notes, but the structured ones behave like far longer bonds: call the portfolio’s effective duration 3.5.',
        'US rates rise about 2.4% over 1994.',
        'Loss: $20bn × 3.5 × 2.4% = $1.68bn — close to what actually happened.',
        'Against $7.5bn of deposits that is 22% of the money, on a portfolio of investment grade paper.',
        'Unlevered, the same securities would have lost $7.5bn × 3.5 × 2.4% = $630m — painful, survivable, and not a bankruptcy.',
      ],
      takeaway:
        'Nothing defaulted. The loss is leverage multiplied by duration multiplied by a rate move — three numbers, none of them about credit quality.',
    },
    inPractice:
      'Public investment pools are now constrained on leverage, on maturity and on the instruments they may hold, and they report at market. The structures themselves are unremarkable: inverse floaters are a legitimate way to take a rates view, priced accordingly, and used by funds that know that is what they are doing.',
    relatedProductIds: ['irs', 'capfloor', 'ldi'],
    quiz: [
      {
        id: 'orange-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt: 'The pool lost money because the securities it held defaulted.',
        correctAnswer: false,
        explanation:
          'Nothing defaulted. The holdings were investment grade; the loss came from leverage and interest rate risk.',
      },
      {
        id: 'orange-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'How did $7.5bn of deposits become $20bn of holdings?',
        options: [
          'Through gains reinvested over many years',
          'By borrowing against the securities under repurchase agreements',
          'By issuing municipal bonds to the public',
          'Through a credit line from the state government',
        ],
        correctIndex: 1,
        explanation:
          'Repo turns a bond portfolio into a levered one, and the lender can call for more collateral at any time.',
      },
      {
        id: 'orange-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does an inverse floater’s coupon do when rates rise?',
        options: [
          'It rises with the benchmark',
          'It stays fixed until maturity',
          'It falls, by a multiple of the benchmark’s move',
          'It converts into a floating rate note',
        ],
        correctIndex: 2,
        explanation:
          'A coupon of 10% minus twice the benchmark falls two points for every one the benchmark rises.',
      },
      {
        id: 'orange-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A structured note can carry the interest rate risk of a much longer bond than its stated maturity.',
        correctAnswer: true,
        explanation:
          'That is what effective duration measures, and it does not appear anywhere on the description of the security.',
      },
      {
        id: 'orange-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Leverage inside a coupon formula shows up in a measure of how much has been borrowed.',
        correctAnswer: false,
        explanation:
          'It does not. Borrowing and embedded gearing are two separate layers, and only one of them is visible as debt.',
      },
      {
        id: 'orange-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'What turned a paper loss into a failure?',
        options: [
          'Repo lenders calling for more collateral, met by selling into the fall',
          'A downgrade of the county’s credit rating',
          'The Federal Reserve refusing to lend to municipalities',
          'Depositors withdrawing on the same day',
        ],
        correctIndex: 0,
        explanation:
          'The same collateral spiral as the gilt crisis of 2022, in a different market and thirty years earlier.',
      },
      {
        id: 'orange-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'The pool reported holdings at book value rather than at market.',
        correctAnswer: true,
        explanation:
          'So the participants whose money it was saw nothing until the positions had to be sold.',
      },
      {
        id: 'orange-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'foundational',
        prompt: 'What did the county do in December 1994?',
        options: [
          'Raised taxes to cover the loss',
          'Filed for bankruptcy',
          'Sold the pool to a bank',
          'Borrowed from the state',
        ],
        correctIndex: 1,
        explanation:
          'At the time the largest municipal bankruptcy in US history, with around $1.7bn lost.',
      },
      {
        id: 'orange-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Schools and cities that had placed cash in the pool had it frozen.',
        correctAnswer: true,
        explanation:
          'They were participants in a fund they had treated as a deposit account, and could not see what it held.',
      },
      {
        id: 'orange-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What question would have exposed the risk?',
        options: [
          'What is this portfolio rated?',
          'What does it lose if rates rise two percent?',
          'Who is the custodian?',
          'What is the average coupon?',
        ],
        correctIndex: 1,
        explanation:
          'Credit quality and market risk are different questions, and only the second one had a frightening answer.',
      },
      {
        id: 'orange-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'Leverage applied to a low-risk asset still produces a high-risk position.',
        correctAnswer: true,
        explanation: 'The arithmetic does not care what the underlying is rated.',
      },
      {
        id: 'orange-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What changed for US public investment pools afterwards?',
        options: [
          'They were prohibited from holding government agency debt',
          'Limits on leverage and maturity, and reporting at market value',
          'They were required to be managed by investment banks',
          'They were merged into a single federal fund',
        ],
        correctIndex: 1,
        explanation:
          'The rules attacked the leverage and the reporting, which is where the failure actually was.',
      },
    ],
  },
  {
    id: 'ashanti',
    categoryId: 'cases',
    name: 'Ashanti Goldfields, 1999',
    hook: 'Seven years of production, sold forward',
    summary:
      'A West African gold producer hedged with forward sales and sold options covering around seven years of its own output. When fifteen European central banks agreed to limit gold sales in September 1999, the price jumped by about a quarter in two weeks. The hedges were deeply out of the money, the margin calls were larger than the company’s cash, and a business whose product had just become far more valuable was forced into a standstill with its banks and eventually out of independence.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'On 26 September 1999 fifteen European central banks announced the Washington Agreement on Gold, capping their sales and lending for five years. Gold had been in a long decline; the announcement reversed it violently, taking the price from around $255 an ounce to roughly $330 within a fortnight. Producers who had sold their output forward faced enormous mark-to-market losses. Ashanti Goldfields, with a hedge book covering about eleven million ounces against annual production near 1.6 million, could not meet the collateral its seventeen counterparty banks called for.',
        callout:
          'A rising gold price is unambiguously good news for a gold miner. It nearly ended this one inside three weeks.',
      },
      {
        step: 2,
        title: 'The position',
        content:
          'A producer hedge in its simple form is a forward sale: agree today to deliver metal at a fixed price, and the mine is insulated from a falling market. Ashanti’s book went considerably further. It included sold call options — which earn premium but hand away the upside — and structured variations layered on top, so the book was not only long the fixed price but short volatility. And its size, at roughly seven years of production, meant it was no longer describable as hedging a known output.',
        callout:
          'Selling a call is not a hedge. It is income today in exchange for the gain you would have made if the thing you produce becomes more valuable.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'The hedges were bilateral contracts with margin terms, so a large adverse move produced cash calls — reported at several hundred million dollars — within days. The offsetting benefit was gold in the ground that would be mined and sold over years, and no bank accepts that as collateral. The company had no facility sized for the move. That is the same failure as the LME nickel squeeze and the gilt crisis: the hedge was economically sound and could not be funded.',
        callout:
          'The size made it worse in a specific way: hedging seven years of production means seven years of mark-to-market on a position that only unwinds as the metal is dug up.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'The mark-to-market deficit on the book ran to several hundred million dollars. Rather than default, the company negotiated a standstill with its counterparties in October 1999, granting them warrants over its equity and accepting constraints on how it was run — its shareholders paid for the rescue in dilution. Ashanti never fully recovered its independence and merged with AngloGold in 2004. A Canadian producer, Cambior, faced the same problem in the same weeks.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Hedge the exposure you actually have, over a horizon you can actually see: a book covering years of unmined production is a position, not a hedge. Understand which legs are optional — sold options convert a hedge into a short volatility trade with a cash cost when the market moves your way. And negotiate the collateral terms before you need them, because the moment you need them is the moment your counterparties are least inclined to be generous.',
        callout:
          'The pattern across this category: nickel, gilts and gold are three markets and one failure, which is that a hedge settles in cash long before the thing it hedges does.',
      },
    ],
    keyTerms: [
      {
        term: 'Producer hedge',
        definition:
          'Selling future output forward at a fixed price to insulate a mine or field from a falling market.',
      },
      {
        term: 'Forward sale',
        definition:
          'An agreement to deliver a quantity at an agreed price on a future date — the orthodox hedging instrument.',
      },
      {
        term: 'Sold call',
        definition:
          'An option written away for premium, which gives up the upside on the very asset the seller produces.',
      },
      {
        term: 'Hedge horizon',
        definition:
          'How far ahead output is sold, and so how much unmined production a mark-to-market applies to.',
      },
      {
        term: 'Standstill agreement',
        definition:
          'A negotiated pause in counterparties’ rights to call collateral or close out, bought here with equity.',
      },
      {
        term: 'Washington Agreement',
        definition:
          'The September 1999 accord in which European central banks capped gold sales, reversing a long price decline.',
      },
    ],
    example: {
      title: 'What a 29% rally does to a producer that sold forward',
      lines: [
        'Gold moves from $255 to $330 an ounce — a rise of $75, or about 29%.',
        'A book contains forward sales of 9 million ounces at an average of $290.',
        'Mark-to-market on the forwards: 9,000,000 × ($330 − $290) = $360m against the company.',
        'It also holds sold calls on 2 million ounces struck at $290, now $40 in the money: another 2,000,000 × $40 = $80m.',
        'Total deficit around $440m, callable in cash, against annual production of 1.6 million ounces.',
        'That production, at the new price, is worth about $120m more per year than before — arriving over years, as metal is mined and sold.',
      ],
      takeaway:
        'The company was right about its business and wrong about its funding. $440m due in days against $120m a year of improvement is a liquidity failure wearing the costume of a hedging loss.',
    },
    inPractice:
      'Miners still hedge, and lenders often require it, but books are sized against near-term production, margin terms are negotiated up front and many producers now prefer forwards to sold options for exactly this reason. The industry largely de-hedged through the 2000s as the gold price rose.',
    relatedProductIds: ['cmfwd', 'cmopt', 'nickel'],
    quiz: [
      {
        id: 'ashanti-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The crisis was triggered by a sharp rise in the gold price, not a fall.',
        correctAnswer: true,
        explanation:
          'A producer that has sold forward loses on the hedge when its own product becomes more valuable.',
      },
      {
        id: 'ashanti-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What was the Washington Agreement on Gold?',
        options: [
          'A cap on gold mining output in West Africa',
          'An accord among European central banks limiting their gold sales and lending',
          'A trade agreement fixing the gold price',
          'A settlement between miners and their hedging banks',
        ],
        correctIndex: 1,
        explanation:
          'Announced in September 1999, it reversed a long decline and moved the price about a quarter higher in two weeks.',
      },
      {
        id: 'ashanti-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'The hedge book covered roughly seven years of the company’s annual production.',
        correctAnswer: true,
        explanation:
          'About eleven million ounces against production near 1.6 million — well beyond any horizon a mine can see.',
      },
      {
        id: 'ashanti-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'Why is a sold call not a hedge for a producer?',
        options: [
          'It cannot be settled physically',
          'It earns premium but hands away the gain on the asset the producer makes',
          'It is only available to financial institutions',
          'It must be exercised early',
        ],
        correctIndex: 1,
        explanation:
          'It converts the position into a short volatility trade, with a cash cost precisely when the market moves in the producer’s favour.',
      },
      {
        id: 'ashanti-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A forward sale on its own is a legitimate and orthodox producer hedge.',
        correctAnswer: true,
        explanation:
          'The problem was the horizon and the optionality layered on top, not the instrument.',
      },
      {
        id: 'ashanti-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why could the company not meet the calls from its gold in the ground?',
        options: [
          'The reserves were pledged to another lender',
          'Unmined production is not collateral, and it converts to cash only as it is mined and sold',
          'Gold cannot be delivered against a margin call',
          'The mines had been suspended',
        ],
        correctIndex: 1,
        explanation:
          'The benefit arrived over years; the cash was owed in days. That is the shape of every case in this category.',
      },
      {
        id: 'ashanti-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'The size of the book made the mark-to-market problem proportionally worse.',
        correctAnswer: true,
        explanation:
          'Seven years of production means seven years of marking on a position that unwinds only as metal is produced.',
      },
      {
        id: 'ashanti-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'How was the immediate crisis resolved?',
        options: [
          'A government guarantee from Ghana',
          'A standstill with counterparties, paid for with warrants over the company’s equity',
          'A rights issue to existing shareholders',
          'By closing the hedge book at the peak',
        ],
        correctIndex: 1,
        explanation:
          'Shareholders funded the rescue in dilution, and the company never regained its independence.',
      },
      {
        id: 'ashanti-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Ashanti was the only producer caught out by the rally.',
        correctAnswer: false,
        explanation:
          'Cambior, in Canada, had a comparable hedge book and faced comparable calls in the same weeks.',
      },
      {
        id: 'ashanti-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the rule about hedge horizon this case establishes?',
        options: [
          'Hedge as far forward as counterparties will allow',
          'Hedge the production you can actually see, because beyond that it is a position rather than a hedge',
          'Hedge only after prices have already fallen',
          'Never hedge production at all',
        ],
        correctIndex: 1,
        explanation:
          'Selling output you have not mined against a market that can move is a directional trade in everything but name.',
      },
      {
        id: 'ashanti-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Collateral terms are best negotiated when a counterparty is already calling for cash.',
        correctAnswer: false,
        explanation:
          'That is the moment of least leverage. The terms have to be agreed while nobody needs them.',
      },
      {
        id: 'ashanti-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What do nickel, gilts and gold have in common as cases?',
        options: [
          'All three involved fraud',
          'All three were exchange-traded losses',
          'In each, a sound hedge settled in cash long before the thing it hedged did',
          'All three were resolved by a central bank',
        ],
        correctIndex: 2,
        explanation:
          'Three markets, three decades, one failure — and it is a funding failure, not a hedging one.',
      },
    ],
  },
  {
    id: 'metallges',
    categoryId: 'cases',
    name: 'Metallgesellschaft, 1993',
    hook: 'The right hedge, on the wrong clock',
    summary:
      'A German industrial group’s US oil subsidiary sold customers fixed-price supply contracts running up to ten years, and hedged them by holding short-dated futures rolled forward month after month. The economics offset almost exactly. The cash flows did not: the futures settled daily in cash while the customer contracts settled over a decade. When oil fell in 1993 the hedge haemorrhaged margin, the roll turned from a source of income into a cost, and the parent liquidated at the bottom for around $1.3bn.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'MG Refining & Marketing had signed contracts to deliver petrol and heating oil at fixed prices over as much as ten years, totalling on the order of 160 million barrels. To hedge, it held long positions in short-dated energy futures and swaps, stacked in the nearby months and rolled forward each month — the "stack and roll". Oil prices fell through 1993. The hedge lost money in cash immediately while the profitable customer contracts remained years from delivery. The supervisory board took control, liquidated the hedge and closed out contracts, realising losses of around $1.3bn and requiring a rescue from the group’s banks.',
        callout:
          'The company’s customers had signed up to buy oil above the market for a decade. Those contracts were an asset. They were also unfinanceable.',
      },
      {
        step: 2,
        title: 'The stack and roll',
        content:
          'The ideal hedge for a ten-year delivery obligation is a ten-year strip of futures, one for each delivery. That market does not exist in any size, so the position is stacked in the liquid front months and rolled. The stack matches the total quantity but not the timing, which leaves two exposures: the shape of the forward curve, and the cash. In backwardation, where nearby prices exceed distant ones, rolling a long position costs money each month; in contango it earns. The economics of the roll are what turn a size-matched hedge into a profitable or ruinous one.',
        callout:
          'A stack and roll is a bet on the curve as much as a hedge on the level. Matching barrels does not match risk.',
      },
      {
        step: 3,
        title: 'Why it broke',
        content:
          'Two things arrived together. Prices fell, so the long futures produced immediate variation margin calls measured in hundreds of millions, while the gains on the customer contracts sat unrealised for years. And the curve moved against the roll, so maintaining the hedge cost money every month rather than earning it. Neither was fatal alone. Together they turned a hedged book into a funding requirement the parent was unwilling to keep meeting — and the decision to liquidate crystallised the loss at the point of maximum pain.',
        callout:
          'Economists have argued about this case for thirty years: whether the hedge was sound and the liquidation was the error, or whether the size and the roll risk were misjudged from the start. Both readings agree it was a funding failure first.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'Around $1.3bn realised, a rescue package from the group’s banks running to billions of Deutsche Marks, and the near-collapse of one of Germany’s largest industrial groups. The management was replaced. The case entered the academic literature almost immediately and stayed there, because two credible groups of economists reached opposite conclusions about whether the position should have been closed at all.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'A hedge that offsets economically can still fail on timing, and the mismatch between a long-dated obligation and a short-dated hedge is a funding position that has to be sized and financed deliberately. Rolling is not free, and its cost depends on a curve shape nobody controls. And the decision to liquidate is itself a risk decision: a hedge that is closed at the worst moment converts an unrealised offset into a realised loss.',
        callout:
          'The governance question this case leaves is uncomfortable: who decides that a hedge has become unaffordable, and do they understand it is a trading decision?',
      },
    ],
    keyTerms: [
      {
        term: 'Stack and roll',
        definition:
          'Holding the whole hedge in nearby contracts and rolling it forward, because distant months are not liquid enough.',
      },
      {
        term: 'Backwardation',
        definition:
          'A curve where nearby prices exceed distant ones, which makes rolling a long position cost money.',
      },
      {
        term: 'Contango',
        definition:
          'The opposite shape, where distant prices exceed nearby ones, and a long roll earns rather than costs.',
      },
      {
        term: 'Maturity mismatch',
        definition:
          'A hedge whose settlement dates differ from the exposure’s, leaving a funding gap even when the economics offset.',
      },
      {
        term: 'Roll yield',
        definition:
          'The gain or loss from replacing an expiring contract with a later one, which accumulates every month.',
      },
      {
        term: 'Liquidation decision',
        definition:
          'The choice to close a hedge, which converts an unrealised offset into a realised loss.',
      },
    ],
    example: {
      title: 'Two ways the same hedge drains cash',
      lines: [
        'The obligation is 160 million barrels of forward supply, hedged with an equivalent long position in nearby futures.',
        'Oil falls $5 a barrel. The futures lose 160,000,000 × $5 = $800m, payable in cash as variation margin.',
        'The customer contracts gain the same $800m — realised as deliveries are made, over as much as ten years.',
        'Now the curve: rolling the stack in a $0.30 backwardation costs 160,000,000 × $0.30 = $48m every month.',
        'Over a year that is around $576m of roll cost, separate from the price move entirely.',
        'Neither number is a loss on the hedged position. Both are cash out of the door this year.',
      ],
      takeaway:
        'The book was close to flat on price and profoundly short on cash. A hedging programme has to be funded through the worst year it can have, not the average one.',
    },
    inPractice:
      'Long-dated physical supply is still hedged with shorter instruments, because the liquidity is where it is. What changed is that the roll and the funding are modelled explicitly, financed in advance, and governed by people who know that unwinding the hedge is itself a position.',
    relatedProductIds: ['cmswap', 'cmfwd', 'ldi'],
    quiz: [
      {
        id: 'metallges-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The company had sold customers oil at fixed prices for as long as ten years ahead.',
        correctAnswer: true,
        explanation:
          'Those contracts were the exposure being hedged, and they only turned into cash as deliveries were made.',
      },
      {
        id: 'metallges-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What ended the position?',
        options: [
          'The customers defaulted on their contracts',
          'The parent liquidated the hedge and closed contracts, realising the loss',
          'The exchange cancelled the futures',
          'The oil price recovered before any action was taken',
        ],
        correctIndex: 1,
        explanation:
          'The liquidation crystallised roughly $1.3bn at what turned out to be close to the worst point.',
      },
      {
        id: 'metallges-q3',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Why was a stack and roll used rather than a ten-year strip?',
        options: [
          'Because a ten-year strip does not trade in that size',
          'Because regulators prohibited long-dated futures',
          'Because it required less capital by rule',
          'Because the customers demanded it',
        ],
        correctIndex: 0,
        explanation:
          'Liquidity is in the nearby months, so the whole hedge sits there and is rolled forward.',
      },
      {
        id: 'metallges-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Matching the total barrels of the hedge to the total barrels of the obligation matches the risk.',
        correctAnswer: false,
        explanation:
          'It matches quantity, not timing. What is left is exposure to the curve and to the cash flow schedule.',
      },
      {
        id: 'metallges-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'In backwardation, what does rolling a long futures position do?',
        options: [
          'Earns money each month',
          'Costs money each month',
          'Has no effect on profit and loss',
          'Converts the position to a short',
        ],
        correctIndex: 1,
        explanation:
          'Nearby prices exceed distant ones, so the position is repeatedly sold low and bought higher out the curve.',
      },
      {
        id: 'metallges-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The futures hedge settled in cash daily while the customer contracts settled over years.',
        correctAnswer: true,
        explanation:
          'That mismatch is the case in one sentence — the economics offset and the cash flows did not.',
      },
      {
        id: 'metallges-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What two pressures arrived at the same time?',
        options: [
          'A credit downgrade and a customer default',
          'Falling prices producing margin calls, and a curve shape making the roll costly',
          'A regulatory fine and an exchange suspension',
          'Rising interest rates and a currency devaluation',
        ],
        correctIndex: 1,
        explanation:
          'Either alone was survivable. Together they made the hedge unaffordable to carry.',
      },
      {
        id: 'metallges-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Economists have disagreed publicly about whether the hedge should have been liquidated at all.',
        correctAnswer: true,
        explanation:
          'One reading is that the hedge was sound and closing it was the error; the other is that its size and roll risk were misjudged.',
      },
      {
        id: 'metallges-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Roughly what was realised on the liquidation?',
        options: ['$130m', '$1.3bn', '$13bn', 'Nothing — the positions expired'],
        correctIndex: 1,
        explanation:
          'Along with a bank rescue package for the parent group and the replacement of its management.',
      },
      {
        id: 'metallges-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Funding a hedging programme for an average year is sufficient, since extreme years are rare.',
        correctAnswer: false,
        explanation:
          'It has to be funded for the worst year it can have. The average year never produces the call that closes the position.',
      },
      {
        id: 'metallges-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why is the decision to close a hedge itself a risk decision?',
        options: [
          'Because closing requires regulatory approval',
          'Because it converts an unrealised offset into a realised loss, at a moment chosen under pressure',
          'Because hedges cannot legally be reopened',
          'Because it changes the accounting treatment of the customer contracts',
        ],
        correctIndex: 1,
        explanation:
          'Whoever makes that call is taking a position, whether or not they think of it that way.',
      },
      {
        id: 'metallges-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Roll cost depends on the shape of the forward curve, which the hedger does not control.',
        correctAnswer: true,
        explanation:
          'It accumulates every month regardless of whether the price view was right.',
      },
    ],
  },
  {
    id: 'chffloor',
    categoryId: 'cases',
    name: 'The Swiss franc floor, 2015',
    hook: 'A guarantee withdrawn in a morning',
    summary:
      'For three years the Swiss National Bank held EUR/CHF above 1.20 and said it would continue to. On 15 January 2015 it stopped, without warning, and the rate fell by roughly a third within minutes. Stop-loss orders filled tens of figures away from where they were placed, retail clients ended the morning owing their brokers money, a hedge fund closed and several brokers failed. It is the clearest available lesson that a stable price is not a low-risk one.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What happened',
        content:
          'The SNB had defended a minimum exchange rate of 1.20 francs per euro since September 2011, buying euros in whatever quantity the market offered. On the morning of 15 January 2015 it announced the policy was discontinued, effective immediately. EUR/CHF fell from 1.20 to as low as around 0.85 in minutes before recovering to close near parity. There was almost no tradable liquidity in between: the market did not walk down through those levels, it skipped them.',
        callout:
          'Three days earlier the SNB’s vice-chairman had described the floor as a cornerstone of policy. That is not a criticism of the central bank; it is the nature of a commitment that only works while it is believed.',
      },
      {
        step: 2,
        title: 'Why the floor made things worse',
        content:
          'A credible peg suppresses realised volatility to almost nothing, and everything downstream reads that as safety. Value-at-risk models estimated on three years of a rate that barely moved returned tiny numbers. Margin requirements were set accordingly — some brokers required well under one percent. Carry positions and structured products accumulated on the assumption the floor would hold. The floor did not create the risk; it hid it, and then released three years of it in one print.',
        callout:
          'A pegged rate is a short volatility position held by everyone who trades it, whether or not they know they hold one.',
      },
      {
        step: 3,
        title: 'What a gap does to a stop',
        content:
          'A stop-loss order is an instruction to trade at the market once a level is reached, not a promise of a price. When the market gaps, the next available price can be far beyond the stop, and the client gets that one. With leverage of fifty or a hundred times, a move of thirty figures does not merely exhaust the margin — it takes the account well below zero, leaving the client owing the broker. Whether those debts were collectable, and whether retail clients should ever have been exposed to them, occupied regulators for years afterwards.',
        callout:
          'This is the same discontinuity as a barrier option or a digital, arriving in the most liquid market in the world.',
      },
      {
        step: 4,
        title: 'What it cost',
        content:
          'A US retail broker was left with around $225m of negative client balances and needed an emergency $300m loan to keep operating. A UK broker entered administration the same week, and a New Zealand one closed. A hedge fund with a large short franc position — reportedly around $830m of assets — was wiped out. Swiss exporters faced a currency a third stronger overnight, and holders of target redemption forwards and knock-out structures on the pair discovered what their contracts did in a gap.',
      },
      {
        step: 5,
        title: 'What it teaches',
        content:
          'Low realised volatility is not low risk; it can be the visible sign of risk being suppressed and stored. Any model estimated on a managed price is describing the management, not the market. Leverage set against a suppressed volatility is leverage against nothing. And a stop-loss, a barrier, a knock-out and a margin call all share the same assumption — that prices move continuously through levels — which is exactly the assumption a policy reversal removes.',
        callout:
          'The practical version: ask what this position does if the price gaps 20% overnight, and accept that the answer is the risk, whatever the model says.',
      },
    ],
    keyTerms: [
      {
        term: 'Currency floor',
        definition:
          'A central bank commitment to prevent a rate falling below a level, held by intervening without limit.',
      },
      {
        term: 'Gap risk',
        definition:
          'The risk that a price jumps rather than moves through intervening levels, defeating stops and hedges.',
      },
      {
        term: 'Stop-loss order',
        definition:
          'An instruction to trade at the market once a level trades — an order, not a guaranteed price.',
      },
      {
        term: 'Negative client balance',
        definition:
          'An account whose losses exceed its deposit, leaving the client owing the broker money.',
      },
      {
        term: 'Suppressed volatility',
        definition:
          'Realised volatility held artificially low by intervention, which flatters every risk measure built on it.',
      },
      {
        term: 'Carry trade',
        definition:
          'Borrowing in a low-yielding currency to invest in a higher one — profitable until the exchange rate moves.',
      },
    ],
    example: {
      title: 'How a client ends the morning owing money',
      lines: [
        'A retail client is long €1,000,000 of EUR/CHF at 1.2010, on 2% margin: CHF 24,000 posted.',
        'A stop-loss sits at 1.1990, twenty pips below — a loss of CHF 2,000 if it fills where it is placed.',
        'The floor is removed. There is no bid at 1.1990, nor at 1.15, nor at 1.05. The order fills at 0.9500.',
        'Realised loss: (1.2010 − 0.9500) × 1,000,000 = CHF 251,000.',
        'Against CHF 24,000 of margin, the client now owes the broker CHF 227,000.',
        'Multiply by a client book of thousands, and the broker owes the market money it must collect from people who do not have it.',
      ],
      takeaway:
        'The stop worked exactly as designed and was worth nothing. Leverage decides how far below zero the account lands, and the broker’s solvency then depends on debts owed by its own customers.',
    },
    inPractice:
      'European regulators later capped retail FX leverage and required negative balance protection, which moves the gap risk from the client to the broker and forces brokers to hold capital against it. On the institutional side, the episode is the standard scenario for stress-testing a currency book: not a large move, a discontinuous one.',
    relatedProductIds: ['fxfwd', 'tarf', 'barrier'],
    quiz: [
      {
        id: 'chffloor-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The Swiss National Bank removed its EUR/CHF floor without advance warning.',
        correctAnswer: true,
        explanation:
          'The policy had been reaffirmed publicly days earlier — a commitment of that kind only works while it is believed.',
      },
      {
        id: 'chffloor-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What happened to EUR/CHF that morning?',
        options: [
          'It fell gradually over the trading day',
          'It fell about a third within minutes, with almost no liquidity in between',
          'It was suspended by the exchange',
          'It rose sharply as the franc weakened',
        ],
        correctIndex: 1,
        explanation:
          'The market skipped the intervening levels rather than trading through them.',
      },
      {
        id: 'chffloor-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Three years of a nearly motionless rate made standard risk models report very low risk.',
        correctAnswer: true,
        explanation:
          'A model estimated on a managed price is describing the management, not the market.',
      },
      {
        id: 'chffloor-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'What position does everyone trading a credible peg implicitly hold?',
        options: [
          'A long volatility position',
          'A short volatility position',
          'A pure carry position with no volatility exposure',
          'A hedged position with no exposure at all',
        ],
        correctIndex: 1,
        explanation:
          'The peg pays a small, steady return and hands over an enormous loss on the day it breaks.',
      },
      {
        id: 'chffloor-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'The floor removed risk from the currency pair while it was in place.',
        correctAnswer: false,
        explanation:
          'It suppressed and stored it. Three years of it was released in a single print.',
      },
      {
        id: 'chffloor-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What does a stop-loss order actually guarantee?',
        options: [
          'The price at which it is placed',
          'That the position will be closed at the market once the level trades',
          'That losses cannot exceed the margin posted',
          'That the broker will absorb any shortfall',
        ],
        correctIndex: 1,
        explanation:
          'It is an instruction, not a price. In a gap the next available price can be very far away.',
      },
      {
        id: 'chffloor-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Posted margin is the most a leveraged client can lose, whatever the market does.',
        correctAnswer: false,
        explanation:
          'At 2% margin a 25% gap is more than twelve times the deposit, and the balance goes below zero.',
      },
      {
        id: 'chffloor-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt: 'Which other instruments rest on the same assumption a gap breaks?',
        options: [
          'Barriers, digitals and margin calls',
          'Fixed-rate bonds and deposits',
          'Cash equities held unlevered',
          'Physically settled forwards only',
        ],
        correctIndex: 0,
        explanation:
          'All of them assume prices move continuously through levels, which is exactly what a policy reversal removes.',
      },
      {
        id: 'chffloor-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'At least one retail broker required emergency financing to survive the day.',
        correctAnswer: true,
        explanation:
          'A US broker was left with around $225m of negative client balances and took a $300m rescue loan; others failed outright.',
      },
      {
        id: 'chffloor-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'Which structured products were caught by the move?',
        options: [
          'Target redemption forwards and knock-out structures on the pair',
          'Fixed-rate mortgages in Switzerland',
          'Equity index futures in Europe',
          'Inflation swaps in the euro area',
        ],
        correctIndex: 0,
        explanation:
          'A geared leg and a barrier both discover in a gap what they really were.',
      },
      {
        id: 'chffloor-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the practical question this case leaves behind?',
        options: [
          'What is the position’s carry?',
          'What does this position do if the price gaps 20% overnight?',
          'What is the correlation with equities?',
          'What is the counterparty’s credit rating?',
        ],
        correctIndex: 1,
        explanation:
          'The answer to that is the risk, whatever a volatility-based model reports.',
      },
      {
        id: 'chffloor-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Regulators later required negative balance protection for retail clients in some jurisdictions.',
        correctAnswer: true,
        explanation:
          'It moves gap risk from the client to the broker, which then has to hold capital against it.',
      },
    ],
  },
];
