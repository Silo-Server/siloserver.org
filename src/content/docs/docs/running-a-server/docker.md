---
slug: docs/docker
title: Docker deployment reference
description: Understand the default services, mounts, and optional search service.
---

For a new server, follow [Install Silo Server](/docs/install-silo-server). This reference explains the default stack and where to make later changes.

## Image and platform support

The image is `ghcr.io/silo-server/silo-server`, built for Linux x86-64 and arm64. `latest` is a moving tag. Record the version and image digest you actually run, especially before reporting a problem or updating.

Use an explicit published tag or digest when you need a repeatable deployment. Read its release notes before changing an existing installation.

## Default stack

| Service | Role | Default host ports |
| --- | --- | --- |
| `silo` | Web app, API, scanning, and playback | 8090, 8096, 13378 |
| `postgres` | Database with pgvector | 5432, host loopback only |
| `redis` | Shared coordination and cache state | 6379, host loopback only |

Ports 8096 and 13378 serve compatibility clients. Exposing a port and allowing a protocol in Silo settings are separate decisions. See [third-party access](/docs/third-party-access).

The media mount is read-only. Silo's writable directories live below `SILO_DATA_ROOT`, which defaults to `/opt/silo`:

| Directory | Contents |
| --- | --- |
| `postgres` | PostgreSQL files |
| `redis` | Redis persistence |
| `plugins` | Installed plugin files |
| `artwork` | Local artwork |
| `compat` | Compatibility assets |
| `transcode` | Temporary transcode and prepared media output |
| `catalog-seeds` | Catalog seed inputs, mounted read-only |
| `meilisearch` | Optional search index |

These mounts are not a complete backup procedure. See [Backups](/docs/backup-restore), particularly if an older install uses SQLite profile storage or other local paths.

## Optional Meilisearch

PostgreSQL search works without this service. To add Meilisearch:

1. Generate a key with `openssl rand -hex 32` and set `MEILI_MASTER_KEY` in `.env`. Keep it private.
2. Start the optional service with `docker compose --profile search up -d`.
3. Open the server's **Search** settings. Select Meilisearch, enter `http://meilisearch:7700`, and use the same key.
4. Check the connection, save, and follow the restart instruction.
5. Rebuild the catalog search index from that page, then test a known title.

Do not expose port 7700 publicly. Starting the container alone does not switch Silo's search provider.

## Hardware transcoding on Linux

Use the matching GPU overlay and then test a real transcode. The complete procedure is in [Set up transcoding](/docs/playback).

### Intel Quick Sync or VA-API

The VA-API overlay passes `/dev/dri` into the container. The host must have a working device and driver.

### NVIDIA NVENC

The NVIDIA overlay requests a GPU through the NVIDIA container runtime. Install the host driver and toolkit first.

## PostgreSQL tuning

The default stack lets Silo apply tuning with `ALTER SYSTEM`. If startup reports settings that need a database restart, schedule that restart while no one is using the server.

Set `POSTGRES_TUNE=off` when a database administrator manages tuning. An external PostgreSQL host may need its own memory and CPU budget; do not size it from the Silo container's host.

## Distributed examples

The Compose file's worker examples are commented out. They require shared services, matching media paths, and addresses reachable from the API and clients. See [Transcode nodes](/docs/transcode-nodes).

For external PostgreSQL or Redis, use a reviewed deployment file. The default service's explicit connection settings override values merely added to `.env`; see [configuration](/docs/configuration).
