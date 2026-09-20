---
title: Sign in on your TV
description: Use a nearby signed-in phone, a browser code, or your password to set up Silo on a TV.
---

Open the Silo app on your Apple TV or Android TV. You can set it up with a
signed-in phone or tablet, or use the server address and your account password.

## Use a nearby phone or tablet

Keep both devices on the same home network, with Silo open on the TV's setup
screen. Sign in to Silo on the phone first. Allow local-network access if
your device asks for it.

1. Open Silo on your phone or tablet. Select **Set Up** on the nearby-TV offer.
2. Choose the server or servers to add, then select **Continue**.
3. If the TV asks **Allow this setup?**, select **Allow** on the TV.
4. Compare the displayed code on both screens. Select **Yes, this matches**
   on the phone only when the codes agree.
5. Wait for sign-in to finish, then choose a profile on the TV.

The nearby setup protocol connects Apple and Android devices: an iPhone or
iPad can set up either TV app, and an Android phone or tablet can do the same.
If the offer does not appear, use the browser method below.

## Scan the TV's code

First connect the TV to your server. On the setup screen, enter the full
address your administrator gave you under **Server address**, including
`http://` or `https://` and any port number. Select **Connect to server**.
On Apple TV, **Protocol and port** also lets you set those parts separately.
If Android TV asks to use unencrypted HTTP, continue only for an address
you trust on your private network.

After connecting, the TV shows its sign-in screen and QR code.

1. Scan the QR code with your phone's camera. Open the link it shows.
2. Sign in to the correct Silo server if asked.
3. Check the device details and match code against your TV, then select
   **Approve sign-in**.
4. Return to the TV and choose a profile.

You can also open the server's `/activate` page in a browser and enter the
code shown on the TV. An expired code needs a new sign-in request from the TV.
Never approve a request you did not start.

## Use a password instead

Connect to the server as described above. Select **Sign in with a password**
on the TV, then enter your Silo username
and password. **Use another server** returns to server selection if the
address is wrong. Your profile PIN, when required, is a separate step after
account sign-in.

Guest Wi-Fi and network isolation can prevent nearby discovery even when
both devices have internet access. Keep Silo in the foreground on the TV;
use the QR or password route if discovery still fails.

Once setup is complete, [use your phone as a TV remote](/docs/using-silo/tv-remote).
