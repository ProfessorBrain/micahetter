import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { schedule, ratingIntervals, localDay } from "../scheduler.js";

const MINUTE = 60_000;
const NOW = new Date(2026, 8, 30, 12, 0, 0).getTime();
const review = (overrides = {}) => ({
  stage: "review", step: 0, due: NOW, intervalDays: 10,
  ease: 2.5, reps: 8, lapses: 0, ...overrides,
});

test("a new card learns at one and ten minutes, then graduates for one day", () => {
  const first = schedule(null, "again", NOW);
  assert.deepEqual(first, {
    stage: "learning", step: 0, due: NOW + MINUTE,
    intervalDays: 0, ease: 2.5, reps: 1, lapses: 0,
  });
  const second = schedule(first, "good", first.due);
  assert.equal(second.step, 1);
  assert.equal(second.due, first.due + 10 * MINUTE);
  const graduated = schedule(second, "good", second.due);
  assert.equal(graduated.stage, "review");
  assert.equal(graduated.intervalDays, 1);
  assert.equal(graduated.reps, 3);
  const expected = new Date(second.due);
  expected.setDate(expected.getDate() + 1);
  assert.equal(graduated.due, expected.getTime());
});

test("Good on a new card skips the first step; Again restarts learning", () => {
  const first = schedule(null, "good", NOW);
  assert.equal(first.step, 1);
  assert.equal(first.due, NOW + 10 * MINUTE);
  const retry = schedule(first, "again", first.due);
  assert.equal(retry.step, 0);
  assert.equal(retry.due, first.due + MINUTE);
  assert.equal(retry.lapses, 0);
});

test("Hard repeats the current learning step without graduating", () => {
  const first = schedule(null, "hard", NOW);
  assert.equal(first.stage, "learning");
  assert.equal(first.step, 0);
  assert.equal(first.due, NOW + 5.5 * MINUTE);
  const later = schedule(schedule(null, "good", NOW), "hard", NOW);
  assert.equal(later.step, 1);
  assert.equal(later.due, NOW + 15 * MINUTE);
});

test("Easy graduates new and learning cards for four days", () => {
  for (const state of [null, schedule(null, "again", NOW), schedule(null, "good", NOW)]) {
    const next = schedule(state, "easy", NOW);
    assert.equal(next.stage, "review");
    assert.equal(next.intervalDays, 4);
    assert.equal(next.ease, 2.5);
  }
});

test("review ratings grow intervals and adjust ease predictably", () => {
  const state = Object.freeze(review());
  const hard = schedule(state, "hard", NOW);
  const good = schedule(state, "good", NOW);
  const easy = schedule(state, "easy", NOW);
  assert.equal(hard.intervalDays, 12);
  assert.equal(hard.ease, 2.35);
  assert.equal(good.intervalDays, 25);
  assert.equal(good.ease, 2.5);
  assert.equal(easy.intervalDays, 33);
  assert.equal(easy.ease, 2.65);
  assert.equal(state.reps, 8);
  assert.equal(good.reps, 9);
  const short = review({ intervalDays: 1, ease: 1.3 });
  assert.deepEqual(["hard", "good", "easy"].map((rating) => schedule(short, rating, NOW).intervalDays), [2, 3, 4]);
});

test("a mature lapse relearns for ten minutes and returns at one day", () => {
  const lapsed = schedule(review(), "again", NOW);
  assert.equal(lapsed.stage, "relearning");
  assert.equal(lapsed.intervalDays, 1);
  assert.equal(lapsed.ease, 2.3);
  assert.equal(lapsed.lapses, 1);
  assert.equal(lapsed.due, NOW + 10 * MINUTE);
  const repeated = schedule(lapsed, "again", lapsed.due);
  assert.equal(repeated.lapses, 1);
  assert.equal(repeated.due, lapsed.due + 10 * MINUTE);
  const hard = schedule(repeated, "hard", repeated.due);
  assert.equal(hard.stage, "relearning");
  assert.equal(hard.due, repeated.due + 15 * MINUTE);
  const restored = schedule(hard, "good", hard.due);
  assert.equal(restored.stage, "review");
  assert.equal(restored.intervalDays, 1);
  assert.equal(restored.lapses, 1);
  assert.equal(schedule(lapsed, "easy", lapsed.due).intervalDays, 4);
});

test("ease never drops below the floor and intervals stop at the ceiling", () => {
  for (const rating of ["again", "hard"]) {
    assert.equal(schedule(review({ ease: 1.3 }), rating, NOW).ease, 1.3);
  }
  for (const rating of ["hard", "good", "easy"]) {
    assert.equal(schedule(review({ intervalDays: 36_500 }), rating, NOW).intervalDays, 36_500);
  }
});

test("rating labels are predictions of the actual scheduler without mutation", () => {
  assert.deepEqual(ratingIntervals(null, NOW), { again: "1m", hard: "6m", good: "10m", easy: "4d" });
  const state = Object.freeze(review());
  assert.deepEqual(ratingIntervals(state, NOW), { again: "10m", hard: "12d", good: "25d", easy: "33d" });
  assert.deepEqual(state, review());
});

test("localDay uses local midnight and handles month/year boundaries", () => {
  assert.equal(localDay(new Date(2026, 0, 1, 0, 0).getTime()), "2026-01-01");
  assert.equal(localDay(new Date(2026, 0, 1, 0, 0).getTime() - 1), "2025-12-31");
  assert.equal(localDay(new Date(2026, 9, 1, 0, 0).getTime() - 1), "2026-09-30");
});

test("day intervals preserve the local hour across both DST boundaries", () => {
  const schedulerUrl = new URL("../scheduler.js", import.meta.url).href;
  const script = `
    import assert from 'node:assert/strict';
    import { schedule, localDay } from ${JSON.stringify(schedulerUrl)};
    for (const [date, expectedDay, elapsedHours] of [
      [new Date(2026, 2, 7, 12), '2026-03-08', 23],
      [new Date(2026, 9, 31, 12), '2026-11-01', 25],
    ]) {
      const now = date.getTime();
      const learning = schedule(null, 'good', now);
      const next = schedule(learning, 'good', now);
      assert.equal(localDay(next.due), expectedDay);
      assert.equal(new Date(next.due).getHours(), 12);
      assert.equal((next.due - now) / 3600000, elapsedHours);
      assert.equal(schedule(null, 'again', now).due - now, 60000);
    }
    assert.equal(localDay(Date.UTC(2026, 0, 1, 3)), '2025-12-31');
  `;
  execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    env: { ...process.env, TZ: "America/New_York" }, encoding: "utf8",
  });
});

test("invalid ratings, timestamps, and persisted states fail explicitly", () => {
  for (const rating of ["", "GOOD", "unknown", 3, null]) {
    assert.throws(() => schedule(null, rating, NOW), TypeError);
  }
  for (const now of [NaN, Infinity, "123", null, 9e15]) {
    assert.throws(() => schedule(null, "good", now), RangeError);
    assert.throws(() => localDay(now), RangeError);
  }
  for (const state of [false, 3, [], {}, review({ stage: "bogus" })]) {
    assert.throws(() => schedule(state, "good", NOW), TypeError);
  }
  for (const override of [
    { due: NaN }, { step: -1 }, { step: 1 }, { intervalDays: 0 },
    { intervalDays: 1.5 }, { intervalDays: 36_501 }, { ease: 1.2 },
    { ease: Infinity }, { reps: -1 }, { reps: 1.5 }, { lapses: 9 },
  ]) {
    assert.throws(() => schedule(review(override), "good", NOW), RangeError);
  }
});
