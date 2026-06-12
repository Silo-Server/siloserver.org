// Section 02 — "What it does" feature grid.

export interface FeatureChip {
  label: string;
  // Optional repo key from siteConfig.REPOS — chip becomes a link to that repo.
  repo?: string;
}

export interface Feature {
  id: string; // e.g. "FEAT_01"
  title: string;
  body: string;
  chips: FeatureChip[];
}

export const features: Feature[] = [
  {
    id: "FEAT_01",
    title: "Plays smarter, transcodes less",
    body:
      "Silo picks the lightest playback path your device can handle — direct play when it can, container repackaging when only the wrapper is the problem, full transcode only when there's no other option. Your CPU thanks you.",
    chips: [
      { label: "Direct play" },
      { label: "Hardware accel" },
      { label: "HDR-aware" },
    ],
  },
  {
    id: "FEAT_02",
    title: "Built for households",
    body:
      "One login account, many viewing profiles. Each profile gets its own watch history, content limits, language preferences, and library access. Kid-safe by default when you want it.",
    chips: [
      { label: "Multi-profile" },
      { label: "Parental controls" },
      { label: "Personal libraries" },
    ],
  },
  {
    id: "FEAT_03",
    title: "Built for your homelab cluster",
    body:
      "Got a Proxmox cluster? Drop a transcode and proxy worker into an LXC on every node, point them at the shared database, and Silo will route streams to whichever node is least busy. No manual scheduling, no master node.",
    chips: [
      { label: "Proxmox-friendly" },
      { label: "Per-node workers" },
      { label: "LXC or VM" },
    ],
  },
  {
    id: "FEAT_04",
    title: "Subtitles your library deserves",
    body:
      "Anime-grade subtitles render with their original fonts, positioning, and karaoke effects intact instead of being flattened to plain text. Standard formats supported too, with built-in search for missing tracks.",
    chips: [
      { label: "ASS · SSA" },
      { label: "SRT · VTT" },
      { label: "External search" },
    ],
  },
  {
    id: "FEAT_05",
    title: "Recommendations that learn",
    body:
      "A real recommendation engine that learns your taste over time — not a “related by genre” guess. Surfaces things you'll like without burying the things you came for.",
    chips: [
      { label: "For You" },
      { label: "Because You Watched" },
      { label: "Similar items" },
    ],
  },
  {
    id: "FEAT_06",
    title: "Watch together, properly",
    body:
      "Synchronized playback rooms for movie night over the internet. Invite guests with a link, vote on what's next, and stay in sync without paying for the privilege.",
    chips: [
      { label: "Sync rooms" },
      { label: "Vote queue" },
      { label: "Guest invites" },
    ],
  },
  {
    id: "FEAT_07",
    title: "Extensible without forking",
    body:
      "First-party plugins handle TMDB and TVDB metadata. The plugin system lets the community add their own providers, analyzers, scheduled tasks, and HTTP endpoints without touching the core server.",
    chips: [
      { label: "TMDB", repo: "pluginTmdb" },
      { label: "TVDB", repo: "pluginTvdb" },
      { label: "SDK", repo: "pluginSdk" },
    ],
  },
  {
    id: "FEAT_08",
    title: "Skip the intro for real",
    body:
      "Auto-skip intros and outros that's actually accurate — Silo finds the real boundaries instead of trusting whatever chapter tags happen to be in the file. Chapter thumbnails appear as the player needs them.",
    chips: [
      { label: "Auto-skip" },
      { label: "Chapter thumbs" },
      { label: "Cross-episode" },
    ],
  },
  {
    id: "FEAT_09",
    title: "Audiobooks and ebooks, same shelf",
    body:
      "Audiobook libraries with chapters, series progression, and smart resume — plus an Audiobookshelf-compatible endpoint, so apps like Plappa and the official ABS app connect as-is. Ebooks get a built-in EPUB reader with synced progress.",
    chips: [
      { label: "ABS protocol" },
      { label: "EPUB reader" },
      { label: "Series progression" },
    ],
  },
  {
    id: "FEAT_10",
    title: "Knows when your show is back",
    body:
      "New episode of something you watch? Silo tells you — in-app, browser push, email digest, Discord DM, or your own webhook. Seeded libraries never flood, season packs get batched, and every profile picks its own channels.",
    chips: [
      { label: "Web push" },
      { label: "Email · Discord" },
      { label: "Webhooks" },
    ],
  },
  {
    id: "FEAT_11",
    title: "Bring your watch history",
    body:
      "Don't lose what you've watched switching servers. Import from Jellyfin, Emby, or Plex on day one, then keep everything in sync with Trakt or Simkl going forward.",
    chips: [
      { label: "Plex import" },
      { label: "Trakt sync" },
      { label: "Simkl sync" },
    ],
  },
];
