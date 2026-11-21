---
slug: docs/mac
keywords: ["Mac mini", "MacBook", "iMac", "Docker for Mac", "media engine", "LaunchAgent"]
questions: ["Can I host my media server on a Mac mini?", "Why does Silo in Docker on my Mac convert on the CPU?", "How do I use my Mac's media engine for transcoding?", "What does mounts denied for /opt/silo mean?"]
title: Run Silo Server on a Mac
description: Run the server in Docker Desktop and convert video with the Mac's hardware through a transcode node on the same Mac.
---

Run Silo Server on a Mac in Docker Desktop, with the install guide's Compose file and a few Mac values. To convert video with the Mac's own hardware, add a transcode node that runs on the Mac outside Docker.

## Install the server

Follow [Install Silo Server](/docs/install) with these changes:

- In [step 1](/docs/install#1-install-docker-and-docker-compose), install [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/) instead of Docker Engine. It includes Docker Compose.
- In [step 3](/docs/install#3-fill-in-env), use Mac paths and your own account in `.env`:

  ```dotenv
  MEDIA_ROOT=/Volumes/Media
  SILO_DATA_ROOT=/Users/you/silo-data
  PUID=501
  PGID=20
  ```

  `MEDIA_ROOT` is your media folder; an external drive appears under `/Volumes`. Put `SILO_DATA_ROOT` in your home folder, with your account name in place of `you`. Docker Desktop can't mount the guide's `/opt/silo`: with that path, Silo doesn't start and Docker reports `mounts denied: The path /opt/silo/config is not shared from the host and is not known to Docker.` `id -u` and `id -g` print your `PUID` and `PGID`, usually 501 and 20 on a Mac.
- In [step 4](/docs/install#4-start-silo), if your media is on an external drive, macOS asks whether Terminal, or whichever app you run `docker compose` from, can access files on a removable volume. Allow it. Until you do, the container hangs while it starts.

## Convert video with the Mac's hardware

Run a transcode node directly on the Mac to convert video with VideoToolbox, which uses the Mac's video hardware. Docker on a Mac runs Linux in a virtual machine that can't use VideoToolbox, so Silo in Docker converts video on the CPU. The node runs beside the server, outside Docker, and needs a Mac with Apple Silicon.

### Install FFmpeg

Install [Homebrew](https://brew.sh) if the Mac doesn't have it, then install Homebrew's full FFmpeg build:

```sh
brew install ffmpeg-full
```

The node installer won't continue without `ffmpeg-full`. Homebrew's plain `ffmpeg` leaves out the subtitle rendering and software tone mapping that Silo uses.

### Add the node in Silo

1. Open **Admin > Playback > Nodes** and select **Add Transcode**.
2. Enter a **Name**, such as `Mac`.
3. Enter `http://host.docker.internal:8100` as the **URL**. Silo's container reaches the Mac at `host.docker.internal`, and the node listens on port 8100.
4. Set **Source access** to **Through the API servers**. The node then reads your media through the server and needs no access to your media folder.
5. Select **Save**.
6. A dialog offers a key for the new node. Select **Issue key**, copy the **Node key** with the button beside it, and select **I saved the key**. The key isn't shown again. You can ignore **Server address for the node** and **Node settings** in the same dialog: you give the installer the server address yourself.

If you closed the dialog without issuing a key, select **Issue key** under the node's address.

### Install the node

Run these commands from the folder with your Compose file while Silo is running. The first copies the node program out of the server's container, so the node always matches the server's version:

```sh
docker compose cp silo:/usr/share/silo/nodes/silo-darwin-arm64 ./silo
./silo node install --server http://localhost:8090
```

`--server` is the address the Mac reaches Silo at: port `8090` from the install guide, or the `PORT` in your `.env`. When the installer asks for `Node key from Admin > Nodes:`, paste the key. You can pass it with `--key` instead.

The installer sets up the node for your macOS account, waits until it's running, and prints the path of its log, `~/Library/Logs/Silo/node.log`. The node runs while you're logged in to the Mac and starts again each time you log in. Run the installer as yourself, without `sudo`.

If another program already uses port 8100, the installer stops. Choose a free port with `--port`, such as `--port 8101`, and change the node's **URL** to match.

If the node isn't ready within a minute, the installer puts back what was there before and prints the end of the log. Check the key, the `--server` address, and the Mac's clock.

### Check the node

In **Admin > Playback > Nodes**, the node shows **Healthy**, and its **Acceleration** block shows **VIDEOTOOLBOX**. Silo checks nodes every 30 seconds; use the refresh button in the node's header to check it now. Its **Load** block shows **No resource sample**, because nodes report their CPU and memory use only on Linux.

With **Hardware acceleration** on **Auto**, its default in **Admin > Playback > Settings**, the node finds VideoToolbox by itself. If you set that to another option for your other machines, the Mac node uses that option too, and **Acceleration** shows it. Select the pencil in the node's header, set **Hardware Acceleration** to **VideoToolbox**, and select **Save**. New conversions use VideoToolbox within a minute; select the re-probe button, just before the pencil, to update **Acceleration** now.

The default [**Routing preset**](/docs/transcode-nodes#route-playback-to-nodes), **Silo Defaults**, sends conversions to the node and uses the server only when the node can't take a stream. To test it, play a video and choose a lower quality that makes Silo convert it, then check the node's **Capacity** block for the job.

## Update the node

After you [update Silo](/docs/updates), copy the node program out again and run the installer with no options, from the folder with your Compose file:

```sh
docker compose cp silo:/usr/share/silo/nodes/silo-darwin-arm64 ./silo
./silo node install
```

The installer keeps the server address, key, and port from the first install and replaces the running node. If the node is converting video, it waits for those streams to finish first, for up to 10 minutes.

## Remove the node

Run `./silo node uninstall` to stop the node and remove it from the Mac. Its log stays. Then select the trash button in the node's header in **Admin > Playback > Nodes** and confirm with **Delete**, so the node isn't left listed as **Unhealthy**.
