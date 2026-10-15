---
slug: docs/tailscale
beta: true
title: Reach your server with Tailscale (Beta)
description: Put your Silo server on your Tailscale network so your devices can reach it without port forwarding.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

The Tailscale plugin puts your Silo server on your Tailscale network
(tailnet). Your devices then reach it at an HTTPS address, with no port
forwarding. You don't need to install Tailscale on the server. The plugin is
an approved community plugin, maintained by community contributors rather
than the Silo project.

## Before you start

Open the [DNS page](https://login.tailscale.com/admin/dns) in the Tailscale
admin console. Check that **MagicDNS** is on, then under **HTTPS
Certificates**, select **Enable HTTPS...** and confirm. The server needs both
to get an HTTPS address.

The server's name appears in public certificate logs, so choose one you
don't mind others seeing.

The [Sign in with Tailscale](/docs/tailscale-sign-in) examples use a `silo`
tag on the server. To follow them, create the tag before you connect the
server:

1. Open **Access controls > Definitions** and select the **Tags** tab.
2. Select **Create tag**. Enter `silo` as the **Tag name**, choose a **Tag
   owner** such as `autogroup:admin`, and select **Save tag**.

A server that's tagged when it first connects stays signed in to Tailscale.
If you tag it later, turn off key expiry for it on the Tailscale **Machines**
page.

## Install the plugin

1. With an administrator account, open **Admin > Plugins** and select the
   **Catalog** tab.
2. Turn on **Include approved community plugins**.
3. Find **Tailscale** under **Approved community** and select **Install**.
4. Open the installed plugin, fill in its settings, and select **Save
   config**:
   - **Hostname** is the server's name on your tailnet. Keep the default,
     `silo`, so Silo apps can [find the server](#connect-your-devices) for
     you.
   - **Auth key** is optional. Leave it empty to approve the server in your
     browser in the next section.
   - **Tags** is optional. Enter `tag:silo` if you created the tag.
   - **Discovery** is on by default. Leave it on so apps can find the server.

The plugin makes Silo reachable only on your tailnet. To reach it from the
public internet, use a [reverse proxy](/docs/reverse-proxy).

## Connect the server

1. Open **Admin > Settings > Network Access**.
2. Under **Tailscale**, select **Connect** on the row for your server.
3. If the row shows **Waiting for authorization**, select **Open the
   authorization page**, sign in to Tailscale, and select **Connect**. With a
   saved auth key, skip this step.
4. Wait for **Connected**. The address clients use appears after **Clients
   reach this host at**.

The server also appears on the Tailscale **Machines** page.

If you run proxy nodes, each one joins your tailnet as its own machine. A
reusable auth key lets them join without approving each one.

## Connect your devices

Install the Tailscale app on each device and sign in to the same tailnet.

On iPhone, iPad, Mac, and Apple TV, the Silo app can find the server for
you. It's listed under **Found nearby**, or under **No phone nearby?** on
Apple TV, marked **Private network**. Select it instead of typing an
address. The app looks for a machine named `silo`, or `silo-1` or `silo-2`,
the names Tailscale gives a second or third server, so don't rename the
machine in Tailscale. It finds the server only on devices in your tailnet.
People you share it with enter the full address.

If the server isn't listed, add it with the address from the **Network
Access** page, for example `https://silo.example-tailnet.ts.net`.

Jellyfin-compatible apps use the same address on port `8096`, and
Audiobookshelf apps use port `13378`, if you've turned those on. If your
tailnet policy limits which ports devices can reach, allow `443`, `80` for
**Discovery**, and the ports those apps use.

To share the server with people outside your tailnet, or let people sign in
without a password, see [Sign in with Tailscale](/docs/tailscale-sign-in).

## If it doesn't connect

- If an **Error** asks you to enable MagicDNS or HTTPS certificates, turn
  that on in the Tailscale admin console, then select **Connect** again.
- **Joined tailnet; HTTPS is not ready** means the server is waiting for its
  certificate. The plugin keeps retrying.
- **Plugin not running** means the plugin is stopped. Start it from its page
  under **Admin > Plugins**.

For plugin problems, use the plugin's
[GitHub issues](https://github.com/Silo-Community/silo-plugin-tailscale/issues).
