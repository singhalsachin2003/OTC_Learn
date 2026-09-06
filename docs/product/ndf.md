---
title: "Non-Deliverable Forward"
description: "A cash-settled forward for restricted currencies"
permalink: /product/ndf/
---

# Non-Deliverable Forward

*A cash-settled forward for restricted currencies*

A forward on a currency that cannot leave its own borders. The economics are those of an ordinary forward — a rate agreed today for a date in the future — but nothing is ever delivered in the restricted currency. Instead the two sides compare their agreed rate with an official fixing on the fixing date and settle the difference as a single payment in a convertible currency, almost always US dollars. That one design change is what lets an offshore investor take a position in a currency it is not permitted to hold.

[Open in the app](/OTC_Learn/) · [FX](/OTC_Learn/category/fx/) · advanced

## The lesson

### 1. What it is

A non-deliverable forward is an FX forward that never delivers the underlying currency. At maturity the parties settle the difference between the agreed rate and an official fixing, paid in a convertible currency such as US dollars.

> The deepest NDF markets are in the Korean won, Indian rupee, Brazilian real and Taiwan dollar, and the overwhelming majority settle in US dollars.

### 2. How it works

Two parties agree a rate on a notional amount. On the fixing date an official reference rate is published; whichever side is out of the money pays the difference in dollars. Where the notional is a dollar amount and the pair is quoted as units of the restricted currency per dollar, the payment is notional × (fixing − contract rate) ÷ fixing — the gain arises in the restricted currency and is converted to dollars at the same fixing that produced it. The restricted currency itself never moves.

### 3. Why it’s used

Many emerging-market currencies sit behind capital controls that block delivery offshore. NDFs let companies and investors hedge or take positions in those currencies without local bank accounts or regulatory approval.

> The market shrinks as controls ease. Renminbi NDF volumes fell away once a deliverable offshore renminbi market (CNH) developed and gave participants a way to settle physically.

### 4. Key terms

The fixing rate and its source (often a central bank or an industry benchmark), the settlement currency, the notional, and the gap between the fixing date and the settlement date a day or two later. That gap exists so the payment can be calculated once the fixing has printed.

> Fixing sources are named in the confirmation rather than invented per trade — USD/BRL settles against PTAX, published by the Banco Central do Brasil, and the market works from standard EMTA template terms.

### 5. Risks to watch

The official fixing can differ from the rate a firm actually achieves onshore, leaving basis risk in the hedge. Fixings can also be suspended or redefined during a currency crisis, at which point documented fallbacks decide what the trade pays, and liquidity in these markets thins out quickly under stress.

## Hedging a Brazilian bond position

- A fund holds BRL 52,000,000 of Brazilian local bonds. In USD/BRL the dollar is the base currency, so the rate is reais per dollar.
- Spot is 5.2000, so the position is worth $10,000,000. The fund buys $10,000,000 of a one-month USD/BRL NDF at 5.2000 — long dollars, short reais. The contract rate is simplified to spot to keep the arithmetic clear; a real one-month NDF prints above spot, because Brazilian interest rates sit well above dollar rates.
- At the fixing the rate is 5.4000, so the bonds are now worth BRL 52,000,000 ÷ 5.4000 = $9,629,630.
- The NDF pays $10,000,000 × (5.4000 − 5.2000) ÷ 5.4000 = $370,370, settled in dollars.
- The hedged position is worth $9,629,630 + $370,370 = $10,000,000, unchanged in dollar terms.

**No reais ever change hands. The profit arises as BRL 2,000,000 and is converted into dollars at the same 5.4000 fixing that created it, which is why the payment is $370,370 and not the $384,615 that BRL 2,000,000 would have been worth at the original 5.2000 rate.**

## Key terms

- **Fixing rate** — The official reference rate published on the fixing date, against which the contract rate is compared.
- **Fixing source** — The named publisher of that rate, such as a central bank or an industry benchmark administrator.
- **Settlement currency** — The convertible currency the net difference is paid in, most often US dollars.
- **Fixing date** — The date the reference rate is observed, normally a day or two before the cash actually settles.
- **Restricted currency** — The currency the contract references but never delivers, because capital controls block offshore settlement.
- **Basis risk** — The residual exposure left when the fixing differs from the rate the hedger transacts at onshore.

## In practice

Exporters and importers dealing with Brazil, India, Korea or Taiwan use NDFs to hedge invoices they cannot settle offshore, and emerging-market bond funds use them to strip currency risk out of local-currency debt they already hold. Macro funds are heavy users too, because for an offshore account an NDF is often the only practical way to take a position in a currency it is not allowed to own.

## Read next

- [FX Forward](/OTC_Learn/product/fxfwd/) — Lock in a future exchange rate
- [FX Swap](/OTC_Learn/product/fxswap/) — Exchange currencies now and reverse it later
- [Forward Rate Agreement](/OTC_Learn/product/fra/) — Lock a rate for one future period

The app adds a twelve-question bank for Non-Deliverable Forward, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
