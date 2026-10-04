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

Silo syncs downloaded and uploaded subtitles to the video's audio, so a subtitle made for another release of the title plays in time. The corrected timing applies to everyone who plays the subtitle; viewers see how it went in the [web subtitle menu](/docs/subtitles#fix-subtitles-that-are-out-of-sync). Sync is on by default. Its settings are under **Subtitle sync** in **Admin > Settings > Subtitles & Metadata**; choose **Save** after changing them.

- **Sync new subtitles automatically** syncs each subtitle when it's downloaded or uploaded. Turn it off to sync only when someone chooses **Sync subtitle** in the web player.
- **Where to analyze audio** chooses the machine that reads the audio: **Local server**, **Prefer transcode nodes** (the default), or **Transcode nodes only**. Sync reads a few minutes of the file's audio, about 45 seconds of CPU time the first time a file is synced. Later subtitles for the same file reuse that work. **Prefer transcode nodes** falls back to the main server when no [transcode node](/docs/transcode-nodes) can take it; **Transcode nodes only** fails the sync instead. A node needs the media at the same path as the main server.
- **Concurrent syncs per transcode node** sets how many subtitles one node syncs at once. The default is 1. It appears when **Where to analyze audio** uses transcode nodes.

## Inspect saved tracks

Open **Admin > Subtitle Files**. Filter by media, language, or provider to find a stored track. The list shows whether a person uploaded it or a provider supplied it.

Download a copy before you correct or delete a track. Stored tracks are shared with everyone who can play the item, including profiles in other accounts, so deleting one removes it for all of them. Which track a viewer selects stays their own choice.

## Search returns nothing

Check the provider's saved credentials and that it is turned on. Then check the item's match and the requested language: a wrongly matched movie or episode searches for the wrong subtitles.
