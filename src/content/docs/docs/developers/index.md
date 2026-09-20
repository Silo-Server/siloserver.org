---
title: Build with Silo
description: Start an API integration, build a plugin, or find the code repository for your change.
---

Choose the task you want to work on:

- [Make your first API request](/docs/developers/use-the-api) to read data from a server.
- [Open the API reference](/docs/developers/api-reference) for operation schemas and requirements.
- [Build a plugin](/docs/developers/build-a-plugin) to add a server capability.

To connect an existing player, use the
[Jellyfin](/docs/using-silo/jellyfin-apps) or
[Audiobookshelf](/docs/using-silo/audiobookshelf-apps) guide instead.

## Server and API

The [server repository](https://github.com/Silo-Server/silo-server) owns the
backend, web app, native API, and compatibility endpoints. Read its README
and contribution guide before changing code. Build and test instructions
stay there so they can change with the implementation.

## Plugins

The [SDK](https://github.com/Silo-Server/silo-plugin-sdk) owns the plugin
contract. Individual plugins own their provider behavior.
The [catalog](https://github.com/Silo-Server/silo-plugins) lists distributed
plugins; a catalog entry and a plugin binary are separate contributions.

## Native apps

Use [Silo Apple](https://github.com/Silo-Server/silo-apple) for iPhone, iPad,
and Apple TV changes, or [Silo Android](https://github.com/Silo-Server/silo-android)
for Android phone, tablet, and TV changes.

Reproduce an app problem on the affected form factor before changing shared
code. A phone build does not test TV focus or remote input.

## Website and documentation

This manual lives in the [website repository](https://github.com/Silo-Server/siloserver.org).
Follow [Improve these docs](/docs/help/improve-the-docs) to correct a guide
without building an app or learning the website framework.
