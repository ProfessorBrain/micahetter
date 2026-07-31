import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

test("root entry point contains the complete explorer surfaces", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
  ]);

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
  assert.match(html, /<dialog[^>]+id="methods-dialog"/s);
  assert.match(html, /id="methods-dialog-close"/);
  assert.match(html, /id="settings-shortcut"/);
  assert.match(html, /<dialog[^>]+id="settings-dialog"/s);
  assert.match(html, /id="settings-dialog-close"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.doesNotMatch(html, /class="demo-status"/);
  assert.doesNotMatch(html, /Public data snapshot/);
  assert.doesNotMatch(html, /id="snapshot-readout"/);
  assert.doesNotMatch(html, /id="map-connection-status"/);
  assert.doesNotMatch(html, /Google Maps connected/);
  assert.doesNotMatch(html, /id="analyze-viewport"/);
  assert.doesNotMatch(html, /Analyze current map/);
  assert.doesNotMatch(html, /id="copy-view-link"/);
  assert.doesNotMatch(html, /Copy view link/);
  assert.doesNotMatch(html, /Threshold circle/i);
  assert.doesNotMatch(html, /data-selection-layer="circle"/);
  assert.doesNotMatch(html, /id="panel-methods"/);
  assert.doesNotMatch(html, /data-tab="methods"/);
  assert.match(html, /id="custom-radius"/);
  assert.match(html, /id="facility-table"/);
  assert.match(html, /id="facility-detail"/);
  assert.match(html, /id="stop-detail"/);
  assert.match(html, /id="export-csv"/);
  assert.match(html, /id="current-location"/);
  assert.doesNotMatch(html, /id="location-form"/);
  assert.doesNotMatch(html, /id="location-search"/);
  assert.doesNotMatch(html, /Public-source snapshot/);
  assert.doesNotMatch(html, /Facilities come from CMS and the Census Geocoder/);
  assert.match(html, /Three closest per visible facility · zoom 10\+/);
  assert.match(html, /Closest 3 in radius/);
  assert.match(html, /data-layer-toggle="centerDistanceHeatmap"/);
  assert.match(html, /id="center-distance-heatmap-legend"/);
  assert.match(html, /name="heatmap-scale-mode"/);
  assert.match(html, /value="relative"/);
  assert.match(html, /value="meters"/);
  assert.match(html, /id="heatmap-meter-range-form"/);
  assert.match(html, /data-heatmap-break="3"/);
  const layersPanel = html.match(
    /<section[^>]+id="panel-layers"[\s\S]*?<\/section>/,
  )?.[0];
  const settingsDialog = html.match(
    /<dialog[^>]+id="settings-dialog"[\s\S]*?<\/dialog>/,
  )?.[0];
  const methodsDialog = html.match(
    /<dialog[^>]+id="methods-dialog"[\s\S]*?<\/dialog>/,
  )?.[0];
  assert.ok(layersPanel);
  assert.ok(settingsDialog);
  assert.ok(methodsDialog);
  const heatmapToggle = layersPanel.match(
    /<input[^>]+data-layer-toggle="centerDistanceHeatmap"[^>]*>/,
  )?.[0];
  assert.ok(heatmapToggle);
  assert.match(heatmapToggle, /checked/);
  assert.match(layersPanel, /heatmap-scale-settings--sidebar/);
  assert.match(layersPanel, /name="heatmap-scale-mode"/);
  assert.doesNotMatch(layersPanel, /id="heatmap-meter-range-form"/);
  assert.match(settingsDialog, /heatmap-scale-settings/);
  assert.match(settingsDialog, /id="heatmap-meter-range-form"/);
  assert.match(settingsDialog, /id="heatmap-reset-meter-ranges"/);
  assert.match(settingsDialog, /Reset defaults/);
  assert.doesNotMatch(settingsDialog, /name="heatmap-scale-mode"/);
  assert.match(methodsDialog, /id="methods-accessibility-title"/);
  assert.match(methodsDialog, /id="methods-privacy-title"/);
  assert.match(methodsDialog, /id="methods-terms-title"/);
  assert.match(methodsDialog, /No care or transportation advice/);
  assert.doesNotMatch(methodsDialog, /Browser storage/);
  assert.doesNotMatch(methodsDialog, /Permitted use/);
  assert.doesNotMatch(methodsDialog, /class="policy-links"/);
  assert.doesNotMatch(html, /href="\.\/accessibility\.html"/);
  assert.doesNotMatch(html, /href="\.\/privacy\.html"/);
  assert.doesNotMatch(html, /href="\.\/terms\.html"/);
  assert.match(html, /id="filter-stop-query"/);
  assert.match(html, /id="filter-within-radius"/);
  assert.match(html, /id="reset-transit-filters"/);
  assert.match(html, /id="transit-filter-count" role="status"/);
  assert.match(html, /Agency \/ NTD ID/);
  assert.match(html, /Relative or fixed meter bands from green to red/);
  assert.match(html, /Very short/);
  assert.match(html, /Very long/);
  assert.match(styles, /#86a850 20% 40%/);
  assert.match(styles, /#dd8344 60% 80%/);
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
    "openMethodsDialog",
    "closeMethodsDialog",
    "openSettingsDialog",
    "closeSettingsDialog",
    "renderDistribution",
    "renderTable",
    "selectFacility",
    "selectStop",
    "updateSelectionOverlays",
    "AdvancedMarkerElement",
    "loadTransitStopsForViewport",
    "calculateNearestFacilityDistances",
    "applyHeatmapScale",
    "heatmapBandIndexForDistance",
    "validateHeatmapMeterBreaks",
    "resetHeatmapMeterRanges",
    "heatmapColor",
    "createCenterDistanceHeatmapOverlay",
    "centerDistanceHeatmap",
    "fromLatLngToDivPixel",
    "selectClosestStopsForFacilities",
    "stopMatchesTransitFilters",
    "CLOSEST_STOPS_PER_FACILITY",
    "closestStopIdsByFacility",
    "NTAD_National_Transit_Map_Stops",
    "TRANSIT_RECORD_LIMIT",
    'importLibrary("maps")',
    'importLibrary("marker")',
    "navigator.geolocation.getCurrentPosition",
    "serializeState",
    "restoreStateFromUrl",
    "exportCsv",
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
  assert.match(script, /gestureHandling: "greedy"/);
  assert.doesNotMatch(script, /gestureHandling: "cooperative"/);
  assert.match(
    script,
    /nextRadius < 100 \|\| nextRadius > 5000/,
  );
  assert.match(script, /dialysis-transit-explorer_\$\{date\}/);
  assert.match(script, /DATA\.metadata\.mode/);
  assert.match(script, /parameters\.has\("lat"\)/);
  assert.doesNotMatch(script, /googlePlacesAutocomplete/);
  assert.doesNotMatch(script, /location-search/);
  assert.doesNotMatch(script, /geocoder\.geocode/);
  assert.match(script, /\.slice\(0, limit\)/);
  assert.match(script, /closest_3_stops_within_threshold/);
  assert.match(
    script,
    /centerDistanceHeatmap: true/,
  );
  assert.match(
    script,
    /parameters\.set\("heatmap", "off"\)/,
  );
  assert.match(
    script,
    /parameters\.get\("heatmap"\) !== "off"/,
  );
  assert.match(script, /parameters\.set\("heatmapScale", "meters"\)/);
  assert.match(script, /"heatmapBreaks"/);
  assert.match(script, /parameters\.set\("withinRadius", "yes"\)/);
  assert.match(script, /transit_stop_name_or_id_filter/);
  assert.match(script, /methodsDialog\.showModal\(\)/);
  assert.match(script, /methodsDialogTrigger\.focus\(\)/);
  assert.match(script, /settingsDialog\.showModal\(\)/);
  assert.match(script, /settingsDialogTrigger\.focus\(\)/);
  assert.doesNotMatch(
    script,
    /The Google basemap and nationwide CMS facility snapshot are ready/,
  );
  assert.doesNotMatch(script, /#snapshot-readout/);
  assert.doesNotMatch(script, /google\.maps\.Circle/);
  assert.doesNotMatch(script, /selectionLayers\.circle/);
  assert.doesNotMatch(script, /setConnectionStatus/);
  assert.doesNotMatch(script, /Google Maps connected/);
  assert.doesNotMatch(script, /#analyze-viewport/);
  assert.doesNotMatch(script, /Analytics now use the current map viewport/);
  assert.doesNotMatch(script, /copyViewLink/);
  assert.doesNotMatch(script, /navigator\.clipboard/);
});

test("spatial calculations keep closest stops and center distances correct", async () => {
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
  const explorer = context.window.DialysisTransitExplorer;
  const selectClosestStops = explorer.selectClosestStopsForFacilities;
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
  const radiusLimitedSelection = selectClosestStops(
    [facilities[0]],
    candidateStops,
    3,
    150,
  );
  assert.deepEqual(
    Array.from(radiusLimitedSelection.stopIdsByFacility.get("A")),
    ["stop-1"],
  );
  const candidateStop = {
    agency: "NTD 123",
    name: "Central Station",
    ntdId: "123",
    objectId: "77",
    stopId: "CENTRAL-1",
    type: "Rail station",
    wheelchair: "Indicated accessible",
  };
  const transitFilters = {
    agency: "NTD 123",
    stopQuery: "central-1",
    stopType: "Rail station",
    wheelchair: "Indicated accessible",
  };
  assert.equal(
    explorer.stopMatchesTransitFilters(candidateStop, transitFilters),
    true,
  );
  assert.equal(
    explorer.stopMatchesTransitFilters(candidateStop, {
      ...transitFilters,
      stopQuery: "missing stop",
    }),
    false,
  );

  const heatmapSummary = explorer.calculateNearestFacilityDistances([
    { ccn: "A", lat: 0, lng: 0, name: "A" },
    { ccn: "B", lat: 0, lng: 0.01, name: "B" },
    { ccn: "C", lat: 0, lng: 0.05, name: "C" },
  ]);
  const firstPoint = heatmapSummary.points.find((point) => point.ccn === "A");
  const isolatedPoint = heatmapSummary.points.find(
    (point) => point.ccn === "C",
  );
  assert.equal(heatmapSummary.points.length, 3);
  assert.ok(firstPoint.nearestDistance > 1100);
  assert.ok(firstPoint.nearestDistance < 1120);
  assert.ok(isolatedPoint.nearestDistance > firstPoint.nearestDistance * 3);
  assert.equal(firstPoint.normalizedDistance, 0);
  assert.equal(isolatedPoint.normalizedDistance, 1);
  assert.deepEqual(Array.from(explorer.heatmapColor(0.1)), [25, 135, 84]);
  assert.deepEqual(Array.from(explorer.heatmapColor(0.3)), [134, 168, 80]);
  assert.deepEqual(Array.from(explorer.heatmapColor(0.5)), [242, 201, 76]);
  assert.deepEqual(Array.from(explorer.heatmapColor(0.7)), [221, 131, 68]);
  assert.deepEqual(Array.from(explorer.heatmapColor(0.9)), [200, 60, 60]);
  assert.deepEqual(
    Array.from(explorer.validateHeatmapMeterBreaks([1000, 2000, 3000, 4000])),
    [1000, 2000, 3000, 4000],
  );
  assert.equal(
    explorer.validateHeatmapMeterBreaks([1000, 900, 3000, 4000]),
    null,
  );
  assert.equal(
    explorer.heatmapBandIndexForDistance(2000, [1000, 2000, 3000, 4000]),
    1,
  );
  assert.equal(
    explorer.heatmapBandIndexForDistance(4001, [1000, 2000, 3000, 4000]),
    4,
  );
  const meterSummary = explorer.applyHeatmapScale(
    heatmapSummary,
    "meters",
    [1000, 2000, 3000, 4000],
  );
  assert.equal(
    meterSummary.points.find((point) => point.ccn === "A").normalizedDistance,
    0.3,
  );
  assert.equal(
    meterSummary.points.find((point) => point.ccn === "C").normalizedDistance,
    0.9,
  );
});

test("public map configuration obfuscates the demo key without breaking startup", async () => {
  const config = await readFile(new URL("config.js", root), "utf8");
  const context = {
    window: {
      atob: (value) => Buffer.from(value, "base64").toString("utf8"),
    },
  };

  assert.doesNotMatch(config, /googleMapsApiKey:\s*"AIza/);
  assert.match(config, /window\.atob\(encodedMapKey\)/);
  assert.doesNotMatch(config, /googlePlacesAutocomplete/);
  vm.createContext(context);
  vm.runInContext(config, context);
  assert.match(
    context.window.DIALYSIS_TRANSIT_CONFIG.googleMapsApiKey,
    /^AIza[0-9A-Za-z_-]+$/,
  );
});

test("policy pages preserve the required limitations", async () => {
  const [accessibility, privacy, terms] = await Promise.all([
    readFile(new URL("accessibility.html", root), "utf8"),
    readFile(new URL("privacy.html", root), "utf8"),
    readFile(new URL("terms.html", root), "utf8"),
  ]);

  assert.match(accessibility, /table equivalents/i);
  assert.match(accessibility, /Settings and Data &amp; Methods open as modal dialogs/i);
  assert.match(accessibility, /heatmap is optional and supplementary/i);
  assert.match(privacy, /does not save or transmit/i);
  assert.match(terms, /Straight-line proximity does not establish/i);
  assert.match(terms, /public CMS facility records/i);
});
