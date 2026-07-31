# Dialysis & Transit Explorer

## Phase 1 Product and Technical Design Specification

**Version:** Version 1.0  
**Date:** July 29, 2026  
**Primary audience:** Codex and human reviewers responsible for implementation, testing, and deployment

---

## 1. Document purpose

This document is the authoritative build specification for the Phase 1 version of the **Dialysis & Transit Explorer**, a public-facing exploratory web application that overlays Medicare-certified dialysis facilities and public transportation stops on a Google Maps basemap and lets users perform reproducible proximity analytics.

Codex should treat this document as the product requirements document, system design, implementation plan, and acceptance-test specification. When details are ambiguous, Codex should favor the simplest implementation that satisfies the stated acceptance criteria and should not silently expand the Phase 1 scope.

## 2. Product summary

The Phase 1 product is a read-only national map and analytics tool. It combines:

- Dialysis facility records from the CMS Provider Data Catalog.
- Fixed-route transit stops from the Bureau of Transportation Statistics National Transit Map.
- Stored geocodes for dialysis facilities produced by the U.S. Census Geocoder.
- A Google Maps JavaScript basemap.
- Custom WebGL point layers rendered with deck.gl.
- PostGIS calculations for nearest-stop distance, stop counts within user-selected radii, filtering, grouping, and CSV export.

The application is exploratory. It measures **geographic proximity**, not route availability, schedule compatibility, pedestrian accessibility, paratransit eligibility, or the ability of an individual patient to complete a trip.

## 3. Goals

1. Display dialysis facilities and public transportation stops throughout the United States without attempting to load the full national stop dataset into the browser.
2. Let users navigate to a state, city, ZIP code, address, or map extent and inspect local dialysis-transit relationships.
3. Let users select a straight-line distance threshold and calculate how many facilities have at least one transit stop within that distance.
4. Let users inspect any dialysis facility and view its nearest stop, nearest-stop distance, and number of stops within the selected threshold.
5. Let users compare filtered regions and facility characteristics using summary cards, a distance distribution, and a sortable facility table.
6. Let users download the currently filtered facility-level results as CSV.
7. Preserve source names, snapshot dates, import status, geocoding status, and limitations so results can be interpreted and reproduced.
8. Provide a maintainable base for later schedule-aware GTFS, walking-network, Census-demographic, and patient-journey analyses.

## 4. Phase 1 non-goals

Do not implement the following in Phase 1:

- Real-time transit positions or GTFS-Realtime.
- Transit trip planning, arrival prediction, or navigation.
- Route, trip, stop-time, calendar, fare, or service-frequency analytics.
- Walking-network or driving-network distances.
- Dialysis shift schedules or treatment-time compatibility.
- Census demographic or social-vulnerability overlays.
- Patient-level data, protected health information, clinical predictions, or missed-treatment modeling.
- User accounts, saved projects, collaboration, comments, or permissions.
- Facility editing by end users.
- Native mobile applications.
- Google Places as the authoritative source of dialysis facilities or transit stops.
- A claim that stop proximity proves practical accessibility.

## 5. Primary users and use cases

### 5.1 Users

- Health-services and transportation researchers.
- Dialysis program administrators.
- Transit planners and municipal staff.
- Public-health students and educators.
- Community advocates.
- Clinicians exploring transportation context.

### 5.2 Core use cases

1. **National overview:** View the geographic distribution of dialysis facilities and transit stops.
2. **State comparison:** Select a state and calculate the percentage of dialysis facilities within 400 meters of a transit stop.
3. **Local exploration:** Search for Tucson, Arizona, zoom to the area, and inspect individual facilities and nearby stops.
4. **Threshold sensitivity:** Change the threshold from 400 meters to 800 meters and see the summary, chart, and table update.
5. **Facility review:** Select a facility and inspect source attributes, geocoding quality, nearest stop, and nearby-stop count.
6. **Gap identification:** Sort facilities from greatest to least nearest-stop distance.
7. **Data export:** Download the filtered facility metrics with source snapshot metadata.

## 6. Data sources and provenance

### 6.1 Dialysis facilities

**Source:** CMS Provider Data Catalog, dataset **Dialysis Facility - Listing by Facility**.  
**Dataset identifier:** `23ew-n7w9`.  
**Authoritative identifier:** CMS Certification Number (CCN).

Minimum imported fields:

- CMS Certification Number (CCN)
- Facility name
- Address line 1 and address line 2
- City/town
- State
- ZIP code
- County/parish
- Telephone number
- Profit or non-profit
- Chain owned
- Chain organization
- Late shift
- Number of dialysis stations
- Offers in-center hemodialysis
- Offers peritoneal dialysis
- Offers home hemodialysis training
- Certification date
- CMS source release or snapshot date

