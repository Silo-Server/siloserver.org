---
slug: docs/listen-to-audiobooks
beta: true
title: Audiobooks (Beta)
description: Start a book, choose chapters, and adjust speed or a sleep timer.
---

:::caution[Beta]
Audiobooks are outside the supported 1.0 release scope. Use the client instructions below for listening and offline access.
:::

| Client | Listening |
| --- | --- |
| Web | Library, book details, persistent audio player, chapters, speed, and sleep timer |
| iPhone and iPad | Audiobook library toggle, book details, and full audio player |
| Apple TV | Book details, playback, and chapters |
| Android phone and tablet | Audio libraries, dedicated player, and download controls |
| Android TV | Audiobook library tab and dedicated player; no offline library |
| Mac | Use the web player for audiobook listening |

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

On Apple TV, open a book from a library or home row and select its main
play/resume control.
**Chapters** opens a chapter picker; **Start Over** restarts the book.

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

| Client | Offline audiobook access |
| --- | --- |
| Android phone and tablet | Open the book's detail page and select **Download**. A downloadable audio file and download permission are required. |
| iPhone and iPad | Use an [Audiobookshelf-compatible app](/docs/audiobookshelf) that supports offline listening. Silo's audiobook detail page has no download action. |
| Apple TV and Android TV | Stream from the server; there is no offline audiobook library. |
| Web and native macOS | Use a listening app with offline support for travel. |

On Android, wait for **Downloaded**, then open the book from **Downloads**.
Before traveling, disconnect from the network and test the beginning, a
later chapter, and reopening the book. Keep the original files on the server.
