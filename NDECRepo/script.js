const LEVELS = [
  "Neurology Readiness",
  "General Neurology Essentials",
  "Core Neurology Practice",
  "Advanced & Subspecialty Practice"
];

let SPECIALTIES = [];

const FORMAT_LABELS = {
  video: "Video",
  infographic: "Infographic",
  module: "Online module",
  article: "Article",
  toolkit: "Toolkit",
  game: "Game",
  reference: "Reference",
  podcast: "Podcast"
};

const FORMAT_ICONS = {
  video: "▶",
  infographic: "i",
  module: "◫",
  article: "¶",
  toolkit: "+",
  game: "#",
  reference: "A–Z",
  podcast: "◉"
};

const REVIEW_LABELS = {
  ndec: "NDEC Peer Reviewed"
};

const ACCESS_LABELS = {
  free: "Free / open access",
  login: "Free login required",
  member: "AAN member login",
  paid: "Paid access",
  mixed: "Mixed access"
};

let RESOURCES = [];

const GOOGLE_SHEET_ID = "1bNngRc_cMD_PDyAokAlSDlluWp655bkszKY83HJ0Spg";
const GOOGLE_SHEET_TAB = "Sheet1";
const GOOGLE_SHEET_TIMEOUT_MS = 15000;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const SHEET_COLUMNS = {
  title: ["title"],
  creator: ["creator"],
  description: ["description"],
  level: ["level"],
  population: ["population"],
  format: ["format"],
  review: ["reviewed", "review"],
  access: ["access"],
  duration: ["duration"],
  year: ["year"],
  url: ["url"],
  specialties: ["specialties"],
  tags: ["tags"]
};

let libraryState = "loading";
let dailyFeatureTimer;

const state = {
  query: "",
  audience: "all",
  creator: "",
  levels: new Set(),
  specialties: new Set(),
  formats: new Set(),
  reviews: new Set(),
  access: new Set(),
  sort: "newest",
  view: "list"
};

const elements = {
  searchForm: document.querySelector("#repository-search-form"),
  searchInput: document.querySelector("#search-input"),
  aboutButton: document.querySelector("#about-button"),
  aboutDialog: document.querySelector("#about-dialog"),
  dailyFeatures: document.querySelector("#daily-features"),
  audienceFilter: document.querySelector("#audience-filter"),
  creatorFilter: document.querySelector("#creator-filter"),
  levelOptions: document.querySelector("#level-options"),
  specialtyOptions: document.querySelector("#specialty-options"),
  formatOptions: document.querySelector("#format-options"),
  reviewOptions: document.querySelector("#review-options"),
  accessOptions: document.querySelector("#access-options"),
  clearFilters: document.querySelector("#clear-filters"),
  activeFilters: document.querySelector("#active-filters"),
  sortSelect: document.querySelector("#sort-select"),
  resourceList: document.querySelector("#resource-list"),
  libraryStatus: document.querySelector("#library-status"),
  libraryStatusTitle: document.querySelector("#library-status-title"),
  libraryStatusMessage: document.querySelector("#library-status-message"),
  libraryRetry: document.querySelector("#library-retry"),
  emptyState: document.querySelector("#empty-state"),
  emptyReset: document.querySelector("#empty-reset"),
  filterPanel: document.querySelector("#filter-panel"),
  filterClose: document.querySelector("#filter-close"),
  filterBackdrop: document.querySelector("#filter-backdrop"),
  mobileFilterButton: document.querySelector("#mobile-filter-button"),
  mobileFilterCount: document.querySelector("#mobile-filter-count"),
  submissionDialog: document.querySelector("#submission-dialog"),
  submissionDialogButton: document.querySelector("#submit-resource-button"),
  submissionDialogClose: document.querySelector("#submission-dialog-close"),
  submissionForm: document.querySelector("#resource-submission-form"),
  submissionFile: document.querySelector("#submission-file"),
  submissionFileStatus: document.querySelector("#submission-file-status"),
  submissionSubmit: document.querySelector("#submission-submit")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeHeader(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "");
}

