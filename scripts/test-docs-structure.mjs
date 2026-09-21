import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';
import { sidebar } from '../src/data/sidebar.mjs';
import { docsRedirects } from '../src/data/docs-redirects.mjs';
import { docsRelease } from '../src/data/docs-release.mjs';

const content = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
function source(slug) {
  return articles.find(article => article.slug === slug)?.path;
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

const articles = markdown(join(content, 'docs')).map(path => {
  const text = readFileSync(path, 'utf8');
  return { path, text, slug: text.match(/^slug: (.+)$/m)?.[1], beta: /^beta: true$/m.test(text) };
});

test('all articles declare unique flat slugs and appear in the sidebar', () => {
  for (const article of articles) assert.match(article.slug ?? '', /^docs(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/, article.path);
  assert.equal(new Set(articles.map(article => article.slug)).size, articles.length);
  assert.deepEqual(entries(sidebar).sort(), articles.map(article => article.slug).sort());
});

test('release baseline distinguishes prerelease source review from a stable release', () => {
  assert.ok(['prerelease', 'stable'].includes(docsRelease.channel));
  if (docsRelease.channel === 'stable') assert.match(docsRelease.release ?? '', /^\d+\.\d+\.\d+$/);
  else assert.equal(docsRelease.release, null);
  assert.match(docsRelease.sourceReviewedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(docsRelease.sources.map(source => source.repo).sort(), ['silo-android', 'silo-apple', 'silo-server']);
  for (const source of docsRelease.sources) assert.match(source.revision, /^[a-f0-9]{40}$/);
});

test('audience groups and Beta contain real articles without duplicates', () => {
  assert.deepEqual(sidebar.map(group => group.label), [
    'Get started', 'Using Silo', 'Running a server',
    'Beta', 'Developers & integrations', 'Help & contribute',
  ]);
  const slugs = entries(sidebar);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.ok(source(slug), `Missing sidebar article: ${slug}`);
    assert.doesNotMatch(readFileSync(source(slug), 'utf8'), /^draft:\s*true$/m);
  }
});

test('first-run paths separate joining a server from installing one', () => {
  const start = sidebar.find(group => group.label === 'Get started');
  assert.deepEqual(entries(start.items), [
    'docs', 'docs/connect-and-watch', 'docs/tv-sign-in',
  ]);
  const server = sidebar.find(group => group.label === 'Running a server');
  assert.deepEqual(server.items.slice(0, 2).map(item => item.slug), [
    'docs/install-silo-server', 'docs/requirements',
  ]);
  const install = readFileSync(source('docs/install-silo-server'), 'utf8');
  for (const anchor of ['step-by-step', 'what-to-decide-first', 'after-the-wizard']) {
    assert.ok(install.includes(`id="${anchor}"`), `Lost after-installation anchor: ${anchor}`);
  }
});

test('all previous public article URLs retain a page or a direct redirect', () => {
  for (const [legacy, target] of Object.entries(docsRedirects)) {
    assert.ok(!docsRedirects[target], `Chained redirect: ${legacy}`);
    assert.ok(source(target.slice(1)), `Missing redirect target: ${target}`);
    assert.ok(!source(legacy.slice(1)), `Redirect conflicts with page: ${legacy}`);
  }
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

test('beta guides are labeled and confined to the Beta group', () => {
  const beta = sidebar.find(group => group.label === 'Beta');
  assert.ok(beta);
  const betaSlugs = entries(beta.items);
  assert.ok(betaSlugs.includes('docs/listen-to-audiobooks'));
  assert.ok(betaSlugs.includes('docs/ebooks'));
  for (const slug of betaSlugs) {
    assert.ok(articles.find(article => article.slug === slug)?.beta);
    assert.match(readFileSync(source(slug), 'utf8'), /^title: .*Beta.*$/m);
  }
  for (const group of sidebar.filter(group => group !== beta)) {
    assert.ok(entries(group.items).every(slug => !articles.find(article => article.slug === slug)?.beta));
  }
  for (const { path, slug } of articles.filter(article => article.beta)) {
    assert.ok(betaSlugs.includes(slug), `Unlisted beta guide: ${slug}`);
    assert.match(readFileSync(path, 'utf8'), /:::caution\[Beta\]/);
  }
});
