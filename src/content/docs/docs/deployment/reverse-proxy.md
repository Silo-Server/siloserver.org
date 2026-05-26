---
title: Reverse proxy
description: Notes for placing Silo behind an external proxy.
---

Silo can run behind an external reverse proxy when you want TLS termination, custom hostnames, or shared ingress with other services.

## Ports

The default Docker stack exposes:

- `8090` for the web app
- `8096` for the Jellyfin-compatible endpoint

Route your public hostname to the port that matches the client behavior you want to expose.

For Jellyfin-compatible clients, prefer a second hostname that routes directly to `8096`, for example `https://silojf.example.com`. Keep the regular Silo web app on its own hostname routed to `8090`.

## Operator notes

- Preserve streaming request headers and range requests.
- Use WebSocket-friendly proxy defaults if your proxy requires explicit upgrade handling.
- Keep large response buffering disabled for media streams when your proxy supports that setting.

More concrete proxy examples should live here once the supported deployment matrix settles.
