(function () {
  const rules = [
    {
      seriesId: 'psychiatry',
      label: 'Psychiatry',
      folder: '/cases/psychiatry/'
    },
    {
      seriesId: 'internal-medicine',
      label: 'Internal Medicine',
      folder: '/cases/internalmedicine/'
    }
  ];

  function detectCase() {
    const href = String(window.location.pathname || window.location.href || '');
    const normalizedHref = href.replace(/\\/g, '/').toLowerCase();
    const numberMatch = normalizedHref.match(/(?:adventuresin[a-z]+-case|case)(\d+)\.html$/i);

    if (!numberMatch) {
      return null;
    }

    const matchedRule = rules.find(function (rule) {
      return normalizedHref.indexOf(rule.folder) !== -1;
    }) || rules[0];

    return {
      seriesId: matchedRule.seriesId,
      label: matchedRule.label,
      caseNumber: parseInt(numberMatch[1], 10)
    };
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

  function ensureFavicon() {
    if (document.getElementById('adventures-medicine-shell-favicon')) {
      return;
    }

    const currentScript = document.currentScript ||
      document.querySelector('script[src*="adventures-case-shell.js"]');
    const href = currentScript ? new URL('favicon.png', currentScript.src).href : 'favicon.png';
    const link = document.createElement('link');
    link.id = 'adventures-medicine-shell-favicon';
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = href;
    document.head.appendChild(link);
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
      '@font-face {' +
        'font-family: "Adventures Benguiat";' +
        'src: local("ITC Benguiat Std"), local("ITC Benguiat"), local("Benguiat Std"), local("Benguiat");' +
        'font-display: swap;' +
      '}' +
      'body.has-medicine-shell { background-color: #ffffff; }' +
      'body.has-medicine-shell.medicineEmbedded { background-color: #ffffff !important; background-position: center top !important; }' +
      'body.has-medicine-shell.medicineEmbedded::before { background-position: center top !important; }' +
      'body.has-medicine-shell tw-story tw-passage { padding-top: 6.6em !important; }' +
      'body.has-medicine-shell tw-sidebar { top: 4.9rem !important; }' +
      'body.has-medicine-shell.medicineEmbedded tw-story tw-passage { padding-top: 0.9em !important; }' +
      'body.has-medicine-shell.medicineEmbedded tw-sidebar { top: 0.75rem !important; }' +
      '@media (max-width: 980px) {' +
        'body.has-medicine-shell.medicineEmbedded {' +
          'background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%) !important;' +
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
          'color: #050505 !important;' +
          'font-size: clamp(1rem, 2.8vw, 1.16rem) !important;' +
          'line-height: 1.65 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story, ' +
        'body.has-medicine-shell.medicineEmbedded tw-story tw-passage {' +
          'color: #050505 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story blockquote {' +
          'margin-inline: 0 !important;' +
          'padding-left: 1rem !important;' +
          'border-left: 3px solid rgba(255, 45, 34, 0.28) !important;' +
          'color: rgba(5, 5, 5, 0.84) !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-link, ' +
        'body.has-medicine-shell.medicineEmbedded .enchantment-link {' +
          'color: #ff2d22 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-link:hover, ' +
        'body.has-medicine-shell.medicineEmbedded .enchantment-link:hover {' +
          'color: #ff9d17 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-story tw-passage {' +
          'padding-top: 0 !important;' +
        '}' +
        'body.has-medicine-shell.medicineEmbedded tw-sidebar {' +
          'top: 0.85rem !important;' +
          'left: auto !important;' +
          'right: 0.85rem !important;' +
          'color: #050505 !important;' +
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
        'background: linear-gradient(180deg, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.88) 100%);' +
        'backdrop-filter: blur(14px);' +
        'border-bottom: 2px solid rgba(255, 157, 23, 0.6);' +
        'box-shadow: 0 16px 34px rgba(0,0,0,0.22);' +
        'font-family: "Source Sans 3", "Segoe UI", sans-serif;' +
        'color: #ffffff;' +
      '}' +
      'body.has-medicine-shell .medicineDeckCopy { min-width: 0; }' +
      'body.has-medicine-shell .medicineDeckEyebrow {' +
        'margin: 0;' +
        'font-size: 0.78rem;' +
        'letter-spacing: 0.16em;' +
        'text-transform: uppercase;' +
        'color: rgba(255, 214, 44, 0.92);' +
      '}' +
      'body.has-medicine-shell .medicineDeckTitle {' +
        'margin: 4px 0 0;' +
        'font-family: "Adventures Benguiat", "ITC Benguiat Std", "ITC Benguiat", "Benguiat Std", "Benguiat", "Fraunces", Georgia, serif;' +
        'font-size: clamp(1.2rem, 2.2vw, 1.8rem);' +
        'line-height: 1.05;' +
      '}' +
      'body.has-medicine-shell .medicineDeckBody {' +
        'margin: 6px 0 0;' +
        'color: rgba(255, 255, 255, 0.74);' +
      '}' +
      'body.has-medicine-shell .medicineHubLink {' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'min-height: 42px;' +
        'padding: 0 16px;' +
        'border-radius: 999px;' +
        'border: 1px solid rgba(255, 214, 44, 0.34);' +
        'background: linear-gradient(180deg, rgba(255, 214, 44, 0.12), rgba(255, 45, 34, 0.04)), rgba(0, 0, 0, 0.96);' +
        'color: #ffffff;' +
        'text-decoration: none;' +
        'white-space: nowrap;' +
      '}' +
      'body.has-medicine-shell .medicineHubLink:hover {' +
        'border-color: rgba(255, 214, 44, 0.54);' +
        'background: linear-gradient(180deg, rgba(255, 214, 44, 0.18), rgba(255, 45, 34, 0.08)), rgba(0, 0, 0, 0.98);' +
      '}' +
      'body.has-medicine-shell .medicineHubLink:focus-visible {' +
        'outline: 3px solid rgba(255, 157, 23, 0.35);' +
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
    ensureFavicon();
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
