// Runs only from trusted default-branch tooling. The manifest comes from the
// pull request's build artifact, so it is untrusted: only validated paths,
// counts, statuses and plain-text titles reach the comment, and links always
// point at this pull request's preview address.
const MAX_BYTES = 512 * 1024;
const MAX_ROWS = 40;
const PATH = /^\/docs(?:\/[a-z0-9][a-z0-9-]*){0,4}$/;
const STATUSES = new Set(['changed', 'added', 'removed']);

const plain = (value, fallback) => {
  const text = typeof value === 'string'
    ? value.normalize('NFKC').replace(/[^\p{L}\p{N} .,:;!?()'’&/+-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 100)
    : '';
  return text || fallback;
};

module.exports = function summarize(manifestText, { origin, production = 'https://siloserver.org' }) {
  if (typeof manifestText !== 'string' || !manifestText || manifestText.length > MAX_BYTES) return '';
  let manifest;
  try { manifest = JSON.parse(manifestText); } catch { return ''; }
  if (!manifest || !Array.isArray(manifest.pages)) return '';
  if (manifest.error) return '**Docs changes:** the preview could not compare these docs with the base commit. See the build log.';

  const pages = [];
  let index = 0;
  for (const page of manifest.pages.slice(0, 500)) {
    if (!page || !PATH.test(page.path) || !STATUSES.has(page.status) || !Array.isArray(page.hunks)) return '';
    const count = page.status === 'removed' ? 0 : page.hunks.length;
    if (count > 9999) return '';
    pages.push({ path: page.path, status: page.status, title: plain(page.title, page.path), count, first: index + 1 });
    index += count;
  }
  if (!pages.length) return '';

  const total = index;
  const shown = pages.filter(page => page.status !== 'removed').length;
  const lines = [
    `**Docs changes:** ${total} ${total === 1 ? 'change' : 'changes'} on ${shown} ${shown === 1 ? 'page' : 'pages'}. ` +
      'Each link opens the first change on its page. Step through the rest with the changes box in the corner of the preview.',
    '',
    '| Page | Changes |',
    '| --- | --- |',
  ];
  for (const page of pages.slice(0, MAX_ROWS)) {
    if (page.status === 'removed') {
      // Titles always sit inside link text, where GitHub doesn't autolink them.
      lines.push(`| [${page.title}](${production}${page.path}) (removed; opens the published page) | 0 |`);
    } else {
      const label = page.status === 'added' ? `${page.title} (new page)` : page.title;
      lines.push(`| [${label}](${origin}${page.path}?change=${page.first}) | ${page.count} |`);
    }
  }
  if (pages.length > MAX_ROWS) lines.push('', `${pages.length - MAX_ROWS} more pages are listed in the preview's changes box.`);
  return lines.join('\n');
};
