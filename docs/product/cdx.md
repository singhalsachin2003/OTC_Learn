---
title: "CDX Index"
description: "A basket of CDS in one tradable index"
permalink: /product/cdx/
---

# CDX Index

*A basket of CDS in one tradable index*

A single contract that behaves like a portfolio of credit default swaps on a fixed list of names. Rather than negotiating dozens of single-name trades, a buyer of index protection strikes one deal at one level and takes on an equally weighted slice of every constituent. Indices are the liquid end of the credit derivatives market — most days a position can be opened or closed in size in minutes, which is why they are the default instrument for a fast hedge or a macro view on credit.

[Open in the app](/OTC_Learn/) · [Credit](/OTC_Learn/category/credit/) · intermediate

## The lesson

### 1. What it is

A CDX is a tradable index built from a basket of single-name CDS (e.g. CDX.NA.IG), giving broad exposure to a segment of the credit market in one trade. CDX covers North American names; the European and Asian families are branded iTraxx. Buying protection on the index is one contract, not one contract per constituent.

> CDX.NA.IG holds 125 equally weighted investment-grade names on a 100bp coupon; CDX.NA.HY holds 100 high-yield names on a 500bp coupon. iTraxx Europe Main is also 125 names at 100bp.

### 2. How it works

The index carries a fixed coupon and weights its constituents equally, and like a single-name CDS it trades against that coupon with an upfront payment settling the difference from the traded level. If one name suffers a credit event it is removed from the index, the protection buyer is compensated for that name’s share of the notional through the same auction that settles single-name contracts, and the remaining notional continues on the surviving names — the index factor falls below 1 to reflect what has dropped out.

> Investment-grade indices are quoted in basis points of spread; high-yield indices are quoted as a price. CDX.NA.HY at 95 means the protection buyer pays five points upfront, because the index is trading wider than its 500bp coupon.

### 3. Why it’s used

It’s a far more efficient way to hedge or gain exposure to overall credit risk than trading dozens of single-name CDS individually. The index is more liquid than almost any of its constituents, its bid-offer is a fraction of what assembling the same names would cost, and size can be added or removed quickly — which is why a portfolio manager who wants less credit risk for a fortnight buys index protection rather than selling bonds.

### 4. Key terms

A new series rolls out roughly every six months with refreshed constituents; the newest is the on-the-run series and carries the most liquidity. Rolls happen in March and September, and names that have been downgraded out of the eligible universe, upgraded out of it or taken over drop away. Tranches let investors take exposure to specific loss layers of the basket — the 0–3% equity tranche absorbs the first defaults, while a senior tranche is untouched until losses climb past its attachment point.

> The index level is not the simple average of its constituents’ spreads. The gap between the two — the index basis, or skew — is itself a traded position.

### 5. Risks to watch

An index rarely matches a specific portfolio, so hedging with one leaves basis risk: the index can tighten in the same week the bonds actually held are widening. Older off-the-run series become hard to trade and expensive to exit. Tranche positions respond to default correlation as well as to spreads, so a tranche can lose money on a day when the index itself has barely moved.

## One default inside a 125-name index

- An investor buys $100m of protection on an equally weighted 125-name investment-grade index.
- Each constituent therefore carries 1/125 = 0.8% of the notional, or $800,000.
- The index coupon is 100bp, so the premium starts at $1m a year, paid quarterly.
- One name defaults and its auction final price is 30.
- The seller pays (100 − 30)% × $800,000 = $560,000, and that name leaves the index.
- The factor drops to 124/125 = 0.992, so the premium is now 100bp on $99.2m = $992,000 a year.

**A default settles like a small single-name CDS: only the defaulted constituent’s share pays out, and the contract carries on at a reduced notional rather than terminating.**

## Key terms

- **Series** — One vintage of the index, with a fixed constituent list and coupon, replaced by a new series at each roll.
- **On-the-run** — The most recently launched series, which concentrates almost all of the trading volume.
- **Index factor** — The proportion of the original notional still running after defaulted names have been stripped out.
- **Index coupon** — The fixed running premium the series pays — 100bp for investment-grade families, 500bp for high yield.
- **Tranche** — A slice of the basket’s losses between an attachment and a detachment point, sold as a separate contract.
- **Index basis** — The difference between the index level and the aggregate of its constituents’ single-name spreads.

## In practice

An insurer holding several hundred corporate bonds buys index protection to cut credit exposure ahead of a nervous few weeks, rather than selling paper it would struggle to buy back; macro funds trade the index outright as a view on the credit cycle; dealers use it to hedge the residual risk of bond inventory they cannot offset name by name. The main indices are cleared through a central counterparty and are among the few credit instruments with a continuous two-way market.

## Read next

- [Credit Default Swap](/OTC_Learn/product/cds/) — Insurance against a borrower defaulting
- [Total Return Swap](/OTC_Learn/product/trs/) — Rent the full return of an asset
- [Equity Swap](/OTC_Learn/product/eqswap/) — Swap equity returns for a funding rate

The app adds a twelve-question bank for CDX Index, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
