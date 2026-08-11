---
title: Docker deployment
description: Run Silo with the official Docker Compose stack.
---

The official [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml)
runs Silo, PostgreSQL, and Redis on one host. It is the recommended starting point for most
installs. See the [Quickstart](/docs/quickstart) for the shortest working setup.

## Image and platform support

Silo publishes `ghcr.io/silo-server/silo-server:latest` for x86-64 (`linux/amd64`) and arm64
(`linux/arm64`) Linux. Docker selects the matching image automatically.

| Platform | Image | Hardware transcoding |
| --- | --- | --- |
| Linux on x86-64 | `amd64` | Optional Intel Quick Sync, VA-API, or NVIDIA NVENC |
| Linux on arm64 (including Raspberry Pi 4/5) | `arm64` | Software only in the supported Compose path |
| macOS with Docker Desktop or OrbStack | `arm64` on Apple Silicon, `amd64` on Intel | Software only |
| Windows with Docker Desktop and WSL 2 | `amd64`, or `arm64` on Windows on ARM | Software only |

The default stack does not assume the host has a GPU, so it starts without `/dev/dri`. A
Raspberry Pi is well suited to direct play but will struggle with high-bitrate software
transcoding. On macOS and Windows, Linux containers cannot use the host's native video encoders.

## Default stack

Download the two install files if you are not using a server repository clone:

```sh
mkdir silo && cd silo
curl -fsSLO https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/.env.example -o .env
printf '\nPOSTGRES_PASSWORD=%s\nSECRET_KEY=%s\n' \
  "$(openssl rand -hex 24)" "$(openssl rand -base64 48)" >> .env
```

Set `MEDIA_ROOT` in `.env`, then start the stack:

```sh
docker compose up -d
docker compose ps
```

The default services are:

| Service | Purpose | Host ports |
| --- | --- | --- |
| `silo` | Integrated web, API, scanner, proxy, and transcoder | `8090`, `8096`, `13378` |
| `postgres` | Durable application data with pgvector | `5432`, bound to host loopback |
| `redis` | Coordination and cache-style state | `6379`, bound to host loopback |

The default Silo service mounts:

- `MEDIA_ROOT` at `MEDIA_CONTAINER_ROOT` (default `/mnt/media`), read-only. Every library type,
  including audiobooks and ebooks, uses this one media mount.
- `${SILO_DATA_ROOT}/plugins` for installed plugin artifacts.
- `${SILO_DATA_ROOT}/compat` for managed compatibility assets.
- `${SILO_DATA_ROOT}/transcode` for transient transcode output.
- `${SILO_DATA_ROOT}/catalog-seeds` at `/catalog-seeds`, read-only, for explicit local catalog imports.
- Host `/proc/meminfo` read-only so automatic PostgreSQL tuning can budget memory against the host.

`SILO_DATA_ROOT` defaults to `/opt/silo`. PostgreSQL and Redis also store their data below this
directory. Back up PostgreSQL and `.env`; Redis and transcode output are disposable.

## Optional Meilisearch

Meilisearch is present behind the `search` profile and is not started by default:

```sh
printf '\nMEILI_MASTER_KEY=%s\n' "$(openssl rand -hex 32)" >> .env
docker compose --profile search up -d
```

Starting the container does not change Silo's search provider. Under **Admin > Settings > Search**,
choose Meilisearch, use `http://meilisearch:7700`, enter the same key as the API key, test the
connection, and save. Restart Silo with `docker compose restart silo`, then rebuild the catalog
search index from the Search page. PostgreSQL full-text search remains the safe default and
fallback.

## Hardware transcoding on Linux

### Intel Quick Sync or VA-API

On a Linux host with `/dev/dri`, download and layer the VA-API device overlay:

```sh
curl -fsSLO https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.vaapi.yml
docker compose -f docker-compose.yml -f docker-compose.vaapi.yml up -d
```

To reuse the overlay with ordinary `docker compose` commands, set this in `.env`:

```dotenv
COMPOSE_FILE=docker-compose.yml:docker-compose.vaapi.yml
```

### NVIDIA NVENC

Install the NVIDIA driver and NVIDIA Container Toolkit, then download and layer the NVIDIA
overlay:

```sh
curl -fsSLO https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.nvidia.yml
docker compose -f docker-compose.yml -f docker-compose.nvidia.yml up -d
```

Linux and macOS use `:` between files in `COMPOSE_FILE`; Windows uses `;`.

## PostgreSQL tuning

The stack does not mount a custom `postgresql.conf`. Silo applies pgtune-style OLTP
recommendations with `ALTER SYSTEM`, which persists them in PostgreSQL's own
`postgresql.auto.conf`. Reloadable settings take effect immediately; if Silo reports restart-only
changes, apply them once with:

```sh
docker compose restart postgres
```

Set `POSTGRES_TUNE=off` when an external database administrator owns PostgreSQL tuning.

## Distributed examples

The checked-in Compose file includes commented examples for separate proxy and transcode workers.
Most single-host installations should leave them commented because the integrated `silo` service
already performs both roles. Multi-host operators can use the examples as a starting point for a
dedicated worker Compose file connected to shared PostgreSQL and Redis services.

## Source notes

- Default stack: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- Environment template: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example).
- Intel/AMD overlay: [`docker-compose.vaapi.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.vaapi.yml).
- NVIDIA overlay: [`docker-compose.nvidia.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.nvidia.yml).
- PostgreSQL tuning implementation: [`postgres_tune.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/database/postgres_tune.go).
- Image build and platforms: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml).
