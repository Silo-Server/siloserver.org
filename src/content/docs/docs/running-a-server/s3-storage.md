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

**Private storage** holds files that are never public: profile avatars, diagnostic bundles, and catalog seed artifacts. Without a private bucket, a local-disk install keeps these on local disk. An install that stores artwork in S3 needs a private bucket for profile avatar uploads.

Silo records the private bucket's **Endpoint**, **Bucket**, and **Folder inside the bucket** when it starts, even if nothing is stored there yet. Changing them afterwards needs a [storage transition](#change-storage-later).

## Set up S3

Silo works with any S3-compatible service, including AWS S3, Cloudflare R2, and Garage. Create a bucket, then an access key with these permissions on it:

- `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` to store, read, and remove files.
- `s3:ListBucket` to check the bucket and list its files. **Check Connection**, the [readiness check](/docs/server-health), storage transitions, and diagnostics cleanup all need it.
- `s3:PutBucketCORS` for a bucket that uses **Signed links (recommended)**. Silo sets the bucket's CORS rules when it starts so the web app can load files from it. If the key can't have this permission, add a CORS rule yourself that allows `GET` from any origin.

Then connect the bucket:

1. Open **Admin > Settings > Storage & Database**.
2. Under **Public storage** or **Private storage**, enter the **Endpoint**, **Bucket**, **Access Key**, and **Secret Key**. Use your provider's S3 API endpoint, not the address of its web console.
3. Under **Advanced**, set **Region** if your provider checks it, as Garage does. When it's blank, Silo signs requests for `us-east-1`. Turn on **Put the bucket name in the URL path** if your provider needs it. **Folder inside the bucket** is optional.
4. For public storage, keep **How asset links are authorized** at **Signed links (recommended)** unless you have set up [another option](#choose-how-clients-download-files).
5. Select **Check Connection**. It writes, reads, and deletes a test file, so a missing permission shows up here.
6. Save and follow the restart notice.
7. On a device that will use Silo, open some artwork in the app or web app, or a profile avatar for private storage. Apps load these files straight from the bucket, so **Check Connection** can pass while devices still can't reach it, for example when the **Endpoint** is an address only the server can see.

### Choose how clients download files

**How asset links are authorized**, under **Advanced** in **Public storage**, decides how clients get files from the public bucket:

- **Signed links (recommended)** lets clients fetch a file without making the bucket public. It needs no other setup.
- **Anyone with the link** needs the bucket, or a domain in front of it, to serve files without a signature. Enter that domain in **Address clients download from**, for example `https://cdn.example.com`. Anyone who has a file's address can download it.
- **Cloudflare signed token** is for an R2 bucket behind a custom domain, with a Cloudflare rule that checks each link. Silo signs the links and Cloudflare checks them. See [Cloudflare R2](#cloudflare-r2).

### Cloudflare R2

Connect an R2 bucket the same way for every link option:

1. Set **Endpoint** to `https://<account_id>.r2.cloudflarestorage.com`.
2. Enter the **Access Key** and **Secret Key** of an R2 API token with read and write access to the bucket.
3. Under **Advanced**, turn on **Put the bucket name in the URL path**.

**Signed links (recommended)** works with these settings alone. To serve files from your own domain instead, connect a custom domain under the bucket's **Settings** > **Custom Domains** in the Cloudflare dashboard, then choose one of the options below.

#### Serve files from a public custom domain

Set **How asset links are authorized** to **Anyone with the link** and **Address clients download from** to your custom domain, for example `https://cdn.example.com`. Anyone who has a file's address can download it.

#### Check links with a Cloudflare signed token

This needs a Cloudflare Pro plan or higher, for the `is_timed_hmac_valid_v0()` rule function.

1. Generate a secret, for example with `openssl rand -hex 32`.
2. In the Cloudflare dashboard, open your zone's **Security rules** page and select **Create rule** > **Custom rules**. Name the rule, for example `Silo CDN Token Auth`.
3. Select **Edit expression** and enter:

   ```
   (http.host eq "cdn.example.com" and not is_timed_hmac_valid_v0("YOUR_SECRET", http.request.uri, 10800, http.request.timestamp.sec, 8))
   ```

   Replace `cdn.example.com` with your custom domain and `YOUR_SECRET` with the secret. `10800` must equal **Link lifetime** in Silo. `8` is the length of **Token query parameter** plus 2: `?verify=` is 8 characters.
4. Set the action to **Block** and select **Deploy**.
5. In Silo, set **How asset links are authorized** to **Cloudflare signed token**, **Address clients download from** to `https://cdn.example.com`, **Token Secret** to the same secret, **Token query parameter** to `verify`, and **Link lifetime** to `10800`.
6. Save and follow the restart notice.
7. Open an image in a client. Its address should look like `https://cdn.example.com/<object key>?verify=<unix time>-<signature>`.

If images don't load, look for blocked requests in the zone's security events. Check that the secret, the parameter length, and the lifetime are the same in the rule and in Silo.

**Link lifetime** is in seconds; the default, `10800`, is three hours. Silo reuses each artwork link for a while so clients and Cloudflare keep their cached images, and every link it hands out works for at least three quarters of **Link lifetime**. A longer lifetime means links change less often, and a leaked link keeps working longer.

### Garage

Garage supports the S3 calls Silo uses but has no bucket policies or object ACLs (see its [S3 compatibility list](https://garagehq.deuxfleurs.fr/documentation/reference-manual/s3-compatibility/)). Use signed links, or Garage's [website access](https://garagehq.deuxfleurs.fr/documentation/cookbook/exposing-websites/) for a public domain.

Garage serves plain HTTP on both its S3 and website ports. For an `https://` address, put a reverse proxy in front of Garage and use the proxy's address in Silo.

#### Use signed links

1. Create the bucket: `garage bucket create <bucket-name>`
2. Create a key: `garage key create <key-name>`. Note the key ID and secret key it prints.
3. Give the key access: `garage bucket allow --read --write --key <key-name> <bucket-name>`
4. In Silo, enter Garage's S3 API address as the **Endpoint**, the bucket name, and the key ID and secret key as **Access Key** and **Secret Key**.
5. Under **Advanced**, turn on **Put the bucket name in the URL path**.
6. Set **Region** to the `s3_region` value under `[s3_api]` in `garage.toml`. Garage's example configuration uses `garage`. If they don't match, Garage rejects Silo's requests and clients can't open signed links.
7. Keep **How asset links are authorized** at **Signed links (recommended)**.

Set up a private bucket the same way.

#### Serve files from a public domain

1. Name the bucket after the public domain: `garage bucket create assets.example.com`
2. Turn on website access: `garage bucket website --allow assets.example.com`
3. Add a website listener to `garage.toml` and restart Garage:

   ```toml
   [s3_web]
   bind_addr = "[::]:3902"
   root_domain = ".web.example.com"
   ```

4. Route `assets.example.com` to port 3902 through a reverse proxy that keeps the `Host` header.
5. In Silo, set **Endpoint** to Garage's S3 API address, for example `https://garage.example.com`, and **Bucket** to `assets.example.com`. Set **Region** and the key as in [Use signed links](#use-signed-links), and turn on **Put the bucket name in the URL path**.
6. Set **How asset links are authorized** to **Anyone with the link** and **Address clients download from** to `https://assets.example.com`.
7. Open an image in a client to check the route. `https://assets.example.com/` on its own returns `404`, which is expected.

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

Going back from S3 to **Local disk** clears every S3 setting, for private storage too. Profile avatars, diagnostic bundles, and catalog files then live on local disk as well, and the policy decides which existing files are copied there.

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
