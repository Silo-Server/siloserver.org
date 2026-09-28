---
slug: docs/notification-inbox
title: Manage your notifications
description: Choose which events reach you and check browser, mobile, email, or Discord delivery.
---

Choose your events and delivery options in the web app under
**Settings > Notifications**. Browser, mobile, email, and Discord delivery
work once the person who runs your server has
[set them up](/docs/notification-delivery).

## Choose what notifies you

Under **New Episode Notifications**, turn on **Enable notifications** and
choose which series to follow: those in your **Favorites**, **Watchlist**,
**Continue Watching**, or **Next Up**. These choices apply to every delivery
channel. You can also get a notification when a title you requested becomes
available.

## Read the web inbox

Open **Notifications** from the main menu. Open a notification or mark it
read, or mark them all read to clear the unread count. If an email or mobile
alert seems to be missing, look here first.

The Silo apps don't have a notification list, with one exception: on an
Android phone or tablet, tapping an alert that isn't about a specific title
opens an in-app inbox. That inbox is a [Beta feature](/docs/beta). On other
devices, use the web inbox to find older alerts.

## Set up delivery

### Browser notifications

Open Silo at its HTTPS address. Browsers only allow notifications from secure
addresses, so an address like `http://192.168.1.10:8090` won't work. Ask the
person who runs your server for the HTTPS address if you don't have it.

In **Browser Notifications**, select **Enable** and accept the browser's
permission prompt. Other browsers and devices you've subscribed are listed in
the same section, where you can remove them. Browser notifications are
separate from the mobile app's notifications.

### Phone and tablet notifications

After you sign in and choose a profile, allow notifications when the Silo app
or your device asks. If you declined earlier, turn them on in your device's
notification settings for Silo. When you tap an alert, the app needs to reach
the server to open it.

Your event choices still come from the web settings above.

### Email

Email is set per profile, and each profile uses its own verified address, not
the account's sign-in email.

1. In **Email Notifications**, select **Add address**, enter the address, and
   select **Request verification**.
2. Open the link in the verification email.
3. Turn on **Email this profile's notifications** and choose **Daily digest**,
   **Every episode**, or **Every episode + daily digest**.

Your server may only offer the daily digest. Child profiles can't receive
email notifications.

### Discord direct messages

Select **Link Discord** and authorize the connection. Your Discord account
must share a Discord server with the Silo bot. The link covers every profile
on your Silo account.

### Webhooks

If **Webhooks** appears, select **Add webhook**, enter a name and HTTPS URL,
choose events, then use **Test**. Keep the URL and signing secret private.
A webhook can send fewer events than your profile's choices, but not more.

## If notifications don't arrive

1. Make sure you're on the right profile and its event switches are on.
2. Look in the web inbox. If the notification is there but no alert reached
   you, the problem is delivery or device permission.
3. Make sure your email address is verified, or that the browser or your phone
   or tablet allows notifications from Silo.
4. If it still fails, tell the person who runs your server so they can check
   for failed deliveries.

If your browser says notifications aren't supported, make sure you're using
the HTTPS address before trying another browser.

A first library scan won't alert you about every old episode. The server
limits alerts for stale events and large batches.
