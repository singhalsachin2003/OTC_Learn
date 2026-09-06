---
title: "Swaption"
description: "An option on an interest rate swap"
permalink: /product/swaption/
---

# Swaption

*An option on an interest rate swap*

An option on a swap. The buyer pays a premium today for the right — never the obligation — to enter an agreed interest rate swap, at a rate agreed today, on a date agreed today. That asymmetry is the whole point: a forward-starting swap binds both sides whatever happens, whereas a swaption turns a future borrowing or investment rate into a worst case the holder can walk away from if the market offers something better.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · advanced

## The lesson

### 1. What it is

A swaption gives the holder the right, but not the obligation, to enter into an interest rate swap at a preset rate on or by a future date. That preset rate is the strike, and the contract also fixes everything else about the swap that would follow: notional, tenor, floating index such as SOFR or €STR, and payment frequency.

### 2. Payer vs receiver

A payer swaption gives the right to pay the fixed rate (benefits if rates rise); a receiver swaption gives the right to receive fixed (benefits if rates fall). The labels always describe the fixed leg of the underlying swap, never the floating one, so there is no third variety to learn.

> A payer swaption gains as rates rise and bond prices fall, which makes it economically a put on the underlying bond — the same exposure seen from the other side of the price/yield relationship.

### 3. How it settles

At expiry the holder either enters the actual swap (physical settlement) or takes its cash value instead (cash settlement). Most swaptions are European, exercisable on a single date, while a Bermudan swaption allows exercise on several dates. Cash settlement needs an agreed way of turning the swap into a single number, so the confirmation specifies the valuation method before the trade is done rather than leaving it to be argued at expiry.

### 4. Why it’s used

Swaptions hedge against future rate moves while keeping upside if rates move favourably. The buyer pays an upfront premium for that optionality. A treasurer who expects to issue fixed-rate debt next year can buy a payer swaption to cap the rate on that issue and still borrow at the market rate if rates have fallen — something a forward-starting swap cannot offer, because it commits both sides.

> The premium is agreed on the trade date and paid within a couple of business days of it, not at expiry, so the cost is sunk long before the exercise decision is made.

### 5. Key terms and risks

Quoted as "1y into 5y" — one year to expiry, then a five-year swap. Value depends on rate levels and on volatility, so a swaption can lose money even when rates barely move. The buyer’s loss is capped at the premium; the seller’s exposure is open-ended.

> Swaption volatility is usually quoted in basis points a year (normal volatility) rather than as a percentage of the rate, a convention that became standard once rates traded at and below zero.

## Pre-hedging a bond issue

- A company plans to issue $100m of five-year fixed-rate debt in one year’s time.
- It buys a 1y into 5y payer swaption struck at 3.50% for a premium of $1.5m, or 1.5% of notional.
- A year later the five-year swap rate is 4.50%, so it exercises and pays 3.50% fixed.
- The saving is 1.00% of $100m — $1m a year for five years, or $5m before discounting.
- Net of the $1.5m premium the swaption has returned $3.5m against issuing unhedged.

**The swaption turns next year’s rate into a worst case of 3.50% rather than a certainty. Had the five-year rate instead fallen to 2.50%, the company would have let the option lapse, lost the $1.5m premium and borrowed at the lower market rate.**

## Key terms

- **Strike rate** — The fixed rate on the swap the holder may enter, agreed when the swaption is traded.
- **Payer swaption** — The right to enter a swap paying fixed and receiving floating, which gains value as rates rise.
- **Receiver swaption** — The right to enter a swap receiving fixed and paying floating, which gains value as rates fall.
- **Premium** — The upfront price of the option, paid whether or not the swaption is ever exercised.
- **Bermudan swaption** — A swaption exercisable on any one of several agreed dates rather than on a single expiry date.
- **Implied volatility** — The market’s expectation of how much the underlying swap rate will move, and the main driver of the premium besides the rate level.

## In practice

Corporate treasurers buy payer swaptions ahead of a planned bond issue to cap the coupon they will end up paying without committing to borrow at all, and insurers and pension funds buy receiver swaptions to protect against falling rates, which inflate the present value of the liabilities they owe. Dealers who sell them manage the resulting exposure on a volatility book, hedging the rate risk separately with swaps.

## Read next

- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Cap and Floor](/OTC_Learn/product/capfloor/) — Set a ceiling or floor on a floating rate
- [FX Option](/OTC_Learn/product/fxopt/) — The right to exchange currency at a strike

The app adds a twelve-question bank for Swaption, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
