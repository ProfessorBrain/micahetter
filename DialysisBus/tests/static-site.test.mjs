import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

test("root entry point contains the complete explorer surfaces", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");

  assert.match(html, /<title>Dialysis &amp; Transit Explorer<\/title>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/config\.js"/);
  assert.match(html, /src="\.\/public-data\.js"/);
  assert.match(html, /src="\.\/sample-data\.js"/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.match(html, /id="google-map"/);
  assert.match(html, /id="panel-layers"/);
  assert.match(html, /id="panel-filters"/);
  assert.match(html, /id="panel-analytics"/);
  assert.match(html, /id="panel-methods"/);
  assert.match(html, /id="custom-radius"/);
  assert.match(html, /id="facility-table"/);
  assert.match(html, /id="facility-detail"/);
  assert.match(html, /id="stop-detail"/);
  assert.match(html, /id="export-csv"/);
  assert.match(html, /id="current-location"/);
  assert.match(html, /list="facility-location-suggestions"/);
  assert.match(html, /id="facility-location-suggestions"/);
  assert.match(html, /Public-source snapshot/);
  assert.match(html, /Three closest per visible facility · zoom 10\+/);
  assert.match(html, /Closest 3 in radius/);
  assert.doesNotMatch(html, /available after data load/i);
  assert.doesNotMatch(html, /filters are staged/i);
  assert.doesNotMatch(html, /analytics need a validated snapshot/i);
  assert.doesNotMatch(html, /<(?:script|link)[^>]+https?:\/\//);

  await Promise.all(
    [
      "accessibility.html",
      "app.js",
      "config.js",
      "data/source-manifest.json",
      "privacy.html",
      "public-data.js",
      "sample-data.js",
      "scripts/build-public-data.mjs",
      "styles.css",
      "terms.html",
    ].map((path) => access(new URL(path, root))),
  );
});

test("demonstration dataset is deterministic, multi-state, and explicit", async () => {
  const source = await readFile(new URL("sample-data.js", root), "utf8");
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context);
  const data = context.window.DIALYSIS_TRANSIT_SAMPLE_DATA;

  assert.equal(data.metadata.mode, "demonstration");
  assert.match(data.metadata.notice, /fictional/i);
  assert.ok(data.facilities.length >= 18);
  assert.ok(data.stops.length >= 20);

  const ccns = data.facilities.map((facility) => facility.ccn);
  assert.equal(new Set(ccns).size, ccns.length);
  assert.deepEqual(
    [...new Set(data.facilities.map((facility) => facility.state))].sort(),
    ["AZ", "CA", "CO", "FL", "IL", "NY", "TX"],
  );
  assert.ok(
    data.facilities.some((facility) => facility.geocodeStatus === "no_match"),
  );
  assert.ok(
    data.facilities.every((facility) =>
      facility.name.includes("demonstration"),
    ),
  );
});

test("published dataset supplies nationwide CMS facility coverage", async () => {
  const [source, manifestSource] = await Promise.all([
    readFile(new URL("public-data.js", root), "utf8"),
    readFile(new URL("data/source-manifest.json", root), "utf8"),
  ]);
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context);
  const data = context.window.DIALYSIS_TRANSIT_PUBLIC_DATA;
  const manifest = JSON.parse(manifestSource);

  assert.equal(data.metadata.mode, "public_snapshot");
  assert.ok(data.facilities.length >= 7000);
  assert.ok(data.metadata.geocodedFacilityCount >= 6000);
  assert.equal(
    data.metadata.facilityCount,
    data.facilities.length,
  );
  assert.equal(manifest.cms.records, data.facilities.length);
  assert.match(manifest.transit.selection, /three closest eligible stops/i);
  assert.equal(
    manifest.censusGeocoder.matchedRecords,
    data.metadata.geocodedFacilityCount,
  );
  assert.ok(
    new Set(data.facilities.map((facility) => facility.state)).size >=
      50,
  );
  assert.equal(
    new Set(data.facilities.map((facility) => facility.ccn)).size,
    data.facilities.length,
  );
  assert.ok(
    data.facilities.some(
      (facility) =>
        facility.state === "AZ" &&
        facility.city === "TUCSON" &&
        Number.isFinite(facility.lat) &&
        Number.isFinite(facility.lng),
    ),
  );
});

