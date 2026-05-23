import { defineConfig } from "astro/config";

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
  build: {
    assets: "_astro",
  },
});
