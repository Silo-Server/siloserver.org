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

Install [Docker Engine](https://docs.docker.com/engine/install/) and the [Compose plugin](https://docs.docker.com/compose/install/linux/), then check that Docker is running:

```sh
docker info
docker compose version
```

Use Compose 2.24 or newer. The server image includes FFmpeg; the Compose stack supplies PostgreSQL and Redis.

## 2. Get the Compose file

Run these commands in a directory where `silo` does not already exist. Stop if a command fails.

```sh
mkdir silo &&
cd silo &&
curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml -o docker-compose.yml &&
curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/.env.example -o .env &&
chmod 600 .env
```

The `latest` image is built from `main`, so these files match it.

Generate two different values:

```sh
openssl rand -hex 24
openssl rand -base64 48
```

Open `.env` in a text editor. Set `POSTGRES_PASSWORD` to the first result and `SECRET_KEY` to the second. Remove the `#` from those lines. Do not leave the example passwords in place or add duplicate entries.

Keep a secure copy of `SECRET_KEY` separate from your database backups. Silo needs the same key to read stored credentials after a restart or restore.

## 3. Set your media path

In `.env`, set the host path containing your media and an unused path for Silo's own data:

```dotenv
MEDIA_ROOT=/srv/media
MEDIA_CONTAINER_ROOT=/mnt/media
SILO_DATA_ROOT=/opt/silo
```

Replace `/srv/media` with your real media directory. Use `/opt/silo` only if it is not already used by another installation. The data disk needs space for the database, artwork, and temporary transcodes, in addition to your media.

Keep `/mnt/media` as the container path. For example, `/srv/media/movies` on the host becomes `/mnt/media/movies` in Silo. The default mount is read-only, so Silo cannot alter your media through it.

## 4. Start Silo

From the new `silo` directory:

```sh
docker compose config --quiet
docker compose up -d
docker compose ps
```

The first command should finish without an error. `docker compose ps` lists `postgres`, `redis`, and `silo`, each with a health status. Silo shows `starting` until its web server answers, then `healthy`. The database setup on first start can take a while, and Silo can show `unhealthy` until it finishes. Run `docker compose logs -f silo` to watch progress, and don't restart it while it works.

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

Set up [backups](/docs/backup-restore) and note your data paths and any
external storage. Give each person their own account: your admin password
controls the server, not just what you can watch.

## What to set up next

Your first setup is complete when playback works. Choose only what you need next:

| Your next task | Guide |
| --- | --- |
| Invite someone | [Accounts and invitations](/docs/manage-accounts) |
| Add another library | [Libraries](/docs/manage-libraries) |
| Correct a title or poster | [Metadata and artwork](/docs/metadata) |
| Pick up new files automatically | [Autoscan](/docs/autoscan) |
| Reduce CPU load during playback | [Transcoding](/docs/playback) |
| Use Silo away from home | [Secure external access](/docs/reverse-proxy) |
| Investigate a failure | [Server health](/docs/server-health) |

Notifications, AI providers, and remote workers can wait until you need them.

The stack includes PostgreSQL with pgvector and tunes it automatically, so you
don't need a `postgresql.conf`. Search uses PostgreSQL by default; add
[Meilisearch](/docs/docker#optional-meilisearch) only if you want a separate
search service.
