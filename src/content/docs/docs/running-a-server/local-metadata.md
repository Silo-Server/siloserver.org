---
slug: docs/local-metadata
title: Use local NFO metadata
description: Supply titles, descriptions, and artwork beside your media files.
---

NFO files let you describe a movie or series without depending entirely on an online provider. Keep them beside the media and use the built-in **NFO Files** provider in the library's metadata settings.

## Add local metadata

1. Create the NFO file beside the item using the names below.
2. In **Admin > Libraries**, edit the library and check **NFO Files** in **Provider Priority**. Put it first if local values should take precedence.
3. Scan a new item. For an existing item, use **Refresh Metadata** and **Quick Refresh**.
4. Check the title and description. A locked field keeps its current value; unlock it before refreshing if you want the NFO value instead.

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

This example describes your own media and needs no provider ID. For a known release, a `<uniqueid type="tmdb">` value can identify it to online providers. Use the actual ID, not a made-up number.

## What gets used

Movie and series NFOs can supply title, original title, tagline, plot, year, runtime, release or air date, content rating, genres, studios, countries, tags, ratings, cast, crew, and TMDB/TVDB/IMDb IDs. Season and episode NFOs support a smaller set.

With NFO Files first, its populated fields take precedence and later providers fill gaps. The first supplied genre list wins as a whole; Silo does not combine every provider's genres.

NFOs do not set watched status or import personal ratings. A `<set>` element is not a collection-import procedure.

## When changes do not appear

Scheduled metadata work fills gaps; it does not continually overwrite existing values from edited NFOs. Refresh the item manually after editing the file.

The NFO root must match the media type: `<movie>`, `<tvshow>`, `<season>`, or `<episodedetails>`. A broken or wrong-type file may be skipped. Use one episode block per episode sidecar.

Folder names and `S01E01`-style filenames decide the series structure. NFO episode numbers do not move a video to another season. Fix the [naming](/docs/media-folders#series) when the structure is wrong.
