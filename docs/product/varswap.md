---
title: "Variance Swap"
description: "Trade realized volatility directly"
permalink: /product/varswap/
---

# Variance Swap

*Trade realized volatility directly*

A variance swap turns volatility itself into something you can buy and sell. It settles once, at maturity, on the difference between the variance a stock or index actually realises and a strike agreed at the outset. The strike is quoted as a volatility number — 20, say — but the contract settles on that number squared, and that squaring is what gives the payoff its distinctive shape.

[Open in the app](/OTC_Learn/) · [Equity](/OTC_Learn/category/equity/) · advanced

## The lesson

### 1. What it is

A variance swap pays the difference between the variance a stock or index actually realises over the life of the contract and a variance strike agreed at the outset. It isolates volatility as something tradable in its own right. The strike is quoted in volatility points for readability — a strike of 20 means a variance strike of 400 — and despite the name nothing is exchanged along the way: there is a single cash settlement at maturity.

### 2. How it works

At maturity, realised variance is calculated from daily returns and compared with the variance strike. The payoff is that difference multiplied by a variance notional, so the buyer profits whenever realised volatility comes in above the strike — whether prices rose or fell. Because quoting a payoff per variance point is unintuitive, trades are sized in vega notional, the payoff per volatility point at the strike; the variance notional is the vega notional divided by twice the strike.

> Realised variance is normally computed from closing prices, with the mean return assumed to be zero and the daily figures annualised using 252 trading days.

### 3. Why it’s used

Portfolios tend to lose money precisely when markets get turbulent, so being long variance acts as a hedge against turmoil. It also lets traders express a pure view on volatility without the constant delta-hedging an option position would demand. Dispersion desks use it in pairs — selling variance on an index while buying it on the index members — which is a trade on how closely the constituents move together rather than on volatility alone.

### 4. Key terms

Realised variance, the variance strike, vega notional (the payoff per volatility point), the variance notional the settlement is actually multiplied by, the observation period, and the cap that most contracts apply to limit the payoff in an extreme crash.

> Single-stock variance swaps are typically capped at 2.5 times the strike — on a strike of 20 that caps settlement as though realised volatility stopped at 50 — while index variance is more often left uncapped.

### 5. Risks to watch

The payoff is linear in variance, which makes it convex in volatility: a seller’s losses grow disproportionately as volatility spikes, and sellers were badly hurt in 2008 and again in early 2020. Buyers pay for that protection through a strike typically set above expected volatility. Because returns are squared, a handful of violent days can dominate the whole observation period, and the option portfolio a dealer uses to hedge assumes prices move smoothly — a gap leaves that hedge short of the payoff it owes.

> One 10% daily move contributes 100 variance points to a 252-day observation period on its own — the same contribution as a full year realising 10% volatility.

## Five points either side of the strike

- A fund buys variance on an index at a strike of 20, sized at $100,000 of vega notional.
- The variance notional is the vega notional divided by twice the strike: $100,000 ÷ 40 = $2,500 per variance point.
- Realised volatility comes in at 25, so the payoff is $2,500 × (25² − 20²) = $2,500 × 225 = $562,500.
- Had realised volatility come in at 15, the payoff would be $2,500 × (15² − 20²) = −$437,500.
- Both outcomes are five volatility points from the strike, yet the gain exceeds the loss by $125,000.

**The payoff is a straight line in variance and a curve in volatility. That convexity is why a buyer will accept a strike above the volatility they actually expect, and why a seller’s losses accelerate rather than scale as volatility climbs.**

## Key terms

- **Realised variance** — The annualised average of squared daily returns actually observed over the contract’s life.
- **Variance strike** — The level settlement is measured against — the square of the volatility number the trade is quoted at.
- **Variance notional** — The cash amount paid per point of difference between realised variance and the strike.
- **Vega notional** — The approximate payoff per volatility point at the strike, equal to twice the strike times the variance notional.
- **Observation period** — The run of trading days whose daily returns feed the realised variance calculation.
- **Cap** — A ceiling on the realised volatility used at settlement, limiting how much a seller can lose.

## In practice

Bank volatility desks, which often end up structurally short volatility from selling structured products to retail investors, buy index variance to offset that exposure. On the other side are hedge funds trading the gap between implied and realised volatility, running dispersion between an index and its constituents, or holding index variance as a hedge that pays when an equity book is losing.

## Read next

- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option
- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap
- [FX Option](/OTC_Learn/product/fxopt/) — The right to exchange currency at a strike

The app adds a twelve-question bank for Variance Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Variance Swap — Why variance and not volatility, The replicating strip, and where it fails, Caps, and what they admit — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
