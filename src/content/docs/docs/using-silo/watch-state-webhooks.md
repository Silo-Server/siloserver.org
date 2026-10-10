---
slug: docs/watch-state-webhooks
title: Sync watched status from another server
description: Connect another media server to a Silo account and map incoming events to profiles.
---

If you still watch on a Plex, Jellyfin, or Emby server, Webhook Sync keeps
your Silo profiles up to date. That server sends events to Silo as you watch,
and Silo applies the watched status and progress to the matching profile.
Jellyfin and Emby also send an event when someone marks an item played or
unplayed by hand. Plex doesn't, so from Plex only playback reaches Silo.

Webhook Sync is a setting on your Silo account. One connection can map
several users on the other server to your account's profiles. It works
differently from these related features:

- [Importing your history](/docs/import-watch-history) is a one-time copy of
  past viewing into one profile. Use it when you move to Silo; use Webhook
  Sync to keep receiving changes afterward.
- [Trakt, Simkl, or MDBList sync](/docs/watch-sync) (Beta) connects one
  profile to an online tracking service instead of another media server.

Webhook Sync only receives changes. It doesn't send Silo's watched status back
to the other server.

You need access to the other server's webhook settings. Plex webhooks require
Plex Pass.

## Create the connection

1. In the Silo web app, open **Settings > Webhook Sync**.
2. Under **Add a connection**, choose the **Provider**. For Plex, select
   **Sign in to Plex** and choose the server that will send events. For
   Jellyfin or Emby, enter a **Connection name**.
3. Choose a **Default profile**, then select **Create connection**.
4. Under **Connected servers**, open the connection and **Copy** its
   **Webhook URL**. Keep it private: anyone with the URL can change watched
   status on your account.
5. Follow the setup steps shown for that provider to add the URL to the other
   server.

For Jellyfin, use **Copy template** to get the payload Silo expects, and
enable only the events the setup steps list: **Playback Stop** and **User
Data Saved**. **User Data Saved** also fires while someone is playing a title.
Silo ignores those deliveries, so expect many marked **Ignored** under
**Recent deliveries**.

## Map users and test it

1. Play and stop a title on the other server.
2. Under **Recent deliveries**, find the event and look at its outcome and
   matched title.
3. Under **Profile mapping**, choose a Silo profile for each user the
   connection has found, then select **Save mappings**. Users you don't map
   are ignored.
4. Play and stop another title, then look at its watched status in that
   profile. Events that arrived before you mapped a user aren't applied
   afterward, so test with a new one.

The connection shows **Receiving events** once events arrive. A delivery
marked **Applied** updated Silo. **Unmatched**, **Ignored**, **Skipped**,
**Rejected**, or **Error** means it didn't; open the event to see why.

## If Jellyfin doesn't sync items marked played

Connections set up with an older template sync playback but not items marked
played or unplayed by hand. Update the template and turn on the extra event:

1. Open the connection under **Connected servers**, expand **Setup
   instructions**, and select **Copy template**.
2. In Jellyfin, open **Dashboard > Plugins > Webhook** and find the Silo
   destination.
3. Paste the template over the old one in **Template**.
4. Under **Notification Type**, enable **User Data Saved**, then save.

The old template didn't send user names, so Jellyfin users it found appear
without a name under **Profile mapping**. Each name fills in after that user's
next event.

## If the Plex server owner's events are skipped

Older Plex connections linked the server owner to an account ID that Plex
webhooks don't use, so the owner's events show as **Skipped**. After the
owner plays something, they appear as a new user under **Profile mapping**.
Choose their profile there, then select **Save mappings**. New Plex
connections map the owner automatically.

## Change or remove a connection

**Rotate** gives the connection a new webhook URL, and the old one stops
working. Paste the new URL into the other server right away. **Delete**
removes the connection. When you stop using it, also remove the webhook from
the other server.
