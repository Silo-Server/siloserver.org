---
slug: docs/manage-libraries
title: Add and manage libraries
description: Choose a library type, add media folders, and check their scans.
---

A library is a set of media folders with its own metadata settings. Manage libraries in the web app as a server administrator.

## Add a library

1. [Prepare your folders](/docs/media-folders). In Docker, find the path inside the container, for example `/mnt/media/movies`.
2. Open **Admin > Libraries** and select **Add Library**.
3. Enter a name and choose **Movies**, **Series**, or **Mixed**. Add the folder under **Folders**. You can add more than one folder for the same type.
4. Review **Metadata Language** and **Provider Priority**. TMDB and TVDB are installed by default. Keep the providers you want checked, most preferred first. To add another provider, [install its plugin](/docs/plugins).
5. Save the library. Use its **Scan** action, then watch its scan status.

When the scan finishes, open the library and play one title.

## Choose a library type

Use **Movies** for films, **Series** for episodic video, or **Mixed** to scan
both in one library. Silo decides whether each item in a Mixed library is a
movie or an episode from its folders and filename, so separate libraries give
more predictable results.

| Client | Mixed video libraries |
| --- | --- |
| Web | Creates and browses Mixed libraries |
| Android phone and tablet | Classifies Mixed as a Video library |
| iPhone, iPad, and Apple TV | Mixed libraries are included under Movies and Series |

Audiobook, ebook, and comic libraries are Beta. See the
[audiobook library setup](/docs/audiobook-libraries) and
[ebook and comic setup](/docs/ebooks). For **Podcasts** and **Music**, see
[Podcasts and music](/docs/podcasts-and-music).

## Files are missing

Make sure the host disk or network mount is available before scanning again. A folder that exists but is empty often means a disconnected drive.

For Docker, compare `MEDIA_ROOT` with the folder entered in Silo. If the host's `/srv/media/movies` is mounted at `/mnt/media/movies`, enter `/mnt/media/movies` in Silo. Silo also needs read permission on the files and permission to open their parent folders.

Silo adds only the [video file types](/docs/media-folders#file-types) it supports. Remux DVD and Blu-ray folders and `.iso` images into a single file first.

If files are found but identified incorrectly, rename them using the [naming guide](/docs/media-folders) or use [Match Item](/docs/metadata#correct-a-wrong-match).

## Scan or refresh

**Scan** finds new and changed files in the library folders. **Refresh Metadata** asks metadata providers again about items already in the library. Scan for a new file; refresh for an updated description or poster.

After the first scan, Silo watches library folders on local disks and scans a new or changed file within seconds, so you rarely need **Scan**. For a library on a network share, set up an [autoscan source](/docs/autoscan#autoscan-sources) after a normal scan succeeds. [Keep libraries up to date](/docs/autoscan) covers both.

## Hide or remove a library

Turn off **Enabled** to hide a library from browsing and skip its scans, for example while a media disk is offline.

**Delete library** removes the library from Silo and can't be undone. [Back up](/docs/backup-restore) first if you might want it back. Deleting and recreating a library doesn't fix a failed scan.
