import AsyncStorage from '@react-native-async-storage/async-storage';

import reducer, {
  initialProgressState,
  markProductComplete,
  setProgress,
} from '../../src/store/slices/progressSlice';
import { createStore } from '../../src/store';
import {
  completeProduct,
  loadProgress,
} from '../../src/store/thunks/progressThunks';
import { STORAGE_KEYS } from '../../src/utils/storage';

describe('progressSlice reducer', () => {
  it('starts with no completed products', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialProgressState);
  });

  it('marks a product complete', () => {
    const state = reducer(initialProgressState, markProductComplete('irs'));

    expect(state.completedProductIds).toEqual(['irs']);
  });

  it('does not duplicate an already-completed product', () => {
    const once = reducer(initialProgressState, markProductComplete('irs'));
    const twice = reducer(once, markProductComplete('irs'));

    expect(twice.completedProductIds).toEqual(['irs']);
  });

  it('de-duplicates when replacing the whole list', () => {
    const state = reducer(initialProgressState, setProgress(['irs', 'irs', 'cds']));

    expect(state.completedProductIds).toEqual(['irs', 'cds']);
  });
});

describe('progress thunks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('hydrates completed products from storage', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.completedProducts,
      JSON.stringify(['irs', 'cds']),
    );

    const store = createStore();
    await store.dispatch(loadProgress());

    expect(store.getState().progress.completedProductIds).toEqual(['irs', 'cds']);
    expect(store.getState().progress.loading).toBe(false);
  });

  it('falls back to an empty list when storage holds junk', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.completedProducts, 'not json');

    const store = createStore();
    await store.dispatch(loadProgress());

    expect(store.getState().progress.completedProductIds).toEqual([]);
  });

  it('completes a product and persists it', async () => {
    const store = createStore();
    await store.dispatch(completeProduct('fxopt'));

    expect(store.getState().progress.completedProductIds).toEqual(['fxopt']);
    await expect(
      AsyncStorage.getItem(STORAGE_KEYS.completedProducts),
    ).resolves.toBe(JSON.stringify(['fxopt']));
  });

  it('does not rewrite storage when the product is already complete', async () => {
    const store = createStore();
    await store.dispatch(completeProduct('fxopt'));

    // The AsyncStorage module is already a jest mock, so clear the history the
    // first dispatch left behind before asserting on the second.
    const setItem = jest.spyOn(AsyncStorage, 'setItem');
    setItem.mockClear();

    await store.dispatch(completeProduct('fxopt'));

    expect(setItem).not.toHaveBeenCalled();
    expect(store.getState().progress.completedProductIds).toEqual(['fxopt']);
  });

  it('survives a restart — persisted progress reloads into a fresh store', async () => {
    const first = createStore();
    await first.dispatch(completeProduct('cmswap'));

    const restarted = createStore();
    await restarted.dispatch(loadProgress());

    expect(restarted.getState().progress.completedProductIds).toEqual(['cmswap']);
  });
});
