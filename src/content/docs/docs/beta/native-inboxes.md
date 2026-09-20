---
title: Native notification inboxes (Beta)
description: Understand when an Android notification can open the in-app inbox.
---

:::caution[Beta]
Native inboxes are outside the supported 1.0 scope. Mobile push and the
web inbox remain separate 1.0 features. Receiving a push does not mean your
native app has a browsable notification menu.
:::

| Client | Current access |
| --- | --- |
| Android phone and tablet | A notification tap can open an inbox when it has no item destination; no normal inbox menu was found |
| Android TV | An inbox screen exists in source, but no current navigation route was found |
| iPhone, iPad, Apple TV, native macOS | No native inbox entry was found in the inspected source |
| Web | The normal notification inbox is covered by the main guide, not this beta |

On Android, tap a Silo notification. Alerts linked to a title open that
title; a fallback alert may open the inbox instead. The app checks the
notification's server and profile, so a notification for another identity
may wait until you switch back. This is not a way to open another person's inbox.

If you need to find an older alert, use **Notifications** in the web app.
Do not depend on a new phone alert as the only route to notification history.
See [notification settings](/docs/using-silo/notifications) for delivery setup.
