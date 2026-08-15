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
  {
    id: 'divswap',
    categoryId: 'equity',
    name: 'Dividend Swap',
    hook: 'Trade dividends without owning the shares',
    summary:
      'A dividend swap takes one component of an equity’s return — the cash it hands to shareholders — and makes it tradable on its own. One side pays a fixed amount agreed at the outset; the other pays whatever dividends the underlying index or share actually declares over an agreed period, usually a calendar year. The price of the underlying never enters the settlement. Because each year trades as its own contract, the strip of them forms a curve with a term structure of its own, and that curve has a persistent tilt: the far end trades below what anyone forecasts, because the people who most need to trade it are all on the same side.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A dividend swap exchanges the dividends an index or a share actually pays over an agreed period for a fixed amount agreed at the start. Nothing else about the equity comes with it: the underlying can double or halve and the payoff is unchanged. Index dividend swaps are quoted in dividend points — the contribution dividends make to the index level — and settle in cash once the period has finished.',
        callout:
          'Standard contracts run to the end of a calendar year, so a strip of them — this year, next year, the year after — is quoted as a curve. Eurex listed dividend futures on the Euro Stoxx 50 in 2008, and the listed and OTC markets now trade side by side.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The buyer pays the fixed strike and receives the dividends that go ex-dividend inside the accrual period; the seller does the reverse. Settlement is a single cash payment shortly after the period ends, equal to realised dividends less the strike, multiplied by an agreed amount per point. Only ordinary cash dividends with an ex-date in the window count, and for an index they are converted into points using the same divisor the index itself uses. Each annual maturity trades separately, so the front contract barely moves once most of the year has been declared, while contracts several years out move on very little.',
        callout:
          'Euro Stoxx 50 dividends are heavily concentrated in the second quarter, when most continental European companies pay a single annual dividend, so a large part of a calendar year’s total is already fixed by the summer.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'The market exists because someone has a position they did not ask for. A desk that sells autocallable notes hedges them with the underlying shares and ends up holding the dividends on those shares — a long dividend exposure that arrives as a by-product of hedging something else, and that the desk sells forward to be rid of. On the other side are funds prepared to be paid for taking it, and investors who want a view on what a company pays out without a view on what its shares do. That one-way hedging flow is why implied dividends at the long end sit persistently below bottom-up forecasts of the same years’ payouts: the seller has to trade, and the buyer has to be compensated for warehousing a risk few others want.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The strike is the implied dividend — what that year can be traded at today. Realised dividends are what actually turns up, and the gap between the two is the whole trade. Around them sit the accrual period, the notional per point, and the curve of annual maturities. A single-name swap works identically, sized in shares and struck on dividends per share rather than index points.',
        callout:
          'Nothing is paid until the period ends, so the strike is not a pure forecast: it also carries the discounting and the risk premium demanded for waiting several years to find out whether the forecast was right.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A dividend is discretionary. A board can cut it to nothing in an afternoon, and it usually does so in exactly the conditions that are already hurting an equity book, so a long dividend position is not the diversifier its steady carry makes it look. In 2020 the ECB asked euro-area banks to suspend dividends and buybacks, the Bank of England’s PRA asked UK banks to do the same, and expectations for that year’s index dividends roughly halved within weeks. The long end is thin, so an unwanted position can be expensive to exit, and the OTC form leaves each side exposed to the other’s credit.',
        callout:
          'A buyback is not a dividend. A company that switches from paying cash to repurchasing shares returns the same money to its shareholders and delivers nothing at all to a dividend swap.',
      },
    ],
    keyTerms: [
      {
        term: 'Implied dividend',
        definition:
          'The fixed strike at which a given year’s dividends can be traded today, before any of them are known.',
      },
      {
        term: 'Realised dividends',
        definition:
          'The dividends that actually went ex-dividend during the accrual period, which the settlement is measured against.',
      },
      {
        term: 'Dividend points',
        definition:
          'The contribution dividends make to an index level, the unit an index dividend swap is quoted and settled in.',
      },
      {
        term: 'Accrual period',
        definition:
          'The window whose ex-dividend dates count — conventionally a single calendar year.',
      },
      {
        term: 'Dividend notional',
        definition:
          'The cash amount paid per point of difference between realised dividends and the strike.',
      },
      {
        term: 'Dividend curve',
        definition:
          'The strip of successive annual maturities, whose shape shows what the market will pay for each future year.',
      },
    ],
    example: {
      title: 'A suspension, seen from both sides',
      lines: [
        'A fund buys one calendar year of index dividends at a strike of 120 points, on €50,000 per point.',
        'It pays 120 points at settlement and receives whatever the index delivers, so it profits above 120 and loses below it.',
        'Payouts are suspended part way through the year and the index delivers 70 points.',
        'Settlement is (70 − 120) × €50,000 = −€2.5m, paid by the fund to the seller.',
        'Had dividends instead come in at 132 points, the fund would have received (132 − 120) × €50,000 = €600,000.',
      ],
      takeaway:
        'Where the index itself finished never entered the calculation — only what it paid out. That is the appeal and the trap: the position is pure dividend risk, and dividends are cut in precisely the shock that is already costing the fund money elsewhere.',
    },
    inPractice:
      'The natural sellers are bank equity derivatives desks, left long dividend risk by hedging the autocallable notes they sell to private-bank and retail investors, and keen to pass it on. The buyers are hedge funds and multi-asset managers paid to hold a risk nobody else wants, alongside investors expressing a view on a payout rather than a share price. Euro Stoxx 50 dividends are the deepest part of the market, with listed futures trading alongside the OTC swap; single-name dividend swaps exist but trade thinly.',
    relatedProductIds: ['eqswap', 'autocall', 'cmswap'],
    quiz: [
      {
        id: 'divswap-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A dividend swap settles on the dividends actually paid, regardless of where the underlying ends up.',
        correctAnswer: true,
        explanation:
          'The price of the underlying is not an input. Only the payouts inside the period are.',
      },
      {
        id: 'divswap-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt: 'What is exchanged at settlement of an index dividend swap?',
        options: [
          'The shares in the index, delivered against the strike',
          'The difference between realised dividends and the fixed strike, in cash',
          'The index return over the period, measured net of dividends',
          'A fixed coupon on the index level observed at the start',
        ],
        correctIndex: 1,
        explanation:
          'One number is agreed at the outset, the other is observed over the period, and only the difference moves.',
      },
      {
        id: 'divswap-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'A one-year dividend swap pays out each time a company in the index goes ex-dividend.',
        correctAnswer: false,
        explanation:
          'Dividends accumulate in points through the period and settle once, in cash, after it ends.',
      },
      {
        id: 'divswap-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A fund buys one year of index dividends at a strike of 120 points on €50,000 a point. Realised dividends come in at 70 points. What happens at settlement?',
        options: [
          'The fund receives €2.5m',
          'The fund pays €3.5m',
          'The fund pays €2.5m',
          'Nothing is owed, because realised dividends were still positive',
        ],
        correctIndex: 2,
        explanation:
          '(70 − 120) × €50,000 = −€2.5m. The buyer of dividends pays when realised comes in under the strike.',
      },
      {
        id: 'divswap-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'foundational',
        prompt:
          'A dividend declared after the accrual period has closed still counts, provided it relates to that year’s earnings.',
        correctAnswer: false,
        explanation:
          'The ex-dividend date is what matters — only payouts going ex inside the window feed the calculation.',
      },
      {
        id: 'divswap-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why does the front-year contract move so much less than one five years out?',
        options: [
          'The front year carries a smaller notional per point by convention',
          'The front year is capped at its strike, while later maturities are not',
          'Later maturities settle on the index level as well as its dividends',
          'Most of the front year is already declared or paid, so little is left to be uncertain about',
        ],
        correctIndex: 3,
        explanation:
          'Uncertainty is what moves a price, and the near contract has had most of its uncertainty resolved.',
      },
      {
        id: 'divswap-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'Where does the natural selling in the dividend market come from?',
        options: [
          'Companies hedging the cost of the dividends they are about to pay',
          'Index providers rebalancing the divisor at each review',
          'Dealers left long dividend risk by hedging the structured products they have sold',
          'Pension funds matching a fixed stream of liabilities',
        ],
        correctIndex: 2,
        explanation:
          'Hedging autocallable issuance leaves the desk holding dividends it never wanted, so it sells them forward.',
      },
      {
        id: 'divswap-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'advanced',
        prompt:
          'Long-dated implied dividends typically trade below bottom-up forecasts of the same years’ payouts.',
        correctAnswer: true,
        explanation:
          'The hedger has to sell and the buyer has to be paid to warehouse the risk, which leaves the long end at a discount.',
      },
      {
        id: 'divswap-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'foundational',
        prompt: 'What is the implied dividend for a given year?',
        options: [
          'The fixed level at which that year’s dividends can be traded today',
          'The dividend actually paid, once the year has finished',
          'The average dividend paid over the previous five years',
          'The dividend yield implied by the current index level',
        ],
        correctIndex: 0,
        explanation:
          'Implied is the tradable number now; realised is what turns up later. The trade lives in the gap.',
      },
      {
        id: 'divswap-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'A dividend point measures the contribution dividends make to the level of the index.',
        correctAnswer: true,
        explanation:
          'Quoting in points lets a strike sit alongside the index it comes from and be compared year to year.',
      },
      {
        id: 'divswap-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A company that replaces its dividend with a share buyback delivers the same cash to a dividend swap.',
        correctAnswer: false,
        explanation:
          'Buybacks sit outside the contract: shareholders get the money and the dividend swap gets nothing.',
      },
      {
        id: 'divswap-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt: 'What did the 2020 suspensions show about being long dividends?',
        options: [
          'Dividends are contractual, so they held up while equity markets fell',
          'Boards cut payouts in the same shock that hits share prices, so the position is not the diversifier it looks like',
          'Dividend swaps terminate early once an issuer suspends its payout',
          'Supervisors guaranteed the dividends banks had already declared',
        ],
        correctIndex: 1,
        explanation:
          'Supervisors asked banks to suspend payouts and expectations for the year roughly halved within weeks, while equities were falling.',
      },
    ],
  },
  {
    id: 'autocall',
    categoryId: 'equity',
    name: 'Autocallable Note',
    hook: 'A coupon note that can retire itself early',
    summary:
      'An autocallable note is the format that dominates retail and private-bank structured product issuance in Europe and much of Asia, and the clearest example of a payoff that depends on the path an underlying takes rather than on where it finishes. It looks at the underlying on a schedule of observation dates: above a trigger it pays a coupon and redeems itself early, and below a barrier at maturity it hands the investor the fall in the underlying. In between it simply gives the money back. The coupon looks generous next to a plain bond because it is not really interest — it is the premium on an option the investor has sold, paid in instalments.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'An autocallable note is debt issued by a bank whose repayment depends on the path of an equity underlying. On each scheduled observation date the underlying is compared with its level at the start: at or above the autocall trigger, the note redeems there and then, repaying principal with the coupon due. If that never happens, it runs to maturity, where principal comes back in full so long as the underlying has stayed above a downside barrier — and if it has not, the investor takes the fall in the underlying instead. The underlying is an index, a single share, or, most commonly, the worst performer of three or four of them.',
        callout:
          'Autocallables are exotic by reputation rather than by volume: issuing and hedging them is the routine daily business of an equity derivatives desk in Europe and Asia, not a corner of it.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Observations are usually quarterly, semi-annual or annual, often after a non-call period of six or twelve months during which no early redemption can happen. The autocall trigger is typically the initial level, sometimes stepping down a little each year so that a call gets easier the longer the note runs. Many notes also carry a separate, lower coupon barrier: hold above that on an observation date and a coupon is paid even though the note does not call. At maturity, if the note never called, the barrier test decides everything — intact, and principal is repaid in full; breached, and on the usual design redemption is principal multiplied by the underlying’s final level over its initial level, so the loss is measured from the start, not from the barrier.',
        callout:
          'A European barrier is tested only on the final valuation date; an American one is breached if the underlying trades through the level at any time in the note’s life. The same closing price at maturity can repay in full under one and take 40% under the other.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Investors buy them for a coupon far above what the same bank pays on its senior debt, in exchange for accepting an equity loss they judge unlikely. That coupon is not yield: it is the premium on a put the investor has sold, delivered in instalments. Distributors like the format because every term is a dial — a higher coupon means a higher barrier, wider observation gaps, or a fourth underlying, and each turn of the dial hands more risk to the buyer. Dealers issue them because the risk that comes back is risk they can manage, but the volume of it shapes the market they hedge in: the desk is left long dividends, which it sells forward into the dividend swap market, and carrying long-dated volatility risk on the referenced index in sizes no other flow produces.',
        callout:
          'A worst-of note pays more than one on a single index because every test runs on the weakest underlying, so the investor needs them all to hold up. The buyer is long correlation whether or not they would put it that way.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'The initial level is the reference everything else is measured against. Around it sit the observation schedule, the autocall trigger, the coupon barrier, the knock-in barrier and, on many notes, a memory feature that pays previously missed coupons once the coupon barrier is met again. The coupon barrier and the knock-in barrier are separate tests: an underlying can be too low to pay a coupon while the note is still on course to repay principal in full.',
        callout:
          'A common European retail shape is a trigger at 100% of the initial level, a coupon barrier near 70%, a knock-in barrier near 60% observed only at maturity, quarterly observations, and a stated life of five or six years that rarely runs its course.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The upside is capped at the coupon while the downside below the barrier is the underlying’s own loss in full, and the two are not symmetric in size or in when they arrive. Calls happen in strong markets, so the money comes back precisely when it is hardest to replace the terms, and the note survives in weak ones, leaving the investor holding equity risk exactly when they would rather not. The note is senior unsecured debt of the issuer, so the bank’s credit stands in front of every payoff. And barriers create gap risk on both sides: a small move through a level changes the redemption by a lot, which is what makes these hard to hedge near the barrier.',
        callout:
          'Notes sold in Korea in 2021 on the Hang Seng China Enterprises Index matured through 2024 with the index down by more than half from its sale-year levels. They had never called and the barriers had gone, and regulators found realised losses averaging around half of principal — the note’s own mechanic, working exactly as designed.',
      },
    ],
    keyTerms: [
      {
        term: 'Observation date',
        definition:
          'A scheduled date on which the underlying is compared with its initial level to decide whether the note calls or pays.',
      },
      {
        term: 'Autocall trigger',
        definition:
          'The level at or above which the note redeems early on an observation date, usually the initial level.',
      },
      {
        term: 'Coupon barrier',
        definition:
          'The lower level the underlying must hold on an observation date for a coupon to be paid without the note calling.',
      },
      {
        term: 'Knock-in barrier',
        definition:
          'The downside level that, once breached, removes the protection on principal and exposes the investor to the fall.',
      },
      {
        term: 'Memory feature',
        definition:
          'A term that pays previously missed coupons once the coupon barrier is met again on a later date.',
      },
      {
        term: 'Worst-of',
        definition:
          'A basket convention under which every trigger and barrier test is run on the weakest of the underlyings.',
      },
    ],
    example: {
      title: 'Three years, and three ways it can end',
      lines: [
        'An investor buys £100,000 of a three-year note on an index at 5,000, observed once a year.',
        'It pays 8% a year on call, calls at or above 5,000, and repays principal at maturity unless the index closes below 3,250 — 65% of the start.',
        'At the first observation the index is 4,600, so nothing is paid and the note runs on.',
        'At the second it is 5,100, above the trigger: the note redeems and pays £100,000 plus two years of coupon, £116,000 in all.',
        'Had it instead never called and finished at 3,000 — 60% of the start, through the barrier — it would have repaid 60% of principal, £60,000, with no coupon at all.',
      ],
      takeaway:
        'The best case is fixed at 8% a year and tends to arrive early; the worst is the index’s own 40% loss, taken in full. The £16,000 was the premium on a put the investor sold without calling it that. A middling path — the index at 4,000 at maturity, down 20% but above the barrier — simply returns the £100,000, three years later and no richer.',
    },
    inPractice:
      'These are sold to private-bank and retail clients across France, Italy, Switzerland, Korea, Japan and Taiwan as an income substitute for someone who believes a major index will not fall by 40%. On the other side, issuing and hedging them is the core business of a bank’s equity derivatives desk, and the aggregate of that hedging is what keeps the far end of the dividend curve permanently on offer in the indices the notes reference.',
    relatedProductIds: ['divswap', 'eqopt', 'cln'],
    quiz: [
      {
        id: 'autocall-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'An autocallable note can redeem before its scheduled maturity if the underlying is above the trigger on an observation date.',
        correctAnswer: true,
        explanation:
          'That early redemption is the autocall, and it is what the name of the structure refers to.',
      },
      {
        id: 'autocall-q2',
        kind: 'choice',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The note never calls, and at maturity the barrier has not been breached. What does the investor get?',
        options: [
          'The underlying’s performance, whether up or down',
          'The note extends for a further year on the same terms',
          'Principal repaid in full',
          'Delivery of the underlying shares',
        ],
        correctIndex: 2,
        explanation:
          'An intact barrier means principal comes back whole, however far below its start the underlying sits.',
      },
      {
        id: 'autocall-q3',
        kind: 'boolean',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'An investor in an autocallable note participates in a rally in the underlying.',
        correctAnswer: false,
        explanation:
          'The upside is the coupon and no more — a doubling of the index pays exactly what a 1% rise pays.',
      },
      {
        id: 'autocall-q4',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A three-year note on an index at 5,000 pays 8% a year on call, observed annually at a 100% trigger. The index is 4,600 after one year and 5,100 after two. What does £100,000 return?',
        options: [
          '£108,000 after one year',
          '£116,000 after two years',
          '£124,000 after three years',
          '£100,000 after two years, the year-one coupon having been lost',
        ],
        correctIndex: 1,
        explanation:
          'The second observation is above 5,000, so the note calls and pays principal plus two years of coupon.',
      },
      {
        id: 'autocall-q5',
        kind: 'boolean',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'With an American barrier, an underlying that dips through the level mid-life and then recovers has still knocked in.',
        correctAnswer: true,
        explanation:
          'It is tested continuously, so the breach is permanent — the recovery does not undo it.',
      },
      {
        id: 'autocall-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'A note with a 65% barrier reaches maturity uncalled, with the underlying at 60% of its initial level. On the usual design, what is repaid?',
        options: [
          '65% of principal, since repayment is floored at the barrier',
          '95% of principal, the loss running from the barrier downwards',
          '100% of principal, because the breach was only five points deep',
          '60% of principal, the loss being measured from the initial level',
        ],
        correctIndex: 3,
        explanation:
          'The barrier decides whether the loss applies at all, not where it starts. Below it, the fall counts from the beginning.',
      },
      {
        id: 'autocall-q7',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What is the coupon on an autocallable note actually paying for?',
        options: [
          'The premium on a put the investor has effectively sold',
          'The fee the distributor charges for placing the note',
          'A share of the issuer’s trading profits on the underlying',
          'The cost of monitoring the barrier through the note’s life',
        ],
        correctIndex: 0,
        explanation:
          'It is option premium in instalments, not interest, which is why it dwarfs the issuer’s bond yield.',
      },
      {
        id: 'autocall-q8',
        kind: 'boolean',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'A worst-of note on four underlyings pays a lower coupon than one on a single index, because the risk is spread across four names.',
        correctAnswer: false,
        explanation:
          'It pays more, not less: every test runs on the weakest name, so the investor needs all four to hold up.',
      },
      {
        id: 'autocall-q9',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does a memory feature do?',
        options: [
          'It raises the coupon for each year the note survives',
          'It lowers the autocall trigger at every observation date',
          'It pays previously missed coupons once the coupon barrier is met again',
          'It locks in the highest level the underlying reached during the note’s life',
        ],
        correctIndex: 2,
        explanation:
          'Skipped coupons are remembered rather than forfeited, and catch up on a later qualifying date.',
      },
      {
        id: 'autocall-q10',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'The autocall trigger and the knock-in barrier are two names for the same level.',
        correctAnswer: false,
        explanation:
          'The trigger sits at or near the initial level and ends the note early; the barrier sits well below it and decides whether principal is at risk.',
      },
      {
        id: 'autocall-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'An autocallable note carries the credit risk of the bank that issued it.',
        correctAnswer: true,
        explanation:
          'It is senior unsecured debt, so every payoff in the structure depends on the issuer still being there to pay it.',
      },
      {
        id: 'autocall-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'intermediate',
        prompt:
          'Why is reinvestment a genuine problem for a holder of these notes?',
        options: [
          'Coupons are paid in shares of the underlying rather than in cash',
          'The note calls in strong markets and survives in weak ones, so cash returns when terms are worst',
          'The issuer may extend the maturity at its own discretion',
          'Coupons stop accruing once the knock-in barrier is breached, even if the underlying recovers',
        ],
        correctIndex: 1,
        explanation:
          'The structure gives the money back exactly when replacing it is expensive, and keeps it when it is not.',
      },
    ],
  },
];
