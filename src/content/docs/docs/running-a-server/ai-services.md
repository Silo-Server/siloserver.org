---
slug: docs/ai-services
title: Configure AI services
description: Connect text and speech models or a ChatGPT plan, choose a model and reasoning level, set limits, and test one subtitle or description job.
---

Silo uses a text model to translate subtitles and descriptions, and a speech-to-text model to create subtitles from audio. You can set up either one on its own. Each feature also has its own switch; once it is on, its actions appear in the apps that support it.

Before using a hosted model, check its charges and data policy. Translation sends text to the model's endpoint; transcription sends audio.

## Connect a text model

1. Open **Admin > Settings > AI Services**.
2. In the **Text model** card, choose how Silo connects under **Authentication**:
   - **API key or local provider**: enter **Base URL**, **Model**, and **API key** for any service with an OpenAI-compatible chat endpoint. Leave **API key** empty for a model on your network that needs none.
   - **ChatGPT plan**: sign in as described in [Use your ChatGPT plan](#use-your-chatgpt-plan).
3. Choose a **Reasoning level**. See [Choose a model and reasoning level](#choose-a-model-and-reasoning-level).
4. Choose **Test text model**. The test uses the values on screen, even before you save.
5. Turn on **Translate subtitles**, **Translate descriptions**, or both.
6. Save, then translate one short item before using it across a library.

**Description translation for viewers** controls translation on detail pages: **Off**, **Translate button on detail pages**, or **Automatic on view**. With **Off**, browsing never starts a translation job, and you can still translate from the metadata editor.

## Connect speech-to-text

1. In the speech-to-text card, choose a preset or enter its **Base URL**, **Model**, and **API key**.
2. Choose **Test speech-to-text**. The endpoint must return timed segments, which Silo turns into subtitles.
3. Turn on **Create subtitles from audio** and save.
4. Try one short item in the web player. When the job finishes, select the new subtitle track and check its language and timing.

If the speech **Base URL** is blank, Silo sends audio to the text model's endpoint. Run **Test speech-to-text** to find out whether that endpoint accepts audio. A ChatGPT plan does not include transcription, so with **ChatGPT plan** selected, a blank **Base URL** uses the one saved under **API key or local provider**.

## Use your ChatGPT plan

Instead of an API key, the text model can use a ChatGPT subscription. Translations then count toward that plan's usage limits, with no separate per-request charge.

1. In the **Text model** card, set **Authentication** to **ChatGPT plan** and choose **Continue with ChatGPT**.
2. Choose **Open ChatGPT sign-in** and allow Silo to use your plan.
3. After you approve, the ChatGPT tab moves to a local address and may show a "can't connect" error, which is expected. Copy the full URL from that tab's address bar.
4. Back in Silo, paste it into **Browser URL** and choose **Connect ChatGPT**. If ten minutes have passed since step 1, close the dialog and start again.

Silo selects a model the account offers. Change **Model** if you want another one, then continue from the **Reasoning level** step in [Connect a text model](#connect-a-text-model).

To add another account, choose **Continue with ChatGPT** again, then pick the one Silo uses under **ChatGPT account**. **Reconnect** signs an account in again after its sign-in expires. **Disconnect** signs it out and revokes Silo's access in ChatGPT; if Silo reports that it disconnected only locally, open **Manage usage** and check that Silo's access is gone.

When an account reaches its plan's usage limit, Silo pauses translation and shows **ChatGPT plan usage is paused**. Check your usage with **Manage usage**, then choose **Test text model**; a successful test resumes translation. An account marked **plan sharing unavailable** is on a plan that does not let Silo use it, so choose another account or switch to an API key. While the active account is paused or needs sign-in, subtitle and description translation are unavailable, including for viewers. Transcription keeps working if speech-to-text is set up.

## Choose a model and reasoning level

Translation is a short task repeated many times: by default Silo sends a film's subtitles 40 lines at a time, so a feature film takes about 30 requests. A fast, low-cost model usually handles it well, and a larger model mostly adds time and cost. After you translate your first full film, check its cost on your provider's usage page before translating a library.

Before you rely on a model, translate a few items into each language your viewers use and read them. Weaker models can drift into a closely related language, such as Danish in a Norwegian translation, or leave names in the Latin alphabet inside Arabic or Chinese text.

**Reasoning level** sets how much the model thinks before it answers, and lists only the levels the selected model supports. Higher levels take longer and use more tokens, which hosted providers bill as output. For translation, start with **None** or **Low**, and raise it only if translations in your languages miss the meaning. **Provider default** lets the model decide, and some models then think on most requests, which makes each one slower.

A model you run on your own hardware costs nothing per request, but the open models that fit in 16 GB of graphics memory translate noticeably worse than low-cost hosted models. Many of them think by default; set **Reasoning level** to **None**, or a single request can run for minutes.

## Limit cost and server load

Under **Server-wide tuning**, set **Jobs running at once**; changing it needs a server restart. Under **Per-account limits**, choose a transcription allowance and how often it resets.

All profiles in an account share its transcription allowance. An administrator using the account's primary profile is exempt; the account's other profiles still count against it.

Keep the default batch and audio-request sizes unless the provider reports a request-size or rate-limit error.

Generated subtitle tracks are saved on the server, and anyone who can play the item can select them. Manage saved files under [Subtitle Files](/docs/subtitle-providers#inspect-saved-tracks).

## A test or job fails

Check the model name, base URL, credential, and the provider's response. A full film can still fail after a passing connection test, for example when it reaches the provider's quota. Read generated subtitles before relying on them.
