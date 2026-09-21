---
slug: docs/backup-restore
title: Plan and test your backups
description: Identify Silo's durable state and verify recovery before relying on a backup.
---

A Silo backup needs more than a catalog export. Keep the database, encryption key, and file-backed state needed to reconstruct your installation.

:::caution[Recovery procedure still needs validation]
This page is a backup inventory and recovery-test checklist. Silo does not yet provide a release-tested, complete clean-host restore walkthrough here. Do not treat these checks as a proven recovery procedure or update your only copy of a server without a tested restore.
:::

## What to preserve

| Data | Why it matters |
| --- | --- |
| PostgreSQL | Catalog, accounts, settings, and current database-backed profile state |
| `SECRET_KEY` | Reads the encrypted credentials stored in the database |
| Compose files, overrides, and configuration | Recreates the same paths, ports, and services |
| Exact image or binary version | Restores with the software that matches the backup |
| Local artwork and configured object storage | Preserves uploaded and generated assets |
| Plugin files and plugin-managed state | Restores the installed capabilities and their data |
| Other local state used by your deployment | May include avatars, compatibility assets, or older per-user stores |
| Original media | Silo's database does not contain your movie or audiobook files |

Keep the encryption key in a secure location separate from database backups. Losing it can leave otherwise-restored integrations unusable.

If an older installation uses `userdb.backend=sqlite`, preserve `/var/lib/silo/userdb`. The default Compose file does not mount that directory. Confirm every required local path has persistence before replacing its container.

## Take a consistent backup

Use a PostgreSQL-aware backup method or a properly coordinated offline backup. Copying an active PostgreSQL data directory by itself is not a complete database backup procedure.

Coordinate database and object/file snapshots so restored records point to the assets you retained. Include external buckets in the plan rather than assuming the Docker data root contains them.

Redis holds runtime coordination state. Its recovery treatment depends on your topology and active jobs; do not clear it while a fleet is still running. Transcode scratch and search indexes serve different purposes from durable account or media data.

## Test recovery away from the live server

1. Choose an isolated destination with new database and storage paths.
2. Block outbound notifications, webhooks, and other integrations before starting the restored copy.
3. Restore using your deployment's tested procedure and the matching server version and key.
4. Check admin sign-in, a normal account's profiles, library access, artwork, progress, and one playback.
5. Confirm that the restored server survives a restart with that state intact.

Do not point the restored copy at writable production storage during this test. Keep the original installation untouched until you can explain how to recover it without using its remaining live files.

## Before an update

Record the backup time, restore-test result, image identity, and required storage. If the new version migrates the database, changing the image tag back may not recover the old installation. Follow the [update guide](/docs/updates).
