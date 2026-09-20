# Client manual: first-pass review

Reviewed September 20, 2026. This is maintainer evidence, not a public how-to
or a claim that a released device build passed acceptance.

## Baseline and scope

The client pass follows S01, S02, U01-U18, and R05 in the September 19 content
plan. It writes current-main instructions for the 1.0 subject areas, not
steps for features that exist only in milestone prose. It replaces the old
unversioned feature matrix and third-party “verified” table.

Sources are isolated immutable checkouts:

- `silo-server`: `d2596927`.
- `silo-apple`: `c23903c0`.
- `silo-android`: `3993d2b1`.

All procedures below were traced through source UI labels and callbacks.
None were exercised against a real media server, physical device, or live
notification provider. Narrow web component tests use isolated mocks.

Final cross-review corrections:

- Added the missing TV server-address entry before QR or password sign-in.
  Apple `iosApp/iosApp/Screens/Auth/TVServerSetupView.swift:185-263` and
  `ServerSetupViewModel.swift:74-159` accept an address with protocol and
  port; Android TV `ui/screens/auth/TvServerSetupScreen.kt:450-555` exposes
  the matching address field and **Connect to server** action.
- Replaced developer README links in the app chooser with installation
  channels. The integrating reviewer checked the public Apple TestFlight
  invitation and Android release `v1.0.1-rc.1+2` assets on September 20,
  2026. The guide names the universal phone/tablet and TV release APKs;
  no public Play Store listing or successful installation is claimed.
- Removed library selection from the manual-collection creation steps.
  The library picker in `web/src/pages/userCollectionsShared.tsx:239-252`
  is conditional on a smart collection, not a manual one.
- Read the install, requirements, libraries, backup, updates, and playback
  guides from a new administrator's perspective. Compared installation
  settings with `.env.example` and `docker-compose.yml`, and the upgrade
  guidance with `docs/update-to-1.0.md:1-115`. No additional blocking
  discrepancy found after the integrating reviewer's GPU overlay safety
  fixes. This is a source review, not a clean-host restore or GPU test.

## Article evidence

Paths below are relative to the named implementation repository. Line ranges
refer to the immutable revisions above. Public article paths are relative
to `src/content/docs/docs/`.

