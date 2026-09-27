---
slug: docs/import-watch-history
title: Import your history from Plex, Jellyfin, or Emby
description: Bring your own Plex, Jellyfin, or Emby viewing history into a Silo profile.
---

Use the web app to copy your viewing history, resume points, watchlist, and
favorites from Plex, Jellyfin, or Emby into a Silo profile. Silo imports the
titles it can match to its own libraries. Each import is a one-time copy.

## Connect the source

Open **Settings > History Import** and choose the service.

- **Plex:** under **Plex Account**, select **Sign in with Plex**, finish
  signing in, and choose a server. Or, under **Saved Server**, choose a
  server added by the person who runs Silo and enter your **Plex Auth Token**.
- **Jellyfin:** enter the **Jellyfin Server URL**, your
  **Jellyfin Username**, and your **Jellyfin Password**.
- **Emby:** under **Emby Connect**, enter your Emby Connect email or username
  and password, select **Find Servers**, and choose a server. Or, under
  **Saved Server**, choose a server added by the person who runs Silo and
  enter your **Emby Username** and **Emby Password**.

The **Saved Server** tab shows a notice when no servers have been added.

These are your sign-in details for the other service, not your Silo password.
Only enter them on a Silo server you trust.

## Run the import

1. Under **Import into profile**, choose the profile that should receive the
   history.
2. Select **Start Import** and wait for it to finish.
3. Review the counts: **Matched**, **Unmatched**, **Progress**, **History**,
   **Watchlist**, and **Favorites**. A count of zero means nothing of that
   kind was imported.
4. Open a familiar title in Silo and look at its watched state and resume
   point.

An unmatched item may be missing from Silo or identified differently; the
import lists **Unmatched examples**. If the page says the import status
couldn't be refreshed, select **Refresh status** and look under
**Import history** before starting another run. Closing or reloading the page
doesn't cancel an import that's already running.

To import for other people in your household, the server administrator can
use [household history import](/docs/import-household-watch-history).
For your progress and watched status in Silo, see
[Watched status and resume progress](/docs/watch-history). To keep receiving
watched changes from another server, see
[Sync watched status from another server](/docs/watch-state-webhooks).
