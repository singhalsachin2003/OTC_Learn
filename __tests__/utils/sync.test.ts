import {
  examResultToRow,
  isoFrom,
  mergeExamResults,
  mergeNotes,
  mergeProgress,
  mergeQuestionHistory,
  mergeReviewQueue,
  mergeStreak,
  mergeStringSet,
  msFrom,
  noteToRow,
  progressToRow,
  questionHistoryToRows,
  reviewToRow,
  type ProgressRow,
  type ReviewRow,
} from '../../src/utils/sync';
import type { ProductProgress } from '../../src/utils/mastery';

const OLD = Date.parse('2026-08-01T10:00:00Z');
const NEW = Date.parse('2026-08-30T10:00:00Z');

function progress(overrides: Partial<ProductProgress> = {}): ProductProgress {
  return {
    mastery: 50,
    attempts: 2,
    bestScorePct: 60,
    lastStudiedOn: '2026-08-01',
    updatedAt: OLD,
    ...overrides,
  };
}

function progressRow(overrides: Partial<ProgressRow> = {}): ProgressRow {
  return {
    product_id: 'irs',
    mastery: 80,
    attempts: 5,
    best_score_pct: 90,
    last_studied_on: '2026-08-30',
    updated_at: isoFrom(NEW),
    ...overrides,
  };
}

function reviewRow(overrides: Partial<ReviewRow> = {}): ReviewRow {
  return {
    question_id: 'irs-q1',
    product_id: 'irs',
    step: 2,
    due_on: '2026-09-10',
    lapses: 3,
    retired_at: null,
    updated_at: isoFrom(NEW),
    ...overrides,
  };
}

describe('msFrom', () => {
  it('reads a timestamp back', () => {
    expect(msFrom(isoFrom(NEW))).toBe(NEW);
  });

  it('treats null as the beginning of time', () => {
    expect(msFrom(null)).toBe(0);
  });

  /**
   * NaN compares false against everything, so a malformed timestamp would make
   * both sides of every comparison lose. Zero makes the malformed row lose,
   * which is the outcome we actually want.
   */
  it('reads an unparseable timestamp as zero rather than NaN', () => {
    expect(msFrom('not a date')).toBe(0);
  });
});

describe('mergeProgress', () => {
  it('takes a product the device has never seen', () => {
    const merged = mergeProgress({}, [progressRow()]);

    expect(merged.irs).toEqual({
      mastery: 80,
      attempts: 5,
      bestScorePct: 90,
      lastStudiedOn: '2026-08-30',
      updatedAt: NEW,
    });
  });

  it('takes the newer mastery when the server is ahead', () => {
    const merged = mergeProgress({ irs: progress() }, [progressRow()]);

    expect(merged.irs.mastery).toBe(80);
  });

  it('keeps local mastery when the device is ahead', () => {
    const merged = mergeProgress({ irs: progress({ updatedAt: NEW }) }, [
      progressRow({ updated_at: isoFrom(OLD) }),
    ]);

    expect(merged.irs.mastery).toBe(50);
  });

  /**
   * The rule that stops sync from undoing the learning model. Mastery moves at
   * a 0.35 learning rate precisely so one bad run cannot erase weeks — a merge
   * that let an older device win would do exactly that damage by another route.
   */
  it('never lets an unstamped legacy record beat a real one', () => {
    const merged = mergeProgress({ irs: progress({ updatedAt: 0, mastery: 5 }) }, [
      progressRow({ mastery: 75 }),
    ]);

    expect(merged.irs.mastery).toBe(75);
  });

  it('takes the greater of two attempt counts rather than the sum', () => {
    const merged = mergeProgress({ irs: progress({ attempts: 7 }) }, [
      progressRow({ attempts: 5 }),
    ]);

    expect(merged.irs.attempts).toBe(7);
  });

  it('never revises a best score down, even from a newer row', () => {
    const merged = mergeProgress({ irs: progress({ bestScorePct: 100 }) }, [
      progressRow({ best_score_pct: 40 }),
    ]);

    expect(merged.irs.bestScorePct).toBe(100);
  });

  it('leaves a product the server has never seen alone', () => {
    const merged = mergeProgress({ cds: progress() }, [progressRow()]);

    expect(merged.cds).toEqual(progress());
  });

  /** Sync is retried far more often than it succeeds cleanly. */
  it('is stable when the same rows arrive twice', () => {
    const once = mergeProgress({ irs: progress() }, [progressRow()]);
    const twice = mergeProgress(once, [progressRow()]);

    expect(twice).toEqual(once);
  });

  it('round-trips a record through its row shape', () => {
    const merged = mergeProgress({}, [progressToRow('irs', progress())]);

    expect(merged.irs).toEqual(progress());
  });
});