| Article | Plan IDs | Source UI and behavior inspected | Validation boundary |
| --- | --- | --- | --- |
| `get-started/choose-an-app.md` | S01, R05 | Apple `Screens/Auth/LoginView.swift:24-86`; Android `ui/screens/auth/LoginScreen.kt:88-158` under each app's source root; server `web/src/pages/Login.tsx:260-418` | Source-backed app entry points; distribution links go to owning projects, no invented storefront availability. |
| `get-started/join-a-server.md` | S01 | Server `web/src/pages/InviteClaim.tsx:120-298`, `Login.tsx:260-418`, `Profiles.tsx:46-154`; Apple `iosApp/iosApp/Screens/Auth/LoginView.swift:24-86`; Android `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/auth/ServerSetupScreen.kt:95-236`, `LoginScreen.kt:88-158` | Profile component tests passed. Invitation form, mobile connection, and first-play steps are source-only. |
| `get-started/tv-sign-in.md` | S02 | Server `web/src/pages/ActivateDevice.tsx:35-223`; Apple `iosApp/iosApp/Pairing/Companion/CompanionPairingCard.swift:100-212`, `CompanionPairingCoordinator.swift:100-204`, `Pairing/Receiver/TVPairingReceiverView.swift:63-125`, `Screens/Auth/TVLoginView.swift:98-187,294-382`; Android `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/pairing/CompanionPairingBottomOverlay.kt:258-411`, TV `ui/screens/auth/TvLoginScreen.kt:649-727`, `TvServerSetupScreen.kt:730-770` | Matched approval buttons, server selection and device-code handoff; all four brand pairings require runtime validation. |
| `using-silo/profiles.md` | U01 | Server `web/src/pages/Profiles.tsx:46-154`, `pages/settings/ProfilesSettings.tsx:24-251`, `components/AppSidebar.tsx:1113-1133`; Apple `iosApp/iosApp/Screens/Settings/GeneralSettingsView.swift:24-54`, `Shared/ProfileLaunchBehavior.swift:25-58`, `tvOS/Screens/Settings/TVGeneralSettingsView.swift:30-42` | Web profile tests passed; Apple launch policy is source-backed, Android equivalence not asserted. |
| `using-silo/find-something.md` | U02 | Server `web/src/components/AppSidebar.tsx:294-328`, `pages/LibraryPage.tsx:361-490`, `pages/PersonDetail.tsx:69-79,195-225`, `pages/settings/LibrarySettings.tsx:98-140` | Web navigation and filter callbacks; no production metadata/search check. |
| `using-silo/home-and-calendar.md` | U03 | Server `web/src/pages/Home.tsx:250-305`, `Recommendations.tsx`, `Calendar.tsx:21-32,129-232`, `pages/settings/HomeScreenSettings.tsx:250-278,396-575` | Source-only; labels corrected from backend “everything” to actual “All”. No recommendation ranking or release-date accuracy proof. |
| `using-silo/collections.md` | U04 | Server `web/src/pages/Collections.tsx:193-258,319-389`, `CollectionEditor.tsx:87-126`, `userCollectionsShared.tsx:180-252`, `components/collections/CollectionBuilder.tsx:175-357`, `ManualCollectionItemsEditor.tsx:79-144,206-334` | Collection and creation tests passed; persisted member access still requires end-to-end acceptance. |
| `using-silo/saved-titles.md` | U05 | Server `web/src/pages/ItemDetail/components/MediaUserActionBar.tsx:25-79`, `ActionBar.tsx:523-552,595-600`, `components/AppSidebar.tsx:849-884` | UI-to-mutation wiring; no live cross-device write check. |
| `using-silo/watch-movies-and-series.md` | U06 | Server `web/src/pages/ItemDetail/components/ActionBar.tsx`, `player/components/PlayerControls.tsx:240-350,480-545,590-665`, `QualityMenu.tsx:100-130`, `pages/settings/PlaybackSettings.tsx:280-400`; Apple `Screens/Player/iOS/MobilePlayerControls.swift:543-620`, `tvOS/TVPlayerTransportCluster.swift:48-88`, `TVPlayerInfoHUD.swift:38-78`; Android mobile `ui/screens/player/PlayerControls.kt`, TV `ui/screens/detail/TvPlaybackSelectorRow.kt` | Source-backed controls only. No codecs, HDR, receiver, skip timing, or playback acceptance claimed. |
| `using-silo/listen-to-audiobooks.md` | U07 | Server `web/src/pages/ItemDetail/AudiobookContent.tsx:101-155,220-305`, `pages/audiobooks/player/audiobookPlaybackContext.tsx:80-113`, `MiniBar.tsx:160-182`, `NowListening.tsx:208-220`; Apple `Screens/Detail/AudiobookDetailContent.swift:300-402`, `Screens/Audio/AudioMiniPlayerView.swift:12-24`, `AudioFullPlayerView.swift:200-252`, `tvOS/Screens/Detail/TVAudiobookDetailView.swift:305-328`; Android mobile `ui/screens/audiobook/AudiobookPlayerScreen.kt:325-373`, TV `ui/screens/audiobook/TvAudiobookPlayerScreen.kt:441-493` | Explicit web, iPhone/iPad, Android mobile, and TV sections. Background audio and multi-device resume need runtime tests. |
| `using-silo/subtitles.md` | U08 | Server `web/src/player/components/SubtitleMenu.tsx:94-118,170-337`; `web/src/pages/SettingsLayout.tsx:105-134`; `pages/settings/SubtitleAppearanceSettings.tsx`; `pages/settings/DeviceSettings.tsx:304-431` | Source-only setting and player routes; actual text/image/ASS rendering not tested. |
| `using-silo/missing-subtitles.md` | U09 | Server `web/src/player/components/SubtitleMenu.tsx:73-91,307-390`, `SubtitleSearchModal.tsx:119-235,246-389`, `SubtitleTranslateModal.tsx:66-194,244-379`, `components/subtitles/SubtitleUploadForm.tsx:28-58`; shared-media upload/download handlers under `internal/apiv2/subtitle_upload.go` and `subtitle_download.go` | AI modal unit tests passed. No external provider, shared-track playback, or quota execution test. |
| `using-silo/downloads.md` | U10 | Apple `Screens/Detail/MovieDetailContent.swift:162-234`, `Downloads/DownloadsView.swift:24-65,130-154,173-214`, `Screens/Detail/ItemDetailView.swift:372-427`; Android `ui/screens/detail/ItemDetailScreen.kt:428-499,930-1002`, `ui/screens/downloads/DownloadsScreen.kt:210-327` | Download UI wiring. Android audiobook action explicitly downloads one selected original file; no whole-book completeness or offline proof claimed. |
| `using-silo/tv-remote.md` | U11 | Apple `Screens/Detail/ItemDetailView.swift:55-102`, `Control/iOS/SiloControlRemoteView.swift:35-75,138-200,340-480`, `Control/iOS/SiloControlModeButton.swift:4-34`; Android `ui/screens/detail/ItemDetailScreen.kt:1005-1012,1138-1163`, `ui/screens/cast/SiloCastTargetPickerSheet.kt:50-195` | Exact entry points and target-selection callbacks. Cross-platform control and network recovery remain source-only. |
| `using-silo/preferences.md` | U12 | Server `web/src/pages/SettingsLayout.tsx:74-307`, `pages/settings/DeviceSettings.tsx:239-431` | Device settings tests passed. Explicit “Forget” semantics traced; no claimed revocation. |
| `using-silo/watch-history.md` | U13 | Server `web/src/pages/ItemDetail/components/WatchedActionBar.tsx:1-29`, `ActionBar.tsx:523-535,575-600`, `internal/userstore/pgstore/progress.go`; web audiobook resume source above | Profile-scoped progress and deliberate rewind described; concurrent/offline conflict rules not invented. |
| `using-silo/import-watch-history.md` | U14 | Server `web/src/pages/settings/HistoryImportSettings.tsx:330-630,640-675,810-875` | Import settings tests passed; no source-service OAuth or real matching import. |
| `using-silo/requests.md` | U15 | Server `web/src/pages/Requests.tsx:68-94,234-306`, `RequestDetail.tsx:195-267` | Buttons and status labels traced. No acquisition run; no fabricated standalone “Follow” button. |
| `using-silo/notifications.md` | U16 | Server `web/src/pages/settings/NotificationsSettings.tsx:112-140,213-352,381-470,624-680,874-1000`; Apple `ContentView.swift:269,423`, `Notifications/ApplePushRegistration.swift:183-212`; Android `MainActivity.kt:300-333`, `push/SiloFirebaseMessagingService.kt:35-67` | Source-only permission/registration wiring, no live delivery. Native inbox not promised. |
| `using-silo/accounts.md` | U17 | Server `web/src/pages/settings/AccountSettings.tsx:28-140`, `DeviceSettings.tsx:350-369`, `components/AppSidebar.tsx:1113-1133`; Apple `Screens/Settings/SettingsView.swift:40-75,280-298`; Android `ui/screens/settings/SettingsScreen.kt` | Account and device tests passed. Self-service login revocation UI not found; lost-device path goes to administrator. |
| `using-silo/jellyfin-apps.md` | U18 | Server `internal/jellycompat/login.go:60-210`, public endpoint setup in Compose/config | Resolver source checked. No third-party client tested; removed unsupported certification list. |
| `using-silo/audiobookshelf-apps.md` | U18 | Server `internal/audiobooks/cred_validator.go:42-94,126-192`, `internal/audiobooks/abs/login.go:69-107` | Account password plus optional profile selector differs from Jellyfin. Profile PIN enforcement gap called out. |
| `using-silo/client-feature-reference.md` | R05 | Replaces prior matrix with task links and source-specific boundaries from this table | No release-certified format matrix available. Does not infer runtime capabilities from milestone tags. |
| `using-silo/apple-tv-playback.md` | R05 | Apple `tvOS/Screens/Detail/TVItemDetailView.swift` selector wiring and player controls above | Diagnostic guide replaces unsupported codec/Atmos guarantees; hardware validation still needed. |

