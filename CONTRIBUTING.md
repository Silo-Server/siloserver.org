# Contributing to the Silo Website

The [Silo contribution guide](https://github.com/Silo-Server/.github/blob/main/CONTRIBUTING.md)
covers project-wide coordination, focused changes, evidence, AI disclosure, and
pull request expectations. Those requirements apply here; this guide adds the
website-specific workflow.

## Before you start

Open an [issue](https://github.com/Silo-Server/siloserver.org/issues) before a
site-wide redesign, navigation or information-architecture change, deployment
change, or new product claim. Documentation corrections and narrow copy or
accessibility fixes can go straight to a pull request.

Product behavior is defined by the implementation repositories. Verify factual
claims against `silo-server`, `silo-apple`, or `silo-android` rather than treating
existing marketing copy as the source of truth.

## Development setup

Use Bun for parity with CI; Node.js 20 or newer also works for local Astro
development. Read [README.md](README.md) for the content map and deployment
model.

```sh
bun install --frozen-lockfile
bun run dev
```

## Documentation

The manual lives in `src/content/docs/docs/`, grouped into folders by
audience. The sidebar is defined in `src/data/sidebar.mjs`. The public
[Improve these docs](https://siloserver.org/docs/improve-the-docs) page
covers browser edits and writing tips for readers.

### URLs and redirects

Each page declares its URL with `slug: docs/article-name`. Keep the slug when
you change a page's title, folder, or sidebar group; the sidebar can nest a
page without adding directories to its URL.

The build checks slugs, navigation, internal links, and anchors. Until 1.0
ships, the manual is unpublished and moved pages don't need new redirects.
Existing published aliases stay in `src/data/docs-redirects.mjs`. After 1.0,
keep published URLs and useful section anchors working when you move or
merge pages.

### Release baseline and version requirements

`src/data/docs-release.mjs` records the release and source revisions the
manual describes. Don't describe unreleased behavior as available in the
current stable release, and check that a feature is actually available
before turning a milestone target into a how-to.

If a task needs a particular server or app version, add the page's
`requires` field and give the evidence in the pull request. Leave the field
out when the minimum version is unknown.

### Evidence

Say in the pull request whether you reviewed the source or tested on a real
device; they are different kinds of evidence. Document prerequisites,
platform differences, and lasting constraints. Keep temporary bugs,
workarounds, and validation findings in issues or internal review notes, not
in the manual.

## Validate your change

```sh
bun install --frozen-lockfile
bun run test:docs
bun run build
```

The build fails on broken internal documentation links, so run it before
pushing. Preview visible changes at desktop and mobile widths, check keyboard
navigation for interactive elements, and verify changed links. Include
screenshots for visual changes.

Every pull request also gets a hosted preview. A bot comment links to
`https://pr-<number>.siloserver-org.pages.dev`, updated on each push and removed
when the pull request closes. Reviewers use it instead of checking out the
branch; link to specific preview pages in the pull request description.

## Open the pull request

Use a Conventional Commit title, explain the content or presentation change,
and paste the actual validation results. Read the
[AI-assisted contribution policy](https://github.com/Silo-Server/silo-server/blob/main/docs/ai-contributions.md)
and include its disclosure block.
