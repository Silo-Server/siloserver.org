// Homepage content. The product mockups recreate real Silo screens, so their
// labels, metadata formats, and layouts follow the app source:
//   tvOS Home marquee   silo-apple tvOS/Components/TVFocusMarquee.swift
//   tvOS top menu       silo-apple tvOS/Navigation/TVTopMenuBar.swift
//   tvOS browse grid    silo-apple tvOS/Screens/Libraries/TVLibraryGridView.swift
//   tvOS movie detail   silo-apple tvOS/Screens/Detail/TVDetailHero.swift
//   iPhone Home         silo-apple Screens/Home/HomeView.swift
//   iPhone remote       silo-apple Control/iOS/SiloControlRemoteView.swift
// Check them against those files before changing a label or format.

import type { ImageMetadata } from "astro";

type Glob = Record<string, { default: ImageMetadata }>;
const posters = import.meta.glob("../assets/home/posters/*.jpg", { eager: true }) as Glob;
const backdrops = import.meta.glob("../assets/home/backdrops/*.jpg", { eager: true }) as Glob;
const logos = import.meta.glob("../assets/home/logos/*.png", { eager: true }) as Glob;
const episodes = import.meta.glob("../assets/home/episodes/*.jpg", { eager: true }) as Glob;

const pick = (set: Glob, dir: string, slug: string, ext: string) => {
  const hit = set[`../assets/home/${dir}/${slug}.${ext}`];
  if (!hit) throw new Error(`Missing ${dir}/${slug}.${ext}`);
  return hit.default;
};
export const poster = (slug: string) => pick(posters, "posters", slug, "jpg");
export const backdrop = (slug: string) => pick(backdrops, "backdrops", slug, "jpg");
export const logo = (slug: string) => pick(logos, "logos", slug, "png");
export const episode = (slug: string, season: number, ep: number) =>
  pick(episodes, "episodes", `${slug}-s${season}e${ep}`, "jpg");

export const hero = {
  lead: "A home for",
  // Used when ?static is in the URL, or when reduced motion is on.
  staticWord: "movies.",
  body:
    "Silo keeps your movies and series in one library on a server you run at home, then plays them on your TV, phone, and computer.",
};

// Each rotating word moves tvOS focus along the Continue Watching row, and the
// marquee previews the focused card, as it does in the app. Marquee metadata:
// rating chip, then year · first genre · runtime for a movie, or
// S1 E1 · episode title · runtime for an episode, then time left. Card
// captions: title, then year or S01E01 · episode title.
export interface Feature {
  word: string;
  slug: string;
  logoAlt: string;
  rating: string;
  meta: string;
  synopsis: string;
  detail: string;
  badges: string[];
  tint: string; // stand-in for the color tvOS samples from the backdrop
  title: string;
  line: string;
  progress: number;
}

export const features: Feature[] = [
  {
    word: "movies.",
    slug: "dune",
    logoAlt: "Dune",
    rating: "PG-13",
    meta: "2021 · Science Fiction · 2h 35m · 52m left",
    synopsis:
      "Paul Atreides travels to the most dangerous planet in the universe to secure his family's future.",
    detail: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac",
    badges: ["4K", "Dolby Vision", "Atmos"],
    tint: "#6b4322",
    title: "Dune",
    line: "2021",
    progress: 0.66,
  },
  {
    word: "series.",
    slug: "breaking-bad",
    logoAlt: "Breaking Bad",
    rating: "TV-MA",
    meta: "S1 E1 · Pilot · 59m · 21m left",
    synopsis:
      "A high school chemistry teacher with a terminal diagnosis turns to a dangerous new trade.",
    detail: "Aired Jan 20, 2008 · Bryan Cranston, Aaron Paul, Anna Gunn",
    badges: ["1080P", "AC3 5.1"],
    tint: "#4b5520",
    title: "Breaking Bad",
    line: "S01E01 · Pilot",
    progress: 0.64,
  },
  {
    word: "date nights.",
    slug: "la-la-land",
    logoAlt: "La La Land",
    rating: "PG-13",
    meta: "2016 · Comedy · 2h 9m · 1h 30m left",
    synopsis:
      "A jazz pianist and an aspiring actress fall in love while chasing their dreams in Los Angeles.",
    detail: "Ryan Gosling, Emma Stone, John Legend",
    badges: ["4K", "HDR10", "Atmos"],
    tint: "#2d2f6e",
    title: "La La Land",
    line: "2016",
    progress: 0.3,
  },
  {
    word: "family nights.",
    slug: "spirited-away",
    logoAlt: "Spirited Away",
    rating: "PG",
    meta: "2001 · Animation · 2h 5m · 1h 9m left",
    synopsis:
      "A girl wanders into a world of spirits and must find a way to free her parents and return home.",
    detail: "Rumi Hiiragi, Miyu Irino, Mari Natsuki",
    badges: ["1080P", "DTS-HD MA 5.1"],
    tint: "#1d5156",
    title: "Spirited Away",
    line: "2001",
    progress: 0.45,
  },
  {
    word: "late nights.",
    slug: "night-of-the-living-dead",
    logoAlt: "Night of the Living Dead",
    rating: "NR",
    meta: "1968 · Horror · 1h 36m · 52m left",
    synopsis:
      "Strangers barricade themselves inside a Pennsylvania farmhouse as the dead begin to rise.",
    detail: "Duane Jones, Judith O'Dea, Karl Hardman",
    badges: ["4K", "FLAC 1.0"],
    tint: "#3f3c3a",
    title: "Night of the Living Dead",
    line: "1968",
    progress: 0.46,
  },
  {
    word: "marathons.",
    slug: "fellowship-of-the-ring",
    logoAlt: "The Lord of the Rings: The Fellowship of the Ring",
    rating: "PG-13",
    meta: "2001 · Adventure · 2h 59m · 2h 27m left",
    synopsis:
      "A hobbit sets out from the Shire with eight companions to destroy a ring of terrible power.",
    detail: "Elijah Wood, Ian McKellen, Viggo Mortensen",
    badges: ["4K", "Dolby Vision", "Atmos"],
    tint: "#4a3b22",
    title: "The Fellowship of the Ring",
    line: "2001",
    progress: 0.18,
  },
];

