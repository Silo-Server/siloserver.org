// Preserve published documentation URLs after moving pages by audience.
// src/pages/docs/[...legacy].astro emits static redirects for GitHub Pages
// and preserves query strings and section anchors in JavaScript-enabled browsers.
export const docsRedirects = {
  "/docs/clients": "/docs/get-started/choose-an-app",
  "/docs/installation": "/docs/get-started/installation-options",
  "/docs/quickstart": "/docs/get-started/install-silo",
  "/docs/first-configuration": "/docs/running-a-server/after-installation",
  "/docs/deployment/docker": "/docs/running-a-server/docker",
  "/docs/deployment/reverse-proxy": "/docs/running-a-server/reverse-proxy",
  "/docs/libraries": "/docs/running-a-server/media-folders",
  "/docs/audiobooks": "/docs/running-a-server/audiobook-libraries",
  "/docs/configuration": "/docs/running-a-server/configuration",
  "/docs/logging": "/docs/running-a-server/logging",
  "/docs/storage/s3": "/docs/running-a-server/s3-storage",
  "/docs/ai-services": "/docs/running-a-server/ai-services",
  "/docs/notifications": "/docs/running-a-server/notifications",
  "/docs/integrations/autoscan": "/docs/running-a-server/autoscan",
  "/docs/jellyfin-compatibility": "/docs/using-silo/jellyfin-apps",
  "/docs/audiobookshelf-compatibility": "/docs/using-silo/audiobookshelf-apps",
  "/docs/apple-tv": "/docs/using-silo/apple-tv-playback",
  "/docs/feature-parity": "/docs/using-silo/client-feature-reference",
  "/docs/troubleshooting": "/docs/help/report-a-problem",
};
