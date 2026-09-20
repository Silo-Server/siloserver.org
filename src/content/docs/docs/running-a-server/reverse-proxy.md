---
title: Connect securely outside your home
description: Put Silo behind HTTPS and test it from a remote client.
---

Get Silo working on your LAN before opening remote access. This example uses an existing Caddy installation on the same Linux host as Silo, a domain you control, and a router that can forward traffic to that host.

If your connection is behind carrier-grade NAT or you cannot change router rules, this example will not make the server reachable. Resolve that network constraint before changing Silo settings.

## Set up HTTPS with Caddy

1. Point your chosen hostname, for example `silo.example.com`, at your public address.
2. Send inbound TCP ports 80 and 443 to Caddy. Keep PostgreSQL, Redis, metrics, and Silo's raw application ports off the public internet.
3. Add this site to your existing Caddyfile, replacing the hostname:

```text
silo.example.com {
    reverse_proxy 127.0.0.1:8090
}
```

4. Validate and reload Caddy using the procedure for your installation.
5. In **Admin > Settings > General**, set **Silo public URL** to `https://silo.example.com`, save, and follow any restart notice.
6. Review **Trusted proxies** under **Security & Access**. Trust only the proxy addresses that actually send requests to Silo.

Caddy obtains HTTPS certificates for a reachable public hostname. Follow its [reverse-proxy guide](https://caddyserver.com/docs/quick-starts/reverse-proxy) for installation-specific details. The example assumes host-installed Caddy: `127.0.0.1` inside a Caddy container would refer to that container, not Silo.

## Test away from home

Turn Wi-Fi off on a phone, then open the HTTPS address. Check sign-in, artwork, playback, seeking, and subtitles. A login page loading proves only that the first request works.

Use a dedicated hostname at its root for this recipe. A subpath such as `example.com/silo` adds routing requirements this walkthrough does not cover.

If remote nodes or object storage send clients to other addresses, those addresses must also be reachable and secure. The main web proxy does not automatically proxy every generated asset or worker URL.

## Ports

| Destination | Default host port |
| --- | --- |
| Silo web and native clients | 8090 |
| Jellyfin-compatible clients | 8096 |
| Audiobookshelf-compatible clients | 13378 |

Only publish the protocols your users need. A separate hostname for each compatibility endpoint avoids mixing protocol routes. Follow [third-party access](/docs/running-a-server/third-party-access) for those settings.

## Operator notes

Preserve range requests and WebSocket connections through your proxy. If ordinary pages load but seeking or live updates fail, inspect the corresponding proxy requests.

Same-LAN TV discovery is separate from remote server access. HTTPS makes the server reachable; it does not make a TV on another LAN discoverable by a phone.
