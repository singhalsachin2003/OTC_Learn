import {
  normalisePromoCode,
  parsePromoUnlock,
  promoDaysRemaining,
  promoUnlockActive,
  redeemPromoCode,
  type PromoCode,
  type PromoUnlock,
} from '../../src/utils/promoCode';

const DAY = 24 * 60 * 60 * 1000;

/** Mid-campaign, so a code with a 2026 window is live at this instant. */
const NOW = Date.UTC(2026, 8, 12, 9, 30);

const CODES: readonly PromoCode[] = [
  {
    code: 'OTCLAUNCH',
    campaign: 'launch',
    days: 60,
    redeemableUntil: '2026-12-31',
  },
  {
    code: 'SHORTONE',
    campaign: 'conference',
    days: 7,
    redeemableUntil: '2026-12-31',
  },
  { code: 'OVER', campaign: 'past', days: 30, redeemableUntil: '2026-01-31' },
  { code: 'BADDATE', campaign: 'typo', days: 30, redeemableUntil: 'not-a-date' },
];

function granted(outcome: ReturnType<typeof redeemPromoCode>): PromoUnlock {
  if (outcome.result !== 'granted') {
    throw new Error(`expected a grant, got ${outcome.result}`);
  }
  return outcome.unlock;
}

describe('normalisePromoCode', () => {
  /**
   * Readers type these off a slide or out of a chat message, so the shapes a
   * code arrives in are not the shape it was written in.
   */
  it('ignores case, spaces and dashes', () => {
    expect(normalisePromoCode(' otc-launch ')).toBe('OTCLAUNCH');
    expect(normalisePromoCode('OTC LAUNCH')).toBe('OTCLAUNCH');
  });

  it('reduces a code with nothing in it to an empty string', () => {
    expect(normalisePromoCode('   ---  ')).toBe('');
  });
});

describe('redeemPromoCode', () => {
  it('grants the code’s days from the moment it is redeemed', () => {
    const unlock = granted(redeemPromoCode('OTCLAUNCH', NOW, null, CODES));
    expect(unlock.campaign).toBe('launch');
    expect(unlock.grantedAt).toBe(NOW);
    expect(unlock.expiresAt).toBe(NOW + 60 * DAY);
  });

  it('matches however the reader typed it', () => {
    expect(redeemPromoCode('otc launch', NOW, null, CODES).result).toBe('granted');
  });

  it('separates a code it does not know from an empty field', () => {
    expect(redeemPromoCode('NOPE', NOW, null, CODES).result).toBe('unknown');
    expect(redeemPromoCode('  ', NOW, null, CODES).result).toBe('empty');
  });

  /** A campaign that has closed retires its own code, with no release needed. */
  it('turns down a code whose campaign has ended', () => {
    expect(redeemPromoCode('OVER', NOW, null, CODES).result).toBe('campaign-ended');
  });

  /**
   * `redeemableUntil` is inclusive of the whole named day, because a code good
   * "until 31 December" that stopped working at midnight on the 30th would be
   * wrong in the direction the reader notices.
   */
  it('still redeems on the last day of the window', () => {
    const lastDay = Date.UTC(2026, 11, 31, 23, 0);
    expect(redeemPromoCode('OTCLAUNCH', lastDay, null, CODES).result).toBe(
      'granted',
    );
    const justAfter = Date.UTC(2027, 0, 1, 0, 1);
    expect(redeemPromoCode('OTCLAUNCH', justAfter, null, CODES).result).toBe(
      'campaign-ended',
    );
  });

  /** A typo in the table costs a promotion, never the price of the content. */
  it('refuses a code whose window will not parse', () => {
    expect(redeemPromoCode('BADDATE', NOW, null, CODES).result).toBe(
      'campaign-ended',
    );
  });

  describe('when a grant is already held', () => {
    const long: PromoUnlock = {
      code: 'OTCLAUNCH',
      campaign: 'launch',
      grantedAt: NOW,
      expiresAt: NOW + 60 * DAY,
    };

    /**
     * The rule that matters: redeeming never shortens access. Someone holding
     * 60 days who tries a 7-day code has not asked to give up 53, and a silent
     * downgrade would be indistinguishable from a bug.
     */
    it('keeps the longer grant and reports it rather than replacing it', () => {
      const outcome = redeemPromoCode('SHORTONE', NOW + DAY, long, CODES);
      expect(outcome.result).toBe('already-longer');
      if (outcome.result === 'already-longer') {
        expect(outcome.unlock).toEqual(long);
      }
    });

    it('replaces a grant that a new code would outlast', () => {
      const short: PromoUnlock = { ...long, expiresAt: NOW + 2 * DAY };
      const unlock = granted(redeemPromoCode('OTCLAUNCH', NOW, short, CODES));
      expect(unlock.expiresAt).toBe(NOW + 60 * DAY);
    });
  });
});

describe('promoUnlockActive', () => {
  const unlock: PromoUnlock = {
    code: 'OTCLAUNCH',
    campaign: 'launch',
    grantedAt: NOW,
    expiresAt: NOW + 10 * DAY,
  };

  it('is false without a grant', () => {
    expect(promoUnlockActive(null, NOW)).toBe(false);
  });

  it('runs until the expiry and not past it', () => {
    expect(promoUnlockActive(unlock, NOW + 9 * DAY)).toBe(true);
    expect(promoUnlockActive(unlock, unlock.expiresAt)).toBe(false);
    expect(promoUnlockActive(unlock, unlock.expiresAt + 1)).toBe(false);
  });

  /**
   * Rounded up, so the final hours read as "1 day left" rather than "0 days"
   * while the content is plainly still open.
   */
  it('counts a part day as a day remaining', () => {
    expect(promoDaysRemaining(unlock, NOW)).toBe(10);
    expect(promoDaysRemaining(unlock, unlock.expiresAt - 1)).toBe(1);
    expect(promoDaysRemaining(unlock, unlock.expiresAt)).toBe(0);
    expect(promoDaysRemaining(null, NOW)).toBe(0);
  });
});

describe('parsePromoUnlock', () => {
  /**
   * A corrupt grant is no grant. The paywall coming back is recoverable; a
   * half-written value opening the paid catalogue is not.
   */
  it.each([
    ['null', null],
    ['a string', 'OTCLAUNCH'],
    ['a partial object', { code: 'X', campaign: 'y' }],
    [
      'a non-numeric expiry',
      { code: 'X', campaign: 'y', grantedAt: 1, expiresAt: 'z' },
    ],
    [
      'an infinite expiry',
      { code: 'X', campaign: 'y', grantedAt: 1, expiresAt: Infinity },
    ],
  ])('reads %s as no grant', (_label, value) => {
    expect(parsePromoUnlock(value)).toBeNull();
  });

  it('accepts a grant it wrote itself', () => {
    const unlock = granted(redeemPromoCode('OTCLAUNCH', NOW, null, CODES));
    expect(parsePromoUnlock(JSON.parse(JSON.stringify(unlock)))).toEqual(unlock);
  });
});
