# Data and methods

## Purpose

The Dialysis & Transit Explorer is an exploratory, read-only tool. It will
compare Medicare-certified dialysis-facility locations with public
transportation stops and report reproducible geographic-proximity measures.

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

## Epic 1 status

The current interface uses clearly labeled illustrative symbols when no source
snapshot exists. No illustrative count is presented as a real facility or stop
measurement. Source dates, row counts, and hashes will appear only after the
ETL and validation epics are complete.
