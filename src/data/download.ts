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
  note?: string;
}

export const apps: AppEntry[] = [
  {
    id: "apple",
    devices: "Apple TV · iPhone · iPad",
    name: "Silo for Apple devices",
    status: "Beta on TestFlight",
    body: "One app for Apple TV, iPhone, and iPad. Accept the invitation on your iPhone or iPad, then install Silo from TestFlight on your Apple TV with the same Apple Account.",
    links: [{ label: "Join the TestFlight", href: "https://testflight.apple.com/join/XZy8cu5q", primary: true }],
    note: "Macs with Apple silicon can run the iPhone and iPad app. A native Mac app is also in beta.",
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
      { label: "APK downloads", href: "https://github.com/Silo-Server/silo-android/releases/latest" },
    ],
    note: "No Google Play? Use the Downloader app with code 1141108 for phones and tablets, or 2249835 for Android TV.",
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
