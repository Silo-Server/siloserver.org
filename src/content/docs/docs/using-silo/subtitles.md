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
because they come from a different cut of the film. Subtitles that come with
the video file, and `.sub` files, keep their own timing.

In the web app, the subtitle menu shows how each added subtitle was synced,
under its name:

- **Syncing…**: Silo is still working on it.
- **Synced −3.2 s**: Silo moved it earlier or later by that much. If it also
  corrected the speed, the line ends with the change, such as
  **· 25→23.976 fps** or **· ×1.0008 speed**.
- **Already in sync**: the timing was already right.
- **Doesn't match this video**: the subtitle doesn't line up with the audio,
  usually because it was made for a different release or title. Silo leaves
  its timing alone. Choose another file that matches your copy of the title;
  a delay won't fix it.
- **Sync failed**: Silo couldn't finish. Try **Sync subtitle** again.

To redo it, select the subtitle and choose **Sync subtitle** under **Timing**
in the same menu. **Reset timing** goes back to the file's original timing.
Both change the subtitle for everyone who watches the title, so only the
person who added it or an admin can use them.

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
