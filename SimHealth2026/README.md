# HELLthcare Simulator

**A small American healthcare nightmare simulator.**

You are the new administrator of fictional St. Dymphna Memorial, a 60-bed nonprofit hospital. Across five impossible shifts, you must admit patients, preserve staffed beds, arrange safe discharges, pay the entire hospital team, fight insurers, interpret government payment rules, and keep enough cash on hand to open tomorrow.

Each session lasts about 3–5 minutes. The crises are shuffled on every run, choices change hospital operations, and nine replayable outcomes can be discovered—including a panic-button sale to private equity that wins the game for the administrator and destroys the hospital for everyone else.

## Play locally

Double-click `index.html`. That is all—the game has no build step, package installation, account, server, or internet requirement.

If your browser restricts local files, serve this folder with any basic static server. For example:

```powershell
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Project files

- `index.html` — semantic page shell and metadata
- `styles.css` — the complete responsive visual design
- `game.js` — crisis data, policy effects, endings, panels, and game state

Progress on discovered endings is saved in the browser's local storage. Clearing site data resets it.

## Content note

This is fictional satire informed by real U.S. healthcare policy concepts. Organizations, characters, figures, and incidents in the game are invented. The Sources panel links to public background material; the game is not medical, legal, or policy advice.
