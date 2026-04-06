/* =========================================
   NDEC Hub — Open Neuro Education Library
   Data: public Google Sheet (CSV)
   ========================================= */

const GOOGLE_SHEET_ID = "1c-L3Q0rqXFuh95zThfcocbB-65qsWbdSOn2eTTOmuyo";
const SHEET_NAME = ""; // optional: set to exact tab name

const CSV_URLS = [
  "assets/sample_resources.csv",

  SHEET_NAME
    ? `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`
    : `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`,
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`
];

/* --- Helpers --- */
const $ = (id) => document.getElementById(id);
const safeTrim = (x) => (x ?? "").toString().trim();
const asLowerKey = (s) => safeTrim(s).toLowerCase();
const escapeHtml = (s) => (s ?? "").toString()
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const normalizeHeaderKey = (k) => (k ?? "").toString().toLowerCase().replace(/[^a-z0-9]/g,"");
const firstNonEmpty = (...vals) => {
  for (const v of vals){ const s = safeTrim(v); if (s) return s; }
  return "";
};
const splitMulti = (s) => {
  const raw = safeTrim(s);
  if (!raw) return [];
  return raw.split(/[;,|]/g).map(x=>safeTrim(x)).filter(Boolean).map(x=>x.replace(/\s+/g," "));
};
const uniqSorted = (arr) => {
  const seen = new Map();
  arr.forEach(v => { const k = asLowerKey(v); if (!k) return; if (!seen.has(k)) seen.set(k, v); });
  return Array.from(seen.values()).sort((a,b)=>a.localeCompare(b));
};
const safeUrl = (u) => {
  const s = safeTrim(u);
  if (!s) return "";
  if (/^(https?:\/\/|mailto:)/i.test(s)) return s;
  if (/^[a-z0-9.-]+\.[a-z]{2,}\/?.*/i.test(s)) return "https://" + s;
  return s;
};

function parseTimeMinutes(val){
  const s = safeTrim(val);
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s));
  const m = s.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (m) return Math.round((Number(m[1]) + Number(m[2]))/2);
  const m2 = s.match(/(\d+)\s*(min|mins|minutes|m)\b/i);
  if (m2) return Number(m2[1]);
  return null;
}
function timeBucket(mins){
  if (mins === null || mins === undefined) return "unknown";
  if (mins < 10) return "<10";
  if (mins < 30) return "10–30";
  if (mins < 60) return "30–60";
  return "60+";
}

function parseCSV(text){
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length){
    const c = text[i];
    if (inQuotes){
      if (c === '"'){
        if (text[i+1] === '"'){ field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      } else { field += c; i++; continue; }
    } else {
      if (c === '"'){ inQuotes = true; i++; continue; }
      if (c === ","){ row.push(field); field=""; i++; continue; }
      if (c === "\r"){ i++; continue; }
      if (c === "\n"){ row.push(field); rows.push(row); row=[]; field=""; i++; continue; }
      field += c; i++; continue;
    }
  }
  row.push(field); rows.push(row);

  if (!rows.length) return [];
  const headers = rows[0].map(h => safeTrim(h));
  const out = [];
  for (let r=1;r<rows.length;r++){
    const vals = rows[r];
    if (vals.length===1 && safeTrim(vals[0])==="") continue;
    const obj = {};
    for (let c=0;c<headers.length;c++){
      obj[headers[c]] = (vals[c] ?? "");
    }
    out.push(obj);
  }
  return out;
}

function normRow(row){
  const n = {};
  for (const k in row){
    const nk = normalizeHeaderKey(k);
    if (nk && n[nk] === undefined) n[nk] = row[k];
  }
  return n;
}

function resourceFromRow(row){
  const n = normRow(row);
  const title = firstNonEmpty(row.Title, row.title, row.Name, row.name, n.title, n.name, n.resourcename);
  const url = safeUrl(firstNonEmpty(row.URL, row.Url, row.url, row.Link, row.link, n.url, n.link, n.resourceurl));
  if (!title || !url) return null;

  const desc = firstNonEmpty(row.Description, row.description, row.Summary, row.summary, row.Blurb, row.blurb, n.description, n.summary, n.blurb);
  const format = firstNonEmpty(row.Format, row.format, row.Type, row.type, row.Medium, row.medium, n.format, n.type, n.medium) || "unknown";

  const topics = splitMulti(firstNonEmpty(row.Topics, row.topics, row.Topic, row.topic, row.Subspecialty, row.subspecialty, n.topics, n.topic, n.subspecialty));
  const tags = splitMulti(firstNonEmpty(row.Tags, row.tags, row.Keywords, row.keywords, n.tags, n.keywords));
  const level = splitMulti(firstNonEmpty(row.Level, row.level, row.LearnerLevel, row.learner_level, row.Audience, row.audience, n.level, n.learnerlevel, n.audience));

  const timeRaw = firstNonEmpty(row.Time, row.time, row.Duration, row.duration, row.Length, row.length, row.Minutes, row.minutes, n.time, n.duration, n.length, n.minutes);
  const mins = parseTimeMinutes(timeRaw);
  const tBucket = timeBucket(mins);

  const access = firstNonEmpty(row.Access, row.access, row.Paywall, row.paywall, n.access, n.paywall) || "unknown";
  const language = firstNonEmpty(row.Language, row.language, row.Lang, row.lang, n.language, n.lang) || "en";
  const creator = firstNonEmpty(row.Creator, row.creator, row.Author, row.author, row.Speaker, row.speaker, row.Host, row.host, n.creator, n.author, n.speaker, n.host);
  const source = firstNonEmpty(row.Source, row.source, row.Organization, row.organization, row.Org, row.org, n.source, n.organization, n.org);

  const badges = splitMulti(firstNonEmpty(row.Badges, row.badges, row.Badge, row.badge, row.Status, row.status, n.badges, n.badge, n.status));
  const lastVerified = firstNonEmpty(row.LastVerified, row.last_verified, row.lastVerified, row.Verified, row.verified, n.lastverified, n.lastverifieddate, n.verified);
  const dateAdded = firstNonEmpty(row.DateAdded, row.date_added, row.dateAdded, row.Added, row.added, n.dateadded, n.added);

  return {
    title: safeTrim(title),
    url: safeTrim(url),
    desc: safeTrim(desc),
    format: safeTrim(format),
    topics, tags, level,
    time_minutes: mins, time_bucket: tBucket,
    access: safeTrim(access),
    language: safeTrim(language),
    creator: safeTrim(creator),
    source: safeTrim(source),
    badges,
    last_verified: safeTrim(lastVerified),
    date_added: safeTrim(dateAdded)
  };
}

/* --- State --- */
const STATE = {
  all: [],
  filtered: [],
  facets: { format: [], topics: [], level: [], time: [], access: [], lang: [], badges: [] },
  selected: { format: new Set(), topics: new Set(), level: new Set(), time: new Set(), access: new Set(), lang: new Set(), badges: new Set() },
  q: "",
  sort: "relevance",
  loadedAt: null
};

/* --- Filter logic --- */
function matchesFacetSet(valOrArray, set){
  if (!set || set.size === 0) return true;
  if (Array.isArray(valOrArray)) return valOrArray.some(v => set.has(asLowerKey(v)));
  return set.has(asLowerKey(valOrArray));
}
function searchScore(r, qTokens){
  if (!qTokens.length) return 0;
  const hay = {
    title: safeTrim(r.title).toLowerCase(),
    desc: safeTrim(r.desc).toLowerCase(),
    creator: safeTrim(r.creator).toLowerCase(),
    source: safeTrim(r.source).toLowerCase(),
    format: safeTrim(r.format).toLowerCase(),
    tags: (r.tags||[]).join(" ").toLowerCase(),
    topics: (r.topics||[]).join(" ").toLowerCase(),
    level: (r.level||[]).join(" ").toLowerCase()
  };
  let score = 0;
  qTokens.forEach(t => {
    if (!t) return;
    if (hay.title.includes(t)) score += 6;
    if (hay.tags.includes(t) || hay.topics.includes(t)) score += 4;
    if (hay.creator.includes(t) || hay.source.includes(t)) score += 2;
    if (hay.desc.includes(t)) score += 1;
    if (hay.format.includes(t)) score += 1;
  });
  return score;
}

function applyFilters(){
  const q = safeTrim(STATE.q).toLowerCase();
  const qTokens = q ? q.split(/\s+/g).map(s=>s.trim()).filter(Boolean) : [];
  const out = [];
  for (const r of STATE.all){
    if (!matchesFacetSet(r.format, STATE.selected.format)) continue;
    if (!matchesFacetSet(r.topics, STATE.selected.topics)) continue;
    if (!matchesFacetSet(r.level, STATE.selected.level)) continue;
    if (!matchesFacetSet(r.time_bucket, STATE.selected.time)) continue;
    if (!matchesFacetSet(r.access, STATE.selected.access)) continue;
    if (!matchesFacetSet(r.language, STATE.selected.lang)) continue;
    if (!matchesFacetSet(r.badges, STATE.selected.badges)) continue;

    const s = searchScore(r, qTokens);
    if (qTokens.length && s === 0) continue;
    out.push({ r, score: s });
  }

  const sort = STATE.sort;
  out.sort((a,b)=>{
    if (sort === "title_az") return a.r.title.localeCompare(b.r.title);
    if (sort === "title_za") return b.r.title.localeCompare(a.r.title);
    if (sort === "verified") return safeTrim(b.r.last_verified).localeCompare(safeTrim(a.r.last_verified));
    if (sort === "newest") {
      const ad = Date.parse(a.r.date_added || "");
      const bd = Date.parse(b.r.date_added || "");
      if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
      return safeTrim(b.r.date_added).localeCompare(safeTrim(a.r.date_added));
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.r.title.localeCompare(b.r.title);
  });

  STATE.filtered = out.map(x => x.r);
}

/* --- Facets --- */
function rebuildFacets(){
  const formats=[], topics=[], levels=[], times=[], access=[], lang=[], badges=[];
  STATE.all.forEach(r => {
    formats.push(r.format || "unknown");
    (r.topics||[]).forEach(t => topics.push(t));
    (r.level||[]).forEach(l => levels.push(l));
    times.push(r.time_bucket || "unknown");
    access.push(r.access || "unknown");
    lang.push(r.language || "en");
    (r.badges||[]).forEach(b => badges.push(b));
  });
  STATE.facets.format = uniqSorted(formats);
  STATE.facets.topics = uniqSorted(topics);
  STATE.facets.level  = uniqSorted(levels);
  STATE.facets.time   = uniqSorted(times);
  STATE.facets.access = uniqSorted(access);
  STATE.facets.lang   = uniqSorted(lang);
  STATE.facets.badges = uniqSorted(badges);

  renderFacet("facetFormat", "format", "formatCount", STATE.facets.format);
  renderFacet("facetTopics", "topics", "topicsCount", STATE.facets.topics);
  renderFacet("facetLevel",  "level",  "levelCount",  STATE.facets.level);
  renderFacet("facetTime",   "time",   "timeCount",   STATE.facets.time);
  renderFacet("facetAccess", "access", "accessCount", STATE.facets.access);
  renderFacet("facetLang",   "lang",   "langCount",   STATE.facets.lang);
  renderFacet("facetBadges", "badges", "badgesCount", STATE.facets.badges);

  if (window.__NDEC_CLONE_FACETS__) window.__NDEC_CLONE_FACETS__();
}

function renderFacet(containerId, key, countId, values){
  const el = $(containerId);
  const countEl = $(countId);
  if (!el) return;
  el.innerHTML = "";
  values.forEach(v => {
    const id = `chk_${key}_${normalizeHeaderKey(v)}`;
    const lab = document.createElement("label");
    lab.className = "chk";
    lab.innerHTML = `<input type="checkbox" id="${id}" /><div>${escapeHtml(v)}</div>`;
    const input = lab.querySelector("input");
    input.checked = STATE.selected[key].has(asLowerKey(v));
    input.addEventListener("change", ()=>{
      if (input.checked) STATE.selected[key].add(asLowerKey(v));
      else STATE.selected[key].delete(asLowerKey(v));
      syncUrlFromState();
      applyAndRender();
      rebuildFacets();
    });
    el.appendChild(lab);
  });
  if (countEl) countEl.textContent = String(values.length);
}

/* --- Chips --- */
function activeChips(){
  const chips = [];
  const pushSet = (label, set) => set.forEach(v => chips.push({ label, value: v }));
  pushSet("format", STATE.selected.format);
  pushSet("topic",  STATE.selected.topics);
  pushSet("level",  STATE.selected.level);
  pushSet("time",   STATE.selected.time);
  pushSet("access", STATE.selected.access);
  pushSet("lang",   STATE.selected.lang);
  pushSet("badge",  STATE.selected.badges);
  if (safeTrim(STATE.q)) chips.unshift({ label:"q", value: STATE.q });
  return chips;
}
function renderChips(){
  const el = $("activeChips");
  if (!el) return;
  el.innerHTML = "";
  const chips = activeChips();
  chips.forEach(ch => {
    const b = document.createElement("div");
    b.className = "chip";
    b.innerHTML = `<span class="k">${escapeHtml(ch.label)}</span><span>${escapeHtml(ch.value)}</span><span class="x">×</span>`;
    b.title = "Remove";
    b.addEventListener("click", ()=>{
      if (ch.label === "q") { STATE.q=""; $("q").value=""; }
      else {
        const map = { format:"format", topic:"topics", level:"level", time:"time", access:"access", lang:"lang", badge:"badges" };
        const k = map[ch.label];
        if (k) STATE.selected[k].delete(asLowerKey(ch.value));
      }
      syncUrlFromState();
      applyAndRender();
      rebuildFacets();
    });
    el.appendChild(b);
  });
  if (window.__NDEC_SYNC_CHIPS__) window.__NDEC_SYNC_CHIPS__();
}

/* --- Render results --- */
const pill = (label) => `<span class="badge">${escapeHtml(label)}</span>`;

function renderResults(){
  const cards = $("cards");
  const countLine = $("resultCount");
  const msg = $("panelMsg");

  cards.innerHTML = "";
  countLine.textContent = `${STATE.filtered.length.toLocaleString()} resource(s)`;

  if (!STATE.filtered.length){
    msg.style.display = "block";
    msg.innerHTML = `<strong>No matches.</strong> Try adjusting search or filters.`;
    return;
  }
  msg.style.display = "none";

  STATE.filtered.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";

    const creator = safeTrim(r.creator);
    const source = safeTrim(r.source);
    const who = [creator, source].filter(Boolean).join(" • ");

    const metaBits = [];
    if (r.format) metaBits.push(pill(r.format));
    if (r.time_bucket && r.time_bucket !== "unknown") metaBits.push(pill(r.time_bucket));
    if (r.access && r.access !== "unknown") metaBits.push(pill(r.access));
    if (r.language && r.language !== "en") metaBits.push(pill(r.language));
    (r.badges||[]).slice(0,3).forEach(b => metaBits.push(pill(b)));

    const tags = [...(r.topics||[]), ...(r.tags||[])].slice(0, 10);

    div.innerHTML = `
      <div class="cardTop">
        <h3 class="cardTitle"><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.title)}</a></h3>
        <a class="openLink" href="${escapeHtml(r.url)}" target="_blank" rel="noopener">open ↗</a>
      </div>
      <div class="meta">
        ${metaBits.join("")}
        ${who ? `<span style="color:var(--muted);">•</span><span>${escapeHtml(who)}</span>` : ""}
        ${r.last_verified ? `<span style="color:var(--muted);">•</span><span>verified: ${escapeHtml(r.last_verified)}</span>` : ""}
      </div>
      ${r.desc ? `<div class="desc">${escapeHtml(r.desc)}</div>` : ``}
      ${tags.length ? `<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ``}
    `;
    cards.appendChild(div);
  });
}

