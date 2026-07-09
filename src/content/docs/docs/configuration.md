---
title: Configuration
description: The initial configuration values Silo operators should know.
---

The default Docker path keeps environment configuration small. Set the media path, start the stack, and finish most setup in the admin UI.

## Environment values

`MEDIA_ROOT`
: Host path mounted into the Silo container as `/mnt/media`.

`MEDIA_CONTAINER_ROOT`
: Container path where Silo sees `MEDIA_ROOT`. New installs can keep `/mnt/media`.

`SILO_DATA_ROOT`
: Host path for PostgreSQL, Redis, plugin cache, transcode output, and catalog seed bind mounts. The default is `/opt/silo`.

`DATABASE_URL`
: PostgreSQL connection string. Required when running from source or against external PostgreSQL. The default Compose stack wires this automatically.

`REDIS_URL`
: Redis connection string. The default Compose stack wires this automatically.

`PORT` and `JF_PORT`
: Optional host port overrides for the web app and Jellyfin-compatible endpoint.

`MODE`
: Optional server mode. The default Compose service runs `integrated`.

```dotenv
MEDIA_ROOT=/srv/media
MEDIA_CONTAINER_ROOT=/mnt/media
SILO_DATA_ROOT=/opt/silo
SILO_IMAGE=ghcr.io/silo-server/silo-server:latest
POSTGRES_USER=silo
POSTGRES_PASSWORD=silo
POSTGRES_DB=silo
```

## Data layout

The deploy-oriented Compose files use bind mounts instead of Docker-managed volumes. By default, Silo stores service data under `/opt/silo`:

- `/opt/silo/postgres`
- `/opt/silo/redis`
- `/opt/silo/transcode`
- `/opt/silo/catalog-seeds`

## Admin-managed settings

After bootstrap, most settings live in the admin UI and server settings database, not in `.env`.

Use the setup wizard for the first pass through account, profile, server, integrations, downloads, recommendations, library, and optional nodes. Afterward, use Admin Settings for the broader settings surface: General, Theming, Playback, Scanner & Matcher, Rate Limiting, Downloads, Integrations, Jellyfin Compat, Database, Storage, Log Retention, and Card Overlays.

## Logging

Silo writes runtime logs to stderr and to the database-backed Admin > Logs view. Optional OpenTelemetry export can send the runtime stream to an OTLP collector or vendor backend without replacing either built-in destination.

See [Logging and telemetry](/docs/logging) for log controls, redaction limits, retention, a working local Collector example, and the current tracing limitations.

## Server modes

| Mode | Description |
| --- | --- |
| `integrated` | Full server: API, frontend, scanner, and transcode. This is the default. |
| `api` | API server only, with no local transcoding. |
| `proxy` | Stream proxy node connected to shared PostgreSQL and Redis. |
| `transcode` | HLS transcode worker connected to shared PostgreSQL and Redis. |

## Source notes

- `.env` defaults and environment variables: [`.env.example`](https://github.com/Silo-Server/silo-server/blob/main/.env.example#L1-L86).
- Compose bind mounts and default service environment: [`docker-compose.yml`](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml#L54-L88).
- Source-run configuration and server modes: [`README.md`](https://github.com/Silo-Server/silo-server/blob/main/README.md#L117-L128).
- Wizard step order: [`useWizardSteps.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/useWizardSteps.ts#L28-L78).
- Admin settings tabs: [`adminSettingsSearch.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/lib/adminSettingsSearch.ts#L42-L503).
