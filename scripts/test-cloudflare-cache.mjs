import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deploymentMarker, purgeDeployment } from './cloudflare-cache.mjs';

const env = {
  GITHUB_SHA: 'new-commit', GITHUB_RUN_ID: '42', GITHUB_RUN_ATTEMPT: '2',
  CLOUDFLARE_ZONE_ID: 'a'.repeat(32), CLOUDFLARE_CACHE_PURGE_TOKEN: 'test-only-token',
  SITE: 'https://siloserver.org', BASE_PATH: '/',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const head = () => new Response(null, { headers: { 'CF-Cache-Status': 'MISS' } });
const options = fetchImpl => ({ fetchImpl, wait: async () => {}, attempts: 3 });

test('purges only the website after its exact deployment is published', async () => {
  const calls = [];
  await purgeDeployment(env, options(async (url, init) => {
    calls.push({ url: String(url), init });
    if (calls.length === 1) return json(deploymentMarker(env));
    if (calls.length === 2) return json({ success: true });
    return head();
  }));
  assert.match(calls[0].url, /^https:\/\/siloserver.org\/_build.json\?deployment=42-2-0$/);
  assert.equal(calls[0].init.headers.Authorization, undefined);
  assert.equal(calls[1].url, `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`);
  assert.equal(calls[1].init.redirect, 'error');
  assert.deepEqual(JSON.parse(calls[1].init.body), { hosts: ['siloserver.org'] });
  assert.equal(calls[2].url, 'https://siloserver.org/');
  assert.equal(calls[2].init.method, 'HEAD');
  assert.equal(calls[2].init.headers.Authorization, undefined);
});

test('waits for scheduled rebuilds and reruns even when the commit is unchanged', async () => {
  let markers = 0;
  let purges = 0;
  await purgeDeployment(env, options(async (url, init) => {
    if (String(url).includes('_build.json')) {
      markers++;
      return json(markers === 1 ? { ...deploymentMarker(env), run_attempt: '1' } : deploymentMarker(env));
    }
    if (init.method === 'POST') { purges++; assert.equal(markers, 2); return json({ success: true }); }
    return head();
  }));
  assert.equal(purges, 1);
});

test('never purges when Pages still serves the previous build', async () => {
  let calls = 0;
  await assert.rejects(purgeDeployment(env, options(async (_url, init) => {
    calls++;
    assert.notEqual(init.method, 'POST');
    return json({ ...deploymentMarker(env), commit: 'old-commit' });
  })), /cache was not purged/);
  assert.equal(calls, 3);
});

test('waits through an unavailable deployment marker', async () => {
  let calls = 0;
  await purgeDeployment(env, options(async (_url, init) => {
    calls++;
    if (calls === 1) return new Response('Publishing', { status: 404 });
    if (calls === 2) return json(deploymentMarker(env));
    if (init.method === 'POST') return json({ success: true });
    return head();
  }));
  assert.equal(calls, 4);
});

test('retries Cloudflare rate limits and fails on rejected credentials', async () => {
  let purges = 0;
  await purgeDeployment(env, options(async (_url, init) => {
    if (init.method === 'POST') return json({ success: ++purges > 1 }, purges === 1 ? 429 : 200);
    if (init.method === 'HEAD') return head();
    return json(deploymentMarker(env));
  }));
  assert.equal(purges, 2);
  await assert.rejects(purgeDeployment(env, options(async (_url, init) =>
    init.method === 'POST' ? json({ success: false }, 403) : json(deploymentMarker(env))
  )), /HTTP 403/);
});

test('fails the workflow when a successful HTTP response reports purge failure', async () => {
  await assert.rejects(purgeDeployment(env, options(async (_url, init) =>
    init.method === 'POST' ? json({ success: false }) : json(deploymentMarker(env))
  )), /Cloudflare rejected/);
});

test('rejects missing credentials and invalid URLs before making requests', async () => {
  const noFetch = options(() => { throw new Error('No request expected'); });
  await assert.rejects(purgeDeployment({ ...env, CLOUDFLARE_CACHE_PURGE_TOKEN: '' }, noFetch), /are required/);
  await assert.rejects(purgeDeployment({ ...env, SITE: 'http://siloserver.org' }, noFetch), /HTTPS/);
  await assert.rejects(purgeDeployment({ ...env, BASE_PATH: 'https://other.example/' }, noFetch), /BASE_PATH/);
  assert.throws(() => deploymentMarker({}), /metadata/);
});

test('preserves deployments under a base path and reports homepage failures', async () => {
  const urls = [];
  await assert.rejects(purgeDeployment({ ...env, BASE_PATH: '/site/' }, options(async (url, init) => {
    urls.push(String(url));
    if (init.method === 'POST') return json({ success: true });
    if (init.method === 'HEAD') return new Response(null, { status: 503 });
    return json(deploymentMarker(env));
  })), /homepage returned HTTP 503/);
  assert.match(urls[0], /\/site\/_build.json/);
  assert.equal(urls.at(-1), 'https://siloserver.org/site/');
});


test('CLI errors never print credentials from a failed Authorization header', () => {
  const bootstrap = `
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (url, init) => String(url).includes('_build.json')
      ? Promise.resolve(new Response(JSON.stringify({
        commit: process.env.GITHUB_SHA,
        run_id: process.env.GITHUB_RUN_ID,
        run_attempt: process.env.GITHUB_RUN_ATTEMPT,
      })))
      : originalFetch(url, init);
  `;
  const result = spawnSync(process.execPath, [
    '--import', `data:text/javascript,${encodeURIComponent(bootstrap)}`,
    fileURLToPath(new URL('./cloudflare-cache.mjs', import.meta.url)), 'purge',
  ], {
    env: { ...process.env, ...env, CLOUDFLARE_CACHE_PURGE_TOKEN: 'test-sensitive\n-credential' },
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Deployment cache operation failed/);
  assert.doesNotMatch(result.stdout + result.stderr, /test-sensitive|credential|Bearer/);
});
