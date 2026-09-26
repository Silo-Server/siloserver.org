---
slug: docs/improve-the-docs
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
- Document prerequisites, supported platform differences, and lasting feature
  constraints. Keep temporary bugs, workarounds, and validation findings in
  issue tracking or internal review notes. Verify availability before turning
  a milestone target into a how-to procedure.

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

Each page declares its public URL with `slug: docs/article-name`. Keep that
slug when changing the title, source folder, or sidebar group. The sidebar
can nest a page without adding directories to its URL.

The build checks slugs, navigation, internal links, and anchors. During this
unpublished pre-1.0 reorganization, new redirects are not required. Existing
published aliases remain in `src/data/docs-redirects.mjs`. After 1.0, preserve
published URLs and useful section anchors when moving or merging pages.

The manual's shared release baseline lives in `src/data/docs-release.mjs`.
Do not describe unreleased behavior as available in the current stable release.
If a task requires a particular server or app version, provide evidence in
the pull request and add the applicable `requires` field. Leave it out when
the minimum version is unknown. Source review and real-device testing are
different kinds of evidence; say which you performed.
