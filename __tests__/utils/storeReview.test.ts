import * as StoreReview from 'expo-store-review';

import {
  requestReview,
  REVIEW_PROMPT_INTERVAL_DAYS,
  shouldAskForReview,
} from '../../src/utils/storeReview';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-09-06T10:00:00Z');

const isAvailable = jest.mocked(StoreReview.isAvailableAsync);
const hasAction = jest.mocked(StoreReview.hasAction);
const request = jest.mocked(StoreReview.requestReview);

beforeEach(() => {
  jest.clearAllMocks();
  isAvailable.mockResolvedValue(true);
  hasAction.mockResolvedValue(true);
  request.mockResolvedValue(undefined);
});

describe('shouldAskForReview', () => {
  it('asks the first time a sitting crosses the mastery threshold', () => {
    expect(
      shouldAskForReview({
        crossedThreshold: true,
        lastPromptedAt: null,
        now: NOW,
      }),
    ).toBe(true);
  });

  it('stays silent on a sitting that crossed nothing', () => {
    expect(
      shouldAskForReview({
        crossedThreshold: false,
        lastPromptedAt: null,
        now: NOW,
      }),
    ).toBe(false);
  });

  it('does not ask again inside the interval', () => {
    expect(
      shouldAskForReview({
        crossedThreshold: true,
        lastPromptedAt: NOW - (REVIEW_PROMPT_INTERVAL_DAYS - 1) * DAY_MS,
        now: NOW,
      }),
    ).toBe(false);
  });

  it('asks again once the interval has passed', () => {
    expect(
      shouldAskForReview({
        crossedThreshold: true,
        lastPromptedAt: NOW - REVIEW_PROMPT_INTERVAL_DAYS * DAY_MS,
        now: NOW,
      }),
    ).toBe(true);
  });

  // A device whose clock was corrected backwards would otherwise carry a stamp
  // in its own future, locking the prompt out for months.
  it('asks when the stamp is in the future', () => {
    expect(
      shouldAskForReview({
        crossedThreshold: true,
        lastPromptedAt: NOW + 30 * DAY_MS,
        now: NOW,
      }),
    ).toBe(true);
  });
});

describe('requestReview', () => {
  it('reports that the request reached the store', async () => {
    await expect(requestReview()).resolves.toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('does not ask when the platform cannot show the sheet', async () => {
    isAvailable.mockResolvedValue(false);
    await expect(requestReview()).resolves.toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  // Play returns no store URL and no native flow for a build it does not know
  // — a sideload, or a listing that is not live yet.
  it('does not ask when the store offers no action', async () => {
    hasAction.mockResolvedValue(false);
    await expect(requestReview()).resolves.toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it('swallows a store that throws, and reports it did not ask', async () => {
    request.mockRejectedValue(new Error('no store'));
    await expect(requestReview()).resolves.toBe(false);
  });
});
