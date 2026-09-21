// One shared baseline for the current manual, not a versioned URL namespace.
// Record the website Git revision in the release record when publishing a release.
export const docsRelease = {
  channel: 'prerelease',
  release: null,
  targetRelease: '1.0',
  sourceReviewedAt: '2026-09-20',
  sources: [
    { label: 'Server and web', repo: 'silo-server', revision: 'd2596927e822c04f0e0e7017654e1369c4c3aa3f' },
    { label: 'Apple', repo: 'silo-apple', revision: 'c23903c015632685f7a654d9461391f8d5a6880d' },
    { label: 'Android', repo: 'silo-android', revision: '3993d2b1277d59b3b323f634f7b58c6ee9a4969b' },
  ],
};
