---
title: Libraries
description: Supported media library paths, naming patterns, and scan behavior.
---

Library paths are filesystem paths as seen by the Silo server process. In Docker Compose, that means paths inside the container, not host paths.

## Library Paths

Use absolute Linux-style paths that point to directories Silo can read:

```text
/mnt/media/movies
/mnt/media/tv
```

With the default Compose file, `MEDIA_ROOT=/srv/media` on the host is mounted at `MEDIA_CONTAINER_ROOT=/mnt/media` in the Silo container. If your host movies directory is `/srv/media/movies`, add it in Silo as `/mnt/media/movies`.

Silo does not support URL-style library roots such as `s3://...`, `https://...`, or `file://...`.

## Movies

Recommended:

```text
/mnt/media/movies/Movie Name (2016) {tmdb-12345}/Movie Name (2016).mkv
```

Also supported:

```text
/mnt/media/movies/Movie Name (2016).mkv
/mnt/media/movies/Movie Name {tmdb-12345}/Movie Name (2016).mkv
/mnt/media/movies/Movie Name {imdb-tt1234567} {tmdb-12345}/Release.Name.2016.1080p.mkv
```

Movie folders with a year and TMDB ID are recommended. Loose movie files are supported, but one folder per movie is more reliable when you use posters, subtitles, extras, or multiple versions.

## Series

Recommended:

```text
/mnt/media/tv/Show Name (2008) {tvdb-12345}/Season 01/Show Name - S01E01.mkv
```

Also supported:

```text
/mnt/media/tv/Show Name/Season 01/Show Name S01E03.mkv
/mnt/media/tv/Show Name/Season 01 - Arc 01/Show Name S01E03.mkv
/mnt/media/tv/Show Name/Specials/Show Name S00E01.mkv
/mnt/media/tv/Show Name/Extras/Show Name S00E01.mkv
/mnt/media/tv/Show Name/Show Name S01E03.mkv
```

Use `S01E01` style episode numbers. Silo accepts 1-4 digit seasons and 1-3 digit episodes, case-insensitively. Extra release text after the episode number is fine.

Series folders with a year and TVDB ID are recommended.

Daily shows can use an air date:

```text
/mnt/media/tv/The Daily Show/The Daily Show 2024-02-15 Guest Name.mkv
/mnt/media/tv/The Daily Show/The.Daily.Show.2024.02.15.Guest.Name.mkv
```

Supported date separators are `-`, `.`, `_`, and spaces.

## Provider IDs

Provider IDs can be added to movie, series, or file names:

```text
Movie Name {tmdb-12345}
Movie Name [tmdbid-12345]
Movie Name {imdb-tt1234567}
Show Name {tvdb-12345}
```

Supported prefixes are `tmdb`, `tmdbid`, `imdb`, `imdbid`, `tvdb`, and `tvdbid`.

## Editions and Parts

Silo recognizes Plex-style edition tags:

```text
Movie Name (1982) {edition-Final Cut}/Movie Name (1982).mkv
Movie Name (1982)/Movie Name (1982) {edition-Director's Cut}.mkv
```

Common edition text such as `Director's Cut`, `Final Cut`, `Extended`, `Theatrical`, `Unrated`, `IMAX`, `Remastered`, and similar labels is also detected from filenames.

Multi-episode files can use ranges like `S01E01-E02`. Multipart movies and split episodes can use `cd`, `disc`, `part`, or `pt` plus a number.

## Avoid

These patterns are not supported as primary naming schemes:

- `1x02`
- `101`
- bare `E01`
- flat folders containing unrelated episodes from different shows
- arbitrary date formats outside `YYYY-MM-DD`, `YYYY.MM.DD`, `YYYY_MM_DD`, or `YYYY MM DD`

Separate movie and series libraries are more predictable than mixed libraries. Mixed libraries are supported, but they depend on folder and filename heuristics.

## Autoscan

Autoscan paths must match Silo's configured roots after rewrites. With the preferred Silo Autoscan flow, rewrites are configured per source in Admin > Autoscan and are applied by Silo before the path is resolved. With the legacy Jellyfin target, rewrites are configured in external Autoscan before it posts to Silo.

| Source path | Silo library root | Rewrite location | Result |
| --- | --- | --- | --- |
| `/mnt/media/tv/Show/Season 01` | `/mnt/media/tv` | none | Subtree scan |
| `/tv/Show/Season 01` rewritten to `/mnt/media/tv/Show/Season 01` | `/mnt/media/tv` | Silo source rewrite or legacy Autoscan rewrite | Subtree scan |
| `/downloads/complete/Movie.mkv` | `/mnt/media/movies` | none | Only valid if rewritten under the library root |

## Source notes

- Silo filesystem roots: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L43-L50), [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example#L4-L11), [`filesystem.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/filesystem.go#L26-L34).
- Silo scanner and parser behavior: [`scanner.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/scanner.go#L24-L97), [`filename.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/naming/filename.go#L12-L120), [`folderid.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/naming/folderid.go#L8-L73), [`variants.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/naming/variants.go#L12-L199), [`metadata/service.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/metadata/service.go#L3659-L3665).
- Parser tests and examples: [`filename_test.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/naming/filename_test.go#L100-L258), [`variants_test.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/naming/variants_test.go#L5-L99), [`group_inference_test.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/group_inference_test.go#L9-L149).
- Scan path matching: [`scantrigger.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scantrigger/scantrigger.go#L129-L172).
- Style references reviewed: [Plex movie naming](https://support.plex.tv/articles/naming-and-organizing-your-movie-media-files/), [Plex TV naming](https://support.plex.tv/articles/naming-and-organizing-your-tv-show-files/), [Emby movie naming](https://emby.media/support/articles/Movie-Naming.html), [Emby TV naming](https://emby.media/support/articles/TV-Naming.html), [Jellyfin movies](https://jellyfin.org/docs/general/server/media/movies/), and [Jellyfin TV shows](https://jellyfin.org/docs/general/server/media/shows/).
