# Admin feature guides: first-pass review

Reviewed September 20, 2026 against server main snapshot `d2596927` in an isolated checkout. The public guides describe that source, scoped toward milestone 1.0. They do not certify an RC or deployed release.

## What was checked

Read the updated Markdown and HTML content plan, repository contribution guidance, existing articles, and the complete Humanizer skill. Traced admin navigation, reachable React routes, form labels, mutations, and selected backend contracts. Each guide gives a concrete task, required access, save step where one exists, and an observable check.

The test run used the snapshot's locked dependencies. It made no requests to an actual media server, provider, relay, SMTP service, or user account.

```text
vitest run src/pages/AdminUsers.test.tsx src/pages/AdminAccessGroups.test.tsx
  src/pages/AdminUserDetail.test.tsx src/pages/AdminRequests.v2.test.tsx
  src/pages/AdminHistoryImport.v2.test.tsx src/pages/AdminApiKeys.v2.test.tsx
  src/pages/AdminRecommendations.test.tsx
  src/pages/admin-settings/AISettings.test.tsx
  src/pages/admin-settings/ProvidersSettings.test.tsx
  src/pages/admin-settings/NotificationsAdminSettings.test.tsx
  src/pages/admin-settings/CompatibilityProxiesSettings.test.tsx
  src/components/adminSessionActionsUi.test.tsx
  src/pages/AdminCollections.test.tsx src/player/components/PlayerControls.test.tsx

Test Files: 14 passed
Tests: 140 passed
Duration: 4.11 seconds
```

Two further targeted runs covered the remaining existing UI suites:

```text
vitest run src/pages/AdminSubtitles.test.tsx
  src/pages/AdminAutoscanSettingsWrite.test.tsx
  src/pages/AdminAutoscanTrigger.test.tsx
  src/pages/admin-settings/AppearanceSettings.test.tsx
  src/pages/admin-settings/InvitationsTab.test.tsx
  src/pages/admin-settings/LibraryMetadataSettings.test.tsx
  src/pages/admin/autoscan/SourceWebhookLifecycle.test.tsx
  src/player/hooks/useMarkerEditor.test.tsx

8 files passed, 47 tests passed, 2.44 seconds

vitest run src/pages/AdminPlugins.test.tsx src/pages/AdminSections.test.tsx
  src/pages/AdminSections.concurrency.test.tsx

3 files passed, 26 tests passed, 1.77 seconds
```

Combined result: **25 distinct test files, 213 passing tests**. No failures.

These tests exercise mocked UI behavior, form handling, and authority changes. They do not establish successful delivery, plugin execution, import quality, or playback on a real device.

## Article evidence and remaining checks

All paths in the evidence column are relative to `silo-server` at `d2596927`. Admin route visibility was checked in `web/src/App.tsx`, `web/src/lib/adminNavigation.ts`, and `web/src/lib/adminSettingsSearch.ts`.

