---
slug: docs/api
title: Use the API
description: Open your server's API reference, download its OpenAPI document, and make a first read-only request.
---

Build new integrations against **/api/v2**. Each server documents the API it
runs, so use the reference from the server you're connecting to. Jellyfin
and [Audiobookshelf (Beta)](/docs/audiobookshelf) compatibility endpoints
follow their own contracts.

## Open the API reference

Add **/api/v2/docs** to your server's address to open the interactive
reference, for example `http://localhost:8090/api/v2/docs` on the server
itself. If the server is behind a path prefix, keep the prefix before
`/api/v2/docs`. Use the filter to find an endpoint group, then expand an
operation to see its parameters, required permissions, request body, and
responses.

To generate a client, download **/api/v2/openapi.json** from the same
server and note the server version it came from. Neither the reference nor
the OpenAPI document needs a sign-in; the requests themselves do.

The reference also lists endpoints for [Beta features](/docs/beta), which
may change or be removed.

## Get an API key

Use a non-admin test account that can see a test library, and ask an
administrator to create a key owned by that account. See
[Manage API keys](/docs/api-keys) for the steps, and
revoke the key when you're done.

A key has its owner's permissions. Keys created in the web app have no
extra scope restriction, and some operations still need an interactive
sign-in. Keys created through the API can be narrowed with scopes, though a
scope never grants more than the owner has; see the
[key API guide](https://github.com/Silo-Server/silo-server/blob/main/docs/api-keys-api.md)
for a longer-lived integration. Keep keys out of URLs, source code,
screenshots, and logs.

## Make a first request

1. Open the API reference on your server.
2. Select **Authorize**, paste the API key without adding `Bearer`, and
   close the dialog.
3. Find **GET /api/v2/user/libraries**, expand it, and select **Try it out**.
4. Select **Execute**. The response has status **200** and lists the
   libraries the key's account can see.

The reference sends real requests. Stick to GET operations while you
explore; POST, PUT, PATCH, and DELETE can change data. Reloading the page
clears the saved key.

## Act as a profile

The request above works at the account level. To act as a household
profile, send its ID in `X-Profile-Id`. A PIN-locked profile also needs
`X-Profile-Token`, which you get from **POST /api/v2/profiles/{id}/verify-pin**.
Each operation's reference lists the headers it accepts.

## Handle responses

Implement each request from its schema in the reference. Keep IDs as
strings. When a collection returns a continuation cursor, pass it back
unchanged instead of counting pages.

Before offering a feature, read its capability response: a disabled,
unconfigured, or unsupported feature needs different handling from a failed
request.

| Status | Usual cause |
| --- | --- |
| 401 | Missing, invalid, or expired credential |
| 403 | The owner's permissions, the key's scopes, or a profile that needs verification |
| 412 or 428 | The operation's edit preconditions, described in its reference |
| 429 | Rate limit; follow the response's retry instructions |

Error responses include a problem body with details. If the connection
drops during a write, such as creating a credential, don't retry it
automatically: it may already have succeeded.

## If the reference doesn't load

Check the server address and version. Behind a reverse proxy, ask the
administrator to make sure the proxy forwards `/api/v2/` paths, including
the reference's own files.

The [API contract](https://github.com/Silo-Server/silo-server/blob/main/docs/architecture/api-contract.md)
covers compatibility rules and API conventions in more detail.
