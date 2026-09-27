---
slug: docs/build-a-plugin
title: Build your first plugin
description: Start from a small SDK example, inspect its manifest, and test it on a disposable server.
---

A plugin adds a capability to Silo, such as metadata lookup or a scheduled
task. You write it with the [Go plugin SDK](https://github.com/Silo-Server/silo-plugin-sdk).
To install an existing plugin, see [Install plugins](/docs/plugins) instead.

## Start with the scheduled-task example

You need Git and the Go version named in the SDK's `go.mod`. In a new
directory, run:

```sh
git clone https://github.com/Silo-Server/silo-plugin-sdk.git
cd silo-plugin-sdk
go build -o hello-scheduled-task ./examples/hello-scheduled-task
./hello-scheduled-task manifest
```

The last command prints the plugin's manifest, including its ID, version,
and `scheduled_task.v1` capability.

## Test it with Silo

Plugins run code on the server, and Silo runs the binary while inspecting
an upload. Test on a disposable server with test data, and read the source
of any plugin you didn't write before uploading it.

1. Build for the operating system and processor of the Silo server. A
   binary built for your Mac won't run in a Linux container.
2. Follow **Manual Install** in [Install plugins](/docs/plugins) and upload
   the binary.
3. Open **Admin > Scheduled Tasks**, find **Hello Task**, and select
   **Run Now**. The example doesn't change any media; a completed run shows
   that Silo can call the plugin.

## Make it your own

Start from the example's source and manifest. Give your plugin its own ID
and implement only the capabilities it needs. Put short setup instructions,
support and source links, and required configuration in the manifest's
presentation block.

Before publishing, pin a tagged SDK version in your plugin's `go.mod`, build
the target binaries, and follow the SDK's
[compatibility guidance](https://github.com/Silo-Server/silo-plugin-sdk/blob/main/docs/compatibility.md).
Publishing a release doesn't add a plugin to a catalog. The
[Silo catalog](https://github.com/Silo-Server/silo-plugins) lists
first-party plugins. Community plugins reach the
[approved community catalog](https://github.com/Silo-Community/silo-plugins)
after a maintainer review; its approval policy lists the requirements.

See the [scheduled-task example](https://github.com/Silo-Server/silo-plugin-sdk/tree/main/examples/hello-scheduled-task)
for its current source and the SDK README for other capability examples.
