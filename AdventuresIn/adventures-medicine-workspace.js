(function () {
  const SERIES = [
    {
      id: "psychiatry",
      aliases: ["psy"],
      shortCode: "PSY",
      label: "Psychiatry",
      archiveTitle: "Adventures in Psychiatry",
      description: "Interview, differential diagnosis, safety assessment, and management planning.",
      previewBody: "Open a patient story built around symptoms, risk, communication, and the next right clinical step.",
      reflectionText: "Feedback stays close to the encounter: missed questions and premature conclusions change the conversation before the debrief explains what shifted.",
      tags: ["Diagnostic reasoning", "Interview skills", "Communication", "Ethics"],
      prefix: "AdventuresInPsychiatry-Case",
      shortPrompt: "Behavioral health cases with reflective debriefs.",
      seriesPrompt: "Published psychiatry cases ready to open now.",
      baseColor: "#7f4b52",
      topColor: "#b46a66",
      accentColor: "#f0d3c2",
      maxN: 90,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 10
    },
    {
      id: "internal-medicine",
      aliases: ["im"],
      shortCode: "IM",
      label: "Internal Medicine",
      archiveTitle: "Adventures in Internal Medicine",
      description: "Broad complaint to focused differential, testing strategy, and next-step management.",
      previewBody: "These cases emphasize clinical synthesis, prioritization, and disciplined movement through uncertainty.",
      reflectionText: "Future internal medicine cases will focus on whether your workup and management strategy matched the pace of the illness.",
      tags: ["Diagnostic reasoning", "Management choices", "Communication"],
      prefix: "AdventuresInInternalMedicine-Case",
      shortPrompt: "Adult medicine cases are preparing for the archive.",
      seriesPrompt: "This archive is staged and waiting for its first published cases.",
      baseColor: "#365e78",
      topColor: "#5f8cad",
      accentColor: "#d4e6f0",
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: "emergency-medicine",
      aliases: ["em"],
      shortCode: "EM",
      label: "Emergency Medicine",
      archiveTitle: "Adventures in Emergency Medicine",
      description: "Triage, stabilization, high-risk differentials, and time-sensitive decisions.",
      previewBody: "Emergency medicine cases will reward early threat recognition, decisive triage, and rapid management under uncertainty.",
      reflectionText: "The reflective layer here centers on what you stabilized first, what you nearly missed, and how the clock changed the case.",
      tags: ["Emergency triage", "Management choices", "Communication"],
      prefix: "AdventuresInEmergencyMedicine-Case",
      shortPrompt: "Time-sensitive emergency cases are on deck.",
      seriesPrompt: "This archive is staged and waiting for its first published cases.",
      baseColor: "#8a4938",
      topColor: "#c2765a",
      accentColor: "#f0d0c3",
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: "neurology",
      aliases: ["neuro"],
      shortCode: "NEU",
      label: "Neurology",
      archiveTitle: "Adventures in Neurology",
      description: "Localization, urgency recognition, neurologic interview, and longitudinal reasoning.",
      previewBody: "Neurology cases will train careful history-taking, localization, and the difference between urgent and non-urgent pathways.",
      reflectionText: "The debrief will emphasize whether your exam logic and localization strategy actually matched the patient course.",
      tags: ["Diagnostic reasoning", "Interview skills", "Management choices"],
      prefix: "AdventuresInNeurology-Case",
      shortPrompt: "Neurology cases are preparing for the archive.",
      seriesPrompt: "This archive is staged and waiting for its first published cases.",
      baseColor: "#4d4f7e",
      topColor: "#7b7fb6",
      accentColor: "#d6d8f4",
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: "surgery",
      aliases: ["surg"],
      shortCode: "SUR",
      label: "Surgery",
      archiveTitle: "Adventures in Surgery",
      description: "Perioperative judgment, acute decision-making, consultation, and escalation.",
      previewBody: "Surgery cases will focus on urgency, communication, operative readiness, and what cannot wait.",
      reflectionText: "Reflective feedback here will weigh decisiveness against overcalling, undercalling, and poor escalation.",
      tags: ["Emergency triage", "Management choices", "Communication"],
      prefix: "AdventuresInSurgery-Case",
      shortPrompt: "Surgery cases are preparing for the archive.",
      seriesPrompt: "This archive is staged and waiting for its first published cases.",
      baseColor: "#52634e",
      topColor: "#839978",
      accentColor: "#dfe8d8",
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: "pediatrics",
      aliases: ["peds"],
      shortCode: "PED",
      label: "Pediatrics",
      archiveTitle: "Adventures in Pediatrics",
      description: "Family-centered communication, developmental context, acute assessment, and management.",
      previewBody: "Pediatrics cases will combine serious clinical reasoning with communication that includes both the patient and caregivers.",
      reflectionText: "The reflective layer will emphasize communication, age-appropriate assessment, and how the family context changed the choices.",
      tags: ["Interview skills", "Communication", "Ethics", "Management choices"],
      prefix: "AdventuresInPediatrics-Case",
      shortPrompt: "Pediatrics cases are preparing for the archive.",
      seriesPrompt: "This archive is staged and waiting for its first published cases.",
      baseColor: "#5a6b50",
      topColor: "#91aa77",
      accentColor: "#dce8c9",
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    }
  ];

  const state = {
    specialtyButtons: new Map(),
    records: new Map(),
    selectedSeriesId: null,
    selectedCaseKey: null,
    liveSeriesCount: 0,
    liveCaseCount: 0,
    firstLiveCase: null,
    currentFrameSrc: "",
    mediaQuery: window.matchMedia("(max-width: 980px)")
  };

  const aliasMap = new Map();
  SERIES.forEach(function (series) {
    aliasMap.set(series.id, series.id);
    series.aliases.forEach(function (alias) {
      aliasMap.set(alias, series.id);
    });
  });

  const els = {
    workspaceShell: document.querySelector(".workspaceShell"),
    sidebarToggleButton: document.getElementById("sidebarToggleButton"),
    restartCaseButton: document.getElementById("restartCaseButton"),
    standaloneLink: document.getElementById("standaloneLink"),
    activeSeriesEyebrow: document.getElementById("activeSeriesEyebrow"),
    activeCaseTitle: document.getElementById("activeCaseTitle"),
    selectedSeriesTitle: document.getElementById("selectedSeriesTitle"),
    specialtyMeta: document.getElementById("specialtyMeta"),
    specialtyRail: document.getElementById("specialtyRail"),
    selectedSeriesMeta: document.getElementById("selectedSeriesMeta"),
    caseList: document.getElementById("caseList"),
    emptyShelf: document.getElementById("emptyShelf"),
    collapsedSidebarCard: document.getElementById("collapsedSidebarCard"),
    collapsedSeriesLabel: document.getElementById("collapsedSeriesLabel"),
    collapsedCaseNumber: document.getElementById("collapsedCaseNumber"),
    viewerEmpty: document.getElementById("viewerEmpty"),
    viewerEmptyTitle: document.getElementById("viewerEmptyTitle"),
    viewerEmptyCopy: document.getElementById("viewerEmptyCopy"),
    caseFrame: document.getElementById("caseFrame"),
    sidebarScrim: document.getElementById("sidebarScrim")
  };

  function key(seriesId, caseNumber) {
    return seriesId + ":" + String(caseNumber);
  }

  function cleanText(value) {
    return String(value || "").replace(/^[\s"']+|[\s"']+$/g, "").trim();
  }

  function decodeHtml(value) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  function isMobileLayout() {
    return state.mediaQuery.matches;
  }

  function setSeriesColors(target, def) {
    target.style.setProperty("--series-top", def.topColor);
    target.style.setProperty("--series-bottom", def.baseColor);
    target.style.setProperty("--series-accent", def.accentColor);
  }

  function setLinkState(link, href, enabled) {
    if (enabled) {
      link.href = href;
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
      return;
    }

    link.href = "about:blank";
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
  }

  function pluralizeCases(count) {
    return count + (count === 1 ? " published case" : " published cases");
  }

  function updateHash(seriesId, caseNumber) {
    let hash = "#";
    if (seriesId && caseNumber) {
      hash = "#series=" + encodeURIComponent(seriesId) + "&case=" + encodeURIComponent(String(caseNumber));
    } else if (seriesId) {
      hash = "#series=" + encodeURIComponent(seriesId);
    }

    try {
      history.replaceState(null, "", hash);
    } catch (_error) {
      location.hash = hash;
    }
  }

  function parseHash() {
    const raw = String(location.hash || "").replace(/^#/, "");
    if (!raw) {
      return null;
    }

    try {
      const params = new URLSearchParams(raw);
      const rawSeries = String(params.get("series") || params.get("section") || "").trim().toLowerCase();
      const seriesId = aliasMap.get(rawSeries);
      const caseValue = String(params.get("case") || "").trim();
      const caseNumber = caseValue ? parseInt(caseValue, 10) : null;

      if (!seriesId) {
        return null;
      }

      return {
        seriesId: seriesId,
        caseNumber: Number.isFinite(caseNumber) ? caseNumber : null
      };
    } catch (_error) {
      return null;
    }
  }

  async function exists(url) {
    try {
      let response = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (response.ok) {
        return true;
      }
      if (response.status === 403 || response.status === 405) {
        response = await fetch(url, { method: "GET", cache: "no-store" });
        return response.ok;
      }
      return false;
    } catch (_error) {
      return false;
    }
  }

  async function fetchText(url) {
    try {
      const response = await fetch(url, { method: "GET", cache: "no-store" });
      if (!response.ok) {
        return "";
      }
      return await response.text();
    } catch (_error) {
      return "";
    }
  }

  function extractCaseMeta(text, caseNumber, def) {
    const storyMatch = text.match(/<tw-storydata[^>]*\bname="([^"]+)"/i);
    const noscriptMatch = text.match(/<tw-noscript>([\s\S]*?)<\/tw-noscript>/i);
    const rawValue = storyMatch ? storyMatch[1] : noscriptMatch ? noscriptMatch[1] : "";
    const decoded = decodeHtml(rawValue).replace(/\s+/g, " ").trim();

    if (!decoded) {
      return {
        displayTitle: "Case " + caseNumber,
        subtitle: def.shortPrompt,
        fullCaseLabel: def.archiveTitle + " - Case " + caseNumber
      };
    }

    const withoutPrefix = decoded
      .replace(/^JavaScript needs to be enabled to play\s*/i, "")
      .replace(/^Case\s+\d+\s*:\s*/i, "")
      .replace(/\.$/, "")
      .trim();
    const parts = withoutPrefix.split(/\s+-\s+/);

    return {
      displayTitle: cleanText(parts.shift() || ("Case " + caseNumber)) || ("Case " + caseNumber),
      subtitle: cleanText(parts.join(" - ")) || def.shortPrompt,
      fullCaseLabel: decoded
    };
  }

  async function hydrateCaseInfo(def, href, caseNumber) {
    const text = await fetchText(href);
    const meta = extractCaseMeta(text, caseNumber, def);
    return {
      n: caseNumber,
      href: href,
      displayTitle: meta.displayTitle,
      subtitle: meta.subtitle,
      fullCaseLabel: meta.fullCaseLabel
    };
  }

  async function scanSeries(def) {
    const found = [];
    let consecutiveMisses = 0;

    for (let n = 1; n <= def.maxN; n += 1) {
      const href = def.prefix + n + ".html";
      const live = await exists(href);

      if (live) {
        found.push({ n: n, href: href });
        consecutiveMisses = 0;
      } else {
        consecutiveMisses += 1;
      }

      if (!found.length && n >= def.emptyProbeMax) {
        break;
      }

      if (found.length && consecutiveMisses >= def.stopAfterConsecutiveMisses) {
        break;
      }
    }

    if (!found.length) {
      return {
        def: def,
        cases: [],
        liveCount: 0
      };
    }

    const hydrated = await Promise.all(found.map(function (entry) {
      return hydrateCaseInfo(def, entry.href, entry.n);
    }));

    return {
      def: def,
      cases: hydrated.sort(function (a, b) {
        return a.n - b.n;
      }),
      liveCount: hydrated.length
    };
  }

  function renderCounts() {
    els.specialtyMeta.textContent = SERIES.length + " archives";
  }

  function renderSpecialtyRail() {
    els.specialtyRail.innerHTML = "";
    state.specialtyButtons.clear();

    SERIES.forEach(function (def) {
      const record = state.records.get(def.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "specialtyButton";
      setSeriesColors(button, def);
      button.innerHTML =
        '<span class="specialtyButtonLabel">' + def.label + "</span>" +
        '<span class="specialtyButtonMeta">' + (record.cases.length ? pluralizeCases(record.cases.length) : "Archive preparing") + "</span>";
      button.addEventListener("click", function () {
        selectSeries(def.id, false);
      });
      state.specialtyButtons.set(def.id, button);
      els.specialtyRail.appendChild(button);
    });
  }

  function setActiveSpecialtyButton(seriesId) {
    state.specialtyButtons.forEach(function (button, id) {
      button.classList.toggle("isActive", id === seriesId);
    });
  }

  function renderCaseList(record) {
    els.caseList.innerHTML = "";
    els.emptyShelf.classList.toggle("isHidden", record.cases.length > 0);

    if (!record.cases.length) {
      return;
    }

    record.cases.forEach(function (caseInfo) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "caseButton";
      setSeriesColors(button, record.def);
      if (state.selectedCaseKey === key(record.def.id, caseInfo.n)) {
        button.classList.add("isActive");
      }
      button.innerHTML =
        '<span class="caseButtonNumber">' + String(caseInfo.n).padStart(2, "0") + "</span>" +
        '<span class="caseButtonBody">' +
          '<strong class="caseButtonTitle">' + caseInfo.displayTitle + "</strong>" +
          '<span class="caseButtonSubtitle">' + caseInfo.subtitle + "</span>" +
        "</span>";
      button.addEventListener("click", function () {
        selectCase(record.def.id, caseInfo.n, false);
      });
      els.caseList.appendChild(button);
    });
  }

  function getSelectedCase(record) {
    if (!record || !record.cases.length) {
      return null;
    }

    if (!state.selectedCaseKey) {
      return record.cases[0];
    }

    const parts = state.selectedCaseKey.split(":");
    if (parts[0] !== record.def.id) {
      return record.cases[0];
    }

    const caseNumber = parseInt(parts[1], 10);
    return record.cases.find(function (entry) {
      return entry.n === caseNumber;
    }) || record.cases[0];
  }

  function closeDrawer() {
    document.body.classList.remove("drawerOpen");
    els.sidebarScrim.classList.add("isHidden");
    updateSidebarToggleButton();
  }

  function updateSidebarToggleButton() {
    const mobile = isMobileLayout();
    const drawerOpen = document.body.classList.contains("drawerOpen");
    const collapsed = document.body.classList.contains("sidebarCollapsed");
    const expanded = mobile ? drawerOpen : !collapsed;

    els.sidebarToggleButton.textContent = mobile
      ? (drawerOpen ? "Hide selector" : "Browse cases")
      : (collapsed ? "Show selector" : "Hide selector");
    els.sidebarToggleButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    els.collapsedSidebarCard.setAttribute("aria-hidden", collapsed ? "false" : "true");
  }

  function applySelectedContext(record, caseInfo) {
    const def = record.def;
    setSeriesColors(els.workspaceShell, def);
    setActiveSpecialtyButton(def.id);
    renderCaseList(record);

    els.activeSeriesEyebrow.textContent = def.archiveTitle;
    els.activeCaseTitle.textContent = caseInfo ? "Case " + caseInfo.n + ": " + caseInfo.displayTitle : def.archiveTitle;

    els.selectedSeriesTitle.textContent = def.label;
    els.selectedSeriesMeta.textContent = record.cases.length ? pluralizeCases(record.cases.length) : "No published cases yet";
    els.collapsedSeriesLabel.textContent = def.shortCode;
    els.collapsedCaseNumber.textContent = caseInfo ? String(caseInfo.n).padStart(2, "0") : "--";

    setLinkState(els.standaloneLink, caseInfo ? caseInfo.href : "", Boolean(caseInfo));
    els.restartCaseButton.disabled = !caseInfo;
  }

  function showEmptyViewer(record) {
    els.viewerEmpty.classList.remove("isHidden");
    els.caseFrame.classList.add("isHidden");
    els.caseFrame.src = "about:blank";
    state.currentFrameSrc = "";
    els.viewerEmptyTitle.textContent = record.def.archiveTitle + " is preparing";
    els.viewerEmptyCopy.textContent = "This archive is already part of the medicine workspace and will load here as soon as its standalone cases are published.";
  }

  function loadCase(caseInfo, forceReload) {
    els.viewerEmpty.classList.add("isHidden");
    els.caseFrame.classList.remove("isHidden");

    if (!forceReload && state.currentFrameSrc === caseInfo.href) {
      return;
    }

    state.currentFrameSrc = caseInfo.href;

    if (forceReload) {
      els.caseFrame.src = "about:blank";
      window.requestAnimationFrame(function () {
        els.caseFrame.src = caseInfo.href;
      });
      return;
    }

    els.caseFrame.src = caseInfo.href;
  }

  function selectSeries(seriesId, preserveCase) {
    const record = state.records.get(seriesId);
    if (!record) {
      return;
    }

    state.selectedSeriesId = seriesId;

    if (!preserveCase || !getSelectedCase(record)) {
      state.selectedCaseKey = record.cases.length ? key(seriesId, record.cases[0].n) : null;
    }

    const selectedCase = getSelectedCase(record);
    applySelectedContext(record, selectedCase);

    if (selectedCase) {
      loadCase(selectedCase, false);
    } else {
      showEmptyViewer(record);
    }

    updateHash(seriesId, selectedCase ? selectedCase.n : null);

    if (isMobileLayout()) {
      closeDrawer();
    }
  }

  function selectCase(seriesId, caseNumber, forceReload) {
    const record = state.records.get(seriesId);
    if (!record) {
      return;
    }

    const caseInfo = record.cases.find(function (entry) {
      return entry.n === caseNumber;
    });

    if (!caseInfo) {
      selectSeries(seriesId, false);
      return;
    }

    state.selectedSeriesId = seriesId;
    state.selectedCaseKey = key(seriesId, caseNumber);
    applySelectedContext(record, caseInfo);
    loadCase(caseInfo, forceReload);
    updateHash(seriesId, caseNumber);

    if (isMobileLayout()) {
      closeDrawer();
    }
  }

  function restartCurrentCase() {
    if (!state.selectedSeriesId || !state.selectedCaseKey) {
      return;
    }

    const record = state.records.get(state.selectedSeriesId);
    const caseInfo = getSelectedCase(record);

    if (record && caseInfo) {
      applySelectedContext(record, caseInfo);
      loadCase(caseInfo, true);
    }
  }

  function restoreFromHash() {
    const requested = parseHash();

    if (!requested) {
      if (state.firstLiveCase) {
        selectCase(state.firstLiveCase.def.id, state.firstLiveCase.caseInfo.n, false);
        return;
      }

      selectSeries(SERIES[0].id, false);
      return;
    }

    const record = state.records.get(requested.seriesId);
    if (!record) {
      return;
    }

    if (requested.caseNumber) {
      const matchingCase = record.cases.find(function (entry) {
        return entry.n === requested.caseNumber;
      });
      if (matchingCase) {
        selectCase(requested.seriesId, requested.caseNumber, false);
        return;
      }
    }

    selectSeries(requested.seriesId, false);
  }

  async function initRecords() {
    for (const def of SERIES) {
      const record = await scanSeries(def);
      state.records.set(def.id, record);
      if (record.liveCount > 0) {
        state.liveSeriesCount += 1;
        state.liveCaseCount += record.liveCount;
        if (!state.firstLiveCase) {
          state.firstLiveCase = {
            def: def,
            caseInfo: record.cases[0]
          };
        }
      }
    }
  }

  function handleSidebarToggle() {
    if (isMobileLayout()) {
      const shouldOpen = !document.body.classList.contains("drawerOpen");
      document.body.classList.toggle("drawerOpen", shouldOpen);
      els.sidebarScrim.classList.toggle("isHidden", !shouldOpen);
      updateSidebarToggleButton();
      return;
    }

    document.body.classList.toggle("sidebarCollapsed");
    updateSidebarToggleButton();
  }

  function handleLayoutChange() {
    if (!isMobileLayout()) {
      closeDrawer();
    }
    updateSidebarToggleButton();
  }

  async function init() {
    await initRecords();
    renderCounts();
    renderSpecialtyRail();
    restoreFromHash();
    updateSidebarToggleButton();
  }

  els.sidebarToggleButton.addEventListener("click", handleSidebarToggle);
  els.restartCaseButton.addEventListener("click", restartCurrentCase);
  els.standaloneLink.addEventListener("click", function (event) {
    if (els.standaloneLink.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
    }
  });
  els.sidebarScrim.addEventListener("click", closeDrawer);
  if (typeof state.mediaQuery.addEventListener === "function") {
    state.mediaQuery.addEventListener("change", handleLayoutChange);
  } else if (typeof state.mediaQuery.addListener === "function") {
    state.mediaQuery.addListener(handleLayoutChange);
  }

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("drawerOpen")) {
      closeDrawer();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
