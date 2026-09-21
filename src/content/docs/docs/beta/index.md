---
slug: docs/beta
beta: true
title: Beta features
description: Find features outside the supported 1.0 scope and check which clients can use them.
---

:::caution[Beta]
These features are outside Silo's supported 1.0 release scope. Audiobooks,
ebooks, and Audiobookshelf compatibility are beta too. Some have usable
interfaces; others have only part of the implementation or no visible entry
point. Availability depends on your app and server build.
:::

Start with the feature you want to try. Each guide names the available
clients, setup steps, and limits. The tables describe source-traced access,
not certification that every device or file works.

## Listening and reading

| Feature | Where to start |
| --- | --- |
| [Audiobooks](/docs/listen-to-audiobooks) | Web and phone/tablet players; TV and native Mac limits are listed in the guide |
| [Audiobook library setup](/docs/audiobook-libraries) | Web admin: files, tags, chapters, and a small test scan |
| [Audiobookshelf compatibility](/docs/audiobookshelf) | Separate server endpoint and third-party listening apps; read the PIN warning |
| [Ebooks, comics, and manga](/docs/ebooks) | Web and Android phone/tablet readers; no Apple or Android TV reader |
| [Other library types](/docs/library-types) | Mixed video libraries, partial podcasts, and the current music boundary |

## Watching and personal settings

| Feature | Where to start |
| --- | --- |
| [Watch Together](/docs/watch-together) | Web rooms; native-client access is limited or disabled |
| [Watch-provider sync](/docs/watch-sync) | Web setup for Trakt, Simkl, MDBList, and provider plugins |
| [Versions and playback previews](/docs/versions-and-previews) | Source-file choices and Apple preview frames, with client-specific limits |
| [Browser file downloads](/docs/browser-downloads) | Save an original file; separate from mobile managed offline playback |
| [Custom web themes](/docs/custom-themes) | Web profile and admin theme tools beyond standard server branding |
| [Native notification inboxes](/docs/native-inboxes) | Android phone/tablet notification-entry path; use web for regular inbox access |

## Administration and additional clients

| Feature | Where to start |
| --- | --- |
| [Catalog import and export](/docs/catalog-seeds) | Web admin catalog transfer, not a complete backup or restore |
| [Native macOS app](/docs/native-macos) | Separate desktop target, available in source; differs from the iOS app on a Mac |
| [Unfinished features](/docs/unfinished-features) | Work that is partial, hidden, or not implemented; no invented setup instructions |

## Before relying on a beta feature

Use a small test set and keep a backup before importing or syncing state.
Check the feature on the device you intend to use, including reopening the
app and reconnecting to the server. For an external service, review which
data leaves the server before connecting it.

Report the app and server versions, the action you tried, and the result.
[Report a problem](/docs/report-a-problem) explains how to share useful
evidence without posting credentials or private media details.

The main guide covers movies, series, and the 1.0 feature set. A beta label
does not relax access controls, secret handling, or data-safety requirements.
