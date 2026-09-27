# First-pass feature coverage

This is a manuscript map, not acceptance evidence. Every milestone feature has a place in the manual; that does not mean every surface or operation is ready for release. Source review and executed checks are recorded in [the review summary](review-manual-integration.md).

The feature-to-guide map now lives in [`src/data/feature-guides.mjs`](../src/data/feature-guides.mjs). The public [What each app can do](../src/content/docs/docs/get-started/apps-and-features.mdx) page combines it with each feature's apps from the milestone page, and `bun run test:docs` fails when the milestone and the map disagree.

## Beyond the feature cards

- Movies and Series: installation, library setup, naming, metadata, playback, and progress guides.
- Audiobooks, ebooks, and Audiobookshelf compatibility are outside 1.0. Books is a consolidated later effort with no assigned release date; beta/reference guides are not 1.0 acceptance evidence.
- First-run and dependencies: install, configuration, Docker, and server-health guides.
- Recovery: backup inventory and update/bridge guidance exist; complete clean-host restore and exact release commands remain outstanding.
- Compatibility: client reference and installed-server API viewer guidance exist; centrally hosted versioned OpenAPI still needs implementation.
- Security and privacy: access, API keys, external services, and safe reporting instructions.
- Unraid: not drafted as supported without a validated release installation path.

Account-session revocation has no traced web UI in this snapshot. The guides explain actual controls and lost-device escalation instead of inventing a revoke button. Native surfaces and cross-platform compatibility still require hands-on tests. Check the client review report before marking a parent feature's public-documentation item complete.