describe('mergeQuestionHistory', () => {
  it('takes the greater of each counter, never the sum', () => {
    const merged = mergeQuestionHistory({ 'irs-q1': { right: 4, wrong: 1 } }, [
      { question_id: 'irs-q1', right_count: 2, wrong_count: 6 },
    ]);

    expect(merged['irs-q1']).toEqual({ right: 4, wrong: 6 });
  });

  it('is stable when the same rows arrive twice', () => {
    const local = { 'irs-q1': { right: 4, wrong: 1 } };
    const rows = [{ question_id: 'irs-q1', right_count: 2, wrong_count: 6 }];
    const once = mergeQuestionHistory(local, rows);

    expect(mergeQuestionHistory(once, rows)).toEqual(once);
  });

  it('drops the undefined holes a Record can carry', () => {
    expect(mergeQuestionHistory({ 'irs-q1': undefined }, [])).toEqual({});
  });

  it('round-trips through the row shape', () => {
    const history = { 'irs-q1': { right: 3, wrong: 2 } };

    expect(mergeQuestionHistory({}, questionHistoryToRows(history))).toEqual(
      history,
    );
  });
});

describe('mergeReviewQueue', () => {
  const local = {
    id: 'irs-q1',
    productId: 'irs',
    step: 0,
    dueOn: '2026-09-01',
    lapses: 1,
    updatedAt: OLD,
  };

  it('takes a newer scheduling from the server', () => {
    const merged = mergeReviewQueue([local], [reviewRow()]);

    expect(merged).toEqual([
      {
        id: 'irs-q1',
        productId: 'irs',
        step: 2,
        dueOn: '2026-09-10',
        lapses: 3,
        updatedAt: NEW,
      },
    ]);
  });

  it('keeps local scheduling when the device is ahead', () => {
    const merged = mergeReviewQueue(
      [{ ...local, updatedAt: NEW }],
      [reviewRow({ updated_at: isoFrom(OLD) })],
    );

    expect(merged[0].step).toBe(0);
  });

  /**
   * The reason `retired_at` exists. An absent row cannot mean "deleted": the
   * device still holding the item would read its own copy as new and put the
   * question straight back.
   */
  it('honours a retirement rather than resurrecting the question', () => {
    const merged = mergeReviewQueue(
      [local],
      [reviewRow({ retired_at: isoFrom(NEW) })],
    );

    expect(merged).toEqual([]);
  });

  it('ignores a retirement older than what the device has done since', () => {
    const merged = mergeReviewQueue(
      [{ ...local, updatedAt: NEW }],
      [reviewRow({ retired_at: isoFrom(OLD), updated_at: isoFrom(OLD) })],
    );

    expect(merged).toHaveLength(1);
  });

  it('keeps the higher lapse count, which marks a persistently hard question', () => {
    const merged = mergeReviewQueue(
      [{ ...local, lapses: 9 }],
      [reviewRow({ lapses: 2 })],
    );

    expect(merged[0].lapses).toBe(9);
  });

  it('adds a question the device has never queued', () => {
    expect(mergeReviewQueue([], [reviewRow()])).toHaveLength(1);
  });

  it('is stable when the same rows arrive twice', () => {
    const once = mergeReviewQueue([local], [reviewRow()]);

    expect(mergeReviewQueue(once, [reviewRow()])).toEqual(once);
  });

  it('round-trips an item through its row shape', () => {
    expect(mergeReviewQueue([], [reviewToRow(local)])).toEqual([local]);
  });
});

