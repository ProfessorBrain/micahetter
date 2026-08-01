import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EARTH_RADIUS_METERS = 6371008.8;
const GRID_CELL_DEGREES = 0.25;
const TRANSIT_PAGE_SIZE = 16000;
const TRANSIT_QUERY_URL =
  "https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0/query";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDataPath = path.join(root, "public-data.js");
const manifestPath = path.join(root, "data", "source-manifest.json");

function radians(value) {
  return (value * Math.PI) / 180;
}

function distanceMeters(first, second) {
  const latitudeDelta = radians(second.lat - first.lat);
  const longitudeDelta = radians(second.lng - first.lng);
  const firstLatitude = radians(first.lat);
  const secondLatitude = radians(second.lat);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

function gridCoordinate(value) {
  return Math.floor(value / GRID_CELL_DEGREES);
}

function gridKey(latitudeCell, longitudeCell) {
  return `${latitudeCell}:${longitudeCell}`;
}

async function queryTransitService(parameters, attempt = 1) {
  try {
    const response = await fetch(TRANSIT_QUERY_URL, {
      body: new URLSearchParams(parameters),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const payload = await response.json();
    if (payload.error) {
      throw new Error(
        `${payload.error.code || "BTS"}: ${payload.error.message || "query failed"}`,
      );
    }
    return payload;
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    return queryTransitService(parameters, attempt + 1);
  }
}

async function fetchTransitStopGrid(log) {
  const countPayload = await queryTransitService({
    f: "json",
    returnCountOnly: "true",
    where: "1=1",
  });
  const expectedCount = Number(countPayload.count) || 0;
  const offsets = [];
  for (let offset = 0; offset < expectedCount; offset += TRANSIT_PAGE_SIZE) {
    offsets.push(offset);
  }

  const grid = new Map();
  let loadedCount = 0;
  let snapshotDate = "";
  for (let batchStart = 0; batchStart < offsets.length; batchStart += 4) {
    const pages = await Promise.all(
      offsets.slice(batchStart, batchStart + 4).map((offset) =>
        queryTransitService({
          f: "json",
          orderByFields: "OBJECTID ASC",
          outFields: "OBJECTID,stop_lat,stop_lon,download_date",
          resultOffset: String(offset),
          resultRecordCount: String(TRANSIT_PAGE_SIZE),
          resultType: "standard",
          returnGeometry: "false",
          where: "1=1",
        }),
      ),
    );

    pages.forEach((payload) => {
      (payload.features || []).forEach((feature) => {
        const attributes = feature.attributes || {};
        const lat = Number(attributes.stop_lat);
        const lng = Number(attributes.stop_lon);
        const objectId = Number(attributes.OBJECTID);
        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng) ||
          !Number.isFinite(objectId)
        ) {
          return;
        }
        const key = gridKey(gridCoordinate(lat), gridCoordinate(lng));
        const cell = grid.get(key) || [];
        cell.push({ lat, lng, objectId });
        grid.set(key, cell);
        loadedCount += 1;
        const recordDate = String(attributes.download_date || "").slice(0, 10);
        if (recordDate > snapshotDate) snapshotDate = recordDate;
      });
    });
    log(
      `BTS stop coordinates: ${loadedCount.toLocaleString()} of ${expectedCount.toLocaleString()}`,
    );
  }

  return { grid, snapshotDate, stopCount: loadedCount };
}

function nearestStopFromGrid(facility, grid) {
  const latitudeCell = gridCoordinate(facility.lat);
  const longitudeCell = gridCoordinate(facility.lng);
  let nearest = null;
  const scannedCells = new Set();

  const scanCell = (latCell, lngCell) => {
    const key = gridKey(latCell, lngCell);
    if (scannedCells.has(key)) return;
    scannedCells.add(key);
    (grid.get(key) || []).forEach((stop) => {
      const distance = distanceMeters(facility, stop);
      if (!nearest || distance < nearest.distanceMeters) {
        nearest = { ...stop, distanceMeters: distance };
      }
    });
  };

  for (let ring = 0; !nearest && ring <= 720; ring += 1) {
    for (let offset = -ring; offset <= ring; offset += 1) {
      scanCell(latitudeCell - ring, longitudeCell + offset);
      scanCell(latitudeCell + ring, longitudeCell + offset);
      scanCell(latitudeCell + offset, longitudeCell - ring);
      scanCell(latitudeCell + offset, longitudeCell + ring);
    }
  }
  if (!nearest) return null;

  const latitudeRadius =
    (nearest.distanceMeters / EARTH_RADIUS_METERS) * (180 / Math.PI);
  const maximumLatitude = Math.min(
    89.9,
    Math.abs(facility.lat) + latitudeRadius,
  );
  const longitudeRadius = Math.min(
    180,
    latitudeRadius / Math.max(0.01, Math.cos(radians(maximumLatitude))),
  );
  const minimumLatitudeCell = gridCoordinate(facility.lat - latitudeRadius);
  const maximumLatitudeCell = gridCoordinate(facility.lat + latitudeRadius);
  const minimumLongitudeCell = gridCoordinate(facility.lng - longitudeRadius);
  const maximumLongitudeCell = gridCoordinate(facility.lng + longitudeRadius);

  for (
    let latCell = minimumLatitudeCell;
    latCell <= maximumLatitudeCell;
    latCell += 1
  ) {
    for (
      let lngCell = minimumLongitudeCell;
      lngCell <= maximumLongitudeCell;
      lngCell += 1
    ) {
      scanCell(latCell, lngCell);
    }
  }
  return nearest;
}

async function fetchSelectedStopDetails(objectIds) {
  const details = new Map();
  const ids = [...objectIds];
  for (let offset = 0; offset < ids.length; offset += 1000) {
    const payload = await queryTransitService({
      f: "json",
      objectIds: ids.slice(offset, offset + 1000).join(","),
      outFields:
        "OBJECTID,ntd_id,stop_id,stop_name,stop_lat,stop_lon,stop_type_text,wheelchair_boarding,download_date",
      returnGeometry: "false",
      where: "1=1",
    });
    (payload.features || []).forEach((feature) => {
      const attributes = feature.attributes || {};
      details.set(Number(attributes.OBJECTID), attributes);
    });
  }
  return details;
}

export async function buildNationwideTransitSnapshot(facilities, log = () => {}) {
  const { grid, snapshotDate, stopCount } = await fetchTransitStopGrid(log);
  const nearestByCcn = new Map();
  const selectedObjectIds = new Set();

  facilities.forEach((facility) => {
    if (!Number.isFinite(facility.lat) || !Number.isFinite(facility.lng)) {
      return;
    }
    const nearest = nearestStopFromGrid(facility, grid);
    if (!nearest) return;
    nearestByCcn.set(facility.ccn, nearest);
    selectedObjectIds.add(nearest.objectId);
  });
  log(
    `Nearest BTS stops calculated for ${nearestByCcn.size.toLocaleString()} facilities`,
  );

  const stopDetails = await fetchSelectedStopDetails(selectedObjectIds);
  const enrichedFacilities = facilities.map((facility) => {
    const nearest = nearestByCcn.get(facility.ccn);
    if (!nearest) return facility;
    const details = stopDetails.get(nearest.objectId) || {};
    return {
      ...facility,
      nearestTransit: {
        distanceMeters: Number(nearest.distanceMeters.toFixed(3)),
        lat: nearest.lat,
        lng: nearest.lng,
        name: details.stop_name || "Unnamed transit stop",
        ntdId: details.ntd_id || "",
        objectId: String(nearest.objectId),
        snapshotDate: details.download_date || snapshotDate,
        stopId: details.stop_id || "",
        type: details.stop_type_text || "Transit stop",
        wheelchair: String(details.wheelchair_boarding || ""),
      },
    };
  });

  return {
    facilities: enrichedFacilities,
    facilityCount: nearestByCcn.size,
    snapshotDate,
    stopCount,
  };
}

function parsePublicDataset(source) {
  const match = source.match(
    /^window\.DIALYSIS_TRANSIT_PUBLIC_DATA=(.*);\s*$/s,
  );
  if (!match) throw new Error("public-data.js has an unexpected format");
  return JSON.parse(match[1]);
}

async function refreshCurrentSnapshot() {
  const [source, manifestSource] = await Promise.all([
    readFile(publicDataPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const dataset = parsePublicDataset(source);
  const transit = await buildNationwideTransitSnapshot(
    dataset.facilities,
    console.log,
  );
  dataset.facilities = transit.facilities;
  dataset.metadata.transitSnapshotDate = transit.snapshotDate;
  dataset.metadata.transitHeatmapFacilityCount = transit.facilityCount;
  dataset.metadata.transitHeatmapStopCount = transit.stopCount;

  const manifest = JSON.parse(manifestSource);
  manifest.generatedAt = new Date().toISOString();
  manifest.transit = {
    ...manifest.transit,
    mode: "nationwide nearest-stop snapshot plus runtime viewport query",
    nearestStopFacilityRecords: transit.facilityCount,
    snapshotDate: transit.snapshotDate,
    stopRecordsEvaluated: transit.stopCount,
  };

  await Promise.all([
    writeFile(
      publicDataPath,
      `window.DIALYSIS_TRANSIT_PUBLIC_DATA=${JSON.stringify(dataset)};\n`,
      "utf8",
    ),
    writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  ]);
  console.log(
    `Updated ${publicDataPath} with ${transit.facilityCount.toLocaleString()} nationwide nearest-stop metrics`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await refreshCurrentSnapshot();
}
