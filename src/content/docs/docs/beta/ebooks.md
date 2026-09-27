---
slug: docs/ebooks
beta: true
title: Ebooks and comics (Beta)
description: Read ebooks, comics, and manga in the web or Android app, and see which formats each reader opens.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

| Client | Current access |
| --- | --- |
| Web | Book details, reader, reader settings, bookmarks, and progress |
| Android phone and tablet | Reading libraries, reader, bookmarks, reader settings, and downloads |
| iPhone, iPad, and Apple TV | No reader |
| Android TV | No reading libraries or reader |

A book can show up in search on a device that has no reader for it.

## Create an ebook library

As an administrator, open **Admin > Libraries**, choose **Add Library**, and
select **Ebooks**. Give it a name and a container-visible folder, for example:

```text
/mnt/media/books/ebooks
```

Ebooks use the same `MEDIA_ROOT` mount as every other library type. The
example assumes your host media folder contains `books/ebooks`; use the
matching path inside the container for your own layout.

Save and scan, then open a book to see its title and cover. A configured
metadata provider can fill in missing details.

## Files and reader limits

| Format | Web reader | Android phone/tablet |
| --- | --- | --- |
| EPUB | In-app text reader | In-app text reader |
| PDF | In-app fixed pages | In-app fixed pages |
| FB2, FBZ, FB2.ZIP | In-app text reader | In-app text reader |
| CBZ | In-app comic pages | In-app comic pages |
| MOBI, AZW, AZW3 | Reader includes native parsing; server conversion may also be used | In-app reading requires server-advertised EPUB conversion; otherwise use an external reader |
| CBR | Reader includes RAR comic parsing | Download the original for an external reader |

Silo does not remove DRM, and conversion fails on protected or damaged
files. Keep the original files.

## Read in the web app

1. Open the library and select a book.
2. Choose **Read** or **Continue**. If the book has several files, pick the
   format you want to open.
3. Open **Contents**, **Search**, **Notes**, or **Settings** from the reader
   controls. Settings include theme and text options; fixed pages do not use
   every text setting. Use **Add bookmark** to save a location.
4. Reading progress is saved to the active profile.

## Read on Android

1. Open **Libraries** and choose a reading library, then a book.
2. Select its reading action. When only an original-file download is offered,
   use a compatible external reader instead.
3. Tap the page to show controls. **Sections** opens the contents;
   **Add bookmark** saves a location and **Bookmarks** reopens it.
4. Open **Reader settings** for the theme and the display options supported
   by that format. PDF and comic pages do not use every text setting.

## Downloads and progress

The server decides who can download. On Android, open finished downloads
from **Downloads**. Original CBR and Kindle downloads may need another app,
even when the server can convert a streamed copy. External readers keep
their own reading position and don't update Silo's progress or bookmarks.

To continue on another device, use the same Silo profile and open the same
file.

## Manga and comics

Comic files use the image-page reader. The server also has a **Manga**
library type with manga-specific details, but browsing and metadata differ
between apps. Try a few CBZ files first to see how volumes are ordered and
whether right-to-left reading works for you.
