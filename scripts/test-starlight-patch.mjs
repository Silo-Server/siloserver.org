import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Bun drops a patch without warning when the patched package's version
// changes, so fail the build instead of shipping unpatched search links.
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const pkg = JSON.parse(read('../package.json'));
const installed = JSON.parse(read('../node_modules/@astrojs/starlight/package.json')).version;

test('Starlight is pinned to the version the patch targets', () => {
  const pinned = pkg.dependencies['@astrojs/starlight'];
  assert.equal(pinned, installed, 'pin @astrojs/starlight to an exact version');
  assert.ok(
    pkg.patchedDependencies?.[`@astrojs/starlight@${installed}`],
    `no patch for @astrojs/starlight@${installed}; regenerate it with bun patch`,
  );
});

test('the installed Starlight search is patched', () => {
  const search = read('../node_modules/@astrojs/starlight/components/Search.astro');
  assert.match(search, /replace\(\/#_top\$\/, ''\)/, 'search results would link to #_top');
  assert.match(search, /replace\(\/\\\.html\(\?=#\|\$\)\/, ''\)/, 'search results would link to .html pages');
});
