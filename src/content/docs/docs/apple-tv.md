---
title: Apple TV
description: Playback capabilities of the Silo tvOS client — Dolby Vision, HDR, Dolby Atmos, lossless audio, and where the Apple TV platform sets the ceiling.
---

Silo for tvOS is a first-party client for Apple TV 4K, built for direct play: video and audio are served to the system player in their original form whenever the platform can handle them, with no server-side transcoding required.

This page describes what the client plays back and — just as important — where the limits are the Apple TV platform itself, not Silo.

## Video

| Format | Support |
| --- | --- |
| HEVC / H.264 | Direct play |
| Dolby Vision Profile 5 | Direct play |
| Dolby Vision Profile 8 (HDR10 / HLG base) | Direct play |
| Dolby Vision Profile 7 (Blu-ray remux) | Played as Profile 8.1 (base layer + dynamic metadata; the enhancement layer is not used) |
| HDR10, HDR10+, HLG | Direct play (HDR10+ dynamic metadata is passed through) |
| VP9, AV1, legacy codecs | Played through a software decode path |

Dolby Vision output can be toggled in playback settings (on by default); with it off, DV content falls back to HDR10.

## Audio and Dolby Atmos

The most common question: **does Silo do Atmos passthrough like a Shield?** The honest answer is that *no* Apple TV app does bitstream passthrough — the platform doesn't allow it. The Apple TV always decodes audio and re-emits it over HDMI, either as LPCM or, for Atmos, as **Dolby MAT 2.0** (a carrier that preserves the spatial object metadata). Your receiver will show "Dolby Atmos", never "Dolby TrueHD".

Within that platform ceiling, Silo delivers everything that is technically possible:

| Source audio | What you get with Silo | Platform limit? |
| --- | --- | --- |
| Dolby Digital Plus Atmos (E-AC-3 JOC) | **Full Dolby Atmos.** The stream is passed to the system untouched with correct Atmos signalling; tvOS outputs it as Dolby MAT | This *is* the maximum any tvOS app can deliver |
| TrueHD Atmos (lossless, Blu-ray remux) | 7.1 lossless bed as PCM; the Atmos object metadata is dropped | Yes — tvOS has no TrueHD decoder, no bitstream path, and no way to author MAT. Lossless Atmos is impossible for every Apple TV app |
| DD+ Atmos companion track (present in most remuxes alongside TrueHD) | Select it to get real (lossy) Atmos — usually the better spatial experience | Standard tvOS workaround |
| DTS-HD MA / DTS:X | Decoded multichannel bed as PCM; no DTS:X objects | Yes — tvOS has no DTS output path at all |
| AC-3 / plain DD+ 5.1 (no Atmos) | Direct play — decoded on-device and output as 5.1 LPCM, with nothing lost (see note below) | No |
| Atmos on AirPods / spatial audio | Works via the system spatializer | No |

**Why does my receiver show "PCM 5.1" instead of "Dolby Digital"?** Because the Apple TV decodes Dolby audio on-device and sends uncompressed multichannel LPCM over HDMI. This is a lossless decode of the lossy source — the receiver gets exactly the same 5.1 audio it would have produced by decoding the bitstream itself, so no quality is lost; only the badge changes. Every Apple TV app outputs non-Atmos surround this way. If you'd rather see "Dolby Digital" on the receiver, set **Settings → Video and Audio → Audio Format → Change Format** to **Dolby Digital 5.1** — but note that forcing that format disables Atmos output, so leave it off if you play Atmos content.

If lossless Atmos or DTS:X bitstreaming matters to you, that requires different hardware (an Nvidia Shield, HTPC, or Blu-ray player) — no client-side work can change it on Apple TV.

**Tip:** for Blu-ray remuxes that carry both TrueHD Atmos and a DD+ Atmos track, pick the DD+ track on Apple TV. You trade the lossless bed for actual Atmos object rendering, which most setups will prefer.

## Subtitles

Text subtitles (SRT/ASS with full styling via libass) and image-based subtitles (PGS, DVD) render on-device, including inside Dolby Vision playback. Subtitle appearance is configurable and follows the system accessibility settings by default.

## Receiver checklist

If Atmos content plays but your receiver doesn't show "Dolby Atmos":

1. On the Apple TV, check **Settings → Video and Audio → Audio Format** — "Change Format" should be **off** (or explicitly set to Atmos).
2. Confirm the Apple TV is connected to an eARC/HDMI input that supports Atmos, and the receiver's HDMI mode is set to "Enhanced" where applicable.
3. Verify the title's selected audio track is actually the Atmos one (look for "Atmos" or "JOC" in the track name in the player's audio menu).
