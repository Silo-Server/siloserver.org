---
slug: docs/listen-to-audiobooks
beta: true
title: Audiobooks (Beta)
description: Start a book, choose chapters, and adjust speed or a sleep timer.
---

:::caution[Beta]
Audiobooks are outside the supported 1.0 release scope. Playback and library
access vary by client. Check the device you intend to use before relying on
it for a long book or an offline trip.
:::

| Client | Current access |
| --- | --- |
| Web | Library, book details, persistent audio player, chapters, speed, and sleep timer |
| iPhone and iPad | Audiobook library toggle, book details, and full audio player |
| Apple TV | Detail and audio-player code exists, but library discovery depends on saved settings and available home rows |
| Android phone and tablet | Audio libraries, dedicated player, and download controls |
| Android TV | Audiobook library tab and dedicated player; no offline library |
| Native macOS | Search can reach book details; the full audiobook player is not exposed |

These are source-traced entry points, not completed device acceptance tests.

Open an audiobook library and select a book. Check its author and narrator
to make sure you have the recording you want.

## In the web app

1. Select the book's play button, or **Resume** if you have started it.
2. Use the audio player to pause or seek. Opening other Silo pages keeps
   the player available while you browse.
3. Select a chapter on the book's detail page to start at that point.
4. Open the player's speed or sleep controls when you want to change the
   listening pace or stop after a chosen interval.

The resume point belongs to the active profile. Switching profiles stops
the web audiobook player. Keep the browser page open while listening;
background playback also depends on the browser and device.

## On iPhone and iPad

If the library is missing, open **Settings > Library & Data** and turn on
**Show Audiobooks**. Your profile also needs access to an audiobook library.
The display choice starts off and is saved for that device, server, and profile.

Open the book and select its play or resume control. Tap the mini-player to
open the full player. Choose **Playback Speed**, **Sleep**, or **Chapters**
there. The sleep menu offers 15, 30, or 60 minutes; choose **Off** to cancel
the timer. You can also choose a chapter from the book's detail page.

## On Android phones and tablets

Open the book and start playback. In the full player, tap the speed value
to change it, **Sleep** to set a timer, or the chapter control to choose a
chapter. The speed sheet also offers a default-speed choice.

## On a TV

On Apple TV, if a book is available through your library menu or a home row,
open it and select its main play/resume control.
**Chapters** opens a chapter picker; **Start Over** restarts the book.

The top-menu settings do not yet provide a reliable first-time path on every
server configuration. If the library does not appear, use the web app or a
phone instead of assuming the scan failed.

On servers using the older top-menu settings, **Settings > General > Top Menu >
Show Audiobooks** provides the toggle when present. The newer **Customize Top
Menu** path does not resolve every fresh-install case yet.

On Android TV, start the book, then use the player's speed, **Sleep**, or
**Chapters** control with the remote. Choose an option in the panel that
opens. A TV's playback controls do not provide a phone-style offline library.

## Resume on another device

Pause, let the first device reconnect to the server if needed, then open the
same book with the same profile on the other device. Check the shown position
before continuing. Simultaneous playback can produce competing progress updates.

For a dedicated listening app, see [Audiobookshelf-compatible apps](/docs/audiobookshelf).
Administrators can [set up an audiobook library](/docs/audiobook-libraries).

## Downloads

Android phone and tablet audiobook downloads exist, but multi-file books need extra care.
Before leaving the network, test the beginning, a later chapter, and reopening
the book offline. A completed download indicator alone does not verify that
every part is playable or that progress will merge as expected.

No audiobook download action was established in the Apple detail screen.
Do not assume the movie-download instructions apply to Apple audiobooks.
