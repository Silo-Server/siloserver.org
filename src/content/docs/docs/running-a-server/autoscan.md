---
slug: docs/autoscan
title: Keep libraries up to date
description: Connect scan sources, match their paths to Silo, and check that changed files reach the library.
---

Autoscan tells Silo which folders changed, so it scans them right away instead of waiting for the next full scan. Set it up once your library scans and plays normally.

Open **Admin > Libraries > Autoscan**. A source either receives webhooks from another service or checks a service for changes through a plugin.

## Add a webhook source

1. In **Sources**, choose **Add source** and select the source and webhook delivery option.
2. Follow **Match paths**. Map the paths the other service sends to the paths Silo sees inside its container.
3. Choose **Create and continue**. Copy the webhook URL from **Connect it** and follow the displayed instructions in the sending service.
4. Turn on Autoscan in the page header.
5. Send the service's test event or add one item, then open **Activity**. The event should resolve to the right library and queue a scan.

Keep the webhook URL secret. If you rotate it, update the sending service too.

## Add a polling source

1. Install the required [scan-source plugin](/docs/plugins).
2. Under **Sources > Advanced**, add a saved connection if the source needs one. Enter the service URL and credential, or reuse a Requests integration.
3. Choose **Test connection** and save.
4. Choose **Add source**, select the plugin, and bind the connection. Review its settings and path rewrites.
5. Enable the source and Autoscan, then choose **Run now**. Check **Activity** for the result.

Each polling source can set its own check interval instead of the default.

## Match paths

After rewriting, each path must fall inside a Silo library folder. If Sonarr sees `/arr/tv/Example/Season 01` and Silo sees `/media/tv/Example/Season 01`, map `/arr/tv` to `/media/tv`.

Rewrites replace the start of the path; they aren't regular expressions. Keep each mapping narrow.

## Troubleshooting

Start with **Activity**. An unresolved event means a path rewrite or library folder is wrong. If a polling source finds nothing, check its connection, that it is enabled, its plugin, and whether its interval has passed. If no webhook events arrive, check the sending service's destination and delivery log.

The **Debounce (seconds)** setting under **Advanced** combines changes that arrive close together. After an event is handled, look in the library to see whether the file was scanned and matched.

## Legacy external Autoscan

An existing external Autoscan service can connect through Silo's Jellyfin-compatible port. It needs an admin API key, and its own regular-expression rewrites must produce paths inside Silo's libraries. It doesn't use Silo's source settings.

If an existing external Autoscan stops working, make sure [Jellyfin compatibility](/docs/third-party-access) is on. For a new setup, use the built-in sources above.
