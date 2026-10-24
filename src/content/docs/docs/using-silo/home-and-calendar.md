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
profile to every device. Until you change it, it follows your server's
default, which the person who runs your server can turn on.

Only episodes newly added to your server count as new, not the episodes in a
library you add or re-add, or an older file once it's matched to its show.

For You picks titles from your profile's viewing history and ratings, so
[rating what you watch](/docs/saved-titles) improves it. In the web app, you
can also open **Settings > Personalize**, select **Open the picker**, and
choose at least three titles you love. They're saved to your favorites. The
picker shows only movies and series that have a poster, so to add a title
that isn't there, [favorite it](/docs/saved-titles) from its page. Once
there's enough to go on, the web page shows **Your Taste Profile** with your
top genres and favorite directors.

| Client | Where to find For You |
| --- | --- |
| Web | Choose **For You** in the sidebar. On a small screen, open the navigation menu first. |
| Mobile | Select **For You** in the bottom navigation. On an iPad in the wide layout, choose it in the sidebar instead. |
| TV | Choose **For You** in the top navigation with your remote. |

A new profile starts with rows every profile gets, such as **Highly Rated in
Your Library** and **Recently Added**, plus **Popular on This Server** once
people on more than one account have watched the same titles. Rows picked
from your own history join them as you watch and rate. Those rows need the
[recommendation services](/docs/recommendations). Until the person who runs
your server sets them up, For You shows only the shared rows. If For You is
empty, the libraries you can see don't have any movies or series yet. You can
still browse libraries and search.

On Home, the recommendations row leaves out titles that the rows above it
already show. In a small library, those rows can hold every title, so Home
may not show the recommendations row at all. The For You page still lists
those titles.

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

These changes apply only to you. They don't change the shared layout or
anyone else's library access.

In the mobile and TV apps, you can hide Home rows and change their order in
**Home Sections**:

| Client | Where to find it |
| --- | --- |
| iPhone, iPad, and Mac | **Settings > Interface**, under **Home** |
| Apple TV | **Settings > General** |
| Android phone and tablet | **Settings > Interface**, under **Home** |
| Android TV | **Settings > General** |

- Select a row's eye button to hide or show it. Hidden rows stay in the
  list, so you can show them again later.
- To move a row on iPhone or iPad, choose **Edit** and drag it. On a Mac,
  drag it. On an Android phone or tablet, drag it by its handle.
- On Apple TV and Android TV, choose **Edit** and use a row's arrow buttons to
  move it. **Done Editing** puts the arrows away, and **Done** closes the
  list.
- On iPhone, iPad, and Mac, a row's context menu also has **Move Up** and
  **Move Down**, and VoiceOver offers the same actions. TalkBack on an
  Android phone offers **Move up** and **Move down**.

Changes save as you go, to the same Home layout you edit in the web app, so
they follow your profile to every device. To add or rename rows, or to change
a library page's rows, use the web app.
