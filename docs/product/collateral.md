---
title: "Collateral and the CSA"
description: "The cash and bonds that back an OTC exposure"
permalink: /product/collateral/
---

# Collateral and the CSA

*The cash and bonds that back an OTC exposure*

Two different kinds of margin answer two different questions, and almost every product in this catalogue leans on both without ever naming them. Variation margin settles what has already happened to a trade’s value; initial margin covers what could still happen before a defaulted counterparty’s positions are closed out. Both are set out in a Credit Support Annex, the document that turns a bilateral OTC exposure into a collateralised one — and, as later modules in this category show, decides more than just credit risk.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · intermediate

## The lesson

### 1. What it is

Variation margin settles what has already happened: it pays across the change in a portfolio’s mark-to-market so that neither side is ever sitting on an unrealised loss it has not been paid for. Initial margin covers what has not happened yet — the further loss that could build up between the last variation margin call and the time it actually takes to close out or replace a defaulted counterparty’s positions. Both are set out in the Credit Support Annex, the ISDA document that turns a bilateral OTC exposure into a collateralised one.

> Before the crisis, initial margin on an uncleared trade was mostly a dealer-to-dealer practice. The 2013 BCBS-IOSCO framework — implemented in six phases between 2016 and 2022 — is what made it standard for a much wider population of market participants.

### 2. How it works

A CSA sets a threshold — an amount of uncollateralised exposure each side is prepared to run before a call is even made — and a minimum transfer amount, below which a call is skipped to avoid shuffling small sums back and forth daily. It also names what counts as eligible collateral: cash in one or more approved currencies is universal, and many CSAs also accept government bonds, subject to a haircut that discounts the bond’s value to cover how far its price could move before it could actually be sold. Cash variation margin is routinely rehypothecated — the receiving party can use it as its own, rather than ring-fencing it — while segregated initial margin, held with a third-party custodian precisely so it cannot be reused, is not.

> Haircuts scale with maturity and credit quality under the standardised BCBS-IOSCO schedule: a few percent for a short-dated, highly-rated government bond, more for a longer-dated or lower-rated one — the buffer is sized to how far the bond’s price could move before it could be sold.

### 3. Why it’s used

None of this is only about credit protection. Which currency’s cash a CSA lets a party post — and which the two sides actually use — decides the rate a collateralised trade is discounted at, so the CSA is a valuation input as much as a credit document, not merely a backstop bolted on afterwards. The crisis exposed how much uncollateralised or lightly-margined exposure the market had been carrying, and the years since have pushed practice toward daily variation margin calls and thresholds at or near zero, first informally among dealers and then as a regulatory requirement for a much wider population of counterparties.

### 4. Key terms

Threshold, minimum transfer amount, eligible collateral and haircut define how a CSA actually calls and takes margin day to day. Variation margin and initial margin answer the two different questions this module opened with, and rehypothecation is the dividing line in how each is actually held once posted.

### 5. Risks to watch

A CSA reduces credit risk; it does not remove it. The margin period of risk — the gap between the last good variation margin call and the point a defaulted counterparty’s positions are actually replaced — is exactly what initial margin is sized to cover, and it can be badly underestimated in a fast-moving, illiquid market. Rehypothecated collateral is a general claim on the receiving firm’s estate if that firm fails, not a ring-fenced asset, which is precisely what segregated initial margin custody is designed to avoid instead. And margin itself has to be funded: a large adverse move can generate a collateral call that consumes liquidity long before the underlying trade would ever have paid out.

> Regulatory initial margin for uncleared derivatives phased in over six stages between September 2016 and September 2022, working down from the very largest dealers to firms with an aggregate notional above roughly €8 billion. A €50 million initial margin threshold exists below which two counterparties need not exchange it at all — a deliberate carve-out to keep the regime from burdening every small end-user relationship.

## A CSA calls margin, day by day

- Two dealers run a CSA on their swap portfolio: zero threshold, a $100,000 minimum transfer amount, daily variation margin in cash.
- On day one the portfolio’s mark-to-market moves to $3,200,000 in Bank A’s favour, with no collateral yet posted, so Bank A calls the full $3,200,000 and Bank B pays it.
- On day two the mark moves further, to $3,650,000 in Bank A’s favour. The shortfall against collateral already held is $3,650,000 − $3,200,000 = $450,000, above the MTA, so Bank A calls again and Bank B posts the extra $450,000.
- On day three the mark moves only to $3,690,000. The shortfall is $3,690,000 − $3,650,000 = $40,000 — below the $100,000 MTA — so no call is made, and Bank A carries a small uncollateralised exposure until a later move takes the cumulative shortfall past the MTA.

**None of this involved initial margin at all. Variation margin only ever settles what has already happened, to whatever the threshold and MTA allow through; initial margin, calculated and posted separately into segregated custody, is what stands behind the risk that Bank B defaults before Bank A can call — and collect — the next one.**

## Key terms

- **Variation margin (VM)** — Collateral that settles the change in a portfolio’s mark-to-market, so neither side carries an unpaid gain or loss.
- **Initial margin (IM)** — Collateral sized to cover the potential further loss between the last variation margin call and the time it takes to close out a defaulted counterparty.
- **Threshold** — The amount of uncollateralised exposure a CSA lets each side run before a margin call is triggered at all.
- **Minimum transfer amount (MTA)** — The minimum size a call must reach before it is actually made, so small movements are not settled daily.
- **Haircut** — The discount applied to non-cash collateral’s value, sized to the risk that its price falls before it can be sold.
- **Rehypothecation** — The right to reuse collateral received as if it were the receiving firm’s own, rather than ring-fencing it — routine for cash variation margin, prohibited for segregated initial margin.

## In practice

Every dealer relationship and most buy-side-to-dealer relationships now run on a CSA, calling variation margin daily against the current mark and, for the largest counterparty pairs, exchanging initial margin into segregated custodian accounts under the uncleared margin rules. Treasury and collateral management desks exist purely to manage this — sourcing eligible collateral, optimising which asset to post against which CSA, and funding the calls a big move in rates or credit can generate overnight.

## Read next

- [The ISDA Architecture](/OTC_Learn/product/isda/) — The paperwork that makes every other product possible
- [Valuation and Marking](/OTC_Learn/product/marking/) — What a trade is worth, and which curve says so
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments

The app adds a twelve-question bank for Collateral and the CSA, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Collateral and the CSA — Thresholds, minimums and the independent amount, What may be posted, and what it is worth, Whose collateral is it — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
