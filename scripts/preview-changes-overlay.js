// Docs change overlay for pull request previews. scripts/preview-changes.mjs
// adds this file, the change data, and block numbers to preview builds only.
(() => {
  const read = id => {
    const element = document.getElementById(id);
    return element ? JSON.parse(element.textContent) : null;
  };
  const manifest = read('silo-changes-manifest');
  if (!manifest) return;
  const page = read('silo-changes-page');
  const root = document.documentElement;
  const content = document.querySelector('.sl-markdown-content');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const production = 'https://siloserver.org';

  // ---- Saved state: preferences and the changes seen on the last visit ----
  const storageKey = `silo-changes:${manifest.pr}`;
  let state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {} };
  const prefs = state.prefs = { on: true, collapsed: false, mode: 'inline', onlyNew: false, ...state.prefs };

  const signatures = manifest.pages.flatMap(entry => entry.hunks.map(hunk => hunk.sig));
  if (state.visit && state.visit.sha !== manifest.sha) state.previous = state.visit;
  state.visit = { sha: manifest.sha, sigs: signatures };
  save();
  const previous = state.previous && state.previous.sha !== manifest.sha ? state.previous : null;
  const seen = new Set(previous ? previous.sigs : []);

  const normalize = path => {
    try { path = decodeURI(path); } catch {}
    return path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/(.)\/+$/, '$1');
  };
  const here = normalize(location.pathname);
  const pageIndex = manifest.pages.findIndex(entry => normalize(entry.path) === here);
  const changes = [];
  manifest.pages.forEach((entry, index) => entry.hunks.forEach((hunk, hunkIndex) => changes.push({
    entry, pageIndex: index, hunkIndex, index: changes.length, isNew: !seen.has(hunk.sig),
  })));
  const newCount = changes.filter(change => change.isNew).length;
  if (!changes.length && !manifest.error && !manifest.pages.length) return;

  const element = (tag, attributes = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
      if (value === false || value == null) continue;
      if (name === 'class') node.className = value;
      else if (name.startsWith('on')) node.addEventListener(name.slice(2), value);
      else node.setAttribute(name, value === true ? '' : value);
    }
    node.append(...children.flat().filter(child => child != null && child !== false));
    return node;
  };
  const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
  const cleanHtml = (target, html) => {
    target.innerHTML = html;
    target.querySelectorAll('script').forEach(node => node.remove());
    target.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    return target;
  };

  // ---- Mark this page's changes ----
  const hunkElements = page ? page.hunks.map(() => []) : [];
  const blocks = new Map();
  document.querySelectorAll('[data-silo-block]').forEach(node => blocks.set(node.dataset.siloBlock, node));

  // The block's own text nodes, in the order the build recorded them.
  const ownText = block => {
    const nodes = [];
    const walk = parent => {
      for (let node = parent.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === Node.TEXT_NODE) nodes.push(node);
        else if (node.nodeType === Node.ELEMENT_NODE && !node.matches(manifest.skip) && !node.hasAttribute('data-silo-block')) walk(node);
      }
    };
    walk(block);
    return nodes;
  };

  const markWords = (block, item) => {
    const nodes = ownText(block);
    // If the page's markup no longer matches the build, keep the outline only.
    if (nodes.length !== item.nodes.length || nodes.some((node, i) => node.data.length !== item.nodes[i])) return;
    const edits = new Map();
    const edit = index => edits.get(index) || edits.set(index, { inserted: [], removed: [] }).get(index);
    for (const [node, start, end] of item.inserted) edit(node).inserted.push([start, end]);
    for (const [node, offset, text] of item.removed) edit(node).removed.push([offset, text]);
    edits.forEach(({ inserted, removed }, index) => {
      const node = nodes[index], text = node.data;
      const cuts = [...new Set([0, text.length, ...inserted.flat(), ...removed.map(([offset]) => offset)])].sort((a, b) => a - b);
      const fragment = document.createDocumentFragment();
      cuts.forEach((at, i) => {
        for (const [offset, words] of removed) {
          if (offset === at) fragment.append(element('del', { class: 'silo-del' }, words));
        }
        if (i === cuts.length - 1) return;
        const piece = text.slice(at, cuts[i + 1]);
        fragment.append(inserted.some(([start, end]) => start <= at && cuts[i + 1] <= end)
          ? element('ins', { class: 'silo-ins' }, piece) : piece);
      });
      node.replaceWith(fragment);
    });
  };

  // Starlight wraps headings with their anchor link; outline the wrapper so
  // the highlight is one box rather than one per line.
  const outlineTarget = node => node.parentElement && node.parentElement.classList.contains('sl-heading-wrapper')
    ? node.parentElement : node;

  // Removed list items, rows, and definitions need their container to render;
  // neighbors of the same kind share one.
  const definitions = ['<dl>', '</dl>'];
  const containers = { li: ['<ul>', '</ul>'], tr: ['<table><tbody>', '</tbody></table>'], dt: definitions, dd: definitions };
  const removedHtml = items => {
    let html = '', open = null;
    for (const item of items) {
      const container = containers[item.tag] || null;
      if (open && open !== container) html += open[1];
      if (container && open !== container) html += container[0];
      html += item.html;
      open = container;
    }
    return open ? html + open[1] : html;
  };

  // Removed blocks become a collapsed note next to where they were. The note
  // matches its neighbor's element type so lists and tables stay valid.
  const placeholder = (hunk, hunkIndex, group) => {
    const items = group.items.map(index => hunk.items[index]);
    let anchor = group.anchor ? blocks.get(String(group.anchor.head)) : null;
    if (anchor && anchor.parentElement.classList.contains('sl-heading-wrapper')) anchor = anchor.parentElement;
    const side = anchor ? group.anchor.where : 'end';
    const kind = anchor ? anchor.tagName : 'DIV';
    const note = element(kind === 'LI' ? 'li' : kind === 'TR' ? 'tr' : 'div', {
      class: 'silo-removed', 'data-silo-block': 'removed', 'data-silo-hunk': hunkIndex,
      'data-silo-kind': 'removed', 'data-pagefind-ignore': true,
    });
    const box = kind === 'TR' ? note.appendChild(element('td', { colspan: anchor.cells.length || 1 })) : note;
    const body = cleanHtml(element('div', { class: 'silo-removed-body', hidden: true }),
      removedHtml(items));
    const counts = {};
    for (const item of items) counts[item.label] = (counts[item.label] || 0) + 1;
    const label = `Removed ${Object.entries(counts).map(([name, count]) =>
      items.length === 1 ? name : plural(count, name)).join(', ')}`;
    const preview = items[0].text ? `: ${items[0].text.length > 90 ? `${items[0].text.slice(0, 90)}…` : items[0].text}` : '';
    const toggle = element('button', {
      type: 'button', class: 'silo-removed-toggle', 'aria-expanded': 'false',
      onclick: () => {
        const open = body.hidden;
        body.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.lastChild.textContent = open ? 'Hide' : 'Show';
      },
    }, element('span', { class: 'silo-removed-label' }, label, element('span', { class: 'silo-removed-preview' }, preview)),
    element('span', { class: 'silo-removed-action' }, 'Show'));
    box.append(toggle, body);
    if (!anchor) (content || document.body).append(note);
    else if (side === 'after') anchor.after(note);
    else anchor.before(note);
    return note;
  };

  if (page && content && normalize(page.path) === here) {
    page.hunks.forEach((hunk, hunkIndex) => {
      for (const item of hunk.items) {
        if (item.kind === 'removed') continue;
        const block = blocks.get(String(item.head));
        if (!block) continue;
        const target = outlineTarget(block);
        if (page.status !== 'added') {
          target.dataset.siloKind = item.kind;
          target.dataset.siloHunk = hunkIndex;
        }
        if (item.kind === 'changed') markWords(block, item);
        hunkElements[hunkIndex].push(target);
      }
    });
    // After word marks, so a note never lands inside a block being marked.
    page.hunks.forEach((hunk, hunkIndex) => {
      for (const group of hunk.groups) hunkElements[hunkIndex].push(placeholder(hunk, hunkIndex, group));
    });
    hunkElements.forEach(list => list.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (page.status === 'added') {
      content.classList.add('silo-page-added');
      hunkElements[0] = [content];
    }
  }
  const onThisPage = hunkElements.length > 0;

  // ---- Box ----
  const live = element('div', { class: 'silo-sr-only', 'aria-live': 'polite' });
  const toggle = element('input', { type: 'checkbox', role: 'switch', id: 'silo-changes-toggle', onchange: () => setOn(toggle.checked) });
  const previousButton = element('button', { type: 'button', class: 'silo-step', 'aria-label': 'Previous change', title: 'Previous change ([)', onclick: () => step(-1) }, '‹');
  const nextButton = element('button', { type: 'button', class: 'silo-step', 'aria-label': 'Next change', title: 'Next change (])', onclick: () => step(1) }, '›');
  const position = element('strong');
  const where = element('small');
  const pagesButton = element('button', {
    type: 'button', class: 'silo-position', 'aria-expanded': 'false', 'aria-controls': 'silo-changes-pages',
    title: 'Changed pages', onclick: () => showPages(pagesList.hidden),
  }, position, where);
  // On narrow screens the description is cut to two lines; a tap shows all of it.
  const detail = element('p', { class: 'silo-detail', onclick: () => detail.classList.toggle('is-open') });
  const inlineButton = element('button', { type: 'button', 'aria-pressed': 'true', onclick: () => setMode('inline') }, 'Inline');
  const sideButton = element('button', { type: 'button', 'aria-pressed': 'false', onclick: () => setMode('side') }, 'Side by side');
  const newToggle = element('input', { type: 'checkbox', onchange: () => { prefs.onlyNew = newToggle.checked; save(); render(); } });
  const pagesList = element('ul', { id: 'silo-changes-pages', class: 'silo-pages', hidden: true });
  const collapseButton = element('button', { type: 'button', class: 'silo-collapse', 'aria-label': 'Minimize', title: 'Minimize', onclick: () => setCollapsed(true) }, '–');
  const pill = element('button', { type: 'button', class: 'silo-pill', onclick: () => setCollapsed(false) });

  const panel = element('section', { class: 'silo-sbs', hidden: true, 'aria-label': 'Before and after', 'data-pagefind-ignore': true });

  const box = element('aside', { class: 'silo-box', 'aria-label': 'Changes in this pull request', 'data-pagefind-ignore': true },
    element('div', { class: 'silo-head' },
      element('label', { class: 'silo-switch', for: 'silo-changes-toggle', title: 'Show changes (c)' }, toggle, element('span', {}, 'Show changes')),
      collapseButton),
    manifest.error
      ? element('p', { class: 'silo-detail silo-error' }, manifest.error)
      : [
        element('div', { class: 'silo-nav' }, previousButton, pagesButton, nextButton),
        detail,
        element('div', { class: 'silo-modes', role: 'group', 'aria-label': 'Change view' }, inlineButton, sideButton),
        previous && element('label', { class: 'silo-new' }, newToggle,
          element('span', {}, `Only new since your last visit (${newCount})`)),
        element('div', { class: 'silo-legend', 'aria-hidden': 'true' },
          element('span', { class: 'is-added' }, 'Added'), element('span', { class: 'is-changed' }, 'Changed'),
          element('span', { class: 'is-removed' }, 'Removed')),
        pagesList,
      ],
    live);
  const shell = element('div', { class: 'silo-changes', 'data-pagefind-ignore': true }, panel, box, pill);
  document.body.append(shell);

  // ---- Navigation ----
  let current = -1;
  // The filter only applies while there is something new to show.
  const filtering = () => Boolean(prefs.onlyNew && previous && newCount);
  const list = () => filtering() ? changes.filter(change => change.isNew) : changes;
  const urlFor = change => {
    const url = new URL(change.entry.path, location.origin);
    url.searchParams.set('change', String(change.index + 1));
    return url.href;
  };

  const step = delta => {
    const options = list();
    if (!options.length) return;
    let target;
    const at = options.findIndex(change => change.index === current);
    if (at >= 0) target = options[at + delta];
    else if (delta > 0) target = options.find(change => change.pageIndex >= Math.max(pageIndex, 0)) ?? options[0];
    else target = [...options].reverse().find(change => change.pageIndex < pageIndex || (change.pageIndex === pageIndex && pageIndex >= 0)) ?? options[options.length - 1];
    if (target) select(target, true);
  };

  const select = (change, userAction) => {
    if (change.pageIndex !== pageIndex || !onThisPage) { location.href = urlFor(change); return; }
    current = change.index;
    showPages(false);
    if (!prefs.on) setOn(true);
    document.querySelectorAll('.silo-current').forEach(node => node.classList.remove('silo-current'));
    const targets = hunkElements[change.hunkIndex] || [];
    for (const node of targets) {
      node.classList.add('silo-current');
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    }
    const url = new URL(location.href);
    url.searchParams.set('change', String(change.index + 1));
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    render();
    showSideBySide();
    reveal(targets, userAction);
    const options = list();
    live.textContent = `Change ${options.indexOf(change) + 1} of ${options.length}. ${describe(change.hunkIndex)}`;
  };

  // Brings a change into the part of the window not covered by the header,
  // the side-by-side panel, or (on narrow screens) the box.
  const reveal = (targets, smooth) => {
    const rects = targets.map(node => node.getBoundingClientRect()).filter(rect => rect.width || rect.height);
    if (!rects.length) return;
    const top = Math.min(...rects.map(rect => rect.top)), bottom = Math.max(...rects.map(rect => rect.bottom));
    const inset = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 8;
    let limit = innerHeight - 16;
    const area = (content || document.body).getBoundingClientRect();
    for (const node of [panel, box, pill]) {
      if (node.hidden) continue;
      const rect = node.getBoundingClientRect();
      if (rect.left < area.right - 40 && rect.right > area.left) limit = Math.min(limit, rect.top - 16);
    }
    const space = Math.max(limit - inset, 120), height = bottom - top;
    const offset = height > space ? top - inset : top - inset - (space - height) / 2;
    scrollBy({ top: offset, behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto' });
  };

  const describe = hunkIndex => {
    if (!page || !page.hunks[hunkIndex]) return '';
    if (page.status === 'added') return 'New page.';
    const hunk = page.hunks[hunkIndex];
    const counts = {};
    for (const item of hunk.items) {
      const key = `${item.kind} ${item.label}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    const parts = Object.entries(counts).map(([key, count]) => {
      const [kind, ...label] = key.split(' ');
      return `${kind} ${count === 1 ? label.join(' ') : plural(count, label.join(' '))}`;
    });
    if (parts.length) parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1);
    const notes = [];
    for (const item of hunk.items) {
      for (const note of item.notes || []) {
        if (note.type === 'links') {
          for (const link of note.links) {
            notes.push(link.from && link.to ? `Link “${link.text}” now goes to ${link.to} (was ${link.from})`
              : link.to ? `Added link “${link.text}” to ${link.to}` : `Removed link “${link.text}” to ${link.from}`);
          }
        } else if (note.type === 'image') notes.push('Image changed');
        else if (note.type === 'format') notes.push('Formatting changed');
        else if (note.type === 'linked') {
          const quote = texts => texts.length ? texts.map(text => `“${text}”`).join(', ') : 'nothing';
          notes.push(`Linked words changed to ${quote(note.to)} (was ${quote(note.from)})`);
        } else if (note.type === 'spacing') notes.push('Indentation or spacing changed: Side by side shows it');
      }
    }
    if (hunk.rewrite && prefs.mode !== 'side') notes.push('Mostly rewritten: Side by side may be easier to read');
    return [parts.join(', '), ...notes].filter(Boolean).join('. ') + '.';
  };

  // ---- Side by side ----
  const showSideBySide = () => {
    const change = changes[current];
    const hunk = change && change.pageIndex === pageIndex && page ? page.hunks[change.hunkIndex] : null;
    const available = Boolean(hunk && hunk.sbs && hunk.sbs.base.length);
    sideButton.disabled = !available && !!hunk;
    sideButton.title = hunk && !available ? 'New content: nothing to compare' : '';
    if (!prefs.on || prefs.mode !== 'side' || !available) { panel.hidden = true; return; }
    const column = (title, html, kinds, side) => {
      const body = cleanHtml(element('div', { class: 'silo-sbs-body sl-markdown-content' }), html);
      for (const item of hunk.items) {
        const id = item[side];
        if (id === undefined || !kinds.includes(item.kind)) continue;
        body.querySelectorAll(`[data-sbs="${id}"]`).forEach(node => outlineTarget(node).setAttribute('data-silo-kind', item.kind));
      }
      return element('div', { class: 'silo-sbs-column' }, element('h2', {}, title), body);
    };
    panel.replaceChildren(
      element('div', { class: 'silo-sbs-head' },
        element('strong', {}, `Change ${list().indexOf(change) + 1}`),
        element('button', { type: 'button', class: 'silo-sbs-close', onclick: () => setMode('inline') }, 'Close')),
      element('div', { class: 'silo-sbs-columns' },
        column(`Before (${manifest.compare ? manifest.compare.label : 'base'})`, hunk.sbs.base.map(top => page.tops.base[top]).join(''), ['removed', 'changed'], 'base'),
        column('After (this pull request)', hunk.sbs.head.map(top => page.tops.head[top]).join(''), ['added', 'changed'], 'head')));
    panel.hidden = false;
  };

  // ---- Pages list ----
  const showPages = open => {
    pagesList.hidden = !open;
    pagesButton.setAttribute('aria-expanded', String(open));
    if (!open) return;
    const options = list();
    pagesList.replaceChildren(...manifest.pages.map((entry, index) => {
      const own = options.filter(change => change.pageIndex === index);
      const fresh = changes.filter(change => change.pageIndex === index && change.isNew).length;
      const status = entry.status === 'added' ? 'new page' : entry.status === 'removed' ? 'removed' : plural(entry.hunks.length, 'change');
      const href = entry.status === 'removed' ? production + entry.path : own.length ? urlFor(own[0]) : entry.path;
      return element('li', { class: index === pageIndex ? 'is-current' : '' },
        element('a', { href, 'aria-current': index === pageIndex ? 'page' : false }, entry.title || entry.path),
        element('span', {}, status, previous && fresh && entry.status !== 'removed' ? ` · ${fresh} new` : ''));
    }));
  };

  // ---- State changes ----
  function setOn(on) {
    prefs.on = on;
    save();
    root.classList.toggle('silo-changes-on', on);
    render();
    showSideBySide();
  }
  function setMode(mode) {
    prefs.mode = mode;
    save();
    render();
    showSideBySide();
    if (current >= 0) reveal(hunkElements[changes[current].hunkIndex] || [], true);
  }
  function setCollapsed(collapsed) {
    prefs.collapsed = collapsed;
    save();
    render();
    (collapsed ? pill : collapseButton).focus();
  }

  function render() {
    root.classList.toggle('silo-changes-on', prefs.on);
    toggle.checked = prefs.on;
    box.hidden = prefs.collapsed;
    pill.hidden = !prefs.collapsed;
    const options = list();
    pill.textContent = manifest.error ? 'Changes unavailable' : plural(options.length, filtering() ? 'new change' : 'change');
    if (manifest.error) return;
    const at = options.findIndex(change => change.index === current);
    position.textContent = !options.length ? 'No changes to show'
      : at >= 0 ? `Change ${at + 1} of ${options.length}` : plural(options.length, filtering() ? 'new change' : 'change');
    const pages = [...new Set(options.map(change => change.pageIndex))];
    const entry = manifest.pages[pageIndex];
    where.textContent = pageIndex < 0 || !entry ? `On ${plural(pages.length, 'page')} · none here`
      : entry.status === 'removed' ? 'This page is removed'
      : pages.includes(pageIndex) ? `Page ${pages.indexOf(pageIndex) + 1} of ${pages.length} · ${entry.title}`
      : `On ${plural(pages.length, 'page')} · none here`;
    previousButton.disabled = !options.length || at === 0;
    nextButton.disabled = !options.length || at === options.length - 1;
    const kind = filtering() ? 'new change' : 'change';
    detail.textContent = at >= 0 ? describe(options[at].hunkIndex)
      : !options.length ? ''
      : pages.includes(pageIndex) ? `Press › or ] to go to the first ${kind} on this page.`
      : `Press › or ] to go to the first ${kind}.`;
    inlineButton.setAttribute('aria-pressed', String(prefs.mode !== 'side'));
    sideButton.setAttribute('aria-pressed', String(prefs.mode === 'side'));
    root.classList.toggle('silo-changes-only-new', filtering());
    newToggle.disabled = !newCount;
    newToggle.checked = filtering();
    document.querySelectorAll('[data-silo-hunk]').forEach(node => {
      const change = changes.find(item => item.pageIndex === pageIndex && item.hunkIndex === Number(node.dataset.siloHunk));
      node.classList.toggle('silo-seen', Boolean(change && !change.isNew));
    });
    if (!pagesList.hidden) showPages(true);
  }

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (document.querySelector('dialog[open]')) return;
    if (event.key === ']') step(1);
    else if (event.key === '[') step(-1);
    else if (event.key === 'c') setOn(!prefs.on);
    else if (event.key === 'Escape' && !pagesList.hidden) { showPages(false); pagesButton.focus(); }
    else if (event.key === 'Escape' && !panel.hidden) setMode('inline');
    else return;
    event.preventDefault();
  });
  document.addEventListener('click', event => {
    if (!pagesList.hidden && !box.contains(event.target)) showPages(false);
  });
  window.addEventListener('resize', () => { if (current >= 0 && !panel.hidden) showSideBySide(); });

  render();
  showSideBySide();

  // A link to a change (from the PR comment or a shared URL) opens it.
  const requested = Number(new URLSearchParams(location.search).get('change'));
  const target = changes[requested - 1];
  if (target && target.pageIndex === pageIndex && onThisPage) {
    const go = () => select(target, false);
    if (document.readyState === 'complete') requestAnimationFrame(go);
    else addEventListener('load', () => requestAnimationFrame(go), { once: true });
  }
})();
