---
slug: docs/manage-accounts
title: Invite people and manage accounts
description: Give someone access to your server, change their account, or help them sign in.
---

Use an invitation when someone should choose their own password. Create an account yourself when you need to set it up before handing it over. Both actions are in **Admin > Users** in the web app.

An account is a sign-in for your server. Its profiles keep household members' history and preferences separate. Make most people **User**, even if they manage profiles for their family. **Admin** gives control of the server.

If people sign in with an identity provider such as authentik or Active Directory, see [Set up single sign-on](/docs/single-sign-on). Their accounts can be created the first time they sign in.

Invitation and password reset links point to your server's **Silo public URL**. Set it in **Admin > Settings > General** first, using an address the recipient can open. Without it, Silo can't create these links.

## Invite someone

1. Open **Admin > Users > Invitations** and choose **Invite someone**.
2. Enter their email address. This will also be their sign-in username.
3. Choose an **Access group** and check the library access. Leave **Role** set to **User**.
4. Keep **Create their first profile** on if they need a ready-to-use profile.
5. Choose **Send invite**. If email isn't set up, copy the invitation link and send it privately.

The link works once and expires after seven days. The recipient chooses a password, then signs in to your server. Send them [Join a server](/docs/connect-and-watch) with the invitation.

If the link expires, resend the invitation to create a new link. Revoking a pending invitation stops its link from working; it doesn't remove an account that has already accepted.

Invitations create accounts with a Silo password, so they can't be sent or accepted while **Allow password sign-in** is off in **Admin > Settings > Sign-in**. People join by signing in with the [sign-in provider](/docs/single-sign-on) instead.

## Create an account yourself

1. In **Admin > Users**, choose **Add User**.
2. Enter a username, email address, and password. Keep **Create a default profile** selected unless you plan to add profiles separately.
3. Select **Require change at first sign-in** so the person chooses their own password before using the account.
4. Review **Access** and **Limits**, then create the user.
5. Share the server address and credentials privately. Ask the person to sign in through the web app first to choose their password.

For a group of people with the same access, [configure an access group](/docs/manage-access) first.

## Change access or reset a password

Open the person's name in **Admin > Users**, then choose **Edit** to change their access. Leave the password blank to keep it unchanged.

To suspend an account without deleting it, turn off **Enabled** under **Account status**, then save.

The **Profiles** tab lists the account's household profiles. Missing media or unexpected restrictions can come from the profile as well as the account.

To see the web app as that person does, use [View as user](/docs/help-a-user#see-the-users-view). Actions in that session affect their account.

### Help someone reset their password

For an enabled account that uses a local password:

1. Open the person's name in **Admin > Users** and choose **Reset password**.
2. Choose **Email reset link**, or **Create link to share** and then **Copy link** to send it privately.
3. Have the person open the link and choose a new password.

Emailing the link needs [email set up](/docs/notification-delivery#set-up-email) and an email address on the account. A link works once and expires after 24 hours. Creating a new reset link replaces the previous one.

To hand over a temporary password instead, choose **Edit**, enter a new password, and select **Require change at next sign-in** before saving. The person then signs in through the web app to replace it before using their other apps.

Completing a reset link or setting a temporary password signs the account out on its devices. API keys remain active; [revoke those separately](/docs/api-keys#replace-a-key) if the account was compromised. For accounts connected to a [sign-in provider](/docs/single-sign-on), reset the password with that provider.

### Let people reset their own passwords

Set the **Silo public URL** and [set up email](/docs/notification-delivery#set-up-email), then turn on **Self-service password reset** in **Admin > Settings > General** and save. It is off by default. The web sign-in page then shows **Forgot password?**.

People can request a link using their username or email address. These links expire after one hour. See [Forgot your password?](/docs/accounts#forgot-your-password) for the steps to share with them.

## Sign-in and break-glass accounts

When the server uses [single sign-on](/docs/single-sign-on), open the person's name in **Admin > Users** and choose the **Sign-in** tab to see how the account signs in.

**Password sign-in** says whether the account can sign in with a Silo password. Connecting a sign-in provider turns it off, unless the account is break-glass. To turn it back on, for example when the account's provider is gone, choose **Set a password**. While it's off, the page header shows **Set password** where other accounts show **Reset password**.

**Break-glass account**, on admin accounts, keeps password sign-in when it's turned off for the server, so the admin can still get in if the provider is down. The server owner is break-glass by default, and only the owner can change this switch. Make sure at least one break-glass admin knows their Silo password. To sign in with it, see [If you're locked out](/docs/single-sign-on#if-youre-locked-out).

**Sign-in provider identities** lists the provider accounts this account signs in with. Choose **Unlink** to remove one. **Connect identity** connects one by hand, but it needs the provider's exact ID for the person, which the dialog explains. It's usually easier to have the person [connect it themselves](/docs/accounts#connect-a-sign-in-provider) while they still have a Silo password.

## A lost device or unwanted playback

To sign out a lost device, open the person's name in **Admin > Users** and choose the **Sign-in** tab. **Signed-in sessions** lists the browsers and apps signed in to the account, with each one's device, last activity, and sign-in time. Choose **Sign out** on a row to end that session, or **Sign out everywhere** to end all of them. The password stays the same and the account stays enabled, so the person signs back in on the devices they still have.

A signed-out session loses access on its next request, though a video already playing may not stop right away. **Sign out everywhere** also signs the account out of [Jellyfin-compatible apps](/docs/jellyfin-apps) and [Audiobookshelf-compatible apps](/docs/audiobookshelf), and cancels TV sign-ins the account approved that the TV hasn't finished yet. Those apps don't appear in the list, and signing out one session leaves them signed in. API keys are separate; [revoke them](/docs/api-keys#replace-a-key) if the account was compromised.

Only the server owner can sign out another admin or the owner. Any admin can sign out their own sessions.

People can sign out their own sessions in **Settings > Signed-in sessions**; see [See where you're signed in](/docs/accounts#see-where-youre-signed-in).

Use [active playback controls](/docs/active-playback) to stop a stream. Stopping playback doesn't sign the account out. If an account is compromised, disable it while you arrange recovery with the person it belongs to.

The admin **Devices** view holds saved preferences and device overrides, not sign-ins.
