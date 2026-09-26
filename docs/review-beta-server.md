# Server and web beta audit

> Classification correction (2026-09-26): the maintainer confirmed browser original-file downloads are not Beta. The guide now lives under Using Silo → Watch at the same `/docs/browser-downloads` URL. The original classification below is historical and superseded.

## Baseline and scope

Reviewed `silo-server` at `d2596927e822c04f0e0e7017654e1369c4c3aa3f` on 2026-09-20. All source paths and line numbers in this report refer to that revision. The website baseline was `2a024be`, branch `docs/organize-public-documentation`.

The scope reference is `public/milestone/1.0/index.html`, including the core acceptance criteria, 35 features, release gates, and deferred list. The maintainer's current decision additionally places audiobooks and ebooks outside supported 1.0. Existing functionality outside that boundary belongs in the dedicated Beta documentation area. This audit describes exposed source behavior; it does not decide whether release builds should retain or hide beta entry points.

Read `AGENTS.md`, `README.md`, and `CONTRIBUTING.md` in the website, server `AGENTS.md`, and the complete Humanizer skill. No product code, release definitions, public issues, or remote branches were changed. No servers, accounts, media libraries, or physical devices were used.

## How the inventory was built

Read the full web route set in `web/src/App.tsx:471-701`, the admin navigation, personal settings navigation, and admin settings component registry. Followed candidate actions into their UI handlers, API calls, backend registration, and service implementation. Searched outside the milestone's deferred list for custom themes, catalog transfers, mixed libraries, original-file downloads, tracker integrations, collection sources, playlist routes, network-provider capabilities, and media-type dispatch.

An implementation detail of a scoped feature stays with that feature. A provider-backed collection is still a collection; task schedules are still administration. Neither becomes a beta feature solely because its exact control is absent from an acceptance bullet. Explicit exclusions, additional library types, and distinct user workflows are recorded separately.

## Exposed beta workflows

