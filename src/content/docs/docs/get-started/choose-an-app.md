---
title: Choose an app
description: Find a Silo app or a third-party connection guide for your device.
---

If someone already runs your server, you only need an app and their server
address, not a server installation of your own.

Before connecting, ask the administrator for:

- The server address to enter in your chosen app.
- Your account sign-in details or invitation.
- Which household profile to use and its PIN, if one is required.

For a native Silo app, start with the first-party links below. For a
third-party app, follow its protocol's connection guide; its server address
may differ from the address used by the Silo web app.

:::note[Check the versions you use]
This directory retains the earlier app list. Its reported status labels are
not a newly verified compatibility matrix. App availability and behavior
must be checked against the installed versions; the
[1.0 milestone](https://siloserver.org/milestone/1.0/) defines the planned release surfaces.
:::

## First-party clients

| Client | Platform | Status | Source |
| --- | --- | --- | --- |
| Silo for Web | browser (ships with the server) | shipping | [silo-server](https://github.com/Silo-Server/silo-server) |
| Silo for iOS | iPhone, iPad | beta | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for tvOS | Apple TV | beta | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for macOS | Mac | beta | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for Android | phone, tablet | beta | [silo-android](https://github.com/Silo-Server/silo-android) |
| Silo for Android TV | Android TV, Fire TV | beta | [silo-android](https://github.com/Silo-Server/silo-android) |

See the [project organization on GitHub](https://github.com/Silo-Server) for current release status, and [client feature parity](/docs/using-silo/client-feature-reference) for a feature-by-feature comparison of what each client supports. For Apple TV playback capabilities — Dolby Vision, Dolby Atmos, and platform limits — see the [Apple TV page](/docs/using-silo/apple-tv-playback).

## Jellyfin-compatible clients

Silo includes a [compatibility layer](/docs/using-silo/jellyfin-apps) for clients that speak Jellyfin or Emby-style APIs. Point any of these at the compatibility endpoint (`http://localhost:8096` by default) and sign in as usual.

| Client | Platforms | Status | Get it |
| --- | --- | --- | --- |
| [Infuse](https://firecore.com/infuse) | iOS, tvOS, macOS | verified | [App Store](https://apps.apple.com/app/infuse/id1136220934) |
| [Findroid](https://github.com/jarnedemeulemeester/findroid) | Android | verified | [Play Store](https://play.google.com/store/apps/details?id=dev.jdtech.jellyfin) |
| [VidHub](https://okaapps.com/product/1659622164) | iOS, tvOS, macOS | verified | [App Store](https://apps.apple.com/app/vidhub-video-library-player/id1659622164) |
| [JellyCon](https://github.com/jellyfin/jellycon) | Kodi | verified | [GitHub](https://github.com/jellyfin/jellycon) |
| [Streamyfin](https://github.com/streamyfin/streamyfin) | iOS, Android | verified | [App Store](https://apps.apple.com/app/streamyfin/id6593660679) · [Play Store](https://play.google.com/store/apps/details?id=com.fredrikburmester.streamyfin) |
| [Wholphin](https://github.com/damontecres/Wholphin) | Android TV | verified, recommended | [Play Store](https://play.google.com/store/apps/details?id=com.github.damontecres.wholphin) |
| [Jellyfin Web](https://github.com/jellyfin/jellyfin-web) | browser | vendored at `/web/` | — |
| [mpv (libmpv)](https://mpv.io) | any | verified | [GitHub](https://github.com/mpv-player/mpv) |

Compatibility is evolving, so client behavior can vary by app and by feature area. See [Jellyfin compatibility](/docs/using-silo/jellyfin-apps) for endpoint setup, reverse-proxy guidance, and what to include when reporting issues.

## Audiobookshelf-compatible clients

Silo serves [audiobook libraries](/docs/running-a-server/audiobook-libraries) through an [Audiobookshelf-compatible endpoint](/docs/using-silo/audiobookshelf-apps) (`http://localhost:13378` by default). Point any of these at that endpoint and sign in with your Silo credentials.

| Client | Platforms | Status | Get it |
| --- | --- | --- | --- |
| [Audiobookshelf app](https://github.com/advplyr/audiobookshelf-app) | iOS, Android | verified | [GitHub](https://github.com/advplyr/audiobookshelf-app) |
| [Plappa](https://apps.apple.com/app/plappa/id6475201956) | iOS | verified | [App Store](https://apps.apple.com/app/plappa/id6475201956) |
| [AudioBooth](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) | iOS | verified | [App Store](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) |
| AudiobookshelfFully | Android | verified | — |
