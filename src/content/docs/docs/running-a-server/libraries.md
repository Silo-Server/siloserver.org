---
slug: docs/manage-libraries
title: Add and manage libraries
description: Add movie or series folders and check their scans.
---

Use the web app as a server administrator. A library groups one kind of media and gives it its own folders and metadata settings.

## Add a library

1. [Prepare your folders](/docs/media-folders). In Docker, find the path inside the container, for example `/mnt/media/movies`.
2. Open **Admin > Libraries** and select **Add Library**.
3. Enter a name and choose **Movies** or **Series**. Add the folder under **Folders**. You can add more than one folder for the same type.
4. Review **Metadata Language** and **Provider Priority**. Keep the providers you want checked and order them from most preferred to least preferred. If an online provider is missing, install and configure its plugin under **Admin > Plugins**.
5. Save the library. Use its **Scan** action, then watch its scan status.

Open the library in the normal browsing view. Check one title, its poster, and a playable file.

Other types shown by your server are outside the supported 1.0 scope. See
[Beta libraries](/docs/library-types) or the
[audiobook setup guide](/docs/audiobook-libraries) before using them.

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
