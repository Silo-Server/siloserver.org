# Silo Website

The project site for [Silo](https://github.com/Silo-Server) — a self-hosted
media server. Built with [Astro](https://astro.build), deployed to GitHub
Pages, AGPL-3.0-or-later.

## Local development

```sh
bun install
bun run dev      # → http://localhost:4321
bun run build    # → dist/
bun run preview  # serves the built dist/
```

Node 20+ also works; Bun is preferred for parity with the site's build tooling.

## Project layout

```
src/
├── components/    one .astro file per page section + small reusables
├── content/docs/  Starlight docs content — Markdown under docs/
├── data/          content + config — edit copy here, not in templates
│   ├── siteConfig.ts   site-wide constants (name, license, repo names)
│   ├── pillars.ts      infrastructure pillars (section 01)
│   ├── features.ts     feature grid (section 02)
│   ├── clients.ts      native clients + Jellyfin-compat list (section 04)
│   ├── faq.ts          FAQ items (section 05)
│   └── releases.ts     build-time fetch of latest GitHub releases
├── layouts/       base layout — head, fonts, shell
├── pages/         file-based routing — index.astro is the homepage
└── styles/global.css   the entire design system
```

## Editing content

| To change                       | Edit                                      |
| ------------------------------- | ----------------------------------------- |
| Site name, license, repo URLs   | `src/data/siteConfig.ts`                  |
| Infrastructure pillar copy      | `src/data/pillars.ts`                     |
| Feature card copy + chips       | `src/data/features.ts`                    |
| Client list (native or compat)  | `src/data/clients.ts`                     |
| FAQ items                       | `src/data/faq.ts`                         |
| Hero subhead, status bar nav    | `src/components/Hero.astro`, `StatusBar.astro` |
| Architecture diagrams           | `src/components/Deployment.astro`         |
| Documentation pages             | `src/content/docs/docs/**/*.md`           |
| Documentation sidebar           | `src/data/sidebar.mjs`                    |
| Old documentation URLs          | `src/data/docs-redirects.mjs`              |
| Colors, spacing, typography     | `src/styles/global.css`                   |

Almost every copy change is a data-file edit, not a markup edit. That's
deliberate — the components don't need to be touched unless the layout
itself changes.

## Documentation

Docs are built with [Astro Starlight](https://starlight.astro.build/) and
served under `/docs`. Add or edit Markdown files in `src/content/docs/docs/`.
New pages are listed in `src/data/sidebar.mjs`; `astro.config.mjs` does not
need to change.

Organize pages by the reader's task and audience:

- `get-started/`: app choice, prerequisites, and the default installation walkthrough.
- `using-silo/`: personal settings, client use, and connecting other apps.
- `running-a-server/`: administration, integrations, deployment, and operator reference.
- `developers/`: API, plugin, and code-contribution entry points.
- `help/`: troubleshooting entry points, reports, and documentation contributions.

Use the existing sidebar data file to curate the reading order. Do not add
empty pages for planned features. A guide can link to another audience's
guide instead of repeating its setup steps. Old published paths are retained
in `src/data/docs-redirects.mjs`; update internal links to canonical paths.
Run `bun run test:docs` and `bun run build` when changing this structure.

See [the organization notes](docs/documentation-organization.md) for this
first pass's page moves, intentionally retained prerelease content, and
remaining writing/verification gaps.

The extra nested `docs/` directory is intentional: Starlight routes pages
from `src/content/docs/`, so nesting the public docs there gives the site
the `/docs` URL prefix while keeping everything in the same Astro project.

## Release links on client cards

The client cards in section 04 link to the latest release of each app repo
(`silo-server`, `silo-apple`, `silo-android`). These are fetched from the
GitHub API at build time by `src/data/releases.ts` and baked into the
static HTML — no client-side JS, no runtime API calls. Cards show a plain
status (shipping or beta) and never a version number.

The data is refreshed on three triggers:

1. Every push to `main`
2. Every 6 hours via a scheduled workflow
3. Every time a sibling repo publishes a release (cross-repo dispatch)

If the API is unreachable or rate-limited at build time, cards fall back
to the repo home page instead. The build never fails for this reason.

## Cross-repo release dispatch

When a release is published in `silo-server`, `silo-apple`, or
`silo-android`, the site rebuilds automatically. Wire it up by adding
this workflow to each app repo:

```yaml
# .github/workflows/notify-website.yml
name: Notify website
on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger website rebuild
        env:
          GH_TOKEN: ${{ secrets.WEBSITE_DISPATCH_TOKEN }}
        run: |
          gh api repos/Silo-Server/siloserver.org/dispatches \
            --method POST \
            -f event_type=release-published \
            -f client_payload[repo]=${{ github.repository }} \
            -f client_payload[tag]=${{ github.event.release.tag_name }}
```

This needs a `WEBSITE_DISPATCH_TOKEN` secret on each app repo — a fine-
grained GitHub PAT scoped to `siloserver.org` with `Contents: Read`
and `Actions: Read & Write` permissions. Standard pattern, set once per
repo.

The 6-hour cron is a fallback for missed dispatches and edits that
happen outside a release (changed README, added a new app, etc).

## Pull request checks and previews

Every pull request runs `.github/workflows/pr-build.yml`: a full `bun run build`
with internal-link validation (`starlight-links-validator`). The build fails on
a broken `/docs` link or anchor, so fix those before asking for review.

The same workflow builds the site as a **preview** and hands the output to
`preview-deploy.yml`, which uploads it to Cloudflare Pages and posts one sticky
comment on the pull request with the URL:

```
https://pr-<number>.siloserver-org.pages.dev
```

The alias is updated after a successful build and deployment. Previews show an orange banner
linking back to the pull request, carry `noindex`, and are deleted by
`preview-teardown.yml` when the pull request is merged or closed (plus a weekly
sweep of anything older than 30 days).

The optional `preview` commit status appears while the build is queued, then
reports building, waiting for deployment, deploying, and the final result.
Pending or failed statuses link to the workflow; successful ones link to the
preview. Build or deployment failures and cancellations report an unavailable
preview instead of leaving the status pending. This does not make preview a
required merge check; keep only the intended build checks required in rulesets.

`preview-progress.yml` receives trusted build lifecycle events, including reruns.
It and the deployment workflow call `preview-report.yml`, which serializes status
writes per commit using trusted tooling. The reporter checks the current PR head,
build run, and attempt, and rejects stale or regressive updates. It requires no
Cloudflare credentials and never checks out PR code. These `workflow_run` changes
take effect after they reach the default branch; a PR preview cannot test them live.

`scripts/preview-banner.mjs` adds the banner to every built HTML file, including
standalone pages copied from `public/`, documentation, and redirects. It runs
only when valid preview metadata is supplied. The banner reserves space above
navigation and adjusts when its text wraps; production HTML is unchanged.

The split into two workflows is deliberate: `pr-build.yml` runs contributor
code, including from forks, with no secrets and no write permissions.
`preview-deploy.yml` holds the Cloudflare token but never checks out or
executes pull request code. It checks out deployment tooling from the trusted
workflow commit and installs Wrangler with its committed npm lockfile before
uploading the built artifact. It verifies that Cloudflare reports terminal
deployment success before publishing the preview link. Deploy and teardown
share a concurrency queue, so cleanup cannot be overtaken by publication.
This serializes preview operations across the project, including weekly sweeps. Keep it that
way, and do not add a token to the build job.

For the same reason, the deploy workflow derives the pull request number and
commit from the trusted `workflow_run` event and the GitHub API, never from
the artifact. A fork can edit the build workflow and write anything into an
artifact, so artifact contents must not decide where a deployment lands or
which comment and commit status are written.

One visible consequence: the build job has no `GITHUB_TOKEN`, so the
build-time release lookup in `src/data/releases.ts` may be rate-limited on
shared runners. Client cards then fall back to plain repository links instead
of showing a version. That is expected in a preview and never fails the build.

### One-time setup

1. Create a Cloudflare Pages project (direct upload, no Git integration);
   production stays on GitHub Pages. The project name is set once per workflow
   as `PREVIEW_PROJECT`, currently `siloserver-org`. Keep this value consistent
   across the three preview workflows.
2. Create a GitHub environment named `Preview`, restrict its deployment branches
   to **Selected branches and tags → branch `main`**, and
   add `CLOUDFLARE_API_TOKEN` (Account · Cloudflare Pages · Edit, scoped to that
   one account) and `CLOUDFLARE_ACCOUNT_ID` as **environment** secrets. Keeping
   them out of repository secrets and restricting the environment to `main`
   prevents PR workflows from reading them, including workflows edited on
   same-repository branches. Do not allow `refs/pull/*/merge` or arbitrary tags.
3. Require the GitHub Actions `build` check on `main` using a branch ruleset
   or branch protection.

When editing preview workflows, run `python3 scripts/test-preview-workflows.py`
(requires Python 3, Node.js, Bun, and jq). These checks mock the provider APIs to cover
cleanup failures, pagination, timestamp formats, deployment status, and PR
closure or reopening during queued operations.
The PR build runs them before building the site.

## Deployment

GitHub Pages, configured by `.github/workflows/deploy.yml`. The repo
is named `siloserver.org` and the canonical domain is
**`https://siloserver.org`**,
configured via `public/CNAME`.

If you ever change hosting or domain, override the build with repo
variables (`vars.SITE`, `vars.BASE_PATH`) — the workflow honors both,
so the same code deploys to a different URL shape without code changes.

## Design system

The site uses an industrial-datasheet aesthetic: warm paper surfaces,
ink hairline tables, blueprint figures, and a single dark "instrument
console" panel in the hero. Three typefaces (loaded from Google Fonts
at runtime):

- **Big Shoulders** — display, condensed industrial
- **Archivo** — body
- **IBM Plex Mono** — code, spec labels, status

Colors live as CSS custom properties at the top of `src/styles/global.css`.
The official horizontal wordmark is rendered by `BrandLockup` and the
downloadable originals live under `public/brand/`. Three skewed bars in blue,
red, and orange recur as a decorative (non-logo) motif via `SiloBars`. The
Starlight docs are themed to match via `src/styles/docs.css`.

## License & Trademarks

The site's source is licensed `AGPL-3.0-or-later`, matching the rest of the Silo
project. See [LICENSE](LICENSE).

The **Silo name, logo, and wordmark are trademarks of Silo Media L.L.C.** and
are **not** covered by the AGPL. You're free to fork and redistribute the code,
but forks and redistributions must not use the Silo brand as their identity and
must remove or replace the brand assets. See [TRADEMARK.md](TRADEMARK.md) for
what's permitted — including referential use like "compatible with Silo."

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Site-wide
design, navigation, deployment, and product-claim changes should start as an
issue.
