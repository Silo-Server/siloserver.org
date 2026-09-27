---
slug: docs/backup-restore
title: Plan and test your backups
description: Back up the database, encryption key, and files a Silo server needs, and test a restore.
---

A Silo backup is the database, the encryption key, and the files the database points to. Test a restore on another host before you rely on it.

## What to preserve

| Data | Why it matters |
| --- | --- |
| PostgreSQL | Catalog, accounts, profiles, settings, and watch state |
| `SECRET_KEY` | Reads the encrypted credentials stored in the database |
| `.env`, Compose files, and overrides | Recreates the same paths, ports, and services |
| Exact image version | Restores with the software that matches the backup |
| Local artwork and S3 buckets | Uploaded images, downloaded subtitles, avatars, and cached artwork |
| Plugin files | Installed plugins |
| Original media | Silo's database does not contain your media files |

Keep `SECRET_KEY` in a secure place, separate from the database backups. Without it, a restored server cannot use the stored integration and storage credentials.

## Back up the default Compose stack

Run these from the directory that holds your Compose file.

1. Record the image you are running:

   ```sh
   docker compose images silo
   ```

2. Dump the database, then check that the dump can be read:

   ```sh
   BACKUP="silo-$(date +%F).dump"
   docker compose exec -T postgres pg_dump -U silo -Fc silo > "$BACKUP"
   docker compose exec -T postgres pg_restore --list < "$BACKUP" > /dev/null && echo "dump OK"
   ```

   Replace `silo` with your `POSTGRES_USER` and `POSTGRES_DB` values if you changed them. Silo can keep running during the dump.

3. Copy `.env` and your Compose files, including any overrides, to a restricted location. `.env` contains `SECRET_KEY`.

4. Copy these directories from `SILO_DATA_ROOT` (default `/opt/silo`):

   | Directory | Back up? |
   | --- | --- |
   | `artwork` | Yes. Uploaded posters and branding cannot be downloaded again. |
   | `plugins` | Yes |
   | `compat` | Yes |
   | `catalog-seeds` | Yes, if you put files there |
   | `postgres` | No, use the dump instead |
   | `redis`, `transcode`, `meilisearch` | No. These hold temporary, cache, or rebuildable data. |

5. If you use S3 storage, back up the public and private buckets with your provider's tools, at about the same time as the dump.

Do not copy the `postgres` directory while the database is running: the copy may not start. If you need a file-level copy, run `docker compose stop postgres` first.

### Per-user data on SQLite

Open **Admin > Settings > Storage & Database** and check **Where per-user data is stored** under **Database** (in **Advanced**). If it shows SQLite, Silo also writes per-user data to `/var/lib/silo/userdb` inside the container. The default Compose file does not keep that directory. Mount it from the host and back it up with the dump.

## Test a restore

Restore to a separate host when you can, never over the live server.

1. Copy `.env` with the original `SECRET_KEY` and your Compose files into a new directory, and copy the data directories.
2. If the live server runs on the same host, edit the copied `.env` before running any Compose command. Set `SILO_DATA_ROOT` to the new, empty data directory, and set `PORT`, `JF_PORT`, `ABS_PORT`, `POSTGRES_PORT`, `REDIS_PORT`, and `MEILISEARCH_PORT` to ports the live server doesn't use. Also set `COMPOSE_PROJECT_NAME` to a new name, such as `silo-restore-test`, so Compose can't mistake the copy for the live server. Run every command from the new directory.
3. Set `SILO_IMAGE` to the image you recorded with the backup.
4. Block the test copy's outgoing traffic to your notification services and webhook targets, and make sure it can't write to your production S3 buckets. The restored database holds the live server's credentials for all of these.
5. Start only the database with `docker compose up -d postgres`, then load the dump into the empty database with `pg_restore`.
6. Start Silo with `docker compose up -d`. It applies any pending database migrations as it starts.

Then sign in as an admin and as a normal account. Check profiles, libraries, artwork, watch progress, and one playback, and restart the copy once to make sure the state survives.

## Before an update

A database migration can't be undone by switching back to the old image. Take a fresh backup before every update and follow the [update guide](/docs/updates).
