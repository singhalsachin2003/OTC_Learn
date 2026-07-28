import type { Product } from '../types';

/** Equity products. Ids are stable — saved progress is keyed by them. */
export const equityProducts: Product[] = [
  {
    id: 'eqswap',
    categoryId: 'equity',
    name: 'Equity Swap',
    hook: 'Swap equity returns for a funding rate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'One leg pays the equity return (price change plus dividends) on a notional; the other leg pays a fixed or floating interest rate. No shares change hands.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'At each reset the equity leg pays the percentage return since the previous reset, and the funding leg pays its rate. If the stock has fallen, the flow simply reverses and the equity-return receiver pays the loss across to the counterparty.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Investors gain equity exposure without owning shares — avoiding voting rights and getting different funding, tax, or balance-sheet treatment. Also used to hedge existing positions.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Total return swaps include dividends; price return swaps do not. The financing leg is typically a benchmark rate plus a spread, and the notional may either reset with the equity value or stay fixed for the term.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Positions are usually leveraged and marked frequently, so an adverse move brings margin calls. Actual dividends may differ from what was assumed at pricing, and building large synthetic stakes without disclosure has drawn sustained regulatory attention.',
      },
    ],
    quiz: [
      {
        id: 'eqswap-q1',
        question:
          'Equity swap holders receive voting rights on the underlying shares.',
        correctAnswer: false,
        explanation: 'Swaps are synthetic — no shares are actually owned or voted.',
      },
      {
        id: 'eqswap-q2',
        question:
          'A total return equity swap includes dividends paid on the underlying.',
        correctAnswer: true,
        explanation:
          'That’s what distinguishes "total return" from "price return".',
      },
      {
        id: 'eqswap-q3',
        question:
          'The financing leg typically pays a rate like SOFR plus a spread.',
        correctAnswer: true,
        explanation: 'The equity-return receiver usually pays this financing cost.',
      },
      {
        id: 'eqswap-q4',
        question:
          'If the underlying stock falls, the equity-return receiver pays that loss to the counterparty.',
        correctAnswer: true,
        explanation:
          'The equity leg works both ways — a negative return reverses the payment.',
      },
      {
        id: 'eqswap-q5',
        question:
          'An equity swap requires the investor to buy the underlying shares.',
        correctAnswer: false,
        explanation:
          'No shares change hands — gaining exposure without owning them is the point.',
      },
    ],
  },
  {
    id: 'eqopt',
    categoryId: 'equity',
    name: 'OTC Equity Option',
    hook: 'A custom, bilaterally negotiated option',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A right to buy or sell a stock, basket, or index at a strike price, negotiated bilaterally rather than traded on a listed exchange.',
      },
      {
        step: 2,
        title: 'How it’s priced',
        content:
          'Value comes from the underlying price, the strike, time to expiry, dividends, interest rates and — above all — implied volatility. Dealers quote and manage these positions in volatility terms, hedging the delta as the underlying moves.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'OTC options allow tailored strikes, expiries, notionals, and exotic features (like barriers) for hedging concentrated positions or bespoke payoffs.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Strike, expiry, underlying, premium — plus exotic features like knock-in/knock-out barriers or basket underlyings not available on listed markets. Sensitivities are tracked through the Greeks: delta, gamma, vega and theta.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'There is no clearing house standing behind the trade, so each side carries the other’s credit risk. Bespoke contracts are hard to exit before expiry, barrier features can terminate a hedge at the worst possible moment, and sellers face losses far exceeding the premium.',
      },
    ],
    quiz: [
      {
        id: 'eqopt-q1',
        question:
          'OTC equity options can be customized on strike, notional, and expiry.',
        correctAnswer: true,
        explanation:
          'That flexibility is the main reason firms use OTC over listed options.',
      },
      {
        id: 'eqopt-q2',
        question: 'OTC equity options trade on public stock exchanges.',
        correctAnswer: false,
        explanation: 'They are privately negotiated between two counterparties.',
      },
      {
        id: 'eqopt-q3',
        question:
          'The premium is what the option buyer pays upfront for the right.',
        correctAnswer: true,
        explanation: 'It’s the maximum the buyer can lose on the position.',
      },
      {
        id: 'eqopt-q4',
        question: 'Implied volatility is a key input to an equity option’s price.',
        correctAnswer: true,
        explanation:
          'Dealers quote and risk-manage options largely in volatility terms.',
      },
      {
        id: 'eqopt-q5',
        question:
          'OTC equity options carry no counterparty risk because a clearing house guarantees them.',
        correctAnswer: false,
        explanation:
          'Bilateral OTC trades are not exchange-guaranteed — counterparty risk is real.',
      },
    ],
  },
  {
    id: 'varswap',
    categoryId: 'equity',
    name: 'Variance Swap',
    hook: 'Trade realized volatility directly',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A variance swap pays the difference between the volatility a stock or index actually realizes over the life of the contract and a strike level agreed at the outset. It isolates volatility as something tradable in its own right.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'At maturity, realized variance is calculated from daily returns and compared with the strike. The payoff is that difference multiplied by a variance notional, so the buyer profits whenever markets turn out choppier than expected — whether prices rose or fell.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Portfolios tend to lose money precisely when markets get turbulent, so being long variance acts as a hedge against turmoil. It also lets traders express a pure view on volatility without the constant delta-hedging an option position would demand.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Realized variance, the variance strike, vega notional (the payoff per volatility point), the observation period, and the cap that most contracts apply to limit the payoff in an extreme crash.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The payoff is convex, so a seller’s losses grow disproportionately as volatility spikes — sellers were badly hurt in 2008 and again in early 2020. Buyers pay for that protection through a strike typically set above expected volatility.',
      },
    ],
    quiz: [
      {
        id: 'varswap-q1',
        question:
          'A variance swap pays out based on volatility actually realized, not market direction.',
        correctAnswer: true,
        explanation:
          'Large moves up or down both increase realized variance equally.',
      },
      {
        id: 'varswap-q2',
        question:
          'The buyer of a variance swap profits if markets are calmer than the strike implies.',
        correctAnswer: false,
        explanation:
          'The buyer profits when realized volatility comes in above the strike, not below.',
      },
      {
        id: 'varswap-q3',
        question:
          'Variance swap payoffs are convex, so sellers can lose heavily in a crash.',
        correctAnswer: true,
        explanation:
          'Losses accelerate as volatility rises, which is why most contracts include a cap.',
      },
      {
        id: 'varswap-q4',
        question:
          'A variance swap requires the investor to delta-hedge continuously.',
        correctAnswer: false,
        explanation:
          'Avoiding that constant hedging is one of the instrument’s main attractions.',
      },
      {
        id: 'varswap-q5',
        question: 'Many variance swaps include a cap limiting the maximum payoff.',
        correctAnswer: true,
        explanation:
          'The cap protects sellers from unlimited losses in an extreme move.',
      },
    ],
  },
  {
    id: 'cfd',
    categoryId: 'equity',
    name: 'Contract for Difference',
    hook: 'Cash-settled exposure to a price move',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A contract for difference is a bilateral agreement to exchange the change in an asset’s price between opening and closing the position. The asset itself is never owned or delivered — only the difference is paid in cash.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The position is opened on margin, so only a fraction of the notional is posted upfront. Gains and losses are credited or debited daily, a financing charge accrues for as long as a long position is held, and closing the contract settles the cumulative difference.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It gives leveraged exposure in both directions — going short is as straightforward as going long — and avoids the settlement and custody involved in owning shares outright. That makes it popular for short-term trading and tactical hedging.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Margin, leverage, the overnight financing charge, the dealer’s spread, and the close-out that settles the position. The dealer is the counterparty on every trade rather than an exchange.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Leverage cuts both ways and losses can exceed the margin posted. Daily marking means an adverse move triggers margin calls quickly, financing costs erode returns the longer a position is held, and holders get no ownership or shareholder rights. Several regulators restrict or ban the sale of CFDs to retail investors.',
      },
    ],
    quiz: [
      {
        id: 'cfd-q1',
        question:
          'A CFD settles the change in price without transferring ownership of the asset.',
        correctAnswer: true,
        explanation: 'Only the difference in price is exchanged — hence the name.',
      },
      {
        id: 'cfd-q2',
        question: 'CFDs are traded on margin, which creates leverage.',
        correctAnswer: true,
        explanation:
          'Only a fraction of the notional is posted, magnifying both gains and losses.',
      },
      {
        id: 'cfd-q3',
        question:
          'Holding a long CFD position over time incurs a financing charge.',
        correctAnswer: true,
        explanation:
          'The dealer charges for funding the exposure for as long as it is held.',
      },
      {
        id: 'cfd-q4',
        question: 'A CFD holder receives voting rights in the underlying company.',
        correctAnswer: false,
        explanation:
          'There is no ownership of shares, so no shareholder rights come with it.',
      },
      {
        id: 'cfd-q5',
        question:
          'Losses on a leveraged CFD position are always limited to the margin posted.',
        correctAnswer: false,
        explanation:
          'Losses can exceed the initial margin, which is why many regulators restrict them.',
      },
    ],
  },
];
