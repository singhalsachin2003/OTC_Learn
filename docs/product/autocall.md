---
title: "Autocallable Note"
description: "A coupon note that can retire itself early"
permalink: /product/autocall/
---

# Autocallable Note

*A coupon note that can retire itself early*

An autocallable note is the format that dominates retail and private-bank structured product issuance in Europe and much of Asia, and the clearest example of a payoff that depends on the path an underlying takes rather than on where it finishes. It looks at the underlying on a schedule of observation dates: above a trigger it pays a coupon and redeems itself early, and below a barrier at maturity it hands the investor the fall in the underlying. In between it simply gives the money back. The coupon looks generous next to a plain bond because it is not really interest — it is the premium on an option the investor has sold, paid in instalments.

[Open in the app](/OTC_Learn/) · [Equity](/OTC_Learn/category/equity/) · advanced

## The lesson

### 1. What it is

An autocallable note is debt issued by a bank whose repayment depends on the path of an equity underlying. On each scheduled observation date the underlying is compared with its level at the start: at or above the autocall trigger, the note redeems there and then, repaying principal with the coupon due. If that never happens, it runs to maturity, where principal comes back in full so long as the underlying has stayed above a downside barrier — and if it has not, the investor takes the fall in the underlying instead. The underlying is an index, a single share, or, most commonly, the worst performer of three or four of them.

> Autocallables are exotic by reputation rather than by volume: issuing and hedging them is the routine daily business of an equity derivatives desk in Europe and Asia, not a corner of it.

### 2. How it works

Observations are usually quarterly, semi-annual or annual, often after a non-call period of six or twelve months during which no early redemption can happen. The autocall trigger is typically the initial level, sometimes stepping down a little each year so that a call gets easier the longer the note runs. Many notes also carry a separate, lower coupon barrier: hold above that on an observation date and a coupon is paid even though the note does not call. At maturity, if the note never called, the barrier test decides everything — intact, and principal is repaid in full; breached, and on the usual design redemption is principal multiplied by the underlying’s final level over its initial level, so the loss is measured from the start, not from the barrier.

> A European barrier is tested only on the final valuation date; an American one is breached if the underlying trades through the level at any time in the note’s life. The same closing price at maturity can repay in full under one and take 40% under the other.

### 3. Why it’s used

Investors buy them for a coupon far above what the same bank pays on its senior debt, in exchange for accepting an equity loss they judge unlikely. That coupon is not yield: it is the premium on a put the investor has sold, delivered in instalments. Distributors like the format because every term is a dial — a higher coupon means a higher barrier, wider observation gaps, or a fourth underlying, and each turn of the dial hands more risk to the buyer. Dealers issue them because the risk that comes back is risk they can manage, but the volume of it shapes the market they hedge in: the desk is left long dividends, which it sells forward into the dividend swap market, and carrying long-dated volatility risk on the referenced index in sizes no other flow produces.

> A worst-of note pays more than one on a single index because every test runs on the weakest underlying, so the investor needs them all to hold up. The buyer is long correlation whether or not they would put it that way.

### 4. Key terms

The initial level is the reference everything else is measured against. Around it sit the observation schedule, the autocall trigger, the coupon barrier, the knock-in barrier and, on many notes, a memory feature that pays previously missed coupons once the coupon barrier is met again. The coupon barrier and the knock-in barrier are separate tests: an underlying can be too low to pay a coupon while the note is still on course to repay principal in full.

> A common European retail shape is a trigger at 100% of the initial level, a coupon barrier near 70%, a knock-in barrier near 60% observed only at maturity, quarterly observations, and a stated life of five or six years that rarely runs its course.

### 5. Risks to watch

The upside is capped at the coupon while the downside below the barrier is the underlying’s own loss in full, and the two are not symmetric in size or in when they arrive. Calls happen in strong markets, so the money comes back precisely when it is hardest to replace the terms, and the note survives in weak ones, leaving the investor holding equity risk exactly when they would rather not. The note is senior unsecured debt of the issuer, so the bank’s credit stands in front of every payoff. And barriers create gap risk on both sides: a small move through a level changes the redemption by a lot, which is what makes these hard to hedge near the barrier.

> Notes sold in Korea in 2021 on the Hang Seng China Enterprises Index matured through 2024 with the index down by more than half from its sale-year levels. They had never called and the barriers had gone, and regulators found realised losses averaging around half of principal — the note’s own mechanic, working exactly as designed.

## Three years, and three ways it can end

- An investor buys £100,000 of a three-year note on an index at 5,000, observed once a year.
- It pays 8% a year on call, calls at or above 5,000, and repays principal at maturity unless the index closes below 3,250 — 65% of the start.
- At the first observation the index is 4,600, so nothing is paid and the note runs on.
- At the second it is 5,100, above the trigger: the note redeems and pays £100,000 plus two years of coupon, £116,000 in all.
- Had it instead never called and finished at 3,000 — 60% of the start, through the barrier — it would have repaid 60% of principal, £60,000, with no coupon at all.

**The best case is fixed at 8% a year and tends to arrive early; the worst is the index’s own 40% loss, taken in full. The £16,000 was the premium on a put the investor sold without calling it that. A middling path — the index at 4,000 at maturity, down 20% but above the barrier — simply returns the £100,000, three years later and no richer.**

## Key terms

- **Observation date** — A scheduled date on which the underlying is compared with its initial level to decide whether the note calls or pays.
- **Autocall trigger** — The level at or above which the note redeems early on an observation date, usually the initial level.
- **Coupon barrier** — The lower level the underlying must hold on an observation date for a coupon to be paid without the note calling.
- **Knock-in barrier** — The downside level that, once breached, removes the protection on principal and exposes the investor to the fall.
- **Memory feature** — A term that pays previously missed coupons once the coupon barrier is met again on a later date.
- **Worst-of** — A basket convention under which every trigger and barrier test is run on the weakest of the underlyings.

## In practice

These are sold to private-bank and retail clients across France, Italy, Switzerland, Korea, Japan and Taiwan as an income substitute for someone who believes a major index will not fall by 40%. On the other side, issuing and hedging them is the core business of a bank’s equity derivatives desk, and the aggregate of that hedging is what keeps the far end of the dividend curve permanently on offer in the indices the notes reference.

## Read next

- [Dividend Swap](/OTC_Learn/product/divswap/) — Trade dividends without owning the shares
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option
- [Credit-Linked Note](/OTC_Learn/product/cln/) — A bond whose repayment depends on a credit event

The app adds a twelve-question bank for Autocallable Note, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Autocallable Note — What the issuer is left holding, The observation date effect, Worst-of, and the correlation inside it — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
