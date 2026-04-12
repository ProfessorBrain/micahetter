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
    },
    {
      seriesId: 'emergency-medicine',
      label: 'Emergency Medicine',
      folder: '/cases/emergency-medicine/'
    },
    {
      seriesId: 'neurology',
      label: 'Neurology',
      folder: '/cases/neurology/'
    }
  ];
  const EMBEDDED_FRAME = {
    blackLeft: 122,
    blackRight: 878,
    blackTopDefault: 96,
    blackTopIos: 106,
    blackTopIpad: 100
  };

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

  function isTwineCase() {
    return Boolean(document.querySelector('tw-storydata'));
  }

  function isCustomCasebook() {
    return Boolean(document.querySelector('.caseApp'));
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
      'body.has-medicine-shell.medicineEmbedded { background-color: #ffffff !important; background-position: center top !important; overflow: hidden !important; }' +
      'body.has-medicine-shell.medicineEmbedded::before { background-position: center top !important; }' +
      'body.has-medicine-shell.medicineEmbedded tw-story {' +
        'box-sizing: border-box !important;' +
        'height: calc(100dvh - 2.4rem) !important;' +
        'max-height: calc(100dvh - 2.4rem) !important;' +
        'overflow-y: auto !important;' +
        'overscroll-behavior: contain !important;' +
        'scrollbar-gutter: stable both-edges !important;' +
      '}' +
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
          'height: calc(100dvh - 1.7rem) !important;' +
          'max-height: calc(100dvh - 1.7rem) !important;' +
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
      'body.has-medicine-shell.medicineTwineCase {' +
        'box-sizing: border-box !important;' +
        'display: flex !important;' +
        'flex-direction: column !important;' +
        'align-items: center !important;' +
        'gap: 1.5rem !important;' +
        'height: 100dvh !important;' +
        'min-height: 100dvh !important;' +
        'padding: 1.75rem 1rem 2rem !important;' +
        'overflow: hidden !important;' +
        'background: radial-gradient(circle at top, rgba(255, 214, 44, 0.16), transparent 34%), linear-gradient(180deg, #ffffff 0%, #fff9ef 55%, #fff4d9 100%) !important;' +
        'font-family: "Source Sans 3", "Segoe UI", sans-serif !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase::before {' +
        'display: none !important;' +
        'content: none !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineDeck {' +
        'display: none !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineSeriesPillWrap {' +
        'display: flex;' +
        'justify-content: center;' +
        'flex: 0 0 auto;' +
        'width: 100%;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineSeriesPill {' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin: 0 auto;' +
        'padding: 0.7rem 1.5rem;' +
        'border-radius: 999px;' +
        'background: #ff2d22;' +
        'border: 2px solid #ffffff;' +
        'box-shadow: 0 0 0 2px #050505, 0 18px 38px rgba(255, 45, 34, 0.2);' +
        'color: #ffffff;' +
        'font-family: "Adventures Benguiat", "ITC Benguiat Std", "ITC Benguiat", "Benguiat Std", "Benguiat", "Fraunces", Georgia, serif;' +
        'font-size: clamp(1rem, 1.6vw, 1.35rem);' +
        'letter-spacing: 0.05em;' +
        'text-align: center;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story {' +
        'position: relative !important;' +
        'inset: auto !important;' +
        'left: auto !important;' +
        'right: auto !important;' +
        'display: flex !important;' +
        'flex-direction: column !important;' +
        'flex: 1 1 auto !important;' +
        'align-self: center !important;' +
        'min-height: 0 !important;' +
        'width: min(62rem, calc(100% - 1.5rem)) !important;' +
        'max-width: min(62rem, calc(100% - 1.5rem)) !important;' +
        'margin: 0 auto !important;' +
        'padding: 2rem 1.5rem 1.3rem !important;' +
        'border-radius: 2rem !important;' +
        'background: #050505 !important;' +
        'border: 3px solid #ff9d17 !important;' +
        'box-shadow: 0 0 0 7px #ffd62c, 0 0 0 12px #ff9d17, 0 26px 60px rgba(0, 0, 0, 0.22) !important;' +
        'color: #f8f5ef !important;' +
        'font-family: "Source Sans 3", "Segoe UI", sans-serif !important;' +
        'font-size: clamp(1.02rem, 2.3vw, 1.22rem) !important;' +
        'line-height: 1.72 !important;' +
        'overflow-y: auto !important;' +
        'overscroll-behavior: contain !important;' +
        'scrollbar-gutter: stable !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story::before,' +
      'body.has-medicine-shell.medicineTwineCase tw-story::after {' +
        'content: "";' +
        'position: absolute;' +
        'pointer-events: none;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story::before {' +
        'inset: 10px;' +
        'border-radius: 1.45rem;' +
        'border: 1px solid rgba(255, 214, 44, 0.24);' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story::after {' +
        'left: 1.2rem;' +
        'right: 1.2rem;' +
        'bottom: 1.2rem;' +
        'height: 1px;' +
        'background: linear-gradient(90deg, transparent, rgba(255, 214, 44, 0.4), transparent);' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story::-webkit-scrollbar {' +
        'width: 12px;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story::-webkit-scrollbar-thumb {' +
        'background: linear-gradient(180deg, rgba(255, 214, 44, 0.9), rgba(255, 157, 23, 0.88), rgba(255, 45, 34, 0.84));' +
        'border: 3px solid rgba(0, 0, 0, 0);' +
        'border-radius: 999px;' +
        'background-clip: padding-box;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story tw-passage {' +
        'margin: 0 !important;' +
        'padding: 0 0 4.6rem 0 !important;' +
        'max-width: none !important;' +
        'height: auto !important;' +
        'overflow: visible !important;' +
        'color: #f8f5ef !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story tw-passage > :first-child {' +
        'margin-top: 0 !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story h1,' +
      'body.has-medicine-shell.medicineTwineCase tw-story h2,' +
      'body.has-medicine-shell.medicineTwineCase tw-story h3 {' +
        'margin: 0 0 1.25rem 0 !important;' +
        'font-family: "Adventures Benguiat", "ITC Benguiat Std", "ITC Benguiat", "Benguiat Std", "Benguiat", "Fraunces", Georgia, serif !important;' +
        'font-size: clamp(1.45rem, 2.35vw, 2.05rem) !important;' +
        'line-height: 0.98 !important;' +
        'color: #ffffff !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story p,' +
      'body.has-medicine-shell.medicineTwineCase tw-story li {' +
        'color: #f8f5ef !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story strong {' +
        'color: #ffffff !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-story blockquote {' +
        'margin: 1rem 0 !important;' +
        'padding-left: 1rem !important;' +
        'border-left: 3px solid rgba(255, 214, 44, 0.32) !important;' +
        'color: rgba(248, 245, 239, 0.88) !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-sidebar {' +
        'display: none !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-passage tw-link,' +
      'body.has-medicine-shell.medicineTwineCase tw-passage .enchantment-link {' +
        'display: block !important;' +
        'width: 100% !important;' +
        'margin: 0.8rem 0 0 !important;' +
        'padding: 1rem 1.05rem !important;' +
        'border: 1px solid rgba(255, 157, 23, 0.42) !important;' +
        'border-radius: 1.15rem !important;' +
        'background: linear-gradient(180deg, rgba(255, 214, 44, 0.12), rgba(255, 45, 34, 0.08) 40%, rgba(255, 255, 255, 0.02)), rgba(0, 0, 0, 0.96) !important;' +
        'color: #ffffff !important;' +
        'font-size: 1rem !important;' +
        'font-weight: 700 !important;' +
        'line-height: 1.45 !important;' +
        'text-decoration: none !important;' +
        'transition: transform 180ms ease, border-color 180ms ease, background 180ms ease !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-passage tw-link::before,' +
      'body.has-medicine-shell.medicineTwineCase tw-passage .enchantment-link::before {' +
        'content: none !important;' +
        'display: none !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase tw-passage tw-link:hover,' +
      'body.has-medicine-shell.medicineTwineCase tw-passage .enchantment-link:hover {' +
        'transform: translateY(-1px) !important;' +
        'border-color: rgba(255, 214, 44, 0.74) !important;' +
        'background: linear-gradient(180deg, rgba(255, 214, 44, 0.18), rgba(255, 45, 34, 0.11) 40%, rgba(255, 255, 255, 0.03)), rgba(0, 0, 0, 1) !important;' +
        'color: #ffffff !important;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineUndoButton {' +
        'position: sticky;' +
        'left: 0;' +
        'bottom: 0.6rem;' +
        'align-self: flex-start;' +
        'z-index: 4;' +
        'margin-top: auto;' +
        'border: 1px solid rgba(255, 157, 23, 0.5);' +
        'border-radius: 999px;' +
        'background: rgba(0, 0, 0, 0.94);' +
        'color: #ffffff;' +
        'min-width: 3.2rem;' +
        'min-height: 3.2rem;' +
        'padding: 0.7rem;' +
        'font-family: "Source Sans 3", "Segoe UI", sans-serif;' +
        'font-size: 1.4rem;' +
        'font-weight: 700;' +
        'line-height: 1;' +
        'cursor: pointer;' +
        'transition: transform 180ms ease, border-color 180ms ease, opacity 180ms ease;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineUndoButton:hover:not(:disabled) {' +
        'transform: translateY(-1px);' +
        'border-color: rgba(255, 214, 44, 0.78);' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineUndoButton:focus-visible {' +
        'outline: 3px solid rgba(255, 214, 44, 0.45);' +
        'outline-offset: 3px;' +
      '}' +
      'body.has-medicine-shell.medicineTwineCase .medicineUndoButton:disabled {' +
        'cursor: not-allowed;' +
        'opacity: 0.42;' +
        'border-color: rgba(255, 157, 23, 0.22);' +
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
        'body.has-medicine-shell.medicineTwineCase {' +
          'gap: 1rem !important;' +
          'padding: 1rem 0.8rem 1.15rem !important;' +
        '}' +
        'body.has-medicine-shell.medicineTwineCase .medicineSeriesPill {' +
          'padding: 0.65rem 1.15rem;' +
          'font-size: 0.98rem;' +
        '}' +
        'body.has-medicine-shell.medicineTwineCase tw-story {' +
          'padding: 1.45rem 1rem 1rem !important;' +
          'border-radius: 1.4rem !important;' +
          'box-shadow: 0 0 0 5px #ffd62c, 0 0 0 9px #ff9d17, 0 16px 32px rgba(0, 0, 0, 0.18) !important;' +
        '}' +
        'body.has-medicine-shell.medicineTwineCase tw-story::before {' +
          'inset: 8px;' +
        '}' +
        'body.has-medicine-shell.medicineTwineCase tw-story tw-passage {' +
          'padding-bottom: 4rem !important;' +
        '}' +
      '}';

    document.head.appendChild(style);
  }

  function alignEmbeddedStory() {
    if (!isEmbeddedWorkspace()) {
      return;
    }

    if (isTwineCase()) {
      const story = document.querySelector('tw-story');
      if (story) {
        story.style.top = '0px';
        story.style.left = 'auto';
        story.style.right = 'auto';
        story.style.inset = 'auto';
        story.style.marginLeft = 'auto';
        story.style.marginRight = 'auto';
      }
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

  function buildSeriesBannerText(match) {
    return 'ADVENTURES IN ' + String(match.label || '').toUpperCase();
  }

  const WINDOWS_1252_TO_BYTE = {
    8364: 128,
    8218: 130,
    402: 131,
    8222: 132,
    8230: 133,
    8224: 134,
    8225: 135,
    710: 136,
    8240: 137,
    352: 138,
    8249: 139,
    338: 140,
    381: 142,
    8216: 145,
    8217: 146,
    8220: 147,
    8221: 148,
    8226: 149,
    8211: 150,
    8212: 151,
    732: 152,
    8482: 153,
    353: 154,
    8250: 155,
    339: 156,
    382: 158,
    376: 159
  };

  function mojibakeScore(value) {
    const matches = String(value || '').match(/Ã.|Â.|â.|�/g);
    return matches ? matches.length : 0;
  }

  function encodeWindows1252(value) {
    const text = String(value || '');
    const bytes = new Uint8Array(text.length);

    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index);
      if (code <= 255) {
        bytes[index] = code;
        continue;
      }

      const mapped = WINDOWS_1252_TO_BYTE[code];
      if (typeof mapped === 'number') {
        bytes[index] = mapped;
        continue;
      }

      return null;
    }

    return bytes;
  }

  function repairMojibake(value) {
    let current = String(value || '');
    if (!/[ÃÂâ]/.test(current)) {
      return current;
    }

    let currentScore = mojibakeScore(current);
    const decoder = new TextDecoder('utf-8', { fatal: false });

    for (let pass = 0; pass < 3 && currentScore > 0; pass += 1) {
      const bytes = encodeWindows1252(current);
      if (!bytes) {
        break;
      }

      const decoded = decoder.decode(bytes);
      const decodedScore = mojibakeScore(decoded);
      if (!decoded || decoded === current || decodedScore > currentScore) {
        break;
      }

      current = decoded;
      currentScore = decodedScore;
    }

    return current;
  }

  function sanitizeTwineTextNodes() {
    const story = document.querySelector('tw-story');
    if (!story) {
      return;
    }

    const walker = document.createTreeWalker(story, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();

    while (node) {
      if (node.nodeValue && /[ÃÂâ]/.test(node.nodeValue)) {
        const repaired = repairMojibake(node.nodeValue);
        if (repaired !== node.nodeValue) {
          node.nodeValue = repaired;
        }
      }

      node = walker.nextNode();
    }
  }

  function syncTwineUndoButton() {
    const button = document.getElementById('medicineUndoButton');
    if (!button) {
      return;
    }

    const undoIcon = document.querySelector('tw-sidebar tw-icon[alt="Undo"]');
    if (!undoIcon) {
      button.disabled = true;
      return;
    }

    const computed = window.getComputedStyle(undoIcon);
    button.disabled =
      computed.display === 'none' ||
      computed.visibility === 'hidden' ||
      computed.opacity === '0';
  }

  function ensureTwineChrome(match) {
    if (!isTwineCase()) {
      return;
    }

    document.body.classList.add('medicineTwineCase');

    if (!document.querySelector('.medicineSeriesPillWrap')) {
      const pillWrap = document.createElement('div');
      pillWrap.className = 'medicineSeriesPillWrap';

      const pill = document.createElement('div');
      pill.className = 'medicineSeriesPill';
      pill.textContent = buildSeriesBannerText(match);

      pillWrap.appendChild(pill);
      document.body.insertBefore(pillWrap, document.body.firstChild);
    }

    const story = document.querySelector('tw-story');
    if (story && !story.querySelector('#medicineUndoButton')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'medicineUndoButton';
      button.className = 'medicineUndoButton';
      button.setAttribute('aria-label', 'Go back');
      button.textContent = '\u2190';
      button.addEventListener('click', function () {
        const undoIcon = document.querySelector('tw-sidebar tw-icon[alt="Undo"]');
        if (!undoIcon) {
          return;
        }
        undoIcon.click();
        window.setTimeout(syncTwineUndoButton, 0);
      });
      story.appendChild(button);
    }

    if (!document.body.dataset.medicineTwineObserver) {
      const observer = new MutationObserver(function () {
        sanitizeTwineTextNodes();
        syncTwineUndoButton();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      document.body.dataset.medicineTwineObserver = 'true';
    }

    sanitizeTwineTextNodes();
    syncTwineUndoButton();
    window.addEventListener('load', sanitizeTwineTextNodes);
    window.addEventListener('load', syncTwineUndoButton);
    window.setTimeout(sanitizeTwineTextNodes, 0);
    window.setTimeout(sanitizeTwineTextNodes, 120);
    window.setTimeout(sanitizeTwineTextNodes, 420);
    window.setTimeout(syncTwineUndoButton, 120);
    window.setTimeout(syncTwineUndoButton, 420);
  }

  function buildDeck(match) {
    if (isEmbeddedWorkspace() || isTwineCase() || isCustomCasebook()) {
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
    document.body.classList.add('has-medicine-shell');
    ensureTwineChrome(match);
    buildDeck(match);
    initEmbeddedAlignment();
    document.title = 'Adventures in Medicine - ' + match.label + ' - Case ' + match.caseNumber;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

