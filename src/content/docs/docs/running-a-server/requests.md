---
slug: docs/manage-requests
title: Manage media requests
description: Turn requests on, choose approval rules, and follow a request until its media is available.
---

Requests let people ask for movies or series that your server doesn't have. Approving a request records your decision; the request is fulfilled once the media is added to a library and matched.

## Turn requests on

1. Open **Admin > Requests > Settings**.
2. Turn on **Requests enabled**. Leave **Auto approval** off if you want to review each request.
3. Set **Max requests** and **Window days**, then choose **Save Settings**.
4. Make sure the users' [access group](/docs/manage-access) allows media requests.
5. Ask one user to submit a request, and look for it in **Queue**.

Use **User Overrides** for an account that needs a different allowance or approval mode. When someone can't request a title, check their group permission, request quota, and approval rules.

## Review a request

1. Open **Queue** and find the requested title.
2. Choose **Approve**, or **Decline** and enter a reason if needed.
3. After adding the media, scan the library. The request becomes available once the new item is matched.

If it stays unfulfilled, compare the library match with the requested movie, series, or season. A title with a similar name may be a different item.

## Requests from watchlists

To stop watchlist adds from creating requests, open **Admin > Settings > Requests**, turn off **Request titles added to a watchlist**, and choose **Save**. It's on by default. People can still save titles the library doesn't have to their watchlist.

While it's on, adding such a title to a watchlist requests it for that person, or adds them to an open request for it. Request limits, approval, and routing apply as they do for any other request, and the queue marks these requests **via watchlist**. Each profile can also turn this off for itself in **Settings > Requests**.

## Connect an acquisition service

External services are optional. Install the service's [plugin](/docs/plugins) first. In **Integrations**, create a connection, select the plugin, and enter the service's base URL and credential. Choose the destination and quality options, then save.

Test with one approved request, and look for it in both Silo and the external service.

Configure [notifications](/docs/notification-delivery) if users should receive delivery updates.
