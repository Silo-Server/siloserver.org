---
title: Clients
description: First-party Silo clients and verified Jellyfin- and Audiobookshelf-compatible third-party clients.
---

Silo is designed for native clients and compatibility with parts of the Jellyfin and Audiobookshelf client ecosystems.

## First-party clients

| Client | Platform | Status | Source |
| --- | --- | --- | --- |
| Silo for Web | browser (ships with the server) | shipping | [silo-server](https://github.com/Silo-Server/silo-server) |
| Silo for iOS | iPhone, iPad | beta | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for tvOS | Apple TV | beta | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for macOS | Mac | alpha | [silo-apple](https://github.com/Silo-Server/silo-apple) |
| Silo for Android | phone, tablet | beta | [silo-android](https://github.com/Silo-Server/silo-android) |
| Silo for Android TV | Android TV, Fire TV | alpha | [silo-android](https://github.com/Silo-Server/silo-android) |

See the [project organization on GitHub](https://github.com/Silo-Server) for current release status.

## Jellyfin-compatible clients

Silo includes a [compatibility layer](/docs/jellyfin-compatibility) for clients that speak Jellyfin or Emby-style APIs. Point any of these at the compatibility endpoint (`http://localhost:8096` by default) and sign in as usual.

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

Compatibility is evolving, so client behavior can vary by app and by feature area. See [Jellyfin compatibility](/docs/jellyfin-compatibility) for endpoint setup, reverse-proxy guidance, and what to include when reporting issues.

## Audiobookshelf-compatible clients

Silo serves [audiobook libraries](/docs/audiobooks) through an [Audiobookshelf-compatible endpoint](/docs/audiobookshelf-compatibility) (`http://localhost:13378` by default). Point any of these at that endpoint and sign in with your Silo credentials.

| Client | Platforms | Status | Get it |
| --- | --- | --- | --- |
| [Audiobookshelf app](https://github.com/advplyr/audiobookshelf-app) | iOS, Android | verified | [GitHub](https://github.com/advplyr/audiobookshelf-app) |
| [Plappa](https://apps.apple.com/app/plappa/id6475201956) | iOS | verified | [App Store](https://apps.apple.com/app/plappa/id6475201956) |
| [AudioBooth](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) | iOS | verified | [App Store](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) |
| AudiobookshelfFully | Android | verified | — |
