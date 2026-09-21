---
slug: docs/report-a-problem
title: Report a problem
description: Share the steps, versions, and evidence needed to investigate a Silo problem.
---

Check [Find help](/docs/help) first. If someone else runs your server, ask
them to check access, scans, and server logs. Never send them your password.

## Report template

Copy this into a report and fill in the parts you know:

```text
What I was trying to do:
Steps to reproduce:
Expected result:
Actual result:
App, device, and server versions:
Does it affect one title/profile/device or several?:
Time of failure and timezone:
Relevant error or diagnostic report ID:
```

## What to include

Use a short sequence someone else can repeat. Name the screen and control
you used. If only one file fails, include its media type and relevant format
details without sharing the file or private library information.

File server, web, and library problems in
[the server repository](https://github.com/Silo-Server/silo-server/issues).
Use [Apple issues](https://github.com/Silo-Server/silo-apple/issues) or
[Android issues](https://github.com/Silo-Server/silo-android/issues) for an
app-specific problem. Search for an existing report before opening another.

Separate what you observed from any theory about the cause. If an AI tool
helped investigate, disclose that assistance and keep its interpretation
separate from the original error and logs.

For a suspected security problem, do not post exploit details, credentials,
or private data in a public issue. Ask the maintainers for a private reporting
channel first.

## Native app diagnostics

1. Open **Settings > Diagnostics** in the app.
2. Check who will receive the report: **Silo Diagnostics** or your own Silo server.

On Apple, read the destination's disclosure before choosing **Send Diagnostics
Now**. That button prepares and uploads the report immediately, without a
separate review step. The **Ask** setting does not add a confirmation to this
manual send action.

On Android, choose **Send diagnostics now** to prepare the report and open
its review screen. Review the information, then send only if you are
comfortable sharing it.

After sending, include the report ID in your support conversation. Sending
diagnostics does not create a GitHub issue.

If the destination is unavailable, keep the app version, error, and steps
instead of repeatedly sending. See [where information goes](/docs/privacy)
for destination and consent choices.

## Logs

Administrators using the default Compose deployment can run these commands
from the directory containing their Compose file:

```sh
docker compose ps
docker compose logs --since=30m --timestamps silo postgres redis
```

Capture the time around the failure. Startup errors can occur before Silo's
admin log screen is available, so container output matters even when that
screen is empty. Include the image version and any restart or health errors.

For a failure after startup, check **Admin > Logs**. A request ID, playback
session ID, or node name can help the administrator find the matching event.
See [server logs](/docs/logging) for filtering and retention.

Review every excerpt before posting. Remove tokens, cookies, passwords,
connection strings, private addresses, and personal media details. Mark
redactions and leave the surrounding error text intact. Silo's automatic
redaction does not catch every secret embedded in free text.

## Autoscan

Include the source type, the reported file path, its path after rewrites,
the Silo library root, and the Activity error. Replace private path segments
consistently so the relationship between those paths is still visible.

For the legacy external Autoscan target, include the target protocol and
a sanitized configuration. Follow [Autoscan checks](/docs/autoscan)
before reporting a path-mapping problem.

## Libraries

Say whether the server can read the affected file, not just whether it is
visible on your computer. For Docker, include the host-to-container path
mapping with private segments redacted. See [media paths](/docs/media-folders).
