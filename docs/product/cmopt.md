---
title: "Commodity Option"
description: "Cap or floor a commodity price"
permalink: /product/cmopt/
---

# Commodity Option

*Cap or floor a commodity price*

A commodity option gives its buyer the right, but never the obligation, to transact at a fixed strike price — a call to buy, a put to sell. That asymmetry is what a hedger pays for: unlike a swap or a forward, an option protects against the move that hurts while leaving the move that helps intact. The price of that one-sidedness is the premium, paid up front and gone whether or not the option is ever exercised.

[Open in the app](/OTC_Learn/) · [Commodity](/OTC_Learn/category/commodity/) · intermediate

## The lesson

### 1. What it is

A right to buy (call) or sell (put) a commodity at a strike price by expiry, often cash-settled against a reference price rather than physically delivered. The buyer chooses whether to use it; the seller has no choice and must perform if it is exercised.

### 2. How it works

At expiry the reference price is compared with the strike, and if the option is in the money the seller pays the difference on the contract volume. Many commodity options are Asian-style, settling against an average price over a period instead of a single date, which matches a hedger that buys or sells its physical commodity steadily through the month.

> Averaging reduces the volatility of the settlement price, so an Asian option is normally cheaper than an otherwise identical option settling on a single date.

### 3. Why it’s used

A call caps a consumer’s purchase cost; a put protects a producer’s selling price — both while preserving upside if prices move favourably. Because the premium can be uncomfortable, hedgers often fund it: a consumer buys the call it wants and sells a put below the market, so the two premiums roughly offset. That zero-cost collar keeps the cap but gives back the benefit of a large fall.

> A collar is not free. The premium is paid in optionality rather than cash — the consumer that sells a put has agreed to buy at that floor no matter how far the market drops below it.

### 4. Key terms

Strike, premium, underlying reference price, and expiry — the buyer’s maximum loss is always the premium paid. Contract volume sets how much the payoff is multiplied by.

> Premium is quoted per unit of volume and paid up front: $2.50 a barrel on 100,000 barrels is $250,000, payable whether or not the option ever pays out.

### 5. Risks to watch

Premiums can be steep for volatile commodities, and the whole premium is lost if the option expires worthless. Basis risk remains between the reference index and the physical grade actually bought or sold, and sellers face heavy losses if prices gap sharply — a sold call has no ceiling on what it can cost.

## A haulier caps its diesel cost

- A haulage firm buys 20,000 barrels of diesel a month and wants protection above $100 a barrel.
- It buys an Asian call struck at $100.00 for a premium of $4.00 a barrel: 20,000 × $4 = $80,000 paid up front.
- The index averages $112.00, so the option pays (112 − 100) × 20,000 = $240,000.
- The physical diesel costs 20,000 × $112 = $2,240,000, less the $240,000 payout, less nothing else: $2,000,000.
- Adding the premium already spent gives $2,080,000 in total, or $104.00 a barrel.

**The effective cost is capped at the strike plus the premium — $104 — no matter how high the index goes. Had the average come in at $95 the option would have expired worthless, and the firm would have paid $95 + $4 = $99, still better than the cap.**

## Key terms

- **Strike** — The price at which the option may be exercised, fixed when the trade is agreed.
- **Premium** — The up-front price of the option, quoted per unit of volume and kept by the seller whatever happens.
- **Call** — The right to buy at the strike, which caps what a consumer effectively pays for the commodity.
- **Put** — The right to sell at the strike, which puts a floor under what a producer effectively receives.
- **Asian settlement** — Settlement against the average of the reference price over a period rather than its level on one date.
- **Contract volume** — The quantity the per-unit payoff is multiplied by to give the cash amount actually paid.

## In practice

Airlines and hauliers buy calls when they want a budget ceiling without forfeiting the windfall of a price collapse, and oil producers buy puts to guarantee a minimum realised price to lenders financing a field. Banks and trading houses write the other side and hedge the resulting exposure dynamically in futures.

## Read next

- [Commodity Swap](/OTC_Learn/product/cmswap/) — Fixed price for floating market price
- [Cap and Floor](/OTC_Learn/product/capfloor/) — Set a ceiling or floor on a floating rate
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option

The app adds a twelve-question bank for Commodity Option, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Commodity Option — Average price options are the default, Options on what, exactly, Volatility with a season in it — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
