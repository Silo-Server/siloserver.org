---
slug: docs/playback
title: Set up transcoding and chapter previews
description: Give Silo access to a GPU and check whether it is used during playback.
---

Transcoding converts media when a client cannot play the original file or needs a lower quality stream. Test direct playback first. You only need GPU setup when your workload benefits from conversion hardware.

## Give the container access to your GPU

These examples are for the default Linux Docker deployment. Install the host driver first. For NVIDIA, also install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

Keep any existing or customized overlay. For a new Intel/AMD overlay, run
this beside your Compose file. The checks stop the download if that name
already exists, including as a symbolic link:

```sh
test ! -e docker-compose.vaapi.yml && test ! -L docker-compose.vaapi.yml &&
  curl -fSL https://raw.githubusercontent.com/Silo-Server/silo-server/d2596927/docker-compose.vaapi.yml -o docker-compose.vaapi.yml
```

For Intel or AMD devices exposed through `/dev/dri`, an otherwise uncustomized
installation can use this setting in `.env`:

```dotenv
COMPOSE_FILE=docker-compose.yml:docker-compose.vaapi.yml
```

If you already set `COMPOSE_FILE`, append the GPU overlay to that list instead
of replacing it. Include any `docker-compose.override.yml` you use: setting
an explicit file list stops Compose from loading that override automatically.

For NVIDIA, use the same existence checks and download URL with
`docker-compose.nvidia.yml` instead, then append that filename to the list.
Use only the GPU overlay that matches the host.

During a quiet period, validate and apply the configuration:

```sh
docker compose config --quiet
docker compose up -d
```

Recreating Silo interrupts active playback.

## Choose and test acceleration

1. Open **Admin > Settings > Playback**.
2. Leave **Transcoding** on and start with **Hardware acceleration: Auto**. Save changes and follow any restart notice.
3. Start a video on a client, then choose a lower quality that requires video conversion.
4. Check the active playback session and **Admin > Nodes**. Confirm the actual encoder and node used, rather than relying only on the selected setting.
5. Check picture, audio, seeking, and subtitles on the client.

A card listed in the host does not guarantee working encoding inside Docker. If acceleration fails, check the driver, device mount, and Silo logs. Test HDR files separately from ordinary SDR video.

## After a driver or device change

Use the node's **Re-probe** action after work has drained. Re-probing checks hardware with real encodes and is refused while that node is transcoding. A successful probe updates its capability report; it does not itself test a complete client playback session.

## Generate chapter thumbnails

Chapter menus and chapter preview images are separate. Thumbnails need [public asset S3 storage](/docs/s3-storage) in the current implementation, even when artwork uses local disk.

1. Configure and test public storage.
2. Edit the library under **Admin > Libraries**.
3. Turn on **Generate chapter thumbnails** in its advanced settings and save.
4. Allow background generation to run. Check task failures if previews do not appear.
5. Open a title with chapters in the web player and check its chapter previews.

Native chapter navigation does not imply the same thumbnail UI. Keep ordinary playback working before adding thumbnail generation.

For work on another machine, continue with [Transcode nodes](/docs/transcode-nodes).
