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
| Movie | `<media basename>.nfo`, then `movie.nfo` |
| Series | `tvshow.nfo` in the show folder |
| Season | `season.nfo` inside the season folder |
| Episode | `<episode basename>.nfo` beside the video |

Names match in any letter case, so Silo also finds `Movie.NFO` and `TVSHOW.nfo`.

The parts of a [multipart movie](/docs/media-folders#also-supported), such as `Movie-cd1.mkv` and `Movie-cd2.mkv`, can share one `Movie.nfo`. Silo reads it only when two or more parts are in the folder.

`movie.nfo` and `tvshow.nfo` apply only when the folder holds a single title, as `poster.jpg` does. A `movie.nfo` in a folder of several movies applies to none of them. Name each movie's NFO after its video file there instead.

Silo skips NFO files over 4 MiB and symbolic links.

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

## Identify a title with a link

An NFO can hold just a link to the title's page instead of XML:

```text
https://www.themoviedb.org/movie/12345-movie-name
```

| Provider | Link |
| --- | --- |
| TMDB | `themoviedb.org/movie/<id>` for a movie, `themoviedb.org/tv/<id>` for a series |
| IMDb | `imdb.com/title/tt<number>`, or the ID on its own, such as `tt1234567` |
| TVDB | a series link that includes the number, such as `thetvdb.com/?tab=series&id=12345` |

Silo uses the link to identify the title and takes its details from online providers. TVDB's usual `thetvdb.com/series/<name>` links carry no number, so Silo can't use them. Silo ignores a link of the wrong kind, such as a TMDB movie link in `tvshow.nfo`.

Some tools write XML with a link on the line after it. Silo reads the XML and adds the link's ID when the XML has no ID from that provider.

## What gets used

| Element | Applies to | Becomes |
| --- | --- | --- |
| `<title>`, `<originaltitle>`, `<sorttitle>`, `<tagline>` | movie, series | title, original title, sort title, tagline |
| `<plot>`, or `<outline>` when there's no `<plot>` | movie, series, season, episode | description |
| `<year>` | movie, series | year; taken from the release or air date when missing or not a number |
| `<runtime>` | movie, series, episode | runtime in minutes, also written as `117 min` or `1h 32m`; any other value is ignored |
| `<premiered>` or `<releasedate>` | movie | release date, as `YYYY-MM-DD` |
| `<premiered>` or `<aired>` | series | first air date, as `YYYY-MM-DD` |
| `<mpaa>`, or `<certification>` when there's no `<mpaa>` | movie, series | content rating. From a list such as `US:PG-13 / GB:12A`, Silo takes the first rating, `PG-13`. |
| `<originallanguage>` | movie, series | original language, when it's a language code such as `fr` |
| `<status>` | series | whether the show is still airing, such as `Continuing` or `Ended` |
| `<genre>`, `<studio>`, `<country>`, `<tag>`, each repeated | movie, series | genres, studios, countries, keywords. Values joined with ` / `, as in `Drama / Mystery`, count separately, except in `<tag>`. A show's studios are also its networks. |
| `<trailer>` | movie, series | trailer, from a YouTube or Vimeo link, including the YouTube add-on links Kodi writes |
| `<ratings>` with `<rating name="...">` and `<votes>` | movie, series, episode | ratings named `imdb`, `tmdb` or `themoviedb`, `tomatometerallcritics` or `rottentomatoes`, `tomatometerallaudience`, `metacritic`, `trakt`, `tvdb`, and `letterboxd`. Episodes keep only IMDb and TMDB. |
| `<rating>` on its own | movie, series, episode | IMDb rating, when `<ratings>` has none |
| `<criticrating>` | movie, series | Rotten Tomatoes critics score |
| `<actor>` with `<name>`, `<role>`, `<order>` | movie, series | cast; an `<order>` that isn't a number is ignored. `<type>`, such as `GuestStar`, sets the kind of credit; `<tmdbid>`, `<imdbid>`, and `<tvdbid>` identify the person; `<thumb>` is their photo, as in [Images named in an NFO](#images-named-in-an-nfo). |
| `<director>`, `<credits>`, `<writer>` | movie, series | directors, writers. Values joined with ` / ` count separately. |
| `<thumb>`, `<fanart>` | movie, series | poster, logo, and background, as in [Images named in an NFO](#images-named-in-an-nfo) |
| `<uniqueid type="tmdb">`, `type="imdb"`, `type="tvdb"` | movie, series | provider IDs used to identify the title. Other spellings such as `TheMovieDB` and `TheTVDB` work too, and a `<uniqueid>` with no type counts when it holds an IMDb ID. |
| `<imdbid>`, `<imdb_id>`, `<tmdbid>`, `<tvdbid>`, `<id>`, and a series' `<episodeguide>` | movie, series | provider IDs, when `<uniqueid>` has none from that provider. `<id>` counts when it holds an IMDb ID or has a `TMDB`, `TVDB`, or `IMDB` attribute; a bare number in `<id>` is ignored. |
| `<title>` (or `<seasonname>`) and `<premiered>` (or `<aired>`) in `<season>` | season | season name and air date |
| `<namedseason number="1">` in `<tvshow>` | season | season name, when the season's `season.nfo` gives none |
| `<title>`, `<aired>` (or `<premiered>` or `<releasedate>`), `<uniqueid>`, and `<thumb>` in `<episodedetails>` | episode | episode title, air date, provider IDs, and episode image |

Ratings other than IMDb and TMDB show only after you turn them on under **Ratings** in **Admin > Settings > Library & Metadata**.

An episode's `<uniqueid>` applies only to the episode it describes, so Silo skips it in an NFO that covers several episodes or gives numbers that don't match the file name.

Silo reads NFO files saved as UTF-8, UTF-16 with a byte-order mark, Windows-1252, or ISO-8859-1. HTML entities such as `&eacute;` work, and a plain `&`, as in `Salt & Pepper`, doesn't need to be written as `&amp;`.

Silo ignores elements it doesn't read, so NFOs exported by Kodi, Jellyfin, or tinyMediaManager work as they are.

With NFO Files first, its filled-in fields win and later providers fill the gaps. Genres come as a whole list from the first provider that has any.

NFOs don't set watched status, personal ratings, or collections.

### Images named in an NFO

Kodi and tinyMediaManager list artwork in the NFO. Silo uses it for any image that no file named as in [Add artwork](#add-artwork) supplies:

| Element | Image |
| --- | --- |
| `<thumb aspect="poster">`, or `<thumb>` with no `aspect` | poster |
| `<thumb aspect="clearlogo">` | logo |
| `<fanart>` with a `<thumb>` inside | background |
| `<thumb aspect="poster" season="1">` in `<tvshow>` | poster for season 1 |
| `<thumb>` in `<episodedetails>` | episode image |
| `<thumb>` in `<actor>` | the person's photo |

Each can be a path relative to the NFO, such as `.actors/Jane_Doe.jpg`, or a web address. Silo ignores a path outside the title's folder. Silo copies a web address into its own image storage before any app shows it, and skips one that points to an address on your local network.

When the NFO names an image, Silo prefers it over images from every online provider. A person's photo is shared by every title they appear in, so Silo uses an NFO photo only for a person who has no photo yet.

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

If Silo can't read an NFO, for example because of the file's permissions or a network share that isn't connected, **Refresh Metadata** shows an error and the item keeps its current values. Fix the permissions or reconnect the share, then refresh again.

Silo waits to match a new item whose NFO it can't read, and tries again later. A permission problem doesn't clear on its own, so in that case Silo matches the item without its NFO. Fix the permissions, then refresh the item.

When a provider ID in an NFO and one in the folder or file name, such as `{tmdb-12345}`, name different titles, Silo matches a new item to the NFO's title.

Folder names and `S01E01`-style filenames decide the series structure; NFO episode numbers can't move a video to another season. Fix the [naming](/docs/media-folders#series) instead.

An NFO with a title and no `<uniqueid>` gives the item that title without asking an online provider. If you add a `<uniqueid>` later, the next refresh links the item to that provider.

If an NFO had the wrong `<uniqueid>`, correct it and refresh the item. A refresh you start follows the NFO's ID, even when the item is already linked to another one.

[**Match Item**](/docs/metadata#correct-a-wrong-match) ignores the NFO, so the title you choose there wins.
