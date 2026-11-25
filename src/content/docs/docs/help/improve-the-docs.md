---
slug: docs/improve-the-docs
keywords: ["typo", "wrong docs", "outdated guide", "contribute to docs", "edit on GitHub", "PR creation is restricted", "wiki"]
questions: ["How do I report a mistake in the documentation?", "How do I request a new guide?", "Why can't I open a pull request for the docs?"]
title: Improve these docs
description: Report a wrong step, a gap, or a confusing guide in the Silo manual.
---

If a guide has a wrong label, a missing step, or an instruction that
confused you, open an issue on GitHub that describes the change. The docs
repository doesn't take pull requests from contributors; maintainers make
the change from your issue.

## Suggest a change to a page

You need a GitHub account.

1. Select **Suggest a change** at the bottom of the guide. GitHub opens a new
   issue with the page's title and address filled in.
2. Under **What's wrong or confusing**, describe what's wrong or missing. If
   a step didn't work, quote it and say what happened.
3. Under **Suggested wording**, write how you'd put it, if you know.
4. If Silo behaved differently from the guide, fill in **App and server
   versions**: the app, such as iPhone or Android TV, with its version, and
   the server version.
5. Submit the issue.

To ask for a guide that doesn't exist yet, open a
[docs issue](https://github.com/Silo-Server/siloserver.org/issues/new?template=docs.yml)
and give the closest page under **Page**.

## Writing tips

- Use the labels exactly as they appear in the app.
- Say whether the reader needs to be a server administrator.
- Say which apps a step applies to only when the steps differ between them.
  The docs name apps by type:
  - **Mobile**, or "the mobile app", is the Silo app on iPhone, iPad, and
    Android phones and tablets. In steps, say "on your phone or tablet".
  - **TV** is the Silo app on Apple TV and Android TV. "The mobile and TV
    apps" means every app works the same way.
  - **Web app** is Silo in a browser, including a phone's browser.
  - When the Apple and Android apps really differ, write "iPhone and iPad"
    or "Android phones and tablets", and "Apple TV" or "Android TV". Don't
    write "Android" alone, or "phone" when you mean phone or tablet.
- If another guide already covers a step, link to it instead of repeating
  its steps.
- Issues are public. Crop screenshots to the controls that matter, and
  remove account names, server addresses, tokens, and private library
  details from them.
