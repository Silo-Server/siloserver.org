export const meta = {
  name: 'docs-accuracy',
  description: 'Fact-check the silo-website docs against the real silo-server source, then apply only independently-verified fixes on a new branch',
  whenToUse: 'Run after silo-server changes to catch documentation drift. Verifies every claim against source and refuses to apply any "correction" that is not independently confirmed.',
  phases: [
    { title: 'Discover', detail: 'enumerate doc/data/readme targets + pin the silo-server commit' },
    { title: 'Verify', detail: 'extract claims per file and adjudicate each against silo-server source' },
    { title: 'Recheck', detail: 'independent adversarial re-check of every proposed change' },
    { title: 'Apply', detail: 'exact-string edits, astro build gate, branch + commit, PR body' },
  ],
}

// ---------------------------------------------------------------------------
// Config (override any field via Workflow `args`)
// ---------------------------------------------------------------------------
const cfg = {
  websiteRepo: (args && args.websiteRepo) || '/opt/dev/github/SiloServer/silo-website',
  serverRepo: (args && args.serverRepo) || '/opt/dev/github/SiloServer/silo-server',
  siblingsDir: (args && args.siblingsDir) || '/opt/dev/github/SiloServer',
  scope: (args && args.scope) || { docs: true, data: true, readme: true },
  outputMode: (args && args.outputMode) || 'branch', // 'branch' | 'apply' | 'report'
  branch: (args && args.branch) || 'docs/accuracy-audit',
}

// ---------------------------------------------------------------------------
// Schemas (force structured, validated agent output)
// ---------------------------------------------------------------------------
const DISCOVER_SCHEMA = {
  type: 'object',
  required: ['docFiles', 'dataFiles', 'readmeFiles', 'serverCommit'],
  additionalProperties: true,
  properties: {
    docFiles: {
      type: 'array',
      items: {
        type: 'object', required: ['path'], additionalProperties: true,
        properties: { path: { type: 'string' }, slug: { type: 'string' } },
      },
    },
    dataFiles: { type: 'array', items: { type: 'string' } },
    readmeFiles: { type: 'array', items: { type: 'string' } },
    serverCommit: { type: 'string' },
    serverDate: { type: 'string' },
    baseBranch: { type: 'string' },
    repoMap: { type: 'string', description: 'free-text note of where major topics live in the server repo' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['path', 'claims'],
  additionalProperties: true,
  properties: {
    path: { type: 'string' },
    type: { type: 'string' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'text', 'verdict'],
        additionalProperties: true,
        properties: {
          id: { type: 'string' },
          text: { type: 'string', description: 'VERBATIM excerpt copied exactly from the file; usable as an exact search string' },
          docLocation: { type: 'string' },
          existingCitation: { type: 'string' },
          verdict: { type: 'string', enum: ['SUPPORTED', 'CONTRADICTED', 'OUTDATED_CITATION', 'UNVERIFIABLE'] },
          evidence: { type: 'string', description: 'silo-server file:line + quoted snippet proving the verdict' },
          proposedFix: { type: 'string', description: 'exact replacement for `text`; only for CONTRADICTED/OUTDATED_CITATION; must be source-backed' },
          confidence: { type: 'number' },
        },
      },
    },
  },
}

const RECHECK_SCHEMA = {
  type: 'object',
  required: ['claimId', 'originalVerdictHolds', 'fixIsSourceBacked', 'reason'],
  additionalProperties: true,
  properties: {
    claimId: { type: 'string' },
    originalVerdictHolds: { type: 'boolean', description: 'true ONLY if you independently confirmed the current doc text is factually wrong' },
    fixIsSourceBacked: { type: 'boolean', description: 'true ONLY if you independently found source supporting the proposed replacement' },
    reason: { type: 'string', description: 'the exact file:line you inspected and what it says' },
    correctedFix: { type: 'string', description: 'optional better replacement if the proposed one was close but imperfect' },
  },
}

const APPLY_SCHEMA = {
  type: 'object',
  required: ['path', 'applied', 'failed'],
  additionalProperties: true,
  properties: {
    path: { type: 'string' },
    applied: { type: 'array', items: { type: 'object', additionalProperties: true } },
    failed: { type: 'array', items: { type: 'object', additionalProperties: true } },
  },
}

