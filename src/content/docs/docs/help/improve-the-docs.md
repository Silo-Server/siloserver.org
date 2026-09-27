---
slug: docs/improve-the-docs
title: Improve these docs
description: Fix a wrong step, fill a gap, or clarify a guide in the Silo manual.
---

If a guide has a wrong label, a missing step, or an instruction that
confused you, you can fix it from your browser. You don't need to build the
website.

## Edit a page

1. Select **Edit page** at the bottom of the guide. GitHub opens the page's
   Markdown source.
2. Make your change. If you don't have write access, GitHub offers to create
   a fork for you.
3. Open a pull request that says what was wrong or confusing and what you
   changed.
4. A bot comments on the pull request with a link to a preview of the site.
   Open it to see your change in place.

Small corrections can go straight to a pull request. For larger changes,
such as new pages or navigation, open an issue first. The
[website contribution guide](https://github.com/Silo-Server/siloserver.org/blob/main/CONTRIBUTING.md)
covers building the site locally and what reviewers look for.

## Writing tips

- Say at the start if the reader needs to be a server administrator.
- Lead with what the reader wants to do, then the steps.
- Use the exact labels shown in the app, in bold.
- Mention differences between phones, TVs, and the web app only where the
  steps change.
- Link to an existing guide instead of repeating its steps.
- Keep screenshots to the controls the reader needs, and keep every step in
  the text as well. Remove account names, server addresses, tokens, and
  private library details from them.

If you changed a step because the app behaves differently, say in the pull
request which app and server versions you used.