/* --- URL sync --- */
function getParamList(params, key){
  const v = params.get(key);
  if (!v) return [];
  return v.split(",").map(x=>safeTrim(x)).filter(Boolean);
}
function setFromUrl(){
  const u = new URL(window.location.href);
  const p = u.searchParams;
  STATE.q = safeTrim(p.get("q") || "");
  STATE.sort = safeTrim(p.get("sort") || "relevance");
  $("q").value = STATE.q;
  $("sort").value = STATE.sort;

  const setSet = (key, paramKey) => {
    const arr = getParamList(p, paramKey);
    STATE.selected[key] = new Set(arr.map(asLowerKey));
  };
  setSet("format","format");
  setSet("topics","topics");
  setSet("level","level");
  setSet("time","time");
  setSet("access","access");
  setSet("lang","lang");
  setSet("badges","badges");
}
function syncUrlFromState(){
  const u = new URL(window.location.href);
  const p = u.searchParams;

  const setList = (key, paramKey) => {
    const arr = Array.from(STATE.selected[key].values()).filter(Boolean);
    if (arr.length) p.set(paramKey, arr.join(","));
    else p.delete(paramKey);
  };

  if (safeTrim(STATE.q)) p.set("q", STATE.q); else p.delete("q");
  if (STATE.sort && STATE.sort !== "relevance") p.set("sort", STATE.sort); else p.delete("sort");

  setList("format","format");
  setList("topics","topics");
  setList("level","level");
  setList("time","time");
  setList("access","access");
  setList("lang","lang");
  setList("badges","badges");

  window.history.replaceState({}, "", u.toString());
}

