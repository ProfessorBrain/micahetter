# NeurAnki Online

A static, single-deck study app for the NeurAnki neurology resident education deck. No account, backend, analytics, or external JavaScript dependencies. The ready-to-use browser bundle is included.

## Run

Double-click `index.html` in this folder to start studying. Keep `app.bundle.js`, `styles.css`, `favicon.svg`, and `media/` alongside it. No server or installation is needed.

For an optional HTTP preview, use Node 24 or later:

```sh
npm start
```

Open `http://127.0.0.1:4173`. Any static HTTP server also works. The same page supports direct `file://` opening and hosted HTTP(S) use. Browser progress for a local file and a hosted URL is separate; export/import a backup when moving between them.

## Publish

Upload `index.html`, `styles.css`, `favicon.svg`, `app.bundle.js`, and the complete `media/` directory together to a static host. The bundle includes the deck data; visitors do not need the source modules or JSON. Relative URLs support hosting under `/NeurAnkiOnline/` in the existing micahetter.me site. There is no service worker. Images load when needed rather than downloading the full deck media at startup.

## After editing source or reimporting the deck

Run `npm run build` using Node 24 or later, then include the updated `app.bundle.js` when publishing. The dependency-free build packs the source modules and deck into a classic script so browsers can also open the site directly from disk.

## Study behavior

- Daily due reviews, learning steps, and an adjustable new-card limit (20 per day by default, shared across topics).
- Anki-like SM-2 scheduling with Again / Hard / Good / Easy; this is not Anki/FSRS compatibility or AnkiWeb sync.
- New cards use 1-minute and 10-minute steps, graduate to 1 day with Good or 4 days with Easy. Related clozes can optionally wait until the next local calendar day; this is adjustable in Study settings.
- Reviews become available on their local due day; learning waits until its exact timestamp.
- Ratings save immediately in IndexedDB. Atomic transactions protect simultaneous tabs. Last-rating undo restores scheduling, daily totals, and sibling burial.
- Search across original note text, tags, and card codes; previews do not affect scheduling. Suspended cards can be resumed from Browse.
- JSON progress export/import with schema, card identity, scheduling, and history validation. Data stays in the browser and device; clearing site data removes it. Export a backup before moving devices or changing the hosted origin.
- Space reveals; 1–4 rate; Z undoes. Images support click/Enter zoom. Occlusion originals stay hidden until both the image and mask load.

## Source content

The supplied package contains 5,185 cards, 2,973 notes, 13 topics, and 762 original media files. Original note wording and media bytes are preserved. The viewer sanitizes source HTML, adapts layout and colors for legibility, and implements clozes and image occlusion without executing the original template scripts.

107 source cards have no complete matching cloze deletion for their saved ordinal. They remain searchable in Browse → Source issues; 5,078 cards are eligible for daily study. The app does not invent missing questions or change the original medical wording. The import report records the affected IDs. There are no missing local image references. 35 image references use original external HTTPS URLs and depend on those sites remaining available.

`data/import-report.json` contains the source package SHA-256, model inventory, media sizes and checksums, and all source issue details.

## Reimport

The importer uses Python's standard library and Node 24's Zstandard support. It handles the compressed `collection.anki21b` database and protobuf media manifest.

```sh
python scripts/import_deck.py /path/to/deck.apkg --node /path/to/node
```

Run `python scripts/import_deck.py --help` for output options. The original APKG is not shipped in the website.

## Verify

```sh
npm test
python -m unittest discover -s tests -p test_import_deck.py -v
```

Tests cover learning/review transitions, lapses, local-day and DST behavior, queue priority, daily limits, sibling burial, suspensions, backup validation, nested clozes, import integrity, media hashes, and source issue classification.
