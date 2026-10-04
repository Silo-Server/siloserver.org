---
slug: docs/playback-problems
title: Fix playback problems
description: Narrow down a title that won't play, or picture, sound, or subtitle problems on a TV or receiver.
---

Test one title at a time and change one setting at a time. That makes it
clear which change fixed the problem, or which details to report.

## A title won't start or keeps stopping

1. Try another title. If every title fails, the problem is likely the
   connection or the server rather than the file.
2. If the title has more than one version, try another
   [version](/docs/watch-movies-and-series#choose-a-version-before-playback).
3. Try the same title in another Silo app, such as the web app.
4. Choose a lower **Quality** if playback buffers on a slow connection.

If the web player says `This file can't be played`, the file itself is empty,
corrupt, or cut short, and trying again won't help. On a series page, the web
app marks an episode like this **Damaged file**. Replace the file, then
[scan the library](/docs/manage-libraries#scan-or-refresh). If someone else runs
the server, tell them which title it is.

If you run the server, check [active playback](/docs/active-playback) to see
whether the stream is being converted, and [server health](/docs/server-health)
for errors at that time. Silo doesn't mark a file damaged when it can't open
the file because of its permissions or its storage, such as a network mount
that dropped. To find those files, filter **Admin > Logs** by the `scanner`
component. Otherwise, share the details below with the person who runs it.

## Picture problems on a TV

Check the selected version before you press **Play**, and try another if one
fails. Note whether the picture is missing, has the wrong colors, or stutters.

HDR and Dolby Vision depend on the whole chain: the file, the app, the TV, and
anything in between, such as a receiver. Check what the TV reports it is
receiving rather than the label on the file.

## Sound problems on a TV or receiver

Open the audio options during playback and try another track. Check that the
TV or receiver is set to the input and sound output you expect. For Dolby Atmos,
check what the receiver displays; a track labeled Atmos may still play as
ordinary surround if part of the chain doesn't support it.

## Subtitle problems

Choose another subtitle track in the player. Text subtitles and image subtitles
behave differently, so note the track's format and language. To add a track
that's missing, see [Find or add missing subtitles](/docs/missing-subtitles).

## What to include in a report

- The title and the version you chose.
- The app, app version, and device model, and the server version.
- The audio and subtitle tracks you chose, and the quality setting.
- What happened and when: no picture, no sound, wrong colors, stutter, or an
  error message.
- For a TV setup: the TV and receiver models and how they are connected.

[Report the problem](/docs/report-a-problem) with those details. Don't attach
the media file.
