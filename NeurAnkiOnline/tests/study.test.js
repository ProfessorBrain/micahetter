import test from 'node:test';
import assert from 'node:assert/strict';
import { localDay, schedule } from '../scheduler.js';
import {
  freshProfile, isDue, available, studyCounts, selectNext, interleaveDecks, validateBackup,
} from '../study.js';

const MINUTE = 60_000;
const NOW = new Date(2026, 8, 30, 12).getTime();
const TODAY = localDay(NOW);
const cards = [
  { id: 'a1', noteId: 'n1', deckId: 'A' },
  { id: 'a2', noteId: 'n1', deckId: 'A' },
  { id: 'a3', noteId: 'n2', deckId: 'A' },
  { id: 'b1', noteId: 'n3', deckId: 'B' },
  { id: 'b2', noteId: 'n4', deckId: 'B' },
];
const cardIds = new Set(cards.map(c => c.id));
const noteIds = new Set(cards.map(c => c.noteId));
const cardToNote = new Map(cards.map(c => [c.id, c.noteId]));
const review = (due = NOW, overrides = {}) => ({
  stage: 'review', step: 0, due, intervalDays: 10, ease: 2.5, reps: 8, lapses: 0, ...overrides,
});
const learning = due => ({ stage: 'learning', step: 1, due, intervalDays: 0, ease: 2.5, reps: 1, lapses: 0 });
const restore = input => validateBackup(input, cardIds, noteIds, cardToNote);
const backup = () => {
  const profile = freshProfile();
  profile.createdAt = NOW - 86_400_000;
  profile.lastBackup = NOW;
  profile.cards.a1 = review();
  profile.cards.b1 = learning(NOW + 10 * MINUTE);
  profile.daily[TODAY] = { reviews: 9, newCards: 2 };
  profile.suspended.a3 = true;
  profile.buried.n1 = { day: TODAY, cardId: 'a1' };
  return profile;
};

test('due learning steps precede reviews, which precede new cards', () => {
  const profile = freshProfile();
  profile.cards.a3 = review(NOW - 86_400_000);
  profile.cards.b1 = learning(NOW - MINUTE);
  profile.cards.b2 = learning(NOW - 2 * MINUTE);
  const orderBefore = cards.map(c => c.id);
  assert.equal(selectNext(cards, profile, NOW).id, 'b2');
  profile.cards.b2.due = NOW + MINUTE;
  assert.equal(selectNext(cards, profile, NOW).id, 'b1');
  profile.cards.b1.due = NOW + MINUTE;
  assert.equal(selectNext(cards, profile, NOW).id, 'a3');
  profile.cards.a3.due = NOW + 86_400_000;
  assert.equal(selectNext(cards, profile, NOW).id, 'a1');
  assert.deepEqual(cards.map(c => c.id), orderBefore);
});

test('overdue reviews are ordered by due time regardless of deck order', () => {
  const profile = freshProfile();
  profile.cards.a1 = review(NOW - MINUTE);
  profile.cards.b2 = review(NOW - 3 * 86_400_000);
  profile.cards.a3 = review(NOW - 86_400_000);
  assert.equal(selectNext(cards, profile, NOW).id, 'b2');
});

test('reviews become available on their local due day; learning waits for its timestamp', () => {
  const midnight = new Date(2026, 9, 1).getTime();
  const evening = new Date(2026, 9, 1, 20).getTime();
  assert.equal(isDue(review(evening), midnight - 1), false);
  assert.equal(isDue(review(evening), midnight), true);
  assert.equal(isDue(learning(evening), midnight), false);
  assert.equal(isDue(learning(evening), evening - 1), false);
  assert.equal(isDue(learning(evening), evening), true);
  assert.equal(isDue(null, midnight), false);
});

test('the new-card limit is global across topics and never blocks due reviews', () => {
  const profile = freshProfile();
  profile.settings.newPerDay = 2;
  profile.daily[TODAY] = { reviews: 2, newCards: 2 };
  const a = cards.filter(c => c.deckId === 'A');
  const b = cards.filter(c => c.deckId === 'B');
  assert.equal(selectNext(a, profile, NOW), null);
  assert.equal(selectNext(b, profile, NOW), null);
  assert.equal(studyCounts(cards, profile, NOW).newToday, 0);
  profile.cards.b1 = review();
  assert.equal(selectNext(b, profile, NOW).id, 'b1');
  profile.settings.newPerDay = 0;
  assert.equal(selectNext(b, profile, NOW).id, 'b1');
  assert.equal(selectNext(a, profile, NOW), null);
});

