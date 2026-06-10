---
title: Audiobookshelf compatibility
description: How Silo approaches Audiobookshelf-compatible client support for audiobooks.
---

Silo includes a compatibility API for clients that expect an Audiobookshelf server. It serves [audiobook libraries](/docs/audiobooks) to the official Audiobookshelf mobile apps and to third-party Audiobookshelf clients.

## Endpoint

The default Docker stack exposes the Audiobookshelf-compatible endpoint at:

```text
http://localhost:13378
```

13378 is also Audiobookshelf's own default port, so clients with a pre-filled port usually connect without changes. The host port can be changed with `ABS_PORT` in `.env`, and the listener can be disabled by setting `audiobookshelf_compat.enabled` to `false` in server settings.

Sign in with your Silo username and password. Tokens are issued by Silo for this endpoint specifically: access tokens last 24 hours and clients refresh them automatically.

## Clients

| Client | Platforms | Status | Get it |
| --- | --- | --- | --- |
| [Audiobookshelf app](https://github.com/advplyr/audiobookshelf-app) | iOS, Android | verified | [GitHub](https://github.com/advplyr/audiobookshelf-app) |
| [Plappa](https://apps.apple.com/app/plappa/id6475201956) | iOS | verified | [App Store](https://apps.apple.com/app/plappa/id6475201956) |
| [AudioBooth](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) | iOS | verified | [App Store](https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503) |
| AudiobookshelfFully | Android | verified | — |

## What works

- Browsing libraries, authors, series, and search
- Streaming and downloading for offline listening
- Listening progress sync, Continue Listening, and listening stats
- Chapters, bookmarks, collections, playlists, and smart collections
- Personalized library shelves
- RSS feeds for individual books

## Scope

The compatibility layer covers the audiobook surface of the Audiobookshelf API. Some areas are intentionally stubbed for now:

- Podcast endpoints return empty results; podcast libraries are not served here yet.
- Ebook reading endpoints are stubs; use the [Silo web reader](/docs/ebooks) instead.
- Send-to-ereader delivery is unavailable.

When reporting compatibility issues, include the client name and version, the endpoint URL shape you used, the screen or action that failed, and whether the same flow works in the Silo web app.

## Reverse Proxy

If you expose Silo publicly, create a separate reverse proxy hostname for the Audiobookshelf-compatible endpoint, mirroring the [Jellyfin compatibility](/docs/jellyfin-compatibility) setup:

```text
https://silo.example.com     -> Silo web app on port 8090
https://siloabs.example.com  -> Audiobookshelf-compatible endpoint on port 13378
```

## Source notes

- Default port in Compose: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L52).
- Listener default and enable flag: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L361-L369).
- Route surface and client notes: [`handler.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/audiobooks/abs/handler.go).
- Token lifetimes and login settings: [`config.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/audiobooks/config.go).