| Workflow | User entry and actions | Source evidence | Boundary |
| --- | --- | --- | --- |
| Watch Party | Sidebar **Watch Party**, `/rooms/join`; create Host Picks or Vote Together room, join by code/link, choose movie/episode, vote, control transport, end room. | `web/src/components/AppSidebar.tsx:887-902`; `web/src/pages/WatchTogetherJoin.tsx:32-53,201-373`; `web/src/pages/WatchTogetherRoomPage.tsx:630-705,760-777,998-1007`; `internal/apiv2/watch_together_create.go:22`; `internal/watchtogether/selection_resolver.go:33-55`. | Real web entry point exists despite the older milestone statement. Movies/episodes only; signed-in profile and normal catalog access apply. Multi-device playback remains unverified. |
| Watch-provider sync | **Settings → Watch Providers**, `/settings/watch-providers`; connect, choose import/export/scrobble/list settings, Sync now, review runs, disconnect. Admin application credentials at `/admin/settings/watch-sync`, labeled **Watch Providers**. | `web/src/App.tsx:593`; `web/src/lib/adminSettingsSearch.ts:383-399`; `web/src/pages/settings/WatchProvidersSettings.tsx:371-459,552-791`; `internal/watchsync/service.go:749-807`; `cmd/silo/main.go:1241-1255`. | Trakt, Simkl, and MDBList are registered. Plugin providers can extend this. Service capability checks govern work; no live tracker authorization or sync was exercised. |
| Explicit video version/edition choice | Movie or episode detail, Version dropdown when multiple files/variants exist, then Play/Resume. | `web/src/pages/ItemDetail/MovieContent.tsx:70-129,288-295`; `web/src/pages/ItemDetail/EpisodeContent.tsx:71-98`; `web/src/pages/ItemDetail/components/ActionBar.tsx:210,455-467,756-761`. | Selected file ID reaches playback. Displaying an edition label and automatically choosing a preferred file remain core; user selection is explicitly deferred. |
| Audiobooks | Admin creates Audiobooks library; viewer opens detail, Listen/Resume, chapters and audio-player controls. | `web/src/components/admin/libraries/libraryTypes.ts:7`; `internal/scanner/scanner.go:319-326`; `web/src/pages/ItemDetail/index.tsx:200-203`; `web/src/pages/ItemDetail/AudiobookContent.tsx:100-140,226-230`; `web/src/pages/audiobooks/player/PlayerSettingsMenu.tsx`. | Beta by the maintainer's new decision. A dedicated web audio controller exists. Device support must be stated separately. |
| Ebooks | Admin creates Ebooks library; detail Read/Continue opens `/reader/ebook/:contentId`, with the selected file and stored progress. | `web/src/components/admin/libraries/libraryTypes.ts:8`; `internal/scanner/ebook.go:31-39,65`; `web/src/pages/ItemDetail/EbookContent.tsx:47-59,94-107,147-154`; `web/src/reader/FoliateBookReader.tsx:143,194`. | Web reader accepts EPUB, PDF, MOBI, AZW, AZW3, CBZ, CBR, FB2, FBZ and recognizes FB2.ZIP. Format detection is not proof every file renders. DRM conversion errors are explicit in `internal/ebookconvert/converter.go:42-51,214-216`. |
| Manga | Admin creates Manga library; dedicated item detail, chapter/archive files use the reader path. | `web/src/components/admin/libraries/libraryTypes.ts:9`; `internal/scanner/scanner.go:339-343,435`; `web/src/pages/ItemDetail/index.tsx:206-207`; `web/src/pages/ItemDetail/MangaContent.tsx`. | Scanner/detail/reader plumbing exists; no first-party metadata or client-completeness claim follows from this. |
| Mixed libraries | **Admin → Libraries**, type **Mixed**; video content uses the normal movie/series pipeline. | `web/src/components/admin/libraries/libraryTypes.ts:6,17-34`; `internal/librarykind/librarykind.go:18-38`; `internal/scanner/scanner.go:315-350`. | Additional library configuration outside the named Movies/Series certification. It combines existing video behavior, not a music library or arbitrary-media player. |
| Catalog seeds | **Admin → Maintenance**, `/admin/maintenance`; Start Export; Import Catalog from server-local file, completed job, bucket artifact, or remote URL; conflict mode; path rewrites; completed export download/publication. | `web/src/App.tsx:523`; `web/src/pages/AdminMaintenance.tsx:1-17`; `web/src/components/AdminCatalogMaintenance.tsx:144-205,353-420,600-646`; `internal/apiv2/admin_catalog_transfer.go:73-140`; `internal/catalogseed/types.go:13-23`. | Distinct transfer workflow. Seed holds catalog records and paths/references, not accounts, watch state, secrets, media bytes, or a complete recoverable server. Publication creates a seven-day signed URL without changing bucket ACL or renewing an existing URL. |
| Profile custom themes | **Settings → Theme Editor**, `/settings/theme-editor`; tokens, custom CSS, live preview, import/export, community catalog, reset. | `web/src/App.tsx:578`; `web/src/pages/settings/ThemeEditorSettings.tsx:15-112`; `web/src/hooks/useCustomTheme.ts:13-17`; `web/src/components/theme/CatalogBrowser.tsx:20-54,88-104`. | Advanced customization is distinct from supported standard branding. Values are profile-scoped; CSS is rendered by web, not native apps. Catalog may be empty/unavailable. |
| Server advanced themes | **Admin → Settings → Appearance → Colors and theme**, advanced controls for colors/fonts, CSS, community theme-list URL. | `web/src/pages/admin-settings/AppearanceSettings.tsx:71-78,421-463`; `web/src/contexts/CustomThemeProvider.tsx:53-86`. | Server styles and user styles are separate layers. Standard server name/logo/favicon/background/accent remains supported core branding. |
| Browser original-file download | Movie/episode detail overflow **Download**, select a version, browser starts a direct file transfer. | `web/src/pages/ItemDetail/MovieContent.tsx:292-295`; `web/src/pages/ItemDetail/components/ActionBar.tsx:610-613`; `web/src/components/DownloadVersionPicker.tsx:44-55`; `web/src/api/v2/directDownloads.ts:10-48`. | Distinct from the mobile managed-offline feature declared for 1.0. Requires account download permission; browser launch is not transfer completion or offline playback validation. |

