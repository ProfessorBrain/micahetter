import { getState, resetState, setState } from "./state.js";
import { buildCandidateTray, DIFFICULTIES, selectTarget } from "./game-engine.js";
import { CATEGORY_LABELS, availableClues, drawClue } from "./spinner.js";
import { calculateScore, potentialScore } from "./scoring.js";
import { evaluatePlacement } from "./placement.js";
import { createPlayers, nextTurn } from "./multiplayer.js";
import { loadContent } from "./content-loader.js";
import { loadProgress, recordPerformance, saveProgress } from "./storage.js";
import { playTone } from "./audio.js";
import { drawAuthoringPolygon, renderBoard } from "./board.js";

const $ = (selector) => document.querySelector(selector);
let structures = []; let boards = {}; let progress = loadProgress();
let debug = new URLSearchParams(location.search).get("debug") === "1";
let muted = Boolean(progress.preferences?.muted); let authoring = false; let authorPoints = [];
let players = []; let roundTargetIds = []; let spinRotation = 0;

function announce(message) { $("#live-region").textContent = message; }
function showScreen(name) { ["setup", "game", "summary"].forEach((id) => { $(`#${id}-screen`).hidden = id !== name; }); window.scrollTo({ top: 0, behavior: "smooth" }); }
function currentBoardId() { return getState().boardPath.at(-1); }
function currentBoard() { return boards[currentBoardId()]; }
function isFinalBoard() { return currentBoardId() === getState().target?.finalBoard; }
function activeName() { return players[getState().activePlayer]?.name ?? "Your"; }

function wireSelectable(containerSelector, inputSelector = "input") {
  const container = $(containerSelector);
  container?.addEventListener("change", (event) => {
    if (!event.target.matches(inputSelector)) return;
    if (event.target.type === "radio") container.querySelectorAll("label").forEach((label) => label.classList.toggle("selected", label.contains(event.target)));
    else event.target.closest("label")?.classList.toggle("selected", event.target.checked);
  });
}

function renderPlayerInputs() {
  const count = Number($("#player-count").value);
  $("#player-names").innerHTML = Array.from({ length: count }, (_, i) => `<input aria-label="Player ${i + 1} name" value="Player ${i + 1}" maxlength="20">`).join("");
}

function readSettings() {
  const mode = $("input[name='mode']:checked").value;
  const checkedZones = [...document.querySelectorAll("#zone-options input:checked")].map((input) => input.value);
  const playerNames = mode === "multi" ? [...document.querySelectorAll("#player-names input")].map((input) => input.value) : ["You"];
  return { mode, players: playerNames, steal: $("#steal-mode").checked, zones: checkedZones.length ? checkedZones : ["whole"], difficulty: $("input[name='difficulty']:checked").value, rounds: Number($("#round-count").value) };
}

function beginSession() {
  const settings = readSettings(); players = createPlayers(settings.players); roundTargetIds = [];
  resetState(settings); setState({ playerScores: players.map(() => 0) });
  showScreen("game"); startRound();
}

function startRound() {
  const state = getState();
  if (state.round >= state.settings.rounds) return showSummary();
  const forcedId = $("#force-target").value;
  const target = structures.find((item) => item.id === forcedId) ?? selectTarget(structures, state.settings.zones, roundTargetIds);
  roundTargetIds.push(target.id);
  const candidates = buildCandidateTray(target, structures, state.settings.difficulty);
  setState({ round: state.round + 1, target, candidates, cluesUsed: [], selected: null, boardPath: ["whole-body"], placement: null, result: null, stealUsed: false });
  $("#feedback-card").hidden = true; $("#placement-controls").hidden = true; $("#placed-piece").hidden = true; $("#answer-button").disabled = true; $("#spin-again").disabled = true; $("#spin-button").disabled = false;
  $("#candidate-tray").innerHTML = ""; $("#candidate-count").textContent = "Locked"; $("#tray-instruction").textContent = "Candidates appear when you choose to answer.";
  $("#clue-card").className = "clue-card empty"; $("#clue-card").innerHTML = `<span class="clue-category">Waiting to spin</span><p>Each new clue narrows the answer—but reduces the points available.</p>`; $("#used-clues").innerHTML = "";
  updateStatus(); updateClueValue(); renderCurrentBoard();
  announce(`Round ${getState().round}. Spin for a clue.`);
}

function updateStatus() {
  const state = getState();
  $("#round-label").textContent = `Round ${state.round} of ${state.settings.rounds}`; $("#round-progress-fill").style.width = `${(state.round / state.settings.rounds) * 100}%`;
  $("#score-value").textContent = state.score; $("#streak-value").textContent = state.streak;
  $("#active-player").textContent = state.settings.mode === "multi" ? `${activeName()}’s turn` : "Your turn";
}

