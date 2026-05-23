// Section 05 — FAQ entries. Each `answer` may contain inline HTML (kept narrow on purpose).

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Is this ready for my production media library?",
    answer:
      "Define “production.” It's running full-time on real hardware for the developer building it — transcoding, remembering what you watched, surviving restarts. But it's still pre-1.0 for a reason. Run it. Tell us what breaks.",
  },
  {
    question: "How does this relate to Jellyfin?",
    answer:
      "Silo speaks the Jellyfin protocol on <code>:8096</code>, which means the Jellyfin-compatible clients you already use — Infuse, Findroid, VidHub, JellyCon, Streamyfin — talk to Silo without changes. The Jellyfin web app is vendored at <code>/web/</code> for the same reason. Silo is its own server with its own internals; the protocol is just the lingua franca for the clients.",
  },
  {
    question: "Can I migrate from Jellyfin? From Plex? From Emby?",
    answer:
      "Yes to all three. Watch history import works against Jellyfin, Emby, and Plex (with the Plex OAuth-PIN flow). Because Silo speaks the Jellyfin protocol, your existing client apps keep working through the migration. Trakt and Simkl sync both directions on top of that.",
  },
  {
    question: "What's the catch on the license?",
    answer:
      "AGPL-3.0-or-later. If you fork it and run it as a service, you publish your changes. That's the deal. No CLA. No relicense rug-pull. No paywalled features.",
  },
  {
    question: "Who pays for this?",
    answer:
      "Nobody. It's a one-developer project, no company, no funding. If that ever changes you'll hear about it before you read about it. <a href=\"https://github.com/sponsors\" class=\"ghost-link\">Sponsor on GitHub ↗</a> if you want it to keep going.",
  },
  {
    question: "What's broken right now?",
    answer:
      "Live TV. Audiobooks (working, but rough). Books (alpha). Photo libraries (not started). macOS and Android TV clients are still alpha. Anything not in the feature list above is probably not yet a thing.",
  },
];
