export function calculateScore({ cluesUsed = 1, correctCandidate = true, placement = "correct", orientationDifference = 0, candidateMistakes = 0, placementMistakes = 0, timeBonus = 0 } = {}) {
  let points = 100 - Math.max(0, cluesUsed - 1) * 15;
  if (correctCandidate) points += 20;
  if (placement === "perfect") points += 20;
  else if (placement === "correct") points += 10;
  if (correctCandidate && (placement === "perfect" || placement === "correct")) points += Math.max(0, Math.round(10 - Math.abs(orientationDifference) / 3));
  points -= candidateMistakes * 20;
  points -= placementMistakes * 10;
  points += timeBonus;
  return Math.max(0, points);
}

export function potentialScore(cluesUsed = 0) { return Math.max(25, 100 - Math.max(0, cluesUsed - 1) * 15); }