| Article | Source evidence | Still needs an end-to-end check |
| --- | --- | --- |
| `accounts` | `web/src/pages/AdminUsers.tsx`; `AdminUserDetail.tsx`; `admin-settings/InvitationsTab.tsx` | Send/copy/accept invite, password reset and account suspension on test users |
| `access` | `AdminAccessGroups.tsx`; user editor `PolicyAccessFields`/`PolicyLimitFields`; `AdminUserDetail.tsx` overview | Allow/deny checks with non-admin and restricted household profiles |
| `help-a-user` | `AdminDevices.tsx`; `AdminUserDetail.tsx` Settings/Devices tabs and impersonation action; `components/ImpersonationBanner.tsx` | Reset only the intended override; enter/exit impersonation without changing unrelated state |
| `active-playback` | `AdminActivity.tsx`; `components/AdminSessionActions.tsx`; `api/v2/adminSessions.ts` | Live controls and termination on each supported client; commands may fall back to ending a session |
| `collections` | `AdminCollections.tsx`; `AdminCollectionEditor.tsx`; `SmartCollectionWizard.tsx`; collection template components | Create/edit/filter/import against a real library and test restricted visibility |
| `home-sections` | `AdminSections.tsx`; `components/sections/SectionEditorDrawer.tsx` | Add and reorder rows, check profile-specific order and access-filtered content |
| `plugins` | `AdminPlugins.tsx`, especially installed cards, configure dialog, community control and `UploadSection`; `internal/plugins/installer.go` manifest execution | Install/configure/update an identified plugin; confirm package verification and feature result |
| `subtitle-providers` | `admin-settings/ProvidersSettings.tsx`; `AdminSubtitles.tsx`; `components/admin/subtitles/AdminSubtitlesTable.tsx` and delete dialog | Real provider search/download, shared track selection, safe deletion |
| `markers` | `admin-settings/LibraryMetadataSettings.tsx`; `MarkerProviderTiles.tsx`; detail `ActionBar.tsx`; `components/markers/MarkerEditor.tsx`; player controls; `internal/markers/write.go` and `internal/models/marker_source_test.go` for manual precedence | Marker lookup/detection, edit persistence and skip timing on the same file |
| `requests` | `AdminRequests.tsx`, settings/queue/integrations/user override panels | Submit as non-admin, approve, inspect adapter acceptance, scan and fulfillment |
| `integration-credentials` | `AdminApiKeys.tsx`; `internal/apiv2/admin_api_keys.go`; `personal_api_keys.go` | Create/use/revoke key and test owner permissions on an isolated server |
| `branding` | `admin-settings/AppearanceSettings.tsx`; save bar | Light/dark, login and narrow-screen checks with approved assets |
| `recommendations` | `AdminRecommendations.tsx`; `admin-settings/recommendationsSettings.ts` | pgvector readiness, paid/local endpoint check, job chain and meaningful profile results |
| `ai-services` | `admin-settings/AISettings.tsx`; subtitle AI create/read fixtures; per-account quota response | Endpoint tests plus real timed subtitle/description job; inspect generated result and quotas |
| `autoscan` | `AdminLibraries.tsx` embedded Autoscan; `AdminAutoscan.tsx`; autoscan `SourcesPanel.tsx` and `ConnectionsPanel.tsx` | Provider-specific setup, path resolution, scan and catalog update; external legacy recipe separately |
| `notifications` | `admin-settings/NotificationsAdminSettings.tsx`; `ServerNotificationChannels.tsx`; `components/notifications/MobilePushPrivacyDisclosure.tsx` | SMTP, browser permission, relay/device push, Discord and webhook delivery; no delivery claim from registration alone |
| `third-party-access` | `admin-settings/CompatibilityProxiesSettings.tsx`; Docker port mapping; compatibility client guides | App login/browse/play through actual host/proxy; include app and server versions |
| `watch-history-import` | `AdminHistoryImport.tsx`; `api/v2/adminHistoryImports.ts` | Source discovery, exact target profile, matching/unmatched results and rerun behavior |
| `watch-state-webhooks` | `settings/WebhookSyncSettings.tsx`; settings route in `App.tsx`; webhook-sync query hooks | Sender-specific recipe on named Plex/Jellyfin/Emby build, account/profile mapping and observed applied result |

## Corrections to inherited material or plan assumptions

- Autoscan is now in **Admin > Libraries > Autoscan**. Connections are within **Sources > Advanced**, not a top-level Connections tab. Sources support webhook setup as well as plugin polling.
- Email setup is inside **Notifications**, with both an Email delivery-channel switch and a **Send email from this server** switch. A separate Email admin page should not be documented.
- AI settings include connection tests for text and speech. Removed provider price tables, untested performance claims, and the obsolete blanket claim that a named gateway cannot transcribe.
- Native push has relay registration in current source. The manual describes the controls and a real delivery check without claiming that registration proves delivery.
- The normal admin user detail screen has no login-session revocation tab. Devices lists preference overrides. The guide deliberately does not invent the plan's admin client-sign-out workflow. Account suspension and playback stopping are kept separate.
- The API-key web form submits only a label and owner. It creates an unscoped key; no scope chooser is invented. Personal-key API creation exists independently of the admin web screen, so the old admin-only statement is not repeated.
- Webhook Sync is a user Settings page scoped to the signed-in account's profiles, not a cross-account admin mapping editor. Server-wide assisted mappings belong to History Import.
- Recommendation settings save individual fields on blur and show an embedding lock after the first successful embed. There is no invented page-wide Save step.
- The manual plugin upload form uploads directly. It is not a staged permission-approval wizard: inspect an unfamiliar binary's source and manifest before uploading it to a disposable server.
- Existing manual marker edits and marker history are documented. No unverified lock-toggle control is invented from the plan's mention of locking.

