---
slug: docs/download-storage
title: Manage download storage
description: See how much space prepared downloads take on the server and transcode nodes, free it, and revoke downloads on a device.
---

When someone downloads a smaller quality, or a file their device can't play, Silo first prepares a copy on the server or a [transcode node](/docs/transcode-nodes). Open **Admin > Downloads** in the web app to see how much space those prepared files take, free it, and take downloads back from a device. Download permissions and limits are covered in [Set access and limits](/docs/manage-access#limit-downloads).

## Check storage use

The **Storage** tab has a card for the server and one for each transcode node. Each card shows the directory that holds prepared files, how full its disk is, and how that space is split:

- **In use**: files a device is still waiting for or downloading.
- **Cached**: files no device is waiting for. Silo keeps each one for 72 hours after its last use by default, so another device, or someone downloading the same title again, can reuse it. Then Silo deletes it.
- **Untracked**: files named like Silo's prepared files that Silo has no record of. Clean-up never removes them.
- **Other data**: everything else on the same disk.

A finished download doesn't keep its prepared file. Once the device has its copy, the file counts as cached and goes when the cache period ends. Downloading that title again after that means Silo prepares it again.

Silo cleans up on its own every few minutes. To free space at one location straight away, select **Clean up now** on its card. To delete untracked files, select **Review** on the card and confirm. Silo checks the directory again first and deletes only files no prepared-file record accounts for and that nothing has written to for an hour. Other files in the directory are never touched.

Warnings appear above the cards when a disk is near its ceiling, when prepared files are on temporary storage that a restart clears, when an offline node holds prepared files, when a location has untracked files, or when files are kept only for devices nobody has seen in 14 days. Each warning has a button that opens the place to fix it.

## Set storage budgets

The limits are in **Admin > Settings > Downloads**, under **Advanced**:

- **Default storage budget per location** caps the prepared files at the server and at each node that has no budget of its own. Each location counts separately. There's no budget unless you set one.
- **Keep cached files for** sets how many hours a cached file stays after its last use, from 0 to 720. The default is 72.
- **Disk ceiling (%)** is how full a location's disk can get before Silo deletes cached files there early, whatever the budget. It accepts 50 to 95, and the default is 85.

Over a budget or the ceiling, Silo deletes cached files first, least recently used first. It never deletes a file a device is still waiting for. If a location stays over with nothing cached left to delete, its card says so: a node gets no new preparations until space frees up, and downloads that would be prepared on the server wait.

To give one node its own directory or budget, see [Store prepared downloads on a node](/docs/transcode-nodes#store-prepared-downloads-on-a-node).

## Delete prepared files

The **Prepared files** tab lists each file with its title, location, size, last use, and state. Filter by location, state, or format, or search for a title.

1. Select the files, then select **Delete…**.
2. Check the list. Cached files are deleted. Files in use are skipped unless you also select **Also delete the files in use**.
3. Confirm with the **Delete** button.

Devices that already finished downloading keep their copies. If you delete a file that's in use, Silo prepares it again for the devices still waiting for it. To free that space for good, revoke those downloads instead.

## Revoke downloads on a device

Revoke a device's downloads when it's lost, or shouldn't keep them any more. The **Device copies** tab lists each device that holds downloads, with its owner, when it was last seen, and how much it holds.

1. Open **Device copies** and find the device. To find devices that haven't connected for a while, sort by **Longest unseen first**.
2. Select **Revoke all…** to revoke everything on the device. To revoke only some downloads, expand the device and select **Revoke** on a download, or select several and use the button that appears above them, such as **Revoke 3…**.
3. Optionally enter a **Reason**, such as `Device lost`. It's kept in **History**.
4. When you revoke everything on a device that follows series, leave **Also pause the series monitor on this device** selected. Otherwise new episodes download to it again.
5. Confirm with the **Revoke** button.

The server stops sending those downloads straight away, and the Silo app on the device deletes them the next time it connects. Until then, the device's row shows how many are waiting, such as **2 revoked, waiting for device**. Apps released before revocation support keep files they already downloaded.

Prepared files that only the revoked downloads were waiting for become cached and expire after the cache period. Preparations nothing else needs are canceled.

## Review history

The **History** tab lists what clean-up and administrators removed in the last 90 days: when it happened, why, which titles or device, where, and how much. Filter by reason, such as **Over budget** or **Revoked downloads**, by location, or by time.

## Check download preparation

The **Preparation** tab shows the downloads Silo is preparing or has queued, with their progress and the machine doing the work. Pause, resume, or cancel jobs there. **Admin > Activity** shows streams only.