test('local midnight renews the new-card allowance and releases siblings', () => {
  const midnight = new Date(2026, 9, 1).getTime();
  const profile = freshProfile();
  profile.settings.newPerDay = 1;
  profile.daily[localDay(midnight - 1)] = { reviews: 1, newCards: 1 };
  profile.buried.n1 = { day: localDay(midnight - 1), cardId: 'a1' };
  assert.equal(selectNext([cards[1]], profile, midnight - 1), null);
  assert.equal(studyCounts(cards, profile, midnight - 1).newToday, 0);
  assert.equal(selectNext([cards[1]], profile, midnight).id, 'a2');
  assert.equal(studyCounts(cards, profile, midnight).newToday, 1);
});

test('sibling burial excludes related cards while preserving the current learning card', () => {
  const profile = freshProfile();
  profile.cards.a1 = learning(NOW);
  profile.cards.a2 = review(NOW - 86_400_000);
  profile.buried.n1 = { day: TODAY, cardId: 'a1' };
  assert.equal(available(cards[0], profile, NOW), true);
  assert.equal(available(cards[1], profile, NOW), false);
  assert.equal(selectNext(cards, profile, NOW).id, 'a1');
  assert.deepEqual(studyCounts(cards, profile, NOW), {
    due: 0, learning: 1, fresh: 3, waiting: 0, total: 5, newToday: 3,
  });
});

test('related cards remain available when sibling spacing is disabled', () => {
  const profile = freshProfile();
  profile.settings.burySiblings = false;
  profile.cards.a1 = learning(NOW);
  profile.cards.a2 = review(NOW - 86_400_000);
  profile.buried.n1 = { day: TODAY, cardId: 'a1' };
  assert.equal(available(cards[0], profile, NOW), true);
  assert.equal(available(cards[1], profile, NOW), true);
  assert.deepEqual(studyCounts(cards, profile, NOW), {
    due: 1, learning: 1, fresh: 3, waiting: 0, total: 5, newToday: 3,
  });
});

test('suspended cards are excluded from queues and counts until resumed', () => {
  const profile = freshProfile();
  profile.cards.a1 = review();
  profile.cards.a2 = learning(NOW + MINUTE);
  profile.suspended.a1 = true;
  profile.suspended.a2 = true;
  profile.suspended.a3 = true;
  assert.equal(selectNext(cards, profile, NOW).id, 'b1');
  assert.deepEqual(studyCounts(cards, profile, NOW), {
    due: 0, learning: 0, fresh: 2, waiting: 0, total: 5, newToday: 2,
  });
  delete profile.suspended.a1;
  assert.equal(selectNext(cards, profile, NOW).id, 'a1');
});

test('waiting learning cards are counted but cannot be selected early', () => {
  const profile = freshProfile();
  profile.cards.a1 = learning(NOW + MINUTE);
  assert.equal(selectNext([cards[0]], profile, NOW), null);
  assert.deepEqual(studyCounts([cards[0]], profile, NOW), {
    due: 0, learning: 0, fresh: 0, waiting: 1, total: 1, newToday: 0,
  });
  assert.equal(selectNext([cards[0]], profile, NOW + MINUTE).id, 'a1');
});

test('interleaving rotates topics without dropping or mutating cards', () => {
  const input = Object.freeze([...cards, { id: 'c1', noteId: 'n5', deckId: 'C' }]);
  assert.deepEqual(interleaveDecks(input).map(c => c.id), ['a1', 'b1', 'c1', 'a2', 'b2', 'a3']);
  assert.deepEqual(input.map(c => c.id), ['a1', 'a2', 'a3', 'b1', 'b2', 'c1']);
  assert.deepEqual(interleaveDecks([]), []);
  assert.equal(new Set(interleaveDecks(input)).size, input.length);
});

test('backup JSON roundtrip preserves study data and discards transient or extra fields', () => {
  const input = backup();
  input.revision = 99;
  input.undo = { cardId: 'a1' };
  input.unexpected = { script: 'ignored' };
  input.cards.a1.unexpected = 'ignored';
  const exported = JSON.parse(JSON.stringify(input));
  const imported = restore(exported);
  assert.equal(imported.revision, 0);
  assert.equal(imported.undo, null);
  assert.equal(imported.createdAt, input.createdAt);
  assert.equal(imported.lastBackup, input.lastBackup);
  assert.deepEqual(imported.settings, input.settings);
  assert.deepEqual(imported.daily, input.daily);
  assert.deepEqual(imported.suspended, input.suspended);
  assert.deepEqual(imported.buried, input.buried);
  assert.deepEqual(imported.cards, { a1: review(), b1: learning(NOW + 10 * MINUTE) });
  assert.equal('unexpected' in imported, false);
  assert.notEqual(imported.cards.a1, exported.cards.a1);
  assert.notEqual(imported.daily[TODAY], exported.daily[TODAY]);
  for (const state of Object.values(imported.cards)) {
    for (const rating of ['again', 'hard', 'good', 'easy']) assert.doesNotThrow(() => schedule(state, rating, NOW));
  }
});

