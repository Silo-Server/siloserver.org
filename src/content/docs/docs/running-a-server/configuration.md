---
slug: docs/configuration
title: Server configuration and dependencies
description: Know which settings belong in Docker and which belong in the admin app.
---

The default installation needs only a few environment values. Libraries, providers, accounts, and most day-to-day settings live in the admin web app.

## Environment configuration

Set these in `.env` beside the Compose file:

| Value | What it controls |
| --- | --- |
| `MEDIA_ROOT` | Media directory on the Docker host |
| `MEDIA_CONTAINER_ROOT` | Where that directory appears inside Silo |
| `SILO_DATA_ROOT` | Host directory for Silo's data (see [Docker reference](/docs/docker#data-directories)) |
| `SILO_IMAGE` | Server image tag or digest |
| `POSTGRES_PASSWORD` | Password for the bundled database, used when it is first created |
| `SECRET_KEY` | Key that encrypts stored credentials |
| `POSTGRES_TUNE` | Automatic PostgreSQL tuning, `auto` by default |

Changing `POSTGRES_PASSWORD` in an existing `.env` does not change the password PostgreSQL already stored. Changing `SECRET_KEY` makes existing encrypted credentials unreadable.

`docker compose config` prints the full configuration with passwords and keys filled in. Use `docker compose config --quiet` to check the files without printing them, and never paste the full output into a public report.

## Admin-managed settings

Sign in as an admin and open **Admin > Settings**. Change one group at a time, save, and follow any restart notice. Some values apply live; others need a restart.

A value set in the environment can override the stored setting. For example, `SILO_TRUSTED_PROXIES` replaces the **Trusted proxies** setting on every start. Manage each value in one place.

## External PostgreSQL and Redis

The default Compose file runs both services locally. It sets `DATABASE_URL` and `REDIS_URL` for the `silo` service directly and waits for both bundled services to be healthy, so adding different values to `.env` changes nothing.

To use existing servers, write a Compose file or override that:

- sets the external `DATABASE_URL` and `REDIS_URL` on the `silo` service
- removes the `depends_on` entries for the bundled services
- leaves out the bundled `postgres` and `redis` services
- keeps the media, plugin, artwork, compatibility, transcode, and catalog seed mounts
- uses the same `SECRET_KEY` for every Silo server and node

The database needs the pgvector extension; the default stack uses PostgreSQL 18. Check the merged files before starting:

```sh
docker compose -f docker-compose.yml -f your-override.yml config --quiet
```

PostgreSQL is required. Redis is optional for a single `integrated` or `api` server and required once you add proxy or transcode nodes.

## PostgreSQL tuning

With `POSTGRES_TUNE=auto`, Silo tunes the database for its workload with `ALTER SYSTEM` at startup. Settings that need a database restart are logged by name on every start until PostgreSQL restarts. Restart both services together during a quiet period, because restarting PostgreSQL alone drops Silo's connections:

```sh
docker compose restart postgres silo
```

Set `POSTGRES_TUNE=off` before starting Silo if you manage PostgreSQL settings yourself, and for an external database: automatic detection measures the Silo container, not the database host. Turning tuning off leaves settings already written to `postgresql.auto.conf` in place; reset them yourself if needed. The other `POSTGRES_TUNE_*` values in `.env.example` override the detected memory, CPU count, and storage type.

Plan PostgreSQL major-version upgrades separately from Silo updates.

## Server modes

| Mode | Purpose |
| --- | --- |
| `integrated` | Default single-host server |
| `api` | Main server for a custom distributed setup |
| `proxy` | Remote streaming node |
| `transcode` | Remote conversion worker |

Separate nodes need the shared database, Redis, and encryption key. See [Transcode nodes](/docs/transcode-nodes).

## Logging

See [Logs and monitoring](/docs/logging).
