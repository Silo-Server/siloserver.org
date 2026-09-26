---
slug: docs/native-inboxes
beta: true
title: Native notification inboxes (Beta)
description: Understand when an Android notification can open the in-app inbox.
---

:::caution[Beta]
Native inboxes are outside the supported 1.0 scope. Mobile push and the
web inbox remain separate 1.0 features. Receiving a push does not mean your
native app has a browsable notification menu.
:::

| Client | Where to read notifications |
| --- | --- |
| Android phone and tablet | Tap a notification without a title destination to open the inbox. Use the web inbox to browse history at any time. |
| Android TV | Use **Notifications** in the web app. |
| iPhone, iPad, Apple TV, native macOS | Use **Notifications** in the web app. |
| Web | Open **Notifications** from the main menu. |

On Android, tap a Silo notification. Alerts linked to a title open that
title; alerts without a title destination open the inbox. Use the server and
profile that received the notification to open its content.

If you need to find an older alert, use **Notifications** in the web app.
Do not depend on a new phone alert as the only route to notification history.
See [notification settings](/docs/notification-inbox) for delivery setup.
