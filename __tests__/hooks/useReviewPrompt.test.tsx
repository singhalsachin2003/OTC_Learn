import { act, renderHook } from '@testing-library/react-native';
import * as StoreReview from 'expo-store-review';

import { useReviewPrompt } from '../../src/hooks/useReviewPrompt';
import {
  loadReviewPromptedAt,
  saveReviewPromptedAt,
  STORAGE_KEYS,
} from '../../src/utils/storage';
import { REVIEW_PROMPT_INTERVAL_DAYS } from '../../src/utils/storeReview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAvailable = jest.mocked(StoreReview.isAvailableAsync);
const hasAction = jest.mocked(StoreReview.hasAction);
const request = jest.mocked(StoreReview.requestReview);

/**
 * Runs the settle delay out and lets the promise chain behind it drain —
 * `advanceTimersByTimeAsync` yields between timers, which the storage read
 * inside the timeout needs in order to resolve.
 */
async function settle() {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(5000);
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  isAvailable.mockResolvedValue(true);
  hasAction.mockResolvedValue(true);
  request.mockResolvedValue(undefined);
  await AsyncStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('asks for a review after a sitting that crossed the threshold', async () => {
  await renderHook(() => useReviewPrompt(true));
  await settle();

  expect(request).toHaveBeenCalledTimes(1);
  expect(await loadReviewPromptedAt()).toEqual(expect.any(Number));
});

it('asks for nothing when the sitting crossed nothing', async () => {
  await renderHook(() => useReviewPrompt(false));
  await settle();

  expect(request).not.toHaveBeenCalled();
});

// The sheet covers the screen, so someone who has already tapped through to
// another screen must not have it appear over wherever they landed.
it('cancels the prompt if the screen goes away first', async () => {
  const { unmount } = await renderHook(() => useReviewPrompt(true));
  await unmount();
  await settle();

  expect(request).not.toHaveBeenCalled();
});

it('does not ask twice inside the interval', async () => {
  await saveReviewPromptedAt(Date.now());

  await renderHook(() => useReviewPrompt(true));
  await settle();

  expect(request).not.toHaveBeenCalled();
});

it('asks again once the interval has passed', async () => {
  await saveReviewPromptedAt(
    Date.now() - REVIEW_PROMPT_INTERVAL_DAYS * 24 * 60 * 60 * 1000,
  );

  await renderHook(() => useReviewPrompt(true));
  await settle();

  expect(request).toHaveBeenCalledTimes(1);
});

// Otherwise a device that cannot show the sheet — an emulator, a sideload —
// spends the whole interval unable to ask on a prompt nobody ever saw.
it('does not spend the interval on a prompt the store refused', async () => {
  hasAction.mockResolvedValue(false);

  await renderHook(() => useReviewPrompt(true));
  await settle();

  expect(await AsyncStorage.getItem(STORAGE_KEYS.reviewPromptedAt)).toBeNull();
});
