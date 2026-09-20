---
title: Keep libraries up to date
description: Connect scan sources, match their paths to Silo, and check that changed files reach the library.
---

Autoscan tells Silo which folders changed so it can scan them without waiting for the next full scan. Start after your library can scan and play one item successfully.

Open **Admin > Libraries > Autoscan**. A source can receive a webhook from another service or poll a service through a plugin. Use the delivery method offered for the source you are connecting.

## Add a webhook source

1. In **Sources**, choose **Add source** and select the source and webhook delivery option.
2. Follow **Match paths**. Map the paths the other service sends to the paths Silo sees inside its container.
3. Choose **Create and continue**. Copy the webhook URL from **Connect it** and follow the displayed instructions in the sending service.
4. Turn on Autoscan in the page header.
5. Send the service's test event or add one item, then open **Activity**. Check that the event resolves to the intended library and queues a scan.

Treat the webhook URL as a secret. Replacing it means updating the sending service too.

## Add a polling source

1. Install the required [scan-source plugin](/docs/running-a-server/plugins).
2. Under **Sources > Advanced**, add a saved connection if the source needs one. Enter the service URL and credential, or reuse a Requests integration.
3. Choose **Test connection** and save.
4. Choose **Add source**, select the plugin, and bind the connection. Review its settings and path rewrites.
5. Enable the source and Autoscan, then choose **Run now**. Check **Activity** for the result.

Polling sources can override the default check interval. A source that is not due to poll yet may not return new changes on every run.

## Match paths

Paths must end up under the correct Silo library root. If Sonarr sees `/arr/tv/Example/Season 01` and Silo sees `/media/tv/Example/Season 01`, map `/arr/tv` to `/media/tv`.

Silo's source rewrites are prefix replacements, not regular expressions. Keep each mapping narrow. A path that still points outside every library cannot select the intended scan target.

## Troubleshooting

Start with **Activity**. An unresolved event points to a path or library-mapping problem. For a polling failure, check the connection, source enabled state, plugin, and elapsed interval. For no webhook activity, check the sending service's destination and delivery log.

Repeated changes can be combined by the debounce setting. A received event does not guarantee that a file was successfully scanned or matched; check the library afterward.

## Legacy external Autoscan

An existing external Autoscan service can use Silo's Jellyfin-compatible endpoint. It needs an admin API key and paths that match Silo's libraries after its own rewrites. Keep that setup separate from Silo's built-in sources: external Autoscan uses its own configuration and regular-expression rewrite syntax.

For a new setup, use the source controls above. For an existing deployment, confirm [Jellyfin compatibility](/docs/running-a-server/third-party-access) is on before investigating its scan connection.
