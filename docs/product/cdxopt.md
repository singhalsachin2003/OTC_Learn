---
title: "Credit Index Option"
description: "An option on a credit index spread"
permalink: /product/cdxopt/
---

# Credit Index Option

*An option on a credit index spread*

An option whose underlying is a credit index and whose strike is a spread rather than a price, a rate or an exchange rate. The buyer of a payer acquires the right to buy protection at an agreed spread on a fixed date; the buyer of a receiver acquires the right to sell it. The naming is borrowed from interest-rate swap options and runs against equity intuition — the payer is the bearish position — and the payoff carries a mechanism found nowhere else: if a name in the index defaults before expiry, the loss travels into the option rather than being lost with it. This is where credit volatility itself is bought and sold, and the standard way a large book buys a convex hedge against a credit selloff.

[Open in the app](/OTC_Learn/) · [Credit](/OTC_Learn/category/credit/) · advanced

## The lesson

### 1. What it is

A credit index option is the right, but not the obligation, to enter a credit index swap at an agreed spread on a fixed future date. The strike is a spread level in basis points, and the option is European — the decision is made once, at expiry. A payer option is the right to buy protection at the strike, so it gains as spreads widen; a receiver option is the right to sell protection at the strike, so it gains as spreads tighten.

> Payer and receiver are inherited from swaptions and describe the premium leg: the payer holder pays it, which makes the payer the bearish credit position. That is the opposite way round to a call in equity, and it is the most common mistake with these contracts.

### 2. How it works

The buyer pays a premium upfront, quoted in basis points of the notional, and at expiry compares the index spread with the strike. Exercise delivers a position in the underlying index swap struck at that spread rather than a cash difference. The payoff is not simply the spread gap: a basis point of spread is worth a basis point a year for the remaining life of the index, so the gap is multiplied by the index’s risky annuity before it becomes cash. Front-end protection is the piece with no analogue elsewhere in the market. If a constituent suffers a credit event between trade date and expiry, that name’s loss is carried into the payer’s payoff, collected by exercising, so the option does not simply become worthless because a name in the index has defaulted — and a payer can be worth exercising even when the index has finished inside the strike.

> Forty basis points in the money on a five-year index is worth about 40 × 4.5 = 180 basis points of notional, not 40. The annuity is what converts a spread into cash, and it is the step most often skipped.

### 3. Why it’s used

Options are how credit volatility is traded as a quantity in its own right, apart from the direction of spreads. The most common use is a macro tail hedge: buying payers on an investment-grade index is a cheap, convex way to be protected against a credit selloff, because the loss is capped at the premium while the payoff keeps growing as spreads gap — a payer gains more from a 60bp widening than twice what it gains from a 30bp one. Desks sell receivers to monetise a view that spreads will not tighten further, and buy payer spreads rather than outright payers to cheapen a hedge by giving up the far tail. Payers routinely trade at a higher implied volatility than receivers the same distance from the money, because spreads grind tighter and gap wider, and the skew prices that asymmetry.

### 4. Key terms

Strike spread, payer and receiver, expiry, premium, front-end protection, and implied spread volatility. An option references one specific index series rather than whichever series happens to be on the run, so after a roll it still exercises into the series it was struck on, which by then can be materially less liquid. Delta is expressed as an equivalent index notional, and most trades are struck with a delta exchange so the buyer starts flat on direction and long volatility alone.

> Expiries are monthly and almost all of the liquidity sits in the first three. Quoting is concentrated on the main indices — CDX.NA.IG, CDX.NA.HY, iTraxx Europe Main and Crossover — with single-name credit options traded far more thinly.

### 5. Risks to watch

The premium on a payer is lost in full if spreads do not widen past the strike, and a hedge rolled every quarter bleeds a great deal across a calm year. Selling options hands that convexity away: the seller collects a capped premium and takes an open-ended loss in precisely the scenario the rest of the book is also suffering. Liquidity sits in a handful of strikes and expiries on a few indices, so an unusual strike or an off-the-run series can be expensive to unwind. And it remains an index hedge — it responds to the index, not to the particular bonds held, so the payoff can fall well short of the portfolio’s loss.

## A payer that pays twice — once on spread, once on a default

- A fund buys $100m of a three-month payer on a 125-name investment-grade index, struck at 70bp.
- The premium is 20bp of notional, or $200,000, paid upfront.
- In the first scenario the index is at 110bp at expiry, 40bp through the strike.
- With a risky annuity of about 4.5, that is worth 40 × 4.5 = 180bp of notional, or $1.8m — a net $1.6m.
- In the second scenario the index finishes at 68bp, inside the strike, but one name has defaulted at an auction price of 20.
- That name is $800,000 of the notional, so front-end protection is 80% × $800,000 = $640,000.
- Exercising also enters the index at 70bp against a market of 68bp, costing about 9bp on the surviving $99.2m, or $89,000.

**The second scenario still returns $640,000 − $89,000 = $551,000 against a $200,000 premium, even though the index finished inside the strike. Without front-end protection the option would have expired worthless, which is why a credit payer is not simply a put on the index level.**

## Key terms

- **Payer option** — The right to buy protection on the index at the strike spread, which gains value as spreads widen.
- **Receiver option** — The right to sell protection on the index at the strike spread, which gains value as spreads tighten.
- **Strike spread** — The spread level, in basis points, at which the holder may enter the underlying index swap on exercise.
- **Front-end protection** — Compensation carried into a payer’s payoff for credit events occurring between trade date and expiry.
- **Risky annuity** — The duration-like factor that converts one basis point of index spread into an amount of cash.
- **Delta exchange** — The offsetting index position traded alongside the option so the buyer starts without a directional view.

## In practice

Macro funds and multi-asset managers buy payers on CDX.NA.IG or iTraxx Europe Main as a tail hedge, because a few basis points of premium buys a payoff that grows as spreads gap — cheaper to carry through a long calm stretch than holding index protection outright. Pension funds and insurers with large corporate bond books do the same ahead of events they cannot trade around. On the other side, dealers and volatility funds sell options to earn the premium and hedge the delta with the underlying index, and relative-value desks trade the payer skew against realised spread volatility.

## Read next

- [CDX Index](/OTC_Learn/product/cdx/) — A basket of CDS in one tradable index
- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap
- [Variance Swap](/OTC_Learn/product/varswap/) — Trade realized volatility directly

The app adds a twelve-question bank for Credit Index Option, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
