// Curated task order for the public manual. Articles stay in plain Markdown.
// Top-level categories are static headings; only subgroups can collapse.
const page = slug => ({ slug });
const group = (label, slugs) => ({ label, collapsed: true, items: slugs.map(page) });

export const sidebar = [
  {
    label: "Get started",
    items: [
      page("docs"),
      page("docs/choose-an-app"),
      page("docs/apps-and-features"),
      page("docs/connect-and-watch"),
      page("docs/tv-sign-in"),
    ],
  },
  {
    label: "Using Silo",
    items: [
      group("Find and organize", [
        "docs/home-and-calendar",
        "docs/find-something",
        "docs/saved-titles",
        "docs/collections",
        "docs/requests",
      ]),
      group("Watch", [
        "docs/watch-movies-and-series",
        "docs/subtitles",
        "docs/missing-subtitles",
        "docs/tv-remote",
        "docs/downloads",
      ]),
      group("Your account and preferences", [
        "docs/accounts",
        "docs/profiles",
        "docs/preferences",
        "docs/notification-inbox",
      ]),
      group("Watch history", [
        "docs/watch-history",
        "docs/import-watch-history",
        "docs/watch-state-webhooks",
      ]),
      page("docs/jellyfin-apps"),
    ],
  },
  {
    label: "Running a server",
    items: [
      page("docs/install"),
      page("docs/requirements"),
      group("Build your library", [
        "docs/media-folders",
        "docs/manage-libraries",
        "docs/metadata",
        "docs/local-metadata",
        "docs/autoscan",
        "docs/manage-collections",
        "docs/home-sections",
        "docs/recommendations",
        "docs/branding",
      ]),
      group("Give people access", [
        "docs/manage-accounts",
        "docs/manage-access",
        "docs/reverse-proxy",
        "docs/third-party-access",
        "docs/help-a-user",
        "docs/active-playback",
      ]),
      group("Playback and providers", [
        "docs/plugins",
        "docs/playback",
        "docs/transcode-nodes",
        "docs/subtitle-providers",
        "docs/markers",
        "docs/ai-services",
      ]),
      group("Automations and integrations", [
        "docs/api-keys",
        "docs/manage-requests",
        "docs/notification-delivery",
        "docs/import-household-watch-history",
      ]),
      group("Maintain and recover", [
        "docs/backup-restore",
        "docs/updates",
        "docs/server-health",
        "docs/logging",
        "docs/monitoring",
        "docs/profiling",
      ]),
      group("Deployment reference", [
        "docs/docker",
        "docs/configuration",
        "docs/s3-storage",
      ]),
    ],
  },
  {
    label: "Beta",
    items: [
      "docs/beta",
      "docs/listen-to-audiobooks",
      "docs/audiobook-libraries",
      "docs/audiobookshelf",
      "docs/ebooks",
      "docs/watch-together",
      "docs/watch-sync",
      "docs/timeline-previews",
      "docs/catalog-seeds",
      "docs/native-macos",
      "docs/network-access",
      "docs/podcasts-and-music",
    ].map(page),
  },
  {
    label: "Developers & integrations",
    items: [
      page("docs/developers"),
      page("docs/api"),
      page("docs/build-a-plugin"),
    ],
  },
  {
    label: "Help & contribute",
    items: [
      page("docs/help"),
      page("docs/playback-problems"),
      page("docs/report-a-problem"),
      page("docs/privacy"),
      page("docs/improve-the-docs"),
    ],
  },
];
