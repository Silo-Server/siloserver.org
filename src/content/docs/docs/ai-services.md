---
title: AI Services
description: Configure subtitle translation, subtitle generation from audio, and description translation, with recommended providers.
---

Silo's AI features share one OpenAI-compatible endpoint configuration under Admin > Settings > AI Services:

- Subtitle translation: translate any text subtitle track from the player ("Translate with AI"). The finished track is stored server-side and served to every client.
- Subtitle generation from audio: Whisper transcription for media with no usable text subtitles, including bitmap-only releases. `transcribe_translate` chains transcription into translation for any target language.
- Description translation: overviews and taglines translated into the localization tables — from the metadata editor, automatically per library after metadata refreshes, or on demand when a viewer's profile language differs from the catalog ("on-view translation").

All jobs run once on the server. Generated subtitles are ordinary downloaded tracks and translated descriptions are ordinary localizations, so every client (web, Android, Apple, Jellyfin-compat) receives them with no client configuration.

## Endpoint configuration

Two endpoints, configured independently:

Chat endpoint (Base URL, Chat model, API Key)
: Used for all translation (subtitles and descriptions). Any OpenAI-compatible chat completions API works: OpenRouter, OpenAI, Groq, a local Ollama/llama.cpp server.

Transcription endpoint (Transcription base URL, model, API key)
: Used for subtitle generation from audio. Must implement `/v1/audio/transcriptions` with `response_format=verbose_json` segment timestamps — subtitles are built from those timestamps. Chat-only gateways (OpenRouter included) cannot transcribe; Silo rejects them in settings and disables transcription if the fallback would land on one. When blank, the chat Base URL is used.

Max concurrent jobs is one shared cap across all AI features, so the endpoint never sees more parallel work than you allow.

## Recommended providers

### Translation (chat)

Recommended: `google/gemini-3.1-flash-lite` via OpenRouter.

- Base URL: `https://openrouter.ai/api`
- Chat model: `google/gemini-3.1-flash-lite`

Fast, inexpensive, and strong across language pairs including non-Latin scripts. Any mid-tier or better model works; very small local models (7–8B) produce stilted output in languages like Arabic and break the batch format more often. Descriptions and subtitles are translated in batches with retries, so occasional malformed responses are tolerated.

### Transcription (Whisper)

Recommended: self-hosted [speaches](https://github.com/speaches-ai/speaches) running `deepdml/faster-whisper-large-v3-turbo-ct2` — private, free, no rate limits. The "Self-hosted" preset in AI Services fills the model; point the URL at your server. Any modern GPU transcribes a feature film in minutes; CPU-only runs at roughly realtime and suits background jobs.

```yaml
services:
  speaches:
    image: ghcr.io/speaches-ai/speaches:latest-cuda # or latest-cpu
    restart: unless-stopped
    gpus: all # omit on CPU
    ports:
      - "8000:8000"
    volumes:
      - speaches-models:/home/ubuntu/.cache/huggingface

volumes:
  speaches-models:
```

Download the model once and verify the endpoint returns timed segments:

```bash
curl -X POST "http://<host>:8000/v1/models/deepdml%2Ffaster-whisper-large-v3-turbo-ct2"
curl -s http://<host>:8000/v1/audio/transcriptions \
  -F file=@sample.wav \
  -F model=deepdml/faster-whisper-large-v3-turbo-ct2 \
  -F response_format=verbose_json
```

The response must contain a `segments` array. Then set the Transcription base URL to `http://<host>:8000` and the model to `deepdml/faster-whisper-large-v3-turbo-ct2`.

Hosted fallbacks, in order:

| Provider | Model | Notes |
| --- | --- | --- |
| Groq | `whisper-large-v3-turbo` | Base URL `https://api.groq.com/openai`. Free tier covers about two audio-hours per clock hour (roughly one film per hour); paid is $0.04 per audio-hour. |
| OpenAI | `whisper-1` | Base URL `https://api.openai.com`. Use `whisper-1` specifically — newer OpenAI transcription models do not return the segment timestamps Silo requires. |

## Feature toggles

Subtitle translation, transcription, and description translation are enabled independently in AI Services. Two further controls for descriptions:

- Per-library auto-translate (library settings): when metadata providers have no localization for the library's language, translate descriptions after each refresh.
- On-view translation (`off`, `button`, `auto`): lets viewers request descriptions in their profile's metadata language from detail pages — a Translate button, or automatic with a brief loading animation. Duplicate requests collapse into one job and failed targets cool down for 15 minutes.

Profiles choose a preferred metadata language under Settings > Playback. Provider metadata always outranks AI translations: a later provider refresh replaces AI text, never the reverse, and manual edits are never overwritten.

Settings changes take effect after a server restart.
