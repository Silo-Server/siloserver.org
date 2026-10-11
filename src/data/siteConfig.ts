// Single source of truth for site-wide constants. Edit here, not in components.

export const SITE = {
  name: "silo",
  // The homepage's title and the default description when a page is shared.
  tagline: "Your media. Your server. Every screen.",
  description:
    "Silo keeps your movies and series in one library on a server you run at home, then plays them on your TV, phone, and computer.",
  status: "pre-1.0",
  license: "AGPL-3.0-or-later",
  discord: "https://discord.gg/siloserver",
  // GitHub Sponsors, as in silo-server's .github/FUNDING.yml.
  sponsor: "https://github.com/sponsors/Quick104",
  github: {
    org: "Silo-Server",
    orgUrl: "https://github.com/Silo-Server",
    readmeUrl: "https://github.com/Silo-Server/silo-server#readme",
  },
} as const;
