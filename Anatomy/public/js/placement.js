export function angleDifference(a = 0, b = 0) { const raw = Math.abs(((a - b + 180) % 360 + 360) % 360 - 180); return Math.round(raw * 10) / 10; }
export function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

export function evaluatePlacement(structure, placement, options = {}) {
  if (!structure || !placement) return { status: "unplaced", overlap: 0, rotationDifference: 180, correct: false };
  const toleranceMultiplier = (options.difficultyTolerance ?? 1) * (options.enlargedTolerance ? 1.3 : 1);
  const target = structure.target;
  const centerDistance = distance(target, placement);
  const effectiveRadius = target.radius * toleranceMultiplier;
  const overlap = Math.max(0, Math.min(1, 1 - centerDistance / (effectiveRadius * 1.25)));
  const rotationDifference = angleDifference(placement.rotation ?? 0, structure.idealRotation ?? 0);
  const rotationOk = rotationDifference <= (structure.rotationTolerance ?? 180) * toleranceMultiplier;
  const withinTarget = centerDistance <= effectiveRadius;
  const nearMiss = (structure.nearMissZones ?? []).some((zone) => distance(zone, placement) <= zone.radius * toleranceMultiplier);
  let status = "incorrect-region";
  if (withinTarget && !rotationOk) status = "incorrect-orientation";
  else if (withinTarget && overlap >= Math.max(.82, structure.minimumOverlap ?? .7)) status = "perfect";
  else if (withinTarget && overlap >= (structure.minimumOverlap ?? .7) * .72) status = "correct";
  else if (nearMiss || centerDistance <= effectiveRadius * 1.75) status = "near-miss";
  return { status, overlap: Math.round(overlap * 100), rotationDifference, correct: status === "perfect" || status === "correct" };
}
