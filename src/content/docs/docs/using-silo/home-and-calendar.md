---
slug: docs/home-and-calendar
title: Home, For You, and Calendar
description: Find something to watch now, see recommendations, and check upcoming releases.
---

In the web, mobile, and TV apps, **Home** shows rows from your server and
profile, **For You** suggests titles, and **Calendar** lists upcoming releases.

## Find your next title

1. Open **Home** to resume an unfinished item or browse a row.
2. Open **For You** for suggestions. Select a title to read its details
   before playing or requesting it.

By default, **Continue Watching** puts what you watched most recently first,
whether it's a title you're partway through or the next episode of a show
you're watching. To move a show you've caught up on to the front when a new
episode or season reaches your server, open **Settings > Home Screen** in the
web app and turn on **Show new episodes first**. Shows you haven't caught up
on keep their place. A separate **Next Up** row, if you've chosen one, uses
the same order, and so does **Next Up** in
[Jellyfin-compatible apps](/docs/jellyfin-apps). The setting follows your
profile to every device.

Only episodes newly added to your server count as new, not the episodes in a
library you add or re-add, or an older file once it's matched to its show.

For You picks titles from your profile's viewing history and ratings, so
[rating what you watch](/docs/saved-titles) improves it. In the web app, you
can also open **Settings > Personalize**, select **Open the picker**, and
choose titles you love. They're saved to your favorites. Once there's enough
to go on, the web page shows **Your Taste Profile** with your top genres and
favorite directors.

A new profile sees **Not enough data yet** until it has watched and rated a
few titles. If For You stays empty, ask the person who runs your server; the
[recommendation services](/docs/recommendations) may need setting up. You can
still browse libraries and search.

## Check upcoming releases

Calendar lists movie releases, episode airings, and season premieres from
your server's metadata, for your active [profile](/docs/profiles). A listed
release may not be on your server yet. Open the title to see whether you can
watch it.

### Open Calendar

| Client | Where to find it |
| --- | --- |
| Web | Choose **Calendar** in the sidebar. On a small screen, open the navigation menu first. |
| Mobile | Select **Calendar** in the bottom navigation. On an iPad in the wide layout, choose it in the sidebar instead. |
| TV | Choose **Calendar** in the top navigation with your remote. |

1. Use the arrows beside the week to move to the previous or next week.
   Select **Today** to return to the current week.
2. Choose **Following**, **Trending**, or **All**. In the web app, use the
   library selector to narrow the results when you have more than one library.
3. Select a day to jump to its releases. Select an entry to open the movie or
   series.

### Choose what appears

| View | What it includes |
| --- | --- |
| **Following** | Movies and series your active profile has favorited, added to its watchlist, or started watching. |
| **Trending** | Releases for titles in the server's current TMDB weekly trending list. |
| **All** | Every dated release in the catalog that your account and profile can access. |

To add a title to **Following**, [favorite it or add it to your watchlist](/docs/saved-titles).
Every view respects your library access and profile rating limits.

Badges mark a series premiere, a new season (**NEW SEASON**), or a season
finale (**FINALE**).

### Dates and empty weeks

When the metadata includes an air time and its timezone, Calendar converts it
to your device or browser's timezone, so a release can land on a different
day on devices in different timezones. Date-only releases keep their listed
date everywhere.

If a week has nothing for the view you chose, Calendar says so and offers
buttons for the other two views. Select one, change the week, or select
**Today**. In the web app, the button for **All** reads **Show everything**.
**Trending** is empty when the server
has no trending data or none of the trending titles have a release that week.

If a release you expect is missing from **All**, look at the active profile,
library filter, and week. If its release date is missing or wrong, ask the
person who runs your server to [refresh its metadata](/docs/metadata#refresh-metadata).

## Change your home rows

In the web app, open **Settings > Home Screen** and choose **Home** or a
library page. Changes save as you go.

- Turn a row's switch off to hide it, or drag rows into a new order.
- Choose **Add row** to add your own row, for example one of your
  [collections](/docs/collections).
- In a row's action menu, **Edit row…** renames it, and **Use the original
  name** undoes a rename.
- Under **More**, **Export layout** saves your rows for every page to a file,
  and **Import layout…** loads one. The reset option there brings back hidden
  rows and original names, and removes rows you added.

These changes apply only to you and follow your profile to every device,
including changes you make in the mobile and TV apps. They don't change the
shared layout or anyone else's library access. Renaming rows and exporting
your layout are only in the web app.

### iPhone, iPad, and Mac

Choose **Customize Home** at the bottom of Home, or **Customize Rows** at the
bottom of a library's **Recommended** tab. Your profile menu has the same
choice, for example **Customize Movies**. **Settings > Interface > Home
Screen** opens the editor too, with Home and each library at the top.

- Drag a row by its handle to move it. Select its eye to hide it.
- Hidden rows collect under **Hidden Rows** at the bottom. Select it to open
  the list, then select a row to show it again.
- Touch and hold a row, or right-click it on a Mac, for **Move to Top**,
  **Move to Bottom**, and **Hide Row**. A row you added also has
  **Delete Row**.
- The bar at the bottom has **Add Row**, a **⋯** button that opens
  **Options**, and **Done**.
- **Add Row** lists Silo's kinds of row and your own and your server's
  collections. Pick one, then choose **Add**. You can also
  [pin a collection](/docs/collections#show-a-collection-on-your-home) from
  its page.
- In **Options**, **Reset to Server Default** puts the page back to your
  server's rows and order and removes the rows you added. On Home,
  **Options** also has **Next Up Mode** and **New Releases First**, the
  apps' names for the [Next Up settings](#find-your-next-title) above, and
  **Hide Watched Items**, which leaves titles you've watched out of most Home
  rows.

### Apple TV

Open **Settings > General** and choose **Customize Rows** next to **Home** or
one of your libraries.

- Select a row to pick it up, press Up or Down to move it, then press Select
  to put it down. Press Menu instead to put it back where it was.
- Press Play/Pause or Right on a row for **Hide Row**, **Move to Top**, and
  **Move to Bottom**. A row you added also has **Delete Row**.
- Below the rows, **Add Row**, **Hidden Rows**, **Home Options** (**Options**
  on a library page), and **Done** work as on iPhone. **Hidden Rows** appears
  only when a row is hidden.

### Android

On a phone or tablet, open **Settings > Interface** and choose
**Home Sections** under **Home**. Select a row's eye button to hide or show
it, and drag a row by its handle to move it. TalkBack offers actions to move
a row earlier or later.

On Android TV, open **Settings > General** and choose **Home Sections**.
Select a row's eye button to hide or show it. To move rows, choose **Edit**
and use a row's arrow buttons. **Done Editing** puts the arrows away, and
**Done** closes the list.

The Android apps only hide and move Home rows. To add rows or change library
pages, use the web app.
