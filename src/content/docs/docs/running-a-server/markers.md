---
slug: docs/markers
title: Find and correct intro markers
description: Configure marker detection and fix incorrect intro, recap, credits, or preview times.
---

Markers tell the player where a segment starts and ends. A wrong marker can make a skip button jump past content, so test a correction on the same media version the viewer used.

## Set up detection

1. Open **Admin > Settings > Library & Metadata**.
2. Under **Intro and credits markers**, set **Find intros and credits**. Choose local detection, online lookup, or both.
3. For online lookup, follow **Marker providers** to **Subtitles & Metadata**. Open the provider and turn on **Use for online marker lookup**.
4. Review **Lookup order** and contribution settings, then save. Restart only if the settings page requests it.
5. Run the relevant marker task from the marker settings and check a known episode before processing more media.

Local detection uses server CPU. **Fetch markers on playback** looks for missing markers when playback starts and can delay the start of a session.

Marker providers can come from plugins. Installing a provider and allowing it to contribute your markers are separate decisions. Leave contribution off if you do not want to send those records to the provider.

## Correct a marker

In the web app, an administrator or a user with **Marker Editing** permission can edit markers for accessible media.

1. Open the movie or episode's detail menu and choose **Edit markers**.
2. Enter start and end times for the affected segment, for example `1:30` and `2:45`.
3. Choose **Save**. The end must be after the start.
4. Play that section of the same file and check where the skip action lands.

Use the clear action for a segment that should not have a marker. Review the edit history when a value changes unexpectedly. Manual marker edits are shared media changes, not a preference for one viewer.

A saved manual marker takes priority over online and locally detected markers. Another manual edit can replace it, so check the history before overwriting someone else's correction.

Chapter images are configured separately in [playback settings](/docs/playback).
