---
slug: docs/server-health
title: Check server health
description: Find whether a problem comes from startup, storage, scanning, or playback.
---

Start with the task that failed and when it failed. "The server is down" can mean a stopped container, an unavailable database, or one media file that cannot play.

## Check startup

For the default Docker installation, run these on the Docker host:

```sh
docker compose ps
docker compose logs --tail 100 silo
curl --fail http://localhost:8090/api/v1/health
curl --fail http://localhost:8090/api/v1/ready
```

From another machine, replace `localhost` with the server's address.

`/api/v1/health` answers as soon as Silo's web server is running. The container's own health check uses it, so `docker compose ps` can show Silo as `unhealthy` during a long database migration at startup. Check the logs before restarting it.

`/api/v1/ready` also checks PostgreSQL and storage:

| Response | Meaning |
| --- | --- |
| HTTP 200, `{"status":"ok"}` | Ready |
| HTTP 200, `"status":"degraded"` | Artwork or S3 storage failed its check. The body shows which: `"s3":false` or `"artwork":false`. Silo keeps serving, but images may be missing. |
| HTTP 503, `"status":"error"` | Silo cannot reach PostgreSQL |

A degraded answer still returns HTTP 200, so read the body. Readiness doesn't check Redis or playback.

## A scan is stuck or empty

Open **Admin > Libraries** and check the active scan and reported errors. Make sure the media disk is mounted and the container can read the library folder.

If a scan finds no files, fix the path before you confirm any cleanup or delete anything. See [library troubleshooting](/docs/manage-libraries#files-are-missing).

## Playback fails

Try one known file and note the client, the time, and the audio and subtitle tracks you chose. Then:

1. Open **Admin > Activity** while the file plays. A converted stream shows its encoder, such as **HW VAAPI** or **SW** for software.
2. On a single server, open **Admin > Settings > Playback**. The line under **Hardware acceleration** shows the detected hardware, or **No supported graphics hardware found**. The admin dashboard shows the server's CPU, memory, and disk use.
3. With separate nodes, open **Admin > Nodes** and check the node's state, **Acceleration**, **Load**, and **Capacity**. A single server has no entries here.

Make sure the server or node can read the file and has free space for transcodes. If only remote clients fail, check [external access](/docs/reverse-proxy). If only converted streams fail, check [transcoding](/docs/playback).

## Background work fails

Open **Admin > Scheduled Tasks** to find the task and **Admin > Logs** for its error. Repeated provider failures usually mean a rejected key, a rate limit, or a service that can't be reached. Fix that before retrying tasks; retrying everything at once only adds load.

## Disk space

Watch free space for the database and artwork as well as transcodes. A full disk can break one task before the whole server stops responding.

For logs and metrics, see [Logs and monitoring](/docs/logging). Share only a short, checked excerpt when [reporting a problem](/docs/report-a-problem).
