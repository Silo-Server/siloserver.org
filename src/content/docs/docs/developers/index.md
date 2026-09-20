---
title: Developer and integration resources
description: Find the repositories and technical documentation for Silo integrations, plugins, and code contributions.
---

Use these resources when building something that works with Silo. To connect
an existing app instead, follow the
[Jellyfin](/docs/using-silo/jellyfin-apps) or
[Audiobookshelf](/docs/using-silo/audiobookshelf-apps) connection guide.

## Server and API

The [server repository](https://github.com/Silo-Server/silo-server) owns the
server, web app, and API implementation. Start with its README and technical
documentation for build requirements and API work. The
[1.0 milestone](https://siloserver.org/milestone/1.0/) describes the planned public API contract;
check the contract for the server version you are targeting rather than
assuming a route on the development branch is a release guarantee.

## Plugins

- [Plugin SDK](https://github.com/Silo-Server/silo-plugin-sdk): authoring tools
  and the plugin contract.
- [Plugin catalog](https://github.com/Silo-Server/silo-plugins): distribution
  metadata for available plugins.

Follow the SDK's current documentation when implementing a capability. Use
the owning plugin repository for its setup and implementation details.

## Native apps

- [Silo Apple](https://github.com/Silo-Server/silo-apple).
- [Silo Android](https://github.com/Silo-Server/silo-android).

Each repository maintains its own build and contribution instructions. An
API change can affect several clients; review the corresponding client use
before treating a server-only change as complete.

## Website and documentation

The [website repository](https://github.com/Silo-Server/siloserver.org) owns
this public manual. See [Improve these docs](/docs/help/improve-the-docs) for
small corrections, writing guidance, and the preview workflow.
