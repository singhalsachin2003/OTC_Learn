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
    depth: {
      sections: [
        {
          title: 'Thresholds, minimums and the independent amount',
          content:
            'Three numbers decide how much collateral actually moves. The threshold is unsecured exposure a party will tolerate before calling for anything — effectively a credit line granted inside the derivatives relationship. The minimum transfer amount stops trivial movements, so exposure below it simply sits there. And an independent amount is collateral posted regardless of mark-to-market, which is initial margin under another name. A zero threshold with a small minimum is a tightly collateralised relationship; a large threshold is a loan, and it should be underwritten as one.',
          callout:
            'A threshold is uncollateralised credit exposure with a friendly name. Whether the counterparty has priced it as such is a question worth asking.',
        },
        {
          title: 'What may be posted, and what it is worth',
          content:
            'The eligible collateral schedule lists what can be delivered and applies a haircut to each type — cash in the agreement’s currency at full value, government bonds a little less, longer or riskier paper less again. Where more than one asset qualifies, the poster chooses, and they will deliver whichever is cheapest for them to give up. That choice is an option held by the poster and it has a value, which is why a widely drawn eligibility schedule is not the generous gesture it appears to be and why the discount curve for a trade depends on what its collateral can be.',
        },
        {
          title: 'Whose collateral is it',
          content:
            'Two arrangements look similar and behave completely differently in a default. Under a transfer of title, the collateral becomes the receiver’s property and the poster has a contractual claim to its return — which is a claim against a failed institution. Under a security interest with segregation, the collateral is held apart and remains the poster’s. Rehypothecation, where the receiver reuses posted collateral, is efficient and it is the mechanism by which a client’s assets end up somewhere they cannot easily be found. Which regime applies is in the documentation, not in the market convention.',
          callout:
            'Every large derivatives failure has produced the same discovery: somebody thought their collateral was ring-fenced and it was not.',
        },
      ],
      quiz: [
        {
          id: 'collateral-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is a threshold in a collateral agreement?',
          options: [
            'The minimum size of any collateral movement',
            'Unsecured exposure tolerated before any collateral is called',
            'The maximum collateral that may be posted',
            'The haircut applied to government bonds',
          ],
          correctIndex: 1,
          explanation:
            'It is a credit line granted inside the derivatives relationship, and it should be underwritten like one.',
        },
        {
          id: 'collateral-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'The minimum transfer amount means small exposures go uncollateralised until they grow.',
          correctAnswer: true,
          explanation:
            'It exists to stop trivial daily movements, and the residual is accepted deliberately.',
        },
        {
          id: 'collateral-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What is an independent amount?',
          options: [
            'Collateral posted regardless of mark-to-market — initial margin by another name',
            'The portion of collateral held by a custodian',
            'A fee paid for the collateral agreement',
            'The unsecured threshold',
          ],
          correctIndex: 0,
          explanation:
            'It sits on top of variation margin and is there to cover the move between default and close-out.',
        },
        {
          id: 'collateral-d4',
          kind: 'boolean',
          step: 3,
          difficulty: 'foundational',
          prompt:
            'A large threshold means the relationship is tightly collateralised.',
          correctAnswer: false,
          explanation:
            'The opposite: it is uncollateralised exposure, and calling it a threshold does not change what it is.',
        },
        {
          id: 'collateral-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Who chooses which eligible asset to post?',
          options: [
            'The poster',
            'The receiver',
            'The calculation agent',
            'The clearing house',
          ],
          correctIndex: 0,
          explanation:
            'And they will choose whatever is cheapest for them to give up, which is an option with a value.',
        },
        {
          id: 'collateral-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A widely drawn eligibility schedule is a concession with a real cost to the receiver.',
          correctAnswer: true,
          explanation:
            'It hands the poster a cheapest-to-deliver option, which is why the discount curve depends on what collateral can be.',
        },
        {
          id: 'collateral-d7',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What is a haircut?',
          options: [
            'A reduction in the value credited to posted collateral',
            'A fee charged on collateral transfers',
            'The interest paid on cash collateral',
            'The threshold below which nothing moves',
          ],
          correctIndex: 0,
          explanation:
            'It covers the risk that the collateral itself falls in value before it can be sold.',
        },
        {
          id: 'collateral-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Under a transfer of title, posted collateral becomes the receiver’s property.',
          correctAnswer: true,
          explanation:
            'And the poster holds a contractual claim to its return, which in a default is a claim against a failed firm.',
        },
        {
          id: 'collateral-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What does rehypothecation mean?',
          options: [
            'The receiver reusing collateral it has been posted',
            'Substituting one collateral type for another',
            'Returning collateral when exposure falls',
            'Posting collateral to a clearing house',
          ],
          correctIndex: 0,
          explanation:
            'Efficient, and the mechanism by which client assets end up somewhere they cannot easily be found.',
        },
        {
          id: 'collateral-d10',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Whether collateral is segregated is determined by market convention rather than the documentation.',
          correctAnswer: false,
          explanation:
            'It is in the agreement, and the two regimes behave completely differently in a default.',
        },
        {
          id: 'collateral-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What has every large derivatives failure tended to reveal about collateral?',
          options: [
            'Someone believed theirs was ring-fenced when it was not',
            'That haircuts were too small',
            'That cash was the wrong asset to post',
            'That thresholds were set too low',
          ],
          correctIndex: 0,
          explanation:
            'The legal regime, not the amount, is what decides who owns what on the day it matters.',
        },
        {
          id: 'collateral-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'The three numbers that decide how much collateral moves are the threshold, the minimum transfer amount and the independent amount.',
          correctAnswer: true,
          explanation:
            'Everything else in the schedule modifies how those three are applied.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'The waterfall, in order',
          content:
            'When a clearing member fails, losses are absorbed in a fixed sequence and the order is the whole design. First the defaulter’s own initial margin, then its contribution to the default fund; then a tranche of the clearing house’s own capital — deliberately placed here, so the house has money at risk before its surviving members do; then the default fund contributions of everyone else; and beyond that, powers to call for more or to allocate remaining losses. Knowing the order tells you who is actually exposed, and the answer changes at every step.',
          callout:
            'That slice of the clearing house’s own capital is called skin in the game, and its size is one of the most argued numbers in market infrastructure, precisely because it sets the incentive.',
        },
        {
          title: 'Margin, and the period of risk',
          content:
            'Initial margin is sized to cover the move between a member defaulting and its positions being closed out — the margin period of risk, typically assumed to be a few days for cleared derivatives and longer for less liquid products. Every margin model is an answer to one question: how far can this portfolio move before we can be rid of it. Models are procyclical almost by construction, because volatility rises in a crisis and the model reads that as more risk, calling for more cash from members at precisely the moment cash is hardest to find.',
        },
        {
          title: 'Porting and the auction',
          content:
            'A defaulting member’s clients are not necessarily in default, so the first attempt is porting: moving their positions and collateral to a surviving member. It works when the receiving member wants the business and the collateral is identifiable, which is why segregation arrangements matter more than they appear to. What cannot be ported is auctioned to surviving members, who are obliged to bid — an obligation they accepted on joining, and one that makes clearing membership a commitment to take on someone else’s book on the worst day of the year.',
          callout:
            'The 2018 default of a single member at a European clearing house consumed most of that house’s default fund. Clearing moves counterparty risk; it does not delete it.',
        },
      ],
      quiz: [
        {
          id: 'clearing-d1',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What is used first when a clearing member defaults?',
          options: [
            'The clearing house’s own capital',
            'The defaulter’s own initial margin',
            'Surviving members’ default fund contributions',
            'An assessment call on all members',
          ],
          correctIndex: 1,
          explanation:
            'Then its own default fund contribution, before anything belonging to anyone else is touched.',
        },
        {
          id: 'clearing-d2',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A tranche of the clearing house’s own capital sits ahead of surviving members’ contributions.',
          correctAnswer: true,
          explanation:
            'Skin in the game, placed there so the house has money at risk before its members do.',
        },
        {
          id: 'clearing-d3',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Why does the order of the waterfall matter?',
          options: [
            'It determines who is actually exposed at each stage',
            'It sets the level of initial margin',
            'It decides which products may be cleared',
            'It fixes the size of the default fund',
          ],
          correctIndex: 0,
          explanation:
            'The answer to "who bears this loss" changes at every step of the sequence.',
        },
        {
          id: 'clearing-d4',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What is the margin period of risk?',
          options: [
            'The assumed time between a default and closing out the positions',
            'The interval between margin calls',
            'The maturity of the cleared contracts',
            'The time a member has to meet a call',
          ],
          correctIndex: 0,
          explanation:
            'Every margin model is an answer to how far a portfolio can move before it can be got rid of.',
        },
        {
          id: 'clearing-d5',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Margin models are procyclical almost by construction.',
          correctAnswer: true,
          explanation:
            'Volatility rises in a crisis, the model reads more risk, and it calls for cash when cash is scarcest.',
        },
        {
          id: 'clearing-d6',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Less liquid products are assumed to take longer to close out, so they attract more initial margin.',
          correctAnswer: true,
          explanation:
            'The horizon is the input, and everything about the number follows from it.',
        },
        {
          id: 'clearing-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is porting?',
          options: [
            'Moving a defaulting member’s clients to a surviving member',
            'Transferring positions between clearing houses',
            'Converting bilateral trades into cleared ones',
            'Substituting one collateral type for another',
          ],
          correctIndex: 0,
          explanation:
            'The clients are not in default, so the first attempt is to move them rather than close them.',
        },
        {
          id: 'clearing-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Porting works best where client collateral is segregated and identifiable.',
          correctAnswer: true,
          explanation:
            'Which is why segregation arrangements matter far more than they appear to on an ordinary day.',
        },
        {
          id: 'clearing-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What happens to positions that cannot be ported?',
          options: [
            'They are auctioned to surviving members, who are obliged to bid',
            'They are cancelled at the last settlement price',
            'They are transferred to the regulator',
            'They are held by the clearing house to maturity',
          ],
          correctIndex: 0,
          explanation:
            'An obligation accepted on joining — clearing membership includes taking on someone else’s book on the worst day of the year.',
        },
        {
          id: 'clearing-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Clearing removes counterparty risk from the system.',
          correctAnswer: false,
          explanation:
            'It concentrates and mutualises it. A single member default in 2018 consumed most of one European house’s default fund.',
        },
        {
          id: 'clearing-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'Why is the size of skin in the game so heavily argued?',
          options: [
            'Because it sets the clearing house’s incentive to margin properly',
            'Because it determines the clearing fee',
            'Because it caps member losses',
            'Because regulators publish it',
          ],
          correctIndex: 0,
          explanation:
            'A house with little of its own money at risk is a house whose margin model costs it nothing to get wrong.',
        },
        {
          id: 'clearing-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Surviving members can be called on for more than their existing default fund contribution.',
          correctAnswer: true,
          explanation:
            'Assessment powers sit further down the waterfall, and they are part of what membership commits to.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'Three levels of observability',
          content:
            'Accounting standards sort fair values by how much of the input is observable. Level one is a quoted price in an active market for the identical instrument. Level two uses observable inputs — a curve, a quoted volatility — fed into a model. Level three uses inputs that are not observable, which means an assumption someone at the firm chose. The classification is not a comment on quality; it is a disclosure of where judgement enters, and the proportion of a book sitting in level three is one of the more informative numbers in a set of accounts.',
          callout:
            'The distinction is about inputs, not instruments. The same swap can be level two on a liquid currency and level three at a maturity nobody quotes.',
        },
        {
          title: 'Mid, and the adjustments away from it',
          content:
            'A book marked at mid-market is marked at a price nobody can actually trade at, so several adjustments bring it back to a realistic exit. A bid-offer reserve recognises the cost of closing the position; a concentration adjustment recognises that a large position cannot be closed at the price a normal one could; a model reserve recognises that the model itself may be wrong. These reserves are where prudence lives in a trading book, and they are also where the pressure lands when profit is short of target — which is why they are set independently of the desk.',
        },
        {
          title: 'Independent price verification',
          content:
            'The control that makes the rest work is someone outside the desk checking the marks against sources the desk does not control: broker quotes, consensus services, executed trades. Where a mark cannot be verified, it is escalated rather than accepted, and a persistent gap between a desk’s mark and the consensus is a finding regardless of who turns out to be right. The London Whale case is the standard illustration — positions marked at favourable points within the spread, month after month, until a restatement made the question moot.',
          callout:
            'A mark is not an opinion about value. It is an assertion that the position could be exited near that level, and that assertion is testable.',
        },
      ],
      quiz: [
        {
          id: 'marking-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is a level one fair value?',
          options: [
            'A model output using observable inputs',
            'A value based on unobservable assumptions',
            'A price agreed with the counterparty',
            'A quoted price in an active market for the identical instrument',
          ],
          correctIndex: 3,
          explanation:
            'Level two uses observable inputs in a model; level three uses inputs somebody had to choose.',
        },
        {
          id: 'marking-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'The same instrument can be classified differently depending on its currency or maturity.',
          correctAnswer: true,
          explanation:
            'The classification is about the observability of the inputs, not about the instrument type.',
        },
        {
          id: 'marking-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'A level three classification means the valuation is of poor quality.',
          correctAnswer: false,
          explanation:
            'It discloses where judgement enters. It is information, not a criticism.',
        },
        {
          id: 'marking-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'Why does a book marked at mid need adjustments?',
          options: [
            'Because mid ignores interest rates',
            'Because the counterparty marks at bid',
            'Because mid is a price at which nothing can actually be traded',
            'Because accounting standards prohibit mid-market marking',
          ],
          correctIndex: 2,
          explanation:
            'The adjustments bring the mark back towards a realistic exit rather than a theoretical midpoint.',
        },
        {
          id: 'marking-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What does a concentration adjustment recognise?',
          options: [
            'That funding costs money',
            'That a large position cannot be exited at the price a normal one could',
            'That the model may be wrong',
            'That the counterparty may default',
          ],
          correctIndex: 1,
          explanation:
            'Size changes the achievable price, which is a valuation fact rather than a risk one.',
        },
        {
          id: 'marking-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Valuation reserves are where pressure lands when profit is short of target.',
          correctAnswer: true,
          explanation:
            'Which is exactly why they are set independently of the desk that benefits from releasing them.',
        },
        {
          id: 'marking-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What is independent price verification?',
          options: [
            'Someone outside the desk checking marks against sources the desk does not control',
            'The desk reconciling its own marks daily',
            'The counterparty confirming the valuation',
            'An auditor’s year-end review',
          ],
          correctIndex: 0,
          explanation:
            'Broker quotes, consensus services and executed trades — evidence the desk cannot author.',
        },
        {
          id: 'marking-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'A persistent gap between a desk’s mark and consensus is a finding even before anyone establishes who is right.',
          correctAnswer: true,
          explanation:
            'The pattern is the signal. Being eventually correct does not retrospectively make it a controlled process.',
        },
        {
          id: 'marking-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What should happen to a mark that cannot be verified?',
          options: [
            'It is accepted with a note in the file',
            'It is replaced with the previous month’s value',
            'It is set to zero',
            'It is escalated rather than accepted',
          ],
          correctIndex: 3,
          explanation:
            'An unverifiable mark is a question, and the control is what happens next.',
        },
        {
          id: 'marking-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'The London Whale positions were marked at favourable points within the bid-offer spread.',
          correctAnswer: true,
          explanation:
            'Month after month, until a restatement made the argument moot.',
        },
        {
          id: 'marking-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'What is a mark actually asserting?',
          options: [
            'That the counterparty agrees',
            'That the trade was profitable',
            'That the position could be exited near that level',
            'That the model is correct',
          ],
          correctIndex: 2,
          explanation:
            'Which makes it testable, and is why an independent function exists to test it.',
        },
        {
          id: 'marking-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'The proportion of a book valued with unobservable inputs is disclosed in the accounts.',
          correctAnswer: true,
          explanation:
            'And it is one of the more informative numbers there, precisely because it locates the judgement.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'Close-out netting, and why capital depends on it',
          content:
            'The single most valuable thing the master agreement does is make every trade between two parties one obligation. On a default, all transactions are terminated, valued, and reduced to a single net amount owed one way. Without that, an insolvency practitioner could enforce the contracts in the counterparty’s favour and disclaim the ones against it — cherry-picking — leaving the surviving party with its losses and none of its gains. Netting is why exposure is measured net, why collateral is calculated on a portfolio, and why regulatory capital recognises the offset at all.',
          callout:
            'The enforceability of netting is jurisdiction-specific, which is why firms hold legal opinions country by country. A netting set that is not enforceable is a portfolio of gross exposures wearing a net label.',
        },
        {
          title: 'Default, termination, and the difference',
          content:
            'The agreement distinguishes events of default — failure to pay, bankruptcy, breach — from termination events, which are circumstances rather than faults: a change of tax law, an illegality, a merger that changes who you are dealing with. The distinction decides who may terminate and how the resulting amount is calculated, and it is deliberate: not every reason to end a relationship is an accusation, and treating the two identically would make ordinary commercial changes into credit events.',
        },
        {
          title: 'The schedule is where the negotiation lives',
          content:
            'The printed master agreement is standard and nobody argues about it. The schedule attached to it is where the parties elect thresholds, choose governing law, define what counts as a specified entity, set cross-default provisions and pick the close-out methodology. The 2002 version moved from a choice between two valuation methods to a single close-out amount standard, giving the determining party more discretion and requiring commercial reasonableness in exchange. Which version and which elections apply decides what happens on the worst day of the relationship, and it is agreed on one of the best.',
          callout:
            'Cross-default is the clause that turns someone else’s failure into your termination event. It is negotiated hardest for exactly that reason.',
        },
      ],
      quiz: [
        {
          id: 'isda-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does close-out netting achieve?',
          options: [
            'It reduces all trades between two parties to a single net amount on default',
            'It removes the need for collateral',
            'It transfers trades to a clearing house',
            'It guarantees payment by a third party',
          ],
          correctIndex: 0,
          explanation:
            'One obligation instead of hundreds, which is what makes net exposure a meaningful measure.',
        },
        {
          id: 'isda-d2',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'What is cherry-picking, in this context?',
          options: [
            'Choosing which collateral to post',
            'An insolvency practitioner enforcing favourable contracts and disclaiming unfavourable ones',
            'Selecting which trades to clear',
            'Novating profitable trades to a third party',
          ],
          correctIndex: 1,
          explanation:
            'Netting exists to prevent it, and without it a surviving party keeps its losses and loses its gains.',
        },
        {
          id: 'isda-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'Regulatory capital recognises netting only where it is legally enforceable in the relevant jurisdiction.',
          correctAnswer: true,
          explanation:
            'Which is why firms maintain legal opinions country by country rather than assuming the offset.',
        },
        {
          id: 'isda-d4',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'A netting set that is not enforceable still reduces measured exposure.',
          correctAnswer: false,
          explanation:
            'It is a portfolio of gross exposures with a net label on it.',
        },
        {
          id: 'isda-d5',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'How does a termination event differ from an event of default?',
          options: [
            'It is a circumstance rather than a fault — a tax change, an illegality, a merger',
            'It applies only to cleared trades',
            'It requires regulatory approval',
            'It cannot lead to termination',
          ],
          correctIndex: 0,
          explanation:
            'Not every reason to end a relationship is an accusation, and the agreement keeps the two separate.',
        },
        {
          id: 'isda-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'The distinction decides who may terminate and how the amount is calculated.',
          correctAnswer: true,
          explanation: 'Which is the practical reason the categories exist at all.',
        },
        {
          id: 'isda-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'Where do the parties record their elections?',
          options: [
            'In the schedule to the master agreement',
            'In the printed master agreement itself',
            'In each trade confirmation',
            'In the collateral annex only',
          ],
          correctIndex: 0,
          explanation:
            'The printed form is standard; the schedule is where thresholds, law and methodology are chosen.',
        },
        {
          id: 'isda-d8',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The 2002 version replaced a choice of valuation methods with a single close-out amount standard.',
          correctAnswer: true,
          explanation:
            'More discretion for the determining party, balanced by a requirement of commercial reasonableness.',
        },
        {
          id: 'isda-d9',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt: 'What does a cross-default provision do?',
          options: [
            'Turns a failure on other obligations into a termination event here',
            'Nets exposures across two counterparties',
            'Allows termination for convenience',
            'Requires collateral to be segregated',
          ],
          correctIndex: 0,
          explanation:
            'Someone else’s failure becomes your right to terminate, which is why the clause is negotiated hardest.',
        },
        {
          id: 'isda-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'The terms that decide the outcome of a default are agreed long before anything goes wrong.',
          correctAnswer: true,
          explanation:
            'On one of the best days of the relationship, for use on the worst.',
        },
        {
          id: 'isda-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'Which document does nobody spend time arguing about?',
          options: [
            'The printed master agreement',
            'The schedule',
            'The credit support annex',
            'The confirmation',
          ],
          correctIndex: 0,
          explanation:
            'Its standardisation is the point. Everything negotiable was moved out of it deliberately.',
        },
        {
          id: 'isda-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'Collateral is calculated across a portfolio because netting makes the portfolio one obligation.',
          correctAnswer: true,
          explanation:
            'Without enforceable netting, collateralising a portfolio would not reduce the legal exposure.',
        },
      ],
    },
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
    depth: {
      sections: [
        {
          title: 'CVA is a traded exposure, not an accounting entry',
          content:
            'The credit valuation adjustment is the expected loss from a counterparty defaulting while the trade is in your favour, and it is a price rather than a provision: it moves with the counterparty’s credit spread and with the value of the underlying trade. That makes it something a desk can hedge — buying protection on the counterparty, or hedging the market factors that drive the exposure — and something whose profit and loss appears every day. Banks run dedicated desks for it because it is a book of derivatives, however it looks in the accounts.',
          callout:
            'The exposure is a cross term: it depends on the counterparty’s credit and on the trade’s value moving together. Hedging one without the other leaves the correlation, which is where wrong-way risk lives.',
        },
        {
          title: 'Wrong-way risk',
          content:
            'The dangerous case is when exposure to a counterparty grows precisely as that counterparty becomes more likely to fail. Buying protection on a sovereign from a bank domiciled in that sovereign is the textbook example; so is a commodity hedge with a producer whose ability to pay depends on the same price the trade turns on. Ordinary CVA models assume the two are independent, which is comfortable and wrong in exactly the situations that matter. Identifying wrong-way exposures is a judgement about the business, not an output of the model.',
        },
        {
          title: 'The rest of the family, and the argument about it',
          content:
            'Funding valuation adjustment prices the cost of funding an uncollateralised position; margin valuation adjustment prices the cost of posting initial margin over the life of a trade; capital valuation adjustment prices the capital held against it. Each is a real cost to somebody. Whether they belong in the value of a trade is genuinely contested — the objection being that funding costs are a property of the firm rather than of the instrument, so including them means two banks assign different values to identical trades. The market resolved it in practice rather than in theory: they are charged, because someone pays them.',
          callout:
            'The general shape: a derivative’s price started as a hedging cost, and everything added since is another cost the hedge turned out to have.',
        },
      ],
      quiz: [
        {
          id: 'xva-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What does the credit valuation adjustment measure?',
          options: [
            'The capital required against the trade',
            'The cost of funding the position',
            'The bid-offer on closing the trade',
            'The expected loss from a counterparty defaulting while the trade is in your favour',
          ],
          correctIndex: 3,
          explanation:
            'A price that moves with the counterparty’s spread and the trade’s value — which makes it hedgeable.',
        },
        {
          id: 'xva-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'CVA generates daily profit and loss and can be hedged in the market.',
          correctAnswer: true,
          explanation:
            'Which is why banks run dedicated desks for it rather than treating it as a provision.',
        },
        {
          id: 'xva-d3',
          kind: 'choice',
          step: 2,
          difficulty: 'advanced',
          prompt: 'Why is CVA described as a cross term?',
          options: [
            'It is shared between the two counterparties',
            'It crosses the bid-offer spread',
            'It depends on the counterparty’s credit and the trade’s value moving together',
            'It applies across two currencies',
          ],
          correctIndex: 2,
          explanation:
            'Hedging one leg without the other leaves the correlation, which is where wrong-way risk lives.',
        },
        {
          id: 'xva-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'What is wrong-way risk?',
          options: [
            'A hedge that does not offset the underlying',
            'Exposure that grows precisely as the counterparty becomes more likely to fail',
            'A trade booked in the wrong direction',
            'Exposure to a counterparty in another jurisdiction',
          ],
          correctIndex: 1,
          explanation:
            'The two things a CVA model usually assumes are independent turn out to be the same thing.',
        },
        {
          id: 'xva-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Buying sovereign protection from a bank domiciled in that sovereign is a wrong-way exposure.',
          correctAnswer: true,
          explanation:
            'The protection is worth most exactly when the seller is least able to pay for it.',
        },
        {
          id: 'xva-d6',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'Wrong-way exposures are identified by the model rather than by judgement.',
          correctAnswer: false,
          explanation:
            'Standard models assume independence. Spotting where that assumption fails is a judgement about the business.',
        },
        {
          id: 'xva-d7',
          kind: 'choice',
          step: 4,
          difficulty: 'intermediate',
          prompt: 'What does the funding valuation adjustment price?',
          options: [
            'The cost of funding an uncollateralised position',
            'The cost of posting initial margin',
            'The capital held against the trade',
            'The counterparty’s probability of default',
          ],
          correctIndex: 0,
          explanation:
            'Margin and capital adjustments cover the other two, and each is a real cost to somebody.',
        },
        {
          id: 'xva-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'What is the theoretical objection to including funding costs in a price?',
          options: [
            'They cannot be measured',
            'They are already included in CVA',
            'They apply only to cleared trades',
            'They are a property of the firm rather than of the instrument',
          ],
          correctIndex: 3,
          explanation:
            'Which implies two banks assign different values to identical trades — uncomfortable, and how the market actually works.',
        },
        {
          id: 'xva-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'The debate about which adjustments belong in a trade’s value was settled in practice rather than in theory.',
          correctAnswer: true,
          explanation:
            'They are charged because someone pays them, whatever the argument concludes.',
        },
        {
          id: 'xva-d10',
          kind: 'boolean',
          step: 5,
          difficulty: 'intermediate',
          prompt:
            'Margin valuation adjustment prices the cost of posting initial margin over a trade’s life.',
          correctAnswer: true,
          explanation:
            'Which became a material number once initial margin requirements were extended to uncleared trades.',
        },
        {
          id: 'xva-d11',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt: 'What is the general pattern across the whole family?',
          options: [
            'Each adjustment reduces the value of the trade to zero',
            'They apply only to long-dated trades',
            'A derivative’s price started as a hedging cost, and each adjustment is another cost the hedge turned out to have',
            'Each adjustment is a regulatory requirement',
          ],
          correctIndex: 2,
          explanation:
            'Every one of them is somebody discovering that replicating the payoff costs more than the model assumed.',
        },
        {
          id: 'xva-d12',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt:
            'CVA is best understood as an accounting provision rather than a traded position.',
          correctAnswer: false,
          explanation:
            'It is a book of derivatives with daily profit and loss, hedged by a desk, however it is presented in the accounts.',
        },
      ],
    },
  },
  {
    id: 'execution',
    categoryId: 'foundations',
    name: 'Execution and Reporting',
    hook: 'How a trade gets done, and who has to know about it',
    summary:
      'The clearing module in this category already quoted the G20’s full 2009 commitment — traded on exchanges or electronic platforms, cleared through central counterparties, reported to trade repositories. This module is the other two legs of that sentence. Standardised derivatives are meant to trade on regulated electronic venues rather than over the phone, and every derivative — cleared or not, venue-traded or not — has to be reported to a trade repository within a tight window of being done. Both mandates bind instrument by instrument, decided by a specific, named determination, not a blanket rule for a whole asset class.',
    difficulty: 'intermediate',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'Before the reforms that followed 2008, a standardised interest rate swap and a bespoke exotic option were negotiated the same way: bilaterally, usually by phone or instant message through a broker, with no public record of the price agreed or the volume done. Two separate mandates changed that for anything liquid and standardised enough to bear it. Trading standardised derivatives moved onto regulated electronic venues — Swap Execution Facilities (SEFs) in the US, Multilateral and Organised Trading Facilities (MTFs and OTFs) in the EU — and every OTC derivative, whatever venue it traded on or whether it stayed bilateral, became reportable to a trade repository.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'A swap only has to move onto a venue once a specific, named determination has been made for it. In the US a SEF or a designated contract market files a “made available to trade” (MAT) determination with the CFTC for a defined swap; once approved, that swap can no longer be executed bilaterally, and must trade on a SEF or DCM instead. The EU’s parallel trading obligation under MiFIR applies once a class of derivative is judged sufficiently liquid and already trades on at least one venue. On the venue itself, execution is usually by request-for-quote — a client asks a chosen number of dealers to compete for one specific trade — rather than the continuous order book familiar from equities, because liquidity in most swaps is too thin to support one. Large trades above a published size threshold qualify as block trades, reported with a short delay so that publishing the trade does not itself move the market against whoever just dealt it.',
        callout:
          'MAT determinations first took effect in the US in 2013, for the most standardised interest rate swaps and CDS indices; MiFID II’s Organised Trading Facility, the EU’s answer for non-equity venues including derivatives, only went live at the start of 2018. The reforms did not arrive everywhere at once, and for years a good deal of the market executed the same instrument two different ways depending on which side of the Atlantic the counterparty sat.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'Two different goods come out of this. Trading on a venue creates pre-trade price transparency that a bilateral phone call never could — a client requesting a quote sees competing prices from more than one dealer before dealing, rather than trusting whichever single dealer picked up the call. Reporting to a trade repository creates something regulators, not the counterparties, actually use: a systemic map of who holds what, updated continuously, that simply did not exist before 2008. AIG’s downfall was one firm’s derivatives book concentrating a risk almost nobody outside the firm could see coming; trade repository data is the tool built specifically so that kind of concentration would be visible before, not after.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'SEF, MTF and OTF are the regulated venues themselves, and RFQ is how most execution on them actually happens. A made-available-to-trade determination is what forces a specific swap onto one, and a block trade is the large-size exception to reporting it instantly. A trade repository is where every OTC derivative ends up reported, tagged with a UTI unique to that one transaction and a UPI shared by every trade in the same product.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Two overlapping venue regimes, built independently and years apart, created cross-border friction a single global market did not ask for: a swap involving both a US and a non-US counterparty can trigger US SEF rules even where the EU side would rather trade bilaterally, and firms on both sides spent years navigating equivalence determinations and venue-specific rulebooks for what is, economically, the same trade. Reporting has its own version of the problem. Both counterparties to an OTC trade have historically had to report it, generating two separate records of the same transaction in different repositories that then have to be reconciled, and mismatches between the two remain common enough that regulators are still tightening the rules around them.',
        callout:
          'CPMI-IOSCO’s global Unique Product Identifier only began rolling out in 2023–24 — the US from January 2024, the EU from April, the UK from September — replacing a patchwork of jurisdiction-specific product codes with one identifier a derivative carries wherever it is reported, over a decade after the reporting mandate itself began.',
      },
    ],
    keyTerms: [
      {
        term: 'SEF / MTF / OTF',
        definition:
          'The regulated electronic venues — Swap Execution Facilities in the US, Multilateral and Organised Trading Facilities in the EU — that a sufficiently standardised derivative is required to trade on rather than being negotiated bilaterally.',
      },
      {
        term: 'RFQ (request-for-quote)',
        definition:
          'An execution method where a client asks a chosen number of dealers to compete for one specific trade, rather than trading against a continuous public order book.',
      },
      {
        term: 'Made-available-to-trade (MAT) determination',
        definition:
          'The named, instrument-specific finding that triggers the US trading mandate — once approved, that swap can no longer be executed bilaterally.',
      },
      {
        term: 'Block trade',
        definition:
          'A trade above a published size threshold, permitted a short reporting delay so that publishing it does not itself move the market against whoever just dealt.',
      },
      {
        term: 'Trade repository',
        definition:
          'The regulated entity every OTC derivative, cleared or not, has to be reported to — the systemic map of exposures that did not exist before 2008.',
      },
      {
        term: 'UTI / UPI',
        definition:
          'The Unique Transaction Identifier, generated once per trade so both counterparties’ reports can be matched, and the Unique Product Identifier, reused across every trade in the same instrument.',
      },
    ],
    example: {
      title: 'Five quotes beat one phone call',
      lines: [
        'A pension fund needs to execute a $200,000,000, five-year swap that is subject to the US trade execution mandate, paying fixed against SOFR.',
        'On the SEF it requests quotes from five dealers at once: 3.42%, 3.41%, 3.44%, 3.40% and 3.43%. It deals at the best price, 3.40%, with the fourth dealer.',
        'A single relationship dealer, approached bilaterally instead, had quoted 3.45% earlier that morning — five basis points worse.',
        'On $200,000,000, five basis points is $200,000,000 × 0.0005 = $100,000 a year in fixed-leg cost, for as long as the five-year swap runs — $500,000 over its life before discounting.',
      ],
      takeaway:
        'None of that saving came from being right about rates — the fund took no view on where SOFR goes. It came entirely from being able to see five competing prices at once instead of trusting whichever single dealer picked up the phone, which is exactly the pre-trade transparency the venue mandate was built to create.',
    },
    inPractice:
      'Standardised interest rate swaps and index CDS trade almost exclusively on SEFs and MTFs/OTFs today, with RFQ the dominant execution method and a shrinking share still done by voice for the largest or most bespoke sizes. Every derivatives desk of any size runs a dedicated regulatory reporting function feeding trade repositories in every jurisdiction it operates in, because the reporting obligation runs trade by trade and mistakes are a compliance matter, not just an administrative one.',
    relatedProductIds: ['clearing', 'isda', 'irs'],
    quiz: [
      {
        id: 'execution-q1',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'Before the post-2008 reforms, standardised and bespoke OTC derivatives were typically negotiated the same way, with no public record of price or volume.',
        correctAnswer: true,
        explanation:
          'Bilateral, voice-brokered negotiation was the norm for both, which is exactly what the venue mandate changed for anything liquid enough to bear it.',
      },
      {
        id: 'execution-q2',
        kind: 'boolean',
        step: 1,
        difficulty: 'foundational',
        prompt:
          'The trading-venue mandate applies to every OTC derivative, however bespoke.',
        correctAnswer: false,
        explanation:
          'It applies only to instruments specific enough and liquid enough to have been formally designated — a MAT determination in the US, a trading-obligation finding in the EU.',
      },
      {
        id: 'execution-q3',
        kind: 'choice',
        step: 1,
        difficulty: 'intermediate',
        prompt: 'What is the EU’s equivalent of a US Swap Execution Facility?',
        options: [
          'A designated contract market',
          'A trade repository',
          'A Multilateral or Organised Trading Facility',
          'A central counterparty',
        ],
        correctIndex: 2,
        explanation:
          'MTFs pre-date MiFID II; the OTF was introduced specifically for non-equity instruments including derivatives, going live in 2018.',
      },
      {
        id: 'execution-q4',
        kind: 'boolean',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Once a swap has an approved MAT determination in the US, it can still be executed bilaterally if both counterparties agree.',
        correctAnswer: false,
        explanation:
          'Approval removes that option — the swap must trade on a SEF or a designated contract market from that point on.',
      },
      {
        id: 'execution-q5',
        kind: 'choice',
        step: 2,
        difficulty: 'intermediate',
        prompt:
          'Why is RFQ the dominant execution method for most swaps, rather than a continuous order book?',
        options: [
          'Regulators require RFQ for all standardised swaps',
          'Liquidity in most swaps is too thin to support a continuous order book the way equities can',
          'RFQ is cheaper for the venue to operate',
          'Order books are only permitted for cleared trades',
        ],
        correctIndex: 1,
        explanation:
          'A handful of competing quotes on demand suits a market where continuous two-sided liquidity at every price simply isn’t there.',
      },
      {
        id: 'execution-q6',
        kind: 'choice',
        step: 2,
        difficulty: 'advanced',
        prompt: 'What does a block trade’s reporting delay exist to do?',
        options: [
          'Give the regulator time to approve the trade before it is binding',
          'Let the two counterparties renegotiate the price if the market moves',
          'Stop publishing a large trade from itself moving the market against whoever just dealt',
          'Allow the trade to be reported to a different jurisdiction’s repository',
        ],
        correctIndex: 2,
        explanation:
          'A large trade published instantly could tip off the rest of the market to a position before the dealer who took the other side has managed the risk.',
      },
      {
        id: 'execution-q7',
        kind: 'boolean',
        step: 3,
        difficulty: 'foundational',
        prompt:
          'Trade repository data gives regulators a systemic view of exposures across the market that simply didn’t exist before 2008.',
        correctAnswer: true,
        explanation:
          'That visibility, not record-keeping for the two counterparties, is the actual point of the reporting mandate.',
      },
      {
        id: 'execution-q8',
        kind: 'choice',
        step: 3,
        difficulty: 'intermediate',
        prompt:
          'What pre-trade benefit does RFQ execution on a venue create that a single bilateral phone call does not?',
        options: [
          'A guaranteed better price than any bilateral quote',
          'Automatic central clearing of the trade',
          'Removal of counterparty credit risk entirely',
          'Visibility of more than one dealer’s price before dealing',
        ],
        correctIndex: 3,
        explanation:
          'Seeing competing quotes at once is the transparency benefit — it doesn’t guarantee the best possible price, only a genuine comparison.',
      },
      {
        id: 'execution-q9',
        kind: 'boolean',
        step: 4,
        difficulty: 'foundational',
        prompt:
          'A Unique Product Identifier is reused across every trade done in the same instrument.',
        correctAnswer: true,
        explanation:
          'Unlike a UTI, which is generated once per trade and never reused, a UPI identifies the product and repeats across every transaction in it.',
      },
      {
        id: 'execution-q10',
        kind: 'choice',
        step: 4,
        difficulty: 'intermediate',
        prompt: 'What does a made-available-to-trade determination do?',
        options: [
          'Names a specific swap that must move from bilateral execution onto a SEF or DCM',
          'Sets the price at which a swap must be dealt',
          'Determines which trade repository a swap must be reported to',
          'Confirms that a swap is eligible for central clearing',
        ],
        correctIndex: 0,
        explanation:
          'Clearing eligibility is a separate, earlier determination — MAT is specifically about where the trade has to be executed.',
      },
      {
        id: 'execution-q11',
        kind: 'boolean',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Swap Execution Facilities began operating in the US years before the EU’s Organised Trading Facility venue category existed.',
        correctAnswer: true,
        explanation:
          'SEFs date to 2013; MiFID II’s OTF category only went live at the start of 2018 — the two regimes never arrived on the same timeline.',
      },
      {
        id: 'execution-q12',
        kind: 'choice',
        step: 5,
        difficulty: 'advanced',
        prompt:
          'Why does a Unique Transaction Identifier matter for reporting quality?',
        options: [
          'It replaces the need for either counterparty to report at all',
          'It is only used for trades that are centrally cleared',
          'It sets the deadline by which a trade must be reported',
          'It lets two separately filed reports of the same trade be matched to each other',
        ],
        correctIndex: 3,
        explanation:
          'Both sides have historically had to report the same trade separately, and mismatches between the two reports are exactly what the UTI is designed to catch.',
      },
    ],
    depth: {
      sections: [
        {
          title: 'From agreement to record',
          content:
            'A trade is agreed in seconds and becomes a legal record over hours or days. Affirmation is both sides agreeing the economics; confirmation is the exchange of the definitive terms; and only then does the trade exist in a form either party could enforce or a regulator could read. Electronic platforms have compressed that timeline dramatically, and the reason it matters is uncomfortable: a portfolio of unconfirmed trades is a portfolio of disagreements nobody has found yet, and the disagreements surface when the market moves.',
          callout:
            'Confirmation backlogs were a named systemic concern in credit derivatives in the mid-2000s, and the industry was pushed into fixing them before the crisis rather than after.',
        },
        {
          title: 'Compression, and why notional shrinks',
          content:
            'Dealers accumulate offsetting trades: buy protection from one counterparty, sell it to another, repeat for years. The economics net to little and the gross notional, the operational load and the counterparty exposure all remain. Compression runs a multilateral exercise that terminates redundant trades and replaces them with fewer, economically equivalent ones. It is why headline notional figures in some markets have fallen sharply while activity has not — a fact worth knowing before drawing any conclusion from a notional time series.',
        },
        {
          title: 'Identifiers, and the reason for them',
          content:
            'Every reportable trade carries a unique identifier for the transaction and a code identifying the product, and both sides must report the same values or the two reports do not pair. Sorting that out consumed years of industry effort, for a simple reason: a regulator holding two unmatched halves of every trade knows less than one holding whole trades. The identifiers are administrative, and the ability to see aggregate exposure in a market — the thing nobody had in 2008 — depends entirely on the administration working.',
        },
      ],
      quiz: [
        {
          id: 'execution-d1',
          kind: 'choice',
          step: 2,
          difficulty: 'intermediate',
          prompt: 'What is affirmation?',
          options: [
            'The exchange of definitive legal terms',
            'Submission to a clearing house',
            'Reporting to a trade repository',
            'Both sides agreeing the economics of the trade',
          ],
          correctIndex: 3,
          explanation:
            'Confirmation is the step after it, and only then does an enforceable record exist.',
        },
        {
          id: 'execution-d2',
          kind: 'boolean',
          step: 2,
          difficulty: 'advanced',
          prompt:
            'A portfolio of unconfirmed trades is a portfolio of disagreements nobody has found yet.',
          correctAnswer: true,
          explanation:
            'And they surface when the market moves, which is the least convenient moment available.',
        },
        {
          id: 'execution-d3',
          kind: 'boolean',
          step: 2,
          difficulty: 'intermediate',
          prompt:
            'Confirmation backlogs in credit derivatives were a recognised systemic concern before 2008.',
          correctAnswer: true,
          explanation:
            'The industry was pushed into addressing them in advance rather than in the aftermath.',
        },
        {
          id: 'execution-d4',
          kind: 'choice',
          step: 3,
          difficulty: 'advanced',
          prompt: 'What does portfolio compression do?',
          options: [
            'Moves trades to a clearing house',
            'Nets collateral across counterparties',
            'Terminates redundant offsetting trades and replaces them with fewer equivalent ones',
            'Reduces the market risk of a portfolio',
          ],
          correctIndex: 2,
          explanation:
            'The economics are preserved; the gross notional, operational load and counterparty exposure fall.',
        },
        {
          id: 'execution-d5',
          kind: 'boolean',
          step: 3,
          difficulty: 'advanced',
          prompt:
            'A fall in headline notional can reflect compression rather than a fall in activity.',
          correctAnswer: true,
          explanation:
            'Worth knowing before drawing any conclusion from a notional time series.',
        },
        {
          id: 'execution-d6',
          kind: 'choice',
          step: 3,
          difficulty: 'intermediate',
          prompt: 'Why do offsetting trades accumulate in the first place?',
          options: [
            'Because clearing houses require gross positions',
            'Because each new trade is with a different counterparty rather than a reversal of the old one',
            'Because compression is prohibited between dealers',
            'Because trades cannot be terminated early',
          ],
          correctIndex: 1,
          explanation:
            'Buying from one and selling to another leaves the economics flat and everything else outstanding.',
        },
        {
          id: 'execution-d7',
          kind: 'boolean',
          step: 4,
          difficulty: 'intermediate',
          prompt:
            'Both sides of a reportable trade must report matching identifiers for the reports to pair.',
          correctAnswer: true,
          explanation:
            'Otherwise the repository holds two unmatched halves and knows less than it appears to.',
        },
        {
          id: 'execution-d8',
          kind: 'choice',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'Why did identifier standardisation take years of industry effort?',
          options: [
            'Because both counterparties must generate and use the same value for the same trade',
            'Because identifiers were considered confidential',
            'Because regulators disagreed on their length',
            'Because clearing houses refused to adopt them',
          ],
          correctIndex: 0,
          explanation:
            'Administrative, unglamorous, and the difference between seeing a market and seeing half of one.',
        },
        {
          id: 'execution-d9',
          kind: 'boolean',
          step: 4,
          difficulty: 'advanced',
          prompt:
            'The ability to measure aggregate exposure in a market depends on the reporting administration working.',
          correctAnswer: true,
          explanation:
            'It is precisely the visibility nobody had in 2008, and it rests on identifiers matching.',
        },
        {
          id: 'execution-d10',
          kind: 'choice',
          step: 5,
          difficulty: 'intermediate',
          prompt: 'What is the practical lesson of the lifecycle steps?',
          options: [
            'Electronic platforms have removed operational risk',
            'Confirmation is a formality after clearing',
            'Legal records are produced at maturity',
            'A trade agreed is not yet a trade recorded, and the gap carries risk',
          ],
          correctIndex: 3,
          explanation:
            'Everything between agreement and record is exposure to a disagreement that has not surfaced.',
        },
        {
          id: 'execution-d11',
          kind: 'boolean',
          step: 5,
          difficulty: 'foundational',
          prompt: 'Compression changes the economic position of the participants.',
          correctAnswer: false,
          explanation:
            'It preserves the economics deliberately. What it removes is redundancy.',
        },
        {
          id: 'execution-d12',
          kind: 'choice',
          step: 5,
          difficulty: 'advanced',
          prompt:
            'What does a regulator holding unmatched trade reports actually have?',
          options: [
            'A view of cleared trades only',
            'A duplicate of the clearing house’s records',
            'Less than it appears to, since it cannot reconstruct whole trades',
            'A complete view of the market',
          ],
          correctIndex: 2,
          explanation:
            'Two halves that cannot be joined are not a picture of anything.',
        },
      ],
    },
  },
];
