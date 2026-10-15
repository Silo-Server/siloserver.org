// Docs change overlay for pull request previews.
//
// After a preview build, this builds the commit the pull request is compared
// against, compares the rendered docs of both builds block by block, and adds
// the differences to each changed page with a small browser script
// (preview-changes-overlay.js) that highlights them. Production builds never
// run any of this: it is gated on the same preview metadata as the banner.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import { diffArrays } from 'diff';
import { previewInfo } from './preview-banner.mjs';

// Elements that each count as one unit of change. Anything else that holds
// loose text (a table cell's row, a <div> in a component) is grouped with its
// nearest block, or becomes a block itself when it has none.
const BLOCK_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'tr', 'pre', 'dt', 'dd',
  'figcaption', 'blockquote', 'summary', 'caption']);
const INLINE_TAGS = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'del', 'dfn',
  'em', 'i', 'img', 'ins', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
  'time', 'u', 'var', 'wbr']);
// Word boundaries that markup implies without whitespace, as between cells.
const BREAK_TAGS = new Set([...BLOCK_TAGS, 'br', 'td', 'th', 'div', 'ul', 'ol', 'dl', 'table', 'thead',
  'tbody', 'section', 'aside', 'figure', 'details']);
const FORMAT_TAGS = new Set(['strong', 'b', 'em', 'i', 'code', 'kbd', 'mark', 's', 'del', 'ins', 'sub', 'sup']);
// Not reader-visible content: anchor links, code copy buttons, icons, scripts.
const SKIP_TAGS = ['script', 'style', 'link', 'svg', 'template', 'noscript', 'button'];
const SKIP_CLASSES = ['sl-anchor-link'];
// The browser script must skip exactly the same elements when it finds the
// text nodes of a block, or its word marks would land in the wrong place.
export const SKIP_SELECTOR = [...SKIP_TAGS, ...SKIP_CLASSES.map(name => `.${name}`)].join(',');

const LABELS = { h1: 'title', h2: 'heading', h3: 'heading', h4: 'heading', h5: 'heading', h6: 'heading',
  p: 'paragraph', li: 'list item', tr: 'table row', pre: 'code block', dt: 'term', dd: 'definition',
  figcaption: 'caption', blockquote: 'quote', summary: 'summary', caption: 'table caption' };

const classes = node => node.properties?.className ?? [];
const skipped = node => SKIP_TAGS.includes(node.tagName) || SKIP_CLASSES.some(name => classes(node).includes(name));
// Words, keeping apostrophes and inner dots or hyphens, and single punctuation
// marks, so a changed full stop doesn't mark the word before it.
const TOKEN = /[\p{L}\p{N}_]+(?:['’.\-][\p{L}\p{N}_]+)*|[^\s\p{L}\p{N}_]/gu;
const words = text => [...text.matchAll(TOKEN)].map(match => ({ text: match[0], start: match.index, end: match.index + match[0].length }));
const normalize = text => text.replace(/\s+/g, ' ').trim();

export function hash(value) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, '0');
}

function findRoots(tree) {
  let title = null, content = null;
  const search = node => {
    for (const child of node.children ?? []) {
      if (child.type !== 'element') continue;
      if (!title && child.tagName === 'h1' && child.properties?.id === '_top') title = child;
      if (!content && classes(child).includes('sl-markdown-content')) content = child;
      else search(child);
      if (title && content) return;
    }
  };
  search(tree);
  return { title, content };
}

// Whether an element holds text that no block below it will claim.
function hasLooseContent(node) {
  return node.children.some(child => child.type === 'text' ? /\S/.test(child.value)
    : child.type === 'element' && !skipped(child) && !BLOCK_TAGS.has(child.tagName) &&
      (child.tagName === 'img' || (INLINE_TAGS.has(child.tagName) && hasLooseContent(child))));
}

// Text of an inline element inside its block, for link and formatting changes.
function ownText(node) {
  return node.children.map(child => child.type === 'text' ? child.value
    : child.type === 'element' && !skipped(child) && !BLOCK_TAGS.has(child.tagName) ? ownText(child) : '').join('');
}

