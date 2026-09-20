---
title: Additional library types (Beta)
description: Understand Mixed and Podcast libraries before creating them.
---

:::caution[Beta]
Movies and Series are the supported 1.0 library types. Other library types
can appear in the admin form without providing a complete experience on
every client. Start with a small folder rather than your whole collection.
:::

For listening and reading, use the separate [audiobook setup](/docs/beta/audiobook-libraries)
and [ebook/comic guide](/docs/beta/ebooks).

## Mixed video libraries

**Mixed** lets the server scan movies and series through its video pipeline
in one library. To try it, open **Admin > Libraries > Add Library**, choose
**Mixed**, name the library, and add its container-visible folder. Save and
scan, then check how both a movie and an episode were identified.

| Client | Current access |
| --- | --- |
| Web | Creates and browses Mixed libraries |
| Android phone and tablet | Classifies Mixed as a Video library |
| iPhone, iPad, Apple TV, native macOS | Mixed libraries are included under Movies and Series |
| Android TV | Shared library filtering accepts Mixed, but the top-level movie/series tab classifier does not place it |

For predictable navigation, keep separate Movies and Series libraries.
Before sharing a Mixed library, check that each household device can find
it and open both media types. An absent TV tab may be a client navigation
limit rather than a failed scan.

## Podcasts

The server has a **Podcasts** library choice and scan/playback code. That
does not yet provide a complete first-party podcast app:

- The web item-detail path redirects to a podcast-show route that is not
  registered in the reviewed app.
- Apple clients do not have a dedicated podcast library/episode workflow.
- Android phone/tablet and TV library-mode mapping does not include podcasts.

There is no reliable setup-to-listening walkthrough to recommend here.
Keep podcasts out of a library intended for normal household use until
your chosen client has an accessible, tested workflow. A directory scan
does not establish RSS subscription, episode downloading, or feed management.

## Music

Some client models and navigation code contain Music labels. The current
server library form has no Music option, and no complete music-library
pipeline was established in this audit. Do not create a custom library type
through the API just to reveal a tab. Album, artist, and playlist support
should not be inferred from those labels.

See [unfinished features](/docs/beta/unfinished-features) for the other
capabilities that do not yet have a usable setup path.
