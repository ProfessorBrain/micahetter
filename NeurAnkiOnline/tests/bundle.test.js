import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { generateBundle } from '../scripts/build.mjs';

test('the delivered file is a current classic-script bundle with its deck included', async () => {
  const shipped = await readFile(new URL('../app.bundle.js', import.meta.url), 'utf8');
  assert.equal(shipped, await generateBundle(), 'Run npm run build after editing source or reimporting the deck.');
  assert.doesNotThrow(() => new Script(shipped), 'The file must parse as a classic script, not an ES module.');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<script defer src="app\.bundle\.js"><\/script>/);
  assert.doesNotMatch(html, /<script[^>]+type="module"/);
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /fetch\(/, 'Startup must not fetch a local file.');
});
