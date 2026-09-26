# Second independent adversarial manual review

Reviewed September 20, 2026. The review found three actionable documentation issues:
one P1 privacy-related sequencing error and two P2 prerequisite/behavior errors.
The findings below preserve the manuscript and evidence as reviewed.

## Correction status

All three were corrected in a follow-up on September 20, 2026:

- Split Apple and Android manual diagnostics instructions and clarified the
  privacy guide's preview and Ask-setting language.
- Added the HTTPS prerequisite, localhost exception, and unsupported-browser
  checks to both browser-notification guides.
- Limited the avatar fallback to local artwork and explained the private-S3
  requirement for custom uploads with S3 artwork.

These are documentation corrections, not new runtime acceptance results.

## Scope and method

Read all **71 public Markdown files** under `src/content/docs/docs/` and the
complete `src/data/sidebar.mjs`. The sidebar includes **70 navigable pages**;
the retained ebook reference is deliberately excluded from navigation and
search. Inventory: 5 get-started pages, 21 Using Silo pages, 35 Running a Server
pages, 4 developer pages, 4 help pages, the landing page, and the ebook reference.

Reviewed the current uncommitted manuscript on
`docs/organize-public-documentation`, based on website commit
`ee566d21a3127d567d966563dcd9949c24169472`. Read the website's `AGENTS.md`,
`README.md`, and `CONTRIBUTING.md`. Read applicable root agent instructions
before inspecting implementation snapshots. The content plan and the local
1.0 milestone supplied scope, not evidence that a feature works.

| Implementation repository | Verified source revision |
| --- | --- |
| `silo-server` | `d2596927e822c04f0e0e7017654e1369c4c3aa3f` |
| `silo-apple` | `c23903c015632685f7a654d9461391f8d5a6880d` |
| `silo-android` | `3993d2b1277d59b3b323f634f7b58c6ee9a4969b` |

Public file paths below are relative to the website repository. Implementation
paths are relative to the named source repository at the revision above.
Line references describe the manuscript inspected for this review.

I formed the findings before reading earlier reviewer conclusions. I then
compared them with the integration, client, foundation, and admin review
records and the feature-coverage map.

## Findings

### 1. P1 — Apple diagnostics upload before the promised review step

**Public location:** `src/content/docs/docs/help/report-a-problem.md:46-50`.
Related wording: `src/content/docs/docs/help/privacy.md:44-52`.

The shared procedure tells the reader to select **Send Diagnostics Now** on
Apple, then review the report and confirm sending. Apple's manual button
already creates the bundle and invokes upload. A person following the guide
can therefore send logs to the selected destination while expecting another
chance to inspect or cancel them. The privacy page's instruction to read the
report summary and consent prompt should distinguish this manual action from
pending-report and automatic-reporting flows.

**Evidence:**

- Apple `iosApp/iosApp/Screens/Settings/DiagnosticsSettingsView.swift:147-152`
  directly invokes `createAndSendManualReport()` from the button. Its
  `:173-177` footer describes what the selected destination receives before
  the user presses it.
- Apple `iosApp/iosApp/Shared/Diagnostics/DiagnosticsViewModel.swift:235-245`
  creates the report, builds its bundle, and calls `coordinator.upload`
  without opening a report-review screen.
- Apple `iosApp/iosApp/Shared/Diagnostics/DiagnosticsCoordinator.swift:1080-1104`
  retains manual consent regardless of the Ask/Always setting and dispatches
  hosted upload; `:1151-1167` sends the self-hosted bundle through the API.
- Android's contrasting route is explicit:
  `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/settings/diagnostics/DiagnosticsSettingsScreen.kt:69-79`
  calls `captureNow(onReportSelected)`;
  `android-shared/src/androidMain/kotlin/org/siloserver/silo/common/diagnostics/DiagnosticsViewModel.kt:35-36,51-52`
  separates capture/navigation from upload.

**Recommended correction:** Split the platform instructions. On Apple, tell
the reader to check the destination and disclosure before pressing the manual
send button, and explicitly identify that press as sending. Retain Android's
capture, review, and send sequence. Clarify the related privacy paragraph so
it does not imply that every manual send provides a later preview or that
Ask necessarily adds a prompt to Apple's manual button.

**Confirmed versus unverified:** The Apple call sequence and Android split
are source-confirmed. No report was created or uploaded, and no physical
device or remote collector was exercised. This is a documentation error,
not a claim that Apple's accurately labeled send button itself violates
consent requirements.

### 2. P2 — Browser notification setup omits the secure-origin prerequisite

**Public locations:** `src/content/docs/docs/using-silo/notifications.md:24-28`
and `src/content/docs/docs/running-a-server/notifications.md:19-21`.
The affected starting point is
`src/content/docs/docs/get-started/install-silo.md:80`.

The beginner installation instructs another computer to open
`http://SERVER-IP:8090`. Both notification guides then present browser
subscription as enabling a switch and accepting permission, without first
requiring a secure browser origin. On that ordinary HTTP LAN address, service
workers and push subscription are unavailable. The documented troubleshooting
checks preferences and permissions but does not explain this prerequisite;
the UI's generic unsupported-browser message can send a reader toward changing
browsers even though the address is the problem.

**Evidence:**

- Server `web/src/lib/webPush.ts:12-23` checks for service workers, PushManager,
  and Notification support; `:80-99` rejects unsupported environments and
  registers `/sw.js` before subscribing.