The facility listing does not provide a complete durable coordinate field for this application, so Phase 1 geocodes addresses during ETL and records the geocoder match status.

### 6.2 Dialysis facility geocoding

**Primary geocoder:** U.S. Census Geocoder using the current public address-range benchmark.

Requirements:

- Submit records in batches of no more than 10,000.
- Preserve the original CMS address exactly.
- Store the matched address, longitude, latitude, match indicator, match type, and benchmark used.
- Set `geocode_status` to `exact`, `non_exact`, `tie`, `no_match`, or `manual_override`.
- Do not silently discard unmatched facilities.
- Produce an import QA report listing unmatched and tied facilities.
- Permit a version-controlled override CSV for verified coordinates.

Census geocodes are interpolated along address ranges and should be labeled as approximate.

### 6.3 Transit stops

**Source:** Bureau of Transportation Statistics, National Transit Map Stops.  
**ArcGIS FeatureServer:** `https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0`

Minimum imported fields:

- `OBJECTID`
- `ntd_id`
- `feed_id`
- `stop_id`
- `stop_name`
- `stop_desc`
- `stop_lat`
- `stop_lon`
- `stop_url`
- `stop_code`
- `location_type`
- `parent_station`
- `stop_timezone`
- `wheelchair_boarding`
- `platform_code`
- `stop_type`
- `stop_type_text`
- `download_date`
- Source snapshot date

The importer must paginate because the ArcGIS service has a record limit. Query only required fields and geometry. Store the source object ID and a deterministic compound key such as `feed_id + stop_id + location_type` when available.

### 6.4 Data attribution and limitations

The user interface must include a Data & Methods modal dialog stating:

- CMS data represent Medicare-certified dialysis facilities and may include facilities that are closed, temporarily inactive, specialized, or not accepting new patients unless the source explicitly indicates otherwise.
- National Transit Map coverage and source validity vary by agency and snapshot.
- The National Transit Map supports research and analysis and is not a navigation or real-time trip-planning product.
- Straight-line proximity does not measure route schedules, walking barriers, safety, weather exposure, disability access, or trip feasibility.
- Facility coordinates are approximate when derived from address-range geocoding.

Display attribution for CMS, the U.S. Census Bureau, USDOT/BTS, and Google Maps. Preserve Google Maps attribution without alteration.

## 7. Product behavior

### 7.1 Default state

On first load:

- Display a contiguous U.S. map centered near `lat 39.5, lng -98.35` at zoom 4.
- Display dialysis-facility clusters.
- Display transit-stop aggregate clusters, not raw stops.
- Set proximity threshold to **400 meters**.
- Use all facility ownership and service filters.
- Show a brief methods notice and a button for the full Data & Methods dialog.
- Do not automatically run expensive national facility-stop count queries until the initial aggregate metrics are available.

### 7.2 Map layers

Layer controls:

- Dialysis facilities: on by default.
- Transit stops: on by default.
- Nearest-stop connection line: off by default and available only for a selected facility.
- Facility threshold circle: off by default and available only for a selected facility.

Rendering rules:

- Use Google Maps JavaScript API only for the basemap and map controls.
- Use deck.gl `ScatterplotLayer` or equivalent WebGL layers for raw points and server-generated clusters.
- Do not render hundreds of thousands of HTML markers.
- Dialysis facilities and transit stops must use distinct shape, size, and color encoding; do not rely on color alone.
- Raw transit stops should appear only when the zoom level and viewport query return a manageable number.
- At lower zoom levels, the API must return aggregates with counts and centroids.

### 7.3 Navigation and search

Provide:

- Google Maps location autocomplete for address/city/ZIP navigation, with no persistence of Google Places content beyond the active interaction.
- State dropdown.
- Reset-to-national button.
- Current-location button only after explicit browser permission.
- URL parameters for map center, zoom, state, radius, and primary filters so an analysis view can be shared.

### 7.4 Filters

Facility filters:

- State.
- In-center hemodialysis offered: default `yes`.
- Ownership: all, for-profit, non-profit, government/other as represented in source.
- Chain owned: all, yes, no.
- Chain organization: multi-select populated from current data.
- Late shift: all, yes, no, unknown.
- Minimum and maximum number of dialysis stations.
- Geocoding status: matched only by default; optional inclusion of unresolved records in tables but not map analytics.

Transit filters:

- `stop_type_text` multi-select when populated.
- Wheelchair boarding status: all, indicated accessible, indicated not accessible, unknown.
- Agency/NTD ID multi-select, searchable and limited to agencies within the current map or state selection.

### 7.5 Analysis extent

Phase 1 supports two analysis extents:

1. **Selected state** when a state filter is active.
2. **Current map viewport** when no state filter is active or when the user explicitly chooses “Analyze current map.”

The UI must label the active extent clearly. Do not imply that a viewport summary is a formal administrative-area statistic.

