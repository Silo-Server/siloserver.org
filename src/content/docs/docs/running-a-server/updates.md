---
slug: docs/updates
title: Update Silo safely
description: Back up, pull the new image, and check the server after an update.
---

Update during a quiet period and tell users that playback will stop briefly.

## Before you update

1. Read the release notes for the version you are moving to, including anything about remote nodes and plugins.
2. [Back up](/docs/backup-restore#back-up-a-compose-install) the database, `.env`, and data directories, and record the image you are running:

   ```sh
   docker compose images silo
   ```

   Keep that output. `latest` won't identify the old image once you've pulled a new one.
3. Let active playback and downloads finish.
4. If `docker compose ps` lists `postgres` and `redis` beside `silo`, read [If your server runs PostgreSQL and Redis in their own containers](#if-your-server-runs-postgresql-and-redis-in-their-own-containers) first.
5. If people sign in to Seerr with their Silo accounts and you haven't [relinked them](/docs/third-party-access#relink-users-after-the-user-id-change) yet, read that section first. Some setups need Seerr stopped before the update.

## Update with Docker Compose

Published images are tagged `latest`, `build-N`, and the full commit SHA (see [image tags](/docs/docker#image-and-tags)). If you pinned the image in `.env` with `SILO_OMNIBUS_IMAGE`, or `SILO_IMAGE` with separate containers, change it to the new tag first. Keep your existing `.env`; don't replace it with the latest example.

From the directory that holds your Compose file:

```sh
docker compose pull silo
docker compose up -d --no-deps silo
docker compose logs -f silo
```

Recreating the container restarts the PostgreSQL and Redis inside it along with Silo. With [separate containers](/docs/docker#run-the-services-in-separate-containers), `--no-deps` replaces only the Silo container and leaves PostgreSQL and Redis running.

With `docker run`, pull the new image, then remove the container and start it again with the same command:

```sh
docker pull ghcr.io/silo-server/silo-server:latest
docker stop silo && docker rm silo
```

Silo applies database migrations as it starts, before it answers requests. A large migration can take a while, and `docker compose ps` can show Silo as `unhealthy` until it finishes. Watch the logs and don't restart the container during a migration: that abandons the run, and the next start can wait while PostgreSQL still holds the abandoned run's locks.

Migrations stop after 20 minutes by default. For a very large library, or when the release notes say a migration rewrites large tables, set a longer limit in `.env` before updating, for example `SILO_MIGRATE_TIMEOUT=60m`. `0` removes the limit. A table rewrite also needs free space on the database disk for a second copy of each rewritten table and its indexes, so check it before updating.

## After the update

- Check [health and readiness](/docs/server-health#check-startup).
- Sign in as an admin and as a normal account.
- Open a library, load artwork, start playback, seek, stop, and resume.
- Test the integrations and remote nodes you use.

Keep the backup until these checks pass.

If an update moves the bundled Meilisearch to a new version and it doesn't start, set `MEILI_UPGRADE_DB=true` in `.env` for one start, then remove it. A move to a new PostgreSQL major version needs a dump and restore; see [Bundled PostgreSQL](/docs/docker#bundled-postgresql).

An update doesn't change your Compose file. If yours is older than the [`NET_ADMIN` capability](/docs/docker#net_admin-capability) line, Silo runs without it. If the kernel's send limit is low, Silo logs a `tcp send buffer: listener state` warning on each start, with how to fix it. The warning doesn't stop Silo. Before you add the line, read [what the capability allows](/docs/docker#what-the-capability-allows).

## If the update fails

Stop and keep the logs. Switching back to the old image doesn't undo migrations, so don't alternate old and new images against the same database.

To see which migrations ran:

```sh
docker compose exec silo /command/s6-envdir /run/s6/container_environment \
  /command/s6-setuidgid silo silo --migrate-status
```

The reliable way back is to restore the pre-update backup with the old image, as in [Test a restore](/docs/backup-restore#test-a-restore). For a build from before PostgreSQL and Redis moved into the image, pin its `build-N-aio` tag. That loses every change made after the backup. [Ask for help](/docs/report-a-problem) before changing the database by hand.

## If your server runs PostgreSQL and Redis in their own containers

Servers installed before Silo moved to one container run PostgreSQL, Redis, and optionally Meilisearch in containers of their own. Silo's image now bundles those services, and with your Compose file it leaves them off and keeps using your containers and data. It does change two things for Silo itself: it runs as the account `PUID` and `PGID` name instead of root, and on its first start it gives the `plugins`, `artwork`, `compat`, `transcode`, and `download-artifacts` directories to that account. Before your next update:

1. Set `PUID` and `PGID` in `.env` to an account that can read your media, such as the one that owns it. `id -u` and `id -g` print your own. Without them, Silo runs as uid `911`.
2. If your Compose file sets `user:` on the `silo` service, remove it. The container has to start as root to switch to that account.
3. Keep your Compose file. If you replace it with the repository's current files, for example with `git pull` in a clone, use [`docker-compose.split.yml`](/docs/docker#run-the-services-in-separate-containers): set `COMPOSE_FILE=docker-compose.split.yml` in `.env`, and carry over your own changes, such as GPU lines.

:::caution
Don't start the repository's `docker-compose.yml` on this server's data. It doesn't look for your existing install: Silo comes up on a new, empty database with first-run setup open to anyone who reaches the server, while your old `postgres` and `redis` containers keep running. If you already did, run `docker compose down`, select `docker-compose.split.yml` as above, and run `docker compose up -d`. Your data is still in the old directories. Move aside the `config` directory the new container created before you [move into one container](#move-into-one-container) later.
:::

After the update, check that your libraries still scan. A library whose folders the new account can't read stays as it was, and the log names the folder.

### Move into one container

A command in the image moves a server with separate containers into the single container. It copies the database, links Silo's directories into `config/silo`, and leaves the old directories as they were, so the old Compose file still starts on them. Redis and Meilisearch data stay behind: Silo doesn't need Redis's data, and it builds a new search index.

Before you move, [back up](/docs/backup-restore#back-up-a-compose-install) the server, then prepare the directory that holds your Compose file:

1. Download the repository's [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) and [`docker-compose.split.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.split.yml) there, and carry over your own changes, such as GPU lines.
2. In `.env`, set `PUID` and `PGID` as described above. Remove any `DATABASE_URL`, `REDIS_URL`, `SILO_SEARCH_PROVIDER`, `SILO_MEILISEARCH_URL`, and `SILO_MEILISEARCH_API_KEY` lines that point at the old containers. To keep using Meilisearch, set `ENABLE_MEILISEARCH=true`.
3. If `.env` pins `SILO_IMAGE`, remove that line to follow `latest`, or set `SILO_OMNIBUS_IMAGE` to the image to run. For a build from before Silo moved to one container, that's its `build-N-aio` tag.
4. Remove anything in `docker-compose.override.yml` that changes the `postgres`, `redis`, or `meilisearch` services. Compose rejects `docker-compose.yml` while the override still names them.
5. If you use transcode or proxy nodes, turn on [node access](/docs/docker#nodes-and-stop-timeouts) in `.env` and uncomment its port lines.

Remove `COMPOSE_FILE` from `.env` if you set it. Then stop the old containers and run the move, with your `SILO_DATA_ROOT` in place of `/opt/silo`:

```sh
docker compose -f docker-compose.split.yml down
docker compose run --rm -v /opt/silo:/silo-data \
  --entrypoint /etc/silo-omnibus/migrate-compose-stack silo
docker compose up -d
```

The command checks the install before it copies anything. If something is in the way, such as a setting from step 2 or too little free space for a second copy of the database, it stops with a message that says what to change, and you can run it again. Running it again after a successful move reports that there is nothing to do.

The first start rebuilds some database indexes, so it takes longer on a large library. Sign in with your usual account and check your libraries, artwork, watch progress, and playback.

To go back, run `docker compose down`, set `COMPOSE_FILE=docker-compose.split.yml` again, and run `docker compose up -d`. The single container's copy is then out of date. To move again later, move the `config` directory aside first. Once the single container works, delete the old `postgres`, `redis`, `meilisearch`, `plugins`, `artwork`, and `compat` directories yourself.

## Moving from alpha to 1.0

Existing alpha servers will update in two steps: first to a final bridge release, then to 1.0. The bridge finishes the older database migrations, and 1.0 refuses to start on a database that hasn't reached it. When 1.0 ships, follow its published update instructions. The plan is in the server's [1.0 update notes](https://github.com/Silo-Server/silo-server/blob/main/docs/update-to-1.0.md).

What to expect:

- Plan one maintenance window for the whole setup. Don't run alpha and 1.0 servers or nodes at the same time.
- Have the matching 1.0 app builds ready for your devices.
- Playback, download, callback, and integration URLs created by the alpha server stop working. Create new ones from the 1.0 server and update external services such as autoscan and webhook senders. Don't edit old URLs by hand.
- Health checks keep their addresses, `/api/v1/health` and `/api/v1/ready`.
