(function () {
  const SERIES = [
    {
      id: 'psychiatry',
      legacyIds: ['psy'],
      label: 'Psychiatry',
      fullTitle: 'Adventures in Psychiatry',
      description: 'Behavioral health, consult-liaison, and outpatient diagnostic reasoning.',
      prefix: 'AdventuresInPsychiatry-Case',
      startOpen: true,
      maxN: 150,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 12
    },
    {
      id: 'internal-medicine',
      legacyIds: ['im'],
      label: 'Internal Medicine',
      fullTitle: 'Adventures in Internal Medicine',
      description: 'Adult inpatient and outpatient reasoning cases.',
      prefix: 'AdventuresInInternalMedicine-Case',
      maxN: 150,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 12
    },
    {
      id: 'neurology',
      legacyIds: ['neuro'],
      label: 'Neurology',
      fullTitle: 'Adventures in Neurology',
      description: 'Localization, acute presentations, and longitudinal neurologic care.',
      prefix: 'AdventuresInNeurology-Case',
      maxN: 150,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 12
    },
    {
      id: 'surgery',
      legacyIds: ['surg'],
      label: 'Surgery',
      fullTitle: 'Adventures in Surgery',
      description: 'Perioperative thinking, triage, and procedural decision-making.',
      prefix: 'AdventuresInSurgery-Case',
      maxN: 150,
      emptyProbeMax: 5,
      stopAfterConsecutiveMisses: 12
    }
  ];

  const aliasMap = new Map();
  for (const def of SERIES) {
    aliasMap.set(def.id, def.id);
    for (const alias of def.legacyIds || []) {
      aliasMap.set(alias, def.id);
    }
  }

  const state = {
    active: null,
    buttons: new Map(),
    series: new Map(),
    liveSeriesCount: 0,
    liveCaseCount: 0
  };

  const els = {
    drawer: document.getElementById('drawer'),
    brandButton: document.getElementById('brandButton'),
    closeDrawerButton: document.getElementById('closeDrawerButton'),
    openDrawerButton: document.getElementById('openDrawerButton'),
    scrim: document.getElementById('scrim'),
    seriesContainer: document.getElementById('seriesContainer'),
    liveSeriesCount: document.getElementById('liveSeriesCount'),
    liveCaseCount: document.getElementById('liveCaseCount'),
    viewerHeader: document.getElementById('viewerHeader'),
    viewerEyebrow: document.getElementById('viewerEyebrow'),
    viewerTitle: document.getElementById('viewerTitle'),
    viewerStandaloneLink: document.getElementById('viewerStandaloneLink'),
    welcomePanel: document.getElementById('welcomePanel'),
    frameWrap: document.getElementById('frameWrap'),
    caseFrame: document.getElementById('caseFrame')
  };

  function key(seriesId, caseNumber) {
    return seriesId + ':' + String(caseNumber);
  }

  function setDrawerOpen(open) {
    const narrow = window.matchMedia('(max-width: 920px)').matches;
    if (!narrow) {
      els.drawer.classList.remove('isOpen');
      els.scrim.classList.remove('isVisible');
      els.scrim.setAttribute('aria-hidden', 'true');
      return;
    }

    els.drawer.classList.toggle('isOpen', !!open);
    els.scrim.classList.toggle('isVisible', !!open);
    els.scrim.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function updateHash(seriesId, caseNumber) {
    const hash = seriesId && caseNumber ? '#series=' + encodeURIComponent(seriesId) + '&case=' + encodeURIComponent(String(caseNumber)) : '#';
    try {
      history.replaceState(null, '', hash);
    } catch (_error) {
      location.hash = hash;
    }
  }

  function parseHash() {
    const raw = (location.hash || '').replace(/^#/, '');
    if (!raw) {
      return null;
    }

    try {
      const params = new URLSearchParams(raw);
      const rawSeries = String(params.get('series') || params.get('section') || '').trim().toLowerCase();
      const caseValue = String(params.get('case') || '').trim();
      const seriesId = aliasMap.get(rawSeries);
      const caseNumber = parseInt(caseValue, 10);

      if (!seriesId || !Number.isFinite(caseNumber)) {
        return null;
      }

      return { seriesId: seriesId, caseNumber: caseNumber };
    } catch (_error) {
      return null;
    }
  }

  function clearActiveButtons() {
    for (const button of state.buttons.values()) {
      button.classList.remove('isActive');
    }
  }

  function showWelcome(clearHash) {
    state.active = null;
    clearActiveButtons();
    els.viewerHeader.classList.add('isHidden');
    els.frameWrap.classList.add('isHidden');
    els.welcomePanel.classList.remove('isHidden');
    els.caseFrame.removeAttribute('srcdoc');
    els.caseFrame.src = 'about:blank';
    els.viewerStandaloneLink.href = 'about:blank';

    if (clearHash !== false) {
      updateHash(null, null);
    }

    setDrawerOpen(false);
  }

  function updateSeriesBadge(record) {
    const count = record.cases.length;
    const badge = record.badge;
    if (!badge) {
      return;
    }

    badge.classList.toggle('isEmpty', count === 0);
    badge.textContent = count === 0 ? 'Coming soon' : count + (count === 1 ? ' case' : ' cases');
  }

  function buildSeriesCard(def) {
    const details = document.createElement('details');
    details.className = 'seriesCard';
    if (def.startOpen) {
      details.open = true;
    }

    const summary = document.createElement('summary');
    summary.className = 'summaryButton';

    const summaryText = document.createElement('div');
    const title = document.createElement('span');
    title.className = 'summaryTitle';
    title.textContent = def.fullTitle;
    const description = document.createElement('span');
    description.className = 'summaryDescription';
    description.textContent = def.description;
    summaryText.appendChild(title);
    summaryText.appendChild(description);

    const badge = document.createElement('span');
    badge.className = 'summaryBadge isEmpty';
    badge.textContent = 'Scanning';

    summary.appendChild(summaryText);
    summary.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'seriesBody';

    const status = document.createElement('div');
    status.className = 'seriesStatus';
    status.textContent = 'Scanning for published cases...';

    const list = document.createElement('div');
    list.className = 'seriesList';

    const empty = document.createElement('div');
    empty.className = 'seriesEmpty isHidden';
    empty.textContent = 'No published cases yet. When files like ' + def.prefix + '1.html are added, they can appear here automatically.';

    body.appendChild(status);
    body.appendChild(list);
    body.appendChild(empty);

    details.appendChild(summary);
    details.appendChild(body);
    els.seriesContainer.appendChild(details);

    state.series.set(def.id, {
      def: def,
      details: details,
      badge: badge,
      status: status,
      list: list,
      empty: empty,
      cases: []
    });
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

  function buildCaseButton(def, caseInfo) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'caseButton';
    button.textContent = 'Case ' + caseInfo.n;
    button.addEventListener('click', function () {
      loadCase(def.id, caseInfo.n, caseInfo.href);
    });
    state.buttons.set(key(def.id, caseInfo.n), button);
    return button;
  }

  async function scanSeries(def) {
    const record = state.series.get(def.id);
    if (!record) {
      return;
    }

    const found = [];
    let consecutiveMisses = 0;

    for (let n = 1; n <= def.maxN; n += 1) {
      const href = def.prefix + n + '.html';
      const ok = await exists(href);

      if (ok) {
        found.push({ n: n, href: href });
        consecutiveMisses = 0;
      } else {
        consecutiveMisses += 1;
      }

      if (found.length === 0 && n >= def.emptyProbeMax) {
        break;
      }

      if (found.length > 0 && consecutiveMisses >= def.stopAfterConsecutiveMisses) {
        break;
      }
    }

    record.cases = found;
    record.list.innerHTML = '';

    if (found.length === 0) {
      record.status.textContent = 'This specialty is planned but does not have published cases yet.';
      record.empty.classList.remove('isHidden');
      updateSeriesBadge(record);
      return;
    }

    state.liveSeriesCount += 1;
    state.liveCaseCount += found.length;

    record.status.textContent = found.length + (found.length === 1 ? ' case available now.' : ' cases available now.');
    record.empty.classList.add('isHidden');
    updateSeriesBadge(record);

    for (const caseInfo of found) {
      record.list.appendChild(buildCaseButton(def, caseInfo));
    }
  }

  function syncHeroCounts() {
    els.liveSeriesCount.textContent = String(state.liveSeriesCount);
    els.liveCaseCount.textContent = String(state.liveCaseCount);
  }

  function loadCase(seriesId, caseNumber, href) {
    const record = state.series.get(seriesId);
    if (!record) {
      return;
    }

    state.active = { seriesId: seriesId, caseNumber: caseNumber, href: href };
    clearActiveButtons();

    const button = state.buttons.get(key(seriesId, caseNumber));
    if (button) {
      button.classList.add('isActive');
      record.details.open = true;
    }

    els.viewerEyebrow.textContent = record.def.fullTitle;
    els.viewerTitle.textContent = 'Case ' + caseNumber;
    els.viewerStandaloneLink.href = href;
    els.viewerHeader.classList.remove('isHidden');
    els.welcomePanel.classList.add('isHidden');
    els.frameWrap.classList.remove('isHidden');
    els.caseFrame.removeAttribute('srcdoc');
    els.caseFrame.src = href;

    updateHash(seriesId, caseNumber);
    setDrawerOpen(false);
  }

  function restoreFromHash() {
    const request = parseHash();
    if (!request) {
      showWelcome(true);
      return;
    }

    const button = state.buttons.get(key(request.seriesId, request.caseNumber));
    if (!button) {
      const record = state.series.get(request.seriesId);
      if (record) {
        record.details.open = true;
      }
      showWelcome(false);
      return;
    }

    const href = state.series.get(request.seriesId).def.prefix + request.caseNumber + '.html';
    loadCase(request.seriesId, request.caseNumber, href);
  }

  async function init() {
    for (const def of SERIES) {
      buildSeriesCard(def);
    }

    showWelcome(false);

    for (const def of SERIES) {
      await scanSeries(def);
    }

    syncHeroCounts();
    restoreFromHash();

    if (!state.active && !parseHash()) {
      showWelcome(true);
    }
  }

  els.brandButton.addEventListener('click', function () {
    showWelcome(true);
  });

  els.openDrawerButton.addEventListener('click', function () {
    setDrawerOpen(true);
  });

  els.closeDrawerButton.addEventListener('click', function () {
    setDrawerOpen(false);
  });

  els.scrim.addEventListener('click', function () {
    setDrawerOpen(false);
  });

  window.addEventListener('resize', function () {
    if (!window.matchMedia('(max-width: 920px)').matches) {
      setDrawerOpen(false);
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setDrawerOpen(false);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