// Splits the rendered docs content (page title plus Markdown body) into
// blocks. Every block keeps its text nodes in document order, which is what
// the browser script walks to place word-level marks.
export function extractBlocks(html) {
  const { title, content } = findRoots(fromHtml(html));
  if (!content) return null;
  const blocks = [], tops = [];

  const walk = (node, owner, top) => {
    if (skipped(node)) return;
    let block = owner;
    if (BLOCK_TAGS.has(node.tagName) || (!owner && hasLooseContent(node))) {
      block = { id: blocks.length, tag: node.tagName, node, top, texts: [], pieces: [], links: [], images: [], formats: [] };
      blocks.push(block);
    }
    if (owner && BREAK_TAGS.has(node.tagName)) owner.pieces.push(' ');
    if (block && block === owner) {
      if (node.tagName === 'a') block.links.push({ href: String(node.properties.href ?? ''), text: normalize(ownText(node)) });
      if (FORMAT_TAGS.has(node.tagName)) block.formats.push(`${node.tagName}:${normalize(ownText(node))}`);
    }
    for (const child of node.children) {
      if (child.type === 'text') {
        if (block) {
          block.pieces.push({ node: block.texts.length });
          block.texts.push(child.value);
        }
      } else if (child.type === 'element') {
        if (child.tagName === 'img' && block) {
          block.images.push(String(child.properties.src ?? ''));
          block.pieces.push(' ');
        } else walk(child, block, top);
      }
    }
    if (owner && BREAK_TAGS.has(node.tagName)) owner.pieces.push(' ');
  };

  if (title) { tops.push(title); walk(title, null, 0); }
  for (const child of content.children) {
    if (child.type !== 'element') continue;
    tops.push(child);
    walk(child, null, tops.length - 1);
  }

  for (const block of blocks) {
    // `text` is the block's text with separators where markup implies a word
    // break; `segments` map it back to the original text nodes.
    let text = '';
    block.segments = [];
    for (const piece of block.pieces) {
      if (typeof piece === 'string') { text += piece; continue; }
      const value = block.texts[piece.node];
      block.segments.push({ node: piece.node, start: text.length, end: text.length + value.length });
      text += value;
    }
    block.text = text;
    block.plain = normalize(text);
    // Code keeps its spacing, so an indentation-only edit still counts.
    block.key = [block.tag, block.tag === 'pre' ? block.text : block.plain,
      JSON.stringify(block.links.map(link => [link.href, link.text])),
      block.images.join(' '), block.formats.join('\u0002')].join('\u0001');
    delete block.pieces;
  }
  return { blocks, tops, content, title: title ? normalize(ownText(title)) : '' };
}

function similarity(a, b) {
  const counts = new Map(), own = words(a), other = words(b);
  for (const word of own) counts.set(word.text, (counts.get(word.text) ?? 0) + 1);
  let shared = 0;
  for (const word of other) {
    const left = counts.get(word.text);
    if (left) { shared++; counts.set(word.text, left - 1); }
  }
  return own.length + other.length ? (2 * shared) / (own.length + other.length) : 1;
}

function locate(block, position, edge) {
  // `edge` picks the side of a word boundary: 'start' keeps a position at the
  // start of the next text node, 'end' at the end of the previous one.
  const { segments } = block;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (edge === 'start' ? position >= segment.start && position < segment.end
      : position > segment.start && position <= segment.end) return [segment.node, position - segment.start];
  }
  const last = segments.findLast(segment => segment.end <= position) ?? segments[0];
  return last ? [last.node, last.end - last.start] : null;
}