### 7.6 Proximity threshold

Provide preset thresholds:

- 250 meters
- 400 meters
- 800 meters
- 1,600 meters

Also permit a custom threshold from 100 to 5,000 meters.

All Phase 1 distances are geodesic straight-line distances calculated in PostGIS using geography types. Display values in meters below 1,000 meters and miles at or above 1,000 meters, with a metric value available in tooltips or detail tables.

### 7.7 Analytics panel

For the active extent and filters, display:

- Dialysis facilities included.
- Facilities with at least one transit stop within threshold.
- Percentage with a stop within threshold.
- Median nearest-stop distance.
- 25th and 75th percentile nearest-stop distance.
- Transit stops in the active extent.
- Facilities with unresolved geocodes excluded from spatial analytics.

Display a nearest-stop distance distribution with bins:

- 0-250 m
- 251-400 m
- 401-800 m
- 801-1,600 m
- More than 1,600 m
- No valid geocode

Display a sortable facility table with:

- Facility name
- City/state
- Ownership
- Chain organization
- Number of stations
- Nearest stop name
- Nearest stop distance
- Stops within threshold
- Geocoding status
- CMS CCN

Default table order: greatest nearest-stop distance first, with unresolved geocodes last.

### 7.8 Facility detail drawer

Selecting a facility opens a detail drawer with:

- Facility name and address.
- CMS CCN.
- Telephone number.
- Ownership and chain fields.
- Number of stations and available modalities.
- Late-shift field.
- Geocoding status, matched address, and coordinate source.
- Nearest stop name, stop type, agency/NTD ID, distance, and wheelchair field.
- Count of stops within the active threshold.
- Buttons to show/hide the threshold circle and nearest-stop connection line.
- Source snapshot dates.
- A reminder that proximity is not proof of usable transit access.

Selecting a transit stop opens a smaller detail card containing its source identifiers, name, type, agency, wheelchair field, URL if present, and snapshot date.

### 7.9 CSV export

Export one row per filtered dialysis facility. Include:

- All visible table fields.
- Facility latitude and longitude.
- Geocoding status and benchmark.
- Nearest-stop identifiers and coordinates.
- Nearest-stop distance in meters.
- Stop count within threshold.
- Active threshold.
- Active extent description.
- CMS snapshot date.
- NTM snapshot date.
- Export timestamp in UTC.

File naming convention:

`dialysis-transit-explorer_YYYY-MM-DD_<state-or-viewport>_<radius-m>.csv`

## 8. System architecture

### 8.1 Required stack

- **Frontend:** Next.js with TypeScript and the App Router.
- **Map:** Google Maps JavaScript API with a vector map ID.
- **Overlay rendering:** deck.gl integrated through `@deck.gl/google-maps`.
- **Charts:** a small accessible React chart library such as Recharts; charts must have accompanying text and table equivalents.
- **Backend:** FastAPI with Pydantic and SQLAlchemy 2.x.
- **Database:** PostgreSQL with PostGIS.
- **ETL:** Python using `httpx`, `pandas`, `psycopg` or SQLAlchemy, and standard geospatial libraries only where needed.
- **Local orchestration:** Docker Compose.
- **Package management:** `pnpm` for web and a locked Python dependency file using `uv` or equivalent.
- **Testing:** Vitest/React Testing Library, Playwright, and Pytest.

Use current stable releases at implementation time and commit lockfiles. Avoid preview or experimental framework features unless the specification cannot be met otherwise.

### 8.2 Component responsibilities

#### Next.js web application

- Renders the UI.
- Owns client-side map state and filter state.
- Calls the FastAPI service.
- Does not connect directly to PostgreSQL.
- Does not include data-source credentials in browser bundles.

#### FastAPI service

- Provides read-only spatial and metadata APIs.
- Validates bounds, filters, radii, pagination, and sort parameters.
- Produces cluster or raw-point responses based on zoom.
- Executes analytics queries and CSV exports.
- Exposes health and source-snapshot endpoints.

#### PostgreSQL/PostGIS

- Stores normalized source data and import metadata.
- Stores geometries in EPSG:4326.
- Uses PostGIS geography casts for meter-based distance.
- Maintains GiST spatial indexes and conventional indexes on common filters.
- Stores precomputed nearest-stop results for each successfully geocoded facility.

#### ETL jobs

- Fetch source data.
- Save immutable raw snapshots.
- Validate schemas.
- Transform and load staging tables.
- Geocode CMS facility addresses.
- Apply verified coordinate overrides.
- Swap staging data into production tables transactionally.
- Compute nearest-stop metrics.
- Generate QA summaries.

## 9. Repository layout

