# Apple Beta feature audit

Reviewed 2026-09-20 against a read-only snapshot of `Silo-Server/silo-apple` main at `c23903c015632685f7a654d9461391f8d5a6880d`. Paths below are relative to that repository; line numbers refer to that exact revision. Website baseline: `docs/organize-public-documentation`, `2a024be`. This is source evidence, with no build, installed-app, simulator, or device certification.

The user placed audiobooks and ebooks outside supported 1.0, in addition to everything outside the milestone. This overrides the milestone's older audiobook inclusion. The audit follows reachable controls, platform conditions, and API calls. A compiled view alone does not establish an available workflow.

## Client matrix

| Feature | iPhone | iPad | Apple TV | Native SiloMac |
| --- | --- | --- | --- | --- |
| Audiobook library navigation | Opt-in in Settings | Same opt-in; sidebar at regular width | Conditional; local opt-in required, but toggle shown only with legacy customization support | Hidden by default; no settings toggle found |
| Audiobook detail and audio start | Wired | Wired | Wired when a title is reached | Search can reach detail and start audio |
| Full audiobook player, speed, sleep timer, chapters | Wired | Wired, shared player | Wired, TV layout | Full-player presentation excluded; do not claim control parity |
| Ebooks, manga, comics | No reader | No reader | No reader | No reader |
| Music, podcasts, Live TV | No dedicated supported browse/player workflow found | Same | Same | Same |
| Explicit file-version choice | Detail Version picker; Edition when multiple groups exist | Shared detail picker | Detail Versions menu | Shared detail picker |
| Scrubbing preview frames | Rendered when frame available | Shared controls | Rendered during seek interaction | Rendered while dragging timeline |
| Server chapter-thumbnail images | No renderer in chapter projection | Same | Same | Same |
| Watch Party | No entry/service found | Same | Same | Same |
| Trakt sync settings | No entry/service found | Same | Same | Same |
| Native administration | No entry found | Same | Same | Same |
| Native notification inbox | No inbox UI found | Same | Same | Same |

“No entry found” describes this source audit. It does not claim that all server routes are blocked or that older builds had no such UI.

## Audiobooks: access and limits

### iPhone and iPad

Open Settings, find **Library & Data**, and turn on **Show Audiobooks**. Then choose Audiobooks or an available audiobook library, open a title, and use its play/resume action or choose a chapter. The server must provide an audiobook library accessible to the active profile. The preference defaults off and is local to the device/platform, server, and profile; a choice on iPhone does not configure Apple TV.

Evidence:

- `iosApp/iosApp/Navigation/AppNavPreferences.swift:4-8,30-34,44-74`: scope, persistence, default `false`.
- `iosApp/iosApp/Screens/Settings/SettingsView.swift:20-37` and `Screens/Settings/IOSSettingsOverview.swift:213-225`: reachable iOS Settings overview and exact toggle label.
- `iosApp/iosApp/ContentView.swift:1766-1787,2041-2059,2386-2403`: local visibility gate, iPhone tabs, regular-width iPad sidebar, library destination.
- `iosApp/iosApp/Screens/Detail/ItemDetailView.swift:549-558`: audiobook-specific detail branch.
- `iosApp/iosApp/Screens/Detail/AudiobookDetailContent.swift:316-320,386-424,663-673`: restart, chapter entry, and resume/start actions call `audioStore.play`.
- `iosApp/iosApp/Screens/Audio/AudioPlaybackStore.swift:11-35` and `ContentView.swift:1993-1999`: session start and full-player presentation.
- `iosApp/iosApp/Screens/Audio/AudioFullPlayerView.swift:201-251,371-403`: speed, 15/30/60-minute sleep timer, chapters. `AudioPlayerViewModel.swift:61` lists rates from 0.75× through 3×.
- `iosApp/iosApp/Control/iOS/NowPlayingShelf.swift:36-50` and `Screens/Audio/AudioMiniPlayerView.swift:15-51`: mini player can reopen full player and pause/resume; the phone TV-remote bar has priority when active.

