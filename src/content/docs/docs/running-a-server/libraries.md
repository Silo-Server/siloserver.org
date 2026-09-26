---
slug: docs/manage-libraries
title: Add and manage libraries
description: Choose a library type, add media folders, and check their scans.
---

Use the web app as a server administrator. A library groups media and gives it its own folders and metadata settings.

## Add a library

1. [Prepare your folders](/docs/media-folders). In Docker, find the path inside the container, for example `/mnt/media/movies`.
2. Open **Admin > Libraries** and select **Add Library**.
3. Enter a name and choose **Movies**, **Series**, or **Mixed**. Add the folder under **Folders**. You can add more than one folder for the same type.
4. Review **Metadata Language** and **Provider Priority**. Keep the providers you want checked and order them from most preferred to least preferred. If an online provider is missing, install and configure its plugin under **Admin > Plugins**.
5. Save the library. Use its **Scan** action, then watch its scan status.

Open the library in the normal browsing view. Check one title, its poster, and a playable file.

## Choose a library type

Use **Movies** for films, **Series** for episodic video, or **Mixed** to scan
both in one library. For a Mixed library, check a movie and an episode after
scanning to confirm that both were identified correctly.

| Client | Mixed video libraries |
| --- | --- |
| Web | Creates and browses Mixed libraries |
| Android phone and tablet | Classifies Mixed as a Video library |
| iPhone, iPad, Apple TV, native macOS | Mixed libraries are included under Movies and Series |

For listening and reading, follow the [audiobook library setup](/docs/audiobook-libraries)
or [ebook and comic setup](/docs/ebooks) guide. These media types are Beta.
For **Podcasts** and **Music**, see [feature availability](/docs/unfinished-features#podcasts-and-music).

## Files are missing

Check that the host disk or network mount is available before scanning again. A path that exists but is empty can mean a disconnected drive.

For Docker, compare `MEDIA_ROOT` with the folder entered in Silo. The host path `/srv/media/movies` will not work in Silo if it is mounted at `/mnt/media/movies`. Also check read permission on the files and permission to enter their parent directories.

If files are found but identified incorrectly, use [Match Item](/docs/metadata#correct-a-wrong-match). Repeated scans do not fix an ambiguous name.

## Scan or refresh?

**Scan** discovers files and changes in library folders. **Refresh Metadata** asks metadata providers for information about items already in the catalog. Use a scan for a new file and a metadata refresh for an updated description or poster.

For ongoing imports from another service, set up [Autoscan](/docs/autoscan) after a normal scan succeeds.

## Hide or remove a library

Turn off **Enabled** to hide a library from browsing and skip its scans. Use this when taking a media disk offline.

**Delete library** is a separate, irreversible catalog action. Read the confirmation before continuing and back up first if you need to retain its catalog state. Deleting and recreating a library is not a routine fix for a failed scan.
