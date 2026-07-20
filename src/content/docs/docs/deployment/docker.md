---
title: Docker deployment
description: Run Silo with the default Docker Compose stack.
---

The default Compose stack is integrated-first. It is the right starting point for a single-host install.

## Image support

Silo publishes `ghcr.io/silo-server/silo-server:latest` from the server repository as a Linux multi-architecture image. The publish workflow builds `linux/amd64` and `linux/arm64` and pushes a single manifest list; the runtime stage is Debian Bookworm on both. `docker pull` selects the matching variant automatically — no tag suffix or `platform:` override is needed.

## Supported platforms

The same Compose instructions below work on every supported platform, with one caveat: the checked-in Compose file maps `/dev/dri` into the Silo container for Intel hardware transcoding, and Docker refuses to start a service whose mapped device does not exist on the host. On hosts without `/dev/dri` (macOS, Windows, and some arm64 boards), drop the mapping with an override file next to `docker-compose.yml` (Compose v2.24+):

```yaml
# docker-compose.override.yml
services:
  silo:
    devices: !reset []
```

Compose reads the override automatically; no extra flags are needed. Platform-specific notes:

### Linux on x86-64

The standard deployment target. Works on any distribution with Docker Engine and the Compose plugin. Intel Quick Sync (`/dev/dri`) and NVIDIA (`docker-compose.nvidia.yml`) hardware transcoding are available on this platform.

### Linux on arm64

Servers such as AWS Graviton and single-board computers such as the Raspberry Pi 4/5 pull the `linux/arm64` variant automatically. A 64-bit OS is required — 32-bit (`armv7`/`armhf`) OS images are not supported, so on a Raspberry Pi use the 64-bit variant of Raspberry Pi OS or another aarch64 distribution. Transcoding on these devices is software-only; size expectations accordingly. If the host has no `/dev/dri` (common on cloud arm64 instances), apply the override above.

### macOS (Docker Desktop or OrbStack)

Apple Silicon Macs run the `linux/arm64` variant natively inside the Docker VM; Intel Macs run `linux/amd64`. The Docker VM has no `/dev/dri`, so the override above is required. Two more macOS-specific notes:

- Mount media from a fast local path. VM file sharing is the usual bottleneck; OrbStack's VirtioFS sharing is markedly faster than legacy Docker Desktop file sharing for large media libraries.
- Hardware transcoding is not available — VideoToolbox is not exposed to Linux containers, so transcodes run in software.

### Windows (Docker Desktop with WSL 2)

Runs the `linux/amd64` variant under WSL 2 (or `linux/arm64` on Windows-on-ARM). The WSL 2 VM typically has no `/dev/dri`, so apply the override above. Keep media on a path accessible to WSL 2 (drive shares under `/mnt/c/...` work but are slower than storage inside the WSL filesystem). Hardware transcoding inside the container is not supported on this platform.

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
- Docker publish workflow and platform list: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L20-L22) and [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L99-L111).
- Debian runtime image: [`Dockerfile`](https://github.com/Silo-Server/silo-server/blob/main/Dockerfile#L41-L59).
- `/dev/dri` device mapping on the default service: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L89-L90).
- NVIDIA overlay: [`docker-compose.nvidia.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.nvidia.yml).