describe('mergeNotes', () => {
  const mine = { body: 'mine', updatedOn: '2026-08-01', updatedAt: OLD };
  const theirs = {
    product_id: 'irs',
    body: 'theirs',
    updated_on: '2026-08-30',
    updated_at: isoFrom(NEW),
  };

  it('takes the later edit', () => {
    expect(mergeNotes({ irs: mine }, [theirs]).irs.body).toBe('theirs');
  });

  it('keeps the local note when it is the later edit', () => {
    const merged = mergeNotes({ irs: { ...mine, updatedAt: NEW } }, [
      { ...theirs, updated_at: isoFrom(OLD) },
    ]);

    expect(merged.irs.body).toBe('mine');
  });

  /** Someone's own writing is the one thing a merge must never resurrect. */
  it('honours a cleared note rather than bringing it back', () => {
    expect(mergeNotes({ irs: mine }, [{ ...theirs, body: null }])).toEqual({});
  });

  it('ignores a deletion older than the local edit', () => {
    const merged = mergeNotes({ irs: { ...mine, updatedAt: NEW } }, [
      { ...theirs, body: null, updated_at: isoFrom(OLD) },
    ]);

    expect(merged.irs.body).toBe('mine');
  });

  it('is stable when the same rows arrive twice', () => {
    const once = mergeNotes({ irs: mine }, [theirs]);

    expect(mergeNotes(once, [theirs])).toEqual(once);
  });

  it('round-trips a note through its row shape', () => {
    expect(mergeNotes({}, [noteToRow('irs', mine)])).toEqual({ irs: mine });
  });
});

describe('mergeStringSet', () => {
  it('unions without duplicating', () => {
    expect(mergeStringSet(['2026-08-01'], ['2026-08-01', '2026-08-02'])).toEqual([
      '2026-08-01',
      '2026-08-02',
    ]);
  });

  it('is stable and order-independent', () => {
    expect(mergeStringSet(['b', 'a'], ['c'])).toEqual(['a', 'b', 'c']);
    expect(mergeStringSet(['c'], ['b', 'a'])).toEqual(['a', 'b', 'c']);
  });
});

describe('mergeExamResults', () => {
  const sitting = {
    id: '2026-08-01-aaa',
    takenOn: '2026-08-01',
    scopeId: 'ir',
    correct: 8,
    total: 10,
    scorePct: 80,
    passed: true,
    durationMs: 60_000,
  };

  it('adds a sitting the device does not have', () => {
    const merged = mergeExamResults([], [examResultToRow(sitting)]);

    expect(merged).toEqual([sitting]);
  });

  /** The whole reason a sitting carries an id. */
  it('does not record the same sitting twice', () => {
    const merged = mergeExamResults([sitting], [examResultToRow(sitting)]);

    expect(merged).toHaveLength(1);
  });

  it('keeps two genuinely different sittings on the same day', () => {
    const other = { ...sitting, id: '2026-08-01-bbb', correct: 3 };
    const merged = mergeExamResults([sitting], [examResultToRow(other)]);

    expect(merged).toHaveLength(2);
  });

  it('orders oldest first', () => {
    const later = { ...sitting, id: 'z', takenOn: '2026-08-20' };
    const merged = mergeExamResults([later], [examResultToRow(sitting)]);

    expect(merged.map((r) => r.takenOn)).toEqual(['2026-08-01', '2026-08-20']);
  });
});

describe('mergeStreak', () => {
  const local = {
    currentStreak: 3,
    longestStreak: 9,
    lastActivityDate: '2026-08-01',
  };

  it('leaves the local streak alone when the server has none', () => {
    expect(mergeStreak(local, OLD, null)).toEqual(local);
  });

  it('never lowers the longest streak, even from a newer row', () => {
    const merged = mergeStreak(local, OLD, {
      current_streak: 1,
      longest_streak: 2,
      last_activity_date: '2026-08-30',
      updated_at: isoFrom(NEW),
    });

    expect(merged.longestStreak).toBe(9);
  });

  /**
   * A current streak is only true relative to a date, so taking the larger of
   * two would invent a run the user never had.
   */
  it('takes the newer current streak rather than the larger', () => {
    const merged = mergeStreak(local, OLD, {
      current_streak: 1,
      longest_streak: 2,
      last_activity_date: '2026-08-30',
      updated_at: isoFrom(NEW),
    });

    expect(merged.currentStreak).toBe(1);
    expect(merged.lastActivityDate).toBe('2026-08-30');
  });

  it('keeps the local streak when the device is ahead', () => {
    const merged = mergeStreak(local, NEW, {
      current_streak: 1,
      longest_streak: 2,
      last_activity_date: '2026-08-30',
      updated_at: isoFrom(OLD),
    });

    expect(merged.currentStreak).toBe(3);
  });
});
