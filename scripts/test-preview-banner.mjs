import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { previewInfo, injectBanner, decorateDirectory } from './preview-banner.mjs';

const info = previewInfo({ PUBLIC_PREVIEW_PR_NUMBER: '23', PUBLIC_PREVIEW_PR_URL: 'https://github.com/Silo-Server/siloserver.org/pull/23', PUBLIC_PREVIEW_SHA: '123abcd4567890' });
const html = '<!doctype html><html><head><title>Page</title></head><body class="page-body"><header>Navigation</header><main>Content</main></body></html>';

test('production is untouched and invalid metadata fails closed', () => {
  assert.equal(previewInfo({}), null);
  assert.equal(injectBanner(html, null), html);
  assert.throws(() => previewInfo({ PUBLIC_PREVIEW_PR_NUMBER: '23' }));
  assert.throws(() => previewInfo({ PUBLIC_PREVIEW_PR_NUMBER: '23', PUBLIC_PREVIEW_PR_URL: 'javascript:alert(1)' }));
});

test('banner is first in body, unique, escaped by metadata validation, and noindex', () => {
  const result = injectBanner(html, info);
  assert.match(result, /<body class="page-body"><div id="silo-preview-banner"/);
  assert.match(result, /pull request #23/);
  assert.match(result, /<code>123abcd<\/code>/);
  assert.match(result, /noindex, nofollow/);
  assert.equal(injectBanner(result, info), result);
  assert.throws(() => previewInfo({ PUBLIC_PREVIEW_PR_NUMBER: '23', PUBLIC_PREVIEW_PR_URL: info.url, PUBLIC_PREVIEW_SHA: '</script>' }));
});

test('all built HTML is covered, including public files, docs, redirects and 404', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'silo-preview-test-'));
  try {
    const paths = ['index.html', 'brand/index.html', 'milestone/1.0/index.html', 'contributing/index.html', 'docs/index.html', 'docs/legacy/index.html', '404.html'];
    for (const path of paths) {
      await mkdir(join(directory, path, '..'), { recursive: true });
      await writeFile(join(directory, path), html);
    }
    await writeFile(join(directory, 'asset.txt'), 'unchanged');
    assert.equal(await decorateDirectory(directory, null), 0);
    assert.equal(await readFile(join(directory, 'index.html'), 'utf8'), html);
    assert.equal(await decorateDirectory(directory, info), paths.length);
    for (const path of paths) assert.match(await readFile(join(directory, path), 'utf8'), /id="silo-preview-banner"/);
    assert.equal(await readFile(join(directory, 'asset.txt'), 'utf8'), 'unchanged');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
