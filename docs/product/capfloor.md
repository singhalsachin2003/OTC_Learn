---
title: "Cap and Floor"
description: "Set a ceiling or floor on a floating rate"
permalink: /product/capfloor/
---

# Cap and Floor

*Set a ceiling or floor on a floating rate*

Insurance on a floating rate. A cap is a strip of options that pays the holder whenever the reference rate sets above an agreed strike, so the reference rate a borrower effectively pays is capped at that level, with their credit margin still payable on top; a floor does the mirror image for someone receiving floating income. Unlike a swap, which fixes the rate in both directions, the buyer pays a premium up front and keeps the benefit if rates move their way.

[Open in the app](/OTC_Learn/) · [Interest Rate](/OTC_Learn/category/ir/) · intermediate

## The lesson

### 1. What it is

A cap is a series of options that pays out whenever a floating reference rate rises above a strike; a floor pays out when it falls below. Each individual option in the series is a caplet, or a floorlet, and the price of the cap is simply the sum of its caplets.

### 2. How it works

On every reset date the reference rate is compared with the strike. If a cap struck at 5% sees the rate set at 5.75%, the holder receives 0.75% on the notional for that period; if the rate sets below the strike, that caplet simply expires worthless.

> A caplet is measured against the rate for its period but paid at the end of it, like the loan interest it offsets. On SOFR and SONIA caps the rate compared with the strike is the overnight rate compounded across the period, so it is only known once the period has run.

### 3. Why it’s used

A borrower on floating-rate debt buys a cap to limit the worst-case interest bill while still benefiting if rates fall — something a swap cannot offer. An investor receiving floating income buys a floor to protect a minimum yield. The premium is the price of that asymmetry: a bought cap can only ever pay the holder, never cost them more than the premium.

### 4. Key terms

Strike, caplets and floorlets, notional, reset frequency, tenor and premium. Combining a bought cap with a sold floor creates a collar, which cuts the premium in exchange for giving up the benefit of rates falling below the floor.

> A bought cap and a sold floor at the same strike, on the same schedule, together pay exactly what a swap paying that fixed rate pays. That identity is how dealers cross-check cap and swap pricing.

### 5. Risks to watch

The premium is paid upfront and is lost entirely if the rate never breaches the strike. Sellers of caps and floors face open-ended exposure, and a collar’s sold leg reintroduces downside once the rate passes through the floor.

> Floating-rate loan agreements often contain a clause holding the reference rate at no less than zero. A borrower on such a loan has effectively sold a floor struck at 0% as part of the loan itself.

## Capping a floating-rate loan

- A company borrows £25m at SONIA + 1.50%, reset and paid quarterly.
- It buys a three-year cap on £25m struck at 4.50% for a premium of £450,000.
- In one 92-day quarter the reference rate sets at 5.30%, 0.80% above the strike.
- That caplet pays 0.80% × £25m × 92/365 = £50,411 on sterling ACT/365.
- Loan interest for the quarter is 6.80% × £25m × 92/365 = £428,493, so the net cost is £378,082.

**That net £378,082 is exactly 6.00% for the quarter — the 4.50% strike plus the 1.50% margin. In any quarter where the rate sets below 4.50% the cap pays nothing and the loan simply costs less, but the £450,000 premium is spent either way.**

## Key terms

- **Strike** — The rate above which a cap begins to pay out, or below which a floor does.
- **Caplet** — One option within a cap, covering a single reset period of the underlying schedule.
- **Floorlet** — One option within a floor, covering a single reset period of the underlying schedule.
- **Collar** — A bought cap combined with a sold floor, which cuts the net premium in exchange for giving up gains below the floor.
- **Premium** — The upfront cost of the cap or floor, paid whether or not any caplet ever pays out.
- **Reset frequency** — How often the reference rate is compared with the strike, which also sets how many caplets the strip contains.

## In practice

Property developers and leveraged borrowers are frequently required by their lenders to buy a cap as a condition of a floating-rate loan, so the interest bill can be stressed to a known maximum. Funds holding floating-rate notes buy floors to defend a minimum coupon, and treasurers who find the cap premium too expensive sell a floor against it to build a cheaper collar.

## Read next

- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap
- [OTC Equity Option](/OTC_Learn/product/eqopt/) — A custom, bilaterally negotiated option

The app adds a twelve-question bank for Cap and Floor, drawn differently every sitting, and a review queue for whatever you miss.

A subscription adds 3 further sections on Cap and Floor — A cap is a strip of caplets, Flat volatility and stripped volatility, Cap minus floor is a swap — and 12 more questions to its bank.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
