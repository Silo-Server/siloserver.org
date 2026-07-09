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

## Logs

For the default Docker Compose deployment, capture service status and the relevant Silo, PostgreSQL, and Redis logs around the failure:

```sh
docker compose ps
docker compose logs --since=30m --timestamps silo postgres redis
```

For startup failures, always collect Docker stderr. Database connection, migration, startup-tuning, and telemetry-setup errors can occur before the Admin Logs and OTLP handlers are installed. Include the exact failure time and timezone, deployed image tag or commit, and any container health or restart state.

For runtime failures, also check Admin > Logs and include any relevant request ID, playback-session ID, component, or node identity. If OpenTelemetry is enabled, collect the same time window from the collector or backend, filtered to `service.name=silo-server` and the affected `service.instance.id`. Include Collector service logs when export itself is failing.

Silo redacts common secret-keyed structured attributes, but redaction is key-based rather than value-based. Review snippets before sharing and remove free-text secrets, tokens, cookies, credentials, and URL query strings. Preserve a sanitized hostname, port, and path shape when they are relevant to reproduction.

See [Logging and telemetry](/docs/logging) for sink behavior, OTLP setup, redaction boundaries, and retention.

## Autoscan

For preferred Silo Autoscan issues, include the source type, source connection, poll event status, raw source path, path after Silo source rewrites, Silo library root, and any Activity tab error. Most Autoscan failures are path-shape mismatches: the final path must land under one Silo library root.

For the legacy Jellyfin target, also include the external Autoscan config and the Jellyfin-compatible target URL.

## Libraries

For library scan issues, include whether the configured root is reachable from inside the Silo container. With default Docker Compose, host paths under `MEDIA_ROOT` are visible to Silo under `MEDIA_CONTAINER_ROOT`, which defaults to `/mnt/media`.