// Word-level differences in a changed block, expressed against the new
// block's text nodes: ranges to mark as inserted, and removed words to show
// at a position.
export function wordDiff(before, after) {
  const old = words(before.text), next = words(after.text);
  const inserted = [], removed = [];
  let o = 0, n = 0;
  for (const part of diffArrays(old.map(word => word.text), next.map(word => word.text))) {
    if (part.removed) {
      const text = normalize(before.text.slice(old[o].start, old[o + part.count - 1].end));
      const at = n < next.length ? locate(after, next[n].start, 'start')
        : next.length ? locate(after, next[n - 1].end, 'end') : null;
      if (at) removed.push([...at, text]);
      o += part.count;
    } else if (part.added) {
      const start = next[n].start, end = next[n + part.count - 1].end;
      for (const segment of after.segments) {
        const from = Math.max(start, segment.start), to = Math.min(end, segment.end);
        if (from < to) inserted.push([segment.node, from - segment.start, to - segment.start]);
      }
      n += part.count;
    } else { o += part.count; n += part.count; }
  }
  return { inserted, removed };
}

function notes(before, after) {
  const result = [];
  // Match links by their text; a link whose text changed shows in the word marks.
  const links = [];
  const old = [...before.links];
  for (const link of after.links) {
    const same = old.findIndex(other => other.text === link.text && other.href === link.href);
    if (same >= 0) { old.splice(same, 1); continue; }
    const renamed = old.findIndex(other => other.text === link.text);
    if (renamed >= 0) links.push({ text: link.text, from: old.splice(renamed, 1)[0].href, to: link.href });
    else if (!old.some(other => other.href === link.href)) links.push({ text: link.text, from: null, to: link.href });
  }
  for (const link of old) {
    if (!after.links.some(other => other.href === link.href)) links.push({ text: link.text, from: link.href, to: null });
  }
  if (links.length) result.push({ type: 'links', links: links.slice(0, 5) });
  // Same words and destinations, but the link now covers different words.
  const linked = block => block.links.map(link => link.text);
  if (!links.length && before.plain === after.plain && linked(before).join('\u0001') !== linked(after).join('\u0001')) {
    result.push({ type: 'linked', from: linked(before), to: linked(after) });
  }
  if (before.images.join() !== after.images.join()) result.push({ type: 'image' });
  if (before.plain === after.plain && before.formats.join() !== after.formats.join()) result.push({ type: 'format' });
  if (before.tag === 'pre' && before.plain === after.plain && before.text !== after.text) result.push({ type: 'spacing' });
  return result;
}

const pairable = (a, b) => a.tag === b.tag || (/^h[2-6]$/.test(a.tag) && /^h[2-6]$/.test(b.tag));

// Pairs removed and added blocks in one run of changes when they are the same
// kind of block and share enough words, so an edited paragraph reads as
// changed rather than as one paragraph removed and another added.
function pairRun(removed, added, base, head) {
  const items = [];
  let a = 0;
  for (const b of removed) {
    const only = removed.length === 1 && added.length === 1;
    // The most similar later block, so a paragraph split in two pairs with
    // the half that kept most of its words.
    let match = -1, best = 0;
    for (let j = a; j < added.length; j++) {
      const left = base[b], right = head[added[j]];
      if (!pairable(left, right)) continue;
      const score = only ? 1 : similarity(left.plain, right.plain);
      if (score >= 0.3 && score > best) { match = j; best = score; }
    }
    if (match < 0) { items.push({ kind: 'removed', base: b }); continue; }
    for (; a < match; a++) items.push({ kind: 'added', head: added[a] });
    items.push({ kind: 'changed', base: b, head: added[match] });
    a = match + 1;
  }
  for (; a < added.length; a++) items.push({ kind: 'added', head: added[a] });
  // Within each stretch between changed blocks, list removals first.
  const ordered = [];
  let pending = [];
  for (const item of items) {
    if (item.kind === 'changed') { ordered.push(...pending.filter(i => i.kind === 'removed'), ...pending.filter(i => i.kind === 'added'), item); pending = []; }
    else pending.push(item);
  }
  ordered.push(...pending.filter(i => i.kind === 'removed'), ...pending.filter(i => i.kind === 'added'));
  return ordered;
}

// Where to add an attribute to a block's start tag, or null when the parser
// created the element without a tag in the source.
function attributeOffset(html, block) {
  const at = block.node.position?.start.offset;
  if (at === undefined) return null;
  return html.slice(at, at + 1 + block.tag.length).toLowerCase() === `<${block.tag}` ? at + 1 + block.tag.length : null;
}