```text
/
├── apps/
│   └── web/                  # Next.js application
├── services/
│   └── api/                  # FastAPI application
├── pipelines/
│   ├── fetch_cms.py
│   ├── fetch_ntm_stops.py
│   ├── geocode_facilities.py
│   ├── load_database.py
│   ├── compute_metrics.py
│   └── qa_report.py
├── data/
│   ├── raw/                  # gitignored immutable snapshots
│   ├── processed/            # gitignored transformed artifacts
│   └── overrides/
│       └── facility_coordinates.csv
├── db/
│   ├── migrations/
│   └── seeds/
├── infra/
│   ├── docker-compose.yml
│   └── Dockerfiles/
├── docs/
│   ├── DESIGN.md             # copy of this specification
│   ├── DATA_DICTIONARY.md
│   ├── METHODS.md
│   └── OPERATIONS.md
├── tests/
│   └── fixtures/
├── .env.example
├── Makefile
└── README.md
```

## 10. Database design

### 10.1 `source_snapshots`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `source_name` | text | `cms_dialysis`, `bts_ntm_stops`, `census_geocoder` |
| `source_dataset_id` | text | CMS dataset ID or ArcGIS item/service ID |
| `source_url` | text | Retrieval endpoint |
| `source_published_at` | timestamptz nullable | Source-provided date |
| `retrieved_at` | timestamptz | Required |
| `content_sha256` | text | Raw artifact hash |
| `row_count` | bigint | Loaded source rows |
| `status` | text | `started`, `validated`, `loaded`, `failed` |
| `metadata` | jsonb | Schema/version details |

### 10.2 `dialysis_facilities`

| Column | Type | Notes |
|---|---|---|
| `ccn` | text | Primary key; preserve leading zeroes |
| `facility_name` | text | Required |
| `address_line_1` | text | |
| `address_line_2` | text nullable | |
| `city` | text | |
| `state` | char(2) | Indexed |
| `zip_code` | text | Preserve ZIP+4 when present |
| `county` | text nullable | |
| `telephone` | text nullable | |
| `profit_status` | text nullable | Indexed normalized value plus raw value |
| `chain_owned` | boolean nullable | |
| `chain_organization` | text nullable | Indexed |
| `late_shift` | boolean nullable | |
| `dialysis_stations` | integer nullable | |
| `offers_in_center_hd` | boolean nullable | |
| `offers_pd` | boolean nullable | |
| `offers_home_hd_training` | boolean nullable | |
| `certification_date` | date nullable | |
| `source_snapshot_id` | UUID | Foreign key |
| `source_record` | jsonb | Preserve selected original source fields |
| `geom` | geometry(Point,4326) nullable | GiST index |
| `geocode_status` | text | Indexed |
| `geocode_match_type` | text nullable | |
| `geocode_matched_address` | text nullable | |
| `geocode_benchmark` | text nullable | |
| `geocode_source` | text nullable | `census` or `manual_override` |
| `updated_at` | timestamptz | |

### 10.3 `transit_stops`

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial | Internal primary key |
| `source_object_id` | bigint | Indexed |
| `ntd_id` | text nullable | Indexed |
| `feed_id` | text nullable | Indexed |
| `stop_id` | text nullable | |
| `stop_name` | text nullable | |
| `stop_desc` | text nullable | |
| `stop_url` | text nullable | |
| `stop_code` | text nullable | |
| `location_type` | text nullable | |
| `parent_station` | text nullable | |
| `stop_timezone` | text nullable | |
| `wheelchair_boarding` | text nullable | Indexed |
| `platform_code` | text nullable | |
| `stop_type` | text nullable | Indexed |
| `stop_type_text` | text nullable | Indexed |
| `download_date` | date nullable | |
| `source_snapshot_id` | UUID | Foreign key |
| `geom` | geometry(Point,4326) | Required; GiST index |
| `dedupe_key` | text | Unique within source snapshot |

Do not collapse stops simply because coordinates match; paired directional stops may legitimately share or nearly share coordinates. Deduplicate only exact duplicate source records using the deterministic key and source identifiers.

### 10.4 `facility_stop_metrics`

| Column | Type | Notes |
|---|---|---|
| `facility_ccn` | text | Primary key and foreign key |
| `nearest_stop_pk` | bigint nullable | Foreign key |
| `nearest_stop_distance_m` | double precision nullable | Geography distance |
| `stops_within_250m` | integer | |
| `stops_within_400m` | integer | |
| `stops_within_800m` | integer | |
| `stops_within_1600m` | integer | |
| `cms_snapshot_id` | UUID | |
| `ntm_snapshot_id` | UUID | |
| `computed_at` | timestamptz | |

For custom radii, calculate stop counts on demand. The preset columns support fast default analytics.

## 11. ETL specification

### 11.1 General rules

