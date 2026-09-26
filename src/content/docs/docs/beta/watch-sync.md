---
slug: docs/watch-sync
beta: true
title: Watch-provider sync (Beta)
description: Connect a profile to Trakt, Simkl, MDBList, or an installed watch-provider plugin.
---

:::caution[Beta]
Watch-provider sync is outside the supported 1.0 scope. Available actions depend on the provider, build, and server configuration.
:::

Watch-provider sync connects a Silo profile to an external tracking account. The server can import watched history and resume points, send watched changes, and report playback activity.

| Client | Available actions |
| --- | --- |
| Web | Connect a provider account, choose sync settings, run a sync, inspect its result, and disconnect. |
| Apple and Android apps | Connect providers in the web app. Imported history and progress are available to the same profile in the apps. |

## Prepare the server

Trakt and Simkl need application credentials in **Admin → Settings → Watch Providers** before you connect a profile. This setup requires an administrator account. MDBList connects with your own API key in personal settings. Additional providers can come from installed watch-provider plugins and may need their own configuration.

Provider availability is server-specific. The personal settings page shows an empty state when no providers are registered.

## Connect your profile

1. Select the Silo profile whose history you want to sync.
2. Open **Settings → Watch Providers** in the web app.
3. Select **Connect** for the provider.
4. Follow the offered sign-in method. For a device-code flow, copy the code, open the provider's activation page, and complete authorization. An API-key provider instead asks for its key and any required connection fields.
5. Review the connected account and choose the actions you want.

Connections and imported history belong to the active profile. Repeat setup separately for another household member.

## Choose what changes

| Setting | Effect |
| --- | --- |
| Import watched history | Bring completed provider plays into this profile. |
| Import paused progress | Use newer provider resume points when local progress is older. |
| Send watched changes | Send local watched marks and completed plays to the provider. |
| Scrobble playback | Report playback starts, pauses, resumes, and stops. |
| Favorites and watchlist sync | Import provider lists and send local additions, when the provider supports them. |
| Removal settings | Send explicit unwatched or list-removal changes, where offered. These can remove entries on the other side. |
| Mirror watchlist order | Order matching Silo watchlist items like the provider's list; other items stay at the bottom. |

Use **Sync now** to request a sync, then inspect the last import/export time, result counts, and any error. A connected account only confirms authorization; it does not prove that all history matched or transferred. Provider capabilities, rate limits, item identifiers, and missing library content affect the result.

Select **Disconnect** to remove the connection. Review imported state separately; disconnecting is not an undo operation for changes already synced.

For a migration from Plex, Jellyfin, or Emby, use [watch-history import](/docs/import-watch-history). Administrators configuring incoming Plex or Jellyfin events should use [watch-state webhooks](/docs/watch-state-webhooks).
