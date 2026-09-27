---
slug: docs/audiobookshelf
beta: true
title: Audiobookshelf-compatible apps (Beta)
description: Connect a dedicated listening app to Silo's audiobook endpoint.
---

:::caution[Beta]
This feature is in Beta and may change or be removed in a future release.
:::

Apps that can connect to an Audiobookshelf server can also connect to Silo
and play its audiobooks. They use a separate address from the Silo web app
and from Jellyfin-compatible apps. If you run the server, start with
[Turn on the endpoint](#turn-on-the-endpoint); otherwise, ask the person who
runs it for the address.

:::danger[Profile PINs]
Audiobookshelf sign-in does not ask for a profile PIN. Anyone with the
account password can open any profile on that account, including a
PIN-protected one.
:::

## Sign in from a listening app

1. In your listening app, add an Audiobookshelf server using the address you
   were given.
2. Enter your Silo username and account password.
3. Open an audiobook library and play a book you know.
4. Pause, then reopen the book to see that progress was saved to the right
   profile.

A plain username signs in to the account's primary profile. To use another
profile, enter `username#profile`, for example `sam#Alex`, with the usual
account password. Do not add `#PIN` to the password as you would for a
Jellyfin app.

The listening app handles its own downloads, offline playback, and player
controls. Test a download before you rely on it away from home. Silo's
Audiobookshelf endpoint covers audiobooks only. To listen without a
third-party app, use [Silo's audiobook player](/docs/listen-to-audiobooks).

## Turn on the endpoint

With an administrator account, open **Admin > Settings > Compatibility** and
turn on **Allow Audiobookshelf apps to connect**. Save, then restart the
server if the page asks you to.

The default Compose file publishes the endpoint on port `13378`, separate
from Silo's web port. Give listeners an address for that port that they can
reach. Keep it on your home network, or put it behind HTTPS before you allow
access from outside.

## Reverse proxy

Behind a reverse proxy, listeners use the HTTPS address you set up for the
Audiobookshelf endpoint rather than the local port. See
[third-party access](/docs/third-party-access) for the proxy setup.

## Troubleshooting

If sign-in fails, sign in to Silo's web app with the same account first. An
account with a temporary password must change it there, because
Audiobookshelf apps cannot. Then check the endpoint address and the profile
name after `#`.
