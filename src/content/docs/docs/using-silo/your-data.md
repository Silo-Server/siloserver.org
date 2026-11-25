---
slug: docs/your-data
keywords: ["download my data", "watch history export", "transfer profile", "JSON file", "move my profile"]
questions: ["Can I download my watch history?", "How do I move my profile to another Silo server?", "Will importing overwrite my progress?"]
title: Export and import your data
description: Download a profile's watch history, ratings, and lists as a file, and merge it into a profile on this server or another.
---

In the web app, open **Settings > Your Data** to save a copy of the profile you're using, or to merge a saved copy back in. It works one profile at a time, and you can import into a profile on another Silo server.

## Export your data

Select **Export my data**. Silo downloads a `.json` file with this profile's:

- watch history and progress
- ratings
- favorites and watchlist
- personal collections
- dismissed and "not interested" titles
- playback and display preferences, and notification preferences

The file holds no password, PIN, or account details. It includes only what the profile can see now, so titles in libraries it can't open, or above its [content rating limit](/docs/profiles), are left out.

## Import a file

1. Switch to the profile that should receive the data.
2. Under **Import data**, select **Choose an export file** and pick a file from **Export my data**.

The import merges the file into the profile. Newer progress wins, missing entries are added, and preferences are replaced. Nothing is deleted, and importing the same file twice changes nothing. It never changes account or access settings.

When it finishes, Silo lists what it added. Titles that aren't in this server's library, or that the profile isn't allowed to see, are left out and listed.

If the profile has a PIN, Silo asks for it before an export or import. Only one export or import runs at a time for an account. If another is running, wait for it to finish and try again.
