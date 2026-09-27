---
slug: docs/network-access
beta: true
title: Reach your server with Tailscale (Beta)
description: Put your Silo server on your Tailscale network so your devices can reach it without port forwarding.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

The Tailscale plugin adds your Silo server to your Tailscale network
(tailnet). Devices signed in to the same tailnet reach the server at an
HTTPS address, with no port forwarding or public reverse proxy. The plugin is
an approved community plugin, maintained by community contributors rather
than the Silo project.

## Before you start

In the Tailscale admin console, turn on **MagicDNS** and **HTTPS
certificates**. The server can't get an HTTPS address without both.

Tailscale records the certificate's name in public Certificate Transparency
logs, so choose a hostname you don't mind being public.

## Install the plugin

1. With an administrator account, open **Admin > Plugins** and select the
   **Catalog** tab.
2. Turn on **Include approved community plugins**.
3. Find **Tailscale** under **Approved community** and select **Install**.
4. Open the installed plugin and fill in its settings, then select
   **Save config**:
   - **Hostname** is the server's name on your tailnet. The default is `silo`.
   - **Auth key** is optional. Without one, you approve the server in your
     browser in the next section. Use a reusable key if you also run proxy
     nodes, so each one enrolls on its own.
   - **Tags** is optional, for example `tag:silo`. Your tailnet policy or
     auth key must allow the tags.

Leave **Funnel — public internet access** off. It opens Silo to the whole
internet, needs Funnel permission in your tailnet policy, and isn't well
suited to streaming video.

## Connect the server

1. Open **Admin > Settings > Network Access**.
2. Under **Tailscale**, select **Connect** on the row for your server.
3. If the row shows **Waiting for authorization**, select **Open the
   authorization page**, sign in to Tailscale, and approve the server. With a
   saved auth key, this step is skipped.
4. Wait for **Connected**. The row then shows the address clients use, after
   **Clients reach this host at**.

Proxy nodes appear as their own rows, named `<hostname>-proxy-<node id>`.

## Connect your devices

Install the Tailscale app on each device and sign in to the same tailnet.
Then add the server in the Silo app using the address from the Network
Access page, for example `https://silo.example-tailnet.ts.net`. Tailscale may
add a suffix if the name is taken, so copy the address from the page.

Jellyfin-compatible apps use the same name on port `8096`, and
Audiobookshelf apps use port `13378`, when those endpoints are turned on.
Your tailnet access policy must allow ports `443`, `8096`, and `13378` for
the devices that connect.

## If it doesn't connect

When a row shows **Error**, the message under it gives the reason:

- If it asks you to enable MagicDNS or HTTPS certificates in the Tailscale
  admin console, turn that option on, then select **Connect** again.
- If it says **Joined tailnet; HTTPS is not ready**, the server is waiting
  for its certificate. The plugin retries on its own.

If the row shows **Plugin not running**, start the plugin from its page
under **Admin > Plugins**.

For plugin problems, use the plugin's
[GitHub issues](https://github.com/Silo-Community/silo-plugin-tailscale/issues).
