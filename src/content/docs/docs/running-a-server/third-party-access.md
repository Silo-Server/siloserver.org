---
slug: docs/third-party-access
title: Enable third-party client access
description: Turn on Jellyfin compatibility and give other apps the correct server address.
---

Apps built for Jellyfin can connect to Silo on a separate port, 8096 in the default Docker setup. Jellyfin compatibility is on by default, but until you set an address people can reach, Silo's connection instructions show them `http://127.0.0.1:8096`. Audiobookshelf setup is in the [Beta section](/docs/audiobookshelf), including its profile-PIN warning.

## Jellyfin apps

### Set the address

1. Open **Admin > Integrations > Compatibility**.
2. Check that **Allow Jellyfin apps to connect** is on. Changing this switch needs a server restart.
3. In **Address Jellyfin apps should use**, enter the address people should type into their Jellyfin app, for example `http://192.168.1.20:8096` on your home network or `https://jellyfin.example.com` from outside it.
4. Save.
5. Connect one app with a regular account and try browsing and playback before sharing the address.

`localhost` or `127.0.0.1` on a phone, tablet, or TV refers to that device, not your server. If you changed the Docker port mappings, use your own port. The [Docker guide](/docs/docker) lists the default ports.

The **Jellyfin web player** controls install or remove the Jellyfin web player, which Jellyfin mobile and TV apps expect to find on the server. Save the compatibility settings first, then wait for the install to finish.

### Access from outside your network

Give each service its own HTTPS address, for example separate hostnames for Silo and for Jellyfin apps, and point each one at the right port. See the [reverse proxy guide](/docs/reverse-proxy).

Test from outside your home network with the same address you give people. A working Silo web page doesn't mean the Jellyfin port is reachable.

### Accounts and profiles

Give people their Silo credentials and the [Jellyfin sign-in instructions](/docs/jellyfin-apps). Apps that offer Quick Connect sign in with a code the person approves on Silo's `/activate` page, where they choose the profile. Other apps sign in with a combined username and profile, and protected profiles use a combined password and PIN.

Apps differ in which Jellyfin features they use, so note the app and server versions when you report a problem.

## Seerr

Seerr (formerly Jellyseerr) connects to Silo as a Jellyfin server, but its setup can't finish with a Silo account, because Silo doesn't report any account as a Jellyfin administrator. If your Seerr already connects to Silo, people sign in to it with their Silo accounts, the same way they [sign in to Jellyfin apps with a profile](/docs/jellyfin-apps#sign-in-with-your-profile).

Seerr shows a user's uploaded Silo profile picture. With a preset avatar, it shows its own default picture instead. It also falls back to that picture once the user has no active Jellyfin sign-in: after a password reset or **Sign out everywhere**, or 30 days after their last Seerr sign-in if they don't use a Jellyfin app. Signing in again brings the picture back.

### Relink users after the user ID change

Silo sends Jellyfin user IDs without dashes, as Jellyfin does, but earlier versions included them. Seerr matches returning users by that ID, so people who signed in to Seerr before the change no longer match their account. Seerr refuses their sign-in, or creates a second account if **Enable New Jellyfin Sign-In** is on.

Run this fix once. If **Enable New Jellyfin Sign-In** is on, stop Seerr before you update Silo so no one gets a second account. Jellyfin apps don't need this step. Both statements below work on Seerr's SQLite and PostgreSQL databases.

1. Stop Seerr and back up its database.
2. If Seerr ran after the update, find the second accounts it created:

   ```sql
   SELECT "id", "email", "jellyfinUsername" FROM "user" WHERE "jellyfinUserId" IN (SELECT REPLACE("jellyfinUserId", '-', '') FROM "user" WHERE "jellyfinUserId" LIKE '%-%');
   ```

   Each row is a duplicate account. Start Seerr, delete those accounts on its **Users** page, and stop Seerr again. Deleting an account also deletes its requests, so tell those people to request the titles again.
3. Remove the dashes from the saved user IDs and avatar addresses:

   ```sql
   UPDATE "user" SET "jellyfinUserId" = REPLACE("jellyfinUserId", '-', ''), "avatar" = REPLACE("avatar", "jellyfinUserId", REPLACE("jellyfinUserId", '-', '')) WHERE "jellyfinUserId" LIKE '%-%';
   ```

4. Start Seerr.

## Legacy Autoscan

An external Autoscan service connects through the Jellyfin port. New setups should use Silo's built-in [Autoscan sources](/docs/autoscan) instead.
