import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';
import { sidebar } from '../src/data/sidebar.mjs';
import { docsRedirects } from '../src/data/docs-redirects.mjs';

const content = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
function source(slug) {
  return [join(content, `${slug}.md`), join(content, slug, 'index.md')].find(existsSync);
}
function entries(items) {
  return items.flatMap(item => item.items ? entries(item.items) : [item.slug]);
}
function markdown(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? markdown(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}

test('five audience groups contain real, non-draft articles without duplicates', () => {
  assert.deepEqual(sidebar.map(group => group.label), [
    'Get started', 'Using Silo', 'Running a server',
    'Developers & integrations', 'Help & contribute',
  ]);
  const slugs = entries(sidebar);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.ok(source(slug), `Missing sidebar article: ${slug}`);
    assert.doesNotMatch(readFileSync(source(slug), 'utf8'), /^draft:\s*true$/m);
  }
});

test('all previous public article URLs retain a page or a direct redirect', () => {
  const old = ['clients', 'installation', 'quickstart', 'first-configuration',
    'deployment/docker', 'deployment/reverse-proxy', 'libraries', 'audiobooks',
    'configuration', 'logging', 'storage/s3', 'ai-services', 'notifications',
    'integrations/autoscan', 'jellyfin-compatibility', 'audiobookshelf-compatibility',
    'apple-tv', 'feature-parity', 'troubleshooting', 'ebooks'];
  assert.ok(source('docs'));
  for (const path of old) {
    const legacy = `/docs/${path}`;
    const target = docsRedirects[legacy];
    if (!target) { assert.ok(source(legacy.slice(1)), `Lost URL: ${legacy}`); continue; }
    assert.ok(!docsRedirects[target], `Chained redirect: ${legacy}`);
    assert.ok(source(target.slice(1)), `Missing redirect target: ${target}`);
    assert.ok(!source(legacy.slice(1)), `Redirect conflicts with page: ${legacy}`);
  }
});

test('documentation links use canonical paths rather than redirects', () => {
  for (const path of markdown(join(content, 'docs'))) {
    const text = readFileSync(path, 'utf8');
    for (const legacy of Object.keys(docsRedirects)) {
      for (const suffix of [')', '/)', '#']) {
        assert.ok(!text.includes(`](${legacy}${suffix}`), `Old link ${legacy} in ${path}`);
      }
    }
  }
});

test('ebook notes are preserved but excluded from normal discovery', () => {
  assert.ok(!entries(sidebar).includes('docs/ebooks'));
  const text = readFileSync(source('docs/ebooks'), 'utf8');
  assert.match(text, /^pagefind:\s*false$/m);
  assert.match(text, /Outside the 1\.0 release scope/);
});
