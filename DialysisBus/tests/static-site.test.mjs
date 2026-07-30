import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("root index is a self-contained local entry point", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");

  assert.match(html, /<title>Dialysis &amp; Transit Explorer<\/title>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.match(html, /Explore the space between care and transit\./);
  assert.match(html, /Straight-line distance is context/);
  assert.match(html, /Dialysis &amp; transit workspace/);
  assert.doesNotMatch(html, /No network or source data loaded/);
  assert.match(html, /Preview counts are illustrative, not source data\./);
  assert.doesNotMatch(html, /https?:\/\//);

  await Promise.all([
    access(new URL("styles.css", root)),
    access(new URL("app.js", root)),
  ]);
});

test("local script includes the required shell interactions", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");

  assert.match(script, /setActiveTab/);
  assert.match(script, /updateLayerState/);
  assert.match(script, /selectRadius/);
  assert.match(script, /selectState/);
  assert.match(script, /workspace--panel-closed/);
});
