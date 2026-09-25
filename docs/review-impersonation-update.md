# View as user documentation update

Reviewed server main `d4e35ba9df416e747822c6c9f2193b89c6b7e9fb` on 2026-09-23.
The original server checkout had unrelated release-workflow edits, so main was
fast-forwarded in `/Volumes/dev/Silo/silo-server-docs-impersonation` instead.

## Source evidence

- `web/src/pages/AdminUserDetail.tsx:124,182` and `AdminUsers.tsx:412`:
  View as user entry points; disabled/admin targets excluded.
- `web/src/components/AdminUserImpersonationDialog.tsx:32`: confirmation text,
  live user actions, unavailable admin access, and navigation to the profile picker.
- `web/src/components/ImpersonationBanner.tsx`: visible Viewing as and End session
  labels. End impersonation session is the accessible label, not the button text.
- `internal/auth/service.go:448`: enabled administrator and target checks,
  self/admin/disabled target refusals, and nested impersonation refusal.
- `internal/auth/service.go:516`: ending revokes the impersonation session without
  revoking the original administrator session.
- `web/src/hooks/useAuth.tsx:160,293` and `web/src/lib/impersonationSession.ts`:
  saved administrator session, recovery, and sign-out behavior.

The guide keeps its URL and existing section anchor. The title and account-guide
cross-link make the feature easier to find. No global documentation baseline was
advanced: only this feature was reviewed against the newer server revision.

This is source verification, not a live impersonation walkthrough. No user
account was accessed and no product behavior or permissions were changed.
