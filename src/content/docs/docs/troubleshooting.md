---
title: Troubleshooting
description: What to collect when reporting install, playback, or performance issues.
---

Good issue reports start with the user workflow and exact reproduction steps.

## Report template

```text
Goal:
Steps:
Expected:
Actual:
What is slow/broken:
Scope:
Version/branch:
Deployment:
Technical notes:
```

## What to include

- What you were trying to do
- Exact steps you took
- What you expected to happen
- What actually happened
- The exact action that is slow or broken, such as `save`, `scan`, `browse`, `import`, or `playback`
- Whether it happens every time or only sometimes
- The library, media type, filter, setting, or value involved
- Version, branch, commit, and deployment details if known
- Screenshots, recordings, or log snippets if relevant

If you used Claude, Codex, or another tool for debugging, put that under `Technical notes` after the workflow and reproduction steps.

## Autoscan

For Autoscan issues, include the Silo library root, the path Autoscan received from the trigger, the path after Autoscan rewrite, and the Jellyfin target URL. Most Autoscan failures are path-shape mismatches: the final path must land under one Silo library root.

## Libraries

For library scan issues, include whether the configured root is reachable from inside the Silo container. With default Docker Compose, host paths under `MEDIA_ROOT` are visible to Silo under `MEDIA_CONTAINER_ROOT`, which defaults to `/mnt/media`.
