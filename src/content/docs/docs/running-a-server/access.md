---
slug: docs/manage-access
title: Set access and limits
description: Give people the right libraries and permissions without editing every account separately.
---

Start with an access group for people who should have the same libraries and limits. Change one account only when it needs an exception.

Administrator accounts cannot belong to access groups. Group policies apply only to regular user accounts.

## Create an access group

1. Open **Admin > Access Groups** and choose **New group**.
2. Name the group, for example `Guests`, and create it.
3. Open the group. Under **Libraries & playback**, choose the libraries and playback quality it can use.
4. Review **Downloads & requests** and **Concurrent streams**. Under **Permissions**, choose which permissions member accounts may receive.
5. Choose **Save changes**.

Use **Default for new users** only if this should become the starting group for future accounts. Check its library access before making it the default.

Allowing a permission in the group does not grant it. Turn on **Marker Editing** or **Metadata Curation** for each account that needs it. Both the group and the account must allow the action.

## Assign a person to the group

1. Open **Admin > Users**, choose the person, then **Edit**.
2. In **Access**, select the group. Leave inherited values alone unless this account needs a different setting.
3. Check **Limits** and save.
4. Reopen the user's **Overview** to review the displayed permissions and limits. Ask the person to check an allowed library and a restricted one.

An account override can differ from its group. If a group change seems to have no effect, inspect the account's override before changing the group again.

**Inherited** means the value comes from the access group. An account without a group shows **Server default** instead; an administrator account shows **Admin default**.

## Choose limits that fit the task

Stream bitrate limits use **Mbps** in the web forms. Choose **Unlimited**, a preset, or **Custom** and enter a value such as `8` for 8 Mbps. This is a per-stream limit. Values below 1 Mbps trigger a low-quality warning.

**Max streams** limits simultaneous playback. **Max transcodes** limits sessions that need conversion. Turning off video transcoding can stop playback on a device that cannot play the original file; it does not make that file compatible.

Download permission and permission to create transcoded downloads are separate controls. Request access is also separate from the request quota and approval rules in [Requests](/docs/manage-requests).

**Marker Editing** and **Metadata Curation** let a trusted user correct media within their assigned libraries. Neither requires making that person a server administrator.

## Check household restrictions

Account access and profile restrictions are different. A child profile may hide a title that another profile in the same account can see. Check the active profile when testing access. Do not use an administrator account as the test viewer: administrators have broader authority.