function googleSheetTableRequest() {
  return new Promise((resolve, reject) => {
    const callbackName = `__ndecSheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("The Google Sheet did not respond within 15 seconds."));
    }, GOOGLE_SHEET_TIMEOUT_MS);

    function cleanup() {
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    }

    window[callbackName] = (response) => {
      cleanup();
      if (!response || response.status !== "ok" || !response.table) {
        const message = response?.errors?.[0]?.detailed_message || "Google Sheets returned an invalid response.";
        reject(new Error(message));
        return;
      }
      resolve(response.table);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("The Google Sheet could not be reached."));
    };

    const queryOptions = encodeURIComponent(`out:json;responseHandler:${callbackName}`);
    const tab = encodeURIComponent(GOOGLE_SHEET_TAB);
    script.src = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${tab}&headers=1&tqx=${queryOptions}&cacheBust=${Date.now()}`;
    script.async = true;
    document.head.append(script);
  });
}

function sheetCellValue(row, columnIndex) {
  const cell = row.c?.[columnIndex];
  return cell?.v ?? "";
}

function splitSheetList(value) {
  return [...new Set(String(value).split("|").map((item) => item.trim()).filter(Boolean))];
}

function parseReviewValue(value, rowNumber) {
  if (value === "" || value === null || value === false) return null;
  if (value === true) return "ndec";
  const review = normalize(value);
  if (review === "ndec" || review === "ndec peer reviewed") return "ndec";
  throw new Error(`Sheet row ${rowNumber}: Reviewed must be blank or NDEC Peer Reviewed.`);
}

function validateSheetChoice(value, allowedValues, fieldName, rowNumber) {
  if (allowedValues.includes(value)) return value;
  throw new Error(`Sheet row ${rowNumber}: ${fieldName} has an unsupported value.`);
}

function parseGoogleSheetResources(table) {
  const headerIndexes = new Map();
  table.cols.forEach((column, index) => {
    const header = normalizeHeader(column.label || column.id || "");
    if (header) headerIndexes.set(header, index);
  });

  const columns = Object.fromEntries(Object.entries(SHEET_COLUMNS).map(([field, aliases]) => {
    const index = aliases
      .map(normalizeHeader)
      .map((alias) => headerIndexes.get(alias))
      .find((value) => value !== undefined);
    if (index === undefined) throw new Error(`The Google Sheet is missing the required ${aliases[0]} column.`);
    return [field, index];
  }));

  const resources = [];
  (table.rows || []).forEach((row, index) => {
    const rowNumber = index + 2;
    const raw = Object.fromEntries(
      Object.entries(columns).map(([field, columnIndex]) => [field, sheetCellValue(row, columnIndex)])
    );
    if (Object.values(raw).every((value) => value === "" || value === null)) return;

    const textFields = [
      "title", "creator", "description", "level", "population", "format", "access",
      "duration", "url", "specialties", "tags"
    ];
    const missingField = textFields.find((field) => !String(raw[field]).trim());
    if (missingField) throw new Error(`Sheet row ${rowNumber}: ${missingField} is required.`);

    const level = validateSheetChoice(String(raw.level).trim(), LEVELS, "Level", rowNumber);
    const population = validateSheetChoice(normalize(raw.population), ["adult", "pediatric", "both"], "Population", rowNumber);
    const format = validateSheetChoice(normalize(raw.format), Object.keys(FORMAT_LABELS), "Format", rowNumber);
    const access = validateSheetChoice(normalize(raw.access), Object.keys(ACCESS_LABELS), "Access", rowNumber);
    const year = Number(raw.year);
    const specialties = splitSheetList(raw.specialties);
    const tags = splitSheetList(raw.tags);

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      throw new Error(`Sheet row ${rowNumber}: Year must be a four-digit year.`);
    }
    if (!specialties.length || !tags.length) {
      throw new Error(`Sheet row ${rowNumber}: Specialties and Tags must each include at least one value.`);
    }

    let url;
    try {
      url = new URL(String(raw.url).trim());
    } catch {
      throw new Error(`Sheet row ${rowNumber}: URL is not valid.`);
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error(`Sheet row ${rowNumber}: URL must begin with http:// or https://.`);
    }

    resources.push({
      id: rowNumber - 1,
      title: String(raw.title).trim(),
      creator: String(raw.creator).trim(),
      description: String(raw.description).trim(),
      level,
      specialties,
      population,
      format,
      review: parseReviewValue(raw.review, rowNumber),
      access,
      duration: String(raw.duration).trim(),
      year,
      url: url.href,
      tags
    });
  });

  if (!resources.length) throw new Error("The Google Sheet contains no resource rows.");
  return resources;
}

