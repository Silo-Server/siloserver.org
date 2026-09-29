---
slug: docs/docker
title: Docker deployment reference
description: Understand the default services, ports, mounts, and optional search service.
---

For a new server, follow [Install Silo Server](/docs/install). This reference explains the default stack and where to make later changes.

## Image and tags

The image is `ghcr.io/silo-server/silo-server`, built for Linux x86-64 and arm64. Each published build gets three tags:

| Tag | Meaning |
| --- | --- |
| `latest` | Moves to each new build from `main` |
| `build-N` | Ordered build number; a larger number is newer |
| Short commit SHA | The exact source the build came from |

Set `SILO_IMAGE` in `.env` to a `build-N` tag, commit tag, or image digest when the server must not move with `latest`. Run `docker compose images silo` to see what you are running.

## Default stack

| Service | Role |
| --- | --- |
| `silo` | Web app, API, scanning, and playback |
| `postgres` | PostgreSQL 18 with pgvector |
| `redis` | Shared coordination and cache state |

Each service has a health status in `docker compose ps`. For what Silo's health and readiness checks mean, see [Check server health](/docs/server-health).

## Ports

Change a host port in `.env` when it conflicts with another service. The container ports stay fixed.

| Variable | Default | Serves |
| --- | --- | --- |
| `PORT` | 8090 | Silo web app, API, and native apps |
| `JF_PORT` | 8096 | Jellyfin-compatible apps |
| `ABS_PORT` | 13378 | Audiobookshelf-compatible apps (Beta) |
| `POSTGRES_PORT` | 5432 | PostgreSQL, on the host's loopback address only |
| `REDIS_PORT` | 6379 | Redis, on the host's loopback address only |

The three Silo ports listen on every host interface without TLS. The Jellyfin and Audiobookshelf listeners are on from the first start. If you don't use those apps, turn off **Allow Jellyfin apps to connect** and **Allow Audiobookshelf apps to connect** in **Admin > Settings > Compatibility**. See [third-party access](/docs/third-party-access). Before allowing access from outside your network, put Silo behind [HTTPS](/docs/reverse-proxy).

## Data directories

The media mount is read-only. Silo's writable directories live below `SILO_DATA_ROOT`, which defaults to `/opt/silo`:

| Directory | Contents |
| --- | --- |
| `postgres` | PostgreSQL files |
| `redis` | Redis persistence |
| `plugins` | Installed plugin files |
| `artwork` | Local artwork, uploads, and downloaded subtitles |
| `compat` | Compatibility assets |
| `transcode` | Temporary transcode output |
| `catalog-seeds` | Catalog seed inputs, mounted read-only |
| `meilisearch` | Optional search index |

[Backups](/docs/backup-restore) lists which of these to keep.

## Optional Meilisearch

Search uses PostgreSQL unless you switch it. To add Meilisearch:

1. Generate a key with `openssl rand -hex 32` and set `MEILI_MASTER_KEY` in `.env`. Keep it private.
2. Start the optional service with `docker compose --profile search up -d`.
3. Open **Admin > Settings > Library & Metadata**. Under **Search**, set **Search engine** to **Meilisearch**, enter `http://meilisearch:7700` as the **Meilisearch URL**, and use the same key as the **Meilisearch API key**.
4. Select **Check Connection**, save, and restart Silo.
5. Silo builds the search index in the background. Test a known title once it finishes.

Starting the container alone does not switch Silo's search engine. Port 7700 is published on the host's loopback address; keep it off the public internet.

The Compose file pins the Meilisearch version, because Meilisearch cannot open data written by a different version. To upgrade, change `MEILISEARCH_IMAGE` and set `MEILI_UPGRADE_DB=true` in `.env` for one start, then remove it. You can also empty the `meilisearch` directory and let Silo rebuild the index.

## Valkey in place of Redis

:::caution[Tested with Redis only]
Silo is currently tested only against Redis. Valkey support is provided as-is, with no support offered for Valkey-specific problems.
:::

[Valkey](https://valkey.io/) speaks the Redis protocol, and Silo connects to it with a `redis://` URL. There is no Valkey-specific setting.

To use an existing Valkey server, follow [External PostgreSQL and Redis](/docs/configuration#external-postgresql-and-redis) and set the `silo` service's `REDIS_URL` to that server.

For a new installation, save this override as `valkey-override.yml`:

```yaml
services:
  redis:
    image: valkey/valkey:alpine
```

The base Compose file's `redis-cli ping` health check works with the official Valkey image. Check the merged files, then start the stack:

```sh
docker compose -f docker-compose.yml -f valkey-override.yml config --quiet
docker compose -f docker-compose.yml -f valkey-override.yml up -d
```

For an existing installation, check your Redis version and follow [Valkey's migration guide](https://valkey.io/topics/migration/) before switching images. The bundled Compose file reuses the same `/data` mount, and Valkey can't read data files written by Redis 7.4 or later.

## Hardware transcoding on Linux

The default stack uses the CPU only. For a GPU, add the matching overlay:

- `docker-compose.vaapi.yml` passes `/dev/dri` into the container for Intel Quick Sync and Intel or AMD VA-API. The host needs a working device and driver.
- `docker-compose.nvidia.yml` requests a GPU through the NVIDIA container runtime. Install the host driver and NVIDIA Container Toolkit first.

The full procedure is in [Set up transcoding](/docs/playback).

## Distributed and external services

The Compose file includes commented examples for separate proxy and transcode workers. Leave them off on a single host; see [Transcode nodes](/docs/transcode-nodes).

For external PostgreSQL or Redis and PostgreSQL tuning, see [Server configuration](/docs/configuration).