test("client script implements every anticipated local workflow", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");

  for (const expected of [
    "distanceMeters",
    "percentile",
    "calculateResults",
    "renderDistribution",
    "renderTable",
    "selectFacility",
    "selectStop",
    "updateSelectionOverlays",
    "AdvancedMarkerElement",
    "loadTransitStopsForViewport",
    "selectClosestStopsForFacilities",
    "CLOSEST_STOPS_PER_FACILITY",
    "closestStopIdsByFacility",
    "NTAD_National_Transit_Map_Stops",
    "TRANSIT_RECORD_LIMIT",
    'importLibrary("maps")',
    'importLibrary("marker")',
    'importLibrary("places")',
    "geocoder.geocode",
    "navigator.geolocation.getCurrentPosition",
    "serializeState",
    "restoreStateFromUrl",
    "copyViewLink",
    "exportCsv",
    "populateLocationSuggestions",
    "Blob",
    "formula",
  ]) {
    if (expected === "formula") {
      assert.match(script, /\^\[=\+\\\-@\]/);
    } else {
      assert.ok(script.includes(expected), `missing ${expected}`);
    }
  }

  assert.match(script, /maps\.googleapis\.com\/maps\/api\/js/);
  assert.match(
    script,
    /nextRadius < 100 \|\| nextRadius > 5000/,
  );
  assert.match(script, /dialysis-transit-explorer_\$\{date\}/);
  assert.match(script, /DATA\.metadata\.mode/);
  assert.match(script, /parameters\.has\("lat"\)/);
  assert.match(script, /googlePlacesAutocomplete/);
  assert.match(script, /\.slice\(0, limit\)/);
  assert.match(script, /closest_3_stops_within_threshold/);
});

test("closest-stop selection keeps three per facility and deduplicates shared stops", async () => {
  const source = await readFile(new URL("app.js", root), "utf8");
  const context = vm.createContext({
    AbortController,
    Blob,
    URL,
    URLSearchParams,
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
    },
    navigator: {},
    window: {
      DIALYSIS_TRANSIT_DISABLE_AUTO_INIT: true,
      DIALYSIS_TRANSIT_SAMPLE_DATA: {
        facilities: [],
        metadata: { mode: "demonstration" },
        stops: [],
      },
    },
  });
  vm.runInContext(source, context);
  const selectClosestStops =
    context.window.DialysisTransitExplorer.selectClosestStopsForFacilities;
  const facilities = [
    { ccn: "A", lat: 0, lng: 0 },
    { ccn: "B", lat: 0, lng: 0.0045 },
  ];
  const candidateStops = [0.001, 0.002, 0.003, 0.004, 0.005].map(
    (lng, index) => ({ id: `stop-${index + 1}`, lat: 0, lng }),
  );

  const selection = selectClosestStops(facilities, candidateStops);

  assert.equal(selection.stopIdsByFacility.get("A").length, 3);
  assert.equal(selection.stopIdsByFacility.get("B").length, 3);
  assert.equal(selection.stops.length, 5);
  assert.equal(
    selection.stops.find((stop) => stop.id === "stop-3").relatedFacilityCount,
    2,
  );
});

test("public map configuration exposes the explicit demo integration switch", async () => {
  const config = await readFile(new URL("config.js", root), "utf8");

  assert.match(config, /googleMapsApiKey:\s*"AIza/);
  assert.match(config, /googlePlacesAutocomplete:\s*false/);
});

test("policy pages preserve the required limitations", async () => {
  const [accessibility, privacy, terms] = await Promise.all([
    readFile(new URL("accessibility.html", root), "utf8"),
    readFile(new URL("privacy.html", root), "utf8"),
    readFile(new URL("terms.html", root), "utf8"),
  ]);

  assert.match(accessibility, /table equivalents/i);
  assert.match(privacy, /does not save or transmit/i);
  assert.match(terms, /Straight-line proximity does not establish/i);
  assert.match(terms, /public CMS facility records/i);
});
