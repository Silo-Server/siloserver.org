---
title: Audiobookshelf-compatible apps (Beta)
description: Connect a dedicated listening app to Silo's audiobook endpoint.
---

:::caution[Beta]
Audiobooks and their compatibility endpoint are outside the supported 1.0
release scope. This guide does not certify any third-party client. The
endpoint does not enforce a separate profile PIN; review household access
before allowing it.
:::

Ask the administrator for the Audiobookshelf-compatible address and your
Silo credentials. This address may differ from both the Silo web address
and its Jellyfin-compatible address.

## Endpoint

1. In your listening app, add an Audiobookshelf server using the supplied address.
2. Enter your Silo username and account password.
3. Sign in, open an audiobook library, and play a familiar book.
4. Pause and reopen it to check that progress belongs to the intended profile.

A plain username selects the account's primary profile. To choose another
profile, enter `username#profile`, for example `sam#Alex`, with the ordinary
account password. Unlike Jellyfin compatibility, do not append `#PIN` to
the password here.

The current Audiobookshelf sign-in path does not enforce a separate profile
PIN. Ask the administrator whether this connection is appropriate for an
account with protected household profiles.

## Clients

Use an app that offers an Audiobookshelf server connection. App features,
token refresh, and offline playback can differ between releases; this guide
does not certify a particular third-party app build.

## What works

Start by checking library browsing, book playback, chapters, and resumed
progress. Test an offline download before depending on it away from home.
The third-party app controls its own download storage and playback interface.

## Scope

This guide covers audiobook connections. It does not promise podcast,
ebook, or send-to-ereader support through an Audiobookshelf client. For
playback without a third-party app, use
[Silo's audiobook player](/docs/beta/audiobooks).

## Server setup

An administrator opens **Admin > Settings > Compatibility** and turns on
**Allow Audiobookshelf apps to connect**. Save and follow any restart notice.
The default Compose endpoint is port `13378`, separate from Silo's web app.
Give listeners a reachable address for this endpoint. Keep it on your trusted
network or place it behind HTTPS before allowing remote access.

## Reverse Proxy

Use the reachable HTTPS address your administrator supplies, not a local
port copied from a server tutorial. Operators can configure
[third-party access](/docs/running-a-server/third-party-access).

## Source notes

If sign-in fails, check the account in Silo's web app, then confirm the
compatibility address and profile name. Report the client and server versions
without sharing passwords or tokens.