/* --- Data load --- */
async function fetchSheetCsv(){
  for (const url of CSV_URLS){
    try{
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const text = await res.text();
      const sample = (text || "").slice(0, 500).trim().toLowerCase();
      const looksHtml = sample.startsWith("<!doctype") || sample.startsWith("<html") || sample.includes("<head") || sample.includes("<body");
      if (looksHtml) continue;
      return text;
    }catch(e){ continue; }
  }
  throw new Error("load_failed");
}

/* --- Apply + render --- */
function applyAndRender(){
  applyFilters();
  renderChips();
  renderResults();
  const dt = STATE.loadedAt ? new Date(STATE.loadedAt) : null;
  $("status").textContent = dt ? `loaded ${dt.toLocaleString()}` : "";
}

function showLoadFailed(){
  $("status").textContent = "unavailable";
  $("panelMsg").style.display = "block";
  $("panelMsg").innerHTML = `<strong>Resource list unavailable.</strong> Please try again later.`;
}

async function loadAndRender(){
  $("status").textContent = "loading…";
  $("panelMsg").style.display = "block";
  $("panelMsg").innerHTML = `Loading…`;

  try{
    const csvText = await fetchSheetCsv();
    const rows = parseCSV(csvText);
    const resources = [];
    rows.forEach(row => {
      const r = resourceFromRow(row);
      if (r) resources.push(r);
    });

    STATE.all = resources;
    STATE.loadedAt = Date.now();

    setFromUrl();
    rebuildFacets();
    applyAndRender();

    $("countHint").textContent = `${resources.length.toLocaleString()}`;
    $("panelMsg").style.display = "none";
  }catch(e){
    STATE.all = [];
    STATE.filtered = [];
    rebuildFacets();
    showLoadFailed();
  }
}

