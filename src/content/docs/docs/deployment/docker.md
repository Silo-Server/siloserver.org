---
title: Docker deployment
description: Run Silo with the default Docker Compose stack.
---

The default Compose stack is integrated-first. It is the right starting point for a single-host install.

## Image support

Silo publishes `ghcr.io/silo-server/silo-server:latest` from the server repository. The verified build path is Linux: the publish workflow runs on a Linux runner and the Docker runtime stage uses Debian Bookworm. The workflow does not declare a multi-platform matrix, so do not assume a specific architecture from the docs alone.

## Default profile

If you are not cloning the full server repository, download the latest Compose install files first:

```sh
mkdir -p postgres && curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml && curl -fsSLo .env.example https://raw.githubusercontent.com/Silo-Server/silo-server/main/.env.example && curl -fsSLo postgres/postgresql.conf https://raw.githubusercontent.com/Silo-Server/silo-server/main/postgres/postgresql.conf && cp -n .env.example .env
```

Then edit `.env` and start the default profile:

```sh
docker compose up -d
```

This starts PostgreSQL, Redis, and the integrated Silo service.

The Silo service maps:

- `8090` on the host to the web/API service on `8080` in the container.
- `8096` on the host to the Jellyfin-compatible service on `8096` in the container.
- `13378` on the host to the Audiobookshelf-compatible service on `13378` in the container.
- `MEDIA_ROOT` on the host to `MEDIA_CONTAINER_ROOT` in the container, read-only.
- `MEDIA_BOOKS_ROOT` (optional) on the host to `${MEDIA_CONTAINER_ROOT}/books` in the container, read-only. Falls back to `MEDIA_ROOT` when unset.

## Commented distributed examples

The checked-in Compose file includes commented examples for `proxy` and `transcode` services. They are examples for operators testing distributed mode or mirroring a split deployment shape. Most single-host installs should stay on the default integrated service.

| Profile | Command | Description |
| --- | --- | --- |
| default | `docker compose up -d` | Integrated server plus bundled PostgreSQL and Redis |
| `proxy` | Uncomment the `silo-proxy` example and run with the `proxy` profile | Standalone proxy service for distributed-mode testing |
| `transcode` | Uncomment the `silo-transcode` example and run with the `transcode` profile | Standalone transcode service for distributed-mode testing |

## Source notes

- Default service, ports, and media mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L35-L58).
- Raw Compose download: [`docker-compose.yml`](https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml).
- Compose Postgres config mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L12-L15) and [`postgresql.conf`](https://github.com/Silo-Server/silo-server/blob/main/postgres/postgresql.conf).
- Commented proxy and transcode examples: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L62-L111).
- Published image setting: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example#L16-L17).
- Docker publish workflow: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L20-L22) and [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L99-L110).
- Debian runtime image: [`Dockerfile`](https://github.com/Silo-Server/silo-server/blob/main/Dockerfile#L41-L59).
