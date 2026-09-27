# Parental-control documentation review

Reviewed server `origin/main` at `dfa62e59030aadc376fe3da3f9daf6664c9fd747` on 2026-09-26. Source was read with `git show`; unrelated server checkout changes were preserved. Shared docs baseline unchanged.

## Changes and evidence

- #1359 / `101c125be`: content-rating ceiling normalization and enforcement.
- #1417 / `fab6cb478`: optional advisory-age display.
- #1429 / `7cc2c1f2e`: profile advisory-age limit.
- #1441 / `1aa1eb2d8`: hide titles without an advisory age.
- `web/src/components/profiles/ProfileEditorDialog.tsx`: Access section, Kids profile, Maximum content rating, Maximum advisory age, conditional Hide titles without an advisory age, Restrict libraries, Save profile.
- `web/src/pages/settings/ProfilesSettings.tsx`: household profile edit entry.
- `internal/api/handlers/profiles.go`: primary-profile/admin authorization and primary PIN verification.
- `web/src/pages/settings/PlaybackSettings.tsx`: Show advisory age is display-only.
- `internal/catalog/access_filter.go`: both maturity limits apply; missing advisory-age handling depends on the profile switch.
- `internal/access/types.go`: advisory-age range and switch requiring an active age limit.
- `internal/access/rating.go` and `docs/settings-api.md`: cross-system ratings, unrated policy, unrecognized ratings; US ceilings admit their full tiers, so no strict numeric ceiling equivalence was claimed.
- `docs/catalog-api.md`: series age used for episodes and advisory enrichment behavior. No claim made about book visibility under the strict missing-advisory setting.

## Editorial scope

Added the household procedure to `/docs/profiles`, with an access-policy explanation and reciprocal link in `/docs/manage-access`. Web setup only; native editing parity was not inferred. Retained metadata prerequisites and policy distinctions, without adding temporary bugs or validation disclaimers to public guides. Plain-language review completed; no new Humanizer patterns identified.

## Validation

Source review only for product behavior; no live parental-control or device acceptance test performed. Documentation checks and static build are run separately from this source review.

Validation completed: `bun run test:docs` passed all 7 checks; `bun run build` passed its 10 prerequisite checks and built 101 pages with valid documentation links; `git diff --check` passed. Browser inspection confirmed the new section, table, and access-guide link at 390px and 1280px widths without page overflow.
