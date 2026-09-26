---
slug: docs/custom-themes
beta: true
title: Custom web themes (Beta)
description: Edit web colors, fonts, CSS, and community theme files.
---

:::caution[Beta]
Advanced web themes are outside the supported 1.0 scope.
:::

The web app includes a Theme Editor for custom colors, fonts, and CSS. These tools apply to the web interface; native Apple and Android apps do not render web CSS.

| Client | Available actions |
| --- | --- |
| Web | Edit profile tokens/CSS, import or export theme files, and install a listed community theme. |
| Web admin | Set server-wide tokens/CSS and the community theme-list URL. |
| Apple and Android apps | No web-theme or CSS rendering. |

## Customize your profile

1. Open **Settings → Theme Editor**.
2. Use **Tokens** to change individual design values, or **Custom CSS** to edit styles.
3. Check the preview and the pages you use. Changes apply as you edit and are stored for your profile.
4. Use the import/export controls to load or save a theme file.

The **Catalog** tab lists community themes when the configured catalog is available. Select **Install** to apply a listed theme. An empty catalog means there are no entries available from that source.

Use **Reset all customizations** to clear your token and CSS overrides. Keep an exported copy if you want to restore those edits later.

## Set server-wide styles

An administrator can open **Admin → Settings → Appearance**, then expand the advanced controls under **Colors and theme**. This area includes token overrides, custom CSS, and the community theme-list URL. Save the settings to apply the server-wide styles.

Profile customizations layer over the server's styles. Inspect text contrast and control visibility after editing; custom CSS can make parts of the interface difficult to use.

For the server name, logo, login background, favicon, and accent color, see [server branding](/docs/branding). Those standard branding controls remain part of the supported administration scope.
