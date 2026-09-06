---
title: "Interest Rate Swap"
description: "Trade fixed for floating payments"
permalink: /product/irs/
---

# Interest Rate Swap

*Trade fixed for floating payments*

The workhorse of the OTC market. Two parties agree to exchange interest payments on an agreed notional amount — one leg fixed, the other floating — for an agreed term. Nothing is lent and nothing is borrowed; the swap simply changes the character of interest a party pays or receives, which is why a borrower with a floating loan can end up with the economics of a fixed one without renegotiating the loan.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · foundational

## The lesson

### 1. What it is

Two parties exchange interest payments on a notional principal — one pays a fixed rate, the other a floating rate (e.g. SOFR). The notional itself is never exchanged, only the interest.

> The interest rate swap market is the largest OTC derivatives market in the world, with hundreds of trillions of dollars in notional outstanding.

### 2. How it works

Each period has a floating rate that settles against the benchmark, and on each payment date the two legs are netted so only the difference changes hands. On a $100m swap paying 4% fixed against a floating leg that sets at 4.5%, the fixed payer receives 0.5% on the notional for that period.

> The reset fixes which rate applies to a period, but an overnight benchmark such as SOFR is compounded across that period, so the rate itself is only known once the period has run. Payment then follows a few business days later.

### 3. Why it’s used

Firms use swaps to convert floating-rate debt into fixed (or vice versa), hedging against rate moves, or to speculate on the direction of rates without borrowing directly. A treasurer who has borrowed floating but wants budget certainty pays fixed on a swap and keeps receiving floating, which offsets the loan.

### 4. Key terms

Notional, fixed rate, floating reference rate, tenor, and payment/reset frequency define every swap contract. The effective date sets when interest starts accruing, and the day count convention determines exactly how each payment is calculated.

> Day count matters more than it looks: 30/360 and ACT/360 on the same rate and notional produce different cash.

### 5. Risks to watch

The swap only hedges what it matches — a mismatch in dates or amounts leaves residual exposure. Value moves with rates, so an off-market swap creates mark-to-market swings and collateral calls, and each party carries credit risk on the other unless the trade is centrally cleared.

## A treasurer fixes a floating loan

- A company has borrowed $200m at SOFR + 1%, paid annually.
- It enters a 5-year swap: it pays 3% fixed and receives SOFR on the same $200m.
- In year one SOFR sets at 3.8%, so the loan costs 4.8% — $9.6m.
- On the swap it pays $6m fixed and receives $7.6m floating, a net receipt of $1.6m.
- Total cash out is $9.6m − $1.6m = $8m, which is 4% of $200m.

**Whatever SOFR does, the company pays 4% — the fixed swap rate plus its 1% credit spread. The floating leg of the swap cancels the floating cost of the loan.**

## Key terms

- **Notional** — The reference amount interest is calculated on. It is never exchanged in a standard swap.
- **Fixed leg** — The side paying a rate agreed at inception that does not change for the life of the trade.
- **Floating leg** — The side paying a rate that resets periodically against a published benchmark such as SOFR.
- **Reset date** — The date that starts a new calculation period and fixes which benchmark rate applies to it.
- **Tenor** — The total life of the swap, from effective date to maturity — commonly 2, 5 or 10 years.
- **Day count convention** — The rule converting an annual rate into the fraction actually owed for a period, such as ACT/360.

## In practice

Corporate treasurers use these to turn a floating bank loan into a predictable budget line, and pension funds use long-dated swaps to match the fixed liabilities they owe retirees. Most standardised swaps now clear through a central counterparty rather than settling bilaterally.

## Read next

- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap
- [Forward Rate Agreement](/OTC_Learn/product/fra/) — Lock a rate for one future period
- [FX Swap](/OTC_Learn/product/fxswap/) — Exchange currencies now and reverse it later

The app adds a twelve-question bank for Interest Rate Swap, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
