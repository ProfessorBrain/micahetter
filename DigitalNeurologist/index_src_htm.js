/* global React, ReactDOM, htm */
const { useState, useMemo, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

// --- Utilities ---
function parseCSV(text) {
  // Simple CSV parser (handles quotes/delimiters). Good enough for well-formed CSV.
  const rows = [];
  let i=0, field="", row=[], inQ=false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i+=2; continue; }
        inQ = false; i++; continue;
      } else { field += c; i++; continue; }
    } else {
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ',') { row.push(field.trim()); field=""; i++; continue; }
      if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i+1] === '\n') i++;
        row.push(field.trim()); field="";
        if (row.length>1 || row[0] !== "") rows.push(row);
        row = [];
        i++; continue;
      }
      field += c; i++; continue;
    }
  }
  if (field.length || row.length) { row.push(field.trim()); rows.push(row); }
  if (!rows.length) return { header: [], rows: [] };
  const header = rows[0].map(h => h.trim());
  return { header, rows: rows.slice(1) };
}

function lowerKeys(obj) {
  const out = {};
  for (const k in obj) out[k.toLowerCase()] = obj[k];
  return out;
}

function mapRows(header, rows) {
  const keys = header.map(h => h.trim());
  return rows.map(r => {
    const o = {};
    for (let i=0;i<keys.length;i++) o[keys[i]] = (r[i] ?? "").trim();
    const low = lowerKeys(o);
    // normalize some common columns
    o.pace_timecourse = o.pace_timecourse || low.pace || low.timecourse || o.pace;
    o.pace_pattern    = o.pace_pattern || low.pattern || o.pattern;
    o.localization    = o.localization || low.localization || o.location;
    o.etiology        = o.etiology || low.etiology || o.cause;
    o.disease         = o.disease || low.disease || o.dx || o.diagnosis;
    return o;
  });
}

function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

function normalizeEtiologyName(n) {
  if (!n) return n;
  n = String(n).toLowerCase();
  if (n.includes("vascular")) return "Vascular";
  if (n.includes("seiz")) return "Seizure";
  if (n.includes("migra")) return "Migraine";
  if (n.includes("infect")) return "Infectious";
  if (n.includes("auto") || n.includes("inflamm")) return "Inflammatory/Autoimmune";
  if (n.includes("neoplas") || n.includes("tumor")) return "Neoplastic";
  if (n.includes("degener")) return "Degenerative";
  if (n.includes("toxic")) return "Toxic";
  if (n.includes("metabol")) return "Metabolic";
  return n[0].toUpperCase() + n.slice(1);
}

