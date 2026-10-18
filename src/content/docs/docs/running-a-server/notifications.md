---
slug: docs/notification-delivery
title: Configure notification delivery
description: Set up email, browser or mobile push, and server-owned announcement channels.
---

Open **Admin > Integrations > Notifications** to choose how your server sends notifications. Each channel under **Delivery channels** has its own switch; select a channel's name to show its setup. People choose what they hear about and their personal channels in [their notification settings](/docs/notification-inbox).

Two switches run the pipeline for new content: **Notice new content** records new items during scans, and **Work out who wants it** matches them against everyone's preferences. Both are on by default and sit under **Advanced** in **Processing**. Keep them on for new-content notifications. If either is off, a notice at the top of the page says so.

## Set up email

1. Open **Admin > Integrations > Email** and turn on **Send email from this server**. This switch covers every email Silo sends, including invitations and password resets.
2. Enter the **From address**, **From name**, **Mail server address**, **Port**, **Encryption**, and the sign-in details from your mail provider.
3. Save. Enter a recipient next to **Send test**, send a test email, and look for it in the inbox and spam folder.
4. For notification emails, open **Admin > Integrations > Notifications** and turn on the **Email** channel.
5. Turn on **Let people pick an email per episode** to offer an email for each episode instead of only the daily summary. The **Daily summary hour** is under **Advanced** in the channel.
6. Save.

Emails link back to Silo through the **Silo public URL** in **Admin > Server > General**. Use an address recipients can open, not a Docker-only hostname.

## Browser push

Browser push needs an HTTPS address with a certificate the browser trusts. The beginner setup's `http://SERVER-IP:8090` address can't use it; plain HTTP works only on `localhost` for testing. The address doesn't have to be public: a trusted HTTPS address on your home network works. See the [HTTPS setup guide](/docs/reverse-proxy).

Turn on **Web Push** and save. Each person then subscribes from their browser and allows its notifications. If the browser reports push as unsupported, check the address and certificate first.

## Mobile push

1. Turn on the **Silo Push Relay** channel and read its privacy disclosure.
2. To send to only Apple or only Android devices, open **Advanced** in the channel and turn off **Apple Push (APNs)** or **Android Push (FCM)**.
3. Save. Silo registers with the relay the first time it sends a push, and the channel then shows **Relay configured**. To register straight away, choose **Register relay** under **Advanced**.
4. Each person allows notifications in the mobile app and in their device settings.

Your server sends the relay a push request with no content, and the relay delivers it through Apple or Google. The app then fetches the notification from your server. The relay never receives titles, message text, names, or your server URL, but it does see your server's IP address and delivery metadata.

If the channel shows **Re-registration required**, choose **Re-register relay** under **Advanced**. Clearing the relay credential stops mobile push until you register again.

## Discord and personal webhooks

For Discord, open **Setup guide** in the **Discord** channel and follow it to create a Discord application. Enter the **Client ID**, **Client secret**, and **Bot token**, save, then choose **Test bot token**. Each person then links their own Discord account to get direct messages.

Turn on **Personal Webhooks** only if you want people to add their own Discord or generic webhook destinations. A destination receives details of that person's notifications. **Allow webhooks to private addresses**, under **Advanced** in the channel, lets webhooks reach LAN and localhost addresses; it is meant for development, so leave it off.

## Server channels

Turn on **Server Channels**, then use **Add server channel** to post new media or request activity to a shared Discord channel or webhook. Enter a name and URL, choose its events, and choose **Create**. Use **Test** to send a sample post.

Server channels post every selected event, whatever each viewer's own preferences, so use them only where the whole audience should see the announcements.

## Missing or delayed notifications

The first library scan adds existing media without notifying anyone about it. After that, **Grouping and flood control** combines items that finish scanning together, caps messages per show, and drops items older than **Max content age**. These settings are under **Advanced** in **Processing**. Check them before treating a delay as a failure.

When one person is missing notifications, check their notification preferences, channel subscriptions, and device permissions before changing server-wide settings. **Retention** only controls how long inbox and sent-history records are kept.
