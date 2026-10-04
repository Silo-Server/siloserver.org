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

## Cast and crew details

Silo fills in bios, photos, and birth dates for cast and crew from metadata providers in the background. It starts with people it has never looked up, newest first, so the cast of a title you just added appears soon. Opening a person's page looks them up right away if their details are missing.

Silo looks each person up again after 90 days, even if the provider had no bio for them. If no provider knows a person, Silo stops looking them up in the background after three tries. Opening their page still looks them up.

To change how fast the background lookups go, open **Admin > Settings > Library & Metadata**, open **Advanced** under **Scanning**, and set **Person lookups per minute**. The default is 120. Lower it if a provider limits how often Silo can ask; raise it to fill in a large library sooner. The limit applies to each Silo server, so with several `api` servers each one looks up that many. Opening a person's page doesn't count toward it. The change applies without a restart.

If a provider says Silo is asking too often, Silo pauses background lookups for up to 15 minutes and then carries on by itself.
