---
slug: docs/updates
title: Update Silo safely
description: Prepare a backup, read version requirements, and check the server after an update.
---

Update during a quiet period. Tell users when playback may stop and keep the previous version's image and configuration until the new version has passed your checks.

## Before changing versions

1. Read the target release notes. Check server, client, plugin, and remote-node compatibility.
2. Make and verify a [backup](/docs/backup-restore). Keep the encryption key and exact old image identity.
3. Record current versions and any external callback URLs.
4. Finish active playback and downloads, then follow the release's shutdown and migration instructions.

For a pinned Docker installation, change `SILO_IMAGE` only to the tag or digest specified by the target release, then use its documented deployment commands. Do not replace an existing `.env` with the latest example.

## Moving from alpha to 1.0

The documented path is **0.x to the final bridge release, then 1.0**. The bridge completes historical migrations and any supported legacy profile-store import. A direct jump from an arbitrary alpha build is not the planned upgrade route.

The server's [1.0 update checklist](https://github.com/Silo-Server/silo-server/blob/d2596927/docs/update-to-1.0.md) still marks exact release tags and commands as unfinished. Wait for those named release instructions before attempting the cutover.

Plan a maintenance window for the whole fleet. Alpha and 1.0 API, proxy, and transcode components must not remain active together. Have matching native client builds ready.

The API cutover changes alpha-generated playback, download, callback, and integration URLs. Generate fresh URLs through the new server, update external integrations, and resend outstanding action links where required. Do not repair token-bearing URLs by replacing `v1` with `v2` in a text editor.

Operational checks remain at `/api/v1/health` and `/api/v1/ready`. Their names do not mean the native API is still v1.

## After startup

Check more than the container status:

- Read startup logs for migration or configuration errors.
- Check readiness, including any degraded storage status.
- Sign in as an admin and a normal account.
- Open a library, load artwork, start playback, seek, stop, and resume.
- Test the integrations and remote nodes you actually use.

Keep the backup until these checks pass. Note the new version when [reporting a problem](/docs/report-a-problem).

## If the update fails

Stop further rollout and preserve the error logs. Do not repeatedly alternate old and new image tags against the same database.

Silo does not promise in-place rollback after migrations. Recovery may require restoring the pre-update database and associated file/object state with the old software. Use the tested procedure for that backup; ask for help before changing schema or deleting state.
