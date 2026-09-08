---
title: "Equity Swap"
description: "Swap equity returns for a funding rate"
permalink: /product/eqswap/
---

# Equity Swap

*Swap equity returns for a funding rate*

An equity swap exchanges the return on a share, a basket or an index for a funding rate on the same notional. One leg pays whatever the equity delivers over each period — the price move and, in a total return swap, the dividends — while the other pays a benchmark rate plus a spread. No shares change hands, so the receiver ends up with the economics of a shareholder without the shares, the vote or the settlement and custody that come with them.

[Open in the app](/OTC_Learn/) · [Equity](/OTC_Learn/category/equity/) · intermediate

## The lesson

### 1. What it is

One leg pays the equity return (price change plus dividends) on a notional; the other leg pays a fixed or floating interest rate. No shares change hands. The underlying can be a single stock, a custom basket or an index, and the two legs are documented as one contract under an ISDA master agreement.

> The legs need not share a currency: a quanto equity swap pays a foreign index return in the investor’s home currency at an exchange rate fixed at the outset.

### 2. How it works

At each reset the equity leg pays the percentage return since the previous reset, and the funding leg pays its rate. If the stock has fallen, the flow simply reverses and the equity-return receiver pays the loss across to the counterparty. The funding leg is normally an overnight benchmark such as SOFR or SONIA compounded over the period, plus a spread that reflects the dealer’s hedging and balance-sheet cost. On a hard-to-borrow name that spread is wider for a synthetic short, where the dealer has to source the borrow, and tighter for a synthetic long, whose hedge shares the dealer can lend out. Resets are commonly monthly or quarterly.

> With a resetting notional the period’s performance is paid in cash and the notional is re-struck at the new price, so exposure tracks the market value; with a fixed notional it does not, and the equivalent share count falls as the price rises.

### 3. Why it’s used

Investors gain equity exposure without owning shares — avoiding voting rights and getting different funding, tax, or balance-sheet treatment. Also used to hedge existing positions. A fund can be long a foreign index within a day without opening a local custody account, and can go short synthetically because the dealer, not the fund, arranges the stock borrow.

### 4. Key terms

Total return swaps include dividends; price return swaps do not. The financing leg is typically a benchmark rate plus a spread, and the notional may either reset with the equity value or stay fixed for the term. The dividend adjustment states what proportion of a declared dividend is passed through, which is often less than the gross amount where withholding tax applies.

> In the US a swap on a single share or a narrow index is a security-based swap overseen by the SEC, while one on a broad market index is a swap overseen by the CFTC.

### 5. Risks to watch

Positions are usually leveraged and marked frequently, so an adverse move brings margin calls. Actual dividends may differ from what was assumed at pricing, and building large synthetic stakes without disclosure has drawn sustained regulatory attention. In the UK, cash-settled positions count towards the major shareholding notifications that begin at 3% of voting rights, so a swap does not sidestep disclosure there.

> Archegos Capital Management built concentrated single-stock exposure through total return swaps; when the positions were unwound in March 2021 the dealers on the other side lost roughly $10bn between them.

## A fund buys index exposure without buying the index

- A fund receives the total return on $50m of an index and pays SOFR plus 40bp.
- Over the year the index returns 8% including dividends: it receives $4m.
- The funding leg costs 4.4% for the year, so it pays $2.2m.
- Net of the two legs the fund receives $4m − $2.2m = $1.8m.
- Had the index instead fallen 3%, it would pay $1.5m on the equity leg plus $2.2m of financing — $3.7m out.

**The fund earns the index return less its cost of funding, which is what a leveraged holder of the shares would earn. The swap changes who holds the stock, not the economics of holding it.**

## Key terms

- **Equity leg** — The side paying the return on the underlying share, basket or index over each period.
- **Financing leg** — The side paying a benchmark rate such as SOFR or SONIA plus an agreed spread.
- **Reset date** — The date on which the period’s equity return is calculated and the two legs settle.
- **Notional reset** — A feature that re-strikes the notional at the current price each period so exposure tracks market value.
- **Total return** — An equity leg that passes on dividends as well as price changes, unlike a price return leg.
- **Dividend adjustment** — The agreed proportion of a declared dividend passed through on the equity leg, often net of withholding tax.

## In practice

Hedge funds use equity swaps with a prime broker to run long and short books without settling every share, and asset managers use them to take index exposure in markets where opening local custody would be slow or costly. Dealers on the other side usually hedge by holding the underlying shares themselves.

## Read next

- [Contract for Difference](/OTC_Learn/product/cfd/) — Cash-settled exposure to a price move
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option
- [Total Return Swap](/OTC_Learn/product/trs/) — Rent the full return of an asset

The app adds a twelve-question bank for Equity Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Equity Swap — The borrow is the constraint, Resetting notionals and what they do to exposure, Dividends and corporate actions — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
