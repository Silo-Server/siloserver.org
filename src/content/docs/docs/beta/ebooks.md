---
title: Ebooks and comics (Beta)
description: Try reading in the web or Android app and check format and client limits.
---

:::caution[Beta]
Ebooks, comics, and manga are outside the supported 1.0 release scope.
Readers exist in the web and Android phone/tablet apps. Apple and Android TV
do not provide a book reader. Keep your original files and test a few books
before relying on reading progress or downloads.
:::

| Client | Current access |
| --- | --- |
| Web | Book details, Read/Continue, reader preferences, bookmarks, and progress |
| Android phone and tablet | Reading libraries, reader, bookmarks, format-dependent settings, and downloads |
| iPhone and iPad | No dedicated reader |
| Apple TV | No dedicated reader |
| Android TV | Reading libraries and reader excluded |
| Native macOS | No dedicated reader |

Finding a book in a generic search result does not mean that client can read it.

## Create an ebook library

As an administrator, open **Admin > Libraries**, choose **Add Library**, and
select **Ebooks**. Give it a name and a container-visible folder, for example:

```text
/mnt/media/books/ebooks
```

Ebooks use the same `MEDIA_ROOT` mount as every other library type. The example path assumes your
host media root contains `books/ebooks`; use the matching container-visible path for your own
folder layout.

Save, scan, and check a book's title and cover. The library's metadata provider
can fill gaps where configured; a provider match does not repair a damaged file.

<span id="supported-formats"></span>

## Files and reader limits

| Format | Web reader | Android phone/tablet |
| --- | --- | --- |
| EPUB | In-app text reader | In-app text reader |
| PDF | In-app fixed pages | In-app fixed pages |
| FB2, FBZ, FB2.ZIP | In-app text reader | In-app text reader |
| CBZ | In-app comic pages | In-app comic pages |
| MOBI, AZW, AZW3 | Reader includes native parsing; server conversion may also be used | In-app reading requires server-advertised EPUB conversion; otherwise use an external reader |
| CBR | Reader includes RAR comic parsing | Download the original for an external reader |

These format paths exist in source but have not been tested against every
variant. Silo does not remove DRM. Conversion can fail on protected or damaged
files; keep the original and check the error rather than expecting a readable copy.

These are separate checks: the scanner can find a file, a reader can open it,
and a download can preserve it offline. Passing one does not establish the others.

<span id="reading"></span>

## Read in the web app

1. Open the library and select a book.
2. Choose **Read** or **Continue**. If the book has several files, check which
   format you are opening.
3. Open **Contents**, **Search**, **Notes**, or **Settings** from the reader
   controls. Settings include theme and text options; fixed pages do not use
   every text setting. Use **Add bookmark** to save a location.
4. Close and reopen the book with the same profile to check saved progress.

## Read on Android

1. Open **Libraries** and choose a reading library, then a book.
2. Select its reading action. When only an original-file download is offered,
   use a compatible external reader instead.
3. Tap the page to show controls. **Sections** opens the contents;
   **Add bookmark** saves a location and **Bookmarks** reopens it.
4. Open **Reader settings** for the theme and the display options supported
   by that format. PDF and comic pages do not use every text setting.

## Downloads and progress

Download permission is controlled by the server. On Android, open completed
books from **Downloads** and test them without a connection before traveling.
Original CBR and Kindle downloads may need another app even when the server
can convert a streamed copy. External readers keep their own reading state;
do not expect them to update Silo's progress or bookmarks.

Use the same Silo profile when switching between web and Android. Test that
the same file reopens near your saved location. Cross-client bookmark,
annotation, and progress parity has not been certified.

## Manga and comics

Comic files use the image-page reader. The server also has a Manga library
type and manga-specific details, but discovery and metadata differ between
clients. Start with a few CBZ files and check volume ordering, pages, and
right-to-left reading before importing a collection. A separate, fully
supported manga experience is not part of 1.0.
