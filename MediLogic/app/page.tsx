"use client";

import { useMemo, useState } from "react";

type Mark = "blank" | "no" | "yes";
type CategoryKey =
  | "slot"
  | "presentation"
  | "investigation"
  | "diagnosis"
  | "treatment";

type Option = {
  id: string;
  label: string;
  short: string;
};

type FinalRow = Record<Exclude<CategoryKey, "slot"> | "patient", string>;

const patients: Option[] = [
  { id: "dorian", label: "Dorian Knox", short: "Knox" },
  { id: "clara", label: "Clara Finch", short: "Finch" },
  { id: "amara", label: "Amara Vale", short: "Vale" },
  { id: "evelyn", label: "Evelyn March", short: "March" },
  { id: "basil", label: "Basil Reed", short: "Reed" },
];

const categories: Record<CategoryKey, { label: string; eyebrow: string; options: Option[] }> = {
  slot: {
    label: "Consult time",
    eyebrow: "The timeline",
    options: [
      { id: "0900", label: "9:00 AM", short: "9 AM" },
      { id: "1000", label: "10:00 AM", short: "10 AM" },
      { id: "1100", label: "11:00 AM", short: "11 AM" },
      { id: "1300", label: "1:00 PM", short: "1 PM" },
      { id: "1400", label: "2:00 PM", short: "2 PM" },
    ],
  },
  presentation: {
    label: "Presentation",
    eyebrow: "What brought them in",
    options: [
      { id: "facial-pain", label: "Electric facial pain triggered by chewing", short: "Facial shocks" },
      { id: "staring", label: "Ten-second staring spells with hyperventilation", short: "Staring spells" },
      { id: "aura", label: "Rising epigastric aura, then lip smacking", short: "Aura + lip smacking" },
      { id: "optic", label: "Optic neuritis with internuclear ophthalmoplegia", short: "Optic neuritis + INO" },
      { id: "myoclonus", label: "Morning myoclonic jerks after sleep deprivation", short: "Morning jerks" },
    ],
  },
  investigation: {
    label: "Investigation",
    eyebrow: "The objective evidence",
    options: [
      { id: "vascular-loop", label: "Vascular contact at the trigeminal root entry zone", short: "Vascular contact" },
      { id: "three-hz", label: "Generalized 3-Hz spike-and-wave", short: "3-Hz spike-wave" },
      { id: "mts", label: "Left mesial temporal sclerosis", short: "Mesial temporal sclerosis" },
      { id: "dawson", label: "Dawson fingers with CSF oligoclonal bands", short: "Dawson fingers + OCB" },
      { id: "polyspike", label: "Generalized polyspike-and-wave", short: "Polyspike-wave" },
    ],
  },
  diagnosis: {
    label: "Diagnosis",
    eyebrow: "The neurologic verdict",
    options: [
      { id: "tn", label: "Trigeminal neuralgia", short: "Trigeminal neuralgia" },
      { id: "cae", label: "Childhood absence epilepsy", short: "Absence epilepsy" },
      { id: "tle", label: "Temporal lobe epilepsy", short: "Temporal lobe epilepsy" },
      { id: "rrms", label: "Relapsing-remitting multiple sclerosis", short: "RRMS" },
      { id: "jme", label: "Juvenile myoclonic epilepsy", short: "JME" },
    ],
  },
  treatment: {
    label: "Treatment",
    eyebrow: "The chosen intervention",
    options: [
      { id: "carbamazepine", label: "Carbamazepine", short: "Carbamazepine" },
      { id: "ethosuximide", label: "Ethosuximide", short: "Ethosuximide" },
      { id: "levetiracetam", label: "Levetiracetam", short: "Levetiracetam" },
      { id: "ocrelizumab", label: "Ocrelizumab", short: "Ocrelizumab" },
      { id: "valproate", label: "Valproate", short: "Valproate" },
    ],
  },
};

