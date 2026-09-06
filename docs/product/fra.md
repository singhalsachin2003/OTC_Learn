---
title: "Forward Rate Agreement"
description: "Lock a rate for one future period"
permalink: /product/fra/
---

# Forward Rate Agreement

*Lock a rate for one future period*

The simplest way to fix a rate for one future window. Two parties agree today what the interest rate will be on a notional amount over a period that starts later, and at fixing they settle the difference between that agreed rate and whatever the market rate turns out to be. Nothing is borrowed and nothing is lent — the FRA sits alongside a real loan or deposit and neutralises the rate on it for that one period.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · intermediate

## The lesson

### 1. What it is

A forward rate agreement fixes the interest rate on a notional deposit or loan for one specified future period. A "3x6" FRA covers a three-month period that begins three months from today. Both sides are committed from the moment the trade is struck: unlike an option, there is no choice to walk away at fixing.

> The gap between the two figures is the length of the period covered: 6 − 3 = 3 months for a 3x6, and 7 − 1 = 6 months for a 1x7.

### 2. How it works

On the fixing date the reference rate is compared with the agreed FRA rate, and the difference on the notional is settled as a single cash payment. No money is actually lent, and because settlement happens at the start of the period the amount is discounted back.

> Settlement = (reference rate − contract rate) × notional × days/basis, divided by (1 + reference rate × days/basis). The discount factor uses the reference rate that has just fixed.

### 3. Why it’s used

Borrowers lock in a future funding cost, lenders lock in a future return, and traders take a view on one point of the rate curve. An FRA is effectively a swap with a single period. The classic contract referenced a term rate published at the start of the period; since LIBOR was retired, much of that single-period risk is now expressed through short-term interest rate futures or a one-period overnight-index swap on SOFR, SONIA or €STR instead.

### 4. Key terms

The "3x6" style notation, notional, contract rate, reference rate, fixing date and settlement date define the trade. The buyer of an FRA is the notional borrower and gains when rates rise; the seller is the notional lender and gains when they fall.

> Day count follows the money market of the currency: ACT/360 for US dollars and euros, ACT/365 for sterling.

### 5. Risks to watch

Only one period is covered, so hedging a rolling exposure needs a strip of FRAs or a swap instead. The payoff is linear, meaning a favourable rate move costs exactly as much as an adverse one saves, and the contract carries counterparty risk until settlement.

## A borrower locks a three-month rate

- A company knows it will borrow $50m for three months, starting three months from now.
- It buys a 3x6 FRA on $50m at 4.00%, making it the notional borrower.
- At fixing the reference rate sets at 4.60%, 0.60% above the contract rate.
- The interest difference over the 91-day period is $50m × 0.60% × 91/360 = $75,833.
- Settling at the start of the period discounts it: $75,833 ÷ (1 + 4.60% × 91/360) = $74,962.

**The company still pays 4.60% on its actual loan, but the $74,962 received up front is worth $75,833 by the date that interest falls due if held at the same 4.60%. Net, it has borrowed at the 4.00% it fixed.**

## Key terms

- **FRA notation** — The "3x6" form, giving the months from now to the start and to the end of the period covered.
- **Contract rate** — The rate agreed on the trade date, against which the reference rate is compared at fixing.
- **Fixing date** — The day the reference rate is observed and the settlement amount is calculated.
- **Buyer** — The side that is the notional borrower, and so gains when the reference rate fixes above the contract rate.
- **Discounted settlement** — The convention of paying the interest difference at the start of the period, reduced to its present value.
- **Strip of FRAs** — A run of FRAs covering consecutive periods, used where a single contract would leave later periods unhedged.

## In practice

Bank treasury and asset–liability desks use FRAs to square a known funding gap — a deposit maturing in three months against a loan that runs for six — and corporate treasurers use them when the date and size of a future drawdown are already fixed. Rate traders use them to take a view on a single point of the curve rather than on its whole shape.

## Read next

- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Cap and Floor](/OTC_Learn/product/capfloor/) — Set a ceiling or floor on a floating rate
- [FX Forward](/OTC_Learn/product/fxfwd/) — Lock in a future exchange rate

The app adds a twelve-question bank for Forward Rate Agreement, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