// tvOS Browse grid, sorted Title A–Z, so this list must stay alphabetical.
export const library = [
  { slug: "2001-a-space-odyssey", title: "2001: A Space Odyssey", year: "1968" },
  { slug: "alien", title: "Alien", year: "1979" },
  { slug: "arrival", title: "Arrival", year: "2016" },
  { slug: "before-sunrise", title: "Before Sunrise", year: "1995" },
  { slug: "blade-runner", title: "Blade Runner", year: "1982" },
  { slug: "blade-runner-2049", title: "Blade Runner 2049", year: "2017" },
  { slug: "casablanca", title: "Casablanca", year: "1943" },
  { slug: "dune", title: "Dune", year: "2021" },
  { slug: "ex-machina", title: "Ex Machina", year: "2015" },
  { slug: "fargo", title: "Fargo", year: "1996" },
  { slug: "goodfellas", title: "GoodFellas", year: "1990" },
  { slug: "in-the-mood-for-love", title: "In the Mood for Love", year: "2000" },
  { slug: "interstellar", title: "Interstellar", year: "2014" },
  { slug: "jaws", title: "Jaws", year: "1975" },
  { slug: "la-la-land", title: "La La Land", year: "2016" },
  { slug: "mad-max-fury-road", title: "Mad Max: Fury Road", year: "2015" },
  { slug: "my-neighbor-totoro", title: "My Neighbor Totoro", year: "1988" },
  { slug: "paddington-2", title: "Paddington 2", year: "2017" },
];

// tvOS series pages (TvSeries.astro). Metadata, cast, and season 1 episode
// titles come from TMDB. A series not yet started shows "Play S1:E1" and no
// Start Over button (TVSeriesDetailView.showPlayTitle, TVDetailActions).
export interface SeriesPage {
  slug: string;
  tint: string;
  rating: string;
  year: string;
  seasons: number;
  imdb: string;
  genres: string;
  synopsis: string;
  starring: string;
  version: string;
  audio: string;
  episodes: string[];
  inProgress: boolean;
}
export const seriesPages: Record<string, SeriesPage> = {
  "breaking-bad": {
    slug: "breaking-bad",
    tint: "#3c4a1f",
    rating: "TV-MA",
    year: "2008",
    seasons: 5,
    imdb: "9.5",
    genres: "Drama, Crime",
    synopsis:
      "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
    starring: "Bryan Cranston, Aaron Paul, Anna Gunn",
    version: "Auto · 1080p",
    audio: "Auto · English · AC3 · 5.1",
    episodes: ["Pilot", "Cat's in the Bag...", "...And the Bag's in the River", "Cancer Man", "Gray Matter"],
    inProgress: true,
  },
  severance: {
    slug: "severance",
    tint: "#1f3a4d",
    rating: "TV-MA",
    year: "2022",
    seasons: 2,
    imdb: "8.7",
    genres: "Drama, Mystery",
    synopsis:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    starring: "Adam Scott, Britt Lower, Tramell Tillman",
    version: "Auto · 4K",
    audio: "Auto · English · EAC3 · 5.1",
    episodes: ["Good News About Hell", "Half Loop", "In Perpetuity", "The You You Are", "The Grim Barbarity of Optics and Design"],
    inProgress: false,
  },
  "the-sopranos": {
    slug: "the-sopranos",
    tint: "#4a2a1c",
    rating: "TV-MA",
    year: "1999",
    seasons: 6,
    imdb: "9.2",
    genres: "Crime, Drama",
    synopsis:
      "The story of New Jersey-based Italian-American mobster Tony Soprano and the difficulties he faces as he tries to balance the conflicting requirements of his home life and the criminal organization he heads.",
    starring: "James Gandolfini, Edie Falco, Jamie-Lynn Sigler",
    version: "Auto · 1080p",
    audio: "Auto · English · DTS-HD MA · 5.1",
    episodes: ["The Sopranos", "46 Long", "Denial, Anger, Acceptance", "Meadowlands", "College"],
    inProgress: false,
  },
};