- Server `web/src/pages/settings/NotificationsSettings.tsx:622-635` displays
  the unsupported-browser message or blocked-permission message.
- [Mozilla's service-worker registration documentation](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
  identifies the secure-context requirement and the trustworthy-origin rule,
  including HTTPS and localhost. A remote private LAN IP over HTTP is not
  the localhost exception. This documentation was checked during this review.

**Recommended correction:** Add the HTTPS/secure-origin prerequisite to both
browser-push sections. Tell readers who used the beginner HTTP LAN address to
obtain the server's trusted HTTPS address before subscribing. Link operators
to the existing HTTPS guide, while making clear that public internet exposure
is not itself required for browser push. Mention the same check when the
browser reports push as unsupported.

**Confirmed versus unverified:** The code dependency and browser-platform
requirement are confirmed. The consequence for the documented HTTP LAN path
follows from those two facts; no browser subscription or notification delivery
was tested here. This does not claim that every HTTPS browser supports push.

### 3. P2 — Avatar storage has a narrower local fallback than the guide promises

**Public location:**
`src/content/docs/docs/running-a-server/s3-storage.md:54`.
Relevant setup choices are on the same page at `:12-14,32-35`.

The page says avatars use private S3 when configured and a local fallback
otherwise. In a server configured for S3 artwork but without private S3,
there is no avatar-upload store. The local fallback only exists when the
active artwork backend is local. An administrator following the public-S3
setup can therefore expect local avatar uploads to remain available and get
an unavailable upload feature instead. Creating or mounting another local
folder does not address that configuration.

**Evidence:**

- Server `internal/api/handlers/profile_avatar_storage.go:8-18` selects
  private S3 first, uses the artwork store only for `BackendLocal`, and
  otherwise returns `nil`.
- Server `internal/api/handlers/profiles.go:232-244` exposes
  `AvatarUploadEnabled` only when the resulting store is non-nil.
- Server `internal/api/handlers/profile_avatars.go:265-268` rejects upload
  with HTTP 503 when no store is configured.
- Existing source test
  `internal/api/handlers/profile_avatar_storage_test.go:51-61,79-84`
  explicitly checks the local case and rejects public-S3-only storage.
  This test was read, not rerun.

**Recommended correction:** State the three actual cases: private S3 is used
when configured; local artwork supplies the fallback when artwork is local;
S3 artwork without private S3 leaves custom avatar uploads unavailable.
Explain this when choosing public and private storage so administrators can
configure private S3 if they need uploads. Avoid implying that the normal
local-artwork Compose setup lacks avatar persistence: its existing artwork
mount also contains these local avatar objects.

**Confirmed versus unverified:** The backend selection, capability flag, and
error path are source-confirmed. No uploaded avatar, storage migration, or
restart-persistence check was performed. Preset avatars are outside this
finding; it concerns custom uploads.

## Comparison with earlier records

None of the three findings above is recorded as a known discrepancy in the
earlier review notes.

- `docs/review-manual-integration.md:29-35` records the earlier adversarial
  review's four corrections: TV manual-address entry, avoiding overlay-file
  overwrite, retaining Compose overrides, and the admin-facing Audiobookshelf
  PIN warning. Those corrections are present in this manuscript and are not
  repeated as new findings.
- `docs/review-manual-integration.md:56` groups native diagnostics as
  capture/review/send behavior. Finding 1 narrows that claim using Apple's
  direct-upload callback; it is not merely a reminder that diagnostics lack
  runtime tests.
- `docs/review-client-manual.md:71` and
  `docs/review-admin-features.md:73` already identify untested notification
  delivery. Finding 2 is the missing prerequisite before delivery can be
  tested, not a duplicate request for end-to-end evidence.
- `docs/review-server-foundations.md:23` records storage UI and artwork
  identity checks but not the avatar-store conditional in finding 3.
- The missing tested clean-host restore, exact bridge-release instructions,
  central versioned OpenAPI publication, and supported Unraid procedure are
  already identified at `docs/review-manual-integration.md:136-147` and
  `docs/manual-feature-coverage.md:43-52`. They remain limitations, not new
  discoveries in this pass.
- Account-session revocation, Audiobookshelf PIN enforcement, native
  surface coverage, and multipart offline-audiobook uncertainty are already
  captured at `docs/review-client-manual.md:97-123`. The manual generally
  preserves those distinctions rather than inventing controls or guarantees.

## Overall assessment and limits

The beginner path now clearly distinguishes joining a server from installing
one. Using Silo and Running a Server provide useful audience separation, and
advanced operator groups are collapsed in the sidebar. Cross-audience links
usually explain who performs the linked task. I found no additional
structural problem that warrants reorganizing the manual again.

All pages were read, but this was not an exhaustive source audit of every
sentence. Source checks focused on consequential privacy, persistence, setup,
and behavior claims. Reviewed implementation paths also included webhook
profile mapping, supported incoming event types, Compose environment and
mounts, and download pause/retry wiring; those checks did not justify further
findings. No screenshots, live server/device tests, uploads, external writes,
commits, pushes, pull requests, issues, or public-doc edits were performed.
Release download availability and the plugin SDK tutorial were not revalidated
in this second pass. Website build/link checks, when reported by the lead
agent or prior records, are not product procedure evidence.

The follow-up corrections address these three findings. Completing the
previously recorded release and runtime checks remains separate work.
