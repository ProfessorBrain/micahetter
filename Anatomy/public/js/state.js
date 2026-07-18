const initialState = {
  screen: "setup",
  settings: { mode: "single", players: ["Player 1", "Player 2"], steal: false, zones: ["whole"], difficulty: "novice", rounds: 5 },
  round: 0, score: 0, streak: 0, cluesUsed: [], candidates: [], target: null, selected: null,
  boardPath: ["whole-body"], placement: null, result: null, history: [], activePlayer: 0, playerScores: []
};

let state = structuredClone(initialState);
const listeners = new Set();

export function getState() { return state; }
export function setState(patch) { state = { ...state, ...patch }; listeners.forEach((fn) => fn(state)); return state; }
export function updateState(updater) { return setState(updater(state)); }
export function resetState(settings = state.settings) { state = { ...structuredClone(initialState), settings, playerScores: settings.players.map(() => 0) }; listeners.forEach((fn) => fn(state)); return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
