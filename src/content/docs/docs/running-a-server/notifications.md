---
slug: docs/notification-delivery
title: Configure notification delivery
description: Set up email, browser or mobile push, and server-owned announcement channels.
---

Open **Admin > Settings > Notifications** to choose how your server sends notifications. People choose what they hear about and their personal channels in [their notification settings](/docs/notification-inbox).

The three switches at the top run the pipeline: **Notice new content** records new items during scans, **Work out who wants it** matches them against everyone's preferences, and **Send it** hands messages to the delivery channels. Keep all three on for new-content notifications.

## Set up email

1. Turn on the **Email** card, then turn on **Send email from this server** inside it. This second switch covers every email Silo sends, including invitations and password resets.
2. Enter the **From address**, **Mail server address**, **Port**, **Encryption**, and the sign-in details from your mail provider.
3. Save. Enter a recipient next to **Send test**, send a test email, and look for it in the inbox and spam folder.
4. Choose whether people can pick an email per episode, and set the **Daily summary hour**.

Emails link back to Silo through the **Silo public URL** in **Admin > Settings > General**. Use an address recipients can open, not a Docker-only hostname.

## Browser push

Browser push needs an HTTPS address with a certificate the browser trusts. The beginner setup's `http://SERVER-IP:8090` address can't use it; plain HTTP works only on `localhost` for testing. The address doesn't have to be public: a trusted HTTPS address on your home network works. See the [HTTPS setup guide](/docs/reverse-proxy).

Turn on **Web Push** and save. Each person then subscribes from their browser and allows its notifications. If the browser reports push as unsupported, check the address and certificate first.

## Mobile push

1. Turn on the **Silo Push Relay** card and read its privacy disclosure.
2. Leave **Apple Push (APNs)**, **Android Push (FCM)**, or both on.
3. Choose **Register relay** and wait for **Relay configured**, then save.
4. Each person allows notifications in the mobile app and in their device settings.

Your server sends the relay a push request with no content, and the relay delivers it through Apple or Google. The app then fetches the notification from your server. The relay never receives titles, message text, names, or your server URL, but it does see your server's IP address and delivery metadata.

If the card shows **Re-registration required**, choose **Re-register relay**. Clearing the relay credential stops mobile push until you register again.

## Discord and personal webhooks

For Discord, open **Show setup guide** in the **Discord** card and follow it to create a Discord application. Enter the **Client ID**, **Client secret**, and **Bot token**, save, then choose **Test bot token**. Each person then links their own Discord account to get direct messages.

Turn on **Personal Webhooks** only if you want people to add their own Discord or generic webhook destinations. A destination receives details of that person's notifications. **Allow webhooks to private addresses** lets webhooks reach LAN and localhost addresses; it is meant for development, so leave it off.

## Server channels

Use **Add server channel** to post new media or request activity to a shared Discord channel or webhook. Enter a name and URL, choose its events, and choose **Create**. Use **Test** to send a sample post.

Server channels post every selected event, whatever each viewer's own preferences, so use them only where the whole audience should see the announcements.

## Missing or delayed notifications

The first library scan adds existing media without notifying anyone about it. After that, **Grouping and flood control** combines items that finish scanning together, caps messages per show, and drops items older than **Max content age**. Check these settings before treating a delay as a failure.

When one person is missing notifications, check their notification preferences, channel subscriptions, and device permissions before changing server-wide settings. **Retention** only controls how long inbox and sent-history records are kept.
