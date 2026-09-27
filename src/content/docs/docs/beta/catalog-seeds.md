---
slug: docs/catalog-seeds
beta: true
title: Catalog import and export (Beta)
description: Transfer catalog records between Silo installations with catalog seeds.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

A catalog seed copies library and media records from one Silo server to another. You export, import, and download seeds in the web admin.

A seed holds catalog records, file paths, and references to stored artwork and metadata. It doesn't include media files, accounts, or watch history, so it can't stand in for a server backup. See [back up and restore](/docs/backup-restore) for that.

## Export a catalog

1. Open **Admin > Maintenance**.
2. Under **Catalog Import & Export**, select **Start Export**.
3. When the export job finishes, select **Download** to save the seed.

If export storage supports signed URLs, you can instead select **Create seven-day link**, then **Copy URL** to share it. Anyone with the link can download the catalog, including titles and file paths. Copying an existing link again doesn't extend its seven days.

## Import a seed

1. On the destination server, open **Admin > Maintenance > Import Catalog**.
2. Select **Local File**, **Local Export Job**, **Bucket Artifact**, or **Remote URL**, then choose the source. A local file must be a path on the server, not on your computer.
3. Choose what happens to matching records: **Skip Existing** keeps them, and **Overwrite Existing** replaces them.
4. If the destination mounts media at different paths, add **Path Rewrites**. Each rewrite replaces a path prefix.
5. Start the import. The job shows its status, counts, and any errors when it finishes.

The destination server also needs access to the media files and stored artwork the seed refers to. After importing, play a few titles and look at their artwork to make sure the paths line up.