The playback path fetches item detail, builds an audiobook timeline, and opens the selected part (`AudioPlayerViewModel.swift:98-132`). It requires protocol v3 support and a profile, sends the track's `fileId` with `progressPersistence: "client"`, and starts through `SiloAPI.startPlaybackV3` (`AudioPlayerViewModel.swift:429-467`). `Networking/SiloAPI.swift:244-250,622-624` implements catalog detail through API v2 and playback at `/api/v1/playback/start`. Whole-book progress is distinct from each part's playback-session position (`AudioPlayerViewModel.swift:442-444`). No offline audiobook procedure was certified.

### Apple TV

The audio detail/player implementation is wired: `Screens/Detail/AudiobookDetailContent.swift:26-31` selects `TVAudiobookDetailView`; `tvOS/Screens/Detail/TVAudiobookDetailView.swift:49-50,309-326` provides play/resume, Chapters, and Start Over; `tvOS/Navigation/TVMainTabView.swift:194-198` presents the audio player. `Screens/Audio/AudioFullPlayerView.swift:64-69,201-251` selects the TV controls and their speed/sleep/chapter actions.

The route into that player has a fresh-install limitation. `TVMainTabView.swift:978-995` requires `navPrefs.showAudiobooks` for both the Audiobooks root and pinned audiobook libraries. Its default is false. `tvOS/Screens/Settings/TVGeneralSettingsView.swift:114-140` shows **Show Audiobooks** only when customization support is `knownUnsupported`; otherwise it offers **Customize Top Menu**, which does not set the local opt-in. The only `setShowAudiobooks` callers are that legacy TV toggle and the iOS overview. Do not promise that adding Audiobooks in the modern top-menu editor makes it appear.

If the legacy toggle exists, turn it on under Settings > General > Top Menu and choose the resulting Audiobooks tab. Existing installations with an enabled local preference can retain access. A title supplied by a Home row may still be reachable because the shared section filter permits audiobook items independently of this preference (`Networking/Models.swift:289-295,377-383`). This is a conditional entry, not a guaranteed workaround or proof that the library is discoverable.

### Native macOS

The native app reuses the library gate but has no discovered **Show Audiobooks** settings control. `Screens/Settings/SettingsView.swift:53-60,161-183` renders the macOS settings list; the only local-toggle callers are iOS/legacy tvOS. Search is an exception: `Screens/Search/SearchView.swift:90-100` returns true for audiobook availability on macOS, so a search result can enter the shared audiobook detail and start audio.

Do not describe a complete native Mac audiobook player. `ContentView.swift:1993-1999` excludes its full-player presentation with `#if !os(macOS)`. The Mac sidebar still attaches a mini player (`ContentView.swift:2163-2180`, `Control/iOS/NowPlayingShelf.swift:46-50`), whose title calls `showFullPlayer`; no Mac presenter consumes that state. Pause/resume exists in the mini player. This is partial wiring, not native-Mac audiobook parity.

## Ebooks, manga, comics, music, podcasts, and Live TV

`Networking/Models.swift:280-299` admits movie, series, audiobook, mixed libraries and episode items. `LibrariesResponse` filters by that allowlist at `1295-1310`; server Home sections remove unsupported item types at `377-383`. `Screens/Browse/LibrariesTabView.swift:3-16` has no functional music category. TV music enum labels remain in `tvOS/Navigation/TVTopMenuBar.swift:33-75`, but no music library survives the shared library response filter. These labels and API DTOs are not a reader or music feature.

The audit found ebook/manga DTOs (`Networking/APIv2/APIv2CatalogReadModels.swift:274,402-413`), but no reader, comic page view, podcast browse screen, Live TV guide, or stream-selection workflow. Document that Apple has no reader for these books, rather than telling users to open them in the normal video player.

The filtering is not proof of complete scope enforcement. Search with audiobooks enabled leaves **All** untyped (`Screens/Search/SearchViewModel.swift:24-29,117-136`), and accepts returned items without the library allowlist. Native Mac always permits audiobook search. An unexpected non-audiobook/non-series item entering `ItemDetailView` reaches `MovieDetailContent` through the catch-all branch at `549-559,709-718`. Do not promise that every unsupported item is inaccessible through search, direct routes, or server-authored collections.

