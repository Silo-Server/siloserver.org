---
slug: docs/privacy
title: Understand where information goes
description: See which outside services a Silo server contacts, what it sends, and where diagnostic reports go.
---

Your Silo server keeps your libraries, accounts, and watch history. It
contacts outside services for metadata, plugins, and the features an
administrator turns on. This page lists those services. If someone else runs
your server, they control these settings.

The Silo apps, the diagnostics service, and the push relay are covered by
the [privacy policy](https://siloserver.org/privacy). That policy doesn't apply to a self-hosted
server; your server's administrator and each outside provider have their own
policies.

## Services the server contacts

| Service | When it's contacted | What's sent | On by default? |
| --- | --- | --- | --- |
| Silo plugin catalog on GitHub | At startup, once a day, and when an administrator opens the plugin catalog | A request for the catalog and any plugin being installed or updated | Yes |
| Approved community plugin catalog on GitHub | Same as the Silo catalog | Same as the Silo catalog | No. Turn on **Include approved community plugins** under **Admin > Plugins** |
| TMDB and TVDB, through their metadata [plugins](/docs/plugins) | When Silo matches or refreshes metadata | Titles, years, language, and IDs to look up, with the plugin's API key | Yes. Both plugins are installed on first start |
| TMDB, for [requests](/docs/manage-requests) and TMDB-based collections | When someone searches or browses requests, or such a collection syncs | Search text and TMDB IDs | No. Requests stay off until an administrator turns them on |
| TheIntroDB, through its [markers](/docs/markers) plugin | When an episode starts playing, and during a daily marker sync | The title's TMDB, TVDB, or IMDb ID, season and episode numbers, and the file's duration | Yes. The plugin is installed on first start |
| TheIntroDB contributions | When an administrator submits markers, or daily if automatic contribution is on | Marker type and times, file duration, and the title's IDs, with the administrator's TheIntroDB API key | No |
| [Subtitle providers](/docs/subtitle-providers): OpenSubtitles, SubDL, SubSource | When someone searches for or downloads a subtitle | Title, IMDb ID, languages, and season and episode. OpenSubtitles also gets a hash of the video file, and SubDL gets its file name | No. Each provider needs to be turned on and given credentials |
| [AI text model](/docs/ai-services) | When subtitle or description translation runs | Subtitle text, or descriptions and taglines | No |
| AI speech-to-text model | When Silo creates subtitles from audio | The audio track, in chunks | No |
| Embedding model for recommendations | During scheduled recommendation jobs | Catalog text | No |
| Silo Push Relay (`push.siloserver.org`) | When a notification needs to reach a phone or tablet that allowed notifications | A content-free wake-up: the device's push token and delivery IDs, with no titles, message text, or server address | Yes on new servers. See [mobile push](/docs/notification-delivery#mobile-push) |
| The browser's push service | When a browser that allowed notifications needs one | The encrypted notification, including its title and text | Yes |
| Email (SMTP), Discord, and webhooks | When a [notification](/docs/notification-delivery) or email is sent through that channel | The notification or email content | No. Each needs setup |
| Trakt, Simkl, MDBList ([Beta sync](/docs/watch-sync)) | Only for a profile that connected an account | Watch history, progress, watchlist, ratings, and playback activity, depending on the options chosen | No |
| Trakt and MDBList lists | When an administrator creates or syncs a list-based collection | Requests for the list | No |
| plex.tv or Emby Connect | During a [watch-history import](/docs/import-watch-history) that signs in there | Your Plex or Emby Connect sign-in, then requests for your servers and watch history | No |
| GitHub and npm, for Jellyfin's web player | When an administrator installs or updates the Jellyfin web player | Download requests | No |

Silo has no built-in analytics or usage telemetry. It exports traces and
logs over OpenTelemetry only when the operator sets
`OTEL_EXPORTER_OTLP_ENDPOINT` or `SILO_OTEL_ENABLED`.

## What apps and browsers load directly

The web app and native apps load some artwork, profile avatars (DiceBear),
and trailers straight from those services rather than through your server.
The [privacy policy](https://siloserver.org/privacy) lists them under third-party artwork, avatars,
and trailers.

## Where diagnostic reports go

In a native app, **Settings > Diagnostics** chooses where reports go:

- **Silo Diagnostics** sends them to the project's diagnostics service. The
  [privacy policy](https://siloserver.org/privacy) describes what it keeps and for how long.
- **My Silo Server** on Apple, or **This Silo server** on Android, sends
  them to the server you use, where its administrator can read them.

**Crash Reports** controls automatic reports: **Ask**, **Always**, or
**Never** (**Ask before sending**, **Always send**, or **Never send** on an
Android phone). **Always** isn't offered for Silo Diagnostics. Reports can
include device details and logs. A report sent to your own server can also
include playback-session IDs.

To send a report and share its ID, see
[Report a problem](/docs/report-a-problem#native-app-diagnostics).
