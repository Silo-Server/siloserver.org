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

## Validate your change

```sh
bun install --frozen-lockfile
bun run build
```

Preview visible changes at desktop and mobile widths, check keyboard navigation
for interactive elements, and verify changed links. Include screenshots for
visual changes.

## Open the pull request

Use a Conventional Commit title, explain the content or presentation change,
and paste the actual validation results. Read the
[AI-assisted contribution policy](https://github.com/Silo-Server/silo-server/blob/main/docs/ai-contributions.md)
and include its disclosure block.
