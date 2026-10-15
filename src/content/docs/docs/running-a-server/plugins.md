---
slug: docs/plugins
title: Install and maintain plugins
description: Find a provider, configure it, and check that it works before relying on it.
---

Plugins add providers and integrations to your server, such as metadata, skip markers, requests, scan sources, and sign-in. Silo installs the official TMDB, TVDB, and TheIntroDB plugins when it starts, as long as it can reach the plugin catalog. They need no configuration, so movie and series metadata and skip markers work on a new server. Install other plugins when you want an extra provider or integration.

## Install from the catalog

1. Open **Admin > Plugins** and choose the **Catalog** tab.
2. Search for the plugin. Read its description, publisher, and version.
3. Choose **Install**. The plugin appears under **Installed**.
4. Open the plugin. If it shows **Finish setting up**, fill in the listed settings and save them.
5. Try it in the feature that uses it: match one library item or run one scan source.

Some providers also need to be selected in the library or feature settings, for example in a library's **Provider Priority**. Sign-in plugins are set up and turned on in **Admin > Settings > Sign-in**; see [Set up single sign-on](/docs/single-sign-on).

## Choose sources you trust

Each plugin's page lists its publisher and source. **Include approved community plugins** adds approved community entries to the catalog. **Repositories** and **Install from a file** add code from other publishers, so review who publishes it first.

Catalog installs are checked against the catalog's checksum. That confirms the download matches the catalog entry; it tells you nothing about what the plugin does.

## Install a plugin from a file

Use a test server for an unpublished plugin. Review its source first: Silo runs the file to read its manifest during installation.

1. Open **Admin > Plugins > Catalog** and find **Install from a file**.
2. Choose **Choose plugin file...** and select the file built for your server's operating system and processor.
3. Choose **Upload**. The plugin appears under **Installed**.
4. Configure it and try it on test data.

## Update or turn off a plugin

**Check for updates** on the Plugins page looks for new versions. On a plugin's page, the **Updates** menu chooses **Update automatically**, **Ask before updating**, or **Don't check for updates**. To update by hand, open the **More actions** menu and choose **Update to** the new version. Read the release notes first if the plugin handles storage, credentials, or library changes.

To investigate a failing integration, turn the plugin off with its **Enabled** switch before you uninstall it. Turning off a metadata provider stops future matches from it; items already in the catalog stay.

Report a plugin problem to the plugin's own project. Include the plugin and server versions and the error, but not your API key.
