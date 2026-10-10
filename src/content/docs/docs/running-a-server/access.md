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

A group permission only makes the permission available. Turn on **Marker Editing**, **Metadata Curation**, or **Subtitle Upload** for each account that needs it; both the group and the account must allow the action. New accounts start with **Marker Editing** and **Subtitle Upload** on, so to stop someone uploading subtitles, turn **Subtitle Upload** off on their account or remove **Subtitle upload** from their group.

## Assign a person to the group

1. Open **Admin > Users**, choose the person, then **Edit**.
2. In **Access**, select the group. Leave inherited values alone unless this account needs a different setting.
3. Check **Limits** and save.
4. Reopen the user's **Overview** to review the permissions and limits it shows.

An account can override its group. If a group change seems to have no effect, look for an override on the account.

**Inherited** means the value comes from the access group. An account without a group shows **Server default** instead; an administrator account shows **Admin default**.

## Choose limits that fit the task

Stream bitrate limits use **Mbps** in the web forms. Choose **Unlimited**, a preset, or **Custom** and enter a value such as `8` for 8 Mbps. This is a per-stream limit. Values below 1 Mbps trigger a low-quality warning.

**Max streams** limits simultaneous playback. **Max transcodes** limits sessions that need conversion. With video transcoding off, a device that can't play the original file can't play it at all.

Download permission and permission to create transcoded downloads are separate controls. Request access is also separate from the request quota and approval rules in [Requests](/docs/manage-requests).

**Marker Editing** and **Metadata Curation** let a trusted user correct media in the libraries they can access, without making them a server administrator. **Subtitle Upload** lets them add subtitle files that everyone with access to the title can use. Turning it off doesn't remove subtitles they've already uploaded, and they can still search for subtitles online.

## Check household restrictions

Account access determines which libraries the household can use. Profile
restrictions narrow that access for one person; they cannot grant access to
libraries the account cannot use.

The household's primary profile can configure **Maximum content rating**,
**Maximum advisory age**, and **Restrict libraries** in the web profile editor.
See [Set parental controls](/docs/profiles#set-parental-controls) for the steps.
When both rating limits are set, titles must pass both.

**Titles with no age rating**, in **Admin > Settings > Library & Metadata**
under **Browsing**, decides whether profiles with a content-rating limit see
titles that have no rating or are marked Not Rated (`NR`). **Hide from profiles
with a ceiling** is the default; **Show to every profile** lets them through.
A rating Silo can't read stays hidden from those profiles either way.

Missing advisory ages are handled per profile instead: the profile's **Hide
titles without an advisory age** switch applies when **Maximum advisory age**
is set.

Check the active profile when testing access. Use a regular household account
and its restricted profile: administrator accounts have broader authority.
