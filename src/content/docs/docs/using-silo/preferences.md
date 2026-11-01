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
came from. **Search settings** finds a setting by its name. On a phone or a
narrow window, Settings opens as a list of pages. Choose a page:

- **Playback:** quality, skipping, and what plays next.
- **Language & Subtitles:** spoken and metadata languages, when subtitles
  appear, and how they look.
- **Home Screen:** which rows appear on Home and in what order.
- **Title Pages:** title art, theme music, spoilers, and advisory ages on
  movie and show pages.
- **Navigation & Cards** and **Accessibility:** how the web app looks. These
  don't change the native apps.

**Metadata language** sets the language for titles and descriptions where
Silo has them. It doesn't change a movie's spoken audio; use
**Spoken language** for that.

## Set playback quality

**Resolution** and **Maximum bitrate** set the quality Silo plays at:

- **Resolution** sets the largest picture size. With **Auto**, the default,
  Silo plays the original file whenever your device can play it and your
  connection is fast enough, and converts it only when it can't. A size such
  as **1080p** plays files up to 1080p as they are, however fast your
  connection is, and converts larger files down to 1080p.
- **Maximum bitrate** caps how much data playback uses, from 200 Mbps down
  to 1.5 Mbps. Silo converts a file above it to fit. The default is
  **No limit**.

In the web app, they're under **Quality** in **Settings > Playback**, where
**Resolution** is called **Preferred quality**. On iPhone, iPad, Apple TV,
and Mac, open **Settings > Playback** and look under **Quality**. On Android
phones, tablets, and TVs, look under **Streaming** in **Settings > Playback**.

Choosing a quality in the player doesn't change these settings. See
[Controls while you watch](/docs/watch-movies-and-series#controls-while-you-watch).

### Quality on mobile data

On iPhone, iPad, and Android phones and tablets, **Cellular Quality** in
**Settings > Playback** replaces both settings while you're on mobile data or
a network the device treats as metered, such as a phone hotspot, Low Data
Mode on iPhone, or a Wi-Fi network marked as metered on Android. It's one
list, from **Auto** to **480p**. The default, **720p**, plays up to 720p at
2 Mbps. If your connection changes during playback, the app switches to the
other setting.

The web app does the same when the browser reports a cellular connection or
has Data Saver on. To change it for one browser, open that browser in
**Settings > Your Devices** and set **Cellular quality** and **Cellular
maximum bitrate** under **Picture**.

### Lower quality when buffering

**Lower quality when buffering** sits with **Resolution** and **Maximum
bitrate**. It decides what Silo does on **Auto** when playback keeps
stopping to buffer:

- **Automatically**, the default, lowers the quality at once and offers
  **Restore quality**.
- **Ask first** asks before lowering.
- **Never** leaves the quality as it is.

Silo always asks before lowering a quality you picked in the player. See
[If playback keeps buffering](/docs/watch-movies-and-series#if-playback-keeps-buffering)
for what appears while you watch.

Once Silo lowers the quality, it plays **Auto** under that lower speed on
this device and network for 24 hours after playback last buffered. A line
such as "Limited to 12 Mbps after buffering on Oct 17" then appears under
the setting. Select **Reset** to clear the limit; your measured connection
speed stays. **Restore quality** in the player and a **Test speed** result
faster than the limit also clear it. With **Never**, Silo ignores the limit
and hides the line. **Maximum bitrate** still applies on top of the limit.

### Test your connection speed

The **Connection** group in **Settings > Playback** shows **Connection
speed**, the latest speed measured for this device on this network. A line
under it, such as "Auto plays videos up to 35 Mbps without converting them",
gives the highest bitrate **Auto** plays as it is at that speed.

Select **Test speed** to measure again. The test takes up to 10 seconds, and
nothing can be playing while it runs. If the server is busy with other tests,
Silo says how long to wait. The apps also run a short test on their own when
the server has no recent speed for the device and network. A speed that
starts with "Faster than" is the least the connection has managed, from a
short test or from playback, rather than a full measurement.

Speed tests don't run on mobile data or a metered network. There the group
says that tests are skipped, and **Test speed** is hidden.

## Change one device

1. Open **Settings > Your Devices** and choose the device. The one you're
   using says **This device**.
2. Change any setting it lists, such as quality, subtitle language, playing
   the next episode, HDR, or the audio sync offset. Each setting says where its value comes
   from: **Changed here**, **From your profile**, or **App default**.
   **Show title art** says **Server default** instead of **App default**,
   because your server's administrator can change its default. A
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
except **Show title art** while **Apply to all devices** is on. In the web
app, **Use server default** appears under **Show title art** on **Settings >
Title Pages** once you've chosen your own setting. It returns this browser to
your server's default; other devices keep their own choice. If a single
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
