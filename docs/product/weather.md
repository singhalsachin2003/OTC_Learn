---
title: "Weather Swap"
description: "A payout driven by temperature, not price"
permalink: /product/weather/
---

# Weather Swap

*A payout driven by temperature, not price*

A weather swap settles against the weather itself — a count of heating or cooling degree days accumulated at a named weather station over a season, compared with an agreed strike. There is nothing to buy, sell short, store or deliver, so no cost of carry links its price to anything and no portfolio replicates its payout. It exists because a great deal of commercial risk is about how much you sell rather than what you sell it for: a mild winter costs a gas utility volume, not price, and nothing else in this catalogue addresses that.

[Open in the app](/OTC_Learn/) · [Commodity](/OTC_Learn/category/commodity/) · foundational

## The lesson

### 1. What it is

A weather swap pays against a measured weather index rather than a price. For temperature the index is a count of degree days — a running total of how far the daily average temperature at one named station sits below a base temperature (heating degree days) or above it (cooling degree days), added up across a month or a season. Nothing underlies it in the usual sense: temperature cannot be bought, sold short, stored or delivered, so the contract is simply an agreement to exchange cash on a number the weather will produce.

> In the United States the base is 65°F and the day’s average is the midpoint of its high and low, so a day averaging 40°F contributes 25 heating degree days and a day averaging 70°F contributes none. European contracts commonly use an 18°C base.

### 2. How it works

The two sides agree a strike in degree days, a tick value in currency per degree day, and which way round they sit. At the end of the accumulation period the index is compared with the strike and the difference is multiplied by the tick, so a swap struck at 3,800 that settles at 3,460 pays 340 ticks to whichever side was protected against mild weather. Almost every contract carries a cap on the total payout, which means both sides know their worst case on the day they trade. The same index is also traded in option form, where only one side can ever be paid and a premium is paid up front.

> Contracts name the station, the meteorological service that publishes the data and often a settlement agent that calculates the index. Because observations are sometimes corrected weeks after publication, the terms have to say whether the original or the restated figure governs, and which back-up station applies if the named one stops reporting.

### 3. Why it’s used

An energy utility’s problem in a mild winter is not that gas is cheap. It is that it sells less of it — the customers are still there, but the boilers run for fewer hours, and margin on volume never burned cannot be recovered. That is volumetric risk: quantity rather than price. A hedge on the gas price does nothing about it and can make the picture worse, because mild weather tends to depress the price as well, so a firm hedged only on price watches both halves of its margin fall together. The same shape appears outside energy, in a brewer’s cool summer or a ski operator’s warm January. A weather swap sits close to insurance, with one difference that matters: the payout is triggered by the index alone, with no claim to file and no damage to prove — which is also why the payout may not match the loss.

### 4. Key terms

Five things define the contract — the reference station, the accumulation period, the degree day index, the strike and the tick value that turns each degree day into money — with a payout cap to bound it. None of them follows from an arbitrage. There is no tradable portfolio that reproduces the payout, so the replication argument that prices a forward or a swap is simply unavailable here, and what sets the price instead is a distribution: the seller forms a view of the mean and spread of the index at that station and charges the expected payout plus a margin for risk it cannot hedge away.

> Pricing usually starts with a burn analysis — replaying the proposed contract over twenty to forty years of cleaned station history and averaging what it would have paid. The series is detrended first for warming and urban growth, which for a winter contract normally pulls the expected index below the raw historical mean.

### 5. Risks to watch

The cover is only ever a proxy. The station is not the service area and degree days are not demand: wind, humidity, the timing of a cold snap and the customers gained or lost since the tick value was estimated all drive a wedge between the payout and the actual loss. The cap means a genuinely extreme season is only partly covered. The contract also does nothing about price, so a firm that has hedged volume still needs a separate hedge for what it pays. Liquidity is thin outside the standard city indices and seasons, with few dealers quoting, so a position is usually carried to settlement rather than traded out.

## A gas utility hedges a mild winter

- A gas utility budgets on a normal winter of 3,800 heating degree days at the station named in its contract.
- Its own records show it sells about 50,000 therms for each degree day at a delivery margin of $0.30 a therm — roughly $15,000 of margin per degree day.
- It buys a winter swap struck at 3,800 with a tick of $15,000 a degree day, capped at $9,000,000.
- The winter is mild and the station accumulates 3,460 degree days, 340 below the strike.
- Volumes fall by 340 × 50,000 = 17,000,000 therms, costing 17,000,000 × $0.30 = $5,100,000 of margin.
- The swap pays 340 × $15,000 = $5,100,000, comfortably inside the cap.

**Not one line of that arithmetic involved the price of gas. The utility’s loss was quantity, and the only contract that could refund it was one written on the temperature. Had the winter been cold the utility would have sold more gas and paid the swap instead, up to the $9,000,000 cap — 600 degree days at $15,000 — which is the most either side can lose.**

## Key terms

- **Heating degree day** — One unit for each degree the day’s average temperature falls below the base, and none at all for a day above it.
- **Cooling degree day** — The mirror image, counting degrees above the base, used for contracts written on summer cooling demand.
- **Reference station** — The named weather station whose published observations settle the contract, standing in for a whole region.
- **Tick value** — The cash amount attached to each degree day of difference between the settlement index and the strike.
- **Payout cap** — The agreed limit on the total either side can be asked to pay, fixed when the contract is written.
- **Volumetric risk** — Exposure to how much you sell rather than the price you sell it for, which a price hedge leaves untouched.

## In practice

Gas and power utilities and energy retailers are the natural buyers, hedging the volume they will sell rather than the price they will pay, while brewers, agricultural processors, ski operators and event promoters buy smaller and more bespoke structures. Reinsurers, specialist weather funds and a few energy trading houses take the other side, precisely because temperature risk has almost no correlation with equity or credit markets. The market began in the US power sector in the late 1990s, and although the CME lists standardised heating and cooling degree day futures on a set of cities, most weather risk still changes hands over-the-counter in bespoke periods and sizes.

## Read next

- [Commodity Swap](/OTC_Learn/product/cmswap/) — Fixed price for floating market price
- [Swing Option](/OTC_Learn/product/swing/) — The right to choose how much you take
- [Variance Swap](/OTC_Learn/product/varswap/) — Trade realized volatility directly

The app adds a twelve-question bank for Weather Swap, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