const FINALIZE_SCHEMA = {
  type: 'object',
  required: ['built', 'committed'],
  additionalProperties: true,
  properties: {
    built: { type: 'boolean' },
    buildError: { type: 'string' },
    committed: { type: 'boolean' },
    branch: { type: 'string' },
    sha: { type: 'string' },
    baseBranch: { type: 'string' },
    notes: { type: 'string' },
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function short(p) { const a = String(p).split('/'); return a.slice(-2).join('/') }
function oneLine(s) { return String(s || '').replace(/\s+/g, ' ').trim() }
function codeInline(s) { return '`' + oneLine(s).slice(0, 300).replace(/`/g, "'") + '`' }

function serverHints(c) {
  return `Where to find ground truth in the silo-server repo (paths relative to ${c.serverRepo}):
- Versions / toolchain: go.mod (Go version), web/package.json (Bun, React, frontend deps), Dockerfile, docker-compose*.yml, README.md
- Env vars, server MODE/modes, ports: internal/config/**, cmd/silo/**, docker-compose*.yml, README.md
- Library scanning, naming patterns, provider IDs (TMDB/IMDB/TVDB), editions: internal/scanner/**, internal/naming/**, internal/catalog/**, internal/metadata/**
- S3 / object storage (buckets, fields, auth methods): internal/s3client/**, internal/config/**, and admin UI web/src/pages/admin-settings/StorageSettings.tsx + web/src/pages/setup-wizard/**
- Jellyfin compatibility (endpoints, port 8096): internal/jellycompat/**
- Autoscan integration: internal/jellycompat/** and internal/scantrigger/** (grep "autoscan")
- Admin UI tabs/settings (General, Theming, Playback, Scanner, Storage, etc.): web/src/pages/admin-settings/**
- Docker deployment, images, profiles: docker-compose.yml, docker-compose.dev.yml, Dockerfile, README.md
- Reverse proxy ports/paths: internal/config/**, docker-compose.yml, README.md
- The server repo also has its own docs/ (feature-changelog.md, s3-storage-setup.md, scan-api.md) — useful corroboration, but prefer real CODE over prose.
- Native client claims (Apple/Android): sibling repos ${c.siblingsDir}/silo-apple and ${c.siblingsDir}/silo-android
- Plugins: sibling repos ${c.siblingsDir}/silo-plugin-*
Use ripgrep to locate exact symbols/strings, open the files, and cite a real file:line. Use each repo's working tree as it is on disk.`
}

function discoverPrompt(c) {
  return `You are scoping a documentation accuracy audit for the Silo media server. Read-only — modify nothing.

Website (docs) repo: ${c.websiteRepo}
Server (source of truth) repo: ${c.serverRepo}
Sibling repos dir: ${c.siblingsDir}

Do the following and return structured output:
1. List documentation targets in the website repo:
   - docFiles: run \`find ${c.websiteRepo}/src/content/docs -name '*.md' -o -name '*.mdx'\`. For each, return its absolute "path" and its Starlight "slug" (the path under src/content/docs/ without the extension).
   - dataFiles: \`ls ${c.websiteRepo}/src/data/*.ts\` (homepage marketing copy) — absolute paths.
   - readmeFiles: the repo root README, i.e. ${c.websiteRepo}/README.md if it exists.
2. Pin the server: in ${c.serverRepo} run \`git rev-parse --short HEAD\` (serverCommit) and \`git log -1 --format=%cs\` (serverDate).
3. baseBranch: \`git -C ${c.websiteRepo} rev-parse --abbrev-ref HEAD\`.
4. repoMap: a short free-text note confirming where major topics live in ${c.serverRepo} — list \`ls internal/\`, the Go version from \`head -5 go.mod\`, whether docker-compose*.yml / Dockerfile / web/package.json exist, the top-level dirs of web/src, the contents of the server repo's docs/ dir, and which sibling client/plugin repos exist under ${c.siblingsDir}.

Only include files that actually exist. Return absolute paths.`
}

function verifyPrompt(t, d, c) {
  const dataNote = t.type === 'data'
    ? '(This is homepage marketing copy in a .ts data file. Extract only user-facing FACTUAL assertions: feature availability, supported clients/formats, version numbers, "what is broken/works" lists, infrastructure claims. Ignore imports, styling, TypeScript types, and implementation detail.)'
    : ''
  return `You are fact-checking ONE documentation file for the Silo media server against the ACTUAL source code. Be rigorous and conservative. Modify nothing.

TARGET FILE (read it fully first): ${t.path}
FILE TYPE: ${t.type} ${dataNote}

SOURCE OF TRUTH: the silo-server repo at ${c.serverRepo} (Go backend + React admin UI under web/src), pinned at commit ${d.serverCommit || 'HEAD'}. Some claims (native clients, plugins) live in sibling repos under ${c.siblingsDir}.

${serverHints(c)}

TASK:
1. Extract EVERY discrete, checkable factual claim the file makes about Silo (requirements, versions, env vars, ports, features, behaviors, supported clients/formats, naming conventions, S3 fields, endpoints, admin settings, etc.). Be exhaustive. Each claim's "text" MUST be a VERBATIM, contiguous excerpt copied EXACTLY from the file (preserve wording, punctuation, capitalization, whitespace) — prefer a single complete line or sentence that is UNIQUE in the file, so it can be used as an exact search-and-replace string.
2. If the file is a doc page with a "Source notes"/citations section, record each claim's existingCitation.
3. Independently verify each claim against the source: run ripgrep, open the real files, read them.
4. Assign a verdict:
   - SUPPORTED — source confirms it. Put the proving file:line + a short quoted snippet in "evidence".
   - CONTRADICTED — source shows the claim is wrong (wrong value/behavior, or a feature that does not exist / was removed). Put the correct value + proving file:line in "evidence", and provide "proposedFix": the EXACT drop-in replacement for "text" (same markdown/format), backed by that evidence.
   - OUTDATED_CITATION — the claim's own cited file/line-range no longer matches source. Put the corrected reference in "evidence"; provide "proposedFix" ONLY if the prose itself is now factually wrong.
   - UNVERIFIABLE — you found neither supporting nor contradicting evidence in the available repos. Do NOT propose a fix. Do NOT guess.
5. CONSERVATISM RULES (critical — we must NOT introduce new errors):
   - Only mark CONTRADICTED when you have concrete evidence from a real file:line you actually opened. When in doubt, use UNVERIFIABLE.
   - Never propose deleting content unless source positively proves the feature/behavior does not exist. (Note: a Go package existing is not proof a UI tab exists, and vice-versa — match the claim to the right layer.)
   - Every proposedFix MUST be supported by the same "evidence" you cite. No speculation.
   - Do not flag style, tone, wording, or opinion — only factual accuracy.

Set "path" to "${t.path}" and "type" to "${t.type}". Return the structured result.`
}

function recheckPrompt(claim, t, c) {
  return `You are an ADVERSARIAL reviewer. An automated verifier claims a documentation statement is INACCURATE and wants to change it. Assume the verifier is WRONG until you independently prove otherwise. Try to REFUTE the change. Read-only — modify nothing.

DOC FILE: ${t.path}
CURRENT DOC STATEMENT:
"""${claim.text}"""
VERIFIER VERDICT: ${claim.verdict}
VERIFIER EVIDENCE: ${claim.evidence || '(none given)'}
PROPOSED REPLACEMENT:
"""${claim.proposedFix || '(none)'}"""

Do NOT trust the verifier's citation. Open the silo-server source YOURSELF (${c.serverRepo}; siblings under ${c.siblingsDir}) and check independently.
${serverHints(c)}

Decide:
- originalVerdictHolds: TRUE only if you INDEPENDENTLY confirm the current doc statement is genuinely factually wrong/outdated. If it is defensible, or you cannot confirm it is wrong, set FALSE.
- fixIsSourceBacked: TRUE only if you INDEPENDENTLY found source (cite file:line) supporting the PROPOSED replacement text. If unsupported or unconfirmable, set FALSE.
- reason: cite the exact file:line you inspected and what it says.
- correctedFix (optional): if the original is wrong but the proposed replacement is slightly off, supply a better source-backed replacement for the doc statement.

A change is applied ONLY if BOTH originalVerdictHolds AND fixIsSourceBacked are TRUE. Default to FALSE when uncertain — leaving a questionable statement for a human is far better than introducing a wrong "correction". claimId is "${claim.id}".`
}

function applyFilePrompt(r, c) {
  const edits = r.confirmed.map((e, i) =>
    `EDIT ${i + 1}:\nOLD (exact substring to find):\n"""${e.old}"""\nNEW (replacement):\n"""${e.new}"""\n(source: ${oneLine(e.citation) || 'verified'})`
  ).join('\n\n')
  return `Apply these ${r.confirmed.length} verified correction(s) to a SINGLE file. Make ONLY these changes — touch nothing else.

FILE: ${r.path}

${edits}

For each edit: find the OLD text as an EXACT substring and replace it with NEW. If an OLD string does not match exactly (whitespace/wording drift), DO NOT force or approximate it — record it under "failed" with the reason. Verify each replacement landed. Return {path:"${r.path}", applied:[{old,new}...], failed:[{old,reason}...]}.`
}

function finalizePrompt(c, changedPaths, commitMessage) {
  return `Documentation corrections have been applied to the working tree of ${c.websiteRepo}. Finalize the change.

1. BUILD CHECK: run \`cd ${c.websiteRepo} && bun run build\` (node_modules is already installed — do NOT reinstall). Capture success/failure and any error output.
   - src/data/releases.ts fetches GitHub release versions at build time and may fail offline; per the project README the build is designed to tolerate that. So if the build fails, classify the cause:
     * Caused by one of the CHANGED files (markdown/MDX syntax, bad frontmatter) -> OUR fault: set built=false, do NOT commit, report which file + the error.
     * Unrelated (network / GitHub API / rate limit) -> set built=true, record it in "notes", and continue.

2. COMMIT (only if built is true):
   - baseBranch: \`git -C ${c.websiteRepo} rev-parse --abbrev-ref HEAD\`.
   - Create/switch to "${c.branch}": \`git -C ${c.websiteRepo} checkout -b ${c.branch}\`; if it already exists, \`git -C ${c.websiteRepo} checkout ${c.branch}\`.
   - Stage ONLY these files (do NOT use \`git add -A\`; never stage anything under .claude/ or any report file):
${changedPaths.map((p) => '       ' + p).join('\n')}
   - Commit with EXACTLY this message (preserve every line, including the trailer):
-----
${commitMessage}
-----
   - Capture the short SHA: \`git -C ${c.websiteRepo} rev-parse --short HEAD\`.
   - Do NOT push. Do NOT open a pull request.

Return {built, buildError, committed, branch:"${c.branch}", sha, baseBranch, notes}.`
}

function buildReport(results, c, d) {
  const withFixes = results.filter((r) => r.confirmed && r.confirmed.length)
  const totalFixes = withFixes.reduce((n, r) => n + r.confirmed.length, 0)
  const flaggedAll = results.flatMap((r) => (r.flagged || []).map((f) => ({ path: r.path, ...f })))
  let md = `# Documentation accuracy audit\n\n`
  md += `Verified the docs against \`silo-server@${d.serverCommit || 'HEAD'}\`${d.serverDate ? ' (' + d.serverDate + ')' : ''}.\n\n`
  md += `- Files audited: **${results.length}**\n`
  md += `- Corrections applied: **${totalFixes}** across **${withFixes.length}** file(s)\n`
  md += `- Items flagged for human review: **${flaggedAll.length}**\n\n`
  md += `Every applied correction was (1) found by a verifier citing a specific \`silo-server\` source line and (2) independently confirmed by a second adversarial reviewer. Anything that could not be independently confirmed was left **unchanged** and flagged below, never edited.\n\n`
  if (totalFixes) {
    md += `## Corrections applied\n\n`
    for (const r of withFixes) {
      md += `### \`${short(r.path)}\`\n\n`
      for (const e of r.confirmed) {
        md += `- **${e.verdict}** — ${e.citation ? codeInline(e.citation) : 'verified against source'}\n`
        md += `  - before: ${codeInline(e.old)}\n`
        md += `  - after: ${codeInline(e.new)}\n`
      }
      md += `\n`
    }
  }
  if (flaggedAll.length) {
    md += `## Flagged for human review (NOT auto-changed)\n\n`
    md += `These statements could not be independently confirmed against source. Review manually.\n\n`
    for (const f of flaggedAll) {
      md += `- \`${short(f.path)}\` — _${f.verdict}_: ${codeInline(f.text)}\n`
      if (f.reason) md += `  - ${oneLine(f.reason)}\n`
    }
    md += `\n`
  }
  md += `---\n_Generated by the \`docs-accuracy\` workflow._\n`
  return md
}

// ---------------------------------------------------------------------------
// 1. Discover
// ---------------------------------------------------------------------------
phase('Discover')
const discovery = await agent(discoverPrompt(cfg), { label: 'discover', phase: 'Discover', schema: DISCOVER_SCHEMA })

const targets = []
if (cfg.scope.docs) for (const f of discovery.docFiles || []) targets.push({ type: 'doc', path: f.path, slug: f.slug })
if (cfg.scope.data) for (const p of discovery.dataFiles || []) targets.push({ type: 'data', path: p })
if (cfg.scope.readme) for (const p of discovery.readmeFiles || []) targets.push({ type: 'readme', path: p })

log(`Auditing ${targets.length} files against silo-server@${discovery.serverCommit || 'HEAD'} (base branch: ${discovery.baseBranch || '?'})`)

// ---------------------------------------------------------------------------
// 2-3. Verify -> Recheck  (pipelined per file; no barrier between stages)
// ---------------------------------------------------------------------------
const perFile = await pipeline(
  targets,
  // Stage A: extract + verify claims for one file
  (t) => agent(verifyPrompt(t, discovery, cfg), { label: `verify:${short(t.path)}`, phase: 'Verify', schema: VERIFY_SCHEMA }),
  // Stage B: independently re-check every claim that would cause an edit
  async (vr, t) => {
    if (!vr) return null
    const claims = vr.claims || []
    const toRecheck = claims.filter((cl) => cl.verdict === 'CONTRADICTED' || cl.verdict === 'OUTDATED_CITATION')

    const verdicts = toRecheck.length
      ? await parallel(toRecheck.map((cl) => () =>
          agent(recheckPrompt(cl, t, cfg), { label: `recheck:${short(t.path)}#${cl.id}`, phase: 'Recheck', schema: RECHECK_SCHEMA })
            .then((v) => ({ claim: cl, v }))
        ))
      : []

    const recheckById = new Map(verdicts.filter(Boolean).map((x) => [x.claim.id, x.v]))

    const confirmed = verdicts
      .filter(Boolean)
      .filter((x) => x.v && x.v.originalVerdictHolds === true && x.v.fixIsSourceBacked === true)
      .map((x) => ({
        id: x.claim.id,
        verdict: x.claim.verdict,
        old: x.claim.text,
        new: (x.v.correctedFix && oneLine(x.v.correctedFix)) ? x.v.correctedFix : x.claim.proposedFix,
        citation: x.claim.evidence,
      }))
      .filter((e) => e.old && e.new && e.old !== e.new)

    const flagged = claims
      .filter((cl) => {
        if (cl.verdict === 'UNVERIFIABLE') return true
        if (cl.verdict === 'CONTRADICTED' || cl.verdict === 'OUTDATED_CITATION') {
          const v = recheckById.get(cl.id)
          return !(v && v.originalVerdictHolds === true && v.fixIsSourceBacked === true)
        }
        return false
      })
      .map((cl) => ({
        id: cl.id,
        text: cl.text,
        verdict: cl.verdict,
        reason: (recheckById.get(cl.id) || {}).reason || cl.evidence || 'no corroborating source found',
      }))

    return { path: t.path, type: t.type, confirmed, flagged, claimCount: claims.length }
  }
)

const results = perFile.filter(Boolean)
const filesWithFixes = results.filter((r) => r.confirmed && r.confirmed.length)
const changedPaths = filesWithFixes.map((r) => r.path)
const totalFixes = filesWithFixes.reduce((n, r) => n + r.confirmed.length, 0)
const prBody = buildReport(results, cfg, discovery)

log(`Verified ${results.length} files: ${totalFixes} confirmed fix(es) in ${filesWithFixes.length} file(s); ${results.reduce((n, r) => n + (r.flagged ? r.flagged.length : 0), 0)} flagged for human review.`)

// ---------------------------------------------------------------------------
// 4. Apply (or report)
// ---------------------------------------------------------------------------
phase('Apply')

if (cfg.outputMode === 'report' || changedPaths.length === 0) {
  return {
    mode: changedPaths.length === 0 ? 'report (no confirmed fixes)' : 'report',
    serverCommit: discovery.serverCommit,
    filesAudited: results.length,
    totalFixes,
    changedPaths,
    prBody,
    results,
  }
}

// Apply edits — one agent per file (distinct files, safe to run in parallel)
const applied = await parallel(filesWithFixes.map((r) => () =>
  agent(applyFilePrompt(r, cfg), { label: `edit:${short(r.path)}`, phase: 'Apply', schema: APPLY_SCHEMA })
))

const commitMessage = `docs: correct inaccuracies found against silo-server@${discovery.serverCommit || 'HEAD'}

Automated documentation accuracy audit: every change was verified against the
silo-server source and confirmed by an independent adversarial recheck.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

// Finalize — single agent does the serial git work + build gate
const finalize = cfg.outputMode === 'branch'
  ? await agent(finalizePrompt(cfg, changedPaths, commitMessage), { label: 'build+commit', phase: 'Apply', schema: FINALIZE_SCHEMA })
  : null

return {
  mode: cfg.outputMode,
  serverCommit: discovery.serverCommit,
  branch: cfg.branch,
  baseBranch: discovery.baseBranch,
  filesAudited: results.length,
  totalFixes,
  changedPaths,
  applied,
  finalize,
  prBody,
  results,
}
