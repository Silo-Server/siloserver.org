---
slug: docs/watch-sync
beta: true
title: Sync with Trakt, Simkl, or MDBList (Beta)
description: Connect a profile to Trakt, Simkl, MDBList, or an installed watch-provider plugin.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

Connect a Silo profile to a Trakt, Simkl, or MDBList account. Silo can then
import watched history and resume points, send your watched changes, and
report what you're playing. Watch-provider plugins can add other services.

You set this up in the web app. History and progress it imports appear in
every Silo app signed in to the same profile.

## Prepare the server

Each provider is a plugin. Before anyone can connect a provider, an
administrator installs its plugin from the **Catalog** tab in
**Admin > Plugins**: **Trakt Watch Provider**, **Simkl Watch Provider**, or
**MDBList Watch Provider**. See [Install and maintain plugins](/docs/plugins).
The Trakt and Simkl plugins also need the details of an app you create with
that provider, entered on the plugin's page. MDBList needs no server setup:
each person enters their own API key. Other watch-provider plugins may need
settings of their own.

To get Trakt credentials, create an API app on the
[Trakt developer portal](https://developer.trakt.tv/). Trakt requires a
verified GitHub account to create one. Silo signs in with a device code, so
enter `urn:ietf:wg:oauth:2.0:oob` under **Redirect URIs**. Enter the app's
client ID and client secret on the Trakt plugin's page.

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

Free Trakt accounts can connect only a limited number of apps. If Trakt won't
authorize Silo, remove an app you no longer use from your Trakt account's
connected apps, then try again.

## Choose what syncs

The options shown depend on what the provider supports.

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
