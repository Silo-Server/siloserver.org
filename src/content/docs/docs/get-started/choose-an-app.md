---
slug: docs/choose-an-app
keywords: ["download app", "iPhone app", "Android app", "Apple TV app", "Google TV", "TestFlight", "APK"]
questions: ["My friend invited me to their server, what do I download?", "How do I get Silo on my Apple TV?", "How do I install it on Android without the Play Store?", "Why does Android say signing certificate mismatch?"]
title: Choose an app
description: Pick a Silo app for your screen, then connect to your server.
---

If someone has invited you to their Silo server, you need one of these apps
and the server's address. The person who runs the server looks after the
media; you don't install anything server-side.

| Your device | What to use |
| --- | --- |
| Computer (any browser) | The web app. Open the server address in your browser; there's nothing to install. |
| Mac | The web app, or the [native Mac app](/docs/native-macos) (Beta) from the [TestFlight beta](#testflight-beta). |
| iPhone or iPad | [Silo Media Player on the App Store](https://apps.apple.com/us/app/silo-media-player/id6784878771), or the [TestFlight beta](#testflight-beta) for faster updates. |
| Apple TV | The same App Store app, installed from the TV's App Store. |
| Android phone or tablet | [Silo on Google Play](https://play.google.com/store/apps/details?id=org.siloserver.silo) (beta). |
| Android TV | The same Google Play listing, installed from the TV's Play Store. |

The guides call the app on iPhone, iPad, and Android phones and tablets the
mobile app, and the app on Apple TV and Android TV the TV app. Where the steps
differ between Apple and Android, they say so.

## Install on Apple devices

Silo Media Player is on the
[App Store](https://apps.apple.com/us/app/silo-media-player/id6784878771). One
app covers iPhone, iPad, and Apple TV. Install it from the App Store on each
device; on Apple TV, search for Silo Media Player in the TV's App Store.

The app needs iOS or iPadOS 18 or later on iPhone and iPad, and tvOS 26 or
later on Apple TV.

### TestFlight beta

The TestFlight beta gets new features and fixes sooner, before they reach the
App Store. Expect beta builds to change more often and to have more rough
edges.

1. Install Apple's TestFlight app on your iPhone, iPad, or Mac.
2. Open the [Silo TestFlight invitation](https://testflight.apple.com/join/XZy8cu5q)
   and accept it.
3. Select **Install** in TestFlight.

The TestFlight beta also has the [native Mac app](/docs/native-macos), which
needs macOS 26 or later.

For Apple TV, accept the invitation on an iPhone or iPad first. Sign in to
the TV with the same Apple Account, install TestFlight on the TV, then install
Silo from TestFlight. TestFlight doesn't offer email invitations, so if Apple TV
is your only Apple device, use the App Store app.

Each device runs one copy of Silo. Installing the TestFlight build replaces the
App Store version, and installing from the App Store replaces the TestFlight
build.

## Install on Android devices

Silo for Android is a beta on Google Play. One listing covers phones, tablets,
and Android TV, and Google Play installs the right version for each device.

1. Join the beta from the [testing page](https://play.google.com/apps/testing/org.siloserver.silo),
   signed in with the Google account your devices use.
2. Install Silo from its [Google Play listing](https://play.google.com/store/apps/details?id=org.siloserver.silo)
   on your phone or tablet, or search for Silo in the Play Store on your TV.

### Without Google Play

For a device without Google Play, download the app from the
[latest Silo Android beta](https://github.com/Silo-Server/silo-android/releases/tag/beta-latest).
Under **Assets**, choose `silo-android-latest-beta.apk` for a phone or tablet,
or `silo-android-tv-latest-beta.apk` for a TV. Open the file on the device to install it, and
allow installs from that source if Android asks. On a TV, copy the file over
with your usual file-transfer or sideloading app first.

On a TV, you can also use the **Downloader** app by AFTVnews instead of
copying a file. Install Downloader, enter the code for your device, and allow
Downloader to install apps when asked.

| App | Downloader code |
| --- | --- |
| Silo for Android phone or tablet | `2988950` |
| Silo for Android TV | `6033910` |

Download Silo only from the links on this page; other apps with similar names
aren't part of this project.

### Keep Silo updated with Obtainium

[Obtainium](https://github.com/ImranR98/Obtainium) installs Silo from its
GitHub releases and updates it when a new build comes out, so you don't have
to download each APK yourself. These steps follow the beta builds, the same
ones the Google Play beta gets.

1. Install Obtainium from its
   [releases page](https://github.com/ImranR98/Obtainium/releases). It's also
   on F-Droid and IzzyOnDroid.
2. Tap **Add app** and enter `https://github.com/Silo-Server/silo-android` in
   **App source URL**.
3. Under **Release selection**, turn on **Include prereleases**, then set
   **Filter release titles by regex** to `^Silo Android`. This skips the
   "Latest tester build" release, which repeats the newest build under another
   name.
4. Under **APK selection**, set **Filter links by regex** for your device.
   Each release has a phone APK and a TV APK.

   | Device | Filter links by regex |
   | --- | --- |
   | Phone or tablet | `^silo-android-\d.*\.apk$` |
   | Android TV | `^silo-android-tv-\d.*\.apk$` |

5. Tap **Add**, then **Install**, and allow Obtainium to install apps when
   Android asks. Obtainium checks for updates in the background and tells you
   when a new build is out.

If Obtainium shows **Signing certificate mismatch**, another copy of Silo is
already installed, from Google Play or from a different build. Tap **Don't
install**, uninstall that copy, then tap **Install** again. Uninstalling signs
that copy out and removes its downloads. If Android still won't install Silo,
uninstall any copy in a work profile or Island too.

## Next step

- On a computer, phone, or tablet: [Connect and start watching](/docs/connect-and-watch).
- On a TV: [Sign in on your TV](/docs/tv-sign-in).

## Other apps

If you already use an app made for Jellyfin, you may be able to connect it to
Silo instead. See [Connect a Jellyfin-compatible app](/docs/jellyfin-apps).

Audiobooks and ebooks are in Beta. See [Beta features](/docs/beta), or
[Audiobookshelf-compatible apps (Beta)](/docs/audiobookshelf) for a
listening app.
