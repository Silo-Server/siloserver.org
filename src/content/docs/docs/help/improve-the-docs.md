---
title: Improve these docs
description: Correct instructions, contribute examples, or report a gap in the Silo manual.
---

You can help without building the website or knowing its framework. Fixing a
wrong label, adding a missing prerequisite, or clarifying one step is useful.

## Edit a page

1. Use **Edit page** at the bottom of the guide to open its Markdown source on GitHub.
2. Make a focused change. GitHub may ask you to create a fork if you do not have
   write access to the repository.
3. Open a pull request explaining what was confusing or incorrect and what you changed.
4. Review the hosted preview linked by the pull request bot once its build succeeds.

See the [website contribution guide](https://github.com/Silo-Server/siloserver.org/blob/main/CONTRIBUTING.md)
for review requirements. Larger changes to navigation or site design should
be discussed before implementation; a small correction can go straight to a PR.

## Write for the person doing the task

- Say whether the reader needs server-admin access.
- Start with the result, then prerequisites and the steps needed to reach it.
- Use the labels shown in the app. Explain phone, tablet, TV, and browser
  differences only where they change the instructions.
- Link to an existing guide instead of copying its setup procedure.
- State limitations and failure checks. Do not turn a milestone target into
  a claim that a feature is available in every current build.

For a behavior change, include the app/server versions you used and explain
which steps you followed. A successful website build checks the document,
not whether the product behaves as described.

## Screenshots and examples

Show the controls needed for the task. Use approved demo content and remove
private libraries, account details, server addresses, tokens, and other
personal information. Keep essential instructions in text so the guide still
works without the image.

## Work locally if you prefer

The documentation lives in `src/content/docs/docs/` in the
[website repository](https://github.com/Silo-Server/siloserver.org).
Pages are grouped by audience. The sidebar is maintained in
`src/data/sidebar.mjs`.

From the website checkout:

```sh
bun install --frozen-lockfile
bun run dev
bun run build
```

The build checks internal documentation links and anchors. Keep existing
URLs and headings working when moving a page; URL mappings live in
`src/data/docs-redirects.mjs`.
