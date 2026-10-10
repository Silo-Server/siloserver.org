---
slug: docs/transcode-nodes
title: Add and check transcode nodes
description: Add proxy and transcode nodes on other machines and check that playback uses them.
---

A single Silo server already streams and converts video itself. Add nodes when you want part of that work on other machines. Every node runs the same Silo image in a different mode and shares the main server's PostgreSQL, Redis, and encryption key.

## Choose a node type

| Type | Does | Use it when |
| --- | --- | --- |
| Transcode | Converts video for playback and prepared downloads, and reads audio for [subtitle sync](/docs/subtitle-providers#set-up-subtitle-sync) | The main server's CPU or GPU can't keep up, or another machine has a better GPU |
| Proxy | Delivers streams and downloads to clients | You want streams to leave from somewhere other than the main server, such as a host with more bandwidth |

Transcode nodes only talk to the main server and proxy nodes, so they need no public address. Clients connect to proxy nodes directly.

## Prepare the node

The server repository's [Compose file](https://github.com/Silo-Server/silo-server/blob/main/docker-compose.yml) includes commented `silo-proxy` and `silo-transcode` examples. Use them as a starting point on the node's host. A node needs:

- `MODE=transcode` or `MODE=proxy`.
- `NODE_NAME`, the same name you give the node in Silo, and `NODE_URL`, the node's own address. Silo matches the running node to its entry by these values.
- The same `SECRET_KEY` as the main server, and `DATABASE_URL` and `REDIS_URL` pointing at the shared PostgreSQL and Redis. Use the same Redis [database number](/docs/configuration#external-postgresql-and-redis) as the main server.
- The media mounted at the same container path the main server uses, such as `/mnt/media`.
- A plugin directory (`SILO_PLUGIN_CACHE_DIR`). A transcode node also needs the artwork directory and a writable transcode directory with plenty of free space.
- For GPU encoding on a transcode node, its own driver and device access, set up as in [Set up transcoding](/docs/playback).

The examples publish the node on port 8082 (transcode) or 8083 (proxy). The default Compose file publishes PostgreSQL and Redis only on the main host's loopback address, so a node on another machine can't reach them until you change that. Keep PostgreSQL, Redis, and node ports on a trusted network.

Local artwork on the main server isn't shared with other hosts automatically. For several hosts, consider [S3 artwork storage](/docs/s3-storage).

## Add the node

Add the node in Silo, then start it.

1. Open **Admin > Nodes** and select **Add Transcode** or **Add Proxy**.
2. Enter a **Name** that matches the node's `NODE_NAME`.
3. Enter the **URL** the main server uses to reach the node, matching its `NODE_URL`. A private address is fine.
4. For a proxy node, enter a **Public URL** if clients should use a different address, such as a public hostname in front of the node. Leave it empty to give clients the **URL**, which then must be reachable from clients.
5. If the node shares a host or local network with other nodes, give them all the same **Group**, such as `rack-1`. Silo then keeps their streams inside the group; see [Groups](/docs/node-status#groups).
6. Optionally set **Max Transcodes** or **Max Streams** (and **Max Egress Bandwidth (Mbps)** for a proxy), then select **Save**.
7. Start the node with its Compose file.

Silo checks every node every 30 seconds. The node's state changes to **Healthy** once Silo can reach it, and a transcode node's **Acceleration** block shows the verified encoder, such as **VAAPI** or **SW**. Use the refresh button to check it right away. [Read node status](/docs/node-status) explains each reading.

Then play something that needs conversion, or from a client that uses the proxy. **Admin > Activity** shows the session, and the node's **Capacity** block shows the job. Test seeking and stopping as well.

## Route playback to nodes

**Node routing** in **Admin > Settings > Playback** decides where remuxing and transcoding run and which machine sends each stream to the client. **Silo Defaults** prefers transcode nodes for conversion and proxy nodes for delivery, and falls back to the main server. **GPU offload** keeps direct play and remuxing on the main server and sends video transcodes to nodes. **Central egress** runs conversion on nodes but sends every stream from the main server. A setting ending in "only" never falls back, so that kind of playback fails while no healthy node of the needed type is available.

## Convert to HEVC on nodes

With **Allow HEVC encoding** on (see [Allow 4K and HEVC output](/docs/playback#allow-4k-and-hevc-output)), Silo checks each machine's encoders separately, so HEVC support on the main server doesn't mean a node has it. HEVC is used only when a machine that may convert video under **Node routing** can encode it, and HEVC jobs go only to nodes that can. When none can, devices get H.264.

A node whose GPU can't encode HEVC encodes it on the CPU, even though its **Acceleration** block shows the GPU. After an HEVC stream starts on a node, check the session in **Admin > Activity**: **SW** means that node's CPU is encoding.

## If work does not reach the node

Check that the node is enabled, **Healthy**, below its limit, and can read the file at the same path. For a grouped node, check that every enabled node in its [group](/docs/node-status#groups) is **Healthy**.

A transcode node whose transcode directory is 95% full is skipped while another node has room. If every transcode node is that full, Silo uses one anyway, and streams on it can fail once the disk fills. Silo never skips a node whose disk use it can't read.

To see which case you're in, filter **Admin > Logs** by the `nodepool` component. `transcode scratch guard ignored: every eligible node is over the scratch threshold` means new sessions are going to a nearly full disk. To fix it, enlarge the node's transcode volume or clear old files from its transcode directory.

## Maintain a node

Turn a node's switch off to stop new work while current sessions finish. After changing its driver or devices, use its re-probe button; Silo refuses it while the node is transcoding. See [Set up transcoding](/docs/playback#after-a-driver-or-device-change).

To change a transcode node's encoder, select the pencil in the node's header, set **Hardware Acceleration** or **GPU Devices**, and select **Save**. New transcodes on the node use the change within a minute, and running sessions keep their old settings.

To make a node re-read its configuration straight away, use force reload in the [admin API](/docs/api): `POST /api/v2/admin/nodes/{id}/force-reload` for one node, or `POST /api/v2/admin/nodes/force-reload` for every enabled node. There is no button for it. On a transcode node it also ends every live playback session.

Update all nodes together with the main server when the release notes say so. During the [1.0 update](/docs/updates#moving-from-alpha-to-10), don't mix alpha and 1.0 nodes.
