---
title: Manage your notifications
description: Choose which events notify you and configure delivery in the Silo web app.
---

Open **Settings > Notifications** in the web app to choose which events you
hear about and how they reach you. Some delivery options are available only
after your server administrator enables them.

This guide covers the existing web notification settings. Native phone and
tablet push is part of the [1.0 release plan](https://siloserver.org/milestone/1.0/#feature-notifications),
but setup and availability must be checked against your app and server versions.
A push alert is separate from an inbox inside a native app.

## Choose what notifies you

New-episode notifications follow your profile's interest in a series:

- **Favorites:** series you have favorited.
- **Watchlist:** series on your watchlist.
- **Continue Watching:** series you have in progress.
- **Next Up:** your next expected episode.

Under **New Episode Notifications**, use the master switch and the individual
reason toggles. A reason disabled here cannot be turned back on by a delivery
channel's settings. The same episode in multiple libraries produces one
notification rather than one for each copy.

You can also receive a notification when content you requested becomes available.

## Read the web inbox

The Notifications page lists deliveries newest first, with unread tracking,
mark-read, and mark-all-read controls. The sidebar shows an unread badge.

## Set up delivery

### Browser notifications

Subscribe the browser you are currently using to Web Push. Review or remove
subscriptions in notification settings. Browser push is not the same as push
notifications from an installed Silo phone or tablet app.

### Email

Enter and verify an email address for your profile. Follow the confirmation
link before expecting deliveries; Silo does not use the login account's email
as a fallback. Child profiles cannot set an email address.

Choose per-episode messages, a daily digest, or both, depending on what your
administrator allows. Notification emails include an unsubscribe link.

### Discord direct messages

If Discord is enabled, link your Discord account and choose per-episode
messages or a daily digest. The Discord link belongs to the Silo account:
there is one linked Discord account per Silo login.

### Webhooks

If outbound webhooks are enabled, add a generic or Discord webhook destination.
Use the test control and review its delivery health. Each webhook can narrow
the profile's event preferences but cannot re-enable a disabled reason.

Destinations must use HTTPS and cannot point at private network addresses.
Keep webhook URLs and signing secrets private. Repeated delivery failures can
disable a webhook and produce an inbox notice.

## If notifications do not arrive

1. Check the profile's master switch and the relevant event toggle.
2. Check the web inbox to distinguish a missing event from a delivery problem.
3. For email, confirm the profile address is verified. For browser push, check
   the browser's site permission and the subscription's delivery health.
4. Ask your administrator whether the channel is enabled and configured.

An initial library scan does not send a notification for every old episode.
Large batches and stale events are limited by the server's
[delivery safeguards](/docs/running-a-server/notifications#flood-safety).

## For server administrators

Use [Configure notification delivery](/docs/running-a-server/notifications)
for SMTP, Discord, server channels, webhook guardrails, and retention settings.

## Source notes

- [Web notification settings](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/settings/NotificationsSettings.tsx).
- [Notification settings and defaults](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/settings.go).
- [Profile email preferences](https://github.com/Silo-Server/silo-server/blob/main/internal/notifications/email_prefs_repo.go).
