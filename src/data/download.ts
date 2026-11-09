// /download content. Store links and install notes follow the
// "Choose an app" guide (src/content/docs/docs/get-started/choose-an-app.md);
// update both together.

export interface StoreLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface AppEntry {
  id: string;
  devices: string;
  name: string;
  status: string;
  body: string;
  links: StoreLink[];
  /** Footer note; `noteLink` goes on its own line after the text. */
  note?: string;
  noteLink?: { label: string; href: string };
}

export const apps: AppEntry[] = [
  {
    id: "apple",
    devices: "Apple TV · iPhone · iPad",
    name: "Silo for Apple devices",
    status: "On the App Store",
    body: "One app for Apple TV, iPhone, and iPad. Install Silo Media Player from the App Store on each device.",
    links: [{ label: "App Store", href: "https://apps.apple.com/us/app/silo-media-player/id6784878771", primary: true }],
    note: "Want to test the latest before release? The TestFlight beta also has the native Mac app.",
    noteLink: { label: "Join the TestFlight beta", href: "https://testflight.apple.com/join/XZy8cu5q" },
  },
  {
    id: "android",
    devices: "Android TV · Phones · Tablets",
    name: "Silo for Android",
    status: "Beta on Google Play",
    body: "One listing covers phones, tablets, and Android TV, and Google Play installs the right version for each. Join the beta with the Google account your devices use, then install.",
    links: [
      { label: "Join the beta", href: "https://play.google.com/apps/testing/org.siloserver.silo", primary: true },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=org.siloserver.silo" },
      { label: "APK downloads", href: "https://github.com/Silo-Server/silo-android/releases/tag/beta-latest" },
    ],
    note: "No Google Play? Use the Downloader app with code 2988950 for phones and tablets, or 6033910 for Android TV.",
  },
  {
    id: "web",
    devices: "Any computer",
    name: "Silo on the web",
    status: "Included with every server",
    body: "Open your server's address in any modern browser to watch, browse, and manage your library. There's nothing to install.",
    links: [],
  },
];

export const server = {
  title: "Run your own server",
  body: "Silo Server runs with Docker on a computer or NAS you already own. It keeps your library, artwork, and everyone's watch progress at home.",
  needs: [
    "A Linux host, x86-64 or arm64, that can run Docker and Docker Compose",
    "A folder of movies or series the host can read",
    "Disk space for the database, artwork, and temporary transcodes",
    "Internet access for posters, descriptions, and cast, unless you keep your own artwork and NFO files",
  ],
  footnote: "No graphics card required to start. Silo is in prerelease and updates often.",
  guide: "/docs/install",
  source: "https://github.com/Silo-Server/silo-server",
};
