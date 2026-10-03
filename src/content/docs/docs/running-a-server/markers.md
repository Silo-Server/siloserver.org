---
slug: docs/markers
title: Find and correct skip markers
description: Configure marker detection and fix incorrect intro, recap, credits, or preview times.
---

Markers tell the player where an intro, recap, credits, or preview starts and ends, so it can offer a skip button. Markers work without setup. Silo installs the TheIntroDB plugin when it starts (if it can reach the plugin catalog), looks markers up there, and detects intros and credits on the server when no online marker of that kind exists.

## Choose how markers are found

1. Open **Admin > Settings > Library & Metadata** and find **Skip markers**.
2. Set **Marker source**:
   - **Online preferred + server detection** (the default) uses online markers and detects an intro or credits locally only when no online one is saved.
   - **Online providers only** or **Detect on this server** uses one method.
   - **Off** stops finding markers.
3. With local detection on, choose what it finds with **Detect intros** and **Detect credits**. Both are on by default. Credits detection uses more CPU than intro detection. Turning one off keeps the markers it already found.
4. With online markers on, choose whether to **Save online markers** with **Save to library** (the default) or **Fetch when needed**.
5. Leave **Find markers on playback** on to look for missing markers when someone starts playing an item. With local detection, this uses server CPU.
6. Save, then use **Run now** on the marker tasks below the settings, such as **Sync online markers**, to process existing media.

## How local detection works

Silo first looks for a chapter in the file named for the intro or credits, such as `Opening` or `End Credits`, and uses it when it finds one. Otherwise:

- An episode's intro comes from the opening audio its season shares.
- An episode's credits come from the ending audio its season shares and from credit text on a black or plain background, so an episode with no others in its season can still get credits.
- A movie gets credits only, from the picture near the end. This is best effort: some movies get no credits marker, or one that starts late.

Finding credits means reading the picture near the end of each video, which is a heavy task for the CPU. With [**Hardware acceleration**](/docs/playback#choose-and-test-acceleration) set up, Silo can do that work on the GPU instead.

**Detection workers** sets how many seasons or movies are analyzed at once. It defaults to 1; raise it to finish a large library sooner if your storage and CPU have room.

To skip detection for one library, turn off its switch in the library's **Advanced** settings: **Detect intro and credits markers** for series and mixed libraries, or **Detect credits markers (best effort)** for movie libraries. Movie libraries you add start with it off.

## Manage marker providers

1. Choose **Marker providers** next to **Skip markers**. It opens **Subtitles & Metadata**.
2. Choose **Manage** on a provider.
3. Use **Get markers from this provider** to turn lookups on or off.
4. If several providers are on, set **Provider priority**. A lower number wins when two providers return a marker for the same section.
5. Choose **Save**, then **Test connection**.

Providers come from plugins. To share your server's detected intros with a provider, turn on **Allow sharing with this provider**; it is off by default. TheIntroDB looks up markers without an account, but sharing needs an API key, which you add on the plugin's page.

## Detect markers again for one item

In the web app, an administrator can run local detection again for a single episode or movie, for example after replacing the file.

1. Open the episode or movie's detail menu.
2. For an episode, choose **Re-detect Markers**, then **Intro**, **Credits**, or **Intro and credits**. A kind turned off in marker settings can't be chosen.
3. For a movie, choose **Re-detect Credits**.

Silo shows **Re-detection started** and analyzes the item in the background. Manual markers and online markers stay as they are.

## Correct a marker

In the web app, an administrator or a user with **Marker Editing** permission can edit markers for media they can access.

1. Open the movie or episode's detail menu and choose **Edit Markers**.
2. Enter start and end times for the segment, for example `1:30` and `2:45`. The end must be after the start.
3. Choose **Save**.
4. Play that section of the same file and check where the skip button lands.

Use the clear button beside a segment to remove its marker. **Recent changes** in the same dialog shows who changed what. A manual edit changes the marker for everyone.

A manual marker takes priority over online and detected markers, so later lookups and detection don't replace it. Only another manual edit does.

Chapter images are configured separately in [playback settings](/docs/playback).
