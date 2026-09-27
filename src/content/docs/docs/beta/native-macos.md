---
slug: docs/native-macos
beta: true
title: Native macOS app (Beta)
description: Build the native Mac app from source and use its video player.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

SiloMac is a native Mac app with a desktop sidebar and its own video player.
It isn't published: there's no download, and you build it yourself from the
source code.

For a ready-made option on a Mac, use the iPhone/iPad app on a Mac with
Apple silicon, or open your server in a browser.

## Build the app

SiloMac needs macOS 26 or later. To build it you need Xcode 26 or later and
XcodeGen. The [Silo Apple repository](https://github.com/Silo-Server/silo-apple#build)
has the build steps and a **SiloMac** Xcode scheme.

## Watch a movie or episode

1. Launch the app and [connect to your server](/docs/connect-and-watch).
2. Select your profile, then use the sidebar to open Home or a library.
   Use the magnifying-glass button at the top of the page to search.
3. Open a movie or episode and choose **Play** or **Resume**.
4. Move the pointer over the player to show its controls. The audio,
   subtitle, chapter, and playback-speed buttons open their options.

Chapter controls are inactive when the file has no chapters. The fullscreen
button switches the window to fullscreen. You can also drag the timeline to
seek; see [timeline previews](/docs/timeline-previews).

## Keyboard shortcuts

These work while the video player is in front.

| Key | Action |
| --- | --- |
| Space | Pause or resume |
| Left / Right arrow | Skip back or forward |
| Command + Left / Right arrow | Previous or next chapter |
| Command + S | Show or hide the options panel, opened on audio |
| Control + Command + A | Switch to the next audio track |
| Control + Command + S | Switch to the next subtitle track |
| Control + Command + G | Turn subtitles on or off |
| Shift + [ / Shift + ] | Slow down or speed up playback (0.5× to 2×) |
| Shift + Command + [ | Return to normal speed |
| Return | Skip the intro when the skip prompt is showing |
| Escape | Close the options panel, dismiss the skip prompt, or leave the player |

The arrow keys skip by your profile's skip intervals, 10 seconds back and 30
seconds forward unless you change them. Set them with **Skip Back** and
**Skip Forward** under **Settings > Playback** in the iPhone or iPad app; the
values apply to every device signed in to that profile.

## Other tasks on a Mac

Use the web app for [audiobooks](/docs/listen-to-audiobooks),
[ebooks and comics](/docs/ebooks), [Watch Party](/docs/watch-together),
[watch-provider sync](/docs/watch-sync),
[notifications](/docs/notification-inbox), and server administration.

When you report a problem, say that you used the native Mac app, and include
the source revision you built and your macOS version.
