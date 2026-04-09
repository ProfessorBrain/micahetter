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
      candidatePrefixes: [
        "cases/psychiatry/AdventuresInPsychiatry-Case",
        "AdventuresInPsychiatry-Case"
      ],
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
      candidatePrefixes: [
        "cases/internal-medicine/AdventuresInInternalMedicine-Case",
        "AdventuresInInternalMedicine-Case"
      ],
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
      candidatePrefixes: [
        "cases/emergency-medicine/AdventuresInEmergencyMedicine-Case",
        "AdventuresInEmergencyMedicine-Case"
      ],
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
      candidatePrefixes: [
        "cases/neurology/AdventuresInNeurology-Case",
        "AdventuresInNeurology-Case"
      ],
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
      candidatePrefixes: [
        "cases/surgery/AdventuresInSurgery-Case",
        "AdventuresInSurgery-Case"
      ],
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
      candidatePrefixes: [
        "cases/pediatrics/AdventuresInPediatrics-Case",
        "AdventuresInPediatrics-Case"
      ],
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
    collapsedSidebarToggleButton: document.getElementById("collapsedSidebarToggleButton"),
    casePanel: document.getElementById("casePanel"),
    casePanelBackButton: document.getElementById("casePanelBackButton"),
    restartCaseButton: document.getElementById("restartCaseButton"),
    specialtyRail: document.getElementById("specialtyRail"),
    caseList: document.getElementById("caseList"),
    emptyShelf: document.getElementById("emptyShelf"),
    emptyShelfTitle: document.querySelector("#emptyShelf .emptyListTitle"),
    emptyShelfCopy: document.querySelector("#emptyShelf .emptyListCopy"),
    collapsedSidebarCard: document.getElementById("collapsedSidebarCard"),
    collapsedSeriesLabel: document.getElementById("collapsedSeriesLabel"),
    collapsedCaseNumber: document.getElementById("collapsedCaseNumber"),
    viewerEmpty: document.getElementById("viewerEmpty"),
    viewerWelcome: document.getElementById("viewerWelcome"),
    viewerWelcomeStatus: document.getElementById("viewerWelcomeStatus"),
    viewerMessage: document.getElementById("viewerMessage"),
    viewerEmptyEyebrow: document.getElementById("viewerEmptyEyebrow"),
    viewerEmptyTitle: document.getElementById("viewerEmptyTitle"),
    viewerEmptyCopy: document.getElementById("viewerEmptyCopy"),
    caseFrame: document.getElementById("caseFrame"),
    sidebarScrim: document.getElementById("sidebarScrim")
  };

  function createRecord(def) {
    return {
      def: def,
      cases: [],
      liveCount: 0,
      status: "idle",
      loadingPromise: null
    };
  }

  function key(seriesId, caseNumber) {
    return seriesId + ":" + String(caseNumber);
  }

  function buildCandidateHrefs(def, caseNumber) {
    const prefixes = Array.isArray(def.candidatePrefixes) && def.candidatePrefixes.length
      ? def.candidatePrefixes
      : [def.prefix];

    return prefixes.map(function (prefix) {
      return prefix + caseNumber + ".html";
    });
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

  function extractNamedMeta(text, name) {
    const escapedName = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp('<meta[^>]*\\bname=["\']' + escapedName + '["\'][^>]*\\bcontent=["\']([^"\']*)["\'][^>]*>', "i"),
      new RegExp('<meta[^>]*\\bcontent=["\']([^"\']*)["\'][^>]*\\bname=["\']' + escapedName + '["\'][^>]*>', "i")
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return decodeHtml(match[1]).replace(/\s+/g, " ").trim();
      }
    }

    return "";
  }

  function extractCaseMeta(text, caseNumber, def) {
    const explicitTitle = extractNamedMeta(text, "adventures-case-title");
    const explicitSubtitle = extractNamedMeta(text, "adventures-case-subtitle");

    if (explicitTitle || explicitSubtitle) {
      const title = cleanText(explicitTitle || ("Case " + caseNumber)) || ("Case " + caseNumber);
      const subtitle = cleanText(explicitSubtitle || def.shortPrompt) || def.shortPrompt;
      return {
        displayTitle: title,
        subtitle: subtitle,
        fullCaseLabel: title + " - " + subtitle
      };
    }

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

  async function hydrateCaseInfo(def, caseNumber) {
    const candidates = buildCandidateHrefs(def, caseNumber);

    for (const href of candidates) {
      const text = await fetchText(href);
      if (!text) {
        continue;
      }

      const meta = extractCaseMeta(text, caseNumber, def);
      return {
        n: caseNumber,
        href: href,
        displayTitle: meta.displayTitle,
        subtitle: meta.subtitle,
        fullCaseLabel: meta.fullCaseLabel
      };
    }

    return null;
  }

  async function scanSeries(def) {
    const found = [];
    let consecutiveMisses = 0;
    const batchSize = 8;

    scanLoop:
    for (let start = 1; start <= def.maxN; start += batchSize) {
      const batchNumbers = [];
      for (let n = start; n < start + batchSize && n <= def.maxN; n += 1) {
        batchNumbers.push(n);
      }

      const batch = await Promise.all(batchNumbers.map(async function (caseNumber) {
        return {
          n: caseNumber,
          caseInfo: await hydrateCaseInfo(def, caseNumber)
        };
      }));

      for (const entry of batch) {
        if (entry.caseInfo) {
          found.push(entry.caseInfo);
          consecutiveMisses = 0;
        } else {
          consecutiveMisses += 1;
        }

        if (!found.length && entry.n >= def.emptyProbeMax) {
          break scanLoop;
        }

        if (found.length && consecutiveMisses >= def.stopAfterConsecutiveMisses) {
          break scanLoop;
        }
      }
    }

    return {
      def: def,
      cases: found.sort(function (a, b) {
        return a.n - b.n;
      }),
      liveCount: found.length
    };
  }

  async function ensureSeriesLoaded(seriesId) {
    const record = state.records.get(seriesId);
    if (!record) {
      return null;
    }

    if (record.status === "ready") {
      return record;
    }

    if (record.loadingPromise) {
      return record.loadingPromise;
    }

    record.status = "loading";
    record.loadingPromise = scanSeries(record.def)
      .then(function (loadedRecord) {
        record.cases = loadedRecord.cases;
        record.liveCount = loadedRecord.liveCount;
        record.status = "ready";
        record.loadingPromise = null;
        return record;
      })
      .catch(function (_error) {
        record.cases = [];
        record.liveCount = 0;
        record.status = "error";
        record.loadingPromise = null;
        return record;
      });

    return record.loadingPromise;
  }

  function updateCasePanelNotice(title, copy) {
    els.emptyShelfTitle.textContent = title;
    els.emptyShelfCopy.textContent = copy;
    els.emptyShelf.classList.remove("isHidden");
  }

  function renderSpecialtyRail() {
    els.specialtyRail.innerHTML = "";
    state.specialtyButtons.clear();

    SERIES.forEach(function (def) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "specialtyButton";
      setSeriesColors(button, def);
      button.innerHTML = '<span class="specialtyButtonLabel">' + def.label + "</span>";
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
    els.emptyShelf.classList.add("isHidden");

    if (record.status === "loading") {
      updateCasePanelNotice(
        "Loading cases",
        "Checking this specialty archive for published cases."
      );
      return;
    }

    if (record.status === "error") {
      updateCasePanelNotice(
        "Could not load cases",
        "Try this specialty again. If you recently moved files, make sure the case HTML is reachable from this workspace."
      );
      return;
    }

    if (!record.cases.length) {
      updateCasePanelNotice(
        "Archive in preparation",
        "This specialty is already part of the workspace and is ready for future standalone cases."
      );
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
      return null;
    }

    const parts = state.selectedCaseKey.split(":");
    if (parts[0] !== record.def.id) {
      return null;
    }

    const caseNumber = parseInt(parts[1], 10);
    return record.cases.find(function (entry) {
      return entry.n === caseNumber;
    }) || null;
  }

  function closeDrawer() {
    document.body.classList.remove("drawerOpen");
    closeCaseColumn();
    els.sidebarScrim.classList.add("isHidden");
    updateSidebarToggleButton();
  }

  function setCaseColumnOpen(open) {
    document.body.classList.toggle("caseColumnOpen", open);
    els.casePanel.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function openCaseColumn() {
    setCaseColumnOpen(true);
  }

  function closeCaseColumn() {
    setCaseColumnOpen(false);
  }

  function updateSidebarToggleButton() {
    const mobile = isMobileLayout();
    const drawerOpen = document.body.classList.contains("drawerOpen");
    const collapsed = document.body.classList.contains("sidebarCollapsed");
    const expanded = mobile ? drawerOpen : !collapsed;
    const collapsedLabel = mobile ? "Browse cases" : "Browse";
    const collapsedVisible = mobile ? !drawerOpen : collapsed;

    els.sidebarToggleButton.textContent = mobile
      ? (drawerOpen ? "Hide Sidebar" : "Browse cases")
      : (collapsed ? "Show Sidebar" : "Hide Sidebar");
    els.sidebarToggleButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    els.collapsedSidebarToggleButton.textContent = collapsedLabel;
    els.collapsedSidebarToggleButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    els.collapsedSidebarCard.setAttribute("aria-hidden", collapsedVisible ? "false" : "true");
  }

  function applySelectedContext(record, caseInfo) {
    const def = record.def;
    setSeriesColors(els.workspaceShell, def);
    setActiveSpecialtyButton(def.id);
    renderCaseList(record);

    els.collapsedSeriesLabel.textContent = def.shortCode;
    els.collapsedCaseNumber.textContent = caseInfo ? String(caseInfo.n).padStart(2, "0") : "--";
    document.title = caseInfo
      ? "Adventures in Medicine - " + def.label + " - Case " + caseInfo.n + ": " + caseInfo.displayTitle
      : "Adventures in Medicine - " + def.label;

    els.restartCaseButton.disabled = !caseInfo;
  }

  function resetViewerSurface() {
    els.viewerEmpty.classList.remove("isHidden");
    els.caseFrame.classList.add("isHidden");
    els.caseFrame.src = "about:blank";
    state.currentFrameSrc = "";
  }

  function showViewerPlaceholder(eyebrow, title, copy) {
    resetViewerSurface();
    els.viewerWelcome.classList.add("isHidden");
    els.viewerMessage.classList.remove("isHidden");
    els.viewerEmptyEyebrow.textContent = eyebrow;
    els.viewerEmptyTitle.textContent = title;
    els.viewerEmptyCopy.textContent = copy;
  }

  function showWelcomeViewer(record) {
    const activeRecord = record || null;
    document.title = activeRecord
      ? "Adventures in Medicine - " + activeRecord.def.label
      : "Adventures in Medicine";
    setActiveSpecialtyButton(activeRecord ? activeRecord.def.id : null);
    els.collapsedSeriesLabel.textContent = activeRecord ? activeRecord.def.shortCode : "AM";
    els.collapsedCaseNumber.textContent = "--";
    if (!activeRecord) {
      els.caseList.innerHTML = "";
      els.emptyShelf.classList.add("isHidden");
    }
    els.restartCaseButton.disabled = true;
    resetViewerSurface();
    els.viewerWelcome.classList.remove("isHidden");
    els.viewerMessage.classList.add("isHidden");
    els.viewerWelcomeStatus.textContent = activeRecord
      ? activeRecord.def.label + " is open in the sidebar. Select any published case there to begin the simulator."
      : "Start on the left by choosing a specialty, then select any published case to launch the simulator.";
  }

  function showSeriesViewer(record) {
    showWelcomeViewer(record);
  }

  function showSeriesLoading(record) {
    showViewerPlaceholder(
      record.def.label,
      "Loading " + record.def.label + " cases",
      "Checking this specialty directory for published cases and preparing the case list."
    );
  }

  function showEmptyViewer(record) {
    showViewerPlaceholder(
      record.def.label,
      record.def.archiveTitle + " is preparing",
      "This archive is already part of the medicine workspace and will load here as soon as its standalone cases are published."
    );
  }

  function showSeriesError(record) {
    showViewerPlaceholder(
      record.def.label,
      "Could not load " + record.def.label,
      "The workspace could not finish scanning this specialty. If you recently moved files, check the case paths and try again."
    );
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

  function syncSeriesSelection(record) {
    const selectedCase = getSelectedCase(record);
    applySelectedContext(record, selectedCase);

    if (record.status === "loading") {
      showSeriesLoading(record);
    } else if (record.status === "error") {
      showSeriesError(record);
    } else if (selectedCase) {
      loadCase(selectedCase, false);
    } else if (record.cases.length) {
      showSeriesViewer(record);
    } else {
      showEmptyViewer(record);
    }

    updateHash(record.def.id, selectedCase ? selectedCase.n : null);
  }

  async function selectSeries(seriesId, preserveCase) {
    const record = state.records.get(seriesId);
    if (!record) {
      return;
    }

    state.selectedSeriesId = seriesId;

    if (!preserveCase || !state.selectedCaseKey || state.selectedCaseKey.split(":")[0] !== seriesId) {
      state.selectedCaseKey = null;
    }

    openCaseColumn();
    const loadingPromise = record.status === "ready" ? null : ensureSeriesLoaded(seriesId);
    syncSeriesSelection(record);

    if (loadingPromise) {
      await loadingPromise;
      if (state.selectedSeriesId !== seriesId) {
        return;
      }
      syncSeriesSelection(record);
    }
  }

  async function selectCase(seriesId, caseNumber, forceReload) {
    const record = state.records.get(seriesId);
    if (!record) {
      return;
    }

    state.selectedSeriesId = seriesId;
    state.selectedCaseKey = key(seriesId, caseNumber);
    openCaseColumn();

    const loadingPromise = record.status === "ready" ? null : ensureSeriesLoaded(seriesId);
    if (loadingPromise) {
      applySelectedContext(record, null);
      showSeriesLoading(record);
      updateHash(seriesId, caseNumber);
      await loadingPromise;
      if (state.selectedSeriesId !== seriesId || state.selectedCaseKey !== key(seriesId, caseNumber)) {
        return;
      }
    }

    const currentRecord = state.records.get(seriesId);
    const caseInfo = currentRecord.cases.find(function (entry) {
      return entry.n === caseNumber;
    });

    if (!caseInfo) {
      await selectSeries(seriesId, false);
      return;
    }

    applySelectedContext(currentRecord, caseInfo);
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

  async function restoreFromHash() {
    const requested = parseHash();

    if (!requested) {
      state.selectedSeriesId = null;
      state.selectedCaseKey = null;
      closeCaseColumn();
      showWelcomeViewer();
      return;
    }

    const record = state.records.get(requested.seriesId);
    if (!record) {
      state.selectedSeriesId = null;
      state.selectedCaseKey = null;
      closeCaseColumn();
      showWelcomeViewer();
      return;
    }

    if (requested.caseNumber) {
      await selectCase(requested.seriesId, requested.caseNumber, false);
      return;
    }

    await selectSeries(requested.seriesId, false);
  }

  function initRecords() {
    SERIES.forEach(function (def) {
      state.records.set(def.id, createRecord(def));
    });
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
    if (isMobileLayout()) {
      document.body.classList.remove("sidebarCollapsed");
    } else {
      closeDrawer();
    }
    updateSidebarToggleButton();
  }

  async function init() {
    initRecords();
    renderSpecialtyRail();
    await restoreFromHash();
    updateSidebarToggleButton();
  }

  els.sidebarToggleButton.addEventListener("click", handleSidebarToggle);
  els.collapsedSidebarToggleButton.addEventListener("click", handleSidebarToggle);
  els.casePanelBackButton.addEventListener("click", closeCaseColumn);
  els.restartCaseButton.addEventListener("click", restartCurrentCase);
  els.sidebarScrim.addEventListener("click", closeDrawer);
  if (typeof state.mediaQuery.addEventListener === "function") {
    state.mediaQuery.addEventListener("change", handleLayoutChange);
  } else if (typeof state.mediaQuery.addListener === "function") {
    state.mediaQuery.addListener(handleLayoutChange);
  }

  window.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    if (document.body.classList.contains("drawerOpen")) {
      closeDrawer();
      return;
    }

    if (document.body.classList.contains("caseColumnOpen")) {
      closeCaseColumn();
    }
  });

  window.addEventListener("hashchange", function () {
    restoreFromHash();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
