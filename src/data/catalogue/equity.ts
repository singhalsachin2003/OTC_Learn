import type { Product } from '../types';

/** Equity products. Ids are stable — saved progress is keyed by them. */
export const equityProducts: Product[] = [
  {
    id: 'eqswap',
    categoryId: 'equity',
    name: 'Equity Swap',
    hook: 'Swap equity returns for a funding rate',
    summary:
      'An equity swap exchanges the return on a share, a basket or an index for a funding rate on the same notional. One leg pays whatever the equity delivers over each period — the price move and, in a total return swap, the dividends — while the other pays a benchmark rate plus a spread. No shares change hands, so the receiver ends up with the economics of a shareholder without the shares, the vote or the settlement and custody that come with them.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One leg pays the equity return (price change plus dividends) on a notional; the other leg pays a fixed or floating interest rate. No shares change hands. The underlying can be a single stock, a custom basket or an index, and the two legs are documented as one contract under an ISDA master agreement.',
        callout:
          'The legs need not share a currency: a quanto equity swap pays a foreign index return in the investor’s home currency at an exchange rate fixed at the outset.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'At each reset the equity leg pays the percentage return since the previous reset, and the funding leg pays its rate. If the stock has fallen, the flow simply reverses and the equity-return receiver pays the loss across to the counterparty. The funding leg is normally an overnight benchmark such as SOFR or SONIA compounded over the period, plus a spread that reflects the dealer’s hedging and balance-sheet cost. On a hard-to-borrow name that spread is wider for a synthetic short, where the dealer has to source the borrow, and tighter for a synthetic long, whose hedge shares the dealer can lend out. Resets are commonly monthly or quarterly.',
        callout:
          'With a resetting notional the period’s performance is paid in cash and the notional is re-struck at the new price, so exposure tracks the market value; with a fixed notional it does not, and the equivalent share count falls as the price rises.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Investors gain equity exposure without owning shares — avoiding voting rights and getting different funding, tax, or balance-sheet treatment. Also used to hedge existing positions. A fund can be long a foreign index within a day without opening a local custody account, and can go short synthetically because the dealer, not the fund, arranges the stock borrow.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Total return swaps include dividends; price return swaps do not. The financing leg is typically a benchmark rate plus a spread, and the notional may either reset with the equity value or stay fixed for the term. The dividend adjustment states what proportion of a declared dividend is passed through, which is often less than the gross amount where withholding tax applies.',
        callout:
          'In the US a swap on a single share or a narrow index is a security-based swap overseen by the SEC, while one on a broad market index is a swap overseen by the CFTC.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Positions are usually leveraged and marked frequently, so an adverse move brings margin calls. Actual dividends may differ from what was assumed at pricing, and building large synthetic stakes without disclosure has drawn sustained regulatory attention. In the UK, cash-settled positions count towards the major shareholding notifications that begin at 3% of voting rights, so a swap does not sidestep disclosure there.',
        callout:
          'Archegos Capital Management built concentrated single-stock exposure through total return swaps; when the positions were unwound in March 2021 the dealers on the other side lost roughly $10bn between them.',
      },
    ],
    keyTerms: [
      {
        term: 'Equity leg',
        definition:
          'The side paying the return on the underlying share, basket or index over each period.',
      },
      {
        term: 'Financing leg',
        definition:
          'The side paying a benchmark rate such as SOFR or SONIA plus an agreed spread.',
      },
      {
        term: 'Reset date',
        definition:
          'The date on which the period’s equity return is calculated and the two legs settle.',
      },
      {
        term: 'Notional reset',
        definition:
          'A feature that re-strikes the notional at the current price each period so exposure tracks market value.',
      },
      {
        term: 'Total return',
        definition:
          'An equity leg that passes on dividends as well as price changes, unlike a price return leg.',
      },
      {
        term: 'Dividend adjustment',
        definition:
          'The agreed proportion of a declared dividend passed through on the equity leg, often net of withholding tax.',
      },
    ],
    example: {
      title: 'A fund buys index exposure without buying the index',
      lines: [
        'A fund receives the total return on $50m of an index and pays SOFR plus 40bp.',
        'Over the year the index returns 8% including dividends: it receives $4m.',
        'The funding leg costs 4.4% for the year, so it pays $2.2m.',
        'Net of the two legs the fund receives $4m − $2.2m = $1.8m.',
        'Had the index instead fallen 3%, it would pay $1.5m on the equity leg plus $2.2m of financing — $3.7m out.',
      ],
      takeaway:
        'The fund earns the index return less its cost of funding, which is what a leveraged holder of the shares would earn. The swap changes who holds the stock, not the economics of holding it.',
    },
    inPractice:
      'Hedge funds use equity swaps with a prime broker to run long and short books without settling every share, and asset managers use them to take index exposure in markets where opening local custody would be slow or costly. Dealers on the other side usually hedge by holding the underlying shares themselves.',
    relatedProductIds: ['cfd', 'eqopt', 'trs'],
    quiz: [
      {
        id: 'eqswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Equity swap holders receive voting rights on the underlying shares.',
        correctAnswer: false,
        explanation:
          'The exposure is synthetic — no shares are owned, so there is nothing to vote.',
      },
      {
        id: 'eqswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What does the receiver of the equity leg actually get?',
        options: [
          'Legal title to the shares, held by the dealer as custodian',
          'The percentage return on a notional amount, paid in cash',
          'A right to buy the shares at a fixed strike price',
          'A share of the dealer’s trading profits on the name',
        ],
        correctIndex: 1,
        explanation:
          'The equity leg pays a return on a reference notional. The shares stay where they are.',
      },
      {
        id: 'eqswap-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A quanto equity swap pays a foreign index return in the investor’s home currency at a pre-agreed exchange rate.',
        correctAnswer: true,
        explanation:
          'Fixing the rate at the outset strips the currency move out of the equity return.',
      },
      {
        id: 'eqswap-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'If the underlying stock falls, the equity-return receiver pays that loss to the counterparty.',
        correctAnswer: true,
        explanation:
          'The equity leg works both ways — a negative return reverses the direction of payment.',
      },
      {
        id: 'eqswap-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A fund receives the total return on $50m and pays financing. The index returns 8% over the year and the funding leg costs 4.4%. What is the net result?',
        options: [
          'It receives $4m, with the financing settled separately at maturity',
          'It receives $1.8m net',
          'It pays $1.8m net',
          'It receives $6.2m net',
        ],
        correctIndex: 1,
        explanation:
          'The equity leg pays $4m and the funding leg costs $2.2m, leaving a net receipt of $1.8m.',
      },
      {
        id: 'eqswap-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'On a swap with a resetting notional, the period’s performance is paid in cash and the notional is re-struck at the new price.',
        correctAnswer: true,
        explanation:
          'That keeps the exposure proportional to market value instead of letting it drift.',
      },
      {
        id: 'eqswap-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Why might an investor take equity exposure through a swap rather than buying the shares?',
        options: [
          'To obtain voting rights more cheaply than by buying stock',
          'To avoid paying any financing cost on the exposure',
          'To get the return without custody, settlement or a shareholding on the balance sheet',
          'To guarantee a minimum return on the underlying',
        ],
        correctIndex: 2,
        explanation:
          'The swap delivers the economics while the dealer deals with holding and settling the stock.',
      },
      {
        id: 'eqswap-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'An equity swap can only be used to gain exposure, never to hedge a holding the investor already owns.',
        correctAnswer: false,
        explanation:
          'Paying the equity leg on a position already held offsets its performance, which is a hedge.',
      },
      {
        id: 'eqswap-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'A price return swap passes on dividends as well as price changes.',
        correctAnswer: false,
        explanation:
          'Dividends are what separate a total return leg from a price return leg.',
      },
      {
        id: 'eqswap-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'advanced',
        prompt:
          'In the US, a swap on a single share is regulated as which of these?',
        options: [
          'A security-based swap, overseen by the SEC',
          'A listed option, overseen by the OCC',
          'A futures contract, overseen by the CFTC',
          'An unregulated bilateral forward',
        ],
        correctIndex: 0,
        explanation:
          'Single-name and narrow-index swaps sit with the SEC; broad-based index swaps sit with the CFTC.',
      },
      {
        id: 'eqswap-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What made the Archegos episode so costly for its dealers in 2021?',
        options: [
          'The swaps were centrally cleared and the clearing house failed',
          'Concentrated single-stock exposure built synthetically, unwound into falling prices',
          'Dividends came in far below the level assumed at pricing',
          'The financing leg reset to a negative rate',
        ],
        correctIndex: 1,
        explanation:
          'Each dealer saw only its own slice of the position, and the forced unwind moved the shares against them.',
      },
      {
        id: 'eqswap-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'foundational',
        prompt:
          'Because equity swap positions are leveraged and marked frequently, an adverse move can bring margin calls quickly.',
        correctAnswer: true,
        explanation:
          'Frequent marking turns a paper loss into a cash demand within days rather than years.',
      },
    ],
  },
  {
    id: 'eqopt',
    categoryId: 'equity',
    name: 'OTC Equity Option',
    hook: 'A custom, bilaterally negotiated option',
    summary:
      'A privately negotiated right — not an obligation — to buy or sell a share, a basket or an index at an agreed strike on an agreed date. Everything a listed contract fixes for you is negotiable here: the strike, the size, the expiry, the underlying and features such as barriers. The price of that flexibility is that the contract exists only between the two parties who signed it, with no exchange or clearing house standing behind it.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A right to buy or sell a stock, basket, or index at a strike price, negotiated bilaterally rather than traded on a listed exchange. The buyer pays a premium for that right and can walk away from it; the seller has no choice but to perform if the buyer exercises.',
      },
      {
        step: 2,
        title: 'How it’s priced',
        content:
          'Value comes from the underlying price, the strike, time to expiry, dividends, interest rates and — above all — implied volatility. Dealers quote and manage these positions in volatility terms, hedging the delta as the underlying moves. Because the delta changes as the price moves, that hedge has to be adjusted continually rather than set once.',
        callout:
          'Index options carry a pronounced skew: puts struck below spot trade at a higher implied volatility than calls struck the same distance above, a pattern that has held since the 1987 crash.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'OTC options allow tailored strikes, expiries, notionals, and exotic features (like barriers) for hedging concentrated positions or bespoke payoffs. A shareholder who needs protection on an exact number of shares to an exact date can buy it, rather than approximating the exposure with standard listed contracts.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, expiry, underlying, premium — plus exotic features like knock-in/knock-out barriers or basket underlyings not available on listed markets. Sensitivities are tracked through the Greeks: delta, gamma, vega and theta.',
        callout:
          'Vega is quoted per volatility point: a book showing $40,000 of vega gains roughly $40,000 if implied volatility rises from 20 to 21.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'There is no clearing house standing behind the trade, so each side carries the other’s credit risk. Bespoke contracts are hard to exit before expiry, barrier features can terminate a hedge at the worst possible moment, and sellers face losses far exceeding the premium.',
        callout:
          'The uncleared margin rules now require in-scope dealers and funds to exchange initial and variation margin on bilateral options, which limits — but does not remove — that credit exposure.',
      },
    ],
    keyTerms: [
      {
        term: 'Strike',
        definition:
          'The price at which the option lets its holder buy or sell the underlying.',
      },
      {
        term: 'Premium',
        definition:
          'The amount paid upfront for the option, and the most a buyer can lose on it.',
      },
      {
        term: 'Implied volatility',
        definition:
          'The volatility figure that makes a model return the option’s traded price — the language dealers quote in.',
      },
      {
        term: 'Delta',
        definition:
          'How much the option’s value moves for a small move in the underlying, and so how much stock hedges it.',
      },
      {
        term: 'Vega',
        definition:
          'How much the option’s value moves when implied volatility changes by one point.',
      },
      {
        term: 'Barrier',
        definition:
          'A price level that brings an option into existence or extinguishes it if the underlying trades through it.',
      },
    ],
    example: {
      title: 'A founder puts a floor under a concentrated holding',
      lines: [
        'A founder holds 2m shares trading at $40 — a position worth $80m.',
        'She buys a one-year OTC put struck at $36 on the full 2m shares.',
        'The premium is $2 a share, so $4m is paid upfront.',
        'The stock ends the year at $28, so the put pays $36 − $28 = $8 a share, or $16m.',
        'The shares are worth $56m, so the package is worth $56m + $16m − $4m = $68m.',
      ],
      takeaway:
        'Below the $36 strike the position is worth $68m however far the stock falls — a floor of $34 a share, the strike less the premium. Above $36 the put expires worthless and the $4m is simply the cost of the insurance.',
    },
    inPractice:
      'Company founders and executives use bespoke puts and collars to protect stock they cannot easily sell, and pension funds buy index puts to cap the drawdown on an equity book. On the other side sit dealers, who warehouse the risk and hedge it with listed options and the underlying shares.',
    relatedProductIds: ['varswap', 'eqswap', 'fxopt'],
    quiz: [
      {
        id: 'eqopt-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An OTC equity option is negotiated bilaterally rather than traded on an exchange.',
        correctAnswer: true,
        explanation:
          'The two parties agree the terms directly, which is what makes it customisable.',
      },
      {
        id: 'eqopt-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Which of these can an OTC option be written on that a listed contract usually cannot?',
        options: [
          'A single large-cap share',
          'A bespoke basket of shares with a non-standard expiry date',
          'A major stock index',
          'A share trading on its primary exchange',
        ],
        correctIndex: 1,
        explanation:
          'Listed markets offer standard underlyings and standard dates; a bespoke basket and date has to be done OTC.',
      },
      {
        id: 'eqopt-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'Buying an option obliges the holder to trade at the strike price at expiry.',
        correctAnswer: false,
        explanation:
          'The buyer holds a right and can let it lapse. It is the seller who must perform if it is exercised.',
      },
      {
        id: 'eqopt-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'Which input dominates the price a dealer quotes for an equity option?',
        options: [
          'The issuer’s credit rating',
          'The number of shares in issue',
          'Implied volatility',
          'Last year’s dividend growth rate',
        ],
        correctIndex: 2,
        explanation:
          'Spot, strike and expiry are observable; volatility is the number being traded.',
      },
      {
        id: 'eqopt-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Index options typically show a skew in which lower-strike puts trade at a higher implied volatility than calls the same distance above spot.',
        correctAnswer: true,
        explanation:
          'Demand for downside protection, and the tendency of indices to fall faster than they rise, keeps that skew in place.',
      },
      {
        id: 'eqopt-q6',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Once a dealer has sold an option and hedged it once, no further hedging is required.',
        correctAnswer: false,
        explanation:
          'Delta changes as the underlying moves, so the hedge has to be adjusted continually.',
      },
      {
        id: 'eqopt-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'A holder of 2m shares at $40 buys a one-year $36 put on all of them for $2 a share. The stock ends at $28. What is the hedged position worth at expiry, net of the premium paid?',
        options: ['$80m', '$68m', '$56m', '$72m'],
        correctIndex: 1,
        explanation:
          'Shares $56m, plus $16m from the put, less the $4m premium — $68m, a floor of $34 a share.',
      },
      {
        id: 'eqopt-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'An OTC option must use one of a fixed set of standard expiry dates.',
        correctAnswer: false,
        explanation:
          'The expiry is negotiated, which is precisely why hedgers use OTC rather than listed contracts.',
      },
      {
        id: 'eqopt-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does vega measure?',
        options: [
          'Sensitivity to a move in the underlying price',
          'Sensitivity to the passage of time',
          'The rate at which delta itself changes',
          'Sensitivity to a change in implied volatility',
        ],
        correctIndex: 3,
        explanation:
          'Delta is price sensitivity, theta is time, gamma is the change in delta, vega is volatility.',
      },
      {
        id: 'eqopt-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A knock-out barrier can extinguish an option if the underlying trades through a set level.',
        correctAnswer: true,
        explanation:
          'That is what the barrier does, which is why it can remove a hedge exactly when it is needed.',
      },
      {
        id: 'eqopt-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Which risk does an OTC option carry that an exchange-listed one largely avoids?',
        options: [
          'The premium can be revised by the dealer after the trade',
          'The exchange may suspend trading in the underlying',
          'Each side relies on the other to perform, with no clearing house in between',
          'The strike is reset every day to the prevailing spot price',
        ],
        correctIndex: 2,
        explanation:
          'Listed contracts are novated to a clearing house; an OTC option is only as good as the counterparty.',
      },
      {
        id: 'eqopt-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'The seller of an option can lose more than the premium received.',
        correctAnswer: true,
        explanation:
          'The premium is capped; the payout the seller owes is not, which is the asymmetry of the trade.',
      },
    ],
  },
  {
    id: 'varswap',
    categoryId: 'equity',
    name: 'Variance Swap',
    hook: 'Trade realized volatility directly',
    summary:
      'A variance swap turns volatility itself into something you can buy and sell. It settles once, at maturity, on the difference between the variance a stock or index actually realises and a strike agreed at the outset. The strike is quoted as a volatility number — 20, say — but the contract settles on that number squared, and that squaring is what gives the payoff its distinctive shape.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A variance swap pays the difference between the variance a stock or index actually realises over the life of the contract and a variance strike agreed at the outset. It isolates volatility as something tradable in its own right. The strike is quoted in volatility points for readability — a strike of 20 means a variance strike of 400 — and despite the name nothing is exchanged along the way: there is a single cash settlement at maturity.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'At maturity, realised variance is calculated from daily returns and compared with the variance strike. The payoff is that difference multiplied by a variance notional, so the buyer profits whenever realised volatility comes in above the strike — whether prices rose or fell. Because quoting a payoff per variance point is unintuitive, trades are sized in vega notional, the payoff per volatility point at the strike; the variance notional is the vega notional divided by twice the strike.',
        callout:
          'Realised variance is normally computed from closing prices, with the mean return assumed to be zero and the daily figures annualised using 252 trading days.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Portfolios tend to lose money precisely when markets get turbulent, so being long variance acts as a hedge against turmoil. It also lets traders express a pure view on volatility without the constant delta-hedging an option position would demand. Dispersion desks use it in pairs — selling variance on an index while buying it on the index members — which is a trade on how closely the constituents move together rather than on volatility alone.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Realised variance, the variance strike, vega notional (the payoff per volatility point), the variance notional the settlement is actually multiplied by, the observation period, and the cap that most contracts apply to limit the payoff in an extreme crash.',
        callout:
          'Single-stock variance swaps are typically capped at 2.5 times the strike — on a strike of 20 that caps settlement as though realised volatility stopped at 50 — while index variance is more often left uncapped.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The payoff is linear in variance, which makes it convex in volatility: a seller’s losses grow disproportionately as volatility spikes, and sellers were badly hurt in 2008 and again in early 2020. Buyers pay for that protection through a strike typically set above expected volatility. Because returns are squared, a handful of violent days can dominate the whole observation period, and the option portfolio a dealer uses to hedge assumes prices move smoothly — a gap leaves that hedge short of the payoff it owes.',
        callout:
          'One 10% daily move contributes 100 variance points to a 252-day observation period on its own — the same contribution as a full year realising 10% volatility.',
      },
    ],
    keyTerms: [
      {
        term: 'Realised variance',
        definition:
          'The annualised average of squared daily returns actually observed over the contract’s life.',
      },
      {
        term: 'Variance strike',
        definition:
          'The level settlement is measured against — the square of the volatility number the trade is quoted at.',
      },
      {
        term: 'Variance notional',
        definition:
          'The cash amount paid per point of difference between realised variance and the strike.',
      },
      {
        term: 'Vega notional',
        definition:
          'The approximate payoff per volatility point at the strike, equal to twice the strike times the variance notional.',
      },
      {
        term: 'Observation period',
        definition:
          'The run of trading days whose daily returns feed the realised variance calculation.',
      },
      {
        term: 'Cap',
        definition:
          'A ceiling on the realised volatility used at settlement, limiting how much a seller can lose.',
      },
    ],
    example: {
      title: 'Five points either side of the strike',
      lines: [
        'A fund buys variance on an index at a strike of 20, sized at $100,000 of vega notional.',
        'The variance notional is the vega notional divided by twice the strike: $100,000 ÷ 40 = $2,500 per variance point.',
        'Realised volatility comes in at 25, so the payoff is $2,500 × (25² − 20²) = $2,500 × 225 = $562,500.',
        'Had realised volatility come in at 15, the payoff would be $2,500 × (15² − 20²) = −$437,500.',
        'Both outcomes are five volatility points from the strike, yet the gain exceeds the loss by $125,000.',
      ],
      takeaway:
        'The payoff is a straight line in variance and a curve in volatility. That convexity is why a buyer will accept a strike above the volatility they actually expect, and why a seller’s losses accelerate rather than scale as volatility climbs.',
    },
    inPractice:
      'Bank volatility desks, which often end up structurally short volatility from selling structured products to retail investors, buy index variance to offset that exposure. On the other side are hedge funds trading the gap between implied and realised volatility, running dispersion between an index and its constituents, or holding index variance as a hedge that pays when an equity book is losing.',
    relatedProductIds: ['eqopt', 'swaption', 'fxopt'],
    quiz: [
      {
        id: 'varswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A variance swap pays out on the volatility actually realised, not on the direction of the market.',
        correctAnswer: true,
        explanation:
          'Returns are squared, so a large fall and a large rise contribute to the payoff identically.',
      },
      {
        id: 'varswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'advanced',
        prompt:
          'A variance swap quoted at a strike of 20 settles on which difference?',
        options: [
          'Realised volatility less 20',
          'Realised variance less 400',
          'The average daily return over the period, less 20%',
          'Implied volatility less realised volatility, measured each day',
        ],
        correctIndex: 1,
        explanation:
          'The quote is in volatility points for readability, but the contract is struck on variance — 20 squared is 400.',
      },
      {
        id: 'varswap-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'A standard variance swap settles periodically over its life, like a coupon.',
        correctAnswer: false,
        explanation:
          'Realised variance is only known at the end, so there is a single cash settlement at maturity.',
      },
      {
        id: 'varswap-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A variance swap is struck at 20 with a vega notional of $100,000. What is the variance notional?',
        options: ['$2,000,000', '$5,000', '$2,500', '$100,000'],
        correctIndex: 2,
        explanation:
          'Vega notional divided by twice the strike: $100,000 ÷ (2 × 20) = $2,500 per variance point.',
      },
      {
        id: 'varswap-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Realised variance is calculated from the highest and lowest prices reached during the observation period.',
        correctAnswer: false,
        explanation:
          'It is built from daily returns — the path matters, not just the extremes it reached.',
      },
      {
        id: 'varswap-q6',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why does being long variance work as a hedge for an equity portfolio?',
        options: [
          'The swap pays a fixed coupon whenever the market falls',
          'The strike is reset lower if markets sell off',
          'The contract can be converted into shares at a discount',
          'Volatility tends to rise sharply when equity markets fall',
        ],
        correctIndex: 3,
        explanation:
          'The hedge pays most in exactly the conditions that hurt the portfolio it is protecting.',
      },
      {
        id: 'varswap-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Holding a variance swap requires the investor to delta-hedge the underlying continuously.',
        correctAnswer: false,
        explanation:
          'Avoiding that constant hedging is one of the instrument’s main attractions over an option.',
      },
      {
        id: 'varswap-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does the vega notional represent?',
        options: [
          'The maximum possible loss on the contract',
          'The cash paid upfront to enter the swap',
          'The approximate payoff per volatility point at the strike',
          'The number of observation days in the period',
        ],
        correctIndex: 2,
        explanation:
          'It is the intuitive way to size the trade; the settlement itself uses the variance notional.',
      },
      {
        id: 'varswap-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'Single-stock variance swaps usually include a cap on the realised volatility used at settlement.',
        correctAnswer: true,
        explanation:
          'A cap of 2.5 times the strike is the common convention, and it is what makes the seller’s risk finite.',
      },
      {
        id: 'varswap-q10',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why do a variance seller’s losses accelerate as volatility rises?',
        options: [
          'Because the strike is reset upwards during the observation period',
          'Because the payoff is linear in variance, which grows with the square of volatility',
          'Because the financing charge on the position rises with volatility',
          'Because the cap is lifted once realised volatility passes the strike',
        ],
        correctIndex: 1,
        explanation:
          'Linear in variance means convex in volatility — each extra volatility point costs more than the last.',
      },
      {
        id: 'varswap-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Sellers of variance swaps suffered heavy losses when volatility spiked in 2008 and again in early 2020.',
        correctAnswer: true,
        explanation:
          'Both episodes produced clusters of very large daily moves, which is what variance sellers are short of.',
      },
      {
        id: 'varswap-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Five volatility points above the strike pays the buyer more than five points below it costs them.',
        correctAnswer: true,
        explanation:
          'On a strike of 20 with $2,500 of variance notional that is $562,500 against $437,500 — the convexity in action.',
      },
    ],
  },
  {
    id: 'cfd',
    categoryId: 'equity',
    name: 'Contract for Difference',
    hook: 'Cash-settled exposure to a price move',
    summary:
      'A contract for difference pays the change in an asset’s price between opening and closing a position, in cash, with no ownership of the asset at any point. It is traded on margin with a dealer as the counterparty on every trade, which makes it a cheap way to take a leveraged position in either direction — and the reason regulators have singled it out, banning it for retail clients in the US and capping the leverage retail clients may use in the UK and EU.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A contract for difference is a bilateral agreement to exchange the change in an asset’s price between opening and closing the position. The asset itself is never owned or delivered — only the difference is paid in cash. The dealer offering the contract is the counterparty to it, so there is no exchange and no clearing house involved.',
        callout:
          'CFDs cannot be sold to retail clients in the United States, where off-exchange contracts of this kind are prohibited; the equivalent exposure there is taken through listed futures, options or a margin account.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The position is opened on margin, so only a fraction of the notional is posted upfront. Gains and losses are credited or debited daily, a financing charge accrues for as long as a long position is held, and closing the contract settles the cumulative difference. Financing is calculated on the full value of the position rather than the margin posted, and equity CFDs carry a dividend adjustment: longs are credited when the share goes ex-dividend and shorts are debited.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It gives leveraged exposure in both directions — going short is as straightforward as going long — and avoids the settlement and custody involved in owning shares outright. That makes it popular for short-term trading and tactical hedging, particularly where a trader wants to be short without arranging a stock borrow themselves.',
        callout:
          'Buying UK shares attracts 0.5% stamp duty reserve tax; a CFD on the same shares does not, though any profit remains subject to capital gains tax.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Margin, leverage, the overnight financing charge, the dealer’s spread, and the close-out that settles the position. The dealer is the counterparty on every trade rather than an exchange. A margin close-out is the separate mechanism by which the dealer shuts positions once account equity falls below a set fraction of the margin required to hold them.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Leverage cuts both ways: a loss is calculated on the full position, not the margin, so it can consume the margin posted and keep going into the rest of the account. Daily marking means an adverse move triggers margin calls quickly, financing costs erode returns the longer a position is held, and holders get no ownership or shareholder rights. UK and EU retail clients do have negative balance protection, which stops an account being taken below zero — professional clients do not.',
        callout:
          'FCA and ESMA rules cap retail leverage at 30:1 on major currency pairs and 5:1 on individual shares, close out positions at 50% of required margin, and require firms to publish the percentage of retail accounts that lose money.',
      },
    ],
    keyTerms: [
      {
        term: 'Margin',
        definition:
          'The cash posted to open and maintain a position, a fraction of its full value.',
      },
      {
        term: 'Leverage',
        definition:
          'The ratio of position value to margin posted, which magnifies gains and losses alike.',
      },
      {
        term: 'Overnight financing',
        definition:
          'The daily charge for funding the full value of a long position, accruing for as long as it is held.',
      },
      {
        term: 'Spread',
        definition:
          'The gap between the dealer’s buy and sell prices, paid on entry and exit of every trade.',
      },
      {
        term: 'Margin close-out',
        definition:
          'The dealer’s closing of positions once account equity falls below a set fraction of required margin.',
      },
      {
        term: 'Dividend adjustment',
        definition:
          'A cash credit to long positions and debit to short ones when the underlying share goes ex-dividend.',
      },
    ],
    example: {
      title: 'A leveraged long, held for three weeks',
      lines: [
        'A trader buys a CFD on 1,000 shares quoted at £50 — a position worth £50,000.',
        'Retail share CFDs require at least 20% margin, so £10,000 is posted.',
        'Financing accrues on the full £50,000 at 6.5% a year: over 20 days that is £50,000 × 6.5% × 20 ÷ 365 = £178.',
        'The shares rise to £53 and the position is closed, a price gain of 1,000 × £3 = £3,000.',
        'Net of financing the trader makes £2,822 on £10,000 of margin — a return of 28%.',
      ],
      takeaway:
        'A 6% move in the share produced a 28% return on the margin posted. Had the shares fallen to £47 instead, the same £3,000 move plus £178 of financing would have taken £3,178 — nearly a third of the margin — out of the account.',
    },
    inPractice:
      'CFDs are mostly used by retail and professional traders at online brokers in the UK, Europe, Australia and Singapore for short-dated directional bets and for shorting a share without arranging a borrow. Institutions take the same synthetic exposure through equity swaps with a prime broker instead, and no CFD is available to a US retail client at all.',
    relatedProductIds: ['eqswap', 'eqopt', 'fxfwd'],
    quiz: [
      {
        id: 'cfd-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A CFD settles the change in price without transferring ownership of the asset.',
        correctAnswer: true,
        explanation:
          'Only the difference in price is exchanged in cash — hence the name.',
      },
      {
        id: 'cfd-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'Who is the counterparty on a retail CFD?',
        options: [
          'A central clearing house',
          'Another retail client, matched on an exchange',
          'The dealer or broker offering the contract',
          'The company whose shares are referenced',
        ],
        correctIndex: 2,
        explanation:
          'Every CFD is a bilateral contract with the dealer, which is where the credit exposure sits.',
      },
      {
        id: 'cfd-q3',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'CFDs are traded on margin, so only a fraction of the position value is posted upfront.',
        correctAnswer: true,
        explanation:
          'That fraction is what creates the leverage, and what the leverage caps are written against.',
      },
      {
        id: 'cfd-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A £50,000 CFD position is financed at 6.5% a year and held for 20 days. Roughly what does the financing cost?',
        options: ['£36', '£178', '£890', '£3,250'],
        correctIndex: 1,
        explanation:
          '£50,000 × 6.5% × 20 ÷ 365 = £178. Charging it on the £10,000 margin instead would give £36.',
      },
      {
        id: 'cfd-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'The financing charge is calculated on the margin posted rather than the full value of the position.',
        correctAnswer: false,
        explanation:
          'It accrues on the whole position, which is why carry costs scale with leverage too.',
      },
      {
        id: 'cfd-q6',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt: 'Going short through a CFD is as straightforward as going long.',
        correctAnswer: true,
        explanation:
          'Nothing has to be delivered either way, and the dealer handles any borrow behind the scenes.',
      },
      {
        id: 'cfd-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Which of these is a genuine advantage of a share CFD over buying the shares?',
        options: [
          'The holder can vote at the company’s meetings',
          'Losses cannot exceed the margin posted',
          'Dividends are received entirely free of tax',
          'No UK stamp duty is payable on the position',
        ],
        correctIndex: 3,
        explanation:
          'Stamp duty applies to share purchases, not CFDs. There is no vote, and profits are still taxable.',
      },
      {
        id: 'cfd-q8',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What is a margin close-out?',
        options: [
          'The dealer closing positions once account equity falls below a set fraction of required margin',
          'A guarantee that the trader’s losses stop at the margin posted',
          'The daily crediting of profit and loss to the account',
          'The point at which financing stops accruing on a position',
        ],
        correctIndex: 0,
        explanation:
          'It is a forced exit rather than a protection: the position goes, whatever the trader wanted.',
      },
      {
        id: 'cfd-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt: 'A CFD holder receives voting rights in the underlying company.',
        correctAnswer: false,
        explanation:
          'No shares are owned, so no shareholder rights attach to the position.',
      },
      {
        id: 'cfd-q10',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'CFDs may be sold to retail clients in the United States as long as the broker is registered there.',
        correctAnswer: false,
        explanation:
          'US rules prohibit off-exchange contracts of this kind for retail clients, whoever is offering them.',
      },
      {
        id: 'cfd-q11',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Under FCA and ESMA rules, what is the most leverage a retail client may take on a single-share CFD?',
        options: ['30:1', '20:1', '10:1', '5:1'],
        correctIndex: 3,
        explanation:
          '5:1 on individual shares — 20% margin. The 30:1 cap applies to major currency pairs.',
      },
      {
        id: 'cfd-q12',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Negative balance protection means a UK or EU retail client’s account cannot be taken below zero by a losing trade.',
        correctAnswer: true,
        explanation:
          'It caps the loss at the funds in the account. Professional clients do not get that protection.',
      },
    ],
  },
];
