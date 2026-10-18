/* Deck templates are intentionally interpreted here; their scripts never run. */

const ALLOWED_TAGS = new Set([
  'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BR', 'CAPTION', 'CITE', 'CODE', 'COL',
  'COLGROUP', 'DD', 'DEL', 'DETAILS', 'DIV', 'DL', 'DT', 'EM', 'FIGCAPTION',
  'FIGURE', 'FONT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG',
  'INS', 'KBD', 'LI', 'MARK', 'OL', 'P', 'PRE', 'Q', 'S', 'SAMP', 'SMALL',
  'SPAN', 'STRIKE', 'STRONG', 'SUB', 'SUMMARY', 'SUP', 'TABLE', 'TBODY',
  'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'U', 'UL', 'VAR', 'WBR',
]);
const DROP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'TEMPLATE',
  'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'OPTION', 'META', 'LINK', 'BASE',
  'AUDIO', 'VIDEO', 'SOURCE', 'TRACK', 'NOSCRIPT',
]);

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

/** Parse Anki clozes, including nested deletions and optional hints. */
export function parseCloze(value) {
  const source = String(value ?? '');
  function parseRange(start, nested, depth, allowHint = true) {
    const nodes = [];
    let position = start;
    let pending = '';
    let hint = null;
    function flush() {
      if (pending) nodes.push({ type: 'text', value: pending });
      pending = '';
    }
    while (position < source.length) {
      if (nested && source.startsWith('}}', position)) {
        flush();
        return { nodes, hint, end: position + 2, closed: true };
      }
      if (nested && allowHint && hint === null && source.startsWith('::', position)) {
        flush();
        const answer = nodes.splice(0);
        const parsedHint = parseRange(position + 2, true, depth, false);
        return {
          nodes: answer,
          hint: parsedHint.nodes,
          end: parsedHint.end,
          closed: parsedHint.closed,
        };
      }
      const match = source.slice(position).match(/^\{\{c([1-9]\d*)::/i);
      if (match && depth < 40) {
        const parsed = parseRange(position + match[0].length, true, depth + 1);
        if (parsed.closed) {
          flush();
          nodes.push({
            type: 'cloze', number: Number(match[1]),
            children: parsed.nodes, hint: parsed.hint,
          });
          position = parsed.end;
          continue;
        }
      }
      pending += source[position];
      position += 1;
    }
    flush();
    return { nodes, hint, end: position, closed: !nested };
  }
  return parseRange(0, false, 0).nodes;
}

export function clozeOrdinals(value) {
  const ordinals = new Set();
  function visit(nodes) {
    for (const node of nodes) {
      if (node.type !== 'cloze') continue;
      ordinals.add(node.number - 1);
      visit(node.children);
    }
  }
  visit(parseCloze(value));
  return [...ordinals].sort((a, b) => a - b);
}

/** Pure template conversion. Sanitize the result before adding it to a DOM. */
export function renderCloze(value, ordinal, revealed = false) {
  const target = Number(ordinal) + 1;
  function render(nodes, inHint = false) {
    return nodes.map(node => {
      if (node.type === 'text') return node.value;
      if (node.number === target && !revealed) {
        // Do not traverse the answer of a hidden outer cloze: a nested deletion
        // must never leak that answer into the question HTML or attributes.
        const hint = node.hint ? render(node.hint, true) : '…';
        return `<span class="cloze-placeholder">[${hint || '…'}]</span>`;
      }
      const answer = render(node.children, inHint);
      return node.number === target && revealed && !inHint
        ? `<span class="cloze-answer">${answer}</span>` : answer;
    }).join('');
  }
  return render(parseCloze(value));
}

/** Only extracted media paths are permitted as image sources. */
export function safeMediaSource(value) {
  const candidate = String(value ?? '').trim();
  if (!/^media\/[a-zA-Z0-9_.-]+$/.test(candidate)) return null;
  if (candidate.slice(6) === '.' || candidate.slice(6) === '..') return null;
  return candidate;
}

function safeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function isNeutralColor(value) {
  const normalized = value.toLowerCase().replace(/\s+/g, '');
  if (['white', 'black', 'gray', 'grey', 'silver', 'transparent', 'inherit', 'currentcolor'].includes(normalized)) return true;
  const rgb = normalized.match(/^rgba?\((\d+),(\d+),(\d+)(?:,[\d.]+)?\)$/);
  if (rgb) return Number(rgb[1]) === Number(rgb[2]) && Number(rgb[2]) === Number(rgb[3]);
  const hex = normalized.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i);
  if (hex) {
    const components = hex[1].length === 3 ? [...hex[1]] : hex[1].match(/../g);
    return components[0] === components[1] && components[1] === components[2];
  }
  return /^hsla?\([^,]+,0%,/.test(normalized);
}

function cleanStyle(original, cleaned) {
  const colorPattern = /^(#[0-9a-f]{3,8}|[a-z]+|rgba?\([\d.,%\s]+\)|hsla?\([\d.,%\s]+\))$/i;
  for (const property of ['color', 'background-color']) {
    const value = original.style.getPropertyValue(property).trim();
    // AnKing notes include white text copied from dark themes. Let neutral
    // colors follow the site's card canvas instead of becoming invisible.
    if (value && colorPattern.test(value) && !isNeutralColor(value)) cleaned.style.setProperty(property, value);
  }
  const properties = {
    'font-weight': /^(normal|bold|bolder|lighter|[1-9]00)$/,
    'font-style': /^(normal|italic|oblique)$/,
    'text-decoration': /^(none|underline|line-through|overline)(\s+(underline|line-through|overline))*$/,
    'text-align': /^(left|right|center|justify)$/,
    'vertical-align': /^(baseline|sub|super|middle|top|bottom|text-top|text-bottom)$/,
    'white-space': /^(normal|pre|pre-wrap|pre-line)$/,
  };
  for (const [property, pattern] of Object.entries(properties)) {
    const value = original.style.getPropertyValue(property).trim();
    if (pattern.test(value)) cleaned.style.setProperty(property, value);
  }
  if (original.tagName === 'FONT') {
    const color = original.getAttribute('color') || '';
    if (colorPattern.test(color) && !isNeutralColor(color)) cleaned.style.color = color;
  }
}

/** Rebuild HTML using an allowlist. No note attributes or scripts are trusted. */
export function sanitizeHTML(value) {
  const template = document.createElement('template');
  // This deck's inline math consists of ordinary text formulas. Remove only
  // the MathJax display delimiters; preserve the formula and parentheses.
  template.innerHTML = String(value ?? '').replace(/\\\(([\s\S]*?)\\\)/g, '$1');
  const output = document.createElement('div');

  function appendSafe(source, destination) {
    if (source.nodeType === 3) {
      destination.appendChild(document.createTextNode(source.nodeValue || ''));
      return;
    }
    if (source.nodeType !== 1 || DROP_TAGS.has(source.tagName)) return;
    if (!ALLOWED_TAGS.has(source.tagName)) {
      for (const child of source.childNodes) appendSafe(child, destination);
      return;
    }
    if (source.tagName === 'IMG') {
      const sourceURL = source.getAttribute('src');
      const src = safeMediaSource(sourceURL) || safeLink(sourceURL);
      if (!src) return;
      const img = document.createElement('img');
      img.setAttribute('src', src);
      img.setAttribute('alt', source.getAttribute('alt') || 'Card illustration');
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.setAttribute('referrerpolicy', 'no-referrer');
      destination.appendChild(img);
      return;
    }
    const cleaned = document.createElement(source.tagName === 'FONT' ? 'span' : source.tagName.toLowerCase());
    cleanStyle(source, cleaned);
    if (source.tagName === 'A') {
      const href = safeLink(source.getAttribute('href'));
      if (href) {
        cleaned.setAttribute('href', href);
        cleaned.setAttribute('target', '_blank');
        cleaned.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (['TD', 'TH'].includes(source.tagName)) {
      for (const attribute of ['colspan', 'rowspan']) {
        const value = source.getAttribute(attribute);
        if (value && /^\d{1,2}$/.test(value) && Number(value) > 0) cleaned.setAttribute(attribute, value);
      }
    }
    if (source.tagName === 'OL') {
      const start = source.getAttribute('start');
      if (start && /^-?\d{1,5}$/.test(start)) cleaned.setAttribute('start', start);
    }
    if (source.tagName === 'SPAN') {
      const classes = (source.getAttribute('class') || '').split(/\s+/)
        .filter(className => ['cloze-placeholder', 'cloze-answer'].includes(className));
      if (classes.length) cleaned.className = classes.join(' ');
    }
    for (const child of source.childNodes) appendSafe(child, cleaned);
    destination.appendChild(cleaned);
  }
  for (const child of template.content.childNodes) appendSafe(child, output);
  return output.innerHTML;
}

/** Search text without executing or displaying the deck's source HTML. */
export function plainText(value) {
  const markup = String(value ?? '')
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<(?:br|hr)\b[^>]*>|<\/(?:p|div|li|tr|h[1-6])\s*>/gi, ' ');
  let text;
  if (typeof document !== 'undefined') {
    const template = document.createElement('template');
    template.innerHTML = markup;
    text = template.content.textContent || '';
  } else {
    const entities = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—' };
    text = markup.replace(/<[^>]*>/g, '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, key) => {
      if (key[0] !== '#') return entities[key.toLowerCase()] ?? entity;
      const number = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
      return number >= 0 && number <= 0x10ffff ? String.fromCodePoint(number) : entity;
    });
  }
  return text.replace(/\s+/g, ' ').trim();
}

function fieldMap(note, model) {
  const fields = new Map();
  (model.fields || []).forEach((field, index) => {
    fields.set(typeof field === 'string' ? field : field.name, note.fields[index] || '');
  });
  return fields;
}

function hasContent(html) {
  return /<img\b/i.test(html) || plainText(html).length > 0;
}

function resource(name, value) {
  const content = sanitizeHTML(value);
  return hasContent(content)
    ? `<details class="resource-section"><summary>${escapeHTML(name)}</summary><div class="resource-content">${content}</div></details>` : '';
}

function renderOcclusion(fields, revealed) {
  const header = sanitizeHTML(fields.get('Header'));
  const original = sanitizeHTML(fields.get('Image'));
  const mask = sanitizeHTML(fields.get(revealed ? 'Answer Mask' : 'Question Mask'));
  const footer = sanitizeHTML(fields.get('Footer'));
  let result = hasContent(header) ? `<div class="io-header">${header}</div>` : '';
  result += `<div class="io-wrapper" data-image-occlusion="true"><div class="io-original">${original}</div><div class="io-overlay" aria-hidden="true">${mask}</div></div>`;
  if (hasContent(footer)) result += `<div class="io-footer">${footer}</div>`;
  if (revealed) {
    const remarks = sanitizeHTML(fields.get('Remarks'));
    if (hasContent(remarks)) result += `<div class="card-extra">${remarks}</div>`;
    result += `<div class="card-resources">${['Sources', 'Extra 1', 'Extra 2'].map(name => resource(name, fields.get(name))).join('')}</div>`;
  }
  return result;
}

/** Render one zero-based card ordinal from a note. Browser DOM required. */
export function renderCard(note, model, ordinal = 0, revealed = false) {
  const fields = fieldMap(note, model);
  const type = String(model.type || '').toLowerCase();
  if (type === 'occlusion' || fields.has('Question Mask')) return renderOcclusion(fields, revealed);

  const text = fields.get('Text') ?? note.fields[0] ?? '';
  if (type === 'cloze' || /\{\{c[1-9]\d*::/i.test(text)) {
    const validOrdinal = clozeOrdinals(text).includes(Number(ordinal));
    let result = validOrdinal ? '' : '<p class="card-notice">This source card has no cloze deletion for its saved card number.</p>';
    if (validOrdinal || revealed) result += `<div class="card-text">${sanitizeHTML(renderCloze(text, ordinal, revealed))}</div>`;
    if (revealed) {
      const extra = sanitizeHTML(fields.get('Extra'));
      if (hasContent(extra)) result += `<div class="card-extra">${extra}</div>`;
      result += `<div class="card-resources">${['Lecture Notes', 'Images', 'Journal Updates', 'Additional Resources', 'Card Code'].map(name => resource(name, fields.get(name))).join('')}</div>`;
    }
    return result;
  }

  let result = `<div class="card-text">${sanitizeHTML(text)}</div>`;
  if (revealed) {
    result += note.fields.slice(1).map(value => {
      const content = sanitizeHTML(value);
      return hasContent(content) ? `<div class="card-extra">${content}</div>` : '';
    }).join('');
  }
  return result;
}
