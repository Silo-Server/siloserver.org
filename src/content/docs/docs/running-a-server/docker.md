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
| `PROXY_PORT` | 8083 | The commented `silo-proxy` example, once you turn it on |
| `TRANSCODE_PORT` | 8082 | The commented `silo-transcode` example, once you turn it on |

The three Silo ports listen on every host interface. `PORT` answers HTTPS as well as plain HTTP. Its certificate is self-signed, so browsers don't trust it, but the Silo apps check that it belongs to your server before they [connect directly at home](#discovery-on-the-local-network). The Jellyfin and Audiobookshelf ports use plain HTTP only, and their listeners are on from the first start. If you don't use those apps, turn off **Allow Jellyfin apps to connect** and **Allow Audiobookshelf apps to connect** in **Admin > Integrations > Compatibility**. See [third-party access](/docs/third-party-access). Before allowing access from outside your network, put Silo behind [HTTPS](/docs/reverse-proxy).

## Discovery on the local network

Silo announces itself on your network so the Silo apps on Apple and Android devices can list it when someone adds a server, without typing its address. The announcement uses mDNS, which is multicast on UDP port 5353. It works only where multicast reaches Silo, such as Docker with host networking (`network_mode: host`).

The default stack uses Docker's bridge network, which doesn't pass multicast, so apps don't list the server and people enter its address instead. The default Compose file isn't set up for host networking.

If people sign in with an HTTPS address, for example through a reverse proxy, set **Local network address** under **Network** in **Admin > Server > General** so their apps can still [switch to the local address at home](/docs/reverse-proxy#other-addresses-clients-use). Enter the Docker host's IP address on your network and the `PORT` value, for example `http://192.168.1.20:8090`, and save. The change applies without a restart. The Android apps find the local address from this setting. With host networking, the Apple apps also find it from the announcement.

To stop announcing the server, turn off **Show on the local network** under **Network** in **Admin > Server > General**, save, and restart Silo. It's on by default.

## Data directories

The media mount is read-only. Silo's writable directories live below `SILO_DATA_ROOT`, which defaults to `/opt/silo`:

| Directory | Contents |
| --- | --- |
| `postgres` | PostgreSQL files |
| `redis` | Redis persistence |
| `plugins` | Installed plugin files |
| `artwork` | Local artwork, uploads, and downloaded subtitles |
| `compat` | Compatibility assets |
| `transcode` | Temporary transcode output, mounted at `/tmp/silo-transcode` in the container |
| `download-artifacts` | Downloads the main server [prepared](/docs/download-storage) for devices, mounted at `/tmp/silo-download-artifacts` in the container |
| `catalog-seeds` | Catalog seed inputs, mounted read-only |
| `meilisearch` | Optional search index |

To cap how much space `download-artifacts` takes, set a [storage budget](/docs/download-storage#set-storage-budgets). [Backups](/docs/backup-restore) lists which of these to keep.

## Optional Meilisearch

Search uses PostgreSQL unless you switch it. To add Meilisearch:

1. Generate a key with `openssl rand -hex 32` and set `MEILI_MASTER_KEY` in `.env`. Keep it private.
2. Start the optional service with `docker compose --profile search up -d`.
3. Open **Admin > Server > Search**. Set **Search engine** to **Meilisearch**, enter `http://meilisearch:7700` as the **Meilisearch URL**, and use the same key as the **Meilisearch API key**.
4. Select **Check Connection**, save, and restart Silo.
5. Silo builds the search index in the background and tries again on its own if a build fails. Test a known title once it finishes.

To see which engine is answering searches, open **Advanced** on the same page and look under **Search status**. **Answering searches** shows **Meilisearch**, **Meilisearch (keyword only)** while an older index serves keyword results until its replacement is ready, or **Postgres full-text** while Meilisearch can't answer, such as when it's unreachable or has no usable index. **Rebuild index** opens the task that rebuilds the index by hand.

Some settings change the index format, such as **Match by meaning as well as words**. After you save and restart, Silo rebuilds the index on its own, and search keeps working from the older index or PostgreSQL until the new one is ready.

Starting the container alone does not switch Silo's search engine. Port 7700 is published on the host's loopback address; keep it off the public internet.

The Compose file pins the Meilisearch version, because Meilisearch cannot open data written by a different version. To upgrade, change `MEILISEARCH_IMAGE` and set `MEILI_UPGRADE_DB=true` in `.env` for one start, then remove it. You can also empty the `meilisearch` directory and let Silo rebuild the index.

## Hardware transcoding on Linux

The default stack uses the CPU only. For a GPU, add the matching overlay:

- `docker-compose.vaapi.yml` passes `/dev/dri` into the container for Intel Quick Sync and Intel or AMD VA-API. The host needs a working device and driver.
- `docker-compose.nvidia.yml` requests a GPU through the NVIDIA container runtime. Install the host driver and NVIDIA Container Toolkit first.

The full procedure is in [Set up transcoding](/docs/playback).

## Docker inside an LXC container

If the Docker host is itself an LXC container, such as on Proxmox, bind-mount the LXC's view of `/proc` into each Silo container:

```yaml
volumes:
  - /proc/meminfo:/host/proc/meminfo:ro
  - /proc/stat:/host/proc/stat:ro
  - /proc/loadavg:/host/proc/loadavg:ro
```

Without these, Silo reads the physical machine's CPU, memory, and load instead of the LXC's limits, so the dashboard and [node status](/docs/node-status#load-inside-a-container) show the wrong figures. The default Compose file already has these mounts on the `silo` service. In the `silo-proxy` and `silo-transcode` examples they're commented out.

Silo uses each file under `/host/proc` when it's there and its own `/proc` otherwise, with no setting to change. On a bare-metal or VM Docker host the mounts change nothing.

The LXC's load average is correct only when lxcfs runs with load average support (`lxcfs -l`), which is off by default on Proxmox. Without it, the load average stays the physical machine's while CPU and memory are correct.

## Distributed and external services

The Compose file includes commented examples for separate proxy and transcode workers. Leave them off on a single host; see [Transcode nodes](/docs/transcode-nodes).

Docker asks a container to stop and kills it 10 seconds later unless the service sets a longer `stop_grace_period`. The Compose file sets one on each Silo service, so each can stop without cutting requests or streams:

- `silo` has `2m`. When it's told to stop, Silo fails its [readiness check](/docs/server-health#check-startup) and keeps serving for `SILO_SHUTDOWN_DELAY`, `5s` by default, so a load balancer in front of several servers can send new requests elsewhere. Then it finishes the requests it's already serving. A single server gains nothing from the wait, even behind a reverse proxy, because no other server can take its requests. Set `SILO_SHUTDOWN_DELAY=0` in `.env` to skip it. Selecting **Restart server** in the **Restart required** banner also skips the wait.
- The `silo-proxy` example has `2m`, so the proxy can finish the requests it's serving.
- The `silo-transcode` example has `11m`: up to `10m` for the node to [drain](/docs/transcode-nodes#maintain-a-node) (`SILO_NODE_DRAIN_TIMEOUT`), and a minute for the shutdown after it. If you change the timeout, set `stop_grace_period` to the new value plus a minute.

For external PostgreSQL or Redis and PostgreSQL tuning, see [Server configuration](/docs/configuration).
