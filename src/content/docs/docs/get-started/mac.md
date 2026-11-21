---
slug: docs/mac
keywords: ["Mac mini", "MacBook", "iMac", "M1", "M4", "Docker for Mac", "media engine", "LaunchAgent"]
questions: ["Can I host my media server on a Mac mini?", "Why does Silo in Docker on my Mac convert on the CPU?", "How do I use my Mac's media engine for transcoding?", "What does mounts denied for /opt/silo mean?"]
title: Run Silo Server on a Mac
description: Run the server in Docker Desktop and convert video with the Mac's hardware through a transcode node on the same Mac.
---

Run Silo Server on a Mac in Docker Desktop, with the install guide's Compose file and a few Mac values. To convert video with the Mac's own hardware, add a transcode node that runs on the Mac outside Docker.

## Install the server

Follow [Install Silo Server](/docs/install) with these changes:

- In [step 1](/docs/install#1-install-docker-and-docker-compose), install [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/) instead of Docker Engine. It includes Docker Compose.
- In [step 3](/docs/install#3-fill-in-env), generate `SECRET_KEY` and set `TZ` as the guide says, and use these Mac values for the other four lines of `.env`:

  ```dotenv
  MEDIA_ROOT=/Volumes/Media
  SILO_DATA_ROOT=/Users/you/silo-data
  PUID=501
  PGID=20
  ```

  `MEDIA_ROOT` is your media folder; an external drive appears under `/Volumes`. Put `SILO_DATA_ROOT` in your home folder, with your account name in place of `you`. Docker Desktop shares your home folder by default but not the guide's `/opt/silo`: with that path, Silo doesn't start and Docker reports `mounts denied: The path /opt/silo/config is not shared from the host and is not known to Docker.` Set `PUID` and `PGID` to what `id -u` and `id -g` print, usually 501 and 20.
- In [step 4](/docs/install#4-start-silo), if your media is on an external drive, macOS asks whether Terminal, or whichever app you run `docker compose` from, can access files on a removable volume. Allow it. Until you do, the container hangs while it starts.

## Convert video with the Mac's hardware

This needs a Mac with Apple Silicon. Run a transcode node on the Mac itself, outside Docker, to convert video with VideoToolbox, the Mac's video hardware. Docker on a Mac runs Linux in a virtual machine that can't use VideoToolbox, so Silo in Docker converts video on the CPU.

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
6. In the dialog that opens, select **Issue key**.
7. Copy the **Node key** with the button beside it. The key isn't shown again. The installer doesn't use **Server address for the node** or **Node settings** from this dialog.
8. Select **I saved the key**.

If you closed the dialog without issuing a key, select **Issue key** under the node's address.

### Install the node

While Silo is running, run these commands from the folder with your Compose file. Don't use `sudo`: the installer refuses to run as root. The first command copies the node program out of the server's container, so the node matches the server's version:

```sh
docker compose cp silo:/usr/share/silo/nodes/silo-darwin-arm64 ./silo
./silo node install --server http://localhost:8090
```

`--server` is the address the Mac reaches Silo at: port `8090` from the install guide, or the `PORT` in your `.env`. When the installer asks for the node key, paste it and press Return; the key doesn't appear as you paste it.

The installer sets up the node for your macOS account, waits until it's running, and prints the path of its log, `~/Library/Logs/Silo/node.log`. The node runs while you're logged in to the Mac and starts again each time you log in. A Mac that sleeps stops converting, so set it not to sleep, for example with **Prevent automatic sleeping when the display is off** in **System Settings > Energy**.

If Silo isn't ready yet, for example while it starts after an update, the installer stops without changing anything; run it again once Silo is up. If another program already uses port 8100, the installer also stops. Choose a free port with `--port`, such as `--port 8101`, and change the node's **URL** to match.

If the node isn't ready within a minute, the installer restores the previous node, or removes the new one on a first install, and prints the end of the log. Check the key, the `--server` address, and that the Mac's clock is within 30 seconds of the server's.

### Check the node

In **Admin > Playback > Nodes**, check that the node shows **Healthy**. Its **Acceleration** block shows **VIDEOTOOLBOX** in green once FFmpeg's hardware check passes; hold the pointer over it to see the result. Silo checks nodes every 30 seconds; use the refresh button in the node's header to check it now. Its **Load** block shows **No resource sample**, because nodes report their CPU and memory use only on Linux.

With **Hardware acceleration** in **Admin > Playback > Settings** on **Auto**, its default, the node finds VideoToolbox by itself. If you've set it to another option for your other machines, the Mac node uses that option too, and **Acceleration** shows it. To pin the Mac node to VideoToolbox, select the pencil icon in its header, set **Hardware Acceleration** to **VideoToolbox**, and select **Save**. New conversions use it within a minute. To update **Acceleration** now, select the re-probe button just before the pencil. Silo refuses a re-probe while the node is converting, so wait until it's idle.

The default [**Routing preset**](/docs/transcode-nodes#route-playback-to-nodes), **Silo Defaults**, sends conversions to the node and uses the server only when the node can't take a stream. To test it, play a video in the web app, select **Playback settings** in the player, and choose a **Quality** below the video's own resolution. While it plays, the **Transcodes** count in the node's **Capacity** block goes up.

## Update the node

After you [update Silo](/docs/updates), copy the node program out again and run the installer with no options, from the folder with your Compose file:

```sh
docker compose cp silo:/usr/share/silo/nodes/silo-darwin-arm64 ./silo
./silo node install
```

The installer keeps the server address, key, and port from the first install and replaces the running node. If the node is converting video, it waits for those streams to finish first, for up to 10 minutes.

## Remove the node

Run `./silo node uninstall` to stop the node and remove it from the Mac. Its log stays. Then select the trash button in the node's header in **Admin > Playback > Nodes** and confirm with **Delete**, so the node isn't left listed as **Unhealthy**.
