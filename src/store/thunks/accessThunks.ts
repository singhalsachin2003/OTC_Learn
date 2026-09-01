import { createAsyncThunk } from '@reduxjs/toolkit';

import { track } from '../../utils/analytics';
import {
  isPremium,
  isPurchasesConfigured,
  loadOffers,
  purchaseOffer,
  restoreEntitlements,
  PREMIUM_ENTITLEMENT_ID,
} from '../../utils/purchases';
import type { RootState } from '../index';
import {
  purchaseFailed,
  setEntitlement,
  setNotice,
  setOffers,
  setPremium,
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
  dispatch(
    setEntitlement({
      purchasesConfigured: configured,
      premium: configured && (await isPremium(PREMIUM_ENTITLEMENT_ID)),
    }),
  );
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
  const premium = await restoreEntitlements();
  dispatch(setPremium(premium));
  if (premium) {
    dispatch(setPurchaseStatus('idle'));
    track({ name: 'purchase_restored' });
    return;
  }
  dispatch(setNotice('No subscription found on this Google account.'));
});
