---
title: Catalog import and export (Beta)
description: Transfer catalog records between Silo installations with catalog seeds.
---

:::caution[Beta]
Catalog import and export is outside the supported 1.0 scope. Availability can change between builds.
:::

Catalog seeds transfer library and media records between installations. Open web administration to use this feature.

| Client | Available actions |
| --- | --- |
| Web admin | Export, import, inspect transfer jobs, and download or publish completed exports. |
| Apple and Android apps | No catalog transfer controls. |

A seed contains catalog records, file paths, and references to stored artwork and metadata. It does not copy the media files or replace a server backup. Use the [backup inventory and recovery checklist](/docs/running-a-server/backup-restore) to plan protection for accounts, watch history, configuration, secrets, and recovery. A tested full restore procedure is still needed.

## Export a catalog

1. Open **Admin → Maintenance**.
2. Under **Catalog Import & Export**, select **Start Export**.
3. Wait for the export job to complete and inspect its result.

Queueing a job does not mean the export is finished. If the interface offers publication, publishing creates a signed download link. Treat the link as access to the exported catalog, which can include titles and file paths. Its validity is seven days; reusing an existing published link does not renew its expiry.

## Import a seed

1. On the destination server, open **Admin → Maintenance → Import Catalog**.
2. Select **Local File**, **Local Export Job**, **Bucket Artifact**, or **Remote URL**, then choose the source. A local file must be accessible to the server, not just your browser.
3. Choose the conflict behavior. **Skip Existing** keeps existing matching records; **Overwrite Existing** can replace them.
4. Add **Path Rewrites** if the destination uses different media mount paths. Rewrites match path prefixes and apply beneath those roots.
5. Submit the import and inspect the job's completion status, counts, and errors.

The destination still needs access to the referenced media and stored assets. A completed catalog import does not prove that those files can play. Check a title's metadata, artwork, and playback after importing, before relying on the transferred catalog.
