# Beta documentation audit

## Result and scope

The Beta section contains 15 pages: an overview, 13 task/reference guides,
and an unfinished-feature inventory. Four existing pages moved into it;
11 pages were added. The full manual has 82 navigable pages. Each beta page
has a Beta title and caution, and only the Beta sidebar group lists them.
The former URLs redirect directly to their replacements.

The maintainer's new scope decision overrides the earlier manual:
anything outside the 1.0 milestone, plus audiobooks and ebooks, belongs in
Beta. Audiobookshelf compatibility was explicitly confirmed as beta.
Core setup, security, recovery, and the implementations of named milestone
features remain in the normal guide. We did not classify every setting,
backend dependency, or client-specific control as a separate beta feature.

Beta means outside the supported release promise, not outside security or
data-safety requirements. A capability may be partially implemented, hidden,
or unavailable. The unfinished-feature page records those cases without
inventing activation instructions. Live TV/IPTV/DVR are explicit project
non-goals in the inspected server documentation, not promised beta work.

## Baselines

Fetched `origin/main` for all three product repositories on September 20,
2026. The revisions were unchanged from the previous manual pass:

| Repository | Revision |
| --- | --- |
| Server/web | `d2596927e822c04f0e0e7017654e1369c4c3aa3f` |
| Apple | `c23903c015632685f7a654d9461391f8d5a6880d` |
| Android | `3993d2b1277d59b3b323f634f7b58c6ee9a4969b` |
| Website starting commit | `2a024be` |

The published milestone and the website's starting milestone file matched
SHA-256 `aec34f9d81c72cfd48ed39c274bcbc63338f2b599eca3ef6a3f3c78e73ea6abf`.
It was scope evidence, not proof of implementation. Separate detached
source snapshots protected the user's other checkouts and staged edits.

Read source entry points, menus, routes, settings, feature-policy constants,
and API consumers. A broad source audit is not a proof that every hidden
or dynamically supplied feature has been found.

## Agent records and responsibilities

- [Server/web inventory and five guides](review-beta-server.md): broad
  routes/settings scan, 11 exposed workflows and 14 partial/absent/excluded
  candidates. Those counts include explicit exclusions and are not additive
  to the public guide count.
- [Apple audit and two guides](review-beta-apple.md): iPhone/iPad, Apple TV,
  and native macOS entry paths, controls, and missing interfaces.
- The integrating agent traced Android phone/tablet and TV, moved literary
  guides, wrote the overview/availability pages, and checked the structure.
- [Adversarial cross-review](review-beta-adversarial.md): the Apple agent
  independently checked the other guides and the integration. It was not
  an independent review of its own two authored pages; those were checked
  by the integrating agent.

## Android evidence

Paths are relative to the Android revision above. Phone and tablet use the
same mobile implementation; this establishes code access, not tablet layout
or physical-device acceptance.

