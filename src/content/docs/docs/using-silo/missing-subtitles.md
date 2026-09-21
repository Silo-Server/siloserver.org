---
slug: docs/missing-subtitles
title: Find or add missing subtitles
description: Search a provider, upload a subtitle file, or use a configured AI service.
---

You can search for subtitles and use AI subtitle tools in the web, Apple,
and Android players. Uploading a file uses the web player.

The server needs a configured subtitle provider for online search. AI
translation needs a configured translation service with subtitle translation
switched on; generation from audio needs a configured and enabled transcription
service. Your account and profile must have access
to the media, and transcription can have a quota. If you run the server,
see [AI services](/docs/ai-services) and
[subtitle providers](/docs/subtitle-providers) for setup.

## Search online

Start the correct movie or episode version and open its
[subtitle list](/docs/subtitles). In the web player, select **Search Online…**,
choose a language, and select **Search**. In the Apple apps, choose
**Search Subtitles…** and select a language to start the search. On Android,
choose **Find subtitles** on a phone or tablet, or **Search subtitles** on TV.
Choose a language and select **Search**.

Choose a result that matches your release and wait for the download to finish.
Select the saved track if it is not already selected, then check a few lines
against the dialogue.

Here, **download** means the server saves a subtitle track for the media file.
It does not download the movie to your device.

## Upload a file

In the web player's **Add Subtitles** dialog, choose your subtitle file, check the
detected language, and correct it if needed. Set the hearing-impaired option
when the file includes sound descriptions, then upload it. The file picker
accepts `.srt`, `.vtt`, `.ass`, `.ssa`, and `.sub`; an unsupported or invalid
file can still be rejected by the server.

A saved subtitle is attached to the media file. Other accounts and profiles
with access to that item can use it. Selecting it for your playback remains
personal. Only upload a file you are allowed to share with those viewers.

## Translate or generate with AI

### Web and Android

1. Open **Translate with AI…** in the web subtitle menu, or **Translate with AI**
   in the Android subtitle list.
2. Choose **From subtitles** to translate an existing text track, or **From
   audio** to generate text from speech. Only configured options appear.
3. Choose the source track and output language, then select **Translate**
   or **Generate**.
4. Wait for the job to finish and check the resulting track. AI output can
   mishear dialogue or translate it incorrectly.

### Apple apps

Open **AI Subtitles…** in the subtitle list and choose the output language.
Silo translates an existing text track when it can, or generates subtitles
from the audio when transcription is available. The app chooses the source
automatically. Check the resulting track against the dialogue.

Text or audio may be sent to the server's configured AI provider. Generation
can take time and use an account quota. If a request fails, read the error
before retrying; repeated requests will not fix an exhausted quota or missing
provider configuration. Check [AI service configuration](/docs/ai-services)
if you manage the server, or share the error
with the person who does.
