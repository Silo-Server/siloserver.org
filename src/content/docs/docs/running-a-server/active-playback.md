---
slug: docs/active-playback
keywords: ["who is watching", "now playing", "kick someone off", "stop someone's stream", "end a stream", "live sessions"]
questions: ["How can I see what people are watching right now?", "How do I stop a stream someone else is playing?", "Can I send a message to someone's screen?", "How do I tell if a stream is transcoding?"]
title: Monitor and control active playback
description: Inspect a stream, send a supported playback command, or end a session.
---

Open **Admin > Insights** in the web app. It opens on the **Activity** tab, which lists current playback with the user, media, client, and serving node. Filter it to the person or device you are helping.

Choose **Cards** or **Table** at the top of the tab to change how streams are shown. The web app remembers your choice in that browser. Until you choose, the tab opens as cards when eight or fewer streams are playing, and as a table when more are.

## Inspect a stream

1. Open the session's details with the arrow on its card or row. In **Cards**, the details open in a side panel. In **Table**, the row expands.
2. Compare the source and delivered video, audio, and container information.
3. Check whether playback is direct or being transcoded. For buffering during conversion, continue with [playback configuration](/docs/playback).

When reporting a problem, note the app and device as well as the title: two devices can play the same file in different ways.

## Send a command

Open the **⋯** menu on the session's card or row. **Stop** and **Terminate** are always there. When **Remote control** in the session's details shows **Available**, the menu also has **Message…** and either **Pause** or **Resume**, depending on whether the stream is playing.

If the player doesn't respond to **Pause**, **Resume**, or **Stop** within a few seconds, Silo ends the session. Don't use them to test whether a player is reachable.

A message never ends the session, so send one to check instead. Choose **Message…**, type a short message, and select **Send Message**. It shows on the viewer's screen for a few seconds. If the player doesn't confirm it, the web app warns that it may show up late or not at all.

**Stop** ends the current playback. **Terminate** also revokes that playback session and tries to stop the player. A disconnected player may stop only when it next contacts the server.

To find out whether a command worked, watch the session or ask the viewer. A pause or resume shows on the session right away. The playback position moves only when the player reports its progress, about every 10 seconds.

These actions don't sign the account out. See [account management](/docs/manage-accounts) to change access.
