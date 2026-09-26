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

Record the app and device as well as the media title when reporting a problem. Two devices can take different playback paths for the same file.

## Send a command

Open the session's action menu. **Pause**, **Resume**, and **Message…** are available when the client supports live control. A successful command response is not proof that the person saw it; check the displayed state or ask them.

**Stop** ends the current playback. **Terminate** revokes that playback session's authority and attempts to stop the player. Read the result: a disconnected player may stop only when it next contacts the server.

If a command cannot reach the client, Silo may end the session instead. Do not repeatedly send pause or resume as a connection test.

These actions affect playback, not the account's saved login. See [account management](/docs/manage-accounts) for access changes.
