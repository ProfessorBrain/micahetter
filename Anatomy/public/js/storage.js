const KEY = "critical-structures:v1";
export function loadProgress() { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } }
export function saveProgress(progress) { try { localStorage.setItem(KEY, JSON.stringify({ ...progress, savedAt: new Date().toISOString() })); } catch { /* storage is optional */ } }
export function recordPerformance(progress, structure, result, cluesUsed) {
  const next = structuredClone(progress || {}); next.structures ??= {}; next.zones ??= {};
  const entry = next.structures[structure.id] ?? { attempts: 0, correct: 0, totalClues: 0 };
  entry.attempts += 1; entry.correct += result.correct ? 1 : 0; entry.totalClues += cluesUsed; entry.mastered = entry.correct >= 2 && entry.correct / entry.attempts >= .75;
  next.structures[structure.id] = entry;
  const zone = next.zones[structure.zone] ?? { attempts: 0, correct: 0 }; zone.attempts += 1; zone.correct += result.correct ? 1 : 0; next.zones[structure.zone] = zone;
  return next;
}
