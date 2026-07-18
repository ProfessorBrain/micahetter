# Critical Structures

Critical Structures is a static, data-driven anatomy learning game. Players reveal diminishing-value clues, choose a candidate structure, navigate from a whole-body view into progressively closer boards, then place and orient the structure. The first release is intentionally a polished vertical slice: all seven requested zones are represented by two provisional structures, while the game engine stays independent of any individual anatomy record.

> All included anatomy content and placeholder artwork is provisional until reviewed by an anatomy educator.

## Features

- Single-player sessions with locally saved mastery, review, zone performance, streaks, and clue use
- Pass-and-play for 2–6 local players, including optional steal attempts
- Novice, intermediate, advanced, and expert candidate/clue behavior
- Data-driven structure selection, distractor ranking, clues, zoom paths, tolerances, rotation, and feedback
- Click-to-place, drag-and-drop, touch, and keyboard controls
- Multiple hidden zoom regions on each broad board, including anatomically incorrect choices
- Placement outcomes for perfect, correct, near miss, wrong region, wrong orientation, and wrong structure
- High contrast, text enlargement, reduced motion, mute, screen-reader announcements, and enlarged tolerance
- `?debug=1` overlays, live coordinates, forced targets/clues, and polygon authoring

## Run locally

Use Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server. The app needs no account, backend, paid dependency, or external runtime service.

## Test and build

```bash
npm test
npm run build
```

The tests cover spinner exhaustion, score calculation, zone-aware target selection, candidate construction, placement/orientation evaluation, multiplayer turns, product markup, and content coverage.

## Static-host deployment

Run `npm run build`, then deploy the generated `dist` output to a static/edge host that supports the included worker entry. The included Sites configuration requires no database or object storage. For a traditional static host, the public data, JavaScript, and assets are already static; serve the generated application shell at `/` and preserve the `/data`, `/js`, and `/assets` paths.

## Project map

- `app/page.tsx` — semantic HTML application shell
- `app/globals.css` — responsive visual system and accessibility modes
- `public/js/` — vanilla JavaScript ES modules
- `public/data/structures.json` — anatomy content records
- `public/data/boards.json` — normalized board and zoom-zone definitions
- `public/data/structure.schema.json` — JSON Schema for structure records
- `public/assets/` — original provisional SVG boards and pieces
- `CONTENT_AUTHORING.md` — safe content and geometry authoring workflow
- `tests/` — automated logic and deliverable checks

## Content review

Do not treat the demonstration content as clinical advice or publish it as reviewed curriculum. Before educational release, have a qualified anatomy educator validate naming, relationships, clue wording, target geometry, distractor similarity, layer choice, and placement tolerances.