function setLibraryStatus(status, message = "") {
  libraryState = status;
  const ready = status === "ready";
  const failed = status === "error";
  elements.libraryStatus.hidden = ready;
  elements.libraryStatus.classList.toggle("is-error", failed);
  elements.libraryStatus.setAttribute("role", failed ? "alert" : "status");
  elements.libraryStatusTitle.textContent = failed ? "Repository unavailable" : "Loading the repository";
  elements.libraryStatusMessage.textContent = failed
    ? message
    : "Reading the current resource library from Google Sheets…";
  elements.libraryRetry.hidden = !failed;

  window.clearTimeout(dailyFeatureTimer);
  if (ready) {
    renderDailyFeatures();
    scheduleDailyFeatureRefresh();
  } else {
    renderDailyFeatureStatus(failed ? "Daily selections are unavailable while the repository cannot be loaded." : "Loading today’s selections…");
  }
}

async function loadLibrary() {
  RESOURCES = [];
  SPECIALTIES = [];
  setLibraryStatus("loading");
  initializeFilters();
  render();

  try {
    const table = await googleSheetTableRequest();
    RESOURCES = parseGoogleSheetResources(table);
    SPECIALTIES = [...new Set(RESOURCES.flatMap((resource) => resource.specialties))]
      .sort((a, b) => a.localeCompare(b));
    initializeFilters();
    setLibraryStatus("ready");
    render();
  } catch (error) {
    RESOURCES = [];
    SPECIALTIES = [];
    initializeFilters();
    setLibraryStatus("error", error instanceof Error ? error.message : "The Google Sheet could not be loaded.");
    render();
  }
}

function makeCountMap(values, getter) {
  return values.reduce((map, value) => {
    map[value] = RESOURCES.filter((resource) => getter(resource).includes(value)).length;
    return map;
  }, {});
}

function renderCheckboxGroup(container, values, groupName, selectedSet, labels = {}) {
  const fieldNames = {
    levels: "level",
    formats: "format",
    reviews: "review",
    access: "access"
  };
  const counts = makeCountMap(values, (resource) => {
    if (groupName === "specialties") return resource.specialties;
    return [resource[fieldNames[groupName]]];
  });

  container.innerHTML = values.map((value) => {
    const label = labels[value] || value;
    return `
      <label class="filter-option">
        <input type="checkbox" data-group="${escapeHtml(groupName)}" value="${escapeHtml(value)}" ${selectedSet.has(value) ? "checked" : ""}>
        <span class="filter-box" aria-hidden="true"></span>
        <span>${escapeHtml(label)}</span>
        <span class="filter-count">${counts[value]}</span>
      </label>`;
  }).join("");
}

function initializeFilters() {
  const creators = [...new Set(RESOURCES.map((resource) => resource.creator))].sort((a, b) => a.localeCompare(b));
  elements.creatorFilter.innerHTML = `
    <option value="">All creators</option>
    ${creators.map((creator) => `<option value="${escapeHtml(creator)}">${escapeHtml(creator)}</option>`).join("")}`;

  renderCheckboxGroup(elements.levelOptions, LEVELS, "levels", state.levels);
  renderCheckboxGroup(elements.specialtyOptions, SPECIALTIES, "specialties", state.specialties);
  renderCheckboxGroup(elements.formatOptions, Object.keys(FORMAT_LABELS), "formats", state.formats, FORMAT_LABELS);
  renderCheckboxGroup(elements.reviewOptions, Object.keys(REVIEW_LABELS), "reviews", state.reviews, REVIEW_LABELS);
  renderCheckboxGroup(elements.accessOptions, Object.keys(ACCESS_LABELS), "access", state.access, ACCESS_LABELS);
}

function audienceMatches(resource) {
  if (state.audience === "all") return true;
  return resource.population === state.audience || resource.population === "both";
}

function setMatches(set, values) {
  if (!set.size) return true;
  return values.some((value) => set.has(value));
}

function getFilteredResources() {
  const query = normalize(state.query);
  const filtered = RESOURCES.filter((resource) => {
    const haystack = normalize([
      resource.title,
      resource.creator,
      resource.description,
      resource.level,
      resource.specialties.join(" "),
      FORMAT_LABELS[resource.format],
      resource.tags.join(" ")
    ].join(" "));

    return (!query || haystack.includes(query))
      && audienceMatches(resource)
      && (!state.creator || resource.creator === state.creator)
      && setMatches(state.levels, [resource.level])
      && setMatches(state.specialties, resource.specialties)
      && setMatches(state.formats, [resource.format])
      && setMatches(state.reviews, [resource.review])
      && setMatches(state.access, [resource.access]);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "title") return a.title.localeCompare(b.title);
    if (state.sort === "level") return LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.title.localeCompare(b.title);
    return b.year - a.year || a.title.localeCompare(b.title);
  });
}

