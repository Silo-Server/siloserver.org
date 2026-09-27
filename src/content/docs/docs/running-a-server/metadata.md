---
slug: docs/metadata
title: Fix metadata and choose artwork
description: Correct a match, edit a description, and keep intentional changes.
---

Fix titles, descriptions, and artwork in the web app as a server administrator. These edits change Silo's catalog, not your files. If a title is missing entirely, check the [library scan and paths](/docs/manage-libraries#files-are-missing) instead.

## Correct a wrong match

1. Open the item's details and its actions menu.
2. Select **Match Item**.
3. Search with the correct title and year. Use the provider filters or identifiers when you know the exact match.
4. Select the right result and choose **Apply Match**.
5. Reopen the item and check the title, year, artwork, and files. For a series, also check seasons and episodes.

If one folder holds unrelated titles, fix the [folder layout](/docs/media-folders) first.

## Change a description or title

1. Choose **Edit Metadata** from the item's actions menu.
2. Change the fields you need.
3. Select **Save Changes**.

Editing a lockable field locks it, so providers leave it alone during a refresh. Unlock the field when you want providers to update it again.

**Reset & Refresh** clears every lock and replaces your manual edits with provider data.

## Translate a description

This needs a text model and **Translate descriptions** turned on in [AI Services](/docs/ai-services).

1. In **Edit Metadata**, find **Translate with AI**.
2. Choose the target **Language** and select **Translate**.
3. Wait for the result and read the translation. For a series, the job also translates season and episode overviews.

Turn on **Re-translate existing** only to replace an earlier translation. A provider's own translation can later replace the AI text.

To translate while people browse, use **Description translation for viewers** in [AI Services](/docs/ai-services). It translates descriptions, not the app's interface.

## Choose artwork

In **Edit Metadata**, open **Images** for a movie, series, or season. Choose the image type, select a provider image, and choose **Apply**. The image changes immediately, and **Cancel** doesn't undo it. Look at the item's details page and the library grid afterward. Only administrators can change images.

If images don't appear, check [artwork storage](/docs/s3-storage).

## Refresh metadata

Choose **Refresh Metadata** from the item's actions menu:

- **Quick Refresh** keeps the item and updates it from providers. Use it for ordinary updates.
- **Complete Refresh** clears the match and rebuilds the item from disk, which can give it a new ID or type. Use it only to repair an item.

Provider order and language belong to **Admin > Libraries**. For metadata stored beside your own files, use [NFO sidecars](/docs/local-metadata).
