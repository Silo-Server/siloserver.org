---
slug: docs/install
title: Install Silo Server
description: Start a new server with Docker Compose, add a library, and check playback.
---

Set up a new server, add a small movie or series library, and play your first
item in the browser. This walkthrough uses Docker Compose on Linux.

## What you need

- A Linux x86-64 or arm64 host with permission to run Docker containers.
- A folder of media files the host can read. Start with a few familiar files.
- Persistent disk space for the database, artwork, and temporary transcodes.
- A browser on the same network.
- Internet access on the host. Silo downloads its default metadata plugins on
  first start, and scans use them to find posters and descriptions.

You do not need a GPU to start, but converting video can put heavy load on the
CPU. For hardware and storage choices, see
[Requirements and installation options](/docs/requirements).

:::caution[Before you start]
This is the current prerelease setup. The `latest` image changes over time and is not a fixed 1.0 release. Use a new data directory and keep setup on your private network until you have created the admin account. For an existing server, use the [update guide](/docs/updates).
:::

## 1. Install Docker and Docker Compose

Install [Docker Engine](https://docs.docker.com/engine/install/) and the [Compose plugin](https://docs.docker.com/compose/install/linux/). Use Compose 2.24 or newer; `docker compose version` shows yours. Silo's image includes FFmpeg, PostgreSQL, and Redis, so the whole server runs in one container.

## 2. Create the Compose file

Run these commands in a directory where `silo` does not already exist:

```sh
mkdir silo && cd silo
touch .env && chmod 600 .env
```

Create `docker-compose.yml` in the new directory with this content:

```yaml
services:
  silo:
    image: ${SILO_OMNIBUS_IMAGE:-ghcr.io/silo-server/silo-server:latest}
    restart: unless-stopped
    stop_grace_period: 2m
    cap_add: [NET_ADMIN]
    env_file: .env
    environment:
      PORT: "8080"
      JF_PORT: "8096"
      ABS_PORT: "13378"
      ENABLE_REDIS: ${ENABLE_REDIS:-true}
    ports:
      - "${PORT:-8090}:8080"
      - "${JF_PORT:-8096}:8096"
      - "${ABS_PORT:-13378}:13378"
    volumes:
      - ${SILO_DATA_ROOT:-/opt/silo}/config:/config
      - ${MEDIA_ROOT:?Set MEDIA_ROOT in .env}:${MEDIA_CONTAINER_ROOT:-/mnt/media}:ro
      - ${SILO_DATA_ROOT:-/opt/silo}/transcode:/tmp/silo-transcode
      - ${SILO_DATA_ROOT:-/opt/silo}/download-artifacts:/tmp/silo-download-artifacts
    # Intel or AMD GPU: remove the "# " from the two lines below.
    # devices:
    #   - /dev/dri:/dev/dri
```

The `PORT`, `JF_PORT`, and `ABS_PORT` lines keep Silo's ports inside the container fixed, so a value in `.env` changes only the port on the host. If `ls /dev/dri` on the host lists a render device, such as `renderD128`, you can uncomment the `devices` lines now and turn on acceleration later, as in [Set up transcoding](/docs/playback). If you use an NVIDIA GPU, add the NVIDIA lines from [Give the container access to your GPU](/docs/playback#give-the-container-access-to-your-gpu) instead, after installing the NVIDIA Container Toolkit. The server repository's [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) is the same file with more options, commented out, for GPUs and [transcode nodes](/docs/transcode-nodes). You can download it instead. The [Docker reference](/docs/docker) explains each line.

## 3. Fill in `.env`

Generate a secret key:

```sh
openssl rand -base64 48
```

Open `.env` in a text editor and add these lines, with the key in place of the example:

```dotenv
SECRET_KEY=replace-with-the-generated-key
MEDIA_ROOT=/srv/media
SILO_DATA_ROOT=/opt/silo
PUID=1000
PGID=1000
TZ=Etc/UTC
```

- `SECRET_KEY` encrypts what Silo stores in its database, such as API keys for other services, storage keys, and the key that keeps people signed in.
- `MEDIA_ROOT` is the host directory containing your media. Silo sees it at `/mnt/media`, so `/srv/media/movies` on the host becomes `/mnt/media/movies` in Silo. The mount is read-only, so Silo cannot alter your media through it.
- `SILO_DATA_ROOT` holds the database, artwork, and temporary transcodes. Use `/opt/silo` only if it is not already used by another installation, and choose a disk with space for all three in addition to your media.
- `PUID` and `PGID` are the account Silo runs as. Use an account that can read your media; `id -u` and `id -g` print your own.

:::caution[Save your secret key now]
Store a copy of `SECRET_KEY` in a safe place, such as a password manager, and keep it apart from your database backups. Silo needs this exact key every time it starts on your database, including after a restore or a move to another host.

If the key is lost or changed, Silo stops at startup with a `loading settings: decrypt setting ...` error, and there's no supported way to recover. Getting the server running again means starting over with a new, empty database: accounts, profiles, watch history, and settings are gone, libraries have to be added and scanned again, and everyone needs a new account to sign in to their apps. Your media files aren't affected.
:::

## 4. Start Silo

From the new `silo` directory:

```sh
docker compose config --quiet
docker compose up -d
docker compose ps
```

The first command should finish without an error. `docker compose ps` lists `silo` with a health status. It shows `starting` until Silo's web server answers, then `healthy`. The first start creates the database, which can take a while, and Silo can show `unhealthy` until it finishes. Run `docker compose logs -f silo` to watch progress, and don't restart it while it works. If the log says `uid 1000 cannot read /mnt/media/...`, set `PUID` and `PGID` to an account that can, then run `docker compose up -d` again.

When Silo is healthy, check that it is ready:

```sh
curl --fail http://localhost:8090/api/v1/ready
```

A ready server returns `{"status":"ok"}`. For any other answer, see [Check server health](/docs/server-health#check-startup).

On each start, Silo installs the official TMDB, TVDB, and TheIntroDB plugins from the plugin catalog if they are missing. If the host had no internet access, restart Silo once it does.

Open `http://localhost:8090` on the server, or `http://SERVER-IP:8090` from another computer on your network. Replace `SERVER-IP` with the Docker host's LAN address.

## 5. Finish setup in the browser

1. Create the admin account with your username, email, and password. Create your first profile if asked.
2. Give the server a name. Leave playback settings at their defaults for the first test.
3. At **Storage**, leave **Automatic** selected for a single-host install. With no S3 bucket, it uses local disk. If you want S3, set it up now: after the first scan, changing storage means a [storage transition](/docs/s3-storage#change-storage-later).
4. At **Libraries**, enter a name, choose **Movies** or **Series**, and add the container path. For example, use `/mnt/media/movies`. Select **Add library**, then continue.
5. Skip subtitle services, app integrations, and other optional features you do not need yet. Finish the wizard.

Open **Admin > Libraries** to check the scan. If it has not started, use that library's **Scan** action. For missing posters or descriptions, check the library's metadata providers using [Add and manage libraries](/docs/manage-libraries).

## 6. Play one item

Open your library in the web app, choose an item, and select **Play**. Check that sound works, seek forward, stop, and resume it.

Then [connect your usual device](/docs/connect-and-watch) using the
same server address and repeat the playback check. Use your own account;
invite other people with their own accounts later.

## Before relying on the server

Set up [backups](/docs/backup-restore), check that your copy of `SECRET_KEY`
matches the one in `.env`, and note your data paths and any external storage. Give each person their own account: your admin password
controls the server, not just what you can watch.

## What to set up next

Your first setup is complete when playback works. Choose only what you need next:

| Your next task | Guide |
| --- | --- |
| Invite someone | [Accounts and invitations](/docs/manage-accounts) |
| Add another library | [Libraries](/docs/manage-libraries) |
| Correct a title or poster | [Metadata and artwork](/docs/metadata) |
| Pick up new files on a network share | [Autoscan](/docs/autoscan#autoscan-sources) |
| Reduce CPU load during playback | [Transcoding](/docs/playback) |
| Use Silo away from home | [Secure external access](/docs/reverse-proxy) |
| Investigate a failure | [Server health](/docs/server-health) |

Notifications, AI providers, and remote workers can wait until you need them.

The container includes PostgreSQL with pgvector and tunes it automatically, so
you don't need a `postgresql.conf`. Search uses PostgreSQL by default; turn on
the bundled [Meilisearch](/docs/docker#optional-meilisearch) only if you want a
separate search service.
