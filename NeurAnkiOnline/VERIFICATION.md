# Verification

Completed for the first NeurAnki Online implementation.

- 37 JavaScript tests pass: classic-script delivery, scheduler, review queue, daily limits, adjustable sibling burial, backup validation, and cloze parsing.
- 9 Python tests pass: source relationships, complete cloze classification, safe import filenames, media manifest parsing, and all 762 asset checksums.
- Browser checked: start review, cloze question/answer, rating advances the queue, persisted progress after reload, undo restores the prior state, search, source issue filtering, settings persistence, Space shortcut, same-route navigation, image-occlusion masks, and image zoom.
- Desktop and phone layouts visually inspected; no blocking browser errors observed during the checked flows.
- Backup serialization and validation roundtrip are covered by tests. The export action was exercised in the embedded browser; its download completion could not be verified through the browser tool. Import file selection and reset confirmation have not been manually exercised.
- Original package: 5,185 cards / 2,973 notes / 13 populated decks / 762 media files. 107 cards remain flagged as source issues and excluded from daily reviews; original content remains browsable.
- Media contains 35 original external HTTPS image references; their future availability is outside this static app. All local references resolve.

## Publication

The working local preview is served at `http://127.0.0.1:4173` while the preview process remains running. The site is prepared for the existing repository's `/NeurAnkiOnline/` path.

Publication has not occurred. The repository remote is `https://github.com/ProfessorBrain/micahetter.git`, and the local tracked checkout matched remote `main` during inspection. A no-change push access check failed because GitHub authentication was unavailable. No commit, branch change, or remote push was performed.

## Direct-open loading fix

`index.html` now loads the checked-in `app.bundle.js` as a deferred classic script. The bundle includes the complete deck and all application modules, removing both module CORS loading and JSON fetches that browsers block under `file://`. No server is needed to open the folder's HTML file. Source modules remain editable; regenerate the bundle with `npm run build` after source or deck changes.

The new bundle was verified over HTTP: dashboard loads, answers reveal, ratings save across reload, and undo restores the daily new-card count. The bundle regression test checks classic-script syntax, complete/current source packaging, and the absence of startup fetches. Direct `file://` browser verification was blocked by the embedded browser's URL policy, so it was not performed. No browser security settings were changed.

The user is handling GitHub sign-in and publication; no additional publication attempt is needed for this fix.
