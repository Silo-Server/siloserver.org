---
slug: docs/reverse-proxy
keywords: ["remote access", "watch away from home", "outside my house", "access from anywhere", "port forwarding", "domain name", "SSL certificate", "nginx", "Traefik", "HTTP/3", "QUIC", "UDP 443"]
questions: ["How do I put Silo on my own domain with HTTPS?", "How do I set up Caddy in front of Silo?", "Why does seeking break when I use my domain?", "Does the app switch to the local address at home?", "Why does streaming crawl through Caddy away from home?", "How do I stop the web player stalling on a slow connection?"]
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

Silo's [TCP tuning for remote viewers](/docs/configuration#tcp-tuning-for-remote-viewers) covers only connections that end at Silo. Behind Caddy, the viewer's connection ends at Caddy, so the tuning covers Caddy's connection to Silo, and the connection to the viewer uses the host's own TCP settings.

### If remote playback is slow over HTTP/3

If viewers away from home buffer while other sites load quickly for them, Caddy may be serving Silo over HTTP/3. Caddy turns HTTP/3 on by default and uses it whenever UDP port 443 reaches it, for example when the port forward or a Docker port mapping includes UDP. With only TCP forwarded, as in the steps above, this doesn't happen. On a connection that loses a few packets, Caddy's HTTP/3 can be much slower than TCP, and [**Test speed**](/docs/preferences#test-your-connection-speed) in **Settings > Playback** is slow too.

To stop offering HTTP/3 for Silo, add `header Alt-Svc clear` to Silo's site in your Caddyfile, then validate and reload Caddy:

```text
silo.example.com {
    header Alt-Svc clear
    reverse_proxy 127.0.0.1:8090
}
```

Other sites on the same Caddy keep HTTP/3. Browsers stop using HTTP/3 for Silo once they've seen the change, but one that's still connected over HTTP/3 can keep that connection for a while. Restart the browser before you test playback away from home again.

nginx serves HTTP/3 only where you've set it up, and its HTTP/3 can slow down the same way.

### Speed up web playback away from home

Give the web app a second address that serves Silo over HTTP/1.1 only. Through it, the web app reads a file over several connections at once. On a long or lossy link, one connection often stalls while the link still has room, and several together keep the video coming. The main address can't do this: Caddy serves it over HTTP/2, where the browser sends every request over one connection.

It helps only with files the web app decodes itself with [**Decode in the browser (beta)**](/docs/playback-problems#if-the-web-app-converts-hevc-files-on-linux), such as files with Dolby TrueHD or DTS audio. Files the browser plays on its own, converted video, and the Silo apps on other devices still use one connection.

1. Point a second hostname, for example `media.example.com`, at your public address, and forward inbound TCP port 8443 to Caddy.
2. Add the media site to your Caddyfile, replacing the hostname. The block in braces holds global options and goes at the top of the file. If your Caddyfile already starts with one, add the `servers` lines to it.

```text
{
    servers :8443 {
        protocols h1
    }
}

media.example.com:8443 {
    reverse_proxy 127.0.0.1:8090
}
```

Caddy applies `protocols` to everything on a port, not to one site, so the media address needs a port of its own. It gets a certificate the same way as the main address.

3. Validate and reload Caddy.
4. Set `server.web_media_url` to the media address with `PUT /api/v2/admin/settings/server.web_media_url` in the [admin API](/docs/api), sending `{"value": "https://media.example.com:8443"}`. The setting has no control in the web app. It applies from the next video, without a restart.

Silo accepts only an `https` address with no path, and refuses other values with an error such as `server.web_media_url must use https`. To turn the media address off, set the value to `""`.

If the media address refuses a request or stops answering, the web app keeps playing through the main address over one connection. Viewers who reach Silo through [Network access (Beta)](/docs/tailscale) always use the main address.

If your proxy already serves Silo over HTTP/1.1 only, you don't need a media address: the web app reads over several connections on the main address. It does the same for files a [proxy node](/docs/transcode-nodes) sends.

## Other addresses clients use

Remote proxy nodes, S3 storage, and the [media address](#speed-up-web-playback-away-from-home) give clients addresses of their own. Those must also be reachable and use HTTPS; Silo's site on the main address doesn't cover them.

Jellyfin-compatible and Audiobookshelf-compatible apps use their own ports (see [Docker ports](/docs/docker#ports)). Publish only the ones your users need, each on its own hostname, and follow [third-party access](/docs/third-party-access).

At home, the Silo apps on Apple and Android devices switch to the server's local address on their own once someone is signed in. Browsing, artwork, and video then skip the proxy and go straight to Silo's [own port](/docs/docker#ports) on your network. While an app is connected this way, the server list under **Switch Server** shows **Connected on your local network** below the active server. This needs the address the app signed in with to be HTTPS at the root of its hostname, as set up above.

The Apple apps learn the local address from Silo's [announcement on the local network](/docs/docker#discovery-on-the-local-network), or from **Local network address** under Docker's default bridge network, which blocks the announcement. The Android apps learn it from **Local network address**. The apps switch only on Wi-Fi or a wired network, never over mobile data. When the device changes networks or the local address stops answering, the app goes back to the HTTPS address until the local one answers again. Sign-in and subtitles always use the HTTPS address, so that address has to work from inside your home too. On Apple devices, the app may ask for local network access the first time.

Remote access doesn't make TV discovery work across networks: a phone or tablet finds a TV only on the same LAN.
