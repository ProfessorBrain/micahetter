import { localDay, schedule } from './scheduler.js';

export function freshProfile() {
  return {schema: 1, deckId: 'neuranki-v1', revision: 0, createdAt: Date.now(), settings: {newPerDay: 20, burySiblings: true}, cards: {}, suspended: {}, buried: {}, daily: {}, undo: null, lastBackup: null};
}
export function isDue(state, now) {
  return !!state && (state.stage === 'review' ? localDay(state.due) <= localDay(now) : state.due <= now);
}
export function available(card, profile, now) {
  if (profile.settings.burySiblings === false) return !profile.suspended[card.id];
  const bury = profile.buried[card.noteId];
  return !profile.suspended[card.id] && !(bury?.day === localDay(now) && bury.cardId !== card.id);
}
export function studyCounts(cards, profile, now = Date.now()) {
  const counts = {due: 0, learning: 0, fresh: 0, waiting: 0, total: cards.length};
  for (const card of cards) {
    if (!available(card, profile, now)) continue;
    const state = profile.cards[card.id];
    if (!state) counts.fresh++;
    else if (isDue(state, now)) counts[state.stage === 'review' ? 'due' : 'learning']++;
    else if (state.stage !== 'review') counts.waiting++;
  }
  const introduced = profile.daily[localDay(now)]?.newCards || 0;
  counts.newToday = Math.min(counts.fresh, Math.max(0, profile.settings.newPerDay - introduced));
  return counts;
}
export function selectNext(cards, profile, now = Date.now()) {
  const pool = cards.filter(card => available(card, profile, now));
  const due = pool.filter(card => isDue(profile.cards[card.id], now));
  due.sort((a,b) => {
    const x = profile.cards[a.id], y = profile.cards[b.id];
    return Number(x.stage === 'review') - Number(y.stage === 'review') || x.due - y.due;
  });
  if (due.length) return due[0];
  if ((profile.daily[localDay(now)]?.newCards || 0) >= profile.settings.newPerDay) return null;
  return pool.find(card => !profile.cards[card.id]) || null;
}
export function interleaveDecks(cards) {
  const groups = new Map();
  for (const card of cards) {
    if (!groups.has(card.deckId)) groups.set(card.deckId, []);
    groups.get(card.deckId).push(card);
  }
  const result = [], lists = [...groups.values()];
  for (let i = 0; result.length < cards.length; i++) for (const group of lists) if (group[i]) result.push(group[i]);
  return result;
}
export function validateBackup(input, cardIds, noteIds, cardToNote) {
  if (!input || input.schema !== 1 || input.deckId !== 'neuranki-v1') throw new Error('Choose a NeurAnki progress backup for this deck.');
  const object = x => x && typeof x === 'object' && !Array.isArray(x);
  if (!object(input.settings) || !Number.isInteger(input.settings.newPerDay) || input.settings.newPerDay < 0 || input.settings.newPerDay > 500) throw new Error('Invalid daily card limit.');
  if (input.settings.burySiblings !== undefined && typeof input.settings.burySiblings !== 'boolean') throw new Error('Invalid related-card setting.');
  const out = freshProfile();
  out.settings.newPerDay = input.settings.newPerDay;
  out.settings.burySiblings = input.settings.burySiblings !== false;
  if (!object(input.cards) || !object(input.daily) || !object(input.suspended) || !object(input.buried)) throw new Error('Incomplete progress backup.');
  for (const [id,s] of Object.entries(input.cards)) {
    if (!cardIds.has(id) || !object(s) || !['learning','review','relearning'].includes(s.stage)) throw new Error('Unrecognized card data.');
    // Reuse the live scheduler's constraints, including stage-specific steps,
    // intervals, and safe counters, so an accepted backup remains reviewable.
    try { schedule(s, 'good', Date.UTC(2026, 0, 1)); }
    catch { throw new Error('Invalid review values.'); }
    if (!Number.isSafeInteger(s.due) || s.due < 0 || s.ease > 100) throw new Error('Invalid review values.');
    out.cards[id] = Object.fromEntries(['stage','step','due','intervalDays','ease','reps','lapses'].map(key=>[key,s[key]]));
  }
  const validDay = day => /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day)) && new Date(day).toISOString().slice(0,10) === day;
  for (const [day,value] of Object.entries(input.daily)) {
    if (!validDay(day) || !object(value) || !Number.isSafeInteger(value.reviews) || value.reviews < 0 || value.reviews >= Number.MAX_SAFE_INTEGER || !Number.isSafeInteger(value.newCards) || value.newCards < 0 || value.newCards > value.reviews) throw new Error('Invalid study history.');
    out.daily[day] = {reviews:value.reviews,newCards:value.newCards};
  }
  for (const [id,value] of Object.entries(input.suspended)) {
    if (!cardIds.has(id) || value !== true) throw new Error('Invalid suspended card.');
    out.suspended[id] = true;
  }
  for (const [id,value] of Object.entries(input.buried)) {
    if (!noteIds.has(id) || !object(value) || !validDay(value.day) || !cardIds.has(value.cardId) || (cardToNote && cardToNote.get(value.cardId) !== id)) throw new Error('Invalid sibling card data.');
    out.buried[id] = {day:value.day,cardId:value.cardId};
  }
  const validTime = value => Number.isSafeInteger(value) && value >= 0 && value <= 8640000000000000;
  if (input.createdAt !== undefined) {
    if (!validTime(input.createdAt)) throw new Error('Invalid profile creation date.');
    out.createdAt = input.createdAt;
  }
  if (input.lastBackup != null) {
    if (!validTime(input.lastBackup)) throw new Error('Invalid backup date.');
    out.lastBackup = input.lastBackup;
  }
  return out;
}
