---
slug: docs/timeline-previews
beta: true
title: Timeline previews (Beta)
description: Preview a position while seeking, in the web app and on Apple and Android devices.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

Silo can show a still frame while you move through the playback timeline, so
you can see where you'll land before you let go. The server makes these
previews for the libraries an administrator turns them on for.

## Turn on seek previews

1. Edit the library under **Admin > Libraries**.
2. In its advanced settings, turn on **Generate seek previews** and save.
3. Let background generation run. Silo processes files at low priority, so a
   large library takes a while.

Silo stores the previews in [artwork storage](/docs/s3-storage#choose-artwork-storage).
Turning the setting off deletes the library's previews. Until a file has
previews, each app falls back as described below.

## Preview a position

In the web app, hover over or drag the playback timeline. The preview shows
the frame for that position, or the chapter image while the frame loads.

On iPhone or iPad, show the video controls and drag the playback timeline.
The preview bubble shows the target time and, when available, a still frame.
Release the timeline to seek there.

On Apple TV, show the controls and focus the timeline. Press Select to start
choosing a position, move left or right, then press Select again to jump
there. A preview frame can appear above the timeline while you choose.

In the [native Mac app](/docs/native-macos), drag the playback timeline. A
preview card appears while you drag when the player has a frame for that
position.

On an Android phone or tablet, drag the playback timeline. A still frame
appears above the time while you drag.

On Android TV, show the controls, move to the timeline, and hold left or
right. The frame appears above the timeline while it moves. When the controls
are hidden, holding left or right shows the frame below the seek speed.

Without server previews, the web app shows the chapter image for that
position, when it has one. The Apple apps cut frames from the video that is
already playing, so a preview far from what the player has loaded may show
only the time. The Android apps show only the time, as they do for downloaded
videos played offline.

## Chapter images

The web player's **Chapters** menu and timeline show images generated for
each chapter. If they're missing, ask the administrator; chapter navigation
works without them. The chapter menus in the mobile and TV apps don't show these
images.

To pick a file version or edition before playback, see
[Choose a version before playback](/docs/watch-movies-and-series#choose-a-version-before-playback).
