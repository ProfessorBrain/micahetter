# Brainstem Mastermind
## Digital Proof-of-Concept Design Document

**Primary audience:** Clinical medical students and neurology residents  
**Educational goal:** Teach structure-based brainstem localization  
**Facilitation model:** Facilitator selects cases and controls clue release  
**Technical target:** One self-contained HTML file with embedded CSS, JavaScript, and case data

## 1. Executive summary

The proof of concept demonstrates the core learning loop: a facilitator presents a curated case, players choose an examination domain, a clinical finding is revealed, and the active player places a digital lesion wand into one of 24 brainstem locations. The application scores the four localization coordinates and attaches a **0-4 feedback tag** to the wand without identifying which coordinates are correct.

Players discuss openly, but each turn ends with an individual or team guess. The first **4-of-4** guess wins. The goal is localization, not pathology diagnosis.

## 2. Goals

- Localize by **side**, **level**, **medial/lateral**, and **ventral/dorsal**.
- Reason from affected and spared structures.
- Use long tracts as inclusion and hard-exclusion constraints, not answer locations.
- Support motor, sensory, cranial-nerve/ocular-motor, cerebellar, autonomic, bulbar, gait/postural, and upper-motor-neuron/reflex findings.
- Preserve wand placement and Mastermind feedback as the central interaction.
- Run locally without a server or account.

### Non-goals

- Diagnosing pathology.
- Random case generation.
- Rare, experimental, or weakly localizable templates.
- Multi-cell lesions, probabilistic findings, imaging interpretation, or production multiplayer.

## 3. Proof-of-concept scope

- One `index.html` file.
- Desktop-first, tablet-compatible.
- 2-5 named players or teams.
- 24 selectable brainstem locations.
- Facilitator-selected curated cases.
- Progressive clue reveal by exam domain.
- One mandatory wand placement per turn.
- Automatic 0-4 feedback.
- Guess history, win state, and debrief.
- **16 accessible cases**: eight strong anatomical patterns mirrored left/right.

## 4. Accessible case families

1. Ventromedial midbrain: oculomotor-peduncular hemiparesis.
2. Dorsomedial midbrain: oculomotor-cerebellar or vertical-gaze/MLF pattern.
3. Ventromedial pons: pure motor, dysarthria-clumsy hand, or ataxic hemiparesis.
4. Ventrolateral pons: curated sensorimotor/pontocerebellar pattern.
5. Dorsomedial pons: one-and-a-half or facial-colliculus syndrome.
6. Dorsolateral pons: lateral pontine/AICA or crossed sensory pattern.
7. Ventromedial medulla: medial medullary syndrome.
8. Dorsolateral medulla: lateral medullary syndrome.

Each family has a right and left case. Other cells remain available as wrong guesses but are not correct-answer locations in the initial build.

## 5. Four-coordinate answer

- **Side:** left or right.
- **Level:** midbrain, pons, or medulla.
- **Medial-lateral:** medial or lateral.
- **Ventral-dorsal:** ventral or dorsal.

The visible interface may say “Anterior (ventral)” and “Posterior (dorsal),” but internal data should use `ventral` and `dorsal`.

## 6. Core game loop

1. Facilitator selects a case and starts the opening stem.
2. Active player chooses an available exam domain.
3. Facilitator reveals that clinical finding.
4. Players discuss affected/spared structures and rule-outs.
5. Active player selects one of 24 cells and places a digital wand.
6. Facilitator can score, request reconsideration, or cancel.
7. App computes 0-4 correct coordinates and attaches the number to the wand.
8. A score of 0-3 advances to the next player.
9. A score of 4 ends the case and opens the debrief.

## 7. Exam domains

- Motor
- Sensory
- Cranial-nerve and ocular-motor
- Cerebellar and coordination
- Autonomic
- Bulbar
- Gait and postural
- Upper-motor-neuron and reflex

Each domain has an `unlockAfterGuess` value. At least three domains begin available; decisive clues may unlock after one or two guesses. The facilitator can override the sequence.

## 8. Display architecture

### Facilitator Console

Private view containing:

- Case selection and player setup.
- Hidden four-coordinate answer.
- Affected and spared structures.
- Locked/available/revealed exam domains.
- Clinical finding and facilitator-only explanation.
- Score, reconsideration, rescue clue, reset, and debrief controls.

### Player Display

Public/projected view containing:

- Opening stem and persistent revealed findings.
- Active player and current phase.
- Available/locked exam domains.
- 24-cell brainstem tower.
- Colored/labeled wands with 0-4 tags.
- Guess history and status messages.
- Optional generic anatomy reference drawer.

Use `BroadcastChannel` to synchronize two windows from the same HTML file. Provide a single-window fallback with a collapsible facilitator drawer.

## 9. Digital board

Use three stacked axial slices rather than a rotatable 3D model:

- Midbrain
- Pons
- Medulla

Each level has eight cells:

- Horizontal: left lateral, left medial, right medial, right lateral.
- Vertical: dorsal row above ventral row.

Example IDs:

```text
midbrain-left-medial-ventral
pons-right-medial-dorsal
medulla-left-lateral-dorsal
```

## 10. Digital wands

- Peg/pin/wand emerging from the guessed cell.
- Player color plus initials/number/pattern.
- Sequential guess number.
- Attached numeric feedback tag `0` through `4`.
- Multiple wands in one cell are offset.
- Show recent 12-16 wands on the board; preserve every guess in history.

