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
2. Leave **Video transcoding** on and set **Hardware acceleration** to **Auto**. Save and follow any restart notice. With **Video transcoding** off, Silo never re-encodes video, but it still repackages files and converts audio for devices that need it.
3. Check the line under **Hardware acceleration**. It names the detected hardware, such as **Detected VA-API on /dev/dri/renderD128**, or shows **No supported graphics hardware found**.
4. Start a video on a client, then choose a lower quality that makes Silo convert the video.
5. Open **Admin > Activity**. The session shows the encoder in use, such as **HW VAAPI**, **HW QSV**, or **SW** for software.
6. Check picture, audio, seeking, and subtitles on the client.

If Silo finds no hardware or the session shows **SW**, check the host driver, the device mount, and the Silo logs. Test HDR files separately from ordinary video.

With separate [transcode nodes](/docs/transcode-nodes), the detected hardware comes from a node and the line ends with **(transcode node)**. Check each node's **Acceleration** block in **Admin > Nodes**.

## After a driver or device change

A single server checks its hardware again when it restarts: run `docker compose restart silo`.

For a node in **Admin > Nodes**, use its re-probe button instead: the magnifier icon in the node's header, just left of the pencil. A node keeps reporting an encoder that passed its test until it re-probes or restarts, even after the hardware stops working. Re-probe a node after you:

- upgrade, downgrade, or reinstall its GPU driver
- change [which GPU devices its container can open](#give-the-container-access-to-your-gpu)
- replace FFmpeg at the same path
- see a [**Drift**](/docs/node-status#hardware-markers) marker and want to check whether it still applies

Re-probing tests the node's hardware again with real test encodes and updates its **Acceleration** block when it finishes. It doesn't restart the node or reload its configuration. On an idle node it can take a couple of minutes.

Silo refuses a re-probe while the node is using its encoder: for playback, a prepared download, or thumbnail extraction. The message reads "Node reprobe was refused or could not be confirmed". Disable the node or wait for its work to end, then try again. If the test can't finish, the node keeps its previous report, and running it again is safe.

After you fix a GPU, you don't need to re-probe: the node notices on its own within about 15 minutes. Re-probe to check it straight away. Then play something that needs conversion to test the whole path.

## Allow 4K and HEVC output

Both settings are in **Admin > Settings > Playback**. On a new server, **Allow 4K transcoding** is on and **Allow HEVC encoding** is off. Each applies to streaming and to converted [downloads](/docs/downloads#choose-a-quality).

- **Allow 4K transcoding** lets Silo convert 4K video, which is heavy work for most hardware and especially for a server without a GPU. Turn it off if 4K conversions can't keep up. While it's off, a 4K title streams only to clients that can play its video as it is, and downloads of it use **Original**. Converted downloads of other titles stop at 1080p.
- **Allow HEVC encoding** converts video to HEVC for devices that can play HEVC streams. HEVC gives a sharper picture at the same bitrate, so the smallest download quality can reach 540p instead of 480p. Other devices keep H.264. The setting only covers converted video: a device that plays an HEVC file as it is, or after Silo repackages it, plays it the same way with the setting off.

After turning on **Allow HEVC encoding**, play something that needs conversion on a device that plays HEVC, and check the session in **Admin > Activity**. **SW** means the CPU is encoding: a GPU that converts to H.264 can't always encode HEVC, and Silo then encodes HEVC on the CPU. A GPU that tone-maps HDR video keeps doing that part. If the CPU load is too much, turn the setting off. The change applies to playback that starts after you save; streams already playing keep their codec.

With [transcode nodes](/docs/transcode-nodes#convert-to-hevc-on-nodes), Silo checks each node's HEVC support separately.

## Convert HDR for SDR screens

When a device can't show HDR, Silo converts HDR video to SDR while transcoding. This is called tone mapping. Two settings under **Advanced** in **Admin > Settings > Playback** allow it, and both are on by default:

- **Enable Hardware HDR Tone Mapping** uses a GPU on the main server or a transcode node, once Silo has tested that it can tone-map.
- **Enable Software HDR Tone Mapping** uses the CPU. It works without a GPU, but it's a heavy task for the CPU.

With both on, Silo uses the GPU when it can and the CPU otherwise. With both off, Silo doesn't convert HDR video: an HDR title plays only on devices that can play it as it is, and downloads of it use **Original**.

## Limit how far ahead Silo converts

**Throttle transcoding**, under **Advanced** in **Admin > Settings > Playback**, pauses a conversion once it is far enough ahead of the client and resumes it as the client catches up. This saves CPU, GPU, and disk space when someone pauses or stops watching. It's on by default. **Buffer ahead** sets how far ahead Silo converts, 300 seconds by default and at least 60.

## Generate chapter thumbnails

Chapter menus work without thumbnails. Silo stores chapter preview images in [artwork storage](/docs/s3-storage#choose-artwork-storage), on local disk or in S3.

1. Edit the library under **Admin > Libraries**.
2. In its advanced settings, turn on **Generate chapter thumbnails** and save.
3. Let background generation run. Silo also queues a title's previews when someone opens or plays it, and checks for missing previews every six hours.
4. Open a title with chapters in the web player and check its chapter previews.

For conversion on another machine, see [Transcode nodes](/docs/transcode-nodes).

### If previews don't appear

Check that the file has chapter markers and that **Generate chapter thumbnails** is on for its library. HDR files are skipped when **HDR handling** is set to **Skip HDR and Dolby Vision**. Without a GPU that can tone-map, HDR previews also need **Software HDR tone mapping**, the chapter thumbnail setting under **Advanced** in **Admin > Settings > Playback**. It's separate from the transcoding setting above and is on by default. If artwork can't be saved, check free space and permissions for local artwork storage, or the bucket credentials and endpoint for S3.

Silo retries failed previews on its own, so a file that failed once can fill in later. To see why a file was skipped, filter **Admin > Logs** by the `chapterthumbs` component.
