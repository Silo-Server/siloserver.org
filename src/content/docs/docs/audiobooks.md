---
title: Audiobooks
description: Audiobook libraries, supported formats, folder layout, and metadata.
---

Silo supports first-class audiobook libraries. Audiobooks play in the Silo web app and in Audiobookshelf-compatible clients through a dedicated [Audiobookshelf-compatible endpoint](/docs/audiobookshelf-compatibility).

## Create an audiobook library

Create a library with type "Audiobooks" in Admin > Libraries, using a container-visible path:

```text
/mnt/media/books/audiobooks
```

The default Compose file mounts an optional separate books root: `MEDIA_BOOKS_ROOT` on the host is mounted at `${MEDIA_CONTAINER_ROOT}/books` in the container, falling back to `MEDIA_ROOT` when unset.

## Folder layout

One folder per audiobook. Any folder that directly contains audio files is treated as a single book, so grouping by author or series is fine:

```text
/mnt/media/books/audiobooks/Book Name/Book Name.m4b
/mnt/media/books/audiobooks/Author Name/Book Name/Book Name.m4b
/mnt/media/books/audiobooks/Author Name/Series Name/01 - Book Name/Book Name.m4b
```

Two layouts are recognized inside a book folder:

- A single audio file, optionally with embedded chapters (`.m4b` is the best case).
- Multiple audio files, sorted by filename. Each file becomes one chapter, titled with the filename stem.

Supported audio extensions are `.m4b`, `.m4a`, `.mp3`, `.flac`, `.opus`, and `.ogg`. Folders without audio files are skipped. DRM-protected files (such as Audible `.aax`) are not supported.

## Metadata

Unlike movie and series libraries, audiobook metadata comes from embedded audio tags, not from folder or file names. The scanner reads:

- Title from `title` or `album`
- Author from `album_artist`, `artist`, or `composer`
- Narrator from `narrator` or `performer`
- Series name and position from `series`/`series-part` (or `mvnm`/`mvin`)
- Audible ASIN from `asin` or `audible_asin`
- Description, publisher, release date, language, and genres from their usual tags

Trailing "(read by ...)" and "(unabridged)" noise in title tags is stripped automatically; the narrator is kept from the dedicated narrator tag.

For multi-file books, tags are read from the first file in sort order, so tag at least that file well.

## Metadata enrichment

The first-party [`silo-plugin-metadata-audiobook`](https://github.com/Silo-Server/silo-plugin-metadata-audiobook) plugin enriches scanned books with covers, series data, and people. It wraps Audnexus, AudiMeta, iTunes, Audible, Storytel, BookBeat, Audioteka, and AudiobookCovers, and searches providers in parallel.

An embedded ASIN tag gives the most reliable matches, since Audnexus and AudiMeta look books up directly by ASIN.

## Playback

The Silo web app includes a dedicated audiobook player with chapter navigation, per-book playback speed, smart rewind on resume, and keyboard shortcuts. Listening progress, Continue Listening, and series progression are tracked per profile.

Third-party listening apps connect through the [Audiobookshelf-compatible endpoint](/docs/audiobookshelf-compatibility) on port `13378`.

## Source notes

- Library type and scan walk: [`scanner.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/scanner.go#L311-L318), [`audiobook_scan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/audiobook_scan.go#L140-L175).
- Folder parsing, tag mapping, and title cleanup: [`audiobook.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/audiobook.go).
- Supported audio extensions: [`audio_extensions.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/audio_extensions.go#L10-L17).
- Books media mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L53-L54).
- Metadata plugin providers: [`silo-plugin-metadata-audiobook`](https://github.com/Silo-Server/silo-plugin-metadata-audiobook).