Apple source paths without a full prefix start at `iosApp/iosApp/`.
Android mobile `ui/` paths start at
`androidApp/src/androidMain/kotlin/org/siloserver/silo/android/`;
Android TV `ui/` paths start at
`androidTvApp/src/androidMain/kotlin/org/siloserver/silo/tv/`.

## Isolated checks

Ran in the clean server snapshot's `web` directory:

```sh
pnpm exec vitest run src/pages/Profiles.test.tsx src/pages/Collections.test.tsx src/pages/CollectionEditor.creation.test.tsx src/pages/SettingsLayout.test.tsx src/pages/settings/AccountSettings.test.tsx src/pages/settings/HistoryImportSettings.test.tsx src/pages/settings/DeviceSettings.test.tsx src/player/components/SubtitleTranslateModal.test.ts --maxWorkers=2
```

Result: **8 files passed, 50 tests passed**. These tests exercise mocked
web UI and request contracts, not an installed server or native client.
`git diff --check` passed after the client edits. Main-agent integration
owns the whole-site build and link checks.

## Product and coverage questions for maintainers

1. **Audiobookshelf profile PIN gap:** `SiloCredValidator.Validate` checks
   the account password then looks up the requested profile without checking
   its PIN. Do not copy Jellyfin's PIN instructions here or claim identical
   household protection. Confirm the desired 1.0 behavior separately.
2. **Client revocation UI:** web Account settings exposes a password change;
   Your Devices exposes preference deletion. A self-service login-revocation
   UI was not located. The manual does not invent one.
3. **Remembered profiles:** Apple's current launch policy has Automatic,
   Every Time, After 1 Hour, and After 12 Hours. Android parity was not
   established. Apple Automatic explicitly permits a protected profile to
   reopen without a fresh PIN.
4. **Nearby TV setup:** current receiver UI asks to allow setup and the phone
   asks for matching-code confirmation. Follow actual source rather than
   assuming a silently approved first sign-in.
