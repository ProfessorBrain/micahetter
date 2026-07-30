import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("root index is a local entry point with live-map setup", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");

  assert.match(html, /<title>Dialysis &amp; Transit Explorer<\/title>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.match(html, /Explore the space between care and transit\./);
  assert.match(html, /Straight-line distance is context/);
  assert.match(html, /id="google-map"/);
  assert.match(html, /Connect the actual Google map/);
  assert.match(html, /id="map-api-key"/);
  assert.match(html, /id="map-id"/);
  assert.match(html, /id="forget-map-key"/);
  assert.doesNotMatch(html, /No network or source data loaded/);
  assert.doesNotMatch(html, /class="map-preview"/);
  assert.match(html, /Source-backed facility and stop layers are pending\./);
  assert.doesNotMatch(html, /<(?:script|link)[^>]+https?:\/\//);

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
  assert.match(script, /maps\.googleapis\.com\/maps\/api\/js/);
  assert.match(script, /google\.maps\.importLibrary\("maps"\)/);
  assert.match(script, /google\.maps\.importLibrary\("geocoding"\)/);
  assert.match(script, /window\.localStorage/);
  assert.match(script, /geocoder\.geocode/);
  assert.match(script, /googleMap\.panTo/);
});