- Every import creates a `source_snapshots` row before processing.
- Save raw responses/files under a timestamped snapshot directory.
- Validate expected columns before loading.
- Abort the production swap if required columns are missing or row counts are implausibly low.
- Load into staging tables, validate, then swap transactionally.
- Keep the previous successful snapshot available for rollback.
- Log counts, durations, errors, and schema changes.
- Never modify raw source files.

### 11.2 CMS import

Use the Provider Data Catalog API endpoint pattern documented by CMS:

`https://data.cms.gov/provider-data/api/1/datastore/query/23ew-n7w9/0`

Requirements:

- Paginate until all rows are retrieved.
- Preserve CCN as text.
- Normalize source yes/no values to nullable booleans while retaining raw values in `source_record`.
- Normalize state abbreviations to uppercase.
- Validate that CCN is unique within a snapshot.
- Compare row count and state coverage with the previous successful snapshot.

### 11.3 Census geocoding

- Geocode only new or changed addresses and records lacking a valid manual override.
- Use batch processing where possible.
- Cache Census results by normalized address hash in an internal table or processed artifact.
- Apply `data/overrides/facility_coordinates.csv` after automated geocoding.
- Override file columns: `ccn,latitude,longitude,verified_address,verification_source,verified_at,notes`.
- Produce a report with exact matches, non-exact matches, ties, no matches, and overrides.

### 11.4 NTM stop import

Use the ArcGIS query endpoint:

`<FeatureServer URL>/query`

Recommended query parameters:

```text
where=1=1
outFields=OBJECTID,ntd_id,feed_id,stop_id,stop_name,stop_desc,
  stop_lat,stop_lon,stop_url,stop_code,location_type,parent_station,
  stop_timezone,wheelchair_boarding,platform_code,stop_type,
  stop_type_text,download_date
returnGeometry=true
outSR=4326
f=geojson
resultOffset=<offset>
resultRecordCount=<page size>
```

Requirements:

- Determine the service maximum record count from metadata rather than assuming it.
- Paginate until no records remain.
- Retry transient failures with exponential backoff.
- Reject geometries outside plausible U.S. and territory bounds only when clearly malformed; do not remove valid Alaska, Hawaii, Puerto Rico, or island-area records.
- Record total features and null-field rates.

### 11.5 Metric computation

After both datasets load:

- For each geocoded facility, find the nearest transit stop with K-nearest-neighbor ordering and confirm the exact geography distance.
- Count stops within 250, 400, 800, and 1,600 meters.
- Compute in batches and use spatial indexes.
- Store snapshot IDs so metrics are traceable to source versions.
- Facilities without geometry receive null nearest-stop values and zero preset counts only if the UI clearly distinguishes “not calculated” from “none nearby.” Prefer null counts for unresolved facilities.

## 12. API design

Base path: `/api/v1`

All responses must include a request ID. Errors use a consistent JSON structure:

```json
{
  "error": {
    "code": "INVALID_RADIUS",
    "message": "Radius must be between 100 and 5000 meters.",
    "request_id": "..."
  }
}
```

### 12.1 Health and metadata

- `GET /health/live`
- `GET /health/ready`
- `GET /metadata/snapshots`
- `GET /metadata/filters`

`/metadata/filters` returns available states, ownership values, chain organizations, stop types, NTD IDs, and snapshot dates.

### 12.2 Map endpoints

#### `GET /map/facilities`

Parameters:

- `west`, `south`, `east`, `north`
- `zoom`
- facility filters
- `limit`

Behavior:

- Return clusters below the configured raw-point zoom.
- Return raw facilities when the viewport count is manageable.
- Include a response field identifying `cluster` versus `point` mode.

#### `GET /map/stops`

Parameters:

- bounds
- zoom
- stop filters
- `limit`

Behavior:

- Return server-generated clusters at low and medium zooms.
- Return raw points only when the expected count is below the safe response threshold.
- If the raw count would exceed the threshold, return a coarser aggregation and a `resolution_limited` flag.

Suggested initial geohash precision:

| Zoom | Mode | Precision |
|---|---|---|
| 0-5 | aggregate | 3 |
| 6-7 | aggregate | 4 |
| 8-10 | aggregate | 5 |
| 11-12 | aggregate | 6 |
| 13+ | raw if under limit, otherwise aggregate | 7 |

Tune these values using performance tests rather than treating them as immutable.

### 12.3 Facility detail

- `GET /facilities/{ccn}`
- `GET /facilities/{ccn}/nearby-stops?radius_m=400&limit=100`

The nearby-stop endpoint returns ordered stops and exact distances.

### 12.4 Analytics

#### `GET /analytics/summary`

Parameters:

- `extent_type=state|viewport`
- state or bounds
- `radius_m`
- facility filters
- stop filters

Returns the metrics specified in Section 7.7 plus bin counts.

#### `GET /analytics/facilities`

Returns paginated facility-level metrics for the sortable table.

