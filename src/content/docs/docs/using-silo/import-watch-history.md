---
slug: docs/import-watch-history
title: Import your watch history
description: Bring your own Plex, Jellyfin, or Emby viewing history into a Silo profile.
---

Use the web app for a one-time import. This copies supported viewing and
saved-list data that Silo can match; it does not copy media files or create
accounts for your household.

## Connect the source

Open **Settings > History Import** and choose the service.

- **Plex:** select **Plex Account**, then **Sign in with Plex**. Complete
  Plex sign-in and choose a server. A direct-server option is available
  when a source has been configured on the server.
- **Jellyfin:** enter the old server's base URL, your username, and password.
- **Emby:** use **Emby Connect** and **Find Servers**, or choose an
  administrator-defined server and enter your Emby credentials.

These are credentials for the source service, not your Silo password.
Only enter them on your trusted Silo server.

## Run and check the import

1. Choose your destination under **Import into profile**. Check it carefully
   before continuing.
2. Select **Start Import** and wait for its status to finish.
3. Review **Matched**, **Unmatched**, **Progress**, and **History**. Saved-list
   counts appear when the source supplies those records.
4. Open a familiar title in Silo and check its watched state and resume point.

An unmatched item may be missing from Silo or identified differently.
Check a few examples against [metadata matching](/docs/metadata). If status cannot refresh,
use the refresh control and inspect **Import history** before starting
another run. Do not assume an interrupted browser request means the server
cancelled the import.

For other household members' imports, see
[household history import](/docs/import-household-watch-history), which requires
administrative access.
Keep [progress and watched status](/docs/watch-history) separate
from ongoing external watch-state synchronization.
