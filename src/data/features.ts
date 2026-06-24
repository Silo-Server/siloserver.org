// Section 01 — concise feature grid.

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
    title: "Smarter playback",
    body:
      "Direct play when possible. Remux when the container is the issue. Transcode only when needed.",
    chips: [
      { label: "Direct play" },
      { label: "Hardware accel" },
      { label: "HDR-aware" },
    ],
  },
  {
    id: "FEAT_02",
    title: "Profiles for everyone",
    body:
      "Each person gets their own history, limits, languages, and library access.",
    chips: [
      { label: "Multi-profile" },
      { label: "Parental controls" },
      { label: "Personal libraries" },
    ],
  },
  {
    id: "FEAT_03",
    title: "Scale when you need it",
    body:
      "Start on one box. Add proxy and transcode workers across Proxmox, K3s, or bare metal later.",
    chips: [
      { label: "One box" },
      { label: "Worker nodes" },
      { label: "Least-connections" },
    ],
  },
  {
    id: "FEAT_04",
    title: "Better subtitles",
    body:
      "ASS, SSA, SRT, and VTT stay readable, styled, and in sync.",
    chips: [
      { label: "ASS · SSA" },
      { label: "SRT · VTT" },
      { label: "External search" },
    ],
  },
  {
    id: "FEAT_05",
    title: "Media beyond video",
    body:
      "Movies, shows, music, audiobooks, and ebooks can live on the same shelf.",
    chips: [
      { label: "Audiobooks" },
      { label: "EPUB" },
      { label: "ABS protocol" },
    ],
  },
  {
    id: "FEAT_06",
    title: "Open by default",
    body:
      "Import your history, sync with Trakt or Simkl, and extend the server with plugins.",
    chips: [
      { label: "Plex import" },
      { label: "Trakt sync" },
      { label: "Plugin SDK", repo: "pluginSdk" },
    ],
  },
];
