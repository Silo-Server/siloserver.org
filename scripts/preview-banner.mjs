import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function previewInfo(env) {
  const number = env.PUBLIC_PREVIEW_PR_NUMBER;
  const url = env.PUBLIC_PREVIEW_PR_URL;
  if (!number && !url) return null;
  if (!/^[1-9]\d*$/.test(number ?? '') ||
      url !== `https://github.com/Silo-Server/siloserver.org/pull/${number}`) {
    throw new Error('Invalid or incomplete preview PR metadata');
  }
  const sha = env.PUBLIC_PREVIEW_SHA ?? '';
  if (sha && !/^[a-f0-9]{7,40}$/i.test(sha)) throw new Error('Invalid preview SHA');
  return { number, url, sha: sha.slice(0, 7) };
}

const style = `<style id="silo-preview-style">
:root { --preview-height: 3.5rem; }
body { padding-top: var(--preview-height) !important; }
#silo-preview-banner { position: fixed; inset: 0 0 auto; z-index: 10000; box-sizing: border-box; margin: 0; padding: .5rem 1rem; background: #ffb454; color: #201609; text-align: center; font: 500 14px/1.5 ui-monospace, monospace; overflow-wrap: anywhere; }
#silo-preview-banner a { color: inherit; text-decoration: underline; }
#silo-preview-banner a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
#silo-preview-banner code { font: inherit; background: none; color: inherit; padding: 0; }
body > a:focus { z-index: 10001 !important; }
.statusbar { top: var(--preview-height) !important; }
.filterbar { top: calc(52px + var(--preview-height)) !important; }
.page > .header { inset-block-start: var(--preview-height) !important; }
.sidebar-pane { inset-block-start: calc(var(--sl-nav-height) + var(--preview-height)) !important; }
starlight-menu-button button { top: calc(var(--preview-height) + (var(--sl-nav-height) - var(--sl-menu-button-size)) / 2) !important; }
mobile-starlight-toc nav { top: calc(var(--sl-nav-height) + var(--preview-height)) !important; }
@media (min-width: 72rem) { .right-sidebar { top: var(--preview-height) !important; height: calc(100vh - var(--preview-height)) !important; } }
@media (max-width: 480px) { :root { --preview-height: 5rem; } }
</style>`;

const script = `<script>(function(){
var banner=document.getElementById('silo-preview-banner');
var root=document.documentElement;
function measure(){
  var height=banner.getBoundingClientRect().height;
  root.style.setProperty('--preview-height',height+'px');
  root.style.removeProperty('scroll-padding-top');
  var basePadding=getComputedStyle(root).scrollPaddingTop;
  if(basePadding==='auto') basePadding='0px';
  root.style.scrollPaddingTop='calc('+basePadding+' + '+height+'px)';
  if(typeof updateFeatureScrollOffset==='function') updateFeatureScrollOffset();
}
measure();
if(window.ResizeObserver) new ResizeObserver(measure).observe(banner);
window.addEventListener('resize',measure);
})();</script>`;

export function injectBanner(html, info) {
  if (!info || html.includes('id="silo-preview-banner"')) return html;
  if (!/<head\b[^>]*>/i.test(html) || !/<body\b[^>]*>/i.test(html)) {
    throw new Error('Preview HTML must have a head and body');
  }
  const banner = `<div id="silo-preview-banner" role="status" data-pagefind-ignore><strong>Preview</strong> of <a href="${info.url}">pull request #${info.number}</a>${info.sha ? ` at <code>${info.sha}</code>` : ''}. Not the published site.</div>`;
  return html.replace(/<\/head>/i, `${style}<meta name="robots" content="noindex, nofollow"></head>`)
    .replace(/<body\b[^>]*>/i, match => match + banner)
    .replace(/<\/body>/i, script + '</body>');
}

export async function decorateDirectory(directory, info) {
  if (!info) return 0;
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) count += await decorateDirectory(path, info);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      await writeFile(path, injectBanner(html, info));
      count++;
    }
  }
  return count;
}

export default function previewBanner() {
  return {
    name: 'silo-preview-banner',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const count = await decorateDirectory(fileURLToPath(dir), previewInfo(process.env));
        if (count) logger.info(`Added preview banner to ${count} HTML pages`);
      },
    },
  };
}
