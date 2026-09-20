---
title: Build your first plugin
description: Start from a small SDK example, inspect its manifest, and test it on a disposable server.
---

A plugin adds a capability to Silo, such as metadata lookup or a scheduled
task. The [Go plugin SDK](https://github.com/Silo-Server/silo-plugin-sdk)
owns the authoring contract. Installing an existing plugin only requires the
[admin guide](/docs/running-a-server/plugins).

## Start with the scheduled-task example

Use a development machine with Git and the Go version required by the SDK's
`go.mod`. Work in a new directory:

```sh
git clone https://github.com/Silo-Server/silo-plugin-sdk.git
cd silo-plugin-sdk
go build -o hello-scheduled-task ./examples/hello-scheduled-task
./hello-scheduled-task manifest
```

The last command prints the plugin's manifest. Check its ID, version, and
`scheduled_task.v1` capability. This checks that the binary can describe
itself; it does not test its execution inside Silo.

## Test it with Silo

1. Build for the operating system and processor used by the Silo server.
   A binary built for your Mac will not run in a Linux container.
2. Review the source and manifest before uploading. Inspecting a plugin during
   upload can execute its binary, so the upload itself requires trust.
3. On a disposable server, follow **Manual Install** in
   [Install plugins](/docs/running-a-server/plugins) and upload the binary.
   Use test data only.
4. Open **Admin > Scheduled Tasks**, find **Hello Task**, and select **Run Now**.
   Check the execution result. This example returns without changing media;
   a completed run confirms the host can call the plugin.

Do not test unfamiliar plugin binaries on a server holding your only copy of
important data. Plugins run code on the server.

## Make it your own

Use the example's source and manifest as a starting point. Give your plugin
its own identity and implement only the capabilities it needs. Add short
setup instructions, support and source links, and required configuration to
the manifest's presentation block.

Before publishing, pin a tagged SDK version in your plugin's `go.mod`, build
the target binaries, and follow the SDK's
[compatibility guidance](https://github.com/Silo-Server/silo-plugin-sdk/blob/main/docs/compatibility.md).
The [catalog repository](https://github.com/Silo-Server/silo-plugins) maintains
the distribution entries; publishing a binary does not add it to the catalog.

See the [scheduled-task example](https://github.com/Silo-Server/silo-plugin-sdk/tree/main/examples/hello-scheduled-task)
for its current source and the SDK README for other capability examples.
