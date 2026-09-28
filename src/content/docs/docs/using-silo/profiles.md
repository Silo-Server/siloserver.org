---
slug: docs/profiles
title: Profiles, PINs, and shared devices
description: Set parental controls, protect profiles with PINs, and choose how a shared device opens Silo.
---

Each profile keeps its own watch progress, lists, and preferences. The account
password signs the household in; a four-digit PIN locks one profile. Library
access set by the server administrator applies to every profile.

The **primary profile** is the first profile on the account. Only the primary
profile, or a server administrator, can add, edit, and delete profiles, set
parental controls, and change the account password. If the primary profile
has a PIN, Silo asks for it before you manage profiles. The primary profile
can't be deleted.

## Switch profiles

On **Who's watching?**, choose your profile and enter its PIN if asked. To
change profiles later, open the profile menu (your profile picture) and choose
**Switch Profile**. On a shared device, look at the profile picture before you
change settings or start playing something.

## Add or edit a profile

### In the web app

From the primary profile, open **Settings > Profiles**. The page lists every
profile with **Use** (switch to it), **Edit**, and **Delete**. You can't
delete the primary profile or the profile you're using.

1. Select **New profile**, or **Edit** on an existing profile.
2. Enter a **Name**.
3. To add a PIN, enter four digits in **PIN (optional)**. On a profile that
   already has a PIN, the field is **New PIN**: type a new PIN to replace it,
   or select **Remove PIN** to clear it (**Keep existing PIN** undoes that).
4. For a child, turn on **Kids profile** and set the limits described in
   [Set parental controls](#set-parental-controls).
5. Select **Save profile**.

### On iPhone, iPad, and Apple TV

1. On **Who's watching?**, select **Add Profile**. If the primary profile has
   a PIN, enter it.
2. On **New Profile**, enter a name and, if you want one, a PIN under
   **PIN (optional)**.
3. For a child, turn on **Child Profile**. Choose a **Maximum content rating**
   and, if you like, turn on **Restrict libraries** and pick the libraries.
4. Select **Create Profile**.

The Apple apps can't edit or delete a profile or change its PIN afterwards.
Use the web app for that.

### On Android phones, tablets, and TVs

Only server administrators see profile management in the Android apps. Other
household managers use the web app.

1. On the profile picker, select **Manage Profiles** (**Manage** on Android
   TV).
2. Select **Add Profile**, or the edit button on a profile to open
   **Edit Profile**.
3. On a phone or tablet, turn on **Require PIN** and enter a 4-digit PIN; turn
   it off to remove the PIN. On Android TV, fill in **PIN (optional)** or
   select **Remove**.
4. For a child, turn on **Child Profile** and choose a **Max Content Rating**.
5. Select **Create Profile** or **Save Changes**.

### Forgotten PIN

Ask whoever manages the household's profiles to set a new PIN or remove it in
the web app. Don't delete the profile to get around the PIN: deleting it also
removes its watch history and preferences.

## Set parental controls

The web app has every parental control. The Apple apps can set a content
rating and library limit when creating a child profile, and the Android apps
only **Max Content Rating**.

In the web app, from the primary profile, open **Settings > Profiles** and
select **Edit** on the profile you want to restrict. The web app calls it a
**Kids profile**; the mobile and TV apps call it a **Child Profile**.

1. Under **Access**, turn on **Kids profile**. This fills in safer starting
   settings; look over the rating and library choices before saving.
2. Choose **Maximum content rating** and, for an extra limit,
   **Maximum advisory age**.
3. With an advisory-age limit selected, decide whether to turn on
   **Hide titles without an advisory age**.
4. Turn on **Restrict libraries** to choose which of the account's libraries
   this profile can browse. Select at least one library.
5. Select **Save profile**. Switch to that profile and open a title you expect
   to see and one you expect to be hidden.

| Control | What it does |
| --- | --- |
| **Maximum content rating** | Limits titles by their movie or TV certification. Silo compares recognized ratings across national systems using viewer ages and rating tiers. |
| **Maximum advisory age** | Adds a limit from 1 to 21 using recommendations from an advisory service, such as Common Sense Media. A title with an advisory age above your limit is hidden. |
| **Hide titles without an advisory age** | With an advisory-age limit set, also hides titles that have no advisory age. When off, those titles are limited by the content rating and library settings only. |

When both rating limits are set, a title must pass both. For example, an
advisory-age limit of 12 hides a title marked 13+ even if its content rating
is allowed. Episodes use their series' advisory age.

Advisory ages come from metadata providers and fill in over time as the
library updates. Until then, a title without an age is limited by its content
rating only, unless you turn on **Hide titles without an advisory age**. That
setting can leave few titles visible at first, and a newly added age can hide
a title that exceeds your limit.

Titles with no content rating are a separate case: the server's settings
decide whether they appear under a content-rating limit. See
[account access and profile restrictions](/docs/manage-access#check-household-restrictions).

### Show advisory ages on title pages

In the web app, open **Settings > Playback** and turn on **Show advisory age**
to show the recommendation on title pages. This only changes what's displayed;
the profile's age limit applies either way.

### Keep a child in their profile on a shared device

A PIN stops someone from switching into a profile. By default, though, Silo
reopens the last profile used on a device without asking for its PIN again.

- On iPhone, iPad, and Apple TV, set **Profile Selection** to **Every Time**
  (see below) so the device shows **Who's watching?** each time.
- The Android apps and the web app have no such setting. Before
  you hand the device to a child, switch to the child's profile or sign out.

## Choose what happens when Silo opens on Apple devices

Open **Settings > General > Profile Selection**. On Apple TV it's under
**PROFILE AT LAUNCH**.

- **Automatic** reopens the last profile used on this device, without asking
  for its PIN. On Apple TV, it uses the profile paired with the current Apple
  TV user.
- **Every Time** shows **Who's watching?** whenever you return to Silo.
- **After 1 Hour** and **After 12 Hours** show it after that long away.

The setting applies only to that device.

For a lost or stolen device, see [Accounts and signed-in devices](/docs/accounts).
