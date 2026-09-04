// Section 01 — "What's underneath" infrastructure pillars.
// Each pillar gets a colored accent bar and a 4-cell spec sheet.
// Verify values against silo-server before editing; see CONTRIBUTING.md.

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
    title: "PostgreSQL 18 + pgvector",
    color: "blue",
    body:
      "Your catalog is a relational database you can back up, migrate, replicate, and query, not an opaque blob inside an application directory. pgvector stores the embeddings that power recommendations, so there is no second datastore to run.",
    specs: [
      { label: "primary", value: "postgres 18" },
      { label: "vectors", value: "pgvector" },
      { label: "cache", value: "redis" },
      { label: "objects", value: "S3-compatible" },
    ],
  },
  {
    label: "/* runtime */",
    title: "Go 1.26, end to end",
    color: "red",
    body:
      "Predictable memory, fast cold start, real concurrency. Transcode sessions, scanner walks, and the realtime hub are goroutines, not a thread pool you tune by hand. One static binary in one container image.",
    specs: [
      { label: "backend", value: "go 1.26" },
      { label: "frontend", value: "react 19 + vite" },
      { label: "tooling", value: "pnpm · vitest" },
      { label: "media", value: "ffmpeg" },
    ],
  },
  {
    label: "/* plugins */",
    title: "gRPC, out of process",
    color: "orange",
    body:
      "Plugins are self-contained Go binaries that speak protobuf to the host over a local gRPC socket. Out of process means a misbehaving plugin can crash without taking the server down. Capability types cover metadata, images, markers, analyzers, scheduled tasks, HTTP routes, auth, scan sources, and watch sync.",
    specs: [
      { label: "wire", value: "gRPC + protobuf" },
      { label: "SDK", value: "silo-plugin-sdk" },
      { label: "capabilities", value: "13 types" },
      { label: "1st-party", value: "11 in the catalog" },
    ],
  },
  {
    label: "/* scale */",
    title: "One image, five modes",
    color: "multi",
    body:
      "Run everything in a single container on a mini PC, or run proxy and transcode workers on other hosts that share the same Postgres and Redis. Register each node once in the admin panel and the pool balances streams across whichever nodes are healthy.",
    specs: [
      {
        label: "modes",
        value: "integrated · api · proxy · transcode · frontend",
      },
      { label: "transcode", value: "least-connections" },
      { label: "proxy", value: "round-robin" },
      { label: "health", value: "periodic node sweep" },
    ],
  },
];
