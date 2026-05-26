import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Canonical URL for the deployed site. Used for OpenGraph and sitemap.
// The actual hosting (GitHub Pages on the silo-server.github.io repo)
// serves at the custom domain via the CNAME file in public/.
// Override with SITE / BASE_PATH env vars if you ever change hosting.
const site = process.env.SITE ?? "https://siloserver.org";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "never",
  integrations: [
    starlight({
      title: "silo docs",
      description:
        "Documentation for installing, configuring, and operating Silo.",
      favicon: "/favicon.ico",
      editLink: {
        baseUrl:
          "https://github.com/Silo-Server/silo-website/edit/main/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Silo-Server",
        },
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { slug: "docs" },
            { slug: "docs/quickstart" },
            { slug: "docs/installation" },
            { slug: "docs/first-configuration" },
            { slug: "docs/configuration" },
          ],
        },
        {
          label: "Operations",
          items: [
            { slug: "docs/deployment/docker" },
            { slug: "docs/libraries" },
            { slug: "docs/storage/s3" },
            { slug: "docs/deployment/reverse-proxy" },
            { slug: "docs/troubleshooting" },
          ],
        },
        {
          label: "Ecosystem",
          items: [
            { slug: "docs/integrations/autoscan" },
            { slug: "docs/clients" },
            { slug: "docs/jellyfin-compatibility" },
          ],
        },
      ],
    }),
  ],
  build: {
    assets: "_astro",
  },
});
