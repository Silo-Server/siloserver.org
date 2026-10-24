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
- The same `SECRET_KEY` as the main server, and `DATABASE_URL` and `REDIS_URL` pointing at the shared PostgreSQL and Redis. Use the same Redis [database number](/docs/configuration#external-postgresql-and-redis) as the main server. Behind [Redis Sentinel](/docs/configuration#redis-sentinel), use the main server's Sentinel URL, and let the node reach every Sentinel and Redis server.
- Enough PostgreSQL connections for every node. Each node opens up to 20 database connections of its own, but the main server only sizes PostgreSQL's connection limit for itself. In the main server's `.env`, raise `POSTGRES_TUNE_CONNECTIONS` as described in [PostgreSQL tuning](/docs/configuration#postgresql-tuning).
- The media mounted at the same container path the main server uses, such as `/mnt/media`.
- A plugin directory (`SILO_PLUGIN_CACHE_DIR`). A transcode node also needs the artwork directory and a writable transcode directory with plenty of free space.
- For GPU encoding on a transcode node, its own driver and device access, set up as in [Set up transcoding](/docs/playback).
- A clock that stays within 30 seconds of the main server and the other nodes, for example kept in sync with NTP. A node whose clock is further off refuses requests from the main server and proxy nodes, so work sent to it fails.

The examples publish the node on port 8082 (transcode) or 8083 (proxy). The default Compose file publishes PostgreSQL and Redis only on the main host's loopback address, so a node on another machine can't reach them until you change that. Keep PostgreSQL, Redis, and node ports on a trusted network.

Local artwork on the main server isn't shared with other hosts automatically. For several hosts, consider [S3 artwork storage](/docs/s3-storage).

## Add the node

Add the node in Silo, then start it.

1. Open **Admin > Playback > Nodes** and select **Add Transcode** or **Add Proxy**.
2. Enter a **Name** that matches the node's `NODE_NAME`.
3. Enter the **URL** the main server uses to reach the node, matching its `NODE_URL`. A private address is fine.
4. For a proxy node, enter a **Public URL** if clients should use a different address, such as a public hostname in front of the node. Leave it empty to give clients the **URL**, which then must be reachable from clients.
5. If the node shares a host or local network with other nodes, give them all the same **Group**, such as `rack-1`. Silo then keeps their streams inside the group; see [Groups](/docs/node-status#groups).
6. Optionally set **Max Transcodes** or **Max Streams** (and **Max Egress Bandwidth (Mbps)** for a proxy), then select **Save**.
7. Start the node with its Compose file.

Silo checks every node every 30 seconds. The node's state changes to **Healthy** once Silo can reach it, and a transcode node's **Acceleration** block shows the verified encoder, such as **VAAPI** or **SW**. Use the refresh button to check it right away. [Read node status](/docs/node-status) explains each reading.

Then play something that needs conversion, or from a client that uses the proxy. **Admin > Activity** shows the session, and the node's **Capacity** block shows the job. Test seeking and stopping as well.

## Route playback to nodes

**Routing** on **Admin > Playback > Nodes** decides where remuxing and transcoding run and which machine sends each stream to the client. Choose a **Routing preset** and save. **Silo Defaults** prefers transcode nodes for conversion and proxy nodes for delivery, and falls back to the main server. **GPU offload** keeps direct play and remuxing on the main server and sends video transcodes to nodes. **Central egress** runs conversion on nodes but sends every stream from the main server. To set the five routes one by one, open **Advanced** under the presets. A route ending in "only" never falls back, so that kind of playback fails while no healthy node of the needed type is available.

## Convert to HEVC on nodes

With **Allow HEVC encoding** on (see [Allow 4K and HEVC output](/docs/playback#allow-4k-and-hevc-output)), Silo checks each machine's encoders separately, so HEVC support on the main server doesn't mean a node has it. HEVC is used only when a machine that may convert video under **Routing** can encode it, and HEVC jobs go only to nodes that can. When none can, devices get H.264.

A node whose GPU can't encode HEVC encodes it on the CPU, even though its **Acceleration** block shows the GPU. After an HEVC stream starts on a node, check the session in **Admin > Activity**: **SW** means that node's CPU is encoding.

## Store prepared downloads on a node

A transcode node keeps the [downloads it prepares](/docs/download-storage) in `download-artifacts` inside its transcode directory, unless you give it another directory. That puts them on the same disk as live transcodes, so they count toward the 95% at which Silo [skips the node](#if-work-does-not-reach-the-node) for new streams. To keep prepared downloads apart, mount a separate volume on the node and point it there:

1. Open **Admin > Downloads > Prepared Files**. On the node's card, select **Edit location**.
2. Enter the path inside the node's container in **Prepared file directory**.
3. Under **Storage budget**, keep **Default** to use **Default storage budget per location**, choose **Custom** and enter a size in GB, or choose **None** to rely on the disk ceiling only.
4. Select **Save**. If you changed the directory, restart the node; it uses the new directory once it restarts.

Changing the directory doesn't move files. Files that devices are still waiting for are prepared again in the new directory, and cached files are dropped. Old files stay in the old directory until you delete them.

If **Prepared file directory** is set in **Admin > Downloads > Settings**, a node with a blank directory uses that path, so it must exist on the node too. A card that reads **Shares disk with transcode scratch** still has its prepared files on the transcode disk.

## If work does not reach the node

Check that the node is enabled, **Healthy**, below its limit, and can read the file at the same path. A node can show **Healthy** and still refuse work when its clock is more than 30 seconds off, so check that its clock agrees with the main server's. For a grouped node, check that every enabled node in its [group](/docs/node-status#groups) is **Healthy**.

A transcode node whose transcode directory is 95% full is skipped while another node has room. If every transcode node is that full, Silo uses one anyway, and streams on it can fail once the disk fills. Silo never skips a node whose disk use it can't read.

To see which case you're in, filter **Admin > Logs > Server Log** by the `nodepool` component. `transcode scratch guard ignored: every eligible node is over the scratch threshold` means new sessions are going to a nearly full disk. To fix it, enlarge the node's transcode volume or clear old files from its transcode directory.

## Maintain a node

To stop or upgrade a transcode node without cutting playback, drain it first:

1. In **Admin > Playback > Nodes**, select the pause icon in the node's header. Silo sends the node no new work, and streams already on it keep playing. Its state changes to **Draining**, and the line under its address counts the work left, such as **Draining · 2 transcodes left**.
2. Wait for **Drained · safe to stop**. Streams play until they end, so this can take as long as the longest one left on the node.
3. Stop or upgrade the node. While it's stopped, it shows **Unhealthy**, and if it's in a [group](/docs/node-status#groups), Silo sends that group no new transcodes until the node is back.
4. Once the node is running again, select the play icon in its header to resume it. It stays drained after a restart until you resume it.

The [admin API](/docs/api) has the same actions: `POST /api/v2/admin/nodes/{id}/drain` and `POST /api/v2/admin/nodes/{id}/resume`.

You can also stop a transcode node directly, and it drains on its own. It takes no new work and keeps serving its streams until they end or `SILO_NODE_DRAIN_TIMEOUT` passes, then stops and ends any streams still on it. The timeout is `10m` by default. Set it on the node as a duration such as `15m` or a number of seconds, or set it to `0` to turn the drain off. A second stop signal stops the node at once. Docker kills a container 10 seconds after asking it to stop, so set the node's `stop_grace_period` to the timeout plus a minute, as in [Distributed and external services](/docs/docker#distributed-and-external-services).

Proxy nodes don't drain. Turn a proxy node's switch off to stop new work while its current streams finish.

After changing a node's driver or devices, use its re-probe button. Silo refuses it while the node is transcoding, so drain the node first and resume it once the re-probe finishes. See [Set up transcoding](/docs/playback#after-a-driver-or-device-change).

To change a transcode node's encoder, select the pencil in the node's header, set **Hardware Acceleration** or **GPU Devices**, and select **Save**. New transcodes on the node use the change within a minute, and running sessions keep their old settings.

To make a node re-read its configuration straight away, use force reload in the [admin API](/docs/api): `POST /api/v2/admin/nodes/{id}/force-reload` for one node, or `POST /api/v2/admin/nodes/force-reload` for every enabled node. There is no button for it. On a transcode node it also ends every live playback session.

Update all nodes together with the main server when the release notes say so. If you update one machine at a time, update the transcode nodes first, then the proxy nodes, then the main server. Some releases change how the main server and proxy nodes talk to other nodes, and a node that hasn't been updated yet can't answer the new requests. During the [1.0 update](/docs/updates#moving-from-alpha-to-10), don't mix alpha and 1.0 nodes.

A transcode node on an older version than the main server can't send subtitles from inside a video file along with the converted video. Silo then converts that playback on the main server or an updated node instead. Only if **Routing** leaves no such machine does an older node convert it, and the apps then download the subtitle separately, which can take minutes on network storage.
