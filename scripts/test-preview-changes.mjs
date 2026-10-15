import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fromHtml } from 'hast-util-from-html';
import {
  SKIP_SELECTOR, changesBase, changesManifest, collectChanges, decorateChanges, diffPage, extractBlocks,
  injectChanges, pagePath,
} from './preview-changes.mjs';

// A Starlight page reduced to the parts the overlay reads.
const page = (body, title = 'Nodes') => `<!doctype html><html><head><title>${title}</title></head><body>` +
  `<div class="sl-container"><h1 id="_top">${title}</h1></div>` +
  `<div class="sl-markdown-content"><p class="docs-baseline">Silo is in active development.</p>${body}</div>` +
  '<footer><p>Last updated: today</p></footer></body></html>';
const heading = (id, text) => `<div class="sl-heading-wrapper level-h2"><h2 id="${id}">${text}</h2>` +
  `<a class="sl-anchor-link" href="#${id}"><span class="sr-only">Section titled “${text}”</span></a></div>`;
const info = { number: '7', url: 'https://github.com/Silo-Server/siloserver.org/pull/7', sha: 'abc1234' };

// The text nodes the browser script finds in a block: everything below it
// except skipped elements and nested blocks. Mirrors ownText() in the overlay.
function browserText(html, id) {
  const tree = fromHtml(html);
  let block = null;
  const find = node => {
    if (block) return;
    if (node.properties?.dataSiloBlock === String(id)) { block = node; return; }
    for (const child of node.children ?? []) find(child);
  };
  find(tree);
  const skip = SKIP_SELECTOR.split(',');
  const matches = node => skip.some(selector => selector.startsWith('.')
    ? (node.properties.className ?? []).includes(selector.slice(1)) : node.tagName === selector);
  const nodes = [];
  const walk = node => {
    for (const child of node.children) {
      if (child.type === 'text') nodes.push(child.value);
      else if (child.type === 'element' && !matches(child) && child.properties.dataSiloBlock === undefined) walk(child);
    }
  };
  walk(block);
  return nodes;
}

test('blocks cover headings, list items, table rows and code, skipping anchors and buttons', () => {
  const { blocks, title } = extractBlocks(page(`${heading('drain', 'Drain a node')}
<ul><li>Open <strong>Nodes</strong>.<ul><li>Nested item</li></ul></li><li><p>Loose item</p></li></ul>
<table><thead><tr><th>State</th><th>Meaning</th></tr></thead><tbody><tr><td>Draining</td><td>No new work</td></tr></tbody></table>
<div class="expressive-code"><figure><figcaption class="header"></figcaption><pre><code><div class="ec-line">docker compose stop</div></code></pre><div class="copy"><button data-code="x">Copy</button></div></figure></div>`));
  const visible = blocks.filter(block => block.plain).map(block => [block.tag, block.plain]);
  assert.equal(title, 'Nodes');
  assert.deepEqual(visible, [
    ['h1', 'Nodes'], ['p', 'Silo is in active development.'], ['h2', 'Drain a node'],
    ['li', 'Open Nodes.'], ['li', 'Nested item'], ['p', 'Loose item'],
    ['tr', 'State Meaning'], ['tr', 'Draining No new work'], ['pre', 'docker compose stop'],
  ]);
});

test('an unchanged page has no changes, even when markup outside the content differs', () => {
  const body = '<p>Same words.</p>';
  assert.equal(diffPage(page(body), page(body).replace('today', 'yesterday')), null);
});

test('an edited paragraph is one change with word-level marks against its own text nodes', () => {
  const before = page('<p>Silo can reach it. Check its <strong>Acceleration</strong> block.</p>');
  const after = page('<p>Silo can reach it and whether it’s draining. Check its <strong>Acceleration</strong> block.</p>');
  const diff = diffPage(before, after);
  assert.equal(diff.hunks.length, 1);
  const [item] = diff.hunks[0].items;
  assert.equal(item.kind, 'changed');
  const block = diff.head.blocks[item.head];
  // Punctuation is its own token, so only the new words are marked.
  assert.deepEqual(item.inserted.map(([node, start, end]) => block.texts[node].slice(start, end)), ['and whether it’s draining']);
  assert.deepEqual(item.removed, []);
});

test('replaced words are shown before the words that replace them', () => {
  const diff = diffPage(page('<p>Wait for its jobs to finish.</p>'), page('<p>Wait for it to drain.</p>'));
  const [item] = diff.hunks[0].items;
  const block = diff.head.blocks[item.head];
  assert.deepEqual(item.removed.map(([node, offset, text]) => [block.texts[node].slice(offset), text]),
    [['it to drain.', 'its jobs'], ['drain.', 'finish']]);
});

