// Documentation sidebar. Edit this file to add or move a page; the Astro
// config imports it so contributors never touch astro.config.mjs.
//
// Each entry is a Starlight sidebar item: { slug } for a single page, or
// { label, items } for a group. Use { label, autogenerate: { directory } }
// to list every page in a folder without naming each one.
// See https://starlight.astro.build/guides/sidebar/

export const sidebar = [
  {
    label: "Get started",
    items: [
      { slug: "docs" },
      { slug: "docs/get-started/choose-an-app" },
      { slug: "docs/get-started/installation-options" },
      { slug: "docs/get-started/install-silo" },
    ],
  },
  {
    label: "Using Silo",
    items: [
      { slug: "docs/using-silo/notifications" },
      {
        label: "Connect other apps",
        items: [
          { slug: "docs/using-silo/jellyfin-apps" },
          { slug: "docs/using-silo/audiobookshelf-apps" },
        ],
      },
      {
        label: "Client reference",
        collapsed: true,
        items: [
          { slug: "docs/using-silo/apple-tv-playback" },
          { slug: "docs/using-silo/client-feature-reference" },
        ],
      },
    ],
  },
  {
    label: "Running a server",
    items: [
      { slug: "docs/running-a-server/after-installation" },
      {
        label: "Libraries and metadata",
        collapsed: true,
        items: [
          { slug: "docs/running-a-server/media-folders" },
          { slug: "docs/running-a-server/audiobook-libraries" },
          { slug: "docs/running-a-server/ai-services" },
        ],
      },
      {
        label: "Connections and integrations",
        collapsed: true,
        items: [
          { slug: "docs/running-a-server/reverse-proxy" },
          { slug: "docs/running-a-server/third-party-access" },
          { slug: "docs/running-a-server/autoscan" },
          { slug: "docs/running-a-server/notifications" },
        ],
      },
      {
        label: "Deployment and reference",
        collapsed: true,
        items: [
          { slug: "docs/running-a-server/docker" },
          { slug: "docs/running-a-server/configuration" },
          { slug: "docs/running-a-server/s3-storage" },
          { slug: "docs/running-a-server/logging" },
        ],
      },
    ],
  },
  {
    label: "Developers & integrations",
    items: [{ slug: "docs/developers" }],
  },
  {
    label: "Help & contribute",
    items: [
      { slug: "docs/help" },
      { slug: "docs/help/report-a-problem" },
      { slug: "docs/help/improve-the-docs" },
    ],
  },
];
