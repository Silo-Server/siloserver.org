---
title: Server configuration and dependencies
description: Know which settings belong in Docker and which belong in the admin app.
---

The default installation needs only a few environment values. Libraries, providers, accounts, and most day-to-day settings live in the admin web app.

## Environment configuration

| Value | What it controls |
| --- | --- |
| `MEDIA_ROOT` | Media directory on the Docker host |
| `MEDIA_CONTAINER_ROOT` | Where that directory appears inside Silo |
| `SILO_DATA_ROOT` | Host directory for the default service data mounts |
| `SILO_IMAGE` | Server image tag or digest |
| `POSTGRES_PASSWORD` | Initial bundled database password |
| `SECRET_KEY` | Key used to protect stored credentials |

Changing `POSTGRES_PASSWORD` in an existing `.env` does not rotate the password already stored by PostgreSQL. Changing `SECRET_KEY` can make existing encrypted credentials unreadable. Treat both as maintenance operations, not troubleshooting toggles.

## Admin-managed settings

Sign in as an admin and open **Admin > Settings**. Change one relevant group, save, and follow any restart notice. Some values apply live; others require a restart.

Environment-managed values may appear locked in the UI. For example, `SILO_TRUSTED_PROXIES` overrides the stored trusted-proxy setting on startup. Pick one owner for the value rather than editing it in both places.

## External PostgreSQL and Redis

The beginner stack runs both services locally. For an external deployment:

1. Prepare PostgreSQL with pgvector and a dedicated Silo database and user. Use the versions supported by your chosen server build.
2. Configure network access and TLS for the database connection.
3. Set the Silo service's `DATABASE_URL` to that database. Set `REDIS_URL` to the chosen Redis service.
4. Remove the bundled database/Redis services and their `depends_on` requirements from the deployment if they are no longer used.
5. Validate the effective Compose file, start the server, and check readiness and logs.

Use `docker compose config --quiet` for a check that does not print secrets. The full `docker compose config` output expands passwords and keys; never paste it into a public report.

The default Compose file explicitly sets `DATABASE_URL` and `REDIS_URL` in the service's `environment`. Adding different values only to `.env` does not replace those entries.

PostgreSQL is required. Source configuration permits integrated/API mode without Redis, while separate proxy and transcode modes require it. The standard walkthrough always includes Redis; do not remove it from a working deployment as a space-saving step.

## Data layout

Review [Storage and capacity](/docs/running-a-server/s3-storage) before changing paths. A path in the container needs a corresponding persistent mount on the host.

## PostgreSQL tuning

Set `POSTGRES_TUNE=off` if the database is managed externally or you own its tuning. Keep schema upgrades and PostgreSQL major-version upgrades as separate, planned changes.

## Server modes

| Mode | Purpose |
| --- | --- |
| `integrated` | Default single-host server |
| `api` | API host without local transcoding |
| `proxy` | Remote streaming proxy |
| `transcode` | Remote conversion worker |

Separate workers need the shared database, Redis, and encryption key. See [Transcode nodes](/docs/running-a-server/transcode-nodes).

## Logging

Start with [Admin logs and container logs](/docs/running-a-server/logging). Add metrics or external telemetry only when you have a monitoring destination to receive them.
