---
title: API reference
description: Open the interactive API reference and OpenAPI document bundled with your server.
---

Append **/api/v2/docs** to your Silo server's address to open the interactive
reference. For a server running on this computer, use
`http://localhost:8090/api/v2/docs`. On another device, replace `localhost`
with the server's reachable address.

Use the filter to find an endpoint group. Expand an operation to see its
parameters, required permissions, request body, and possible responses.

## Download the OpenAPI document

The same server provides **/api/v2/openapi.json**. Save that document when
generating a client or reviewing an API change. Record the server version
alongside it so you know which contract you used.

The viewer and schema are bundled with the server. Reading them does not
require signing in. Protected requests still need authorization.

## Try an operation

Follow [Make your first API request](/docs/developers/use-the-api) for a
read-only example. **Try it out** executes against your actual server, so
use a test installation before experimenting with operations that write data.

## If the reference does not load

Check the server address and version. If the server is behind a path prefix,
keep that prefix before `/api/v2/docs`. Ask the administrator to confirm the
proxy forwards the `/api/v2/` paths, including the viewer's assets.
