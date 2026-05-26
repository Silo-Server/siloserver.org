---
title: Jellyfin compatibility
description: How Silo approaches Jellyfin-compatible client support.
---

Silo includes a compatibility API for clients that expect Jellyfin or Emby-style endpoints.

## Endpoint

The default Docker stack exposes the compatibility endpoint at:

```text
http://localhost:8096
```

Use this endpoint when connecting compatible third-party clients.

Silo also uses this endpoint for Jellyfin-style integrations such as [Autoscan](/docs/integrations/autoscan).

## Reverse Proxy

If you expose Silo publicly and want to use Jellyfin-compatible clients, create a separate reverse proxy hostname for the compatibility endpoint.

Recommended shape:

```text
https://silo.example.com    -> Silo web app on port 8090
https://silojf.example.com  -> Jellyfin-compatible endpoint on port 8096
```

Use the Jellyfin hostname when signing in from Jellyfin-compatible clients. In Silo settings, set the Jellyfin compatibility public URL to that same hostname.

## Scope

Compatibility is focused on practical client support, not exact server identity. Some Jellyfin clients may depend on behavior that Silo does not yet implement.

When reporting compatibility issues, include:

- Client name and version
- The endpoint URL shape you used
- The screen or action that failed
- Logs or request details when available
- Whether the same flow works in the Silo web app

## Source notes

- Default Jellyfin-compatible port in Compose: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L43-L45).
- Jellyfin compatibility default listen/public URL settings: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L358-L365).
- Compatibility server starts in `integrated` or `api` mode: [`main.go`](https://github.com/Silo-Server/silo-server/blob/main/cmd/silo/main.go#L1518-L1520).
