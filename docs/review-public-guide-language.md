# Public guide language review

Reviewed 26 September 2026, starting from website `cca5446`.

## Editorial decisions

The maintainer approved removing temporary app limitations, bug workarounds,
and repeated source-review or certification disclaimers from public guides.
Prerequisites, access controls, storage requirements, format dependencies, and
supported platform differences remain explicit. Removing a qualification is
not evidence that a bug was fixed or acceptance passed.

The unfinished-features URL remains a searchable reference for feature names
users encounter. It gives an available interface or alternative rather than
an implementation inventory. Existing section anchors are retained.

The shared notice states that the guides describe prerelease software. The
source revisions and review date remain in `src/data/docs-release.mjs` rather
than appearing on every page. That shared baseline was not advanced. Per-page
Git commit dates and explicit minimum-version requirements are unchanged.

## Focused source checks

Server/web: `66f6a52a3f586f4e9bb7ad19fb6c1f67f6c2b621`, the server build used in
the Calendar review. Files were read from that Git revision into a temporary
directory, not from the older modified server checkout.

Apple: `a63c511b9098ad6f9733b7f10d33a4803dd434f8`.
Android: `86e1ebc7fc8aef07985b8e43de54318a53079936`.
Unrelated local changes in these repositories were preserved.

| Topic | Evidence and resulting guidance |
| --- | --- |
| Audiobook downloads | Android `AudiobookDetailContent.kt`, `ItemDetailScreen.kt`, and `DownloadEntryRows.kt` connect an audio file to Download and an in-app offline player. Apple `AudiobookDetailContent.swift` provides listening actions in place of download. The guide gives platform-specific routes and retains an offline playback check. |
| Native Mac video | `MacPlayerOptionsPanel.swift`, `MacPlayerControls.swift`, and `MacPlayerCommandCapture.swift` support the documented track, chapter, fullscreen, and keyboard controls. The guide is explicitly a source-build workflow; it makes no distributed-release claim. |
| Android inbox entry | `PushNotificationPresenter.kt` routes an alert to an episode or series when an ID exists, otherwise Inbox. `NotificationExternalRoute.kt` scopes the route to a server and profile. Web Notifications is the direct history-browsing route. |
| Mobile playback | Apple `MobilePlayerControls.swift` uses full, short, then icon labels and hides Chapters without chapters. Android `PlayerControls.kt` moves actions into More playback controls when width is insufficient. |
| TV playback | Apple `TVPlayerInfoHUD.swift` gates Audio on tracks, Chapters on chapters, and Subtitles on tracks or actionable search/AI. Android `TvPlayerHud.kt` gates Audio/Chapters but always displays Subtitles. |
| Ratings | Web `MovieContent.tsx` and `SeriesContent.tsx` use `MediaUserActionBar`; `ActionBar.tsx` renders stars and the compact menu's Your rating group. Episode/season pages do not use this rating action. |
| Collection ordering | `CollectionEditor.tsx`, `ManualCollectionItemsEditor.tsx`, and `SmartCollectionWizard.tsx`: manual drag ordering requires edit access, reorder capability, and a complete matching unpaginated snapshot. Smart collections use saved sort rules; imported ordering is source-managed. |
| Catalog export | `AdminCatalogMaintenance.tsx` shows Create seven-day link after completion when public links are supported and absent; Copy URL follows publication. `catalog_transfer_service.go` requires storage presigning and does not renew an existing link. Local storage uses Download. |
| Mixed libraries | Web `libraryTypes.ts` exposes Mixed and Podcasts. Apple `Models.swift` and `LibrariesTabView.swift` classify Mixed under Movies and Series; Android shared `MediaMode.kt` classifies it as video. Android TV guidance uses separate movie/series libraries. |
| Chapter images | The library handler advertises chapter-thumbnail support only with its artwork store. The existing public-asset S3 prerequisite remains; only temporal wording was removed. |

## Findings retained internally

Earlier source reviews documented Apple TV audiobook navigation gaps, an
unregistered podcast detail route, Android TV Mixed-library classification,
native Mac audiobook-player and navigation gaps, and indirect native inbox
entry. These findings are not fixed or accepted by this prose change. See
`review-beta-integration.md` for the earlier Beta review and its baseline.

The removed certification statements concerned audiobook device acceptance,
version/preview controls, Watch Party synchronization and recovery, ebook
bookmark/progress parity, provider connections, and third-party client
matrices. This review does not add runtime evidence for those features.
Multi-file audiobook offline coverage still needs device validation; the
public instructions retain a test before travel rather than promising that
a completed transfer proves every chapter is playable.

Security qualifications about Audiobookshelf profile PINs, API-key authority,
and diagnostic uploads were retained. The backup guide now states its scope
as planning and recovery checks, not a complete clean-host restore procedure.

No live-server or real-device walkthrough was performed. Source review and
website rendering checks do not establish feature acceptance.

## Checks

- `bun run test:docs`: 7 tests passed.
- `bun run build`: 10 prerequisite tests passed; 102 pages built, with valid
  internal links and anchors. Network-limited release lookups used the normal
  repository-link fallback.
- `git diff --check`: passed.
- Browser inspection at 1280 × 800 and 390 × 844 confirmed the simplified
  notice and readable playback tables. Audiobook downloads, collections,
  catalog exports, and unfinished-feature tables fit the mobile viewport
  without horizontal page overflow. Screenshots remain outside the repository.
- The wording pass followed `the-humanizer` and the repository's plain-language
  guidance, retaining exact controls and factual prerequisites. No new writing
  patterns required a skill update.

## Maintainer scope and organization corrections

- Browser downloads and Mixed video libraries are regular features, not Beta. Mixed setup is consolidated into `/docs/manage-libraries`; the unpublished standalone library-types page was removed and incoming guide links updated. Listening and reading setup stays in its existing Beta guides. The Android TV Mixed-library workaround was omitted under the public-docs policy on temporary app limitations.
- Version and edition selection now lives in `/docs/watch-movies-and-series`. The existing `/docs/versions-and-previews` URL retains Apple preview instructions and its Beta designation. Web chapter images remain regular playback functionality. These classifications supersede the earlier Beta audit; implementation procedures reuse the recorded source review.
- Catalog transfer is described as a web-admin workflow without tables. Beta guidance explains experimental status and possible promotion or removal. The shared prerelease notice explains active pre-1.0 development and frequent docs updates; no version selector was introduced.
