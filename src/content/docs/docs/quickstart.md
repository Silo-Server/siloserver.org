---
title: Quickstart
description: Run Silo locally with Docker Compose.
---

The recommended first install uses Docker Compose. The default stack starts Silo with PostgreSQL, Redis, FFmpeg, and the integrated application service. After the container is running, Silo's setup wizard handles most first-run configuration.

## Prerequisites

- Docker with Compose support
- A host directory containing your media
- Either a clone of the [`silo-server`](https://github.com/Silo-Server/silo-server) repository or the latest Compose install files

## Start Silo

From the [`silo-server`](https://github.com/Silo-Server/silo-server) repository:

```sh
cp .env.example .env
```

Or download only the latest Compose install files:

```sh
mkdir -p postgres && curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml && curl -fsSLo .env.example https://raw.githubusercontent.com/Silo-Server/silo-server/main/.env.example && curl -fsSLo postgres/postgresql.conf https://raw.githubusercontent.com/Silo-Server/silo-server/main/postgres/postgresql.conf && cp -n .env.example .env
```

Before starting, edit `.env` and set `MEDIA_ROOT` to the host path containing your media. New installs can usually keep `MEDIA_CONTAINER_ROOT=/mnt/media`; this is the path Silo sees inside the container.

```dotenv
MEDIA_ROOT=/srv/media
MEDIA_CONTAINER_ROOT=/mnt/media
```

Start the integrated stack:

```sh
docker compose up -d
```

The web app is available at `http://localhost:8090`. The Jellyfin-compatible endpoint is available at `http://localhost:8096`, and the Audiobookshelf-compatible endpoint at `http://localhost:13378`.

## Use the setup wizard

Open `http://localhost:8090` and follow the setup wizard. The wizard is the normal path for first-run application setup.

1. Create the first admin account.
2. Create a profile.
3. Review server settings: Redis, playback, Jellyfin compatibility, public asset S3, private internal S3, and image caching.
4. Configure optional subtitle integrations.
5. Configure optional downloads and recommendations.
6. Add the first library and keep "Scan after creating" enabled.
7. Finish, or add optional proxy/transcode nodes if you are building a distributed deployment.

For the library path, use the container-visible path. With the default `.env` example, a host path like `/srv/media/movies` is entered in Silo as `/mnt/media/movies`.

The server, integrations, downloads, recommendations, and library steps can be skipped and revisited later from the admin UI. After the wizard, review [first configuration](/docs/first-configuration) for the admin pages not covered by first-run setup, and [library paths](/docs/libraries) before adding automation.

## Docker image

The published image is a Linux container image. The Docker publish workflow runs on a Linux runner and the runtime image is based on Debian. The workflow does not declare a multi-platform matrix or publish Windows/macOS container images.

## Source notes

- Default Compose services, ports, and media mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L1-L58).
- Raw Compose download: [`docker-compose.yml`](https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.yml).
- Required `.env` media settings and default image: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example#L1-L42).
- Compose Postgres config mount: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L12-L15) and [`postgresql.conf`](https://github.com/Silo-Server/silo-server/blob/main/postgres/postgresql.conf).
- Docker publish workflow and image tags: [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L20-L22) and [`docker.yml`](https://github.com/Silo-Server/silo-server/blob/main/.github/workflows/docker.yml#L90-L110).
- Linux runtime image: [`Dockerfile`](https://github.com/Silo-Server/silo-server/blob/main/Dockerfile#L41-L59).
- Setup wizard step order: [`useWizardSteps.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/useWizardSteps.ts#L28-L78).
- Skippable wizard steps: [`WizardContext.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/WizardContext.tsx#L8-L23).
- Server/storage wizard fields: [`ServerStorageStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/ServerStorageStep.tsx#L248-L514).
- Library wizard fields and scan-after-create behavior: [`LibraryStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/LibraryStep.tsx#L20-L140).
