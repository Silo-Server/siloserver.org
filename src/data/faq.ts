// Section 05 — FAQ entries. Each `answer` may contain inline HTML (kept narrow on purpose).

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Is this ready for my production media library?",
    answer:
      "Define “production.” It runs full-time on real hardware for the people building it: transcoding, remembering what you watched, surviving restarts. But it is still pre-1.0 for a reason. Run it. Tell us what breaks.",
  },
  {
    question: "How does this relate to Jellyfin?",
    answer:
      "Silo speaks the Jellyfin protocol on <code>:8096</code>, so the Jellyfin-compatible clients you already use (Infuse, Findroid, VidHub, JellyCon, Streamyfin) talk to Silo without changes. You can install the Jellyfin web app from the admin panel and it is served at <code>/web/</code>. Silo is its own server with its own internals; the protocol is just the shared language for the clients.",
  },
  {
    question: "Can I migrate from Jellyfin? From Plex? From Emby?",
    answer:
      "Yes to all three. Watch history import works against Jellyfin, Emby, and Plex (with the Plex OAuth PIN flow). Because Silo speaks the Jellyfin protocol, your existing client apps keep working through the migration. Trakt, Simkl, and MDBList sync in both directions on top of that.",
  },
  {
    question: "What's the catch on the license?",
    answer:
      "AGPL-3.0-or-later. If you fork it and run it as a service, you publish your changes. That's the deal. No CLA. No relicense rug-pull. No paywalled features. The Silo name and logo are trademarks and sit outside the license.",
  },
  {
    question: "Who pays for this?",
    answer:
      "Nobody. It is an unfunded open-source project built by maintainers and community contributors, with no company or investors behind it. If that ever changes you'll hear about it here first. <a href=\"https://github.com/sponsors/quick104\" class=\"ghost-link\">Sponsor on GitHub ↗</a> if you want it to keep going.",
  },
  {
    question: "What's broken right now?",
    answer:
      "Audiobooks, ebooks, and podcasts are newer than movies and TV, so expect rough edges there. The native apps are in beta and close to feature parity with the web app; Watch Together, subtitle search, and the admin tools are still web-only. Anything not in the feature list above is probably not yet a thing.",
  },
];
