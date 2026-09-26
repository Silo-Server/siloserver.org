---
slug: docs/home-and-calendar
title: Home, For You, and Calendar
description: Find something to watch now, see recommendations, and check upcoming releases.
---

On Apple, Android, and the web, **Home** brings together rows from your server and profile.
**For You** offers recommendations. **Calendar** shows upcoming releases;
it is not a download schedule.

## Find your next title

1. Open **Home** to resume an unfinished item or browse a row.
2. Open **For You** when you want suggestions. Select a title to read its
   details before playing or requesting it.
3. Keep using your own profile and [rate titles](/docs/saved-titles)
   to give recommendations information about your tastes.

A new profile has less viewing information. Empty recommendations can also
mean the required services need [configuration](/docs/recommendations). You can
still browse libraries and search.

## Check upcoming releases

Calendar lists movie releases, episode airings, and season premieres from your
server's catalog. Sign in and choose your [profile](/docs/profiles) first.
The server needs release dates in its metadata; there is no separate calendar
to subscribe to.

### Open Calendar

| Client | Where to find it |
| --- | --- |
| Web | Choose **Calendar** in the sidebar. On a small screen, open the navigation menu first. |
| iPhone, Android phone, and Android tablet | Select **Calendar** in the bottom navigation. |
| iPad | Choose **Calendar** in the sidebar when using the wide layout, or the bottom navigation in a compact layout. |
| Apple TV and Android TV | Choose **Calendar** in the top navigation with your remote. |

1. Use the left and right arrows beside the week to move to the previous or
   next week. Select **Today** to return to the current week.
2. Choose **Following**, **Trending**, or **All**. In the web app, use the
   library selector to narrow the results when you have more than one library.
3. Select a day to move to its releases. Select an entry to open the movie or
   series details and check its available actions.

### Choose what appears

| View | What it includes |
| --- | --- |
| **Following** | Movies and series your active profile has favorited, added to its watchlist, or started watching. |
| **Trending** | Releases for titles in the server's current TMDB weekly trending list. |
| **All** | All dated releases in the catalog that your account and profile can access. |

To add a title to **Following**, [favorite it or add it to your watchlist](/docs/saved-titles).
Every view respects library access and profile rating restrictions. **All**
does not include every release worldwide, and **Trending** can be empty if
the server has no trending data or no matching releases for that week.

Badges mark **SERIES PREMIERE**, **NEW SEASON**, and **FINALE**. A scheduled
release is not a promise that your server will acquire it that day. Open the
title's details to check whether it is available to watch.

### Dates and empty weeks

When the metadata includes an air time and its timezone, Calendar converts it
to your device or browser's timezone. A release can therefore appear on a
different day, or in a different week, on devices in different timezones.
Date-only releases keep their listed date everywhere. If an air time has no
source timezone, Silo keeps the listed date and displays that time without a
timezone conversion.

An empty week means there are no matching releases for that week and view.
Use the view selector to try **Trending** or **All**, change the week, or
select **Today**.

If a release is missing from **All**, check the active profile, library filter,
and date first. Server administrators can check the title's
[metadata and refresh it](/docs/metadata#refresh-metadata) if its release date
is missing or outdated.

## Change your home rows

Open **Settings > Home Screen** in the web app. Choose the home or library
view you want to change, then reorder or hide its rows. Return to that view
to check the result. **Reset to Default** restores the server layout for that view.

These are personal layout changes. They do not edit the administrator's
shared layout or change anyone else's library access.
