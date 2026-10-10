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

## File types

Silo adds video files with these extensions, in upper or lower case:

| Format | Extensions |
| --- | --- |
| Matroska and WebM | `.mkv`, `.webm` |
| MP4 and QuickTime | `.mp4`, `.m4v`, `.mov`, `.3gp`, `.3g2`, `.f4v` |
| AVI | `.avi`, `.divx` |
| MPEG transport stream | `.ts`, `.m2ts`, `.mts` |
| MPEG program stream | `.mpg`, `.mpeg` |
| Windows Media | `.wmv`, `.asf` |
| Flash video | `.flv` |
| Ogg | `.ogv`, `.ogm` |

Silo doesn't add video files with any other extension.

Remux a DVD or Blu-ray title into a single file, such as an `.mkv`, before you add it. DVD `.vob` files, `.iso` disc images, and the `.m2ts` files in a Blu-ray or AVCHD `BDMV/STREAM` folder are left out. A disc splits one movie into several files next to its menus and extras, so each piece would show up as its own title.

RealMedia files (`.rm` and `.rmvb`) are left out too. Convert them to one of the formats above to add them.

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

Loose files such as `movies/Movie Name (2024).mkv` also work, as do release-style names like `Movie.Name.2024.1080p.BluRay.mkv`. Silo removes resolution, source, and codec details from the search title.

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

Audiobook folders are covered in the [Beta audiobook guide](/docs/audiobook-libraries).

## Provider IDs

If a title matches the wrong entry, add its provider ID to the folder name:

```text
Movie Name (2024) {tmdb-12345}
Show Name (2024) {tvdb-12345}
Movie Name (2024) {imdb-tt1234567}
```

Replace the sample numbers with the real ID for your title.

## Also supported

Silo reads these forms as well.

| Kind | Examples |
| --- | --- |
| Other episode numbering | `1x03`, `S01xE03`, `s01.e03`, `Season 1 Episode 3`, `2009x03` |
| Episode-only names inside a season folder | `Season 02/E03.mkv`, `Season 02/03 - Episode Title.mkv`, `S02/Episode 03.mkv` |
| Compact codes | `Show.Name.103.mkv` (season 1, episode 3) |
| Several episodes in one file | `S01E01-E03`, `S01E01E02`, `1x01x02` |
| Air dates | `Show Name - 2024-02-15.mkv`; dots, underscores, and spaces also work as separators |
| Season folder names | `Season 01`, `Season_01`, `S01`, `01`, and localized names such as `Staffel 1` or `Temporada 1` |
| Provider IDs in other styles | `[tmdbid=12345]`, `[tmdbid-12345]`, `[imdbid-tt1234567]`, `[tvdbid=12345]` |
| Editions | `{edition-Director's Cut}`, or words such as `Extended`, `Theatrical`, or `Director's Cut` in the name |
| Multipart movies | `Movie Name (2024) cd1.mkv`, `disc2`, `part1`, `pt2` |

A file with several episodes links to its first episode. Editions and multipart files of one movie are grouped under the same title.

Numbers without season context can be ambiguous. A bare `03.mkv` or an absolute number such as `136` links only when it identifies one episode, so put these files in a season folder or add the season to the name. Episode files that don't name their show also need a show folder; otherwise you have to match them by hand.

## Sidecars and extras

Keep NFO files, posters, and subtitle files beside the item they describe. See [Local metadata](/docs/local-metadata) for what Silo reads.

Put movie extras in a folder inside the movie's folder, such as `Trailers`, `Featurettes`, or `Behind the Scenes`. Silo ignores an extras folder at the top of the library because it doesn't belong to a title. In a series, files in `Extras` with a name like `S00E01` stay episodes.

## Renaming and moving files

Test a naming change on one title before renaming a whole collection. If files disappear after a network mount drops, restore the mount and check the path; don't delete the library or move the files.

Paths sent by another service must map to the folder Silo sees. For example, an import reported as `/tv/Show Name` may need a rewrite to `/mnt/media/tv/Show Name`. Set the rewrite on the [Autoscan source](/docs/autoscan).
