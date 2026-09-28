---
slug: docs/requirements
title: Requirements and installation options
description: Choose a server, storage, and deployment before installing Silo.
---

If someone has already invited you to their Silo server, [connect and start watching](/docs/connect-and-watch). Install a server when you want to manage your own media and accounts.

## Choose a starting point

Use the [Docker Compose walkthrough](/docs/install) for a new single-host installation. It runs the web app, API, scanner, and transcoder together, with PostgreSQL and Redis beside them.

The published Linux container targets x86-64 and arm64, and the walkthrough covers a Linux host. Docker on macOS or Windows adds file-sharing and networking differences, and the Linux GPU instructions do not apply there unchanged. Native host builds and multi-host deployments are covered in the [server repository](https://github.com/Silo-Server/silo-server).

## What the host needs

- Docker with Compose 2.24 or newer and permission to run containers.
- A mounted directory of media files that the container can read.
- Persistent storage for PostgreSQL, artwork, and other server state.
- Free temporary space for transcodes and prepared downloads.
- Network access to your clients, and internet access for the default metadata plugins and any other providers you choose.

Direct playback uses much less processing than converting video. Before sizing a small host for everyone, test your own files with the number of people you expect to watch at once.

## Do I need a GPU?

Start without one if your clients can play your files directly. A GPU can reduce the CPU load when Silo must convert video for a client or a lower quality setting. Hardware support depends on the host, driver, container access, and file format. See [Set up transcoding](/docs/playback) before buying hardware for that purpose.

## Decide where artwork will live

Local disk is the simplest choice for one server and needs no cloud account. S3-compatible storage is useful when hosts need to share artwork.

Choosing before the first library scan is simplest. Once Silo has stored files, you change the location through a storage transition that copies what you choose. See [Storage and capacity](/docs/s3-storage).

## Existing or advanced installations

Keep a working server on its existing data paths until you have a tested [backup](/docs/backup-restore). Read [Updates](/docs/updates) before changing versions.

External PostgreSQL or Redis, separate [transcode nodes](/docs/transcode-nodes), and Meilisearch search can all be added later. You don't need any of them for your first playback test.
