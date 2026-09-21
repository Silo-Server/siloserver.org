---
slug: docs/import-household-watch-history
title: Import a household's watch history
description: Map people from Plex, Jellyfin, or Emby to existing Silo profiles and review an import.
---

Use **Admin > History Import** when helping several people move their history to Silo. Create their Silo accounts and profiles first. Importing history does not create accounts, copy permissions, or copy media files.

## Connect the old server

1. Choose **Add server** and select Plex, Jellyfin, or Emby.
2. Enter a name and **Server URL** that Silo can reach.
3. Supply the source-server credential requested by the form. For Plex, use the offered sign-in flow or token option.
4. Save, select the source, and choose **Discover users**.

The credential needs access to the external users whose history you intend to import. Keep it private. A source marked as needing reconfiguration must be corrected before discovery or import can continue.

## Map one person and test

1. Select an external user from the discovered list.
2. Choose the matching **Silo user** and **Profile**, then **Save mapping**.
3. Use **Run import** for that mapping.
4. Open **Recent imports** and inspect the outcome. Ask the person to check a known watched title and an unfinished item in the chosen profile.

Check the mapping carefully before running it. Two profiles in the same account can have different histories. After the first mapping works, repeat for the rest of the household.

## Review unmatched items

An import can finish with some items unmatched. Check that the media exists in Silo and has the correct identity before running another import. Repeating a run does not fix a wrong library match or a wrong target profile.

Removing a mapping does not erase history already imported. Review existing history before trying to repair a mistaken import; do not assume deleting and recreating the mapping undoes it.

For continuing incoming updates, see [watch-state webhooks](/docs/watch-state-webhooks). They are a separate connection from a one-time import.
