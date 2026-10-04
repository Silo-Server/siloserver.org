---
slug: docs/subtitle-providers
title: Set up subtitle providers
description: Connect subtitle search providers, sync subtitles to the audio, and manage tracks stored on your server.
---

Configure a subtitle provider when viewers need to search for tracks that are missing from a media file. AI translation and transcription have [separate settings](/docs/ai-services).

## Connect a provider

1. Open **Admin > Settings > Subtitles & Metadata**.
2. Open a provider under **Subtitle providers**.
3. Enter its required credentials. OpenSubtitles has username, password, and API-key fields; other providers may need only a key.
4. Turn the provider on and choose **Save**. Read the result, including any warning that the saved settings have not been applied yet.
5. Run the provider's connection test, then search for and download a subtitle for a known movie or episode in the web player.

A working connection doesn't mean the provider has your language or release.

## Set up subtitle sync

Silo syncs subtitles to the video's audio, so a subtitle made for another release of the title plays in time. The corrected timing applies to everyone who plays the subtitle; viewers start a sync and see how it went in the [web subtitle menu](/docs/subtitles#fix-subtitles-that-are-out-of-sync). Anyone who can play a title can sync its subtitles or reset their timing. Demo servers refuse both.

Sync is on by default. Its settings are under **Subtitle sync** in **Admin > Settings > Subtitles & Metadata**; choose **Save** after changing them.

- **Sync subtitles automatically** syncs a downloaded or uploaded subtitle when it's added, and any other subtitle the first time it's played. Turn it off to sync only when someone chooses **Sync to audio** in the web player.
- **Where to analyze audio** chooses the machine that reads the audio: **Local server**, **Prefer transcode nodes** (the default), or **Transcode nodes only**. Sync reads a few minutes of the file's audio, about 45 seconds of CPU time the first time a file is synced. Later subtitles for the same file reuse that work. **Prefer transcode nodes** falls back to the main server when no [transcode node](/docs/transcode-nodes) can take it; **Transcode nodes only** fails the sync instead. A node needs the media at the same path as the main server.
- **Concurrent syncs per transcode node** sets how many subtitles one node syncs at once. The default is 1. It appears when **Where to analyze audio** uses transcode nodes.

### Subtitle files beside the media

Silo also syncs SRT, WebVTT, ASS, and SSA files you keep beside the video, the first time someone plays them, and viewers can sync them with **Sync to audio**. It doesn't sync them during a scan or on a schedule. Other apps that read your media folders still get the files' original timing; to fix the files themselves, use a tool that rewrites subtitle files, such as Bazarr. Subtitles inside the video file and `.sub` files can't be synced.

### How Silo stores the timing

Silo never edits subtitle files, including the ones in your media folders. It stores the correction in its database and applies it each time it sends the subtitle: to the web, mobile, and TV apps, Jellyfin apps, and offline downloads.

- Editing or replacing a subtitle file beside the video drops its correction, since the new contents need their own timing. Renaming the file keeps it.
- Replacing a video file drops every subtitle correction and sync result for it, since another release of the title has different timing.

## Inspect saved tracks

Open **Admin > Subtitle Files**. Filter by media, language, or provider to find a stored track. The list shows whether a person uploaded it or a provider supplied it.

Download a copy before you correct or delete a track. The download is the file as it was added, without any sync correction. Stored tracks are shared with everyone who can play the item, including profiles in other accounts, so deleting one removes it for all of them. Which track a viewer selects stays their own choice.

## Search returns nothing

Check the provider's saved credentials and that it is turned on. Then check the item's match and the requested language: a wrongly matched movie or episode searches for the wrong subtitles.
