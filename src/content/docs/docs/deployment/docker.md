---
title: Docker deployment
description: Run Silo with the default Docker Compose stack.
---

The default [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) stack runs everything on one host — PostgreSQL, Redis, and the integrated Silo service. It is the right starting point for most installs.

## Image support

Silo publishes one image, `ghcr.io/silo-server/silo-server:latest`, built for both x86-64 (`linux/amd64`) and arm64 (`linux/arm64`) Linux. `docker pull` picks the right one for your machine automatically — no special tags or flags.

## Supported platforms

| Platform | Image | Hardware transcoding |
| --- | --- | --- |
| Linux on x86-64 | `amd64` | Intel Quick Sync, NVIDIA |
| Linux on arm64 (Graviton, Raspberry Pi 4/5) | `arm64` | No — software only |
| macOS — Docker Desktop or OrbStack | `arm64` on Apple Silicon, `amd64` on Intel | No — software only |
| Windows — Docker Desktop with WSL 2 | `amd64` (`arm64` on Windows on ARM) | No — software only |

### Hosts without an Intel GPU

The default [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L89-L90) passes the host's Intel GPU device (`/dev/dri`) into the container for hardware transcoding. If your host has no `/dev/dri` — true on macOS, Windows, and most arm64 servers — Docker refuses to start the service.

The fix is a two-line override. Create `docker-compose.override.yml` next to `docker-compose.yml`:

```yaml
services:
  silo:
    devices: !reset []
```

Compose reads this file automatically (v2.24 or newer); no extra flags are needed.

### Linux on x86-64

Works on any distribution with Docker Engine and the Compose plugin. This is the only platform with hardware transcoding: Intel Quick Sync works out of the box via the default [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L89-L90), and NVIDIA GPUs via the [`docker-compose.nvidia.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.nvidia.yml) overlay.

### Linux on arm64

Covers arm64 servers such as AWS Graviton and single-board computers such as the Raspberry Pi 4/5. Two requirements:

- A 64-bit OS. 32-bit (`armv7`/`armhf`) systems are not supported — on a Raspberry Pi, use the 64-bit variant of Raspberry Pi OS.
- If the host has no `/dev/dri` (most cloud instances), add the [override above](#hosts-without-an-intel-gpu).

Transcoding runs on the CPU. A Pi handles direct play well but will struggle to transcode high-bitrate video, so prefer clients that can play your media natively.

### macOS (Docker Desktop or OrbStack)

Apple Silicon Macs run the `arm64` image natively; Intel Macs run `amd64`. Add the [override above](#hosts-without-an-intel-gpu) — the Docker VM has no `/dev/dri`.

- Keep media on a fast local path. File sharing into the VM is the usual bottleneck, and OrbStack's sharing is much faster than Docker Desktop's for large libraries.
- Transcoding runs on the CPU — Linux containers cannot use the Mac's VideoToolbox hardware encoder.

### Windows (Docker Desktop with WSL 2)

Add the [override above](#hosts-without-an-intel-gpu) — the WSL 2 VM has no `/dev/dri`. Keep media on a path WSL 2 can reach; Windows drive shares under `/mnt/c/...` work but are slower than storage inside the WSL filesystem. Transcoding runs on the CPU.

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
