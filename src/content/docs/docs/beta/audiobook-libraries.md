---
slug: docs/audiobook-libraries
beta: true
title: Set up an audiobook library (Beta)
description: Arrange audiobook files, check their tags, and add them to Silo.
---

:::caution[Beta]
Audiobooks are outside the supported 1.0 release scope. Start with a small
test library and check [your listeners' clients](/docs/listen-to-audiobooks)
before importing a large collection.
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

Each file becomes a chapter. Silo sorts filenames in natural order, so `part2` comes before `part10`. Numbered names still make the intended order easier to check.

The scanner recognizes `.m4b`, `.m4a`, `.mp3`, `.flac`, `.opus`, `.ogg`, `.wav`, and `.aac`. Recognition does not guarantee that every client can directly play the format. DRM-protected Audible files are not an import path.

## Metadata

Before scanning, check the audio tags with your preferred tag editor:

| Information | Tags Silo reads |
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
4. Open a book in the normal library view. Check the title, author, cover, duration, and chapter order, then play and seek within it.

Audiobooks use the same `MEDIA_ROOT` mount as movies and series. They do not require another Docker volume.

## Metadata enrichment

The first-party audiobook metadata plugin can add covers and book details. Install and configure it under **Admin > Plugins**, then check that it is selected in the library's provider list. An accurate ASIN tag helps when supported by the provider.

A provider match does not repair audio files with the wrong chapter order. Correct filenames or embedded chapters separately.

## Playback

Give listeners their usual Silo server address. For an Audiobookshelf-compatible app, give them the separate [beta compatibility address](/docs/audiobookshelf), not the web app's port.
