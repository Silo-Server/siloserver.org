# Server foundation guides: first-pass review

Reviewed September 20, 2026 against `silo-server` main snapshot `d2596927`. Scope: the 18 installation, library, playback, storage, and operations guides listed below. This report is maintainer evidence, not a public claim of end-to-end acceptance.

## Evidence by guide

All implementation paths below are relative to the server snapshot. The rewritten Markdown lives under `src/content/docs/docs/` in this website.

| Guide | Evidence checked | Procedure status |
| --- | --- | --- |
| `get-started/install-silo.md` | `docker-compose.yml`, `.env.example`, setup wizard `useWizardSteps.ts`, `AccountStep.tsx`, `StorageStep.tsx`, `LibraryStep.tsx`, `internal/api/handlers/health.go` | Source-checked; Compose parsed; wizard component tests passed. No actual first install or playback run. |
| `get-started/installation-options.md` | Compose services, `.github/workflows/docker.yml`, current storage UI | No invented hardware minimum or platform certification. Linux is the documented walkthrough; other installation paths are not certified here. |
| `running-a-server/after-installation.md` | Setup routes and library form; related task guides | Reading path checked; user/client playback still needs execution. |
| `running-a-server/libraries.md` | `AdminLibraries.tsx`, `LibraryFormSections.tsx`, `LibraryEditorDialog.tsx`, `useLibraryForm.ts`, `scanControls.ts` | Labels and scan path traced; 18 related component tests passed across three files. |
| `running-a-server/media-folders.md` | `internal/naming/filename.go`, `variants.go`, server wiki naming guide, Compose mounts | Naming package tests passed. Media scan not run. |
| `running-a-server/audiobook-libraries.md` | `internal/scanner/audiobook.go`, `audio_extensions.go`, library UI | Corrected WAV/AAC recognition and natural file sorting. No real audiobook scan or player run. |
| `running-a-server/metadata.md` | `ItemDetail/components/ActionBar.tsx`, `MatchItemDialog.tsx`, `EditMetadataDialog.tsx`, `ImageSelectorTab.tsx`, `RefreshMetadataDialog.tsx` | Exact Match Item, Apply Match, lock, image-apply, and refresh behavior traced. No live mutation. |
| `running-a-server/local-metadata.md` | `docs/wiki/admin/nfo-local-metadata.md`, `internal/metadata/nfo_merge_semantics_test.go`, `nfo_series_depth_test.go`, provider package | Source-backed reference. NFO package execution blocked by missing libvips. |
| `running-a-server/playback.md` | GPU Compose overlays, `PlaybackSettings.tsx`, library advanced fields, `AdminNodes.tsx`, `internal/taskmanager/tasks/chapter_thumbnail_backfill.go` | Both overlays parse. No GPU, transcode, or thumbnail generation run. |
| `running-a-server/transcode-nodes.md` | Commented worker examples, `AdminNodes.tsx`, node-monitoring wiki, current playback settings | Explicit advanced checklist, not a tested multi-host recipe. No fleet created. |
| `running-a-server/docker.md` | Compose services/mounts, `.env.example`, deployment wiki | Base and two overlays parse with dummy values. No daemon/container startup. |
| `running-a-server/configuration.md` | Explicit Compose environment/dependencies, `.env.example`, `internal/config/db_loader.go`, deployment wiki external-services section | External DB override warning preserved; no external service connection run. |
| `running-a-server/s3-storage.md` | `InfrastructureSettings.tsx`, `StorageStep.tsx`, artwork-storage wiki, library thumbnail requirement | Current Local/Automatic/S3 behavior and first-write identity lock checked; no storage credentials or migration used. |
| `running-a-server/backup-restore.md` | Default mounts, deployment wiki SQLite warning, `docs/update-to-1.0.md`, artwork storage restrictions | Deliberately inventory and isolated-recovery checklist only. Complete clean-host restore remains blocked on a tested procedure. |
| `running-a-server/updates.md` | `docs/update-to-1.0.md`, release-versioning policy | Bridge route and no in-place rollback promise retained. Exact release tags/commands remain unpublished in source. No upgrade attempted. |
| `running-a-server/server-health.md` | `internal/api/handlers/health.go`, `AdminLibraries.tsx`, `AdminNodes.tsx`, `adminNavigation.ts` | Corrected HTTP-200 degraded storage semantics and Scheduled Tasks label. No runtime endpoint called. |
| `running-a-server/logging.md` | `internal/telemetry/config.go`, `internal/config/restart_keys.go`, `db_loader.go`, `cmd/silo/metrics_listener.go`, `root_handler.go`, admin settings search | Telemetry and redaction Go packages passed after sandbox escalation for local test listeners/cache. Metrics corrected to separate opt-in listener. |
| `running-a-server/reverse-proxy.md` | General/Security & Access UI, Compose ports; official Caddy reverse-proxy quick-start | Example reviewed against Caddy docs, not executed. Public DNS/TLS and remote playback remain untested. |

External references checked: [Caddy reverse proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy), [Docker optional environment files](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/). The latter confirms Compose 2.24 support for `env_file.required`.

## Executed checks

