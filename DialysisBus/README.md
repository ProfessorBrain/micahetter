# Dialysis & Transit Explorer

The primary deliverable is the GitHub Pages-compatible static site at
[`index.html`](index.html). It has no build step and uses relative asset paths,
so it works from a repository subdirectory as well as from a local HTTP server.

The current site is a complete **Phase 1 public-data explorer**. It uses a real
Google Maps basemap, a published nationwide CMS facility snapshot geocoded
through the U.S. Census Bureau, and live viewport queries to the USDOT/BTS
National Transit Map. The generated source manifest records the source URLs,
snapshot date, facility count, and geocoding coverage.

## Open locally

From this directory:

```text
python -m http.server 8080
```

Then open `http://localhost:8080`.

The committed `config.js` reconstructs the public demonstration Google Maps
browser key from encoded fragments so it is not exposed as plain text in the
repository. This is obfuscation, not secrecy: browser keys remain visible in
network requests by design, so restrict the key in Google Cloud to:

- Maps JavaScript API
- the exact GitHub Pages referrer, such as
  `https://professorbrain.github.io/*`
- local referrers only when local map testing is required

The site loads this configuration automatically; it does not display a key-entry
or basemap-connection dialog.

## GitHub Pages

This project currently lives in the `DialysisBus` directory of the
`ProfessorBrain/micahetter` repository. If GitHub Pages is configured to deploy
the `main` branch from `/ (root)`, the site path is:

```text
https://professorbrain.github.io/micahetter/DialysisBus/
```

In GitHub:

1. Open **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save and wait for the Pages deployment to finish.

If `DialysisBus` later becomes its own repository, the same files work
unchanged at `https://<account>.github.io/<repository>/`.

## Implemented user workflows

- Real Google Maps JavaScript basemap with a vector Map ID.
- Low-zoom nationwide state clusters and high-zoom facility points.
- BTS transit-stop loading for the active viewport at zoom level 10 or closer.
  The map retains up to the three closest eligible stops per visible facility,
  displays shared stops once, and asks the user to zoom further when a dense
  response reaches the 2,000-candidate limit.
- Facility, transit, and transit-distance heatmap layer toggles. The heatmap
  colors each visible facility by its nearest eligible transit-stop distance
  using five bands: green, green-yellow, yellow, yellow-red, and red from
  shortest to longest distance. Users choose the relative or meter scale in
  Layers and edit the four fixed meter cutoffs from the top-bar Settings popup.
  Default meter cutoffs of 50, 125, 300, and 3,000 meters approximate the
  nationwide nearest-stop distance quintiles so the five colors are balanced.
  A bundled nationwide nearest-stop snapshot keeps the heatmap visible at low
  zoom, while zoom level 10 or closer replaces those values with live,
  filter-aware viewport calculations. A single visible facility remains
  colored whenever it has a calculated nearest-stop distance.
- State selection, current viewport analysis, national reset, zoom controls,
  and current-location navigation.
- URL restoration for map center, zoom, state, radius, layers, heatmap scale,
  and filters.
- Preset thresholds at 250, 400, 800, and 1,600 meters.
- Custom thresholds from 100 through 5,000 meters.
- Facility filters for service, ownership, chain, late shift, station count,
  and geocoding status.
- Transit filters for stop name or ID, stop type, wheelchair indication, and
  agency/NTD ID, with counted choices, live candidate/display totals, an
  active-radius constraint, and a transit-only reset.
- Summary metrics, quartiles, distance distribution, sortable table, and
  responsive facility cards.
- Facility detail drawer and transit-stop detail card.
- Nearest-stop line overlay for selected facilities.
- CSV export with metric, extent, provenance, and UTC timestamp fields.
- CSV spreadsheet-formula injection protection.
- Table-based map alternative, keyboard tabs, visible focus, live-region
  announcements, reduced-motion support, and mobile bottom-sheet behavior.
- Accessible Settings popup and a self-contained Data & Methods popup with
  Accessibility, Privacy, and Terms of Use content.

## Static site files

```text
index.html             Main explorer
styles.css             Responsive visual system
app.js                 Map, filters, analytics, details, URL state, export
sample-data.js         Synthetic deterministic Phase 1 fixtures
public-data.js         Generated nationwide CMS/Census facility snapshot
data/source-manifest.json  Snapshot provenance and record counts
scripts/build-public-data.mjs  Reproducible CMS/Census refresh
scripts/build-transit-heatmap.mjs  Rebuild nationwide nearest-stop metrics
config.js              Published Google Maps browser configuration
config.example.js      Configuration template
favicon.png            Site favicon
accessibility.html     Accessibility statement
privacy.html           Privacy notice
terms.html             Terms and research-use limitations
tests/                 Root static-site contract tests
```

## Validation

Run the root checks:

```text
node --check app.js
node --check sample-data.js
node --check public-data.js
node --check scripts/build-public-data.mjs
node --check scripts/build-transit-heatmap.mjs
node --test tests/static-site.test.mjs
```

Refresh the published facility snapshot from the official CMS and Census APIs:

```text
node scripts/build-public-data.mjs
```

The main refresh also rebuilds the nationwide BTS nearest-stop snapshot. To
refresh only those transit metrics against the current facility file, run
`node scripts/build-transit-heatmap.mjs`.

The synthetic `sample-data.js` file remains only as a deterministic fallback
and test fixture; it is not selected when `public-data.js` loads normally.

The repository also retains the original Epic 1 production-platform scaffold:

```text
apps/web/          Next.js/TypeScript application scaffold
services/api/      FastAPI service and health endpoints
db/                PostGIS migration and seed locations
pipelines/         Future source-ingestion entry points
infra/             Docker Compose and service images
docs/              Design, methods, operations, and data dictionary
```

That scaffold remains the path for scheduled ingestion, PostGIS materialized
metrics, and bounded national APIs. The GitHub Pages edition selects each
visible facility's three closest eligible stops from the BTS candidates loaded
for the current street-level viewport. A stop selected for multiple facilities
is displayed once, while each facility's metrics use only its own selected
three.

## Interpretation

Phase 1 measures geodesic straight-line proximity. It does not establish route
availability, schedule compatibility, pedestrian accessibility, paratransit
eligibility, safety, weather exposure, or whether an individual can complete a
trip. No patient data or accounts belong in this project.

See [docs/DESIGN.md](docs/DESIGN.md), [docs/METHODS.md](docs/METHODS.md),
[docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md), and
[docs/OPERATIONS.md](docs/OPERATIONS.md) for the production implementation
contract.
