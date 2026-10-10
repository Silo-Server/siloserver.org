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

Changing `POSTGRES_PASSWORD` in an existing `.env` does not change the password PostgreSQL already stored. Changing `SECRET_KEY` makes existing encrypted credentials unreadable. Keep `MEDIA_CONTAINER_ROOT` as it is on an existing server: libraries store their folders as Silo sees them inside the container, so changing it after you add libraries points them at folders that no longer exist.

Put `POSTGRES_PASSWORD` in single quotes if it contains `$`, for example `POSTGRES_PASSWORD='pa$word'`. Compose otherwise treats `$word` as a variable and drops it. A single-quoted value can't contain a single quote or end with a backslash. The bundled stack also inserts the password into Silo's database URL without encoding it, so characters such as `#`, `%`, `/`, `?`, `\`, `|`, spaces, double quotes, and brackets break the connection. A value from `openssl rand -hex 24`, as in [Install Silo Server](/docs/install), avoids both problems.

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

For example, this override replaces both bundled services and turns off automatic tuning. Set `EXTERNAL_DB_PASSWORD` in `.env`, and percent-encode any reserved characters in it, because it goes into `DATABASE_URL` as written:

```yaml
services:
  postgres: !reset null
  redis: !reset null
  silo:
    depends_on: !reset {}
    environment:
      DATABASE_URL: postgres://silo:${EXTERNAL_DB_PASSWORD:?Set EXTERNAL_DB_PASSWORD}@db.example.com:5432/silo?sslmode=require
      REDIS_URL: redis://cache.example.com:6379
      POSTGRES_TUNE: "off"
```

The database needs the pgvector extension; the default stack uses PostgreSQL 18. Check the merged files before starting:

```sh
docker compose -f docker-compose.yml -f your-override.yml config --quiet
```

PostgreSQL is required. Redis is optional for a single `integrated` or `api` server and required once you add proxy or transcode nodes.

If several Silo installs share one Redis server, give each install its own database number in `REDIS_URL`. The number is the URL's path, such as `1` in `redis://redis.example.com:6379/1`, and a URL without one uses database 0. The main server and every node of one install use the same number. Installs on the same number mix their cached data and events, such as settings changes and live log rows.

If you set up Redis in **Admin > Settings > Storage & Database** or the setup wizard instead of with `REDIS_URL`, the **Database number** field below **Connection URL** replaces the number in the URL. It shows the number in use, so give each node's `REDIS_URL` that number. Changing it requires a restart and switches Silo to another database without moving existing data.

If your Redis user is restricted by an ACL, grant it the channel pattern `&silo:*`. On a database number other than 0, Silo adds the number to its channel names, such as `silo:catalog@db1`. A user granted only the plain names (`silo:catalog`, `silo:admin`, `silo:playback`, `silo:logs`, and `silo:events`) is refused with a `NOPERM` error, and Silo exits at startup. Database 0 uses the plain names.

