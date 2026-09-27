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
4. Turn the provider on and choose **Save**. Read the result, including any warning that the saved settings have not been applied yet.
5. Run the provider's connection test, then search for and download a subtitle for a known movie or episode in the web player.

A working connection doesn't mean the provider has your language or release.

## Inspect saved tracks

Open **Admin > Subtitle Files**. Filter by media, language, or provider to find a stored track. The list shows whether a person uploaded it or a provider supplied it.

Download a copy before you correct or delete a track. Stored tracks are shared with everyone who can play the item, including profiles in other accounts, so deleting one removes it for all of them. Which track a viewer selects stays their own choice.

## Search returns nothing

Check the provider's saved credentials and that it is turned on. Then check the item's match and the requested language: a wrongly matched movie or episode searches for the wrong subtitles.
