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
      "Native iOS app. Direct play and HLS playback, offline downloads, Picture-in-Picture, Now Playing integration.",
    status: "beta",
    statusLabel: "● beta",
    repo: "apple",
  },
  {
    name: "Silo for tvOS",
    icon: "▭",
    platform: "SwiftUI · Top Shelf",
    body:
      "Apple TV native, with Top Shelf integration, focus-engine navigation, and a custom player tuned for Dolby Vision.",
    status: "beta",
    statusLabel: "● beta",
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
    statusLabel: "● beta",
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

export interface CompatClient {
  name: string;
  platforms: string;
  status: string;
}

export const compatClients: CompatClient[] = [
  { name: "Infuse", platforms: "iOS · tvOS · macOS", status: "verified" },
  { name: "Findroid", platforms: "Android", status: "verified" },
  { name: "VidHub", platforms: "iOS · tvOS · macOS", status: "verified" },
  { name: "JellyCon", platforms: "Kodi", status: "verified" },
  { name: "Streamyfin", platforms: "iOS · Android", status: "verified" },
  { name: "Wholphin", platforms: "tvOS", status: "probably" },
  { name: "Jellyfin Web", platforms: "browser", status: "vendored at /web/" },
  { name: "mpv (libmpv)", platforms: "any", status: "verified" },
];
