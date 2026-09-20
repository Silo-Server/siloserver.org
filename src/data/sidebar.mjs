// Documentation sidebar. Edit this file to add or move a page; the Astro
// config imports it so contributors never touch astro.config.mjs.
//
// Each entry is a Starlight sidebar item: { slug } for a single page, or
// { label, items } for a group. Use { label, autogenerate: { directory } }
// to list every page in a folder without naming each one.
// See https://starlight.astro.build/guides/sidebar/

export const sidebar = [
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
      { slug: "docs/logging" },
      { slug: "docs/libraries" },
      { slug: "docs/audiobooks" },
      { slug: "docs/ebooks" },
      { slug: "docs/ai-services" },
      { slug: "docs/notifications" },
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
      { slug: "docs/apple-tv" },
      { slug: "docs/feature-parity" },
      { slug: "docs/jellyfin-compatibility" },
      { slug: "docs/audiobookshelf-compatibility" },
    ],
  },
];