## Partial, absent, and excluded surfaces

| Candidate | Finding and source | Documentation treatment |
| --- | --- | --- |
| Podcasts | Type selectable in `web/src/components/admin/libraries/libraryTypes.ts:10`; scanner dispatch in `internal/scanner/scanner.go:329-336`; feed refresh implementation in `internal/audiobooks/podcastfeed/refresher.go:1-17`. Item detail redirects to `/podcasts/show/:id` in `web/src/pages/ItemDetail/index.tsx:208-209`, but `web/src/App.tsx:619-701` has no such route and redirects unmatched paths home. | Partial beta implementation. Do not publish an end-to-end web listening guide or claim RSS subscriptions can be managed through web menus. |
| Music | No music type in the enumerated library choices or library-kind classifier; no route in the full web route inventory. | Unimplemented. Do not turn historical shells into a usable beta guide. |
| Scheduled home-section publication | Admin section builder exists, but inspection/search of `web/src/pages/AdminSections.tsx`, section components, and `internal/sections` found no publication start/end/time-window control. Collection refresh schedules and scheduled maintenance are different functions. | Not an implemented beta workflow at this revision. Keep an availability note, not invented steps. |
| Plugin publisher signatures | Installer requires/checks SHA-256 at `internal/plugins/installer.go:151-200`; no publisher-signature verification path found under `internal/plugins`. | Checksums and catalog trust belong to core plugin management; do not claim cryptographic publisher verification. |
| Network-access provider plugins | No `network_access_provider`, `networkaccess`, or **Network Access** UI matches in reviewed main `internal` and `web/src`; no corresponding admin settings component in `web/src/pages/admin-settings/AdminSettingsLayout.tsx:39-52`. | Prior feature-branch work is not evidence for main. Do not publish setup steps or claim an available provider here. Reverse proxies and normal network/deployment setup remain core. |
| Full timeline trickplay | Web `SeekBar.tsx:288-290` displays the hovered chapter's thumbnail; `ChaptersMenu.tsx:136-138` displays chapter images. No BIF/sprite timeline generator/consumer found in the web production search. | Core chapter thumbnails remain core. Do not relabel them as beta full-timeline previews. Apple-generated frame previews are a separate client finding. |
| Automatic account/profile creation during history import | Milestone explicitly excludes this; imported-history workflow is not a user-provisioning mechanism. | No automatic-creation guide. Existing account/profile mapping stays in core migration docs. |
| AI audio dubbing | No production web route/action found; normal audio selection and AI subtitle translation/transcription are present. | Unimplemented, separate from supported subtitle features. |
| Native admin/inbox/macOS | Outside this repository's client audit. | Use Apple/Android source inventory; do not infer native support from server APIs. |
| Full UI localization | No full translated UI workflow established by the web route/settings audit. Locale dates and metadata translation are different features. | No localization promise. Existing locale, non-ASCII, and metadata-language controls remain core. |
| Letterboxd | A registry test uses a Letterboxd stub (`internal/watchsync/registry_test.go:78-100`); production registration is Trakt, Simkl, MDBList (`cmd/silo/main.go:1243-1250`). | Do not advertise a built-in Letterboxd integration. |
| Playlists | No dedicated user playlist route in `web/src/App.tsx`; HLS playlist references belong to streaming internals. Collections and watchlists have their own implemented routes. | Do not invent playlist management or confuse stream manifests with user playlists. |
| Live TV/IPTV/DVR | Explicit project non-goals in `docs/non-goals.md:10-26`, not missing beta tasks. | Excluded, not beta. |

## Scoped features kept in core

