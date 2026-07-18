import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships product metadata and the complete static game surface", async () => {
  const [page, layout, app] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("public/js/app.js", root), "utf8")
  ]);
  assert.match(layout, /Critical Structures/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.match(page, /id="spinner"/);
  assert.match(page, /id="candidate-tray"/);
  assert.match(page, /id="anatomy-board"/);
  assert.match(page, /id="debug-panel"/);
  assert.match(app, /localStorage|recordPerformance|saveProgress/);
});

test("scaffolds all seven required anatomy zones with two structures each", async () => {
  const data = JSON.parse(await readFile(new URL("public/data/structures.json", root), "utf8"));
  const zones = ["face", "arm", "leg", "neck-back", "neuro", "thorax", "abdomen-pelvis"];
  for (const zone of zones) assert.ok(data.structures.filter((item) => item.zone === zone).length >= 2, `${zone} needs two structures`);
  assert.equal(data.reviewStatus, "provisional-pending-anatomy-educator-review");
});
