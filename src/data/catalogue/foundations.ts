import type { Product } from '../types';

/**
 * Market Foundations products. Not an asset class — the infrastructure the
 * other five run through: collateral, clearing, valuation and the legal
 * architecture that ties an OTC relationship together. Ids are stable —
 * saved progress is keyed by them.
 */
export const foundationsProducts: Product[] = [
  {
    id: 'collateral',
    categoryId: 'foundations',
    name: 'Collateral and the CSA',
    hook: 'The cash and bonds that back an OTC exposure',
    summary:
      'Two different kinds of margin answer two different questions, and almost every product in this catalogue leans on both without ever naming them. Variation margin settles what has already happened to a trade’s value; initial margin covers what could still happen before a defaulted counterparty’s positions are closed out. Both are set out in a Credit Support Annex, the document that turns a bilateral OTC exposure into a collateralised one — and, as later modules in this category show, decides more than just credit risk.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Variation margin settles what has already happened: it pays across the change in a portfolio’s mark-to-market so that neither side is ever sitting on an unrealised loss it has not been paid for. Initial margin covers what has not happened yet — the further loss that could build up between the last variation margin call and the time it actually takes to close out or replace a defaulted counterparty’s positions. Both are set out in the Credit Support Annex, the ISDA document that turns a bilateral OTC exposure into a collateralised one.',
        callout:
          'Before the crisis, initial margin on an uncleared trade was mostly a dealer-to-dealer practice. The 2013 BCBS-IOSCO framework — implemented in six phases between 2016 and 2022 — is what made it standard for a much wider population of market participants.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'A CSA sets a threshold — an amount of uncollateralised exposure each side is prepared to run before a call is even made — and a minimum transfer amount, below which a call is skipped to avoid shuffling small sums back and forth daily. It also names what counts as eligible collateral: cash in one or more approved currencies is universal, and many CSAs also accept government bonds, subject to a haircut that discounts the bond’s value to cover how far its price could move before it could actually be sold. Cash variation margin is routinely rehypothecated — the receiving party can use it as its own, rather than ring-fencing it — while segregated initial margin, held with a third-party custodian precisely so it cannot be reused, is not.',
        callout:
          'Haircuts scale with maturity and credit quality under the standardised BCBS-IOSCO schedule: a few percent for a short-dated, highly-rated government bond, more for a longer-dated or lower-rated one — the buffer is sized to how far the bond’s price could move before it could be sold.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'None of this is only about credit protection. Which currency’s cash a CSA lets a party post — and which the two sides actually use — decides the rate a collateralised trade is discounted at, so the CSA is a valuation input as much as a credit document, not merely a backstop bolted on afterwards. The crisis exposed how much uncollateralised or lightly-margined exposure the market had been carrying, and the years since have pushed practice toward daily variation margin calls and thresholds at or near zero, first informally among dealers and then as a regulatory requirement for a much wider population of counterparties.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Threshold, minimum transfer amount, eligible collateral and haircut define how a CSA actually calls and takes margin day to day. Variation margin and initial margin answer the two different questions this module opened with, and rehypothecation is the dividing line in how each is actually held once posted.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A CSA reduces credit risk; it does not remove it. The margin period of risk — the gap between the last good variation margin call and the point a defaulted counterparty’s positions are actually replaced — is exactly what initial margin is sized to cover, and it can be badly underestimated in a fast-moving, illiquid market. Rehypothecated collateral is a general claim on the receiving firm’s estate if that firm fails, not a ring-fenced asset, which is precisely what segregated initial margin custody is designed to avoid instead. And margin itself has to be funded: a large adverse move can generate a collateral call that consumes liquidity long before the underlying trade would ever have paid out.',
        callout:
          'Regulatory initial margin for uncleared derivatives phased in over six stages between September 2016 and September 2022, working down from the very largest dealers to firms with an aggregate notional above roughly €8 billion. A €50 million initial margin threshold exists below which two counterparties need not exchange it at all — a deliberate carve-out to keep the regime from burdening every small end-user relationship.',
      },
    ],
    keyTerms: [
      {
        term: 'Variation margin (VM)',
        definition:
          'Collateral that settles the change in a portfolio’s mark-to-market, so neither side carries an unpaid gain or loss.',
      },
      {
        term: 'Initial margin (IM)',
        definition:
          'Collateral sized to cover the potential further loss between the last variation margin call and the time it takes to close out a defaulted counterparty.',
      },
      {
        term: 'Threshold',
        definition:
          'The amount of uncollateralised exposure a CSA lets each side run before a margin call is triggered at all.',
      },
      {
        term: 'Minimum transfer amount (MTA)',
        definition:
          'The minimum size a call must reach before it is actually made, so small movements are not settled daily.',
      },
      {
        term: 'Haircut',
        definition:
          'The discount applied to non-cash collateral’s value, sized to the risk that its price falls before it can be sold.',
      },
      {
        term: 'Rehypothecation',
        definition:
          'The right to reuse collateral received as if it were the receiving firm’s own, rather than ring-fencing it — routine for cash variation margin, prohibited for segregated initial margin.',
      },
    ],
    example: {
      title: 'A CSA calls margin, day by day',
      lines: [
        'Two dealers run a CSA on their swap portfolio: zero threshold, a $100,000 minimum transfer amount, daily variation margin in cash.',
        'On day one the portfolio’s mark-to-market moves to $3,200,000 in Bank A’s favour, with no collateral yet posted, so Bank A calls the full $3,200,000 and Bank B pays it.',
        'On day two the mark moves further, to $3,650,000 in Bank A’s favour. The shortfall against collateral already held is $3,650,000 − $3,200,000 = $450,000, above the MTA, so Bank A calls again and Bank B posts the extra $450,000.',
        'On day three the mark moves only to $3,690,000. The shortfall is $3,690,000 − $3,650,000 = $40,000 — below the $100,000 MTA — so no call is made, and Bank A carries a small uncollateralised exposure until a later move takes the cumulative shortfall past the MTA.',
      ],
      takeaway:
        'None of this involved initial margin at all. Variation margin only ever settles what has already happened, to whatever the threshold and MTA allow through; initial margin, calculated and posted separately into segregated custody, is what stands behind the risk that Bank B defaults before Bank A can call — and collect — the next one.',
    },
    inPractice:
      'Every dealer relationship and most buy-side-to-dealer relationships now run on a CSA, calling variation margin daily against the current mark and, for the largest counterparty pairs, exchanging initial margin into segregated custodian accounts under the uncleared margin rules. Treasury and collateral management desks exist purely to manage this — sourcing eligible collateral, optimising which asset to post against which CSA, and funding the calls a big move in rates or credit can generate overnight.',
    relatedProductIds: ['isda', 'marking', 'irs'],
    quiz: [
      {
        id: 'collateral-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Variation margin and initial margin cover the same risk, just at different times.',
        correctAnswer: false,
        explanation:
          'They answer different questions: VM settles what has already happened to the mark-to-market, IM covers what could still happen before a defaulted counterparty’s positions can be closed out.',
      },
      {
        id: 'collateral-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A Credit Support Annex is the document that sets out how margin is called and held under an ISDA relationship.',
        correctAnswer: true,
        explanation:
          'It is where the threshold, MTA, eligible collateral and everything else in this lesson is actually written down.',
      },
      {
        id: 'collateral-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What does initial margin specifically protect against?',
        options: [
          'The loss that could build up between the last VM call and the close-out of a defaulted counterparty',
          'The current mark-to-market value of the portfolio',
          'The counterparty’s credit rating falling',
          'The cost of funding the trade itself',
        ],
        correctIndex: 0,
        explanation:
          'That gap — the margin period of risk — is exactly what VM alone does not cover.',
      },
      {
        id: 'collateral-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'A minimum transfer amount stops very small changes in exposure from triggering a margin call.',
        correctAnswer: true,
        explanation:
          'Below the MTA a call is simply skipped, to avoid moving small sums back and forth every day.',
      },
      {
        id: 'collateral-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'Why does a government bond posted as collateral carry a haircut?',
        options: [
          'To compensate the poster for the bond’s coupon',
          'To cover the risk that the bond’s price falls before it could actually be sold',
          'Because bonds cannot legally be posted at full face value',
          'To convert its value into the currency of the exposure',
        ],
        correctIndex: 1,
        explanation:
          'The haircut is a buffer against the collateral’s own price risk, not a fee or a currency conversion.',
      },
      {
        id: 'collateral-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'What is rehypothecation?',
        options: [
          'Posting the same collateral to two different counterparties at once',
          'A second, backup collateral call made if the first is disputed',
          'The right to reuse collateral received as if it were the receiving firm’s own',
          'The process of returning collateral once a trade matures',
        ],
        correctIndex: 2,
        explanation:
          'It is routine for cash variation margin and specifically prohibited for segregated initial margin.',
      },
      {
        id: 'collateral-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The CSA only affects credit risk — it has no bearing on how a trade is valued.',
        correctAnswer: false,
        explanation:
          'The currency a trade is actually collateralised in decides the rate it is discounted at, which is why the CSA is a valuation input as much as a credit document.',
      },
      {
        id: 'collateral-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What changed in collateral practice after the 2008 crisis?',
        options: [
          'Initial margin was abolished as too costly',
          'CSAs stopped naming eligible collateral and accepted only cash',
          'Margin calls became optional for dealer-to-dealer trades',
          'Variation margin moved toward daily calls and thresholds at or near zero',
        ],
        correctIndex: 3,
        explanation:
          'The crisis exposed how much lightly-margined exposure the market had been carrying, and practice — later regulation — tightened accordingly.',
      },
      {
        id: 'collateral-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A threshold is the amount of uncollateralised exposure a CSA allows before a call is triggered at all.',
        correctAnswer: true,
        explanation:
          'Below the threshold, no margin changes hands even though there is a real mark-to-market gain or loss.',
      },
      {
        id: 'collateral-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which of these is true of cash variation margin under a typical CSA?',
        options: [
          'It cannot be reused by the party that receives it',
          'It is routinely rehypothecated by the party that receives it',
          'It must be held with a segregated third-party custodian',
          'It is only ever posted, never received back',
        ],
        correctIndex: 1,
        explanation:
          'Cash VM is generally treated as the receiving party’s own money to use, unlike segregated initial margin.',
      },
      {
        id: 'collateral-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Collateral that has been rehypothecated is a ring-fenced asset if the firm holding it fails.',
        correctAnswer: false,
        explanation:
          'It becomes a general claim on that firm’s estate — ring-fencing is exactly what segregated initial margin custody is designed to provide instead.',
      },
      {
        id: 'collateral-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Regulatory initial margin for uncleared derivatives was phased in over how many stages, and down to roughly what size of counterparty?',
        options: [
          'Two stages, covering only the ten largest global dealers',
          'One stage, applying to every counterparty simultaneously from 2016',
          'Six stages, down to firms with an aggregate notional above roughly €8 billion',
          'Six stages, but only for centrally cleared trades',
        ],
        correctIndex: 2,
        explanation:
          'The phase-in ran from September 2016 to September 2022, working down from the largest dealers to a much wider population of end users.',
      },
    ],
  },
  {
    id: 'clearing',
    categoryId: 'foundations',
    name: 'Central Clearing',
    hook: 'A central counterparty steps into every trade',
    summary:
      'Central clearing replaces a bilateral trade with two trades and a new counterparty standing in the middle of both. When a cleared trade is submitted, the clearing house is novated into it — buyer to every seller and seller to every buyer — so neither original party ever faces the other again. The G20 asked for exactly this after 2008, and the machinery that makes it safe to concentrate so much risk in one institution is a strict, publicly documented order in which a default is actually paid for.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Central clearing replaces a single bilateral trade with two trades facing a central counterparty, or CCP. When a cleared trade is submitted, the CCP is novated into it, stepping in as buyer to every seller and seller to every buyer, so each original counterparty now faces the CCP rather than each other. Novation is a full legal substitution, not a guarantee bolted onto the original trade — the original bilateral contract is replaced entirely, not merely backstopped.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Only a clearing member can face the CCP directly, so most market participants access clearing through one: a bank that is itself a member clears the trade on the client’s behalf, in a segregated account, and stands between the client and the CCP exactly as the CCP stands between clearing members. That relationship carries its own margin and default provisions layered on top of the CCP’s own, and a client’s positions can in principle be ported to another clearing member if its own clearer fails, provided a replacement can be found in time.',
        callout:
          'Portability is the whole point of client segregation, but it depends on another clearing member being both willing and able to take the position on within the time the CCP allows — not a guaranteed outcome, only a designed-for one.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'At the 2009 Pittsburgh summit the G20 committed to having standardised OTC derivatives traded on exchanges or electronic platforms where appropriate, cleared through central counterparties, and reported to trade repositories — a direct response to how opaque and interconnected the bilateral derivatives market had turned out to be in the crisis. An identical swap can still price differently cleared versus bilateral, because the two are not the same trade in every respect that matters to its value: discounting, margin and capital treatment all differ between a CCP’s standard terms and a given bilateral CSA, so the economics of the position, not just its counterparty, change with the venue.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Novation is the legal mechanism that makes clearing possible at all. Clearing member and client clearing describe how a participant without direct CCP access still gets there. The default waterfall is the sequence a CCP’s financial resources are drawn on when a member defaults, and the guaranty fund and the CCP’s own skin in the game are the layers that sequence is built from.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'A clearing member’s own default has to happen before any of this machinery is triggered — the waterfall exists to absorb exactly that event, not to protect against ordinary market moves, which variation margin already handles. Mutualisation is the point of the guaranty fund and also its risk: a default large enough to exhaust the defaulter’s own resources and the CCP’s skin in the game draws on money contributed by clearing members that had nothing to do with the default at all. Concentrating so much of the market’s risk in a small number of CCPs also concentrates the consequences of one failing badly — which is exactly why the waterfall is public, tested and watched as closely by clearing members as by regulators.',
        callout:
          'A clearing member defaulting is rare enough that, in practice, a CCP’s default fund is almost never actually drawn on — it is sized for extreme tail events that margin alone is not expected to cover.',
      },
    ],
    keyTerms: [
      {
        term: 'Novation',
        definition:
          'The legal substitution of the CCP into a trade as counterparty to each side, replacing the original bilateral contract entirely.',
      },
      {
        term: 'Clearing member',
        definition:
          'A firm that faces the CCP directly; most market participants access clearing through one rather than joining themselves.',
      },
      {
        term: 'Client clearing',
        definition:
          'A clearing member facing the CCP on a client’s behalf, in a segregated account, with its own layer of margin and default provisions on top of the CCP’s.',
      },
      {
        term: 'Default waterfall',
        definition:
          'The strict order in which a CCP’s financial resources absorb a defaulting member’s losses, ending only after the defaulter’s own resources and the CCP’s own capital are exhausted.',
      },
      {
        term: 'Guaranty fund',
        definition:
          'The mutualised pool of collateral, contributed by every clearing member, that sits behind the CCP’s own capital as the last layer before further assessments.',
      },
      {
        term: 'Skin in the game',
        definition:
          'The CCP’s own capital contribution to the waterfall, placed ahead of the mutualised guaranty fund so the CCP shares directly in the cost of a default it failed to price correctly.',
      },
    ],
    example: {
      title: 'A member default works through the waterfall',
      lines: [
        'A clearing member defaults, and closing out its portfolio crystallises a $180,000,000 loss beyond its posted variation margin.',
        'The defaulter’s own initial margin of $120,000,000 is used first, cutting the uncovered loss to $60,000,000.',
        'Its contribution to the guaranty fund, $25,000,000, is used next, cutting the loss to $35,000,000.',
        'The CCP’s own capital — its skin in the game — covers $10,000,000 of it, leaving $25,000,000.',
        'The mutualised guaranty fund, built from every other clearing member’s contribution, absorbs the remaining $25,000,000 in full.',
      ],
      takeaway:
        'Every layer before the last one belongs to the defaulter or the CCP itself; only the final $25,000,000 was ever anyone else’s money, and it was the last resort, not the first. A loss any larger than $180,000,000 would have started drawing on further assessments against the surviving members — the reason clearing members watch a CCP’s waterfall as closely as their own risk.',
    },
    inPractice:
      'Nearly all standardised interest rate swaps and index CDS now clear through CCPs such as LCH, CME or ICE, following the G20 mandate; end users reach them through a clearing member, almost always a large bank, rather than joining directly. Buy-side risk teams monitor their clearing member’s own financial strength as closely as the CCP’s, because a clearing member’s own default is the first thing that has to go wrong before any of this machinery is triggered at all.',
    relatedProductIds: ['isda', 'collateral', 'cdx'],
    quiz: [
      {
        id: 'clearing-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Central clearing replaces a single bilateral trade with two trades facing a central counterparty.',
        correctAnswer: true,
        explanation:
          'Novation substitutes the CCP as buyer to the seller and seller to the buyer, so neither original party faces the other any longer.',
      },
      {
        id: 'clearing-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Novation adds the CCP as a guarantor alongside the original bilateral contract.',
        correctAnswer: false,
        explanation:
          'It is a full legal substitution — the original contract is replaced, not merely guaranteed.',
      },
      {
        id: 'clearing-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'What happens to the original bilateral contract when a trade is novated to a CCP?',
        options: [
          'It is replaced entirely by two new contracts facing the CCP',
          'It continues to exist alongside a new CCP guarantee',
          'It is suspended until the CCP confirms the trade',
          'It converts automatically into a cleared future',
        ],
        correctIndex: 0,
        explanation:
          'Novation is a full substitution, which is exactly why each side now faces the CCP’s credit rather than the other’s.',
      },
      {
        id: 'clearing-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Most market participants access central clearing directly, without going through a clearing member.',
        correctAnswer: false,
        explanation:
          'Only clearing members face the CCP directly; most participants clear through one, in a client account.',
      },
      {
        id: 'clearing-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'What does a clearing member do for a client that clears through it?',
        options: [
          'Lends the client the notional of every cleared trade',
          'Faces the CCP on the client’s behalf, layering its own margin and default provisions on top of the CCP’s',
          'Guarantees the client against any loss on the cleared position',
          'Replaces the CCP as the client’s counterparty entirely',
        ],
        correctIndex: 1,
        explanation:
          'The client’s exposure runs through the clearing member to the CCP, with an extra layer of protection — and an extra relationship to manage — in between.',
      },
      {
        id: 'clearing-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why might a client’s cleared position need to be ported to a different clearing member?',
        options: [
          'Because CCPs require clients to rotate clearing members annually',
          'Because the trade’s notional has grown beyond the original member’s limit',
          'Because its own clearing member has defaulted',
          'Because the CCP has changed its margin methodology',
        ],
        correctIndex: 2,
        explanation:
          'Portability exists precisely for that scenario, though it depends on a replacement clearing member being willing and able to take the position on.',
      },
      {
        id: 'clearing-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The G20 committed in 2009 to have standardised OTC derivatives cleared through central counterparties.',
        correctAnswer: true,
        explanation:
          'The Pittsburgh summit set out exactly that, alongside trading on exchanges or electronic platforms and reporting to trade repositories.',
      },
      {
        id: 'clearing-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why can an identical swap price differently cleared versus bilateral?',
        options: [
          'Cleared swaps have a different notional convention',
          'Cleared swaps are always quoted in a different currency',
          'Bilateral swaps cannot reference the same floating index as cleared ones',
          'Discounting, margin and capital treatment all differ between a CCP’s terms and a given bilateral CSA',
        ],
        correctIndex: 3,
        explanation:
          'The economics of a swap depend on what collateral terms discount it and what capital it consumes, and cleared and bilateral trades answer both questions differently.',
      },
      {
        id: 'clearing-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A CCP’s default waterfall uses the defaulting member’s own resources before touching anyone else’s.',
        correctAnswer: true,
        explanation:
          'Its initial margin and guaranty fund contribution are used first — the defaulter pays for its own default before the wider system is touched.',
      },
      {
        id: 'clearing-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What is a CCP’s “skin in the game”?',
        options: [
          'The total initial margin held across all clearing members',
          'The CCP’s own capital contribution, placed ahead of the mutualised guaranty fund in the waterfall',
          'The insurance policy a CCP buys against its own default',
          'The clearing member with the largest guaranty fund contribution',
        ],
        correctIndex: 1,
        explanation:
          'It sits after the defaulter’s own resources and before the mutualised fund, giving the CCP a direct stake in getting its own risk management right.',
      },
      {
        id: 'clearing-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'A clearing member’s own default is required before a CCP’s default waterfall is ever triggered.',
        correctAnswer: true,
        explanation:
          'The waterfall exists to absorb a member default specifically — it has no role to play if every member is meeting its obligations.',
      },
      {
        id: 'clearing-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'What is the risk in a CCP’s mutualised guaranty fund?',
        options: [
          'It cannot legally be used to cover any default',
          'It is held by the defaulting member itself',
          'Non-defaulting members can end up sharing losses caused by another member entirely',
          'It only covers losses on cleared FX products',
        ],
        correctIndex: 2,
        explanation:
          'Mutualisation is the point — and the risk: a large enough default draws on money contributed by firms that had nothing to do with it.',
      },
    ],
  },
  {
    id: 'marking',
    categoryId: 'foundations',
    name: 'Valuation and Marking',
    hook: 'What a trade is worth, and which curve says so',
    summary:
      'Every derivative position has to be valued fresh, every day, whether or not any cash is actually changing hands. Getting that number right takes two separate curves doing two separate jobs — one forecasting a floating leg’s future fixings, another discounting every cash flow back to the present — and which curve does the discounting is not a modelling detail but a direct consequence of the CSA the trade sits under. A swap struck exactly at the market rate is worth zero on day one for a reason, and that reason stops applying the moment either curve moves.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Every derivative carries a value long before it settles, and that value has to be produced fresh, every day, whether or not any cash actually moves. Where a position can be priced from quoted, observable market inputs it is marked to market; where it cannot — a bespoke structure, an illiquid tenor, an exotic payoff — it is marked to model, using a pricing model whose own inputs are themselves estimated. Both produce a number that feeds margin calls, P&L and risk limits, so getting the inputs right is not a back-office detail.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'A swap’s value comes from two separate curves doing two separate jobs. A projection curve forecasts what each floating leg will actually fix at on each future reset date. A discount curve brings every cash flow on both legs — fixed and floating alike — back to a present value. Before the 2008 crisis a single curve, built off LIBOR, did both jobs at once, because LIBOR was treated as close enough to a risk-free rate that the distinction barely mattered. The crisis broke that assumption: LIBOR carried real bank credit risk that widened sharply exactly when it was least wanted, and the basis between different LIBOR tenors — and between LIBOR and a genuinely risk-free overnight rate — stopped being small enough to ignore. What replaced it is a true multi-curve framework: one curve per index for projection, and a discount curve that need not be built off any of them.',
        callout:
          'The discount curve that replaced LIBOR is built from overnight index swaps — OIS — referencing SOFR, €STR or SONIA, because an overnight rate compounded daily carries negligible term credit risk, which is the property a discount curve actually needs.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Which curve actually discounts a trade is not a modelling choice made in isolation — it follows the CSA. A collateralised trade is, in effect, funded by the collateral posted against it: post cash and receive the overnight rate on it, and that overnight rate is the true cost, or benefit, of holding the position, so it is also the correct rate to discount its future cash flows at. A trade collateralised in a different currency, or left uncollateralised altogether, discounts differently — and can therefore be worth a genuinely different number — even where every cash flow on the trade itself is identical. This is exactly the point the collateral module leaves half-said: the CSA is not only a credit document sitting alongside the trade, it is an input to what the trade is worth.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Projection curve and discount curve are the two jobs a swap’s value depends on, and OIS discounting names what the discount curve is usually built from today. DV01 — sometimes PV01 — is the standard measure of how much a mark moves for a small change in rates, and mark-to-market and mark-to-model describe the two different ways a number actually gets produced.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Mark-to-model is a judgement, not a fact, and the same trade can be marked two different ways by two honest desks using slightly different curves, volatility surfaces or correlation assumptions — which is exactly why two counterparties on the same collateralised trade can generate a margin dispute despite neither being wrong in any simple sense. That judgement can also be stretched: JPMorgan’s Chief Investment Office understated losses on a large CDX.NA.IG9 position for a period in early 2012 by favouring marks at the aggressive end of a defensible range, before roughly $6.2 billion in losses were eventually recognised in full. Discount-curve risk is quieter but constant: a book still running a legacy single-curve model, or discounting off the wrong collateral currency, will misvalue every trade in it by a small amount that never shows up as an obvious error.',
      },
    ],
    keyTerms: [
      {
        term: 'Projection curve',
        definition:
          'The curve used to forecast what a floating leg will actually fix at on each future reset date.',
      },
      {
        term: 'Discount curve',
        definition:
          'The curve used to bring every cash flow on a trade, fixed and floating alike, back to a present value.',
      },
      {
        term: 'OIS discounting',
        definition:
          'Discounting off a curve built from overnight index swaps, adopted after 2008 because an overnight rate carries negligible term credit risk — the property a discount curve needs.',
      },
      {
        term: 'DV01 (PV01)',
        definition:
          'The dollar change in a position’s value for a one basis point move in the relevant curve, the standard measure of interest rate sensitivity.',
      },
      {
        term: 'Mark-to-market',
        definition:
          'Valuing a position from directly observable, quoted market inputs.',
      },
      {
        term: 'Mark-to-model',
        definition:
          'Valuing a position with a pricing model, used where no direct market quote exists and the model’s own inputs are themselves estimated.',
      },
    ],
    example: {
      title: 'An at-market swap starts at zero, and does not stay there',
      lines: [
        'An asset manager enters a $100,000,000, five-year receive-fixed swap exactly at the market rate, so its present value at inception is $0 — the fixed and floating legs are worth exactly the same, discounted off the same curves.',
        'The swap’s DV01 — its dollar value for a one basis point move in the swap curve — is $48,500, meaning the position gains $48,500 for every 1bp the curve falls and loses the same for every 1bp it rises.',
        'A week later the swap curve has fallen by 12 basis points. The position’s value has moved by approximately 12 × $48,500 = $582,000, in the manager’s favour, because it is still receiving the old, now above-market fixed rate.',
        'Had the curve instead risen by 12bp, the same DV01 implies a loss of about $582,000 — the manager would be receiving a fixed rate now below what the market pays.',
      ],
      takeaway:
        'The $0 on day one was never a permanent feature of the trade — it was true only because the swap was struck exactly at that day’s market rate, off that day’s curves. DV01 is the shorthand for how fast that number moves once either changes, and it is why a swap book is marked fresh every day rather than once at inception.',
    },
    inPractice:
      'Every derivatives desk marks its book at least daily, feeding the same numbers into P&L, margin calls and risk limits, so a valuation model is shared infrastructure rather than one trader’s private tool. Product control and valuation control functions exist specifically to test front-office marks against independent curves and market data, precisely because a mark-to-model number is a judgement a trader has every incentive to lean one way on.',
    relatedProductIds: ['collateral', 'irs', 'swaption'],
    quiz: [
      {
        id: 'marking-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Every derivative position has to be valued fresh, even on days when no cash actually changes hands.',
        correctAnswer: true,
        explanation:
          'Marking happens daily regardless of settlement dates, because margin calls, P&L and risk limits all depend on a current number.',
      },
      {
        id: 'marking-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Mark-to-model is only used for bespoke or illiquid trades that have no directly observable market price.',
        correctAnswer: true,
        explanation:
          'Where a quoted market input exists it is used directly — mark-to-model steps in only where one does not.',
      },
      {
        id: 'marking-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'What is the key difference between mark-to-market and mark-to-model?',
        options: [
          'Mark-to-market prices from directly observable inputs; mark-to-model relies on a pricing model with estimated inputs',
          'Mark-to-market is used only for cleared trades',
          'Mark-to-model is only legal for exchange-traded instruments',
          'There is no practical difference — both terms describe the same process',
        ],
        correctIndex: 0,
        explanation:
          'The distinction is about where the inputs come from, not about which trades are more important.',
      },
      {
        id: 'marking-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Before 2008, a single curve built off LIBOR was commonly used for both projecting floating rates and discounting cash flows.',
        correctAnswer: true,
        explanation:
          'The crisis broke the assumption that made that acceptable — that LIBOR was close enough to risk-free for the distinction not to matter.',
      },
      {
        id: 'marking-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'What does a projection curve do?',
        options: [
          'Discounts every cash flow on a trade back to a present value',
          'Forecasts what a floating leg will actually fix at on future reset dates',
          'Converts a fixed rate into an equivalent floating spread',
          'Sets the haircut applied to posted collateral',
        ],
        correctIndex: 1,
        explanation:
          'Forecasting future fixings is the projection curve’s job; discounting is a separate curve’s job entirely.',
      },
      {
        id: 'marking-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why is a discount curve typically built from OIS rather than a term lending rate like LIBOR?',
        options: [
          'OIS rates are published further in advance',
          'OIS is the only rate regulators permit for discounting',
          'An overnight rate carries negligible term credit risk, which is exactly what a discount curve needs',
          'OIS rates move less than LIBOR, so the maths is simpler',
        ],
        correctIndex: 2,
        explanation:
          'A term lending rate embeds real credit risk over its term; an overnight rate, reset daily, essentially does not.',
      },
      {
        id: 'marking-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'The discount curve used to value a trade is decided purely by the trade’s currency, regardless of its CSA.',
        correctAnswer: false,
        explanation:
          'It follows the CSA — specifically what collateral is actually posted and what rate it earns — not the trade’s currency alone.',
      },
      {
        id: 'marking-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'Why does a collateralised trade discount at the rate the posted collateral earns?',
        options: [
          'Because regulators mandate a single discount rate for all collateralised trades',
          'Because the collateral itself is a separate tradable instrument',
          'Because it matches the rate used to compute the initial margin',
          'Because that rate is the real funding cost, or benefit, of holding the position',
        ],
        correctIndex: 3,
        explanation:
          'The economics of the collateral are the economics of the trade, which is why the CSA is a valuation input and not only a credit document.',
      },
      {
        id: 'marking-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'DV01 measures the dollar change in a position’s value for a one basis point move in the relevant curve.',
        correctAnswer: true,
        explanation:
          'It is the standard shorthand for interest rate sensitivity, whatever the underlying instrument.',
      },
      {
        id: 'marking-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'A swap has a DV01 of $48,500. What does that mean?',
        options: [
          'The swap’s total value is $48,500',
          'The swap’s value moves by about $48,500 for a 1bp move in the swap curve',
          'The swap pays $48,500 on every reset date',
          'The swap’s notional is $48,500',
        ],
        correctIndex: 1,
        explanation:
          'DV01 is a sensitivity, not a value or a cash flow — it says how much the mark moves per basis point.',
      },
      {
        id: 'marking-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Two honest desks marking the identical trade will always produce the same number.',
        correctAnswer: false,
        explanation:
          'Different curves, volatility surfaces or correlation assumptions can produce different marks on the same trade without either desk being simply wrong.',
      },
      {
        id: 'marking-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What did the 2012 JPMorgan “London Whale” episode illustrate about mark-to-model risk?',
        options: [
          'That mark-to-model valuations are always more conservative than mark-to-market ones',
          'That mark-to-model is banned for credit index positions',
          'That marks can be pushed toward the aggressive end of a defensible range to understate losses for a period',
          'That the losses were caused entirely by a discount-curve error',
        ],
        correctIndex: 2,
        explanation:
          'The CIO favoured marks that understated losses on a large CDX.NA.IG9 position before roughly $6.2 billion was eventually recognised in full.',
      },
    ],
  },
  {
    id: 'isda',
    categoryId: 'foundations',
    name: 'The ISDA Architecture',
    hook: 'The paperwork that makes every other product possible',
    summary:
      'An OTC relationship is built from a stack of documents, not one contract, and the whole point of the stack is a single legal feature buried in its opening pages: every trade under one Master Agreement is, by its own terms, part of a single agreement with every other trade under it. That status is what makes close-out netting possible, and close-out netting is the entire commercial argument for the architecture — without it, a defaulting counterparty’s liquidator could cherry-pick which trades to honour and which to walk away from.',
    difficulty: 'foundational',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'The Master Agreement is the standard-form core of an ISDA relationship, identical for every pair of counterparties that uses it, setting out the boilerplate that would otherwise have to be renegotiated on every single trade. The Schedule amends and elects within that standard form — choosing which optional provisions apply, adding bespoke terms, naming Additional Termination Events specific to this relationship. Each individual trade is then a short Confirmation referencing the Master Agreement and Schedule rather than restating all of it, and the Credit Support Annex, covered earlier in this category, is itself an annex to the Schedule, not a separate contract.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Every Confirmation under one Master Agreement forms, by its own terms, a single agreement with every other Confirmation under it — not a bundle of separate contracts that happen to share a signature page. That single-agreement status is the entire commercial point. If a counterparty defaults, every trade under the Master Agreement terminates together and is reduced to one net figure — close-out netting — rather than each trade being settled on its own. Without single-agreement status a liquidator could cherry-pick: demand payment in full on the trades in its favour while treating the trades it owes money on as ordinary unsecured claims, worth cents on the dollar.',
        callout:
          'Regulatory capital rules recognise netting only where a jurisdiction’s insolvency law is confirmed, by legal opinion, to actually uphold it — which is why ISDA maintains netting opinions for dozens of jurisdictions, and a Master Agreement with a counterparty in an unopinioned jurisdiction is priced, and capitalised, as if netting might not hold at all.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Two different kinds of trigger can end the relationship early, and they are not the same thing. An Event of Default is generally the defaulting party’s own fault — failure to pay, a bankruptcy, a breach of the agreement — and gives the other side the right, not the obligation, to terminate everything. A Termination Event is largely no-fault — a change in tax law, an illegality, a merger that leaves a weaker surviving entity — and the distinction decides not just whether the relationship ends but how the final number is calculated and who is on the hook for it.',
        callout:
          'The 1992 Master Agreement is still in force between many long-standing counterparties, but 2002 is the modern default: it cut the grace period for a payment or delivery failure from three local business days to one, replaced the 1992 choice between “Market Quotation” and “Loss” with a single, more flexible “Close-out Amount”, and introduced Force Majeure as its own Termination Event — drafted in direct response to 11 September 2001 and the 1998 market disruption, after 1992 turned out to have no clean answer for a market simply becoming unable to operate.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Master Agreement and Schedule are the standard-form core and the relationship-specific elections built on top of it. Single agreement status is the legal feature everything else depends on, and close-out netting is what that status makes possible on a default. Event of Default and Termination Event are the two different triggers that can end the relationship, and they are judged, and paid for, differently.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Netting only works where the underlying insolvency law actually respects it, which is why cross-border relationships carry a jurisdictional risk that a purely domestic one does not. A poorly negotiated Schedule can leave gaps — an Additional Termination Event that was never included, a close-out mechanic left ambiguous — that only become visible under exactly the stress the documentation exists to survive. And the architecture is only as strong as the discipline to actually paper every relationship this way: a trade done outside any Master Agreement at all gets none of these protections, whatever informal understanding the two sides believe they share.',
      },
    ],
    keyTerms: [
      {
        term: 'Master Agreement',
        definition:
          'The standard-form core of an ISDA relationship, identical for every pair of counterparties that use it, setting out terms that would otherwise have to be renegotiated on every trade.',
      },
      {
        term: 'Schedule',
        definition:
          'The document that amends and elects within the Master Agreement’s standard form, adding bespoke terms and naming any Additional Termination Events specific to one relationship.',
      },
      {
        term: 'Single agreement',
        definition:
          'The status, stated in the Master Agreement itself, that every trade under it forms one contract with every other — the legal basis for close-out netting.',
      },
      {
        term: 'Close-out netting',
        definition:
          'Terminating every trade under a Master Agreement together on a default and reducing them to one net figure, rather than settling each on its own.',
      },
      {
        term: 'Event of Default',
        definition:
          'A trigger generally caused by one party’s own conduct — non-payment, bankruptcy, a breach of the agreement — giving the other side the right, not the obligation, to terminate everything.',
      },
      {
        term: 'Termination Event',
        definition:
          'A largely no-fault trigger — a change in tax law, illegality, a merger leaving a weaker surviving entity — that can end the relationship without either side having done anything wrong.',
      },
    ],
    example: {
      title: 'Four trades become one number',
      lines: [
        'Corp B defaults under its ISDA Master Agreement with Bank A, which has four live trades against it: an interest rate swap worth $4,200,000 in Bank A’s favour, an FX forward worth $1,800,000 in Corp B’s favour, a cap worth $650,000 in Bank A’s favour, and a swaption worth $3,100,000 in Corp B’s favour.',
        'Without close-out netting, Corp B’s liquidator could in principle demand payment in full on the two trades in Corp B’s favour — $1,800,000 + $3,100,000 = $4,900,000 — while treating Bank A’s claim on the other two, worth $4,850,000, as an ordinary unsecured claim worth a fraction of that.',
        'Because every trade sits under one Master Agreement, they instead terminate together and net to a single figure: $4,200,000 − $1,800,000 + $650,000 − $3,100,000 = −$50,000.',
        'That negative sign means Bank A, despite being in the money on two of the four trades, owes Corp B’s estate a net $50,000 — one payment, calculated once, rather than four separate claims running in opposite directions.',
      ],
      takeaway:
        'Close-out netting turned $9,750,000 of gross exposure across four trades into a single $50,000 payment. That collapse from gross to net is the entire commercial argument for the single agreement — and it only works because every Confirmation was always, legally, part of the same contract.',
    },
    inPractice:
      'Every OTC derivatives relationship of any size sits on top of a negotiated ISDA Master Agreement and Schedule, usually the product of weeks or months of legal negotiation before a single trade is ever done. Legal and credit teams, not the trading desk, own that negotiation, because the Schedule’s elections — which close-out method, which Additional Termination Events, whose credit rating triggers what — decide how the relationship actually behaves under stress, long after the deal desk has moved on to the next relationship.',
    relatedProductIds: ['collateral', 'clearing', 'irs'],
    quiz: [
      {
        id: 'isda-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The Schedule amends and elects within the Master Agreement’s standard form, rather than replacing it.',
        correctAnswer: true,
        explanation:
          'The Master Agreement supplies the boilerplate; the Schedule is where a relationship’s specific choices and bespoke terms actually get written down.',
      },
      {
        id: 'isda-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Each Confirmation restates the full terms of the Master Agreement for that individual trade.',
        correctAnswer: false,
        explanation:
          'A Confirmation records one trade’s economic terms and incorporates the Master Agreement and Schedule by reference — it does not restate them.',
      },
      {
        id: 'isda-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'Where does the Credit Support Annex sit within the ISDA documentation stack?',
        options: [
          'It is an annex to the Schedule, not a standalone contract',
          'It is a separate contract, independent of the Master Agreement',
          'It replaces the Schedule entirely once collateral is agreed',
          'It is negotiated separately for every individual Confirmation',
        ],
        correctIndex: 0,
        explanation:
          'It sits inside the same architecture as everything else — an annex, not a document apart from it.',
      },
      {
        id: 'isda-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Every trade under one ISDA Master Agreement forms a single agreement with every other trade under it.',
        correctAnswer: true,
        explanation:
          'That single-agreement status, stated in the Master Agreement itself, is what makes close-out netting legally possible.',
      },
      {
        id: 'isda-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'What would “cherry-picking” let an insolvent counterparty’s liquidator do without close-out netting?',
        options: [
          'Choose which currency to settle every trade in',
          'Cancel every trade under the Master Agreement without penalty',
          'Demand payment in full on trades in its favour while treating the trades it owes on as ordinary unsecured claims',
          'Select which Master Agreement version — 1992 or 2002 — applies retroactively',
        ],
        correctIndex: 2,
        explanation:
          'That selective enforcement is exactly what single-agreement status and close-out netting exist to prevent.',
      },
      {
        id: 'isda-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt:
          'Why does ISDA maintain netting opinions for individual jurisdictions?',
        options: [
          'Because netting is only legal in jurisdictions ISDA has approved',
          'Because regulatory capital treatment for netting depends on a legal opinion that the local insolvency law actually upholds it',
          'Because each jurisdiction requires its own separate Master Agreement wording',
          'Because opinions are needed only for trades denominated in that jurisdiction’s currency',
        ],
        correctIndex: 1,
        explanation:
          'A Master Agreement with a counterparty in an unopinioned jurisdiction is priced and capitalised as though netting might not hold at all.',
      },
      {
        id: 'isda-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'An Event of Default is generally caused by the defaulting party’s own conduct, such as non-payment or bankruptcy.',
        correctAnswer: true,
        explanation:
          'That is the defining feature that separates it from a Termination Event, which is largely no-fault.',
      },
      {
        id: 'isda-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'What was the main change the 2002 Master Agreement made to close-out valuation?',
        options: [
          'It removed the ability to net trades on a default',
          'It required every close-out to be litigated rather than calculated bilaterally',
          'It extended the grace period for a payment failure from one day to three',
          'It replaced the 1992 choice between Market Quotation and Loss with a single Close-out Amount method',
        ],
        correctIndex: 3,
        explanation:
          'It went the other way on grace periods too — cutting them from three local business days to one, not extending them.',
      },
      {
        id: 'isda-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A Termination Event can end an ISDA relationship even though neither party has done anything wrong.',
        correctAnswer: true,
        explanation:
          'A change in tax law or an illegality can trigger one without either side being at fault, unlike an Event of Default.',
      },
      {
        id: 'isda-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which of these is a Termination Event rather than an Event of Default?',
        options: [
          'A merger that leaves a weaker entity standing behind the trades',
          'Failure to pay an amount due under the agreement',
          'A material misrepresentation made when the agreement was signed',
          'A bankruptcy filing by one of the parties',
        ],
        correctIndex: 0,
        explanation:
          'A weakening merger — Credit Event Upon Merger — is a Termination Event; the other three are all Events of Default.',
      },
      {
        id: 'isda-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'The 1992 Master Agreement is no longer used by any market participant.',
        correctAnswer: false,
        explanation:
          'It remains in force between many long-standing counterparty relationships — 2002 is the modern default for new relationships, not a mandatory replacement for old ones.',
      },
      {
        id: 'isda-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'What prompted the 2002 Master Agreement’s new Force Majeure Termination Event?',
        options: [
          'A wish to remove Illegality as a Termination Event entirely',
          'A regulatory requirement introduced after the 2008 crisis',
          'Events including 11 September 2001, which exposed situations where performance became impossible without being illegal',
          'The introduction of central clearing for standardised derivatives',
        ],
        correctIndex: 2,
        explanation:
          '1992 had no clean answer for a market simply becoming unable to operate, as opposed to a law making performance illegal.',
      },
    ],
  },
  {
    id: 'xva',
    categoryId: 'foundations',
    name: 'XVA and Counterparty Risk',
    hook: 'Why the same swap is never quite the same price twice',
    summary:
      'A swap’s textbook value — its legs discounted off the right curves — assumes both sides always pay in full and that funding is free. Neither is true, and XVA is the family of adjustments dealers add to price what that assumption leaves out: the cost of each side’s own default risk, and the cost of actually funding the trade and the margin it requires. None of it changes where the swap curve sits, which is exactly why two dealers can agree on rates and still quote two different prices.',
    difficulty: 'advanced',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A swap’s textbook value — its fixed and floating legs discounted off the right curves — assumes both sides always pay in full and funding is free. Neither is true, and XVA is the collective name for the family of adjustments that price what the textbook value leaves out: the value of each side’s own default risk, and the cost of actually funding the trade and the collateral it requires. A dealer’s quoted price is the textbook value plus every XVA adjustment that applies, not the textbook value on its own.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'Credit valuation adjustment, CVA, is the expected cost of the counterparty’s default: the market value, today, of the loss the dealer would take if the client defaulted while the trade were in the dealer’s favour, weighted by the client’s own credit spread and the trade’s expected future exposure. It is subtracted from the textbook value — a riskier counterparty means a worse price. Debit valuation adjustment, DVA, is CVA’s mirror on the dealer’s own credit: the value of the benefit the client gets from the dealer’s own default risk, which the client is not fully compensated against.',
        callout:
          'A bank whose own credit spread widens can record a DVA gain, because the value of what it owes its counterparties has fallen — a frequently criticised feature of fair-value accounting, since realising that gain in practice would require the bank to actually default.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Funding valuation adjustment, FVA, prices something CVA and DVA both leave out: actually funding the trade. An uncollateralised or partially collateralised position ties up the dealer’s own balance sheet, at the dealer’s own funding cost, for as long as the trade runs — a cost that has nothing to do with either side’s probability of default and everything to do with the price of cash. Margin valuation adjustment, MVA, is the same idea applied to initial margin specifically: posting IM into segregated custody under the uncleared margin rules ties up cash or eligible securities that themselves cost something to fund, for the life of the trade, and MVA prices that cost into the quote.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'CVA, DVA, FVA and MVA are the four adjustments this module has covered — credit risk on both sides, and the funding cost of the trade and its margin. Wrong-way risk names the case where a counterparty’s own default probability is correlated with the dealer’s exposure to it, the sharpest version of the problem CVA is built to price.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'XVA desks exist because these adjustments are themselves risks that move, not one-off numbers calculated at trade inception and forgotten: CVA changes as the counterparty’s credit spread moves and as the trade’s own exposure profile evolves, and a large book of CVA can itself need hedging with credit default swaps on the underlying counterparties. Wrong-way risk is the sharpest version of the problem — a hedge against an oil producer’s output that is deeply in the money exactly when low oil prices have also made that producer more likely to default, so the exposure and the credit risk worsen together rather than independently, and no single credit spread captures that correlation on its own. And every one of these adjustments is itself a modelling judgement, layering the same mark-to-model risk covered earlier onto a number that, unlike the trade’s core value, has no independently quoted market price to check it against.',
      },
    ],
    keyTerms: [
      {
        term: 'XVA',
        definition:
          'The family of valuation adjustments — credit, funding, margin and others — added to a trade’s textbook value to price what a frictionless, default-free assumption leaves out.',
      },
      {
        term: 'CVA',
        definition:
          'Credit valuation adjustment: the expected cost of the counterparty’s own default risk, subtracted from the textbook value.',
      },
      {
        term: 'DVA',
        definition:
          'Debit valuation adjustment: the mirror-image value of the dealer’s own default risk, which a deteriorating dealer can — controversially — book as a gain.',
      },
      {
        term: 'FVA',
        definition:
          'Funding valuation adjustment: the cost of funding the uncollateralised part of a trade’s exposure over its life.',
      },
      {
        term: 'MVA',
        definition:
          'Margin valuation adjustment: the cost of funding the initial margin a trade requires to be posted into segregated custody.',
      },
      {
        term: 'Wrong-way risk',
        definition:
          'The case where a counterparty’s probability of default is itself correlated with the dealer’s exposure to it, so the two get worse together rather than independently.',
      },
    ],
    example: {
      title: 'Four adjustments become one price',
      lines: [
        'A dealer prices a $50,000,000, ten-year swap that is exactly at the market rate, so its pure interest-rate value — ignoring credit and funding altogether — is $0.',
        'CVA — the expected cost of the client’s own default risk over the trade’s life — is calculated at $180,000, and is subtracted from the price.',
        'DVA — the mirror-image value of the dealer’s own default risk, which the client is not fully compensated against — is calculated at $60,000, and is added back.',
        'FVA — the cost of funding the uncollateralised part of the exposure over the trade’s life — is calculated at $95,000, and is subtracted.',
        'MVA — the cost of funding the initial margin the trade requires under the uncleared margin rules — is calculated at $40,000, and is subtracted too.',
        'The four adjustments net to $0 − $180,000 + $60,000 − $95,000 − $40,000 = −$255,000, the amount the dealer’s quoted price differs from the pure interest-rate value.',
      ],
      takeaway:
        'None of the four numbers came from where the swap curve sits — they come from whose credit is on each side, how the trade is collateralised, and what it costs to fund the margin it requires. A second dealer with a lower funding cost, or facing a better-collateralised client, prices the identical swap to a different number for exactly these reasons, which is why two competitive quotes on one trade are rarely identical even when both desks agree on where rates are.',
    },
    inPractice:
      'Every major dealer runs a dedicated XVA desk that prices and hedges these adjustments centrally across the whole trading book, rather than leaving each individual desk to price its own counterparty and funding risk trade by trade. A corporate treasurer negotiating a swap notices XVA only as a wider price than a textbook calculation would suggest — and as the reason a better-rated counterparty, or one prepared to post more collateral, is quoted a tighter one.',
    relatedProductIds: ['collateral', 'clearing', 'cds'],
    quiz: [
      {
        id: 'xva-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'A dealer’s quoted price on a swap is its textbook, risk-free value plus every XVA adjustment that applies.',
        correctAnswer: true,
        explanation:
          'XVA is exactly the collection of adjustments layered on top of the textbook value to price what a frictionless assumption leaves out.',
      },
      {
        id: 'xva-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'XVA adjustments only matter for exotic or bespoke trades, not for plain vanilla swaps.',
        correctAnswer: false,
        explanation:
          'Every trade carries counterparty credit risk and a funding cost, however plain its structure — XVA applies across the book, not to a special category of trade.',
      },
      {
        id: 'xva-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt:
          'What does XVA collectively price that a textbook, curve-only valuation leaves out?',
        options: [
          'The notional and maturity of the trade',
          'The bid-offer spread quoted on the trade',
          'The trade’s sensitivity to a one basis point rate move',
          'Counterparty credit risk and the cost of funding the trade and its margin',
        ],
        correctIndex: 3,
        explanation:
          'Notional, maturity and DV01 are all inputs the textbook value already uses — XVA is specifically about credit and funding.',
      },
      {
        id: 'xva-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt: 'CVA is the expected cost of the dealer’s own default risk.',
        correctAnswer: false,
        explanation:
          'That is DVA. CVA is the expected cost of the counterparty’s default risk, from the dealer’s point of view.',
      },
      {
        id: 'xva-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'What can a bank whose own credit spread widens book as a result, under DVA?',
        options: [
          'A gain, since the value of what it owes its counterparties has fallen',
          'A mandatory write-down across its whole derivatives book',
          'An automatic downgrade of every CVA calculation on its book',
          'Nothing — DVA does not respond to a dealer’s own credit',
        ],
        correctIndex: 0,
        explanation:
          'It is a frequently criticised feature of fair-value accounting, since realising that gain in practice would require the bank to actually default.',
      },
      {
        id: 'xva-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'Why is DVA described as the mirror image of CVA?',
        options: [
          'Because it is calculated using exactly the same trade, run through the same model twice',
          'Because DVA and CVA are always equal and opposite in size',
          'Because it prices the counterparty’s benefit from the dealer’s own default risk, the other side of the same relationship CVA prices',
          'Because DVA is only used by counterparties, never by dealers',
        ],
        correctIndex: 2,
        explanation:
          'The two are not generally equal in size — they mirror the relationship, not the number, each side pricing the other’s default risk.',
      },
      {
        id: 'xva-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'FVA prices the cost of funding the uncollateralised part of a trade’s exposure.',
        correctAnswer: true,
        explanation:
          'It has nothing to do with either side’s probability of default — it is purely the cost of the cash tied up.',
      },
      {
        id: 'xva-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt: 'What does MVA specifically price?',
        options: [
          'The cost of funding initial margin posted into segregated custody',
          'The market risk of the trade itself',
          'The cost of variation margin calls',
          'The legal cost of negotiating the ISDA Master Agreement',
        ],
        correctIndex: 0,
        explanation:
          'IM has to be funded for the life of the trade even though it earns interest in return, and MVA is the price of that funding gap.',
      },
      {
        id: 'xva-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'Wrong-way risk is when a counterparty’s default probability is correlated with the dealer’s exposure to it.',
        correctAnswer: true,
        explanation:
          'The two get worse together — an oil producer’s credit and a dealer’s exposure to a hedge against its output, for example — rather than moving independently.',
      },
      {
        id: 'xva-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt:
          'Which adjustment is subtracted to reflect the counterparty’s own default risk?',
        options: ['DVA', 'FVA', 'CVA', 'MVA'],
        correctIndex: 2,
        explanation:
          'CVA prices the counterparty’s default risk from the dealer’s side; DVA is the dealer’s own default risk, seen from the counterparty’s side.',
      },
      {
        id: 'xva-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'CVA is calculated once at trade inception and does not need to be actively managed afterwards.',
        correctAnswer: false,
        explanation:
          'It moves with the counterparty’s credit spread and the trade’s own exposure profile, which is why dealers run dedicated desks to hedge it, often with CDS on the underlying counterparties.',
      },
      {
        id: 'xva-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt: 'Why is wrong-way risk particularly hard to price?',
        options: [
          'Because it only affects trades with no credit risk at all',
          'Because it requires modelling a correlation between exposure and default probability that a simple credit spread does not capture',
          'Because it can only occur on centrally cleared trades',
          'Because regulators do not permit it to be priced at all',
        ],
        correctIndex: 1,
        explanation:
          'A credit spread alone says nothing about how exposure and default probability move together for one specific counterparty and one specific trade.',
      },
    ],
  },
];
