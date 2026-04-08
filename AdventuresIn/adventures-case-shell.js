(function () {
  const rules = [
    {
      seriesId: 'psychiatry',
      label: 'Psychiatry',
      regex: /AdventuresInPsychiatry-Case(\d+)\.html$/i
    }
  ];

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

  function injectStyles() {
    if (document.getElementById('adventures-medicine-shell-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'adventures-medicine-shell-style';
    style.textContent = '' +
      'body.has-medicine-shell tw-story tw-passage { padding-top: 3.9em !important; }' +
      'body.has-medicine-shell .medicineHubLink {' +
        'position: fixed;' +
        'top: max(14px, env(safe-area-inset-top));' +
        'right: max(14px, env(safe-area-inset-right));' +
        'z-index: 999995;' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'padding: 0.6rem 0.95rem;' +
        'border-radius: 999px;' +
        'border: 1px solid rgba(255,255,255,0.2);' +
        'background: rgba(5, 11, 17, 0.8);' +
        'backdrop-filter: blur(10px);' +
        'box-shadow: 0 14px 32px rgba(0,0,0,0.35);' +
        'color: #ffffff;' +
        'font: 600 0.95rem/1 Georgia, serif;' +
        'text-decoration: none;' +
      '}' +
      'body.has-medicine-shell .medicineHubLink:hover { border-color: rgba(255,255,255,0.34); background: rgba(12, 22, 33, 0.88); }' +
      'body.has-medicine-shell .medicineHubLink:focus-visible { outline: 3px solid rgba(127, 209, 198, 0.55); outline-offset: 2px; }' +
      '@media (max-width: 575px) {' +
        'body.has-medicine-shell tw-story tw-passage { padding-top: 4.7em !important; }' +
        'body.has-medicine-shell .medicineHubLink { left: 14px; right: 14px; }' +
      '}';

    document.head.appendChild(style);
  }

  function init() {
    const match = detectCase();
    if (!match || !Number.isFinite(match.caseNumber)) {
      return;
    }

    injectStyles();
    document.body.classList.add('has-medicine-shell');
    document.title = 'Adventures in Medicine - ' + match.label + ' - Case ' + match.caseNumber;

    if (!document.querySelector('.medicineHubLink')) {
      const link = document.createElement('a');
      link.className = 'medicineHubLink';
      link.href = 'index.html#series=' + encodeURIComponent(match.seriesId) + '&case=' + encodeURIComponent(String(match.caseNumber));
      link.target = '_top';
      link.rel = 'noopener';
      link.textContent = 'Back to Adventures in Medicine';
      document.body.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
