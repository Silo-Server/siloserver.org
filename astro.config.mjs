import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import { sidebar } from "./src/data/sidebar.mjs";
import previewBanner from "./scripts/preview-banner.mjs";

// Canonical URL for the deployed site. Used for OpenGraph and sitemap.
// The actual hosting (GitHub Pages on the silo-server.github.io repo)
// serves at the custom domain via the CNAME file in public/.
// Override with SITE / BASE_PATH env vars if you ever change hosting.
const site = process.env.SITE ?? "https://siloserver.org";
const base = process.env.BASE_PATH ?? "/";

// The dev/preview server binds every interface so the site is reachable over
// Tailscale, not just on localhost. Set DEV_HOST to a single address to narrow
// that, e.g. DEV_HOST=100.x.y.z to bind only the tailnet interface.
const devHost = process.env.DEV_HOST ?? true;

export default defineConfig({
  site,
  base,
  trailingSlash: "never",
  server: {
    host: devHost,
    // Vite rejects unknown Host headers as DNS-rebinding protection. Bare IPs
    // are accepted already; this adds MagicDNS names like host.tailnet.ts.net.
    allowedHosts: [".ts.net"],
  },
  integrations: [
    starlight({
      title: "silo docs",
      description:
        "Documentation for installing, configuring, and operating Silo.",
      favicon: "/favicon.ico",
      customCss: ["./src/styles/docs.css"],
      editLink: {
        baseUrl: "https://github.com/Silo-Server/siloserver.org/edit/main/",
      },
      plugins: [
        // Fails the build on broken internal links or anchors in docs pages.
        starlightLinksValidator({ errorOnRelativeLinks: false }),
      ],
      components: {
        Head: "./src/components/starlight/Head.astro",
        MarkdownContent: "./src/components/starlight/MarkdownContent.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
      },
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/siloserver",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Silo-Server",
        },
      ],
      sidebar,
    }),
    previewBanner(),
  ],
  build: {
    assets: "_astro",
  },
});