- `go test ./internal/naming`: passed.
- From the snapshot's `web/`: `pnpm exec vitest run src/pages/setup-wizard/steps/StorageStep.test.tsx src/pages/setup-wizard/useWizardSteps.test.tsx src/components/admin/libraries/LibraryForm.test.tsx --maxWorkers=2`: 3 files, 18 tests passed.
- Additional web checks: `MatchItemDialog.test.tsx`, `InfrastructureSettings.test.tsx`, `PlaybackSettings.test.tsx`, and `adminNodesPresentation.test.ts`: 4 files, 181 tests passed. Combined foundation-related component total: 7 files, 199 tests.
- `docker compose config --quiet` for base, base plus VA-API overlay, and base plus NVIDIA overlay: all passed with dummy environment values and non-production paths. This does not require or prove Docker daemon operation.
- `go test ./internal/metadata/nfo ./internal/telemetry ./internal/logredact`: combined command failed because NFO requires unavailable libvips. Telemetry and logredact packages passed after allowing isolated localhost test listeners and cache/dependency access. No system library installed.
- Whitespace diff check passed during the pass. Build and rendered-site checks are consolidated by the lead agent.

An initial Vitest command from the repository root failed because the executable is installed in `web/`; the corrected command above passed. Initial Go attempts also hit sandbox cache/network/listener restrictions before the explicit isolated-test retry.

## Important corrections

- Removed the old wizard sequence and nonexistent “Scan after creating” instruction. Current wizard labels and a separate library scan check replace it.
- Removed the instruction to wait for the Silo container to be “healthy”: the Compose file does not define a Silo healthcheck.
- Kept `/api/v1/health` and `/api/v1/ready` as operational probes. A 200 readiness response can still report degraded artwork/S3.
- Replaced unconditional S3 artwork requirements with current local artwork support, while retaining the separate S3 requirement for chapter thumbnails.
- Removed blanket “Redis and transcode output are disposable” backup guidance. Runtime state, jobs, durable files, and restore coordination need distinct treatment.
- Removed a proposed database-row deletion workaround for artwork migration from the public path.
- Stopped presenting a moving image tag as a tested release identity. Fresh installs use the current default, clearly marked prerelease, and record their actual image afterward.
- Corrected the old node wiki's public metrics claim: current source uses a separate `SILO_METRICS_LISTEN` listener and intentionally returns 404 for public `/metrics`.
- Corrected audiobook file formats and file ordering from scanner source.
- Clarified that artwork Apply acts immediately and Cancel does not undo it; Complete Refresh can change the catalog item ID/type.

## Humanizer review

Detected as: technical documentation, applying the skill's blog/general prose rules. The user's requested voice is brief, calm, concrete instruction for a new viewer or administrator. Numbered procedures, literal UI labels, command names, and safety warnings remain intact even where marketing-oriented blog rules would prefer prose. No invented personal experience, benchmark, or testimonial was added.

### Assessment and scores

These are editorial judgments, not a detector result or an accuracy certification.

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-Likeness | 2/10 | Concrete actions replace architecture summaries and promotional provider rankings; no em dashes remain in the 18 guides. |
| Authenticity | 8/10 | Direct second-person instructions and specific failure cases match the requested maintainer voice without pretending to be a firsthand tester. |
| Reader Value | 8/10 | A short default install leads to a playback check, then branches into independent tasks. Recovery content remains incomplete and explicitly says so. |
| Domain Credibility | 8/10 | Instructions cite actual UI/source evidence internally and preserve sharp distinctions between readiness, playback, data storage, and migrations. Hardware and recovery still require runtime evidence. |

### Flags and fixes

Exact inherited-copy examples flagged during review:

| Location | Quote | Revision |
| --- | --- | --- |
| Old audiobook introduction | “Silo supports first-class audiobook libraries.” | Open with one folder per book and the tags Silo reads. “First-class” adds no task information. |
| Old S3 opening | “Silo supports S3-compatible object storage for generated and operational assets.” | Explain that media stays on mounted filesystems and artwork has separate storage. |
| Old S3 recommendation | “Prioritize low-latency reads, predictable egress cost, and an easy CDN path before optimizing for the lowest storage-only price.” | Remove the provider-ranking detour from setup; give bucket fields and a real client check. |
| Old S3 recommendation | “they are not the strongest default recommendations here” | Remove unsupported comparative provider recommendations and old pricing. |
| Old Docker hardware prose | “A Raspberry Pi is well suited to direct play” | Remove hardware recommendation without a measured workload. Ask readers to test their files and concurrency. |
| Old after-install introduction | “configure only the additional capabilities you need” | Replace abstract “capabilities” with using Silo now and choosing a next task. |
| Old quickstart wizard list | “Configure optional subtitle integrations, downloads, and recommendations.” | Tell beginners to skip optional features they do not need, with advanced guides linked separately. |

Originality/credibility check: the new examples illustrate documented parsing or configuration behavior; none claims a personal deployment or actual user test. Existing technical knowledge was rewritten, but legacy prose was not protected when it conflicted with current source or the agreed task structure.

Top changes applied: make one install-to-first-play path; put a visible result after consequential actions; separate advanced storage/recovery prerequisites from ordinary setup. All 18 guides received the phrase/structure pass, with exact commands and UI labels preserved. The rewritten files are the final copy for review.

### Skill update

- [x] No new patterns found. All flags fit existing filler, generic-opening, abstraction, or unsupported-credibility categories. No skill file modified.

## Remaining acceptance work

Follow the fresh-install guide on an isolated Linux host with an identified image. Run an actual scan and first playback on web and one native client. Test S3 assets from a remote client, a GPU transcode, thumbnail generation, and remote-node streaming. Approve and execute a complete clean-host restore before treating backup or update docs as release-ready.

Unraid instructions were not created: repository/template presence is not a tested platform installation path. Release engineering still needs to bind the documented Compose revision to a named image and finalize the bridge release procedure.
