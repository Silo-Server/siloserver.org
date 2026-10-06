---
slug: docs/autoscan
title: Keep libraries up to date
description: Let Silo watch library folders on local disks, connect autoscan sources for network shares, and check that changed files reach the library.
---

Silo notices new, changed, and removed files in three ways:

- [Real-time monitoring](#real-time-monitoring) watches library folders on local disks and scans a changed file or folder within seconds. It's on by default and needs no setup.
- [Autoscan sources](#autoscan-sources) cover storage Silo can't watch, such as network shares. Another service, such as Sonarr or Radarr, tells Silo what changed, or a plugin checks a service for changes.
- The daily library scan catches anything the other two missed, including changes made while Silo was stopped. It's the **Queue Media Library Scans** task in **Admin > Scheduled Tasks** and runs at 02:00 by default.

## Real-time monitoring

Silo watches every folder in a library, including season and other subfolders, and scans only what changed. A file that's still being copied is scanned once the copy finishes. While a scan is running, a button such as **2 scans** appears at the top of **Admin > Libraries**. Click it to open the scan queue, where scans that monitoring started are tagged **File change**.

Two switches control it, and both are on by default:

- **Real-time monitoring** under **Scanning** in **Admin > Settings > Library & Metadata** turns it on or off for the whole server. The change applies without a restart.
- **Real-time monitoring** on a library's **Folders** tab turns it off for that library only. Open **Admin > Libraries** and edit the library to find it.

Libraries that aren't **Enabled** aren't monitored.

### Check that monitoring works

Edit the library and open **Folders**. The line under **Real-time monitoring** shows its status, for example `Status: Monitoring 1,240 folders (inotify)`. If monitoring isn't working, the line names the problem and the reason instead. See [If monitoring shows a problem](#if-monitoring-shows-a-problem).

**Admin > Libraries** also marks a library with a problem, with a badge such as **Monitoring: Watch limit reached**. Hover over it to read the reason.

### Supported storage

| Storage | Monitored |
| --- | --- |
| Local disks, such as ext4, XFS, Btrfs, or ZFS | Yes |
| FUSE mounts, such as mergerfs or Unraid user shares | Yes, for changes made through the mount. A change made directly on one of the pool's disks isn't seen. |
| NFS, SMB/CIFS, and CephFS network shares | No |
| 9p shares, such as `/mnt/c` in WSL | No |

Silo can't see changes that other machines make on a network share, so a library on one shows **Unsupported filesystem**. Add an [autoscan source](#autoscan-sources) for it, or let the daily scan pick up changes.

The same goes for a network share mounted inside a library folder, or reached through a symlink in one. The rest of the library is still monitored, and the status line lists the folders it skips.

### Raise the inotify watch limit

Silo needs one inotify watch for each folder it monitors. If the host's limit is too low for your libraries, the status shows **Watch limit reached** with the number of watches the library needs and the current limit.

Raise the limit on the host; a container can't change it. Other apps that run as the same user on the host, such as Plex or Syncthing, share the same limit.

1. Create `/etc/sysctl.d/60-silo-inotify.conf` with this line:

   ```ini
   fs.inotify.max_user_watches = 1048576
   ```

2. Run `sudo sysctl --system`.

Silo notices the new limit and retries the library on its own, usually within a minute.

On TrueNAS SCALE, add a `SYSCTL` tunable for `fs.inotify.max_user_watches` under **System Settings > Advanced Settings**. On Unraid, set the inotify watch limit in the Tips and Tweaks plugin.

## Autoscan sources

Use an autoscan source for a library on storage Silo can't monitor. A source either receives webhooks from another service or checks a service for changes through a plugin. Set one up once your library scans and plays normally, then open **Admin > Libraries > Autoscan**.

Sonarr and Radarr webhooks can stay on for libraries that are also monitored. When both report the same import, Silo merges them, so at most a folder gets scanned one extra time.

### Add a webhook source

1. In **Sources**, choose **Add source** and select **Sonarr/Radarr Webhook**. It's built in and needs no plugin.
2. Follow **Match paths**. Map the paths the other service sends to the paths Silo sees inside its container.
3. Choose **Create and continue**. Copy the webhook URL from **Connect it** and follow the displayed instructions in the sending service. In Sonarr or Radarr, tick **On File Import**, **On File Upgrade**, **On Rename**, and **On Episode File Delete** or **On Movie File Delete**.
4. Turn on Autoscan in the page header.
5. Add one item in the sending service, then open **Activity** and choose **Polls**. The delivery has a **Webhook** badge, resolves to the right library, and creates a scan.

The sending service's **Test** button only checks that the URL works. The source's row shows the new delivery time, but test events don't appear in **Activity** and don't start a scan.

Keep the webhook URL secret. If you rotate it, update the sending service too.

### Manage sources

Each source shows which libraries it feeds and whether it's working. Turn a source on or off with the switch on its row. Give a source a label when you have several of the same kind, such as two Sonarr servers; the label becomes its name in the list. To change a source's label, server, settings, or path mappings, choose **Edit**. Copy a webhook URL with the copy button, and rotate it or delete the source from the **⋯** menu.

### Add a polling source

1. Install a scan-source [plugin](/docs/plugins). For Sonarr and Radarr, install **Sonarr & Radarr Autoscan** from the **Made by Silo** group on the **Catalog** tab.
2. Under **Sources > Advanced**, add a saved connection if the source needs one. Enter the service URL and credential, or reuse a Requests integration.
3. Choose **Test connection** and save.
4. Choose **Add source**, select the plugin, and choose the server. Sonarr and Radarr sources need one. If the service sees different paths than Silo, add the path mappings now, and give the source a label if you like. The source is on as soon as you add it.
5. To fill in mappings from the service instead, choose **Edit** on the source and open **Match paths**. Choose **Sync from server**, select the suggested mappings, choose **Add selected**, then choose **Save**.
6. Turn on Autoscan if it's off, then choose **Run now**. The first check records a starting point and usually reports 0 changes. Imports after that appear in **Activity** on the next check.

Changing a source's server or settings, or the URL of the saved connection it uses, restarts its checks from now. Imports since its last check are picked up by the daily library scan instead.

Sources check for changes at the **Default check interval** under **Advanced**, 600 seconds unless you change it. A source's own interval can only make it check less often; a shorter one has no effect. **Run now** appears while Autoscan is on and a polling source is enabled. It checks every enabled polling source straight away, whatever its interval. If a check is already running, wait for it to finish and choose **Run now** again.

### Match paths

After rewriting, each path must fall inside a Silo library folder. If Sonarr sees `/arr/tv/Example/Season 01` and Silo sees `/media/tv/Example/Season 01`, map `/arr/tv` to `/media/tv`.

Rewrites replace the start of the path; they aren't regular expressions. Keep each mapping narrow.

## If monitoring shows a problem

| Status | What to do |
| --- | --- |
| **Watch limit reached** | [Raise the inotify watch limit](#raise-the-inotify-watch-limit) on the host. |
| **Folder unavailable** | The folder is missing or its disk isn't mounted. Reconnect it, and Silo starts monitoring again on its own. See [Files are missing](/docs/manage-libraries#files-are-missing). |
| **Unsupported filesystem** | The folder is on a network share. Add an [autoscan source](#autoscan-sources) for the library. |
| **Not reporting** | No Silo server can see the library's folders. Check that the folder paths in the library exist inside the Silo container. |
| **Error** | Read the reason on the status line. If Silo can't read the library folder, fix its permissions. |

**Starting** means Silo is still going through the library's folders after a restart or a change. It turns into **Monitoring** on its own.

If the status line says `Folders Silo can't read aren't monitored`, the rest of the library is monitored. Give Silo read access to the folders it names, and Silo picks them up on its own.

## Troubleshoot autoscan sources

Start with **Activity**. In **Polls**, expand an event to see each path it received, the path after your rewrites, and what happened to it. An unresolved path means a path rewrite or library folder is wrong. **Scans** shows what each scan found, such as new or missing files. If a polling source finds nothing, check its connection, that it is enabled, its plugin, and whether its interval has passed. If no webhook events arrive, check the sending service's destination and delivery log.

The **Debounce (seconds)** setting under **Advanced** skips repeat reports of an unchanged file that arrive within that many seconds. It never skips a changed or deleted file. Sonarr and Radarr polling sources don't report deletes; a webhook source or the daily library scan picks those up. After an event is handled, look in the library to see whether the file was scanned and matched.

## If old titles stay after a folder rename

When you rename, move, or delete a whole folder, its old entries stay in the library until the next full library scan removes them. Until then, **Admin > Libraries** shows **Partial scan** for the library. A renamed or moved folder's titles still appear at the new location right away. To clean up sooner, choose **Scan** on the library.

## Legacy external Autoscan

An existing external Autoscan service can connect through Silo's Jellyfin-compatible port. It needs an admin API key, and its own regular-expression rewrites must produce paths inside Silo's libraries. It doesn't use Silo's source settings.

If an existing external Autoscan stops working, make sure [Jellyfin compatibility](/docs/third-party-access) is on. For a new setup, use the built-in sources above.