Parameters include:

- extent
- filters
- radius
- `sort`
- `order`
- `page`
- `page_size` with maximum 500

#### `GET /analytics/export.csv`

Same filters as the table. Stream CSV rather than building the entire file in browser memory.

### 12.5 Parameter validation

- Bounds must be numeric and ordered.
- Radius must be 100-5,000 meters.
- Zoom must be 0-22.
- Page size must respect endpoint maximums.
- Reject arbitrary SQL field names; map public sort/filter names to an allowlist.
- Apply request timeouts and statement timeouts.

## 13. Spatial query rules

- Store points as `geometry(Point,4326)`.
- Use bounding-box geometry comparisons for viewport prefiltering.
- Cast to `geography` for meter-based `ST_DWithin` and `ST_Distance` calculations.
- Use `ST_MakeEnvelope(west,south,east,north,4326)` for ordinary viewports.
- Handle antimeridian-crossing bounds explicitly, particularly for Alaska and Pacific territories.
- Do not use Web Mercator planar distance for reported facility-stop metrics.
- Round displayed distances only in presentation; preserve full precision in database and CSV.

## 14. Frontend design

### 14.1 Desktop layout

- Top application bar, 56-64 px high.
- Collapsible left panel, approximately 340 px wide.
- Full-height map in remaining space.
- Facility detail drawer from the right, approximately 380 px wide.
- Floating legend and map controls that do not obscure Google attribution.

Left-panel tabs:

1. **Layers**
2. **Filters**
3. **Analytics**

Open **Data & Methods** from the application bar as a modal dialog with a
labeled close button, Escape and backdrop dismissal, internal scrolling, and
focus restoration.

### 14.2 Mobile layout

- Full-screen map.
- Bottom sheet for layers, filters, analytics, and details; Data & Methods
  remains a modal dialog.
- Search and state controls remain available.
- Preserve a minimum touch target of 44 by 44 CSS pixels.
- Avoid showing the full facility table on narrow screens; provide cards and CSV export.

### 14.3 Visual language

- Clean research-tool aesthetic rather than a consumer navigation aesthetic.
- Dialysis facility symbol should suggest a healthcare facility without using protected brand marks.
- Transit stop symbol should be visually distinct and simpler.
- Clusters show count labels.
- Selected features receive a halo and increased size.
- Use a colorblind-safe palette and secondary shape/outline encodings.
- Display data freshness in the interface, not only in documentation.

### 14.4 Loading, empty, and error states

- Show skeletons or progress indicators for analytics and tables.
- Keep the map interactive while analytics load.
- Cancel superseded requests when the map moves repeatedly.
- Debounce viewport requests by approximately 250-400 ms.
- Empty states should explain whether filters, zoom, unresolved geocodes, or missing source coverage caused the result.
- On API failure, preserve the last successful map state and show a retry action.

## 15. Accessibility

Target WCAG 2.2 AA.

Requirements:

- All filters and controls are keyboard accessible.
- Visible focus styles.
- Labels are programmatically associated with controls.
- Layer state and selected feature are announced to screen readers.
- Analytics cards and charts have text equivalents.
- Do not rely on color alone.
- Provide a table-based alternative to map exploration.
- Respect reduced-motion settings.
- Map keyboard shortcuts must not trap focus.
- Provide an accessibility statement and feedback contact placeholder.

## 16. Security and privacy

- No patient data or user accounts.
- No analytics event should contain a full user-entered address unless the user explicitly submits it for search; do not persist search text in application logs.
- Restrict the Google Maps browser API key by approved HTTP referrers and required APIs only.
- Store database credentials and server configuration in environment variables.
- Use read-only database credentials for the public API.
- Apply CORS allowlists in production.
- Set secure headers including CSP, HSTS, `X-Content-Type-Options`, and an appropriate referrer policy.
- Rate-limit expensive analytics and export endpoints.
- Sanitize CSV fields to prevent spreadsheet-formula injection by prefixing dangerous leading characters.
- Dependency scanning and secret scanning must run in CI.
- Publish public Terms of Use and Privacy Policy pages compatible with Google Maps Platform requirements.

## 17. Performance requirements

Target production behavior after warm caches:

- Initial application shell interactive within 3 seconds on typical broadband.
- National facility cluster response within 1.5 seconds at p95.
- National stop aggregate response within 2 seconds at p95.
- State summary response within 2 seconds at p95 for preset radii.
- Facility detail response within 500 ms at p95.
- Map pan/zoom should not freeze the main thread for more than 100 ms.
- Raw stop responses capped at a configurable maximum, initially 20,000 points.
- Individual JSON responses should generally remain below 5 MB compressed.

Implementation techniques:

