---
slug: docs/native-macos
beta: true
title: Native macOS app (Beta)
description: Build the native Mac app and use its desktop video player.
---

:::caution[Beta]
The native SiloMac app is outside the supported 1.0 scope. This guide covers
building it from source and using its desktop video player.
:::

SiloMac is a separate native target from the iPhone/iPad app running on an
Apple Silicon Mac. It uses a desktop sidebar and its own video-player controls.

| Client | Available actions |
| --- | --- |
| Native SiloMac | Browse movies and series, open details, play video, choose tracks, use chapters, and seek with the keyboard or timeline |
| iPhone/iPad app on a Mac | Uses the iOS app's interface and feature set; SiloMac keyboard instructions do not establish behavior in that app |
| Web on a Mac | Open your server in a browser for viewing and administration |

## Get access

The native target requires macOS 26 or later. The repository
provides a **SiloMac** Xcode scheme and
[source-build instructions](https://github.com/Silo-Server/silo-apple#build).
Building it requires Xcode 26 or later and XcodeGen. Follow the repository's
current signing and build guidance if you are testing from source.

For access without a source build, use your server's web app. The
[app selection guide](/docs/choose-an-app) lists the other
published app channels.

## Watch a movie or episode

1. Launch the native app and [connect to your server](/docs/connect-and-watch).
2. Select your profile, then use the sidebar to open Home or a library.
   Use the magnifying-glass button at the top of the page to search.
3. Open a movie or episode and choose **Play** or **Resume**.
4. Move the pointer over the player to reveal its controls. Use the audio,
   subtitle, chapter, or playback-speed buttons to open the matching options.

Chapter controls are inactive when the file has no chapters. The fullscreen
button toggles the Mac window's fullscreen mode.

## Keyboard controls

These shortcuts apply while the native video player receives keyboard input.

| Key | Action |
| --- | --- |
| Space | Pause or resume |
| Left / Right arrow | Seek backward or forward 15 seconds |
| Command + Left / Right arrow | Previous or next chapter |
| Escape | Close the options panel, or leave the player if no panel is open |

You can also drag the timeline. See
[version selection](/docs/watch-movies-and-series#choose-a-version-before-playback) and
[playback previews](/docs/versions-and-previews) for
source-file choices and preview-frame limits.

<span id="current-gaps"></span>

## Other tasks on a Mac

Use the web app for [audiobooks](/docs/listen-to-audiobooks),
[ebooks and comics](/docs/ebooks), [Watch Party](/docs/watch-together),
[watch-provider connections](/docs/watch-sync), and
[notifications](/docs/notification-inbox). Server administration also uses
web admin. These guides give the steps for each task.

When reporting a problem, say that you used **native SiloMac**, include the
app build or source revision and macOS version, and describe the screen and
action that failed. This distinguishes a native-app report from a browser
or iPhone/iPad-app report.