const solution: Record<string, Record<CategoryKey, string>> = {
  dorian: { slot: "0900", presentation: "facial-pain", investigation: "vascular-loop", diagnosis: "tn", treatment: "carbamazepine" },
  clara: { slot: "1000", presentation: "staring", investigation: "three-hz", diagnosis: "cae", treatment: "ethosuximide" },
  amara: { slot: "1100", presentation: "aura", investigation: "mts", diagnosis: "tle", treatment: "levetiracetam" },
  evelyn: { slot: "1300", presentation: "optic", investigation: "dawson", diagnosis: "rrms", treatment: "ocrelizumab" },
  basil: { slot: "1400", presentation: "myoclonus", investigation: "polyspike", diagnosis: "jme", treatment: "valproate" },
};

const clues = [
  { group: "Timeline", text: "Dorian Knox was the first consultation of the day." },
  { group: "Timeline", text: "Clara Finch was seen immediately before Amara Vale." },
  { group: "Timeline", text: "Evelyn March was seen immediately before Basil Reed." },
  { group: "Timeline", text: "Basil Reed took the final appointment." },
  { group: "Clinical", text: "The first patient described unilateral, lightning-like facial pain triggered by chewing." },
  { group: "Clinical", text: "Finch’s ten-second staring spells were reproduced by hyperventilation." },
  { group: "Clinical", text: "The rising epigastric sensation and lip smacking occurred immediately after the staring-spell case." },
  { group: "Clinical", text: "The optic neuritis and internuclear ophthalmoplegia case immediately preceded the patient with morning myoclonic jerks." },
  { group: "Evidence", text: "Neurovascular contact at a cranial nerve root entry zone belonged to the trigeminal neuralgia case." },
  { group: "Evidence", text: "Generalized 3-Hz spike-and-wave belonged to the childhood absence epilepsy case." },
  { group: "Evidence", text: "Left mesial temporal sclerosis belonged to the temporal lobe epilepsy case." },
  { group: "Evidence", text: "Dawson fingers and CSF oligoclonal bands belonged to the relapsing-remitting MS case." },
  { group: "Evidence", text: "Generalized polyspike-and-wave belonged to the juvenile myoclonic epilepsy case." },
  { group: "Pharmacology", text: "The 3-Hz case received the agent that reduces thalamic T-type calcium currents." },
  { group: "Pharmacology", text: "The mesial temporal sclerosis case received the synaptic vesicle protein 2A ligand." },
  { group: "Pharmacology", text: "The demyelinating case received the anti-CD20 monoclonal antibody." },
  { group: "Pharmacology", text: "The neurovascular-contact case received the use-dependent sodium-channel agent that stabilizes the fast-inactivated state." },
  { group: "Pharmacology", text: "The polyspike-wave case received the broad-spectrum agent that increases GABA while also affecting sodium and T-type calcium channels." },
];

const hints = [
  "Start with the timeline. Knox is first and Reed is last; then place the two immediate-before pairs.",
  "The presentation sequences lock into place once Finch and the March–Reed pair are on the timeline.",
  "Pharmacology cipher I: T-type calcium currents → ethosuximide; SV2A → levetiracetam.",
  "Pharmacology cipher II: anti-CD20 → ocrelizumab; fast-inactivated sodium channels → carbamazepine; GABA + sodium + T-type effects → valproate.",
  "Clinical cipher: facial shocks → trigeminal neuralgia; 3-Hz staring → absence; aura + automatisms → temporal lobe; optic neuritis + INO → MS; morning jerks + polyspikes → JME.",
];

const emptyFinalRow = (): FinalRow => ({
  patient: "",
  presentation: "",
  investigation: "",
  diagnosis: "",
  treatment: "",
});

function keyFor(category: CategoryKey, patient: string, option: string) {
  return `${category}:${patient}:${option}`;
}

function cycleMark(mark: Mark): Mark {
  if (mark === "blank") return "no";
  if (mark === "no") return "yes";
  return "blank";
}

function markSymbol(mark: Mark) {
  if (mark === "no") return "×";
  if (mark === "yes") return "✓";
  return "";
}

