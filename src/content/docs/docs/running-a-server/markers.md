---
slug: docs/markers
title: Find and correct intro markers
description: Configure marker detection and fix incorrect intro, recap, credits, or preview times.
---

Markers tell the player where an intro, recap, credits, or preview starts and ends, so it can offer a skip button. Markers work without setup. Silo installs the TheIntroDB plugin when it starts (if it can reach the plugin catalog), looks markers up there, and detects intros on the server when no online intro exists.

## Choose how markers are found

1. Open **Admin > Settings > Library & Metadata** and find **Skip markers**.
2. Set **Marker source**:
   - **Online preferred + server detection** (the default) uses online markers and detects intros locally only when no online intro is saved.
   - **Online providers only** or **Detect on this server** uses one method.
   - **Off** stops finding markers.
3. With online markers on, choose whether to **Save online markers** with **Save to library** (the default) or **Fetch when needed**.
4. Leave **Find markers on playback** on to look for missing markers when someone starts playing an item. With local detection, this uses server CPU.
5. Save, then use **Run now** on the marker tasks below the settings, such as **Sync online markers**, to process existing media.

Local detection reads each season's audio. **Detection workers** sets how many seasons are analyzed at once. To skip detection for one library, turn off **Detect intro markers** in that library's **Advanced** settings.

## Manage marker providers

1. Choose **Marker providers** next to **Skip markers**. It opens **Subtitles & Metadata**.
2. Choose **Manage** on a provider.
3. Use **Get markers from this provider** to turn lookups on or off.
4. If several providers are on, set **Provider priority**. A lower number wins when two providers return a marker for the same section.
5. Choose **Save**, then **Test connection**.

Providers come from plugins. To share your server's detected intros with a provider, turn on **Allow sharing with this provider**; it is off by default. TheIntroDB looks up markers without an account, but sharing needs an API key, which you add on the plugin's page.

## Correct a marker

In the web app, an administrator or a user with **Marker Editing** permission can edit markers for media they can access.

1. Open the movie or episode's detail menu and choose **Edit Markers**.
2. Enter start and end times for the segment, for example `1:30` and `2:45`. The end must be after the start.
3. Choose **Save**.
4. Play that section of the same file and check where the skip button lands.

Use the clear button beside a segment to remove its marker. **Recent changes** in the same dialog shows who changed what. A manual edit changes the marker for everyone.

A manual marker takes priority over online and detected markers, so later lookups and detection don't replace it. Only another manual edit does.

Chapter images are configured separately in [playback settings](/docs/playback).
