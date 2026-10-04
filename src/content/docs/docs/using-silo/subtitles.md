---
slug: docs/subtitles
title: Choose and adjust subtitles
description: Pick a subtitle track, change how subtitles look, or fix subtitles that are out of sync.
---

## Choose a subtitle track

While a title is playing, open the subtitle list and choose a track:

- **Web:** select the captions button in the player controls.
- **iPhone and iPad:** open **Audio & Subtitles**.
- **Android phones and tablets:** open **Audio and subtitles**.
- **Apple TV and Android TV:** open the playback options and choose the
  **Subtitles** tab.

Choose **Off** to hide subtitles. The same language can appear more than
once when the title has several subtitle tracks in that language.

If the language you want isn't there,
[find, upload, or generate subtitles](/docs/missing-subtitles).

## Set your usual language and look

Open **Settings** and go to **Subtitles**. Every Silo app has this section.
There you can choose:

- your subtitle language
- when subtitles appear (the behavior setting)
- whether to show forced subtitles, which cover only selected dialogue or
  on-screen text
- the size, font, color, background, and position of the text

You can also change the look while you watch: choose **Appearance…** in the
web subtitle menu, **Appearance** in **Playback Settings** on iPhone and
iPad, or **Subtitle style** under **Playback settings** >
**Playback Options** on Android phones and tablets.

Some subtitles are pictures or carry their own styling, so not every setting
changes them. To use a different look on one device, see
[Preferences](/docs/preferences).

## Fix subtitles that are out of sync

Silo syncs each subtitle you [download or upload](/docs/missing-subtitles)
to the video's audio when it's added, so most need no delay. Sync fixes
subtitles that start too early or too late, run at the wrong speed because
they were made for a version with a different frame rate, or slowly drift
because they come from a different cut of the film. Other subtitles, such as
AI subtitles and subtitle files beside the video, are synced the first time
someone plays them. The lines on screen move to the new timing without a
notice.

Only SRT, WebVTT, ASS, and SSA subtitles can be synced. Subtitles inside the
video file keep their own timing, and so do other formats, such as `.sub`
files.

### Sync a subtitle to the audio

In the web app, select the subtitle in the subtitle menu and choose
**Sync to audio** under **Timing**. Anyone who can play the title can sync
its subtitles, and the new timing applies to everyone who watches it.
**Reset timing** goes back to the subtitle's original timing, also for
everyone. Demo servers don't allow either; the menu then shows
**This server doesn't allow changing subtitle timing**.

While Silo syncs, a card in the top-right corner of the player shows how far
it got, also in fullscreen: **Listening to the audio…**, then
**Matching lines to speech…**. Listening takes most of the time. Once Silo
has the new timing, the card shows **Applying new timing…** until the
corrected lines are on screen, then **Subtitles synced** with the change,
such as **−3.0 s**. The card also follows the automatic sync of a subtitle
you downloaded or uploaded. When someone else changes the timing of the
subtitle you're watching, the player shows **Subtitle timing updated** once
the new lines load.

Sync never changes the subtitle file. Silo saves the correction and applies
it each time it sends the subtitle. Editing or replacing a subtitle file
beside the video, or replacing the video, drops the correction. Silo syncs
the subtitle again the next time someone plays it.

The mobile and TV apps and Jellyfin apps play the synced timing the next time
they load the subtitle. To start a sync or follow one, use the web app.

### Check how a subtitle was synced

In the web app, the subtitle menu shows how each subtitle was synced, under
its name:

- **Syncing… 40%**: Silo is still working on it.
- **Synced −3.2 s**: Silo moved it earlier or later by that much. If it also
  corrected the speed, the line ends with the change, such as
  **· 25→23.976 fps** or **· ×1.0008 speed**.
- **Already in sync**: the timing was already right.
- **Doesn't match this video**: the subtitle doesn't line up with the audio,
  usually because it was made for a different release or title. Silo leaves
  its timing alone. Choose another file that matches your copy of the title;
  a delay won't fix it.
- **Sync failed**: Silo couldn't finish. Select the subtitle to see why under
  **Timing**: the subtitle changed during the sync, the video has no audio
  Silo can read, or the server was busy. If the subtitle changed or the
  server was busy, try **Sync to audio** again.

### Change the delay on one device

If subtitles still show up too early or too late, change the subtitle delay.
The delay applies only on the device you're using, on top of the synced
timing:

- **Web:** in the subtitle menu, use **-** and **+** next to **Delay**.
  **Reset** sets it back to zero.
- **iPhone and iPad:** open **Playback Settings** and choose
  **Subtitle Delay**.
- **Android phones and tablets:** open **Playback settings** >
  **Playback Options** > **Audio & subtitle sync** > **Subtitle delay**.
- **Apple TV and Android TV:** open the **Subtitles** tab and choose
  **Delay**.

Change it a little at a time and replay a line to check.
