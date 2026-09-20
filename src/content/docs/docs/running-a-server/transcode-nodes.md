---
title: Add and check transcode nodes
description: Prepare a remote worker and verify its media access, hardware, and playback.
---

A transcode node runs conversion work on another machine. A normal single-host installation already performs this work in integrated mode and needs no extra node.

This is an advanced deployment checklist. The server repository's [Compose worker example](https://github.com/Silo-Server/silo-server/blob/d2596927/docker-compose.yml) is commented out; it is not a second service started by the beginner guide.

## Prepare the worker

Use the same server build across the deployment. A worker needs:

- `MODE=transcode`, a distinct node name, and an address the API server can reach.
- The shared PostgreSQL and Redis connections and the same `SECRET_KEY`.
- Readable media at the same container paths used by the catalog.
- Persistent plugin files, access to the artwork store, and writable transcode scratch space.
- Its own working GPU driver and container device access if it will encode on a GPU.

Keep database, Redis, and worker control access on trusted networks. Never expose them by opening every Compose port to the internet.

Local artwork on one host is not automatically shared with another. Plan shared access before deploying workers; Silo will not copy an existing local artwork store for you.

## Check registration and routing

1. Start the worker using a deployment configuration prepared for that host.
2. Open **Admin > Nodes**. Check that the node appears with the expected name, type, and URL.
3. Use its health-check action. Confirm that it can reach the media paths and reports the intended acceleration backend.
4. Review its maximum transcodes and optional **Public URL**. The server must reach the control URL; clients must reach the address used for streaming.
5. Start one test playback that requires transcoding. Confirm the worker receives it and that the client can seek and stop.

Do not assume an HTTP health response proves clients can receive media from the node.

## If work does not reach the node

Check whether the node is enabled, healthy, at its concurrency limit, or missing the source file. Review the routing choices under **Admin > Settings > Playback** before forcing all work to a single worker.

A full scratch disk can make a stream fail after it starts. Check free space on the worker itself. Monitor node load and capacity using [Server health](/docs/running-a-server/server-health).

## Maintain a worker

Disable new work and let active sessions drain before changing its driver or deployment. Use **Re-probe** after a hardware change. Re-probing is refused while the node is encoding.

Upgrade the fleet together when release notes require it. Do not mix alpha and 1.0 nodes during the [1.0 cutover](/docs/running-a-server/updates#moving-from-alpha-to-10).
