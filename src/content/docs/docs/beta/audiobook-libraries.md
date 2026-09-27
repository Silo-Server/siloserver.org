---
slug: docs/audiobook-libraries
beta: true
title: Set up an audiobook library (Beta)
description: Arrange audiobook files, check their tags, and add them to Silo.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

Use one folder per book. Silo groups the audio files directly inside that folder into a book and reads its title, author, and other details from embedded tags.

## Folder layout

A single-file book can contain its own chapter markers:

```text
audiobooks/
  Author Name/
    Book Name/
      Book Name.m4b
```

For a book split into files:

```text
audiobooks/
  Author Name/
    Book Name/
      01 - Opening.mp3
      02 - First chapter.mp3
      03 - Second chapter.mp3
```

Each file becomes a chapter. Silo sorts filenames in natural order, so `part2` comes before `part10`.

The scanner recognizes `.m4b`, `.m4a`, `.mp3`, `.flac`, `.opus`, `.ogg`, `.wav`, and `.aac`, although not every client can play every format directly. Silo can't import DRM-protected Audible files.

## Metadata

Silo reads these tags. Fix them in a tag editor before scanning:

| Information | Tags |
| --- | --- |
| Book title | `title` or `album` |
| Author | `album_artist`, `artist`, or `composer` |
| Narrator | `narrator` or `performer` |
| Series and position | `series` / `series-part`, or `mvnm` / `mvin` |
| Audible identifier | `asin` or `audible_asin` |

For a multi-file book, Silo reads book metadata from the first file in sort order. Correct that file's tags when the whole book has the wrong title or author.

## Create an audiobook library

1. Open **Admin > Libraries** and select **Add Library**.
2. Choose **Audiobooks**, enter a name, and add the container-visible folder, for example `/mnt/media/audiobooks`.
3. Review the library's metadata provider settings, then save and scan.
4. Open a book from the library and look at its title, author, cover, duration, and chapter order. Play it and seek to a later chapter.

Audiobooks use the same `MEDIA_ROOT` mount as movies and series, so you don't need another Docker volume.

## Metadata enrichment

The first-party audiobook metadata plugin can add covers and book details. Install and configure it under **Admin > Plugins**, then select it in the library's provider list. An accurate ASIN tag improves matching with providers that use it.

A provider match doesn't change chapter order. Fix that in the filenames or embedded chapters.

## Playback

Listeners use their usual Silo server address in the Silo apps. Audiobookshelf-compatible apps use a [separate address](/docs/audiobookshelf#turn-on-the-endpoint).
