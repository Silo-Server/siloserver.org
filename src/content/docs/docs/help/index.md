---
slug: docs/help
title: Find help
description: Check common connection, sign-in, library, and playback problems.
---

Start with the problem you can see. If someone else runs your server, ask
them before changing server settings or removing a saved connection.

## Cannot connect or sign in

1. Open the server address in a browser on the same device. If it doesn't
   load, ask the administrator for the correct address.
2. Use the Silo address in a Silo app. [Jellyfin apps](/docs/jellyfin-apps)
   and [Audiobookshelf apps (Beta)](/docs/audiobookshelf) connect to their
   own addresses.
3. If the server opens but sign-in fails, check the account name and
   password. The account password is different from a profile PIN. For a
   forgotten password, ask the administrator.

Follow [Join a server](/docs/connect-and-watch) for the full sign-in
steps. If access works at home but fails elsewhere, the administrator needs
to check [remote access](/docs/reverse-proxy).

## A TV does not appear on your phone or tablet

Keep both apps open on the same local network, and allow local-network
access for Silo on the phone or tablet. A guest Wi-Fi network can keep
devices apart even when its name looks like your main network.

To sign in a new TV, see [TV setup](/docs/tv-sign-in). To control a TV
that's already signed in, see [the TV remote guide](/docs/tv-remote).

## A title or library is missing

Make sure you're on the right server and profile, then search for the title
with no filters. If someone else can see it, ask the administrator to look
at [your access](/docs/manage-access).

Administrators can start with [library scans and paths](/docs/manage-libraries).
A scan can't add a file the server can't read.

## Playback will not start or keeps stopping

Try another title, and try the same title in another Silo app. That tells
you whether one file, one app, or the connection is the problem.
[Fix playback problems](/docs/playback-problems) covers the next steps,
including picture, sound, and subtitle problems on a TV.

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
the result. If a step in a guide is wrong, [suggest a correction](/docs/improve-the-docs).
