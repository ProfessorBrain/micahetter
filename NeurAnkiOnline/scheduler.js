/**
 * A small Anki-like SM-2 scheduler for this app, not an Anki sync implementation.
 * Timestamps are milliseconds. Day intervals preserve local wall-clock time,
 * including across daylight-saving changes; learning delays use elapsed minutes.
 */
const MINUTE = 60_000;
const MIN_EASE = 1.3;
const MAX_INTERVAL = 36_500;
const RATINGS = ["again", "hard", "good", "easy"];
const STAGES = ["learning", "review", "relearning"];

function timestamp(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isFinite(new Date(value).getTime())) {
    throw new RangeError(`${name} must be a valid timestamp in milliseconds.`);
  }
  return value;
}

function validateState(state) {
  if (typeof state !== "object" || Array.isArray(state) || !STAGES.includes(state.stage)) {
    throw new TypeError("The previous state must have a valid scheduling stage.");
  }
  timestamp(state.due, "state.due");
  if (!Number.isInteger(state.step) || state.step < 0 || state.step > (state.stage === "learning" ? 1 : 0)) {
    throw new RangeError("The learning step is invalid for this stage.");
  }
  if (!Number.isInteger(state.intervalDays) || state.intervalDays < 0 || state.intervalDays > MAX_INTERVAL ||
      (state.stage === "learning" ? state.intervalDays !== 0 : state.intervalDays < 1)) {
    throw new RangeError("The interval is invalid for this stage.");
  }
  if (!Number.isFinite(state.ease) || state.ease < MIN_EASE) {
    throw new RangeError(`Ease must be at least ${MIN_EASE}.`);
  }
  if (!Number.isSafeInteger(state.reps) || state.reps < 0 || state.reps >= Number.MAX_SAFE_INTEGER ||
      !Number.isSafeInteger(state.lapses) || state.lapses < 0 || state.lapses > state.reps) {
    throw new RangeError("Repetition and lapse counts must be nonnegative safe integers.");
  }
}

function interval(days) {
  return Math.min(MAX_INTERVAL, Math.max(1, Math.round(days)));
}

function afterDays(now, days) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return timestamp(date.getTime(), "Scheduled due date");
}

function easeAfter(ease, change) {
  return Math.max(MIN_EASE, Math.round((ease + change) * 100) / 100);
}

/**
 * Grade one answer. The input is never mutated; reps counts all graded answers.
 * A new card's Good advances straight to the ten-minute learning step.
 * Only an Again on a review card counts as a lapse; it resets its interval to
 * one day and requires a ten-minute relearning step before graduating again.
 */
export function schedule(previous, rating, now = Date.now()) {
  timestamp(now, "now");
  if (!RATINGS.includes(rating)) {
    throw new TypeError(`Unknown rating: ${String(rating)}.`);
  }
  if (previous != null) validateState(previous);

  const state = previous == null
    ? { stage: "learning", step: 0, due: now, intervalDays: 0, ease: 2.5, reps: 0, lapses: 0 }
    : { ...previous };
  const next = {
    stage: state.stage,
    step: state.step,
    due: state.due,
    intervalDays: state.intervalDays,
    ease: state.ease,
    reps: state.reps + 1,
    lapses: state.lapses,
  };

  const learn = (stage, step, minutes) => ({
    ...next,
    stage,
    step,
    due: timestamp(now + minutes * MINUTE, "Scheduled due date"),
  });
  const graduate = (days) => {
    const intervalDays = interval(days);
    return { ...next, stage: "review", step: 0, intervalDays, due: afterDays(now, intervalDays) };
  };

  if (state.stage === "learning") {
    if (rating === "again") return learn("learning", 0, 1);
    if (rating === "hard") return learn("learning", state.step, state.step === 0 ? 5.5 : 15);
    if (rating === "easy") return graduate(4);
    return state.step === 0 ? learn("learning", 1, 10) : graduate(1);
  }

  if (state.stage === "relearning") {
    if (rating === "again") return learn("relearning", 0, 10);
    if (rating === "hard") return learn("relearning", 0, 15);
    return graduate(rating === "easy" ? Math.max(4, state.intervalDays) : state.intervalDays);
  }

  if (rating === "again") {
    next.ease = easeAfter(state.ease, -0.2);
    next.intervalDays = 1;
    next.lapses += 1;
    return learn("relearning", 0, 10);
  }

  // Keep the three review choices ordered, except at the 100-year ceiling.
  const hard = interval(Math.max(state.intervalDays + 1, state.intervalDays * 1.2));
  const good = interval(Math.max(hard + 1, state.intervalDays * state.ease));
  const easy = interval(Math.max(good + 1, state.intervalDays * state.ease * 1.3));
  if (rating === "hard") {
    next.ease = easeAfter(state.ease, -0.15);
    return graduate(hard);
  }
  if (rating === "easy") {
    next.ease = easeAfter(state.ease, 0.15);
    return graduate(easy);
  }
  return graduate(good);
}

/** Predict the same transitions used when grading, without changing the state. */
export function ratingIntervals(state, now = Date.now()) {
  return Object.fromEntries(RATINGS.map((rating) => {
    const next = schedule(state, rating, now);
    const label = next.stage === "review"
      ? `${next.intervalDays}d`
      : `${Math.max(1, Math.round((next.due - now) / MINUTE))}m`;
    return [rating, label];
  }));
}

/** Local calendar key for daily limits and statistics, rather than a UTC date. */
export function localDay(value = Date.now()) {
  const date = new Date(timestamp(value, "timestamp"));
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
