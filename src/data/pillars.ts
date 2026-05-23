// Section 01 — "What's underneath" infrastructure pillars.
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
    title: "PostgreSQL 18 + pgvector",
    color: "blue",
    body:
      "Your catalog is a relational database you can backup, migrate, replicate, and query — not an opaque blob inside an application directory. pgvector handles the embeddings that power recommendations without bolting on a second datastore.",
    specs: [
      { label: "primary", value: "postgres 18" },
      { label: "vectors", value: "pgvector 0.8" },
      { label: "cache", value: "redis (optional)" },
      { label: "objects", value: "S3-compatible" },
    ],
  },
  {
    label: "/* runtime */",
    title: "Go 1.26, end to end",
    color: "red",
    body:
      "Predictable memory, fast cold-start, real concurrency. Transcode sessions, scanner walks, and the realtime hub are all goroutines — no thread pool to tune, no GC pauses long enough to disrupt a stream.",
    specs: [
      { label: "backend", value: "go 1.26" },
      { label: "frontend", value: "react + vite" },
      { label: "tooling", value: "bun · pnpm" },
      { label: "tests", value: "testcontainers" },
    ],
  },
  {
    label: "/* plugins */",
    title: "gRPC, out of process",
    color: "orange",
    body:
      "Plugins are self-contained Go binaries that speak protobuf to the host over a local gRPC socket. Out-of-process means a misbehaving plugin can crash or be hot-reloaded without taking the host down. Capability families for metadata, analyzers, scheduled tasks, HTTP routes, and auth.",
    specs: [
      { label: "wire", value: "gRPC + protobuf" },
      { label: "SDK", value: "silo-plugin-sdk" },
      { label: "capabilities", value: "9 families" },
      { label: "1st-party", value: "TMDB · TVDB" },
    ],
  },
  {
    label: "/* scale */",
    title: "Cluster-aware by default",
    color: "multi",
    body:
      "One image, four modes. Run everything in a single container on a mini PC, or drop a transcode and proxy worker into every node of your Proxmox / K3s / Docker Swarm cluster. The pool balances streams across whichever workers are up.",
    specs: [
      { label: "modes", value: "integrated · api · proxy · transcode" },
      { label: "fits", value: "proxmox · k3s · bare metal" },
      { label: "scheduler", value: "least-connections" },
      { label: "health", value: "self-registering" },
    ],
  },
];
