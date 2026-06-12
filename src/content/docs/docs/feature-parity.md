---
title: Client feature parity
description: Feature-by-feature comparison of the Silo web app, Apple and Android clients, and the Jellyfin compatibility layer.
---

This page tracks which server features each client supports today. The web app ships with the server and is the reference client; the native apps and the compatibility layers are catching up at different rates.

Status values:

- **Yes** — implemented and working
- **Partial** — implemented with limitations (noted inline)
- **No** — not yet available on that client
- **—** — not applicable, or intentionally out of scope

The **Jellyfin compat** column describes what the [compatibility API](/docs/jellyfin-compatibility) supports. Actual behavior also depends on the third-party client you use — see [clients](/docs/clients) for verified apps.

## Media types

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Movies | Yes | Yes | Yes | Yes |
| TV series, seasons, episodes | Yes | Yes | Yes | Yes |
| Audiobooks | Yes | Yes | No | — served via the [Audiobookshelf-compatible endpoint](/docs/audiobookshelf-compatibility) |
| eBooks (EPUB, PDF, comics) | Yes | No | No | — |
| Podcasts | No | No | No | — Audiobookshelf-compatible endpoint |

## Playback

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Direct play | Yes | Yes | Yes | Yes |
| Remux and HLS transcode | Yes | Yes | Yes | Yes (HLS only) |
| Quality selection | Yes | Yes | Yes | Yes |
| Audio track selection | Yes | Yes | Yes | Yes |
| Subtitle track selection | Yes | Yes | Yes | Yes |
| Subtitle appearance settings | Yes | Yes | Yes | — client-side |
| Subtitle search and download | Yes | No | No | Partial — serves already-downloaded subtitles |
| AI subtitle translation and transcription | Yes | No | No | No |
| Chapters | Yes | Yes | Partial | Yes |
| Intro and credits skip | Yes | Yes | Yes | Yes (media segments) |
| Trickplay seek previews | Partial — chapter thumbnails on the seek bar | No | No | No |
| Next-episode autoplay | Yes | Yes | Yes | Yes (client-dependent) |
| Playback speed control | Partial — audiobook player only | Yes | Yes | — client-side |
| Sleep timer | Yes | Partial — audiobooks only | Yes | — client-side |
| Picture-in-picture | Yes | No | No | — client-side |
| Watch Together | Yes | No | No | No |
| HDR playback | Yes | Yes, incl. Dolby Vision profile 7 fallback | Yes, incl. refresh-rate matching | Yes |
| File version and edition selection | Yes | Yes | Yes | Yes |

## Browse and discovery

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Server-driven home sections | Yes | Yes | Yes | Partial — latest and resume rows only |
| Continue watching | Yes | Yes | Yes | Yes |
| Next up | Yes | Yes | Partial | Yes |
| Search | Yes | Yes | Yes | Yes |
| Filters and sorting | Yes | Partial — genre and sort | Yes — full filters on mobile, genre and sort on TV | Partial |
| Collections | Yes | Yes | Yes | Yes (as box sets) |
| Creating and editing collections | Yes | No | No | No |
| Cast and person pages | Yes | Yes | Yes | Yes |
| Recommendations | Yes | Yes | Yes | Partial |
| Calendar and upcoming | Yes | Yes | No | Partial — per-series upcoming only |

## User features

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Watchlist | Yes | Yes | Yes | No |
| Favorites | Yes | Yes | Yes | Yes |
| Mark watched / unwatched | Yes | Yes | Yes | Yes |
| Watch history view | Yes | Yes | Yes | No |
| Personal ratings | Yes | No | No | No |
| Cross-device resume | Yes | Yes | Yes | Yes |
| Profiles | Yes | Partial — editing not yet available | Yes | Partial — sign in as `username#profile` |
| Profile PIN protection | Yes | Yes | Yes | Yes — append the PIN as `password#pin` |
| Media requests | Yes | No | No | No |
| [Notifications](/docs/notifications) inbox | Yes | No | No | No |
| Notification settings (web push, email, Discord, webhooks) | Yes | No | No | No |

## Sign-in

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Username and password | Yes | Yes | Yes | Yes |
| Device link (QR code) | Yes | Yes | No | No |
| OAuth providers | Yes | No | No | No |
| Multiple servers | — | Yes | Yes | — client-side |

## Downloads and offline

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Direct file download | Yes | No | No | Yes |
| Offline downloads and playback | — | No (planned) | No (planned) | No |

## Administration

| Feature | Web | Apple | Android | Jellyfin compat |
| --- | --- | --- | --- | --- |
| Stats dashboard | Yes | Yes | Yes | No |
| User management | Yes | No | No | No |
| Library management and scans | Yes | No | No | Partial — autoscan webhook |
| Metadata editing and identification | Yes | No | No | No |
| Sessions, activity, and logs | Yes | Partial | No | No |
| Tasks, plugins, nodes, and settings | Yes | No | No | No |

## Notes

- The Jellyfin compatibility layer is intentionally scoped to movies and TV. Audiobooks and podcasts are served through the [Audiobookshelf-compatible endpoint](/docs/audiobookshelf-compatibility) instead.
- This page reflects active development and is updated as clients ship features. If a client behaves differently from what's listed here, please [open an issue](https://github.com/Silo-Server).