function reviewBadge(resource) {
  if (resource.review !== "ndec") return "";
  return `<span class="badge badge-ndec">${escapeHtml(REVIEW_LABELS.ndec)}</span>`;
}

function populationLabel(population) {
  if (population === "both") return "Adult & pediatric";
  return population === "adult" ? "Adult" : "Pediatric";
}

function specialtyLabel(resource) {
  const primary = resource.specialties[0];
  const additional = resource.specialties.length - 1;
  return additional > 0 ? `${primary} +${additional}` : primary;
}

function utcDayNumber(timestamp = Date.now()) {
  return Math.floor(timestamp / DAY_IN_MILLISECONDS);
}

function dailyResource(pool, offset = 0, dayNumber = utcDayNumber()) {
  if (!pool.length) return null;
  return pool[(dayNumber + offset) % pool.length];
}

function selectDailyFeatures(dayNumber = utcDayNumber()) {
  const visualResources = RESOURCES.filter((resource) => resource.format === "infographic");
  const visualPool = visualResources.length ? visualResources : RESOURCES;
  let teaching = dailyResource(RESOURCES, 0, dayNumber);
  const visual = dailyResource(visualPool, 1, dayNumber);

  if (teaching?.id === visual?.id && RESOURCES.length > 1) {
    teaching = dailyResource(RESOURCES, 1, dayNumber);
  }

  return { teaching, visual };
}

function renderDailyFeatureStatus(message) {
  elements.dailyFeatures.innerHTML = `<p class="daily-feature-status">${escapeHtml(message)}</p>`;
}

function renderDailyFeatures() {
  const { teaching, visual } = selectDailyFeatures();
  if (!teaching || !visual) {
    renderDailyFeatureStatus("No daily selections are available.");
    return;
  }

  elements.dailyFeatures.innerHTML = `
    <article class="feature-card feature-article">
      <div class="feature-card-heading">
        <span class="feature-label"><i aria-hidden="true"></i> Teaching aid of the day</span>
        <span class="feature-number">01</span>
      </div>
      <div class="feature-content">
        <div class="format-tile format-${escapeHtml(teaching.format)}" aria-hidden="true">
          <span>01</span><span>02</span><span>03</span>
          <b>${escapeHtml(FORMAT_ICONS[teaching.format])}</b>
        </div>
        <div>
          <div class="badges">
            ${reviewBadge(teaching)}
            <span class="badge">${escapeHtml(FORMAT_LABELS[teaching.format])}</span>
          </div>
          <h3><a href="${escapeHtml(teaching.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(teaching.title)}</a></h3>
          <p>${escapeHtml(teaching.description)}</p>
          <div class="feature-meta">${escapeHtml(teaching.creator)} · ${escapeHtml(teaching.level)}</div>
        </div>
      </div>
      <a class="feature-link" href="${escapeHtml(teaching.url)}" target="_blank" rel="noopener noreferrer">Open today’s teaching aid <span aria-hidden="true">↗</span></a>
    </article>

    <article class="feature-card feature-visual">
      <div class="feature-card-heading">
        <span class="feature-label"><i aria-hidden="true"></i> Visual of the day</span>
        <span class="feature-number">02</span>
      </div>
      <a class="visual-frame visual-resource-art format-${escapeHtml(visual.format)}" href="${escapeHtml(visual.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(visual.title)} in a new tab">
        <b class="visual-resource-symbol" aria-hidden="true">${escapeHtml(FORMAT_ICONS[visual.format])}</b>
        <span>${escapeHtml(FORMAT_LABELS[visual.format])}</span>
      </a>
      <div class="visual-caption">
        <div>
          <h3><a href="${escapeHtml(visual.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(visual.title)}</a></h3>
          <p>${escapeHtml(visual.creator)}</p>
        </div>
        <span>${escapeHtml(FORMAT_LABELS[visual.format])} ↗</span>
      </div>
    </article>`;
}

