(function () {
  const SERIES = [
    {
      id: 'psychiatry',
      aliases: ['psy'],
      label: 'Psychiatry',
      archiveTitle: 'Adventures in Psychiatry',
      description: 'Interview, differential diagnosis, safety assessment, and management planning.',
      previewBody: 'Open a patient story built around symptoms, risk, communication, and the next right clinical step.',
      reflectionText: 'Feedback stays close to the encounter: missed questions and premature conclusions change the conversation before the debrief explains what shifted.',
      tags: ['Diagnostic reasoning', 'Interview skills', 'Communication', 'Ethics'],
      prefix: 'AdventuresInPsychiatry-Case',
      shortPrompt: 'Behavioral health cases with reflective debriefs.',
      seriesPrompt: 'Published psychiatry cases ready to open now.',
      baseColor: '#7f4b52',
      topColor: '#b46a66',
      accentColor: '#f0d3c2',
      maxN: 90,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 10
    },
    {
      id: 'internal-medicine',
      aliases: ['im'],
      label: 'Internal Medicine',
      archiveTitle: 'Adventures in Internal Medicine',
      description: 'Broad complaint to focused differential, testing strategy, and next-step management.',
      previewBody: 'These cases will emphasize clinical synthesis, prioritization, and disciplined movement through uncertainty.',
      reflectionText: 'Future internal medicine cases will focus on whether your workup and management strategy matched the pace of the illness.',
      tags: ['Diagnostic reasoning', 'Management choices', 'Communication'],
      prefix: 'AdventuresInInternalMedicine-Case',
      shortPrompt: 'Adult medicine cases are preparing for the archive.',
      seriesPrompt: 'This archive is staged and waiting for its first published cases.',
      baseColor: '#365e78',
      topColor: '#5f8cad',
      accentColor: '#d4e6f0',
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: 'emergency-medicine',
      aliases: ['em'],
      label: 'Emergency Medicine',
      archiveTitle: 'Adventures in Emergency Medicine',
      description: 'Triage, stabilization, high-risk differentials, and time-sensitive decisions.',
      previewBody: 'Emergency medicine cases will reward early threat recognition, decisive triage, and rapid management under uncertainty.',
      reflectionText: 'The reflective layer here centers on what you stabilized first, what you nearly missed, and how the clock changed the case.',
      tags: ['Emergency triage', 'Management choices', 'Communication'],
      prefix: 'AdventuresInEmergencyMedicine-Case',
      shortPrompt: 'Time-sensitive emergency cases are on deck.',
      seriesPrompt: 'This archive is staged and waiting for its first published cases.',
      baseColor: '#8a4938',
      topColor: '#c2765a',
      accentColor: '#f0d0c3',
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: 'neurology',
      aliases: ['neuro'],
      label: 'Neurology',
      archiveTitle: 'Adventures in Neurology',
      description: 'Localization, urgency recognition, neurologic interview, and longitudinal reasoning.',
      previewBody: 'Neurology cases will train careful history-taking, localization, and the difference between urgent and non-urgent pathways.',
      reflectionText: 'The debrief will emphasize whether your exam logic and localization strategy actually matched the patient course.',
      tags: ['Diagnostic reasoning', 'Interview skills', 'Management choices'],
      prefix: 'AdventuresInNeurology-Case',
      shortPrompt: 'Neurology cases are preparing for the archive.',
      seriesPrompt: 'This archive is staged and waiting for its first published cases.',
      baseColor: '#4d4f7e',
      topColor: '#7b7fb6',
      accentColor: '#d6d8f4',
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: 'surgery',
      aliases: ['surg'],
      label: 'Surgery',
      archiveTitle: 'Adventures in Surgery',
      description: 'Perioperative judgment, acute decision-making, consultation, and escalation.',
      previewBody: 'Surgery cases will focus on urgency, communication, operative readiness, and what cannot wait.',
      reflectionText: 'Reflective feedback here will weigh decisiveness against overcalling, undercalling, and poor escalation.',
      tags: ['Emergency triage', 'Management choices', 'Communication'],
      prefix: 'AdventuresInSurgery-Case',
      shortPrompt: 'Surgery cases are preparing for the archive.',
      seriesPrompt: 'This archive is staged and waiting for its first published cases.',
      baseColor: '#52634e',
      topColor: '#839978',
      accentColor: '#dfe8d8',
      maxN: 90,
      emptyProbeMax: 4,
      stopAfterConsecutiveMisses: 8
    },
    {
      id: 'pediatrics',
      aliases: ['peds'],
      label: 'Pediatrics',
      archiveTitle: 'Adventures in Pediatrics',
      description: 'Family-centered communication, developmental context, acute assessment, and management.',
      previewBody: 'Pediatrics cases will combine serious clinical reasoning with communication that includes both the patient and caregivers.',
      reflectionText: 'The reflective layer will emphasize communication, age-appropriate assessment, and how the family context changed the choices.',
      tags: ['Interview skills', 'Communication', 'Ethics', 'Management choices'],
      prefix: 'AdventuresInPediatrics-Case',
      shortPrompt: 'Pediatrics cases are preparing for the archive.',
      seriesPrompt: 'This archive is staged and waiting for its first published cases.',
      baseColor: '#5a6b50',
      topColor: '#91aa77',
      accentColor: '#dce8c9',
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
    overlayOpen: false
  };

  const aliasMap = new Map();
  for (const series of SERIES) {
    aliasMap.set(series.id, series.id);
    for (const alias of series.aliases) {
      aliasMap.set(alias, series.id);
    }
  }

  const els = {
    liveSeriesCount: document.getElementById('liveSeriesCount'),
    liveCaseCount: document.getElementById('liveCaseCount'),
    heroLaunchButton: document.getElementById('heroLaunchButton'),
    heroFeatureTitle: document.getElementById('heroFeatureTitle'),
    heroFeatureText: document.getElementById('heroFeatureText'),
    heroFeatureMeta: document.getElementById('heroFeatureMeta'),
    heroShelf: document.getElementById('heroShelf'),
    specialtyRail: document.getElementById('specialtyRail'),
    selectedSeriesEyebrow: document.getElementById('selectedSeriesEyebrow'),
    selectedSeriesTitle: document.getElementById('selectedSeriesTitle'),
    selectedSeriesMeta: document.getElementById('selectedSeriesMeta'),
    caseShelf: document.getElementById('caseShelf'),
    emptyShelf: document.getElementById('emptyShelf'),
    previewTitle: document.getElementById('previewTitle'),
    previewSubtitle: document.getElementById('previewSubtitle'),
    previewMeta: document.getElementById('previewMeta'),
    previewBody: document.getElementById('previewBody'),
    previewTags: document.getElementById('previewTags'),
    reflectionText: document.getElementById('reflectionText'),
    launchCaseButton: document.getElementById('launchCaseButton'),
    previewStandaloneLink: document.getElementById('previewStandaloneLink'),
    viewerOverlay: document.getElementById('viewerOverlay'),
    closeViewerButton: document.getElementById('closeViewerButton'),
    overlayEyebrow: document.getElementById('overlayEyebrow'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayStandaloneLink: document.getElementById('overlayStandaloneLink'),
    caseFrame: document.getElementById('caseFrame')
  };

  function key(seriesId, caseNumber) {
    return seriesId + ':' + String(caseNumber);
  }

  function decodeHtml(value) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  function updateHash(seriesId, caseNumber) {
    let hash = '#';
    if (seriesId && caseNumber) {
      hash = '#series=' + encodeURIComponent(seriesId) + '&case=' + encodeURIComponent(String(caseNumber));
    } else if (seriesId) {
      hash = '#series=' + encodeURIComponent(seriesId);
    }

    try {
      history.replaceState(null, '', hash);
    } catch (_error) {
      location.hash = hash;
    }
  }

  function parseHash() {
    const raw = String(location.hash || '').replace(/^#/, '');
    if (!raw) {
      return null;
    }

    try {
      const params = new URLSearchParams(raw);
      const rawSeries = String(params.get('series') || params.get('section') || '').trim().toLowerCase();
      const seriesId = aliasMap.get(rawSeries);
      const caseValue = String(params.get('case') || '').trim();
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

  function setSeriesColors(element, def) {
    element.style.setProperty('--series-top', def.topColor);
    element.style.setProperty('--series-bottom', def.baseColor);
    element.style.setProperty('--series-accent', def.accentColor);
  }

  async function exists(url) {
    try {
      let response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        return true;
      }
      if (response.status === 403 || response.status === 405) {
        response = await fetch(url, { method: 'GET', cache: 'no-store' });
        return response.ok;
      }
      return false;
    } catch (_error) {
      return false;
    }
  }

  async function fetchText(url) {
    try {
      const response = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        return '';
      }
      return await response.text();
    } catch (_error) {
      return '';
    }
  }

  function stripQuotes(value) {
    return value.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, '').trim();
  }

  function cleanText(value) {
    return String(value || '').replace(/^[\s"']+|[\s"']+$/g, '').trim();
  }

  function setLinkState(link, href, enabled) {
    if (enabled) {
      link.href = href;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
      return;
    }

    link.href = 'about:blank';
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
  }

  function extractCaseMeta(text, caseNumber, def) {
    const storyMatch = text.match(/<tw-storydata[^>]*\bname="([^"]+)"/i);
    const noscriptMatch = text.match(/<tw-noscript>([\s\S]*?)<\/tw-noscript>/i);
    const rawValue = storyMatch ? storyMatch[1] : noscriptMatch ? noscriptMatch[1] : '';
    const decoded = decodeHtml(rawValue).replace(/\s+/g, ' ').trim();

    if (!decoded) {
      return {
        displayTitle: 'Case ' + caseNumber,
        subtitle: def.shortPrompt,
        fullCaseLabel: def.archiveTitle + ' - Case ' + caseNumber
      };
    }

    const withoutPrefix = decoded
      .replace(/^JavaScript needs to be enabled to play\s*/i, '')
      .replace(/^Case\s+\d+\s*:\s*/i, '')
      .replace(/\.$/, '')
      .trim();
    const parts = withoutPrefix.split(/\s+-\s+/);
    const displayTitle = cleanText(parts.shift() || ('Case ' + caseNumber));
    const subtitle = cleanText(parts.join(' - '));

    return {
      displayTitle: displayTitle || ('Case ' + caseNumber),
      subtitle: subtitle || def.shortPrompt,
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
      const href = def.prefix + n + '.html';
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
    els.liveSeriesCount.textContent = String(state.liveSeriesCount);
    els.liveCaseCount.textContent = String(state.liveCaseCount);
  }

  function buildHeroShelf() {
    els.heroShelf.innerHTML = '';

    SERIES.slice(0, 4).forEach(function (def, index) {
      const record = state.records.get(def.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'heroBook';
      button.style.setProperty('--delay', String(120 * index) + 'ms');
      button.style.setProperty('--shelf-height', String(index * 18) + 'px');
      setSeriesColors(button, def);
      button.innerHTML =
        '<span class="heroBookSeries">' + def.label + '</span>' +
        '<span class="heroBookCount">' + String(record ? record.cases.length : 0).padStart(2, '0') + '</span>';
      button.addEventListener('click', function () {
        selectSeries(def.id, false);
        const library = document.getElementById('library');
        if (library) {
          library.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      els.heroShelf.appendChild(button);
    });
  }

  function renderSpecialtyRail() {
    els.specialtyRail.innerHTML = '';
    state.specialtyButtons.clear();

    SERIES.forEach(function (def) {
      const record = state.records.get(def.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'specialtyButton';
      setSeriesColors(button, def);
      button.innerHTML =
        '<span class="specialtyName">' + def.label + '</span>' +
        '<span class="specialtyCount">' + (record.cases.length ? record.cases.length + ' published cases' : 'Archive preparing') + '</span>' +
        '<span class="specialtyDescription">' + def.description + '</span>';
      button.addEventListener('click', function () {
        selectSeries(def.id, false);
      });
      state.specialtyButtons.set(def.id, button);
      els.specialtyRail.appendChild(button);
    });
  }

  function setActiveSpecialtyButton(seriesId) {
    state.specialtyButtons.forEach(function (button, id) {
      button.classList.toggle('isActive', id === seriesId);
    });
  }

  function renderSeriesHeader(record) {
    els.selectedSeriesEyebrow.textContent = 'Archive';
    els.selectedSeriesTitle.textContent = record.def.archiveTitle;
    els.selectedSeriesMeta.textContent = record.cases.length
      ? record.cases.length + (record.cases.length === 1 ? ' published case' : ' published cases')
      : 'No published cases yet';
  }

  function renderHeroFeature(seriesId, caseInfo) {
    const record = state.records.get(seriesId);
    const def = record.def;

    if (caseInfo) {
      els.heroFeatureTitle.textContent = caseInfo.displayTitle;
      els.heroFeatureText.textContent = caseInfo.subtitle + ' This case opens as a short simulator with reflective feedback at the end.';
      els.heroFeatureMeta.innerHTML =
        '<span>' + def.label + '</span>' +
        '<span>Case ' + caseInfo.n + '</span>' +
        '<span>5-10 min</span>';
      els.heroLaunchButton.disabled = false;
      els.heroLaunchButton.textContent = 'Start Highlighted Case';
    } else {
      els.heroFeatureTitle.textContent = def.archiveTitle;
      els.heroFeatureText.textContent = def.seriesPrompt;
      els.heroFeatureMeta.innerHTML =
        '<span>' + def.label + '</span>' +
        '<span>Archive preparing</span>';
      els.heroLaunchButton.disabled = !state.firstLiveCase;
      els.heroLaunchButton.textContent = state.firstLiveCase ? 'Start Highlighted Case' : 'Cases coming soon';
    }
  }

  function renderCaseShelf(record) {
    els.caseShelf.innerHTML = '';
    els.emptyShelf.classList.toggle('isHidden', record.cases.length > 0);

    if (!record.cases.length) {
      return;
    }

    record.cases.forEach(function (caseInfo, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'caseCover';
      button.style.setProperty('--delay', String(Math.min(index * 36, 320)) + 'ms');
      setSeriesColors(button, record.def);
      if (state.selectedCaseKey === key(record.def.id, caseInfo.n)) {
        button.classList.add('isActive');
      }
      button.innerHTML =
        '<span class="coverSeries">' + record.def.label + '</span>' +
        '<strong class="coverNumber">Case ' + String(caseInfo.n).padStart(2, '0') + '</strong>' +
        '<span class="caseCoverTitle">' + caseInfo.displayTitle + '</span>' +
        '<span class="caseCoverSubtitle">' + caseInfo.subtitle + '</span>' +
        '<span class="caseCoverFooter"><span>5-10 min</span><span class="coverStatus">Live</span></span>';
      button.addEventListener('click', function () {
        selectCase(record.def.id, caseInfo.n, false);
      });
      els.caseShelf.appendChild(button);
    });
  }

  function renderPreview(record, caseInfo) {
    if (!caseInfo) {
      els.previewTitle.textContent = record.def.archiveTitle;
      els.previewSubtitle.textContent = 'Archive preparing';
      els.previewMeta.innerHTML =
        '<span>' + record.def.label + '</span>' +
        '<span>Cases coming soon</span>' +
        '<span>5-10 min</span>';
      els.previewBody.textContent = record.def.previewBody;
      els.reflectionText.textContent = record.def.reflectionText;
      els.launchCaseButton.disabled = true;
      setLinkState(els.previewStandaloneLink, '', false);
    } else {
      els.previewTitle.textContent = caseInfo.displayTitle;
      els.previewSubtitle.textContent = caseInfo.subtitle;
      els.previewMeta.innerHTML =
        '<span>' + record.def.label + '</span>' +
        '<span>Case ' + caseInfo.n + '</span>' +
        '<span>5-10 min</span>' +
        '<span>Reflective feedback</span>';
      els.previewBody.textContent = record.def.previewBody;
      els.reflectionText.textContent = record.def.reflectionText;
      els.launchCaseButton.disabled = false;
      setLinkState(els.previewStandaloneLink, caseInfo.href, true);
    }

    els.previewTags.innerHTML = '';
    record.def.tags.forEach(function (tag) {
      const chip = document.createElement('span');
      chip.className = 'previewTag';
      chip.textContent = tag;
      els.previewTags.appendChild(chip);
    });
  }

  function getSelectedCase(record) {
    if (!record || !record.cases.length) {
      return null;
    }

    if (!state.selectedCaseKey) {
      return record.cases[0];
    }

    const parts = state.selectedCaseKey.split(':');
    if (parts[0] !== record.def.id) {
      return record.cases[0];
    }

    const caseNumber = parseInt(parts[1], 10);
    return record.cases.find(function (entry) {
      return entry.n === caseNumber;
    }) || record.cases[0];
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
    setActiveSpecialtyButton(seriesId);
    renderSeriesHeader(record);
    renderCaseShelf(record);
    renderPreview(record, selectedCase);
    renderHeroFeature(seriesId, selectedCase);
    updateHash(seriesId, selectedCase ? selectedCase.n : null);
  }

  function selectCase(seriesId, caseNumber, openImmediately) {
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
    setActiveSpecialtyButton(seriesId);
    renderSeriesHeader(record);
    renderCaseShelf(record);
    renderPreview(record, caseInfo);
    renderHeroFeature(seriesId, caseInfo);
    updateHash(seriesId, caseNumber);

    if (openImmediately) {
      openViewer(caseInfo, record.def);
    }
  }

  function openViewer(caseInfo, def) {
    if (!caseInfo) {
      return;
    }

    state.overlayOpen = true;
    document.body.classList.add('viewerOpen');
    els.viewerOverlay.classList.remove('isHidden');
    els.viewerOverlay.setAttribute('aria-hidden', 'false');
    els.overlayEyebrow.textContent = def.archiveTitle;
    els.overlayTitle.textContent = 'Case ' + caseInfo.n + ': ' + caseInfo.displayTitle;
    setLinkState(els.overlayStandaloneLink, caseInfo.href, true);
    els.caseFrame.src = caseInfo.href;
  }

  function closeViewer() {
    state.overlayOpen = false;
    document.body.classList.remove('viewerOpen');
    els.viewerOverlay.classList.add('isHidden');
    els.viewerOverlay.setAttribute('aria-hidden', 'true');
    setLinkState(els.overlayStandaloneLink, '', false);
    els.caseFrame.src = 'about:blank';
  }

  function launchSelectedCase() {
    let caseInfo = null;
    let def = null;

    if (state.selectedSeriesId) {
      const record = state.records.get(state.selectedSeriesId);
      caseInfo = getSelectedCase(record);
      def = record ? record.def : null;
    }

    if (!caseInfo && state.firstLiveCase) {
      caseInfo = state.firstLiveCase.caseInfo;
      def = state.firstLiveCase.def;
      selectCase(def.id, caseInfo.n, false);
    }

    if (caseInfo && def) {
      openViewer(caseInfo, def);
    }
  }

  function restoreFromHash() {
    const requested = parseHash();
    if (!requested) {
      const starter = state.firstLiveCase ? state.firstLiveCase.def.id : SERIES[0].id;
      selectSeries(starter, false);
      return;
    }

    selectSeries(requested.seriesId, false);

    if (requested.caseNumber) {
      const record = state.records.get(requested.seriesId);
      const liveCase = record.cases.find(function (entry) {
        return entry.n === requested.caseNumber;
      });
      if (liveCase) {
        selectCase(requested.seriesId, requested.caseNumber, true);
      }
    }
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

  async function init() {
    await initRecords();
    renderCounts();
    buildHeroShelf();
    renderSpecialtyRail();
    restoreFromHash();
  }

  els.heroLaunchButton.addEventListener('click', launchSelectedCase);
  els.launchCaseButton.addEventListener('click', launchSelectedCase);
  els.previewStandaloneLink.addEventListener('click', function (event) {
    if (els.previewStandaloneLink.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
    }
  });
  els.closeViewerButton.addEventListener('click', closeViewer);
  els.viewerOverlay.addEventListener('click', function (event) {
    if (event.target === els.viewerOverlay) {
      closeViewer();
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && state.overlayOpen) {
      closeViewer();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
