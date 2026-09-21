---
slug: docs/metadata
title: Fix metadata and choose artwork
description: Correct a match, edit a description, and keep intentional changes.
---

Use the web app as a server administrator. If a title is missing entirely, check its [library scan and paths](/docs/manage-libraries#files-are-missing) first. Metadata editing changes the catalog, not the file on disk.

## Correct a wrong match

1. Open the item's details and its actions menu.
2. Select **Match Item**.
3. Search with the correct title and year. Use the provider filters or identifiers when you know the exact match.
4. Select the right result and choose **Apply Match**.
5. Reopen the item and check the title, year, artwork, and attached files. For a series, also check seasons and episodes.

If the folder combines unrelated titles, fix the [folder layout](/docs/media-folders) before matching again.

## Change a description or title

1. Choose **Edit Metadata** from the item's actions menu.
2. Change the fields you need.
3. Check the lock beside each edited field, then select **Save Changes**.

Editing a lockable field locks it automatically. Providers leave locked fields alone during refresh. Unlock a field when you want providers to replace it again.

**Reset & Refresh** clears field locks and allows provider data to overwrite manual edits. Use it only when that is your intended result.

## Translate a description

This needs a text model and **Translate descriptions** turned on in [AI Services](/docs/ai-services).

1. In **Edit Metadata**, find **Translate with AI**.
2. Choose the target **Language** and select **Translate**.
3. Wait for the result and check the translated description. For a series, the job includes season and episode overviews.

Leave **Re-translate existing** off unless you intend to replace an existing translation. Provider translations can replace AI-generated text when they become available.

Translation while browsing is a separate server setting, **Description translation for viewers**. It can offer a button, run automatically when a description is missing in the requested language, or stay off. These controls do not translate the app's interface.

## Choose artwork

In **Edit Metadata**, open **Images** for a movie, series, or season. Choose the image type, select a provider image, and use its **Apply** button. Image changes apply immediately; **Cancel** does not undo them. Then check the item in both its details page and the library grid. These controls require an admin account.

If images fail to appear, check [artwork storage](/docs/s3-storage). Reapplying an image will not fix a failed storage connection.

## Refresh metadata

Choose **Refresh Metadata** from the item's actions menu:

- **Quick Refresh** keeps the item and refreshes its existing scan scope.
- **Complete Refresh** clears the match and rebuilds from disk. It can create a new item ID or type.

Use Quick Refresh for ordinary provider updates. A Complete Refresh is a repair operation, not a harmless way to reload a poster.

Provider order and language belong to **Admin > Libraries**. For metadata stored beside your own files, use [NFO sidecars](/docs/local-metadata).
