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
setup screen. Allow local-network access on the phone or tablet if it asks.

1. Open Silo on your phone or tablet. Select **Set Up** on the card offering
   to set up the TV.
2. Choose the server or servers to add, then select **Continue**.
3. If the TV asks **Allow this setup?**, select **Allow** on the TV.
4. Compare the code on both screens. Select **Yes, this matches** on the
   phone or tablet only if they're the same.
5. When sign-in finishes, choose a profile on the TV.

Any phone or tablet can set up either TV: an iPhone can set up an Android TV,
and an Android phone can set up an Apple TV.

If the card doesn't appear, guest Wi-Fi or network isolation may be keeping
the devices apart. Use one of the methods below instead.

## Scan the TV's code

First connect the TV to your server. On Apple TV, if your server is listed
under **No phone nearby?**, select it. Otherwise select **Enter server
address**, type the address, including any port number, and select
**Connect**. On Apple TV, **Advanced options** lets you set the protocol and
port separately. If the TV asks **Connect without encryption?**, continue
only if you trust the address and it's on your home network.

The TV then shows a sign-in screen with a QR code.

1. Scan the QR code with your phone's camera and open the link.
2. Sign in to the server if asked, with your password or the
   **Sign in with** button.
3. Check that the code on the page matches the TV, then select
   **Sign in TV**.
4. On the TV, choose a profile.

You can also open the server's `/activate` page in any browser and type the
code shown on the TV. It's eight digits, shown in two groups of four, and lasts
15 minutes. If the code has expired, start sign-in again on the TV. Only
approve a request you started yourself.

The QR code opens the server's public address when it has one, otherwise the
address the TV connected with. Your phone needs to be able to open it.

## Use a password instead

After connecting to the server, select **Sign in with a password** on the TV
and enter your username and password. If the server address is wrong,
**Change server** takes you back. If your profile has a PIN, you enter it
after signing in.

If you sign in to Silo with a **Sign in with** button, scan the TV's code
instead and sign in on your phone. Servers that sign in only that way don't
show **Sign in with a password** on the TV.

Once the TV is set up, you can [control it from your phone or
tablet](/docs/tv-remote).
