// Single source of truth for site-wide constants. Edit here, not in components.

export const SITE = {
  name: "silo",
  tagline: "self-hosted media, built to scale.",
  description:
    "Silo is a self-hosted media server built with Go, Postgres, ffmpeg, and open client protocols.",
  status: "pre-1.0",
  license: "AGPL-3.0-or-later",
  github: {
    org: "Silo-Server",
    orgUrl: "https://github.com/Silo-Server",
    readmeUrl: "https://github.com/Silo-Server/silo-server#readme",
  },
} as const;

// Repo names used by the release-data layer.
export const REPOS = {
  server: "silo-server",
  apple: "silo-apple",
  android: "silo-android",
  pluginSdk: "silo-plugin-sdk",
  pluginTmdb: "silo-plugin-tmdb",
  pluginTvdb: "silo-plugin-tvdb",
  plugins: "silo-plugins",
  themes: "silo-themes",
} as const;

export const repoUrl = (name: string) =>
  `${SITE.github.orgUrl}/${name}`;
