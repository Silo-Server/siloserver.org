---
title: Notifications
description: New-episode and request notifications across the in-app inbox, browser push, email, Discord, and webhooks — and what admins configure for each channel.
---

Silo notifies each profile when new episodes become available for series that profile cares about, and when a media request is fulfilled. Notifications land in a durable in-app inbox and can additionally be delivered over browser push, email, Discord DMs, and user-defined webhooks. Admins can also create server channels that broadcast new content and request activity to a community destination such as a Discord server.

## What triggers a notification

A new episode generates a notification for a profile when at least one of these interest reasons applies:

- **Favorites** — the series is favorited
- **Watchlist** — the series is on the watchlist
- **Continue Watching** — the profile has the series in progress
- **Next Up** — the episode is the profile's next expected episode

Each reason has its own toggle under Settings > Notifications > New Episode Notifications, plus a master switch for the profile. These are hard gates: a reason switched off there never fires on any channel. If the same episode exists in multiple libraries (for example "TV" and "TV 4K"), the profile gets one notification, not one per copy.

Request-fulfilled notifications fire when content a profile requested becomes available, and are delivered across the same channels.

Per-profile movie notifications are not in v1 — new-movie events exist only for admin [server channels](#server-channels). Native mobile push (APNs/FCM) is also deferred; mobile apps rely on the inbox sync API for now.

## Flood safety

Notifications are designed to never flood on day one:

- The first scan of a library seeds availability silently — importing a back catalog produces no notifications. Only episodes that appear after seeding count as new.
- Release events wait a short settling window (default 30 seconds) so one scan's burst for a series is processed together, and each series is capped (default 3 events per batch) — a season pack does not produce 20 pings.
- Events older than a cutoff (default 72 hours — e.g. after extended downtime) are suppressed as stale instead of being delivered long after the fact.

## Channels for users

Everything below lives under Settings > Notifications in the web app.

In-app inbox
: Always on (per the profile's preference toggles). The Notifications page lists deliveries newest-first with unread tracking, mark-read, and mark-all-read; the sidebar shows an unread badge and connected clients update in realtime over a websocket.

Browser notifications (Web Push)
: Subscribe the current browser to native push notifications. Payloads are end-to-end encrypted (RFC 8291) and contain no content — the app wakes and fetches from the server. Subscriptions are listed with their delivery health and can be removed at any time.

Email
: Each profile verifies its own address (a confirmation link is sent; nothing is delivered until verified — there is deliberately no fallback to the login account's email). Choose per-episode emails, a daily digest, or both; every email includes an unsubscribe link that works without logging in. Child profiles cannot set an address. Requires the admin to have configured SMTP.

Discord DMs
: Link your Discord account via OAuth, then receive DMs from the server's bot — rich embeds with posters, ratings, and provider links, per-episode or as a daily digest. The link is account-level: one Discord account per Silo login. Available only when the admin has enabled the Discord integration.

Webhooks
: Point notifications at your own automation. Two types: **generic** (JSON POST, HMAC-SHA256 signed with a per-webhook secret using a Stripe-style `X-Silo-Signature: t=<timestamp>,v1=<hex>` header) and **Discord** (webhook URL, rich embeds). Each webhook has its own per-reason toggles (these can narrow but never re-enable a reason disabled at the profile level), a test button, secret rotation, and delivery health. Destinations must be HTTPS and may not point at private addresses; failed deliveries retry with backoff and a webhook that keeps failing is auto-disabled with an in-app notice. Available only when the admin has enabled outbound webhooks.

## Admin configuration

Admin > Settings > Notifications presents the system as a pipeline — release events, fanout, and the in-app UI — followed by one card per delivery channel. All settings are live; no restart required.

The pipeline stages and most channels default **on** and act as kill switches. Two channels are **opt-in** and stay off until you enable them:

- **Outbound webhooks** — letting users point server-originated HTTP at arbitrary destinations is an admin decision.
- **Discord integration** — requires a Discord application anyway (client ID, client secret, and bot token, all stored encrypted). Until enabled, the Discord section is hidden from user settings.

Email
: The kill switch defaults on, but the channel only works once SMTP is configured under Admin > Settings > Email. Set the external URL so emails can deep-link back to your server (without it, emails render without links — the URL is never inferred). You control the daily digest hour (default 08:00 server time) and whether users may choose per-episode email at all; if you disallow it, profiles set to per-episode are coerced to the digest rather than going silent.

Discord posters
: Embed artwork defaults to public provider CDNs only (TMDB/TVDB). You can turn artwork off entirely, or allow presigned URLs from your own image storage — which exposes your storage origin to Discord, so reserve it for fully private servers.

Webhook guardrails
: Per-profile webhook count (default 10) and delivery rate (default 60/minute — over-limit notifications stay in the inbox, the webhook just skips) are configurable. A development-only override can allow private-network destinations.

### Server channels

Admin-owned broadcast destinations, managed inside the same settings tab — a Discord or generic webhook fed from the server's release events rather than any one profile's interests. Per-channel toggles select what it announces: new movies, new episodes, and request lifecycle events (submitted, approved, declined, fulfilled). New-content posts are grouped within a batch window (default 5 minutes) so a season pack lands as one post. Each channel has a test button and delivery-health display, and URLs and signing secrets are encrypted at rest.

### Tuning defaults

| Setting | Default | Range |
| --- | --- | --- |
| Fanout settling window | 30 s | 0–3600 s |
| Per-series burst cap | 3 events per batch | 1–1000 |
| Stale event cutoff | 72 h | 1 h–1 year |
| Read inbox retention | 90 days | 1–3650 days |
| Unread inbox retention | 180 days | 1–3650 days |
| Processed event retention | 30 days | 1–3650 days |
| Webhooks per profile | 10 | 1–100 |
| Webhook deliveries per minute per profile | 60 | 1–10000 |
| Email / Discord digest hour | 08:00 server time | 0–23 |
| Server-channel batch window | 300 s | 120–3600 s |

## Security model

- Webhook and server-channel destinations must be HTTPS, and private/internal addresses are blocked at registration and again at connect time (DNS-rebinding safe). Destination URLs, signing secrets, SMTP password, and Discord credentials are encrypted at rest.
- Generic webhook payloads are HMAC-SHA256 signed and never include your server's origin URL. Emails include deep links only when you explicitly configure the external URL.
- Web push payloads are encrypted per RFC 8291 and carry no media details; VAPID keys are self-provisioned on first use, with the private key encrypted at rest.
- Realtime websocket connections authenticate with single-use, short-lived tickets so credentials never appear in proxy access logs.

## Source notes

- Settings keys, defaults, and opt-in rationale: [`settings.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/settings.go)
- Interest reasons and release event kinds: [`release_types.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/release_types.go)
- Fanout, settling, burst caps, and stale suppression: [`fanout_logic.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/fanout_logic.go)
- Webhook signing and destination guard: [`webhook_payload_generic.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/webhook_payload_generic.go), [`webhook_guard.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/webhook_guard.go)
- Email channel (profile-level, verified addresses): [`email_prefs_repo.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/email_prefs_repo.go)
- Server channels: [`server_channel_types.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/server_channel_types.go)
- User settings UI: [`NotificationsSettings.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/settings/NotificationsSettings.tsx); admin UI: [`NotificationsAdminSettings.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin-settings/NotificationsAdminSettings.tsx)
