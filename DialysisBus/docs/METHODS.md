# Data and methods

## Purpose

The Dialysis & Transit Explorer is an exploratory, read-only tool. It will
compare Medicare-certified dialysis-facility locations with public
transportation stops and report reproducible geographic-proximity measures.

## Published public-data snapshot

The root GitHub Pages site publishes `public-data.js`, generated from CMS
Provider Data Catalog dataset `23ew-n7w9` and the U.S. Census Geocoder
`Public_AR_Current` benchmark. The current manifest contains 7,490 CMS records,
of which 6,672 received mappable Census coordinates. Transit stops are queried
from the USDOT/BTS National Transit Map ArcGIS feature service for the active
viewport at zoom level 10 or closer. After applying active transit filters, the
site selects up to the three closest stops for every visible, filtered facility.
The displayed transit layer is the deduplicated union of those selections, so
a stop selected for multiple facilities appears once. Dense responses are
capped at 2,000 candidates and explicitly ask the user to zoom further.

Facility-to-stop distances are calculated in the browser with the haversine
formula on a spherical Earth radius of 6,371,008.8 meters. Each facility's
nearest-stop distance and active-radius count use only that facility's selected
three stops from the current viewport candidate pool. Scheduled production
results should instead use PostGIS geography operations as specified below.

Transit filters operate on the loaded candidate pool before the three closest
stops are selected for each facility. The browser supports case-insensitive
stop name or ID search plus exact stop-type, wheelchair-indication, and
agency/NTD-ID filters. The optional active-radius constraint then excludes a
facility's selected stops when their geodesic distance exceeds the current
threshold. Candidate counts refer to source records; displayed counts refer to
the deduplicated union of the per-facility selections.

## Public sources

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

## Transit-distance heatmap

The optional transit-distance heatmap is calculated entirely in the browser
from each visible, filtered facility's nearest eligible transit stop. It uses
the same per-facility closest-stop selection as the Analytics table and detail
panel, so stop-name/ID, type, wheelchair, agency, and optional active-radius
filters affect the heatmap consistently. A facility is colored whenever its
nearest-stop distance is available, including when it is the only visible
facility.

Relative mode uses the 10th and 90th percentiles of the visible nearest-stop
distances as the green and red endpoints. Meter-range mode applies the four
configured cutoffs directly to each nearest-stop distance. Both modes use five
bands: green, a color halfway between green and yellow, yellow, a color halfway
between yellow and red, and red. Values outside the endpoints are clamped. The
legend reports the active distances, and facility marker descriptions expose
the individual nearest eligible transit-stop distance while the layer is
active.

Relative colors can change when the map extent or filters change. The heatmap
does not measure travel time, road distance, route availability, schedule
compatibility, or pedestrian accessibility.

## Interpretation

Stop proximity is not proof of practical transit access. It does not measure:

- route or service availability;
- operating schedules or dialysis-shift compatibility;
- walking paths, barriers, safety, or weather exposure;
- wheelchair accessibility or paratransit eligibility;
- fares, transfers, reliability, or total journey time.

Facility coordinates produced by address-range geocoding are approximate.
National Transit Map coverage and freshness vary by agency and snapshot.

## Static-site status

`data/source-manifest.json` records the generated timestamp, source endpoints,
CMS snapshot date, row count, geocoding benchmark, matched count, and unresolved
count. `sample-data.js` remains a deterministic fallback for offline interface
tests but is not selected when the public snapshot loads.
