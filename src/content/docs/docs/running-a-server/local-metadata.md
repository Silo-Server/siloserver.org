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

## Add artwork

Put images beside the media with these names. Each name can end in `.jpg`, `.jpeg`, `.png`, or `.webp`. Use the names and extensions in lowercase, as shown.

| Image | Names |
| --- | --- |
| Poster | `poster`, `folder`, `cover`, or `<media basename>-poster` in the movie or show folder |
| Background | `fanart`, `backdrop`, `background`, or `<media basename>-fanart` |
| Logo | `logo`, `clearlogo`, or `<media basename>-logo` |
| Season poster | `poster`, `folder`, or `cover` inside the season folder, or `seasonNN-poster` in the show folder, such as `season01-poster.jpg`. Specials also accept `season-specials-poster`. |
| Episode image | `<episode basename>-thumb` beside the video |

Silo uses these images only when **NFO Files** is checked for the library, but an image works without an `.nfo` file. Silo skips empty files, files over 8 MiB, and symbolic links.

Names without a basename, such as `poster.jpg` or `folder.jpg`, apply only when the folder holds a single title. A `folder.jpg` shared by a folder of several movies applies to none of them. `<media basename>-poster.jpg` always applies to its own movie.

After you replace an image, refresh the item. Local images don't appear in the **Images** list in **Edit Metadata**.

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

| Element | Applies to | Becomes |
| --- | --- | --- |
| `<title>`, `<originaltitle>`, `<tagline>`, `<plot>` | movie, series | title, original title, tagline, description |
| `<year>` | movie, series | year; taken from the release or air date when missing |
| `<runtime>` | movie, series | runtime in minutes; a value that isn't a number is ignored |
| `<premiered>` or `<releasedate>` | movie | release date, as `YYYY-MM-DD` |
| `<premiered>` or `<aired>` | series | first air date, as `YYYY-MM-DD` |
| `<mpaa>` | movie, series | content rating |
| `<genre>`, `<studio>`, `<country>`, `<tag>`, each repeated | movie, series | genres, studios, countries, keywords |
| `<ratings>` with `<rating name="...">` | movie, series, episode | ratings named `imdb`, `tmdb` or `themoviedb`, `tomatometerallcritics` or `rottentomatoes`, and `tomatometerallaudience` |
| `<rating>` on its own | movie, series, episode | IMDb rating, when `<ratings>` has none |
| `<actor>` with `<name>`, `<role>`, `<order>` | movie, series | cast; actor photos in `<thumb>` are ignored |
| `<director>`, `<credits>` | movie, series | directors, writers |
| `<uniqueid type="tmdb">`, `type="imdb"`, `type="tvdb"` | movie, series | provider IDs used to identify the title |
| `<title>`, `<plot>` in `<season>` | season | season name and description |
| `<title>`, `<plot>`, `<aired>`, `<runtime>` in `<episodedetails>` | episode | episode title, description, air date, runtime |

Silo ignores elements it doesn't read, so NFOs exported by Kodi, Jellyfin, or tinyMediaManager work as they are.

With NFO Files first, its filled-in fields win and later providers fill the gaps. Genres come as a whole list from the first provider that has any.

NFOs don't set watched status, personal ratings, or collections.

## Set up a series with no online match

For a series no online provider knows, such as a workout course, name the folders and files like any other series and add NFOs for the names and descriptions:

```text
Fitness/
  Workout Series/
    tvshow.nfo            # show title and plot, no <uniqueid> needed
    poster.jpg
    fanart.jpg
    Season 01/
      season.nfo          # season name, such as "Course A"
      poster.jpg          # season poster
      Workout Series S01E01 - Chest and Back.mkv
      Workout Series S01E01 - Chest and Back.nfo        # episode title and plot
      Workout Series S01E01 - Chest and Back-thumb.jpg  # episode image
```

The folders and file names build the show, its seasons, and its episodes. The NFOs and images supply names, descriptions, and artwork. An episode without an `.nfo` is titled `Episode 1`, `Episode 2`, and so on, so you can fill in a show a few episodes at a time.

## Use NFOs in a Mixed library

Give each movie or event its own `Title (Year)` folder, and put each show's episodes in `Season NN` folders. This sports layout keeps events and weekly shows in one [Mixed library](/docs/manage-libraries#choose-a-library-type):

```text
WWE/
  WrestleMania 41 (2025)/
    WrestleMania 41 (2025).mkv
    movie.nfo             # event title and plot; <uniqueid> optional
    poster.jpg
  WWE SmackDown/
    tvshow.nfo
    Season 27/
      season.nfo
      poster.jpg
      WWE SmackDown S27E15.mkv
      WWE SmackDown S27E15.nfo
      WWE SmackDown S27E15-thumb.jpg
```

Silo decides whether a file is a movie or an episode from its folders and file name, before it reads any NFO. A file inside a season folder is an episode. A file in a folder with a TMDB or IMDb ID, such as `{tmdb-12345}`, is a movie, even if its name has an `S01E01` code. An NFO can't change this, and Silo ignores a `tvshow.nfo` beside a file it treats as a movie.

An event with a `<uniqueid type="tmdb">` still gets online details. An event without one uses its NFO and local images.

If a folder is sorted as the wrong type, fixing the NFO won't move it:

1. In **Admin > Libraries**, look for the folder under [**Ambiguous Roots**](/docs/manage-libraries#resolve-ambiguous-roots). If it isn't listed, fix the folder layout and scan the library again instead.
2. Select **Override** beside the folder.
3. Set **Type** to **Movie** or **Series**, then select **Save Override**.
4. Scan the library.

## When changes don't appear

Scheduled metadata work only fills gaps, so after editing an NFO, refresh the item yourself.

The NFO's root element must match the media type: `<movie>`, `<tvshow>`, `<season>`, or `<episodedetails>`. Silo may skip a broken or wrong-type file. Put one episode block in each episode's NFO.

Folder names and `S01E01`-style filenames decide the series structure; NFO episode numbers can't move a video to another season. Fix the [naming](/docs/media-folders#series) instead.

An NFO with a title and no `<uniqueid>` gives the item that title without asking an online provider. If you add a `<uniqueid>` later, the next refresh links the item to that provider.

If an NFO had the wrong `<uniqueid>`, correct it and refresh the item. A refresh you start follows the NFO's ID, even when the item is already linked to another one.

[**Match Item**](/docs/metadata#correct-a-wrong-match) ignores the NFO, so the title you choose there wins.
