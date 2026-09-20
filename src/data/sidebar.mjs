// Curated task order for the public manual. Articles stay in plain Markdown.
// Keep advanced groups collapsed so first-time readers can start with setup.
export const sidebar = [
  {
    "label": "Get started",
    "items": [
      {
        "slug": "docs"
      },
      {
        "slug": "docs/get-started/choose-an-app"
      },
      {
        "slug": "docs/get-started/join-a-server"
      },
      {
        "slug": "docs/get-started/tv-sign-in"
      },
      {
        "slug": "docs/get-started/installation-options"
      },
      {
        "slug": "docs/get-started/install-silo"
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
            "slug": "docs/using-silo/find-something"
          },
          {
            "slug": "docs/using-silo/home-and-calendar"
          },
          {
            "slug": "docs/using-silo/collections"
          },
          {
            "slug": "docs/using-silo/saved-titles"
          },
          {
            "slug": "docs/using-silo/requests"
          }
        ]
      },
      {
        "label": "Watch and listen",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/using-silo/watch-movies-and-series"
          },
          {
            "slug": "docs/using-silo/listen-to-audiobooks"
          },
          {
            "slug": "docs/using-silo/subtitles"
          },
          {
            "slug": "docs/using-silo/missing-subtitles"
          },
          {
            "slug": "docs/using-silo/downloads"
          },
          {
            "slug": "docs/using-silo/tv-remote"
          }
        ]
      },
      {
        "label": "Your household and preferences",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/using-silo/profiles"
          },
          {
            "slug": "docs/using-silo/preferences"
          },
          {
            "slug": "docs/using-silo/watch-history"
          },
          {
            "slug": "docs/using-silo/import-watch-history"
          },
          {
            "slug": "docs/using-silo/notifications"
          },
          {
            "slug": "docs/using-silo/accounts"
          }
        ]
      },
      {
        "label": "Other apps and playback limits",
        "collapsed": true,
        "items": [
          {
            "slug": "docs/using-silo/jellyfin-apps"
          },
          {
            "slug": "docs/using-silo/audiobookshelf-apps"
          },
          {
            "slug": "docs/using-silo/apple-tv-playback"
          },
          {
            "slug": "docs/using-silo/client-feature-reference"
          }
        ]
      }
    ]
  },
  {
    "label": "Running a server",
    "items": [
      {
        "slug": "docs/running-a-server/after-installation"
      },
      {
        "label": "Build your library",
        "items": [
          {
            "slug": "docs/running-a-server/libraries"
          },
          {
            "slug": "docs/running-a-server/media-folders"
          },
          {
            "slug": "docs/running-a-server/audiobook-libraries"
          },
          {
            "slug": "docs/running-a-server/metadata"
          },
          {
            "slug": "docs/running-a-server/local-metadata"
          },
          {
            "slug": "docs/running-a-server/collections"
          },
          {
            "slug": "docs/running-a-server/home-sections"
          },
          {
            "slug": "docs/running-a-server/recommendations"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Give people access",
        "items": [
          {
            "slug": "docs/running-a-server/accounts"
          },
          {
            "slug": "docs/running-a-server/access"
          },
          {
            "slug": "docs/running-a-server/help-a-user"
          },
          {
            "slug": "docs/running-a-server/active-playback"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Playback and providers",
        "items": [
          {
            "slug": "docs/running-a-server/plugins"
          },
          {
            "slug": "docs/running-a-server/playback"
          },
          {
            "slug": "docs/running-a-server/subtitle-providers"
          },
          {
            "slug": "docs/running-a-server/markers"
          },
          {
            "slug": "docs/running-a-server/ai-services"
          },
          {
            "slug": "docs/running-a-server/transcode-nodes"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Automations and integrations",
        "items": [
          {
            "slug": "docs/running-a-server/autoscan"
          },
          {
            "slug": "docs/running-a-server/requests"
          },
          {
            "slug": "docs/running-a-server/notifications"
          },
          {
            "slug": "docs/running-a-server/watch-history-import"
          },
          {
            "slug": "docs/running-a-server/watch-state-webhooks"
          },
          {
            "slug": "docs/running-a-server/integration-credentials"
          },
          {
            "slug": "docs/running-a-server/third-party-access"
          },
          {
            "slug": "docs/running-a-server/branding"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Maintain and recover",
        "items": [
          {
            "slug": "docs/running-a-server/backup-restore"
          },
          {
            "slug": "docs/running-a-server/updates"
          },
          {
            "slug": "docs/running-a-server/server-health"
          },
          {
            "slug": "docs/running-a-server/reverse-proxy"
          }
        ],
        "collapsed": true
      },
      {
        "label": "Deployment reference",
        "items": [
          {
            "slug": "docs/running-a-server/docker"
          },
          {
            "slug": "docs/running-a-server/configuration"
          },
          {
            "slug": "docs/running-a-server/s3-storage"
          },
          {
            "slug": "docs/running-a-server/logging"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "label": "Developers & integrations",
    "items": [
      {
        "slug": "docs/developers"
      },
      {
        "slug": "docs/developers/use-the-api"
      },
      {
        "slug": "docs/developers/api-reference"
      },
      {
        "slug": "docs/developers/build-a-plugin"
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
        "slug": "docs/help/privacy"
      },
      {
        "slug": "docs/help/report-a-problem"
      },
      {
        "slug": "docs/help/improve-the-docs"
      }
    ]
  }
];
