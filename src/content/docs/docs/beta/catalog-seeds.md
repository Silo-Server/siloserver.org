---
slug: docs/catalog-seeds
beta: true
title: Catalog import and export (Beta)
description: Transfer catalog records between Silo installations with catalog seeds.
---

:::caution[Beta]
Catalog import and export is outside the supported 1.0 scope.
:::

Catalog seeds transfer library and media records between installations. Use the web admin to export, import, inspect transfer jobs, and download or share completed exports.

A seed contains catalog records, file paths, and references to stored artwork and metadata. It does not copy the media files or replace a server backup. Use the [backup inventory and recovery checklist](/docs/backup-restore) to plan protection for accounts, watch history, configuration, secrets, and recovery.

## Export a catalog

1. Open **Admin → Maintenance**.
2. Under **Catalog Import & Export**, select **Start Export**.
3. Wait for the export job to complete and inspect its result.

After the export completes, select **Download** to save it. If export storage supports signed URLs, you can also select **Create seven-day link**, then **Copy URL** to share it.

Treat the shared URL as access to the exported catalog, including titles and
file paths. Reusing an existing link does not renew its seven-day expiry.

## Import a seed

1. On the destination server, open **Admin → Maintenance → Import Catalog**.
2. Select **Local File**, **Local Export Job**, **Bucket Artifact**, or **Remote URL**, then choose the source. A local file must be accessible to the server, not just your browser.
3. Choose the conflict behavior. **Skip Existing** keeps existing matching records; **Overwrite Existing** can replace them.
4. Add **Path Rewrites** if the destination uses different media mount paths. Rewrites match path prefixes and apply beneath those roots.
5. Submit the import and inspect the job's completion status, counts, and errors.

The destination still needs access to the referenced media and stored assets. A completed catalog import does not prove that those files can play. Check a title's metadata, artwork, and playback after importing, before relying on the transferred catalog.
