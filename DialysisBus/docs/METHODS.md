# Data and methods

## Purpose

The Dialysis & Transit Explorer is an exploratory, read-only tool. It will
compare Medicare-certified dialysis-facility locations with public
transportation stops and report reproducible geographic-proximity measures.

## Demonstration dataset

The root GitHub Pages site currently uses deterministic synthetic records in
`sample-data.js`. The fixture fields mirror the planned CMS, Census, and
USDOT/BTS contracts so map, filter, detail, analytic, and export behavior can be
tested without implying that the displayed values are official findings.
Facility-to-stop distances are calculated in the browser with the haversine
formula on a spherical Earth radius of 6,371,008.8 meters. Production results
must instead use PostGIS geography operations as specified below.

## Planned authoritative sources

- Dialysis facilities: CMS Provider Data Catalog dataset `23ew-n7w9`
- Facility address geocoding: U.S. Census Geocoder
- Transit stops: USDOT/BTS National Transit Map Stops
- Basemap and active place navigation: Google Maps Platform

Google Places content is not an authoritative facility or transit source and
must not be persisted beyond the active navigation interaction.

## Distance measure

Phase 1 uses geodesic straight-line distance in meters. PostGIS geography
operations will calculate nearest-stop distance and counts within 250, 400,
800, and 1,600 meters, plus validated custom radii from 100 to 5,000 meters.

## Interpretation

Stop proximity is not proof of practical transit access. It does not measure:

- route or service availability;
- operating schedules or dialysis-shift compatibility;
- walking paths, barriers, safety, or weather exposure;
- wheelchair accessibility or paratransit eligibility;
- fares, transfers, reliability, or total journey time.

Facility coordinates produced by address-range geocoding are approximate.
National Transit Map coverage and freshness vary by agency and snapshot.

## Static demonstration status

The interface contains synthetic facility and stop records across seven states,
including matched, overridden, tied, and unmatched geocoding cases. Every
record name and exported row is labeled as demonstration data. Official source
dates, row counts, hashes, and validation reports will appear only after the
production ETL and validation epics are complete.
