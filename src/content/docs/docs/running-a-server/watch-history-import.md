---
slug: docs/import-household-watch-history
title: Import history for other accounts
description: Map people from Plex, Jellyfin, or Emby to existing Silo profiles and review an import.
---

As an administrator, use **Admin > History Import** to copy several people's history from a Plex, Jellyfin, or Emby server in one place. Each person can instead [import their own history](/docs/import-watch-history) from **Settings > History Import**. To keep watched status updated after the move, each person sets up [Sync watched status from another server](/docs/watch-state-webhooks).

Create the Silo accounts and profiles first. An import copies history only; it doesn't create accounts, copy permissions, or copy media files.

## Connect the old server

1. Choose **Add server**, enter a **Name**, and choose the **Type**: Plex, Jellyfin, or Emby.
2. Enter a **Server URL** that Silo can reach.
3. Sign in to Plex, or paste the Plex token or the Jellyfin or Emby admin API key. Keep it private.
4. Choose **Add server**, then **Discover users**.

The credential must be able to see the users you want to import. If Silo marks the server as needing reconfiguration, edit its address and credential before you continue.

A Plex admin import brings over only finished plays. Resume points, titles marked watched without being played, and watchlists come across only when each person imports from their own Plex account.

## Map one person and test

1. In the discovered list, find the person from the old server.
2. Choose the matching **Silo user** and **Profile**, then **Save mapping**.
3. Choose **Run import** for that mapping.
4. Open **Recent imports** to see how many items were matched and which were not. Ask the person to check a title they have watched.

Choose the profile carefully: two profiles in the same account keep separate histories. When the first mapping works, map and import the rest of the household.

## Review unmatched items

An import can finish with some items unmatched, usually because the title isn't in Silo or was matched to the wrong entry. Fix the [match](/docs/metadata#correct-a-wrong-match) before running the import again.

Removing a mapping leaves history that was already imported in place.
