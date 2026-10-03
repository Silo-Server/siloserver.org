---
slug: docs/node-status
title: Read node status
description: Understand the state, acceleration, load, and capacity readings in Admin > Nodes, and the metrics each node exports.
---

Open **Admin > Nodes** to see every proxy and transcode node, listed under **Proxy Nodes** and **Transcode Nodes**. Each node shows its state and up to three blocks: [**Acceleration**](#acceleration) (transcode nodes only), [**Load**](#load), and [**Capacity**](#capacity). The page refreshes every 30 seconds while it's open. To add a node, see [Add and check transcode nodes](/docs/transcode-nodes).

A single server has no entries here. Its CPU, memory, and disk use are on the admin dashboard.

## Node state

The colored rail on the node's left edge, the dot in its header, and the label beside it show its state:

| Label | Meaning |
| --- | --- |
| **Healthy** | The last check reached the node. It can take new work. |
| **Unhealthy** | The last check failed. Silo sends no new work to the node. |
| **Disabled** | The node's switch is off. It gets no new work and drops out of its group. Current streams keep running. |

Silo checks every node every 30 seconds. Use the refresh button in the node's header to check it right away. **Checked**, in the **Capacity** block, shows how long ago the last check ran; hover over it for the exact time.

When a node stops answering, playback already running on it can't continue there. A new or restarted stream goes to a healthy node.

A disabled node is dimmed and Silo stops checking it, so its readings are from its last check.

A node's state only says whether Silo can reach it. A node whose GPU stopped working still shows **Healthy**. Check its **Acceleration** block, and see [After a driver or device change](/docs/playback#after-a-driver-or-device-change).

## Groups

Give nodes the same **Group** when they share a host or local network, such as `rack-1`. Silo then keeps each stream inside its group:

- A transcode node whose group has its own proxy nodes always streams through one of them. If none of them can take the stream, Silo skips that group's transcode nodes rather than use another group's proxy.
- A group without proxy nodes streams through any proxy in the cluster.
- If any enabled member of a group is **Unhealthy**, Silo stops sending new transcodes to that group. Disabled members don't count. When a stream doesn't go through a proxy, only the group's transcode nodes count.

Once there are two or more groups, or one group plus nodes without one, a **Groups** row appears above the sections. Select a group to show only its nodes in both sections; **All** shows every node. An amber dot on a group means one of its enabled members is unhealthy, so the group is out of service. Hover over a group to see its nodes and how its streams are routed.

## Acceleration

The badge shows the encoder the node's FFmpeg verified with a real test encode on each candidate device.

| Badge | Meaning |
| --- | --- |
| **QSV**, **VAAPI**, or **NVENC** in green | The encoder passed its test. Hover to see the device. |
| The same badges in amber | The encoder is set for this node but failed its test. Hover to see FFmpeg's reason. Transcodes still try it, because the node's **Hardware Acceleration** setting names it. |
| The same badges, plain | The encoder is in use, but the node reported no test for it. This happens when it had no device to test. |
| **SW** | No hardware encoder passed, so the node encodes in software. |
| **SW**, with "the configured GPU devices are not accessible on this node" on hover | The node couldn't open any of the configured devices, so it tested none of them. |

**Awaiting first report** means the node hasn't sent a hardware report yet. An amber warning icon beside the badge means another encoder on the node failed its test; hover to see which and why.

Below the badge, each GPU the node sees gets its own line, with a video engine meter, its percentage, and the number of sessions on it, or **idle**. A dash with no meter means nothing could measure that device. Hover over a device for its render and VRAM figures.

### Hardware markers

These can appear beside the badge:

- `stale` means nothing has confirmed the stored hardware report recently: no check has reached the node for more than 10 minutes, the node now reports different hardware and Silo hasn't fetched it yet, or the node no longer reports any hardware. An old report isn't stale by itself, because Silo fetches a new one only when the node's hardware changes. An unhealthy node is never marked `stale`. Hover for which case applies.
- **Shared GPU** means another registered node uses the same physical card, such as two containers on one GPU. Hover to see which nodes. When two transcode nodes have the same number of jobs, Silo picks the one whose card is carrying fewer jobs.
- **Drift**, in amber, means the node's hardware got worse since its last report: an encoder that passed now fails, or a GPU has disappeared. Hover for what was lost. The marker stays until that exact hardware works again; a restart, another card on the node passing, or a newly added GPU doesn't clear it. Silo doesn't use **Drift** when choosing nodes. [Re-probe](/docs/playback#after-a-driver-or-device-change) the node to check whether it still applies.

## Load

**Load** shows **CPU**, **RAM**, the fullest sampled **Disk**, and **Net** throughput, plus **Silo process RAM** where the node reports it. Hover over **CPU** for the core count and load average, and over **Disk** for every sampled mount.

- **Net** has no meter, because the node reports traffic but not link speed.
- **Disk** turns amber once its mount is 85% full.
- A mount that stops answering keeps its last good numbers. A path the node can't see shows as unavailable, not as an empty disk.

The node samples these every 5 seconds, and Silo keeps only the latest sample. Use [Prometheus](#node-metrics-in-prometheus) for history.

| Text | Meaning |
| --- | --- |
| **No resource sample** on an unhealthy node | The last check didn't reach the node, so Silo hides its old numbers. |
| **No resource sample** on a healthy node | The node sent no sample. Sampling works only on Linux, and older node builds don't send one. |
| **Stale resource sample** | The node is answering with an old sample. |

### Load inside a container

When the container's CPU or memory is capped, **Load** shows the container's figures, and the label reads **Cgroup CPU** or **Cgroup RAM**.

- **RAM** is the container's memory use against its limit.
- **CPU** is measured against the container's CPU limit. A container capped at 2 cores on a 64-core host reads 100% when it uses both, and reports 2 cores.
- A container with no limit, or with a limit as large as the whole machine, reports the host's CPU and memory.
- **Net** is the container's own traffic.

Disk figures cover the transcode directory on every node, and the library folders on the main server. If Docker runs inside an LXC container, see [Docker inside an LXC container](/docs/docker#docker-inside-an-lxc-container).

## Capacity

**Capacity** shows **Transcodes** running on a transcode node, or **Streams** relayed by a proxy node, against **Max Transcodes** or **Max Streams**. A proxy node also shows measured **Egress** against **Max Egress Bandwidth (Mbps)**.

Without a limit, the block shows the number and no meter. With one, it shows a meter that turns amber when the node reaches the limit. From then on, Silo sends new work to other nodes. For a proxy's egress, Silo also leaves out a proxy when the new stream would take it past its limit; streams already running there aren't interrupted.

## Node metrics in Prometheus

Proxy and transcode nodes serve `/metrics` on their app port, such as 8082 or 8083 in the Compose examples, without authentication. Keep those ports on a private network. The main server exports the same series only on its `SILO_METRICS_LISTEN` address; see [Logs and monitoring](/docs/logging#metrics).

- Host, with no labels: `streamapp_node_cpu_percent`, `streamapp_node_load1`, `streamapp_node_memory_used_bytes`, `streamapp_node_memory_total_bytes`, `streamapp_node_network_rx_bps`, `streamapp_node_network_tx_bps`
- Disk, labeled by `mount`: `streamapp_node_disk_used_bytes`, `streamapp_node_disk_total_bytes`, `streamapp_node_disk_stale`
- GPU, labeled by `device`: `streamapp_node_gpu_video_busy_percent`, `streamapp_node_gpu_render_busy_percent`, `streamapp_node_gpu_busy_percent`, `streamapp_node_gpu_sessions`, `streamapp_node_gpu_vram_used_bytes`, `streamapp_node_gpu_vram_total_bytes`

The CPU and memory series follow the same container rules as [Load](#load-inside-a-container).

### Disk series

The `mount` label names a role, not a path, so the metrics don't reveal where your media lives:

| `mount` | Path |
| --- | --- |
| `scratch` | The transcode directory |
| `library-1`, `library-2`, ... | Library folders, on the main server only |

Library numbers can change when you add or remove a library folder, so alert on `mount="scratch"` by name and on library mounts together. Silo samples at most 8 mounts per host, the transcode directory first.

`streamapp_node_disk_stale` is `1` when the used and total values beside it are carried over from the last good measurement, and `0` when they're current. A mount Silo has never measured exports no disk series.

### GPU series

- For Intel and AMD GPUs, the busy figures count only Silo's own FFmpeg processes, so a card shared with other software reads less busy than it is. They need only the `/dev/dri` access the VA-API overlay already gives.
- For NVIDIA GPUs, the figures come from `nvidia-smi`, which the NVIDIA Container Toolkit provides, and cover the whole card.
- `streamapp_node_gpu_busy_percent` is the whole card's use, including other software. Only NVIDIA reports it. Use it to alert on a shared GPU.
- A GPU nothing could measure exports no busy or VRAM series rather than zeros. `streamapp_node_gpu_sessions` is always exported, because it comes from Silo's own session count.

If `nvidia-smi` keeps failing, Silo stops calling it and tries again now and then. Re-probing the node makes it try again straight away.

### Example alerts

```yaml
groups:
  - name: silo-nodes
    rules:
      - alert: SiloScratchVolumeFilling
        expr: |
          streamapp_node_disk_used_bytes{mount="scratch"}
            / streamapp_node_disk_total_bytes{mount="scratch"} > 0.9
        for: 15m
        annotations:
          summary: "Transcode directory above 90% on {{ $labels.instance }}"

      - alert: SiloNodeCPUSaturated
        expr: streamapp_node_cpu_percent > 90
        for: 15m
        annotations:
          summary: "CPU above 90% on {{ $labels.instance }}. Check the node's Acceleration block for a failed encoder."

      - alert: SiloDiskMeasurementStale
        expr: streamapp_node_disk_stale == 1
        for: 15m
        annotations:
          summary: "{{ $labels.mount }} on {{ $labels.instance }} hasn't been measured recently"
```

Keep the last alert alongside the first. A volume that stopped answering at 40% and kept filling never trips the fill alert, because its numbers stay at 40%.
