---
slug: docs/plugins
keywords: ["add-ons", "addons", "extensions", "plugin store", "sideload", "manual plugin install", "third-party plugins", "auto-update plugins", "signed plugins", "tampered plugin", "plugin won't install", "Sigstore"]
questions: ["How do I add extra metadata providers?", "Is it safe to install community plugins?", "How do I install a plugin file I downloaded?", "How do I stop a plugin updating itself?", "How do I know a plugin really came from Silo?", "Why did Silo refuse to install a plugin?"]
title: Install and maintain plugins
description: Find a provider, configure it, and check that it works before relying on it.
---

Plugins add providers and integrations to your server, such as metadata, skip markers, requests, scan sources, and sign-in. Silo installs the official TMDB, TVDB, and TheIntroDB plugins when it starts, as long as it can reach the plugin catalog and check their [release signatures](#release-signature). They need no configuration, so movie and series metadata and skip markers work on a new server. Install other plugins when you want an extra provider or integration.

## Install from the catalog

1. Open **Admin > Integrations > Plugins** and choose the **Catalog** tab.
2. Search for the plugin. Read its description, publisher, and version.
3. Choose **Install**. For a community or external plugin, confirm with **Install plugin**. The plugin appears under **Installed**. If the install fails, the message says why, such as a download that didn't match the catalog's SHA-256 checksum, a Silo plugin whose [release signature](#release-signature) Silo couldn't confirm, or a plugin with no build for your server's platform. Try again only if the message says to; the other failures repeat until the plugin or its catalog changes.
4. Open the plugin. If it shows **Finish setting up**, fill in the listed settings and save them.
5. Try it in the feature that uses it: match one library item or run one scan source.

Some providers also need to be selected in the library or feature settings, for example in a library's **Provider Priority**. Sign-in plugins are set up and turned on in **Admin > Sign-in & Security > Sign-in**; see [Set up single sign-on](/docs/single-sign-on).

## Choose sources you trust

Each plugin's page, and its tile under **Installed**, show where it came from:

- **Silo maintained**: published by the Silo project.
- **Approved community**: reviewed by Silo maintainers, then maintained and supported by its author. Turn on **Include approved community plugins** to add these to the catalog.
- **External source**: from a repository you added under **Repositories**. Silo hasn't reviewed it.
- **Unverified**: not linked to any of your catalogs, because it was installed with **Install from a file** or its repository was removed. Silo can't verify it and never checks it for updates.

Repositories and files add code from other publishers, so review who publishes it first.

Catalog installs are checked against the catalog's checksum, which confirms the download matches the catalog entry. Plugins published by Silo must also pass a [release signature](#release-signature) check, which confirms who built them. Neither check tells you what the plugin does.

## Release signature

Open a plugin's page and find **Release signature** under **Details** to see whether Silo could confirm who built the version you're running:

- **Built from** and a repository, with **Verified** and a date: the release was signed, and the signature shows it was built from that repository for this version. The plugin's tile under **Installed** has a shield mark.
- **Not signed**: the release had no signature to check. A plugin installed with **Install from a file** always shows this.
- **Not checked**: the plugin was installed before Silo checked signatures, or the check couldn't run. Silo checks it at the plugin's next update.
- **Failed the check**: the release came with a signature that doesn't match it. The tile shows **Signature failed**, and the plugin is listed under **Needs attention**. Ask the plugin's publisher about it before you keep using the plugin.

Silo installs or updates a plugin published by Silo only when its signature shows that Silo's release process built it. Otherwise the install stops before the plugin runs, with a message such as `Silo couldn't confirm that the Silo release pipeline built this plugin, so it didn't install it.` This holds whichever catalog lists the plugin. A plugin that's already installed keeps running its current version, and after a refused automatic update its page says that Silo couldn't update it and why.

Plugins from other publishers are checked when their releases are signed, and Silo installs them either way.

To check a signature, your server downloads trust data from `tuf-repo-cdn.sigstore.dev`. If it can't reach that address, installing or updating a Silo plugin fails with `Silo couldn't load the Sigstore trust data it needs to check this plugin's release signature. Check that this server can reach tuf-repo-cdn.sigstore.dev, then try again.` Allow the address in your firewall first.

To check a downloaded Silo plugin file yourself, follow the release section of `CONTRIBUTING.md` in that plugin's repository.

## Install a plugin from a file

Use a test server for an unpublished plugin. Review its source first: Silo runs the file to read its manifest during installation, and it doesn't check a release signature for a file you upload, even for a plugin published by Silo.

1. Open the **Catalog** tab on **Admin > Integrations > Plugins** and find **Install from a file**.
2. Choose **Choose plugin file...** and select the file built for your server's operating system and processor.
3. Choose **Upload**. The plugin appears under **Installed** as **Unverified**.
4. Configure it and try it on test data.

Silo never checks an uploaded plugin for updates, so its page shows **Updated by upload** where other plugins have the **Updates** menu. To update it, upload the new version the same way.

## Update or turn off a plugin

**Check for updates** on the Plugins page looks for new versions. On a plugin's page, the **Updates** menu chooses **Update automatically**, **Ask before updating**, or **Don't check for updates**.

If you turn off **Include approved community plugins** with a community plugin installed, or choose **Disable** for an external plugin's repository under **Repositories**, Silo stops checking that plugin for updates. The plugin keeps running. Its tile and page show **Updates paused** instead of the menu, and its page has a notice linking to the **Catalog** tab. Turn the catalog or repository back on there, and the plugin's **Updates** setting applies again.

To update by hand, open the **More actions** menu and choose **Update to** the new version. Read the release notes first if the plugin handles storage, credentials, or library changes.

To investigate a failing integration, turn the plugin off with its **Enabled** switch before you uninstall it. Turning off a metadata provider stops future matches from it; items already in the catalog stay.

Report a plugin problem to the plugin's own project. Include the plugin and server versions and the error, but not your API key.
