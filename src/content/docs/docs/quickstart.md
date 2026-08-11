---
title: Quickstart
description: Install Silo with the official Docker Compose stack.
---

Silo's recommended install is the official Docker Compose stack. Compose runs Silo, PostgreSQL,
Redis, and FFmpeg together; you do not install those dependencies separately.

## 1. Install Docker and Docker Compose

Install [Docker Engine](https://docs.docker.com/engine/install/) on Linux, or
[Docker Desktop](https://docs.docker.com/desktop/) on macOS or Windows. Linux operators also need
the [Docker Compose plugin](https://docs.docker.com/compose/install/linux/).

Verify both commands before continuing:

```sh
docker --version
docker compose version
```

Silo requires Compose 2.24 or newer (`docker compose`), not the legacy `docker-compose` command.

## 2. Get the Compose file

From a clone of the [`silo-server`](https://github.com/Silo-Server/silo-server) repository:

```sh
cp .env.example .env
printf '\nPOSTGRES_PASSWORD=%s\nSECRET_KEY=%s\n' \
  "$(openssl rand -hex 24)" "$(openssl rand -base64 48)" >> .env
```

Or download only the two files needed for an install:

```sh
mkdir silo && cd silo
curl -fsSLO https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/.env.example -o .env
printf '\nPOSTGRES_PASSWORD=%s\nSECRET_KEY=%s\n' \
  "$(openssl rand -hex 24)" "$(openssl rand -base64 48)" >> .env
```

These commands replace the template's development database password and generate the key that
protects credentials stored by Silo. Back up `.env` separately from your PostgreSQL backups;
losing `SECRET_KEY` makes encrypted credentials unrecoverable.

## 3. Set your media path

Edit `.env` and set `MEDIA_ROOT` to the host directory containing your media:

```dotenv
MEDIA_ROOT=/srv/media
```

Keep `MEDIA_CONTAINER_ROOT=/mnt/media` unless you are migrating an existing install whose saved
library paths use a different container path. Movies, shows, music, audiobooks, and ebooks can all
live anywhere below the same media root; books do not need a separate Docker mount.

## 4. Start Silo

```sh
docker compose up -d
docker compose ps
```

The default stack starts PostgreSQL, Redis, and the integrated Silo service. Open
`http://localhost:8090` when the `silo` container is healthy.

Jellyfin-compatible access is disabled until an administrator enables it during setup or under
Admin Settings. The Audiobookshelf-compatible service uses port `13378`.

## 5. Finish setup in the browser

The setup wizard follows this order:

1. Create the first admin account.
2. Create the first household profile.
3. Review server, playback, storage, and optional Jellyfin-compatible settings.
4. Configure optional subtitle integrations, downloads, and recommendations.
5. Add a library using its container path, such as `/mnt/media/movies`, and leave **Scan after creating** enabled.
6. Finish setup; add separate proxy or transcode nodes only for a distributed deployment.

Only account and profile creation are required. The other steps can be skipped and revisited in
the admin UI. See [First configuration](/docs/first-configuration) for the settings worth reviewing
after the first scan.

## Optional Meilisearch

PostgreSQL full-text search is the default and requires no extra service. To run the optional
Meilisearch container, add a key to `.env` and start the `search` profile:

```sh
printf '\nMEILI_MASTER_KEY=%s\n' "$(openssl rand -hex 32)" >> .env
docker compose --profile search up -d
```

Then open **Admin > Settings > Search**, choose **Meilisearch**, set the URL to
`http://meilisearch:7700`, enter the same key as the API key, test the connection, and save. Silo
requires a restart when the provider changes, so run `docker compose restart silo`, return to the
Search page, and rebuild the catalog search index. Silo falls back to PostgreSQL search if
Meilisearch is unavailable.

## PostgreSQL configuration

No `postgresql.conf` download or manual database tuning is required. The Compose stack starts
PostgreSQL with pgvector, and Silo applies its automatic PostgreSQL recommendations through
`ALTER SYSTEM`. Advanced operators can disable this with `POSTGRES_TUNE=off`.

## Source notes

- Official stack: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- Environment template: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example).
- Published image workflow: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml).
- Setup wizard order: [`useWizardSteps.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/useWizardSteps.ts).
- PostgreSQL auto-tuning: [`postgres_tune.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/database/postgres_tune.go).
