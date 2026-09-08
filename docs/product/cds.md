---
title: "Credit Default Swap"
description: "Insurance against a borrower defaulting"
permalink: /product/cds/
---

# Credit Default Swap

*Insurance against a borrower defaulting*

A bilateral contract that pays out if a named borrower fails. One side buys protection on a reference entity and pays a premium for it; the other side sells that protection and pockets the premium until something goes wrong. It behaves like insurance, but neither party need own the underlying debt, and the buyer of protection is short credit risk — the position gains value as the market grows more worried about the name and loses value as that worry recedes.

[Open in the app](/OTC_Learn/) · [Credit](/OTC_Learn/category/credit/) · foundational

## The lesson

### 1. What it is

In a CDS, the protection buyer pays a periodic premium — quoted as a spread in basis points — to the protection seller, who pays out if a defined credit event occurs on a reference entity. The buyer is short credit risk: the contract gains value when the reference entity’s spread widens and loses value when it tightens. Nothing needs to be owned for this to work, and no bond changes hands at inception.

> Buying protection behaves like shorting the reference entity’s bond, while selling protection is economically close to owning that bond on borrowed money.

### 2. How it works

The premium is paid quarterly on the notional for as long as nothing goes wrong. Since the market standardised in 2009, contracts do not pay the traded spread as their coupon: they carry a fixed coupon of 100 or 500 basis points, and the gap between that coupon and where the name actually trades is settled as a single upfront payment when the trade is struck. If a credit event occurs the contract terminates and the seller compensates the buyer for the loss — the notional multiplied by one minus the recovery rate, which is set by an industry-wide auction rather than negotiated between the two parties.

> Coupons fall on 20 March, June, September and December and accrue ACT/360. Because the first coupon is paid in full, the seller rebates the buyer the amount accrued since the last of those dates when the trade settles.

### 3. Why it’s used

CDS let investors hedge credit risk on bonds or loans they hold, or take a view on a company’s creditworthiness without owning its debt. A bank can shrink its exposure to a borrower without selling the loan and damaging the relationship, and a fund can express a negative view on a company whose bonds are almost impossible to borrow and sell short. The contract is unfunded, so the position costs the upfront payment and margin rather than the price of a bond.

### 4. Key terms

Reference entity, spread in basis points, notional, and the credit event definition — typically bankruptcy, failure to pay, or restructuring. Most contracts written today are governed by the 2014 ISDA Credit Derivatives Definitions, which added governmental intervention as a credit event for financial reference entities after bail-ins wrote down subordinated bank debt without a conventional default. An ISDA Determinations Committee rules on whether an event has actually occurred, and its decision binds every contract on that name.

> Restructuring is not a trigger everywhere: North American corporate contracts normally trade without it, while European corporate contracts include it in a modified form.

### 5. Risks to watch

Protection is only as good as the seller, and wrong-way risk arises when the seller’s own health is correlated with the reference entity. Disputes over what counts as a credit event have gone to court, and spreads move constantly, creating mark-to-market swings and margin calls long before any default happens. A hedge can also fail on the fine print — protection written on a holding company does not automatically respond to the bonds of an operating subsidiary.

## Buying protection on a $10m bond holding

- A fund owns $10m of a company’s five-year senior bonds and buys five-year protection on the same notional.
- The contract carries the standard 100bp coupon, but the name trades at 250bp.
- The buyer pays that 150bp gap upfront: about 1.5% × 4.5 years of risk-adjusted premium = 6.75 points, or $675,000.
- It then pays 100bp a year on $10m — roughly $25,000 each quarter.
- Two years later the company defaults and the auction sets a final price of 40.
- The seller pays (100 − 40)% × $10m = $6m and the contract terminates.

**The defaulted bonds are worth $4m, and the $6m from the swap brings the fund back to roughly par — less the $675,000 upfront and the two years of coupons it paid to carry the protection.**

## Key terms

- **Reference entity** — The borrower whose default the contract is written on, identified together with the debt that qualifies for settlement.
- **Protection buyer** — The side paying the coupon and receiving the payout, which leaves it short the credit.
- **Standard coupon** — The fixed 100bp or 500bp running premium that standardised contracts pay instead of the traded spread.
- **Upfront payment** — The lump sum exchanged at inception that reconciles the fixed coupon with the level the name actually trades at.
- **Credit event** — The defined trigger — bankruptcy, failure to pay, restructuring and, for financials, governmental intervention — that terminates the contract.
- **Auction final price** — The single recovery price set by the industry auction, which every contract on that name settles against.

## In practice

A bank that has lent more to one borrower than its limits allow buys protection to free up the line without selling the loan and upsetting a client; a credit fund buys protection on a name it thinks is deteriorating and never touches the bonds at all; insurers and asset managers sell protection to earn spread on credits they would happily own. Standard index contracts are subject to mandatory clearing in both the US and the EU, and dealers run large offsetting single-name books behind the scenes.

## Read next

- [CDX Index](/OTC_Learn/product/cdx/) — A basket of CDS in one tradable index
- [Credit-Linked Note](/OTC_Learn/product/cln/) — A bond whose repayment depends on a credit event
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments

The app adds a twelve-question bank for Credit Default Swap, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Credit Default Swap — Fixed coupons and an upfront, Who decides a credit event happened, The auction, and what recovery really is — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
