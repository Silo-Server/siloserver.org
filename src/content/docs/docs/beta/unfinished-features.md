---
slug: docs/unfinished-features
beta: true
title: Unfinished and unavailable features (Beta)
description: Find the available route for features that do not have a complete workflow in every app.
---

:::caution[Beta]
These features are outside the supported 1.0 scope. This page explains what
you can use when a feature name appears in Silo but its full workflow is
unavailable on your device.
:::

<span id="partial-implementations"></span>

## Find the available interface

| Feature | Where to use it |
| --- | --- |
| Watch Party / Watch Together | Create and join rooms in the [web app](/docs/watch-together). |
| Notification inbox | Open **Notifications** in the web app to browse history. Some Android alerts also open the [native inbox](/docs/native-inboxes). |
| Chapter-preview images | Use the web player's chapter images. [Apple timeline preview frames](/docs/versions-and-previews) are a separate feature; native chapter menus do not display server-generated images. |
| Network-access providers | Configure an installed provider under **Admin > Settings > Network Access** and complete its authorization. The provider supplies the connection. |
| Server administration | Open the server in a browser and use web admin. |

## Podcasts and music

The server's library form includes **Podcasts**, but Silo does not provide a
complete podcast subscription and listening workflow. Use a dedicated podcast
app for subscriptions and episode downloads.

Music labels in an app do not provide a music-library setup path. The server's
library form has no **Music** option. Use a dedicated music app for albums,
artists, and playlists. For video and books, see
[library setup](/docs/manage-libraries#choose-a-library-type), [audiobooks](/docs/listen-to-audiobooks),
and [ebooks](/docs/ebooks).

<span id="no-usable-workflow-established"></span>

## Other feature names

| Feature | Available behavior or alternative |
| --- | --- |
| Scheduled home-section publication | Add, reorder, or hide rows in [web admin](/docs/home-sections). Seasonal rows select content; they do not schedule row publication. |
| Full timeline trickplay / BIF previews | Use chapter navigation or the client's [playback previews](/docs/versions-and-previews). These do not supply a pre-generated image for every timeline position. |
| Plugin publisher signatures | Catalog installs check checksums and show trust labels. These are not cryptographic publisher signatures. See [plugins](/docs/plugins). |
| AI audio dubbing | Choose an existing audio track or use [AI subtitles](/docs/missing-subtitles#translate-or-generate-with-ai). Silo does not generate a dubbed audio track. |
| Account creation during history import | [Create accounts and profiles](/docs/manage-accounts) before configuring [history-import mappings](/docs/import-household-watch-history). |
| Full interface localization | Media metadata language and date formatting are separate from the language of app controls. Changing metadata language does not translate the whole interface. |

This page does not announce release dates. Follow the linked setup guides;
hidden controls and custom database changes are not supported activation steps.
