# Data dictionary

## Static GitHub Pages records

`public-data.js` contains the published browser-only facility array:

- `facilities`, keyed by CMS Certification Number and containing normalized CMS
  listing attributes plus Census geocode status, matched address, latitude,
  longitude, benchmark, and source snapshot date.

The browser loads a runtime candidate pool from National Transit Map fields for
the visible zoom-10-or-closer viewport. The public `stops` array contains the
deduplicated union of up to three closest eligible stops selected for each
visible facility. Nearest-stop distance and `closest_3_stops_within_threshold`
counts are derived in the browser from each facility's own selection and are
never represented as official source measurements. Exported records include
`data_mode=public_snapshot`.

The transit-distance heatmap does not add a stored source field. Its runtime
points contain the facility CCN, coordinates, nearest eligible transit-stop
distance, nearest stop name, and a normalized color value. Relative mode uses
the visible 10th and 90th percentile nearest-stop distances; meter mode uses
the configured fixed cutoffs. The normalized value is assigned to one of five
color bands for display.

Transit-filter state is represented by `stopQuery`, `stopType`, `wheelchair`,
`agency`, and `withinRadius`. CSV exports record these values as
`transit_stop_name_or_id_filter`, `transit_stop_type_filter`,
`transit_wheelchair_filter`, `transit_agency_filter`, and
`transit_limited_to_active_threshold` so filtered results retain their analysis
context.

`sample-data.js` retains fictional deterministic facilities and stops for
fallback testing only.

## Production schema

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
