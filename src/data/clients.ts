// Section 04 — Native first-party clients + Jellyfin-compatible third-party clients.

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
      "The admin and viewing UI that ships with the server. Dark by default, cinematic, with the Ken Burns hero you'd expect.",
    status: "ok",
    statusLabel: "● shipping",
    repo: "server",
  },
  {
    name: "Silo for iOS",
    icon: "▢",
    platform: "SwiftUI · AVKit",
    body:
      "Native iOS app. Direct play and HLS playback, Picture-in-Picture, Now Playing integration.",
    status: "beta",
    statusLabel: "● beta · nearly ready",
    repo: "apple",
  },
  {
    name: "Silo for tvOS",
    icon: "▭",
    platform: "SwiftUI · Top Shelf",
    body:
      "Apple TV native, with Top Shelf integration, focus-engine navigation, and a custom player tuned for Dolby Vision.",
    status: "beta",
    statusLabel: "● beta · nearly ready",
    repo: "apple",
  },
  {
    name: "Silo for macOS",
    icon: "⌘",
    platform: "SwiftUI · AppKit bridge",
    body:
      "Native Mac client. Multi-window, drag-and-drop, the same playback core as the iOS app.",
    status: "alpha",
    statusLabel: "● alpha",
    repo: "apple",
  },
  {
    name: "Silo for Android",
    icon: "▴",
    platform: "Compose · Media3",
    body:
      "Phone and tablet. Built on Media3 with a bundled ffmpeg AAR decoder for tracks the platform won't touch.",
    status: "beta",
    statusLabel: "● beta · WIP",
    repo: "android",
  },
  {
    name: "Silo for Android TV",
    icon: "▥",
    platform: "Compose for TV · Media3",
    body:
      "Designed for the remote. D-pad first navigation, big posters, fast resume. Compose for TV under the hood.",
    status: "alpha",
    statusLabel: "● alpha",
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
    status: "vendored at /web/",
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
