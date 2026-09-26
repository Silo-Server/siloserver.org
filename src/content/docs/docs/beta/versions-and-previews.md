---
slug: docs/versions-and-previews
beta: true
title: Apple playback previews (Beta)
description: Preview a position while seeking on Apple devices.
---

:::caution[Beta]
Apple playback preview frames are experimental. They may become supported
features or be removed from future releases.
:::

Apple players can show frames while you move through the playback timeline.
For source-file and edition choices, see [Choose a version before playback](/docs/watch-movies-and-series#choose-a-version-before-playback).

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
chapter images. Apple scrubbing frames are a
separate feature. This guide does not promise a pre-generated image for
every point in a video or a full BIF-style timeline on any client.
