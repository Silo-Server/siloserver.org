---
slug: docs/tv-sign-in
title: Sign in on your TV
description: Use a nearby signed-in phone, a browser code, or your password to set up Silo on a TV.
---

Open Silo on your Apple TV or Android TV. The easiest way to set it up is with
a phone or tablet that's already signed in to Silo. You can also scan a code
or type your password with the remote.

## Use a nearby phone or tablet

Put both devices on the same home network and leave Silo open on the TV's
setup screen. Allow local-network access on the phone if it asks.

1. Open Silo on your phone or tablet. Select **Set Up** on the card offering
   to set up the TV.
2. Choose the server or servers to add, then select **Continue**.
3. If the TV asks **Allow this setup?**, select **Allow** on the TV.
4. Compare the code on both screens. Select **Yes, this matches** on the
   phone only if they're the same.
5. When sign-in finishes, choose a profile on the TV.

Apple and Android work together here: an iPhone or iPad can set up either TV
app, and so can an Android phone or tablet.

If the card doesn't appear, guest Wi-Fi or network isolation may be keeping
the devices apart. Use one of the methods below instead.

## Scan the TV's code

First connect the TV to your server. On the setup screen, enter the address
under **Server address**, including any port number, and select
**Connect to server**. On Apple TV, **Protocol and port** lets you set those
separately. If Android TV warns that the server uses unencrypted HTTP,
continue only if you trust the address and it's on your home network.

The TV then shows a sign-in screen with a QR code.

1. Scan the QR code with your phone's camera and open the link.
2. Sign in to the server if asked.
3. Check that the code on the page matches the TV, then select
   **Approve sign-in**.
4. On the TV, choose a profile.

You can also open the server's `/activate` page in any browser and type the
code shown on the TV. If the code has expired, start sign-in again on the TV.
Only approve a request you started yourself.

## Use a password instead

After connecting to the server, select **Sign in with a password** on the TV
and enter your Silo username and password. If the server address is wrong,
**Use another server** takes you back. If your profile has a PIN, you enter it
after signing in.

Once the TV is set up, you can [control it from your phone](/docs/tv-remote).
