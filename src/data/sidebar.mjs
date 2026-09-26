// Curated task order for the public manual. Articles stay in plain Markdown.
// Top-level categories are static headings; only subgroups can collapse.
export const sidebar = [
  {
    "label": "Get started",
    "items": [
      {
        "slug": "docs"
      },
      {
        "slug": "docs/connect-and-watch"
      },
      {
        "slug": "docs/tv-sign-in"
      }
    ]
  },
  {
    "label": "Using Silo",
    "items": [
      {
        "label": "Find and organize",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/home-and-calendar"
          },
          {
            "slug": "docs/find-something"
          },
          {
            "slug": "docs/saved-titles"
          },
          {
            "slug": "docs/collections"
          },
          {
            "slug": "docs/requests"
          }
        ]
      },
      {
        "label": "Watch",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/watch-movies-and-series"
          },
          {
            "slug": "docs/subtitles"
          },
          {
            "slug": "docs/missing-subtitles"
          },
          {
            "slug": "docs/tv-remote"
          },
          {
            "slug": "docs/downloads"
          },
          {
            "slug": "docs/browser-downloads"
          }
        ]
      },
      {
        "label": "Your account and preferences",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/accounts"
          },
          {
            "slug": "docs/profiles"
          },
          {
            "slug": "docs/preferences"
          },
          {
            "slug": "docs/watch-history"
          },
          {
            "slug": "docs/import-watch-history"
          },
          {
            "slug": "docs/notification-inbox"
          }
        ]
      },
      {
        "label": "App support and compatibility",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/choose-an-app"
          },
          {
            "slug": "docs/client-feature-reference"
          },
          {
            "slug": "docs/apple-tv-playback"
          },
          {
            "slug": "docs/jellyfin-apps"
          }
        ]
      }
    ]
  },
  {
    "label": "Running a server",
    "items": [
      {
        "slug": "docs/install-silo-server"
      },
      {
        "slug": "docs/requirements"
      },
      {
        "label": "Build your library",
        "items": [
          {
            "slug": "docs/media-folders"
          },
          {
            "slug": "docs/manage-libraries"
          },
          {
            "slug": "docs/metadata"
          },
          {
            "slug": "docs/local-metadata"
          },
          {
            "slug": "docs/autoscan"
          },
          {
            "slug": "docs/manage-collections"
          },
          {
            "slug": "docs/home-sections"
          },
          {
            "slug": "docs/recommendations"
          },
          {
            "slug": "docs/branding"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Give people access",
        "items": [
          {
            "slug": "docs/manage-accounts"
          },
          {
            "slug": "docs/manage-access"
          },
          {
            "slug": "docs/reverse-proxy"
          },
          {
            "slug": "docs/third-party-access"
          },
          {
            "slug": "docs/help-a-user"
          },
          {
            "slug": "docs/active-playback"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Playback and providers",
        "items": [
          {
            "slug": "docs/plugins"
          },
          {
            "slug": "docs/playback"
          },
          {
            "slug": "docs/transcode-nodes"
          },
          {
            "slug": "docs/subtitle-providers"
          },
          {
            "slug": "docs/markers"
          },
          {
            "slug": "docs/ai-services"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Automations and integrations",
        "items": [
          {
            "slug": "docs/integration-credentials"
          },
          {
            "slug": "docs/manage-requests"
          },
          {
            "slug": "docs/notification-delivery"
          },
          {
            "slug": "docs/import-household-watch-history"
          },
          {
            "slug": "docs/watch-state-webhooks"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Maintain and recover",
        "items": [
          {
            "slug": "docs/backup-restore"
          },
          {
            "slug": "docs/updates"
          },
          {
            "slug": "docs/server-health"
          },
          {
            "slug": "docs/logging"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Deployment reference",
        "items": [
          {
            "slug": "docs/docker"
          },
          {
            "slug": "docs/configuration"
          },
          {
            "slug": "docs/s3-storage"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "label": "Beta",
    "items": [
      { "slug": "docs/beta" },
      {
        "label": "Listening and reading",
        "collapsed": true,
        "items": [
          { "slug": "docs/listen-to-audiobooks" },
          { "slug": "docs/audiobook-libraries" },
          { "slug": "docs/audiobookshelf" },
          { "slug": "docs/ebooks" }
        ]
      },
      {
        "label": "Watching and personal settings",
        "collapsed": true,
        "items": [
          { "slug": "docs/versions-and-previews" },
          { "slug": "docs/watch-together" },
          { "slug": "docs/watch-sync" },
          { "slug": "docs/native-inboxes" },
          { "slug": "docs/custom-themes" }
        ]
      },
      {
        "label": "Administration and additional clients",
        "collapsed": true,
        "items": [
          { "slug": "docs/catalog-seeds" },
          { "slug": "docs/native-macos" }
        ]
      },
      { "slug": "docs/unfinished-features" }
    ]
  },
  {
    "label": "Developers & integrations",
    "items": [
      {
        "slug": "docs/developers"
      },
      {
        "slug": "docs/use-the-api"
      },
      {
        "slug": "docs/api-reference"
      },
      {
        "slug": "docs/build-a-plugin"
      }
    ]
  },
  {
    "label": "Help & contribute",
    "items": [
      {
        "slug": "docs/help"
      },
      {
        "slug": "docs/report-a-problem"
      },
      {
        "slug": "docs/privacy"
      },
      {
        "slug": "docs/improve-the-docs"
      }
    ]
  }
];
