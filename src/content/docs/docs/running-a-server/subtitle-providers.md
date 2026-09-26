---
slug: docs/subtitle-providers
title: Set up subtitle providers
description: Connect subtitle search providers and manage tracks stored on your server.
---

Configure a subtitle provider when viewers need to search for tracks that are missing from a media file. AI translation and transcription have [separate settings](/docs/ai-services).

## Connect a provider

1. Open **Admin > Settings > Subtitles & Metadata**.
2. Open a provider under **Subtitle providers**.
3. Enter its required credentials. OpenSubtitles has username, password, and API-key fields; other providers may need only a key.
4. Turn the provider on and choose **Save**. Read the result, including any warning that the saved configuration has not been applied.
5. Run the provider's connection test, then search for a subtitle on a known movie or episode in the web player.

A successful connection test checks the provider connection. It does not guarantee that the provider has the language or release you need. Test one search and download before inviting everyone to use it.

## Inspect saved tracks

Open **Admin > Subtitle Files**. Filter by media, language, or provider to find a stored track. The list distinguishes user uploads from provider downloads.

Use the row's download action to keep a copy before correcting or deleting a track. Check the media item and language carefully: these files are shared with everyone who can access that item, including profiles in other accounts. Deleting a shared track can affect their playback choices.

Deleting a record here is different from a viewer turning subtitles off. A viewer's track selection remains personal.

## Search returns nothing

Check the provider's saved credentials and enabled state first. Then check the item's identity and requested language. A wrong movie or episode match can produce the wrong subtitle search even when the provider is working.
