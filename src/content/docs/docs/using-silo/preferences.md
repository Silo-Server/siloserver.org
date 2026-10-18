---
slug: docs/preferences
title: Preferences and device overrides
description: Know which choices follow your profile and which apply to one device.
---

Most preferences belong to your profile and follow you to every device. When
one screen or sound system needs something different, such as an audio delay
for the bedroom TV, change that device only.

The mobile and TV apps have their own **Playback** and **Subtitles**
pages under **Settings**. The pages below are in the web app.

## Change a profile preference in the web app

Open **Settings** from your profile menu. The settings pages replace the
app's sidebar, and **Back to App** at the top returns you to the page you
came from. **Search settings** finds a setting by its name. On a phone,
Settings opens as a list of the same pages.

The sidebar groups the pages like this:

- **Playback**
  - **Playback:** quality, skipping, and what plays next.
  - **Language & Subtitles:** spoken and metadata languages, and
    [when subtitles appear and how they look](/docs/subtitles).
  - **Your Devices:** [settings for one device](#change-one-device).
- **Appearance**
  - **Navigation & Cards:** poster size and captions, shortcuts and badges on
    posters, and your menu.
  - **Title Pages:** title art, theme music, spoilers, and advisory ages on
    movie and show pages.
  - **Accessibility:** text size, contrast, and date and time formats.
- **Home & Discovery**
  - **Home Screen:** [which rows appear on Home](/docs/home-and-calendar)
    and on each library page.
  - **Libraries:** which libraries you see and in what order.
  - **Personalize:** the taste profile behind your recommendations.
  - **Requests:** whether adding a title to your watchlist also
    [requests it](/docs/requests). It appears while your server takes
    requests.
- **Connections**
  - **Connect Apps:** sign-in details for the Silo apps and
    [Jellyfin-compatible apps](/docs/jellyfin-apps).
  - **Watch Providers:** [sync with an outside service](/docs/watch-sync).
  - **Webhook Sync:** [watched status from Plex, Emby, or Jellyfin](/docs/watch-state-webhooks).
  - **History Import:** [a one-time copy of your history](/docs/import-watch-history).
- **Account**
  - **Notifications:** [what you hear about and how](/docs/notification-inbox).
  - **Profiles**, **Account**, and **Signed-in sessions:** the household's
    [profiles](/docs/profiles) and [sign-in](/docs/accounts). Only the primary
    profile and administrators see these.

**Navigation & Cards** and **Accessibility** change only the web app.

**Metadata language** sets the language for titles and descriptions where
Silo has them. It doesn't change a movie's spoken audio; use
**Spoken language** for that.

## Change one device

1. Open **Settings > Your Devices** and choose the device. The one you're
   using says **This device**.
2. Change any setting it lists, such as quality, subtitle language, playing
   the next episode, HDR, or the audio sync offset. Each setting says where its value comes
   from: **Changed here**, **From your profile**, or **App default**. A
   changed setting shows **Use your setting**; select it to go back to your
   profile's value. **Use profile settings** removes every change on the
   device.
3. Play something on that device to hear or see the result.

A browser only lists the settings the web player uses. HDR, Dolby Vision,
playback speed, and the sync offsets appear only for devices running the Silo
apps.

In the mobile and TV apps, most settings on the **Playback** page apply to
that device only. **Skip Back** and **Skip Forward** follow your profile to
every device. To go back to your profile's value for a setting your profile
also has, choose **Use Profile Setting** at the top of its list (**Use profile
setting** on Android). On Android, a switch for one of these settings shows a
**Use Profile Setting** row under it once the device has its own value. **Use
Profile Settings** at the bottom of the page removes every change on the
device.

A setting changed on a device wins over your profile's value on that device,
except **Show title art** while **Apply to all devices** is on. If a single
title plays differently from others, look at the audio and subtitle tracks
chosen for it during playback before you change the whole profile.

To tell apart devices that show the same name, such as two TVs that both say
"Apple TV", choose one, select **Rename**, type a name such as "Living Room",
and select **Save**. The device keeps that name when it's used again, and its
heading shows "Reports itself as Apple TV" under the new name. To go back to
the reported name, select **Rename**, clear the name, and select **Save**.
Names belong to your profile, so a TV that two profiles use can have a
different name in each.

**Forget** removes a device's saved settings and its name, and hides it until
it's used again. It doesn't sign the device out; for a lost device, see
[Accounts and signed-in devices](/docs/accounts).
