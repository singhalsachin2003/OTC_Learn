import AsyncStorage from '@react-native-async-storage/async-storage';

/** AsyncStorage keys, namespaced so they never collide with library keys. */
export const STORAGE_KEYS = {
  completedProducts: '@otc-learn/completed-products',
  streak: '@otc-learn/streak',
} as const;

export interface StoredStreak {
  currentStreak: number;
  lastActivityDate: string | null;
}

/**
 * Reads and JSON-parses a key. Storage failures and malformed payloads both
 * resolve to `null` rather than throwing — a corrupt cache should never stop
 * the app from launching.
 */
async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

/** Writes a JSON payload. Returns whether the write succeeded. */
async function writeJson(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function loadCompletedProducts(): Promise<string[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.completedProducts);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored.filter((id): id is string => typeof id === 'string');
}

export async function saveCompletedProducts(ids: string[]): Promise<boolean> {
  return writeJson(STORAGE_KEYS.completedProducts, ids);
}

export async function loadStreak(): Promise<StoredStreak | null> {
  const stored = await readJson<Partial<StoredStreak>>(STORAGE_KEYS.streak);
  if (stored === null || typeof stored.currentStreak !== 'number') {
    return null;
  }
  return {
    currentStreak: stored.currentStreak,
    lastActivityDate:
      typeof stored.lastActivityDate === 'string' ? stored.lastActivityDate : null,
  };
}

export async function saveStreak(streak: StoredStreak): Promise<boolean> {
  return writeJson(STORAGE_KEYS.streak, streak);
}

/** Clears all app-owned keys. Used by tests and any future "reset" affordance. */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch {
    // Nothing actionable — the caller is resetting state anyway.
  }
}
