---
title: "Inflation Swap"
description: "Swap a fixed rate for realised inflation"
permalink: /product/infswap/
---

# Inflation Swap

*Swap a fixed rate for realised inflation*

The one product here whose underlying is a government statistic rather than a market price. One party pays a fixed rate agreed today, the other pays whatever a published price index — UK RPI, euro HICP excluding tobacco, US CPI — actually turns out to have done. That fixed rate is therefore a price for inflation itself, and the standard version settles the whole thing in a single payment at maturity rather than netting period by period, which makes it behave quite unlike the swaps that come before it.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · intermediate

## The lesson

### 1. What it is

One party pays a fixed rate and the other pays the realised change in a published price index, on a notional that is never exchanged. The index is the underlying: UK RPI, euro HICP excluding tobacco, or US CPI. Nothing in the contract references a borrowing rate at all, so an inflation swap prices something no other swap in this catalogue touches.

> The index is a statistic, not a quote. The Office for National Statistics compiles UK RPI once a month and publishes it a few weeks after the month it measures, and it is that published figure — not a dealer price — that decides what the swap pays.

### 2. How it settles

The standard form is zero-coupon: nothing changes hands until maturity, when a single netted payment is made. The inflation leg owes the notional times the index ratio less one, or I(T) ÷ I(0) − 1; the fixed leg owes the notional times (1 + r)^T − 1, the fixed rate compounded over the same years. A year-on-year inflation swap does pay on a schedule, exchanging each year’s change in the index against a fixed rate, but the zero-coupon version is the one that trades in size.

> The fixed leg compounds — it is not the rate multiplied by the years. Ten years at 3.20% is (1.032)^10 − 1 = 37.02% of notional, against 32.0% if the rate were simply added up.

### 3. Why it’s used

A defined benefit pension scheme owes payments that rise with an inflation index, so it receives inflation and pays fixed, turning an unknown liability into a known one. That trade is the core of liability-driven investment and the reason a large share of pension flow reaches a rates desk at all. Natural payers are scarcer: utilities and infrastructure operators whose regulated revenues are index-linked, and governments issuing index-linked bonds. The fixed rate is worth reading in its own right, because it is the breakeven — the average annual inflation that would make both legs settle at the same number. Anyone who thinks inflation will beat it can receive inflation as a view rather than as a hedge.

> The same breakeven can be read off the bond market, as the gap between a nominal gilt yield and the real yield on an index-linked gilt of the same maturity. It is not a pure forecast: it also carries an inflation risk premium, and in the UK a persistent demand from pension schemes to receive inflation with few natural payers opposite them.

### 4. Lag and seasonality

A swap cannot reference the index for the month it matures in, because that figure does not exist yet. Convention applies a lag — two months on a standard UK RPI swap — so a trade maturing in November settles on the September index, which the ONS published in October. Part of the payoff is already a public number before the trade ends. Seasonality is the second wrinkle: prices follow a repeating pattern within the calendar year, so the level of the index depends on which month is being read. Where a swap starts and matures in the same calendar month the seasonal component largely cancels, because both ends of the index ratio sit at the same point of the cycle; on a short-dated or broken-dated trade it does not, and the curve has to be fitted with an explicit seasonal adjustment.

> UK pension increases are usually capped and floored rather than uncapped — "LPI (0,5)" rises with RPI but by no more than 5% and no less than 0% in a year. A plain inflation swap does not reproduce that shape; matching it needs inflation caps and floors on top.

### 5. Risks to watch

The swap hedges one named index, and a liability linked to a different one leaves basis risk: a scheme paying CPI-linked benefits while receiving RPI on its swaps is exposed to the wedge between the two, and that wedge is not fixed — from February 2030 UK RPI is to be calculated on the CPIH methodology, which is expected to close most of it. A zero-coupon swap also pays nothing for years while being marked to market throughout, so a hedge with no cash flow until 2040 still consumes collateral today. And the lag cuts both ways: in the closing months of a trade there is very little inflation risk left to hedge, because the figure that settles it has already been published.

> In autumn 2022 UK schemes running leveraged liability hedges faced collateral calls large enough that the Bank of England intervened in the gilt market. Nothing about the hedges had failed; they simply needed cash long before they were due to pay anything.

## A pension scheme hedges ten years of RPI

- A scheme has £50m of liabilities that rise with RPI over the next ten years.
- It enters a ten-year zero-coupon RPI swap on £50m, receiving inflation and paying 3.20% fixed.
- Nothing changes hands for ten years. At maturity the reference index has gone from 400.0 to 570.0.
- The inflation leg owes 570 ÷ 400 − 1 = 42.5% of £50m, or £21.25m.
- The fixed leg owes (1.032)^10 − 1 = 37.02% of £50m, or £18.51m, so the scheme receives the £2.74m difference.

**Realised inflation ran at about 3.6% a year against the 3.20% breakeven the market priced at the outset, and the swap paid the scheme the gap. Had it run at exactly 3.20% the index would have finished at 548.1 and the two legs would have cancelled — one payment, at the very end, or none at all.**

## Key terms

- **Zero-coupon inflation swap** — The standard form, which exchanges nothing until maturity and then settles the whole compounded difference in one payment.
- **Index ratio** — The final reference index divided by the initial one, which less one is what the inflation leg pays.
- **Breakeven inflation** — The fixed rate that makes both legs settle at the same amount, and so the market’s implied average inflation for that maturity.
- **Publication lag** — The fixed number of months between the index month a payment references and the payment date itself — two months on a standard UK RPI swap.
- **Seasonality** — The repeating within-year pattern in a price index, which largely cancels over whole years but must be modelled on short-dated and broken-dated trades.
- **Year-on-year inflation swap** — The periodic alternative, exchanging each year’s change in the index against a fixed rate on every payment date.

## In practice

UK defined benefit schemes and the liability-driven investment managers who run their hedges are the dominant receivers of inflation, because the benefits they owe are indexed by statute or by scheme rules. Opposite them sit utilities, rail and social housing operators whose revenues are index-linked by regulation or contract, and dealers warehousing what is left of the imbalance. Macro funds trade breakevens outright when they think the market’s implied inflation is wrong.

## Read next

- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Cap and Floor](/OTC_Learn/product/capfloor/) — Set a ceiling or floor on a floating rate
- [Commodity Swap](/OTC_Learn/product/cmswap/) — Fixed price for floating market price

The app adds a twelve-question bank for Inflation Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Inflation Swap — Breakeven and the risk premium, Lags and seasonality, Zero-coupon against year-on-year — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
