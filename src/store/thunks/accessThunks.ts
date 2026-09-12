import { createAsyncThunk } from '@reduxjs/toolkit';

import { track } from '../../utils/analytics';
import { redeemPromoCode, type RedeemOutcome } from '../../utils/promoCode';
import {
  isPremium,
  isPurchasesConfigured,
  loadOffers,
  purchaseOffer,
  restoreEntitlements,
  PREMIUM_ENTITLEMENT_ID,
} from '../../utils/purchases';
import { savePromoUnlock } from '../../utils/storage';
import type { RootState } from '../index';
import {
  purchaseFailed,
  setEntitlement,
  setNotice,
  setOffers,
  setPremium,
  setPromoUnlock,
  setPurchaseStatus,
} from '../slices/accessSlice';

/**
 * Whether this build can sell anything, and whether this user has bought it.
 *
 * Never awaited by anything that renders, for the same reason sync is not: a
 * device with no signal must behave exactly as the app did before billing
 * existed. Until it resolves the store says nothing is configured, so the whole
 * catalogue is open — the app fails open for the moment it takes to ask, and
 * closed thereafter.
 */
export const refreshEntitlement = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('access/refreshEntitlement', async (_arg, { dispatch }) => {
  const configured = isPurchasesConfigured();
  if (!configured) {
    dispatch(
      setEntitlement({
        purchasesConfigured: false,
        hasPurchasableOffer: false,
        premium: false,
      }),
    );
    return;
  }

  // Both questions asked before either answer lands, so the paywall never
  // switches on halfway through knowing whether it should.
  const [premium, offers] = await Promise.all([
    isPremium(PREMIUM_ENTITLEMENT_ID),
    loadOffers(),
  ]);
  dispatch(
    setEntitlement({
      purchasesConfigured: true,
      hasPurchasableOffer: offers.length > 0,
      premium,
    }),
  );
  // Kept, so the paywall screen has something to render before its own fetch
  // returns rather than a moment of "nothing on sale".
  dispatch(setOffers(offers));
});

/**
 * Fetches what is on sale, for the paywall to render.
 *
 * An empty list is a normal answer, not an error: no key, no network and no
 * offering configured yet all arrive here the same way, and the screen has
 * something to say in each case.
 */
export const loadPaywallOffers = createAsyncThunk<void, void, { state: RootState }>(
  'access/loadOffers',
  async (_arg, { dispatch }) => {
    dispatch(setPurchaseStatus('loading'));
    dispatch(setOffers(await loadOffers()));
    dispatch(setPurchaseStatus('idle'));
  },
);

export const buyOffer = createAsyncThunk<void, string, { state: RootState }>(
  'access/buy',
  async (offerId, { dispatch, getState }) => {
    const offer = getState().access.offers.find((o) => o.id === offerId);
    dispatch(setPurchaseStatus('purchasing'));
    track({ name: 'purchase_started', period: offer?.period ?? 'other' });

    const outcome = await purchaseOffer(offerId);
    if (outcome.result === 'purchased') {
      dispatch(setPremium(true));
      dispatch(setPurchaseStatus('idle'));
      track({ name: 'purchase_completed', period: offer?.period ?? 'other' });
      return;
    }
    if (outcome.result === 'cancelled') {
      // Backing out of Play's sheet is the commonest ending there is. Saying
      // anything about it would be the app arguing with a decision.
      dispatch(setPurchaseStatus('idle'));
      return;
    }
    dispatch(purchaseFailed(outcome.message));
    track({ name: 'purchase_failed' });
  },
);

/**
 * Asks the store what this Google account already owns.
 *
 * Every store that sells subscriptions needs this: a reinstall, a second
 * device or a cleared cache otherwise leaves someone paying with nothing to
 * show for it, and no amount of retrying inside the app fixes it.
 */
export const restoreSubscription = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('access/restore', async (_arg, { dispatch }) => {
  dispatch(setPurchaseStatus('restoring'));
  const outcome = await restoreEntitlements();

  if (outcome.result === 'restored') {
    dispatch(setPremium(true));
    dispatch(setPurchaseStatus('idle'));
    track({ name: 'purchase_restored' });
    return;
  }

  // Deliberately not `setPremium(false)` on a failure: the store was never
  // reached, so nothing was learned, and revoking a subscriber's access over a
  // dropped connection would be the worst thing this button could do.
  if (outcome.result === 'failed') {
    dispatch(purchaseFailed(outcome.message));
    return;
  }

  dispatch(setPremium(false));
  dispatch(setNotice('No subscription found on this Google account.'));
});

/**
 * Redeems a promotional code typed by the reader.
 *
 * Returns the outcome as well as dispatching, because the screen says something
 * different for each of them and nothing here should have to encode the wording.
 *
 * The grant is written to storage *before* it reaches the store, so an install
 * that is killed the instant after redeeming still holds what it was given —
 * the alternative loses the code, and a campaign-limited code cannot be
 * redeemed twice to recover from that. A failed write is not treated as a failed
 * redemption: the reader typed a valid code and should get their access, even if
 * it turns out to last only until they close the app. Storage failures here are
 * already swallowed by `writeJson`, so there is nothing to report either way.
 *
 * No offer, price or Play transaction is involved — see `utils/promoCode.ts`.
 */
export const redeemPromo = createAsyncThunk<
  RedeemOutcome,
  string,
  { state: RootState }
>('access/redeemPromo', async (input, { dispatch, getState }) => {
  const now = Date.now();
  const outcome = redeemPromoCode(input, now, getState().access.promoUnlock);

  if (outcome.result === 'granted') {
    await savePromoUnlock(outcome.unlock);
    dispatch(setPromoUnlock({ unlock: outcome.unlock, now }));
    track({ name: 'promo_redeemed', campaign: outcome.unlock.campaign });
    return outcome;
  }

  // Every other outcome leaves the stored grant exactly as it was, including
  // `already-longer`: the reader loses nothing by trying a shorter code.
  track({ name: 'promo_rejected', reason: outcome.result });
  return outcome;
});
