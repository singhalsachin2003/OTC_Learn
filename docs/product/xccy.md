---
title: "Cross-Currency Swap"
description: "Exchange principal and interest across two currencies"
permalink: /product/xccy/
---

# Cross-Currency Swap

*Exchange principal and interest across two currencies*

The longer-dated relative an FX swap’s own glossary already points to. An FX swap exchanges principal now and reverses it later and nothing else; a cross-currency swap does the same two exchanges of principal but adds interest, paid on each side’s notional in its own currency, for every period in between. It is the standard way a genuine multi-year currency funding need is hedged, and the market for it prices something covered interest rate parity says should not exist at all: the cross-currency basis.

[Open in the app](/OTC_Learn/) · [FX](/OTC_Learn/category/fx/) · advanced

## The lesson

### 1. What it is

A cross-currency swap exchanges principal in two currencies at inception and exchanges it back at maturity, and pays interest on each side’s notional in its own currency for every period in between. An FX swap does the first and last part — two exchanges of principal — but never touches the interest in the middle; a cross-currency swap adds that interest, which is what makes it the natural instrument for a funding need lasting years rather than months.

> In the plain structure, notional is exchanged at the rate agreed at inception, not at spot on the day it is exchanged back — a five-year swap struck at 1.2500 returns exactly $1.2500 per euro at maturity, however far spot has actually moved by then.

### 2. How it works

Each side pays interest on its own notional in its own currency — fixed or floating on either leg, so a swap can be fixed-for-fixed, fixed-for-floating or floating-for-floating. The floating-for-floating version is what the market usually calls a cross-currency basis swap, and its price is not a rate but a spread added to one of the two floating legs — the cross-currency basis. Because the principal exchanged at inception is fixed at that day’s rate, a long-dated trade can see the two sides’ dollar value drift a long way apart as spot moves, building up exposure on the eventual re-exchange that a same-currency interest rate swap never carries at all.

> The market’s most heavily traded interdealer structure, common on USD/JPY, controls that drift with mark-to-market resets: part of the notional is refreshed to the current spot rate at each period end, so the outstanding exchange never gets too far from today’s rate.

### 3. Why it’s used

A cross-currency swap turns a bond raised in the “wrong” currency into cash flows in the currency actually needed. A US company that can borrow more cheaply in euros — because euro credit spreads are simply tighter that week, or its name is better known there — issues a euro bond and swaps the proceeds and the coupons back into dollars: a reverse Yankee, the mirror of a foreign issuer borrowing dollars directly in the US market. Whether that route beats borrowing dollars outright depends entirely on the basis: a favourable one makes the swap-adjusted euro cost cheaper than a straight dollar bond, and when it does not, the arbitrage closes and reverse Yankee issuance dries up. Insurers and pension funds run a parallel trade for portfolio reasons rather than funding cost: a Japanese life insurer buying US Treasuries for yield swaps the dollar coupons and principal back into yen, leaving a hedged, yen-funded asset that still earns the higher dollar yield — one of the largest and steadiest sources of demand behind the USD/JPY basis.

> Research by Wenxin Du, Alexander Tepper and Adrien Verdelhan, published in the Journal of Finance in 2018, found the post-2008 dollar basis could not be explained by credit risk or transaction costs, and that it was strongest exactly around quarter-ends — when the trades sit heaviest on banks’ balance sheets for regulatory reporting — pointing to the cost of the leverage ratio itself as the reason the arbitrage stays open.

### 4. Key terms

Notional exchange, the cross-currency basis, and covered interest rate parity — the no-arbitrage relationship the basis persistently violates — sit at the centre of it. Around them are the mark-to-market reset that manages long-dated credit exposure, and the reverse Yankee trade that is one of the clearest reasons the basis exists at all. Fixed-for-fixed, fixed-for-floating and floating-for-floating variants all trade under the same broad name; only the floating-for-floating version is, strictly, the basis swap.

### 5. Risks to watch

The principal re-exchange at maturity carries real credit exposure precisely because the rate was fixed years earlier: if spot has moved a long way and a counterparty defaults, replacing its side of that exchange can cost a great deal. The basis itself is not fixed either — it can move against an open position long before either principal exchange is due — and both legs still carry the interest rate risk of their own currency throughout the trade’s life.

> The EUR/USD three-month basis fell to roughly −130 to −150bp at the worst of the 2008 crisis, from levels close to zero before it — dollar funding through the swap market became extremely expensive exactly when banks needed dollars most. The Federal Reserve’s dollar swap lines with other major central banks, first opened that year, exist to relieve exactly that stress by supplying dollars outside the market that was failing.

## A German company reaches for dollars through euros

- A German company needs $500,000,000 to fund a US acquisition. EUR/USD spot is 1.2500.
- Rather than borrow dollars directly, it issues a five-year €400,000,000 bond at its own euro credit spread of 3.00%.
- It enters a five-year cross-currency swap, paying away the €400,000,000 bond proceeds at inception and receiving the $500,000,000 it actually needs — €400,000,000 × 1.2500 = $500,000,000.
- Each year it receives €12,000,000 fixed from the swap, exactly the coupon it owes its euro bondholders, and pays $24,000,000 fixed in return — a 4.80% all-in dollar rate.
- A straight five-year dollar bond, at the company’s wider dollar credit spread, would have cost 5.00%, or $25,000,000 a year.
- At maturity the swap reverses: the company pays back $500,000,000 and receives back €400,000,000, which it uses to redeem the euro bond.

**The swap turns a 3.00% euro coupon into a 4.80% all-in dollar cost, still 20 basis points cheaper than borrowing dollars outright — $1,000,000 a year, or $5,000,000 across the life of the bond before discounting. Nothing about the acquisition, the euro bond or the dollars raised needed the company to have any natural dollar income at all.**

## Key terms

- **Notional exchange** — The exchange of principal in both currencies at inception, and back again at maturity — the feature that separates a cross-currency swap from a same-currency interest rate swap.
- **Cross-currency basis** — The spread added to one floating leg of a floating-for-floating cross-currency swap, which covered interest rate parity implies should be zero and, for the dollar since 2008, persistently is not.
- **Covered interest rate parity** — The no-arbitrage relationship implying that the interest rate differential between two currencies should already be fully reflected in forward points, leaving no room for an extra spread.
- **Mark-to-market reset** — A periodic true-up of part of the notional to the current spot rate, used on longer-dated swaps to stop the eventual re-exchange from building up outsized credit exposure.
- **Reverse Yankee** — A bond issued by a US company in a foreign currency, most often euros, and swapped back into dollars — the mirror of a Yankee bond, in which a foreign issuer borrows dollars in the US market.
- **Cross-currency basis swap** — The floating-for-floating structure specifically, as distinct from the fixed-for-fixed and fixed-for-floating variants that also trade under the broader cross-currency swap name.

## In practice

Corporates issuing bonds in whichever currency offers the tightest spread, then swapping the proceeds home, are the routine end-user flow — reverse Yankees from US issuers alongside the equivalent trade run by European and Asian companies borrowing dollars. Life insurers and pension funds, particularly in Japan and Taiwan, run some of the largest positions, hedging foreign-currency bond portfolios back into their own currency for years at a time. Dealers run a basis book because supply and demand for each pair’s long-dated funding rarely balance, and that imbalance is what the basis is actually pricing.

## Read next

- [FX Swap](/OTC_Learn/product/fxswap/) — Exchange currencies now and reverse it later
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Basis Swap](/OTC_Learn/product/basisswap/) — Swap one floating index for another

The app adds a twelve-question bank for Cross-Currency Swap, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