function DeductionGrid({
  categoryKey,
  marks,
  conflicts,
  onMark,
}: {
  categoryKey: CategoryKey;
  marks: Record<string, Mark>;
  conflicts: Set<string>;
  onMark: (key: string, next: Mark) => void;
}) {
  const category = categories[categoryKey];

  return (
    <section className="grid-card">
      <div className="grid-card-heading">
        <div>
          <span className="eyebrow">{category.eyebrow}</span>
          <h3>{category.label}</h3>
        </div>
        <span className="grid-instruction">tap: × → ✓ → clear</span>
      </div>
      <div className="matrix-scroll" tabIndex={0} aria-label={`${category.label} deduction grid; scroll horizontally if needed`}>
        <table className="logic-matrix">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              {category.options.map((option) => (
                <th scope="col" key={option.id} title={option.label}>
                  {option.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <th scope="row">{patient.short}</th>
                {category.options.map((option) => {
                  const key = keyFor(categoryKey, patient.id, option.id);
                  const mark = marks[key] ?? "blank";
                  return (
                    <td key={option.id}>
                      <button
                        type="button"
                        className={`mark-button mark-${mark}${conflicts.has(key) ? " is-conflict" : ""}`}
                        onClick={() => onMark(key, cycleMark(mark))}
                        aria-label={`${patient.label} and ${option.label}: ${mark === "blank" ? "unmarked" : mark === "no" ? "ruled out" : "matched"}. Activate to change.`}
                        aria-pressed={mark === "yes"}
                      >
                        {markSymbol(mark)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Home() {
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [checkedClues, setCheckedClues] = useState<Set<number>>(new Set());
  const [hintCount, setHintCount] = useState(0);
  const [notesMessage, setNotesMessage] = useState("Your notebook has not been checked yet.");
  const [finalRows, setFinalRows] = useState<Record<string, FinalRow>>(() =>
    Object.fromEntries(categories.slot.options.map((slot) => [slot.id, emptyFinalRow()])),
  );
  const [caseStatus, setCaseStatus] = useState<"idle" | "incomplete" | "wrong" | "solved">("idle");
  const [caseMessage, setCaseMessage] = useState("Complete the appointment ledger when your deductions are ready.");

  const solutionBySlot = useMemo(() => {
    return Object.fromEntries(
      Object.entries(solution).map(([patient, values]) => [
        values.slot,
        { patient, presentation: values.presentation, investigation: values.investigation, diagnosis: values.diagnosis, treatment: values.treatment },
      ]),
    ) as Record<string, FinalRow>;
  }, []);

  function toggleClue(index: number) {
    setCheckedClues((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function checkNotebook() {
    const nextConflicts = new Set<string>();
    let markedCount = 0;

    for (const [key, mark] of Object.entries(marks)) {
      if (mark === "blank") continue;
      markedCount += 1;
      const [category, patient, option] = key.split(":") as [CategoryKey, string, string];
      const isTrue = solution[patient][category] === option;
      if ((mark === "yes" && !isTrue) || (mark === "no" && isTrue)) nextConflicts.add(key);
    }

    setConflicts(nextConflicts);
    if (markedCount === 0) setNotesMessage("Add a few deductions first, detective.");
    else if (nextConflicts.size === 0) setNotesMessage(`No contradictions found in ${markedCount} marked deduction${markedCount === 1 ? "" : "s"}.`);
    else setNotesMessage(`${nextConflicts.size} contradiction${nextConflicts.size === 1 ? "" : "s"} circled in red. Revisit those notes.`);
  }

  function updateFinalRow(slot: string, field: keyof FinalRow, value: string) {
    setFinalRows((current) => ({ ...current, [slot]: { ...current[slot], [field]: value } }));
    setCaseStatus("idle");
    setCaseMessage("Complete the appointment ledger when your deductions are ready.");
  }

  function checkCase() {
    const values = Object.values(finalRows).flatMap((row) => Object.values(row));
    const missing = values.filter((value) => value === "").length;
    if (missing > 0) {
      setCaseStatus("incomplete");
      setCaseMessage(`${missing} ledger ${missing === 1 ? "entry is" : "entries are"} still blank.`);
      return;
    }

    let incorrect = 0;
    for (const slot of categories.slot.options) {
      const expected = solutionBySlot[slot.id];
      const actual = finalRows[slot.id];
      for (const field of Object.keys(expected) as (keyof FinalRow)[]) {
        if (actual[field] !== expected[field]) incorrect += 1;
      }
    }

    if (incorrect === 0) {
      setCaseStatus("solved");
      setCaseMessage("Case closed. Every patient, finding, diagnosis, and treatment is in its proper place.");
    } else {
      setCaseStatus("wrong");
      setCaseMessage(`${incorrect} ${incorrect === 1 ? "entry needs" : "entries need"} another look. Your correct entries remain undisturbed.`);
    }
  }

  function resetCase() {
    setMarks({});
    setConflicts(new Set());
    setCheckedClues(new Set());
    setHintCount(0);
    setNotesMessage("Your notebook has not been checked yet.");
    setFinalRows(Object.fromEntries(categories.slot.options.map((slot) => [slot.id, emptyFinalRow()])));
    setCaseStatus("idle");
    setCaseMessage("Complete the appointment ledger when your deductions are ready.");
  }

  return (
    <main>
      <header className="hero">
        <div className="hero-bar">
          <a className="wordmark" href="#case-brief" aria-label="The Neurologic Detective home">
            <span className="wordmark-mark" aria-hidden="true"><span /></span>
            <span>The Neurologic Detective</span>
          </a>
          <span className="case-stamp">CASE No. 017</span>
        </div>
        <div className="hero-grid" id="case-brief">
          <div className="hero-copy">
            <span className="kicker">An interactive logic mystery</span>
            <h1>The Five<br /><em>Vanishing Reflexes</em></h1>
            <p className="hero-lede">
              Five patients. Five consultations. A trail of semiology, studies, and pharmacology. Restore the chief’s scrambled case ledger before grand rounds begin.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#clues">Open the case file</a>
              <a className="text-link" href="#how-to-play">How to play <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <aside className="case-note" aria-label="Case briefing">
            <span className="paperclip" aria-hidden="true" />
            <p className="handwritten">For the consulting detective</p>
            <h2>Your charge</h2>
            <p>Match every patient to a consult time, presentation, investigation, diagnosis, and treatment.</p>
            <dl>
              <div><dt>Difficulty</dt><dd>Medium</dd></div>
              <div><dt>Knowledge</dt><dd>Clinical neurology + pharmacology</dd></div>
              <div><dt>Cases</dt><dd>5</dd></div>
            </dl>
            <div className="wax-seal" aria-hidden="true">N</div>
          </aside>
        </div>
      </header>

      <section className="how-to section-shell" id="how-to-play" aria-labelledby="how-heading">
        <div className="section-number">I</div>
        <div>
          <span className="eyebrow">Method of deduction</span>
          <h2 id="how-heading">Read. Translate. Eliminate.</h2>
        </div>
        <div className="how-steps">
          <article><span>01</span><h3>Read the evidence</h3><p>Check off clues as you use them. “Immediately before” means adjacent appointment times.</p></article>
          <article><span>02</span><h3>Decode the medicine</h3><p>The clues name mechanisms and patterns; the notebook lists the actual drugs and diagnoses.</p></article>
          <article><span>03</span><h3>Mark the notebook</h3><p>Tap once for ×, twice for ✓, and a third time to clear. Check notes whenever you wish.</p></article>
        </div>
      </section>

      <div className="case-layout section-shell">
        <section className="clues-panel" id="clues" aria-labelledby="clues-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Exhibit A</span>
              <h2 id="clues-heading">The clue dossier</h2>
            </div>
            <span className="progress-pill">{checkedClues.size} / {clues.length} used</span>
          </div>
          <ol className="clue-list">
            {clues.map((clue, index) => (
              <li key={clue.text} className={checkedClues.has(index) ? "is-checked" : ""}>
                <label>
                  <input type="checkbox" checked={checkedClues.has(index)} onChange={() => toggleClue(index)} />
                  <span className="clue-check" aria-hidden="true">✓</span>
                  <span className="clue-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="clue-copy"><span className="clue-group">{clue.group}</span>{clue.text}</span>
                </label>
              </li>
            ))}
          </ol>
        </section>

        <aside className="hint-panel" aria-labelledby="hint-heading">
          <div className="hint-heading-row">
            <span className="hint-icon" aria-hidden="true">?</span>
            <div><span className="eyebrow">A quiet word</span><h2 id="hint-heading">Need a lead?</h2></div>
          </div>
          <p>Hints become progressively more revealing. The final two decode the pharmacology and clinical ciphers.</p>
          <div className="revealed-hints" aria-live="polite">
            {hintCount === 0 ? <p className="no-hint">No hints opened.</p> : hints.slice(0, hintCount).map((hint, index) => <p key={hint}><strong>Lead {index + 1}.</strong> {hint}</p>)}
          </div>
          <button className="button button-ink" type="button" disabled={hintCount >= hints.length} onClick={() => setHintCount((count) => Math.min(hints.length, count + 1))}>
            {hintCount >= hints.length ? "All leads revealed" : "Reveal the next lead"}
          </button>
        </aside>
      </div>

      <section className="notebook-section" id="notebook" aria-labelledby="notebook-heading">
        <div className="section-shell">
          <div className="section-heading notebook-heading">
            <div>
              <span className="eyebrow">Exhibit B</span>
              <h2 id="notebook-heading">The deduction notebook</h2>
              <p>Compare each patient against the possible entries. Horizontal scrolling is available on smaller screens.</p>
            </div>
            <div className="legend" aria-label="Mark legend"><span><b className="legend-x">×</b> ruled out</span><span><b className="legend-check">✓</b> matched</span></div>
          </div>
          <div className="grid-stack">
            {(Object.keys(categories) as CategoryKey[]).map((category) => (
              <DeductionGrid key={category} categoryKey={category} marks={marks} conflicts={conflicts} onMark={(key, next) => {
                setMarks((current) => ({ ...current, [key]: next }));
                setConflicts((current) => { const nextSet = new Set(current); nextSet.delete(key); return nextSet; });
              }} />
            ))}
          </div>
          <div className="notebook-check">
            <p aria-live="polite">{notesMessage}</p>
            <button className="button button-outline" type="button" onClick={checkNotebook}>Check my notes</button>
          </div>
        </div>
      </section>

      <section className="solution-section section-shell" id="solution" aria-labelledby="solution-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The final reconstruction</span>
            <h2 id="solution-heading">Complete the appointment ledger</h2>
            <p>Place one patient and one item from every category into each time slot.</p>
          </div>
          <span className={`status-badge status-${caseStatus}`}>{caseStatus === "solved" ? "Case closed" : "Case open"}</span>
        </div>
        <div className="ledger">
          {categories.slot.options.map((slot) => (
            <fieldset key={slot.id} className="ledger-row">
              <legend><span>{slot.label}</span></legend>
              <label><span>Patient</span><select value={finalRows[slot.id].patient} onChange={(event) => updateFinalRow(slot.id, "patient", event.target.value)}><option value="">Select patient…</option>{patients.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
              {(Object.keys(categories).filter((key) => key !== "slot") as Exclude<CategoryKey, "slot">[]).map((categoryKey) => (
                <label key={categoryKey}><span>{categories[categoryKey].label}</span><select value={finalRows[slot.id][categoryKey]} onChange={(event) => updateFinalRow(slot.id, categoryKey, event.target.value)}><option value="">Select {categories[categoryKey].label.toLowerCase()}…</option>{categories[categoryKey].options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className={`case-result result-${caseStatus}`} aria-live="polite">
          <div><span className="result-mark" aria-hidden="true">{caseStatus === "solved" ? "✓" : caseStatus === "wrong" ? "!" : "i"}</span><p>{caseMessage}</p></div>
          <div className="result-actions"><button className="button button-primary" type="button" onClick={checkCase}>Check the case</button><button className="text-button" type="button" onClick={resetCase}>Reset everything</button></div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <p><strong>The Neurologic Detective</strong><br />A teaching puzzle for medical learners.</p>
          <p className="disclaimer">For education only. This fictional case is not medical advice and is not a substitute for clinical judgment.</p>
        </div>
      </footer>
    </main>
  );
}
