// Section 04 — Native first-party clients + Jellyfin- and Audiobookshelf-compatible third-party clients.

export type ClientStatus = "ok" | "beta" | "alpha";

export interface NativeClient {
  name: string;
  icon: string; // unicode glyph used in the icon tile
  platform: string;
  body: string;
  status: ClientStatus;
  statusLabel: string;
  repo: string; // repo key from siteConfig.REPOS
}

export const nativeClients: NativeClient[] = [
  {
    name: "Silo for Web",
    icon: "▦",
    platform: "React · TypeScript · Vite",
    body:
      "The viewing and admin UI that ships with the server, and the reference client: every feature lands here first.",
    status: "ok",
    statusLabel: "● shipping",
    repo: "server",
  },
  {
    name: "Silo for iOS",
    icon: "▢",
    platform: "SwiftUI · AetherEngine",
    body:
      "Native iPhone and iPad app. Direct play and HLS, Picture in Picture, offline downloads, and Now Playing on the lock screen.",
    status: "beta",
    statusLabel: "● beta",
    repo: "apple",
  },
  {
    name: "Silo for tvOS",
    icon: "▭",
    platform: "SwiftUI · AetherEngine · Top Shelf",
    body:
      "Built for the Siri Remote, with Top Shelf and focus-engine navigation. An FFmpeg-based player handles Dolby Vision profiles 5, 7, and 8 and lossless multichannel audio.",
    status: "beta",
    statusLabel: "● beta",
    repo: "apple",
  },
  {
    name: "Silo for macOS",
    icon: "⌘",
    platform: "SwiftUI · AetherEngine",
    body:
      "Native Mac app with the same playback core as iOS, including Dolby Vision and lossless multichannel audio.",
    status: "beta",
    statusLabel: "● beta",
    repo: "apple",
  },
  {
    name: "Silo for Android",
    icon: "▴",
    platform: "Compose · Media3",
    body:
      "Phone and tablet. Built on Media3 with a bundled FFmpeg audio decoder for TrueHD, DTS, and other tracks the platform won't decode, plus refresh-rate matching.",
    status: "beta",
    statusLabel: "● beta",
    repo: "android",
  },
  {
    name: "Silo for Android TV",
    icon: "▥",
    platform: "Compose for TV · Media3",
    body:
      "Designed for the remote: D-pad first, big posters, fast resume. HDR and Dolby Vision output, audio passthrough, and refresh-rate matching.",
    status: "beta",
    statusLabel: "● beta",
    repo: "android",
  },
];

export interface CompatLink {
  label: string;
  href: string;
}

export interface CompatClient {
  name: string;
  platforms: string;
  status: string;
  links: CompatLink[];
}

export const compatClients: CompatClient[] = [
  {
    name: "Infuse",
    platforms: "iOS · tvOS · macOS",
    status: "verified",
    links: [
      { label: "firecore.com", href: "https://firecore.com/infuse" },
      {
        label: "app store",
        href: "https://apps.apple.com/app/infuse/id1136220934",
      },
    ],
  },
  {
    name: "Findroid",
    platforms: "Android",
    status: "verified",
    links: [
      {
        label: "github",
        href: "https://github.com/jarnedemeulemeester/findroid",
      },
      {
        label: "play store",
        href: "https://play.google.com/store/apps/details?id=dev.jdtech.jellyfin",
      },
    ],
  },
  {
    name: "VidHub",
    platforms: "iOS · tvOS · macOS",
    status: "verified",
    links: [
      { label: "okaapps.com", href: "https://okaapps.com/product/1659622164" },
      {
        label: "app store",
        href: "https://apps.apple.com/app/vidhub-video-library-player/id1659622164",
      },
    ],
  },
  {
    name: "JellyCon",
    platforms: "Kodi",
    status: "verified",
    links: [{ label: "github", href: "https://github.com/jellyfin/jellycon" }],
  },
  {
    name: "Streamyfin",
    platforms: "iOS · Android",
    status: "verified",
    links: [
      { label: "github", href: "https://github.com/streamyfin/streamyfin" },
      {
        label: "app store",
        href: "https://apps.apple.com/app/streamyfin/id6593660679",
      },
      {
        label: "play store",
        href: "https://play.google.com/store/apps/details?id=com.fredrikburmester.streamyfin",
      },
    ],
  },
  {
    name: "Wholphin",
    platforms: "Android TV",
    status: "verified · recommended",
    links: [
      { label: "github", href: "https://github.com/damontecres/Wholphin" },
      {
        label: "play store",
        href: "https://play.google.com/store/apps/details?id=com.github.damontecres.wholphin",
      },
    ],
  },
  {
    name: "Jellyfin Web",
    platforms: "browser",
    status: "optional · served at /web/",
    links: [
      { label: "github", href: "https://github.com/jellyfin/jellyfin-web" },
    ],
  },
  {
    name: "mpv (libmpv)",
    platforms: "any",
    status: "verified",
    links: [
      { label: "mpv.io", href: "https://mpv.io" },
      { label: "github", href: "https://github.com/mpv-player/mpv" },
    ],
  },
];

// Audiobookshelf-compatible listening apps, served on :13378.
export const absClients: CompatClient[] = [
  {
    name: "Audiobookshelf app",
    platforms: "iOS · Android",
    status: "verified",
    links: [
      {
        label: "github",
        href: "https://github.com/advplyr/audiobookshelf-app",
      },
    ],
  },
  {
    name: "Plappa",
    platforms: "iOS",
    status: "verified",
    links: [
      {
        label: "app store",
        href: "https://apps.apple.com/app/plappa/id6475201956",
      },
    ],
  },
  {
    name: "AudioBooth",
    platforms: "iOS",
    status: "verified",
    links: [
      {
        label: "app store",
        href: "https://apps.apple.com/app/audiobooth-audiobooks-player/id6753017503",
      },
    ],
  },
  {
    name: "AudiobookshelfFully",
    platforms: "Android",
    status: "verified",
    links: [],
  },
];