/* --- Mobile drawer --- */
function openDrawer(){
  $("drawerOverlay").style.display = "block";
  $("drawer").classList.add("open");
}
function closeDrawer(){
  $("drawerOverlay").style.display = "none";
  $("drawer").classList.remove("open");
}

/* --- UI wiring --- */
function clearAll(){
  STATE.q = ""; $("q").value = "";
  Object.keys(STATE.selected).forEach(k => STATE.selected[k] = new Set());
  STATE.sort = "relevance"; $("sort").value = "relevance";
  syncUrlFromState();
  rebuildFacets();
  applyAndRender();
}

function wireUI(){
  $("q").addEventListener("input", ()=>{
    STATE.q = $("q").value;
    syncUrlFromState();
    applyAndRender();
  });

  $("sort").addEventListener("change", ()=>{
    STATE.sort = $("sort").value;
    syncUrlFromState();
    applyAndRender();
  });

  $("btnReset").addEventListener("click", clearAll);
  $("btnReload").addEventListener("click", loadAndRender);
  $("btnMenu").addEventListener("click", openDrawer);
  $("drawerOverlay").addEventListener("click", closeDrawer);
  $("btnMenuClose").addEventListener("click", closeDrawer);

  window.addEventListener("popstate", ()=>{
    setFromUrl();
    rebuildFacets();
    applyAndRender();
  });
}

wireUI();
loadAndRender();
