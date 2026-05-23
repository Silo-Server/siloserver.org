// Build-time fetch of the latest GitHub release for every silo-* repo.
// Used by client cards to show the current version + download link.
//
// Fails gracefully: if the API is unreachable or rate-limited, the cards
// fall back to a generic "view repo" link and no version is shown.
//
// Pass GITHUB_TOKEN at build time to raise the rate limit from 60/hr to
// 5,000/hr — required when the workflow polls on schedule.

import { REPOS, repoUrl } from "./siteConfig";

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface Release {
  repo: string;
  tag: string;
  url: string;
  publishedAt: string;
  assets: ReleaseAsset[];
}

type ReleaseMap = Partial<Record<keyof typeof REPOS, Release>>;

const API_BASE = "https://api.github.com";
const ORG = "Silo-Server";

const headers = (): Record<string, string> => {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "silo-website-build",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
};

async function fetchLatest(repo: string): Promise<Release | null> {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${ORG}/${repo}/releases/latest`,
      { headers: headers() },
    );
    if (!res.ok) {
      // 404 just means no releases yet — quiet.
      if (res.status !== 404) {
        console.warn(
          `[releases] ${repo}: ${res.status} ${res.statusText}`,
        );
      }
      return null;
    }
    const json = (await res.json()) as {
      tag_name: string;
      html_url: string;
      published_at: string;
      assets?: Array<{
        name: string;
        browser_download_url: string;
        size: number;
      }>;
    };
    return {
      repo,
      tag: json.tag_name,
      url: json.html_url,
      publishedAt: json.published_at,
      assets: (json.assets ?? []).map((a) => ({
        name: a.name,
        url: a.browser_download_url,
        size: a.size,
      })),
    };
  } catch (err) {
    console.warn(`[releases] ${repo}: ${(err as Error).message}`);
    return null;
  }
}

// Resolves at module-load time, so the data is baked into the static build.
const entries = await Promise.all(
  (Object.entries(REPOS) as Array<[keyof typeof REPOS, string]>).map(
    async ([key, repo]) => [key, await fetchLatest(repo)] as const,
  ),
);

export const releases: ReleaseMap = Object.fromEntries(
  entries.filter(([, v]) => v !== null) as Array<[keyof typeof REPOS, Release]>,
) as ReleaseMap;

// Convenience helper: get a release for a repo key, or null if not available.
export const releaseFor = (key: keyof typeof REPOS): Release | null =>
  releases[key] ?? null;

// Convenience helper: get a sensible link target for a repo, preferring the
// latest-release page if available, otherwise the repo home.
export const downloadLinkFor = (key: keyof typeof REPOS): string => {
  const r = releases[key];
  if (r) return r.url;
  return repoUrl(REPOS[key]);
};
