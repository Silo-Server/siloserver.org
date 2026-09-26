# Calendar documentation review

Reviewed 26 September 2026 for [silo-server #1134](https://github.com/Silo-Server/silo-server/issues/1134)
and its six direct validation tasks: server #1135, web #1136, Apple #303 and
#304, and Android #314 and #313. This is a focused review of
`src/content/docs/docs/using-silo/home-and-calendar.md`; it does not advance
the shared baseline in `src/data/docs-release.mjs`.

## Source baseline

The review uses the builds recorded in the validation issues rather than the
older server working tree. Server files were read with `git show` at the
specified revision; unrelated local changes in all three repositories were
left in place.

| Repository | Revision | Evidence |
| --- | --- | --- |
| silo-server | `66f6a52a3f586f4e9bb7ad19fb6c1f67f6c2b621` | Build 927 in the validation tasks. Calendar handler and catalog queries establish filters, access restrictions, release types, and date conversion. Web Calendar, WeekNavigator, AppSidebar, and calendar query establish labels, navigation, library filtering, and browser timezone. TrendingRefresher includes the calendar's TMDB weekly feed independently of home-section configuration. |
| silo-apple | `a63c511b9098ad6f9733b7f10d33a4803dd434f8` | CalendarView, CalendarModels, CalendarViewModel, CalendarWeekStrip, ContentView, TabRouter, and TVMainTabView establish navigation, filters, dates, badges, and empty-state actions. |
| silo-android | `86e1ebc7fc8aef07985b8e43de54318a53079936` | CalendarScreen, TvCalendarScreen, CalendarViewModel, CalendarModels, BottomNavBar, MobileMediaTabs, TvTopMenuBar, and platform DI establish the same controls and device timezone. Android TV human validation records `8f74ef73`; the task states the intervening commits do not change Calendar. |

## Documentation impact

The existing guide needed a fuller procedure and clarifications, not a new
article. It now explains where to open Calendar on each client, week/day
controls, Following membership, the current TMDB weekly Trending feed, catalog
and access limits, premiere badges, date-only versus timestamped releases,
missing source timezones, and recovery from an empty week. The existing
`/docs/home-and-calendar#check-upcoming-releases` link remains valid.

The linked prerequisites, `profiles.md`, `saved-titles.md`, and `metadata.md`,
were read. Their procedures did not need changes for this review.

Known issues were read live on GitHub and remain open: server #1494, Apple
#511, #513, #514, and Android #397, #398. The guide directs readers to the
main view selector rather than promising the proposed empty-state shortcuts.
At the maintainer's direction, temporary app limitations and bug-specific
workarounds are kept out of the public guide. The iPad navigation, Apple TV
focus, and Android badge findings remain in issue tracking and these internal
review notes. The Trending fix is present in the reviewed server baseline;
the guide does not require a Trending home row as a workaround.

## Validation boundaries

The issue records report accepted agent API checks for server #1135 and human
web validation for #1136. Native tasks remain open with recorded failures.
The parent has checked X1–X4 boxes but also retains older prose saying those
checks are open; this documentation review does not resolve that inconsistency
or claim feature acceptance.

No live-server or device walkthrough was performed for this documentation
change. Follow the revised guide on the accepted build set before completing
the parent's documentation checkbox. Issue state and acceptance were not edited.

The wording pass used `the-humanizer` with the repository's documentation style;
exact UI labels and factual qualifications were retained.

## Executed checks

- `bun run test:docs`: 7 passed.
- `bun run build`: 10 prerequisite tests passed; 102 pages built, internal
  links and anchors valid. Network-limited release lookups used the site's
  repository-link fallback.
- `python3 scripts/test-preview-workflows.py`: 22 passed after enabling full
  Git history for the requested per-page footer dates.
- `git diff --check`: passed.
- All 81 generated guide footer timestamps matched `git log -1 --format=%ct`
  for their source file. Uncommitted Calendar edits correctly retained the
  previous commit's date.
- Browser inspection at 1280 × 800 and 390 × 844 confirmed the footer date is
  visible beside the edit link, above previous/next navigation, without page
  overflow. Screenshots were kept outside the repository.
