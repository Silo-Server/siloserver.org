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

In a Mixed library, put every episode in a `Season 01` or `Specials` folder.
Silo checks each file in this order:

1. A file inside a season folder is an episode.
2. A file in a folder with a TMDB or IMDb ID, such as
   `Movie Name (2024) {tmdb-12345}`, is a movie. A TVDB ID alone doesn't count.
3. A file with a season and episode code, such as `S01E02` or `1x02`, is an
   episode.
4. Any other file is a movie.

So a file named only by air date, or only `E03`, outside a season folder is a
movie in a Mixed library. A [season pack folder](/docs/media-folders#series)
such as `Show.Name.S01.COMPLETE` needs a show folder around it.

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

If files are found but identified incorrectly, rename them using the [naming guide](/docs/media-folders) or use [Match Item](/docs/metadata#correct-a-wrong-match).

## Resolve ambiguous roots

Set the type and title of a folder Silo can't classify on its own under **Ambiguous Roots**. Silo lists a folder there when its names don't settle what it holds, for example episode files that don't name their show, or a folder and file that name different titles, as in `On Fire (2024)/Soul on Fire (2025) [WEBDL-1080p].mkv`. For a title conflict like that one, you can instead add a [provider ID](/docs/media-folders#provider-ids) to the folder name.

1. Open **Admin > Libraries** and expand **Ambiguous Roots**, below the list of libraries.
2. Choose the library. Each folder is listed under **Root** with the **Type** Silo guessed, its **Confidence**, and the number of **Files**. To find a folder, filter by path, title, or sample file.
3. Select **Override** beside the folder. If its files already belong to several items, saving an override requires splitting them first: select **Resolve** to open the item, then choose **Split Versions** from the item's **More** menu (⋮).
4. Set **Type** to **Movie** or **Series**. Fill in **Title** and **Year**, or a **TMDB ID**, **IMDb ID**, or **TVDB ID** if you know it. **Note** is for your own record of why.
5. Select **Save Override**, then [scan](#scan-or-refresh) the library. Saving doesn't scan; the folder changes at the next scan, and later scans keep the override.

**Remove Override** in the same dialog returns the folder to automatic detection.

## Scan or refresh

**Scan** finds new and changed files in the library folders. **Refresh Metadata** asks metadata providers again about items already in the library. Scan for a new file; refresh for an updated description or poster.

For ongoing imports from another service, set up [Autoscan](/docs/autoscan) after a normal scan succeeds.

## Hide or remove a library

Turn off **Enabled** to hide a library from browsing and skip its scans, for example while a media disk is offline.

**Delete library** removes the library from Silo and can't be undone. [Back up](/docs/backup-restore) first if you might want it back. Deleting and recreating a library doesn't fix a failed scan.
