---
slug: docs/help
title: Find help
description: Check common connection, sign-in, library, and playback problems.
---

Start with the problem you can see. If someone else runs your server, ask
them before changing server settings or removing a saved connection.

## Cannot connect or sign in

1. Open the server address in a browser on the same device, where possible.
   If it does not load, check the address with the administrator. A working
   internet connection does not mean the server is reachable.
2. Confirm you are using the Silo address for a Silo app. Jellyfin and
   Audiobookshelf apps need their own connection addresses: [Jellyfin](/docs/third-party-access) or [Audiobookshelf (Beta)](/docs/audiobookshelf).
3. If the server opens but sign-in fails, check the account name and password.
   An account password and a profile PIN are different. Ask the administrator
   for help with a forgotten password; do not share it in a bug report.

Follow [Join a server](/docs/connect-and-watch) for the full sign-in
steps. If access works at home but fails elsewhere, the administrator needs
to check [remote access](/docs/reverse-proxy).

## A TV does not appear on your phone

Keep both apps open on the same local network. Check local-network permission
on the phone or tablet. Guest Wi-Fi can keep devices apart even when the
network names look similar.

For a TV awaiting its first sign-in, use [TV setup](/docs/tv-sign-in).
For a TV already signed in, use [the TV remote guide](/docs/tv-remote).
The two tasks use different screens.

## A title or library is missing

Check that you selected the right server and profile. Search for the title
without filters. If someone else can see it, ask the administrator to check
[your access](/docs/manage-access).

Administrators should check [library scans and paths](/docs/manage-libraries)
before changing metadata. A scan that cannot read a file cannot add it.

## Playback will not start or keeps stopping

Try one other title and note whether the problem affects every title or just
one file. Check whether the same title plays in another Silo app. Keep the
time of the failure and the chosen audio, subtitle, and quality settings.

Use the [playback guide](/docs/watch-movies-and-series) to check
those choices. The administrator can inspect
[active playback](/docs/active-playback) and
[server health](/docs/server-health). Avoid repeatedly
changing several settings at once; it makes the failing condition harder to find.

## Other problems

| Problem | Guide |
| --- | --- |
| Wrong or missing subtitles | [Choose subtitles](/docs/subtitles) or [find a missing track](/docs/missing-subtitles) |
| An offline item will not play | [Downloads](/docs/downloads) |
| Progress or watched status looks wrong | [Watch history and resume](/docs/watch-history) |
| A setting changes on another device | [Profile preferences and device overrides](/docs/preferences) |
| Notifications do not arrive | [Notifications](/docs/notification-inbox) |
| A library does not notice new files | [Autoscan](/docs/autoscan) |
| The server fails to start | [Server health](/docs/server-health) and [startup logs](/docs/report-a-problem#logs) |

## If the guide does not solve it

[Report the problem](/docs/report-a-problem) with the steps you took and
the result. If a step in the guide is wrong, [suggest a correction](/docs/improve-the-docs).