// The Series library in Browse, sorted Date Added, newest first. Severance
// and The Sopranos are opened from the grid (Library.astro).
export const seriesLibrary = [
  { slug: "severance", title: "Severance", year: "2022" },
  { slug: "the-bear", title: "The Bear", year: "2022" },
  { slug: "ted-lasso", title: "Ted Lasso", year: "2020" },
  { slug: "the-sopranos", title: "The Sopranos", year: "1999" },
  { slug: "succession", title: "Succession", year: "2018" },
  { slug: "dark", title: "Dark", year: "2017" },
  { slug: "fleabag", title: "Fleabag", year: "2016" },
  { slug: "mr-robot", title: "Mr. Robot", year: "2015" },
  { slug: "better-call-saul", title: "Better Call Saul", year: "2015" },
  { slug: "chernobyl", title: "Chernobyl", year: "2019" },
  { slug: "mad-men", title: "Mad Men", year: "2007" },
  { slug: "fargo-tv", title: "Fargo", year: "2014" },
  { slug: "the-office", title: "The Office", year: "2005" },
  { slug: "true-detective", title: "True Detective", year: "2014" },
  { slug: "twin-peaks", title: "Twin Peaks", year: "1990" },
  { slug: "the-wire", title: "The Wire", year: "2002" },
  { slug: "band-of-brothers", title: "Band of Brothers", year: "2001" },
  { slug: "breaking-bad", title: "Breaking Bad", year: "2008" },
];

// Breaking Bad S1 E1, part way through: 37:46 of 59:00, leaving 21:14. The
// remote's title is the episode title and its subtitle is
// "<series> · S1 · E1" (PlayerViewModel.makeSiloControlPlaybackState).
export const nowPlaying = {
  slug: "breaking-bad",
  title: "Pilot",
  subtitle: "Breaking Bad · S1 · E1",
  elapsed: 2266,
  duration: 3540,
  progress: 2266 / 3540,
  left: "21m left",
  tv: "Living Room",
};

// Remote time labels: m:ss or h:mm:ss (PlayerTimeFormatter.swift).
export const clock = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${h ? `${h}:${String(m).padStart(2, "0")}` : m}:${String(sec).padStart(2, "0")}`;
};

export const setup = [
  {
    title: "Spin it up",
    body: "Install Silo Server with Docker on a Linux computer or NAS you already own.",
  },
  {
    title: "Bring your library",
    body: "Point Silo at your movie and series folders. It fills in posters, descriptions, and cast.",
  },
  {
    title: "Pick your screens",
    body: "Use the Silo apps on Apple TV, iPhone, iPad, Android, and Android TV, or watch in any web browser.",
  },
];

// What Silo stands for. Each claim is checked against the project: no
// central accounts (privacy policy), AGPL licence and "will stay free and open
// source" (silo-server README), AI features off by default with self-hosted or
// hosted providers (docs/running-a-server/ai-services.md, recommendations.md),
// and watch history import (docs/using-silo/import-watch-history.md).
export const values = [
  {
    title: "Your data stays with you.",
    body: "Your library, watch history, and accounts live on a server you run. You don't need a Silo account, and there are no ads or tracking.",
  },
  {
    title: "Free and open source.",
    body: "There's no subscription. The server and apps are open source under the AGPL, and they'll stay that way.",
  },
  {
    title: "Smart features, off until you need them.",
    body: "Translate subtitles and descriptions, create subtitles from the audio, and get recommendations. Run the AI on your own hardware or use a cloud provider.",
  },
  {
    title: "Bring what you have.",
    body: "Import your watch history from Plex, Jellyfin, or Emby. Many Jellyfin apps work, including Infuse. Plugins and an open API let you build on it.",
  },
];

export const faq = [
  {
    q: "What do I need to run Silo?",
    a: "A Linux computer or NAS (x86-64 or arm64) that can run Docker, and a folder of movies or series. You don't need a graphics card to get started.",
  },
  {
    q: "What's the release status?",
    a: "Silo is in prerelease on its way to 1.0. The server is updated often, and the apps are in beta on TestFlight and Google Play.",
  },
  {
    q: "Is Silo free?",
    a: "Yes. There's no subscription and no paid tier.",
  },
  {
    q: "Where can I watch?",
    a: "On the Silo apps, in any web browser, and in many Jellyfin apps, including Infuse.",
  },
  {
    q: "Can everyone at home use it?",
    a: "Yes. Invite people to your server and give each person a profile, with their own watch history and Continue Watching.",
  },
];
