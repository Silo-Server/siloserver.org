---
title: Autoscan
description: Configure Silo Autoscan and the legacy Jellyfin-target Autoscan path.
---

Silo supports two ways to trigger targeted scans when media changes.

The preferred path is Silo's built-in Autoscan implementation. Silo polls installed `scan_source.v1` plugins on a schedule, applies host-owned path rewrites, resolves the changed paths against Silo libraries, and queues targeted library scans. The Sonarr/Radarr provider is the `silo.autoscan.arr` plugin.

Silo still supports the external Autoscan Jellyfin target through the Jellyfin-compatible endpoint. Use that path only when you already run upstream Autoscan and want to keep it in the middle.

## Preferred: Silo Autoscan

Silo Autoscan is configured from Admin > Autoscan. It has four tabs:

- Sources: scan-source plugin instances to poll.
- Activity: poll events, matched paths, queued scans, and errors.
- Connections: Sonarr/Radarr server credentials or reused Requests integrations.
- Settings: global enablement, default poll interval, and debounce interval.

For Sonarr/Radarr, install the `silo.autoscan.arr` plugin from Admin > Plugins. The plugin exposes a `scan_source.v1` capability named `arr` and displays as "Sonarr / Radarr".

## How the Sonarr/Radarr plugin works

Silo owns the poll timer and calls the plugin with the source marker and resolved connection. The plugin stores no credentials.

On each poll, the plugin reads the arr history API, extracts paths from these events, and returns raw Sonarr/Radarr-side paths to Silo:

- `downloadFolderImported`
- `episodeFileRenamed`
- `movieFileRenamed`

For rename events, both the old and new paths are returned so Silo can scan both locations when a file moved between folders.

Silo then:

1. Applies the source's path rewrites.
2. Resolves each rewritten path under an enabled Silo library.
3. Deduplicates and debounces scan targets.
4. Queues scans with `trigger="autoscan"`.
5. Records the poll and scan rows for the Activity tab.

If a poll returns paths but none match a Silo library, Silo records an unresolved Autoscan event and does not advance the marker. Fix the source rewrites, then run Autoscan again so the same imports can be processed.

## Requirements

- Silo running in `integrated` or `api` mode.
- At least one enabled Silo library.
- The Sonarr/Radarr scan-source plugin installed.
- A Sonarr or Radarr base URL and API key, either configured directly in Autoscan or reused from Admin > Requests.
- Source paths that already match Silo's library paths, or per-source path rewrites that map them there.

No Silo admin API key is required for the preferred Sonarr/Radarr path. Admin API keys are only needed for the legacy Jellyfin target path below.

## Setup

1. Add Silo libraries using the paths Silo sees, such as `/mnt/media/movies` and `/mnt/media/tv`.
2. Install the Sonarr/Radarr scan-source plugin from Admin > Plugins.
3. Go to Admin > Autoscan > Connections.
4. Add a connection for each Sonarr/Radarr server you want Silo to poll. You can reuse an existing Requests integration or enter a base URL and API key just for Autoscan.
5. Test each connection.
6. Go to Admin > Autoscan > Sources.
7. Add one source for each Sonarr/Radarr instance, select the "Sonarr / Radarr" plugin, and bind the matching connection.
8. Configure a per-source poll interval if this source should not use the global default.
9. Add path rewrites if the paths returned by Sonarr/Radarr differ from Silo's library paths.
10. Enable the source, enable Autoscan in the page header, then use Run now to verify the first poll.

## Path rewrites

Preferred Autoscan rewrites are prefix replacements owned by Silo. They are not regular expressions. The most-specific matching `from` prefix wins.

If the source has a bound Sonarr/Radarr connection, use Sync from server in the source's Path rewrites panel to compare arr root folders with Silo media folders and propose rewrites.

| Source path | Silo library root | Source rewrite | Result |
| --- | --- | --- | --- |
| `/mnt/media/movies/Movie (2026)/Movie.mkv` | `/mnt/media/movies` | none | Parent folder scan |
| `/arr/tv/Show/Season 01/Episode.mkv` | `/mnt/media/tv` | `/arr/tv` -> `/mnt/media/tv` | Parent folder scan |
| `D:\Media\TV\Show\Season 01\Episode.mkv` | `/mnt/media/tv` | `D:\Media\TV` -> `/mnt/media/tv` | Parent folder scan |
| `/downloads/complete/Movie.mkv` | `/mnt/media/movies` | none | Unresolved until rewritten under a Silo library |

## Polling behavior

The global Autoscan task polls installed scan-source providers at the default interval. A source can set its own interval, which acts as a minimum time between polls for that source.

Debounce prevents repeated events for the same target from queueing duplicate scans too quickly. The Activity tab shows returned changes, resolved changes, queued scans, reused scans, suppressed scans, and unresolved or error states.

## Legacy Jellyfin target

External Autoscan can still target Silo through the Jellyfin-compatible endpoint. Silo exposes the Jellyfin endpoints that Autoscan's Jellyfin target expects:

- `GET /Library/VirtualFolders`
- `POST /Library/Media/Updated`

