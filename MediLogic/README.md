# The Clinical Detective

An HTML-first, specialty-aware Einstein logic puzzle for medical students and residents.

## Open the game

Open [`index.html`](./index.html) directly in a web browser. It is the project entry point and contains the layout, styling, and game engine. [`specialties.js`](./specialties.js) supplies the clinical case library. No installation, build step, web server, or internet connection is required.

## Included gameplay

- Five-patient, medium-difficulty logic puzzle
- 28 selectable specialty modes with 140 clinical cases
- Single-specialty and mixed-specialty puzzle generation
- Diagnosis, mechanism-of-action treatment, and symptom knowledge clues
- Compact position-by-position puzzle grid
- Left-column clue panel beside the puzzle grid
- Four active rows: Name plus one randomized demographic, history, and clinical row
- New names, specialty cases, row assignments, option order, and clue order for every generated grid
- Clues that automatically mark themselves applied or conflicting
- Previously used row options disabled in the remaining dropdowns
- Progressive hints and automatic completion detection
- Animated case-closed celebration after a correct solution
- Responsive mobile layout and keyboard-accessible controls

The existing application scaffold is optional supporting infrastructure. The playable entry point remains `index.html`.
