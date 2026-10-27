---
slug: docs/omnibus
title: Run Silo in one container
description: Run Silo, PostgreSQL, and optional Redis and Meilisearch in a single container with the omnibus image.
---

The omnibus image runs Silo and PostgreSQL in one container, and can start Redis and Meilisearch in it too. Use it when you want a single container instead of the [Compose stack](/docs/install), for example on a NAS or from a container app catalog.

It always runs one server that does everything: web app, API, scanning, and playback. To add [transcode nodes](/docs/transcode-nodes) or a separate proxy, use the Compose stack instead.

## Image and tags

The image is `ghcr.io/silo-server/silo-server` with `-omnibus` added to each [regular tag](/docs/docker#image-and-tags), such as `latest-omnibus` and `build-N-omnibus`. It's built for Linux x86-64 and arm64, and runs the same Silo as the regular image of the same build.

## Start with docker run

1. Generate a secret key and keep a copy somewhere safe, separate from your backups:

   ```sh
   openssl rand -base64 48
   ```

   Silo encrypts stored credentials with it. Without the same key, a restored server can't read them.

2. Create an empty directory for Silo's data, such as `/opt/silo/config`.

3. Start the container. Replace the key, the media path `/srv/media`, and the `PUID` and `PGID` values:

   ```sh
   docker run -d --name silo \
     --restart unless-stopped \
     --stop-timeout 120 \
     -e PUID=1000 -e PGID=1000 \
     -e TZ=Etc/UTC \
     -e SECRET_KEY='your-secret-key' \
     -p 8090:8080 -p 8096:8096 -p 13378:13378 \
     -v /opt/silo/config:/config \
     -v /srv/media:/mnt/media:ro \
     ghcr.io/silo-server/silo-server:latest-omnibus
   ```

   Set `PUID` and `PGID` to an account on the host that can read your media; `id -u` and `id -g` print your own. Your media appears in Silo under `/mnt/media`, so `/srv/media/movies` on the host becomes `/mnt/media/movies` when you add a library.

4. Watch the first start with `docker logs -f silo`. It creates the database, which can take a while.

5. Open `http://SERVER-IP:8090` and [finish setup in the browser](/docs/install#5-finish-setup-in-the-browser).

`--stop-timeout 120` gives the container two minutes to stop. Docker otherwise kills a container 10 seconds after asking it to stop, which cuts off the requests Silo is finishing and PostgreSQL's shutdown after them.

Transcodes and prepared downloads go to `/tmp` inside the container and are lost when the container is recreated. To keep them, also mount host directories at `/tmp/silo-transcode` and `/tmp/silo-download-artifacts`.

For a GPU, pass it into the container as [Set up transcoding](/docs/playback) describes. The image gives Silo access to the devices you pass in.

## Start with Docker Compose

The server repository has a Compose file for the omnibus image. Use it on its own, not together with `docker-compose.yml`. It needs Compose 2.24 or newer.

1. In a new directory, download the file:

   ```sh
   curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.omnibus.yml -o docker-compose.omnibus.yml
   ```

2. Create a `.env` file beside it, readable only by you (`chmod 600 .env`):

   ```dotenv
   SECRET_KEY=your-secret-key
   MEDIA_ROOT=/srv/media
   SILO_DATA_ROOT=/opt/silo
   PUID=1000
   PGID=1000
   ```

   Generate `SECRET_KEY` with `openssl rand -base64 48` and keep a copy separate from your backups. `SECRET_KEY` and `MEDIA_ROOT` are required. `PUID` and `PGID` default to `1000` in this file.

3. Start it:

   ```sh
   docker compose -f docker-compose.omnibus.yml up -d
   ```

The file keeps Silo's data in `config` below `SILO_DATA_ROOT`, and mounts `transcode`, `download-artifacts`, and `catalog-seeds` beside it, as the regular stack does. It also has the [LXC mounts](/docs/docker#docker-inside-an-lxc-container) and a two-minute stop timeout. `PORT`, `JF_PORT`, and `ABS_PORT` in `.env` change the host ports, as described in [Ports](/docs/docker#ports).

The commands below use `docker exec` with the container name `silo`. With Compose, use `docker compose -f docker-compose.omnibus.yml exec` and the service name `silo` instead, and add `-T` when a command reads or writes a file.

## What runs in the container

Each service runs under its own account and keeps its data in its own directory under `/config`:

| Service | Account | Data | Listens on |
| --- | --- | --- | --- |
| Silo | `silo`, with the `PUID` and `PGID` you set | `/config/silo` | Ports 8080, 8096, and 13378 |
| PostgreSQL 18 | `postgres`, uid 999 | `/config/postgres` | Inside the container only |
| Redis, when turned on | `redis`, uid 998 | `/config/redis` | `127.0.0.1:6379` inside the container |
| Meilisearch, when turned on | `meilisearch`, uid 997 | `/config/meilisearch` | `127.0.0.1:7700` inside the container |

On the host, the PostgreSQL, Redis, and Meilisearch directories belong to uids 999, 998, and 997. Leave their ownership as it is. The container sets the owner of `/config/silo` to `PUID` and `PGID` each time it starts.

`PUID` can't be 999, 998, or 997. If it is, the container stops with an error such as `PUID 999 is already used by the postgres account in this image; choose another uid`.

## Environment

Set these with `-e` or in `.env`. The other variables in [Server configuration](/docs/configuration) work as they do with the regular image.

| Variable | Default | What it does |
| --- | --- | --- |
| `SECRET_KEY` | None, required | Encrypts stored credentials |
| `PUID`, `PGID` | `911` | The account that runs Silo and reads your media |
| `ENABLE_REDIS` | `false` | Starts the [bundled Redis](#turn-on-redis) |
| `ENABLE_MEILISEARCH` | `false` | Starts the [bundled Meilisearch](#turn-on-meilisearch) and connects Silo's search to it |
| `MEILI_MASTER_KEY` | Generated | Meilisearch's key. Without it, the image generates one on first start and keeps it in `/config/meilisearch/master-key`. |
| `DATABASE_URL` | Bundled PostgreSQL | An external database. The bundled PostgreSQL doesn't start. |
| `REDIS_URL` | None | An external Redis. The bundled Redis doesn't start, even with `ENABLE_REDIS=true`. |
| `POSTGRES_TUNE_MEMORY_BUDGET_PERCENT` | `50` | Share of the container's memory that [automatic tuning](/docs/configuration#postgresql-tuning) gives PostgreSQL. It's lower than the regular `75` because Silo shares the container. |
| `FILE__<NAME>` | None | Reads the variable `<NAME>` from a file, such as `FILE__SECRET_KEY=/run/secrets/silo_secret_key` for a Docker secret |

The image doesn't support `MODE` values other than `integrated`. It logs a warning if you set one.

## Turn on Redis

Redis is optional for a single server. To use the bundled one, set `ENABLE_REDIS=true` and recreate the container. It listens only inside the container and saves its data to `/config/redis`. A `redis.conf` in `/config/redis` replaces all of the image's Redis settings.

## Turn on Meilisearch

Search uses PostgreSQL unless you switch it. To use the bundled Meilisearch, set `ENABLE_MEILISEARCH=true` and recreate the container. Silo connects to it and builds the search index in the background, with no steps in **Admin > Server > Search**. To check that the index is ready, open **Advanced** on that page and look under **Search status**, as described in [Optional Meilisearch](/docs/docker#optional-meilisearch).

While the bundled Meilisearch is on, the image sets `SILO_SEARCH_PROVIDER`, `SILO_MEILISEARCH_URL`, and `SILO_MEILISEARCH_API_KEY`. The fields they control in **Admin > Server > Search** are greyed out, with a note such as **Managed by SILO_SEARCH_PROVIDER.** If you set one of these variables yourself, the image uses your value.

To turn it off, set `ENABLE_MEILISEARCH=false` and recreate the container. On that start, search switches back to PostgreSQL. From the start after that, you can choose the search engine in **Admin > Server > Search** again.

To use your own Meilisearch server, leave `ENABLE_MEILISEARCH` off and connect it in **Admin > Server > Search**.

Meilisearch can't open data written by a different version. If it doesn't start after an update moves it to a new version, set `MEILI_UPGRADE_DB=true` for one start, then remove it. You can also empty `/config/meilisearch/data` and let Silo rebuild the index.

## Use the bundled PostgreSQL

PostgreSQL accepts connections only from inside the container and has no password: the `silo` account signs in as PostgreSQL's superuser. To open a database shell:

```sh
docker exec -it -u silo silo psql -h /run/postgresql silo
```

To change a PostgreSQL setting, put it in `/config/postgres/data/conf.d/10-local.conf`, then restart the container with `docker restart silo`. The image rewrites `00-omnibus.conf` in the same directory on every start, so don't edit that file. [Automatic tuning](/docs/configuration#postgresql-tuning) applies after your file, so for a setting it also tunes, the tuned value wins. Set `POSTGRES_TUNE=off` to manage those settings yourself.

When automatic tuning logs a `postgres restart required to finish applying auto-tuned settings` warning, restart the container once with `docker restart silo`. That restarts PostgreSQL and Silo together.

### After a PostgreSQL major version change

The image refuses to start on a database written by a different PostgreSQL major version, and logs a message such as `/config/postgres/data was written by PostgreSQL 17 but this image ships PostgreSQL 18.` Move the database across with a dump:

1. Start the image you ran before and dump the database:

   ```sh
   docker exec -u silo silo pg_dump -h /run/postgresql -Fc silo > silo.dump
   ```

2. Stop the container and rename `/config/postgres/data` on the host, for example to `data-old`.
3. Start the new image. It creates an empty database.
4. Restore the dump into it:

   ```sh
   docker exec -i -u silo silo pg_restore -h /run/postgresql -d silo --clean --if-exists --no-owner < silo.dump
   ```

5. Restart the container with `docker restart silo`, so Silo loads the restored settings.

Keep `data-old` until the server works.

## Move from the Compose stack

1. [Back up the Compose stack](/docs/backup-restore#back-up-the-default-compose-stack), including a database dump.
2. Stop it with `docker compose down` from its directory.
3. Copy the `artwork`, `plugins`, and `compat` directories from its `SILO_DATA_ROOT` into a `silo` directory inside the new config directory, such as `/opt/silo/config/silo`. The container gives them to `PUID` and `PGID` when it starts.
4. Start the omnibus container with the same `SECRET_KEY`, and mount your media at the same container path as before, `/mnt/media` unless you changed `MEDIA_CONTAINER_ROOT`. Wait until `curl --fail http://localhost:8090/api/v1/ready` returns `{"status":"ok"}`. Don't finish the setup wizard.
5. Restore the dump with the `pg_restore` command from [After a PostgreSQL major version change](#after-a-postgresql-major-version-change).
6. Restart the container with `docker restart silo`, then sign in with your existing account.

Keep the old stack's data until you've checked libraries, artwork, watch progress, and playback.

## Update the container

Back up first, as in [Back up the omnibus image](/docs/backup-restore#back-up-the-omnibus-image). Then pull the new image and recreate the container with the same options:

```sh
docker pull ghcr.io/silo-server/silo-server:latest-omnibus
docker stop silo && docker rm silo
```

Run your `docker run` command again. With Compose, run `docker compose -f docker-compose.omnibus.yml pull` and then `up -d`. Silo applies database migrations as it starts; [Update Silo safely](/docs/updates) covers what to expect.
