# First-pass manual review

## Scope and evidence

This pass uses the 1.0 milestone as the topic boundary and current `main`
as the source for instructions, as requested by the maintainer. It replaces
old prose where needed. It does not certify the milestone or publish a
supported 1.0 release manual.

| Source | Revision |
| --- | --- |
| Website starting point | `ee566d21a3127d567d966563dcd9949c24169472` |
| Server and web | `d2596927e822c04f0e0e7017654e1369c4c3aa3f` |
| Apple | `c23903c015632685f7a654d9461391f8d5a6880d` |
| Android | `3993d2b1277d59b3b323f634f7b58c6ee9a4969b` |
| Plugin SDK example | `9bb04f1125a4780ca520fdaa7ce6c00fc7c0f42f` |

The published milestone was fetched directly. The updated HTML content plan
and its Markdown source guided the article inventory. Source snapshots were
checked out separately; existing server and native-client working changes
were not used as evidence or modified.

Three agents drafted client, server-foundation, and admin-feature guides.
Each reviewed source, applied the Humanizer, and kept evidence outside the
public manual. Cross-review paired client with server setup, server setup
with admin features, and admin features with help/developer material. The
integrating agent reviewed the combined navigation and client instructions.

A fresh fourth reviewer read all 70 navigable guides and the retained ebook
page. It found four usability/safety issues: a missing manual server-address
step for TV setup, an overlay download that could overwrite a customized file,
a GPU file-list example that could omit existing Compose overrides, and an
Audiobookshelf PIN limitation missing from the administrator's enablement
guide. All four were corrected. The reviewer rated AI texture 3/10 and found
no need for another broad stylistic rewrite or a new skill pattern.

Detailed records:

- [Second adversarial review and corrections](review-manual-adversarial-second.md).
- [All 35 feature destinations](manual-feature-coverage.md).
- [Client guides](review-client-manual.md).
- [Server setup and operations](review-server-foundations.md).
- [Admin features](review-admin-features.md).

Screenshots were explicitly excluded from this pass. No feature validation
issue, acceptance record, or GitHub project was changed. The existing draft
PR was not updated with these uncommitted changes.

## Evidence for help and developer pages

Paths below belong to the revisions listed above. They record source review,
not completed end-to-end walkthroughs.

| Pages | Evidence and bounds |
| --- | --- |
| Home and help index | Task order from S01-S04 and H01; links lead to the actual guide rather than backend reference. Connection checks distinguish address, authentication, profile access, and LAN discovery. |
| Help: report a problem; privacy | Apple `Screens/Settings/DiagnosticsSettingsView.swift`, `Shared/Diagnostics/DiagnosticsPrompt.swift`, `Shared/Diagnostics/DiagnosticsViewModel.swift`; Android `ui/screens/settings/diagnostics/DiagnosticsSettingsScreen.kt` and report screen. Apple manual send builds and uploads directly; Android separates capture/review from sending. The second review corrected the shared sequence and Ask-setting wording. Native devices and remote diagnostic services were not exercised. |
| Help: server logs | Server Compose service names and `internal/diagnostics/settings.go`, `internal/diagnostics/service.go`; source-reviewed startup/runtime log boundaries. Commands were not run against a live server. |
| Use the API; API reference | Server `internal/apiv2/docs.go`, `docsui/init.js`, `user_libraries.go`, `capability.go`, `docs/api-docs.md`, `docs/api-keys-api.md`; reviewed viewer authorization, local schema path, optional profile headers, permissions, cursors, and non-retryable credential creation. |
| API key example | Admin `AdminApiKeys.tsx` sends label and owner without a scope chooser. The tutorial uses a non-admin test account and explains unscoped access. It does not promise a nonexistent scope selector or claim that personal API creation is admin-only. |
| Build a plugin | SDK README and `examples/hello-scheduled-task/{README.md,main.go,manifest.json}`; server `internal/plugins/task_registry.go` and `web/src/pages/AdminTasks.tsx`. Example compiled on macOS ARM64 and its manifest command ran successfully. Host installation and task execution remain untested. |
| Contribute and repository map | Current website contribution policy, existing preview architecture, SDK owner map, and repository responsibilities. No workflow changes made. |

## Checks performed centrally

