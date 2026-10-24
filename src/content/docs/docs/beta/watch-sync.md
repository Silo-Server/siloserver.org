---
slug: docs/watch-sync
beta: true
title: Sync with Simkl or MDBList (Beta)
description: Connect a profile to Simkl, MDBList, or an installed watch-provider plugin.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

Connect a Silo profile to a Simkl or MDBList account. Silo can then
import watched history and resume points, send your watched changes, and
report what you're playing. Watch-provider plugins can add other services.

You set this up in the web app. History and progress it imports appear in
every Silo app signed in to the same profile.

## Prepare the server

Each provider is a plugin. Before anyone can connect a provider, an
administrator installs its plugin from the **Made by Silo** group on the
**Catalog** tab in **Admin > Integrations > Plugins**: **Simkl Watch Provider**
or **MDBList Watch Provider**. See [Install and maintain plugins](/docs/plugins).
The MDBList plugin needs no settings: each person enters their own API key.
Other watch-provider plugins may need settings of their own.

To get a Simkl client ID, create an app in your Simkl account's
[developer settings](https://simkl.com/settings/developer/) and choose the
**TV, devices & command line** type. Silo doesn't use a client secret, and
Simkl requires one for **Server apps & services** apps. Enter the app's
client ID as **Client ID** on the Simkl plugin's page.

If no provider is set up, the personal **Watch Providers** page says so.

## Connect your profile

1. In the web app, switch to the profile whose history you want to sync.
2. Open **Settings > Watch Providers**.
3. Select **Connect** for the provider.
4. Sign in the way the provider asks. For a device code, select **Copy code**,
   open the provider's activation page, and paste it there. For MDBList,
   enter your API key.
5. Select **Settings** on the provider's card to show its options, then
   choose which of the options below to turn on. The options start hidden
   each time you open the page.

Each connection belongs to one profile. Other household members connect
their own profiles.

## Choose what syncs

The options shown depend on what the provider supports. A provider's plugin
can add options of its own, which appear in the same list.

| Option | Effect |
| --- | --- |
| **Import watched history** | Brings completed plays from the provider into this profile. |
| **Import paused progress** | Uses the provider's resume point when it is newer than Silo's. |
| **Send watched changes** | Sends watched marks and completed plays to the provider. |
| **Send unwatched changes** | Removes matching history on the provider when you mark something unwatched. |
| **Sync favorites** / **Sync watchlist** | Imports the provider's list and sends items you add in Silo. |
| **Sync favorite removals** / **Sync watchlist removals** | Removes items on the provider when you remove them in Silo. |
| **Mirror watchlist order** | Sorts your Silo watchlist in the provider's order. Items not on the provider's list stay at the bottom. |
| **Import ratings** / **Send ratings** | Converts between the provider's 10-point ratings and Silo's stars. |
| **Scrobble playback** | Reports starts, pauses, resumes, and stops while you watch. |
| **Log rewatches** | Simkl only, off by default. Records another play of a title you already watched as a rewatch on Simkl, which otherwise ignores it. Applies to plays sent with **Send watched changes** and to finished playback reported by **Scrobble playback**. Needs a Simkl PRO or VIP account. Simkl counts two plays of the same title less than two days apart as one. |

Select **Sync now** to sync straight away. The connection card shows when
it last imported and exported, how many items transferred, and any error.
Titles that aren't in your Silo libraries, or that the provider can't match,
don't transfer.

If the provider stops accepting your sign-in, for example after you revoke
Silo's access in your provider account, the card shows the error on every
sync. Select **Disconnect**, then **Connect** again.

**Disconnect** removes the connection but doesn't undo changes that were
already synced in either direction.

To move history from Plex, Jellyfin, or Emby, use
[watch-history import](/docs/import-watch-history). For incoming Plex or
Jellyfin events, see [watch-state webhooks](/docs/watch-state-webhooks).
