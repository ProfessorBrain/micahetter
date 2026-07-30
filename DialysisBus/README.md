# Dialysis & Transit Explorer

The Dialysis & Transit Explorer is a read-only research application for
examining geographic proximity between Medicare-certified dialysis facilities
and fixed-route public transportation stops. Phase 1 measures straight-line
distance only; it does not establish that a transit trip is available,
accessible, safe, or feasible.

This repository currently contains **Epic 1: Repository and local platform**:

- a Next.js-compatible TypeScript web application with a responsive map shell;
- Google Maps JavaScript API and deck.gl integration points;
- a FastAPI service with process and database health checks;
- PostgreSQL/PostGIS local infrastructure;
- frontend, API, rendered-output, and end-to-end test scaffolding;
- source, operations, methods, and data-dictionary documentation.

Data ingestion, production database tables, spatial metrics, analytics APIs,
and source-backed map layers intentionally begin in later epics.

## Repository layout

```text
apps/web/          Web application
services/api/      FastAPI service
pipelines/         ETL entry points (introduced in Epics 3–5)
data/              Local raw, processed, and override files
db/                PostgreSQL migrations and fixture seeds
infra/             Docker Compose and service images
docs/              Design, methods, operations, and data dictionary
tests/fixtures/    Cross-service deterministic fixtures
```

## Prerequisites

- Docker Desktop with Compose v2
- Node.js 22 or later for running the web app outside Docker
- Python 3.11 or later for running the API outside Docker
- A Google Maps Platform browser key and vector map ID for the live basemap

The interface remains usable as an explicitly labeled preview when map
credentials are absent.

## Quick start with Docker

1. Copy `.env.example` to `.env`.
2. Replace the local database passwords.
3. Optionally add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and
   `NEXT_PUBLIC_GOOGLE_MAP_ID`.
4. Run `make bootstrap`.
5. Run `make dev`.
6. Open `http://localhost:3000`.

The API documentation is available at `http://localhost:8000/docs`.

Health endpoints:

- `GET http://localhost:8000/api/v1/health/live`
- `GET http://localhost:8000/api/v1/health/ready`

The readiness endpoint returns `503` until Postgres is reachable.

## Run without Docker

### Web

```text
cd apps/web
npm ci
npm run dev
```

Create `apps/web/.env.local` when using Google Maps locally:

```text
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_GOOGLE_MAP_ID=...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Restrict the browser key to approved HTTP referrers and only the Maps
JavaScript and Places APIs required by the application.

### API

```text
python -m venv .venv
.venv/Scripts/python -m pip install -r services/api/requirements.lock
.venv/Scripts/python -m uvicorn app.main:app --app-dir services/api --reload --port 8000
```

On macOS or Linux, replace `.venv/Scripts/python` with
`.venv/bin/python`.

## Validation

```text
make test
make lint
cd apps/web
npm run build
npm run test:rendered
```

The Playwright scenario uses the development server:

```text
cd apps/web
npm run e2e
```

## Data and privacy

No patient data, user accounts, or persistent address-search history belong in
Phase 1. The authoritative facility source is CMS, the authoritative transit
stop source is USDOT/BTS, and facility address geocoding uses the U.S. Census
Bureau. Google Places content is used only for active navigation interactions
and is not an authoritative facility or stop dataset.

See [docs/DESIGN.md](docs/DESIGN.md), [docs/METHODS.md](docs/METHODS.md), and
[docs/OPERATIONS.md](docs/OPERATIONS.md) for the implementation contract.
