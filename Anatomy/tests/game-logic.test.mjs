import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { buildCandidateTray, selectTarget } from "../public/js/game-engine.js";
import { availableClues, drawClue } from "../public/js/spinner.js";
import { calculateScore } from "../public/js/scoring.js";
import { evaluatePlacement } from "../public/js/placement.js";
import { nextTurn } from "../public/js/multiplayer.js";

const data = JSON.parse(await readFile(new URL("../public/data/structures.json", import.meta.url), "utf8"));
const structures = data.structures;

test("target selection respects zones and avoids recent targets", () => {
  const picked = selectTarget(structures, ["arm"], ["biceps-brachii"], () => 0);
  assert.equal(picked.zone, "arm"); assert.notEqual(picked.id, "biceps-brachii");
});

test("candidate tray contains exactly one target and the difficulty count", () => {
  const target = structures[0]; const tray = buildCandidateTray(target, structures, "intermediate", () => .2);
  assert.equal(tray.length, 5); assert.equal(tray.filter((item) => item.id === target.id).length, 1);
});

test("spinner only offers authored unused clues and removes the drawn category", () => {
  const target = structures.find((item) => item.id === "biceps-brachii");
  const clue = drawClue(target, [], "novice", () => 0); assert.ok(target.clues[clue.category]);
  assert.ok(!availableClues(target, [clue.category], "novice").includes(clue.category));
});

test("scoring rewards precision and subtracts additional clues", () => {
  assert.equal(calculateScore({ cluesUsed: 1, placement: "perfect", orientationDifference: 0 }), 150);
  assert.equal(calculateScore({ cluesUsed: 3, placement: "correct", orientationDifference: 0 }), 110);
  assert.ok(calculateScore({ correctCandidate: false, placement: "incorrect-region", candidateMistakes: 1, placementMistakes: 1 }) >= 0);
});

test("placement reports perfect, orientation error, and near miss", () => {
  const target = structures.find((item) => item.id === "heart");
  const perfect = evaluatePlacement(target, { ...target.target, rotation: target.idealRotation }); assert.equal(perfect.status, "perfect");
  const rotated = evaluatePlacement(target, { ...target.target, rotation: 90 }); assert.equal(rotated.status, "incorrect-orientation");
  const near = evaluatePlacement(target, { x: target.target.x + target.target.radius * 1.45, y: target.target.y, rotation: target.idealRotation }); assert.equal(near.status, "near-miss");
});

test("multiplayer turns wrap and steal attempts pass to the next player", () => {
  assert.equal(nextTurn(2, 3, false, true), 0); assert.equal(nextTurn(0, 3, true, false), 1); assert.equal(nextTurn(0, 1, true, false), 0);
});
