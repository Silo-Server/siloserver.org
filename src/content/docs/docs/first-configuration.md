---
title: First configuration
description: What to configure first after starting Silo.
---

The first-run flow is wizard-driven. The frontend checks whether setup is required, routes first-run users to `/setup`, and the server creates the first admin account when no users exist.

## Step-by-step

1. Start Silo with Docker Compose and open `http://localhost:8090`.
2. Create the first admin account.
3. Create a profile.
4. Review server settings: Redis URL, FFmpeg path, transcode directory, hardware acceleration, transcoding toggle, Jellyfin compatibility public URL/name, public asset S3, private internal S3, and image caching.
5. Configure subtitle integrations if you use OpenSubtitles, SubDL, or SubSource.
6. Configure download limits if you allow downloads.
7. Configure recommendations if you run an embedding service.
8. Add the first library path and leave "Scan after creating" enabled.
9. Optionally add proxy or transcode nodes, then enter the app or admin area.

The wizard can skip server, integrations, downloads, recommendations, and library steps. Account and profile creation are the required first-run path.

## After the wizard

The wizard is intentionally not every admin screen. After the first scan, review these areas as needed:

- Admin > API Keys: create an admin API key for [Autoscan](/docs/integrations/autoscan).
- Admin > Libraries: add more roots, check mounts, configure per-library provider chains, and adjust advanced library options.
- Admin > Plugins: manage plugin-provided metadata or auth providers.
- Admin > Users: manage users, devices, invite codes, and signup flow.
- Admin > Settings: review General, Theming, Playback, Scanner & Matcher, Rate Limiting, Downloads, Integrations, Jellyfin Compat, Database, Storage, Log Retention, and Card Overlays.
- Admin > Nodes: add worker nodes if you move proxy or transcode work off the integrated server.

## What to decide first

Media paths
: Decide the container-visible path contract before adding libraries. With default Compose, use `/mnt/media/...` paths in Silo because `MEDIA_ROOT` is mounted there.

S3 storage
: You can leave S3 blank for a basic install. If you enable image caching or chapter thumbnails, configure public asset S3 first. Most installs should keep the bucket private and use presigned URLs.

Jellyfin compatibility
: Set the public URL if compatible clients or Autoscan will access Silo through a reverse proxy or from another container.

Autoscan
: Add libraries and create an admin API key before configuring Autoscan. Autoscan must send paths that match Silo's library roots after any Autoscan rewrite rules run.

## Source notes

- First-run setup route and setup-required redirect, plus server-side setup: [`App.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/App.tsx#L332) (redirect at [L158](https://github.com/Silo-Server/silo-server/blob/main/web/src/App.tsx#L158)), the HTTP handlers in [`auth.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/auth.go#L196-L248), and the first-admin-when-no-users logic in [`service.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/auth/service.go#L285-L307).
- Wizard step order: [`useWizardSteps.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/useWizardSteps.ts#L28-L78).
- Skippable wizard steps: [`WizardContext.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/WizardContext.tsx#L8-L23).
- Server/storage wizard fields: [`ServerStorageStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/ServerStorageStep.tsx#L248-L514).
- Library wizard fields and scan-after-create behavior: [`LibraryStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/LibraryStep.tsx#L20-L140).
- Admin sidebar pages: [`AdminSidebar.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/components/AdminSidebar.tsx#L70-L180).
- Admin settings tabs: [`AdminSettingsLayout.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin-settings/AdminSettingsLayout.tsx#L38-L56).
- Public asset S3 recommendation in the UI: [`StorageSettings.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin-settings/StorageSettings.tsx#L158-L230).
- Chapter thumbnails require public asset S3 when enabled: [`libraries.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/libraries.go#L524-L526).
