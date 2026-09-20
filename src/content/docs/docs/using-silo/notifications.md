---
title: Manage your notifications
description: Choose which events reach you and check browser, phone, email, or Discord delivery.
---

Use **Settings > Notifications** in the web app to choose events and delivery
options. The administrator must configure a delivery channel before you can use it.

## Choose what notifies you

Under **New Episode Notifications**, turn notifications on and choose whether
to follow series in your **Favorites**, **Watchlist**, **Continue Watching**,
or **Next Up**. A delivery channel cannot turn a disabled reason back on.
Requested-title availability can also produce a notification.

## Read the web inbox

Open **Notifications** from the main menu. Open or mark a notification read,
or use the mark-all-read action to clear the unread count. Check this inbox
first when an email or phone alert appears to be missing.

## Set up delivery

### Browser notifications

Open Silo using an HTTPS address trusted by your browser. If you used an
address such as `http://192.168.1.10:8090` for setup, ask your administrator
for the HTTPS address before subscribing. HTTP on `localhost` is an exception
for use on the server itself, not another device on the LAN.

In **Browser Notifications**, subscribe the browser and accept its permission
prompt. Review or remove the subscription in the same section. This is
separate from an installed phone app's notifications.

### Phone and tablet notifications

After signing in and choosing a profile, allow notifications when the Silo
app or operating system asks. If you denied permission earlier, change it
in the device's notification settings for Silo. Keep the server reachable
when opening an alert so the app can fetch its related content.

Use the web settings above for your event choices. A phone push alert does
not imply that a TV app or every native app has an inbox. Delivery also
depends on the installed app build and the server's push configuration.

### Email

In **Email Notifications**, enter an address for this profile and follow the
verification link. Turn delivery on and choose the available per-episode
or digest options. Silo does not fall back to the account's login email.
Child profiles cannot configure their own email destination.

### Discord direct messages

Select **Link Discord** and authorize the connection. Your Discord account
must share a Discord server with the Silo bot. This link applies to the
Silo account and can deliver events for its household profiles.

### Webhooks

If **Webhooks** is available, add a name and HTTPS destination, choose events,
then use **Test**. Keep the URL and signing secret private. A webhook may
narrow your event choices but cannot override a disabled reason.

## If notifications do not arrive

1. Check the selected profile and event switches.
2. Check the web inbox. An inbox entry with no external alert points toward
   delivery or device permission rather than a missing event.
3. Confirm the email address is verified or the browser/phone permission is allowed.
4. Ask the administrator to check the channel and failed delivery.

If browser notifications are reported as unsupported, check that you are
using the HTTPS address before trying another browser.

Do not expect a first scan to alert you about every old episode. The server
limits stale events and large batches.

## For server administrators

See [Configure notification delivery](/docs/running-a-server/notifications)
for channel setup and delivery failures.

## Source notes

Device notification permission and server event preferences are separate
checks. Changing one does not fix a failure in the other.