The broader inventory includes collection sources from TMDB, Trakt and MDBList, library scanning and scan tasks, access policies, API keys, invitation/account setup, backups, PostgreSQL/Redis/S3 configuration, reverse proxies, compatibility adapters, notifications, diagnostics, logs, provider credentials, metadata edits, subtitle management, AI subtitles/metadata, recommendations, and admin session control. These implement the milestone's named features or release gates and were not classified as beta solely because the UI exposes extra choices.

Examples: collection-source controls in `web/src/pages/adminCollectionsShared.tsx:754-783,1004-1040,1284-1302` implement collections; task schedules in `web/src/pages/AdminTaskDetail.tsx:372-488` implement administration rather than scheduled home publication. Browser download and catalog seeds are distinct workflows and are therefore listed above. Chapter thumbnails remain supported under the explicit server/web milestone feature.

## Documentation produced

- `src/content/docs/docs/beta/watch-together.md`
- `src/content/docs/docs/beta/watch-sync.md`
- `src/content/docs/docs/beta/catalog-seeds.md`
- `src/content/docs/docs/beta/custom-themes.md`
- `src/content/docs/docs/beta/browser-downloads.md`

The root task owns navigation, literary pages, other-library availability, and final integration. The Apple audit owns version/preview client coverage. Client statements in the two viewer guides use those coordinated source findings: no Apple Watch Party/provider setup, Android Watch Party hidden by its static surface policy, and no Android provider-account setup.

## Verification

Executed the existing focused tests against the reviewed server source using the available web dependencies:

```sh
cd web
./node_modules/.bin/vitest run \
  src/api/v2/watchTogetherCreate.test.tsx \
  src/api/v2/watchTogetherJoin.test.tsx \
  src/pages/settings/watchProviderConnectionConfig.test.ts \
  src/components/AdminCatalogMaintenance.test.ts \
  src/hooks/queries/admin/catalogTransfer.v2.test.ts \
  src/components/theme/CatalogBrowser.v2.test.tsx
```

Result: **6 files passed, 45 tests passed**, 1.51 seconds. These are mocked UI/API and helper tests. They verify request/response handling, stale-context behavior, connection configuration, and catalog/theme interactions. They do not validate external tracker authentication, actual media playback, catalog recovery, or browser rendering on real devices. Website structure/build verification is recorded by the root integration task.

After the browser-download guide was added, ran `src/api/v2/directDownloads.test.ts`, `src/components/DownloadVersionPicker-delivery.test.tsx`, and `src/components/DownloadVersionPicker-rejection.test.tsx`: **3 files passed, 15 tests passed**, 1.26 seconds. The focused total is **9 files, 60 tests passed**. This verifies mocked download authorization/context handling and failure reporting, not a real file transfer. `git diff --check` passed after the five guide edits.

## Humanizer review

Detected as: Blog Post fallback, adapted to technical documentation. The audience is a Silo user or administrator following real controls, not a social-media audience. No invented experience, promotional hook, or unsupported provider claim was added. Existing project prose supplies the voice context.

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-Likeness | 2/10 | The guides use direct steps and real labels; repeated beta notices are intentional because pages can be opened independently. |
| Authenticity | 8/10 | Names, permission limits, and observed UI states make the instructions specific to Silo. |
| Reader Value | 9/10 | Each implemented workflow has an entry path, actions, expected result, and limits. |
| Domain Credibility | 8/10 | Claims are tied to an immutable source revision and focused tests; runtime behavior remains explicitly unverified. |

Flags corrected in the draft: **“Watch Sync”** in the admin navigation instructions became the actual label **“Watch Providers”**. **“Other providers come from installed watch-provider plugins”** incorrectly omitted built-in MDBList; the rewrite names it and its API-key connection. These were factual specificity corrections rather than new stylistic patterns. No em dashes, marketing claims, fabricated examples, or generic hooks remain in the five new public guides.

Originality limits: procedures derive from source review, not firsthand playback or provider use. Avoid claims of certification. The most useful changes were to name actual menus, separate real workflows from unreachable routes, and distinguish initiating a job from its completed result. Full rewrites are the public guide files listed above. Author edits can further tune the wording.

Skill update: no new patterns found; no skill file was changed.
