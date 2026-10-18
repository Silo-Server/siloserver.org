---
slug: docs/profiles
title: Profiles, PINs, and shared devices
description: Set parental controls, protect profiles with PINs, and choose how a shared device opens Silo.
---

Each profile keeps its own watch progress, lists, and preferences. The account
password signs the household in; a four-digit PIN locks one profile. Library
access set by the server administrator applies to every profile.

The **primary profile** is the first profile on the account. Only the primary
profile can add, edit, and delete profiles, set parental controls, and change
the account password. That applies to a server administrator's account too:
its other profiles, including a kids profile, can't manage profiles. If the
primary profile has a PIN, Silo asks for it before you manage profiles. The
primary profile can't be deleted.

## Switch profiles

On **Who's watching?**, choose your profile and enter its PIN if asked. To
change profiles later, open the profile menu (your profile picture) and choose
**Switch Profile**. On a shared device, look at the profile picture before you
change settings or start playing something.

After five wrong PINs within five minutes, Silo locks that profile for five
minutes on every device, including Jellyfin apps that sign in with the PIN.
Until the lock ends, even the right PIN is refused. The web app says
`Too many incorrect PINs.` and how many minutes are left.

## Add or edit a profile

### In the web app

On **Who's watching?**, select **Add profile** or **Manage profiles**. If the
primary profile has a PIN, enter it.

- **Add profile** opens the **New profile** form without switching profiles.
  When you save, the new profile appears on **Who's watching?**.
- **Manage profiles** switches to the primary profile and opens
  **Settings > Profiles**.

**Settings > Profiles** lists every profile with **Use** (switch to it),
**Edit**, and **Delete**. You can also open it from the primary profile's
settings. You can't delete the primary profile or the profile you're using.

1. Select **New profile**, or **Edit** on an existing profile. If you came
   from **Add profile**, the form is already open.
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
   TV). If the primary profile has a PIN, enter it.
2. Select **Add Profile**, or the edit button on a profile to open
   **Edit Profile**.
3. On a phone or tablet, turn on **Require PIN** and enter a 4-digit PIN; turn
   it off to remove the PIN. On Android TV, fill in **PIN (optional)** or
   select **Remove**.
4. Choose a **Maximum rating**: the profile can watch titles at that rating
   and below, or any rating with **Any**. Under **Libraries**, keep **All
   libraries** or select **Choose libraries** and check at least one library
   the profile can browse. These limits work on any profile. For a child, turn
   on **Child Profile** first: it fills in PG and **Choose libraries** for the
   limits you haven't set yet. Turning it off clears both limits.
5. Select **Create Profile** or **Save Changes**.

### Forgotten PIN

Ask whoever manages the household's profiles to set a new PIN or remove it in
the web app. Setting a new PIN or removing it also ends a lock after too many
wrong PINs, so nobody has to wait out the five minutes. Don't delete the
profile to get around the PIN: deleting it also removes its watch history and
preferences.

## Set parental controls

The web app has every parental control. The Apple apps can set a content
rating and library limit when creating a child profile. The Android apps can
set them on any profile, when creating or editing it.

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

### Show advisory ages

In the web app, open **Settings > Title Pages** and, under **Age guidance**,
turn on **Show advisory age** to show the recommendation on title pages.

To show it on poster cards as well, open **Settings > Navigation & Cards**.
Under **Badges**, with **Show badges on posters** on, open
**Ratings & Certifications** and turn on **Advisory Age**. Cards then show the
age, such as `13+`, in the bottom-right corner. Titles without an advisory age
show no badge. The badge doesn't depend on **Show advisory age**; you can turn
on either one alone.

Both settings only change what's displayed; the profile's age limit applies
either way.

### Keep a child in their profile on a shared device

A PIN stops someone from switching into a profile, but a device that opens a
profile automatically reopens it without asking for the PIN. Phones, tablets,
and the web app do that by default. A TV does it once someone chooses to
remember a profile there.

- In the Apple and Android apps, set **Profile Selection** to **Every Time**
  (see below) so the device shows **Who's watching?** each time.
- In the web app, set **Profile at launch** to **Ask who's watching** (see
  below) so each new tab or window shows **Who's watching?**.
- On other devices, switch to the child's profile or sign out before you hand
  the device to a child.

## Choose what happens when Silo opens

### On Apple and Android devices

In the Apple apps and on Android TV, open
**Settings > General > Profile Selection**. On Apple TV it's under
**PROFILE AT LAUNCH**, and on Android TV under **Profile at Launch**. On an
Android phone or tablet, open **Settings** and select **Profile Selection**
under **Preferences**.

- **Automatic** reopens the last profile used on this device, without asking
  for its PIN. This is the default, except on a new TV. On Apple TV, it uses
  the profile paired with the current Apple TV user.
- **Every Time** shows **Who's watching?** whenever you return to Silo.
- **After 1 Hour** and **After 12 Hours** show it after that long away.

When **Who's watching?** appears this way, a profile with a PIN needs it
again. The setting applies only to that device.

A new Apple TV or Android TV starts at **Every Time**. After you choose the
first profile on it, the TV asks once whether to open that profile
automatically. **Remember** sets **Profile Selection** to **Automatic**, and
**Ask Every Time** (**Ask every time** on Android TV) keeps it at
**Every Time**. You can change it in Settings later. A TV that already opened
a profile automatically with an earlier version of Silo keeps doing so.

### In the web app

Open **Settings > Your Devices** and, under **This browser**, choose
**Profile at launch**:

- **Remember last profile** opens new tabs and windows with the profile last
  used in this browser. This is the default.
- **Ask who's watching** starts each new tab or window at **Who's watching?**,
  and a profile with a PIN needs it again. Reloading a tab keeps its profile,
  and tabs that are already open keep theirs.

The setting applies only to that browser.

For a lost or stolen device, see [Accounts and signed-in devices](/docs/accounts).