## 11. Scoring

```js
let score = 0;
if (guess.side === answer.side) score += 1;
if (guess.level === answer.level) score += 1;
if (guess.medialLateral === answer.medialLateral) score += 1;
if (guess.ventralDorsal === answer.ventralDorsal) score += 1;
```

Only the total is shown. A score of 4 triggers the win state.

## 12. Case schema

```js
{
  id: "vm-midbrain-right-weber-01",
  title: "Oculomotor-peduncular hemiparesis",
  difficulty: "core",
  answer: {
    side: "right",
    level: "midbrain",
    medialLateral: "medial",
    ventralDorsal: "ventral"
  },
  openingStem: "A patient develops abrupt diplopia and left-sided weakness.",
  affectedStructures: [
    "right oculomotor fascicles",
    "right cerebral peduncle corticospinal fibers"
  ],
  sparedStructures: [
    "superior cerebellar peduncle fibers",
    "spinothalamic tract",
    "vertical-gaze network"
  ],
  domains: [
    {
      id: "motor",
      label: "Motor examination",
      unlockAfterGuess: 0,
      finding: "The left arm and leg are weak with an extensor plantar response.",
      facilitatorExplanation: "Contralateral corticospinal involvement supports a ventral right brainstem lesion."
    },
    {
      id: "cranial",
      label: "Cranial-nerve examination",
      unlockAfterGuess: 1,
      finding: "The right eye is ptotic, abducted, and depressed with a dilated pupil.",
      facilitatorExplanation: "Ipsilateral CN III fascicular involvement identifies the right midbrain."
    }
  ],
  rescueClue: "There is no limb dysmetria or vertical-gaze palsy.",
  debrief: [
    "CN III establishes the right midbrain.",
    "Contralateral weakness establishes ventral peduncular involvement.",
    "Absence of cerebellar findings argues against a dorsal tegmental lesion."
  ]
}
```

## 13. State machine

`setup → opening → choose-domain → discuss → place-wand → facilitator-confirmation → feedback → next-turn | win → debrief`

The facilitator can request reconsideration before scoring.

## 14. Reference content

Keep references separate from the board:

- Level-specific tract cards.
- Cranial-nerve nuclei/fascicle summary.
- Long-tract finding-to-location summary.
- Intrinsic midbrain structure summary.
- Medial/lateral and ventral/dorsal definitions.

Do not reveal case-specific anatomy before debrief.

## 15. Visual direction

Use restrained semi-skeuomorphism:

- Digital tabletop teaching model.
- Clean clinical interface.
- Subtle depth for stacked slices.
- Physical-looking wands and feedback tags.
- Accessible player palette plus labels/patterns.
- Brief clue-reveal and wand-insertion animations.

## 16. Technical requirements

- Plain HTML/CSS/vanilla JavaScript.
- Single self-contained file.
- Embedded case data.
- No server, database, account, API, or build process.
- Offline operation.
- `BroadcastChannel` for two-window sync, same-window fallback.
- Desktop/tablet; phone optimization not required.

Suggested modules:

- `caseLibrary`
- `gameState`
- `scoringEngine`
- `facilitatorController`
- `playerRenderer`
- `boardRenderer`
- `syncChannel`
- `referenceDrawer`

## 17. Accessibility

- Keyboard-operable board cells.
- Accessible names for every coordinate.
- Color never used alone.
- Numeric and spoken feedback descriptions.
- Text states for locked/revealed domains.
- `aria-live` for clues and feedback.
- WCAG AA contrast.
- Reduced-motion support.
- Usable at 200% zoom.

## 18. Debrief

After a 4-of-4 guess:

- Highlight the answer.
- Display the complete coordinate.
- List affected structures and positive findings.
- List spared structures and ruled-out alternatives.
- Replay clues and guesses.
- Identify the most discriminating clue.
- Explain the closest distractor.

## 19. Acceptance criteria

- Opens locally from `index.html`.
- Supports 2-5 players.
- Facilitator controls case and clues.
- Player display never leaks hidden information.
- All 24 cells selectable.
- Every turn requires one wand placement.
- Every guess receives accurate 0-4 scoring.
- Feedback is visibly attached to the wand and logged.
- Reconsideration works before scoring.
- 4-of-4 triggers winner and debrief.
- Initial pool contains no rare or experimental cases.
- Runs fully offline.

## 20. Implementation sequence

1. Build case schema with two cases.
2. Build 24-cell board.
3. Build player setup and turn state.
4. Add domain unlock/reveal.
5. Add wands, scoring, and tags.
6. Add facilitator/player synchronization.
7. Add win and debrief.
8. Load all 16 accessible cases.
9. Add reference cards and accessibility.
10. Playtest and revise.

## Final Codex brief

Create a single self-contained HTML file implementing this Brainstem Mastermind proof of concept. Use plain HTML, CSS, and vanilla JavaScript. Include facilitator-controlled clue release, a separate or fallback player display, 2-5 players, progressive exam-domain clues, a 24-cell brainstem board, mandatory wand placement, automatic 0-4 Mastermind scoring, visible wand feedback tags, win detection, and debrief. Embed only accessible core cases; omit rare and experimental templates. Keep hidden answers and facilitator explanations out of the player display until debrief.
