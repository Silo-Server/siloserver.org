---
slug: docs/manage-accounts
title: Invite people and manage accounts
description: Give someone access to your server, change their account, or help them sign in.
---

Use an invitation when someone should choose their own password. Create an account yourself when you need to set it up before handing it over. Both actions are in **Admin > Users** in the web app.

An account is a sign-in for your server. Its profiles keep household members' history and preferences separate. Make most people **User**, even if they manage profiles for their family. **Admin** gives control of the server.

## Invite someone

1. Open **Admin > Users > Invitations** and choose **Invite someone**.
2. Enter their email address. This will also be their sign-in username.
3. Choose an **Access group** and check the library access. Leave **Role** set to **User**.
4. Keep **Create their first profile** on if they need a ready-to-use profile.
5. Choose **Send invite**. If email delivery is unavailable, copy the invitation link and send it privately.

The link is single-use and expires after seven days. The recipient chooses a password, then signs in to your server. Send them [Join a server](/docs/connect-and-watch) with the invitation.

If the link expires, use the invitation's resend action. **Revoke** stops a pending link from working; it does not remove an account that has already accepted an invitation.

## Create an account yourself

1. In **Admin > Users**, choose **Add User**.
2. Enter a username, email address, and password. Keep **Create a default profile** selected unless you plan to add profiles separately.
3. Select **Require change at first sign-in** so the person chooses their own password before using the account.
4. Review **Access** and **Limits**, then create the user.
5. Share the server address and credentials privately. Have the person sign in through the web app first to choose their password.

For a group of people with the same access, [configure an access group](/docs/manage-access) first.

## Change access or reset a password

Open the person's name in **Admin > Users**, then choose **Edit** to change their access. Leave the password blank to keep it unchanged. For a forgotten password, use the reset options below.

To suspend access while retaining the account, turn off **Enabled** under **Account status**, then save. Avoid **Delete** when you only need a temporary suspension.

The **Profiles** tab shows the household profiles attached to the account. Check the profile as well as the account when investigating missing media or unexpected restrictions.

To check the web app as an enabled, non-admin account, use [View as user](/docs/help-a-user#see-the-users-view). Actions in that session affect the user's account.

### Help someone reset their password

For an enabled account that uses a local password:

1. Open the person's name in **Admin > Users** and choose **Reset password**.
2. Choose **Email reset link**, or **Create link to share** and then **Copy link** to send it privately.
3. Have the person open the link and choose a new password.

Reset links need the server's public URL set in General settings. Email delivery also needs [email configured](/docs/notification-delivery#set-up-email) and an email address on the account. A link works once and expires after 24 hours. Creating another admin reset link replaces the previous one.

If you need to hand over a temporary password instead, choose **Edit**, enter a new password, and select **Require change at next sign-in** before saving. Have the person sign in through the web app to replace it before returning to their other apps.

Completing a reset link or setting a temporary password signs the account out on its devices. API keys remain active; [revoke those separately](/docs/integration-credentials#replace-a-key) if the account was compromised. For accounts managed by another sign-in provider, reset the password with that provider.

### Let people reset their own passwords

Set the server's public URL in General settings and [configure email](/docs/notification-delivery#set-up-email), then turn on **Self-service password reset** in General settings and save. It is off by default. The web sign-in page shows **Forgot password?** when these requirements are met.

People can request a link using their username or email address. These links expire after one hour. See [Forgot your password?](/docs/accounts#forgot-your-password) for the steps to share with them.

## A lost device or unwanted playback

Use [active playback controls](/docs/active-playback) to stop a stream. Stopping playback does not sign the account out. If an account is compromised, disable it while you arrange recovery with its owner.

The admin **Devices** view describes saved preferences and device overrides. Removing an override is not a way to revoke a login.
