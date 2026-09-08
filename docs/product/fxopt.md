---
title: "FX Option"
description: "The right to exchange currency at a strike"
permalink: /product/fxopt/
---

# FX Option

*The right to exchange currency at a strike*

A forward with an escape hatch, bought for a fee. The holder may exchange two currencies at an agreed strike rate but is never forced to, so a hedger keeps protection against an adverse move while retaining the benefit of a favourable one. That asymmetry is paid for upfront in premium, which makes an option a more expensive hedge than a forward at the moment it is put on and a better one only if spot travels far enough in the hedger’s favour.

[Open in the app](/OTC_Learn/) · [FX](/OTC_Learn/category/fx/) · intermediate

## The lesson

### 1. What it is

An FX option gives the holder the right, not the obligation, to buy or sell one currency for another at a set strike rate on or before expiry. The seller has the mirror position: an obligation to deliver if the holder exercises, in exchange for the premium received.

### 2. Call vs put

A call gives the right to buy the base currency; a put gives the right to sell it. The buyer pays a premium for this flexibility. Because every FX trade has two sides, an option is always a call on one currency and simultaneously a put on the other — the right to sell euros for dollars at 1.0800 is the same contract as the right to buy dollars with euros at that rate.

> This is why FX confirmations name both legs. “A EUR put / USD call, strike 1.0800, €10m” is unambiguous; “a euro put” on its own does not say what the euro is being sold against.

### 3. Why it’s used

Firms hedge currency exposure while retaining upside if rates move favourably — unlike a forward, which locks in the rate either way. Options also suit exposures that may not happen: a company bidding for a foreign contract would be left with an unwanted forward if the bid failed, whereas an option is simply left to lapse.

### 4. Key terms

Strike, premium, expiry, notional and exercise style (European on one date, American any time before expiry). Implied volatility drives the price, and dealers hedge their delta — the option’s sensitivity to the spot rate.

> The FX options market quotes in volatility rather than cash: dealers agree a vol number and the premium falls out of an agreed model, which is why the standard reference points are at-the-money vol, 25-delta risk reversals and butterflies.

### 5. Risks to watch

The premium is a real cost, making options a more expensive hedge upfront than a forward, and it is lost if the option expires worthless. Sellers face large open-ended losses, and exotic features such as knock-out barriers can cancel a hedge exactly when it is needed most.

> Premium on a vanilla FX option is normally paid two business days after the trade date — the same settlement convention as an FX spot trade.

## An exporter puts a floor under a euro receivable

- A US exporter expects €20,000,000 in three months. In EUR/USD the euro is the base currency, so a falling rate means fewer dollars.
- It buys a three-month EUR put / USD call struck at 1.0800 on €20,000,000, paying 150 pips — 0.0150 dollars per euro, or $300,000.
- If spot fixes at 1.0200 it exercises, selling €20m at 1.0800 for $21,600,000, or $21,300,000 after premium, against $20,400,000 at market.
- If spot fixes at 1.1500 it lets the option lapse and sells at market for $23,000,000, keeping $22,700,000 after premium.
- The three-month forward was 1.0900, which would have fixed the proceeds at $21,800,000 in both cases.

**The option floors the exporter at $21,300,000 — an effective 1.0650 — while leaving the upside open. It only beats the forward above 1.1050, the forward rate plus the 150-pip premium; anywhere below that the forward produces more dollars, and the difference is what the upside costs.**

## Key terms

- **Strike** — The exchange rate at which the holder may buy or sell if the option is exercised.
- **Premium** — The price paid upfront for the option, kept by the seller whether or not the option is exercised.
- **Exercise style** — Whether the option may be exercised only at expiry (European) or at any time up to it (American).
- **Implied volatility** — The volatility the market is pricing into the option — the main determinant of its premium.
- **Delta** — How much the option’s value changes for a small move in the spot rate.
- **Knock-out barrier** — A rate level that, if spot touches it, cancels the option before expiry.

## In practice

Corporates reach for options when the exposure itself is uncertain, such as a bidder for an overseas contract that would be stuck with a live forward if it lost the tender. Asset managers and hedge funds buy them for asymmetric positions around elections and central bank meetings, and dealer desks run large books of them, hedging delta continuously in the spot market and managing what is left over in volatility.

## Read next

- [FX Forward](/OTC_Learn/product/fxfwd/) — Lock in a future exchange rate
- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option

The app adds a twelve-question bank for FX Option, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on FX Option — Quoted in deltas, not strikes, Which currency the premium is in, Pricing away from the quoted points — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
