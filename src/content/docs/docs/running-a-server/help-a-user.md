---
slug: docs/help-a-user
title: Help a user and view their account
description: Inspect settings and device overrides, or use View as user to investigate an account problem.
---

Ask which server, account, profile, and device show the problem. A setting that is wrong on one TV may be saved for that device only.

## Find the setting that differs

1. Open **Admin > Users** and select the person.
2. Open **Preferences**. Choose a profile to see its saved settings and its
   home screen rows, or choose one of its devices to see the values saved on
   that device. Match the device name and profile to the report.
3. Compare the affected value with the value it replaces before changing it.

For a server-wide view, **Admin > Devices** can search by device, user, ID, or
profile. A device's **All Settings** tab lists every setting it uses and
whether the value is set on the device, comes from the profile, or is the app
default.

## Reset one override

On **Admin > Devices**, use the setting's reset action and confirm **Reset this
override?**. On **Preferences**, select the trash button beside the setting and
confirm. The inherited
setting then applies again. Ask the user to reopen the affected screen.

These views also show raw values. Reset a wrong value rather than typing in a
replacement, and leave unrelated settings alone.

## Fix a profile's home screen

On **Preferences**, choose the profile. Its **Home sections** card lists the
rows in the order that profile sees them. Drag a row to move it, select the eye
to show or hide it, or choose **Reset to default** to go back to the server's
layout. The change applies to that profile only.

## See the user's view

**View as user** lets you use someone's account in the web app without their password. Anything you do runs as that user and can change their settings, lists, or watch history, so agree on what you'll check with them first.

1. Sign in with an administrator account and open **Admin > Users**.
2. Open the person's account and choose **View as user**. The Users list also has a **View as user** action beside eligible accounts.
3. Read the confirmation and choose **View as user** to continue.
4. Choose the affected profile on the profile picker. The **Viewing as** banner identifies the account you are using. Your admin access is unavailable during this session.
5. Look at the screen they reported. Avoid other playback or edits.
6. Choose **End session** in the banner to return to your administrator session.

This shows the web app only. For a problem on one phone, tablet, or TV, also look at that device's saved overrides.

### When View as user is unavailable

The target account must be enabled and have the **User** role. You cannot view as another administrator, yourself, or start another impersonation session while already in one. End the current session before choosing someone else.

### Return to administration

Use **End session** rather than signing out to return to your administrator session. Changes you made while viewing as the user stay. If your administrator session has expired, sign in again.

If the problem is missing content, also check [access and limits](/docs/manage-access).
