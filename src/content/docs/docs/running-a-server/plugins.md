---
slug: docs/plugins
title: Install and maintain plugins
description: Find a provider, configure it, and check that it works before relying on it.
---

Plugins add providers and integrations to your server. Start with the task you need, then install the plugin that supplies it.

## Install from the catalog

1. Open **Admin > Plugins > Catalog**.
2. Search for the plugin. Read its description, publisher, version, and required setup.
3. Choose **Install** and wait for the installation to appear under **Installed**.
4. Choose **Configure** and fill in the settings the plugin requires. Save the configuration and check that the plugin is enabled.
5. Return to the feature that uses it and perform a small test: match one library item, search for one subtitle, or run one scan source.

Installing a plugin does not prove its credentials or external service work. A provider may also need to be selected in the library or feature settings.

## Choose sources you trust

The catalog distinguishes first-party and community sources. **Include approved community plugins** controls whether approved community entries are shown. Additional repositories and manual installs are advanced options; review who publishes the code before adding them.

A download checksum checks the package against its catalog record. It does not replace a review of the publisher or the plugin's behavior. Keep credentials out of issue reports and screenshots.

## Upload a plugin for testing

Use a disposable server for an unpublished plugin. Review its source and manifest before uploading it: Silo runs the binary to inspect its manifest during installation.

1. Open **Admin > Plugins > Catalog** and find **Manual Install**.
2. Choose **Choose plugin file...** and select the binary built for your server's operating system and processor.
3. Choose **Upload**, then inspect the resulting installation under **Installed**.
4. Configure it and test its task on non-sensitive test data.

## Update or disable a plugin

Check for updates on the Plugins page, then use **Update** on the installed plugin. Read its release notes first if it handles storage, credentials, or library changes. Repeat the small feature test afterward.

To investigate a failing integration, disable its plugin before uninstalling it. Confirm which libraries or features depend on it. Disabling a metadata provider, for example, can prevent future matches even while existing catalog items remain visible.

Report a plugin-specific failure to its linked project with the plugin and server versions. Include the failed task and error, not the API key.