const outer = (html, node) => node.position?.end ? html.slice(node.position.start.offset, node.position.end.offset) : '';

// Adds `data-sbs` block numbers to a top-level element's HTML so the side-by-
// side view can mark the blocks that changed.
function sliceTop(html, top, blocks) {
  const start = top.position?.start.offset, end = top.position?.end?.offset;
  if (start === undefined || end === undefined) return '';
  let slice = html.slice(start, end);
  const inside = blocks.map(block => ({ id: block.id, at: attributeOffset(html, block) }))
    .filter(({ at }) => at !== null && at > start && at < end).sort((x, y) => y.at - x.at);
  for (const { id, at } of inside) slice = `${slice.slice(0, at - start)} data-sbs="${id}"${slice.slice(at - start)}`;
  return slice;
}

// Compares one page's two renders. Either side may be missing for an added or
// removed page. Returns null when nothing a reader can see has changed.
export function diffPage(baseHtml, headHtml) {
  const base = baseHtml ? extractBlocks(baseHtml) : null;
  const head = headHtml ? extractBlocks(headHtml) : null;
  if (!head) return base ? { status: 'removed', title: base.title, hunks: [] } : null;
  const visible = page => page ? page.blocks.filter(block => block.plain || block.images.length) : [];
  const left = visible(base), right = visible(head);

  if (!base) {
    const items = right.map(block => ({ kind: 'added', head: block.id }));
    return { status: 'added', title: head.title, head, hunks: items.length ? [{ items, groups: [], sbs: null }] : [] };
  }

  const ops = [];
  let b = 0, h = 0;
  for (const part of diffArrays(left.map(block => block.key), right.map(block => block.key))) {
    for (let i = 0; i < part.count; i++) {
      if (part.removed) ops.push({ kind: 'removed', base: left[b++].id });
      else if (part.added) ops.push({ kind: 'added', head: right[h++].id });
      else ops.push({ kind: 'same', base: left[b++].id, head: right[h++].id });
    }
  }
  if (ops.every(op => op.kind === 'same')) return null;

  const sameHeadToBase = new Map(ops.filter(op => op.kind === 'same').map(op => [op.head, op.base]));
  const sameBaseToHead = new Map(ops.filter(op => op.kind === 'same').map(op => [op.base, op.head]));
  const hunks = [];
  for (let i = 0; i < ops.length;) {
    if (ops[i].kind === 'same') { i++; continue; }
    let j = i;
    while (j < ops.length && ops[j].kind !== 'same') j++;
    const run = ops.slice(i, j);
    const items = pairRun(run.filter(op => op.kind === 'removed').map(op => op.base),
      run.filter(op => op.kind === 'added').map(op => op.head), base.blocks, head.blocks);
    const after = ops[j]?.head, before = ops.slice(0, i).findLast(op => op.head !== undefined)?.head;

    // Removed blocks are shown as placeholders next to the nearest block
    // still on the page: the next one in this change, then the next unchanged
    // block, then the previous one.
    const groups = [];
    for (let k = 0; k < items.length; k++) {
      if (items[k].kind !== 'removed') continue;
      const group = { items: [] };
      while (k < items.length && items[k].kind === 'removed') group.items.push(k++);
      const next = items.slice(k).find(item => item.head !== undefined)?.head ?? after;
      const previous = items.slice(0, group.items[0]).findLast(item => item.head !== undefined)?.head ?? before;
      group.anchor = next !== undefined ? { head: next, where: 'before' }
        : previous !== undefined ? { head: previous, where: 'after' } : null;
      groups.push(group);
      k--;
    }

    // Side by side shows whole top-level elements (the full list or table)
    // from both renders, including unchanged context in the same element.
    const baseTops = new Set(), headTops = new Set();
    for (const item of items) {
      if (item.base !== undefined) baseTops.add(base.blocks[item.base].top);
      if (item.head !== undefined) headTops.add(head.blocks[item.head].top);
    }
    for (const top of [...headTops]) for (const block of head.blocks) {
      if (block.top === top && sameHeadToBase.has(block.id)) baseTops.add(base.blocks[sameHeadToBase.get(block.id)].top);
    }
    for (const top of [...baseTops]) for (const block of base.blocks) {
      if (block.top === top && sameBaseToHead.has(block.id)) headTops.add(head.blocks[sameBaseToHead.get(block.id)].top);
    }

    let rewrite = items.some(item => item.kind === 'removed') && items.some(item => item.kind === 'added');
    for (const item of items) {
      if (item.kind !== 'changed') continue;
      const old = base.blocks[item.base], next = head.blocks[item.head];
      if (similarity(old.plain, next.plain) < 0.5) rewrite = true;
      Object.assign(item, wordDiff(old, next), { notes: notes(old, next) });
    }
    hunks.push({ items, groups, rewrite, sbs: { base: [...baseTops].sort((x, y) => x - y), head: [...headTops].sort((x, y) => x - y) } });
    i = j;
  }
  return { status: 'changed', title: head.title, base, head, hunks };
}

