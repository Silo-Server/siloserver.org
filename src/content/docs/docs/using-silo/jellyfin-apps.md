---
slug: docs/jellyfin-apps
title: Connect a Jellyfin-compatible app
description: Sign in to a Jellyfin-compatible app with Quick Connect or your Silo account and profile.
---

Some apps made for Jellyfin can connect to Silo. You need the server's
Jellyfin-compatible address. Ask the person who runs your server; it's often
different from Silo's web address. If you run the server, see
[third-party access](/docs/third-party-access).

To sign in, use [Quick Connect](#sign-in-with-quick-connect) if the app offers
it: you approve the app from a browser where you're signed in to Silo, so
you don't type a password on the TV. Otherwise you need your Silo username
and password, the name of the profile you want to use, and its PIN if it has
one.

## Add the server

Enter the Jellyfin-compatible address in the app's server field. On a phone,
tablet, or TV, `localhost` only works if the server runs on that same device.

## Sign in with Quick Connect

1. On the app's sign-in screen, choose Quick Connect. The app shows a
   six-digit code.
2. On a phone or computer, open the server's `/activate` page in a browser,
   for example `https://silo.example.com/activate`. Use Silo's web address,
   not the Jellyfin-compatible one.
3. Type the code and select **Continue**. If you aren't signed in, select
   **Sign in to approve** and sign in with your password or the
   **Sign in with** button.
4. Check that the page names the app and shows the same code. Choose the
   profile the app should use. If the page asks for the profile's PIN, enter it.
5. Select **Sign in**. The app finishes signing in on its own within a few
   seconds.

The code lasts 15 minutes. If it expires, start Quick Connect again in the
app. Only approve a code from an app in front of you. If you try too many
codes in a short time, the page asks you to wait before trying again.

If you're already signed in to a Jellyfin-compatible app, you can approve
the code there instead: open Quick Connect in that app's settings or user
menu, enter the code, and confirm. The new device uses the same profile as
the app you approve it from.

## Sign in with your profile

1. In **Username**, enter your Silo username, then `#`, then the profile
   name. For example, `sam#Alex`.
2. In **Password**, enter your Silo password. If the profile has a PIN, add
   `#` and the PIN after it.
3. Sign in and open a title you know to make sure you're seeing your
   profile's libraries and progress.

The profile name isn't case-sensitive. These combined values only work in
Jellyfin-compatible apps; sign in to Silo's own apps as usual.

If your password contains `#`, type it in full as usual. A profile name that
contains `#` won't work in this format, so ask the account holder to rename
the profile.

### Sign in without a profile name

If you enter only your username, Silo picks a profile this way:

1. A profile with the same name as your username. If it has a PIN, add `#`
   and the PIN to your password.
2. Otherwise, the profile without a PIN, when exactly one profile has none.

If neither applies, sign-in fails. Add `#` and the profile name to your
username.

## Switch profiles

Sign out of the app, then sign in again with Quick Connect and choose the
other profile, or with the other profile's name and PIN. Progress and
favorites belong to the profile you signed in with.

## If you don't use a Silo password

Use [Quick Connect](#sign-in-with-quick-connect). It works however you sign
in to Silo.

Without Quick Connect, these apps need a username and password, so they work
only on some servers that use [single sign-on](/docs/single-sign-on):

- If you sign in to Silo with a username and password, use those, with `#`
  and the profile name after the username as usual. Profiles with a PIN can't
  be used this way; pick one without a PIN.
- If you sign in with a **Sign in with** button, your account has no
  password these apps can use.

## If sign-in fails

If the app stops waiting during Quick Connect, the code expired or was
declined. Start Quick Connect again in the app.

If the app says your username or password is wrong, check the server
address, your Silo username and password, the profile name, and the PIN.
Try signing in to Silo's web app with the same username and password. If
that works, the problem is in the Jellyfin-compatible sign-in; share the
error with the person who runs your server.

Silo limits repeated sign-in attempts. If the app says there were too many
requests, wait and sign in again. After 10 failed sign-ins with the same
username within 15 minutes, Silo locks the username for 15 minutes in every
app, and even the right password fails until then. See
[After too many failed sign-ins](/docs/accounts#after-too-many-failed-sign-ins).
A password with `#` in it, such as one with a PIN added, counts as two tries.

If the app reports that local password sign-in is turned off on this server,
your Silo password no longer works there. See
[If you don't use a Silo password](#if-you-dont-use-a-silo-password).

## What works

Jellyfin-compatible apps browse and play your movie and TV libraries. Your
profile sees the same libraries and titles as in Silo's own apps, within the
same rating limits. Progress, watched status, and favorites are shared with
those apps, so you can stop a movie in one and resume it in another. The app
plays the file as it is when the device can, and Silo converts it when the
device can't.

Silo has been checked with the Jellyfin web player on the server, Findroid on
Android, and Jellyfin for Android TV. Other apps may work too, but some rely
on features Silo doesn't provide.

These aren't available in Jellyfin-compatible apps:

- Music, podcasts, audiobooks, ebooks, and comics. For audiobooks, use an
  [Audiobookshelf-compatible app](/docs/audiobookshelf).
- Playlists, SyncPlay for watching together, the list of devices, and
  controlling one app from another.
- Deleting titles. Silo doesn't delete or change your media files.
- Live TV, DVR recordings, and `.strm` files. Silo doesn't support them in
  any app.

Some things work differently from a Jellyfin server:

- The app can't find Silo on your network by itself. Enter the
  Jellyfin-compatible address yourself, as in [Add the server](#add-the-server).
- The sign-in screen doesn't list any users. Choose to sign in manually, or
  use Quick Connect.
- Subtitles that are pictures, such as PGS and VobSub tracks from Blu-ray
  and DVD rips, are drawn into the video when you turn them on, so Silo
  converts the video instead of playing the file as it is.
- Posters and backdrops load without signing in, as on a Jellyfin server.
  Anyone who has a title's ID can view its artwork, including titles your
  profile can't see. Titles, details, video, and subtitles still need a
  sign-in and follow your profile's limits.

When reporting a problem, include the app's name and
version, what you were doing, and whether it works in Silo's web app. Leave
out passwords and PINs.