Autoscan upstream is feature-frozen, so this compatibility path targets its current Jellyfin target behavior.

### Legacy requirements

- Silo running in `integrated` or `api` mode with Jellyfin compatibility enabled.
- The Jellyfin-compatible endpoint reachable by Autoscan. In the default Docker stack this is port `8096`.
- At least one enabled Silo library.
- A Silo admin API key. Silo admin API keys begin with `sa_`.
- Autoscan paths that match Silo library roots after Autoscan rewrite rules run.

### Legacy setup

1. Add a library using the path Silo sees, such as `/mnt/media/movies`.
2. Confirm the library root is reachable from Admin > Libraries.
3. Create an admin API key from Admin > API Keys.
4. Confirm Autoscan can reach the Jellyfin-compatible endpoint, for example `http://silo:8096` on a shared Docker network or `https://silojf.example.com` through a reverse proxy.

If Autoscan and Silo see the same paths, no target rewrite is needed:

```yaml
targets:
  jellyfin:
    - url: http://silo:8096
      token: sa_your_silo_admin_api_key
```

If Autoscan receives paths that differ from Silo's library paths, add a Jellyfin target rewrite:

```yaml
targets:
  jellyfin:
    - url: http://silo:8096
      token: sa_your_silo_admin_api_key
      rewrite:
        - from: ^/tv/
          to: /mnt/media/tv/
```

Legacy Autoscan rewrite `from` values are regular expressions. Keep rewrites narrow enough that the rewritten path lands inside exactly one Silo library root.

### Legacy request behavior

Autoscan's Jellyfin target sends the token in `X-Emby-Token`, fetches libraries from `/Library/VirtualFolders`, and posts updates to `/Library/Media/Updated` with this shape:

```json
{
  "Updates": [
    {
      "path": "/mnt/media/movies/Movie (2026)/Movie.mkv",
      "updateType": "Modified"
    }
  ]
}
```

Silo queues matching library, subtree, or file scans and returns `204 No Content` on success. Empty update lists, empty paths, invalid request bodies, ambiguous library matches, and some invalid paths return errors. Some Autoscan-style noise is handled softly: unsupported sidecar paths, missing paths, or paths outside any library may be ignored or resolved to a parent directory scan.

## Troubleshooting

- For preferred Silo Autoscan, start with Admin > Autoscan > Activity. Check whether the latest event is `success`, `error`, or `unresolved`.
- If a Sonarr/Radarr source is unresolved, compare the raw source path with Silo's library root and add a source rewrite.
- If Sync from server returns no proposals, check the connection test and compare Sonarr/Radarr root folders with Silo library paths manually.
- If a source does not poll, confirm global Autoscan is enabled, the source is enabled, the plugin is still installed, and the source's poll interval has elapsed.
- If the legacy Jellyfin target says no target library was found, compare the path after Autoscan rewrite with Silo's library root. Autoscan uses prefix matching against `/Library/VirtualFolders` locations.
- If the legacy Jellyfin target is unauthorized, use an admin API key beginning with `sa_` as the Jellyfin target token.

## Source notes

- Silo Autoscan engine and marker behavior: [`service.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/autoscan/service.go#L116-L257).
- Silo Autoscan admin API routes: [`router.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/router.go#L2139-L2156) and [`autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/autoscan.go#L106-L150).
- Silo Autoscan UI: [`AdminAutoscan.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/AdminAutoscan.tsx#L122-L214), [`SourcesPanel.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin/autoscan/SourcesPanel.tsx#L1090-L1225), and [`ConnectionsPanel.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin/autoscan/ConnectionsPanel.tsx#L325-L425).
- Host-owned path rewrites and rewrite suggestions: [`rewrite.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/autoscan/rewrite.go#L12-L48) and [`suggest.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/autoscan/suggest.go#L18-L47).
- Sonarr/Radarr plugin manifest and poll behavior: [`manifest.json`](https://github.com/Silo-Server/silo-plugin-autoscan-arr/blob/main/manifest.json#L20-L29), [`main.go`](https://github.com/Silo-Server/silo-plugin-autoscan-arr/blob/main/main.go#L58-L85), and [`history.go`](https://github.com/Silo-Server/silo-plugin-autoscan-arr/blob/main/internal/arr/history.go#L135-L161).
- Legacy Jellyfin Autoscan routes and auth requirements: [`router.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/router.go#L76-L84), [`auth.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/auth.go#L37-L67), and [`auth_api_key.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/auth_api_key.go#L90-L108).
- Legacy Jellyfin target handling: [`handlers_autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_autoscan.go#L46-L179) and [`handlers_autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_autoscan.go#L213-L305).
- Upstream Autoscan Jellyfin target config and rewrites: [`README.md`](https://github.com/Cloudbox/autoscan/blob/master/README.md#L417-L436), [`README.md`](https://github.com/Cloudbox/autoscan/blob/master/README.md#L541-L549), and [`jellyfin.go`](https://github.com/Cloudbox/autoscan/blob/master/targets/jellyfin/jellyfin.go#L12-L17).
