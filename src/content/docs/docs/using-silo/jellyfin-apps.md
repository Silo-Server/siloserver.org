---
slug: docs/jellyfin-apps
title: Connect a Jellyfin-compatible app
description: Enter your Silo account and profile in a Jellyfin-compatible app.
---

Some apps made for Jellyfin can connect to Silo. You need:

- The server's Jellyfin-compatible address. Ask the person who runs your
  server; it's often different from Silo's web address. If you run the
  server, see [third-party access](/docs/third-party-access).
- Your Silo username and password.
- The name of the profile you want to use, and its PIN if it has one.

The app must let you type a username and password.

## Add the server

Enter the Jellyfin-compatible address in the app's server field. On a phone,
tablet, or TV, `localhost` only works if the server runs on that same device.

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

### Switch profiles

Sign out of the app, then sign in with the other profile's name and PIN.
Progress and favorites belong to the profile you signed in with.

### If you don't use a Silo password

These apps need a username and password, so they work only on some servers
that use [single sign-on](/docs/single-sign-on):

- If you sign in to Silo with a username and password, use those, with `#`
  and the profile name after the username as usual. Profiles with a PIN can't
  be used this way; pick one without a PIN.
- If you sign in with a **Sign in with** button, your account has no
  password these apps can use.

## If sign-in fails

If the app says your username or password is wrong, check the server
address, your Silo username and password, the profile name, and the PIN.
Try signing in to Silo's web app with the same username and password. If
that works, the problem is in the Jellyfin-compatible sign-in; share the
error with the person who runs your server.

If the app reports that local password sign-in is turned off on this server,
your Silo password no longer works there. See
[If you don't use a Silo password](#if-you-dont-use-a-silo-password).

## What works

Jellyfin-compatible apps are for movies and series. An app may use features
Silo doesn't provide. When reporting a problem, include the app's name and
version, what you were doing, and whether it works in Silo's web app. Leave
out passwords and PINs.
