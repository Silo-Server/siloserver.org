---
slug: docs/active-playback
title: Monitor and control active playback
description: Inspect a stream, send a supported playback command, or end a session.
---

Open **Admin > Activity** in the web app to see current playback. The list identifies the user, media, client, and serving node. Filter it to the person or device you are helping.

## Inspect a stream

1. Find the session and expand its details.
2. Compare the source and delivered video, audio, and container information.
3. Check whether playback is direct or being transcoded. For buffering during conversion, continue with [playback configuration](/docs/playback).

When reporting a problem, note the app and device as well as the title: two devices can play the same file in different ways.

## Send a command

Open the session's action menu. **Pause**, **Resume**, and **Message…** appear when the app supports live control. To find out whether a command worked, watch the session's state or ask the viewer.

**Stop** ends the current playback. **Terminate** also revokes that playback session and tries to stop the player. A disconnected player may stop only when it next contacts the server.

If a command can't reach the player, Silo ends the session shortly afterward, so don't send pause or resume to test the connection.

These actions don't sign the account out. See [account management](/docs/manage-accounts) to change access.
