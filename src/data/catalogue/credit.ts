import type { Product } from '../types';

/** Credit products. Ids are stable — saved progress is keyed by them. */
export const creditProducts: Product[] = [
  {
    id: 'cds',
    categoryId: 'credit',
    name: 'Credit Default Swap',
    hook: 'Insurance against a borrower defaulting',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'In a CDS, the protection buyer pays a periodic premium (the spread) to the protection seller, who pays out if a defined credit event occurs on a reference entity.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The spread is paid quarterly on the notional for as long as nothing goes wrong. If a credit event occurs the contract terminates and the seller compensates the buyer for the loss — broadly the notional multiplied by one minus the recovery rate, which is set by an industry-wide auction.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'CDS let investors hedge credit risk on bonds or loans they hold, or take a view on a company’s creditworthiness without owning its debt.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference entity, spread in basis points, notional, and the credit event definition — typically bankruptcy, failure to pay, or restructuring. An ISDA Determinations Committee rules on whether an event has actually occurred.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Protection is only as good as the seller, and wrong-way risk arises when the seller’s own health is correlated with the reference entity. Disputes over what counts as a credit event have gone to court, and spreads move constantly, creating mark-to-market swings before any default happens.',
      },
    ],
    quiz: [
      {
        id: 'cds-q1',
        question: 'The protection buyer pays a periodic premium called the spread.',
        correctAnswer: true,
        explanation:
          'That premium compensates the seller for taking on default risk.',
      },
      {
        id: 'cds-q2',
        question: 'A CDS payout is triggered by a rise in interest rates.',
        correctAnswer: false,
        explanation:
          'CDS pay out on a defined credit event, such as default or restructuring — not rate moves.',
      },
      {
        id: 'cds-q3',
        question: 'You must own the underlying bond to buy CDS protection.',
        correctAnswer: false,
        explanation:
          '"Naked" CDS positions, without owning the reference debt, are common.',
      },
      {
        id: 'cds-q4',
        question:
          'The payout after a credit event depends on the recovery rate of the defaulted debt.',
        correctAnswer: true,
        explanation:
          'The seller covers the loss — roughly notional times one minus recovery.',
      },
      {
        id: 'cds-q5',
        question:
          'A CDS contract continues running after a credit event is settled.',
        correctAnswer: false,
        explanation:
          'The contract terminates once the credit event has been settled.',
      },
    ],
  },
  {
    id: 'cdx',
    categoryId: 'credit',
    name: 'CDX Index',
    hook: 'A basket of CDS in one tradable index',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A CDX is a tradable index built from a basket of single-name CDS (e.g. CDX.NA.IG), giving broad exposure to a segment of the credit market in one trade.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The index carries a fixed coupon and weights its constituents equally. If one name suffers a credit event it is removed from the index, the protection buyer is compensated for that name’s loss, and the remaining notional continues on the surviving names.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It’s a far more efficient way to hedge or gain exposure to overall credit risk than trading dozens of single-name CDS individually.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'A new series rolls out roughly every six months with refreshed constituents; the newest is the on-the-run series and carries the most liquidity. Tranches let investors take exposure to specific loss layers of the basket.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'An index rarely matches a specific portfolio, so hedging with one leaves basis risk. Older off-the-run series become hard to trade, and tranche positions can behave very differently from the index itself as correlation shifts.',
      },
    ],
    quiz: [
      {
        id: 'cdx-q1',
        question: 'A CDX index references a single company.',
        correctAnswer: false,
        explanation: 'It references a basket of many reference entities.',
      },
      {
        id: 'cdx-q2',
        question:
          'New index series roll periodically, refreshing the constituents.',
        correctAnswer: true,
        explanation: 'Rolls keep the index representative of the current market.',
      },
      {
        id: 'cdx-q3',
        question:
          'Tranches let investors take exposure to specific loss layers of the basket.',
        correctAnswer: true,
        explanation:
          'Tranching splits the basket’s losses into ordered risk layers.',
      },
      {
        id: 'cdx-q4',
        question:
          'When a constituent suffers a credit event it is removed and the index notional shrinks.',
        correctAnswer: true,
        explanation:
          'The buyer is paid for that name’s loss and the rest of the index continues.',
      },
      {
        id: 'cdx-q5',
        question: 'A CDX position hedges any credit portfolio perfectly.',
        correctAnswer: false,
        explanation:
          'Constituents and weights rarely match a real portfolio, so basis risk remains.',
      },
    ],
  },
  {
    id: 'trs',
    categoryId: 'credit',
    name: 'Total Return Swap',
    hook: 'Rent the full return of an asset',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'In a total return swap one party receives all the economics of a reference asset — its coupons or interest plus any change in price — and pays a financing rate in exchange. Legal ownership never moves.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The total return receiver pays a financing leg, say SOFR plus 120 basis points, and receives the asset’s income and price gains. If the asset falls in value, the receiver pays that loss across as well — so both credit and market risk transfer synthetically.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It gives leveraged exposure to bonds or loans without funding the full purchase price, lets a holder shed the risk of an asset while keeping it on the balance sheet, and opens up assets an investor cannot buy directly.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference asset, total return leg, financing leg and its spread, valuation and reset dates, plus the collateral posted and the haircut applied to it.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'Leverage magnifies losses, and a falling asset value triggers collateral calls that can force an exit at the worst time. The receiver carries both the asset’s risk and the counterparty’s, and unwinding a large position in an illiquid asset can be expensive.',
      },
    ],
    quiz: [
      {
        id: 'trs-q1',
        question:
          'A total return swap transfers both the income and the price risk of the reference asset.',
        correctAnswer: true,
        explanation:
          'The receiver gets coupons and gains, and absorbs losses — the full economics.',
      },
      {
        id: 'trs-q2',
        question: 'The total return receiver becomes the legal owner of the asset.',
        correctAnswer: false,
        explanation:
          'Ownership stays with the payer; the receiver’s exposure is purely synthetic.',
      },
      {
        id: 'trs-q3',
        question: 'The total return receiver pays a financing rate plus a spread.',
        correctAnswer: true,
        explanation:
          'That financing leg is the cost of gaining the exposure without buying the asset.',
      },
      {
        id: 'trs-q4',
        question:
          'If the reference asset falls in value, the total return receiver pays that loss.',
        correctAnswer: true,
        explanation:
          'The swap passes losses across just as it passes gains — the flow simply reverses.',
      },
      {
        id: 'trs-q5',
        question:
          'A total return swap requires the receiver to fund the asset’s full purchase price.',
        correctAnswer: false,
        explanation:
          'Avoiding that full funding is the point — which is exactly what creates the leverage.',
      },
    ],
  },
  {
    id: 'cln',
    categoryId: 'credit',
    name: 'Credit-Linked Note',
    hook: 'A bond whose repayment depends on a credit event',
    lessons: [
      {
        step: 1,
        title: 'What it is',
        content:
          'A credit-linked note is a debt security with a credit derivative built into it. Investors buy the note and earn an enhanced coupon; in return, repayment of their principal depends on no credit event occurring at a reference entity.',
      },
      {
        step: 2,
        title: 'How it works',
        content:
          'The issuer is effectively buying protection from the noteholders. Investors pay cash upfront, which is held as collateral. If nothing goes wrong they receive par at maturity plus coupons along the way; if a credit event occurs the note redeems early at the recovery value and investors absorb the shortfall.',
      },
      {
        step: 3,
        title: 'Why it’s used',
        content:
          'It repackages a derivative into a funded security, so investors whose mandates prevent them from entering swaps — many funds and insurers — can still take credit exposure. For the issuer, holding the cash upfront removes counterparty risk on the protection.',
      },
      {
        step: 4,
        title: 'Key terms',
        content:
          'Reference entity, the embedded CDS, the collateral backing the note, the enhanced coupon, and the contingent principal that may redeem early at recovery value.',
      },
      {
        step: 5,
        title: 'Risks to watch',
        content:
          'The investor is exposed three ways at once — to the reference entity, to the issuer of the note, and often to the collateral held against it. These notes are also frequently illiquid and difficult to sell before maturity.',
      },
    ],
    quiz: [
      {
        id: 'cln-q1',
        question:
          'A credit-linked note pays an enhanced coupon in exchange for taking credit risk.',
        correctAnswer: true,
        explanation:
          'The extra yield is compensation for the embedded protection the investor sells.',
      },
      {
        id: 'cln-q2',
        question: 'The noteholder is effectively selling credit protection.',
        correctAnswer: true,
        explanation:
          'The issuer buys protection; the investor takes the other side of it.',
      },
      {
        id: 'cln-q3',
        question:
          'Principal on a credit-linked note is repaid in full regardless of credit events.',
        correctAnswer: false,
        explanation:
          'Principal is contingent — a credit event can cut repayment to recovery value.',
      },
      {
        id: 'cln-q4',
        question:
          'A credit-linked note is a funded instrument, unlike a plain CDS.',
        correctAnswer: true,
        explanation:
          'Investors pay cash upfront, which is what makes it accessible to bond buyers.',
      },
      {
        id: 'cln-q5',
        question:
          'A credit-linked note exposes the investor only to the reference entity.',
        correctAnswer: false,
        explanation:
          'The investor also carries the issuer’s credit risk and often the collateral’s.',
      },
    ],
  },
];
