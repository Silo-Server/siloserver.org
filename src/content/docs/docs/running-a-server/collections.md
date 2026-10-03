---
slug: docs/manage-collections
title: Create shared and smart collections
description: Build a library collection from filters, an imported list, or a template, and check what viewers can see.
---

Shared collections belong to a library and appear for everyone who can use it, for example a set of short films or a seasonal selection.

## Create a collection

1. Open **Admin > Collections** and select the library.
2. Choose **Add Collection**, then a collection type.
3. For a smart collection, set the **Filters** and inspect the matching items. Select at least one library and set an item limit if needed.
4. Continue to **Details**. Enter a **Title**, choose **Visibility**, and add a poster or backdrop if you want one.
5. Choose **Create Collection**, then open the library's Collections view.

Smart collections find items with rules. Imported collections take their list from an external source.

## Start with a template

Use a template for a collection that follows a published list and syncs again on a schedule, such as TMDB's trending movies or an MDBList list of Oscar winners. For a smart, manual, or one-off imported collection, use **Add Collection** instead.

1. Open **Admin > Collections** and choose **Browse Templates**. You can also choose **Add Collection**, then the **Browse Templates** tile.
2. Search or pick a category, then select a template.
3. Check the form. The template fills in every field, and you can change any of them.
4. Choose **Create Collection**. Silo creates the collection and runs its first sync. The collection shows only titles that are already in your library, so a list of 100 trending movies may show far fewer.

Templates use these sources:

- TMDB lists such as trending, popular, top rated, now playing, upcoming, airing today, and on the air. These work without setup, because Silo includes a TMDB key.
- A public TMDB list. Choose **Custom TMDB List** and paste the list's page, such as `https://www.themoviedb.org/list/310-my-movie-list`, or just its number. TMDB has no list search, so find the list on themoviedb.org first.
- A public MDBList list. Following a list needs no key. Choose **Custom MDBList** to paste any public list. With an MDBList API key under **Admin > Settings > Subtitles & Metadata**, the form can also search MDBList for lists.
- TMDB genre shelves and TMDB franchise collections. These can only be added with a [template bundle](#apply-a-template-bundle). Selecting one in the gallery shows what it fetches but has no create form.

The form has these fields:

- **Libraries**: one or more. A movie template cannot go in a **Series** library, and a TV template cannot go in a **Movies** library. **Mixed** libraries take both.
- **Collection Title** and **Description**.
- **MDBList URL** or **TMDB list URL**, when the template follows a list you choose.
- **Poster**: **Server default** keeps the template's poster, and **Custom URL** uses an image link instead.
- **Max Items**: how many titles the collection keeps. Most templates keep 100, and a few keep more or have no limit.
- **Featured**: surfaces the collection near the top of the library.
- **Default Sort**: the order viewers see when they open the collection.
- **Sync Schedule**: how often Silo reads the source again. Lists that change often, such as trending, start at daily or more often. Lists that change slowly, such as top rated or award winners, start at weekly. Choose **No automatic sync** to sync only when you ask.

## Apply a template bundle

A bundle creates a whole set of template collections at once, such as a starter set of trending and top-rated lists or a shelf for each genre. Bundles appear at the top of **Browse Templates**, above the search, each with a short description and the number of templates it holds. **All Defaults** applies every bundle together.

Some templates are in no bundle, including **Custom MDBList** and **Custom TMDB List**. Add those one at a time.

1. Choose **Browse Templates**, then a bundle.
2. Under **Libraries**, choose the libraries to fill. Every library starts selected, or only the one you had open. Each library gets only the templates that fit its type.
3. Under **Featured Sections**, check the **Home Hero** and the hero chosen for each library. Silo creates these hero sections unless you choose **No home hero** or **No library hero**.
4. Choose **Preview** to see the exact collections it would create, skip, and delete. Nothing changes yet.
5. Choose **Apply Defaults**. Silo applies the bundle in the background. The collections appear first, and their titles fill in as each first sync finishes, showing only titles already in your library.

Applying a bundle again is safe. Silo skips a template it already applied to a library, and a template whose title matches a collection already in that library.

## Replace existing collections with a bundle

Turn on **Delete Existing Server Collections** only when you want to start over. It removes every shared collection in the chosen libraries before the bundle is applied, including hidden ones and ones you made by hand. Hero sections the same bundle created before are removed too.

Silo keeps a collection that also belongs to a library you did not choose, and a collection that a home section uses. Choose **Preview** first and read the list of collections it would delete.

## Change a collection

Use its edit action to change filters, title, visibility, or artwork, then choose **Save Collection**. For an imported collection, use its sync action to update the list from the source.

**Hidden** removes a collection from normal browsing. **Featured** surfaces it near the top of the library. To put a collection in a particular home row, [add a section](/docs/home-sections).

If a collection looks empty, check its filters and source results. Each viewer sees only the items their libraries and profile restrictions allow.

## If a template collection does not sync

The **TMDB Franchise** template, which some bundles add, is a placeholder that does not point at a TMDB franchise. Its collection stays empty, and syncing it fails with `TMDB franchise template requires a collection_id — edit the collection's source config and supply a real TMDB collection ID`. The collection editor cannot set that ID, so delete the collection.

MDBList lists are kept by MDBList users, and a list can be removed there. The collection's sync then fails. Delete the collection, or create a replacement from another list.