test('backups preserve the related-card preference and migrate older backups to on', () => {
  const disabled = backup();
  disabled.settings.burySiblings = false;
  assert.equal(restore(disabled).settings.burySiblings, false);
  const legacy = backup();
  delete legacy.settings.burySiblings;
  assert.equal(restore(legacy).settings.burySiblings, true);
  const invalid = backup();
  invalid.settings.burySiblings = 'yes';
  assert.throws(() => restore(invalid), /related-card/);
});

test('backups reject foreign decks, malformed containers, and unknown ids', () => {
  for (const change of [
    p => { p.schema = 2; }, p => { p.deckId = 'other'; },
    p => { p.cards = []; }, p => { p.daily = null; },
    p => { p.suspended = []; }, p => { p.buried = null; },
    p => { p.cards.foreign = review(); },
    p => { p.suspended.foreign = true; }, p => { p.suspended.a1 = false; },
    p => { p.buried.foreign = { day: TODAY, cardId: 'a1' }; },
    p => { p.buried.n1.cardId = 'foreign'; },
  ]) {
    const input = backup(); change(input);
    assert.throws(() => restore(input));
  }
});

test('backup review validation matches scheduler stage, interval, and count constraints', () => {
  for (const overrides of [
    { stage: 'invalid' }, { step: 1 }, { step: -1 },
    { intervalDays: 0 }, { intervalDays: 1.5 }, { intervalDays: 36_501 },
    { stage: 'learning', intervalDays: 1 },
    { stage: 'relearning', step: 1 }, { stage: 'relearning', intervalDays: 0 },
    { ease: 1.2 }, { ease: Infinity }, { ease: 101 },
    { due: NaN }, { due: -1 }, { due: 1.5 }, { due: Number.MAX_SAFE_INTEGER },
    { reps: 2.5 }, { reps: Number.MAX_SAFE_INTEGER }, { reps: Number.MAX_SAFE_INTEGER + 1 },
    { lapses: -1 }, { lapses: 9 }, { lapses: 1.5 }, { lapses: Number.MAX_SAFE_INTEGER + 1 },
  ]) {
    const input = backup(); Object.assign(input.cards.a1, overrides);
    assert.throws(() => restore(input), undefined, JSON.stringify(overrides));
  }
  const valid = backup();
  valid.cards.a1 = learning(NOW);
  assert.doesNotThrow(() => restore(valid));
  valid.cards.a1 = review(NOW, { stage: 'relearning', intervalDays: 1 });
  assert.doesNotThrow(() => restore(valid));
});

test('backups reject impossible dates, unsafe daily counters, and invalid limits', () => {
  for (const change of [
    p => { p.daily['2026-02-30'] = { reviews: 1, newCards: 1 }; },
    p => { p.daily['2026-2-03'] = { reviews: 1, newCards: 1 }; },
    p => { p.daily[TODAY].reviews = Number.MAX_SAFE_INTEGER; },
    p => { p.daily[TODAY].newCards = Number.MAX_SAFE_INTEGER + 1; },
    p => { p.daily[TODAY].reviews = 1.5; },
    p => { p.daily[TODAY].newCards = -1; },
    p => { p.daily[TODAY].newCards = 10; },
    p => { p.settings.newPerDay = 501; }, p => { p.settings.newPerDay = 1.5; },
    p => { p.settings.newPerDay = -1; },
    p => { p.createdAt = Infinity; }, p => { p.createdAt = Number.MAX_SAFE_INTEGER; },
    p => { p.lastBackup = -1; }, p => { p.lastBackup = 'yesterday'; },
  ]) {
    const input = backup(); change(input);
    assert.throws(() => restore(input));
  }
});

test('buried cards must belong to the corresponding note', () => {
  const input = backup();
  input.buried.n1.cardId = 'b1';
  assert.throws(() => restore(input), /sibling/);
  input.buried.n1.cardId = 'a2';
  assert.doesNotThrow(() => restore(input));
});
