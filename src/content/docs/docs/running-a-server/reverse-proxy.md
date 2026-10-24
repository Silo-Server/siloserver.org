---
slug: docs/reverse-proxy
title: Connect securely outside your home
description: Put Silo behind HTTPS and test it from a remote client.
---

Get Silo working on your LAN before opening remote access. This example uses an existing Caddy installation on the same Linux host as Silo, a domain you control, and a router that can forward traffic to that host.

If your connection is behind carrier-grade NAT or you cannot change router rules, port forwarding won't work. [Network access (Beta)](/docs/tailscale) can reach the server through Tailscale instead.

## Set up HTTPS with Caddy

1. Point your chosen hostname, for example `silo.example.com`, at your public address.
2. Forward inbound TCP ports 80 and 443 to Caddy. Keep PostgreSQL, Redis, metrics, and Silo's own ports off the public internet.
3. Add this site to your existing Caddyfile, replacing the hostname:

```text
silo.example.com {
    reverse_proxy 127.0.0.1:8090
}
```

4. Validate and reload Caddy using the procedure for your installation.
5. In **Admin > Server > General**, set **Silo public URL** to `https://silo.example.com`, save, and follow any restart notice.
6. Under **Network** on the same page, review **Trusted proxies**. Trust only the proxy addresses that send requests to Silo.

Caddy gets HTTPS certificates automatically for a hostname that is reachable from the internet. See its [reverse-proxy guide](https://caddyserver.com/docs/quick-starts/reverse-proxy) for installation details. The example assumes Caddy runs on the host: inside a Caddy container, `127.0.0.1` refers to that container.

Use a dedicated hostname at its root. A subpath such as `example.com/silo` needs extra routing this example doesn't cover.

## Test away from home

Turn Wi-Fi off on a phone or tablet, then open the HTTPS address. Check sign-in, artwork, playback, seeking, and subtitles.

If pages load but seeking or live updates fail, check that your proxy passes range requests and WebSocket connections.

## Other addresses clients use

Remote proxy nodes and S3 storage can hand clients their own addresses. Those must also be reachable and use HTTPS; the main proxy doesn't forward them.

Jellyfin-compatible and Audiobookshelf-compatible apps use their own ports (see [Docker ports](/docs/docker#ports)). Publish only the ones your users need, each on its own hostname, and follow [third-party access](/docs/third-party-access).

At home, the Silo apps on Apple and Android devices switch to the server's local address on their own once someone is signed in. Browsing, artwork, and video then skip the proxy and go straight to Silo's [own port](/docs/docker#ports) on your network. While an app is connected this way, the server list under **Switch Server** shows **Connected on your local network** below the active server. This needs the address the app signed in with to be HTTPS at the root of its hostname, as set up above.

The Apple apps learn the local address from Silo's [announcement on the local network](/docs/docker#discovery-on-the-local-network), or from **Local network address** under Docker's default bridge network, which blocks the announcement. The Android apps learn it from **Local network address**. The apps switch only on Wi-Fi or a wired network, never over mobile data. When the device changes networks or the local address stops answering, the app goes back to the HTTPS address until the local one answers again. Sign-in and subtitles always use the HTTPS address, so that address has to work from inside your home too. On Apple devices, the app may ask for local network access the first time.

Remote access doesn't make TV discovery work across networks: a phone or tablet finds a TV only on the same LAN.
