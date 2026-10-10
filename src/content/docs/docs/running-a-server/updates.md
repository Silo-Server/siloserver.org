---
slug: docs/updates
title: Update Silo safely
description: Back up, pull the new image, and check the server after an update.
---

Update during a quiet period and tell users that playback will stop briefly.

## Before you update

1. Read the release notes for the version you are moving to, including anything about remote nodes and plugins.
2. [Back up](/docs/backup-restore#back-up-the-default-compose-stack) the database, `.env`, and data directories, and record the image you are running:

   ```sh
   docker compose images silo
   ```

   Keep that output. `latest` won't identify the old image once you've pulled a new one.
3. Let active playback and downloads finish.

## Update the default Compose stack

Published images are tagged `latest`, `build-N`, and a short commit SHA (see [image tags](/docs/docker#image-and-tags)). If you pinned `SILO_IMAGE` in `.env`, change it to the new tag first. Keep your existing `.env`; don't replace it with the latest example.

From the directory that holds your Compose file:

```sh
docker compose pull silo
docker compose up -d --no-deps silo
docker compose logs -f silo
```

`--no-deps` replaces only the Silo container and leaves PostgreSQL and Redis running.

Silo applies database migrations as it starts, before it answers requests. A large migration can take a while, and `docker compose ps` can show Silo as `unhealthy` until it finishes. Watch the logs and don't restart the container during a migration: that abandons the run, and PostgreSQL can keep holding the abandoned run's locks while Silo starts again.

Some releases rewrite large tables in place. Silo can't read or write most of its data until the rewrite finishes, and PostgreSQL needs free disk for a second copy of each table and its indexes. When the release notes mention one, check the free space on the database disk before updating.

Migrations stop after 20 minutes by default. For a very large library, or when the release notes say a migration rewrites large tables, set a longer limit in `.env` before updating, for example `SILO_MIGRATE_TIMEOUT=60m`. `0` removes the limit.

## After the update

- Check [health and readiness](/docs/server-health#check-startup).
- Sign in as an admin and as a normal account.
- Open a library, load artwork, start playback, seek, stop, and resume.
- Test the integrations and remote nodes you use.

Keep the backup until these checks pass.

## If the update fails

Stop and keep the logs. Switching back to the old image doesn't undo migrations, so don't alternate old and new images against the same database.

To see which migrations ran:

```sh
docker compose run --rm silo --migrate-status
```

The reliable way back is to restore the pre-update backup with the old image, as in [Test a restore](/docs/backup-restore#test-a-restore). That loses every change made after the backup. [Ask for help](/docs/report-a-problem) before changing the database by hand.

## Moving from alpha to 1.0

Existing alpha servers will update in two steps: first to a final bridge release, then to 1.0. The bridge finishes the older database migrations, and 1.0 refuses to start on a database that hasn't reached it. When 1.0 ships, follow its published update instructions. The plan is in the server's [1.0 update notes](https://github.com/Silo-Server/silo-server/blob/main/docs/update-to-1.0.md).

What to expect:

- Plan one maintenance window for the whole setup. Don't run alpha and 1.0 servers or nodes at the same time.
- Have the matching 1.0 app builds ready for your devices.
- Playback, download, callback, and integration URLs created by the alpha server stop working. Create new ones from the 1.0 server and update external services such as autoscan and webhook senders. Don't edit old URLs by hand.
- Health checks keep their addresses, `/api/v1/health` and `/api/v1/ready`.
