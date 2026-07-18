export function nextTurn(currentIndex, playerCount, steal = false, wasCorrect = false) {
  if (playerCount <= 1) return 0;
  if (steal && !wasCorrect) return (currentIndex + 1) % playerCount;
  return (currentIndex + 1) % playerCount;
}

export function createPlayers(names = []) { return names.map((name, index) => ({ id: `player-${index + 1}`, name: name.trim() || `Player ${index + 1}`, score: 0 })); }
