---
title: Installation
description: Supported ways to install and run Silo.
---

Silo currently supports Docker Compose for operators and source builds for contributors or custom deployments.

## Docker Compose

Docker Compose is the recommended path for most installs. The default stack bundles PostgreSQL, Redis, and the integrated Silo service. It publishes the web app on `8090` and the Jellyfin-compatible endpoint on `8096`.

```sh
cp .env.example .env
docker compose up -d
```

Set `MEDIA_ROOT` before starting the stack. It is mounted read-only into the Silo container at `MEDIA_CONTAINER_ROOT`, which defaults to `/mnt/media`. You can also override `SILO_DATA_ROOT` if you do not want bind mounts under `/opt/silo`.

The published image defaults to `ghcr.io/silo-server/silo-server:latest`. Current source only shows a Linux container image build: CI runs the Docker job on Linux and the runtime stage is Debian-based. Architecture is not declared in the workflow.

## Build from source

Source builds are intended for development or custom deployments.

Required tools:

- Go 1.26+
- Bun 1.0+
- PostgreSQL 18+
- FFmpeg

Build and run:

```sh
make build
./silo
```

When running from source or against external infrastructure, Silo requires a `DATABASE_URL`. Most other settings are configured in the admin UI.

## Existing infrastructure

If you already run PostgreSQL and Redis, omit the bundled examples from Compose and point Silo at your existing `DATABASE_URL` and `REDIS_URL`.

## Source notes

- Default Compose stack and published image reference: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L1-L58).
- `.env` defaults: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example#L1-L42).
- Docker publish workflow: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L20-L22) and [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L99-L110).
- Debian runtime image and exposed ports: [`Dockerfile`](https://github.com/Silo-Server/silo-server/blob/main/Dockerfile#L41-L59).
- Go toolchain version: [`go.mod`](https://github.com/Silo-Server/silo-server/blob/main/go.mod#L1-L3).
- Source-run configuration statement: [`README.md`](https://github.com/Silo-Server/silo-server/blob/main/README.md#L206-L217).
