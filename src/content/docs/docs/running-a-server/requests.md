---
slug: docs/manage-requests
title: Manage media requests
description: Turn requests on, choose approval rules, and follow a request until its media is available.
---

Requests let people ask for movies or series that are missing from your server. Approval records your decision; media becomes available only after it has been added and matched in a library.

## Turn requests on

1. Open **Admin > Requests > Settings**.
2. Turn on **Requests enabled**. Leave **Auto approval** off if you want to review each request.
3. Set **Max requests** and **Window days**, then choose **Save Settings**.
4. Check that the intended users' [access group](/docs/manage-access) allows media requests.
5. Ask one user to submit a request and check that it appears in **Queue**.

Use **User Overrides** for an account that needs a different allowance or approval mode. Keep group permission, request quota, and approval rules in mind when a user cannot request something.

## Review a request

1. Open **Queue** and find the requested title.
2. Choose **Approve**, or **Decline** and enter a reason if needed.
3. After adding the media, scan the appropriate library and check that the request becomes available.

If it remains unfulfilled, check the library match and requested movie, series, or season. A similar title is not necessarily the same requested item.

## Connect an acquisition service

External services are optional. In **Integrations**, create a connection, select its plugin, and enter the service's base URL and credential. Use the connection's setup options to choose the destination and quality behavior, then save.

Install the required [plugin](/docs/plugins) first if it is missing. Test with one approved request and check both Silo and the external service. Do not assume approval alone confirms that the service accepted or downloaded the request.

Configure [notifications](/docs/notification-delivery) if users should receive delivery updates.
