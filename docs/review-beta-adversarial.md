# Beta documentation cross-review

Reviewed on 2026-09-20. This review covers all 15 Beta Markdown pages, the 16 retained main-guide pages changed during the Beta reorganization, the four removed guide paths and their redirects, sidebar data, and structural tests. It also records two conflicts in concurrent external edits, which were preserved.

Source baselines are server/web `d2596927e822c04f0e0e7017654e1369c4c3aa3f`, Apple `c23903c015632685f7a654d9461391f8d5a6880d`, and Android `3993d2b1277d59b3b323f634f7b58c6ee9a4969b`. The review read these extracted source trees directly. Earlier reports were used to locate files, not as proof of runtime behavior. No screenshots, app runs, devices, or service connections were used.

## Findings sent during review

### 1. Separate web and Android ebook-format support

The initial `beta/ebooks.md` table said Kindle reading depends on server conversion and described CBR only as indexed/external. That applies to the Android reader path, but hides the web parser's support.

Server source:

- `web/src/reader/FoliateBookReader.tsx:143,204-205` admits MOBI/AZW/AZW3 and CBR.
- `web/src/reader/FoliateBookReader.tsx:734-749` fetches bytes and invokes `DocumentLoader`.
- `web/src/reader/readest/libs/document.ts:392-415` implements RAR comic and MOBI/Kindle parsing.
- `internal/api/handlers/ebook_convert_serve.go:84-94` serves the original when conversion fails, is off, or is not applicable. Conversion is not a blanket prerequisite for the web parser.

Android source: `shared/src/commonMain/kotlin/org/siloserver/silo/model/ebook/EbookVersionSelection.kt:75-85` treats original CBR and Kindle files as external-only; `133-140` promotes Kindle reading when the server advertises conversion.

Requested correction: separate Web and Android columns, retaining file/DRM and unverified-runtime caveats. The Android Sections, Bookmarks, Add bookmark, and Reader settings labels were verified in `androidApp/src/androidMain/kotlin/org/siloserver/silo/android/ui/screens/reader/ReaderShell.kt:249-265,366,396,424`.

### 2. Correct the structural test's slug calculation

The new test used `path.slice(content.length + 1)` even though `content` already ends with `/`. This strips the `d` from `docs`.

Executed `bun run test:docs`: three tests passed, one failed with `Unlisted beta guide: ocs/beta/audiobook-libraries`. Use a relative path or remove the extra offset. This is a real failed check, not an inferred concern.

### 3. Name Android in the audiobook-download instructions

The initial `beta/audiobooks.md` Downloads section said “Phone and tablet download code exists.” The Apple audiobook detail and audio screens expose no download action, while their video detail uses `DownloadActionButton` (`iosApp/iosApp/Screens/Detail/MovieDetailContent.swift:162-169`). The generic phrase can send an iPhone/iPad reader looking for an absent audiobook control.

Requested correction: explicitly scope the procedure to Android phones/tablets and state that an Apple audiobook download entry was not established. Keep the multipart/offline verification caution.

### 4. Replace unresolved Apple Mixed placement with verified access

The initial `beta/library-types.md` row said Apple TV placement needed checking. Current Apple source already supplies the route:

- `iosApp/iosApp/Screens/Browse/LibrariesTabView.swift:3-13` includes Mixed under both Movies and Series.
- `iosApp/iosApp/tvOS/Navigation/TVTopMenuBar.swift:68-76` does the same for TV type menus.
- `iosApp/iosApp/tvOS/Navigation/TVMainTabView.swift:1009-1035` builds roots and library selectors using that predicate.

Requested correction: describe those menu entries, retaining Android TV's separate classification limitation and the absence of device acceptance evidence.

## Concurrent external conflicts preserved

The root task confirmed these edits belong to other work; this reviewer did not change them.

- `src/data/faq.ts` still says subtitle search is web-only. Current Apple source implements subtitle search/download (`iosApp/iosApp/Screens/Player/PlayerViewModel.swift:5688-5715`), and the manual has native instructions. Remove that feature from the web-only claim when the external edit is reconciled.
- `public/milestone/1.0/index.html:805` still requires deferred features to be excluded from public docs, while its changed default gate at `821` permits clearly labeled Beta/reference documentation. Reconcile both statements to distinguish supported 1.0 instructions from the new Beta section. This is a documentation-policy conflict, not authorization to change product flags.

## Source checks with no additional finding

- Watch Party's web sidebar route, Host Picks/Vote Together selection, create/join, invite, and host permission labels match `web/src/pages/WatchTogetherJoin.tsx:32-53,253-262,283-373` and `WatchTogetherRoomPage.tsx:655-681`. The guide retains profile access and unverified synchronized-playback limits.
- Theme Editor tabs, reset, import/export, and profile scope match `web/src/pages/settings/ThemeEditorSettings.tsx:15-112` and `web/src/hooks/useCustomTheme.ts:13-17,31-42`. Native clients are not promised CSS rendering.
- Catalog export/import labels and conflict/path rewrite choices match `web/src/components/AdminCatalogMaintenance.tsx:144-205,390-415,639-646`. The guide distinguishes catalog records from backups and media bytes. On a deployment using a separate worker, a queued Local File import needs that path available to the worker (`208-224`); the guide's generic server-access wording should be read in that deployment context.
- Audiobook folder grouping, natural file order, synthetic chapters, and first-file metadata match `internal/scanner/audiobook.go:114-117,148-151,181-203,223-237`.
- Native Android inbox fallback is real: `PushNotificationPresenter.kt:151-160,198-202` chooses `Route.Inbox`; `NotificationExternalRoute.kt:22-35` requires server/profile attribution. Apple push has no equivalent fallback, as documented in the Apple audit.
- Apple TV audiobook entry is conditional, iPhone/iPad have a local opt-in, and native Mac audio has an absent full-player presenter. The Beta guide preserves these limits.
- Version selection and Apple extracted scrub frames remain distinct from supported chapter navigation and web-generated chapter images. Main playback instructions link to the Beta choice rather than requiring it.
- Main library/install guidance now starts with Movies and Series. Listening/reading/ABS references lead to Beta destinations. The four removed pages have explicit direct redirects; the older audiobook and compatibility paths also target the new destinations directly.
- The Beta sidebar is collapsed and contains only Beta paths. Each of the 15 Beta pages has a Beta title and caution after the server-page labeling updates. Unfinished pages distinguish absent UI from implemented controls and do not invent activation steps.

## Readability review

Applied the Humanizer's technical-documentation/blog fallback. Scores: AI-likeness 2/10 (concrete controls and paths), authenticity 8/10 (specific source limits), reader value 8/10 (entry instructions and clear alternatives), domain credibility 8/10 (source-backed, not device-certified). The format-table and download wording findings concern factual scope; no new style patterns were discovered or added to the skill.

## Correction readback

All four in-scope findings were corrected and read back from disk. The ebook table now separates web and Android parser/conversion behavior; Mixed names the Apple menu placement; audiobook downloads explicitly name Android and warn against assuming the Apple video procedure applies; the test uses `relative(content, path)` with slash normalization.

The added web reader control labels were checked directly at `web/src/pages/EbookReader.tsx:755-756,907-925`: Add bookmark, Contents, Search, Notes, and Settings all match. The iPhone/iPad preference scope and conditional legacy Apple TV toggle were also added without promising modern-TV discovery.

Executed `bun run test:docs` after correction: all four tests passed. `git diff --check` passed. No remaining must-fix finding was established in the reviewed task-owned Beta/manual/navigation changes. The two concurrent external conflicts remain recorded separately for their owner. Full site build and integration results belong to the root task's final evidence record.
