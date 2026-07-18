export const DIFFICULTIES = {
  novice: { candidates: 3, labels: true, tolerance: 1.45, categories: ["name", "function", "surfaceLandmark", "anatomicalRelationship"] },
  intermediate: { candidates: 5, labels: true, tolerance: 1.1, categories: ["function", "innervation", "bloodSupply", "origin", "insertion", "anatomicalRelationship", "pathway"] },
  advanced: { candidates: 6, labels: false, tolerance: .88, categories: ["dysfunction", "histology", "imaging", "clinical", "development", "anatomicalRelationship", "pathway"] },
  expert: { candidates: 7, labels: false, tolerance: .72, categories: ["clinical", "dysfunction", "histology", "imaging", "development", "pathway", "anatomicalRelationship", "function"] }
};

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}

export function eligibleStructures(structures, zones) {
  if (!zones?.length || zones.includes("whole")) return [...structures];
  return structures.filter((structure) => zones.includes(structure.zone));
}

export function selectTarget(structures, zones, previousIds = [], random = Math.random) {
  const eligible = eligibleStructures(structures, zones);
  const fresh = eligible.filter((structure) => !previousIds.slice(-Math.max(1, Math.floor(eligible.length / 2))).includes(structure.id));
  const pool = fresh.length ? fresh : eligible;
  if (!pool.length) throw new Error("No structures are eligible for the selected zones.");
  return pool[Math.floor(random() * pool.length)];
}

function similarity(target, candidate) {
  let score = target.zone === candidate.zone ? 8 : 0;
  if (target.system === candidate.system) score += 4;
  if (target.pieceType === candidate.pieceType) score += 3;
  score += candidate.distractorTags.filter((tag) => target.distractorTags.includes(tag)).length * 2;
  return score;
}

export function buildCandidateTray(target, structures, difficulty = "novice", random = Math.random) {
  const count = DIFFICULTIES[difficulty]?.candidates ?? 3;
  const ranked = structures.filter((item) => item.id !== target.id).map((item) => ({ item, rank: similarity(target, item) + random() })).sort((a, b) => b.rank - a.rank).map(({ item }) => item);
  return shuffle([target, ...ranked.slice(0, Math.max(0, count - 1))], random);
}
