---
title: Requirements and installation options
description: Choose a server, storage, and deployment before installing Silo.
---

If someone has already invited you to their Silo server, you only need to [connect an app](/docs/get-started/choose-an-app). Install a server when you want to manage your own media and accounts.

## Choose a starting point

Use the [Docker Compose walkthrough](/docs/get-started/install-silo) for a new single-host installation. It runs the web app, API, scanner, and transcoder together, with PostgreSQL and Redis beside them.

The published Linux container targets x86-64 and arm64. A Linux host is the path covered by the walkthrough. Docker on macOS or Windows adds file-sharing and networking differences; Linux GPU instructions do not apply unchanged. Native host builds and multi-host deployments belong to the [server repository](https://github.com/Silo-Server/silo-server), not the beginner install path.

## What the host needs

- Docker with Compose 2.24 or newer and permission to run containers.
- A mounted directory of media files that the container can read.
- Persistent storage for PostgreSQL, artwork, and other server state.
- Free temporary space for transcodes and prepared downloads.
- Network access to your clients and to any metadata or other providers you choose.

There is no measured minimum RAM, CPU, or stream-count promise in this guide. Direct playback uses much less processing than converting video. Test your actual files and expected simultaneous viewers before choosing a small host for everyone.

## Do I need a GPU?

Start without one if your clients can play your files directly. A GPU can reduce the CPU load when Silo must convert video for a client or a lower quality setting. Hardware support depends on the host, driver, container access, and file format. See [Set up transcoding](/docs/running-a-server/playback) before buying hardware for that purpose.

## Decide where artwork will live

Local disk is the simplest choice for one server and needs no cloud account. S3-compatible storage is useful when hosts need to share artwork. Chapter thumbnail generation still requires public asset S3 storage in the current implementation.

Choose before the first library scan. Once Silo writes artwork, its storage location locks; changing a setting does not migrate the files. See [Storage and capacity](/docs/running-a-server/s3-storage).

## Existing or advanced installations

Keep a working server on its existing data paths until you have a tested [backup and recovery plan](/docs/running-a-server/backup-restore). Read [Updates](/docs/running-a-server/updates) before changing versions.

External PostgreSQL or Redis, separate [transcode nodes](/docs/running-a-server/transcode-nodes), and optional search are later choices. None is a required detour before your first playback test.
