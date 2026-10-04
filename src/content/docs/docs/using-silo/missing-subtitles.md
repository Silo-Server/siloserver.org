---
slug: docs/missing-subtitles
title: Find or add missing subtitles
description: Search online for subtitles, upload a subtitle file, or create subtitles with AI.
---

If a title doesn't have the subtitles you want, you can search for them
online, upload your own file in the web app, or have AI translate or
transcribe them. Online search and AI appear only when the person who runs
your server has set them up (see [subtitle providers](/docs/subtitle-providers)
and [AI services](/docs/ai-services)).

Subtitles you add are saved with the video file, so anyone else on the server
who can watch the title can use them too.

## Search online

Start playing the movie or episode, then open its
[subtitle list](/docs/subtitles):

- **Web:** choose **Add Subtitles…**. Under **Search online**, pick a language
  and select **Search**. You can also open this from the title's page: open
  the **More** menu and choose **Add Subtitles**.
- **iPhone, iPad, and Apple TV:** choose **Search Subtitles…** and pick a
  language.
- **Android phones and tablets:** choose **Find subtitles**.
- **Android TV:** choose **Search subtitles**. Pick a language and select
  **Search**.

Choose the result that best matches your copy of the title. Silo saves it,
adds it to the subtitle list, and
[syncs it to the audio](/docs/subtitles#fix-subtitles-that-are-out-of-sync)
in the background. Select it if it isn't already on, and watch a few lines
to make sure the timing fits. Sync can't fix a subtitle made for a different
release, which the web subtitle menu marks **Doesn't match this video**.

## Upload a file

In the web app, open **Add Subtitles…** in the player's subtitle menu, or
**Add Subtitles** from the title page's **More** menu. Choose a `.srt`,
`.vtt`, `.ass`, `.ssa`, or `.sub` file and check the language Silo detects.
Turn on **Hearing impaired (HI)** if the file describes sounds as well as
dialogue, then select **Upload**. Silo syncs the new subtitle to the audio,
except for `.sub` files.

Only upload a file you're happy for everyone on the server to use.

## Translate or transcribe with AI

**Web and the Android apps:**

1. Open **Translate with AI…** in the web subtitle menu, or
   **Translate with AI** in the Android subtitle list.
2. Choose **From subtitles** to translate an existing subtitle track, or
   **From audio** to create subtitles from the soundtrack.
3. Choose the source and the language you want, then select **Translate**.
   For audio, the button is **Generate** (**Transcribe** on Android TV).

**iPhone, iPad, and Apple TV:** open **AI Subtitles…** and choose a language.
Silo translates an existing subtitle track when it can and otherwise
transcribes the audio.

The new track appears in the subtitle list when it's done, which can take a
while. AI can mishear or mistranslate lines. There may be a limit on how much
you can transcribe. If it fails, share the error message with the person who
runs your server.
