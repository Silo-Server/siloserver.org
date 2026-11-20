---
slug: docs/backups
keywords: ["automatic backups", "nightly backup", "backup schedule", "retention", "S3 backup", "offsite backup", "key check"]
questions: ["How often does Silo back itself up?", "Where are my backups stored?", "Can I send backups to an S3 bucket?", "Why does a backup say complete with warnings?"]
title: Back up your server
description: Silo backs up its database and uploaded files every night. Choose where they go, how many to keep, and take one now.
---

Every night at 04:00, Silo backs up its database and the files people uploaded, and keeps the 7 newest. Open **Admin > Server > Backups** to see them, take one now, or change the schedule and where copies are kept.

A backup holds what Silo can't get back on its own:

- the database: accounts, profiles, watch history, libraries, collections, home sections, plugins, and settings
- uploaded artwork, collection and library images, poster badge images, branding, and profile pictures
- subtitles people uploaded, and, unless you turn it off, subtitles downloaded from providers

It leaves out your media files and what Silo can rebuild: artwork from providers, chapter images, seek previews, the search index, and Redis. It also leaves out `SECRET_KEY`, `.env`, and your Compose files. Keep copies of those yourself, as in [Back up by hand and test a restore](/docs/backup-restore#what-to-preserve).

To get data back from a backup, see [Restore from a backup](/docs/restore).

## Take a backup now

Select **Back up now** at the top of **Admin > Server > Backups**. The backup keeps running if you leave the page, and it appears under **Saved backups** when it finishes. A manual backup counts toward **Copies to keep**, like a nightly one.

If the button can't start a backup, the reason shows under it, such as **This server has no storage for backups.** or **The backup destination can't be reached.**

## Change the schedule and what's included

These settings are on the same page:

| Setting | Default | What it does |
| --- | --- | --- |
| **Nightly backups** | On | Turning it off stops nightly backups and the one Silo takes [before an update](/docs/updates#the-backup-before-an-update). **Back up now** and the backup before a partial restore still work. Saved copies stay. |
| **Start time** | 04:00 | In the server's time zone |
| **Copies to keep** | 7 | From 1 to 60. Nightly and manual backups count toward it. |
| **Intro detection data** | Off | Makes each backup larger. Without it, Silo analyzes a season again when its next episode arrives. |
| **Downloaded subtitles** | On | Saves fetching them again from subtitle sites, which limit downloads per day. Subtitles people uploaded are always backed up. |

Select **Save** in the bar at the bottom of the page to apply changes.

Silo deletes the oldest backup only after a new one succeeds, and it never deletes the newest one that finished without warnings, even if that keeps one more than **Copies to keep**.

Silo also keeps two kinds of backups outside that count:

- **Taken before a restore**: kept for 7 days.
- **Taken before an upgrade**: the 2 newest are kept, and each stays until its update has finished. These hold the database only. See [Update Silo safely](/docs/updates#the-backup-before-an-update).

If you run more than one API server, one of them takes each night's backup and the others skip that night.

## Choose where backups are kept

Under **Where backups are kept**, choose one:

- **On this server** keeps backups in Silo's data folder, on the same disk as the database. That covers a bad update or a mistake, not a failed disk. With the standard Compose setup, they're in `config/silo/artwork/backups` under `SILO_DATA_ROOT`. Each backup needs free space of 1.5 times the previous backup plus 1 GB. Silo also [keeps up to 2 GiB of that disk free](/docs/s3-storage#if-local-storage-is-almost-full), so a backup that starts on a nearly full disk can stop partway.
- **In the private bucket** replaces **On this server** when Silo has a [private S3 bucket](/docs/s3-storage). Backups go to that bucket, encrypted with your `SECRET_KEY`.
- **In an S3 bucket** keeps backups off this server, in a bucket used only for backups, encrypted with your `SECRET_KEY`. See [Keep backups in an S3 bucket](#keep-backups-in-an-s3-bucket).

If Silo keeps artwork in S3 and has no private bucket, the first option shows that the server has no private storage for backups. Add a private bucket in **Storage settings**, or set up a bucket for backups.

Switching between these two options also takes **Save**. When you change where backups go, the ones at the old place stay there. The list then shows only the current place's backups.

With more than one API server, every server must reach the same storage: the same shared folder for **On this server**, or the same bucket.

### Keep backups in an S3 bucket

Use a bucket just for backups, with access keys that can reach only that bucket.

1. Next to **In an S3 bucket**, select **Set up**, or **Change** if you set one up before.
2. Enter the **Endpoint**, **Region**, **Bucket**, **Access key**, and **Secret key**. To keep backups in a folder of the bucket, enter it as **Folder in the bucket**. Turn on **Path-style addressing** if your provider needs it.
3. Select **Test connection**.
4. Confirm that you keep a copy of `SECRET_KEY` somewhere other than this server.
5. Select **Save and use this bucket**. The next backup is the first one there.

### Keep a copy of SECRET_KEY

:::danger[Without SECRET_KEY, backups in a bucket can't be restored]
Silo encrypts every backup in a bucket with a key made from your `SECRET_KEY`. There's no separate backup key, and Silo never shows `SECRET_KEY` or keeps a copy of it anywhere else. If the key exists only in this server's `.env` and the disk fails, no one can restore these backups.
:::

Before backups go to a bucket, Silo asks you to confirm that you keep a copy of `SECRET_KEY` off the server. The page shows a **Key check** code for this server's key. To check that the copy you saved is the same key, run this on any computer with Docker:

```sh
printf %s "$SECRET_KEY" | docker run --rm -i --entrypoint silo ghcr.io/silo-server/silo-server:latest secret check
```

with `SECRET_KEY` set to your saved copy. It prints a code such as `d20f-6f44-85ef-8f45`. The same key always gives the same code.

If `SECRET_KEY` changes, backups to the bucket pause and the page says **Backups to this bucket are paused until you confirm this server's SECRET_KEY.** Select **Confirm the key** to start them again. Backups taken with the old key still need the old key to restore.

## Read a backup's status

**Saved backups** lists each backup with when it was **Taken**, its **Status**, **Size**, and **Silo version**. Select **Show details** for more.

| Status | Meaning |
| --- | --- |
| **Complete** | The backup finished and Silo checked that its database copy can be read. That isn't a restore test; see [Test a built-in backup](/docs/backup-restore#test-a-built-in-backup). |
| **Complete with warnings** | The backup is usable, but some files were missing when it copied them, or some accounts weren't included in its [restore set](/docs/restore#restore-parts-of-a-backup). **Show details** lists them and why. A full restore still includes those accounts. |
| **In progress** | The backup is running. |
| **Incomplete** | The backup didn't finish, or some of its files are gone. Don't rely on it. |
| **Unreadable** | Silo couldn't read the backup just now, for example because the bucket timed out. Silo never deletes it, and it doesn't count toward **Copies to keep**. It usually clears the next time the list loads. If it stays, check the storage. |
| **Unverified** | Silo can't confirm the backup is unchanged since it was written, for example because it was taken with a different `SECRET_KEY`. |

If a backup fails, the page says when it started and why it failed. **Admin > Server > Scheduled Tasks** keeps each run of **Back Up Server**, with how long it took.

## Download or delete a backup

Select **Download** next to a backup to open its files. To [restore it in full](/docs/restore#restore-the-whole-server) on another machine, save them in one folder. To [restore parts of it on another server](/docs/restore#restore-from-another-server), upload `restore-set.tar` there. A backup from a bucket is encrypted: select **Download the restore set (decrypted)** to get a file another server can read. The download links stop working after a short time.

To delete a backup, select the delete button on its row, then **Delete backup**. Silo refuses while a restore is reading that backup.

## Requirements

- Backups need the PostgreSQL user store. If your server keeps [per-user data in SQLite](/docs/backup-restore#per-user-data-on-sqlite), backups don't run and the page says **Backups need the PostgreSQL user store. Import your SQLite user store first.**
- Every API server needs PostgreSQL's `pg_dump` and `pg_restore`, at least as new as the database's PostgreSQL version. Silo's image includes them. If they're missing or too old, the page says so.
