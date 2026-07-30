# Operations

## Local startup

1. Copy `.env.example` to `.env`.
2. Replace the local database passwords.
3. Add restricted Google Maps credentials if a live basemap is required.
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
