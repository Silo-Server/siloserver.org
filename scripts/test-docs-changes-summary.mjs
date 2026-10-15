import assert from 'node:assert/strict';
import test from 'node:test';
import summarize from '../.github/preview-tools/docs-changes-summary.cjs';

const origin = 'https://pr-7.siloserver-org.pages.dev';
const manifest = pages => JSON.stringify({ pr: '7', sha: 'abc1234', pages });
const hunks = count => Array.from({ length: count }, (_, i) => ({ sig: String(i) }));

test('lists changed pages with links to their first change, numbered across the pull request', () => {
  const text = summarize(manifest([
    { path: '/docs/transcode-nodes', title: 'Add and check transcode nodes', status: 'changed', hunks: hunks(2) },
    { path: '/docs/quick-connect', title: 'Quick Connect', status: 'added', hunks: hunks(1) },
    { path: '/docs/old-page', title: 'Old page', status: 'removed', hunks: [] },
    { path: '/docs/node-status', title: 'Read node status', status: 'changed', hunks: hunks(3) },
  ]), { origin });
  assert.match(text, /^\*\*Docs changes:\*\* 6 changes on 3 pages\./);
  assert.match(text, /\| \[Add and check transcode nodes\]\(https:\/\/pr-7\.siloserver-org\.pages\.dev\/docs\/transcode-nodes\?change=1\) \| 2 \|/);
  assert.match(text, /\| \[Quick Connect \(new page\)\]\(https:\/\/pr-7\.siloserver-org\.pages\.dev\/docs\/quick-connect\?change=3\) \| 1 \|/);
  assert.match(text, /\| \[Old page\]\(https:\/\/siloserver\.org\/docs\/old-page\) \(removed; opens the published page\) \| 0 \|/);
  assert.match(text, /node-status\?change=4\) \| 3 \|/);
});

test('nothing is added without docs changes or a readable manifest', () => {
  assert.equal(summarize('', { origin }), '');
  assert.equal(summarize('not json', { origin }), '');
  assert.equal(summarize(manifest([]), { origin }), '');
  assert.equal(summarize('x'.repeat(600 * 1024), { origin }), '');
});

test('a failed comparison says so without repeating the artifact text', () => {
  const text = summarize(JSON.stringify({ pages: [], error: 'Could not compare: [click](https://evil.example)' }), { origin });
  assert.match(text, /could not compare/);
  assert.doesNotMatch(text, /evil/);
});

test('untrusted fields cannot inject links, mentions, markup or other hosts', () => {
  const hostile = [
    { path: '//evil.example/docs', title: 'x', status: 'changed', hunks: hunks(1) },
    { path: '/docs/a?x=1', title: 'x', status: 'changed', hunks: hunks(1) },
    { path: '/docs/../admin', title: 'x', status: 'changed', hunks: hunks(1) },
    { path: '/docs/a', title: 'x', status: 'merged', hunks: hunks(1) },
    { path: '/docs/a', title: 'x', status: 'changed', hunks: 'many' },
  ];
  for (const page of hostile) assert.equal(summarize(manifest([page]), { origin }), '', JSON.stringify(page));

  const text = summarize(manifest([{ path: '/docs/a', status: 'changed', hunks: hunks(1),
    title: '@everyone [click](https://evil.example) <img src=x> | www.evil.example `code`' }]), { origin });
  assert.doesNotMatch(text, /@|\]\(https:\/\/evil|<img|`/);
  assert.equal(text.split('\n').filter(line => line.startsWith('| [')).length, 1);
  const row = text.split('\n').find(line => line.startsWith('| ['));
  // The title stays inside the link text; the only URL is the preview's.
  assert.match(row, /^\| \[[^\]]*\]\(https:\/\/pr-7\.siloserver-org\.pages\.dev\/docs\/a\?change=1\) \| 1 \|$/);
  assert.equal(summarize(manifest([{ path: '/docs/a', status: 'changed', hunks: hunks(1), title: '' }]), { origin })
    .includes('[/docs/a]('), true);
});

test('long lists are capped', () => {
  const pages = Array.from({ length: 45 }, (_, i) => ({ path: `/docs/p${i}`, title: `P${i}`, status: 'changed', hunks: hunks(1) }));
  const text = summarize(manifest(pages), { origin });
  assert.equal(text.split('\n').filter(line => line.startsWith('| [')).length, 40);
  assert.match(text, /5 more pages/);
});
