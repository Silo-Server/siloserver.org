import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

export function deploymentMarker(env = process.env) {
  const marker = {
    commit: env.GITHUB_SHA,
    run_id: env.GITHUB_RUN_ID,
    run_attempt: env.GITHUB_RUN_ATTEMPT,
  };
  if (Object.values(marker).some(value => !value)) {
    throw new Error('GitHub deployment metadata is required.');
  }
  return marker;
}

export async function purgeDeployment(env = process.env, {
  fetchImpl = fetch,
  wait = sleep,
  attempts = 20,
} = {}) {
  const expected = deploymentMarker(env);
  const token = env.CLOUDFLARE_CACHE_PURGE_TOKEN;
  const zone = env.CLOUDFLARE_ZONE_ID;
  const site = new URL(env.SITE || 'https://siloserver.org');
  if (!token || !/^[a-f0-9]{32}$/.test(zone || '')) {
    throw new Error('CLOUDFLARE_CACHE_PURGE_TOKEN and CLOUDFLARE_ZONE_ID are required.');
  }
  if (site.protocol !== 'https:' || site.username || site.password) {
    throw new Error('SITE must be an HTTPS URL without credentials.');
  }
  const home = new URL(env.BASE_PATH || '/', site);
  if (home.origin !== site.origin || !home.pathname.endsWith('/')) {
    throw new Error('BASE_PATH must be a directory on SITE.');
  }
  const markerUrl = new URL('_build.json', home);
  let published = false;
  for (let attempt = 0; attempt < attempts; attempt++) {
    markerUrl.searchParams.set('deployment', `${expected.run_id}-${expected.run_attempt}-${attempt}`);
    try {
      const response = await fetchImpl(markerUrl, {
        headers: { 'User-Agent': 'Silo-Website-Deployment/1.0' },
        signal: AbortSignal.timeout(10_000),
      });
      const marker = response.ok ? await response.json() : null;
      published = marker && Object.keys(expected).every(key => marker[key] === expected[key]);
    } catch {
      // Pages or its CDN may still be publishing the artifact.
    }
    if (published) break;
    if (attempt + 1 < attempts) await wait(15_000);
  }
  if (!published) {
    throw new Error('GitHub Pages did not serve the expected build; cache was not purged.');
  }

  console.log(`GitHub Pages is serving deployment ${expected.run_id}/${expected.run_attempt}.`);
  const purgeUrl = `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetchImpl(purgeUrl, {
      method: 'POST',
      redirect: 'error',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hosts: [site.hostname] }),
      signal: AbortSignal.timeout(20_000),
    });
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await wait(5_000 * (attempt + 1));
      continue;
    }
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      // Keep response bodies and credentials out of workflow logs.
      throw new Error(`Cloudflare rejected the cache purge (HTTP ${response.status}).`);
    }
    console.log(`Purged Cloudflare cache for ${site.hostname}.`);
    break;
  }

  const response = await fetchImpl(home, {
    method: 'HEAD',
    headers: { 'User-Agent': 'Silo-Website-Deployment/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`The published homepage returned HTTP ${response.status} after purging.`);
  }
  console.log(`Homepage HTTP ${response.status}; CF-Cache-Status: ${response.headers.get('cf-cache-status') || 'not supplied'}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv[2] === 'manifest') {
      await writeFile('dist/_build.json', JSON.stringify(deploymentMarker()) + '\n');
    } else if (process.argv[2] === 'purge') {
      await purgeDeployment();
    } else {
      throw new Error('Expected manifest or purge.');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
