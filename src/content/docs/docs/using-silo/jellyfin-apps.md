---
slug: docs/jellyfin-apps
title: Connect a Jellyfin-compatible app
description: Enter your Silo account and profile in a Jellyfin-compatible app.
---

Ask your administrator for the Jellyfin-compatible server address, your
Silo account credentials, and the profile name and PIN you should use.
The app must support manual username and password entry.

## Endpoint

Enter the compatibility address in the app's server field. It may differ
from Silo's web address. Do not enter `localhost` on a phone or TV unless
the server really runs on that device.

## Signing in

### The two boxes

1. In **Username**, enter your account username followed by `#` and the
   profile name, for example `sam#Alex`.
2. In **Password**, enter the account password followed by `#` and the
   profile's four-digit PIN when it has one.
3. Sign in and open a known title to check that you see the right library
   access and progress.

Do not add spaces around `#`. Profile-name matching is case-insensitive.
These combined values are for the compatibility app, not native Silo sign-in.

### If your profile has no PIN

Enter only the account password in the password field. Keep the
`username#profile` format in the username field.

### If you would rather not type the profile name

An omitted profile name works only when Silo can resolve a default profile.
Using the explicit `username#profile` form avoids that ambiguity.

### If it says your username or password is wrong

Check the compatibility address, account credentials, exact profile name,
and PIN. Try the account in Silo's web app to separate an account problem
from a compatibility problem. Ask the administrator for help if it still fails.

### Two smaller details

A password containing `#` is still entered in full before appending the PIN.
A profile name containing `#` cannot be expressed unambiguously in this format;
ask the account holder to change that name.

### Switching to another profile

Sign out of the compatibility app, then sign in using the other profile's
name and PIN. The selected profile owns the resulting progress and favorites.

## Reverse Proxy

Use the HTTPS address supplied by your administrator. Server setup belongs
in [third-party access](/docs/third-party-access).

## Scope

Silo's Jellyfin-compatible endpoint serves the movie and series workflow.
An app may use unsupported Jellyfin behavior. Report its name and version,
the failing action, and whether that action works in Silo's web app. Keep
passwords, PINs, and tokens out of the report.

## Source notes

This syntax follows Silo's compatibility login resolver. It does not imply
that every Jellyfin app or all of its features have passed release testing.