function updateClueValue() { const count = getState().cluesUsed.length; $("#clue-value").textContent = `${potentialScore(count || 1)} pts`; $("#clue-count").textContent = `${availableClues(getState().target, getState().cluesUsed, getState().settings.difficulty).length}`; }

async function spin() {
  const state = getState(); if (!state.target || $("#spin-button").disabled) return;
  const forced = $("#force-clue").value; const clue = drawClue(state.target, state.cluesUsed, state.settings.difficulty, Math.random, forced);
  if (!clue) { announce("No unused clues remain."); return; }
  $("#spin-button").disabled = true; $("#spin-again").disabled = true; spinRotation += 960 + Math.floor(Math.random() * 360); $("#spinner").style.transform = `rotate(${spinRotation}deg)`; playTone("tick", muted);
  await new Promise((resolve) => setTimeout(resolve, 820));
  const used = [...state.cluesUsed, clue.category]; setState({ cluesUsed: used });
  $("#clue-card").className = "clue-card"; $("#clue-card").innerHTML = `<span class="clue-category">${clue.label}</span><p>${clue.text}</p>`;
  $("#used-clues").innerHTML = used.map((category) => `<span>${CATEGORY_LABELS[category] ?? category}</span>`).join("");
  $("#answer-button").disabled = false; $("#spin-again").disabled = availableClues(state.target, used, state.settings.difficulty).length === 0; $("#spin-button").disabled = true; updateClueValue();
  announce(`${clue.label}: ${clue.text}`);
}

function revealCandidates() {
  const state = getState(); renderCandidates(); $("#candidate-count").textContent = `${state.candidates.length} pieces`; $("#tray-instruction").textContent = state.settings.difficulty === "novice" ? "Select the best match, then navigate the board." : "Compare each piece, then select and navigate.";
  $("#board-instruction").innerHTML = `<strong>Select a candidate</strong><span>Then choose a region to move closer.</span>`; $("#answer-button").disabled = true; $("#spin-again").disabled = false;
  $("#candidate-tray .candidate")?.focus(); announce(`${state.candidates.length} candidate structures are now available.`);
}

function renderCandidates() {
  const state = getState(); const labelsVisible = DIFFICULTIES[state.settings.difficulty].labels;
  $("#candidate-tray").innerHTML = state.candidates.map((item) => `<button class="candidate${labelsVisible ? "" : " hidden-label"}" type="button" role="option" aria-selected="${state.selected?.id === item.id}" data-id="${item.id}" draggable="true" aria-label="${labelsVisible ? item.name : `Unlabeled ${item.pieceType} candidate`}"><span class="piece-preview ${item.pieceType}" style="--piece:${item.pieceColor}"></span><span><strong>${item.name}</strong><small>${item.system} · ${item.pieceType}</small></span><span class="select-mark">✓</span></button>`).join("");
  $("#candidate-tray").querySelectorAll(".candidate").forEach((button) => {
    button.addEventListener("click", () => selectCandidate(button.dataset.id));
    button.addEventListener("dragstart", (event) => { event.dataTransfer.setData("text/plain", button.dataset.id); selectCandidate(button.dataset.id); });
  });
}

function selectCandidate(id) {
  const selected = structures.find((item) => item.id === id); if (!selected) return;
  setState({ selected }); renderCandidates();
  const selectedButton = $(`#candidate-tray [data-id="${id}"]`); selectedButton?.classList.remove("hidden-label"); selectedButton?.setAttribute("aria-label", selected.name);
  $("#board-instruction").innerHTML = `<strong>${selected.name} selected</strong><span>Choose a region on the board to move closer.</span>`;
  announce(`${selected.name} selected. Navigate the anatomy board.`);
}

function navigateTo(zoneId) {
  const state = getState(); if (!state.selected) { announce("Select a candidate structure first."); return; }
  if (!boards[zoneId]) return;
  playTone("zoom", muted); setState({ boardPath: [...state.boardPath, zoneId], placement: null }); $("#placed-piece").hidden = true; renderCurrentBoard();
  if (zoneId === state.target.finalBoard) { $("#board-instruction").innerHTML = `<strong>Place and orient the piece</strong><span>Click the location, then use the orientation control.</span>`; $("#placement-controls").hidden = false; }
  else if (!(boards[zoneId].zoomZones?.length)) { $("#board-instruction").innerHTML = `<strong>Detailed view</strong><span>Place here, or go back and choose another region.</span>`; $("#placement-controls").hidden = false; }
  else $("#board-instruction").innerHTML = `<strong>${boards[zoneId].label}</strong><span>Choose a region to move closer.</span>`;
  announce(`Now viewing ${boards[zoneId].label}.`);
}

