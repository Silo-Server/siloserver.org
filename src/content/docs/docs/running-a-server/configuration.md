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

Put `POSTGRES_PASSWORD` in single quotes if it contains `$`, for example `POSTGRES_PASSWORD='pa$word'`. Compose otherwise treats `$word` as a variable and drops it. A single-quoted value can't contain a single quote or end with a backslash. The bundled stack also inserts the password into Silo's database URL without encoding it, so the password can't contain `#`, `%`, `/`, `?`, spaces, quotes, or brackets. A value from `openssl rand -hex 24` avoids both problems.

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

For example, this override replaces both bundled services. Percent-encode any reserved characters in the password inside `DATABASE_URL`:

```yaml
services:
  postgres: !reset null
  redis: !reset null
  silo:
    depends_on: !reset {}
    environment:
      DATABASE_URL: postgres://silo:${EXTERNAL_DB_PASSWORD:?Set EXTERNAL_DB_PASSWORD}@db.example.com:5432/silo?sslmode=require
      REDIS_URL: redis://cache.example.com:6379
```

The database needs the pgvector extension; the default stack uses PostgreSQL 18. Check the merged files before starting:

```sh
docker compose -f docker-compose.yml -f your-override.yml config --quiet
```

PostgreSQL is required. Redis is optional for a single `integrated` or `api` server and required once you add proxy or transcode nodes.

To use [Valkey](https://valkey.io/) in place of Redis, set `REDIS_URL` to your Valkey server with a `redis://` URL. There is no Valkey-specific setting. Silo is tested only against Redis, so Valkey support is provided as-is.

### Shared memory for your own PostgreSQL container

Size `/dev/shm` when you create your own PostgreSQL container. The bundled `postgres` service sets `shm_size` from `POSTGRES_SHM_SIZE` (8gb by default), but your container starts with Docker's 64 MB default, which can be too small for PostgreSQL's parallel queries. In Compose:

```yaml
services:
  postgres:
    shm_size: 2gb
```

With `docker run`, or in a container manager's extra-arguments field, pass `--shm-size=2g`. The value sets a tmpfs limit; it does not allocate that memory at startup. The bundled service uses 8gb if you want a starting point.

If the limit is too small, some catalog queries fail even though Silo keeps running and the disk has free space:

```text
ERROR: could not resize shared memory segment "/PostgreSQL.1938557030" to 8388608 bytes: No space left on device (SQLSTATE 53100)
```

PostgreSQL installed directly on a host or VM does not use Docker's `shm_size` setting. If shared-memory allocation fails there, check the free space in the host's `/dev/shm` and increase its tmpfs size or free capacity.

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