## Versions and editions

Open a movie detail, or the episode selected for playback in a series. On iPhone/iPad/native Mac, choose **Version**; **Edition** appears when the files span multiple edition groups. Choose a file and then Play/Resume. **Auto** clears the explicit file choice. On Apple TV the control is labeled **Versions** and offers files with an Auto entry.

- `Screens/Detail/MovieDetailContent.swift:191-201` wires the shared picker into detail; `SeriesDetailContent.swift:266-272` wires the selected episode.
- `Screens/Detail/Phone/PhonePlaybackSelectorRow.swift:242-271,431-489` controls edition visibility, chooses a file within an edition, and implements Auto/file selection.
- `tvOS/Screens/Detail/TVMovieDetailView.swift:160-176` and `TVSeriesDetailView.swift:490-501` wire TV selectors. `TVPlaybackSelectorRow.swift:33-65` constructs Auto and file choices and calls `onSelectVersion(fileId)`.
- `Screens/Detail/ItemDetailView.swift:737-749,1198-1222` stores the selected file, reconciles tracks, and forwards it to player routing.
- `Screens/Player/PlaybackSessionBridge.swift:752-780,840-855` uses the matching requested file before automatic selection and starts protocol v3. If the requested file is no longer available, it logs and falls back to automatic choice.
- `ContentView.swift:2506-2511` and `macOS/PlayerView.swift:29-39,105-116` carry the same preferred file to the native Mac player.

This Beta feature is choosing a different source file or edition. Ordinary audio-language, subtitle, and streaming-quality controls remain documented with normal playback. Multiple encoded files do not necessarily mean multiple story editions.

## Scrubbing frames versus chapter images

Preview frames are implemented on all three Apple targets. Drag the playback timeline on iPhone/iPad or native Mac; on Apple TV enter a seek interaction using the timeline/remote. A still appears only when the active player can supply it.

- `Screens/Player/PlayerViewModel.swift:985-991,2979-2983,5285-5300`: callback stores the image, successful playback activates extraction, and timeline interaction requests images.
- `Screens/Player/AetherScrubPreviewProvider.swift:47-58,173-197`: extraction uses the current playback URL/headers; cached native stills have no second-reader fallback when the segment is absent, while software playback can use `FrameExtractor`.
- `Screens/Player/iOS/MobilePlayerControls.swift:438-445,478-491`: iPhone/iPad preview bubble.
- `Screens/Player/tvOS/TVPlayerControls.swift:306-311,359-367`: Apple TV preview card.
- `macOS/MacPlayerTimeline.swift:92-108`: native Mac preview card during dragging.

These are active-player frame previews, not a claim that a server-generated BIF timeline exists. Missing frames can leave only the time label. Server chapter thumbnail data is decoded (`Networking/Models.swift:940-941`) but `PlayerChapterInfo` contains only index/title/time (`PlayerViewModel.swift:14-18`), and the chapter projection discards image fields (`3287-3304`). No native chapter-image rendering was established.

## Other deferred features and platform extras

Whole-tree searches for Watch Party, Trakt, native inbox, administration, Live TV, and their route/service names found no usable native workflows. `Navigation/Route.swift` and the settings views expose no such destinations. The “Admin” account badge only identifies the account (`Screens/Settings/SettingsAccountCard.swift:37-38`); it is not an admin console.

Notification sync does exist. `Notifications/SiloAppDelegate+Push.swift:119-143` runs background notification and download refresh. That background fetch, including variables named `inboxSynced`, does not create an inbox screen. Normal phone/tablet push remains separate from the deferred native inbox.

A second whole-tree case-insensitive scan for `stats`, `admin`, `statistics`, `inbox`, and notification-list terms confirmed that **Stats** means current-player diagnostics, not an administrator dashboard (`Screens/Player/Sheets/PlayerSettingsSheet.swift:389-400`, `macOS/MacPlayerControls.swift:101-104`). `Navigation/TabRouter.swift:9-18` contains no admin/Stats route. `Components/TabTopBarActions.swift:103-135` provides Requests, Settings, Switch Profile, Switch Server, and Sign Out. An older Android repository description of an Apple STATS tab must not override this current Apple source.

