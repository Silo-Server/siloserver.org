---
slug: docs/s3-storage
title: Storage, artwork, and capacity
description: Choose local or S3 artwork storage, change it later, and know which data must persist.
---

Your media files stay on mounted filesystems. Artwork and other generated files have their own storage settings. An S3 bucket cannot be used as a library folder.

## Choose artwork storage

Before the first library scan, open **Admin > Settings > Storage & Database** and set **Backend** in the **Storage** group:

- **Local disk** keeps files on the server at **Local storage path**. The default Compose stack mounts `/var/lib/silo/artwork` from your data directory.
- **S3** uses the public storage bucket. Choose it when several hosts need the same artwork.
- **Automatic** uses the public bucket when one is configured, and local disk otherwise.

Save and follow the restart notice. For a single host, local disk is enough.

Silo records the location the first time it stores a file. From then on, a change goes through a [storage transition](#change-storage-later).

## Public and private storage

**Public storage** holds files clients download directly: cached artwork, uploaded posters, and branding images. "Public" describes how the files are used; the bucket does not need to be readable by everyone.

**Private storage** holds files only the server reads: profile avatars, diagnostic bundles, and catalog seed artifacts. Without a private bucket, a local-disk install keeps these on local disk. An install that stores artwork in S3 needs a private bucket for profile avatar uploads.

## Set up S3

You need a bucket and credentials from your S3 provider.

1. Open **Admin > Settings > Storage & Database**.
2. Under **Public storage** or **Private storage**, enter the **Endpoint**, **Bucket**, **Access Key**, and **Secret Key**. Use your provider's S3 API endpoint, not the address of its web console.
3. Under **Advanced**, set **Region** only if your provider requires one. Turn on **Put the bucket name in the URL path** for MinIO and other providers that need it. **Folder inside the bucket** is optional.
4. For public storage, keep **How asset links are authorized** at **Signed links (recommended)** unless you have set up another method.
5. Select **Check Connection**, save, and follow the restart notice.
6. Open an image from a client on the network that will use it. The connection check runs from the server, so it can pass while clients still cannot reach the bucket.

Signed links let clients fetch a file without making the bucket public. **Anyone with the link** needs a publicly readable address, entered in **Address clients download from**. **Cloudflare signed token** needs token validation configured in Cloudflare; Silo only signs the links.

Chapter thumbnails need public S3 storage, even when artwork uses local disk. See [Set up transcoding and chapter previews](/docs/playback#generate-chapter-thumbnails).

## Change storage later

Use a storage transition to move from local disk to S3 (for example, before adding a second host), switch buckets or providers, move to a new local path, go back from S3 to local disk, or add or remove a private bucket. Silo checks the new location, copies what you choose, switches the settings, and restarts.

1. Make a [backup](/docs/backup-restore) first.
2. For a new local path, mount it into the container before you start.
3. Open **Admin > Settings > Storage & Database**. For a new bucket, enter its **Endpoint**, **Bucket**, and keys under **Public storage** or **Private storage**, and select **Check Connection**.
4. Start the transition. Choosing a different **Backend** opens the transition dialog right away. After editing a location instead (the **Local storage path**, or a bucket's **Endpoint**, **Bucket**, or **Folder inside the bucket**), select **Review transition** in the save bar.
5. In the **Change artwork storage** dialog, check the **Target**. The dialog is called **Change private storage** when only private storage moves.
6. Under **What should move?**, choose a policy (see below), then select **Queue transition**.
7. Wait for the transition to finish. The page shows each step, such as **Copying storage objects** and **Verifying copied objects**. Select **Cancel transition** to stop it before the switch.
8. Silo restarts itself to use the new storage. If the page shows **Manual restart required**, restart it yourself, for example with `docker compose restart silo`. After the restart, **Storage recovery** may appear while Silo updates artwork references in the background.
9. Check posters, an uploaded image, and a profile avatar in a client.

Silo never deletes the old storage. Remove it yourself once you are happy with the new location.

### What each policy copies

| Policy | Copies | Left behind |
| --- | --- | --- |
| **Preserve personal uploads (recommended)** | Branding, collection and library posters, and downloaded subtitles. Profile avatars too, when private storage moves. | Provider artwork, which goes back to its saved source URLs. When private storage moves, also diagnostic bundles and catalog files. |
| **Start fresh** | Nothing. | Everything. Provider artwork goes back to its saved source URLs, and custom images must be uploaded again. Downloaded subtitles, and avatars when private storage moves, stay in the old storage and are unavailable. |
| **Migrate everything** | All artwork, including downloaded subtitles. When private storage moves, also avatars, diagnostic bundles, and catalog files. | Nothing. This can take a long time for a large collection. |

When only private storage moves, the choices are **Preserve profile avatars**, **Start fresh**, and **Migrate all private data**. Only the last one copies diagnostic bundles and catalog files.

Library records and metadata in PostgreSQL stay as they are. Artwork from NFO or sidecar files that wasn't copied comes back after a metadata refresh.

Copying needs the current storage to be reachable. If Silo cannot reach the old S3 bucket, only **Start fresh** is available until you reconnect it.

### Private storage mismatch at startup

If Silo refuses to start with `private storage identity mismatch`, its private bucket settings no longer match the location it recorded. The error names both locations.

1. Stop every Silo server and node that uses this database, including nodes on older releases.
2. Set `s3.private_endpoint`, `s3.private_bucket`, and `s3.private_key_prefix` in `server_settings` back to the recorded location.
3. Start Silo, then use a storage transition for the move you intended.

Keep both buckets until you have checked for files written while the settings disagreed. Do not clear or replace the recorded location (`storage.operational_identity`) to get Silo started.

## Space and persistence

Keep the database, artwork, and plugin data on persistent storage. Leave room for transcodes and prepared downloads; they grow while people watch or download.

Watch free space on the host and its mounted volumes. A full disk can stop one task before the whole server fails. Before adding users, set up [backups](/docs/backup-restore).
