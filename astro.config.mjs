import { defineConfig } from "astro/config";

// GitHub Pages defaults — org page at silo-server.github.io (root path).
// Override SITE and BASE_PATH env vars in CI when moving to a custom domain.
//   SITE=https://silo.example.com BASE_PATH=/  bun run build
const site = process.env.SITE ?? "https://silo-server.github.io";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "never",
  build: {
    assets: "_astro",
  },
});
