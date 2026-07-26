import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearAll,
  loadCompletedProducts,
  loadStreak,
  saveCompletedProducts,
  saveStreak,
  STORAGE_KEYS,
} from '../../src/utils/storage';

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  describe('completed products', () => {
    it('round-trips a list', async () => {
      await saveCompletedProducts(['irs', 'cds']);

      await expect(loadCompletedProducts()).resolves.toEqual(['irs', 'cds']);
    });

    it('returns an empty list when nothing is stored', async () => {
      await expect(loadCompletedProducts()).resolves.toEqual([]);
    });

    it('returns an empty list for malformed JSON', async () => {
      await AsyncStorage.setItem(STORAGE_KEYS.completedProducts, '{oops');

      await expect(loadCompletedProducts()).resolves.toEqual([]);
    });

    it('drops non-string entries', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.completedProducts,
        JSON.stringify(['irs', 42, null]),
      );

      await expect(loadCompletedProducts()).resolves.toEqual(['irs']);
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveCompletedProducts(['irs'])).resolves.toBe(false);
    });
  });

  describe('streak', () => {
    it('round-trips a streak', async () => {
      await saveStreak({ currentStreak: 4, lastActivityDate: '2026-07-25' });

      await expect(loadStreak()).resolves.toEqual({
        currentStreak: 4,
        lastActivityDate: '2026-07-25',
      });
    });

    it('returns null when nothing is stored', async () => {
      await expect(loadStreak()).resolves.toBeNull();
    });

    it('rejects a payload without a numeric streak', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.streak,
        JSON.stringify({ currentStreak: 'four' }),
      );

      await expect(loadStreak()).resolves.toBeNull();
    });

    it('normalises a missing lastActivityDate to null', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.streak,
        JSON.stringify({ currentStreak: 2 }),
      );

      await expect(loadStreak()).resolves.toEqual({
        currentStreak: 2,
        lastActivityDate: null,
      });
    });
  });

  it('clears every app-owned key', async () => {
    await saveCompletedProducts(['irs']);
    await saveStreak({ currentStreak: 1, lastActivityDate: '2026-07-25' });

    await clearAll();

    await expect(loadCompletedProducts()).resolves.toEqual([]);
    await expect(loadStreak()).resolves.toBeNull();
  });
});
