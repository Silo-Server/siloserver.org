---
slug: docs/active-playback
keywords: ["who is watching", "now playing", "kick someone off", "stop someone's stream", "end a stream", "dashboard"]
questions: ["How can I see what people are watching right now?", "How do I stop a stream someone else is playing?", "Can I send a message to someone's screen?", "How do I tell if a stream is transcoding?"]
title: Monitor and control active playback
description: Inspect a stream, send a supported playback command, or end a session.
---

Open **Admin > Insights** in the web app. It opens on the **Activity** tab, which lists current playback with the user, media, client, and serving node. Filter it to the person or device you are helping.

Choose **Cards** or **Table** at the top of the tab to change how streams are shown. The web app remembers your choice in that browser. Until you choose, the tab opens as cards when eight or fewer streams are playing, and as a table when more are.

## Inspect a stream

1. Find the session and open its details. In **Cards**, click the card to open them in a side panel. In **Table**, click the row to expand it.
2. Compare the source and delivered video, audio, and container information.
3. Check whether playback is direct or being transcoded. For buffering during conversion, continue with [playback configuration](/docs/playback).

When reporting a problem, note the app and device as well as the title: two devices can play the same file in different ways.

## Send a command

Open the session's action menu. **Pause**, **Resume**, and **Message…** appear only while the player is connected to the server for remote control. The session's details show this under **Remote control**. **Stop** and **Terminate** are always in the menu.

**Message…** sends plain text, with no title, to the viewer's screen. It shows for a few seconds, so keep it short.

**Stop** ends the current playback. **Terminate** also revokes that playback session and tries to stop the player. A disconnected player may stop only when it next contacts the server.

**Pause**, **Resume**, and **Stop** wait a few seconds for the player to confirm. If it doesn't, Silo ends the session. A message never ends the session; if the player doesn't confirm it, Silo tells you. That makes a message the safe way to check whether a player is reachable.

To find out whether a command worked, watch the session or ask the viewer. A pause or resume shows on the session within a second or so. The playback position moves only when the player reports its progress, about every 10 seconds.

These actions don't sign the account out. See [account management](/docs/manage-accounts) to change access.
