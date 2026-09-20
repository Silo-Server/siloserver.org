---
title: Configure AI services
description: Connect text and speech models, set limits, and test one subtitle or description job.
---

Silo uses a text model to translate subtitles and descriptions. Creating subtitles from audio needs a speech-to-text model. You can configure either one without configuring the other.

Before using a hosted model, check its charges and data policy. Translation sends text to the configured endpoint; transcription sends audio. Use media you have permission to process.

## Connect a text model

1. Open **Admin > Settings > AI Services**.
2. In the text model card, choose a preset or enter **Base URL**, **Model**, and **API key** for a compatible service.
3. Choose **Test text model** and read the result. This test uses the values currently entered, including unsaved changes.
4. Turn on **Translate subtitles**, **Translate descriptions**, or both.
5. Save and follow any restart notice. Test one short translation before using it across a library.

For descriptions, **Description translation for viewers** controls whether viewers get a translate button or automatic translation. Keep it off if only administrators should request this work.

## Connect speech-to-text

1. In the speech-to-text card, choose a preset or enter its **Base URL**, **Model**, and **API key**.
2. Choose **Test speech-to-text**. The endpoint must return the timed segments Silo needs to make subtitles.
3. Turn on **Create subtitles from audio**, save, and follow any restart notice.
4. Try one short item in the web player. Wait for the job to finish, select the new subtitle track, and check the language and timing.

A chat connection test does not test transcription. If the speech URL is blank, Silo can fall back to the text endpoint; use the speech test to check whether that endpoint actually accepts audio.

## Limit cost and server load

Under **Server-wide tuning**, set **Jobs running at once** before inviting more people to use AI features. Under **Per-account limits**, choose a transcription allowance and reset interval.

Start with the default batch and audio-request sizes. Change them only when the provider reports a request-size or rate-limit problem. A failed job is not a reason to remove every limit.

Generated subtitle tracks are saved on the server and can be used by other viewers who have access to that item. Selecting a track remains a personal choice. Manage saved files under [Subtitle Files](/docs/running-a-server/subtitle-providers#inspect-saved-tracks).

## A test or job fails

Check the named model, base URL, credential, and provider response. A successful connection test does not check a full film, every language, or provider quota. Keep the original track available and inspect the result before relying on generated text.
