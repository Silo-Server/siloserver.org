---
slug: docs/choose-an-app
title: Choose an app
description: Pick a Silo app for your screen, then connect to your server.
---

If someone already runs your server, you only need an app and their server
address. You do not need to install a server yourself.

## First-party clients

| Your device | Where to start |
| --- | --- |
| Browser | Open your Silo server address. |
| iPhone or iPad | [Join the Silo Media Player TestFlight](https://testflight.apple.com/join/XZy8cu5q). |
| Apple TV | Join the same TestFlight, then follow the Apple TV steps below. |
| Android phone or tablet | [Download the phone/tablet APK from Silo Android releases](https://github.com/Silo-Server/silo-android/releases/latest). |
| Android TV | [Download the TV APK from Silo Android releases](https://github.com/Silo-Server/silo-android/releases/latest). |

### Apple devices

Install Apple's TestFlight app, open the Silo invitation above, and accept
the invitation. On iPhone or iPad, select **Install** in TestFlight.

For Apple TV, accept the invitation on an iPhone or iPad first. Use the same
App Store account on the TV, install TestFlight there, then install Silo
from TestFlight. Continue with [TV sign-in](/docs/tv-sign-in).

### Android devices

Open **Assets** on the release page and choose the file for your device:

- Phone or tablet: `silo-android-latest-universal-release.apk`.
- TV: `silo-android-tv-latest-universal-release.apk`.

Open the downloaded APK on the device and approve installation from that
source if Android asks. On a TV, transfer the TV APK using your device's
file-transfer or sideloading method, then open it to install. Continue with
[TV sign-in](/docs/tv-sign-in).

These are prerelease distribution channels. Use these project links rather
than an unrelated app with the same name.

Ready to connect? [Connect and start watching](/docs/connect-and-watch) takes
you from an invitation or account to your first playable title.

## Jellyfin-compatible clients

If you already use an app that connects to Jellyfin, check whether your
server provides Silo's Jellyfin-compatible endpoint. Follow
[Connect a Jellyfin-compatible app](/docs/jellyfin-apps).
Its address and profile sign-in syntax differ from the native Silo app.

## Beta listening and reading

Audiobooks and ebooks are outside the supported 1.0 scope. See
[Beta features](/docs/beta) for client coverage, or
[Audiobookshelf-compatible apps (Beta)](/docs/audiobookshelf)
for a dedicated listening app.

Protocol compatibility does not certify every app or feature. If you have
trouble, include both the app and server versions in your report. See
[app and playback limits](/docs/client-feature-reference).
