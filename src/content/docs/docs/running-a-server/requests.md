---
slug: docs/manage-requests
title: Manage media requests
description: Turn requests on, choose approval rules, and follow a request until its media is available.
---

Requests let people ask for movies or series that your server doesn't have. Approving a request records your decision; the request is fulfilled once the media is added to a library and matched.

## Turn requests on

1. Open **Admin > Settings > Requests**.
2. Turn on **Allow requests**.
3. Under **Approval**, choose **An admin approves** to review each request, or **Approve automatically**.
4. Set **Request limit** and **Limit window**. Declined and failed requests don't count toward the limit.
5. Choose **Save**.
6. Ask one user to submit a request, and look for it in **Admin > Requests**.

These are server-wide defaults. An [access group](/docs/manage-access) can set its own approval rule and limit. To change them for one account, open **Admin > Users**, select the account, open **Access & limits**, and choose **Edit** in the **Requests** section. Turn off **Can request media** there to stop the account from requesting. When someone can't request a title, check their account, their access group, and the server-wide limit.

## Review a request

Requests are reviewed in the web app only. The phone, tablet, and TV apps don't show approval controls, even to admins.

1. Open **Admin > Requests**. **Needs approval** lists requests waiting for a decision.
2. Choose **Approve**, or **Decline**. When you decline, you can add a reason for the requester.
3. After adding the media, scan the library. Within a few minutes of the new item being matched, the request shows as available, and everyone who requested it or asked to be notified is told.

If it stays unfulfilled, compare the library match with the requested movie, series, or season. A title with a similar name may be a different item.

## Requests from watchlists

To stop watchlist adds from creating requests, open **Admin > Settings > Requests**, turn off **Request titles added to a watchlist**, and choose **Save**. It's on by default. People can still save titles the library doesn't have to their watchlist.

While it's on, adding such a title to a watchlist requests it for that person, or adds them to an open request for it. Request limits, approval, and routing apply as they do for any other request, and the queue marks these requests **via watchlist**. Each profile can also turn this off for itself in **Settings > Requests**.

## Connect an acquisition service

External services are optional. Install the service's [plugin](/docs/plugins) first. In **Admin > Settings > Requests**, under **Servers**, choose **Add server**, pick the plugin under **Server type**, and enter the service's **URL** and **API key**. Some plugins don't need one or both; the form marks those fields optional. Choose the destination and quality options, then save.

Test with one approved request, and look for it in both Silo and the external service.

Configure [notifications](/docs/notification-delivery) if users should receive delivery updates.
