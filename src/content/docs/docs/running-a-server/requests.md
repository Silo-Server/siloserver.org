---
slug: docs/manage-requests
keywords: ["approve requests", "Seerr", "Overseerr", "Jellyseerr", "Radarr", "Sonarr"]
questions: ["How do I let users ask for new movies?", "Why can't someone ask for a show?", "Can I approve requests in the mobile app?", "Why is a request still pending after I added the movie?"]
title: Manage media requests
description: Turn requests on, choose approval rules, and follow a request until its media is available.
---

Requests let people ask for movies or series that your server doesn't have. Approving a request records your decision; the request is fulfilled once the media is added to a library and matched.

## Turn requests on

1. Open **Admin > Requests > Settings**.
2. Turn on **Allow requests**.
3. Under **Approval**, choose **An admin approves** to review each request, or **Approve automatically**.
4. Set **Request limit** and **Limit window**. Declined and failed requests don't count toward the limit.
5. Choose **Save**.
6. Ask one user to submit a request, and look for it in **Admin > Requests > Queue**.

These are server-wide defaults. An [access group](/docs/manage-access) can set its own approval rule and limit, and its members can't request at all if **Allow media requests** is off for the group. To change the approval rule or limit for one account, open **Admin > Users**, select the account, open **Access & limits**, and choose **Edit** in the **Requests** section. To stop just that account from requesting, set **Can request media** to **Custom** and choose **No**. When someone can't request a title, check the account's **Can request media**, its access group, and the request limit.

## Review a request

Review requests in the web app. The phone, tablet, and TV apps don't have approval controls, even for admins.

1. Open **Admin > Requests > Queue**. **Needs approval** lists requests waiting for a decision.
2. Choose **Approve**, or **Decline**. When you decline, you can add a reason for the requester.
3. After adding the media, scan the library. Within a few minutes of Silo matching the new item, the request shows as available, and Silo notifies the requester and everyone who asked to be notified.

If it stays unfulfilled, compare the library match with the requested movie, series, or season. A title with a similar name may be a different item.

## Requests from watchlists

To stop watchlist adds from creating requests, open **Admin > Requests > Settings**, turn off **Request titles added to a watchlist**, and choose **Save**. It's on by default. People can still save titles the library doesn't have to their watchlist.

While it's on, adding such a title to a watchlist requests it for that person, or adds them to an open request for it. Request limits, approval, and routing apply as they do for any other request, and the queue marks these requests **via watchlist**. Each profile can also turn this off for itself in **Settings > Requests**.

## Connect an acquisition service

External services are optional. Install the service's [plugin](/docs/plugins) first. In **Admin > Requests > Settings**, under **Servers**, choose **Add server**, pick the plugin under **Server type**, and enter the service's **URL** and **API key**. Some plugins don't need one or both; the form marks those fields optional. Choose the destination and quality options, then save.

Test with one approved request, and look for it in both Silo and the external service.

Configure [notifications](/docs/notification-delivery) if users should receive delivery updates.

## Add recommendation rows to Discover

**Admin > Requests > Discover Page** sets the rows everyone sees on the Requests page's **Discover** tab. A **Recommendations** row shows each viewer titles that aren't in your library yet, picked from what they watch. It stays empty until [Discover recommendations](/docs/recommendations#recommend-titles-you-dont-have-on-discover) are turned on.

If you've never changed the page, it already starts with **Recommended movies for you** and **Recommended series for you**. If you have, check the list: turn on a recommendation row that's there but switched off, and add any that's missing:

1. Open **Admin > Requests > Discover Page** and choose **Add row**.
2. Under **Bring back**, choose **Recommended movies for you** or **Recommended series for you**.
3. Choose **Add row**. New rows go to the bottom of Discover, so drag the row up by its handle if you want it near the top.
4. Repeat for the other row.
