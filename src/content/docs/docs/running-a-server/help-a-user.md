---
title: Help a user with settings
description: Find a profile or device override and inspect a user's view when necessary.
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

Use impersonation only when inspecting settings is not enough, and agree on the check with the account owner first.

1. In the user's admin page, choose **Impersonate** and confirm.
2. Select the affected profile. Your admin access is unavailable during the session.
3. Check the reported screen. Actions you take can change that user's state, so avoid playing, rating, or editing unrelated content.
4. Use the impersonation banner's **End impersonation session** control to return to your admin session.

Impersonation is unavailable for administrator accounts. If the problem is missing content, also check [access and limits](/docs/running-a-server/access).
