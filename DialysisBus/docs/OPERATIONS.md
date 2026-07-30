# Operations

## GitHub Pages demonstration

The root static site requires no build. In the current
`ProfessorBrain/micahetter` repository, configure GitHub Pages to publish the
`main` branch from `/ (root)`, then open `/DialysisBus/` beneath the Pages
origin. All browser assets use relative paths and are safe at that subpath.

The public demonstration map key is stored in `config.js`. Restrict it to the
required Google Maps APIs and the Pages origin. The local fixture autocomplete
is the default and needs no Places service. Arbitrary address lookup requires
Geocoding API; Google's Places widget additionally requires Places API (New)
and `googlePlacesAutocomplete: true`. A deployment is a normal commit to
`main`; rollback uses a revert commit so repository history remains intact.

Before publishing:

1. Run `node --check app.js` and `node --check sample-data.js`.
2. Run `node --test tests/static-site.test.mjs`.
3. Serve the directory locally and verify map, filters, analytics, details,
   URL restoration, and CSV export.
4. Confirm every fixture remains visibly labeled as demonstration data.

## Local startup

1. Copy `.env.example` to `.env`.
2. Replace the local database passwords.
3. Add restricted Google Maps credentials if testing the containerized web app.
4. Run `make bootstrap`.
5. Run `make dev`.

Docker Compose exposes the web application on port 3000, the API on port 8000,
and PostgreSQL on port 5432 for local development only.

## Health checks

- `/health/live` confirms that the API process can serve requests.
- `/health/ready` executes `SELECT 1` against PostgreSQL.
- Versioned aliases live under `/api/v1/health/`.

A readiness failure returns HTTP 503 with a stable error code and request ID.
The API never reports itself ready when the database probe fails.

## Logs

The API emits one JSON log line per completed request. Each line includes a
request ID, method, path, status, and duration. Responses return the same
request ID in the `X-Request-ID` header.

## Source refresh and rollback

Source refresh, transactional staging swaps, snapshot retention, coordinate
overrides, metric recomputation, and rollback begin in Epics 2–5. Until those
workflows exist, do not manually place unvalidated source rows into production
tables.

The operational invariant for later epics is: a failed refresh must never
replace the last successful source snapshot.

## Google Maps key safety

Browser keys must be restricted to approved HTTP referrers and only required
Google Maps Platform APIs. Server and database credentials must never use a
`NEXT_PUBLIC_` prefix or enter browser bundles.

## Shutdown

Run `make down`. The named Postgres volume is retained for later local startup.
Delete it only through an explicit, reviewed recovery procedure.
