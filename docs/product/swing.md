---
title: "Swing Option"
description: "The right to choose how much you take"
permalink: /product/swing/
---

# Swing Option

*The right to choose how much you take*

Every option so far has been a right to transact a fixed amount: the buyer chooses whether to deal, and the strike fixes the price. A swing option turns that around. The price is agreed at the outset and the quantity is what gets chosen, day by day, between a daily minimum and maximum and within overall limits for the year. Those overall limits are the whole lesson — the daily rights share one budget, so flexibility spent today is gone tomorrow, and the annual minimum is not a right at all but an obligation to pay.

[Open in the app](/OTC_Learn/) · [Commodity](/OTC_Learn/category/commodity/) · advanced

## The lesson

### 1. What it is

A swing option — the market usually says swing contract, or take-or-pay contract — gives its buyer the right to vary how much it takes each day at a price fixed in advance. Everywhere else in this catalogue an option is a right to transact a set amount, with the strike deciding the price. Here the price is settled first and the quantity is the thing being chosen, within a minimum and a maximum on each day and further totals across the contract year. It is the standard shape of long-term gas supply in Europe, and the same structure runs through power supply contracts.

### 2. How it works

Each day the buyer nominates a volume, by a deadline set in the contract, between a daily minimum and a daily maximum. Two more limits apply across the year: a total it must take at least, and a total it may not exceed. The annual maximum is what makes this hard. Without it the contract would be a strip of independent daily options, each exercised on its own merits; with it, the daily rights compete for one allowance, and taking the maximum on a mild November day can mean giving up a far more valuable January one. The buyer’s real question is therefore not whether today’s payoff is positive but whether it beats the continuation value of the flexibility that using it would consume.

> That structure has no closed-form price. A swing contract is worth at least its intrinsic value — the best schedule available on today’s forward curve — and at most the strip of independent daily options it would be if the annual limits never bound. Desks value the gap between the two by dynamic programming or least-squares Monte Carlo.

### 3. Why it’s used

The buyer’s demand is not a choice, it is the weather. A supplier serving households cannot know in August how much gas its customers will burn on 14 January, and a fixed strip of forwards would leave it short on the coldest days and long on the mildest. The cold miss is the expensive one: demand peaks exactly when the spot price does, so the volume it has to buy in the market is the volume it buys at the worst price. A swing contract hands that flexibility to the buyer. The seller — a producer that can turn a field up and down, a storage operator, or a portfolio trader who can net one buyer’s cold day against another’s mild one — is being paid to absorb it, and that payment is usually built into the contract price rather than charged as an up-front premium.

### 4. Key terms

The daily contract quantity is the reference volume the daily limits are expressed against, often as percentages of it. The annual contract quantity plays the same role for the year, with a minimum — the take-or-pay level — and a maximum set around it. Nomination is the act of telling the seller tomorrow’s volume. The swing factor summarises how much flexibility has been bought: the maximum daily nomination divided by the average daily volume the annual quantity implies. Many contracts add make-up rights, letting a buyer that has paid for volume it did not take draw that gas in a later period rather than lose it outright.

> An annual quantity of 100,000 MWh over a 180-day winter averages about 556 MWh a day. A 1,000 MWh daily maximum is therefore a swing factor of roughly 1.8, and the annual limit is exhausted after 100 days at full rate.

### 5. Risks to watch

Take-or-pay is a liability, not an option: a buyer whose demand collapses still pays for the annual minimum, and if the market has fallen below the contract price it is paying over the odds for volume it does not want. Valuation is model-dependent in a way little else in this catalogue is — the number on the page assumes nominations are timed well, and a desk that exercises less than optimally realises less than the model promised. The seller carries the mirror image and must be able to deliver the maximum on any day it is asked, which is a physical commitment as much as a financial one. Terms run for years, so each side carries the other’s credit for a long time.

> Take-or-pay was tested in Europe after 2009, when hub prices fell well below the oil-indexed prices in long-term supply contracts and buyers found themselves paying for gas they could have bought more cheaply on the market. A long run of renegotiations and arbitrations followed, and hub indexation displaced much of the oil linkage.

## A supplier weighs one day against the winter

- A supplier holds a 180-day winter swing contract at €30 a MWh, nominating between 0 and 1,000 MWh on any day.
- Across the winter it must take at least 60,000 MWh and may take no more than 100,000 MWh.
- Nominating the maximum every day would be 180 × 1,000 = 180,000 MWh, so the annual limit allows full nominations on only 100 of the 180 days.
- On a day when the spot price is €34, nominating the maximum earns (€34 − €30) × 1,000 = €4,000.
- A colder day later in the winter is expected to reach €45, where the same allowance would earn (€45 − €30) × 1,000 = €15,000.
- The winter turns mild and the supplier takes only 52,000 MWh, so it still pays for the 8,000 MWh shortfall: 8,000 × €30 = €240,000.

**The €34 day is in the money and may still be the wrong day to use, because the allowance it consumes is worth €15,000 elsewhere — an option inside a swing contract is only worth exercising if it is the best use of a budget every other day is also bidding for. And the €240,000 is not an option expiring worthless; it is a bill for gas the supplier never received.**

## Key terms

- **Nomination** — The buyer’s notice, given by a deadline in the contract, of the volume it will take on the coming day.
- **Daily contract quantity** — The reference daily volume that the minimum and maximum daily nominations are expressed against.
- **Annual contract quantity** — The reference volume for the contract year, around which the overall minimum and maximum takes are set.
- **Take-or-pay** — The obligation to pay for the annual minimum volume whether or not the buyer actually takes it.
- **Swing factor** — The maximum daily nomination divided by the average daily volume, measuring how much flexibility the contract carries.
- **Continuation value** — What the remaining allowance is worth if today’s is left unused — the figure a nomination decision is really judged against.

## In practice

The buyers are utilities, energy retailers and industrial users whose load follows the weather or a production schedule they cannot fix a year ahead. The sellers are producers, storage operators and the large portfolio traders who can net one buyer’s cold day against another’s mild one. Long-term European gas supply has been written this way for decades, and the same flexibility trades in its own right whenever a desk leases storage capacity and runs it as a swing contract against the hub price.

## Read next

- [Commodity Option](/OTC_Learn/product/cmopt/) — Cap or floor a commodity price
- [Weather Swap](/OTC_Learn/product/weather/) — A payout driven by temperature, not price
- [Cap and Floor](/OTC_Learn/product/capfloor/) — Set a ceiling or floor on a floating rate

The app adds a twelve-question bank for Swing Option, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
