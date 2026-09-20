---
title: After installation
description: Choose the library, integration, and operational guides you need after first-run setup.
---

Once Silo is running, configure only the additional capabilities you need.
You do not have to work through every admin setting before using your server.

## Step-by-step

If you have not completed first-run setup, follow
[Install Silo](/docs/get-started/install-silo#5-finish-setup-in-the-browser).
That guide owns the installation and wizard walkthrough. Return here after
adding your first library.

## After the wizard

| What you want to do | Guide |
| --- | --- |
| Prepare movie and series files | [Folders, naming, and provider IDs](/docs/running-a-server/media-folders) |
| Add audiobooks | [Audiobook libraries and metadata](/docs/running-a-server/audiobook-libraries) |
| Pick up changes from Sonarr or Radarr | [Autoscan](/docs/running-a-server/autoscan) |
| Send email, Discord, or webhook notifications | [Configure notification delivery](/docs/running-a-server/notifications) |
| Configure translation or transcription | [AI services](/docs/running-a-server/ai-services) |
| Connect third-party listening or viewing apps | [Third-party client access](/docs/running-a-server/third-party-access) |
| Configure GPU access or optional search | [Docker deployment reference](/docs/running-a-server/docker) |
| Investigate an operational failure | [View and manage logs](/docs/running-a-server/logging) and [find help](/docs/help) |

## What to decide first

- **Media paths:** use the paths visible inside the server container, not the
  host's paths. See [library paths](/docs/running-a-server/media-folders#library-paths).
- **Storage:** review persistent data and artwork storage before depending on
  a new deployment. The [S3 reference](/docs/running-a-server/s3-storage) is
  not a complete backup or storage-migration procedure.
- **Connectivity:** decide which endpoints users need. Follow
  [third-party access](/docs/running-a-server/third-party-access) when sharing
  Jellyfin- or Audiobookshelf-compatible addresses.
- **Scan automation:** create the library before configuring Autoscan and
  check whether source paths need rewriting.

## Source notes

- First-run setup route and setup-required redirect, plus server-side setup: [`App.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/App.tsx#L332) (redirect at [L158](https://github.com/Silo-Server/silo-server/blob/main/web/src/App.tsx#L158)), the HTTP handlers in [`auth.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/auth.go#L196-L248), and the first-admin-when-no-users logic in [`service.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/auth/service.go#L285-L307).
- Wizard step order: [`useWizardSteps.ts`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/useWizardSteps.ts#L28-L78).
- Skippable wizard steps: [`WizardContext.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/WizardContext.tsx#L8-L23).
- Server/storage wizard fields: [`ServerStorageStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/ServerStorageStep.tsx#L248-L514).
- Library wizard fields and scan-after-create behavior: [`LibraryStep.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/setup-wizard/steps/LibraryStep.tsx#L20-L140).
- Admin sidebar pages: [`AdminSidebar.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/components/AdminSidebar.tsx#L74-L193).
- Admin settings tabs: [`AdminSettingsLayout.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin-settings/AdminSettingsLayout.tsx#L38-L56).
- Public asset S3 recommendation in the UI: [`StorageSettings.tsx`](https://github.com/Silo-Server/silo-server/blob/main/web/src/pages/admin-settings/StorageSettings.tsx#L158-L230).
- Chapter thumbnails require public asset S3 when enabled: [`libraries.go`](https://github.com/Silo-Server/silo-server/blob/main/internal/api/handlers/libraries.go#L524-L526).
