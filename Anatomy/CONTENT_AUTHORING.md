# Content Authoring Guide

Critical Structures separates anatomy content from game behavior. Add or revise records in `public/data/structures.json`; do not add structure-specific branches to the JavaScript engine.

## Add a structure

1. Duplicate a record in the same anatomy zone.
2. Assign a lowercase, hyphenated, globally unique `id`.
3. Add a reviewed display name, aliases, system, zone, and subzones.
4. Choose `pieceType`: `muscle`, `organ`, or `pathway`.
5. Add a `pieceAsset` and tags that describe meaningful distractor similarity.
6. Author at least four clues. Use only supported clue keys from the schema.
7. Set `requiredZoomPath` from `whole-body` to the `finalBoard`.
8. Define the normalized target center/radius, overlap requirement, ideal rotation, and tolerance.
9. Add near-miss geometry and concise correct/review feedback.
10. Validate against `public/data/structure.schema.json`, then run the tests.

All coordinates use a 0–100 normalized board coordinate space. Rotation is in degrees, clockwise from the unrotated asset.

## Author target geometry

Open the app with `?debug=1`, navigate to the intended final board, and select **Trace polygon**. Click the silhouette boundary in order. Choose **Copy points** to export normalized coordinates. Add those points to a structure or convert them to an SVG path during asset production.

The debug overlay also exposes board and target IDs, pointer coordinates, estimated overlap, and rotation difference. A content reviewer can force a target and clue category from the controls below the board.

## Author zoom zones

Add zones in `public/data/boards.json` with `id`, `label`, `x`, `y`, `w`, and `h`. Broad boards should contain multiple plausible regions. Set `wrong: true` only as a developer hint; this value is not shown during normal play.

Every `requiredZoomPath` entry must match a board ID. The last entry must equal `finalBoard`.

## Clue keys

Supported categories are: `name`, `function`, `dysfunction`, `origin`, `insertion`, `innervation`, `bloodSupply`, `histology`, `substance`, `anatomicalRelationship`, `development`, `imaging`, `clinical`, `surfaceLandmark`, and `pathway`.

Difficulty selects preferred categories, but the spinner falls back to any authored unused clue so a round cannot dead-end. A category disappears after it is drawn.

## Placement calibration

- `target.radius` controls broad center tolerance.
- `minimumOverlap` should usually fall between `0.60` and `0.80`.
- `idealRotation` is the desired clockwise angle.
- `rotationTolerance` is the maximum acceptable angular difference.
- `nearMissZones` should cover plausible adjacent anatomy without overlapping the correct target.
- `attachmentPoints` may define muscle origin/insertion checks.
- `pathEndpoints` may define a nerve or vessel path.

Calibrate Novice first. The game automatically tightens tolerance for Advanced and Expert and can enlarge tolerance as an accessibility option.

## Review checklist

- Confirm anatomical facts, spelling, aliases, and terminology.
- Confirm the clue uniquely supports the target at the intended difficulty.
- Confirm distractors are plausible without being misleading for the learner level.
- Confirm side, view, layer, and orientation are explicit where needed.
- Confirm the correct path and at least one plausible wrong zoom path work.
- Test keyboard-only, touch-style click-to-place, and drag/drop interaction.
- Mark review approval outside the demo file before removing the provisional banner.
