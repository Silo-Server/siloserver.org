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
4. If playback keeps buffering on **Auto**, Silo lowers the quality for you
   or asks first, depending on **Lower quality when buffering**. If it's set
   to **Never**, or you picked a quality, choose a lower **Quality** in the
   player. See
   [If playback keeps buffering](/docs/watch-movies-and-series#if-playback-keeps-buffering).

If the web player says `This file can't be played`, the file itself is empty,
corrupt, or cut short, and trying again won't help. On a series page, the web
app shows **Damaged file** next to an episode like this. Replace the file, then
[scan the library](/docs/manage-libraries#scan-or-refresh). If someone else runs
the server, tell them which title it is.

If you run the server, check [active playback](/docs/active-playback) to see
whether the stream is being converted, and [server health](/docs/server-health)
for errors at that time. Otherwise, share the details below with the person who
runs it.

If Silo converts a title your device should play as it is, check the
viewer's [quality settings](/docs/preferences#set-playback-quality) first. A
**Resolution** below the file's size or a **Maximum bitrate** below its
bitrate makes Silo convert it, and so does **Cellular Quality** on mobile data
or a metered network.

If titles start at a lower quality than your connection should allow, Silo
may still be holding a limit from earlier buffering on this device and
network. **Settings > Playback** shows it as a line such as "Limited to
12 Mbps after buffering on Oct 17". Select **Reset** to clear it, then play
the title again. See
[Lower quality when buffering](/docs/preferences#lower-quality-when-buffering).

If a title won't start and isn't marked **Damaged file**, check that Silo can
still read it. Filter **Admin > Logs > Server Log** by the `scanner` component for
`ffprobe failed because the file could not be read`. Fix the file's permissions
or its storage, such as a network mount that dropped, then
[scan the library](/docs/manage-libraries#scan-or-refresh).

## If the web app converts HEVC files on Linux

Turn on hardware video decoding in your browser. Most 4K, HDR, and Dolby
Vision files use HEVC, and most browsers on Linux can't play it until hardware
decoding is on, so Silo converts those files on the server.

To check, start the title in the web app, open **Playback info** in the player,
and look at **Play method**. **Transcode** means the server is converting the
file, and **Direct Play** means the browser is playing the original.

1. Check that your graphics driver can decode HEVC. Run `vainfo`, from the
   `libva-utils` package, and look for `VAProfileHEVCMain10`. If it isn't
   listed, install the VA-API driver for your GPU.
2. Turn on hardware decoding in the browser:
   - In Chrome, Chromium, Brave, and other Chromium-based browsers, start the
     browser with these flags:

     ```
     --enable-features=AcceleratedVideoDecodeLinuxGL,AcceleratedVideoDecodeLinuxZeroCopyGL,VaapiOnNvidiaGPUs,VaapiIgnoreDriverChecks
     --ignore-gpu-blocklist
     ```

     If your browser's package reads a flags file, such as
     `~/.config/chromium-flags.conf` on Arch Linux, put each flag on its own
     line there. The browser uses only the last `--enable-features` flag it
     gets, so if you already have one, add these features to it.
   - In Firefox, open `about:config` and set `media.ffmpeg.vaapi.enabled` and
     `media.hardware-video-decoding.force-enabled` to `true`.
3. Quit the browser completely, then start it again.
4. Check that the browser now decodes HEVC. In a Chromium-based browser, open
   `chrome://gpu` and look for HEVC Main 10 under **Video Acceleration
   Information**. In Firefox, open `about:support` and check that HEVC shows
   hardware decoding under **Codec Support**.
5. Start the title again and check **Play method** in **Playback info**.

On a screen without HDR, Silo also converts HDR and Dolby Vision files to
standard range on the server. To have the browser do that instead, open
**Settings > Playback** and, under **This browser**, turn on **Decode in the
browser (beta)**. It applies from the next video you start.

## Picture problems on a TV

Check the selected version before you press **Play**, and try another if one
fails. Note whether the picture is missing, has the wrong colors, or stutters.

HDR and Dolby Vision depend on the whole chain: the file, the app, the TV, and
anything in between, such as a receiver. Check what the TV reports it is
receiving rather than the label on the file.

On Android TV, if the bars around the picture look grey during HDR or Dolby
Vision, turn on **True Black Bars** in **Settings > Playback**. On some devices
it has the opposite effect, so turn it off again if the bars get lighter or
show a thin line where they meet the picture.

## Sound problems on a TV or receiver

Open the audio options during playback and try another track. Check that the
TV or receiver is set to the input and sound output you expect. For Dolby Atmos,
check what the receiver displays; a track labeled Atmos may still play as
ordinary surround if part of the chain doesn't support it.

## Subtitle problems

Choose another subtitle track in the player. Text subtitles and image subtitles
behave differently, so note the track's format and language. To add a track
that's missing, see [Find or add missing subtitles](/docs/missing-subtitles).

If a subtitle is out of sync, open the web subtitle menu and check the line
under its name. **Doesn't match this video** means it was made for a
different release or title, so choose another file. Otherwise select it and
choose **Sync to audio** under **Timing**, or change the delay. Subtitles
inside the video file and `.sub` files can only use the delay. See
[Fix subtitles that are out of sync](/docs/subtitles#fix-subtitles-that-are-out-of-sync).

## What to include in a report

- The title and the version you chose.
- The app, app version, and device model, and the server version.
- The audio and subtitle tracks you chose, and the quality setting.
- What happened and when: no picture, no sound, wrong colors, stutter, or an
  error message.
- For a TV setup: the TV and receiver models and how they are connected.

[Report the problem](/docs/report-a-problem) with those details. Don't attach
the media file.
