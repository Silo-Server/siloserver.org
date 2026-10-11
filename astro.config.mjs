import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import { sidebar } from "./src/data/sidebar.mjs";
import previewBanner from "./scripts/preview-banner.mjs";
import { existsSync, statSync } from "node:fs";

// The static pages in public/ (the 1.0 milestone) are folders with an
// index.html. GitHub Pages serves /milestone/1.0 from the folder; the dev
// server doesn't, so map those URLs to their index.html while developing.
// (Links use the slash-free form, matching trailingSlash: "never".)
const publicFolderIndex = {
  name: "public-folder-index",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query = ""] = (req.url ?? "").split("?");
      if (path !== "/" && existsSync(`public${path}/index.html`) && statSync(`public${path}`).isDirectory()) {
        req.url = `${path}/index.html${query ? `?${query}` : ""}`;
      }
      next();
    });
  },
};

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
      title: "Silo docs",
      description:
        "Documentation for installing, configuring, and operating Silo.",
      favicon: "/favicon.ico",
      // Link previews: the Silo wordmark card, at an absolute URL, as on the
      // marketing pages. Starlight already asks for the large card.
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: new URL(`${base.replace(/\/$/, "")}/social-card.png`, site).href },
        },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Silo" } },
      ],
      lastUpdated: true,
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
        SocialIcons: "./src/components/starlight/SocialIcons.astro",
        ThemeSelect: "./src/components/starlight/ThemeSelect.astro",
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
  vite: {
    plugins: [publicFolderIndex],
  },
  build: {
    assets: "_astro",
    // Write pages as docs/page.html rather than docs/page/index.html, so
    // static hosts serve /docs/page without redirecting to /docs/page/.
    format: "preserve",
  },
});
