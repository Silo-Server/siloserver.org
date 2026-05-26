# silo-website

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

Node 20+ also works; Bun is preferred for parity with the server's tooling.

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
| Documentation pages             | `src/content/docs/docs/*.md`              |
| Colors, spacing, typography     | `src/styles/global.css`                   |

Almost every copy change is a data-file edit, not a markup edit. That's
deliberate — the components don't need to be touched unless the layout
itself changes.

## Documentation

Docs are built with [Astro Starlight](https://starlight.astro.build/) and
served under `/docs`. Add or edit Markdown files in `src/content/docs/docs/`.

The extra nested `docs/` directory is intentional: Starlight routes pages
from `src/content/docs/`, so nesting the public docs there gives the site
the `/docs` URL prefix while keeping everything in the same Astro project.

## Versions on client cards

The client cards in section 04 show the latest release of each app repo
(`silo-server`, `silo-apple`, `silo-android`). These are fetched from the
GitHub API at build time by `src/data/releases.ts` and baked into the
static HTML — no client-side JS, no runtime API calls.

The data is refreshed on three triggers:

1. Every push to `main`
2. Every 6 hours via a scheduled workflow
3. Every time a sibling repo publishes a release (cross-repo dispatch)

If the API is unreachable or rate-limited at build time, cards fall back
to a "view repo" link with no version label. The build never fails for
this reason.

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
          gh api repos/Silo-Server/silo-website/dispatches \
            --method POST \
            -f event_type=release-published \
            -f client_payload[repo]=${{ github.repository }} \
            -f client_payload[tag]=${{ github.event.release.tag_name }}
```

This needs a `WEBSITE_DISPATCH_TOKEN` secret on each app repo — a fine-
grained GitHub PAT scoped to `silo-server.github.io` with `Contents: Read`
and `Actions: Read & Write` permissions. Standard pattern, set once per
repo.

The 6-hour cron is a fallback for missed dispatches and edits that
happen outside a release (changed README, added a new app, etc).

## Deployment

GitHub Pages, configured by `.github/workflows/deploy.yml`. The repo
is named `silo-server.github.io` (so GitHub treats it as the org's
root site) and the canonical domain is **`https://siloserver.org`**,
configured via `public/CNAME`.

If you ever change hosting or domain, override the build with repo
variables (`vars.SITE`, `vars.BASE_PATH`) — the workflow honors both,
so the same code deploys to a different URL shape without code changes.

## Design system

Three typefaces (loaded from Google Fonts at runtime):

- **Hubot Sans** — display, variable width axis
- **Geist** — body
- **Geist Mono** — code, labels, status

Colors live as CSS custom properties at the top of `src/styles/global.css`.
The brand mark — three skewed bars in blue, red, orange — recurs as a
design element throughout the page via the `SiloBars` component.

## License

AGPL-3.0-or-later, matching the rest of the Silo project.
