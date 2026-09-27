---
slug: docs/api-keys
title: Manage API keys
description: Create an API key for an integration, and replace or revoke it.
---

Use a separate key for each integration so you can remove one connection without disrupting the others. Keep the key in the integration's secret field or a password manager, never in a public URL, screenshot, or repository.

## Create a key in the admin interface

1. Open **Admin > API Keys** and choose **Create Key**.
2. Enter a **Label** that identifies the integration, for example `Living room dashboard`.
3. Select the **User** that should own it.
4. Choose **Create**, then **Copy & Close**. Store the key right away; Silo can't show it again.
5. Paste it into the integration and run its connection test.

A key can do anything its owner's account can do through the API. Give each integration a regular account with only the access it needs, rather than an administrator. The API can create keys with narrower scopes; this form can't.

Only administrators create keys. The owning account can list and revoke its own keys through the API.

## Replace a key

Silo can't give an existing key a new secret. To replace one, create a new key, update the integration, and make sure it connects. Then choose **Revoke** on the old key in **Admin > API Keys**. If a key was exposed, revoke it immediately.

Revoking a key stops requests that use it. Browser and app sign-ins on the owning account stay signed in.

**Edit rate limit** switches a key between the **Standard** and **Elevated** rate limits. It doesn't change what the key can access.

For the installed server's API viewer and developer entry points, see [Developers & integrations](/docs/developers).