| Feature | Source and conclusion |
| --- | --- |
| Audiobooks | `shared/src/commonMain/kotlin/org/siloserver/silo/model/navigation/MediaMode.kt:63-82` maps audiobook libraries to Audio. `androidTvApp/src/androidMain/kotlin/org/siloserver/silo/tv/ui/navigation/TvAppNavigation.kt:1243-1270` registers the dedicated TV audiobook player. `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/MainScreen.kt:505-507` routes downloaded audiobooks to the audio player. The prior manual traced the full player controls; offline multi-file acceptance remains open. |
| Ebooks and comics | `shared/src/commonMain/kotlin/org/siloserver/silo/model/ebook/EbookVersionSelection.kt:66-100,128-140` distinguishes in-app formats, original external-reader downloads, and server-dependent Kindle conversion. `android-shared/src/androidMain/kotlin/org/siloserver/silo/common/ebook/ReaderEnginePolicy.kt:18-53` selects text, PDF, and comic engines. Scanner support is a separate server question; Android TXT/Markdown parsing is not an advertised server import path. |
| Reader controls | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/reader/ReaderScreen.kt:11-49` wires settings, bookmarks, and sections to its model. `ReaderShell.kt:241-265,366-470` names Back, Bookmarks, Sections, Reader settings, Add bookmark, and format-specific settings. `ui/navigation/AppNavigation.kt:1028,1103-1118` routes into the reader. |
| TV reading | Shared `MediaMode.kt:79-82` excludes reading from TV modes; TV library visibility and shell filtering exclude reading libraries. No TV reader workflow is claimed. |
| Mixed libraries | Shared `MediaMode.kt:28-41` includes Mixed under Video. `androidTvApp/src/androidMain/kotlin/org/siloserver/silo/tv/ui/shell/TvLibraryTabType.kt:73-92` omits Mixed from the top-level Movies/Series classifier; `TvMainShell.kt:323` builds type tabs from it. Do not mistake shared filtering support for complete TV navigation. |
| Watch Together | `shared/src/commonMain/kotlin/org/siloserver/silo/model/feature/ClientSurfacePolicy.kt:8` is false. Mobile `MainScreen.kt:317-323` and TV `TvMainShell.kt:1622` apply this constant to menu exposure. Room routes remain compiled. No instructions to flip the flag were added. |
| Native inbox | `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/push/PushNotificationPresenter.kt:146-160,197-202` targets Inbox for a fallback notification without an item destination. `ui/navigation/NotificationNavigationRoutes.kt:8` permits it and `AppNavigation.kt:669-676` mounts the screen. No regular mobile inbox menu or mounted TV inbox route was found. |
| Versions | Mobile `ui/screens/detail/ItemDetailScreen.kt:878-907` selects versions; `ui/screens/player/PlayerScreen.kt:1572` handles in-player selection. TV `ui/screens/detail/TvItemDetailScreen.kt:1297-1450` supplies Version choices and `ui/screens/player/TvPlayerScreen.kt:2229-2231` wires file selection. |
| Preview images | Mobile `ui/screens/player/PlayerProgressBar.kt:55-56` documents text-only previews. Mobile and TV `PlaybackRealtimeController.kt:98` / `TvPlaybackRealtimeController.kt:96` explicitly do not consume chapter-thumbnail events into preview UI. |
| Other candidates | No native watch-provider account-setup UI was found for Trakt/Simkl/MDBList. Admin/session screens are absent from current navigation. Music labels exist but do not establish a server music pipeline; podcast types are absent from library-mode mapping. Google Cast code exists but casting is already named by the milestone, so it was not promoted into a new beta feature solely for being platform-specific. |

## Corrections from review

- Split the ebook format table by web versus Android. The web reader includes
  Kindle and CBR parsing; Android original-file handling differs.
- Replaced a mistaken path-offset calculation in the new sidebar test with
  `relative()` and verified all legacy redirects, not just the original list.
- Limited the audiobook download instructions to Android. No Apple
  audiobook download action was established.
- Replaced uncertainty about Apple Mixed-library placement with confirmed
  Movies/Series menu mapping. Android TV's separate gap remains.
- Corrected five trailing-slash links found by the build validator.
- Kept the catalog-transfer guide's recovery link explicit that a proven
  restore walkthrough is still missing.

## Checks and limitations

- Server agent: 9 focused files, 60 mocked tests passed. See its exact commands.
- Website: four structural tests passed, all internal links passed, build
  completed. Existing 404-entry and sandbox release-feed warnings remain.
- Headless Chrome: all 15 beta pages returned 200 with nonempty content at
  390 and 1280 pixels, 30 page checks, no page-width overflow or JavaScript errors.
- All 23 legacy redirects preserved query strings and fragments in Chrome.
  The mobile menu and Beta group opened with the keyboard and exposed the
  guide links. An initial check used an overly strict text selector; the
  corrected selector passed without a product change.
- No screenshots were taken, as requested.
- No Android/Apple compilation, live server installation, real file transfer,
  external tracker authorization, storage import, or device playback acceptance
  is claimed. The previous isolated UI tests are not recounted as new tests.

## Concurrent work boundary

During this pass, another task changed the milestone, homepage feature/FAQ
copy, client marketing component, feature map, and two discovery guide lines.
Those edits were preserved. This task did not author or revise them.
The reviewer recorded two cross-task concerns: a stale FAQ subtitle-search
claim, and a milestone gate still excluding deferred content from all public
docs while another paragraph permits Beta reference docs. The maintainer was
asked to have the other task reconcile those policy statements. Documentation
changes here do not alter feature gates in any product repository.

## Humanizer review

Detected as: Blog Post fallback adapted to technical documentation. Voice
calibration is the maintainer's request for brief, concrete instructions.
Tables are used for repeated client/format comparisons. Exact UI labels and
necessary safety distinctions are retained. No screenshots, invented user
stories, promotional hooks, or synthetic personal experience were added.

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-likeness | 2/10 | Direct actions and explicit limits replace generic promises. |
| Authenticity | 8/10 | The text addresses the person choosing a client or setting up a library. |
| Reader value | 8/10 | Readers can locate a feature, see why a client differs, and follow a short path. |
| Domain credibility | 8/10 | The advice uses traced controls and immutable evidence without claiming runtime certification. |

Flags and revisions in the root-authored material:

| Initial wording | Correction |
| --- | --- |
| “Earlier ebook implementation notes” | A usable Beta guide with actual reader paths, formats, and limits. |
| “Phone and tablet download code exists” | Named Android and stated that no Apple audiobook download action was established. |
| “TV type-menu placement needs checking” for Apple Mixed | Replaced with the confirmed Movies/Series placement. |
| “Reading depends on server-advertised conversion” for all Kindle clients | Split web native parsing from Android conversion-dependent reading. |

Originality rests on the source-specific distinctions, not firsthand usage.
The three main changes were to name the available client, keep beta steps
out of the ordinary setup path, and separate implementation from validation.
The rewritten public Markdown files are the output; maintainer edits can
further tune the voice.

Skill update: no new patterns found. No skill file changed.
