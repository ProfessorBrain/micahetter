import { DIFFICULTIES } from "./game-engine.js";

export const CATEGORY_LABELS = {
  name: "Structure name", function: "Function", dysfunction: "Dysfunction if injured", origin: "Origin", insertion: "Insertion", innervation: "Innervation", bloodSupply: "Blood supply", histology: "Histology", substance: "Substance produced", anatomicalRelationship: "Anatomical relationship", development: "Developmental origin", imaging: "Imaging appearance", clinical: "Clinical vignette", surfaceLandmark: "Surface landmark", pathway: "Pathway role"
};

export function availableClues(target, used = [], difficulty = "novice") {
  const authored = Object.keys(target?.clues ?? {});
  const preferred = DIFFICULTIES[difficulty]?.categories ?? authored;
  const preferredAvailable = preferred.filter((category) => authored.includes(category) && !used.includes(category));
  return preferredAvailable.length ? preferredAvailable : authored.filter((category) => !used.includes(category));
}

export function drawClue(target, used = [], difficulty = "novice", random = Math.random, forcedCategory = "") {
  const categories = availableClues(target, used, difficulty);
  if (!categories.length) return null;
  const category = forcedCategory && categories.includes(forcedCategory) ? forcedCategory : categories[Math.floor(random() * categories.length)];
  return { category, label: CATEGORY_LABELS[category] ?? category, text: target.clues[category] };
}
