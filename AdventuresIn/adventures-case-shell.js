(function () {
  const rules = [
    {
      seriesId: 'psychiatry',
      label: 'Psychiatry',
      regex: /AdventuresInPsychiatry-Case(\d+)\.html$/i
    }
  ];

  const EMBEDDED_FRAME = {
    blackLeft: 130,
    blackRight: 1918,
    blackTopDefault: 220,
    blackTopIos: 195,
    blackTopIpad: 210
  };

  function detectCase() {
    const href = String(window.location.pathname || window.location.href || '');
    for (const rule of rules) {
      const match = href.match(rule.regex);
      if (match) {
        return {
          seriesId: rule.seriesId,
          label: rule.label,
          caseNumber: parseInt(match[1], 10)
        };
      }
    }
    return null;
  }

  function isEmbeddedWorkspace() {
    return window.self !== window.top;
  }

  function isIOS() {
    const ua = window.navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isIPad() {
    const ua = window.navigator.userAgent || '';
    return /iPad/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function currentBlackTop() {
    if (isIPad()) {
      return EMBEDDED_FRAME.blackTopIpad;
    }
    return isIOS() ? EMBEDDED_FRAME.blackTopIos : EMBEDDED_FRAME.blackTopDefault;
  }

  function ensureFonts() {
    if (document.getElementById('adventures-medicine-shell-fonts')) {
      return;
    }

    const preconnectA = document.createElement('link');
    preconnectA.id = 'adventures-medicine-shell-fonts';
    preconnectA.rel = 'preconnect';
    preconnectA.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectA);

    const preconnectB = document.createElement('link');
    preconnectB.rel = 'preconnect';
    preconnectB.href = 'https://fonts.gstatic.com';
    preconnectB.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectB);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  function injectStyles() {
    if (document.getElementById('adventures-medicine-shell-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'adventures-medicine-shell-style';
    style.textContent = '' +
      'body.has-medicine-shell { background-color: #f5ebd6; }' +
      'body.has-medicine-shell.medicineEmbedded { background-color: #f5ebd6 !important; background-position: center top !important; }' +
      'body.has-medicine-shell.medicineEmbedded::before { background-position: center top !important; }' +
      'body.has-medicine-shell tw-story tw-passage { padding-top: 6.6em !important; }' +
      'body.has-medicine-shell tw-sidebar { top: 4.9rem !important; }' +
      'body.has-medicine-shell.medicineEmbedded tw-story tw-passage { padding-top: 0.9em !important; }' +
      'body.has-medicine-shell.medicineEmbedded tw-sidebar { top: 0.75rem !important; }' +
      '@media (max-width: 980px) {' +
        'body.has-medicine-shell.medicineEmbedded {' +
          'background: linear-gradient(180deg, #f7f1e1 0%, #efe5cf 46%, #eadbbd 100%) !important;' +
          'background-image: none !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded::before {' +
          'display: none !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story {' +
          'position: relative !important;' +
          'top: 0 !important;' +
          'left: auto !important;' +
          'right: auto !important;' +
          'width: auto !important;' +
          'max-width: 46rem !important;' +
          'margin: 0 auto !important;' +
          'padding: 4.6rem 1.15rem 2rem !important;' +
          'border: 0 !important;' +
          'border-radius: 0 !important;' +
          'background: transparent !important;' +
          'box-shadow: none !important;' +
          'color: #25180f !important;' +
          'font-size: clamp(1rem, 2.8vw, 1.16rem) !important;' +
          'line-height: 1.65 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story, ' +
        'body.has-medicine-shell.medicineEmbedded tw-story tw-passage {' +
          'color: #25180f !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story blockquote {' +
          'margin-inline: 0 !important;' +
          'padding-left: 1rem !important;' +
          'border-left: 3px solid rgba(159, 25, 15, 0.22) !important;' +
          'color: rgba(37, 24, 15, 0.84) !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-link, ' +
        'body.has-medicine-shell.medicineEmbedded .enchantment-link {' +
          'color: #9f190f !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-link:hover, ' +
        'body.has-medicine-shell.medicineEmbedded .enchantment-link:hover {' +
          'color: #d36a08 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story tw-passage {' +
          'padding-top: 0 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-sidebar {' +
          'top: 0.85rem !important;' +
          'left: auto !important;' +
          'right: 0.85rem !important;' +
          'color: #4a2610 !important;' +
        '}' +
      '}' +
      'body.has-medicine-shell .medicineDeck {' +
        'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'right: 0;' +
        'z-index: 999995;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'gap: 16px;' +
        'padding: 14px 18px;' +
        'background: linear-gradient(180deg, rgba(11, 20, 30, 0.94) 0%, rgba(11, 20, 30, 0.82) 100%);' +
        'backdrop-filter: blur(14px);' +
        'border-bottom: 1px solid rgba(255,255,255,0.12);' +
        'box-shadow: 0 16px 34px rgba(0,0,0,0.22);' +
        'font-family: "Source Sans 3", "Segoe UI", sans-serif;' +
        'color: #f8f4ec;' +
      '}' +
      'body.has-medicine-shell .medicineDeckCopy { min-width: 0; }' +
      'body.has-medicine-shell .medicineDeckEyebrow {' +
        'margin: 0;' +
        'font-size: 0.78rem;' +
        'letter-spacing: 0.16em;' +
        'text-transform: uppercase;' +
        'color: rgba(255, 214, 196, 0.8);' +
      '}' +
      'body.has-medicine-shell .medicineDeckTitle {' +
        'margin: 4px 0 0;' +
        'font-family: "Fraunces", Georgia, serif;' +
        'font-size: clamp(1.2rem, 2.2vw, 1.8rem);' +
        'line-height: 1.05;' +
      '}' +
      'body.has-medicine-shell .medicineDeckBody {' +
        'margin: 6px 0 0;' +
        'color: rgba(248, 244, 236, 0.74);' +
      '}' +
      'body.has-medicine-shell .medicineHubLink {' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'min-height: 42px;' +
        'padding: 0 16px;' +
        'border-radius: 999px;' +
        'border: 1px solid rgba(255,255,255,0.16);' +
        'background: rgba(255,255,255,0.08);' +
        'color: #fffaf4;' +
        'text-decoration: none;' +
        'white-space: nowrap;' +
      '}' +
      'body.has-medicine-shell .medicineHubLink:hover {' +
        'border-color: rgba(255,255,255,0.28);' +
        'background: rgba(255,255,255,0.12);' +
      '}' +
      'body.has-medicine-shell .medicineHubLink:focus-visible {' +
        'outline: 3px solid rgba(181, 83, 61, 0.35);' +
        'outline-offset: 2px;' +
      '}' +
      '@media (max-width: 720px) {' +
        'body.has-medicine-shell tw-story tw-passage { padding-top: 8.2em !important; }' +
        'body.has-medicine-shell tw-sidebar { top: 6.6rem !important; }' +
        'body.has-medicine-shell .medicineDeck {' +
          'align-items: flex-start;' +
          'flex-direction: column;' +
          'padding: 12px 14px;' +
        '}' +
        'body.has-medicine-shell .medicineHubLink { width: 100%; }' +
      '}';

    document.head.appendChild(style);
  }

  function alignEmbeddedStory() {
    if (!isEmbeddedWorkspace()) {
      return;
    }

    const story = document.querySelector('tw-story');
    if (!story) {
      return;
    }

    const width = parseFloat(story.style.width || String(story.getBoundingClientRect().width || '0'));
    if (!width) {
      return;
    }

    const blackWidth = EMBEDDED_FRAME.blackRight - EMBEDDED_FRAME.blackLeft;
    const scale = width / blackWidth;
    story.style.top = String(currentBlackTop() * scale) + 'px';
  }

  function initEmbeddedAlignment() {
    if (!isEmbeddedWorkspace()) {
      return;
    }

    document.body.classList.add('medicineEmbedded');
    alignEmbeddedStory();
    window.addEventListener('load', alignEmbeddedStory);
    window.addEventListener('resize', alignEmbeddedStory);
    window.setTimeout(alignEmbeddedStory, 120);
    window.setTimeout(alignEmbeddedStory, 420);
  }

  function buildDeck(match) {
    if (isEmbeddedWorkspace()) {
      return;
    }

    if (document.querySelector('.medicineDeck')) {
      return;
    }

    const deck = document.createElement('div');
    deck.className = 'medicineDeck';
    deck.innerHTML =
      '<div class="medicineDeckCopy">' +
        '<p class="medicineDeckEyebrow">Adventures in Medicine</p>' +
        '<h1 class="medicineDeckTitle">' + match.label + ' Case ' + match.caseNumber + '</h1>' +
        '<p class="medicineDeckBody">Branching clinical simulator with reflective feedback.</p>' +
      '</div>' +
      '<a class="medicineHubLink" href="workspace.html#series=' + encodeURIComponent(match.seriesId) + '&case=' + encodeURIComponent(String(match.caseNumber)) + '" target="_top" rel="noopener">Back to Cases</a>';

    document.body.appendChild(deck);
  }

  function init() {
    const match = detectCase();
    if (!match || !Number.isFinite(match.caseNumber)) {
      return;
    }

    ensureFonts();
    injectStyles();
    buildDeck(match);
    document.body.classList.add('has-medicine-shell');
    initEmbeddedAlignment();
    document.title = 'Adventures in Medicine - ' + match.label + ' - Case ' + match.caseNumber;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
