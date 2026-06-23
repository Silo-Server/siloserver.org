// Native first-party clients + Jellyfin- and Audiobookshelf-compatible third-party clients.

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
    name: "Silo Web",
    icon: "▦",
    platform: "Browser",
    body: "The built-in app for setup, admin, and playback.",
    status: "ok",
    statusLabel: "● shipping",
    repo: "server",
  },
  {
    name: "Silo for Apple",
    icon: "▢",
    platform: "iOS · tvOS · macOS",
    body: "Native SwiftUI apps for Apple screens.",
    status: "beta",
    statusLabel: "● beta",
    repo: "apple",
  },
  {
    name: "Silo for Android",
    icon: "▴",
    platform: "Android · Android TV",
    body: "Compose and Media3 clients for phones, tablets, and TVs.",
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
    name: "Jellyfin Web",
    platforms: "browser",
    status: "vendored at /web/",
    links: [
      { label: "github", href: "https://github.com/jellyfin/jellyfin-web" },
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
];
