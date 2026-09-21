---
slug: docs/s3-storage
title: Storage, artwork, and capacity
description: Choose local or S3 artwork storage and know which data must persist.
---

Your media files remain on mounted filesystems. Artwork and generated assets have their own storage settings. An S3 bucket cannot be entered as a library folder.

## Choose artwork storage

Before the first library scan, open **Admin > Settings > Storage & Database** and review **Artwork storage**:

- **Local disk** stores artwork on the server. Persist the displayed path; the default Compose stack mounts `/var/lib/silo/artwork`.
- **S3** uses the public storage bucket. This is useful when multiple hosts need the same artwork.
- **Automatic** uses public S3 when configured, otherwise local disk.

Save and follow the restart notice. For a single host, local disk is enough to get started.

:::caution[The location locks after the first write]
After Silo stores artwork, it locks the backend and storage identity. That includes the local path or the S3 endpoint, bucket, and key prefix. Silo does not move existing files when you change storage. Do not clear the identity record in the database as a shortcut.
:::

## Buckets

**Public storage** holds client-facing assets. The word “public” describes their use, not a requirement to make the bucket readable by everyone.

**Private storage** holds server-side objects including profile avatars, diagnostics bundles, and catalog seed artifacts. Keep it separate from public assets.

If you choose S3 artwork and want custom profile-avatar uploads, configure
private S3 too. Public S3 alone does not provide storage for those uploads.

## Set up S3

You need a bucket and credentials from your S3 provider before completing these steps.

1. Open **Admin > Settings > Storage & Database**.
2. In the relevant storage group, enter the endpoint, region, bucket, access key, and secret key. Set path-style addressing as required by your provider.
3. For public storage, keep **Signed links (recommended)** unless you have deliberately configured another access method.
4. Run the connection check, save, and follow any restart notice.
5. Check an actual uploaded image or generated asset from a client on the network that will use it.

A successful server-side bucket check does not prove a remote client can reach the generated URL.

## Public vs private

Signed links let clients fetch an asset without making the entire bucket public. **Anyone with the link** requires an intentionally public read endpoint. **Cloudflare signed token** requires separate edge-side token validation; selecting it in Silo does not configure Cloudflare for you.

Keep keys out of screenshots and support reports.

## Core settings

The endpoint, region, bucket, key prefix, and path-style setting identify where objects are stored. A read endpoint can point clients at a separate public/CDN hostname. Use your provider's exact values; a browser's bucket-management URL is not its S3 API endpoint.

## When to configure it

Local artwork works without S3. Chapter thumbnail generation currently requires public asset S3 storage. Check that requirement before enabling thumbnails for a library.

Custom profile avatars use private S3 when configured. Without private S3,
they use the local artwork store only when artwork is stored locally; the
default Compose artwork mount also preserves these uploads. With S3 artwork
and no private S3, custom avatar uploads are unavailable.

## Space and persistence

Keep database, artwork, and plugin data on persistent storage. Leave room for transcode scratch and prepared downloads; their disk use can grow while people watch or download media.

Monitor the actual host and mounted volumes. A container restart is not a backup, and a mounted directory is not safe if the underlying disk is failing. Use the [backup inventory](/docs/backup-restore) before adding users.
