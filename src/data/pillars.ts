// Section 02 — concise infrastructure pillars.
// Each pillar gets a colored accent bar and a 4-cell spec sheet.

export type PillarColor = "blue" | "red" | "orange" | "multi";

export interface PillarSpec {
  label: string;
  value: string;
  // If set, the value renders as a link to this URL.
  href?: string;
}

export interface Pillar {
  label: string;
  title: string;
  body: string;
  color: PillarColor;
  specs: PillarSpec[];
}

export const pillars: Pillar[] = [
  {
    label: "/* storage */",
    title: "Postgres for the catalog",
    color: "blue",
    body:
      "Metadata, users, watch history, and recommendations live in a database you can back up and inspect.",
    specs: [
      { label: "primary", value: "postgres 18" },
      { label: "vectors", value: "pgvector" },
      { label: "cache", value: "redis optional" },
      { label: "objects", value: "S3-compatible" },
    ],
  },
  {
    label: "/* runtime */",
    title: "Fast Go backend",
    color: "red",
    body:
      "Scanning, sessions, realtime updates, and transcode orchestration run in one predictable Go service.",
    specs: [
      { label: "backend", value: "go" },
      { label: "frontend", value: "react + vite" },
      { label: "tooling", value: "bun · pnpm" },
      { label: "tests", value: "testcontainers" },
    ],
  },
  {
    label: "/* plugins */",
    title: "Plugins stay outside",
    color: "orange",
    body:
      "Plugins speak protobuf over gRPC, so metadata providers and analyzers can change without forking the server.",
    specs: [
      { label: "wire", value: "gRPC + protobuf" },
      { label: "SDK", value: "silo-plugin-sdk" },
      { label: "capabilities", value: "9 families" },
      { label: "1st-party", value: "TMDB · TVDB" },
    ],
  },
  {
    label: "/* scale */",
    title: "One box or many",
    color: "multi",
    body:
      "Run everything together, or split API, proxy, and transcode workers across the machines you already have.",
    specs: [
      { label: "modes", value: "integrated · api · proxy · transcode" },
      { label: "fits", value: "proxmox · k3s · bare metal" },
      { label: "scheduler", value: "least-connections" },
      { label: "health", value: "self-registering" },
    ],
  },
];
