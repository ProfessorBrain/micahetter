# MedicaLogical

An HTML-first adult clinical logic puzzle spanning the major medical specialties, designed for medical students and residents.

## Open the game

Open [`index.html`](./index.html) directly in a web browser. It is the project entry point and contains the layout, styling, and game engine. [`specialties.js`](./specialties.js) supplies the clinical case library. No installation, build step, web server, or internet connection is required.

## Included gameplay

- Four-patient, medium-difficulty logic puzzle
- 27 selectable adult specialty modes with 187 clinical cases
- Single-specialty and mixed-specialty puzzle generation
- Diagnosis, mechanism-of-action treatment, and symptom knowledge clues
- Compact appointment-by-appointment logic table
- Left-column clue panel beside the clinic schedule
- Five active rows: Name, one randomized demographic, one history, and two distinct clinical rows
- Random morning (8–11 AM) or afternoon (1–4 PM) appointment blocks
- New names, specialty cases, row assignments, option order, and clue order for every generated puzzle
- Clues that automatically mark themselves applied or conflicting
- Previously used row options disabled in the remaining dropdowns
- Specialty selection contained in the Settings panel
- Easy, Medium, and Hard clue-generation modes
- Age- and sex-compatible patient/case pairing
- Automatic completion detection
- Animated case-closed celebration after a correct solution
- Responsive mobile layout and keyboard-accessible controls

The existing application scaffold is optional supporting infrastructure. The playable entry point remains `index.html`.
