---
title: "Asset Swap"
description: "Turn a fixed-rate bond into a floating one"
permalink: /product/assetswap/
---

# Asset Swap

*Turn a fixed-rate bond into a floating one*

A package rather than a single instrument: a fixed-rate bond bought together with an interest rate swap that pays its coupon away and returns a floating rate in its place. What the holder is left with is the issuer’s credit risk expressed as a spread over SOFR, with the interest rate risk stripped out. That number — the asset swap spread — is the cash market’s price for the same default risk a CDS covers, which is why the two can be set side by side, and why the gap between them says something neither figure says alone.

[Open in the app](/OTC_Learn/) · [Credit](/OTC_Learn/category/credit/) · intermediate

## The lesson

### 1. What it is

An asset swap combines a fixed-rate bond with an interest rate swap so that the holder ends up receiving a floating rate instead of a fixed coupon. The investor buys the bond and, in the same trade with the same dealer, pays the bond’s coupon away on the swap and receives SOFR plus a spread in return. The swap is struck to the bond’s own maturity and coupon dates, so each fixed payment received on the bond goes straight out on the swap the day it arrives. What remains is a floating-rate exposure to one issuer’s credit.

### 2. How it works

In the standard par-par structure the investor pays par for the bond whatever it is actually worth, and the swap notional is par too. The asset swap spread then does two jobs at once. It carries the difference between the bond’s coupon and the market swap rate for that maturity, and it amortises the gap between par and the bond’s real price. A bond trading below par therefore asset-swaps at a wider spread, because the investor has overpaid at the outset and has to be compensated over the life of the trade. The alternative market-value structure sets the swap notional at the price actually paid, which avoids the over- or underpayment but leaves an untidy notional.

> Two points of overpayment is not two points of spread. Spread over a five-year annuity of about 4.5, it adds roughly 44 basis points a year to the asset swap spread.

### 3. Why it’s used

A bank or fund that wants credit exposure without a view on rates can hold the bond and be largely indifferent to where the curve goes, which is why bond portfolios are routinely asset-swapped on the way in. The second use is comparison. The asset swap spread and the CDS spread on the same issuer and maturity are two prices for the same default risk, and the difference between them — the CDS-bond basis, defined as the CDS spread minus the asset swap spread — is usually negative for investment-grade names. The bond has to be funded and consumes balance sheet while the swap does not, so the cash buyer demands more spread than the protection buyer pays. Pushing the other way, the protection buyer holds a cheapest-to-deliver option over the qualifying obligations, and a restructuring can trigger the CDS on a bond that keeps paying; a bond that is special in repo funds cheaply, which lifts its price and tightens its spread; and covenants the CDS does not respond to, such as a change-of-control put, do the same.

> The negative basis trade — buy the bond on asset swap, buy protection on the same issuer — is not free money. It only pays if the bond can be funded near the benchmark the spread is quoted over, and a repo rate 30bp above it outweighs a 24bp basis outright.

### 4. Key terms

Asset swap spread, the par-par and market-value structures, the annuity factor that turns an upfront price difference into a running spread, and the Z-spread, which measures much the same credit compensation against a zero-coupon curve rather than through a swap. The two are close but not equal — the asset swap spread comes out of a par-notional swap and the Z-spread out of the bond’s own discounted cashflows, so they drift apart as the price moves away from par. The CDS-bond basis is positive when protection costs more than the bond pays and negative when it costs less.

### 5. Risks to watch

The swap does not die with the bond. A plain asset swap has no credit termination, so an investor whose bond has defaulted is still paying fixed on a swap running to the original maturity and has to unwind it at whatever it is then worth — a loss if rates have fallen since the trade was struck. The dealer is a counterparty for that whole period, the swap leg generates margin calls while the bond does not, and the two legs are often documented separately, so selling the bond leaves a naked swap behind unless it is unwound at the same time.

> A par-par package hedged with protection on the same notional comes back to par after a credit event: the bond recovers the auction price and the protection pays par minus it. The interest rate swap is the piece left over.

## Asset-swapping a five-year bond, then comparing it with the CDS

- A fund buys $10m of a five-year corporate bond with a 5% annual coupon, trading in the market at 98.
- In a par-par asset swap the dealer delivers it at 100, so the fund pays $10m rather than $9.8m.
- On the swap the fund pays the 5% coupon away on $10m and receives SOFR plus a spread to the bond’s maturity.
- The five-year swap rate is 3.60%, so the coupon on its own is worth 140bp over it.
- The two points overpaid are recovered across five years: 2 points over an annuity of about 4.5 is 44bp a year.
- The asset swap spread is therefore about 140 + 44 = 184bp over SOFR.
- Five-year protection on the same issuer costs 160bp, so the basis is 160 − 184 = −24bp.

**The bond pays 24bp a year more than protection on the same issuer costs — the same credit, two different prices. Capturing that gap means funding $10m of bond, and a repo rate of SOFR + 30bp turns the trade into a 6bp loss.**

## Key terms

- **Asset swap spread** — The running spread over the floating benchmark the package pays, and the cash market’s measure of the issuer’s credit risk.
- **Par-par structure** — The standard form, in which the investor pays par for the bond and the swap notional is par, whatever the bond is actually worth.
- **Annuity factor** — The sum of the discount factors over the bond’s remaining life, which converts an upfront price difference into a running spread.
- **Z-spread** — The constant spread over the zero-coupon curve that makes a bond’s discounted cashflows equal its market price.
- **CDS-bond basis** — The CDS spread minus the asset swap spread on the same issuer and maturity, negative when the bond pays more than protection costs.
- **Repo specialness** — The premium a particular bond commands in the repo market, which cheapens the cost of funding it and tightens its asset swap spread.

## In practice

Bank treasury and credit portfolios asset-swap most of the fixed-rate paper they buy, so the position earns a spread over SOFR and the book carries credit risk rather than duration — new corporate issues are often marketed in asset swap terms for exactly that audience. Relative-value desks at hedge funds trade the CDS-bond basis directly, buying the bond on asset swap and protection against it when the basis is negative enough to survive their funding cost. Dealers quote the bond and its swap as one package rather than two trades.

## Read next

- [Credit Default Swap](/OTC_Learn/product/cds/) — Insurance against a borrower defaulting
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Total Return Swap](/OTC_Learn/product/trs/) — Rent the full return of an asset

The app adds a twelve-question bank for Asset Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Asset Swap — Par-par, and where the money goes, What the spread measures, The swap survives the bond — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
