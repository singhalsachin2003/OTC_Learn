---
title: "Execution and Reporting"
description: "How a trade gets done, and who has to know about it"
permalink: /product/execution/
---

# Execution and Reporting

*How a trade gets done, and who has to know about it*

The clearing module in this category already quoted the G20’s full 2009 commitment — traded on exchanges or electronic platforms, cleared through central counterparties, reported to trade repositories. This module is the other two legs of that sentence. Standardised derivatives are meant to trade on regulated electronic venues rather than over the phone, and every derivative — cleared or not, venue-traded or not — has to be reported to a trade repository within a tight window of being done. Both mandates bind instrument by instrument, decided by a specific, named determination, not a blanket rule for a whole asset class.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · intermediate

## The lesson

### 1. What it is

Before the reforms that followed 2008, a standardised interest rate swap and a bespoke exotic option were negotiated the same way: bilaterally, usually by phone or instant message through a broker, with no public record of the price agreed or the volume done. Two separate mandates changed that for anything liquid and standardised enough to bear it. Trading standardised derivatives moved onto regulated electronic venues — Swap Execution Facilities (SEFs) in the US, Multilateral and Organised Trading Facilities (MTFs and OTFs) in the EU — and every OTC derivative, whatever venue it traded on or whether it stayed bilateral, became reportable to a trade repository.

### 2. How it works

A swap only has to move onto a venue once a specific, named determination has been made for it. In the US a SEF or a designated contract market files a “made available to trade” (MAT) determination with the CFTC for a defined swap; once approved, that swap can no longer be executed bilaterally, and must trade on a SEF or DCM instead. The EU’s parallel trading obligation under MiFIR applies once a class of derivative is judged sufficiently liquid and already trades on at least one venue. On the venue itself, execution is usually by request-for-quote — a client asks a chosen number of dealers to compete for one specific trade — rather than the continuous order book familiar from equities, because liquidity in most swaps is too thin to support one. Large trades above a published size threshold qualify as block trades, reported with a short delay so that publishing the trade does not itself move the market against whoever just dealt it.

> MAT determinations first took effect in the US in 2013, for the most standardised interest rate swaps and CDS indices; MiFID II’s Organised Trading Facility, the EU’s answer for non-equity venues including derivatives, only went live at the start of 2018. The reforms did not arrive everywhere at once, and for years a good deal of the market executed the same instrument two different ways depending on which side of the Atlantic the counterparty sat.

### 3. Why it’s used

Two different goods come out of this. Trading on a venue creates pre-trade price transparency that a bilateral phone call never could — a client requesting a quote sees competing prices from more than one dealer before dealing, rather than trusting whichever single dealer picked up the call. Reporting to a trade repository creates something regulators, not the counterparties, actually use: a systemic map of who holds what, updated continuously, that simply did not exist before 2008. AIG’s downfall was one firm’s derivatives book concentrating a risk almost nobody outside the firm could see coming; trade repository data is the tool built specifically so that kind of concentration would be visible before, not after.

### 4. Key terms

SEF, MTF and OTF are the regulated venues themselves, and RFQ is how most execution on them actually happens. A made-available-to-trade determination is what forces a specific swap onto one, and a block trade is the large-size exception to reporting it instantly. A trade repository is where every OTC derivative ends up reported, tagged with a UTI unique to that one transaction and a UPI shared by every trade in the same product.

### 5. Risks to watch

Two overlapping venue regimes, built independently and years apart, created cross-border friction a single global market did not ask for: a swap involving both a US and a non-US counterparty can trigger US SEF rules even where the EU side would rather trade bilaterally, and firms on both sides spent years navigating equivalence determinations and venue-specific rulebooks for what is, economically, the same trade. Reporting has its own version of the problem. Both counterparties to an OTC trade have historically had to report it, generating two separate records of the same transaction in different repositories that then have to be reconciled, and mismatches between the two remain common enough that regulators are still tightening the rules around them.

> CPMI-IOSCO’s global Unique Product Identifier only began rolling out in 2023–24 — the US from January 2024, the EU from April, the UK from September — replacing a patchwork of jurisdiction-specific product codes with one identifier a derivative carries wherever it is reported, over a decade after the reporting mandate itself began.

## Five quotes beat one phone call

- A pension fund needs to execute a $200,000,000, five-year swap that is subject to the US trade execution mandate, paying fixed against SOFR.
- On the SEF it requests quotes from five dealers at once: 3.42%, 3.41%, 3.44%, 3.40% and 3.43%. It deals at the best price, 3.40%, with the fourth dealer.
- A single relationship dealer, approached bilaterally instead, had quoted 3.45% earlier that morning — five basis points worse.
- On $200,000,000, five basis points is $200,000,000 × 0.0005 = $100,000 a year in fixed-leg cost, for as long as the five-year swap runs — $500,000 over its life before discounting.

**None of that saving came from being right about rates — the fund took no view on where SOFR goes. It came entirely from being able to see five competing prices at once instead of trusting whichever single dealer picked up the phone, which is exactly the pre-trade transparency the venue mandate was built to create.**

## Key terms

- **SEF / MTF / OTF** — The regulated electronic venues — Swap Execution Facilities in the US, Multilateral and Organised Trading Facilities in the EU — that a sufficiently standardised derivative is required to trade on rather than being negotiated bilaterally.
- **RFQ (request-for-quote)** — An execution method where a client asks a chosen number of dealers to compete for one specific trade, rather than trading against a continuous public order book.
- **Made-available-to-trade (MAT) determination** — The named, instrument-specific finding that triggers the US trading mandate — once approved, that swap can no longer be executed bilaterally.
- **Block trade** — A trade above a published size threshold, permitted a short reporting delay so that publishing it does not itself move the market against whoever just dealt.
- **Trade repository** — The regulated entity every OTC derivative, cleared or not, has to be reported to — the systemic map of exposures that did not exist before 2008.
- **UTI / UPI** — The Unique Transaction Identifier, generated once per trade so both counterparties’ reports can be matched, and the Unique Product Identifier, reused across every trade in the same instrument.

## In practice

Standardised interest rate swaps and index CDS trade almost exclusively on SEFs and MTFs/OTFs today, with RFQ the dominant execution method and a shrinking share still done by voice for the largest or most bespoke sizes. Every derivatives desk of any size runs a dedicated regulatory reporting function feeding trade repositories in every jurisdiction it operates in, because the reporting obligation runs trade by trade and mistakes are a compliance matter, not just an administrative one.

## Read next

- [Central Clearing](/OTC_Learn/product/clearing/) — A central counterparty steps into every trade
- [The ISDA Architecture](/OTC_Learn/product/isda/) — The paperwork that makes every other product possible
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments

The app adds a twelve-question bank for Execution and Reporting, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