Apple push has no indirect inbox fallback either. `Notifications/SiloAppDelegate+Push.swift:98-108` forwards a notification's display URL; `ApplePushDeepLinkCoordinator.swift:10-22` returns when that URL is missing. `ContentView.swift:723-772` handles Downloads, item, and play destinations and ignores unknown hosts. `ApplePushNotificationSync.swift:82-94` advances a cursor and refreshes Home when records arrive; it does not populate a visible inbox. iOS **Settings** is reached from the profile-avatar menu, and **Search** from the top magnifying-glass button (`TabTopBarActions.swift:33-50,115-119`); `HomeView.swift:172-173` wires Search to its route.

The native macOS application is an actual target (`iosApp/project.yml:174-217`), uses a desktop sidebar (`ContentView.swift:2041-2059,2251`), and routes into `macOS/PlayerView.swift`. It requires macOS 26 in `project.yml:6`; repository build instructions require Xcode 26+ and XcodeGen (`README.md:42-57`) and include `SiloMac` (`README.md:75-79`). This audit did not verify a published native Mac download, signing, notarization, installation, or runtime behavior.

Native Mac video controls include audio, subtitles, chapters, playback speed, stats, and fullscreen (`macOS/MacPlayerControls.swift:68-115`). Keyboard mappings are concrete: Space pauses/resumes; arrows seek 15 seconds; Command-arrows choose adjacent chapters; Escape dismisses options first, then the player (`MacPlayerCommandCapture.swift:64-74`, `macOS/PlayerView.swift:159-186`). The native target is Beta as a whole; these controls do not move the ordinary iPhone/iPad video workflow into Beta.

Core SiloRemote, casting, downloads, standard subtitle/audio controls, and UI customization were not reclassified merely because the native Mac target also includes shared code. Full UI localization, advanced accessibility parity, AI dubbing, publisher signatures, scheduled home publication, and automatic import-account creation have no additional Apple user procedure established here.

## Humanizer review

Detected as technical documentation, using the skill's blog fallback. Existing repository prose supplied the voice context. Source identifiers and exact control names were preserved.

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-likeness | 2/10 | Concrete routes and limitations replace broad capability claims. |
| Authenticity | 8/10 | The report records specific source disagreements and partial wiring. |
| Reader value | 9/10 | Entry steps and fresh-install restrictions distinguish usable controls from code presence. |
| Domain credibility | 9/10 | Every positive workflow is tied to platform conditions and its service path. |

Flags resolved during drafting: “audiobooks have reachable dedicated detail/player on native macOS” was too broad; the final matrix records Search access and the absent presenter. “Unsupported libraries are filtered” was too broad as a safety claim; the final report identifies untyped Search and generic detail fallback. These are factual-scope corrections, not claims of new writing patterns. No new skill patterns were found or added. No personal voice sample or product-runtime evidence was invented.

## Public pages and checks

This audit supplied `src/content/docs/docs/beta/native-macos.md` and `beta/versions-and-previews.md`. The combined versions guide also uses the server audit's web detail/menu/chapter evidence and the root Android audit's mobile/TV version-selection and missing-thumbnail-renderer evidence. Apple review of `beta/audiobooks.md` found its TV discovery and native Mac limitations accurate. Suggested additions were the local preference's default/scope and the conditional legacy-TV settings path.

The public-page readability pass retained exact controls, removed a mistaken claim that Mac Search lives in the sidebar, and kept steps and platform comparisons. Scores: AI-likeness 2/10 (plain instructions), authenticity 8/10 (explicit practical limits), reader value 8/10 (usable controls plus access conditions), domain credibility 8/10 (source-traced without runtime certification). No new skill patterns found. `git diff --check` passed after the initial page write; the parent task owns integrated docs/build checks and navigation registration.
