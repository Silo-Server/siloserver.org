---
slug: docs/docker
title: Docker deployment reference
description: Understand Silo's image, ports, mounts, and optional search service, and other ways to run it.
---

For a new server, follow [Install Silo Server](/docs/install). This reference explains what runs in Silo's container, the other ways to start it, and where to make later changes.

## Image and tags

The image is `ghcr.io/silo-server/silo-server`, built for Linux x86-64 and arm64. Each published build gets three tags:

| Tag | Meaning |
| --- | --- |
| `latest` | Moves to each new build from `main` |
| `build-N` | Ordered build number; a larger number is newer |
| Full commit SHA | The exact source the build came from |

To keep the server from moving with `latest`, set `SILO_OMNIBUS_IMAGE` in `.env` to the image with a `build-N` tag, commit tag, or digest, for example `SILO_OMNIBUS_IMAGE=ghcr.io/silo-server/silo-server:build-1850`. The [advanced Compose file](#run-the-services-in-separate-containers) reads `SILO_IMAGE` instead. Run `docker compose images silo` to see what you are running.

Builds published before PostgreSQL and Redis moved into this image used `build-N` for an image without them, and tagged this one `build-N-aio`. To go back to one of those builds, pin its `build-N-aio` tag.

## What runs in the container

| Service | Runs as | Data |
| --- | --- | --- |
| Silo: web app, API, scanning, and playback | `PUID`:`PGID` | `/config/silo` |
| PostgreSQL 18 with pgvector | uid 999 | `/config/postgres` |
| Redis | uid 998 | `/config/redis` |
| Meilisearch, if you [turn it on](#optional-meilisearch) | uid 997 | `/config/meilisearch` |

`docker compose ps` shows one `silo` service with a health status. For what Silo's health and readiness checks mean, see [Check server health](/docs/server-health).

Set `PUID` and `PGID` to an account that can read your media. The Compose files default both to `1000`; with `docker run` they default to `911`. If that account can't read the media, the log says `uid 1000 cannot read /mnt/media/...` with the folder it couldn't open. `PUID` can't be 999, 998, or 997: the container stops with `PUID 999 is already used by the postgres account in this image; choose another uid`. The container has to start as root to switch to these accounts, so a `user:` setting in Compose, or a user set in a container manager, stops it.

On the host, leave the owners of the `postgres`, `redis`, and `meilisearch` directories under `config` as they are. When you change `PUID` or `PGID`, the next start gives `config/silo` to the new account, which can take a while if it holds a lot of local artwork.

The Compose files turn on Redis unless `.env` sets `ENABLE_REDIS=false`. The image itself leaves it off, so with `docker run`, set `ENABLE_REDIS=true` to get it. [Watch Party](/docs/watch-together) rooms need Redis. Setting your own `DATABASE_URL` or `REDIS_URL` turns off the matching bundled service; see [External PostgreSQL and Redis](/docs/configuration#external-postgresql-and-redis).

## Run with docker run

On a NAS or in a container manager that doesn't use Compose, start the image with the same settings:

```sh
docker run -d --name silo \
  --restart unless-stopped \
  --stop-timeout 120 \
  --cap-add NET_ADMIN \
  -e SECRET_KEY='replace-with-the-generated-key' \
  -e PUID=1000 -e PGID=1000 \
  -e ENABLE_REDIS=true \
  -p 8090:8080 -p 8096:8096 -p 13378:13378 \
  -v /opt/silo/config:/config \
  -v /srv/media:/mnt/media:ro \
  -v /opt/silo/transcode:/tmp/silo-transcode \
  -v /opt/silo/download-artifacts:/tmp/silo-download-artifacts \
  ghcr.io/silo-server/silo-server:latest
```

Generate `SECRET_KEY` with `openssl rand -base64 48` and keep a copy separate from your backups. `--stop-timeout 120` gives Silo two minutes to finish requests and shut PostgreSQL down cleanly; Docker otherwise kills the container after 10 seconds. Without the transcode and download mounts, those files are lost each time the container is recreated.

The commands on other pages use `docker compose exec silo`. With `docker run`, use `docker exec silo` instead.

## Run the services in separate containers

The server repository's advanced Compose file, [`docker-compose.split.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.split.yml), runs PostgreSQL, Redis, and optionally Meilisearch in containers of their own, with Silo in the same image as above and its bundled services off. Use it when you want to manage those services yourself. A server installed before Silo moved to one container already runs this way; see [If your server runs PostgreSQL and Redis in their own containers](/docs/updates#if-your-server-runs-postgresql-and-redis-in-their-own-containers).

| Service | Role |
| --- | --- |
| `silo` | Web app, API, scanning, and playback |
| `postgres` | PostgreSQL 18 with pgvector |
| `redis` | Shared coordination and cache state |
| `meilisearch` | Optional search service, started with `--profile search` |

### Set up the advanced Compose file

1. Follow steps 2 and 3 of [Install Silo Server](/docs/install), but in step 2 download the advanced file instead of creating `docker-compose.yml`:

   ```sh
   curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.split.yml -o docker-compose.split.yml
   ```

2. Generate a database password with `openssl rand -hex 24`, and add these lines to `.env`:

   ```dotenv
   COMPOSE_FILE=docker-compose.split.yml
   POSTGRES_PASSWORD=replace-with-the-generated-password
   ```

   Set the password before the first start. PostgreSQL stores it when it creates the database, and changing `.env` afterwards doesn't change it. Some characters break Silo's connection, so keep to a value like this one; see [Environment configuration](/docs/configuration#environment-configuration).

3. Run `docker compose up -d`, then `docker compose ps`. It lists `postgres`, `redis`, and `silo`, each with a health status.

Then [finish setup in the browser](/docs/install#5-finish-setup-in-the-browser).

### What's different from the single container

Silo itself runs as it does in the single container: as `PUID` and `PGID`, on the same ports, with the same media mount and the same settings in `.env`. These parts work differently:

- Pin the image with `SILO_IMAGE` instead of `SILO_OMNIBUS_IMAGE`. See [Image and tags](#image-and-tags).
- PostgreSQL and Redis are published on the host's loopback address at `POSTGRES_PORT` and `REDIS_PORT`. See [Ports](#ports).
- Silo's folders sit directly in `SILO_DATA_ROOT`, not under `config`. See [Data directories](#data-directories).
- Meilisearch runs as its own service, and you connect it in the admin pages. See [Meilisearch in a separate container](#meilisearch-in-a-separate-container).
- Using your own PostgreSQL or Redis takes an override file. See [External PostgreSQL and Redis](/docs/configuration#external-postgresql-and-redis).
- `POSTGRES_SHM_SIZE` sets the `postgres` container's shared memory, 8gb by default. See [Shared memory for your own PostgreSQL container](/docs/configuration#shared-memory-for-your-own-postgresql-container).
- When automatic tuning asks for a restart, run `docker compose restart postgres silo`. See [PostgreSQL tuning](/docs/configuration#postgresql-tuning).
- Backups dump the database from the `postgres` service, and SQLite per-user data needs its own mount. See [Back up a Compose install](/docs/backup-restore#back-up-a-compose-install). A test restore starts `postgres` alone first; see [Test a restore](/docs/backup-restore#test-a-restore).
- `docker compose up -d --no-deps silo` updates Silo and leaves PostgreSQL and Redis running. See [Update with Docker Compose](/docs/updates#update-with-docker-compose).

## Ports

Change a host port in `.env` when it conflicts with another service. The container ports stay fixed.

| Variable | Default | Serves |
| --- | --- | --- |
| `PORT` | 8090 | Silo web app, API, and native apps |
| `JF_PORT` | 8096 | Jellyfin-compatible apps |
| `ABS_PORT` | 13378 | Audiobookshelf-compatible apps (Beta) |
| `POSTGRES_PORT` | 5432 | PostgreSQL, published only for [nodes](#nodes-and-stop-timeouts), or on the host's loopback address with separate containers |
| `REDIS_PORT` | 6379 | Redis, published the same way |

The three Silo ports listen on every host interface. `PORT` answers HTTPS as well as plain HTTP. Its certificate is self-signed, so browsers don't trust it, but the Silo apps check that it belongs to your server before they [connect directly at home](#discovery-on-the-local-network). The Jellyfin and Audiobookshelf ports use plain HTTP only, and their listeners are on from the first start. If you don't use those apps, turn off **Allow Jellyfin apps to connect** and **Allow Audiobookshelf apps to connect** in **Admin > Integrations > Compatibility**. See [third-party access](/docs/third-party-access). Before allowing access from outside your network, put Silo behind [HTTPS](/docs/reverse-proxy).

`PORT`, `JF_PORT`, and `ABS_PORT` also set the ports Silo itself listens on: `8080`, `8096`, and `13378` when they're unset. The Compose files set them to those values on the `silo` service, and inside the container those values take precedence over `.env`. If you pass `.env` to the container another way, such as with `docker run --env-file .env`, the variables are the container side of each published port, for example `-p 13380:13380` for `ABS_PORT=13380`.

If you've changed `ABS_PORT`, check that the `silo` service in your `docker-compose.yml` sets `ABS_PORT: "13378"` under `environment`, below `JF_PORT: "8096"`. Older copies of the file don't. Without that line, Silo listens on your `ABS_PORT` inside the container, where the published port doesn't reach it, so Audiobookshelf apps can't connect. Add the line to the `silo` service.

## Discovery on the local network

Silo announces itself on your network so the Silo apps on Apple and Android devices can list it when someone adds a server, without typing its address. The announcement uses mDNS, which is multicast on UDP port 5353. It works only where multicast reaches Silo, such as Docker with host networking (`network_mode: host`).

The default Compose file uses Docker's bridge network, which doesn't pass multicast, so apps don't list the server and people enter its address instead. The default Compose file isn't set up for host networking.

If people sign in with an HTTPS address, for example through a reverse proxy, set **Local network address** under **Network** in **Admin > Server > General** so their apps can still [switch to the local address at home](/docs/reverse-proxy#other-addresses-clients-use). Enter the Docker host's IP address on your network and the `PORT` value, for example `http://192.168.1.20:8090`, and save. The change applies without a restart. The Android apps find the local address from this setting. With host networking, the Apple apps also find it from the announcement.

To stop announcing the server, turn off **Show on the local network** under **Network** in **Admin > Server > General**, save, and restart Silo. It's on by default.

## NET_ADMIN capability

Both Compose files in the server repository give the `silo` service the `NET_ADMIN` capability with this line:

```yaml
cap_add: [NET_ADMIN]
```

Silo uses it at startup for its [TCP tuning for remote viewers](/docs/configuration#tcp-tuning-for-remote-viewers). It lets Silo use BBR congestion control even where the host doesn't allow `bbr`, and force a larger send buffer when the kernel's limit would slow remote viewers on long, fast links. A proxy node runs the same file and uses it the same way. A transcode node serves no viewers, so it drops the capability at startup without using it.

Compose files from before the line was added don't have it. Silo runs without it, as described in [Run without NET_ADMIN](#run-without-net_admin).

### How Silo limits its use

Before Silo's own code runs, it starts a small helper that holds `NET_ADMIN`, then drops the capability from Silo itself. The helper accepts only those two changes to Silo's own connections, and it exits once Silo's ports are set up. Silo, FFmpeg, ffprobe, and plugins never keep `NET_ADMIN`, and programs Silo starts can't gain it back. In the container, Silo runs as the `silo` account, and the image passes the capability across that switch. If the handover fails, Silo starts without it.

If Silo can't confirm that it dropped the capability, or the helper doesn't start, Silo keeps running and logs a `net admin: capability state` warning with what to do.

### What the capability allows

Whatever holds `NET_ADMIN` can change the container's network interfaces, routes, and firewall rules, and reach more of the kernel's code, such as nf_tables. With `network_mode: host`, that means the host's own network. The helper's limits apply only to Silo. Root processes in the container, such as `docker exec` shells and the container's supervisor, keep the capability for as long as the container runs.

### Run without NET_ADMIN

To remove the capability, delete the `cap_add: [NET_ADMIN]` line and recreate the container with `docker compose up -d`. Silo starts and serves as before:

- BBR still works if the host has loaded the `tcp_bbr` module and allows `bbr` in `net.ipv4.tcp_allowed_congestion_control`. If it doesn't, Silo logs a warning with what to change.
- Silo can't force a larger send buffer. If the kernel's limit is low, Silo logs a `tcp send buffer: listener state` warning on each start with how to raise it.

Deleting the line removes the capability only if nothing else grants it. A container with `privileged: true` has it anyway, and so does Silo run as root without a container.

To get the larger buffer without the capability, raise the kernel's send limit where Silo runs instead. On Docker's default bridge network, add this to the `silo` service:

```yaml
sysctls:
  net.ipv4.tcp_wmem: "4096 16384 67108864"
```

If the runtime refuses this setting, the container doesn't start. Docker refuses it with `network_mode: host`, so set the same value on the host instead, for example in a file under `/etc/sysctl.d/`. With this limit, the kernel keeps sizing each connection's buffer itself, and Silo has nothing to force.

Rootless Docker and Podman give the container `NET_ADMIN` only inside its own user namespace. That can't force send buffers or load kernel modules on the host.

## Data directories

The media mount is read-only. Silo's writable directories live below `SILO_DATA_ROOT`, which defaults to `/opt/silo`:

| Directory | Contents |
| --- | --- |
| `config/silo` | Installed plugins, local artwork, uploads, downloaded subtitles, and compatibility assets |
| `config/postgres` | PostgreSQL files |
| `config/redis` | Redis persistence |
| `config/meilisearch` | Optional search index |
| `transcode` | Temporary transcode output, mounted at `/tmp/silo-transcode` in the container |
| `download-artifacts` | Downloads the main server [prepared](/docs/download-storage) for devices, mounted at `/tmp/silo-download-artifacts` in the container |
| `catalog-seeds` | Catalog seed inputs, mounted read-only by the repository's Compose file |

With [separate containers](#run-the-services-in-separate-containers), `postgres`, `redis`, `meilisearch`, `plugins`, `artwork`, and `compat` sit directly in `SILO_DATA_ROOT` instead of under `config`.

To cap how much space `download-artifacts` takes, set a [storage budget](/docs/download-storage#set-storage-budgets). [Backups](/docs/backup-restore) lists which of these to keep.

## Bundled PostgreSQL

PostgreSQL in the container listens only inside it and has no password: Silo signs in through a local socket as the database's superuser. To open a database shell:

```sh
docker compose exec -u silo silo psql -h /run/postgresql silo
```

[Automatic tuning](/docs/configuration#postgresql-tuning) is on for the bundled database. When it logs that PostgreSQL needs a restart, run `docker compose restart silo`, which restarts PostgreSQL and Silo together. To change a PostgreSQL setting yourself, add a file such as `10-local.conf` to `config/postgres/data/conf.d` and restart the same way. The image rewrites `00-omnibus.conf` in that directory on every start, so don't edit it.

A new image can move to a new PostgreSQL major version. The container then refuses to start on the old data and logs a message such as `/config/postgres/data was written by PostgreSQL 18 but this image ships PostgreSQL 19.` To move the data across:

1. Pin the image you ran before, start it, and [dump the database](/docs/backup-restore#back-up-a-compose-install).
2. Stop the container and rename `config/postgres/data` on the host, for example to `data-old`.
3. Go back to the new image, start it, and [restore the dump](/docs/backup-restore#restore-a-dump-into-the-container).

Keep `data-old` until the server works.

## Optional Meilisearch

Search uses PostgreSQL unless you switch it. To use the Meilisearch in the container, set `ENABLE_MEILISEARCH=true` in `.env` and recreate the container with `docker compose up -d`. Silo connects to it and builds the search index in the background, with no steps in **Admin > Server > Search**. Test a known title once the index is ready.

While it's on, the fields it fills in on **Admin > Server > Search** are greyed out, with a note such as **Managed by SILO_SEARCH_PROVIDER.** To turn it off, remove the line or set it to `false`, and recreate the container. Search goes back to PostgreSQL on that start. From the start after that, you can choose the engine on that page again.

Meilisearch can't open data written by a different version. If it doesn't start after an update moves it to a new version, set `MEILI_UPGRADE_DB=true` in `.env` for one start, then remove it. You can also empty `config/meilisearch/data` and let Silo rebuild the index.

### Meilisearch in a separate container

With [separate containers](#run-the-services-in-separate-containers):

1. Generate a key with `openssl rand -hex 32` and set `MEILI_MASTER_KEY` in `.env`. Keep it private.
2. Start the optional service with `docker compose --profile search up -d`.
3. Open **Admin > Server > Search**. Set **Search engine** to **Meilisearch**, enter `http://meilisearch:7700` as the **Meilisearch URL**, and use the same key as the **Meilisearch API key**.
4. Select **Check Connection**, save, and restart Silo.
5. Silo builds the search index in the background and tries again on its own if a build fails. Test a known title once it finishes.

Starting the container alone does not switch Silo's search engine. Port 7700 is published on the host's loopback address; keep it off the public internet. The file pins the Meilisearch version. To upgrade, change `MEILISEARCH_IMAGE` and set `MEILI_UPGRADE_DB=true` in `.env` for one start, then remove it. You can also empty the `meilisearch` directory and let Silo rebuild the index.

### Check search

To see which engine is answering searches, open **Advanced** on the same page and look under **Search status**. **Answering searches** shows **Meilisearch**, **Meilisearch (keyword only)** while an older index serves keyword results until its replacement is ready, or **Postgres full-text** while Meilisearch can't answer, such as when it's unreachable or has no usable index. **Rebuild index** opens the task that rebuilds the index by hand.

Some settings change the index format, such as **Match by meaning as well as words**. After you save and restart, Silo rebuilds the index on its own, and search keeps working from the older index or PostgreSQL until the new one is ready.

### Connect Meilisearch in `.env`

To connect a Meilisearch server you run yourself without the admin page, add these lines to `.env`, then recreate the container with `docker compose up -d`:

```dotenv
SILO_SEARCH_PROVIDER=meilisearch
SILO_MEILISEARCH_URL=http://meilisearch.example:7700
SILO_MEILISEARCH_API_KEY=your-meilisearch-key
```

Leave `ENABLE_MEILISEARCH` off. Use your server's address, and its master key or a key that can read and write the index. Meilisearch search also needs Redis, which the Compose files turn on. `.env.example` has the same lines, commented out. Silo applies them every time it starts. **Admin > Server > Search** shows the engine and URL in use, and each field set this way is greyed out, with a note such as **Managed by SILO_MEILISEARCH_URL.** To change a field on that page again, remove its line from `.env` and recreate the container. The field keeps the last value.

If a value isn't valid, Silo stops at startup and logs an error that names the variable, such as `invalid SILO_SEARCH_PROVIDER: ...`. The engine must be `postgres` or `meilisearch`, and the URL needs `http://` or `https://` and a host.

If you run more than one API server, give each one the same values, because each applies its own when it starts.

## Hardware transcoding on Linux

The default setup uses the CPU only. For a GPU, uncomment the matching lines in the `silo` service of the repository's Compose file, or add them to your own:

- `devices` passes `/dev/dri` into the container for Intel Quick Sync and Intel or AMD VA-API. The host needs a working device and driver.
- `deploy` requests a GPU through the NVIDIA container runtime. Install the host driver and NVIDIA Container Toolkit first.

The full procedure is in [Set up transcoding](/docs/playback).

## Docker inside an LXC container

If the Docker host is itself an LXC container, such as on Proxmox, bind-mount the LXC's view of `/proc` into each Silo container:

```yaml
volumes:
  - /proc/meminfo:/host/proc/meminfo:ro
  - /proc/stat:/host/proc/stat:ro
  - /proc/loadavg:/host/proc/loadavg:ro
```

Without these, Silo reads the physical machine's CPU, memory, and load instead of the LXC's limits, so the dashboard and [node status](/docs/node-status#load-inside-a-container) show the wrong figures. The repository's Compose files already have these mounts on the `silo` service.

Silo uses each file under `/host/proc` when it's there and its own `/proc` otherwise, with no setting to change. On a bare-metal or VM Docker host the mounts change nothing.

The LXC's load average is correct only when lxcfs runs with load average support (`lxcfs -l`), which is off by default on Proxmox. Without it, the load average stays the physical machine's while CPU and memory are correct.

## Nodes and stop timeouts

[Proxy and transcode nodes](/docs/transcode-nodes) run the same image. A node's host uses the repository's `docker-compose.yml` with `MODE`, `DATABASE_URL`, `REDIS_URL`, and `NODE_URL` in its `.env`, and the container then starts none of its bundled services. The node section of the repository's `.env.example` lists the values.

For nodes on other hosts to reach the main server's bundled PostgreSQL and Redis, set these in the main server's `.env`, then uncomment the two node-access port lines in its `docker-compose.yml` and run `docker compose up -d`:

```dotenv
ENABLE_NODE_ACCESS=true
NODE_ACCESS_HOST=192.168.1.10
POSTGRES_PASSWORD=
REDIS_PASSWORD=
```

Set `NODE_ACCESS_HOST` to the main server's address on your network, and generate each password with `openssl rand -hex 24`. Nodes sign in as `silo` with those passwords. Neither connection is encrypted, so publish the ports only on a network you trust.

Docker asks a container to stop and kills it 10 seconds later unless the service sets a longer `stop_grace_period`. The Compose files set one, so Silo can stop without cutting requests or streams:

- A main server or proxy node gets `2m`. When it's told to stop, Silo fails its [readiness check](/docs/server-health#check-startup) and keeps serving for `SILO_SHUTDOWN_DELAY`, `5s` by default, so a load balancer in front of several servers can send new requests elsewhere. Then it finishes the requests it's already serving. A single server gains nothing from the wait, even behind a reverse proxy, because no other server can take its requests. Set `SILO_SHUTDOWN_DELAY=0` in `.env` to skip it. Selecting **Restart server** in the **Restart required** banner also skips the wait.
- A transcode node needs `SILO_STOP_GRACE_PERIOD=11m` in its `.env`: up to `10m` for the node to [drain](/docs/transcode-nodes#maintain-a-node) (`SILO_NODE_DRAIN_TIMEOUT`), and a minute for the shutdown after it. If you change the drain timeout, set `SILO_STOP_GRACE_PERIOD` to the new value plus a minute.

For external PostgreSQL or Redis and PostgreSQL tuning, see [Server configuration](/docs/configuration).
