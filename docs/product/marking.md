---
title: "Valuation and Marking"
description: "What a trade is worth, and which curve says so"
permalink: /product/marking/
---

# Valuation and Marking

*What a trade is worth, and which curve says so*

Every derivative position has to be valued fresh, every day, whether or not any cash is actually changing hands. Getting that number right takes two separate curves doing two separate jobs — one forecasting a floating leg’s future fixings, another discounting every cash flow back to the present — and which curve does the discounting is not a modelling detail but a direct consequence of the CSA the trade sits under. A swap struck exactly at the market rate is worth zero on day one for a reason, and that reason stops applying the moment either curve moves.

[Open in the app](/OTC_Learn/) · [Market Foundations](/OTC_Learn/category/foundations/) · intermediate

## The lesson

### 1. What it is

Every derivative carries a value long before it settles, and that value has to be produced fresh, every day, whether or not any cash actually moves. Where a position can be priced from quoted, observable market inputs it is marked to market; where it cannot — a bespoke structure, an illiquid tenor, an exotic payoff — it is marked to model, using a pricing model whose own inputs are themselves estimated. Both produce a number that feeds margin calls, P&L and risk limits, so getting the inputs right is not a back-office detail.

### 2. How it works

A swap’s value comes from two separate curves doing two separate jobs. A projection curve forecasts what each floating leg will actually fix at on each future reset date. A discount curve brings every cash flow on both legs — fixed and floating alike — back to a present value. Before the 2008 crisis a single curve, built off LIBOR, did both jobs at once, because LIBOR was treated as close enough to a risk-free rate that the distinction barely mattered. The crisis broke that assumption: LIBOR carried real bank credit risk that widened sharply exactly when it was least wanted, and the basis between different LIBOR tenors — and between LIBOR and a genuinely risk-free overnight rate — stopped being small enough to ignore. What replaced it is a true multi-curve framework: one curve per index for projection, and a discount curve that need not be built off any of them.

> The discount curve that replaced LIBOR is built from overnight index swaps — OIS — referencing SOFR, €STR or SONIA, because an overnight rate compounded daily carries negligible term credit risk, which is the property a discount curve actually needs.

### 3. Why it’s used

Which curve actually discounts a trade is not a modelling choice made in isolation — it follows the CSA. A collateralised trade is, in effect, funded by the collateral posted against it: post cash and receive the overnight rate on it, and that overnight rate is the true cost, or benefit, of holding the position, so it is also the correct rate to discount its future cash flows at. A trade collateralised in a different currency, or left uncollateralised altogether, discounts differently — and can therefore be worth a genuinely different number — even where every cash flow on the trade itself is identical. This is exactly the point the collateral module leaves half-said: the CSA is not only a credit document sitting alongside the trade, it is an input to what the trade is worth.

### 4. Key terms

Projection curve and discount curve are the two jobs a swap’s value depends on, and OIS discounting names what the discount curve is usually built from today. DV01 — sometimes PV01 — is the standard measure of how much a mark moves for a small change in rates, and mark-to-market and mark-to-model describe the two different ways a number actually gets produced.

### 5. Risks to watch

Mark-to-model is a judgement, not a fact, and the same trade can be marked two different ways by two honest desks using slightly different curves, volatility surfaces or correlation assumptions — which is exactly why two counterparties on the same collateralised trade can generate a margin dispute despite neither being wrong in any simple sense. That judgement can also be stretched: JPMorgan’s Chief Investment Office understated losses on a large CDX.NA.IG9 position for a period in early 2012 by favouring marks at the aggressive end of a defensible range, before roughly $6.2 billion in losses were eventually recognised in full. Discount-curve risk is quieter but constant: a book still running a legacy single-curve model, or discounting off the wrong collateral currency, will misvalue every trade in it by a small amount that never shows up as an obvious error.

## An at-market swap starts at zero, and does not stay there

- An asset manager enters a $100,000,000, five-year receive-fixed swap exactly at the market rate, so its present value at inception is $0 — the fixed and floating legs are worth exactly the same, discounted off the same curves.
- The swap’s DV01 — its dollar value for a one basis point move in the swap curve — is $48,500, meaning the position gains $48,500 for every 1bp the curve falls and loses the same for every 1bp it rises.
- A week later the swap curve has fallen by 12 basis points. The position’s value has moved by approximately 12 × $48,500 = $582,000, in the manager’s favour, because it is still receiving the old, now above-market fixed rate.
- Had the curve instead risen by 12bp, the same DV01 implies a loss of about $582,000 — the manager would be receiving a fixed rate now below what the market pays.

**The $0 on day one was never a permanent feature of the trade — it was true only because the swap was struck exactly at that day’s market rate, off that day’s curves. DV01 is the shorthand for how fast that number moves once either changes, and it is why a swap book is marked fresh every day rather than once at inception.**

## Key terms

- **Projection curve** — The curve used to forecast what a floating leg will actually fix at on each future reset date.
- **Discount curve** — The curve used to bring every cash flow on a trade, fixed and floating alike, back to a present value.
- **OIS discounting** — Discounting off a curve built from overnight index swaps, adopted after 2008 because an overnight rate carries negligible term credit risk — the property a discount curve needs.
- **DV01 (PV01)** — The dollar change in a position’s value for a one basis point move in the relevant curve, the standard measure of interest rate sensitivity.
- **Mark-to-market** — Valuing a position from directly observable, quoted market inputs.
- **Mark-to-model** — Valuing a position with a pricing model, used where no direct market quote exists and the model’s own inputs are themselves estimated.

## In practice

Every derivatives desk marks its book at least daily, feeding the same numbers into P&L, margin calls and risk limits, so a valuation model is shared infrastructure rather than one trader’s private tool. Product control and valuation control functions exist specifically to test front-office marks against independent curves and market data, precisely because a mark-to-model number is a judgement a trader has every incentive to lean one way on.

## Read next

- [Collateral and the CSA](/OTC_Learn/product/collateral/) — The cash and bonds that back an OTC exposure
- [Interest Rate Swap](/OTC_Learn/product/irs/) — Trade fixed for floating payments
- [Swaption](/OTC_Learn/product/swaption/) — An option on an interest rate swap

The app adds a twelve-question bank for Valuation and Marking, drawn differently every sitting, and a review queue for whatever you miss.

[Get OTC Learn on Google Play](https://play.google.com/store/apps/details?id=com.otclearn.app)

Educational content only. Nothing here is financial advice, an offer to trade, or a recommendation to buy or sell any instrument.
