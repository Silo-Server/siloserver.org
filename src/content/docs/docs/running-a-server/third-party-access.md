---
title: Enable third-party client access
description: Turn on Jellyfin compatibility and give other apps the correct server address.
---

Silo has a separate endpoint for apps that expect Jellyfin. The Silo web address
is not always the address to enter in those apps. Audiobookshelf setup is in
the [Beta section](/docs/beta/audiobookshelf), including its profile-PIN warning.

## Turn on compatibility

1. Open **Admin > Settings > Compatibility**.
2. Turn on **Allow Jellyfin apps to connect**.
3. For Jellyfin, fill in **Address Jellyfin apps should use** with the reachable compatibility URL.
4. Save and follow any restart notice.
5. Connect one app with an ordinary account and test browsing and playback before sharing the address more widely.

The **Jellyfin web player** controls manage downloaded web-player files separately. Save compatibility settings before installing those files, and wait for the install job to finish.

## Choose the endpoint

With the default Docker port mappings:

| App | Example address |
| --- | --- |
| Silo web or native app | `http://192.168.1.20:8090` |
| Jellyfin-compatible app | `http://192.168.1.20:8096` |

Replace the example IP with your server's address. Check your actual port mappings if you changed them. `localhost` on a phone refers to that phone, not your server.

## External access

Use a reachable HTTPS address for each endpoint you expose, for example separate Silo and Jellyfin hostnames. Point each one to the correct service port and follow the [reverse proxy guide](/docs/running-a-server/reverse-proxy).

Test from outside your home network with the same address you give users. A working Silo homepage does not test the other protocol ports or their streaming behavior.

## Accounts and profiles

Give users their Silo credentials and the [Jellyfin sign-in instructions](/docs/using-silo/jellyfin-apps).
Jellyfin compatibility can use a combined username/profile. Its protected-profile
flow also uses a password/PIN combination.

Record the app and server versions when investigating a failure. Supporting a protocol does not guarantee that every app implements every feature the same way.

## Scan integrations are separate

Legacy external Autoscan also uses the Jellyfin endpoint. New built-in scan sources are configured under [Libraries > Autoscan](/docs/running-a-server/autoscan).