test('added, removed and changed blocks group into separate changes between unchanged blocks', () => {
  const before = page(`${heading('a', 'Start')}<p>First paragraph stays.</p><p>Old note to remove entirely.</p>
${heading('b', 'Later')}<p>Second paragraph keeps most of its words here.</p><ol><li>One</li><li>Two</li></ol>`);
  const after = page(`${heading('a', 'Start')}<p>First paragraph stays.</p>
${heading('b', 'Later')}<p>Second paragraph keeps most of its own words here.</p><ol><li>One</li><li>One and a half</li><li>Two</li></ol>`);
  const diff = diffPage(before, after);
  assert.deepEqual(diff.hunks.map(hunk => hunk.items.map(item => item.kind)), [['removed'], ['changed'], ['added']]);
  // The removed note sits before the next block still on the page.
  const [removed] = diff.hunks;
  assert.equal(diff.head.blocks[removed.groups[0].anchor.head].plain, 'Later');
  assert.equal(removed.groups[0].anchor.where, 'before');
  // Side by side shows the whole list, with the unchanged items for context.
  const added = diff.hunks[2];
  assert.equal(added.sbs.base.length, 1);
  assert.equal(added.sbs.head.length, 1);
});

test('a block removed at the end of the page anchors after the last block', () => {
  const diff = diffPage(page('<p>Keep.</p><p>Gone for good.</p>'), page('<p>Keep.</p>'));
  const [group] = diff.hunks[0].groups;
  assert.equal(diff.head.blocks[group.anchor.head].plain, 'Keep.');
  assert.equal(group.anchor.where, 'after');
});

test('a split paragraph pairs with the half that kept most of its words', () => {
  const diff = diffPage(
    page('<p>Turn the switch off to stop work. After changing drivers, use the re-probe button while idle.</p>'),
    page('<p>Proxy nodes do not drain at all.</p><p>After changing drivers, use the re-probe button once drained.</p>'));
  assert.deepEqual(diff.hunks[0].items.map(item => item.kind), ['added', 'changed']);
  assert.equal(diff.head.blocks[diff.hunks[0].items[1].head].plain,
    'After changing drivers, use the re-probe button once drained.');
});

test('link, formatting and title changes are reported even when the words match', () => {
  const link = diffPage(page('<p>See <a href="/docs/old">the guide</a>.</p>'), page('<p>See <a href="/docs/new">the guide</a>.</p>'));
  assert.deepEqual(link.hunks[0].items[0].notes, [{ type: 'links', links: [{ text: 'the guide', from: '/docs/old', to: '/docs/new' }] }]);
  const format = diffPage(page('<p>Open Nodes.</p>'), page('<p>Open <strong>Nodes</strong>.</p>'));
  assert.deepEqual(format.hunks[0].items[0].notes, [{ type: 'format' }]);
  const title = diffPage(page('<p>Body.</p>', 'Old title'), page('<p>Body.</p>', 'New title'));
  assert.equal(title.head.blocks[title.hunks[0].items[0].head].tag, 'h1');
  const moved = diffPage(page('<p>Keep <a href="/a">A</a> here and more words.</p>'),
    page('<p>Keep here and more words, with <a href="/a">A</a>.</p>'));
  assert.deepEqual(moved.hunks[0].items[0].notes, []);
});

test('new and removed pages', () => {
  const added = diffPage(null, page('<p>Brand new.</p>'));
  assert.equal(added.status, 'added');
  assert.equal(added.hunks.length, 1);
  assert.equal(diffPage(page('<p>Old.</p>'), null).status, 'removed');
  assert.equal(diffPage(null, null), null);
});

test('injected block numbers match the build’s text nodes, so word marks land correctly', () => {
  const before = page(`<p>Open <a href="/x">Admin <code>Nodes</code></a> and wait.</p>
<table><tbody><tr><td>Draining</td><td>Old <em>meaning</em></td></tr></tbody></table>
<ul><li>Top <strong>item</strong><ul><li>Nested</li></ul> tail</li></ul>${heading('h', 'Section')}`);
  const after = before.replace('and wait', 'and then wait').replace('Old <em>meaning</em>', 'New <em>meaning</em>')
    .replace('tail', 'new tail').replace('>Section<', '>Better section<');
  const diff = diffPage(before, after);
  const html = injectChanges(after, { manifest: { pr: '7' }, page: { hunks: [] } });
  const changed = diff.hunks.flatMap(hunk => hunk.items).filter(item => item.kind === 'changed');
  assert.equal(changed.length, 4);
  for (const item of changed) {
    assert.deepEqual(browserText(html, item.head), diff.head.blocks[item.head].texts);
  }
});

