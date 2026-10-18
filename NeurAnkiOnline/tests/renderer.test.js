import test from 'node:test';
import assert from 'node:assert/strict';
import { clozeOrdinals, parseCloze, plainText, renderCloze, safeMediaSource } from '../renderer.js';

test('each Anki card hides only the requested ordinal', () => {
  const input = '{{c1::pons}} and {{c2::medulla::structure}}';
  assert.equal(renderCloze(input, 0), '<span class="cloze-placeholder">[…]</span> and medulla');
  assert.equal(renderCloze(input, 1), 'pons and <span class="cloze-placeholder">[structure]</span>');
  assert.equal(renderCloze(input, 1, true), 'pons and <span class="cloze-answer">medulla</span>');
});

test('all repeated clozes for the same ordinal are hidden and highlighted together', () => {
  const input = '{{c1::left}} and {{c1::right}}';
  assert.equal((renderCloze(input, 0).match(/cloze-placeholder/g) || []).length, 2);
  assert.equal((renderCloze(input, 0, true).match(/cloze-answer/g) || []).length, 2);
});

test('a hidden outer deletion never exposes its nested answer', () => {
  const input = 'A {{c1::deep {{c2::secret}} answer::hint}}.';
  const rendered = renderCloze(input, 0);
  assert.equal(rendered, 'A <span class="cloze-placeholder">[hint]</span>.');
  assert.ok(!rendered.includes('deep'));
  assert.ok(!rendered.includes('secret'));
  assert.equal(renderCloze(input, 1), 'A deep <span class="cloze-placeholder">[…]</span> answer.');
});

test('nested deletions reveal without leaving Anki delimiters', () => {
  const input = '{{c1::outer {{c2::inner::nested hint}}::outer hint}}';
  assert.equal(renderCloze(input, 0, true), '<span class="cloze-answer">outer inner</span>');
  assert.equal(renderCloze(input, 1, true), 'outer <span class="cloze-answer">inner</span>');
  assert.deepEqual(clozeOrdinals(input), [0, 1]);
});

test('hint text may contain literal colons without truncation', () => {
  assert.equal(renderCloze('{{c1::answer::hint::with colons}}', 0), '<span class="cloze-placeholder">[hint::with colons]</span>');
});

test('cloze parsing keeps source markup and incomplete source text', () => {
  assert.equal(renderCloze('<b>{{c1::III}}</b><br>{{c2::IV', 0, true), '<b><span class="cloze-answer">III</span></b><br>{{c2::IV');
  assert.deepEqual(parseCloze('Normal {{words}}'), [{ type: 'text', value: 'Normal {{words}}' }]);
  assert.deepEqual(clozeOrdinals('{{c1::first}} {{c31::last}} {{c1::again}}'), [0, 30]);
});

test('missing card ordinals are detectable without changing the original answer', () => {
  assert.deepEqual(clozeOrdinals('{{c1::real question}}'), [0]);
  assert.equal(renderCloze('{{c1::real question}}', 30), 'real question');
});

test('image source allowlist rejects paths and active or remote URLs', () => {
  assert.equal(safeMediaSource('media/0001.svg'), 'media/0001.svg');
  assert.equal(safeMediaSource('media/diagram-a_2.png'), 'media/diagram-a_2.png');
  for (const value of ['javascript:alert(1)', 'https://example.com/p.png', 'data:image/svg+xml,a', '../media/a.png', 'media/../a.png', 'media/%2e%2e/x', 'media/a.png?x', 'media/..']) {
    assert.equal(safeMediaSource(value), null, value);
  }
});

test('search text removes active content, preserves word boundaries, and decodes entities', () => {
  assert.equal(plainText('<div>A &amp; B</div><div>C<br>D &#x2192; E&nbsp;F<script>bad()</script></div>'), 'A & B C D → E F');
});
