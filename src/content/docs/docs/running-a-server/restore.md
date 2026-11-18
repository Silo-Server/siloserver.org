---
slug: docs/restore
keywords: ["roll back", "disaster recovery", "restore set", "deleted library", "new machine", "migrate server", "silo backup restore"]
questions: ["How do I get back a library I deleted?", "Can I copy settings from another Silo server?", "How do I put my whole server back to last night?", "How do I move Silo to a new machine?"]
title: Restore from a backup
description: Bring back chosen settings, libraries, collections, and accounts while Silo runs, or replace the whole server from the command line.
---

There are two ways to restore one of Silo's [backups](/docs/backups):

- [Restore parts of a backup](#restore-parts-of-a-backup) from **Admin > Server > Backups** while Silo keeps running. You choose settings pages, plugins, libraries, collections, home sections, and accounts. Silo adds and merges them, and never deletes what's already on this server.
- [Restore the whole server](#restore-the-whole-server) from the command line, with Silo stopped. It replaces the database, so everything goes back to how it was when the backup was taken.

Both leave a way back. Before a partial restore, Silo backs up the server as it is now. That copy, **Taken before a restore**, is kept for 7 days, and you can restore it in full. A full restore keeps the previous database and the files it replaced until you remove them.

## Restore parts of a backup

1. Open **Admin > Server > Backups**, find the backup under **Saved backups**, and select **Restore…**.
2. Choose what to restore from **Settings**, **Plugins**, **Libraries**, **Collections and artwork**, **Home and library sections**, and **Users**. Each item is marked **New**, **Differs**, **Same**, or **Can't restore**, with the reason. Items that already match this server are hidden until you select **Show them**.
3. Select **Review restore**. The review lists what Silo will do, and under **Left out**, what it won't restore and why.
4. Select **Restore**. Silo backs up this server first, and the restore usually takes about a minute.

When it finishes, the report lists each item as **Restored**, **Created**, **Already the same**, **Left out**, or **Failed**, and **Download report** saves it. **Stop restore** stops after the item Silo is working on. Items already restored stay restored, and running the same restore again is safe.

### Restore accounts and profiles

Under **Users**, choose accounts and their profiles. Each account either merges into the matching account here or comes back as a **New account** with the password it had in the backup. Then choose which data to restore for the chosen profiles: watch history and progress, ratings, favorites and watchlist, personal collections, dismissed titles, playback and display preferences, and notification preferences.

Merging keeps whichever progress is newer and never deletes what's already here. A title that isn't in this server's catalog is left out, and the report names it.

### What a partial restore never changes

- Access: a restore never gives an account or profile more access than this server gives it now. Where the backup's settings would widen access, the server keeps its stricter values.
- Settings that belong to this server, such as its address, storage, and backup settings.
- Libraries whose folders this server can't open. Make the folders available first.
- Plugins that aren't installed here. A restore never installs a plugin from a backup. Install it from a [plugin catalog](/docs/plugins), then restore it again to get its settings.
- Settings encrypted with another `SECRET_KEY`, including plugin settings.

### If Silo can't verify the backup

A backup that was uploaded, or taken with a different `SECRET_KEY`, opens with **This server can't verify this backup.** Anyone who could change the file could have changed what it restores. Open it only if you trust where it came from: select **Open it anyway**, and before you restore, check **I trust this backup; restore from it anyway**.

From such a backup, Silo leaves off whatever would contact outside services or run for hours:

- settings that connect to outside services, and plugin settings, aren't restored
- new libraries come back with AI metadata translation, seek previews, intro detection, chapter thumbnails, and box sets turned off
- restored collections have no sync schedule
- seasonal home sections come back turned off

The review lists each one. Turn them on afterwards once you've checked them.

## Restore from another server

To bring parts of another Silo server into this one, move its restore set across.

1. On the other server, open **Admin > Server > Backups**, select **Download** next to a backup, and save `restore-set.tar`. If that backup is in a bucket, select **Download the restore set (decrypted)** instead.
2. On this server, select **Upload a backup** at the top of **Admin > Server > Backups**, then **Choose a file**.
3. When the file has uploaded and Silo has checked it, select **Choose what to restore** and continue as in [Restore parts of a backup](#restore-parts-of-a-backup).

An upload can be up to 2 GB. Silo keeps uploads under **Uploaded backups** for a week after their last use. An unfinished upload is deleted after 24 hours.

An encrypted file (`restore-set.tar.age`) uploads as it is if it was made with this server's `SECRET_KEY`, for example on a new install that kept the old key. Silo can't tell which key a file uses until it has uploaded, so a file made with another key is refused afterwards with **This file is encrypted**. Decrypt it first, on a computer with that server's `SECRET_KEY` set:

```sh
silo backup decrypt restore-set.tar.age -o restore-set.tar
```

If checking an upload stops, for example because the server restarted, select **Check again** under **Uploaded backups**. You don't have to send the file again. If you're signed out during an upload, sign in again as an administrator in the same browser and continue: the parts already sent are kept.

## Restore the whole server

:::caution[A full restore replaces the database]
Everything changed since the backup is lost, and every account goes back to how it was in the backup, including passwords, roles, and permissions. Before it changes anything, the command lists the accounts that differ. Afterwards, review the admin accounts and reset the password of anyone who changed theirs since the backup.
:::

The **Replace the whole server** section of **Admin > Server > Backups** shows the command for the backup you select in the list, or for the newest one, with a button to copy it.

1. Stop Silo on every server, and turn off automatic restarts until the restore finishes. With the standard Compose setup, stop Silo inside its container. PostgreSQL keeps running:

   ```sh
   docker compose exec silo /command/s6-svc -d /run/service/svc-silo
   docker compose exec silo /command/s6-svwait -D /run/service/svc-silo
   ```

2. Run the command from the page inside the container, for example:

   ```sh
   docker compose exec -w /config/silo silo /command/s6-envdir /run/s6/container_environment \
     /command/s6-setuidgid silo silo backup restore --from /config/silo/artwork/backups/<server-id>/<backup>/
   ```

   For a backup in a bucket, `--from` is the bucket address the page shows, and the command also needs the bucket's details in `SILO_BACKUP_S3_ENDPOINT`, `SILO_BACKUP_S3_REGION`, `SILO_BACKUP_S3_ACCESS_KEY`, `SILO_BACKUP_S3_SECRET_KEY`, and `SILO_BACKUP_S3_PATH_STYLE`. With Compose, pass each one with `-e` after `exec`.

3. Start Silo again with `docker compose restart silo`.

The command checks the whole backup and loads it into a new database before it touches the live one. If a check fails or the load stops, the live database is left as it was. It refuses a backup from a newer version of Silo. Afterwards it keeps the previous database and every file it replaced, and prints how to remove them once the restored server works, or how to go back. To remove the previous database with the standard Compose setup, run the `DROP DATABASE` line it printed like this:

```sh
docker compose exec -u silo silo psql -h /run/postgresql -d postgres -c 'DROP DATABASE "silo_before_restore_<time>"'
```

The command also clears Silo's Redis data, so nothing cached from the old database is served. `--keep-redis` skips that.

If a restore stops partway, for example because the host restarted, run `silo backup restore --recover <time>` with the time the command printed. Run it as the same user, from the same folder, against the same database. It finishes the restore or puts everything back.

### What happens after a full restore

- Every app and browser has to sign in again. Sign-ins aren't part of a backup, so a sign-in you ended after the backup stays ended.
- Connections to outside services, such as the email server, metadata and subtitle providers, sign-in providers, and notification channels, keep this server's current addresses and credentials. A service this server has no settings for comes back turned off until you enter its credentials.
- API keys and pending invitations stay as they are on this server, so a key you revoked since the backup stays revoked.
- Accounts, sign-in providers, plugins, and libraries that are turned off on this server stay off.
- Things deleted since the backup come back turned off: libraries, plugins, autoscan and history import sources, request integrations, subtitle providers, marker sharing, notifications, and access group permissions. Turn them on again once you've checked them. Accounts are the exception: they come back as the backup has them.
- Scans, imports, storage moves, and other jobs that were running when the backup was taken don't start again. They show as interrupted by the restore. Start them again if you still want them.

### If the backup came from another server or key

A backup in a bucket can only be restored with the `SECRET_KEY` it was taken with.

A backup on disk taken with another `SECRET_KEY` needs `--accept-lost-credentials`. Settings encrypted with the other key, such as storage, plugin, or email server credentials, are cleared, and the command lists them so you can enter them again.

Restoring onto a new install, or restoring another server's backup, brings back no API keys, invitations, or links to external sign-in accounts. Set those up again.

### Restore into a separate database

To look at a backup without touching the live server, restore it into a new, empty database and an empty folder or bucket prefix:

```sh
silo backup restore --from <backup> --into <database URL> --blobs-into <folder or s3:// address>
```

`--database-only` skips the files instead. Leave the password out of the database URL, because other accounts on the host can read a running command's arguments. Set `PGPASSWORD` instead. The copy keeps the original server's identity, so it starts with its backup settings cleared. Set **Where backups are kept** before you turn backups on there, or it could delete the original server's copies.

### Test a restore

**Complete** means a backup can be read, not that it restores. To test one, restore it into an empty scratch database:

```sh
silo backup verify --from <backup> --scratch <database URL>
```

Connect as a PostgreSQL role that isn't a superuser and owns only that database. The command loads the backup and checks it against what the backup recorded, without changing anything else. Running `silo backup` with no arguments lists every option.

## Move to a new server

1. On the new machine, install Silo with the same `SECRET_KEY` and the same media paths as the old server, and start it. Don't finish setup in the browser.
2. Copy a backup's folder from the old server, or the files from its **Download**, into `config/silo` on the new server, owned by the `PUID` account.
3. Follow [Restore the whole server](#restore-the-whole-server), with `--from` set to that folder inside the container, such as `/config/silo/<backup>/`.