// --- App ---
function App() {
  const [data, setData] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [picked, setPicked] = useState({
    pace_timecourse: null,
    pace_pattern: null,
    localization: [],
    etiology: [],
    disease: null,
  });
  const [locked, setLocked] = useState({
    pace_timecourse: false,
    localization: false,
    etiology: false,
    disease: false,
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(new Set());

  const currentCase = data[currentIdx] || null;
  const isFinished = Object.values(locked).every(Boolean);
  const activeStepIndex = ["pace_timecourse","localization","etiology","disease"]
    .findIndex(k => !locked[k]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("digitalneurologist-cases.csv", { cache: "no-store" });
        if (!res.ok) throw new Error("CSV not found");
        const txt = await res.text();
        const { header, rows } = parseCSV(txt);
        const mapped = mapRows(header, rows);
        if (!mapped.length) throw new Error("CSV had no rows");
        setData(mapped);
        setCurrentIdx(Math.floor(Math.random()*mapped.length));
        setLoadError(null);
      } catch (e) {
        setLoadError("Could not load digitalneurologist-cases.csv. Place it next to index.html.");
      }
    })();
  }, []);

  useEffect(() => {
    // reset state on new case
    setPicked({ pace_timecourse:null, pace_pattern:null, localization:[], etiology:[], disease:null });
    setLocked({ pace_timecourse:false, localization:false, etiology:false, disease:false });
    setWrongGuesses(new Set());
    setShowCongrats(false);
  }, [currentIdx]);

  const allPace = ["Hyperacute","Acute","Subacute","Chronic"];
  const allLocalization = useMemo(() => uniq(data.map(d => d.localization)), [data]);
  const allPatterns = useMemo(() => ["—", ...uniq(data.map(d => d.pace_pattern)).filter(v => v && v !== "—")], [data]);
  const allEtiologies = useMemo(() => uniq(data.map(d => normalizeEtiologyName(d.etiology))), [data]);

  // Filtered disease options
  const diseaseOptions = useMemo(() => {
    if (!data.length || !currentCase) return [];
    const pacePick    = picked.pace_timecourse || null;
    const locPicks    = new Set(picked.localization || []);
    const patternPick = picked.pace_pattern && picked.pace_pattern !== "—" ? picked.pace_pattern : null;
    const etioPicks   = new Set((picked.etiology || []).map(normalizeEtiologyName));

    const matchesPace    = row => !pacePick    || String(row.pace_timecourse||"").toLowerCase() === String(pacePick).toLowerCase();
    const matchesLoc     = row => !locPicks.size || locPicks.has(row.localization);
    const matchesPattern = row => !patternPick || String(row.pace_pattern||"").toLowerCase() === String(patternPick).toLowerCase();
    const matchesEtio    = row => !etioPicks.size || etioPicks.has(normalizeEtiologyName(row.etiology));

    let pool = data.filter(row => matchesPace(row) && matchesLoc(row) && matchesPattern(row) && matchesEtio(row));

    // graceful broadening to avoid emptiness
    if (pool.length < 4) pool = data.filter(row => matchesPace(row) && matchesLoc(row) && matchesEtio(row));
    if (pool.length < 4) pool = data.filter(row => matchesPace(row) && matchesLoc(row));
    if (pool.length < 4 && etioPicks.size) pool = data.filter(row => matchesEtio(row));
    if (pool.length < 4 && pacePick) pool = data.filter(row => matchesPace(row));
    if (pool.length < 4 && locPicks.size) pool = data.filter(row => matchesLoc(row));
    if (pool.length < 4 && patternPick) pool = data.filter(row => matchesPattern(row));
    if (pool.length < 4) pool = data.slice();

    const all = uniq(pool.map(d => d.disease));
    const others = all.filter(n => n !== currentCase.disease);
    const distractors = others.sort(() => Math.random()-0.5).slice(0, Math.max(3, Math.min(7, others.length)));
    const mix = [currentCase.disease, ...distractors].sort(() => Math.random()-0.5);
    return mix;
  }, [data, currentCase, picked.pace_timecourse, picked.localization, picked.pace_pattern, picked.etiology]);

  function onPick(stepKey, value) {
    if (!currentCase) return;
    if (stepKey === "pace_timecourse") { setPicked(p => ({ ...p, pace_timecourse:value })); return; }
    if (stepKey === "pace_pattern") { setPicked(p => ({ ...p, pace_pattern:value })); return; }
    if (stepKey === "localization") {
      setPicked(prev => {
        const has = new Set(prev.localization || []);
        if (has.has(value)) has.delete(value); else has.add(value);
        return { ...prev, localization: Array.from(has) };
      });
      return;
    }
    if (stepKey === "etiology") {
      setPicked(prev => {
        const has = new Set(prev.etiology || []);
        if (has.has(value)) has.delete(value); else has.add(value);
        return { ...prev, etiology: Array.from(has) };
      });
      return;
    }
    if (stepKey === "disease") {
      if (String(value) !== String(currentCase.disease)) {
        setWrongGuesses(prev => {
          const n = new Set(prev);
          n.add(value);
          return n;
        });
        return;
      }
      setPicked(p => ({ ...p, disease:value }));
      setLocked(l => ({ ...l, disease:true }));
      setShowCongrats(true);
      return;
    }
  }

  function confirm(stepKey) {
    if (stepKey === "pace_timecourse" && picked.pace_timecourse) setLocked(l => ({ ...l, pace_timecourse:true }));
    if (stepKey === "localization" && (picked.localization||[]).length) setLocked(l => ({ ...l, localization:true }));
    if (stepKey === "etiology" && (picked.etiology||[]).length) setLocked(l => ({ ...l, etiology:true }));
  }

  function nextCase() {
    if (!isFinished) return;
    setCurrentIdx(i => (i+1 < data.length ? i+1 : 0));
  }

  // UI helpers
  const chipClasses = (isPicked) => `px-3 py-2 rounded-xl border text-sm shadow-sm ${isPicked ? "bg-indigo-600 text-white border-indigo-700" : "bg-white hover:bg-indigo-50 border-slate-300"}`;

  return html`
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="p-4">
        ${!currentCase ? html`<div className="text-sm text-slate-600 text-center">${loadError || "Loading…"}</div>` : html`
          <div className="flex flex-col gap-6 items-center">

            <!-- Stepper -->
            <div className="flex flex-wrap gap-2 justify-center">
              ${["Pace","Localization","Etiology","Disease"].map((label, idx) => {
                const done = idx < activeStepIndex;
                const isActive = idx === activeStepIndex && !isFinished;
                return html`<div key=${label}
                  className=${"px-3 py-1 rounded-full border text-xs " + (done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : isActive ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white")}>
                  ${done ? "✓ " : isActive ? "• " : ""}${label}
                </div>`;
              })}
            </div>

            <!-- Pace -->
            ${!locked.pace_timecourse && html`
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  ${allPace.map(opt => html`
                    <button key=${opt} onClick=${() => onPick("pace_timecourse", opt)} className=${chipClasses(picked.pace_timecourse === opt)}>${opt}</button>
                  `)}
                </div>
                <div className="mt-2 flex justify-center">
                  <button disabled=${!picked.pace_timecourse} onClick=${() => confirm("pace_timecourse")}
                    className=${"px-4 py-2 rounded-xl text-sm shadow-sm border " + (picked.pace_timecourse ? "bg-indigo-600 text-white border-indigo-700" : "bg-white text-slate-400 border-slate-300 cursor-not-allowed")}>
                    Pace!
                  </button>
                </div>
              </div>
            `}

            <!-- Localization -->
            ${locked.pace_timecourse && !locked.localization && html`
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  ${allLocalization.map(opt => {
                    const isPicked = (picked.localization||[]).includes(opt);
                    return html`<button key=${opt} onClick=${() => onPick("localization", opt)} className=${chipClasses(isPicked)}>${opt}</button>`;
                  })}
                </div>
                <div className="mt-2 flex justify-center">
                  <button disabled=${!(picked.localization||[]).length} onClick=${() => confirm("localization")}
                    className=${"px-4 py-2 rounded-xl text-sm shadow-sm border " + ((picked.localization||[]).length ? "bg-indigo-600 text-white border-indigo-700" : "bg-white text-slate-400 border-slate-300 cursor-not-allowed")}>
                    Localized!
                  </button>
                </div>
              </div>
            `}

            <!-- Optional Pattern picker -->
            ${locked.pace_timecourse && html`
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  ${allPatterns.map(opt => html`
                    <button key=${opt} onClick=${() => onPick("pace_pattern", opt)}
                      className=${chipClasses(picked.pace_pattern === opt)}>${opt}</button>
                  `)}
                </div>
                <div className="text-xs text-slate-500 text-center mt-1">Pattern (optional)</div>
              </div>
            `}

            <!-- Etiology -->
            ${locked.localization && !locked.etiology && html`
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  ${allEtiologies.map(opt => {
                    const isPicked = (picked.etiology||[]).includes(opt);
                    return html`<button key=${opt} onClick=${() => onPick("etiology", opt)} className=${chipClasses(isPicked)}>${opt}</button>`;
                  })}
                </div>
                <div className="mt-2 flex justify-center">
                  <button disabled=${!(picked.etiology||[]).length} onClick=${() => confirm("etiology")}
                    className=${"px-4 py-2 rounded-xl text-sm shadow-sm border " + ((picked.etiology||[]).length ? "bg-indigo-600 text-white border-indigo-700" : "bg-white text-slate-400 border-slate-300 cursor-not-allowed")}>
                    Etiologies!
                  </button>
                </div>
              </div>
            `}

            <!-- Disease -->
            ${locked.etiology && !locked.disease && html`
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  ${diseaseOptions.map(opt => {
                    const wrong = (wrongGuesses || new Set()).has(opt);
                    return html`
                      <button
                        key=${opt}
                        aria-pressed=${wrong}
                        disabled=${locked.disease || wrong}
                        onClick=${() => onPick("disease", opt)}
                        className=${"px-3 py-2 rounded-xl border text-sm shadow-sm " + (wrong ? "line-through text-red-600 bg-red-50 border-red-300" : "bg-white hover:bg-indigo-50 border-slate-300")}
                      >${opt}</button>
                    `;
                  })}
                </div>
              </div>
            `}

            <!-- Completed -->
            ${isFinished && html`
              <div className="p-4 border rounded-2xl bg-emerald-50 border-emerald-200 w-full max-w-3xl">
                <div className="font-semibold text-emerald-800 mb-1">Case complete.</div>
                <div className="text-slate-700 text-sm">Nicely done.</div>
              </div>
              <div><button onClick=${() => nextCase()} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">Next Case</button></div>
            `}

          </div>
        `}
      </div>

      <!-- Congrats modal -->
      ${showCongrats && html`
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick=${() => setShowCongrats(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-[min(92vw,520px)] p-6 border border-slate-200">
            <div className="text-2xl font-semibold text-emerald-700 mb-2">🎉 Correct!</div>
            <p className="text-slate-700 mb-5">Nice work. Do you want to diagnose another case?</p>
            <div className="flex gap-2 justify-end">
              <button onClick=${() => setShowCongrats(false)} className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 shadow-sm">Stay Here</button>
              <button onClick=${() => { setShowCongrats(false); nextCase(); }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">New Case</button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