function goBackBoard() {
  const state = getState(); if (state.boardPath.length <= 1) return; setState({ boardPath: state.boardPath.slice(0, -1), placement: null }); $("#placed-piece").hidden = true; $("#placement-controls").hidden = true; renderCurrentBoard();
}

function renderCurrentBoard() {
  const state = getState(); const board = currentBoard();
  $("#board-depth").textContent = board.label; $("#board-back").disabled = state.boardPath.length <= 1; $("#breadcrumbs").innerHTML = state.boardPath.map((id) => `<span>${boards[id]?.label ?? id}</span>`).join("");
  $("#debug-board").textContent = currentBoardId(); $("#debug-target").textContent = state.target?.id ?? "—";
  renderBoard($("#anatomy-board"), board, state.target, { debug, authoring, onZone: navigateTo, onDropZone: (zone, id) => { if (id) selectCandidate(id); navigateTo(zone); }, onPlace: placePiece, onDropBoard: (point, id) => { if (id) selectCandidate(id); placePiece(point); }, onPointer: (point) => { $("#debug-pointer").textContent = `${point.x.toFixed(1)}, ${point.y.toFixed(1)}`; }, onAuthorPoint: (point) => { authorPoints.push({ x: +point.x.toFixed(2), y: +point.y.toFixed(2) }); drawAuthoringPolygon($("#anatomy-board"), authorPoints); $("#authoring-status").textContent = `${authorPoints.length} points`; $("#authoring-export").disabled = authorPoints.length < 3; } });
  $("#debug-panel").hidden = !debug; $("#debug-toggle").setAttribute("aria-pressed", String(debug));
}

function placePiece(point) {
  const state = getState(); if (!state.selected) { announce("Select a candidate before placing it."); return; }
  if ((currentBoard().zoomZones?.length) > 0) { announce("Choose a zoom region before placing the structure."); return; }
  const placement = { x: point.x, y: point.y, rotation: Number($("#rotation-control").value) }; setState({ placement });
  const piece = $("#placed-piece"); piece.hidden = false; piece.className = `placed-piece ${state.selected.pieceType}`; piece.style.left = `${point.x}%`; piece.style.top = `${point.y}%`; piece.style.setProperty("--rotation", `${placement.rotation}deg`); piece.setAttribute("aria-label", `${state.selected.name} placed at x ${point.x.toFixed(0)}, y ${point.y.toFixed(0)}`);
  $("#placement-controls").hidden = false; $("#check-placement").disabled = false; updateDebugEvaluation(); announce("Piece placed. Adjust orientation if needed, then check placement.");
}

function updatePlacementRotation() {
  const state = getState(); const rotation = Number($("#rotation-control").value); $("#rotation-value").textContent = `${rotation}°`; $("#placed-piece").style.setProperty("--rotation", `${rotation}deg`); if (state.placement) setState({ placement: { ...state.placement, rotation } }); updateDebugEvaluation();
}

function updateDebugEvaluation() {
  const state = getState(); if (!state.placement || !state.target) return;
  const evaluation = evaluatePlacement(state.target, state.placement, { difficultyTolerance: DIFFICULTIES[state.settings.difficulty].tolerance, enlargedTolerance: $("#tolerance-toggle").checked });
  $("#debug-overlap").textContent = `${evaluation.overlap}%`; $("#debug-rotation").textContent = `${evaluation.rotationDifference}°`;
}

