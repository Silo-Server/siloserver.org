---
title: Configure notification delivery
description: Set up email, browser or mobile push, and server-owned announcement channels.
---

Open **Admin > Settings > Notifications** to choose how your server sends notifications. Users choose their interests and personal channels in [their notification settings](/docs/using-silo/notifications).

Keep **Release events** and **Fanout** on when you want library changes to reach subscribers. These controls collect new-content events and distribute them to interested profiles. Setting up delivery does not subscribe a browser, verify a user's email address, or link their Discord account.

## Set up email

1. Turn on the **Email** card, then open it and turn on **Send email from this server**. These are separate switches.
2. Enter the sender address, mail server, port, encryption choice, and credentials supplied by your mail service.
3. Save and follow any restart notice, then send a test email using the test control. Check the recipient's inbox and spam folder.
4. Choose whether people may receive an email per episode and set the **Daily summary hour**.

Set the server's external URL in General settings if emails should link back to Silo. Use the address recipients can reach, not a Docker-only hostname.

## Browser push

Users need an HTTPS address with a certificate their browser trusts. The
beginner setup's `http://SERVER-IP:8090` address cannot support browser push;
HTTP on `localhost` is only a local-testing exception. See the
[HTTPS setup guide](/docs/running-a-server/reverse-proxy). Browser push requires
a secure origin, not public access to your server; a trusted HTTPS address
on your private network can also work.

Turn on **Web Push** and save. Each user must subscribe from their browser and grant its notification permission. Test from that browser before treating delivery as ready.

If the browser reports push as unsupported, check its address and certificate
before changing delivery settings.

## Mobile push

1. Open **Silo Push Relay** and read its privacy disclosure.
2. Turn on **Apple Push (APNs)**, **Android Push (FCM)**, or both.
3. Use the relay registration control. Wait for **Relay configured**, then save other settings and follow any restart notice.
4. Ask a user to allow notifications in the mobile app and device settings. Check delivery on that device.

The relay carries a content-free push request through Apple or Google; the app fetches private notification content from your server. The relay still processes delivery metadata, including the server's connecting IP address. A registered relay is not proof that a device has opted in or received a notification.

If the page says **Re-registration required**, register again. Clearing the relay credential interrupts mobile delivery until registration is restored.

## Discord and personal webhooks

For Discord, configure the application credentials in its card, save, then choose **Test bot token**. That test uses saved credentials. Users still need to link their own Discord accounts for personal delivery.

Turn on outgoing webhooks only if you want users to add destinations. Keep private-address delivery blocked unless you have reviewed the consequences for your network. A destination can receive information about a user's notification events.

## Server channels

Use **Add server channel** to announce new media or request activity to a shared Discord channel or webhook. Enter the destination, choose its events, and create it. Use **Test** and inspect the delivery result.

Server channels are not filtered by one viewer's interests. Send them only to destinations whose audience should see those announcements.

## Missing or delayed notifications

The first library scan seeds the catalog without sending a notification for every old item. Later events are grouped, and stale events can be suppressed. Check **Grouping and flood control** before interpreting every delay as a failure.

For a single affected person, check their profile preferences, channel subscription, and device permissions before changing server-wide settings. **Retention** controls how long inbox and sent-history records remain; it does not repair a failed delivery.
