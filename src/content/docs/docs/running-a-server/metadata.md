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

Later refreshes keep the match you apply, even if an [NFO file](/docs/local-metadata) beside the media has a `<uniqueid>` for another title.

If one folder holds unrelated titles, fix the [folder layout](/docs/media-folders) first.

## Ignore an unmatched item

Ignore a movie or series that no metadata provider lists, such as a home video or a disc extra, so Silo stops trying to match it. The item stays in its library and still plays, with the title and artwork it already has.

1. Open **Admin > Libraries** and expand **Unmatched Items**, below the list of libraries. The section appears only while an item is awaiting a match or ignored.
2. Select **Ignore** on the item's row. Only movies and series have it. The item leaves the list, and the message that confirms it offers **Undo**.

While an item is ignored, scans don't retry it or count it as unmatched, and it drops out of **Metadata Matcher**. **Quick Refresh** finishes without changing it, and refreshing a season or episode of an ignored series fails.

To see ignored items, switch the menu beside the search from **Awaiting a match** to **Ignored**. **Restore** puts an item back on the list, and Silo tries to match it again. **Match** works in both views, and a successful match ends the ignore.

An **Override** saved in [**Ambiguous Roots**](/docs/manage-libraries#resolve-ambiguous-roots) for an ignored item's folder waits until you restore the item. To identify the item straight away, use **Match**.

Renaming or moving an ignored item's file brings it back to **Unmatched Items** as a new item. So does a new version of an ignored movie added beside it.

## Change a description or title

1. Choose **Edit Metadata** from the item's actions menu.
2. Change the fields you need.
3. Select **Save Changes**.

Editing a lockable field locks it, so providers leave it alone during a refresh. Unlock the field when you want providers to update it again.

**Reset & Refresh** clears every lock and replaces your manual edits with provider data.

## Choose a fallback language

When a metadata provider has no title or description in a library's **Metadata Language**, Silo uses English by default before the title's original language. For example, when an anime has no Spanish text, a Spanish library shows the series and its episodes with English titles and descriptions.

To use another language for every library, open **Admin > Libraries > Settings** and choose it in **Fallback metadata language** under **General**. Choose **Original language** to show the original language instead.

While the fallback is on, Silo picks posters in this order: the library's language, the fallback language, English, a poster without text, then any other language.

New items use the setting right away. Items already in a library change when you refresh them: choose **Refresh Metadata** from an item's actions menu and then **Quick Refresh**, or select the library's **Rescan Metadata** button in **Admin > Libraries** and then **Refresh All Metadata**.

## Translate a description

This needs a text model and **Translate descriptions** turned on in [AI Services](/docs/ai-services).

1. In **Edit Metadata**, find **Translate with AI**.
2. Choose the target **Language** and select **Translate**.
3. Wait for the result and read the translation. For a series, the job also translates season and episode overviews.

Descriptions a provider or a person already wrote in that language are kept. Turn on **Re-translate AI text** to refresh earlier AI translations as well. A provider's own translation can later replace the AI text.

### Translate library descriptions

1. In **Admin > Libraries**, select the pencil on the library's row and open **Metadata**.
2. Under **Translate library descriptions**, choose the **Language** and select **Translate**.
3. Wait for the job to finish. Silo works through one title at a time, so a large library takes a while. Select **Stop** to cancel it.

The job translates overviews and taglines, with season and episode overviews, that are missing in that language. Descriptions that already exist in that language are kept. If a title can't be translated, Silo skips it, and if several fail in a row, the job stops. Run it again to pick up whatever is still missing. The panel appears only for a library that has been saved.

You don't have to translate a library ahead of time. To translate while people browse, use **Description translation for viewers** in [AI Services](/docs/ai-services). It translates descriptions, not the app's interface.

## Choose artwork

In **Edit Metadata**, open **Images** for a movie, series, or season. Choose the image type, select an image, and choose **Apply Poster**, **Apply Backdrop**, or **Apply Logo**. The image changes immediately, and **Cancel** doesn't undo it. Look at the item's details page and the library grid afterward. Only administrators can change images.

A badge on each image names where it comes from, such as **TMDB**. A movie or series also offers the artwork stored beside its files, marked **LOCAL** and listed first, so a title with no provider match can still use its own [artwork](/docs/local-metadata#add-artwork). When the images come from more than one source, buttons such as **All**, **LOCAL**, and **TMDB** appear under the image types. Select one to show only that source's images.

If images don't appear, check [artwork storage](/docs/s3-storage).

## Refresh metadata

Choose **Refresh Metadata** from the item's actions menu:

- **Quick Refresh** keeps the item and updates it from providers. Use it for ordinary updates.
- **Complete Refresh** clears the match and rebuilds the item from disk, which can give it a new ID or type. Use it only to repair an item.

Provider order and language belong to **Admin > Libraries**. For metadata stored beside your own files, use [NFO sidecars](/docs/local-metadata).

## Cast and crew details

Silo fills in bios, photos, and birth dates for cast and crew from metadata providers in the background. It starts with people it has never looked up, newest first, so the cast of a title you just added appears soon. Opening a person's page looks them up right away if their details are missing.

Silo looks each person up again after 90 days, even if the provider had no bio for them. If no provider knows a person, Silo stops looking them up in the background after three tries. Opening their page still looks them up.

To change how fast the background lookups go, open **Admin > Libraries > Settings**, open **Advanced** under **Scanning**, and set **Person lookups per minute**. The default is 120. Lower it if a provider limits how often Silo can ask; raise it if your library is large and you want details sooner. The limit applies to each Silo server, so with several `api` servers each one looks up that many. Opening a person's page doesn't count toward it. The change applies without a restart.

If a provider says Silo is asking too often, Silo pauses background lookups for up to 15 minutes and then carries on by itself.