function scheduleDailyFeatureRefresh() {
  const nextUtcDay = (utcDayNumber() + 1) * DAY_IN_MILLISECONDS;
  const delay = Math.max(1000, nextUtcDay - Date.now() + 1000);
  dailyFeatureTimer = window.setTimeout(() => {
    if (libraryState === "ready") renderDailyFeatures();
    scheduleDailyFeatureRefresh();
  }, delay);
}

function renderResourceCard(resource) {
  return `
    <article class="resource-card format-${escapeHtml(resource.format)}">
      <div class="resource-format-icon" aria-hidden="true">
        <b>${escapeHtml(FORMAT_ICONS[resource.format])}</b>
        <small>${escapeHtml(FORMAT_LABELS[resource.format])}</small>
      </div>
      <div class="resource-body">
        <div class="resource-topline">
          ${reviewBadge(resource)}
          <span class="badge">${escapeHtml(FORMAT_LABELS[resource.format])}</span>
        </div>
        <h3><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.title)}</a></h3>
        <p class="resource-description">${escapeHtml(resource.description)}</p>
        <div class="resource-meta">
          <span>${escapeHtml(resource.creator)}</span>
          <span>${escapeHtml(resource.level)}</span>
          <span title="${escapeHtml(resource.specialties.join(", "))}">${escapeHtml(specialtyLabel(resource))}</span>
          <span>${escapeHtml(populationLabel(resource.population))}</span>
          <span>${escapeHtml(ACCESS_LABELS[resource.access])}</span>
          <span>${escapeHtml(resource.duration)}</span>
        </div>
      </div>
      <a class="resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(resource.title)} in a new tab">↗</a>
    </article>`;
}

function activeFilterCount() {
  return (state.audience === "all" ? 0 : 1)
    + (state.creator ? 1 : 0)
    + state.levels.size
    + state.specialties.size
    + state.formats.size
    + state.reviews.size
    + state.access.size;
}

function allFilterCount() {
  return activeFilterCount() + (state.query ? 1 : 0);
}

function chip(label, type, value = "") {
  return `<button class="active-filter" type="button" data-remove-type="${escapeHtml(type)}" data-remove-value="${escapeHtml(value)}">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`;
}

function renderActiveFilters() {
  const chips = [];
  if (state.query) chips.push(chip(`Search: ${state.query}`, "query"));
  if (state.audience !== "all") chips.push(chip(`Population: ${populationLabel(state.audience)}`, "audience"));
  if (state.creator) chips.push(chip(`Creator: ${state.creator}`, "creator"));
  state.levels.forEach((value) => chips.push(chip(value, "levels", value)));
  state.specialties.forEach((value) => chips.push(chip(value, "specialties", value)));
  state.formats.forEach((value) => chips.push(chip(FORMAT_LABELS[value], "formats", value)));
  state.reviews.forEach((value) => chips.push(chip(REVIEW_LABELS[value], "reviews", value)));
  state.access.forEach((value) => chips.push(chip(ACCESS_LABELS[value], "access", value)));
  elements.activeFilters.innerHTML = chips.length ? chips.join("") : '<span class="filter-placeholder">No filters applied</span>';
}

function syncControls() {
  elements.searchInput.value = state.query;
  elements.creatorFilter.value = state.creator;
  elements.sortSelect.value = state.sort;

  elements.audienceFilter.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.audience === state.audience;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-group]").forEach((checkbox) => {
    checkbox.checked = state[checkbox.dataset.group].has(checkbox.value);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.clearFilters.disabled = allFilterCount() === 0;
  elements.mobileFilterCount.textContent = activeFilterCount();
}

function render() {
  if (libraryState !== "ready") {
    elements.resourceList.innerHTML = "";
    elements.resourceList.hidden = true;
    elements.emptyState.hidden = true;
    renderActiveFilters();
    syncControls();
    return;
  }

  const resources = getFilteredResources();
  elements.resourceList.innerHTML = resources.map(renderResourceCard).join("");
  elements.resourceList.classList.toggle("grid-view", state.view === "grid");
  elements.emptyState.hidden = resources.length !== 0;
  elements.resourceList.hidden = resources.length === 0;

  renderActiveFilters();
  syncControls();
}

function clearAllFilters() {
  state.query = "";
  state.audience = "all";
  state.creator = "";
  state.levels.clear();
  state.specialties.clear();
  state.formats.clear();
  state.reviews.clear();
  state.access.clear();
  render();
}