test('injection adds data, styles and script once, and escapes JSON', () => {
  const html = page('<p>Hello.</p>');
  const manifest = { pr: '7', title: '</script><script>alert(1)</script>' };
  const result = injectChanges(html, { manifest, page: { hunks: [] }, base: '/' });
  assert.match(result, /<p data-silo-block="\d+" class="docs-baseline">/);
  assert.match(result, /<link rel="stylesheet" href="\/_changes\/overlay.css"><\/head>/);
  assert.match(result, /<script src="\/_changes\/overlay.js" defer><\/script><\/body>/);
  assert.doesNotMatch(result, /<\/script><script>alert/);
  assert.equal(injectChanges(result, { manifest, page: { hunks: [] } }), result);
  assert.equal(injectChanges('<html><body>Home</body></html>', { manifest }), '<html><body>Home</body></html>');
});

test('built pages map to their public paths', () => {
  assert.equal(pagePath('docs.html'), '/docs');
  assert.equal(pagePath('docs/transcode-nodes.html'), '/docs/transcode-nodes');
  assert.equal(pagePath('docs/index.html', '/site/'), '/site/docs');
});

test('collecting a whole build orders pages by the sidebar and decorates every docs page', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'silo-changes-test-'));
  try {
    const write = async (path, html) => {
      await mkdir(join(directory, path, '..'), { recursive: true });
      await writeFile(join(directory, path), html);
    };
    await write('base/docs/a.html', page('<p>Alpha.</p>', 'A'));
    await write('base/docs/b.html', page('<p>Bravo.</p>', 'B'));
    await write('base/docs/gone.html', page('<p>Gone.</p>', 'Gone'));
    await write('head/docs/a.html', page('<p>Alpha, edited.</p>', 'A'));
    await write('head/docs/b.html', page('<p>Bravo.</p>', 'B'));
    await write('head/docs/new.html', page('<p>New.</p>', 'New'));
    await write('head/index.html', '<html><head></head><body>Home</body></html>');
    const pages = await collectChanges(join(directory, 'base'), join(directory, 'head'), { order: ['docs/new', 'docs/a'] });
    assert.deepEqual(pages.map(entry => [entry.path, entry.diff.status]),
      [['/docs/new', 'added'], ['/docs/a', 'changed'], ['/docs/gone', 'removed']]);
    const manifest = changesManifest(pages, { info, compare: { label: 'main', sha: 'def5678' } });
    assert.deepEqual(manifest.pages.map(entry => entry.hunks.length), [1, 1, 0]);
    assert.equal(await decorateChanges(join(directory, 'head'), pages, manifest), 3);
    assert.match(await readFile(join(directory, 'head/docs/a.html'), 'utf8'), /id="silo-changes-page"/);
    assert.doesNotMatch(await readFile(join(directory, 'head/docs/b.html'), 'utf8'), /id="silo-changes-page"/);
    assert.match(await readFile(join(directory, 'head/docs/b.html'), 'utf8'), /id="silo-changes-manifest"/);
    assert.equal(await readFile(join(directory, 'head/index.html'), 'utf8'), '<html><head></head><body>Home</body></html>');
    assert.deepEqual(JSON.parse(await readFile(join(directory, 'head/_changes/manifest.json'), 'utf8')), manifest);

    // A later push that changes another page keeps this change's signature,
    // so it doesn't count as new since the last visit.
    await write('head/docs/a.html', page('<p>Alpha, edited.</p>', 'A'));
    await write('head/docs/b.html', page('<p>Bravo, edited later.</p>', 'B'));
    const later = changesManifest(await collectChanges(join(directory, 'base'), join(directory, 'head'),
      { order: ['docs/new', 'docs/a'] }), { info, compare: null });
    const sigs = entries => Object.fromEntries(entries.pages.map(entry => [entry.path, entry.hunks.map(hunk => hunk.sig)]));
    assert.deepEqual(sigs(later)['/docs/a'], sigs(manifest)['/docs/a']);
    assert.equal(sigs(later)['/docs/b'].length, 1);
    assert.notDeepEqual(sigs(later)['/docs/b'], sigs(later)['/docs/a']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('the base is the first parent of a pull request merge commit, or where the branch left main', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'silo-changes-git-'));
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
  try {
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'Test');
    git('commit', '-q', '--allow-empty', '-m', 'base');
    const base = git('rev-parse', 'HEAD');
    git('switch', '-q', '-c', 'feature');
    git('commit', '-q', '--allow-empty', '-m', 'feature');
    git('switch', '-q', 'main');
    git('commit', '-q', '--allow-empty', '-m', 'main moved');
    const main = git('rev-parse', 'HEAD');
    git('switch', '-q', 'feature');
    assert.deepEqual(changesBase(directory, {}), { ref: base, label: 'main' });
    git('switch', '-q', '--detach', 'main');
    git('merge', '-q', '--no-ff', '-m', 'merge', 'feature');
    assert.deepEqual(changesBase(directory, { GITHUB_REF: 'refs/pull/7/merge', GITHUB_BASE_REF: 'main' }), { ref: main, label: 'main' });
    // A local branch that merged main is not GitHub's merge ref: compare with
    // where the branch now leaves main, not with its previous tip.
    git('switch', '-q', 'feature');
    const feature = git('rev-parse', 'HEAD');
    git('merge', '-q', '--no-ff', '-m', 'merge main', 'main');
    git('update-ref', 'refs/remotes/origin/main', main);
    assert.equal(git('rev-parse', 'HEAD^1'), feature);
    assert.deepEqual(changesBase(directory, {}), { ref: main, label: 'origin/main' });
    assert.equal(changesBase(directory, { PREVIEW_CHANGES_BASE: base.slice(0, 7) }).ref, base);
    assert.throws(() => changesBase(directory, { PREVIEW_CHANGES_BASE: 'no-such-ref' }));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('a build without docs changes gets a manifest but no overlay', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'silo-changes-none-'));
  try {
    await mkdir(join(directory, 'docs'), { recursive: true });
    const html = page('<p>Same.</p>');
    await writeFile(join(directory, 'docs/a.html'), html);
    const manifest = changesManifest([], { info, compare: { label: 'main', sha: 'def5678' } });
    assert.equal(await decorateChanges(directory, [], manifest), 0);
    assert.equal(await readFile(join(directory, 'docs/a.html'), 'utf8'), html);
    assert.deepEqual(JSON.parse(await readFile(join(directory, '_changes/manifest.json'), 'utf8')).pages, []);
    // A failed comparison still shows the box, so the reviewer knows why.
    const failed = changesManifest([], { info, compare: null, error: 'Could not compare' });
    assert.equal(await decorateChanges(directory, [], failed), 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('an indentation-only edit in a code block is a change, with a note', () => {
  const code = indent => page(`<div class="expressive-code"><figure><pre><code><div class="ec-line">services:</div><div class="ec-line">${indent}silo:</div></code></pre></figure></div>`);
  const diff = diffPage(code('  '), code('    '));
  assert.equal(diff.hunks.length, 1);
  const [item] = diff.hunks[0].items;
  assert.equal(item.kind, 'changed');
  assert.deepEqual(item.notes, [{ type: 'spacing' }]);
  // Prose still ignores spacing differences.
  assert.equal(diffPage(page('<p>Same  words.</p>'), page('<p>Same words.</p>')), null);
});

test('a link moved to other words is a change, with a note', () => {
  const diff = diffPage(page('<p><a href="/docs/x">Read</a> the guide.</p>'), page('<p>Read the <a href="/docs/x">guide</a>.</p>'));
  assert.equal(diff.hunks.length, 1);
  assert.deepEqual(diff.hunks[0].items[0].notes, [{ type: 'linked', from: ['Read'], to: ['guide'] }]);
});

test('identical edits in different places get different signatures', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'silo-changes-sig-'));
  try {
    const body = (a, b) => `${heading('one', 'One')}<p>Intro one.</p>${a}<p>End one.</p>` +
      `${heading('two', 'Two')}<p>Intro two.</p>${b}<p>End two.</p><p>Intro three.</p>${b}<p>End three.</p>`;
    const added = '<p>Restart the server.</p>';
    const sigs = async (a, b) => {
      await mkdir(join(directory, 'base/docs'), { recursive: true });
      await mkdir(join(directory, 'head/docs'), { recursive: true });
      await writeFile(join(directory, 'base/docs/a.html'), page(body('', '')));
      await writeFile(join(directory, 'head/docs/a.html'), page(body(a, b)));
      const pages = await collectChanges(join(directory, 'base'), join(directory, 'head'));
      return changesManifest(pages, { info, compare: null }).pages[0].hunks.map(hunk => hunk.sig);
    };
    const first = await sigs(added, '');
    const later = await sigs(added, added);
    assert.equal(later.length, 3);
    assert.equal(new Set(later).size, 3);
    // The edit seen on the first visit keeps its signature; the repeats are new.
    assert.equal(later[0], first[0]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
