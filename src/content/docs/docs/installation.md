---
title: Installation
description: Supported ways to install and run Silo.
---

Docker Compose is the recommended installation path. It gives Silo a consistent environment and
starts the required PostgreSQL and Redis services from one checked-in Compose file.

## Requirements

- [Docker Engine](https://docs.docker.com/engine/install/) on Linux, or [Docker Desktop](https://docs.docker.com/desktop/) on macOS or Windows
- Docker Compose 2.24 or newer, included with current Docker Desktop releases or available as the [Compose plugin](https://docs.docker.com/compose/install/linux/) on Linux
- A host directory containing your media
- OpenSSL to generate Silo's credential-encryption key

Confirm Docker and Compose are ready:

```sh
docker --version
docker compose version
```

## Recommended: Docker Compose

The default stack includes:

- Silo and FFmpeg
- PostgreSQL 18 with pgvector
- Redis
- Optional Meilisearch through the `search` profile

Follow the [Quickstart](/docs/quickstart) to download `docker-compose.yml`, create `.env`, set the
media path and encryption key, and run `docker compose up -d`. No `postgresql.conf` or separate
database setup is required.

The Silo image is published for x86-64 (`linux/amd64`) and arm64 (`linux/arm64`) Linux. Docker
selects the correct image automatically. The default Compose stack is CPU-safe; hardware
transcoding is enabled with a Linux-only overlay described in [Docker deployment](/docs/deployment/docker/).

## Existing infrastructure

If you already operate PostgreSQL and Redis, run only the Silo service and point it at your
existing `DATABASE_URL` and `REDIS_URL`. External PostgreSQL must include pgvector. If its database
user cannot run `ALTER SYSTEM`, set `POSTGRES_TUNE=off` and manage PostgreSQL tuning yourself.

## Build from source

Source builds are intended for contributors and custom deployments. They require:

- Go 1.26.4+
- Node.js 22+ with pnpm 10.32.1
- PostgreSQL 18+ with pgvector
- Redis
- FFmpeg

```sh
make build
./silo
```

Source runs require `DATABASE_URL` and `SECRET_KEY`. See the server repository's
[`README.md`](https://github.com/Silo-Server/silo-server#build-from-source) for the current build
workflow.

## Source notes

- Compose services and image: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- Environment defaults: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example).
- Image platform matrix: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml).
- Go toolchain: [`go.mod`](https://github.com/Silo-Server/silo-server/blob/main/go.mod).
