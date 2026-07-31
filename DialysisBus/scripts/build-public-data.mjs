import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CMS_DATASET_ID = "23ew-n7w9";
const CMS_PAGE_SIZE = 1500;
const CMS_URL =
  `https://data.cms.gov/provider-data/api/1/datastore/query/${CMS_DATASET_ID}/0`;
const CMS_METADATA_URL =
  `https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${CMS_DATASET_ID}`;
const CENSUS_BATCH_URL =
  "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";
const CENSUS_BATCH_SIZE = 1200;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "public-data.js");
const manifestPath = path.join(root, "data", "source-manifest.json");

function csvField(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

async function fetchCmsFacilities() {
  const facilities = [];
  for (let offset = 0; ; offset += CMS_PAGE_SIZE) {
    const url = new URL(CMS_URL);
    url.searchParams.set("limit", String(CMS_PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    const payload = await fetchJson(url);
    const rows = payload.results || [];
    facilities.push(...rows);
    console.log(`CMS records: ${facilities.length}`);
    if (rows.length < CMS_PAGE_SIZE) break;
  }
  return facilities;
}

async function geocodeBatch(records, batchNumber) {
  const csv = records
    .map((record) =>
      [
        record.cms_certification_number_ccn,
        record.address_line_1,
        record.citytown,
        record.state,
        record.zip_code,
      ]
        .map(csvField)
        .join(","),
    )
    .join("\n");
  const form = new FormData();
  form.append(
    "addressFile",
    new Blob([csv], { type: "text/csv" }),
    `dialysis-facilities-${batchNumber}.csv`,
  );
  form.append("benchmark", "Public_AR_Current");
  const response = await fetch(CENSUS_BATCH_URL, {
    body: form,
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(
      `Census batch ${batchNumber} failed: ${response.status} ${response.statusText}`,
    );
  }

  const geocodes = new Map();
  for (const row of parseCsv(await response.text())) {
    const [ccn, , matchStatus, matchType, matchedAddress, coordinatePair] = row;
    const [lngText, latText] = String(coordinatePair || "").split(",");
    const lat = latText?.trim() ? Number(latText) : Number.NaN;
    const lng = lngText?.trim() ? Number(lngText) : Number.NaN;
    geocodes.set(String(ccn), {
      geocodeStatus:
        matchStatus === "Match"
          ? matchType === "Exact"
            ? "exact"
            : "non_exact"
          : "no_match",
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      matchedAddress: matchedAddress || "",
    });
  }
  console.log(`Census batch ${batchNumber}: ${geocodes.size} responses`);
  return geocodes;
}

async function geocodeFacilities(records) {
  const results = new Map();
  for (
    let offset = 0, batchNumber = 1;
    offset < records.length;
    offset += CENSUS_BATCH_SIZE, batchNumber += 1
  ) {
    const batch = records.slice(offset, offset + CENSUS_BATCH_SIZE);
    const geocodes = await geocodeBatch(batch, batchNumber);
    geocodes.forEach((value, key) => results.set(key, value));
  }
  return results;
}

function booleanField(value) {
  return String(value).toLowerCase() === "yes";
}

function ownership(value) {
  if (value === "Profit") return "For-profit";
  if (value === "Non-profit") return "Non-profit";
  return "Government/other";
}

function compactFacility(record, geocode, snapshotDate) {
  const ccn = String(record.cms_certification_number_ccn);
  return {
    ccn,
    name: record.facility_name,
    address: [record.address_line_1, record.address_line_2]
      .filter(Boolean)
      .join(" "),
    city: record.citytown,
    state: record.state,
    zip: String(record.zip_code).slice(0, 5),
    county: record.countyparish,
    telephone: record.telephone_number,
    ownership: ownership(record.profit_or_nonprofit),
    chainOwned: record.chain_owned || "Unknown",
    chain: record.chain_organization || "Independent",
    lateShift: record.late_shift || "Unknown",
    stations: Number(record.of_dialysis_stations) || 0,
    inCenterHd: booleanField(record.offers_incenter_hemodialysis),
    peritonealDialysis: booleanField(
      record.offers_peritoneal_dialysis,
    ),
    homeHdTraining: booleanField(
      record.offers_home_hemodialysis_training,
    ),
    certificationDate: record.certification_date,
    lat: geocode?.lat ?? null,
    lng: geocode?.lng ?? null,
    geocodeStatus: geocode?.geocodeStatus || "no_match",
    matchedAddress: geocode?.matchedAddress || "",
    geocodeBenchmark: "Public_AR_Current",
    geocodeSource: "U.S. Census Geocoder",
    snapshotDate,
  };
}

async function main() {
  const [cmsRecords, cmsMetadata] = await Promise.all([
    fetchCmsFacilities(),
    fetchJson(CMS_METADATA_URL),
  ]);
  const geocodes = await geocodeFacilities(cmsRecords);
  const preparedAt = new Date().toISOString().slice(0, 10);
  const snapshotDate =
    String(cmsMetadata.modified || cmsMetadata.accrualPeriodicity || preparedAt)
      .slice(0, 10);
  const facilities = cmsRecords.map((record) =>
    compactFacility(
      record,
      geocodes.get(String(record.cms_certification_number_ccn)),
      snapshotDate,
    ),
  );
  const matched = facilities.filter(
    (facility) =>
      Number.isFinite(facility.lat) && Number.isFinite(facility.lng),
  ).length;
  const dataset = {
    metadata: {
      mode: "public_snapshot",
      fixtureVersion: null,
      preparedAt,
      facilitySnapshotDate: snapshotDate,
      transitSnapshotDate: "live BTS NTM viewport query",
      facilitySource:
        "CMS Provider Data Catalog: Dialysis Facility - Listing by Facility",
      transitSource:
        "USDOT/BTS National Transit Map Stops ArcGIS feature service",
      geocoderSource: "U.S. Census Geocoder Public_AR_Current",
      notice:
        "Public-source snapshot. The site selects three closest stops per visible facility from BTS viewport candidates.",
      facilityCount: facilities.length,
      geocodedFacilityCount: matched,
    },
    facilities,
    stops: [],
  };
  const manifest = {
    generatedAt: new Date().toISOString(),
    cms: {
      datasetId: CMS_DATASET_ID,
      source: CMS_URL,
      snapshotDate,
      records: facilities.length,
    },
    censusGeocoder: {
      benchmark: "Public_AR_Current",
      matchedRecords: matched,
      source: CENSUS_BATCH_URL,
      unresolvedRecords: facilities.length - matched,
    },
    transit: {
      mode: "runtime viewport query",
      selection:
        "three closest eligible stops per visible facility; shared stops deduplicated",
      source:
        "https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0",
    },
  };

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(
    outputPath,
    `window.DIALYSIS_TRANSIT_PUBLIC_DATA=${JSON.stringify(dataset)};\n`,
    "utf8",
  );
  await writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  console.log(
    `Wrote ${facilities.length} facilities (${matched} geocoded) to ${outputPath}`,
  );
}

await main();
