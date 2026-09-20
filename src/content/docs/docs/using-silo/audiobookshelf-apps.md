---
title: Connect an Audiobookshelf-compatible app
description: Connect an Audiobookshelf-compatible listening app to your Silo server.
---

Use this guide to connect a listening app that expects an Audiobookshelf
server. Ask your administrator for the Audiobookshelf-compatible address and
your Silo sign-in details. Server operators should start with
[Enable third-party client access](/docs/running-a-server/third-party-access).

## Endpoint

The default Docker stack exposes the Audiobookshelf-compatible endpoint at:

```text
http://localhost:13378
```

On another device, replace this local example with the address your
administrator provides. `localhost` means the device you are using, not a
different machine running Silo. Do not assume the Silo web address is also
the correct compatibility address.

Sign in with your Silo username and password. Tokens are issued by Silo for this endpoint specifically: access tokens last 24 hours and clients refresh them automatically.

## Clients

See the [app directory](/docs/get-started/choose-an-app#audiobookshelf-compatible-clients)
for client links. Check the exact app and server versions when testing;
protocol compatibility is not a guarantee that every app feature works.

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
- Ebook reading endpoints are stubs; ebook support is outside the 1.0 release scope.
- Send-to-ereader delivery is unavailable.

When reporting compatibility issues, include the client name and version, the endpoint URL shape you used, the screen or action that failed, and whether the same flow works in the Silo web app.

## Reverse Proxy

Use the Audiobookshelf-compatible HTTPS address your administrator provides.
Hostname and port setup belongs in the administrator's
[external-access instructions](/docs/running-a-server/third-party-access#external-access).

## Source notes

- Default port in Compose: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- Listener default and enable flag: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L361-L369).
- Route surface and client notes: [`handler.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/audiobooks/abs/handler.go).
- Token lifetimes and login settings: [`config.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/audiobooks/config.go).
