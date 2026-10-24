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

Put images beside the media with these names. Each name can end in `.jpg`, `.jpeg`, `.png`, `.webp`, `.tbn`, or `.gif`, in any letter case, so `Poster.JPG` works too. Where a row lists several names, Silo uses the first one it finds.

| Image | Names |
| --- | --- |
| Movie poster | `<media basename>-poster`, then `poster`, `folder`, `cover`, `default`, or `movie` in the movie folder |
| Series poster | `poster`, `folder`, `cover`, `default`, or `show` in the show folder |
| Background | `<media basename>-fanart` for a movie, then `fanart`, `backdrop`, `background`, or `art` |
| Logo | `<media basename>-logo` or `<media basename>-clearlogo` for a movie, then `logo` or `clearlogo` |
| Season poster | `poster`, `folder`, or `cover` inside the season folder, or `seasonNN-poster` in the show folder, such as `season01-poster.jpg`. Specials also accept `season-specials-poster`. |
| Episode image | `<episode basename>-thumb`, then `<episode basename>`, beside the video |

Silo uses these images only when **NFO Files** is checked for the library, but an image works without an `.nfo` file. When a local image is present, Silo prefers it over images from every online provider, including for viewers who use another metadata language. Silo skips empty files, files over 25 MiB, and symbolic links.

Names without a basename, such as `poster.jpg` or `folder.jpg`, apply only when the folder holds a single title. A `folder.jpg` shared by a folder of several movies applies to none of them. `<media basename>-poster.jpg` always applies to its own movie. A show doesn't use the `<media basename>` names, so an image named after an episode, such as `Show S01E01-poster.jpg`, never becomes the show's poster. When a show's episodes sit directly in the show folder, that folder's `poster.jpg` is the show's poster, not a season's. Name the season poster `season01-poster.jpg` there instead.

If the library's folder can't be reached during a refresh, such as a network share that isn't mounted, Silo keeps the local images it already has.

After you replace an image, refresh the item.

For a movie or series, the **Images** list in **Edit Metadata** also offers these images, marked **LOCAL**, even when **Local metadata (NFO + artwork)** is off for the library. The list follows the rules above, so files they skip don't appear. Apply one as you would a provider image, as described in [Choose artwork](/docs/metadata#choose-artwork).

If **Could not load from LOCAL** appears above the images, Silo couldn't read some of the title's local images, for example because the title's folder is a symbolic link to a place outside the library's folders. Silo leaves them out of the list.

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

Silo applies an edited NFO, or a new image beside the media, the next time it scans that folder. With [real-time monitoring](/docs/autoscan#real-time-monitoring), that's within seconds of saving the file; otherwise the daily library scan picks it up. A field you locked keeps its value. If the NFO's `<uniqueid>` changed, Silo refreshes the item and links it to that title, as a refresh you start does.

A value you delete from an NFO stays until you refresh the item and an online provider fills it. An image you delete stays until you refresh the item. An NFO or image directly in a library's top folder, beside loose movie files, waits for the daily library scan.

The NFO's root element must match the media type: `<movie>`, `<tvshow>`, `<season>`, or `<episodedetails>`. Silo may skip a broken or wrong-type file. Put one episode block in each episode's NFO.

Folder names and `S01E01`-style filenames decide the series structure; NFO episode numbers can't move a video to another season. Fix the [naming](/docs/media-folders#series) instead.

An NFO with a title and no `<uniqueid>` gives the item that title without asking an online provider. If you add a `<uniqueid>` later, the next scan or refresh links the item to that provider. If you only want a movie or series off the unmatched list and don't need your own title, description, or artwork, [**Ignore**](/docs/metadata#ignore-an-unmatched-item) does that without an `.nfo`.

If an NFO had the wrong `<uniqueid>`, correct it and refresh the item. A refresh you start follows the NFO's ID, even when the item is already linked to another one.

[**Match Item**](/docs/metadata#correct-a-wrong-match) ignores the NFO, so the title you choose there wins.
