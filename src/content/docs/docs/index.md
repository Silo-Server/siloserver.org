---
title: Silo documentation
description: Start here for installing, configuring, and operating Silo.
---

Silo is a self-hosted media server with a Go backend, React frontend, PostgreSQL storage, and native clients.

These docs are intentionally source-controlled Markdown. Every page lives in this repository under `src/content/docs/docs/`, so changes can be reviewed in pull requests and deployed with the website.

## What to read first

- [Quickstart](/docs/quickstart) gets a fresh Docker Compose install running.
- [Installation](/docs/installation) explains the supported install paths.
- [First configuration](/docs/first-configuration) follows the setup wizard and the admin pages to review afterward.
- [Configuration](/docs/configuration) separates environment variables from admin-managed settings.
- [Libraries](/docs/libraries) documents the supported media path contract.
- [S3 storage](/docs/storage/s3) explains public asset and private internal buckets.
- [Autoscan](/docs/integrations/autoscan) shows how to connect Autoscan through Silo's Jellyfin-compatible target.
- [Clients](/docs/clients) describes the native and Jellyfin-compatible client options.

## Project status

Silo is pre-1.0. Expect the docs to evolve with the server and clients, and prefer linking to a focused page from pull requests when behavior changes.
