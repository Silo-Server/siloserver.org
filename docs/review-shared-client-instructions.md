# Shared client instructions review

## Scope

This pass keeps the documentation layout, navigation, slugs, and Beta boundary.
It combines task instructions where Apple and Android implement the same action,
keeps real control and permission differences, and describes server prerequisites
without assuming that the reader and server operator are different people.

The website branch was clean at the start (`a6aaa48`). No checkpoint commit was
needed. Product repositories were read only.

| Source | Revision |
| --- | --- |
| Server and web | `cb0b8b754f14eeb95daa0a2a55b2379d4e4c204c` |
| Apple | `c23903c015632685f7a654d9461391f8d5a6880d` |
| Android | `3993d2b1277d59b3b323f634f7b58c6ee9a4969b` |

The previous review already used these Apple and Android revisions. The local
checkouts being behind did not mean the manuals were based on those old local
branches. This pass reviews the instructions again against the current source.

## Server evidence

- `web/src/pages/admin-settings/AISettings.tsx:568` and `:734`: independent text,
  speech, and feature controls; description-on-view modes; shared account quota.
- `web/src/components/MetadataTranslatePanel.tsx:30`: availability check, language,
  re-translation option, series children, and job result.
- `web/src/hooks/useOnViewTranslation.ts:26` and
  `internal/api/handlers/metadata_ai.go:79`: description translation follows server
  mode and item access, rather than whether the reader runs the server.
- `web/src/pages/admin-settings/NetworkAccessSettings.tsx:184`: network-provider
  controls now exist on main. Corrected the Beta list's obsolete separate-branch
  statement without claiming that a provider is installed or available to download.
- The server diff from `d2596927e` was checked for web documentation impact. Its
  AI settings and metadata translation panels are unchanged. This is a focused
  source review, not a new certification of every server procedure.

## Review ownership

Two agents owned separate browsing/account and playback/onboarding guide groups.
The coordinator owned AI setup, privacy, and related Beta wording. A cross-review
identified the administrator transcription-quota exemption; the wording now
preserves it (`internal/api/handlers/subtitle_ai.go:161`).

## Client evidence

Paths below are relative to the named product repository.

| Task | Apple evidence | Android evidence |
| --- | --- | --- |
| Saved titles and watched status | `iosApp/iosApp/Screens/Detail/MovieDetailContent.swift:134` | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/detail/DetailSharedComponents.kt:1166` |
| Switch profile | `iosApp/iosApp/Screens/Settings/IOSSettingsOverview.swift:26` | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/settings/AccountSection.kt:76` |
| Calendar filters | `iosApp/iosApp/Screens/Calendar/CalendarFilterBar.swift:42` | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/calendar/CalendarScreen.kt:373` |
| Requests and status labels | `iosApp/iosApp/Screens/Requests/Hub/RequestsHubView.swift:125` | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/requests/RequestsScreen.kt:68` |
| Collection creation differs | `iosApp/iosApp/Screens/Collections/CollectionsView.swift:199` | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/collections/CreateCollectionSheet.kt:91` |

The full collection editor, ratings walkthrough, password changes, imports, and
notification inbox instructions remain web-specific. Shared phone/tablet steps
are qualified rather than assumed to apply to every TV control.

Playback evidence:

- Apple `iosApp/iosApp/Screens/Player/iOS/MobilePlayerControls.swift:560` and
  Android `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/player/PlayerControls.kt:619`:
  shared mobile track, quality, and chapter controls.
- Android `androidTvApp/src/androidMain/kotlin/org/siloserver/silo/tv/ui/screens/player/TvPlayerHud.kt:589`:
  Audio/Subtitles/Video/Chapters tabs, replacing the guide's pre-play-only instructions.
- Apple `iosApp/iosApp/Screens/Player/Sheets/SubtitleTranslateMenu.swift:178`:
  automatic source selection after choosing a language. Android's
  `AiTranslateSheet.kt:168` and `TvAiTranslateDialog.kt:241` expose source modes.
  The guide preserves that difference.
- Apple `Downloads/DownloadActionButton.swift:50` and Android
  `DownloadQualityPickerSheet.kt:58`: download defaults versus quality selection
  still differ, so the guide retains separate details.

Cross-review of sampled browsing/account/request changes found no substantive
unsupported parity claim. Integration corrected the app reference's lingering
web-only request claim, the Android **Sign out** label, and an implication that
the AI settings page contains a failed-jobs viewer.

## Humanizer assessment

Detected as technical documentation, using the skill's Blog Post fallback.
The requested voice is short, practical task instructions. Exact control labels,
procedural lists, permission boundaries, and warnings take priority over stylistic
rules intended for marketing articles. No stories, hooks, or rhetorical closers
were added.

| Flag and location | Change |
| --- | --- |
| Privacy: “Ask the server administrator which providers they use” | Ask readers to check configured providers, with a fallback when they lack settings access. |
| Audiobookshelf: “An administrator opens” | Address the person doing setup directly and name the required account permission. |
| Watch sync: “An administrator opens” | Lead with the application-credential prerequisite and its settings location. |
| Repeated Apple/Android procedural sections | Combine verified shared actions; retain different labels or entry points where needed. |
| AI setup without a direct connection to use | Link configured services to their feature switches and supported client actions. |
| Requests: “Changing profiles to get around a limit is not a fix; ask the administrator.” | Replace the admonition with the permission/limit explanation and settings link. |
| Browsing: “The steps here use the web app.” | Broaden to verified shared steps and name web-only controls separately. |

Editorial scores, not AI-detection measurements: AI-likeness 2/10 (little filler),
authenticity 8/10 (direct, neutral audience), reader value 8/10 (short steps and
setup links), domain credibility 8/10 (source evidence with runtime limits).

The main improvements are shared steps, explicit prerequisites, and links to
setup rather than repeated referrals to another person. No new Humanizer pattern
was identified; the skill was not changed.

## Validation limits

Source review does not establish real-device behavior, external provider health,
or end-to-end playback. No live AI jobs, account changes, or server setup was
performed. Existing diagnostic, TV input, download, and Beta exceptions must not
be removed merely to make the clients read alike.

`bun run test:docs` passed all seven structure checks. `bun run build` passed
all ten documentation/banner tests, built 102 pages, and validated internal
links. The existing missing `docs/404` entry warning remains. `git diff --check`
passed. No screenshots or device walkthroughs were performed in this text-only pass.