- The SDK example compiled and emitted `example.hello-task`, version `0.1.0`,
  capability `scheduled_task.v1`, and target `darwin/arm64`.
- Focused API handler tests were attempted but could not compile because
  local `libvips` was missing. This is not a passing API test.
- Docker was installed but its local daemon socket was absent. No server
  install, restore, playback, GPU, external delivery, or native device test
  is claimed from that environment.
- Existing web UI tests used an isolated source checkout and locked
  dependencies. They use fixtures/mocks, not a live server. Per-suite results
  are in the agent records.
- The three drafting passes report 199 foundation, 213 admin, and 50 client
  UI tests passing across 7, 25, and 8 files respectively. Naming, telemetry,
  and log-redaction Go packages also passed. The API/NFO package limitation
  above remains; passing adjacent packages does not resolve it.
- The website build, link validation, and navigation checks verify the
  manual as a website; they do not verify the server procedures.
- The integrated build passed with all internal links and current anchors
  valid. All 70 sidebar pages returned HTTP 200 with readable main content
  and no page-level horizontal overflow at 390 pixels. Mobile keyboard
  navigation, a desktop install-page check, and all 19 legacy URL redirects
  passed. Redirects preserve the supplied fragment but do not guarantee that
  a heading removed in this rewrite still exists.

## Humanizer review

**Detected as:** technical documentation, using the skill's Blog Post
fallback for structured prose. The maintainer supplied the voice: brief,
direct instructions for first-time users and administrators. Procedural
lists, exact UI labels, protocol names, and safety distinctions are retained.
Marketing hooks, invented personal stories, and artificial closing questions
would make these guides worse, so they were not added.

### Assessment and scores

The help pages now start with observable failures and a next action. Developer
pages lead to a concrete read-only request or a working example rather than
an unexplained repository list. Scores are editorial judgments, not AI
detection measurements or product-validation results.

| Dimension | Score | Reason |
| --- | --- | --- |
| AI-likeness | 2/10 | No stock hooks, inflated claims, decorative cadence, or em dashes in public prose. |
| Authenticity | 8/10 | Direct advice addresses the person doing the task without pretending to have personal experience. |
| Reader value | 8/10 | Named controls, examples, expected responses, and targeted next steps are usable. |
| Domain credibility | 8/10 | Specific instructions have source evidence; unavailable runtime tests are identified separately. |

### Flags and revisions

| Location | Original phrase or structure | Revision |
| --- | --- | --- |
| Old report introduction | “Good issue reports start with the user workflow and exact reproduction steps.” | Replaced the general maxim with where to get help and what to collect. |
| Old report body | Template followed by a near-duplicate eight-item list | One short copyable template, then only added context. |
| Old developer introduction | “Use these resources when building something that works with Silo.” | Replaced with links for the reader's API, plugin, or contribution task. |
| Initial plugin draft | “Follow the example's task behavior” | Named Scheduled Tasks, Hello Task, Run Now, and the expected result. |
| Initial plugin draft | “review its manifest and permissions before allowing it to run” after upload | Moved trust review before upload because manifest inspection can execute the binary. |
| Initial API draft | Requested a scoped key through the web form | Corrected to a test-account key and explained the missing scope UI. |

Originality review found no need for personal anecdotes: a useful technical
guide needs reproducible actions, not an author's story. The biggest risks
were generic references replacing instructions and source-only observations
being mistaken for runtime evidence. Those are called out in the records.

The three main editorial changes were to start with the user's action,
remove duplicate explanations, and replace vague verification instructions
with observable outcomes. Full rewrites are the public Markdown files.

### Skill update

- [x] No new patterns found. The observed filler, vague instructions, and
  duplicated structure are covered by the existing skill. No skill file changed.

## Publication boundaries

The backup page is an inventory and isolated recovery checklist, not a proven
restore recipe. The 1.0 upgrade page waits for named bridge/release instructions.
The API reference page points to the installed server; the milestone's
centrally published, release-versioned OpenAPI artifact remains outstanding.
Unraid remains outside this pass because no supported deployment was tested.

Review account-session revocation, compatibility profile protection, native
surface gaps, and other source/spec mismatches in the agent records before
marking those feature documentation checks complete. These gaps are not
resolved by publishing a page or adding a documentation link to an issue.
