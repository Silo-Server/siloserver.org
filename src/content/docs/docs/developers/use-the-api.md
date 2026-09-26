---
slug: docs/use-the-api
title: Make your first API request
description: Explore the installed server's API and make a read-only request with a test account's key.
---

Build new integrations against **/api/v2**. Use the reference served by the
server you are connecting to, so the documented operations match that build.
Jellyfin and [Audiobookshelf (Beta)](/docs/audiobookshelf) compatibility
endpoints have separate contracts.

## Before you start

Use a non-admin test account with access to a test library. Ask an
administrator to create a key owned by that account. Follow
[integration credentials](/docs/integration-credentials)
for the web key-management steps, then revoke the test key when finished.

The current web creation form does not offer a scope chooser. Its key has
no extra scope restriction and follows its owner's permissions; some operations
still require an interactive login. Do not use a server-admin key for this
example. API-created keys can narrow access with scopes; see the
[key API guide](https://github.com/Silo-Server/silo-server/blob/main/docs/api-keys-api.md)
when building a longer-lived integration.

A key uses its owner's permissions; adding a scope does not grant a role
the owner lacks. Keep the key out of URLs, source code, screenshots, and logs.

## Read the libraries visible to the account

1. Open your server's address with `/api/v2/docs` appended, for example
   `http://localhost:8090/api/v2/docs` when the server runs on this computer.
2. Select **Authorize**. Paste the API key without adding `Bearer`, then close
   the authorization dialog.
3. Find **GET /api/v2/user/libraries**, expand it, and select **Try it out**.
4. Select **Execute**. A successful response has status **200** and a list of
   libraries visible to the key's account.

For this account-level read, leave the optional profile header unset. For a
household-profile request, use `X-Profile-Id` and the verification headers
required by that operation. Do not treat an account-level result as a test
of a restricted profile's access.

The viewer sends real requests. Start with GET operations; POST, PUT, PATCH,
and DELETE can change data. Reloading the page clears the viewer's saved
authorization.

## Build on the example

Use the operation's request and response schemas when implementing the
request in your own language. Keep IDs as strings. Where a collection returns
a continuation cursor, pass it back unchanged instead of inventing page numbers.

Check a feature's capability response before presenting it as available.
Disabled, unconfigured, and unsupported features need different handling from
a failed request. A route's presence alone does not mean the current profile
is allowed to use it.

| Response | What to check |
| --- | --- |
| 401 | Missing, invalid, or expired credential |
| 403 | Owner permissions, key scopes, or required profile verification |
| 412 or 428 | The operation's documented edit preconditions |
| 429 | Rate limits and the response's retry instructions |

Read the returned problem body. Do not automatically retry a credential
creation or other non-retryable write after a connection failure; it may
already have succeeded.

## API reference

[Open the API reference for your server](/docs/api-reference).
The [native contract](https://github.com/Silo-Server/silo-server/blob/main/docs/architecture/api-contract.md)
covers compatibility and API conventions in more detail.
