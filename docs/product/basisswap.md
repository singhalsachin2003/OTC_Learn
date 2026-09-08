---
title: "Basis Swap"
description: "Swap one floating index for another"
permalink: /product/basisswap/
---

# Basis Swap

*Swap one floating index for another*

The first swap here with no fixed leg at all. Both sides pay a floating index on the same notional in the same currency — SOFR against the effective federal funds rate, or compounded SOFR against three-month Term SOFR — and the price is not a rate but a spread in basis points added to one of the legs. The structure carries the lesson: "the floating rate" is plural, the curves for different indices do not move together, and the gap between them is itself something that trades.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · intermediate

## The lesson

### 1. What it is

A basis swap exchanges one floating index for another on the same notional, in the same currency, for an agreed term. Neither leg is fixed. Because both legs rise and fall with the level of rates, the trade expresses almost no view on where rates go; what it isolates is the difference between two indices that are often treated as interchangeable and are not.

> Every other swap in this catalogue has a fixed side to quote. A basis swap is quoted as a spread in basis points, and that spread is the price — a position struck at three basis points can be closed out at seven.

### 2. How it’s quoted

The spread goes on whichever leg would otherwise be worth less, sized so that the two legs are worth the same on the trade date: a basis swap starts at zero value, like any other swap. A quote of the form "SOFR flat against fed funds plus four" means one party pays compounded SOFR and receives the effective federal funds rate plus four basis points on the same notional. The two legs need not share a schedule — a daily compounded leg against a quarterly term leg has to be aligned in the confirmation before anything can be netted. Duration is close to nil, so a 50 basis point shift in the whole curve barely moves the trade while a one basis point move in the spread moves it directly.

### 3. Why it’s used

Banks and lenders are the natural users, because their assets and their funding rarely reference the same index. A US bank whose loan book pays three-month Term SOFR but whose notes cost compounded SOFR earns a margin that widens and narrows with the gap between the two — a risk it never chose to run. A basis swap fixes that margin without taking any position on the level of rates. Dealers also use basis swaps to shift a legacy book from one benchmark onto another, which is how a great deal of the LIBOR transition was actually executed.

> The ARRC’s best practice recommendation limits Term SOFR derivatives to end users hedging cash exposures that already reference Term SOFR, so this particular basis is not traded between dealers as freely as an ordinary SOFR swap.

### 4. What moves the spread

Two indices differ because they measure different things. SOFR is secured on US Treasuries, so it answers to the supply of collateral and cash; the effective federal funds rate is unsecured, so it carries a view on the institutions doing the borrowing. Tenor is the other axis: a forward-looking term rate prices what the market expects overnight rates to do, while a compounded overnight rate records what they actually did, so the two agree only if the path turns out as expected. The clearest historical case is the LIBOR–OIS spread, which measured the cost of unsecured bank funding and widened sharply in 2008 and again in March 2020 while the overnight rate itself barely moved.

> A repo rate can spike over a quarter-end or a year-end when dealer balance sheets are constrained, with no change in the policy rate at all. That is a move in the basis rather than in rates, and it is exactly what this product is exposed to.

### 5. Risks to watch

The spread is small but it is not stable, and it tends to move most under funding stress, which is when a bank can least afford the mark. A hedge also only works where the schedules match: a basis swap resetting quarterly against a loan book that resets monthly leaves a residual on every date the two disagree. The idea reaches further than the product does. Exchanging floating legs in two different currencies gives the cross-currency basis, priced in the FX swap market; and within a single currency, the recognition that the curve used to project a floating leg is not the curve used to discount its cash flows — projection follows the index, discounting follows the collateral agreement — is the same observation written into the valuation, a separation the market made after 2008 and has kept.

## A bank locks its lending margin

- A bank holds $500m of corporate loans paying three-month Term SOFR + 2.00%, reset quarterly.
- It funds them with notes paying daily compounded SOFR + 0.60%, so the 1.40% gap between the two margins is not actually locked.
- It enters a three-year basis swap on $500m: it pays three-month Term SOFR and receives compounded SOFR plus 2 basis points.
- In one 92-day quarter Term SOFR sets at 4.10% while compounded SOFR realises 4.02%, so the swap costs 6 basis points — $76,667 on ACT/360.
- The margin is 6.10% earned less 4.62% paid less that 6 basis points: 1.42%, and 1.42% again in a quarter where the two indices differ by 3 basis points instead of 8.

**Neither leg is fixed and nothing here turns on the level of rates — all the swap locks is the 2 basis point spread between two indices. Without it the bank’s margin would drift, in either direction, with a basis it never chose to take a view on.**

## Key terms

- **Basis spread** — The basis points added to one floating leg so both legs are worth the same at inception, and the price at which the swap trades.
- **SOFR** — The Secured Overnight Financing Rate, an overnight rate derived from US Treasury repo transactions and published by the New York Fed.
- **Effective federal funds rate** — The volume-weighted median rate on overnight unsecured borrowing in the US federal funds market, also published by the New York Fed.
- **Term SOFR** — A forward-looking rate for a period such as three months, derived from SOFR derivatives and therefore known at the start of the period.
- **Tenor basis** — The spread between two floating legs referencing the same benchmark over different periods, such as one month against three months.
- **Projection curve** — The curve used to forecast a floating leg’s future settings, kept separate from the discount curve applied to the resulting cash flows.

## In practice

US regional banks are the archetypal user: their loan documentation references Term SOFR while their bonds and hedges reference compounded SOFR, and a basis swap is what keeps the margin between them intact. Bank treasuries and short-end rates desks trade the SOFR against fed funds basis to line a portfolio up with the index their own liabilities actually pay, and dealers run a basis book because every index needs a curve of its own.

## Read next

- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Forward Rate Agreement](/OTC_Learn/product/fra/) — Lock a rate for one future period
- [FX Swap](/OTC_Learn/product/fxswap/) — Exchange currencies now and reverse it later

The app adds a twelve-question bank for Basis Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Basis Swap — What a tenor basis prices, The cross-currency version, After LIBOR — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
