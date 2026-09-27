---
slug: docs/ai-services
title: Configure AI services
description: Connect text and speech models, set limits, and test one subtitle or description job.
---

Silo uses a text model to translate subtitles and descriptions, and a speech-to-text model to create subtitles from audio. You can set up either one on its own. Each feature also has its own switch; once it is on, its actions appear in the apps that support it.

Before using a hosted model, check its charges and data policy. Translation sends text to the model's endpoint; transcription sends audio.

## Connect a text model

1. Open **Admin > Settings > AI Services**.
2. In the text model card, choose a preset or enter **Base URL**, **Model**, and **API key** for a compatible service.
3. Choose **Test text model**. The test uses the values on screen, even before you save.
4. Turn on **Translate subtitles**, **Translate descriptions**, or both.
5. Save, then translate one short item before using it across a library.

**Description translation for viewers** controls translation on detail pages: **Off**, **Translate button on detail pages**, or **Automatic on view**. With **Off**, browsing never starts a translation job, and you can still translate from the metadata editor.

## Connect speech-to-text

1. In the speech-to-text card, choose a preset or enter its **Base URL**, **Model**, and **API key**.
2. Choose **Test speech-to-text**. The endpoint must return timed segments, which Silo turns into subtitles.
3. Turn on **Create subtitles from audio** and save.
4. Try one short item in the web player. When the job finishes, select the new subtitle track and check its language and timing.

If the speech **Base URL** is blank, Silo sends audio to the text model's endpoint. Run **Test speech-to-text** to find out whether that endpoint accepts audio.

## Limit cost and server load

Under **Server-wide tuning**, set **Jobs running at once**; changing it needs a server restart. Under **Per-account limits**, choose a transcription allowance and how often it resets.

All profiles in an account share its transcription allowance. An administrator using the account's primary profile is exempt; the account's other profiles still count against it.

Keep the default batch and audio-request sizes unless the provider reports a request-size or rate-limit error.

Generated subtitle tracks are saved on the server, and anyone who can play the item can select them. Manage saved files under [Subtitle Files](/docs/subtitle-providers#inspect-saved-tracks).

## A test or job fails

Check the model name, base URL, credential, and the provider's response. A full film can still fail after a passing connection test, for example when it reaches the provider's quota. Read generated subtitles before relying on them.
