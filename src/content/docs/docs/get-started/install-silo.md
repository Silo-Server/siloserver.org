---
title: Install Silo and play your first item
description: Start a new server with Docker Compose, add a library, and check playback.
---

Use this guide for a new Silo installation on a Linux host. You need Docker, a media folder the host can read, and a browser on the same network. [Check the requirements](/docs/get-started/installation-options) first if you are choosing hardware.

:::caution[Before you start]
This is the current prerelease setup. The `latest` image changes over time; it is not a fixed 1.0 release. Use a new data directory and keep setup on your private network until you have created the admin account. For an existing server, use the [update guide](/docs/running-a-server/updates).
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
curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/d2596927/docker-compose.yml -o docker-compose.yml &&
curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/d2596927/.env.example -o .env &&
chmod 600 .env
```

These files come from the source revision used for this guide. The image selected by `.env` still follows `latest`.

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

The first command should finish without an error. The last should show the three services running, with PostgreSQL and Redis healthy. Silo itself has no Compose healthcheck; check readiness separately:

```sh
curl --fail http://localhost:8090/api/v1/ready
```

Look for `status: ok` in the JSON response. A `degraded` response can still return HTTP 200 and needs a storage check. If startup is still in progress, wait and try again. If it keeps failing, run `docker compose logs --tail 100 silo` and use [server health help](/docs/running-a-server/server-health).

Open `http://localhost:8090` on the server, or `http://SERVER-IP:8090` from another computer on your network. Replace `SERVER-IP` with the Docker host's LAN address.

## 5. Finish setup in the browser

1. Create the admin account with your username, email, and password. Create your first profile if asked.
2. Give the server a name. Leave playback settings at their defaults for the first test.
3. At **Storage**, keep local artwork storage for a single-host install. Choose storage before scanning: the artwork location locks after the first write.
4. At **Libraries**, enter a name, choose **Movies**, **Series**, or **Audiobooks**, and add the container path. For example, use `/mnt/media/movies`. Select **Add library**, then continue.
5. Skip subtitle services, app integrations, and other optional features you do not need yet. Finish the wizard.

Open **Admin > Libraries** to check the scan. If it has not started, use that library's **Scan** action. For missing posters or descriptions, check the library's metadata providers using [Add and manage libraries](/docs/running-a-server/libraries).

## 6. Play one item

Open your library in the web app, choose an item, and select **Play**. Check that sound works, seek forward, stop, and resume it. An item appearing in the library does not prove that the server can play its file.

Then [connect a phone, tablet, or TV](/docs/get-started/choose-an-app) using the same server address. Use your own account for this check; invite other people with their own accounts later.

Save the server version and image identity with your installation notes:

```sh
docker compose images
docker image inspect ghcr.io/silo-server/silo-server:latest --format '{{json .RepoDigests}}'
```

Next: [After installation](/docs/running-a-server/after-installation).

## Optional Meilisearch

The default PostgreSQL search needs no extra setup. Add [Meilisearch](/docs/running-a-server/docker#optional-meilisearch) only if you want a separate search service.

## PostgreSQL configuration

The Compose stack includes pgvector and automatic PostgreSQL tuning. You do not need a separate `postgresql.conf` for this setup. See [configuration](/docs/running-a-server/configuration) when using an external database.
