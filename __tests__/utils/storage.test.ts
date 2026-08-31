import AsyncStorage from '@react-native-async-storage/async-storage';

import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import {
  clearAll,
  defaultSettings,
  loadAchievements,
  loadBookmarkRecords,
  loadBookmarks,
  loadExamResults,
  loadGrandfathered,
  loadProfile,
  loadProgressMap,
  loadQuestionHistory,
  loadReviewQueue,
  loadSettings,
  loadStreak,
  loadStudyDays,
  loadSyncMeta,
  migrateV1Progress,
  runMigrations,
  SCHEMA_VERSION,
  saveAchievements,
  saveBookmarks,
  saveExamResults,
  saveProfile,
  saveProgressMap,
  saveQuestionHistory,
  saveReviewQueue,
  saveSettings,
  saveStreak,
  saveStudyDays,
  saveSyncMeta,
  MAX_EXAM_RESULTS,
  STORAGE_KEYS,
} from '../../src/utils/storage';

/** A well-formed persisted mastery record, for tests that need one. */
const record = {
  mastery: 62,
  attempts: 3,
  bestScorePct: 80,
  lastStudiedOn: '2026-07-25',
  updatedAt: Date.parse('2026-07-25T09:30:00'),
};

async function writeRaw(key: string, raw: string): Promise<void> {
  await AsyncStorage.setItem(key, raw);
}

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  describe('progress map', () => {
    it('round-trips a map of mastery records', async () => {
      await saveProgressMap({ irs: record });

      await expect(loadProgressMap()).resolves.toEqual({ irs: record });
    });

    it('returns an empty map when nothing is stored', async () => {
      await expect(loadProgressMap()).resolves.toEqual({});
    });

    it('returns an empty map for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.progress, '{oops');

      await expect(loadProgressMap()).resolves.toEqual({});
    });

    it('returns an empty map when the payload is not an object', async () => {
      await writeRaw(STORAGE_KEYS.progress, JSON.stringify(['irs']));

      await expect(loadProgressMap()).resolves.toEqual({});
    });

    it('drops records with no numeric mastery rather than repairing them', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({ irs: record, fra: { mastery: 'high' }, cds: null }),
      );

      await expect(loadProgressMap()).resolves.toEqual({ irs: record });
    });

    it('clamps and rounds a mastery figure from outside the 0–100 range', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({ irs: { mastery: 140 }, fra: { mastery: -20 } }),
      );

      const loaded = await loadProgressMap();

      expect(loaded.irs.mastery).toBe(100);
      expect(loaded.fra.mastery).toBe(0);
    });

    it('defaults the fields around a salvageable mastery figure', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({ irs: { mastery: 41.6, attempts: 'two' } }),
      );

      await expect(loadProgressMap()).resolves.toEqual({
        irs: {
          mastery: 42,
          attempts: 0,
          bestScorePct: 0,
          lastStudiedOn: null,
          // Nothing to date it by, so it starts at zero and loses any merge.
          updatedAt: 0,
        },
      });
    });

    /**
     * Sync merges by `updatedAt`, so what a pre-v3 record gets is not academic:
     * it decides which device wins the first time two of them disagree.
     */
    it('dates an unstamped record by the day it was last studied', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({ irs: { mastery: 40, lastStudiedOn: '2026-07-25' } }),
      );

      const loaded = await loadProgressMap();

      expect(loaded.irs.updatedAt).toBe(Date.parse('2026-07-25T00:00:00'));
    });

    it('keeps a stamp it already has in preference to the date key', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({
          irs: { mastery: 40, lastStudiedOn: '2026-07-25', updatedAt: 1_234_567 },
        }),
      );

      await expect(loadProgressMap()).resolves.toMatchObject({
        irs: { updatedAt: 1_234_567 },
      });
    });

    it('ignores a stamp that is not a usable number', async () => {
      await writeRaw(
        STORAGE_KEYS.progress,
        JSON.stringify({ irs: { mastery: 40, updatedAt: 'yesterday' } }),
      );

      await expect(loadProgressMap()).resolves.toMatchObject({
        irs: { updatedAt: 0 },
      });
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveProgressMap({ irs: record })).resolves.toBe(false);
    });

    // Storage being unreadable is the same class of problem as a corrupt value:
    // the app opens on an empty slate rather than not opening at all.
    it('returns an empty map when the read itself fails', async () => {
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockRejectedValueOnce(new Error('storage unavailable'));

      await expect(loadProgressMap()).resolves.toEqual({});
    });
  });

  describe('question history', () => {
    it('round-trips a tally', async () => {
      await saveQuestionHistory({ 'irs-q1': { right: 2, wrong: 1 } });

      await expect(loadQuestionHistory()).resolves.toEqual({
        'irs-q1': { right: 2, wrong: 1 },
      });
    });

    it('returns an empty tally when nothing is stored', async () => {
      await expect(loadQuestionHistory()).resolves.toEqual({});
    });

    it('returns an empty tally for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.questionHistory, 'not json at all');

      await expect(loadQuestionHistory()).resolves.toEqual({});
    });

    it('returns an empty tally when the payload is not an object', async () => {
      await writeRaw(STORAGE_KEYS.questionHistory, JSON.stringify(['irs-q1']));

      await expect(loadQuestionHistory()).resolves.toEqual({});
    });

    it('drops entries missing either half of the tally', async () => {
      await writeRaw(
        STORAGE_KEYS.questionHistory,
        JSON.stringify({
          'irs-q1': { right: 2, wrong: 1 },
          'irs-q2': { right: 2 },
          'irs-q3': 'nonsense',
        }),
      );

      await expect(loadQuestionHistory()).resolves.toEqual({
        'irs-q1': { right: 2, wrong: 1 },
      });
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveQuestionHistory({})).resolves.toBe(false);
    });
  });

  describe('bookmark records', () => {
    it('reads the plain list written before sync existed', async () => {
      await writeRaw(STORAGE_KEYS.bookmarks, JSON.stringify(['irs', 'cds']));

      await expect(loadBookmarkRecords()).resolves.toEqual({
        irs: { bookmarked: true, updatedAt: 0 },
        cds: { bookmarked: true, updatedAt: 0 },
      });
      // A legacy list carries no times, so it loses any merge against a
      // stamped row — but it still reads as saved.
      await expect(loadBookmarks()).resolves.toEqual(['irs', 'cds']);
    });

    it('records a removal rather than dropping the entry', async () => {
      await saveBookmarks(['irs', 'cds'], 1_000);
      await saveBookmarks(['cds'], 2_000);

      await expect(loadBookmarkRecords()).resolves.toEqual({
        irs: { bookmarked: false, updatedAt: 2_000 },
        cds: { bookmarked: true, updatedAt: 1_000 },
      });
      await expect(loadBookmarks()).resolves.toEqual(['cds']);
    });

    it('leaves the timestamp of an unchanged bookmark alone', async () => {
      await saveBookmarks(['irs'], 1_000);
      await saveBookmarks(['irs', 'cds'], 2_000);

      const records = await loadBookmarkRecords();
      expect(records.irs.updatedAt).toBe(1_000);
      expect(records.cds.updatedAt).toBe(2_000);
    });

    it('keeps the order things were saved in', async () => {
      await saveBookmarks(['swaption'], 1_000);
      await saveBookmarks(['swaption', 'irs'], 2_000);

      await expect(loadBookmarks()).resolves.toEqual(['swaption', 'irs']);
    });
  });

  describe('sync meta', () => {
    it('starts at zero, so anything stamped beats it', async () => {
      await expect(loadSyncMeta()).resolves.toEqual({
        settingsUpdatedAt: 0,
        profileUpdatedAt: 0,
      });
    });

    it('patches one field without clearing the other', async () => {
      await saveSyncMeta({ settingsUpdatedAt: 1_000 });
      await saveSyncMeta({ profileUpdatedAt: 2_000 });

      await expect(loadSyncMeta()).resolves.toEqual({
        settingsUpdatedAt: 1_000,
        profileUpdatedAt: 2_000,
      });
    });
  });

  describe('review queue', () => {
    const item = {
      id: 'irs-q1',
      productId: 'irs',
      step: 0,
      dueOn: '2026-07-26',
      lapses: 1,
      updatedAt: Date.parse('2026-07-25T09:30:00'),
    };

    it('round-trips a queue', async () => {
      await saveReviewQueue([item]);

      await expect(loadReviewQueue()).resolves.toEqual([item]);
    });

    it('returns an empty queue when nothing is stored', async () => {
      await expect(loadReviewQueue()).resolves.toEqual([]);
    });

    it('returns an empty queue for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.reviewQueue, '[[[');

      await expect(loadReviewQueue()).resolves.toEqual([]);
    });

    it('returns an empty queue when the payload is not an array', async () => {
      await writeRaw(STORAGE_KEYS.reviewQueue, JSON.stringify({ irs: 1 }));

      await expect(loadReviewQueue()).resolves.toEqual([]);
    });

    it('keeps the well-formed items and drops the rest', async () => {
      await writeRaw(
        STORAGE_KEYS.reviewQueue,
        JSON.stringify([item, { id: 'irs-q2' }, null, { ...item, step: '0' }]),
      );

      await expect(loadReviewQueue()).resolves.toEqual([item]);
    });

    /**
     * A queue item has no date that approximates when it was last touched —
     * `dueOn` is in the future by construction — so a pre-v3 item starts at
     * zero and loses any merge against a stamped one.
     */
    it('starts an unstamped queue item at zero rather than guessing', async () => {
      const { updatedAt: _unused, ...legacy } = item;
      await writeRaw(STORAGE_KEYS.reviewQueue, JSON.stringify([legacy]));

      await expect(loadReviewQueue()).resolves.toEqual([
        { ...legacy, updatedAt: 0 },
      ]);
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveReviewQueue([item])).resolves.toBe(false);
    });
  });

  describe('streak', () => {
    it('round-trips a streak', async () => {
      await saveStreak({
        currentStreak: 4,
        longestStreak: 9,
        lastActivityDate: '2026-07-25',
      });

      await expect(loadStreak()).resolves.toEqual({
        currentStreak: 4,
        longestStreak: 9,
        lastActivityDate: '2026-07-25',
      });
    });

    it('returns null when nothing is stored', async () => {
      await expect(loadStreak()).resolves.toBeNull();
    });

    it('returns null for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.streak, 'streak: four');

      await expect(loadStreak()).resolves.toBeNull();
    });

    it('rejects a payload without a numeric streak', async () => {
      await writeRaw(STORAGE_KEYS.streak, JSON.stringify({ currentStreak: '4' }));

      await expect(loadStreak()).resolves.toBeNull();
    });

    // longestStreak arrived in v2. An install upgrading mid-streak has no record
    // of its best run, and reporting zero would tell a user on day nine that
    // they had never managed a single day.
    it('backfills a missing longestStreak from the current one', async () => {
      await writeRaw(
        STORAGE_KEYS.streak,
        JSON.stringify({ currentStreak: 9, lastActivityDate: '2026-07-25' }),
      );

      await expect(loadStreak()).resolves.toEqual({
        currentStreak: 9,
        longestStreak: 9,
        lastActivityDate: '2026-07-25',
      });
    });

    it('normalises a missing lastActivityDate to null', async () => {
      await writeRaw(STORAGE_KEYS.streak, JSON.stringify({ currentStreak: 2 }));

      await expect(loadStreak()).resolves.toEqual({
        currentStreak: 2,
        longestStreak: 2,
        lastActivityDate: null,
      });
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(
        saveStreak({ currentStreak: 1, longestStreak: 1, lastActivityDate: null }),
      ).resolves.toBe(false);
    });
  });

  describe('study days', () => {
    it('round-trips the day list', async () => {
      await saveStudyDays(['2026-07-24', '2026-07-25']);

      await expect(loadStudyDays()).resolves.toEqual(['2026-07-24', '2026-07-25']);
    });

    it('returns an empty list when nothing is stored', async () => {
      await expect(loadStudyDays()).resolves.toEqual([]);
    });

    it('returns an empty list for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.studyDays, 'yesterday');

      await expect(loadStudyDays()).resolves.toEqual([]);
    });

    it('returns an empty list when the payload is not an array', async () => {
      await writeRaw(
        STORAGE_KEYS.studyDays,
        JSON.stringify({ '2026-07-24': true }),
      );

      await expect(loadStudyDays()).resolves.toEqual([]);
    });

    it('drops entries that are not date strings', async () => {
      await writeRaw(
        STORAGE_KEYS.studyDays,
        JSON.stringify(['2026-07-24', 20260725, null]),
      );

      await expect(loadStudyDays()).resolves.toEqual(['2026-07-24']);
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveStudyDays(['2026-07-24'])).resolves.toBe(false);
    });
  });

  describe('profile', () => {
    it('round-trips a name', async () => {
      await saveProfile({ name: 'Sachin' });

      await expect(loadProfile()).resolves.toEqual({ name: 'Sachin' });
    });

    it('returns an unnamed profile when nothing is stored', async () => {
      await expect(loadProfile()).resolves.toEqual({ name: null });
    });

    it('returns an unnamed profile for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.profile, '<html>');

      await expect(loadProfile()).resolves.toEqual({ name: null });
    });

    it('returns an unnamed profile when the read fails', async () => {
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockRejectedValueOnce(new Error('storage unavailable'));

      await expect(loadProfile()).resolves.toEqual({ name: null });
    });

    it('returns an unnamed profile when the name is not a string', async () => {
      await writeRaw(STORAGE_KEYS.profile, JSON.stringify({ name: 42 }));

      await expect(loadProfile()).resolves.toEqual({ name: null });
    });
  });

  describe('settings', () => {
    it('round-trips settings', async () => {
      const stored = { ...defaultSettings, timedQuizzes: true, sessionSize: 10 };
      await saveSettings(stored);

      await expect(loadSettings()).resolves.toEqual(stored);
    });

    it('returns the defaults when nothing is stored', async () => {
      await expect(loadSettings()).resolves.toEqual(defaultSettings);
    });

    it('returns the defaults for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.settings, 'haptics=on');

      await expect(loadSettings()).resolves.toEqual(defaultSettings);
    });

    it('returns the defaults when the payload is not an object', async () => {
      await writeRaw(STORAGE_KEYS.settings, JSON.stringify(['haptics']));

      await expect(loadSettings()).resolves.toEqual(defaultSettings);
    });

    // The merge is what stops a settings key added in a later release reading
    // back as `undefined` for every user who already has a settings file.
    it('lands a key the stored payload predates on its default', async () => {
      await writeRaw(
        STORAGE_KEYS.settings,
        JSON.stringify({ spacedRepetition: false, timedQuizzes: true }),
      );

      await expect(loadSettings()).resolves.toEqual({
        ...defaultSettings,
        spacedRepetition: false,
        timedQuizzes: true,
      });
    });

    it('keeps a stored false rather than treating it as absent', async () => {
      await writeRaw(STORAGE_KEYS.settings, JSON.stringify({ haptics: false }));

      await expect(loadSettings()).resolves.toEqual({
        ...defaultSettings,
        haptics: false,
      });
    });

    it('falls back to the default session size for a nonsensical one', async () => {
      await writeRaw(STORAGE_KEYS.settings, JSON.stringify({ sessionSize: 0 }));

      await expect(loadSettings()).resolves.toEqual(defaultSettings);
    });

    it('reports a failed write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveSettings(defaultSettings)).resolves.toBe(false);
    });
  });

  describe('bookmarks and achievements', () => {
    it('round-trips bookmarks', async () => {
      await saveBookmarks(['irs', 'cds']);

      await expect(loadBookmarks()).resolves.toEqual(['irs', 'cds']);
    });

    it('returns an empty bookmark list when nothing is stored', async () => {
      await expect(loadBookmarks()).resolves.toEqual([]);
    });

    it('returns an empty achievement list when nothing is stored', async () => {
      await expect(loadAchievements()).resolves.toEqual([]);
    });

    it('returns an empty bookmark list for a non-JSON payload', async () => {
      await writeRaw(STORAGE_KEYS.bookmarks, '{');

      await expect(loadBookmarks()).resolves.toEqual([]);
    });

    it('drops non-string bookmark ids', async () => {
      await writeRaw(STORAGE_KEYS.bookmarks, JSON.stringify(['irs', 7, null]));

      await expect(loadBookmarks()).resolves.toEqual(['irs']);
    });

    it('round-trips achievements', async () => {
      await saveAchievements(['first-quiz']);

      await expect(loadAchievements()).resolves.toEqual(['first-quiz']);
    });

    it('returns an empty achievement list when the payload is an object', async () => {
      await writeRaw(
        STORAGE_KEYS.achievements,
        JSON.stringify({ 'first-quiz': true }),
      );

      await expect(loadAchievements()).resolves.toEqual([]);
    });

    it('drops non-string achievement ids', async () => {
      await writeRaw(STORAGE_KEYS.achievements, JSON.stringify([null, 'sharp']));

      await expect(loadAchievements()).resolves.toEqual(['sharp']);
    });

    it('reports a failed bookmark write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveBookmarks(['irs'])).resolves.toBe(false);
    });

    it('reports a failed achievement write instead of throwing', async () => {
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(saveAchievements(['sharp'])).resolves.toBe(false);
    });
  });

  describe('exam results', () => {
    const sitting = {
      id: 'exam-1',
      takenOn: '2026-08-30',
      scopeId: 'ir',
      correct: 14,
      total: 20,
      scorePct: 70,
      passed: true,
      durationMs: 540_000,
    };

    it('round-trips a history', async () => {
      await saveExamResults([sitting]);

      await expect(loadExamResults()).resolves.toEqual([sitting]);
    });

    it('reads an absent key as an empty history', async () => {
      await expect(loadExamResults()).resolves.toEqual([]);
    });

    it('reads a non-array payload as an empty history', async () => {
      await AsyncStorage.setItem(STORAGE_KEYS.examResults, JSON.stringify({}));

      await expect(loadExamResults()).resolves.toEqual([]);
    });

    it('drops a malformed sitting rather than the whole history', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.examResults,
        JSON.stringify([sitting, { takenOn: '2026-08-29' }, null, 'nope']),
      );

      await expect(loadExamResults()).resolves.toEqual([sitting]);
    });

    // A sitting that ran out of time records a null duration, so null has to
    // survive the round trip rather than being repaired to a number.
    it('preserves a null duration', async () => {
      await saveExamResults([{ ...sitting, durationMs: null }]);

      const [loaded] = await loadExamResults();
      expect(loaded.durationMs).toBeNull();
    });

    it('reads a non-numeric duration as null', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.examResults,
        JSON.stringify([{ ...sitting, durationMs: 'ages' }]),
      );

      const [loaded] = await loadExamResults();
      expect(loaded.durationMs).toBeNull();
    });

    it('keeps the newest sittings when the history outgrows the cap', async () => {
      const many = Array.from({ length: MAX_EXAM_RESULTS + 10 }, (_, i) => ({
        ...sitting,
        correct: i,
      }));

      await saveExamResults(many);

      const loaded = await loadExamResults();
      expect(loaded).toHaveLength(MAX_EXAM_RESULTS);
      // The last written sitting survives; the first does not.
      expect(loaded[loaded.length - 1].correct).toBe(MAX_EXAM_RESULTS + 9);
      expect(loaded[0].correct).toBe(10);
    });
  });

  describe('migrateV1Progress', () => {
    it('turns each completed id into a record at the completion threshold', async () => {
      await writeRaw(
        STORAGE_KEYS.completedProducts,
        JSON.stringify(['irs', 'cds']),
      );

      await expect(migrateV1Progress()).resolves.toEqual({
        irs: {
          mastery: MASTERY_COMPLETE,
          attempts: 1,
          bestScorePct: MASTERY_COMPLETE,
          lastStudiedOn: null,
          updatedAt: 0,
        },
        cds: {
          mastery: MASTERY_COMPLETE,
          attempts: 1,
          bestScorePct: MASTERY_COMPLETE,
          lastStudiedOn: null,
          updatedAt: 0,
        },
      });
    });

    it('returns null when there is no v1 key to migrate', async () => {
      await expect(migrateV1Progress()).resolves.toBeNull();
    });

    it('returns null when the v1 payload is not an array', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify({ irs: true }));

      await expect(migrateV1Progress()).resolves.toBeNull();
    });

    it('returns an empty map for an empty v1 list', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify([]));

      await expect(migrateV1Progress()).resolves.toEqual({});
    });

    it('drops v1 entries that are not product ids', async () => {
      await writeRaw(
        STORAGE_KEYS.completedProducts,
        JSON.stringify(['irs', 3, null]),
      );

      const migrated = await migrateV1Progress();

      expect(Object.keys(migrated ?? {})).toEqual(['irs']);
    });
  });

  describe('runMigrations', () => {
    it('rewrites a v1 install as v2 mastery records', async () => {
      await writeRaw(
        STORAGE_KEYS.completedProducts,
        JSON.stringify(['irs', 'swaption']),
      );

      await runMigrations();

      const progress = await loadProgressMap();
      // The product ids are the persisted schema: carrying them across intact
      // is what makes this a migration rather than a reset.
      expect(Object.keys(progress).sort()).toEqual(['irs', 'swaption']);
      expect(progress.irs.mastery).toBe(MASTERY_COMPLETE);
      expect(progress.irs.attempts).toBe(1);
    });

    it('deletes the v1 key once it has been read', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));

      await runMigrations();

      await expect(
        AsyncStorage.getItem(STORAGE_KEYS.completedProducts),
      ).resolves.toBeNull();
    });

    it('stamps the schema version', async () => {
      await runMigrations();

      await expect(AsyncStorage.getItem(STORAGE_KEYS.schemaVersion)).resolves.toBe(
        JSON.stringify(SCHEMA_VERSION),
      );
    });

    it('stamps the version even when there is nothing to migrate', async () => {
      await runMigrations();

      await expect(loadProgressMap()).resolves.toEqual({});
      await expect(AsyncStorage.getItem(STORAGE_KEYS.schemaVersion)).resolves.toBe(
        JSON.stringify(SCHEMA_VERSION),
      );
    });

    it('leaves an already-migrated install untouched when run again', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));
      await runMigrations();
      const afterFirst = await loadProgressMap();

      await runMigrations();

      await expect(loadProgressMap()).resolves.toEqual(afterFirst);
    });

    // The version stamp, not the absence of the v1 key, is what closes the
    // migration: a stale v1 write must not resurrect deleted progress.
    it('does not re-read a v1 key that reappears after the stamp', async () => {
      await runMigrations();
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));

      await runMigrations();

      await expect(loadProgressMap()).resolves.toEqual({});
    });

    it('keeps existing v2 records in preference to the migrated ones', async () => {
      await saveProgressMap({ irs: record });
      await writeRaw(
        STORAGE_KEYS.completedProducts,
        JSON.stringify(['irs', 'cds']),
      );

      await runMigrations();

      const progress = await loadProgressMap();
      expect(progress.irs).toEqual(record);
      expect(progress.cds.mastery).toBe(MASTERY_COMPLETE);
    });

    // The v1 key is the only copy of that progress until the v2 write lands, so
    // a failed write must leave both it and the missing version stamp behind —
    // otherwise one bad write destroys everything the user had done.
    describe('v3 -> v4 grandfathering', () => {
      /**
       * The app shipped free with every asset class open. A subscription that
       * locked five of six would be taking back what someone already had,
       * along with the mastery they built in it — so anyone who was already
       * here keeps all of it.
       */
      it('grants permanent access to an install that has run before', async () => {
        await writeRaw(STORAGE_KEYS.schemaVersion, JSON.stringify(3));

        await runMigrations();

        await expect(loadGrandfathered()).resolves.toBe(true);
      });

      /**
       * Any stored version counts, not just the one before. Someone who
       * installed last week and has not finished a quiz yet is still an
       * existing user, and a version stamp is a cleaner test of that than
       * looking for progress.
       */
      it('grants it on an install still back at v1', async () => {
        await writeRaw(STORAGE_KEYS.schemaVersion, JSON.stringify(1));

        await runMigrations();

        await expect(loadGrandfathered()).resolves.toBe(true);
      });

      it('does not grant it to a fresh install', async () => {
        await runMigrations();

        await expect(loadGrandfathered()).resolves.toBe(false);
      });

      it('is false before any migration has run', async () => {
        await expect(loadGrandfathered()).resolves.toBe(false);
      });

      // Same rule as every other migration here: an unstamped version is what
      // makes the next launch try again.
      it('does not stamp the version when the write fails', async () => {
        await writeRaw(STORAGE_KEYS.schemaVersion, JSON.stringify(3));
        jest
          .spyOn(AsyncStorage, 'setItem')
          .mockRejectedValueOnce(new Error('disk full'));

        await runMigrations();

        await expect(
          AsyncStorage.getItem(STORAGE_KEYS.schemaVersion),
        ).resolves.toBe(JSON.stringify(3));
      });
    });

    describe('v2 -> v3 exam result ids', () => {
      /** A sitting as v2 stored it: everything except an id. */
      const legacySitting = {
        takenOn: '2026-08-20',
        scopeId: 'ir',
        correct: 8,
        total: 10,
        scorePct: 80,
        passed: true,
        durationMs: 120_000,
      };

      it('gives a stored sitting an id and writes it back', async () => {
        await writeRaw(STORAGE_KEYS.examResults, JSON.stringify([legacySitting]));

        await runMigrations();

        const raw = await AsyncStorage.getItem(STORAGE_KEYS.examResults);
        const stored = JSON.parse(raw ?? '[]') as { id?: string }[];
        expect(typeof stored[0].id).toBe('string');
        expect(stored[0]).toMatchObject(legacySitting);
      });

      /**
       * The whole point of the write-back. `parseExamResult` mints an id for a
       * record that lacks one, so without persisting it every launch would
       * invent a different id and an upload keyed by it would record the same
       * sitting again each time.
       */
      it('keeps the same id across reloads', async () => {
        await writeRaw(STORAGE_KEYS.examResults, JSON.stringify([legacySitting]));
        await runMigrations();

        const first = await loadExamResults();
        const second = await loadExamResults();

        expect(first[0].id).toBe(second[0].id);
      });

      it('leaves a sitting that already has an id alone', async () => {
        await writeRaw(
          STORAGE_KEYS.examResults,
          JSON.stringify([{ ...legacySitting, id: 'already-mine' }]),
        );

        await runMigrations();

        await expect(loadExamResults()).resolves.toMatchObject([
          { id: 'already-mine' },
        ]);
      });

      it('has nothing to do on an install that has never sat an exam', async () => {
        await runMigrations();

        await expect(
          AsyncStorage.getItem(STORAGE_KEYS.schemaVersion),
        ).resolves.toBe(JSON.stringify(SCHEMA_VERSION));
        await expect(loadExamResults()).resolves.toEqual([]);
      });

      // Same rule as the progress migration: an unstamped version is what makes
      // the next launch try again, so a failed write must not be stamped.
      it('does not stamp the version when the write fails', async () => {
        await writeRaw(STORAGE_KEYS.examResults, JSON.stringify([legacySitting]));
        jest
          .spyOn(AsyncStorage, 'setItem')
          .mockRejectedValueOnce(new Error('disk full'));

        await runMigrations();

        await expect(
          AsyncStorage.getItem(STORAGE_KEYS.schemaVersion),
        ).resolves.toBeNull();
      });
    });

    it('leaves the v1 data alone when the migrated write fails', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));
      // One-shot, not `mockImplementation`: `jest.spyOn` on a property that is
      // already a jest.fn returns that same mock, so a later `mockRestore()`
      // leaves it stubbed rather than restoring AsyncStorage's real behaviour —
      // and every write in every later test in this file silently vanishes.
      // The first write `runMigrations` attempts is the migrated progress map,
      // so a single queued rejection hits exactly the call under test.
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      await runMigrations();

      await expect(
        AsyncStorage.getItem(STORAGE_KEYS.completedProducts),
      ).resolves.toBe(JSON.stringify(['irs']));
      await expect(
        AsyncStorage.getItem(STORAGE_KEYS.schemaVersion),
      ).resolves.toBeNull();
    });

    it('migrates on the next launch after a failed write', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));
      await runMigrations();

      await runMigrations();

      const progress = await loadProgressMap();
      expect(progress.irs.mastery).toBe(MASTERY_COMPLETE);
      await expect(AsyncStorage.getItem(STORAGE_KEYS.schemaVersion)).resolves.toBe(
        JSON.stringify(SCHEMA_VERSION),
      );
    });

    it('still stamps the version when the v1 key cannot be deleted', async () => {
      await writeRaw(STORAGE_KEYS.completedProducts, JSON.stringify(['irs']));
      jest
        .spyOn(AsyncStorage, 'removeItem')
        .mockRejectedValueOnce(new Error('read-only volume'));

      await runMigrations();

      await expect(AsyncStorage.getItem(STORAGE_KEYS.schemaVersion)).resolves.toBe(
        JSON.stringify(SCHEMA_VERSION),
      );
    });
  });

  describe('clearAll', () => {
    it('clears every app-owned key', async () => {
      await saveProgressMap({ irs: record });
      await saveStreak({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-07-25',
      });
      await saveBookmarks(['irs']);
      await saveSettings({ ...defaultSettings, haptics: false });
      await saveExamResults([
        {
          id: 'exam-2',
          takenOn: '2026-08-30',
          scopeId: 'ir',
          correct: 14,
          total: 20,
          scorePct: 70,
          passed: true,
          durationMs: 540_000,
        },
      ]);

      await clearAll();

      await expect(loadProgressMap()).resolves.toEqual({});
      await expect(loadStreak()).resolves.toBeNull();
      await expect(loadBookmarks()).resolves.toEqual([]);
      await expect(loadSettings()).resolves.toEqual(defaultSettings);
      // An exam history left behind would describe progress that no longer
      // exists.
      await expect(loadExamResults()).resolves.toEqual([]);
    });

    it('swallows a storage failure rather than throwing at the caller', async () => {
      jest
        .spyOn(AsyncStorage, 'multiRemove')
        .mockRejectedValueOnce(new Error('storage unavailable'));

      await expect(clearAll()).resolves.toBeUndefined();
    });
  });
});