// The JSON a changed page carries for the browser script.
// The heading a block sits under, so identical edits in different sections
// get different signatures.
function section(blocks, id) {
  for (let i = id; i >= 0; i--) if (/^h[1-6]$/.test(blocks[i].tag)) return blocks[i].plain;
  return '';
}

function pageData(path, diff, baseHtml, headHtml) {
  const tops = { base: {}, head: {} };
  const occurrences = new Map();
  const hunks = diff.hunks.map(hunk => {
    const items = hunk.items.map(item => {
      const block = item.head !== undefined ? diff.head.blocks[item.head] : diff.base.blocks[item.base];
      const entry = { kind: item.kind, label: LABELS[block.tag] ?? 'block' };
      if (item.head !== undefined) entry.head = item.head;
      if (item.base !== undefined) entry.base = item.base;
      if (item.kind === 'removed') {
        Object.assign(entry, { tag: block.tag, html: outer(baseHtml, block.node), text: block.plain.slice(0, 120) });
      }
      if (item.kind === 'changed') {
        Object.assign(entry, { inserted: item.inserted, removed: item.removed, notes: item.notes,
          nodes: block.texts.map(text => text.length) });
      }
      return entry;
    });
    if (hunk.sbs) {
      for (const top of hunk.sbs.base) tops.base[top] ??= sliceTop(baseHtml, diff.base.tops[top], diff.base.blocks);
      for (const top of hunk.sbs.head) tops.head[top] ??= sliceTop(headHtml, diff.head.tops[top], diff.head.blocks);
    }
    const signature = JSON.stringify(hunk.items.map(item => [item.kind,
      item.base !== undefined ? diff.base.blocks[item.base].key : '',
      item.head !== undefined ? diff.head.blocks[item.head].key : '']));
    const first = hunk.items.find(item => item.head !== undefined);
    const context = first ? section(diff.head.blocks, first.head) : section(diff.base.blocks, hunk.items[0].base);
    // Identical edits under the same heading are told apart by their order.
    const key = `${path}\n${context}\n${signature}`;
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);
    return { sig: hash(`${key}\n${occurrence}`), rewrite: Boolean(hunk.rewrite), items, groups: hunk.groups, sbs: hunk.sbs };
  });
  return { path, status: diff.status, title: diff.title, hunks, tops };
}