5. **Home customization:** current web source includes personal custom-row
   authoring in addition to reorder/hide. The manual covers the accepted
   1.0 reorder/hide task and does not falsely claim authoring is impossible.
6. **Offline audiobooks:** Android offers an original-file download action.
   A single selected file is not proof that every part of a multipart book
   was downloaded. Apple movie/episode downloads do not establish Apple
   audiobook downloads.
7. **Surface coverage still needed:** most advanced task procedures use web
   as the shared fallback. Native search/filter, private collection editing,
   requests, import, and profile-management variants need separate source
   and runtime acceptance before adding exact native steps.

## Humanizer review

**Detected as:** Blog Post by the skill's default, adapted to technical
documentation. The user's voice brief is concise, practical, easy to follow,
with necessary context retained. Procedural numbered lists, UI labels,
commands, safety warnings, and terminology are preserved; no marketing
hooks, invented experiences, or engagement-style closing questions were added.

### Overall assessment

The first draft is a task manual instead of a catalog of capabilities.
The weakest material was inherited unversioned support claims, followed by
vague native instructions. Those were replaced by concrete controls or an
explicitly scoped web procedure. Device acceptance is still separate work.

### Scores after rewrite

Scores are editorial judgments, not an automated AI detector.

| Article group | AI-Likeness | Authenticity | Reader Value | Domain Credibility |
| --- | --- | --- | --- | --- |
| App choice, join, TV setup | 2/10 | 8/10 | 9/10 | 8/10 |
| Profiles, accounts, preferences | 2/10 | 8/10 | 8/10 | 8/10 |
| Discovery, home/calendar, collections, saved titles | 2/10 | 8/10 | 8/10 | 8/10 |
| Video, audio, subtitles, missing subtitles | 2/10 | 8/10 | 9/10 | 8/10 |
| Downloads, TV remote, progress | 2/10 | 8/10 | 9/10 | 8/10 |
| Import, requests, notifications, compatibility | 2/10 | 8/10 | 9/10 | 8/10 |
| App reference, Apple TV diagnostic guide | 2/10 | 8/10 | 7/10 | 7/10 |

- AI-Likeness: direct tasks and UI labels replace stock introductions and
  unsupported adjectives; repeated procedural structure is intentional.
- Authenticity: the voice is calm and specific, with normal instructions
  rather than invented anecdotes or an imitation of a personal brand.
- Reader Value: short steps include the prerequisite, expected result, and
  a useful next check when the task fails.
- Domain Credibility: source-level paths and callbacks support the advice,
  but absent hardware and service testing limits the score.

### AI pattern and factual flags resolved

| Exact original quote and location | Problem | Rewrite or resolution |
| --- | --- | --- |
| App directory: “verified, recommended” | Unversioned authority claim without evidence | Removed certification table; link to owning project and protocol procedure. |
| Feature reference: “Yes ... implemented and working” | Source and runtime claims collapsed into a broad matrix | Replaced matrix with task links and actual surface boundaries. |
| Jellyfin guide: “The answer is to type them together” | Runway before the useful instruction | Start with the Username and Password fields. |
| Jellyfin guide: “A few things worth knowing” | Stock list introduction | State spacing and profile-case rules directly. |
| First audiobook draft: “When using a TV, keep its playback controls in view” | Vague instruction without a control | Added Apple TV Chapters/Start Over and Android TV speed/Sleep/Chapters paths. |
| First account draft: “use Sign out in the profile menu” | Plausible but wrong UI label | Corrected to web “Logout”. |
| First calendar draft: “Everything” | Internal value mistaken for label | Corrected to “All”. |
| First request draft: “follow the existing request using the action shown” | Implied a separate control without wiring evidence | Use Request movie/series, or inspect the status already shown. |
| First home draft: “Reset” | Confirmation label used as primary action | Corrected to “Reset to Default”. |

No em dashes or promotional filler remain in the authored client pages.
Exact UI labels with ellipses retain the application's spelling.

### Originality and clarity concerns

This is a manual, so novelty is not a goal. Its value comes from Silo-specific
boundaries: account versus profile, device Forget versus sign-out, original-file
versus whole-book download, two compatibility sign-in formats, and setup
approval versus remote control. No eyewitness claim or test result was invented.
Public generic “Source notes” anchors remain only to preserve old links;
the full technical evidence lives in this review.

### Top three changes applied

1. Put the user's immediate action before architecture or feature descriptions.
2. Keep a short main path and move failures, alternate surfaces, and limits
   into named sections.
3. Replace uncertain parity with traced controls, retaining a web fallback
   when a native route was not established.

### Rewrite and skill update

The complete rewrites are the 24 Markdown pages listed above. The maintainers'
edits on top of this first pass should determine the final public voice.

- [x] No new Humanizer patterns found in this review. Existing rules cover
  the phrasing and structural flags. No skill file was modified.
