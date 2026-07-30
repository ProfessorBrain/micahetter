# ETL pipelines

ETL implementation begins after the platform and database fixture epics.
Planned entry points are:

- `fetch_cms.py`
- `fetch_ntm_stops.py`
- `geocode_facilities.py`
- `load_database.py`
- `compute_metrics.py`
- `qa_report.py`

No placeholder script returns fabricated source data. Each future pipeline must
record a source snapshot before processing, preserve raw artifacts, validate
schemas and row counts, and avoid replacing the last successful snapshot on
failure.
