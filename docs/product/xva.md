---
title: "XVA and Counterparty Risk"
description: "Why the same swap is never quite the same price twice"
permalink: /product/xva/
---

# XVA and Counterparty Risk

*Why the same swap is never quite the same price twice*

A swap’s textbook value — its legs discounted off the right curves — assumes both sides always pay in full and that funding is free. Neither is true, and XVA is the family of adjustments dealers add to price what that assumption leaves out: the cost of each side’s own default risk, and the cost of actually funding the trade and the margin it requires. None of it changes where the swap curve sits, which is exactly why two dealers can agree on rates and still quote two different prices.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · advanced

## The lesson

### 1. What it is

A swap’s textbook value — its fixed and floating legs discounted off the right curves — assumes both sides always pay in full and funding is free. Neither is true, and XVA is the collective name for the family of adjustments that price what the textbook value leaves out: the value of each side’s own default risk, and the cost of actually funding the trade and the collateral it requires. A dealer’s quoted price is the textbook value plus every XVA adjustment that applies, not the textbook value on its own.

### 2. How it works

Credit valuation adjustment, CVA, is the expected cost of the counterparty’s default: the market value, today, of the loss the dealer would take if the client defaulted while the trade were in the dealer’s favour, weighted by the client’s own credit spread and the trade’s expected future exposure. It is subtracted from the textbook value — a riskier counterparty means a worse price. Debit valuation adjustment, DVA, is CVA’s mirror on the dealer’s own credit: the value of the benefit the client gets from the dealer’s own default risk, which the client is not fully compensated against.

> A bank whose own credit spread widens can record a DVA gain, because the value of what it owes its counterparties has fallen — a frequently criticised feature of fair-value accounting, since realising that gain in practice would require the bank to actually default.

### 3. Why it’s used

Funding valuation adjustment, FVA, prices something CVA and DVA both leave out: actually funding the trade. An uncollateralised or partially collateralised position ties up the dealer’s own balance sheet, at the dealer’s own funding cost, for as long as the trade runs — a cost that has nothing to do with either side’s probability of default and everything to do with the price of cash. Margin valuation adjustment, MVA, is the same idea applied to initial margin specifically: posting IM into segregated custody under the uncleared margin rules ties up cash or eligible securities that themselves cost something to fund, for the life of the trade, and MVA prices that cost into the quote.

### 4. Key terms

CVA, DVA, FVA and MVA are the four adjustments this module has covered — credit risk on both sides, and the funding cost of the trade and its margin. Wrong-way risk names the case where a counterparty’s own default probability is correlated with the dealer’s exposure to it, the sharpest version of the problem CVA is built to price.

### 5. Risks to watch

XVA desks exist because these adjustments are themselves risks that move, not one-off numbers calculated at trade inception and forgotten: CVA changes as the counterparty’s credit spread moves and as the trade’s own exposure profile evolves, and a large book of CVA can itself need hedging with credit default swaps on the underlying counterparties. Wrong-way risk is the sharpest version of the problem — a hedge against an oil producer’s output that is deeply in the money exactly when low oil prices have also made that producer more likely to default, so the exposure and the credit risk worsen together rather than independently, and no single credit spread captures that correlation on its own. And every one of these adjustments is itself a modelling judgement, layering the same mark-to-model risk covered earlier onto a number that, unlike the trade’s core value, has no independently quoted market price to check it against.

## Four adjustments become one price

- A dealer prices a $50,000,000, ten-year swap that is exactly at the market rate, so its pure interest-rate value — ignoring credit and funding altogether — is $0.
- CVA — the expected cost of the client’s own default risk over the trade’s life — is calculated at $180,000, and is subtracted from the price.
- DVA — the mirror-image value of the dealer’s own default risk, which the client is not fully compensated against — is calculated at $60,000, and is added back.
- FVA — the cost of funding the uncollateralised part of the exposure over the trade’s life — is calculated at $95,000, and is subtracted.
- MVA — the cost of funding the initial margin the trade requires under the uncleared margin rules — is calculated at $40,000, and is subtracted too.
- The four adjustments net to $0 − $180,000 + $60,000 − $95,000 − $40,000 = −$255,000, the amount the dealer’s quoted price differs from the pure interest-rate value.

**None of the four numbers came from where the swap curve sits — they come from whose credit is on each side, how the trade is collateralised, and what it costs to fund the margin it requires. A second dealer with a lower funding cost, or facing a better-collateralised client, prices the identical swap to a different number for exactly these reasons, which is why two competitive quotes on one trade are rarely identical even when both desks agree on where rates are.**

## Key terms

- **XVA** — The family of valuation adjustments — credit, funding, margin and others — added to a trade’s textbook value to price what a frictionless, default-free assumption leaves out.
- **CVA** — Credit valuation adjustment: the expected cost of the counterparty’s own default risk, subtracted from the textbook value.
- **DVA** — Debit valuation adjustment: the mirror-image value of the dealer’s own default risk, which a deteriorating dealer can — controversially — book as a gain.
- **FVA** — Funding valuation adjustment: the cost of funding the uncollateralised part of a trade’s exposure over its life.
- **MVA** — Margin valuation adjustment: the cost of funding the initial margin a trade requires to be posted into segregated custody.
- **Wrong-way risk** — The case where a counterparty’s probability of default is itself correlated with the dealer’s exposure to it, so the two get worse together rather than independently.

## In practice

Every major dealer runs a dedicated XVA desk that prices and hedges these adjustments centrally across the whole trading book, rather than leaving each individual desk to price its own counterparty and funding risk trade by trade. A corporate treasurer negotiating a swap notices XVA only as a wider price than a textbook calculation would suggest — and as the reason a better-rated counterparty, or one prepared to post more collateral, is quoted a tighter one.

## Read next

- [Collateral and the CSA](/OTC_Learn/product/collateral/) — The cash and bonds that back an OTC exposure
- [Central Clearing](/OTC_Learn/product/clearing/) — A central counterparty steps into every trade
- [Credit Default Swap](/OTC_Learn/product/cds/) — Insurance against a borrower defaulting

The app adds a twelve-question bank for XVA and Counterparty Risk, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
