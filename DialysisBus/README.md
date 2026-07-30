# Dialysis & Transit Explorer

The primary deliverable is the GitHub Pages-compatible static site at
[`index.html`](index.html). It has no build step and uses relative asset paths,
so it works from a repository subdirectory as well as from a local HTTP server.

The current site is a complete **Phase 1 interaction demonstration**. It uses a
real Google Maps basemap plus a bundled deterministic fixture dataset so every
workflow can be exercised without a database or data-source download. Every
fixture is fictional and labeled “demonstration”; the site does not present
fixture metrics as CMS or USDOT/BTS findings.

## Open locally

From this directory:

```text
python -m http.server 8080
```

Then open `http://localhost:8080`.

The committed `config.js` contains the public demonstration Google Maps browser
key. A separate production key is not required for this demo. Browser keys are
visible to visitors by design, so restrict the key in Google Cloud to:

- Maps JavaScript API
- Geocoding API, when arbitrary address searches are required
- the exact GitHub Pages referrer, such as
  `https://professorbrain.github.io/*`
- local referrers only when local map testing is required

The bundled city, ZIP, and address autocomplete works without Places billing.
To add Google's Places widget, enable Places API (New) and set
`googlePlacesAutocomplete: true` in `config.js`. `config.example.js` documents
the configuration shape. A locally entered key is stored only in that browser
and is never used when the committed configuration already supplies a key.

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
- Low-zoom state clusters and high-zoom facility/stop points.
- Facility and transit layer toggles.
- State selection, current viewport analysis, national reset, zoom controls,
  current-location navigation, and city/ZIP/address search.
- URL restoration for map center, zoom, state, radius, layers, and filters.
- Shareable view-link copying.
- Preset thresholds at 250, 400, 800, and 1,600 meters.
- Custom thresholds from 100 through 5,000 meters.
- Facility filters for service, ownership, chain, late shift, station count,
  and geocoding status.
- Transit filters for stop type, wheelchair indication, and agency.
- Summary metrics, quartiles, distance distribution, sortable table, and
  responsive facility cards.
- Facility detail drawer and transit-stop detail card.
- Nearest-stop line and threshold-circle overlays for selected facilities.
- CSV export with metric, extent, provenance, and UTC timestamp fields.
- CSV spreadsheet-formula injection protection.
- Table-based map alternative, keyboard tabs, visible focus, live-region
  announcements, reduced-motion support, and mobile bottom-sheet behavior.
- Data & Methods, Accessibility, Privacy, and Terms of Use content.

## Static site files

```text
index.html             Main explorer
styles.css             Responsive visual system
app.js                 Map, filters, analytics, details, URL state, export
sample-data.js         Synthetic deterministic Phase 1 fixtures
config.js              Published Google Maps demonstration configuration
config.example.js      Configuration template
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
node --test tests/static-site.test.mjs
```

The repository also retains the original Epic 1 production-platform scaffold:

```text
apps/web/          Next.js/TypeScript application scaffold
services/api/      FastAPI service and health endpoints
db/                PostGIS migration and seed locations
pipelines/         Future source-ingestion entry points
infra/             Docker Compose and service images
docs/              Design, methods, operations, and data dictionary
```

That scaffold is the path for replacing fixtures with validated national CMS,
Census-geocoded, and USDOT/BTS snapshots. Full source ingestion, production
PostGIS analytics, and national API performance acceptance are not implied by
the static demonstration dataset.

## Interpretation

Phase 1 measures geodesic straight-line proximity. It does not establish route
availability, schedule compatibility, pedestrian accessibility, paratransit
eligibility, safety, weather exposure, or whether an individual can complete a
trip. No patient data, accounts, or persistent address-search history belong in
this project.

See [docs/DESIGN.md](docs/DESIGN.md), [docs/METHODS.md](docs/METHODS.md),
[docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md), and
[docs/OPERATIONS.md](docs/OPERATIONS.md) for the production implementation
contract.
