---
slug: docs/home-and-calendar
keywords: ["front page", "main screen", "release schedule", "air date", "coming soon", "what to watch next", "rearrange rows", "personalized picks", "theatrical release"]
questions: ["When does the next episode of my show come out?", "Why are my recommendations empty?", "How do I hide rows on my home screen?", "How do I make new episodes show up first in Continue Watching?", "Why isn't a movie that's in theaters on my calendar?"]
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

To take a title off **Continue Watching** or **Next Up**,
[remove it from the card's menu](/docs/watch-history#remove-a-title-from-continue-watching-or-next-up).

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

In the web app, a profile with no favorites sees **Pick what you love** the
first time it opens Home. Choose **Done** to open For You, or **Skip** to go
to Home. Until you favorite a title, the **Personalize your home** banner on
Home opens the picker again. After you watch or rate something on any device,
Silo updates your personal rows in the background. Reload For You to see
them, or pull down to refresh it on a phone or tablet.

On Home, the recommendations row leaves out titles that the rows above it
already show. In a small library, those rows can hold every title, so Home
may not show the recommendations row at all. The For You page still lists
those titles.

## Check upcoming releases

Calendar lists episode airings, season premieres, and movie releases from
your server's metadata, for your active [profile](/docs/profiles). A movie is
listed on the date of its first home release: the earliest day, in any
country, that it can be streamed or bought digitally or comes out on disc.
Calendar doesn't use cinema release dates. A listed release may not be on
your server yet. Open the title to see whether you can watch it.

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
finale (**FINALE**). A movie's badge shows whether its date is a digital
release (**DIGITAL**) or a disc release (**PHYSICAL**).

### Dates and empty weeks

When the metadata includes an air time and its timezone, Calendar converts it
to your device or browser's timezone, so a release can land on a different
day on devices in different timezones. Date-only releases, including every
movie, keep their listed date everywhere.

If a week has nothing for the view you chose, Calendar says so and offers
buttons for the other two views. Select one, change the week, or select
**Today**. In the web app, the button for **All** reads **Show everything**.
**Trending** is empty when the server
has no trending data or none of the trending titles have a release that week.

If a release you expect is missing from **All**, look at the active profile,
library filter, and week. A movie isn't listed until its metadata has a digital
or disc release date, even if it's already in cinemas. If a release date is
missing or wrong, ask the person who runs your server to
[refresh the title's metadata](/docs/metadata#refresh-metadata). For a movie,
they should [update the TMDB plugin](/docs/plugins#update-or-turn-off-a-plugin)
first, since it supplies the digital and disc dates.

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
pages, use the web app or an Apple app.
