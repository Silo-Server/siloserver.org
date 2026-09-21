---
slug: docs/versions-and-previews
beta: true
title: Versions and playback previews (Beta)
description: Choose another source file or edition, and understand which players show preview images.
---

:::caution[Beta]
Explicit version or edition switching and native playback preview images
are outside the supported 1.0 scope. The controls described here are wired
in the reviewed source; they have not completed device acceptance testing.
:::

| Client | Version choices | Preview images |
| --- | --- | --- |
| Web | Choose a source version when the title has more than one | Generated chapter images in Chapters and at matching timeline positions; these are part of normal web playback |
| iPhone and iPad | Version picker; Edition picker when multiple editions exist | Frames during timeline scrubbing, when available |
| Apple TV | Versions menu on the title or selected episode | Frames during seeking, when available |
| Android phone and tablet | Version selection on detail and in the player | No chapter-image or scrubbing-preview UI in the reviewed player |
| Android TV | Version selection on detail and in the player | No chapter-image or scrubbing-preview UI in the reviewed player |
| Native macOS | Shared detail version and edition pickers | Frames while dragging the timeline, when available |

## Choose a version before playback

A version is a source file for a title, for example a second encode or a
different cut of a movie. The server must already have associated those
files with the same title. These controls do not add files or create editions.

1. Open the movie or episode you want to play. On a series page, check
   which episode the main play button will start.
2. Open **Version** on web, iPhone, iPad, or Android, or **Versions** on
   Apple TV. In the shared Apple detail screen, choose **Edition** first
   if it is offered and you want a different cut.
3. Select the file you want, check its available tracks, then choose
   **Play** or **Resume**.

On Apple clients, **Auto** clears the manual file choice. If a selected file
has disappeared, playback can fall back to automatic selection. If the
version control is absent or inactive, there may be only one available file.
An Edition selector needs more than one edition group; several encodes of
the same cut can still belong to one edition.

Changing the source file can change available audio tracks, subtitles,
duration, and the meaning of a saved position. Check where playback resumes
after switching cuts. Ordinary audio-language and streaming-quality choices
are covered by [watching movies and series](/docs/watch-movies-and-series).

## Preview a position on Apple devices

On iPhone or iPad, show the video controls and drag the playback timeline.
The preview bubble shows the target time and, when available, a still frame.
Release the timeline to seek there.

On Apple TV, show the controls and focus the timeline. Press Select to enter
timeline selection, move left or right, then press Select to confirm the
position. A preview frame can appear above the timeline while you choose.

In the [native Mac app](/docs/native-macos), drag the playback timeline.
A preview card appears while dragging if the player has a frame for that
position.

These frames come from the active playback source. Availability depends on
the playback route and media already available to the player. A time label
without an image is possible, especially when a requested frame is outside
the available cache. Generating chapter images on the server does not fill
that gap in the Apple players.

## Chapter images and full timeline previews

The web player's **Chapters** menu and timeline can show images generated
for chapter positions. Ask the administrator about missing chapter images;
chapter navigation itself can work without them.

The Apple and Android chapter menus do not display those server-generated
chapter images in the reviewed clients. Apple scrubbing frames are a
separate feature. This guide does not promise a pre-generated image for
every point in a video or a full BIF-style timeline on any client.