- GiST spatial indexes.
- Precomputed preset-radius metrics.
- Server-side aggregation.
- Gzip or Brotli compression.
- HTTP caching keyed by source snapshot and normalized query.
- Short-lived API caches for common national and state requests.
- Request cancellation and client-side deduplication.

## 18. Observability and operations

- Structured JSON logs with request IDs.
- Metrics for request count, latency, status, query time, response size, and cache hit rate.
- ETL metrics for source row counts, geocode match rates, validation failures, and metric-computation duration.
- Health endpoints must verify both service process and database connectivity.
- Display current successful source snapshot dates in the UI.
- Provide an operations document for refresh, rollback, and override procedures.
- A failed refresh must not replace the last successful production dataset.

## 19. Testing strategy

### 19.1 Unit tests

- Source-value normalization.
- Address hashing and override application.
- Radius and bounds validation.
- Distance formatting.
- Filter serialization to URL.
- CSV formula-injection protection.
- Cluster precision selection.

### 19.2 Database tests

Use small fixture datasets with known coordinates to verify:

- Nearest-stop selection.
- Exact meter distances within tolerance.
- Stop counts at boundary distances.
- Viewport inclusion.
- State and facility filters.
- Null geocode handling.
- Antimeridian logic.

### 19.3 API integration tests

- Valid and invalid parameters.
- Cluster and raw modes.
- Pagination and sorting.
- Summary/table consistency.
- CSV column order and metadata.
- Snapshot metadata.
- Timeout and rate-limit behavior.

### 19.4 Frontend tests

- Layer toggles.
- Filter updates.
- Threshold changes.
- Selected facility drawer.
- URL state restoration.
- Empty and error states.
- Keyboard navigation.
- Screen-reader labels.

### 19.5 End-to-end tests

Playwright scenarios:

1. Load national view and confirm cluster layers.
2. Select Arizona and obtain analytics.
3. Search Tucson and zoom to the city.
4. Select a facility and show nearest-stop line.
5. Change radius from 400 to 800 meters and verify metrics update.
6. Sort the facility table by nearest-stop distance.
7. Export CSV and verify headers and at least one data row.
8. Reload a shared URL and restore state.

## 20. Local development and deployment

