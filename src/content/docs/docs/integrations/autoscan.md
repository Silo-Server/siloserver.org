---
title: Autoscan
description: Configure Autoscan to trigger Silo library scans.
---

Silo exposes the Jellyfin endpoints that Autoscan's Jellyfin target expects:

- `GET /Library/VirtualFolders`
- `POST /Library/Media/Updated`

Autoscan upstream is feature-frozen, so this integration targets its current Jellyfin target behavior.

## Requirements

- Silo running in `integrated` or `api` mode with Jellyfin compatibility enabled.
- The Jellyfin-compatible endpoint reachable by Autoscan. In the default Docker stack this is port `8096`.
- At least one enabled Silo library.
- A Silo admin API key. Silo admin API keys begin with `sa_`.
- Autoscan paths that match Silo library roots after Autoscan rewrite rules run.

## Silo setup

1. Add a library using the path Silo sees, such as `/mnt/media/movies`.
2. Confirm the library root is reachable from Admin > Libraries.
3. Create an admin API key from Admin > API Keys.
4. Confirm Autoscan can reach the Jellyfin-compatible endpoint, for example `http://silo:8096` on a shared Docker network or `https://media.example.com` through a reverse proxy.

## Autoscan target

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

Autoscan rewrite `from` values are regular expressions. Keep rewrites narrow enough that the rewritten path lands inside exactly one Silo library root.

## Path examples

| Autoscan sends | Silo library root | Result |
| --- | --- | --- |
| `/mnt/media/movies/Movie (2025)/Movie.mkv` | `/mnt/media/movies` | File scan |
| `/mnt/media/tv/Show/Season 1` | `/mnt/media/tv` | Subtree scan |
| `/tv/Show/Season 1` rewritten to `/mnt/media/tv/Show/Season 1` | `/mnt/media/tv` | Subtree scan |
| `/downloads/complete/Movie.mkv` | `/mnt/media/movies` | Ignored or rejected unless Autoscan rewrites it under the library root |

## Request behavior

Autoscan's Jellyfin target sends the token in `X-Emby-Token`, fetches libraries from `/Library/VirtualFolders`, and posts updates to `/Library/Media/Updated` with this shape:

```json
{
  "Updates": [
    {
      "path": "/mnt/media/movies/Movie (2025)/Movie.mkv",
      "updateType": "Modified"
    }
  ]
}
```

Silo queues matching library, subtree, or file scans and returns `204 No Content` on success. Empty update lists, empty paths, invalid request bodies, ambiguous library matches, and some invalid paths return errors. Some Autoscan-style noise is handled softly: unsupported sidecar paths, missing paths, or paths outside any library may be ignored or resolved to a parent directory scan.

## Troubleshooting

- If Autoscan says no target library was found, compare the path after Autoscan rewrite with Silo's library root. Autoscan uses prefix matching against `/Library/VirtualFolders` locations.
- If Silo rejects the request as unauthorized, use an admin API key beginning with `sa_` as the Jellyfin target token.
- If a request reaches Silo but no scan starts, check that the path is a directory or a supported video file under an enabled library.
- If Autoscan runs in Docker, mount the same media paths or configure rewrites. Autoscan's own docs state that rewritten paths are required when trigger, Autoscan, and target paths differ.

## Source notes

- Silo Jellyfin-compatible Autoscan routes and auth requirements: [`router.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/router.go#L76-L84).
- Silo Jellyfin compatibility default listen address and mode startup: [`db_loader.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/config/db_loader.go#L358-L363) and [`main.go`](https://github.com/Silo-Server/silo-server/blob/main/cmd/silo/main.go#L1518-L1520).
- Token extraction and admin API key requirements: [`auth.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/auth.go#L37-L67) and [`auth_api_key.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/auth_api_key.go#L90-L108).
- Silo virtual folders and media update handling: [`handlers_autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_autoscan.go#L46-L88) and [`handlers_autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_autoscan.go#L91-L179).
- Silo Autoscan dedupe, parent fallback, and soft error handling: [`handlers_autoscan.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/jellycompat/handlers_autoscan.go#L213-L305).
- Silo scan path matching and supported video extensions: [`scantrigger.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scantrigger/scantrigger.go#L129-L172) and [`scanner.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/scanner/scanner.go#L24-L37).
- Autoscan feature-freeze notice and Jellyfin target config: [`README.md`](https://github.com/Cloudbox/autoscan/blob/master/README.md#L1-L2) and [`README.md`](https://github.com/Cloudbox/autoscan/blob/master/README.md#L417-L436).
- Autoscan Docker path rewrite guidance: [`README.md`](https://github.com/Cloudbox/autoscan/blob/master/README.md#L541-L549).
- Autoscan Jellyfin target fields and request behavior: [`jellyfin.go`](https://github.com/Cloudbox/autoscan/blob/master/targets/jellyfin/jellyfin.go#L12-L17), [`api.go`](https://github.com/Cloudbox/autoscan/blob/master/targets/jellyfin/api.go#L30-L32), [`api.go`](https://github.com/Cloudbox/autoscan/blob/master/targets/jellyfin/api.go#L84-L129), and [`api.go`](https://github.com/Cloudbox/autoscan/blob/master/targets/jellyfin/api.go#L137-L174).
- Autoscan rewrite implementation: [`autoscan.go`](https://github.com/Cloudbox/autoscan/blob/master/autoscan.go#L57-L86).
