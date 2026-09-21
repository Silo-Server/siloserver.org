---
slug: docs/server-health
title: Check server health
description: Find whether a problem comes from startup, storage, scanning, or playback.
---

Start with the task that failed and its time. “The server is down” can mean a stopped process, an unavailable database, or one media file that cannot play.

## Check startup

For the default Docker installation:

```sh
docker compose ps
docker compose logs --tail 100 silo
curl --fail http://localhost:8090/api/v1/health
curl --fail http://localhost:8090/api/v1/ready
```

Run these on the Docker host. Substitute your server address when checking from another machine.

**Health** confirms the HTTP process answers. **Readiness** checks PostgreSQL and storage. PostgreSQL failure returns HTTP 503. Artwork or S3 failure can return HTTP 200 with `status: degraded`, so read the response body as well as the status code.

Readiness does not check every feature or Redis operation and does not prove playback works.

## A scan is stuck or empty

Open **Admin > Libraries** and check the active scan and reported errors. Confirm the media disk is mounted and that the container can read the configured folder.

If a scan finds no files, investigate the path before confirming cleanup or deleting anything. Use [library troubleshooting](/docs/manage-libraries#files-are-missing).

## Playback fails

Try one known file and record the client, time, and chosen audio/subtitle tracks. Check active sessions, then **Admin > Nodes** for the selected node's health, load, capacity, and acceleration.

Confirm that the node can read the file and has scratch space. If only remote clients fail, check [external addresses and proxying](/docs/reverse-proxy). If only converted streams fail, check [transcoding](/docs/playback).

## Background work fails

Use **Admin > Scheduled Tasks** to inspect the relevant task and **Admin > Logs** for its error. A repeated provider failure can be a rejected key, rate limit, or unreachable service; retrying every task at once adds load without fixing that cause.

Operational logs explain work the server attempted. Audit records explain recorded user/admin actions. Neither is the same as a client's optional diagnostic report.

## Capacity and monitoring

Watch database and artwork storage as well as transcode scratch. A full disk can affect one task before the whole server stops responding.

For metrics and retention controls, see [Logs and monitoring](/docs/logging). Share only a short, reviewed excerpt when [reporting a problem](/docs/report-a-problem).
