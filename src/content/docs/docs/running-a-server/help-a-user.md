---
slug: docs/help-a-user
title: Help a user and view their account
description: Inspect settings and device overrides, or use View as user to investigate an account problem.
---

Ask which server, account, profile, and device show the problem. A setting that is wrong on one TV may be a device override rather than an account-wide preference.

## Find the setting that differs

1. Open **Admin > Users** and select the person.
2. Open **Settings** to inspect saved user and profile settings.
3. Open **Devices** for values saved to a particular device. Match its device name and profile to the report.
4. Compare the affected value with the inherited value before changing it.

For a server-wide view, **Admin > Devices** can search by device, user, ID, or profile.

## Reset one override

Use the affected setting's reset action and read **Reset this override?** before confirming. Resetting removes that saved override so the inherited setting can apply. Ask the user to reopen the affected screen and check the result.

Avoid clearing unrelated settings. These views include raw values for advanced investigation; a reset is safer than guessing a replacement JSON value.

## See the user's view

**View as user** lets you use an account in the web app without its password. This is an impersonation session: actions run as that user and can change their settings, lists, or watch history. Agree on the check with the account owner before starting.

1. Sign in with an administrator account and open **Admin > Users**.
2. Open the person's account and choose **View as user**. The Users list also has a **View as user** action beside eligible accounts.
3. Read the confirmation and choose **View as user** to continue.
4. Choose the affected profile on the profile picker. The **Viewing as** banner identifies the account you are using. Your admin access is unavailable during this session.
5. Check the reported screen. Avoid unrelated playback or edits: changes affect the user's real account.
6. Choose **End session** in the banner to finish and return to your administrator session.

This shows the web app as that account; it does not reproduce a native app's device-specific interface. For a problem on one phone or TV, also inspect its saved device overrides above.

### When View as user is unavailable

The target account must be enabled and have the **User** role. You cannot view as another administrator, yourself, or start another impersonation session while already in one. End the current session before choosing someone else.

### Return to administration

Use **End session** rather than signing out to return to the administrator session saved by the browser. Ending the session does not undo changes made while viewing as the user. If the saved administrator session is no longer available or valid, sign in again with your own administrator account.

If the problem is missing content, also check [access and limits](/docs/manage-access).