function movePlacedPiece(event) {
  const state = getState(); if (!state.placement || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault(); const step = event.shiftKey ? 3 : 1; const next = { ...state.placement };
  if (event.key === "ArrowLeft") next.x -= step; if (event.key === "ArrowRight") next.x += step; if (event.key === "ArrowUp") next.y -= step; if (event.key === "ArrowDown") next.y += step; next.x = Math.max(0, Math.min(100, next.x)); next.y = Math.max(0, Math.min(100, next.y)); placePiece(next);
}

function checkPlacement() {
  const state = getState(); if (!state.selected || !state.placement) return;
  let evaluation;
  if (state.selected.id !== state.target.id) evaluation = { status: "wrong-structure", overlap: 0, rotationDifference: 0, correct: false };
  else if (currentBoardId() !== state.target.finalBoard) evaluation = { status: "incorrect-region", overlap: 0, rotationDifference: 0, correct: false };
  else evaluation = evaluatePlacement(state.target, state.placement, { difficultyTolerance: DIFFICULTIES[state.settings.difficulty].tolerance, enlargedTolerance: $("#tolerance-toggle").checked });
  setState({ result: evaluation }); showFeedback(evaluation);
}

function feedbackCopy(status, target) {
  const copy = {
    perfect: ["Perfect placement", target.feedback.correct], correct: ["Correct structure and location", target.feedback.correct],
    "near-miss": ["Correct neighborhood, imprecise placement", target.feedback.review], "incorrect-region": ["Incorrect anatomical region", target.feedback.review],
    "incorrect-orientation": ["Correct location, incorrect orientation", `Rotate the piece to match its anatomical axis. ${target.feedback.review}`],
    "wrong-structure": ["Wrong structure selected", `The target was ${target.name}. ${target.feedback.correct}`]
  }; return copy[status] ?? ["Review this placement", target.feedback.review];
}

function showFeedback(evaluation) {
  const state = getState(); const [title, copy] = feedbackCopy(evaluation.status, state.target); const card = $("#feedback-card"); card.hidden = false; card.className = `feedback-card${evaluation.correct ? "" : " incorrect"}`;
  if (!evaluation.correct && state.settings.mode === "multi" && state.settings.steal && !state.stealUsed) {
    card.innerHTML = `<h3>${title}</h3><p>${copy}</p><div class="feedback-meta"><span>${evaluation.overlap}% overlap</span><span>${evaluation.rotationDifference}° rotation difference</span></div><button id="steal-attempt" class="primary-button compact" type="button">Pass for steal →</button>`;
    $("#steal-attempt").addEventListener("click", beginSteal); playTone("incorrect", muted); return;
  }
  const points = calculateScore({ cluesUsed: state.cluesUsed.length, correctCandidate: state.selected.id === state.target.id, placement: evaluation.status, orientationDifference: evaluation.rotationDifference, candidateMistakes: state.selected.id === state.target.id ? 0 : 1, placementMistakes: evaluation.correct ? 0 : 1 });
  const score = state.score + points; const streak = evaluation.correct ? state.streak + 1 : 0; const playerScores = [...state.playerScores]; playerScores[state.activePlayer] = (playerScores[state.activePlayer] ?? 0) + points;
  const historyEntry = { target: state.target, evaluation, clues: state.cluesUsed.length, points, player: activeName() };
  setState({ score, streak, playerScores, history: [...state.history, historyEntry] }); updateStatus(); progress = recordPerformance(progress, state.target, evaluation, state.cluesUsed.length); progress.preferences = { ...(progress.preferences ?? {}), muted }; saveProgress(progress);
  card.innerHTML = `<h3>${title}</h3><p>${copy}</p><div class="feedback-meta"><span>+${points} points</span><span>${evaluation.overlap}% overlap</span><span>${evaluation.rotationDifference}° rotation difference</span></div><button id="next-round" class="primary-button compact" type="button">${state.round >= state.settings.rounds ? "See results" : "Next round"} →</button>`;
  $("#next-round").addEventListener("click", () => { const next = nextTurn(getState().activePlayer, players.length, false, evaluation.correct); setState({ activePlayer: next }); startRound(); });
  $("#check-placement").disabled = true; playTone(evaluation.correct ? "correct" : "incorrect", muted); announce(`${title}. ${points} points.`);
}

function beginSteal() {
  const state = getState(); const next = nextTurn(state.activePlayer, players.length, true, false); setState({ activePlayer: next, selected: null, boardPath: ["whole-body"], placement: null, result: null, stealUsed: true });
  $("#feedback-card").hidden = true; $("#placed-piece").hidden = true; $("#placement-controls").hidden = true; renderCandidates(); renderCurrentBoard(); updateStatus();
  $("#board-instruction").innerHTML = `<strong>${activeName()} may steal</strong><span>Select a structure and place it.</span>`; announce(`${activeName()} may attempt the steal.`);
}

function showSummary() {
  const state = getState(); const correct = state.history.filter((item) => item.evaluation.correct).length; const perfect = state.history.filter((item) => item.evaluation.status === "perfect").length; const avgClues = state.history.length ? (state.history.reduce((sum, item) => sum + item.clues, 0) / state.history.length).toFixed(1) : "0";
  showScreen("summary"); $("#summary-title").textContent = correct === state.history.length ? "Anatomy, aligned." : correct >= state.history.length / 2 ? "Strong clinical instincts." : "Every miss maps the next step.";
  $("#summary-copy").textContent = state.settings.mode === "multi" ? `${players[state.playerScores.indexOf(Math.max(...state.playerScores))]?.name ?? "A player"} leads this session.` : `You correctly placed ${correct} of ${state.history.length} structures.`; $("#summary-score").textContent = state.score;
  $("#summary-stats").innerHTML = `<div><strong>${correct}/${state.history.length}</strong><span>Correct</span></div><div><strong>${perfect}</strong><span>Perfect</span></div><div><strong>${state.streak}</strong><span>Final streak</span></div><div><strong>${avgClues}</strong><span>Avg. clues</span></div>`;
  announce("Session complete. Results are ready.");
}

function populateDebugControls() {
  $("#force-target").innerHTML = `<option value="">Random</option>${structures.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}`;
  $("#force-clue").innerHTML = `<option value="">Random</option>${Object.entries(CATEGORY_LABELS).map(([id,label]) => `<option value="${id}">${label}</option>`).join("")}`;
}

function bindEvents() {
  wireSelectable("#mode-options"); wireSelectable("#difficulty-options"); wireSelectable("#zone-options");
  $("#mode-options").addEventListener("change", () => { $("#multiplayer-setup").hidden = $("input[name='mode']:checked").value !== "multi"; if (!$("#multiplayer-setup").hidden) renderPlayerInputs(); });
  $("#player-count").addEventListener("change", renderPlayerInputs);
  $("#zone-options").addEventListener("change", (event) => { const whole = $("#zone-options input[value='whole']"); const others = [...document.querySelectorAll("#zone-options input:not([value='whole'])")]; if (event.target === whole && whole.checked) others.forEach((input) => { input.checked = false; input.closest("label").classList.remove("selected"); }); else if (event.target.checked) { whole.checked = false; whole.closest("label").classList.remove("selected"); } if (![whole,...others].some((input) => input.checked)) { whole.checked = true; whole.closest("label").classList.add("selected"); } });
  $("#start-game").addEventListener("click", beginSession); $("#spin-button").addEventListener("click", spin); $("#spin-again").addEventListener("click", () => { $("#spin-button").disabled = false; spin(); }); $("#answer-button").addEventListener("click", revealCandidates);
  $("#board-back").addEventListener("click", goBackBoard); $("#rotation-control").addEventListener("input", updatePlacementRotation); $("#tolerance-toggle").addEventListener("change", updateDebugEvaluation); $("#placed-piece").addEventListener("keydown", movePlacedPiece); $("#check-placement").addEventListener("click", checkPlacement);
  $("#exit-game").addEventListener("click", () => showScreen("setup")); $("#play-again").addEventListener("click", beginSession); $("#back-home").addEventListener("click", () => showScreen("setup"));
  $("#audio-toggle").addEventListener("click", (event) => { muted = !muted; event.currentTarget.setAttribute("aria-pressed", String(muted)); event.currentTarget.setAttribute("aria-label", muted ? "Unmute audio" : "Mute audio"); progress.preferences = { ...(progress.preferences ?? {}), muted }; saveProgress(progress); });
  $("#contrast-toggle").addEventListener("click", (event) => { const on = document.body.classList.toggle("high-contrast"); event.currentTarget.setAttribute("aria-pressed", String(on)); });
  $("#text-toggle").addEventListener("click", (event) => { const on = document.body.classList.toggle("large-text"); event.currentTarget.setAttribute("aria-pressed", String(on)); });
  $("#debug-toggle").addEventListener("click", () => { debug = !debug; renderCurrentBoard(); });
  $("#authoring-start").addEventListener("click", () => { authoring = !authoring; authorPoints = []; $("#authoring-start").textContent = authoring ? "Stop tracing" : "Trace polygon"; $("#authoring-status").textContent = "0 points"; renderCurrentBoard(); });
  $("#authoring-export").addEventListener("click", async () => { const text = JSON.stringify(authorPoints); try { await navigator.clipboard.writeText(text); $("#authoring-status").textContent = "Copied"; } catch { $("#authoring-status").textContent = text; } });
}

async function init() {
  try { const content = await loadContent(); structures = content.structures; boards = content.boards; }
  catch (error) { $("#setup-card").innerHTML = `<h2>Content unavailable</h2><p>${error.message}</p>`; return; }
  bindEvents(); renderPlayerInputs(); populateDebugControls(); $("#audio-toggle").setAttribute("aria-pressed", String(muted)); document.body.classList.toggle("reduced-motion", matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (debug) $("#debug-toggle").setAttribute("aria-pressed", "true");
}

init();