async function htmlFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await htmlFiles(join(directory, entry.name), path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

export const pagePath = (file, base = '/') =>
  `${base.replace(/\/$/, '')}/${file.replace(/\.html$/, '').replace(/(^|\/)index$/, '')}`.replace(/(.)\/$/, '$1');

// Compares every docs page in two builds. `order` lists slugs in reading
// order; pages outside it follow alphabetically.
export async function collectChanges(baseDir, headDir, { base = '/', order = [] } = {}) {
  const read = async (directory, file) => {
    const path = join(directory, file);
    if (!existsSync(path)) return null;
    const html = await readFile(path, 'utf8');
    return html.includes('sl-markdown-content') ? html : null;
  };
  const files = [...new Set([...await htmlFiles(baseDir), ...await htmlFiles(headDir)])];
  const pages = [];
  for (const file of files) {
    const [before, after] = [await read(baseDir, file), await read(headDir, file)];
    if (!before && !after) continue;
    const diff = diffPage(before, after);
    if (!diff) continue;
    const path = pagePath(file, base);
    pages.push({ file, path, diff, data: diff.status === 'removed' ? null : pageData(path, diff, before, after) });
  }
  const rank = new Map(order.map((slug, index) => [pagePath(slug, base), index]));
  pages.sort((x, y) => (rank.get(x.path) ?? Infinity) - (rank.get(y.path) ?? Infinity) || x.path.localeCompare(y.path));
  return pages;
}

const json = value => JSON.stringify(value).replace(/</g, '\\u003c');

// Adds the overlay to one built page: block numbers on a changed page's
// blocks, then the change data and the script.
export function injectChanges(html, { manifest, page = null, base = '/' }) {
  if (!html.includes('sl-markdown-content') || html.includes('id="silo-changes-manifest"')) return html;
  if (page) {
    const { blocks } = extractBlocks(html);
    const starts = blocks.map(block => ({ id: block.id, at: attributeOffset(html, block) }))
      .filter(({ at }) => at !== null).sort((x, y) => y.at - x.at);
    for (const { at, id } of starts) html = `${html.slice(0, at)} data-silo-block="${id}"${html.slice(at)}`;
  }
  const prefix = base.replace(/\/$/, '');
  const data = `<script type="application/json" id="silo-changes-manifest">${json(manifest)}</script>` +
    (page ? `<script type="application/json" id="silo-changes-page">${json(page)}</script>` : '') +
    `<script src="${prefix}/_changes/overlay.js" defer></script>`;
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${prefix}/_changes/overlay.css"></head>`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/i, `${data}</body>`);
}

// Files a removed or side-by-side block refers to that only exist in the
// base build, such as an image the pull request replaced.
async function copyBaseAssets(pages, baseDir, headDir) {
  const html = pages.flatMap(page => page.data ? [
    ...Object.values(page.data.tops.base),
    ...page.data.hunks.flatMap(hunk => hunk.items.map(item => item.html ?? '')),
  ] : []).join('\n');
  const paths = new Set();
  for (const [, value] of html.matchAll(/\s(?:src|href|srcset)="([^"]+)"/g)) {
    for (const candidate of value.split(',')) {
      const path = candidate.trim().split(/\s+/)[0];
      if (path.startsWith('/') && !path.startsWith('//')) paths.add(decodeURI(path.split(/[?#]/)[0]));
    }
  }
  for (const path of paths) {
    const from = join(baseDir, path), to = join(headDir, path);
    if (relative(baseDir, from).startsWith('..') || relative(headDir, to).startsWith('..')) continue;
    if (existsSync(to) || !existsSync(from) || path.endsWith('.html')) continue;
    await mkdir(dirname(to), { recursive: true });
    await copyFile(from, to);
  }
}

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// The commit to compare with. GitHub builds a pull request from its merge ref,
// a merge commit whose first parent is the target branch, so the comparison
// shows exactly what merging would change. Elsewhere, including a local branch
// that merged main, compare with where the branch left origin/main.
export function changesBase(root, env = process.env) {
  if (env.PREVIEW_CHANGES_BASE) {
    return { ref: git(root, ['rev-parse', '--verify', `${env.PREVIEW_CHANGES_BASE}^{commit}`]), label: env.PREVIEW_CHANGES_BASE };
  }
  const commits = git(root, ['rev-list', '--parents', '-n', '1', 'HEAD']).split(/\s+/);
  if (/^refs\/pull\/\d+\/merge$/.test(env.GITHUB_REF ?? '') && commits.length === 3) return { ref: commits[1], label: env.GITHUB_BASE_REF || 'main' };
  for (const upstream of ['origin/main', 'main']) {
    try { return { ref: git(root, ['merge-base', 'HEAD', upstream]), label: upstream }; } catch {}
  }
  throw new Error('found no base commit to compare with');
}

// Builds `ref` in a temporary worktree and returns the output directory.
// Astro can't build components or images from outside its project folder, so
// the worktree gets its own dependencies; Bun installs them from its cache.
async function buildBase(root, ref) {
  const work = await mkdtemp(join(tmpdir(), 'silo-changes-'));
  const tree = join(work, 'site');
  const cleanup = async () => {
    try { git(root, ['worktree', 'remove', '--force', tree]); } catch {}
    await rm(work, { recursive: true, force: true });
    try { git(root, ['worktree', 'prune']); } catch {}
  };
  try {
    git(root, ['worktree', 'add', '--detach', '--quiet', tree, ref]);
    const run = (command, args) => {
      const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('PUBLIC_PREVIEW_')));
      const result = spawnSync(command, args, { cwd: tree, env: { ...env, SILO_PREVIEW_CHANGES_BASE_BUILD: '1' },
        encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 10 * 60 * 1000 });
      if (result.status !== 0) {
        const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(-15).join('\n');
        throw new Error(`${command} ${args[0]} failed${result.error ? `: ${result.error.message}` : ''}\n${output}`);
      }
    };
    run('bun', ['install', '--frozen-lockfile']);
    run(process.execPath, [join(tree, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build']);
    return { dir: join(tree, 'dist'), cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

// Builds the manifest every docs page carries: changed pages in reading
// order with one signature per change.
export function changesManifest(pages, { info, compare, error = null }) {
  return {
    pr: info.number, sha: info.sha || 'local', compare, error, skip: SKIP_SELECTOR,
    pages: pages.map(({ path, diff, data }) => ({
      path, title: diff.title, status: diff.status,
      hunks: data ? data.hunks.map(hunk => ({ sig: hunk.sig })) : [],
    })),
  };
}

export async function decorateChanges(headDir, pages, manifest, base = '/') {
  const target = join(headDir, '_changes');
  await mkdir(target, { recursive: true });
  const here = dirname(fileURLToPath(import.meta.url));
  await copyFile(join(here, 'preview-changes-overlay.js'), join(target, 'overlay.js'));
  await copyFile(join(here, 'preview-changes-overlay.css'), join(target, 'overlay.css'));
  await writeFile(join(target, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  // Pull requests that don't change the docs get no overlay.
  if (!manifest.pages.length && !manifest.error) return 0;
  const byFile = new Map(pages.map(page => [page.file, page.data]));
  let count = 0;
  for (const file of await htmlFiles(headDir)) {
    const path = join(headDir, file);
    const html = await readFile(path, 'utf8');
    const result = injectChanges(html, { manifest, page: byFile.get(file) ?? null, base });
    if (result !== html) { await writeFile(path, result); count++; }
  }
  return count;
}

export default function previewChanges({ order = [] } = {}) {
  let root = process.cwd(), base = '/';
  return {
    name: 'silo-preview-changes',
    hooks: {
      'astro:config:done': ({ config }) => { root = fileURLToPath(config.root); base = config.base; },
      'astro:build:done': async ({ dir, logger }) => {
        const info = previewInfo(process.env);
        if (!info || process.env.PREVIEW_CHANGES === '0' || process.env.SILO_PREVIEW_CHANGES_BASE_BUILD) return;
        const headDir = fileURLToPath(dir);
        let pages = [], compare = null, error = null;
        try {
          const target = changesBase(root);
          compare = { label: target.label, sha: target.ref.slice(0, 7) };
          logger.info(`Building ${target.label} at ${compare.sha} to compare docs changes`);
          const build = await buildBase(root, target.ref);
          try {
            pages = await collectChanges(build.dir, headDir, { base, order });
            await copyBaseAssets(pages, build.dir, headDir);
          } finally {
            await build.cleanup();
          }
        } catch (cause) {
          error = `Could not compare with the base commit: ${cause.message.split('\n')[0]}`;
          logger.warn(`${error}\n${cause.message}`);
        }
        const manifest = changesManifest(pages, { info, compare, error });
        const count = await decorateChanges(headDir, pages, manifest, base);
        const changes = manifest.pages.reduce((sum, page) => sum + page.hunks.length, 0);
        logger.info(`Docs changes: ${changes} on ${manifest.pages.length} page(s); overlay added to ${count} pages`);
      },
    },
  };
}
