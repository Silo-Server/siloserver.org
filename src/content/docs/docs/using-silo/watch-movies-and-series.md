---
slug: docs/watch-movies-and-series
title: Watch movies and series
description: Start or resume playback, choose tracks, and move through an episode.
---

Open a movie or episode and choose **Play**. If you already started it,
choose **Resume** to use your profile's saved position. Check that the
correct profile is active before watching on a shared device.

## Before you play

Check the audio and subtitle choices before playback. If the title has multiple files, you can
[choose a version](#choose-a-version-before-playback) before starting.
Extras and
trailers are separate items; selecting one does not resume the main movie.

## Choose a version before playback

A version is a source file for a title, for example a second encode or a
different cut of a movie. The server must already have associated those
files with the same title. These controls do not add files or create editions.

1. Open the movie or episode you want to play. On a series page, check
   which episode the main play button will start.
2. Open **Version** on web, iPhone, iPad, or Android, or **Versions** on
   Apple TV. In the shared Apple detail screen, choose **Edition** first
   if it is offered and you want a different cut.
3. Select the file you want, check its available tracks, then choose
   **Play** or **Resume**.

On Apple clients, **Auto** clears the manual file choice. If a selected file
has disappeared, playback can fall back to automatic selection. If the
version control is absent or inactive, there may be only one available file.
An Edition selector needs more than one edition group; several encodes of
the same cut can still belong to one edition.

Changing the source file can change available audio tracks, subtitles,
duration, and the meaning of a saved position. Check where playback resumes
after switching cuts. Audio-language and streaming-quality controls are described below.

| Client | Version controls |
| --- | --- |
| Web | **Version** on the title detail page when multiple files exist |
| iPhone and iPad | **Version** picker; **Edition** picker when multiple editions exist |
| Apple TV | **Versions** menu on the title or selected episode |
| Android phone, tablet, and TV | Version selection on detail and in the player |
| Native macOS | Version and edition pickers on the detail page |

## In the web player

Move the pointer or tap the picture to show controls. You can pause, seek,
change audio, or open [subtitles](/docs/subtitles). On a narrow
screen, open **More player options** for controls including **Audio tracks**
and **Chapters**.

Use **Quality** to choose from the options the player offers. A smaller
stream can help a slow connection, but may require the server to convert
the video. If conversion fails or reaches a limit, check the server's
[transcoding settings](/docs/playback).

## In a phone or tablet app

On iPhone, iPad, and Android, tap the picture to show playback controls.
Open **Audio & Subtitles** on Apple or **Audio and subtitles** on Android
to choose tracks. **Quality** changes the stream, and **Chapters** jumps
to a chapter when the file has them.

| Client | Controls on a narrow screen |
| --- | --- |
| iPhone and iPad | The action row uses shorter labels or icons. **Chapters** appears when the file has chapters; the ellipsis opens **Playback Settings**. |
| Android phone and tablet | Open **More playback controls** (the ellipsis) for **Chapters**, **Audio and subtitles**, **Quality**, and playback settings when the toolbar cannot fit them. **Chapters** appears when the file has chapters. |

Choose a track or option, then return to the picture to check the result.
A track must exist for the chosen file version.

## On a TV

On Apple TV and Android TV, use the remote to show the playback controls
and open the options panel. On Apple TV, the button is **Info and options**.
The options panel includes **Video** plus these track and chapter controls:

| Tab | Apple TV | Android TV |
| --- | --- | --- |
| **Audio** | Appears when audio tracks are available. | Appears when audio tracks are available. |
| **Subtitles** | Appears when subtitle tracks, subtitle search, or AI subtitle actions are available. | Always appears, including when the file has no subtitle tracks. |
| **Chapters** | Appears when the file has chapters. | Appears when the file has chapters. |

You can also choose audio and subtitle tracks on the title's detail page
before pressing **Play** or **Resume**.

## Chapters, intros, and the next episode

Open **Chapters** and choose an entry to jump there. Chapter images in the
web timeline require the server to generate them; an absent image does not
mean seeking is broken. See [chapter previews](/docs/playback).

A **Skip Intro** or other skip prompt appears only when Silo has a matching
marker. If it skips the wrong section, report the title, episode, and times
in a [problem report](/docs/report-a-problem). Shared marker changes affect
other viewers too.

In **Settings > Playback**, choose whether to skip intros, credits, or recaps
automatically and whether to play the next episode. These controls depend
on available markers and episodes.

## If playback fails

Try another title. If the failing title has multiple versions, try another
available version too.
Record the time, chosen version, app version, and error. Include whether
sound, picture, or both failed in a [problem report](/docs/report-a-problem).
Avoid repeatedly restarting a title
while the server is already reporting a limit.
