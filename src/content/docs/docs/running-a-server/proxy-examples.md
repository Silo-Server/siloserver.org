---
slug: docs/proxy-examples
keywords: ["proxy config", "Caddyfile", "nginx.conf", "websockets", "request entity too large", "real IP address", "SSL termination", "load balancer"]
questions: ["What nginx config does Silo need?", "Why do uploads fail with 413 behind my proxy?", "Does my proxy have to pass WebSockets for Silo?", "Why does every viewer show the proxy's IP address?"]
title: Reverse proxy examples
description: Sites for nginx, Traefik, Caddy, and HAProxy in front of Silo, and what Silo needs from any reverse proxy.
---

Add one of these sites to a reverse proxy you already run. Each one serves `https://silo.example.com` and sends requests to Silo's web port, `8090` in the default Docker setup, on the same host. Replace the hostname, and the address if your proxy runs somewhere else.

[Connect securely outside your home](/docs/reverse-proxy) covers the steps around the proxy: the hostname, port forwarding, **Silo public URL**, and testing away from home. Your proxy's own documentation covers installing it and getting certificates.

## What Silo needs from a proxy

Every example below does all of this. Check the same points on any other proxy.

- Keep the `Host` header the browser or app sent.
- Set `X-Forwarded-For` to the viewer's address and `X-Forwarded-Proto` to `https`, replacing any values the client sent.
- Pass WebSocket connections. Live updates, [Watch Party](/docs/watch-together), [playing on a TV from a phone](/docs/tv-remote), and the live view in **Admin > Logs** use them.
- Pass `Range` requests and send video on as it arrives, without saving it to disk first.
- Don't compress or rewrite responses. Silo compresses its own pages and API responses, and the web app needs the `ETag` header Silo sends to save some admin forms.
- Don't limit upload size. Silo sets its own limit for each kind of upload.
- Leave HTTP/3 off. On a connection that loses packets, a proxy's HTTP/3 can be [much slower than TCP](/docs/reverse-proxy#if-remote-playback-is-slow-over-http3).

## Caddy

Caddy's defaults already do everything above:

```text
silo.example.com {
    reverse_proxy 127.0.0.1:8090
}
```

Don't add `encode` to this site. Caddy offers HTTP/3 whenever UDP port 443 reaches it, so forward only TCP, or [turn HTTP/3 off for Silo's site](/docs/reverse-proxy#if-remote-playback-is-slow-over-http3).

## nginx

Put the `map` and `upstream` blocks in the `http` context, next to the `server` blocks:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

upstream silo {
    server 127.0.0.1:8090;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name silo.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name silo.example.com;

    ssl_certificate     /etc/letsencrypt/live/silo.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/silo.example.com/privkey.pem;

    client_max_body_size 0;
    gzip off;

    location / {
        proxy_pass http://silo;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

nginx sends none of the forwarding or WebSocket headers unless you set them, so keep every `proxy_set_header` line. `client_max_body_size 0` removes nginx's 1 MB upload limit, which otherwise refuses larger uploads, such as artwork, with `413`. `proxy_buffering off` stops nginx saving video to temporary files when a viewer's connection is slower than Silo.

If people reach nginx on a port other than 443, use `$http_host` in place of `$host` so the port stays in the `Host` header.

## Traefik

Traefik's defaults already keep `Host`, set the forwarding headers, pass WebSocket connections, and leave HTTP/3 off. Add a router and a service to a dynamic configuration file, using your own entry point and certificate resolver names:

```yaml
http:
  routers:
    silo:
      rule: Host(`silo.example.com`)
      entryPoints:
        - websecure
      service: silo
      tls:
        certResolver: letsencrypt
  services:
    silo:
      loadBalancer:
        servers:
          - url: http://192.168.1.20:8090
```

Inside a Traefik container, `127.0.0.1` refers to that container, so the example uses the Docker host's address on your network. If you set this up with Docker labels on the `silo` service instead, point the service at container port `8080`.

Don't attach the `compress` or `buffering` middleware to this router.

## HAProxy

Add the header and routing lines to the frontend that answers on port 443, then add the backend:

```text
frontend https
    bind :80
    bind :443 ssl crt /etc/haproxy/certs/silo.example.com.pem
    http-request redirect scheme https unless { ssl_fc }
    http-request set-header X-Forwarded-For %[src]
    http-request set-header X-Forwarded-Proto https
    use_backend silo if { hdr(host) -i silo.example.com }

backend silo
    timeout tunnel 1h
    server silo 127.0.0.1:8090
```

`timeout tunnel` applies to WebSocket connections once they're open. Without it they use your `timeout client` and `timeout server` values. Don't add a `compression` line to this frontend or backend.

## Jellyfin and Audiobookshelf apps

Jellyfin-compatible and Audiobookshelf-compatible apps use [their own ports](/docs/docker#ports), `8096` and `13378` in the default Docker setup. Give each one its own hostname and a copy of the same site that points at its port. Both use WebSocket connections, so the settings above apply to them too. Then follow [third-party access](/docs/third-party-access).

## Tell Silo which proxies to trust

Silo reads the forwarding headers only from a proxy it trusts. **Trusted proxies**, under **Network** in **Admin > Server > General**, lists them as comma-separated ranges such as `203.0.113.7/32`. Left empty, it trusts the private network ranges and the host itself, which covers a proxy on the same host, in Docker, or elsewhere on your home network.

Change it only when the proxy connects to Silo from a public address: enter the default ranges followed by the proxy's address, then save. The change applies without a restart.

```text
10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, ::1/128, 203.0.113.7/32
```

To trust only the proxy, list the address Silo sees it connect from. With the default Compose file that's an address on Docker's network, not `127.0.0.1`, even when the proxy runs on the same host. If you use [network access](/docs/tailscale), keep `127.0.0.0/8` and `::1/128` in the list.

## If something fails only through the proxy

Open Silo at its local address, for example `http://192.168.1.20:8090`, and try the same thing. If it works there, the proxy is the cause.

- An upload fails with `413`. The proxy limits upload size. In nginx, set `client_max_body_size 0`.
- Saving a user in **Admin > Users** fails with "the server's response arrived without a strong ETag". The proxy removes or changes the `ETag` header. Turn off anything that rewrites responses for Silo's site.
- Live updates, Watch Party, or playing on a TV don't work. The proxy isn't passing WebSocket connections, or it changes the `Host` header. In nginx, check the `Host`, `Upgrade`, and `Connection` lines.
- Seeking fails or video stalls. Check that the proxy passes `Range` requests and isn't buffering responses.
- People away from home aren't held to **Max remote stream bitrate** in their [access group](/docs/manage-access). The proxy isn't sending `X-Forwarded-For`, so Silo sees every viewer at the proxy's own address and counts them as being at home.
