---
slug: docs/integration-credentials
title: Manage integration credentials
description: Create an account-owned API key in the admin interface and replace or revoke it safely.
---

Use a separate key for each integration so you can remove one connection without disrupting the others. Keep the key in the integration's secret field or a password manager, never in a public URL, screenshot, or repository.

## Create a key in the admin interface

1. Open **Admin > API Keys** and choose **Create Key**.
2. Enter a **Label** that identifies the integration, for example `Living room dashboard`.
3. Select the **User** that should own it. Check that account's permissions before continuing.
4. Choose **Create**, then **Copy & Close**. Store the secret immediately; the list does not reveal it again.
5. Paste it into the intended integration and run that integration's connection test or a read-only request.

The web form creates an unscoped key, which carries the owning account's API permissions. Use a non-admin account with only the access the integration needs. The API supports narrower scoped keys, but this form has no scope selector.

This procedure describes the admin web interface. The API also supports account-owned personal keys; the absence of a user-facing creation screen is not an admin-only API policy.

## Replace a key

Create a new key, update the integration, and confirm it works. Then revoke the old key from **Admin > API Keys**. If a key was exposed, revoke it immediately rather than leaving it active while investigating.

The page also offers **Standard** and **Elevated** tiers. A tier affects API rate limits; it is not a substitute for the owning account's access permissions. Do not raise it to work around an integration that is sending too many requests.

Revocation stops future requests using that key. It does not sign out browser or mobile-app sessions.

For the installed server's API viewer and developer entry points, see [Developers & integrations](/docs/developers).
