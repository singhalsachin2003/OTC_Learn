---
title: "The ISDA Architecture"
description: "The paperwork that makes every other product possible"
permalink: /product/isda/
---

# The ISDA Architecture

*The paperwork that makes every other product possible*

An OTC relationship is built from a stack of documents, not one contract, and the whole point of the stack is a single legal feature buried in its opening pages: every trade under one Master Agreement is, by its own terms, part of a single agreement with every other trade under it. That status is what makes close-out netting possible, and close-out netting is the entire commercial argument for the architecture — without it, a defaulting counterparty’s liquidator could cherry-pick which trades to honour and which to walk away from.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · foundational

## The lesson

### 1. What it is

The Master Agreement is the standard-form core of an ISDA relationship, identical for every pair of counterparties that uses it, setting out the boilerplate that would otherwise have to be renegotiated on every single trade. The Schedule amends and elects within that standard form — choosing which optional provisions apply, adding bespoke terms, naming Additional Termination Events specific to this relationship. Each individual trade is then a short Confirmation referencing the Master Agreement and Schedule rather than restating all of it, and the Credit Support Annex, covered earlier in this category, is itself an annex to the Schedule, not a separate contract.

### 2. How it works

Every Confirmation under one Master Agreement forms, by its own terms, a single agreement with every other Confirmation under it — not a bundle of separate contracts that happen to share a signature page. That single-agreement status is the entire commercial point. If a counterparty defaults, every trade under the Master Agreement terminates together and is reduced to one net figure — close-out netting — rather than each trade being settled on its own. Without single-agreement status a liquidator could cherry-pick: demand payment in full on the trades in its favour while treating the trades it owes money on as ordinary unsecured claims, worth cents on the dollar.

> Regulatory capital rules recognise netting only where a jurisdiction’s insolvency law is confirmed, by legal opinion, to actually uphold it — which is why ISDA maintains netting opinions for dozens of jurisdictions, and a Master Agreement with a counterparty in an unopinioned jurisdiction is priced, and capitalised, as if netting might not hold at all.

### 3. Why it’s used

Two different kinds of trigger can end the relationship early, and they are not the same thing. An Event of Default is generally the defaulting party’s own fault — failure to pay, a bankruptcy, a breach of the agreement — and gives the other side the right, not the obligation, to terminate everything. A Termination Event is largely no-fault — a change in tax law, an illegality, a merger that leaves a weaker surviving entity — and the distinction decides not just whether the relationship ends but how the final number is calculated and who is on the hook for it.

> The 1992 Master Agreement is still in force between many long-standing counterparties, but 2002 is the modern default: it cut the grace period for a payment or delivery failure from three local business days to one, replaced the 1992 choice between “Market Quotation” and “Loss” with a single, more flexible “Close-out Amount”, and introduced Force Majeure as its own Termination Event — drafted in direct response to 11 September 2001 and the 1998 market disruption, after 1992 turned out to have no clean answer for a market simply becoming unable to operate.

### 4. Key terms

Master Agreement and Schedule are the standard-form core and the relationship-specific elections built on top of it. Single agreement status is the legal feature everything else depends on, and close-out netting is what that status makes possible on a default. Event of Default and Termination Event are the two different triggers that can end the relationship, and they are judged, and paid for, differently.

### 5. Risks to watch

Netting only works where the underlying insolvency law actually respects it, which is why cross-border relationships carry a jurisdictional risk that a purely domestic one does not. A poorly negotiated Schedule can leave gaps — an Additional Termination Event that was never included, a close-out mechanic left ambiguous — that only become visible under exactly the stress the documentation exists to survive. And the architecture is only as strong as the discipline to actually paper every relationship this way: a trade done outside any Master Agreement at all gets none of these protections, whatever informal understanding the two sides believe they share.

## Four trades become one number

- Corp B defaults under its ISDA Master Agreement with Bank A, which has four live trades against it: an interest rate swap worth $4,200,000 in Bank A’s favour, an FX forward worth $1,800,000 in Corp B’s favour, a cap worth $650,000 in Bank A’s favour, and a swaption worth $3,100,000 in Corp B’s favour.
- Without close-out netting, Corp B’s liquidator could in principle demand payment in full on the two trades in Corp B’s favour — $1,800,000 + $3,100,000 = $4,900,000 — while treating Bank A’s claim on the other two, worth $4,850,000, as an ordinary unsecured claim worth a fraction of that.
- Because every trade sits under one Master Agreement, they instead terminate together and net to a single figure: $4,200,000 − $1,800,000 + $650,000 − $3,100,000 = −$50,000.
- That negative sign means Bank A, despite being in the money on two of the four trades, owes Corp B’s estate a net $50,000 — one payment, calculated once, rather than four separate claims running in opposite directions.

**Close-out netting turned $9,750,000 of gross exposure across four trades into a single $50,000 payment. That collapse from gross to net is the entire commercial argument for the single agreement — and it only works because every Confirmation was always, legally, part of the same contract.**

## Key terms

- **Master Agreement** — The standard-form core of an ISDA relationship, identical for every pair of counterparties that use it, setting out terms that would otherwise have to be renegotiated on every trade.
- **Schedule** — The document that amends and elects within the Master Agreement’s standard form, adding bespoke terms and naming any Additional Termination Events specific to one relationship.
- **Single agreement** — The status, stated in the Master Agreement itself, that every trade under it forms one contract with every other — the legal basis for close-out netting.
- **Close-out netting** — Terminating every trade under a Master Agreement together on a default and reducing them to one net figure, rather than settling each on its own.
- **Event of Default** — A trigger generally caused by one party’s own conduct — non-payment, bankruptcy, a breach of the agreement — giving the other side the right, not the obligation, to terminate everything.
- **Termination Event** — A largely no-fault trigger — a change in tax law, illegality, a merger leaving a weaker surviving entity — that can end the relationship without either side having done anything wrong.

## In practice

Every OTC derivatives relationship of any size sits on top of a negotiated ISDA Master Agreement and Schedule, usually the product of weeks or months of legal negotiation before a single trade is ever done. Legal and credit teams, not the trading desk, own that negotiation, because the Schedule’s elections — which close-out method, which Additional Termination Events, whose credit rating triggers what — decide how the relationship actually behaves under stress, long after the deal desk has moved on to the next relationship.

## Read next

- [Collateral and the CSA](/OTC_Learn/product/collateral/) — The cash and bonds that back an OTC exposure
- [Central Clearing](/OTC_Learn/product/clearing/) — A central counterparty steps into every trade
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments

The app adds a twelve-question bank for The ISDA Architecture, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
