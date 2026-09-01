import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SubscriptionOffer } from '../../utils/purchases';

/** What the paywall screen is doing, so its buttons can say so. */
export type PurchaseStatus = 'idle' | 'loading' | 'purchasing' | 'restoring';

/**
 * Who this user is allowed to be, and what they can buy.
 *
 * The first three fields are exactly the inputs `utils/access.ts` takes, so
 * `paywallApplies(state.access)` reads the rules straight off the store rather
 * than assembling an argument at each call site. Everything after them belongs
 * to the paywall screen alone.
 *
 * A slice of its own, and deliberately not touched by `resetEverything`: an
 * entitlement is not study data, and someone wiping their progress has not
 * asked to stop being a subscriber.
 */
export interface AccessSliceState {
  purchasesConfigured: boolean;
  hasPurchasableOffer: boolean;
  premium: boolean;
  grandfathered: boolean;
  offers: SubscriptionOffer[];
  status: PurchaseStatus;
  /** Why the last attempt failed, or null. */
  error: string | null;
  /** A plain outcome worth saying that is not a failure — see `setNotice`. */
  notice: string | null;
}

export const initialAccessState: AccessSliceState = {
  // Every field defaults to the state the app has always been in: nothing to
  // sell, nobody paying, and so no paywall anywhere.
  purchasesConfigured: false,
  hasPurchasableOffer: false,
  premium: false,
  grandfathered: false,
  offers: [],
  status: 'idle',
  error: null,
  notice: null,
};

const accessSlice = createSlice({
  name: 'access',
  initialState: initialAccessState,
  reducers: {
    /** Read from storage during hydration, with everything else persisted. */
    setGrandfathered(state, action: PayloadAction<boolean>) {
      state.grandfathered = action.payload;
    },

    /**
     * Both halves of the entitlement question at once, and only once the
     * answer is actually known.
     *
     * They land together because `purchasesConfigured` alone is enough to
     * close the paywall: a build with a key that had not yet heard back about
     * the entitlement would lock the catalogue for a subscriber for as long as
     * the call took. Until this arrives the app is the app it has always
     * been, which is the right way round to be wrong.
     */
    setEntitlement(
      state,
      action: PayloadAction<{
        purchasesConfigured: boolean;
        hasPurchasableOffer: boolean;
        premium: boolean;
      }>,
    ) {
      state.purchasesConfigured = action.payload.purchasesConfigured;
      state.hasPurchasableOffer = action.payload.hasPurchasableOffer;
      state.premium = action.payload.premium;
    },

    setPremium(state, action: PayloadAction<boolean>) {
      state.premium = action.payload;
    },

    setOffers(state, action: PayloadAction<SubscriptionOffer[]>) {
      state.offers = action.payload;
      // The paywall screen refetches on every visit, so this is the freshest
      // answer to "is there anything to sell" the app ever has.
      state.hasPurchasableOffer = action.payload.length > 0;
    },

    setPurchaseStatus(state, action: PayloadAction<PurchaseStatus>) {
      state.status = action.payload;
      // Starting something clears what the last attempt said, so a stale
      // failure cannot sit under a spinner describing a different attempt.
      state.error = null;
      state.notice = null;
    },

    purchaseFailed(state, action: PayloadAction<string>) {
      state.status = 'idle';
      state.error = action.payload;
    },

    /**
     * For the one outcome that is neither success nor failure: a restore that
     * finds nothing. Styling it as an error would accuse someone who has
     * simply never bought anything of having a problem.
     */
    setNotice(state, action: PayloadAction<string | null>) {
      state.status = 'idle';
      state.notice = action.payload;
    },
  },
});

export const {
  setGrandfathered,
  setEntitlement,
  setPremium,
  setOffers,
  setPurchaseStatus,
  purchaseFailed,
  setNotice,
} = accessSlice.actions;

export default accessSlice.reducer;
