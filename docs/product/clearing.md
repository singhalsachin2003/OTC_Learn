---
title: "Central Clearing"
description: "A central counterparty steps into every trade"
permalink: /product/clearing/
---

# Central Clearing

*A central counterparty steps into every trade*

Central clearing replaces a bilateral trade with two trades and a new counterparty standing in the middle of both. When a cleared trade is submitted, the clearing house is novated into it — buyer to every seller and seller to every buyer — so neither original party ever faces the other again. The G20 asked for exactly this after 2008, and the machinery that makes it safe to concentrate so much risk in one institution is a strict, publicly documented order in which a default is actually paid for.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · intermediate

## The lesson

### 1. What it is

Central clearing replaces a single bilateral trade with two trades facing a central counterparty, or CCP. When a cleared trade is submitted, the CCP is novated into it, stepping in as buyer to every seller and seller to every buyer, so each original counterparty now faces the CCP rather than each other. Novation is a full legal substitution, not a guarantee bolted onto the original trade — the original bilateral contract is replaced entirely, not merely backstopped.

### 2. How it works

Only a clearing member can face the CCP directly, so most market participants access clearing through one: a bank that is itself a member clears the trade on the client’s behalf, in a segregated account, and stands between the client and the CCP exactly as the CCP stands between clearing members. That relationship carries its own margin and default provisions layered on top of the CCP’s own, and a client’s positions can in principle be ported to another clearing member if its own clearer fails, provided a replacement can be found in time.

> Portability is the whole point of client segregation, but it depends on another clearing member being both willing and able to take the position on within the time the CCP allows — not a guaranteed outcome, only a designed-for one.

### 3. Why it’s used

At the 2009 Pittsburgh summit the G20 committed to having standardised OTC derivatives traded on exchanges or electronic platforms where appropriate, cleared through central counterparties, and reported to trade repositories — a direct response to how opaque and interconnected the bilateral derivatives market had turned out to be in the crisis. An identical swap can still price differently cleared versus bilateral, because the two are not the same trade in every respect that matters to its value: discounting, margin and capital treatment all differ between a CCP’s standard terms and a given bilateral CSA, so the economics of the position, not just its counterparty, change with the venue.

### 4. Key terms

Novation is the legal mechanism that makes clearing possible at all. Clearing member and client clearing describe how a participant without direct CCP access still gets there. The default waterfall is the sequence a CCP’s financial resources are drawn on when a member defaults, and the guaranty fund and the CCP’s own skin in the game are the layers that sequence is built from.

### 5. Risks to watch

A clearing member’s own default has to happen before any of this machinery is triggered — the waterfall exists to absorb exactly that event, not to protect against ordinary market moves, which variation margin already handles. Mutualisation is the point of the guaranty fund and also its risk: a default large enough to exhaust the defaulter’s own resources and the CCP’s skin in the game draws on money contributed by clearing members that had nothing to do with the default at all. Concentrating so much of the market’s risk in a small number of CCPs also concentrates the consequences of one failing badly — which is exactly why the waterfall is public, tested and watched as closely by clearing members as by regulators.

> A clearing member defaulting is rare enough that, in practice, a CCP’s default fund is almost never actually drawn on — it is sized for extreme tail events that margin alone is not expected to cover.

## A member default works through the waterfall

- A clearing member defaults, and closing out its portfolio crystallises a $180,000,000 loss beyond its posted variation margin.
- The defaulter’s own initial margin of $120,000,000 is used first, cutting the uncovered loss to $60,000,000.
- Its contribution to the guaranty fund, $25,000,000, is used next, cutting the loss to $35,000,000.
- The CCP’s own capital — its skin in the game — covers $10,000,000 of it, leaving $25,000,000.
- The mutualised guaranty fund, built from every other clearing member’s contribution, absorbs the remaining $25,000,000 in full.

**Every layer before the last one belongs to the defaulter or the CCP itself; only the final $25,000,000 was ever anyone else’s money, and it was the last resort, not the first. A loss any larger than $180,000,000 would have started drawing on further assessments against the surviving members — the reason clearing members watch a CCP’s waterfall as closely as their own risk.**

## Key terms

- **Novation** — The legal substitution of the CCP into a trade as counterparty to each side, replacing the original bilateral contract entirely.
- **Clearing member** — A firm that faces the CCP directly; most market participants access clearing through one rather than joining themselves.
- **Client clearing** — A clearing member facing the CCP on a client’s behalf, in a segregated account, with its own layer of margin and default provisions on top of the CCP’s.
- **Default waterfall** — The strict order in which a CCP’s financial resources absorb a defaulting member’s losses, ending only after the defaulter’s own resources and the CCP’s own capital are exhausted.
- **Guaranty fund** — The mutualised pool of collateral, contributed by every clearing member, that sits behind the CCP’s own capital as the last layer before further assessments.
- **Skin in the game** — The CCP’s own capital contribution to the waterfall, placed ahead of the mutualised guaranty fund so the CCP shares directly in the cost of a default it failed to price correctly.

## In practice

Nearly all standardised interest rate swaps and index CDS now clear through CCPs such as LCH, CME or ICE, following the G20 mandate; end users reach them through a clearing member, almost always a large bank, rather than joining directly. Buy-side risk teams monitor their clearing member’s own financial strength as closely as the CCP’s, because a clearing member’s own default is the first thing that has to go wrong before any of this machinery is triggered at all.

## Read next

- [The ISDA Architecture](/OTC_Learn/product/isda/) — The paperwork that makes every other product possible
- [Collateral and the CSA](/OTC_Learn/product/collateral/) — The cash and bonds that back an OTC exposure
- [CDX Index](/OTC_Learn/product/cdx/) — A basket of CDS in one tradable index

The app adds a twelve-question bank for Central Clearing, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
