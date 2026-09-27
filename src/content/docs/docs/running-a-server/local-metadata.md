---
slug: docs/local-metadata
title: Use local NFO metadata
description: Supply titles, descriptions, and artwork beside your media files.
---

NFO files describe a movie or series from files you keep beside the media. Silo reads them through the built-in **NFO Files** provider in each library's metadata settings.

## Add local metadata

1. Create the NFO file beside the item using the names below.
2. In **Admin > Libraries**, edit the library and check **NFO Files** in **Provider Priority**. Put it first if local values should take precedence.
3. Scan a new item. For an existing item, use **Refresh Metadata** and **Quick Refresh**.
4. Look at the title and description. A locked field keeps its current value, so unlock it before refreshing if you want the NFO value.

## File names

| Item | File |
| --- | --- |
| Movie | `movie.nfo`, then `<media basename>.nfo` |
| Series | `tvshow.nfo` in the show folder |
| Season | `season.nfo` inside the season folder |
| Episode | `<episode basename>.nfo` beside the video |
| Episode image | `<episode basename>-thumb.jpg` |

For season artwork, use `poster.jpg` inside the season folder or `seasonNN-poster.jpg` in the series root.

## A small movie example

```xml
<movie>
  <title>Garden Through the Seasons</title>
  <year>2024</year>
  <plot>A year of recordings from our garden.</plot>
  <genre>Home video</genre>
</movie>
```

Your own recordings need no provider ID. For a published title, add its real ID in a `<uniqueid type="tmdb">` element so online providers can identify it.

## What gets used

Movie and series NFOs can supply title, original title, tagline, plot, year, runtime, release or air date, content rating, genres, studios, countries, tags, ratings, cast, crew, and TMDB/TVDB/IMDb IDs. Season and episode NFOs support a smaller set.

With NFO Files first, its filled-in fields win and later providers fill the gaps. Genres come as a whole list from the first provider that has any.

NFOs don't set watched status, personal ratings, or collections.

## When changes don't appear

Scheduled metadata work only fills gaps, so after editing an NFO, refresh the item yourself.

The NFO's root element must match the media type: `<movie>`, `<tvshow>`, `<season>`, or `<episodedetails>`. Silo may skip a broken or wrong-type file. Put one episode block in each episode's NFO.

Folder names and `S01E01`-style filenames decide the series structure; NFO episode numbers can't move a video to another season. Fix the [naming](/docs/media-folders#series) instead.
