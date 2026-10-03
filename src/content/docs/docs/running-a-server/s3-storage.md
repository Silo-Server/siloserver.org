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

**Keep provider artwork**, under **Artwork** in **Admin > Settings > Library & Metadata**, is on by default. It copies posters and backdrops from metadata providers into artwork storage, on local disk or in S3. When it's off, clients load artwork straight from the providers.

Silo records the location the first time it stores a file. From then on, a change goes through a [storage transition](#change-storage-later).

## Public and private storage

**Public storage** holds files clients download directly: cached artwork, uploaded posters, and branding images. "Public" describes how the files are used; the bucket does not need to be readable by everyone.

**Private storage** holds files only the server reads: profile avatars, diagnostic bundles, and catalog seed artifacts. Without a private bucket, a local-disk install keeps these on local disk. An install that stores artwork in S3 needs a private bucket for profile avatar uploads.

Silo records the private bucket's **Endpoint**, **Bucket**, and **Folder inside the bucket** when it starts, even if nothing is stored there yet. Changing them afterwards takes a [storage transition](#change-storage-later).

## Set up S3

Silo works with any S3-compatible service, including AWS S3, Ceph RGW, MinIO, Garage, and Cloudflare R2. Create a bucket, then an access key with these permissions on it:

- `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` to store, read, and remove files.
- `s3:ListBucket` to check the bucket and list its files. **Check Connection**, the [readiness check](/docs/server-health), storage transitions, and diagnostics cleanup all need it.
- `s3:PutBucketCORS` for a bucket that uses **Signed links (recommended)**. Silo sets the bucket's CORS rules when it starts so the web app can load files from it. If the key can't have this permission, add a CORS rule yourself that allows `GET` from any origin.

Then connect the bucket:

1. Open **Admin > Settings > Storage & Database**.
2. Under **Public storage** or **Private storage**, enter the **Endpoint**, **Bucket**, **Access Key**, and **Secret Key**. Use your provider's S3 API endpoint, not the address of its web console.
3. Under **Advanced**, set **Region** if your provider checks it, as Garage does. When it's blank, Silo signs requests for `us-east-1`. Turn on **Put the bucket name in the URL path** for MinIO and other providers that need it. **Folder inside the bucket** is optional.
4. For public storage, keep **How asset links are authorized** at **Signed links (recommended)** unless you have set up [another option](#choose-how-clients-download-files).
5. Select **Check Connection**. It writes, reads, and deletes a test file, so a missing permission shows up here.
6. Save and follow the restart notice.
7. Open an image from a client on the network that will use it. The connection check runs from the server, so it can pass while clients still cannot reach the bucket.

### Choose how clients download files

**How asset links are authorized**, under **Advanced** in **Public storage**, decides how clients get files from the public bucket:

- **Signed links (recommended)** lets clients fetch a file without making the bucket public. It needs no other setup.
- **Anyone with the link** needs the bucket, or a domain in front of it, to serve files without a signature. Enter that domain in **Address clients download from**, for example `https://cdn.example.com`. Anyone who has a file's address can download it.
- **Cloudflare signed token** is for an R2 bucket behind a custom domain, with a Cloudflare rule that checks each link. Silo signs the links and Cloudflare checks them. See [Cloudflare R2](#cloudflare-r2).

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