To use [Valkey](https://valkey.io/) in place of Redis, set `REDIS_URL` to your Valkey server with a `redis://` URL. There is no Valkey-specific setting. Silo is tested only against Redis, so Valkey support is provided as-is.

### Redis Sentinel

To connect through [Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/), set `REDIS_URL` to a Sentinel URL:

```text
redis://sentinel-1:26379/1?master_name=mymaster&addr=sentinel-2:26379&addr=sentinel-3:26379
```

- `master_name` is the name Sentinel monitors your master under. A URL with this parameter names a Sentinel deployment.
- The host and each `addr` are Sentinel addresses, each with its port.
- The path is the database number, as in a single-server URL.
- A user name and password before the host sign in to Sentinel. The `username` and `password` parameters sign in to the Redis servers. Percent-encode reserved characters in them, and write a plus sign as `%2B`.
- With `rediss://`, every Sentinel and Redis server needs a certificate that's valid for the host name in the URL.

Silo follows a new master after a failover without a restart. The **Connection URL** field in the **Redis** group of **Admin > Settings > Storage & Database** takes the same URL.

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

With `POSTGRES_TUNE=auto`, Silo tunes the database for its workload with `ALTER SYSTEM` at startup. Settings that need a database restart are logged by name on every start until PostgreSQL restarts. Restart both services together during a quiet period, because restarting PostgreSQL alone drops Silo's connections. It's easiest right after the first start, before you add libraries:

```sh
docker compose restart postgres silo
```

Set `POSTGRES_TUNE=off` before starting Silo if you manage PostgreSQL settings yourself, and for an external database: automatic detection measures the Silo container, not the database host. Turning tuning off leaves settings already written to `postgresql.auto.conf` in place; reset them yourself if needed.

Silo also turns PostgreSQL's JIT compiler off on its own connections, unless the server configuration, `ALTER DATABASE`, `ALTER ROLE`, or `DATABASE_URL` (for example `?jit=on`) already sets `jit`. Silo's queries are short, and compiling them took longer than running them. Automatic tuning sets `jit = off` for the whole server.

These `.env` values adjust automatic tuning:

| Variable | Default | What it sets |
| --- | --- | --- |
| `POSTGRES_TUNE_PROFILE` | `oltp` | Tuning profile. `oltp` is the only one. |
| `POSTGRES_TUNE_MEMORY` | `auto` | Memory to tune for, such as `8GB`. Silo uses a value you set as it is. |
| `POSTGRES_TUNE_MEMORY_BUDGET_PERCENT` | `75` | Share of detected memory given to PostgreSQL |
| `POSTGRES_TUNE_CPUS` | `auto` | CPU count used for worker settings |
| `POSTGRES_TUNE_STORAGE` | `ssd` | `hdd`, `ssd`, `san`, or `nvme` |
| `POSTGRES_TUNE_DB_SIZE` | `auto` | Database size compared with memory: `less_ram`, `mid_ram`, or `greater_ram` |
| `POSTGRES_TUNE_CONNECTIONS` | `100` | PostgreSQL's `max_connections` |
| `POSTGRES_SHM_SIZE` | `8gb` | `/dev/shm` size of the bundled `postgres` container |

With `POSTGRES_TUNE_MEMORY=auto`, Silo uses the container's memory limit if it has one, and the host's memory otherwise. The default budget leaves 25% of it for Silo, Redis, plugins, transcodes, and the operating system. If Silo runs in a container with no memory limit and can only see a figure above 128 GB, it skips tuning and logs `postgres auto-tuning disabled`. Set `POSTGRES_TUNE_MEMORY`, or mount `/proc/meminfo:/host/proc/meminfo:ro` on the `silo` service as the default Compose file does.

Every Silo process (the main server and each proxy or transcode node) opens its own pool of up to **Maximum Postgres connections**, set under **Database** in **Admin > Settings > Storage & Database** (advanced, `20` by default). Silo raises `POSTGRES_TUNE_CONNECTIONS` to cover its own pool, but it doesn't count the nodes. With nodes, set it to at least that number times the number of Silo processes, plus a few for admin sessions.

Silo tunes with the same `DATABASE_URL` user it runs with. The bundled database user already has the permission it needs. On an external database, tuning requires granting that user `ALTER SYSTEM`, which lets anyone holding Silo's database credential change server-wide PostgreSQL settings. If you trust that setup, grant it and set `POSTGRES_TUNE_MEMORY` and `POSTGRES_TUNE_CPUS` to the database host's values.

Plan PostgreSQL major-version upgrades separately from Silo updates.

## Server modes

| Mode | Purpose |
| --- | --- |
| `integrated` | Default single-host server |
| `api` | Main server for a custom distributed setup. It can still transcode when node routing falls back to it. |
| `proxy` | Remote streaming node |
| `transcode` | Remote conversion worker |

Separate nodes need the shared database, Redis, and encryption key. See [Transcode nodes](/docs/transcode-nodes).

## Rate limiting

Rate limiting is on by default. Control it with **Enable rate limiting** in **Admin > Settings > Security & Access**, under **Rate limiting**, and set the limits under **Advanced**. Limit changes apply right away. If the server started with rate limiting off, turning it on applies after a restart. A client that goes over a limit gets HTTP `429` with a `Retry-After` delay.

If you run more than one API server, configure Redis, then set **Where counters are kept** to **Shared via Redis** so every server counts against the same limits. With **This server only**, each server keeps its own count. The change applies after a restart.

## Logging

See [Logs and monitoring](/docs/logging).
