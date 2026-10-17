---
slug: docs/home-sections
title: Curate the home screen
description: Add and arrange the rows everyone sees on Home and library pages.
---

Sections are the rows people browse on Home and above each library's grid. Use **Admin > Sections** to choose them and their order for everyone.

## Add a row

1. Open **Admin > Sections** and choose the page: **Home** or a library.
2. Choose **Add row**.
3. Pick a kind of row from the tabs, or search for one, for example `trending` or `Christmas`. Under **Collections & rules**, **A collection** shows a collection and **Titles matching rules** builds a row from rules.
4. Check the preview, then change the **Row name** if you want. **More options** sets the **Number of titles** and whether the row is the **Hero banner**.
5. Choose **Add row**. New rows go to the bottom of the page.

On a library page, **Add to these library pages** also adds the row to other libraries' pages in the same step. The add button then counts the pages, for example **Add to 3 pages**. Each page gets its own copy, so you can change or remove it there later. For a row that's already on a page, open its action menu and choose **Add to other libraries…**.

To show a collection as a row, you can also start from the collection: see **Rows that show it** in [Create server collections](/docs/manage-collections#create-a-collection).

## Change the order or turn a row off

Drag a row to move it. Changes save right away. The switch on each row turns it on or off for everyone, and a row that's off keeps its settings.

A row's action menu has **Edit row…**, **Use as hero banner**, **Move to top**, **Move to bottom**, and **Delete row…**. The web app shows the hero banner as a banner; the apps show it as a regular row.

To change several rows at once, open **More** and choose **Select rows**. You can then turn them on or off, or delete them together.

## Restore the default rows

Open **More** and choose **Restore defaults…** to put back the rows Silo starts with on that page. Rows that show a collection are removed, but the collections stay. Turn on **Also reset every profile's Home**, or the same switch for a library page, to also clear what each profile hid, renamed, moved, or added there.

## What profiles can change

Profiles can still hide, rename, or reorder these rows, and add their own, in [**Settings > Home Screen**](/docs/home-and-calendar#change-your-home-rows). If a change shows for one profile but not another, that profile has changed the row or its page's order itself.

## A row is missing or empty

Check that the row is on the page you're looking at and that its switch is on. Then check the collection or rules it uses, and the viewer's library access and profile restrictions.

On Home, a hero banner leaves out titles rated 18 or over, such as NC-17, for each profile that hasn't turned on [**Show adult titles in Featured**](/docs/home-and-calendar#change-your-home-rows). For those profiles the banner can show fewer titles than its source, and Home skips it when none are left.

Rows that pick titles by rating, such as **Critically Acclaimed**, show only titles that enough people have rated on TMDB. Silo gets those vote counts from the TMDB plugin, version 1.2.25 or later, when a title's metadata refreshes, so these rows can be short or empty until then. To fill in every count at once, choose [**Refresh Metadata**](/docs/manage-libraries#scan-or-refresh) on each library, then **Refresh All Metadata**. When nothing matches a row, its preview in **Add row** or **Edit row** says what it looks for.

Recommendation rows show results from the [recommendation jobs](/docs/recommendations).
