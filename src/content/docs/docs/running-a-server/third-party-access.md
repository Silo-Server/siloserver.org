---
title: Enable third-party client access
description: Provide the right Silo endpoint to Jellyfin- and Audiobookshelf-compatible apps.
---

Silo provides separate compatibility endpoints for apps that expect Jellyfin
or Audiobookshelf. Give users the address for their app's protocol, not simply
the address they use to open Silo in a browser.

## Choose the endpoint

The default Docker deployment exposes these host ports:

| Connection | Default host port | User instructions |
| --- | --- | --- |
| Silo web app | `8090` | [Choose an app](/docs/get-started/choose-an-app) |
| Jellyfin-compatible apps | `8096` | [Connect a Jellyfin-compatible app](/docs/using-silo/jellyfin-apps) |
| Audiobookshelf-compatible apps | `13378` | [Connect an Audiobookshelf-compatible app](/docs/using-silo/audiobookshelf-apps) |

Jellyfin-compatible access is disabled until enabled during setup or in Admin
Settings. The Audiobookshelf listener can be disabled through
`audiobookshelf_compat.enabled`. The Docker host port overrides are `JF_PORT`
and `ABS_PORT`; see [Configuration reference](/docs/running-a-server/configuration).

Users connecting from another device need the server's reachable address.
`localhost` refers to the device on which it is entered, not necessarily the
machine running Silo.

## External access

Use separate HTTPS hostnames when exposing the compatibility endpoints through
a reverse proxy:

```text
https://silo.example.com     -> Silo web app on port 8090
https://silojf.example.com   -> Jellyfin-compatible endpoint on port 8096
https://siloabs.example.com  -> Audiobookshelf-compatible endpoint on port 13378
```

For Jellyfin-compatible access, set the compatibility public URL in Silo to
the Jellyfin hostname you give users. Review the
[reverse proxy notes](/docs/running-a-server/reverse-proxy) for streaming and
WebSocket considerations. Those notes are not yet a complete secure deployment
walkthrough.

## Accounts and profiles

Give users their Silo sign-in details and the appropriate connection guide.
Jellyfin-compatible apps use a combined username/profile and password/PIN
format described in the [sign-in guide](/docs/using-silo/jellyfin-apps#signing-in).
Do not assume that a third-party app offers Silo's native profile picker.

When investigating a failure, record the exact app and server versions,
endpoint, and action. Compatibility can differ between apps and versions;
an app speaking the protocol is not proof that every feature works.

## Scan integrations are separate

The legacy external Autoscan target uses the Jellyfin-compatible endpoint.
New Sonarr/Radarr scan-source setup is described in
[Keep libraries updated with Autoscan](/docs/running-a-server/autoscan).

## Source notes

- [Docker services and ports](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml).
- [Compatibility settings](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go).
- [Jellyfin-compatible profile sign-in](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/login.go).
