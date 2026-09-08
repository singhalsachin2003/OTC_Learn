---
title: "Dividend Swap"
description: "Trade dividends without owning the shares"
permalink: /product/divswap/
---

# Dividend Swap

*Trade dividends without owning the shares*

A dividend swap takes one component of an equity’s return — the cash it hands to shareholders — and makes it tradable on its own. One side pays a fixed amount agreed at the outset; the other pays whatever dividends the underlying index or share actually declares over an agreed period, usually a calendar year. The price of the underlying never enters the settlement. Because each year trades as its own contract, the strip of them forms a curve with a term structure of its own, and that curve has a persistent tilt: the far end trades below what anyone forecasts, because the people who most need to trade it are all on the same side.

[Open in the app](/OTC_Learn/) · [Equity](/OTC_Learn/category/equity/) · intermediate

## The lesson

### 1. What it is

A dividend swap exchanges the dividends an index or a share actually pays over an agreed period for a fixed amount agreed at the start. Nothing else about the equity comes with it: the underlying can double or halve and the payoff is unchanged. Index dividend swaps are quoted in dividend points — the contribution dividends make to the index level — and settle in cash once the period has finished.

> Standard contracts run to the end of a calendar year, so a strip of them — this year, next year, the year after — is quoted as a curve. Eurex listed dividend futures on the Euro Stoxx 50 in 2008, and the listed and OTC markets now trade side by side.

### 2. How it works

The buyer pays the fixed strike and receives the dividends that go ex-dividend inside the accrual period; the seller does the reverse. Settlement is a single cash payment shortly after the period ends, equal to realised dividends less the strike, multiplied by an agreed amount per point. Only ordinary cash dividends with an ex-date in the window count, and for an index they are converted into points using the same divisor the index itself uses. Each annual maturity trades separately, so the front contract barely moves once most of the year has been declared, while contracts several years out move on very little.

> Euro Stoxx 50 dividends are heavily concentrated in the second quarter, when most continental European companies pay a single annual dividend, so a large part of a calendar year’s total is already fixed by the summer.

### 3. Why it’s used

The market exists because someone has a position they did not ask for. A desk that sells autocallable notes hedges them with the underlying shares and ends up holding the dividends on those shares — a long dividend exposure that arrives as a by-product of hedging something else, and that the desk sells forward to be rid of. On the other side are funds prepared to be paid for taking it, and investors who want a view on what a company pays out without a view on what its shares do. That one-way hedging flow is why implied dividends at the long end sit persistently below bottom-up forecasts of the same years’ payouts: the seller has to trade, and the buyer has to be compensated for warehousing a risk few others want.

### 4. Key terms

The strike is the implied dividend — what that year can be traded at today. Realised dividends are what actually turns up, and the gap between the two is the whole trade. Around them sit the accrual period, the notional per point, and the curve of annual maturities. A single-name swap works identically, sized in shares and struck on dividends per share rather than index points.

> Nothing is paid until the period ends, so the strike is not a pure forecast: it also carries the discounting and the risk premium demanded for waiting several years to find out whether the forecast was right.

### 5. Risks to watch

A dividend is discretionary. A board can cut it to nothing in an afternoon, and it usually does so in exactly the conditions that are already hurting an equity book, so a long dividend position is not the diversifier its steady carry makes it look. In 2020 the ECB asked euro-area banks to suspend dividends and buybacks, the Bank of England’s PRA asked UK banks to do the same, and expectations for that year’s index dividends roughly halved within weeks. The long end is thin, so an unwanted position can be expensive to exit, and the OTC form leaves each side exposed to the other’s credit.

> A buyback is not a dividend. A company that switches from paying cash to repurchasing shares returns the same money to its shareholders and delivers nothing at all to a dividend swap.

## A suspension, seen from both sides

- A fund buys one calendar year of index dividends at a strike of 120 points, on €50,000 per point.
- It pays 120 points at settlement and receives whatever the index delivers, so it profits above 120 and loses below it.
- Payouts are suspended part way through the year and the index delivers 70 points.
- Settlement is (70 − 120) × €50,000 = −€2.5m, paid by the fund to the seller.
- Had dividends instead come in at 132 points, the fund would have received (132 − 120) × €50,000 = €600,000.

**Where the index itself finished never entered the calculation — only what it paid out. That is the appeal and the trap: the position is pure dividend risk, and dividends are cut in precisely the shock that is already costing the fund money elsewhere.**

## Key terms

- **Implied dividend** — The fixed strike at which a given year’s dividends can be traded today, before any of them are known.
- **Realised dividends** — The dividends that actually went ex-dividend during the accrual period, which the settlement is measured against.
- **Dividend points** — The contribution dividends make to an index level, the unit an index dividend swap is quoted and settled in.
- **Accrual period** — The window whose ex-dividend dates count — conventionally a single calendar year.
- **Dividend notional** — The cash amount paid per point of difference between realised dividends and the strike.
- **Dividend curve** — The strip of successive annual maturities, whose shape shows what the market will pay for each future year.

## In practice

The natural sellers are bank equity derivatives desks, left long dividend risk by hedging the autocallable notes they sell to private-bank and retail investors, and keen to pass it on. The buyers are hedge funds and multi-asset managers paid to hold a risk nobody else wants, alongside investors expressing a view on a payout rather than a share price. Euro Stoxx 50 dividends are the deepest part of the market, with listed futures trading alongside the OTC swap; single-name dividend swaps exist but trade thinly.

## Read next

- [Equity Swap](/OTC_Learn/product/eqswap/) — Swap equity returns for a funding rate
- [Autocallable Note](/OTC_Learn/product/autocall/) — A coupon note that can retire itself early
- [Commodity Swap](/OTC_Learn/product/cmswap/) — Fixed price for floating market price

The app adds a twelve-question bank for Dividend Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Dividend Swap — Three kinds of dividend, Where the supply comes from, Index points and their arithmetic — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
