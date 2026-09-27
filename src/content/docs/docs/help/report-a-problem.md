---
slug: docs/report-a-problem
title: Report a problem
description: Share the steps, versions, and evidence needed to investigate a Silo problem.
---

Check [Find help](/docs/help) first. If someone else runs your server, ask
them to look at access, scans, and server logs. Never send them your
password.

## Where to report

| Problem | Where |
| --- | --- |
| Server, web app, or libraries | [Server issues](https://github.com/Silo-Server/silo-server/issues) |
| iPhone, iPad, Apple TV, or Mac app | [Apple issues](https://github.com/Silo-Server/silo-apple/issues) |
| Android phone, tablet, or TV app | [Android issues](https://github.com/Silo-Server/silo-android/issues) |

Search open and closed issues first, and add to an existing report when it
matches yours.

The server's bug form asks what happened, the steps to reproduce it, what
you expected, the Silo version, how you deployed it, which apps are
affected, and raw logs. It also asks whether you used AI tools. Give the
same details in an Apple or Android issue, plus the app version and device
model. Name the screen and control you used, and keep what you saw separate
from any theory about the cause.

If only one file fails, describe its format without sharing the file or
private library details.

### Security problems

Don't post security problems in a public issue. Report them privately
through GitHub's vulnerability reporting for the
[server](https://github.com/Silo-Server/silo-server/security/advisories/new),
[Apple apps](https://github.com/Silo-Server/silo-apple/security/advisories/new),
or [Android apps](https://github.com/Silo-Server/silo-android/security/advisories/new).

## Native app diagnostics

A native app can send a diagnostic report with device details and recent
logs. Open **Diagnostics** in the app's settings (under **Support** on
iPhone and iPad), and choose where reports go under **Send Reports To**.
[Where information goes](/docs/privacy#where-diagnostic-reports-go)
explains the two destinations.

- On Apple devices, **Send Diagnostics Now** creates and uploads the report
  straight away, with no review step.
- On an Android phone or tablet, **Send diagnostics now** opens **Report
  details** so you can review the report. Select **Send** to upload it.
- On Android TV, **Send Diagnostics Now** opens the same review screen.

Include the report ID in your issue or message. Sending diagnostics doesn't
open a GitHub issue.

## Logs

With the default Compose deployment, run these from the folder that holds
your Compose file:

```sh
docker compose ps
docker compose logs --since=30m --timestamps silo postgres redis
```

If you turned on the `search` profile, add `meilisearch` to the second
command. Startup errors show up here even when Silo's admin log screen is
empty. Include the image version and any restart or health errors.

For a problem after startup, open **Admin > Logs**. A request ID, playback
session ID, or node name helps the administrator find the matching event.
See [server logs](/docs/logging) for filtering and retention.

Before posting a log, replace tokens, cookies, passwords, connection
strings, private addresses, and personal media details with a marker such as
`[redacted]`, and leave the rest of the error text as it is. Silo's
automatic redaction can miss secrets inside free text.

## Scan and path problems

Say whether the server can read the file, not just whether you can see it on
your computer. For Docker, include the host-to-container path mapping.

For [Autoscan](/docs/autoscan), include the source type, the reported file
path, the path after rewrites, the Silo library root, and the error from
**Activity**. For the legacy external Autoscan target, add its protocol and
configuration. Replace private folder names the same way everywhere, so the
paths still line up.
