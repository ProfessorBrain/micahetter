# Data dictionary

The authoritative Phase 1 schema is defined in `DESIGN.md`, Section 10. Epic 1
does not yet create production data tables; this document records the table
contracts that Epic 2 will implement and migrate.

| Table | Purpose | Primary identifier |
|---|---|---|
| `source_snapshots` | Retrieval, hash, row-count, and load-status provenance | UUID |
| `dialysis_facilities` | Normalized CMS facility records and stored geocodes | CMS CCN |
| `transit_stops` | Normalized BTS National Transit Map stop records | Internal bigint |
| `facility_stop_metrics` | Nearest-stop and preset-radius facility metrics | Facility CCN |

Required spatial fields use `geometry(Point,4326)`. Reported meter-based
distances use geography casts in PostGIS; Web Mercator planar distance is not
an acceptable substitute.

Unresolved facility geocodes remain represented with explicit status values.
They are not silently dropped and do not participate in spatial analytics.
