---
title: Ebooks
description: Ebook libraries, supported formats, the built-in reader, and reading progress.
---

Silo supports first-class ebook libraries with a built-in web reader, per-profile reading progress, and metadata enrichment.

## Create an ebook library

Create a library with type "Ebooks" in Admin > Libraries, using a container-visible path:

```text
/mnt/media/books/ebooks
```

Ebooks use the same `MEDIA_ROOT` mount as every other library type. The example path assumes your
host media root contains `books/ebooks`; use the matching container-visible path for your own
folder layout.

## Supported formats

| Format | Extensions | Support |
| --- | --- | --- |
| EPUB | `.epub` | Full parsing: metadata, chapters, embedded cover |
| PDF | `.pdf` | Metadata and cover extraction |
| FictionBook | `.fb2`, `.fbz`, `.fb2.zip` | XML parsing with charset fallback |
| Comic archives | `.cbz` | Page images and cover |
| Kindle | `.mobi`, `.azw`, `.azw3` | File indexed, metadata not parsed |
| Comic archives (RAR) | `.cbr` | File indexed, metadata not parsed |

DRM-protected files are not supported.

## Metadata

The scanner extracts title, authors, description, publisher, language, ISBN, series name and position, genres, page count, and published date from file metadata where the format allows. Covers embedded in EPUB, PDF, and FB2 files are extracted during the scan and stored in S3.

A metadata enrichment pass fills in missing details and artwork. Enrichment failures are retried with backoff and never block a book from appearing in the catalog.

## Reading

The Silo web app includes an EPUB reader (built on Foliate) with per-user reader profiles for font, theme, and layout preferences, plus annotations and bookmarks. Reading progress is tracked per profile; a book counts as finished at 90% read, and in-progress books surface in a Continue Reading section on the library home.

Ebook endpoints on the [Audiobookshelf-compatible API](/docs/audiobookshelf-compatibility) are still stubs, so reading in Audiobookshelf clients and send-to-ereader delivery are not available yet. Use the web reader.

## Source notes

- Library type: [`scanner.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/scanner.go#L328-L335).
- Supported formats and per-format parsers: [`ebook.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/ebook.go#L29-L95).
- Enrichment and retry behavior: [`enrichment.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/ebooks/enrichment.go).
- Web reader: [`FoliateBookReader.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/reader/FoliateBookReader.tsx), [`EbookReader.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/EbookReader.tsx).
- Media mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
