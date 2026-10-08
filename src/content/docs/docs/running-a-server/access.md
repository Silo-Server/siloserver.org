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

A group permission only makes the permission available. Turn on **Marker Editing** or **Metadata Curation** for each account that needs it; both the group and the account must allow the action.

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

**Marker Editing** and **Metadata Curation** let a trusted user correct media in the libraries they can access, without making them a server administrator.

## Download limits

Download limits are configured in the web admin app. They apply to native
Silo downloads, including downloads requested by the phone and tablet apps.
They are separate from [playback bitrate limits](#playback-bitrate-limits).

1. Open **Admin > Settings > Downloads** and turn on **Allow downloads**.
2. Set **Per-user bandwidth** in Mbps. This is one default applied separately
   to each account, shared by that account's concurrent downloads and household
   profiles.
3. Expand **Advanced**. Set **Server bandwidth** for all native downloads on
   the installation combined. Both bandwidth limits apply; the stricter
   available budget wins. **Unlimited** stores zero.
4. Under **Per user**, set **Downloads per period**, **Period length**, and
   **Downloads at once per user**, then save.
5. Check the account's download permission in **Admin > Users** before testing
   a download. See [Download for offline use](/docs/downloads) for the client
   controls.

**Downloads per period** counts registrations in a rolling period, separately
for each account. For example, a count of two over 20 seconds admits two new
registrations and rejects another until an earlier registration leaves that
period. It is neither a downloaded-byte quota nor a whole-server registration
count. **Unlimited** removes the count limit. Quantity settings can take up to
30 seconds to reach a serving API after a save.

Bandwidth uses decimal Mbps: 1 Mbps is 125,000 bytes per second. Bandwidth
changes apply at the next charged chunk of an active transfer. Short transfers
can exceed the average rate because the shared budget allows a burst of
250 milliseconds of the configured rate, with a minimum of 32 KiB.

All serving APIs must share PostgreSQL and Redis for installation-wide
accounting. A positive bandwidth limit requires Redis even on a single server.
A settings or accounting failure stops a capped transfer rather than sending
uncharged bytes. Restore the dependency before retrying. Capped downloads stay
on the API byte-delivery path; they are not redirected to a worker that cannot
participate in the shared budget. These byte limits do not pace Jellyfin
playback or ordinary HLS segment fetches.

**Prepared file storage budget** is a separate server-wide cache limit. It
controls retained prepared files, not the amount an account can download.

If the settings cannot be read, choose **Retry** before editing. A failed save
keeps the draft; reload and resolve the error before treating it as active.

## Playback bitrate limits

Set the group policy under **Admin > Access Groups > Libraries & playback**,
or edit one account under **Admin > Users**. An inherited account value uses
the group policy; an explicit account value replaces that field, and
**Unlimited** removes its cap.

The local and remote limits measure encoded media rate per stream, in decimal
Mbps in the web forms. They are not network transfer-speed limits. Silo chooses
the policy when a playback attempt starts; editing it does not interrupt an
existing attempt. If the original exceeds the policy, Silo needs a permitted
transcode route or refuses that playback method.

Encoder bursts, audio frames, and container headers can make a short sample
higher than the selected video rate. The video encoder permits a burst of two
seconds of its selected maximum rate; audio and container overhead are accounted
for separately. An HLS segment fetched faster than its media duration does not
by itself violate the playback limit. Native Silo and Jellyfin-compatible
playback use the account/group policy.

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
