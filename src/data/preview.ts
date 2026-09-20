// Preview-deployment metadata, set only by the pull request preview workflow.
// Production builds leave these unset, so nothing here renders on siloserver.org.
//
// Variables are PUBLIC_-prefixed so Astro exposes them to import.meta.env at
// build time; they contain nothing secret (a PR number, URL, and commit SHA).

export interface PreviewInfo {
  prNumber: string;
  prUrl: string;
  sha: string;
}

const prNumber = import.meta.env.PUBLIC_PREVIEW_PR_NUMBER;
const prUrl = import.meta.env.PUBLIC_PREVIEW_PR_URL;
const sha = import.meta.env.PUBLIC_PREVIEW_SHA ?? "";

export const PREVIEW: PreviewInfo | null =
  prNumber && prUrl ? { prNumber, prUrl, sha: sha.slice(0, 7) } : null;