### 20.1 Environment variables

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAP_ID=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
DATABASE_URL=postgresql+psycopg://...
PUBLIC_DATABASE_URL=postgresql+psycopg://...read_only...
CMS_DATASET_ID=23ew-n7w9
CMS_DATASTORE_RESOURCE_INDEX=0
BTS_NTM_STOPS_FEATURESERVER=https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0
DATA_SNAPSHOT_DIR=/data/raw
APP_ENV=development
API_RATE_LIMIT_PER_MINUTE=120
RAW_POINT_LIMIT=20000
```

### 20.2 Required commands

The repository must provide stable commands such as:

```bash
make bootstrap          # install dependencies and start database
make migrate            # apply migrations
make ingest-sample      # load small fixture data
make ingest-production  # fetch and load complete sources
make compute-metrics
make dev                # start web and API
make test
make lint
make e2e
make qa-report
```

### 20.3 Deployment model

- Deploy the Next.js application and FastAPI service as separate containers or services.
- Use managed PostgreSQL with PostGIS enabled.
- Run ETL as a controlled scheduled job, initially manual or quarterly.
- Use separate development, staging, and production environments.
- Do not expose the database publicly.
- Deploy only after staging completes the smoke-test checklist.

## 21. Phase 1 acceptance criteria

The Phase 1 build is complete only when all criteria below are met.

### Data

- CMS facility import completes and preserves unique CCNs.
- All facility addresses receive an explicit geocoding status.
- NTM stop import paginates through the complete source snapshot.
- Source hashes, row counts, and snapshot dates are recorded.
- At least one QA report is generated and documented.
- Nearest-stop metrics are computed for all geocoded facilities.

### Map

- National facility and stop layers render without loading the full stop dataset in the browser.
- Clusters transition to raw points at appropriate zoom levels.
- Map, state, and URL navigation work.
- Facility and stop selections show correct details.
- Google Maps attribution remains visible.

### Analytics

- Summary metrics respond to state/viewport, filters, and radius.
- Facility table values match the summary query population.
- Selected facility metrics match database fixture expectations.
- Preset and custom radii work from 100 to 5,000 meters.
- CSV export contains the required fields and metadata.

### Quality

- Automated unit, integration, and end-to-end tests pass.
- No high-severity dependency vulnerabilities remain unaddressed.
- Basic WCAG 2.2 AA audit passes for non-map controls and table alternatives.
- Production build succeeds from a clean checkout using documented commands.
- README and operations documentation allow a new developer or Codex session to run the app without undocumented steps.

## 22. Implementation sequence for Codex

Codex should implement the product in the following epics and create a clean commit after each epic.

### Epic 1: Repository and local platform

- Create monorepo structure.
- Configure Next.js, FastAPI, Postgres/PostGIS, Docker Compose, linting, formatting, and tests.
- Add health endpoints and a basic map shell.

**Exit criterion:** `make bootstrap`, `make dev`, and smoke tests work with no source data.

### Epic 2: Database and fixture data

- Add migrations for all tables and indexes.
- Add deterministic small fixtures covering several states and known distances.
- Add database tests.

**Exit criterion:** fixture nearest-stop metrics pass exact expected values.

### Epic 3: CMS ingestion and Census geocoding

- Implement CMS API pagination and normalization.
- Implement Census batch geocoding and override workflow.
- Produce QA report.

**Exit criterion:** complete CMS snapshot loads with explicit geocoding status for every facility.

### Epic 4: NTM stop ingestion

- Implement ArcGIS metadata discovery, pagination, retries, and staging load.
- Create indexes and QA summary.

**Exit criterion:** full NTM snapshot loads and row count matches the source response.

### Epic 5: Metric computation and APIs

- Compute preset nearest-stop metrics.
- Implement metadata, map, detail, analytics, and export endpoints.
- Add query validation, timeouts, and integration tests.

**Exit criterion:** all fixture API tests pass and national queries remain bounded.

### Epic 6: Map interface

- Integrate Google Maps and deck.gl.
- Add layer controls, clustering, feature selection, state navigation, search, and URL state.

**Exit criterion:** national and Tucson exploration works without browser overload.

### Epic 7: Filters and analytics UI

- Add filters, summary cards, distribution chart, facility table, detail drawer, radius controls, and CSV export.

**Exit criterion:** Arizona/Tucson end-to-end scenario passes.

### Epic 8: Accessibility, security, and documentation

- Complete accessible control states and table alternative.
- Add security headers, rate limits, CSV safeguards, key guidance, Terms, Privacy, and Data & Methods pages.
- Complete README, data dictionary, methods, and operations documents.

**Exit criterion:** acceptance checklist and end-to-end tests pass from clean checkout.

## 23. Codex implementation rules

1. Keep Phase 1 read-only.
2. Do not substitute Google Places data for CMS or BTS source data.
3. Do not store Google Places search content beyond what is necessary for the active user interaction.
4. Do not add schedule-aware GTFS features in this phase.
5. Prefer explicit SQL and tests for spatial calculations over opaque abstractions.
6. Never return an unbounded national raw-stop response.
7. Keep source snapshot IDs attached to calculated metrics and exports.
8. Surface unresolved geocodes and source limitations rather than hiding them.
9. Add tests with every functional change.
10. Update documentation whenever API contracts, schemas, commands, or assumptions change.
11. Treat this design document as authoritative unless a subsequent written decision explicitly supersedes it.

## 24. Recommended first Codex prompt

```text
Build the Phase 1 Dialysis & Transit Explorer described in docs/DESIGN.md.

Begin with Epic 1 only. Create the monorepo, Docker Compose environment, PostGIS database, Next.js TypeScript application, FastAPI service, health endpoints, test scaffolding, Makefile commands, .env.example, and a basic Google Maps page that can run with a configured API key. Do not implement data ingestion or analytics yet.

Before coding, summarize the files you will create and any assumptions. After coding, run the available lint, unit-test, build, and smoke-test commands; fix failures. Commit only files required for Epic 1 and update README.md with exact local setup instructions.
```

## 25. Future phases

Future work may add:

- Agency-level GTFS feeds, routes, schedules, calendars, and route shapes.
- Schedule-compatible dialysis-shift analysis.
- Walking-network distances and entrance-level pedestrian routing.
- Census population, vehicle availability, disability, poverty, and rurality overlays.
- Transit service frequency and weekend availability.
- Heat, shade, sidewalk, curb-ramp, and stop-amenity audits.
- Historical snapshots and change analysis.
- User-created study areas and saved analytical projects.
- Statewide or metropolitan comparison reports.

These features must not be partially introduced into Phase 1 in ways that imply validated functional access.

## 26. Official references

1. OpenAI, **Codex** and **Introducing the Codex app**.
2. Google Maps Platform, **Maps JavaScript API Overview**.
3. Google Maps Platform, **deck.gl Overlay View** and marker-clustering examples.
4. Google Maps Platform, **Maps JavaScript API policies, attribution, API-key, and billing documentation**.
5. Centers for Medicare & Medicaid Services, **Dialysis facilities** and **Dialysis Facility - Listing by Facility** (`23ew-n7w9`).
6. Centers for Medicare & Medicaid Services, **Provider Data Catalog API Documentation**.
7. Bureau of Transportation Statistics, **National Transit Map** and **National Transit Map Stops**.
8. U.S. Census Bureau, **Census Geocoding Services API** and batch-address documentation.

---

**End of specification**
