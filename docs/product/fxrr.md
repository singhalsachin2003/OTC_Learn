---
title: "Risk Reversal"
description: "Sell an option to fund the one you actually want"
permalink: /product/fxrr/
---

# Risk Reversal

*Sell an option to fund the one you actually want*

Every option in this catalogue has so far been priced as if volatility were one flat number. A risk reversal is where that stops being true. It is both a trading structure — buy one option and sell another, opposite type, same expiry, most often sized so the premiums roughly cancel — and the market’s standard way of quoting how lopsided volatility actually is: the implied vol of a call minus the implied vol of a put at the same delta. One instrument, two jobs, and both come from the same asymmetry.

[Open in the app](/OTC_Learn/) · [FX](/OTC_Learn/category/fx/) · intermediate

## The lesson

### 1. What it is

A risk reversal combines buying one option and selling another of the opposite type — a call against a put — on the same underlying and the same expiry, usually at strikes equidistant from the money in delta terms. As a hedge it is most often built so the premium received on the sold leg roughly offsets the premium paid on the bought one: a zero-cost collar. As a market quote, the same two-legged structure is how dealers state the shape of the volatility smile in a single number.

### 2. How it works

A risk reversal trades in two forms that share one mechanism. As a hedge, a corporate buys an option in the direction it needs protecting and sells one in the direction it is prepared to give up. As a quote, the risk reversal for a given delta and tenor is stated as the vol of the call minus the vol of the put at that delta: a positive 25-delta EUR/USD risk reversal means 25-delta EUR calls trade at a higher implied volatility than 25-delta EUR puts, and that single number is the market’s shorthand for which side of the distribution carries the fatter tail.

> Buying a risk reversal conventionally means buying the call and selling the put on the base currency — a bullish structure, financed in whole or in part by the premium received on the put.

### 3. Why it’s used

Corporate treasurers use a zero-cost collar to remove the premium cost of a vanilla option hedge, at the price of capping the upside a plain forward would already have given up in full. A risk reversal skewed the other way is a cheap way to buy convexity, giving up little premium for exposure to a large move. Desks and macro funds trade risk reversals as a pure view on skew, buying the side of the smile they think is underpriced without taking on a large outright directional position, and the quote itself is read as a barometer of hedging flow and positioning — a market persistently paying up for downside protection is signalling where the crowd’s fear actually sits.

> The same idea is familiar from equity markets, which trade with a persistent put skew reflecting demand for crash protection. FX skew is not fixed in one direction the way equity skew usually is — it can sit on either side, and which side depends on the pair and what is being hedged.

### 4. Key terms

The risk reversal quote, the zero-cost collar it funds, and the volatility skew it measures are the core of it. The 25-delta convention names a strike by its delta rather than its rate, so quotes stay comparable as spot moves, and premium financing is simply the mechanism — the premium collected on one leg pays for the other.

> The vol surface’s third standard point, alongside at-the-money vol and the risk reversal, is the butterfly — the average of the call and put vol at a given delta relative to the at-the-money level, which prices convexity rather than skew. Together the three let a whole smile be reconstructed from a handful of quoted points.

### 5. Risks to watch

The premium collected on the sold leg is not free money: it is compensation for an obligation that can turn deeply against the seller, and a corporate that sold a call to fund its put gives up every dollar of upside beyond the cap, not just the premium a vanilla option would have cost. “Zero-cost” describes the premium, not the risk — the position still carries the full open-ended exposure of the leg that was sold. And the skew itself moves: an event that suddenly raises demand for downside protection can shift the risk reversal sharply, marking an existing position long before either strike is ever tested.

## An exporter collars a euro receivable at no premium

- A US exporter expects €20,000,000 in three months and wants downside protection without paying premium.
- It buys a three-month EUR put / USD call struck at 1.0600 and sells a three-month EUR call / USD put struck at 1.1200, each priced at 130 pips on €20,000,000 — $260,000 either way, so the net premium is zero.
- If spot fixes at 1.0300, it exercises its put and sells €20m at 1.0600 for $21,200,000, against $20,600,000 at market — the floor is worth $600,000.
- If spot fixes at 1.0900, neither option is in the money and it simply sells €20m at market for $21,800,000.
- If spot fixes at 1.1500, the call it sold is exercised against it: it must sell €20m at 1.1200 for $21,840,000, against the $23,000,000 it would have received unhedged — the cap costs $1,160,000.

**The collar cost nothing upfront, but “zero-cost” describes the premium, not the risk: above 1.1200 the exporter hands back every dollar of upside beyond the cap. The floor and the cap were bought and sold in the same trade, and the price of one was exactly the price of the other.**

## Key terms

- **Risk reversal (quote)** — The implied volatility of a call minus the implied volatility of a put at the same delta and tenor — the market’s standard shorthand for which side of the distribution carries the fatter tail.
- **Zero-cost collar** — A risk reversal sized so the premium received on the sold option roughly offsets the premium paid on the bought one, for no net premium.
- **Volatility skew** — The pattern of implied volatility across different strikes, which a flat single-number vol does not capture and a risk reversal is the standard way to measure.
- **25-delta** — The market’s usual reference point away from at-the-money, naming a strike by its delta rather than its rate so quotes stay comparable as spot moves.
- **Premium financing** — Using the premium collected on the leg sold to fund some or all of the premium owed on the leg bought.
- **Delta** — How much an option’s value changes for a small move in the spot rate, and the number the market uses to pick which strike a quoted risk reversal refers to.

## In practice

Corporate treasuries are the largest natural users, collaring receivables and payables to strip the premium cost out of a hedging programme without a cash outlay. Hedge funds and real-money managers trade risk reversals outright to express a skew view or as a capital-efficient way to buy convexity around an event, and every FX options desk quotes and risk-manages the 25-delta risk reversal as one of the three standard points — alongside at-the-money vol and the butterfly — that define its volatility surface for a given tenor.

## Read next

- [FX Option](/OTC_Learn/product/fxopt/) — The right to exchange currency at a strike
- [FX Forward](/OTC_Learn/product/fxfwd/) — Lock in a future exchange rate
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option

The app adds a twelve-question bank for Risk Reversal, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
