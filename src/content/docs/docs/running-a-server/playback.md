---
slug: docs/playback
title: Set up transcoding and chapter previews
description: Give Silo access to a GPU and check whether it is used during playback.
---

Transcoding converts media when a client cannot play the original file or needs a lower quality stream. Test direct playback first. You only need GPU setup when your server converts video often enough for the CPU load to matter.

## Give the container access to your GPU

These steps are for the default Linux Docker installation. Install the host driver first. For NVIDIA, also install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

For Intel or AMD devices exposed through `/dev/dri`, download the VA-API overlay beside your Compose file. The checks stop the download if a file with that name already exists, so a customized overlay is kept:

```sh
test ! -e docker-compose.vaapi.yml && test ! -L docker-compose.vaapi.yml &&
  curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/main/docker-compose.vaapi.yml -o docker-compose.vaapi.yml
```

Then add it in `.env`:

```dotenv
COMPOSE_FILE=docker-compose.yml:docker-compose.vaapi.yml
```

For NVIDIA, use the same checks and download URL with `docker-compose.nvidia.yml` instead, and list that file. Use only the overlay that matches the host.

If you already set `COMPOSE_FILE`, add the GPU overlay to that list instead of replacing it. Include any `docker-compose.override.yml` you use: with an explicit file list, Compose no longer loads that override on its own.

During a quiet period, check and apply the configuration. Recreating Silo interrupts active playback.

```sh
docker compose config --quiet
docker compose up -d
```

## Choose and test acceleration

1. Open **Admin > Settings > Playback**.
2. Leave **Transcoding** on and set **Hardware acceleration** to **Auto**. Save and follow any restart notice.
3. Check the line under **Hardware acceleration**. It names the detected hardware, such as **Detected VA-API on /dev/dri/renderD128**, or shows **No supported graphics hardware found**.
4. Start a video on a client, then choose a lower quality that makes Silo convert the video.
5. Open **Admin > Activity**. The session shows the encoder in use, such as **HW VAAPI**, **HW QSV**, or **SW** for software.
6. Check picture, audio, seeking, and subtitles on the client.

If Silo finds no hardware or the session shows **SW**, check the host driver, the device mount, and the Silo logs. Test HDR files separately from ordinary video.

With separate [transcode nodes](/docs/transcode-nodes), the detected hardware comes from a node and the line ends with **(transcode node)**. Check each node's **Acceleration** block in **Admin > Nodes**.

## After a driver or device change

A single server checks its hardware again when it restarts: run `docker compose restart silo`.

For a node in **Admin > Nodes**, use its **Re-probe** button instead. Re-probing runs real test encodes, so Silo refuses it while that node is transcoding; disable the node or wait for its sessions to end first. Then play something that needs conversion to test the whole path.

## Generate chapter thumbnails

Chapter menus work without thumbnails. Silo stores chapter preview images in [artwork storage](/docs/s3-storage#choose-artwork-storage), on local disk or in S3.

1. Edit the library under **Admin > Libraries**.
2. In its advanced settings, turn on **Generate chapter thumbnails** and save.
3. Let background generation run. Silo also starts a title's previews when someone opens or plays it, and checks for missing previews every six hours.
4. Open a title with chapters in the web player and check its chapter previews.

For conversion on another machine, see [Transcode nodes](/docs/transcode-nodes).

### If previews don't appear

Check that the file has chapter markers and that **Generate chapter thumbnails** is on for its library. HDR files are skipped when **HDR handling** is set to **Skip HDR and Dolby Vision**. If artwork can't be saved, check free space and permissions for local artwork storage, or the bucket credentials and endpoint for S3.

Silo retries failed previews on its own, so a file that failed once can fill in later. To see why a file was skipped, filter **Admin > Logs** by the `chapterthumbs` component.
