---
slug: docs/watch-state-webhooks
title: Receive watch-state updates
description: Connect another media server to a Silo account and map incoming events to profiles.
---

Webhook Sync receives events from Plex, Jellyfin, or Emby and applies supported watch-state changes to Silo. It is separate from a [history import](/docs/import-household-watch-history), outgoing notifications, and Autoscan file-change events.

You need access to the sending server's webhook settings. In Silo, the connection belongs to the signed-in account and maps to that account's profiles. This is not a server-wide mapping editor for every Silo account.

## Create the connection

1. Sign in to the intended Silo account in the web app and open **Settings > Webhook Sync**.
2. Choose the provider. For Plex, choose **Sign in to Plex** and select the sending server. For Jellyfin or Emby, enter a **Connection name**.
3. Choose the intended **Default profile**, then **Create connection**.
4. Copy the generated webhook URL. Treat it as a secret that can submit state changes.
5. Follow the connection's provider setup instructions to add that URL to the sending server.

For Jellyfin, the connection supplies a **Copy template** control for the payload expected by Silo. Use that template and the listed event choices rather than sending every event the plugin offers.

## Check delivery and mapping

1. Play and stop a known item on the sending server.
2. Check the connection's recent deliveries. Open the event and review its outcome and matched media.
3. Map the discovered external user to the correct Silo profile and choose **Save mappings**.
4. Send another event, then check the watched state in that profile.

**Receiving events** confirms traffic is arriving; **Applied** is the result to check for a state update. **Unmatched**, **Ignored**, or **Rejected** needs investigation before you rely on the connection.

## Change or remove a connection

**Rotate** replaces the webhook URL. Update the sender immediately because its old URL will stop working. Remove or disable the sender's configuration when you stop using the connection.

This guide covers incoming updates to Silo. It does not set up two-way synchronization or continuously mirror every playback position between servers.
