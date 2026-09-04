// Section 02 — "What it does" feature grid.
// Verify claims against silo-server before editing; see CONTRIBUTING.md.

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
      "Silo picks the lightest playback path your device can handle: direct play when it can, a remux when only the container is the problem, a full transcode only when nothing else works. Hardware encoding on Intel, AMD, NVIDIA, and Apple Silicon, with HDR tone mapping when the screen needs it.",
    chips: [
      { label: "Direct play" },
      { label: "QSV · VAAPI · NVENC" },
      { label: "HDR tone mapping" },
    ],
  },
  {
    id: "FEAT_02",
    title: "Built for households",
    body:
      "One login, many viewing profiles. Each profile gets its own watch history, content rating limit, PIN, language preferences, and library access. Child profiles are locked down by default.",
    chips: [
      { label: "Multi-profile" },
      { label: "Parental controls" },
      { label: "Per-profile libraries" },
    ],
  },
  {
    id: "FEAT_03",
    title: "Grows past one box",
    body:
      "When a single host runs out of headroom, run transcode and proxy workers on other machines, point them at the shared database, and register them in the admin panel. Silo sends each new stream to the transcode node with the fewest active sessions.",
    chips: [
      { label: "Worker nodes" },
      { label: "Least-connections" },
      { label: "One image" },
    ],
  },
  {
    id: "FEAT_04",
    title: "Subtitles your library deserves",
    body:
      "Styled ASS and SSA subtitles render in the browser with their original fonts and positioning intact instead of being flattened to plain text. SRT and VTT are covered too, and missing tracks can be searched across three providers.",
    chips: [
      { label: "ASS · SSA" },
      { label: "SRT · VTT" },
      { label: "OpenSubtitles · SubDL · SubSource" },
    ],
  },
  {
    id: "FEAT_05",
    title: "Recommendations that learn",
    body:
      "Rows built from pgvector embeddings and what similar viewers on your server liked, not a “same genre” lookup. They surface things you'll like without burying the thing you came for.",
    chips: [
      { label: "Recommended for you" },
      { label: "Because you watched" },
      { label: "Similar users liked" },
    ],
  },
  {
    id: "FEAT_06",
    title: "Watch together, properly",
    body:
      "Synchronized playback rooms for movie night over the internet. Invite guests with a link, vote on what plays next, and stay in sync without paying for the privilege. Web app today.",
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
      "First-party plugins handle TMDB and TVDB metadata, TheIntroDB markers, autoscan from your downloaders, and media requests. The SDK lets anyone add providers, analyzers, scheduled tasks, and HTTP routes without touching the core server.",
    chips: [
      { label: "TMDB", repo: "pluginTmdb" },
      { label: "TVDB", repo: "pluginTvdb" },
      { label: "SDK", repo: "pluginSdk" },
      { label: "Catalog", repo: "plugins" },
    ],
  },
  {
    id: "FEAT_08",
    title: "Skip the intro for real",
    body:
      "Intros and credits are found by audio fingerprinting across a season's episodes, not by trusting whatever chapter tags happen to be in the file. Chapter thumbnails are generated as the player needs them.",
    chips: [
      { label: "Chromaprint" },
      { label: "Chapter thumbs" },
      { label: "Season-wide" },
    ],
  },
  {
    id: "FEAT_09",
    title: "Audiobooks and ebooks, same shelf",
    body:
      "Audiobook libraries with chapters, series, and resume, plus an Audiobookshelf-compatible endpoint so apps like Plappa and the official app connect as-is. Podcast feeds sync on a schedule. Ebooks get a built-in reader for EPUB, PDF, and comics with synced progress.",
    chips: [
      { label: "ABS protocol" },
      { label: "EPUB · PDF · CBZ" },
      { label: "Podcast feeds" },
    ],
  },
  {
    id: "FEAT_10",
    title: "Knows when your show is back",
    body:
      "New episode of something you watch? Silo tells you: in-app, browser push, iOS push, email digest, Discord, or your own webhook. A freshly seeded library never floods, season packs get batched, and you choose per episode or a daily digest.",
    chips: [
      { label: "Web · iOS push" },
      { label: "Email · Discord" },
      { label: "Webhooks" },
    ],
  },
  {
    id: "FEAT_11",
    title: "Bring your watch history",
    body:
      "Don't lose what you've watched when you switch servers. Import from Jellyfin, Emby, or Plex on day one, then keep everything in sync with Trakt, Simkl, or MDBList going forward.",
    chips: [
      { label: "Plex · Emby · Jellyfin" },
      { label: "Trakt · Simkl" },
      { label: "MDBList" },
    ],
  },
];