## Humanizer review

**Detected as:** Blog Post rules, applied to task documentation. The user's requested voice was already explicit: short practical steps, enough context to act, no marketing language, no em dashes. Numbered instructions remain because this is a manual, not an opinion article.

### Assessment

The earlier pages mixed implementation notes, provider recommendations, and setup steps. Replaced them with tasks that start from a reachable screen and end with a check the reader can perform. New articles use the same editorial standard without forcing every feature into an identical number of steps.

### Flags and rewrites

| Exact earlier wording and location | Problem | Resolution |
| --- | --- | --- |
| AI services, Recommended providers: "Fast, inexpensive, and strong across language pairs" | Promotional adjectives without measured evidence | Removed ranking and price claims; use connection tests and inspect a short result |
| AI services, transcription provider: "private, free, no rate limits" | Absolute assurances hide equipment, operator and service constraints | Removed recommendation and describe hosted/local data destinations without cost guarantees |
| AI services, transcription provider: "Any modern GPU transcribes a feature film in minutes" | Broad performance promise without named hardware/test | Removed; require a small job before broader use |
| AI services, opening: "All jobs run once on the server" | Overbroad lifecycle simplification | Describe saved outputs and shared access without exactly-once claims |
| Notifications, Flood safety: "Notifications are designed to never flood on day one" | Absolute reassurance before operational details | Explain initial seeding, grouping and stale suppression directly |
| Notifications, Admin configuration: "presents the system as a pipeline" | Implementation framing before reader action | Start with Notifications, the delivery task, and needed switches |
| Autoscan, Source notes: long route/file inventory after instructions | Contributor evidence mixed into end-user procedure | Move code evidence to this review record |
| First credential draft: "Do not raise it simply to work around" | Unneeded qualifier | Removed "simply" |
| First notification draft: "Keep release events and fanout on" | Unexplained implementation term | Name the actual controls and explain that they collect/distribute events |

Exact UI terms such as **Enabled**, **Enable Recommendations**, and **Configure** are retained even where a general prose filter would reject them. Do not rename interface controls to satisfy a vocabulary list.

### Scores after revision

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-Likeness | 2/10 | Direct tasks replace grand claims; a few repeated checks are needed for safe admin work. |
| Authenticity | 8/10 | Plain maintainer voice names real controls and admits important limits. |
| Reader Value | 8/10 | A reader can find the task, make the change, and know what to check next. |
| Domain Credibility | 7/10 | UI and contract evidence is specific, but real delivery and media workflows remain untested. |

These are editorial judgments, not automated authorship probabilities or acceptance results. The main originality concern is missing lived test evidence, not prose polish. No anecdotes, benchmark claims, or successful delivery stories were invented.

### Next three improvements

1. Have another person follow invitation, access, one shared collection, and one request workflow on an isolated named build.
2. Complete sender/provider/device-specific checks before describing an integration as ready for a release.
3. Add short failure examples from those actual tests rather than another list of speculative problems.

### Skill update

- [x] No new patterns found. Existing rules covered the flags. The skill file was not changed.

The rewritten articles are the output of this pass. Maintainer edits and actual first-time-user feedback should refine them before publication.

## Cross-review

The server-foundations reviewer checked these admin pages and caught the missing separate Email channel switch. Corrected the email steps to turn on both controls and handle a restart notice before testing.

Read the root agent's help index, privacy, report-a-problem, developer index, API entry/reference, and plugin tutorial. Sent two specific corrections: manual plugin upload is not a pre-execution approval screen, and an API key's owner permissions do not mean it works on every route an interactive session can use. The plugin guide now provides the exact **Catalog > Manual Install** path. Suggested a link from privacy to the mobile-push section for relay metadata detail. No changes were made to the root agent's files.
