---
slug: docs/media-folders
title: Prepare media folders and filenames
description: Arrange movie and series files so Silo can find and identify them.
---

Keep movies and series in separate folders, give each title its own folder named `Title (Year)`, and number episodes `S01E01`. Silo also reads most names produced by Sonarr, Radarr, FileBot, Plex, and Jellyfin, so you rarely need to rename an existing collection.

## Library folders

Silo reads media from a folder on its filesystem. It cannot use an `s3://`, `https://`, or `file://` URL as a library folder.

With the default Docker setup, `MEDIA_ROOT=/srv/media` maps the host's media to `/mnt/media` in the container:

| Folder on the host | Folder entered in Silo |
| --- | --- |
| `/srv/media/movies` | `/mnt/media/movies` |
| `/srv/media/tv` | `/mnt/media/tv` |

Mount network shares on the host first, and make sure Silo can read the files, before you [add the library](/docs/manage-libraries).

## Movies

Use one folder per movie, especially when you have posters, subtitles, extras, or several versions:

```text
movies/
  Movie Name (2024)/
    Movie Name (2024).mkv
    Movie Name (2024).en.srt
    poster.jpg
```

Silo uses `poster.jpg` only when **NFO Files** is checked for the library. See [artwork names](/docs/local-metadata#add-artwork).

Loose files such as `movies/Movie Name (2024).mkv` also work, as do release-style names like `Movie.Name.2024.1080p.BluRay.mkv`, names without a year like `Movie.Name.1080p.BluRay.x264-GROUP.mkv`, and a year in square brackets, as in `Movie Name [2024] 720p.mkv`. Silo removes resolution, source, and codec details from the search title. Brackets and dots that belong to the title, as in `[REC]` or `S.W.A.T.`, stay.

Inside a folder that names the movie, the file name can be anything, such as a disc rip's `title00.mkv`. A folder names the movie when it has a year (`Movie Name (2024)`), a [provider ID](#provider-ids), or a release name with a year (`Movie.Name.2024.1080p.BluRay`). In any other folder, `title00.mkv` becomes a title called "title00".

## Series

Give every show its own folder, with a folder per season:

```text
tv/
  Show Name (2024)/
    Season 01/
      Show Name - S01E01.mkv
      Show Name - S01E02.mkv
    Specials/
      Show Name - S00E01.mkv
```

Use `S01E01` for ordinary episodes and `S00E01` for specials. Text after the episode number, such as an episode title or release details, is fine.

Season folders can also be named `Season.01`, `Season_01`, `Season1`, or `S01`, or use another language's word for season, such as `Staffel 1` or `Temporada 1`. The number can come first (`3.Staffel`), and text after it is fine (`Season 01 - Arc Name`). `Specials` or `Special` holds season 0.

Episodes can also sit directly in the show folder when each name has a code such as `S01E03`, for example `Show Name/Show Name S01E03.mkv`. A season pack folder such as `Show.Name.S01.COMPLETE` works inside the show's folder, and in a Series library also on its own as the show folder.

Audiobook folders are covered in the [Beta audiobook guide](/docs/audiobook-libraries).

## Provider IDs

If a title matches the wrong entry, add its provider ID to the folder name or the file name:

```text
Movie Name (2024) {tmdb-12345}
Show Name (2024) {tvdb-12345}
Movie Name (2024) {imdb-tt1234567}
```

Replace the sample numbers with the real ID for your title. Silo reads TMDB, TVDB, and IMDb IDs. It never reads a bare number as an ID.

A movie can carry the ID in its file name instead, as in `Movie Name (2024)/Movie Name (2024) {tmdb-12345}.mkv`. A show needs the ID in the show folder's name; an ID in an episode's file name doesn't identify the show.

## Also supported

Silo reads these forms as well.

| Kind | Examples |
| --- | --- |
| Other episode numbering | `1x03`, `S01xE03`, `s01.e03`, `S 01 E 03`, `Season 1 Episode 3`, `2009x03` |
| Episode-only names inside a season folder | `Season 02/E03.mkv`, `Season 02/03 - Episode Title.mkv`, `Season 02/003.Episode.Title.mkv`, `S02/Episode 03.mkv`, `Specials/E01.mkv` |
| Release numbering after the episode | `Show Name - S01E01.001 - Pilot [Bluray-1080p].mkv` is `S01E01` |
| Several episodes in one file | `S01E01-E03`, `S01E01-03`, `S01E01E02`, `1x01x02`, `2009x03-E15` |
| Air dates | `Show Name - 2024-02-15.mkv`, `Show.Name.2024.02.15.mkv`; underscores and spaces also work as separators |
| Season folder names | `Season 01`, `Season.01`, `Season_01`, `S01`, `Specials`, and `Staffel`, `Stagione`, `Sæson`, `Säsong`, `Temporada`, `Seizoen`, `Kausi`, `Sezon`, `Sezona`, `Sezóna`, `Sezonul`, `시즌`, `シーズン`, `сезон`, or `Series` with a number |
| Provider IDs in other styles | `(tmdb-12345)`, `{tmdb=12345}`, `[tmdbid=12345]`, `[tmdbid-12345]`, `[imdbid-tt1234567]`, `[tvdbid=12345]`, `[tt1234567]`, or a folder name ending in an IMDb ID, as in `Movie Name tt1234567` |
| Editions | `{edition-Director's Cut}`, or words such as `Extended`, `Theatrical`, or `Director's Cut` in the name |
| Multipart movies | `Movie Name (2024) cd1.mkv`, `disc2`, `part1`, `pt2` |

A file with several episodes links to its first episode. Editions and multipart files of one movie are grouped under the same title.

A season folder named only with a number, such as `01`, works inside a show folder in a Series library. In a Mixed library it counts only when the file names have a code such as `S01E03`.

## Episode numbers without a season

Put files numbered only by episode in a season folder, or add the season to the name. Without either, Silo has to work out the season:

- A three-digit number that makes up the whole name, or is joined by dots or underscores, is read as season and episode. `Show.Name.103.mkv` is season 1 episode 3, and `Show Name/301.mkv` is season 3 episode 1. Set off by spaces or dashes, the number is an episode number on its own: `Show Name 103.mkv` is episode 103.
- In a Series library, `Show Name/E03.mkv`, `Show Name/03.mkv`, and `[Group] Show Name - 136 [720p].mkv` are episodes with no season. Silo links such a file when its number matches exactly one season 1 episode, or when its name has an episode title that matches exactly one episode in the series. Otherwise the file isn't linked to an episode, and it never becomes a special. Rename it with its season to fix it.
- A season folder wins over a three-digit number that disagrees with it: `Season 21/301.mkv` is season 21 episode 301. A season in the file name wins over the folder: `Season 02/Show Name S01E05.mkv` is season 1 episode 5.

Episode numbers can have up to five digits.

Files named by air date, such as `Show Name - 2026-04-24 - Episode Title.mkv`, link to the episode that aired that day. If several episodes aired that day, the file may stay unlinked; rename it with season and episode. Day-first dates such as `24.04.2026` aren't read as air dates.

## Show folders

Give each show its own folder. The folder's name wins over the file name, so `Show Name/Pilot - S01E01.mkv` belongs to Show Name.

Files placed directly in a library folder take their show from their own names, so `Show.One.S01E01.mkv` and `Show.Two.S01E01.mkv` can sit side by side there. In any other folder, such as `tv/Downloads/`, Silo treats the folder as one show. To keep several shows in one folder without show folders, add that folder as its own library folder.

A folder named only with a number directly in a library folder, such as `tv/86/`, is a show, not a season.

## Sidecars and extras

Keep NFO files, posters, and subtitle files beside the item they describe. Silo doesn't look for subtitles in a `Subs` folder. See [Local metadata](/docs/local-metadata) for what Silo reads.

Put extras in a folder inside the movie's or show's folder, or inside a season folder. Silo recognizes these folder names, in any letter case and with `.`, `_`, or `-` in place of spaces:

- `Trailers` or `Trailer`, `Teasers` or `Teaser`
- `Featurettes` or `Featurette`, `Behind the Scenes`
- `Deleted Scenes` or `Deleted Scene`, `Clips` or `Clip`
- `Bloopers`, `Interviews`, `Scenes`, `Shorts`
- `Extras`, `Extra`, or `Other`

An extra can also sit beside the movie file with a suffix, as in `Movie Name (2024)-trailer.mkv`. The suffixes are `-trailer`, `-teaser`, `-featurette`, `-clip`, `-behindthescenes`, `-bloopers`, `-deleted`, `-deletedscene`, `-interview`, `-scene`, `-short`, `-extra`, and `-other`. A `.` works in place of the `-`.

Extras appear in the title's **Extras** section and are never offered as versions. An extras folder name at the top of a library, outside any title, doesn't count: Silo scans its files as ordinary titles. In a series, a file in `Extras` with a name like `S00E01` is a special, and `S01E01` goes to season 1.

## Leave files out of a scan

Put one of these files in a folder to keep its content out of Silo:

| File | What Silo skips |
| --- | --- |
| `.nomedia` | The folder and everything below it |
| `.ignore` | Empty, the folder and everything below it. With lines in it, the files and folders matching each line, using the same patterns as `.gitignore`, as in Jellyfin |
| `.siloignore` | The files and folders matching each line, as in Plex's `.plexignore`. Each line is a pattern relative to the folder, and `*` doesn't reach into subfolders, so write `Season 2/*.mkv` for files in a subfolder |

Silo doesn't read `.plexignore` itself. Lines starting with `#` are comments in `.ignore` and `.siloignore`.

If you add an ignore file to a folder that was already scanned, the next scan treats its titles like deleted files: they disappear from the apps and are removed from the library later.

Silo also skips these folders on its own in every library: `@eaDir`, `@Recycle`, `#recycle`, `.recyclebin`, `$RECYCLE.BIN`, `.trash`, `.deleted`, `.inbound`, and `.downloads`. In a Movies library it also skips `Sample`, `Samples`, `Subs`, and `Subtitles` folders, and sample files such as `Sample.mkv`.

## If a title isn't identified

Fix the names, or correct the title in Silo, when a layout gives Silo too little to go on:

- Episode files that don't name their show, in a folder that doesn't name it either. Put them in a show folder.
- A folder and a file that name different titles, as in `On Fire (2024)/Soul on Fire (2025).mkv`. Add a [provider ID](#provider-ids) to the folder.
- A disc rip such as `title00.mkv` in a folder that doesn't name the movie. Rename the folder, or use [Match Item](/docs/metadata#correct-a-wrong-match).
- Episodes numbered in an order the provider doesn't use, such as absolute or DVD order, without matching episode titles. Rename them with season and episode.

Folders Silo can't classify on its own are listed under [**Ambiguous Roots**](/docs/manage-libraries#resolve-ambiguous-roots), where you can set their type and title.

## Renaming and moving files

Test a naming change on one title before renaming a whole collection. If files disappear after a network mount drops, restore the mount and check the path; don't delete the library or move the files.

Paths sent by another service must map to the folder Silo sees. For example, an import reported as `/tv/Show Name` may need a rewrite to `/mnt/media/tv/Show Name`. Set the rewrite on the [Autoscan source](/docs/autoscan).