function scrollToBrowse() {
  document.querySelector("#browse").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeFilters() {
  document.body.classList.remove("filter-open");
  elements.mobileFilterButton.setAttribute("aria-expanded", "false");
}

function openFilters() {
  document.body.classList.add("filter-open");
  elements.mobileFilterButton.setAttribute("aria-expanded", "true");
  window.setTimeout(() => elements.filterClose.focus(), 230);
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = elements.searchInput.value.trim();
  render();
  scrollToBrowse();
});

let searchTimer;
elements.searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.query = elements.searchInput.value.trim();
    render();
  }, 180);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    state.query = button.dataset.query;
    render();
    scrollToBrowse();
  });
});

elements.audienceFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-audience]");
  if (!button) return;
  state.audience = button.dataset.audience;
  render();
});

elements.filterPanel.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-group]");
  if (checkbox) {
    const set = state[checkbox.dataset.group];
    checkbox.checked ? set.add(checkbox.value) : set.delete(checkbox.value);
    render();
  }
});

elements.creatorFilter.addEventListener("change", () => {
  state.creator = elements.creatorFilter.value;
  render();
});

elements.sortSelect.addEventListener("change", () => {
  state.sort = elements.sortSelect.value;
  render();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    render();
  });
});

elements.activeFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-type]");
  if (!button) return;
  const type = button.dataset.removeType;
  const value = button.dataset.removeValue;

  if (type === "query") state.query = "";
  else if (type === "audience") state.audience = "all";
  else if (type === "creator") state.creator = "";
  else state[type].delete(value);
  render();
});

elements.clearFilters.addEventListener("click", clearAllFilters);
elements.emptyReset.addEventListener("click", clearAllFilters);
elements.libraryRetry.addEventListener("click", loadLibrary);
elements.mobileFilterButton.addEventListener("click", openFilters);
elements.filterClose.addEventListener("click", closeFilters);
elements.filterBackdrop.addEventListener("click", closeFilters);

elements.submissionDialogButton.addEventListener("click", () => {
  if (typeof elements.submissionDialog.showModal === "function") {
    elements.submissionDialog.showModal();
  } else {
    elements.submissionDialog.setAttribute("open", "");
  }
});

elements.submissionDialogClose.addEventListener("click", () => {
  if (typeof elements.submissionDialog.close === "function") elements.submissionDialog.close();
  else elements.submissionDialog.removeAttribute("open");
});

elements.submissionDialog.addEventListener("click", (event) => {
  if (event.target !== elements.submissionDialog) return;

  if (typeof elements.submissionDialog.close === "function") {
    elements.submissionDialog.close();
  } else {
    elements.submissionDialog.removeAttribute("open");
  }
});

const maximumSubmissionFileSize = 10 * 1024 * 1024;

function validateSubmissionFile() {
  const [file] = elements.submissionFile.files;
  elements.submissionFile.setCustomValidity("");

  if (!file) {
    elements.submissionFileStatus.textContent = "";
    return true;
  }

  if (file.size > maximumSubmissionFileSize) {
    elements.submissionFile.setCustomValidity("Choose a file that is 10 MB or smaller.");
    elements.submissionFileStatus.textContent = "This file is larger than 10 MB. Choose a smaller file.";
    return false;
  }

  const sizeInMegabytes = Math.max(0.01, file.size / (1024 * 1024)).toFixed(2);
  elements.submissionFileStatus.textContent = `${file.name} · ${sizeInMegabytes} MB selected`;
  return true;
}

elements.submissionFile.addEventListener("change", validateSubmissionFile);

elements.submissionForm.addEventListener("submit", (event) => {
  if (!validateSubmissionFile() || !elements.submissionForm.checkValidity()) {
    event.preventDefault();
    elements.submissionForm.reportValidity();
    return;
  }

  elements.submissionSubmit.disabled = true;
  elements.submissionSubmit.textContent = "Uploading submission…";
});

elements.aboutButton.addEventListener("click", () => {
  if (typeof elements.aboutDialog.showModal === "function") {
    elements.aboutDialog.showModal();
  } else {
    elements.aboutDialog.setAttribute("open", "");
  }
});

elements.aboutDialog.addEventListener("click", (event) => {
  if (event.target === elements.aboutDialog) elements.aboutDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("filter-open")) {
    closeFilters();
    elements.mobileFilterButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeFilters();
});

window.addEventListener("pageshow", () => {
  elements.submissionSubmit.disabled = false;
  elements.submissionSubmit.textContent = "Submit resource for review";
});

loadLibrary();
