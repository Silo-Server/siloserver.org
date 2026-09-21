---
slug: docs/unfinished-features
beta: true
title: Unfinished and unavailable features (Beta)
description: Distinguish partial implementations from beta features you can try today.
---

:::caution[Beta]
This page records work outside the supported 1.0 scope that has no complete
user workflow in the inspected main branches. A route, model, or screen in
source does not mean it is available in your installed app.
:::

## Partial implementations

| Feature | Current boundary |
| --- | --- |
| Watch Together on Android | Room and player code exists, but phone/tablet and TV menus are disabled by the client policy. Use the [web guide](/docs/watch-together). |
| Native notification inboxes | Android phone/tablet has an indirect notification-entry path. TV and Apple do not expose a normal inbox. See [native inboxes](/docs/native-inboxes). |
| Native chapter-preview images | Server generation and web display belong to the main feature set. Apple/Android chapter menus do not render those images. [Apple scrub frames](/docs/versions-and-previews) are separate. |
| Full timeline trickplay | No complete BIF-style image timeline was established across clients. A live frame preview does not provide an image at every timestamp. |
| Podcasts and music | Server or client pieces do not form a complete listening workflow. See [library types](/docs/library-types). |

## No usable workflow established

| Feature | What to use instead |
| --- | --- |
| Scheduled home-section publication | Add, reorder, or hide rows manually in [web admin](/docs/home-sections). A dynamic seasonal row is not scheduled publication. |
| Plugin publisher signatures | Current catalog installs use checksum verification and catalog trust labels. These do not prove a cryptographic publisher signature. See [plugins](/docs/plugins). |
| Native server administration | Use web admin. A playback statistics overlay or an admin account badge is not an administration console. |
| AI audio dubbing | Normal audio-track selection and AI subtitles exist; no audio-dubbing workflow was established. |
| Automatic account/profile creation during history import | Create accounts/profiles first, then use the existing history-import mapping. |
| Full interface localization | Locale-aware dates and translated media metadata do not establish a fully translated app interface. |
| Network-access provider plugins | Work exists on a separate server branch, not the audited main revision. Normal HTTPS/reverse-proxy setup remains in the main guide. |

These are limitations, not activation instructions or release-date promises.
The beta documentation does not turn hidden features on. Do not edit server
records or build flags to bypass an unavailable interface as part of a
normal installation.
