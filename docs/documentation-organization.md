# Public documentation organization

This first organization pass starts from website `main` at `d48e19e` and the
September 19 content plan, including its later authoring-platform additions.
It reorganizes existing material; it does not certify product behavior.

## Structure

The public manual has five entry groups: Get started, Using Silo, Running a
server, Developers & integrations, and Help & contribute. Files follow those
audiences. The existing `src/data/sidebar.mjs` remains the curated navigation
source. There is no new framework or parallel content system.

The root documentation URL remains `/docs`. Nineteen old article paths map to
new paths in `src/data/docs-redirects.mjs`. `/docs/ebooks` remains available as
an explicitly marked prerelease reference, outside the sidebar and search.
This differs intentionally from making ebooks a draft: an existing published
URL remains usable without presenting the material as supported 1.0 guidance.

The static redirect route at `src/pages/docs/[...legacy].astro` preserves
query strings and section fragments with JavaScript. Without JavaScript,
meta-refresh and a visible link still reach the new article, but a bookmarked
section fragment is not carried over. Browser testing found that Astro's
default static redirects dropped fragments, which is why this route exists.

## Content changes

- The documentation homepage separates people joining a server from operators.
- Installation owns the default setup walkthrough; Docker owns the advanced
  deployment reference. After installation is a task index, not a second wizard.
- Personal notification settings have their own guide. Server delivery setup,
  safeguards, signing details, and retention remain in the administrator guide.
- Jellyfin and Audiobookshelf guides focus on entering the server address and
  signing in. A linked administrator guide owns endpoint/proxy configuration.
- Reporting instructions are named Report a problem. Find help directs people
  to existing diagnostic sections instead of pretending the reporting template
  is a complete troubleshooting manual.
- Developer resources link to owning repositories; documentation contribution
  instructions explain editing Markdown and reviewing PR previews.

The prior agent's Cloudflare preview workflows, permissions, deployment
tooling, banner components, edit-link correction, and link validator remain
unchanged. Production still uses the existing GitHub Pages workflow.

## Remaining verification, not completed acceptance

Some inherited material needs factual revision in a separate, source-backed
pass. Notices identify these limitations where readers encounter them:

- Client/app tables lack named-build acceptance evidence; Apple/Android columns
  in the old parity table hide phone, tablet, and TV differences.
- Apple TV format/platform claims require current source and device evidence.
- AI and storage provider recommendations/prices should be refreshed before
  they are treated as current recommendations.
- S3 guidance needs reconciliation with local artwork persistence and storage
  identity locking. Existing backup snippets are not a clean-restore procedure.
- The old native-push-is-deferred claim is removed in favor of distinguishing
  milestone scope from the web delivery procedures currently documented here.

Moving a guide, linking it, or building it successfully does not validate its
procedure. Record actual walkthrough evidence against the feature or release
gate using exact server, app, and plugin versions.

## Next writing batches

1. Native sign-in, TV onboarding, profiles/PINs, and everyday playback/listening.
2. Library setup, invitations/access groups, and approved backup/restore/update
   procedures. Check the server's current `docs/update-to-1.0.md` before writing
   upgrade instructions; do not invent a direct upgrade or database rollback.
3. Discovery/collections, subtitles, offline downloads, and TV remote control.
4. Remaining admin tasks and public versioned API documentation.

The 35-feature documentation coverage map is still a planning checklist. Do
not add a mandatory complete-coverage build gate until actual guides exist,
or fill the gaps with placeholder links to make CI pass. Milestone surface
tags express planned scope, not proof that an article's steps were tested on
each client. Any generated surface list must preserve that distinction.

## Review checklist

- Run `bun run test:docs` for sidebar membership and legacy URL coverage.
- Run `bun run build` for rendering and internal-link/anchor validation.
- Check the homepage, user/admin split, and sidebar on desktop and mobile.
- Open old article URLs and representative anchored links.
- Check a preview build still includes its banner and noindex marker.
- Keep PR screenshots outside the repository; upload them when opening a PR.
