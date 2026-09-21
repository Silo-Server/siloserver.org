---
slug: docs/privacy
title: Understand where information goes
description: Check the services used for metadata, subtitles, notifications, and diagnostic reports.
---

Your server stores your library and account data. Optional features can send
information to other services. Ask the server administrator which providers
they use before connecting an external account or requesting AI processing.

## Metadata, subtitles, and AI

Metadata providers look up titles and artwork. Subtitle providers search for
tracks. Those lookups can reach services outside your home, including a
provider proxy when configured.

AI text translation sends text to the configured model. Speech-to-text sends
audio for transcription. A model running on the server operator's own
equipment has a different destination from a hosted AI service. Check with
the administrator before processing material you do not want sent externally.

Administrators can review [plugins](/docs/plugins),
[subtitle providers](/docs/subtitle-providers), and
[AI settings](/docs/ai-services).

## Notifications and connected services

Email, Discord, webhooks, and push delivery use their configured delivery
services. The channel and event determine what is sent. Review your
[notification choices](/docs/notification-inbox) and avoid publishing
webhook URLs or connection credentials.

[History imports](/docs/import-watch-history) connect Silo to
another media server. Use only an account you are allowed to connect.

## Choose where diagnostics are sent

In a native app, open **Settings > Diagnostics** and check the destination
before sending a report:

- **Silo Diagnostics** sends a report to the project's diagnostic service.
- **My Silo Server** on Apple, or **This Silo server** on Android, sends it to
  the server you use, where its administrator can investigate it.

Read the destination's disclosure before sending. On Apple, **Send Diagnostics
Now** uploads immediately without a separate report preview or confirmation,
even when reporting is set to **Ask**. On Android, the manual action opens a
report review screen before you send.

Automatic reporting, where offered, affects future reports too. Choose **Ask**
or **Ask before sending** if you want to approve those reports individually.
The available options depend on the app and destination.

Diagnostic reports can contain device details and logs. A report sent to a
self-hosted server can include playback-session identifiers. Review the
information shown in the app rather than assuming every destination receives
the same bundle. See [Report a problem](/docs/report-a-problem#native-app-diagnostics).

## Sharing evidence publicly

A diagnostic upload and a public GitHub issue are different actions. Before
posting logs, remove passwords, tokens, cookies, private addresses, and personal
media details. Automatic redaction is not a reason to skip that check.

This page explains product behavior. The website's [privacy policy](https://siloserver.org/privacy)
describes the project's published policy; your server operator and external
providers may have separate policies.
